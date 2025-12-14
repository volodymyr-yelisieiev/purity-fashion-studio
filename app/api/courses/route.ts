import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Where } from 'payload'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') || 'uk'
  const category = searchParams.get('category')
  const level = searchParams.get('level')
  const limit = parseInt(searchParams.get('limit') || '10')

  try {
    const payload = await getPayload({ config: configPromise })

    const where: Where = {
      status: { equals: 'published' },
    }

    if (category) {
      where.category = { equals: category }
    }

    if (level) {
      where.level = { equals: level }
    }

    const courses = await payload.find({
      collection: 'courses',
      where,
      limit,
      locale: locale as 'en' | 'ru' | 'uk',
      sort: '-createdAt',
    })

    return NextResponse.json({
      courses: courses.docs.map((course) => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        category: course.category,
        level: course.level,
        excerpt: course.excerpt,
        featuredImage: course.featuredImage,
        duration: course.duration,
        format: course.format,
        price: course.price,
        upcomingDates: course.upcomingDates,
      })),
      totalDocs: courses.totalDocs,
      totalPages: courses.totalPages,
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
