import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  try {
    const { path, tag } = await request.json()

    if (path) {
      revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
    }

    if (tag) {
      revalidateTag(tag)
      console.log(`Revalidated tag: ${tag}`)
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}
