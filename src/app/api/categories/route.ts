import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: {
            stories: {
              where: {
                story: {
                  published: true,
                },
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    })

    const categoriesWithCount = categories.map((category) => ({
      ...category,
      storyCount: category._count.stories,
    }))

    return NextResponse.json({ categories: categoriesWithCount })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
