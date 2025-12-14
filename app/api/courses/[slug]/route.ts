import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') || 'uk'

  try {
    const payload = await getPayload({ config: configPromise })

    const courses = await payload.find({
      collection: 'courses',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
      locale: locale as 'en' | 'ru' | 'uk',
    })

    if (courses.docs.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const course = courses.docs[0]

    return NextResponse.json({
      id: course.id,
      title: course.title,
      slug: course.slug,
      category: course.category,
      level: course.level,
      excerpt: course.excerpt,
      description: course.description,
      featuredImage: course.featuredImage,
      duration: course.duration,
      format: course.format,
      price: course.price,
      curriculum: course.curriculum,
      instructor: course.instructor,
      testimonials: course.testimonials,
      upcomingDates: course.upcomingDates,
      faq: course.faq,
      seo: course.seo,
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}
