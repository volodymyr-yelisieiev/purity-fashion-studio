import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Services } from './payload/collections/Services'
import { Products } from './payload/collections/Products'
import { Portfolio } from './payload/collections/Portfolio'
import { Collections } from './payload/collections/Collections'
import { Orders } from './payload/collections/Orders'
import { Courses } from './payload/collections/Courses'
import { SiteSettings } from './payload/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Services, Products, Portfolio, Collections, Orders, Courses],
  globals: [SiteSettings],
  localization: {
    locales: ['en', 'ru', 'uk'],
    defaultLocale: 'uk',
    fallback: true,
  },
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'YOUR_SECRET_KEY_HERE',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: true,
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})
