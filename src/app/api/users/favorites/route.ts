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

    const favorites = await db.favorite.findMany({
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
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, storyId } = body

    if (!userId || !storyId) {
      return NextResponse.json(
        { error: 'userId and storyId are required' },
        { status: 400 }
      )
    }

    const existing = await db.favorite.findUnique({
      where: {
        userId_storyId: { userId, storyId },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Story already in favorites' },
        { status: 409 }
      )
    }

    const favorite = await db.favorite.create({
      data: { userId, storyId },
    })

    // Increment favorite count on story
    await db.story.update({
      where: { id: storyId },
      data: { favoriteCount: { increment: 1 } },
    })

    return NextResponse.json({ favorite }, { status: 201 })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { userId, storyId } = body

    if (!userId || !storyId) {
      return NextResponse.json(
        { error: 'userId and storyId are required' },
        { status: 400 }
      )
    }

    const existing = await db.favorite.findUnique({
      where: {
        userId_storyId: { userId, storyId },
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    await db.favorite.delete({
      where: {
        userId_storyId: { userId, storyId },
      },
    })

    // Decrement favorite count on story
    await db.story.update({
      where: { id: storyId },
      data: { favoriteCount: { decrement: 1 } },
    })

    return NextResponse.json({ message: 'Favorite removed' })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
