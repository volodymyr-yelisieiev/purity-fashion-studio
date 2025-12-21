/**
 * PURITY Fashion Studio - Smoke Test Configuration
 *
 * This configuration file defines all settings for the automated smoke tests.
 * Tests use Payload REST API directly - no browser automation needed.
 */

import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

export const TEST_CONFIG = {
  // Base URL for API and frontend requests
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',

  // Admin credentials for authenticated API calls
  // NOTE: Create this user in Payload admin before running tests
  adminEmail: process.env.TEST_ADMIN_EMAIL || '',
  adminPassword: process.env.TEST_ADMIN_PASSWORD || '',

  // Test data identifier for easy cleanup
  // All test data will include this tag
  testTag: `__SMOKE_TEST_${Date.now()}__`,

  // Supported locales
  locales: ['en', 'uk', 'ru'] as const,

  // Collections to test CRUD operations
  collections: ['services', 'portfolio', 'lookbooks', 'courses'] as const,

  // Request timeout in milliseconds
  timeout: 30000,
} as const

export type Locale = (typeof TEST_CONFIG.locales)[number]
export type Collection = (typeof TEST_CONFIG.collections)[number]

/**
 * API Endpoints for Payload CMS
 */
export const ENDPOINTS = {
  // Auth
  login: `${TEST_CONFIG.baseUrl}/api/users/login`,

  // Collections
  services: `${TEST_CONFIG.baseUrl}/api/services`,
  portfolio: `${TEST_CONFIG.baseUrl}/api/portfolio`,
  lookbooks: `${TEST_CONFIG.baseUrl}/api/lookbooks`,
  courses: `${TEST_CONFIG.baseUrl}/api/courses`,
  media: `${TEST_CONFIG.baseUrl}/api/media`,
} as const

/**
 * Frontend pages to test
 */
export const PAGES_TO_TEST = {
  // Core pages (no locale)
  root: ['/'],

  // Localized static pages
  static: [
    '/about',
    '/services',
    '/portfolio',
    '/collections',
    '/school',
    '/contact',
    '/booking',
  ],

  // SEO/meta files
  seo: ['/sitemap.xml', '/robots.txt'],
} as const
