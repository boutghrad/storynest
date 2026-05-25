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

    const author = await db.author.findUnique({
      where: { userId },
    })

    if (!author) {
      return NextResponse.json(
        { error: 'Author profile not found' },
        { status: 404 }
      )
    }

    const stories = await db.story.findMany({
      where: { authorId: author.id },
      include: {
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
          select: { chapters: true, favorites: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ stories })
  } catch (error) {
    console.error('Error fetching author stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch author stories' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      userId,
      title,
      description,
      coverImage,
      ageMin,
      ageMax,
      language,
      featured,
      trending,
      published,
      premium,
      duration,
      categoryIds,
      tagIds,
    } = body

    if (!userId || !title) {
      return NextResponse.json(
        { error: 'userId and title are required' },
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

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const story = await db.story.create({
      data: {
        title,
        slug,
        description,
        coverImage,
        ageMin: ageMin || 3,
        ageMax: ageMax || 12,
        language: language || 'en',
        featured: featured || false,
        trending: trending || false,
        published: published || false,
        premium: premium || false,
        duration: duration || 5,
        authorId: author.id,
        categories: {
          create: (categoryIds || []).map((categoryId: string) => ({
            categoryId,
          })),
        },
        tags: {
          create: (tagIds || []).map((tagId: string) => ({
            tagId,
          })),
        },
      },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    })

    return NextResponse.json({ story }, { status: 201 })
  } catch (error) {
    console.error('Error creating story:', error)
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const {
      userId,
      storyId,
      title,
      description,
      coverImage,
      ageMin,
      ageMax,
      language,
      featured,
      trending,
      published,
      premium,
      duration,
    } = body

    if (!userId || !storyId) {
      return NextResponse.json(
        { error: 'userId and storyId are required' },
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

    const existingStory = await db.story.findUnique({
      where: { id: storyId },
    })

    if (!existingStory) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    if (existingStory.authorId !== author.id) {
      return NextResponse.json(
        { error: 'Unauthorized - not your story' },
        { status: 403 }
      )
    }

    const slug = title
      ? title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      : undefined

    const story = await db.story.update({
      where: { id: storyId },
      data: {
        ...(title && { title, slug }),
        ...(description !== undefined && { description }),
        ...(coverImage !== undefined && { coverImage }),
        ...(ageMin !== undefined && { ageMin }),
        ...(ageMax !== undefined && { ageMax }),
        ...(language && { language }),
        ...(featured !== undefined && { featured }),
        ...(trending !== undefined && { trending }),
        ...(published !== undefined && { published }),
        ...(premium !== undefined && { premium }),
        ...(duration !== undefined && { duration }),
      },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        chapters: { orderBy: { order: 'asc' } },
      },
    })

    return NextResponse.json({ story })
  } catch (error) {
    console.error('Error updating story:', error)
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    )
  }
}
