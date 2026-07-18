import { env } from "@/lib/env"

function vercelDeploymentURL() {
  const deploymentURL = process.env.VERCEL_URL?.trim()
  if (!deploymentURL) return undefined

  try {
    return new URL(
      deploymentURL.startsWith("http")
        ? deploymentURL
        : `https://${deploymentURL}`
    ).origin
  } catch {
    return undefined
  }
}

function previewDeploymentURL() {
  return process.env.VERCEL_ENV === "preview"
    ? vercelDeploymentURL()
    : undefined
}

export function getSiteURL() {
  return previewDeploymentURL() ?? env.NEXT_PUBLIC_SITE_URL
}

export function getPayloadURL() {
  // Payload's public origin is normally the canonical site URL. Keeping this
  // fallback outside the env schema avoids its localhost development default
  // leaking into a production admin bundle when a separate payload URL was
  // not configured.
  return (
    previewDeploymentURL() ??
    (process.env.NEXT_PUBLIC_PAYLOAD_URL?.trim() || getSiteURL())
  )
}
