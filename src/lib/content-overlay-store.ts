import type { ManagedContentRecord } from './types'

interface OverlayDocument {
  version: 1
  updatedAt: string
  records: ManagedContentRecord[]
}

let memoryOverlayRecords: ManagedContentRecord[] = []

function importNodeModule<T>(specifier: string): Promise<T> {
  return new Function('specifier', 'return import(specifier)')(specifier) as Promise<T>
}

export function setMemoryOverlayRecords(records: ManagedContentRecord[]) {
  memoryOverlayRecords = records
}

export function getMemoryOverlayRecords() {
  return memoryOverlayRecords
}

export async function readContentOverlayRecords(): Promise<ManagedContentRecord[]> {
  if (typeof window !== 'undefined') {
    return memoryOverlayRecords
  }

  const { parseServerEnv } = await import('./env')
  const env = parseServerEnv(process.env)

  if (!env.contentStorePath) {
    return memoryOverlayRecords
  }

  const { readFile } = await importNodeModule<typeof import('node:fs/promises')>('node:fs/promises')

  try {
    const document = JSON.parse(await readFile(env.contentStorePath, 'utf8')) as Partial<OverlayDocument>
    memoryOverlayRecords = Array.isArray(document.records) ? document.records : []
    return memoryOverlayRecords
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      memoryOverlayRecords = []
      return []
    }

    throw error
  }
}

export async function writeContentOverlayRecords(records: ManagedContentRecord[]) {
  memoryOverlayRecords = records

  if (typeof window !== 'undefined') {
    return
  }

  const { parseServerEnv } = await import('./env')
  const env = parseServerEnv(process.env)

  if (!env.contentStorePath) {
    return
  }

  const [{ mkdir, writeFile }, path] = await Promise.all([
    importNodeModule<typeof import('node:fs/promises')>('node:fs/promises'),
    importNodeModule<typeof import('node:path')>('node:path'),
  ])
  const document: OverlayDocument = {
    version: 1,
    updatedAt: new Date().toISOString(),
    records,
  }

  await mkdir(path.dirname(env.contentStorePath), { recursive: true })
  await writeFile(env.contentStorePath, `${JSON.stringify(document, null, 2)}\n`, 'utf8')
}
