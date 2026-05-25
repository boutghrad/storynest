import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Auth check placeholder - in production, verify admin role
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const [
      totalUsers,
      totalStories,
      totalReads,
      totalFavorites,
      totalAuthors,
      publishedStories,
      premiumStories,
      activeSubscriptions,
    ] = await Promise.all([
      db.user.count(),
      db.story.count(),
      db.story.aggregate({ _sum: { readCount: true } }),
      db.story.aggregate({ _sum: { favoriteCount: true } }),
      db.author.count(),
      db.story.count({ where: { published: true } }),
      db.story.count({ where: { premium: true } }),
      db.subscription.count({ where: { status: 'active', plan: { not: 'free' } } }),
    ])

    // Revenue placeholder (in production, integrate with Stripe)
    const revenue = activeSubscriptions * 9.99

    const stats = {
      totalUsers,
      totalStories,
      totalReads: totalReads._sum.readCount || 0,
      totalFavorites: totalFavorites._sum.favoriteCount || 0,
      totalAuthors,
      publishedStories,
      premiumStories,
      activeSubscriptions,
      revenue: parseFloat(revenue.toFixed(2)),
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}
