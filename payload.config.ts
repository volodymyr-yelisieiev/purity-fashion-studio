import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import fs from 'fs'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Services } from './payload/collections/Services'
import { Products } from './payload/collections/Products'
import { Portfolio } from './payload/collections/Portfolio'
import { Collections } from './payload/collections/Collections'
import { Orders } from './payload/collections/Orders'
import { Courses } from './payload/collections/Courses'
import { SiteSettings } from './payload/globals/SiteSettings'
import { fixMigrationIdempotency, simplifyMigrationFilename } from './lib/payload-utils'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // CSRF protection - only allow requests from these origins
  csrf: [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ],
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  collections: [Users, Media, Services, Products, Portfolio, Collections, Orders, Courses],
  globals: [SiteSettings],
  localization: {
    locales: ['en', 'ru', 'uk'],
    defaultLocale: 'uk',
    fallback: true,
  },
  editor: lexicalEditor({}),
  secret: (() => {
    const secret = process.env.PAYLOAD_SECRET
    if (!secret) {
      throw new Error('PAYLOAD_SECRET environment variable is required')
    }
    if (secret.length < 32) {
      throw new Error('PAYLOAD_SECRET must be at least 32 characters long')
    }
    return secret
  })(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: (() => {
    const adapter = postgresAdapter({
      pool: {
        connectionString: process.env.DATABASE_URL || '',
      },
      push: false, // Disable push to ensure migrations are the source of truth
    })

    // @ts-expect-error - migrations is not in the type but is used by the adapter
    adapter.migrations = migrations

    const originalInit = adapter.init

    adapter.init = (args) => {
      const instance = originalInit(args)
      const originalCreateMigration = instance.createMigration

      instance.createMigration = async (migrationArgs: any) => {
        await originalCreateMigration.call(instance, migrationArgs)

        // After creation, find the latest file and fix it
        const migrationsDir = instance.migrationDir
        if (!migrationsDir) return

        const files = fs
          .readdirSync(migrationsDir)
          .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
          .map((f) => ({ name: f, mtime: fs.statSync(path.join(migrationsDir, f)).mtime }))
          .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())

        if (files.length > 0) {
          const latestFile = path.join(migrationsDir, files[0].name)
          fixMigrationIdempotency(latestFile)
          simplifyMigrationFilename(latestFile, migrationsDir)
        }
      }

      return instance
    }

    return adapter
  })(),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN!,
      clientUploads: true,
      addRandomSuffix: true,
      cacheControlMaxAge: 31536000, // 1 year
    }),
  ],
})
