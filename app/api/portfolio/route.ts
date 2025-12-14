import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page')
  const locale = searchParams.get('locale') as 'en' | 'ru' | 'uk' | undefined

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'portfolio',
    page: page ? parseInt(page) : 1,
    locale: locale || 'uk',
  })

  return NextResponse.json(result)
}
