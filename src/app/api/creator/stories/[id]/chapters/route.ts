import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storyId } = await params
    const body = await request.json()
    const { userId, title, content, image, duration } = body

    if (!userId || !title || !content) {
      return NextResponse.json(
        { error: 'userId, title, and content are required' },
        { status: 400 }
      )
    }

    const author = await db.author.findUnique({
      where: { userId },
    })

    if (!author) {
      return NextResponse.json(
        { error: 'Author profile not found' },
        { status: 404 }
      )
    }

    const story = await db.story.findUnique({
      where: { id: storyId },
      include: { chapters: { orderBy: { order: 'desc' }, take: 1 } },
    })

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    if (story.authorId !== author.id) {
      return NextResponse.json(
        { error: 'Unauthorized - not your story' },
        { status: 403 }
      )
    }

    const nextOrder = story.chapters.length > 0 ? story.chapters[0].order + 1 : 1

    const chapter = await db.chapter.create({
      data: {
        storyId,
        title,
        content,
        order: nextOrder,
        image: image || null,
        duration: duration || 2,
      },
    })

    return NextResponse.json({ chapter }, { status: 201 })
  } catch (error) {
    console.error('Error adding chapter:', error)
    return NextResponse.json(
      { error: 'Failed to add chapter' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storyId } = await params
    const body = await request.json()
    const { userId, chapterId, title, content, order, image, duration } = body

    if (!userId || !chapterId) {
      return NextResponse.json(
        { error: 'userId and chapterId are required' },
        { status: 400 }
      )
    }

    const author = await db.author.findUnique({
      where: { userId },
    })

    if (!author) {
      return NextResponse.json(
        { error: 'Author profile not found' },
        { status: 404 }
      )
    }

    const story = await db.story.findUnique({
      where: { id: storyId },
    })

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    if (story.authorId !== author.id) {
      return NextResponse.json(
        { error: 'Unauthorized - not your story' },
        { status: 403 }
      )
    }

    const existingChapter = await db.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!existingChapter || existingChapter.storyId !== storyId) {
      return NextResponse.json(
        { error: 'Chapter not found in this story' },
        { status: 404 }
      )
    }

    const chapter = await db.chapter.update({
      where: { id: chapterId },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(order !== undefined && { order }),
        ...(image !== undefined && { image }),
        ...(duration !== undefined && { duration }),
      },
    })

    return NextResponse.json({ chapter })
  } catch (error) {
    console.error('Error updating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to update chapter' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storyId } = await params
    const body = await request.json()
    const { userId, chapterId } = body

    if (!userId || !chapterId) {
      return NextResponse.json(
        { error: 'userId and chapterId are required' },
        { status: 400 }
      )
    }

    const author = await db.author.findUnique({
      where: { userId },
    })

    if (!author) {
      return NextResponse.json(
        { error: 'Author profile not found' },
        { status: 404 }
      )
    }

    const story = await db.story.findUnique({
      where: { id: storyId },
    })

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    if (story.authorId !== author.id) {
      return NextResponse.json(
        { error: 'Unauthorized - not your story' },
        { status: 403 }
      )
    }

    const existingChapter = await db.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!existingChapter || existingChapter.storyId !== storyId) {
      return NextResponse.json(
        { error: 'Chapter not found in this story' },
        { status: 404 }
      )
    }

    await db.chapter.delete({
      where: { id: chapterId },
    })

    return NextResponse.json({ message: 'Chapter deleted' })
  } catch (error) {
    console.error('Error deleting chapter:', error)
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    )
  }
}
