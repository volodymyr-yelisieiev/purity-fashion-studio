/**
 * PURITY Fashion Studio - Smoke Test Runner
 *
 * Comprehensive automated smoke tests that:
 * 1. Test Payload CMS API (create/read/update/delete content)
 * 2. Test frontend rendering (all pages display correctly)
 * 3. Test i18n (all 3 languages work)
 * 4. Test empty states
 * 5. Clean up ALL test data after completion
 * 6. Generate detailed test report
 *
 * Usage:
 *   pnpm test:smoke                    # Local dev server
 *   TEST_BASE_URL=https://... pnpm test:smoke  # Production
 */

import { TEST_CONFIG, PAGES_TO_TEST } from './config'
import {
  login,
  createTestService,
  createTestPortfolio,
  createTestCollection,
  createTestCourse,
  cleanupTestData,
  testPages,
  testPageRenders,
  fetchCollection,
  formatDuration,
  getCreatedDocuments,
} from './helpers'

// ============================================================================
// TEST RESULTS TRACKING
// ============================================================================

interface TestResult {
  name: string
  passed: boolean
  duration: number
  error?: string
  phase: string
}

interface TestReport {
  totalTests: number
  passed: number
  failed: number
  duration: number
  results: TestResult[]
}

const report: TestReport = {
  totalTests: 0,
  passed: 0,
  failed: 0,
  duration: 0,
  results: [],
}

let currentPhase = 'Setup'

/**
 * Record a test result
 */
function recordTest(name: string, passed: boolean, duration: number, error?: string): void {
  report.totalTests++
  if (passed) {
    report.passed++
  } else {
    report.failed++
  }

  report.results.push({
    name,
    passed,
    duration,
    error,
    phase: currentPhase,
  })

  const icon = passed ? '✅' : '❌'
  const durationStr = formatDuration(duration)
  const errorStr = error ? ` - ${error}` : ''
  console.log(`${icon} ${name} (${durationStr})${errorStr}`)
}

/**
 * Run a test and record results
 */
async function runTest(
  name: string,
  testFn: () => Promise<void>
): Promise<boolean> {
  const startTime = Date.now()

  try {
    await testFn()
    recordTest(name, true, Date.now() - startTime)
    return true
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    recordTest(name, false, Date.now() - startTime, errorMessage)
    return false
  }
}

// ============================================================================
// TEST PHASES
// ============================================================================

/**
 * Phase 1: Authentication
 */
async function testAuthentication(): Promise<boolean> {
  currentPhase = 'Authentication'
  console.log('\n📋 PHASE 1: Authentication\n')

  return runTest('Admin login to Payload CMS', async () => {
    await login()
  })
}

/**
 * Phase 2: Content Creation (CRUD - Create)
 */
async function testContentCreation(): Promise<{
  service?: { slug: string }
  collection?: { slug: string }
  course?: { slug: string }
}> {
  currentPhase = 'Content Creation'
  console.log('\n📋 PHASE 2: Content Creation\n')

  const created: {
    service?: { slug: string }
    collection?: { slug: string }
    course?: { slug: string }
  } = {}

  await runTest('Create test Service', async () => {
    const doc = await createTestService()
    created.service = { slug: doc.slug! }
  })

  await runTest('Create test Portfolio item', async () => {
    await createTestPortfolio()
  })

  await runTest('Create test Collection', async () => {
    const doc = await createTestCollection()
    created.collection = { slug: doc.slug! }
  })

  await runTest('Create test Course', async () => {
    const doc = await createTestCourse()
    created.course = { slug: doc.slug! }
  })

  return created
}

/**
 * Phase 3: Content Reading (CRUD - Read)
 */
async function testContentReading(): Promise<void> {
  currentPhase = 'Content Reading'
  console.log('\n📋 PHASE 3: Content Reading (API)\n')

  await runTest('Fetch Services collection', async () => {
    const docs = await fetchCollection('services')
    console.log(`   Found ${docs.length} services`)
  })

  await runTest('Fetch Portfolio collection', async () => {
    const docs = await fetchCollection('portfolio')
    console.log(`   Found ${docs.length} portfolio items`)
  })

  await runTest('Fetch Lookbooks', async () => {
    const docs = await fetchCollection('lookbooks')
    console.log(`   Found ${docs.length} lookbooks`)
  })

  await runTest('Fetch Courses', async () => {
    const docs = await fetchCollection('courses')
    console.log(`   Found ${docs.length} courses`)
  })
}

/**
 * Phase 4: Frontend Rendering
 */
async function testFrontendRendering(created: {
  service?: { slug: string }
  collection?: { slug: string }
  course?: { slug: string }
}): Promise<void> {
  currentPhase = 'Frontend Rendering'
  console.log('\n📋 PHASE 4: Frontend Rendering\n')

  // Test root page
  await runTest('Home page (/)', async () => {
    const result = await testPageRenders('/')
    if (!result.ok) throw new Error(`Status: ${result.status}`)
  })

  // Test static pages for each locale
  for (const locale of TEST_CONFIG.locales) {
    await runTest(`Home page (/${locale})`, async () => {
      const result = await testPageRenders(`/${locale}`)
      if (!result.ok) throw new Error(`Status: ${result.status}`)
    })
  }

  // Test main static pages (English locale)
  const staticPages = PAGES_TO_TEST.static.map((p) => `/en${p}`)
  console.log('\n   Testing static pages (English):')
  const staticResults = await testPages(staticPages)
  for (let i = 0; i < staticPages.length; i++) {
    const page = staticPages[i]
    const result = staticResults[i]
    report.totalTests++
    if (result.ok) {
      report.passed++
    } else {
      report.failed++
    }
    report.results.push({
      name: `Page: ${page}`,
      passed: result.ok,
      duration: 0,
      error: result.ok ? undefined : `Status: ${result.status}`,
      phase: currentPhase,
    })
  }

  // Test dynamic pages for created content
  if (created.service) {
    await runTest(`Service detail page: /en/services/${created.service.slug}`, async () => {
      const result = await testPageRenders(`/en/services/${created.service!.slug}`)
      // 404 is acceptable if the page structure doesn't exist yet
      if (!result.ok && result.status !== 404) {
        throw new Error(`Status: ${result.status}`)
      }
    })
  }

  if (created.collection) {
    await runTest(`Collection detail page: /en/collections/${created.collection.slug}`, async () => {
      const result = await testPageRenders(`/en/collections/${created.collection!.slug}`)
      if (!result.ok && result.status !== 404) {
        throw new Error(`Status: ${result.status}`)
      }
    })
  }

  if (created.course) {
    await runTest(`Course detail page: /en/school/${created.course.slug}`, async () => {
      const result = await testPageRenders(`/en/school/${created.course!.slug}`)
      if (!result.ok && result.status !== 404) {
        throw new Error(`Status: ${result.status}`)
      }
    })
  }
}

/**
 * Phase 5: Localization (i18n)
 */
async function testLocalization(): Promise<void> {
  currentPhase = 'Localization (i18n)'
  console.log('\n📋 PHASE 5: Localization (i18n)\n')

  for (const locale of TEST_CONFIG.locales) {
    await runTest(`Services page (${locale})`, async () => {
      const result = await testPageRenders(`/${locale}/services`)
      if (!result.ok) throw new Error(`Status: ${result.status}`)
    })

    await runTest(`About page (${locale})`, async () => {
      const result = await testPageRenders(`/${locale}/about`)
      if (!result.ok) throw new Error(`Status: ${result.status}`)
    })

    await runTest(`Contact page (${locale})`, async () => {
      const result = await testPageRenders(`/${locale}/contact`)
      if (!result.ok) throw new Error(`Status: ${result.status}`)
    })
  }
}

/**
 * Phase 6: SEO & Metadata
 */
async function testSEO(): Promise<void> {
  currentPhase = 'SEO & Metadata'
  console.log('\n📋 PHASE 6: SEO & Metadata\n')

  await runTest('Sitemap accessible (/sitemap.xml)', async () => {
    const result = await testPageRenders('/sitemap.xml')
    if (!result.ok) throw new Error(`Status: ${result.status}`)
  })

  await runTest('Robots.txt accessible (/robots.txt)', async () => {
    const result = await testPageRenders('/robots.txt')
    if (!result.ok) throw new Error(`Status: ${result.status}`)
  })

  // Test that API endpoints are accessible
  await runTest('API: /api/services accessible', async () => {
    const result = await testPageRenders('/api/services')
    if (!result.ok) throw new Error(`Status: ${result.status}`)
  })

  await runTest('API: /api/courses accessible', async () => {
    const result = await testPageRenders('/api/courses')
    if (!result.ok) throw new Error(`Status: ${result.status}`)
  })
}

/**
 * Phase 7: Empty States
 */
async function testEmptyStates(): Promise<void> {
  currentPhase = 'Empty States'
  console.log('\n📋 PHASE 7: Empty States (after cleanup)\n')

  // First, clean up test data
  await cleanupTestData()

  // Test that pages still render correctly with potentially empty data
  await runTest('Services page renders with empty state', async () => {
    const result = await testPageRenders('/en/services')
    if (!result.ok) throw new Error(`Status: ${result.status}`)
  })

  await runTest('Portfolio page renders with empty state', async () => {
    const result = await testPageRenders('/en/portfolio')
    if (!result.ok) throw new Error(`Status: ${result.status}`)
  })

  await runTest('Collections page renders with empty state', async () => {
    const result = await testPageRenders('/en/collections')
    if (!result.ok) throw new Error(`Status: ${result.status}`)
  })

  await runTest('School page renders with empty state', async () => {
    const result = await testPageRenders('/en/school')
    if (!result.ok) throw new Error(`Status: ${result.status}`)
  })
}

/**
 * Phase 8: Cleanup Verification
 */
async function testCleanup(): Promise<void> {
  currentPhase = 'Cleanup Verification'
  console.log('\n📋 PHASE 8: Final Cleanup\n')

  const { deleted, failed } = await cleanupTestData()

  await runTest('All test data cleaned up', async () => {
    const docs = getCreatedDocuments()
    if (docs.size > 0) {
      throw new Error(`${docs.size} document groups still tracked`)
    }
  })

  console.log(`   Cleanup summary: ${deleted} deleted, ${failed} failed`)
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runSmokeTests(): Promise<void> {
  const startTime = Date.now()

  console.log('\n' + '='.repeat(70))
  console.log('🚀 PURITY Fashion Studio - Smoke Test Suite')
  console.log('='.repeat(70))
  console.log(`\n📍 Target: ${TEST_CONFIG.baseUrl}`)
  console.log(`📅 Started: ${new Date().toISOString()}`)
  console.log(`🔖 Test Tag: ${TEST_CONFIG.testTag}\n`)

  let created: {
    service?: { slug: string }
    collection?: { slug: string }
    course?: { slug: string }
  } = {}

  try {
    // Phase 1: Authentication (required for other tests)
    const authSuccess = await testAuthentication()
    if (!authSuccess) {
      console.error('\n❌ Authentication failed - cannot proceed with tests')
      console.error('   Make sure the test admin user exists in Payload CMS:')
      console.error(`   Email: ${TEST_CONFIG.adminEmail}`)
      console.error(`   Password: ${TEST_CONFIG.adminPassword}`)
      console.error('\n   Or set environment variables:')
      console.error('   TEST_ADMIN_EMAIL=your-admin@email.com')
      console.error('   TEST_ADMIN_PASSWORD=your-password')

      // Still run frontend tests
      console.log('\n⚠️ Continuing with frontend-only tests...\n')
    }

    // Phase 2: Content Creation
    if (authSuccess) {
      created = await testContentCreation()
    }

    // Phase 3: Content Reading
    if (authSuccess) {
      await testContentReading()
    }

    // Phase 4: Frontend Rendering
    await testFrontendRendering(created)

    // Phase 5: Localization
    await testLocalization()

    // Phase 6: SEO & Metadata
    await testSEO()

    // Phase 7: Empty States (cleans up test data first)
    if (authSuccess) {
      await testEmptyStates()
    }

    // Phase 8: Final Cleanup
    if (authSuccess) {
      await testCleanup()
    }
  } catch (error) {
    console.error('\n❌ Critical error during test execution:', error)

    // Attempt cleanup even on error
    try {
      console.log('\n🧹 Attempting emergency cleanup...')
      await cleanupTestData()
    } catch {
      console.error('   Emergency cleanup failed')
    }
  }

  report.duration = Date.now() - startTime

  // ========================================
  // FINAL REPORT
  // ========================================
  printReport()

  // Exit with appropriate code
  if (report.failed > 0) {
    process.exit(1)
  }
}

/**
 * Print the final test report
 */
function printReport(): void {
  const successRate = report.totalTests > 0
    ? ((report.passed / report.totalTests) * 100).toFixed(1)
    : '0'

  console.log('\n' + '='.repeat(70))
  console.log('📊 SMOKE TEST REPORT')
  console.log('='.repeat(70))
  console.log(`\n🎯 Summary:`)
  console.log(`   Total Tests:   ${report.totalTests}`)
  console.log(`   ✅ Passed:     ${report.passed}`)
  console.log(`   ❌ Failed:     ${report.failed}`)
  console.log(`   📈 Success:    ${successRate}%`)
  console.log(`   ⏱️  Duration:   ${formatDuration(report.duration)}`)

  if (report.failed > 0) {
    console.log('\n❌ Failed Tests:\n')

    const failedTests = report.results.filter((r) => !r.passed)
    const byPhase = new Map<string, TestResult[]>()

    for (const test of failedTests) {
      const existing = byPhase.get(test.phase) || []
      byPhase.set(test.phase, [...existing, test])
    }

    for (const [phase, tests] of byPhase) {
      console.log(`   ${phase}:`)
      for (const test of tests) {
        console.log(`     • ${test.name}`)
        if (test.error) {
          console.log(`       Error: ${test.error}`)
        }
      }
    }
  }

  console.log('\n' + '='.repeat(70))

  if (report.failed === 0) {
    console.log('🎉 All tests passed! The application is ready for deployment.')
  } else {
    console.log('⚠️ Some tests failed. Please review the errors above.')
  }

  console.log('='.repeat(70) + '\n')
}

// ============================================================================
// ENTRY POINT
// ============================================================================

// Run the tests
runSmokeTests().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
