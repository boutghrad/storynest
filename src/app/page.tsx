import { db } from '@/lib/db'
import LandingPageClient from '@/components/landing/LandingPage'

export default async function Home() {
  // Fetch data server-side
  const [stories, categories, testimonials] = await Promise.all([
    db.story.findMany({
      where: { published: true, featured: true },
      take: 8,
      orderBy: { readCount: 'desc' },
      include: {
        categories: { include: { category: { select: { name: true, color: true, icon: true } } } },
        author: { select: { id: true } },
      },
    }),
    db.category.findMany({
      include: {
        _count: { select: { stories: true } },
      },
      orderBy: { order: 'asc' },
    }),
    db.testimonial.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
    }),
  ])

  // Transform categories to include storyCount
  const categoriesWithCount = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    icon: cat.icon,
    color: cat.color,
    storyCount: cat._count.stories,
  }))

  return (
    <LandingPageClient
      stories={stories}
      categories={categoriesWithCount}
      testimonials={testimonials}
    />
  )
}
