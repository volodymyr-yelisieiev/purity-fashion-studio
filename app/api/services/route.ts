import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import type { Where } from 'payload'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const locale = searchParams.get('locale') as 'en' | 'ru' | 'uk' | undefined

  const payload = await getPayload({ config: configPromise })

  const where: Where | undefined = category
    ? { category: { equals: category } }
    : undefined

  const services = await payload.find({
    collection: 'services',
    locale: locale || 'uk',
    where,
  })

  return NextResponse.json(services)
}
