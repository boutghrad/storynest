import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const history = await db.readingHistory.findMany({
      where: { userId },
      include: {
        story: {
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
            _count: {
              select: { chapters: true },
            },
          },
        },
      },
      orderBy: { lastReadAt: 'desc' },
    })

    return NextResponse.json({ history })
  } catch (error) {
    console.error('Error fetching reading history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reading history' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, storyId, chapterId, progress } = body

    if (!userId || !storyId) {
      return NextResponse.json(
        { error: 'userId and storyId are required' },
        { status: 400 }
      )
    }

    const history = await db.readingHistory.upsert({
      where: {
        userId_storyId: { userId, storyId },
      },
      update: {
        chapterId: chapterId || undefined,
        progress: progress !== undefined ? progress : undefined,
        lastReadAt: new Date(),
      },
      create: {
        userId,
        storyId,
        chapterId,
        progress: progress || 0,
        lastReadAt: new Date(),
      },
    })

    // Update user's lastReadAt and reading streak
    await db.user.update({
      where: { id: userId },
      data: {
        lastReadAt: new Date(),
        readingStreak: { increment: 1 },
      },
    })

    return NextResponse.json({ history })
  } catch (error) {
    console.error('Error updating reading progress:', error)
    return NextResponse.json(
      { error: 'Failed to update reading progress' },
      { status: 500 }
    )
  }
}
