type AppMode = 'development' | 'test' | 'production'
type AppEnv = 'development' | 'staging' | 'production'
type AnalyticsMode = 'off' | 'console'
type EnvSource = Record<string, string | boolean | undefined>

export interface PublicEnv {
  mode: AppMode
  appEnv: AppEnv
  showRouterDevtools: boolean
  enableAdmin: boolean
  enablePrototypeFlows: boolean
  enableForcedMockFailures: boolean
  analyticsMode: AnalyticsMode
}

export interface ServerEnv {
  nodeEnv: AppMode
  appEnv: AppEnv
  ci: boolean
  analyticsWriteKey?: string
  contactWebhookUrl?: string
  adminUsername?: string
  adminPassword?: string
  adminToken?: string
  adminSessionSecret?: string
  contentStorePath?: string
}

function readString(source: EnvSource, key: string) {
  const value = source[key]

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  return typeof value === 'string' ? value : undefined
}

function readEnum<T extends string>(
  source: EnvSource,
  key: string,
  allowed: readonly T[],
  fallback: T,
) {
  const value = readString(source, key)

  if (!value) {
    return fallback
  }

  if (allowed.includes(value as T)) {
    return value as T
  }

  throw new Error(`${key} must be one of: ${allowed.join(', ')}`)
}

function readBoolean(source: EnvSource, key: string, fallback: boolean) {
  const value = readString(source, key)

  if (!value) {
    return fallback
  }

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  throw new Error(`${key} must be "true" or "false"`)
}

function defaultAppEnv(mode: AppMode): AppEnv {
  return mode === 'production' ? 'production' : 'development'
}

export function parsePublicEnv(source: EnvSource): PublicEnv {
  const mode = readEnum(source, 'MODE', ['development', 'test', 'production'] as const, 'development')
  const appEnv = readEnum(
    source,
    'VITE_APP_ENV',
    ['development', 'staging', 'production'] as const,
    defaultAppEnv(mode),
  )
  const isProductionSurface = mode === 'production' || appEnv === 'production'

  return {
    mode,
    appEnv,
    showRouterDevtools: isProductionSurface
      ? false
      : readBoolean(source, 'VITE_ENABLE_ROUTER_DEVTOOLS', false),
    enableAdmin: readBoolean(source, 'VITE_ENABLE_ADMIN', !isProductionSurface),
    enablePrototypeFlows: isProductionSurface
      ? false
      : readBoolean(source, 'VITE_ENABLE_PROTOTYPE_FLOWS', true),
    enableForcedMockFailures: isProductionSurface
      ? false
      : readBoolean(source, 'VITE_ENABLE_FORCE_MOCK_FAILURES', false),
    analyticsMode: isProductionSurface
      ? 'off'
      : readEnum(
          source,
          'VITE_ANALYTICS_MODE',
          ['off', 'console'] as const,
          'console',
        ),
  }
}

export function parseServerEnv(source: EnvSource): ServerEnv {
  const nodeEnv = readEnum(
    source,
    'NODE_ENV',
    ['development', 'test', 'production'] as const,
    'development',
  )

  return {
    nodeEnv,
    appEnv: readEnum(
      source,
      'APP_ENV',
      ['development', 'staging', 'production'] as const,
      defaultAppEnv(nodeEnv),
    ),
    ci: readBoolean(source, 'CI', false),
    analyticsWriteKey: readString(source, 'ANALYTICS_WRITE_KEY'),
    contactWebhookUrl: readString(source, 'CONTACT_WEBHOOK_URL'),
    adminUsername: readString(source, 'ADMIN_USERNAME'),
    adminPassword: readString(source, 'ADMIN_PASSWORD'),
    adminToken: readString(source, 'ADMIN_TOKEN'),
    adminSessionSecret: readString(source, 'ADMIN_SESSION_SECRET'),
    contentStorePath: readString(source, 'CONTENT_STORE_PATH'),
  }
}

const runtimeImportMetaEnv =
  typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined'
    ? (import.meta.env as EnvSource)
    : {}

export const publicEnv = parsePublicEnv(runtimeImportMetaEnv)
