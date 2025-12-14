import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const locale = searchParams.get('locale') as 'en' | 'ru' | 'uk' | undefined

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'collections',
    locale: locale || 'uk',
    sort: '-releaseDate',
  })

  return NextResponse.json(result)
}
