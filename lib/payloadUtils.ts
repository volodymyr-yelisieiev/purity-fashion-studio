import fs from 'fs'
import path from 'path'
import { writeMigrationIndex } from 'payload'

/**
 * Fixes a migration file to be idempotent (adds IF NOT EXISTS and DO blocks for types)
 */
export function fixMigrationIdempotency(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  // 1. Add IF NOT EXISTS to CREATE TABLE
  content = content.replace(/CREATE TABLE "(.+?)"/g, 'CREATE TABLE IF NOT EXISTS "$1"')
  
  // 2. Add IF NOT EXISTS to CREATE INDEX
  content = content.replace(/CREATE INDEX "(.+?)"/g, 'CREATE INDEX IF NOT EXISTS "$1"')
  content = content.replace(/CREATE UNIQUE INDEX "(.+?)"/g, 'CREATE UNIQUE INDEX IF NOT EXISTS "$1"')

  // 3. Add IF NOT EXISTS to ADD COLUMN
  content = content.replace(/ADD COLUMN "(.+?)"/g, 'ADD COLUMN IF NOT EXISTS "$1"')

  // 4. Wrap CREATE TYPE in DO block for idempotency
  const typeRegex = /CREATE TYPE (?:"(.+?)"\.)?"(.+?)" AS ENUM\((.+?)\);/g
  content = content.replace(typeRegex, (match, schema, name, values) => {
    const schemaName = schema || 'public'
    return `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typname = '${name}' AND n.nspname = '${schemaName}') THEN CREATE TYPE "${schemaName}"."${name}" AS ENUM(${values}); END IF; END $$;`
  })

  // 5. Wrap ALTER TABLE ADD CONSTRAINT in DO block
  const constraintRegex = /ALTER TABLE "(.+?)" ADD CONSTRAINT "(.+?)" (.+?);/g
  content = content.replace(constraintRegex, (match, table, constraint, rest) => {
    return `DO $$ BEGIN ALTER TABLE "${table}" ADD CONSTRAINT "${constraint}" ${rest}; EXCEPTION WHEN duplicate_object THEN NULL; END $$;`
  })

  fs.writeFileSync(filePath, content)
}

/**
 * Renames a migration file to remove the timestamp prefix and updates the index
 */
export function simplifyMigrationFilename(filePath: string, migrationsDir: string) {
  const fileName = path.basename(filePath)
  
  // Remove timestamp (YYYYMMDD_HHMMSS_)
  const newFileName = fileName.replace(/^\d{8}_\d{6}_/, '')
  
  if (newFileName !== fileName) {
    const newPath = path.join(migrationsDir, newFileName)
    
    // If file already exists (e.g. multiple migrations on same day with same name), add a suffix
    let finalPath = newPath
    let counter = 1
    while (fs.existsSync(finalPath)) {
      const ext = path.extname(newFileName)
      const base = path.basename(newFileName, ext)
      finalPath = path.join(migrationsDir, `${base}_${counter}${ext}`)
      counter++
    }
    
    fs.renameSync(filePath, finalPath)
    
    // Also rename the .json file if it exists
    const jsonFile = filePath.replace(/\.ts$/, '.json')
    if (fs.existsSync(jsonFile)) {
      fs.renameSync(jsonFile, finalPath.replace(/\.ts$/, '.json'))
    }

    // Update the index file
    writeMigrationIndex({
      migrationsDir,
    })
  }
}
