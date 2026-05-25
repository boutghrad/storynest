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

    const bookmarks = await db.bookmark.findMany({
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
            _count: {
              select: { chapters: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ bookmarks })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, storyId, chapterId, note } = body

    if (!userId || !storyId) {
      return NextResponse.json(
        { error: 'userId and storyId are required' },
        { status: 400 }
      )
    }

    const bookmark = await db.bookmark.create({
      data: {
        userId,
        storyId,
        chapterId: chapterId || null,
        note: note || null,
      },
    })

    return NextResponse.json({ bookmark }, { status: 201 })
  } catch (error) {
    console.error('Error adding bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to add bookmark' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { bookmarkId, userId } = body

    if (!bookmarkId || !userId) {
      return NextResponse.json(
        { error: 'bookmarkId and userId are required' },
        { status: 400 }
      )
    }

    const bookmark = await db.bookmark.findUnique({
      where: { id: bookmarkId },
    })

    if (!bookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      )
    }

    if (bookmark.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await db.bookmark.delete({
      where: { id: bookmarkId },
    })

    return NextResponse.json({ message: 'Bookmark removed' })
  } catch (error) {
    console.error('Error removing bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to remove bookmark' },
      { status: 500 }
    )
  }
}
