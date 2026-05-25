import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')

    const stories = await db.story.findMany({
      where: {
        published: true,
        trending: true,
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
      orderBy: { readCount: 'desc' },
      take: limit,
    })

    return NextResponse.json({ stories })
  } catch (error) {
    console.error('Error fetching trending stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending stories' },
      { status: 500 }
    )
  }
}
