import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

type ImageJob = {
  id: string
  owner: string
  outputPath: string
  model?: string
  size: string
  quality?: string
  output_format?: 'png' | 'webp' | 'jpeg'
  background?: 'transparent' | 'opaque' | 'auto'
  prompt: string
}

type ImageConfig = {
  jobs: ImageJob[]
}

type ManifestEntry = {
  id?: unknown
  reviewed?: unknown
  notes?: unknown
  final?: unknown
  [key: string]: unknown
}

type OpenAIImageResponse = {
  data?: Array<{
    b64_json?: string
    url?: string
  }>
}

const root = process.cwd()
const force = process.argv.includes('--force')
const configPath = resolve(root, 'config/image-prompts.json')
const manifestPath = resolve(root, 'public/images/generated/manifest.json')
const defaultModel = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2'
const validBackgrounds = new Set(['transparent', 'opaque', 'auto'])
const validOutputFormats = new Set(['png', 'webp', 'jpeg'])
const minImagePixels = 655_360
const maxImagePixels = 8_294_400
const maxImageEdge = 3_840
const maxImageAspectRatio = 3

function promptHash(prompt: string) {
  return createHash('sha256').update(prompt).digest('hex').slice(0, 16)
}

function resolveModel(model?: string) {
  if (!model || model === '${OPENAI_IMAGE_MODEL}') {
    return defaultModel
  }

  return model
}

function validateImageSize(job: ImageJob) {
  if (job.size === 'auto') {
    return
  }

  const match = /^(\d+)x(\d+)$/.exec(job.size)
  if (!match) {
    throw new Error(`Image job "${job.id}" size must be "auto" or WIDTHxHEIGHT, got "${job.size}"`)
  }

  const width = Number(match[1])
  const height = Number(match[2])
  const longEdge = Math.max(width, height)
  const shortEdge = Math.min(width, height)
  const totalPixels = width * height

  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || shortEdge <= 0) {
    throw new Error(`Image job "${job.id}" size must use positive integer dimensions`)
  }

  if (width % 16 !== 0 || height % 16 !== 0) {
    throw new Error(`Image job "${job.id}" size dimensions must both be multiples of 16`)
  }

  if (longEdge > maxImageEdge) {
    throw new Error(`Image job "${job.id}" size cannot exceed ${maxImageEdge}px on either edge`)
  }

  if (longEdge / shortEdge > maxImageAspectRatio) {
    throw new Error(`Image job "${job.id}" size aspect ratio cannot exceed ${maxImageAspectRatio}:1`)
  }

  if (totalPixels < minImagePixels || totalPixels > maxImagePixels) {
    throw new Error(
      `Image job "${job.id}" size must contain ${minImagePixels}..${maxImagePixels} total pixels`,
    )
  }
}

function validateJob(job: ImageJob) {
  if (typeof job.id !== 'string' || !job.id.trim()) {
    throw new Error('Image job id is required')
  }

  if (typeof job.owner !== 'string' || !job.owner.trim()) {
    throw new Error(`Image job "${job.id}" owner is required`)
  }

  if (typeof job.outputPath !== 'string' || !job.outputPath.trim()) {
    throw new Error(`Image job "${job.id}" outputPath is required`)
  }

  if (typeof job.prompt !== 'string' || !job.prompt.trim()) {
    throw new Error(`Image job "${job.id}" prompt is required`)
  }

  if (typeof job.size !== 'string' || !job.size.trim()) {
    throw new Error(`Image job "${job.id}" size is required`)
  }

  if (job.background && !validBackgrounds.has(job.background)) {
    throw new Error(`Image job "${job.id}" background must be transparent, opaque, or auto`)
  }

  if (job.output_format && !validOutputFormats.has(job.output_format)) {
    throw new Error(`Image job "${job.id}" output_format must be png, webp, or jpeg`)
  }

  const resolvedModel = resolveModel(job.model)
  const background = job.background ?? 'auto'

  if (resolvedModel === 'gpt-image-2' && background === 'transparent') {
    throw new Error(`Image job "${job.id}" cannot use background "transparent" with gpt-image-2`)
  }

  validateImageSize(job)
}

function validateConfig(config: ImageConfig) {
  if (!Array.isArray(config.jobs)) {
    throw new Error('Image config must include a jobs array')
  }

  for (const job of config.jobs) {
    validateJob(job)
  }
}

async function readConfig() {
  const raw = await readFile(configPath, 'utf8')
  return JSON.parse(raw) as ImageConfig
}

async function readManifest() {
  if (!existsSync(manifestPath)) {
    return []
  }

  const raw = await readFile(manifestPath, 'utf8')
  return JSON.parse(raw) as ManifestEntry[]
}

function manifestReviewFields(existingEntry?: ManifestEntry) {
  return {
    reviewed: typeof existingEntry?.reviewed === 'boolean' ? existingEntry.reviewed : false,
    notes: typeof existingEntry?.notes === 'string' ? existingEntry.notes : '',
    final: typeof existingEntry?.final === 'boolean' ? existingEntry.final : false,
  }
}

async function generate(job: ImageJob) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required')
  }

  const outputPath = resolve(root, job.outputPath)
  if (existsSync(outputPath) && !force) {
    return {
      skipped: true,
      outputPath: job.outputPath,
    }
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: resolveModel(job.model),
      prompt: job.prompt,
      size: job.size,
      quality: job.quality ?? 'high',
      output_format: job.output_format ?? 'webp',
      background: job.background ?? 'auto',
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`OpenAI image generation failed for ${job.id}: ${response.status} ${text}`)
  }

  const payload = (await response.json()) as OpenAIImageResponse
  const encoded = payload.data?.[0]?.b64_json
  if (!encoded) {
    throw new Error(`OpenAI image generation returned no b64_json for ${job.id}`)
  }

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, Buffer.from(encoded, 'base64'))

  return {
    skipped: false,
    outputPath: job.outputPath,
  }
}

async function main() {
  const config = await readConfig()
  validateConfig(config)

  const previousManifest = await readManifest()
  const createdAt = new Date().toISOString()
  const manifestEntries = [...previousManifest]

  for (const job of config.jobs) {
    const result = await generate(job)
    const existingIndex = manifestEntries.findIndex((item) => {
      if (typeof item !== 'object' || item === null || !('id' in item)) {
        return false
      }

      return (item as { id?: unknown }).id === job.id
    })
    const existingEntry = existingIndex >= 0 ? manifestEntries[existingIndex] : undefined
    const entry = {
      ...(existingEntry ?? {}),
      id: job.id,
      owner: job.owner,
      outputPath: job.outputPath,
      model: resolveModel(job.model),
      size: job.size,
      quality: job.quality ?? 'high',
      output_format: job.output_format ?? 'webp',
      background: job.background ?? 'auto',
      promptHash: promptHash(job.prompt),
      createdAt,
      skipped: result.skipped,
      ...manifestReviewFields(existingEntry),
    }

    if (existingIndex >= 0) {
      manifestEntries[existingIndex] = entry
    } else {
      manifestEntries.push(entry)
    }

    console.log(`${result.skipped ? 'skipped' : 'generated'} ${job.id} -> ${job.outputPath}`)
  }

  await mkdir(dirname(manifestPath), { recursive: true })
  await writeFile(manifestPath, `${JSON.stringify(manifestEntries, null, 2)}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
