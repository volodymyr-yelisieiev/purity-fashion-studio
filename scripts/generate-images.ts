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
const defaultModel = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1.5'

function promptHash(prompt: string) {
  return createHash('sha256').update(prompt).digest('hex').slice(0, 16)
}

function resolveModel(model?: string) {
  if (!model || model === '${OPENAI_IMAGE_MODEL}') {
    return defaultModel
  }

  return model
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
  return JSON.parse(raw) as unknown[]
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
  const previousManifest = await readManifest()
  const createdAt = new Date().toISOString()
  const manifestEntries = [...previousManifest]

  for (const job of config.jobs) {
    const result = await generate(job)
    const entry = {
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
    }

    const existingIndex = manifestEntries.findIndex((item) => {
      if (typeof item !== 'object' || item === null || !('id' in item)) {
        return false
      }

      return (item as { id?: unknown }).id === job.id
    })

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
