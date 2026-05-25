import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const tag = searchParams.get('tag') || ''
    const sort = searchParams.get('sort') || 'newest'

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {
      published: true,
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      }
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      }
    }

    let orderBy: Record<string, unknown> = { createdAt: 'desc' }
    switch (sort) {
      case 'trending':
        where.trending = true
        orderBy = { readCount: 'desc' }
        break
      case 'featured':
        where.featured = true
        orderBy = { favoriteCount: 'desc' }
        break
      case 'popular':
        orderBy = { favoriteCount: 'desc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    const [stories, total] = await Promise.all([
      db.story.findMany({
        where,
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
        orderBy,
        skip,
        take: limit,
      }),
      db.story.count({ where }),
    ])

    return NextResponse.json({
      stories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}
