import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')

    const stories = await db.story.findMany({
      where: {
        published: true,
        featured: true,
      },
      include: {
        author: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: { chapters: true },
        },
      },
      orderBy: { favoriteCount: 'desc' },
      take: limit,
    })

    return NextResponse.json({ stories })
  } catch (error) {
    console.error('Error fetching featured stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured stories' },
      { status: 500 }
    )
  }
}
