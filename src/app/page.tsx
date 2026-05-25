import { db } from '@/lib/db'
import LandingPageClient from '@/components/landing/LandingPage'

// Force dynamic rendering — don't try to prerender at build time
// (SQLite database isn't available during Vercel build)
export const dynamic = 'force-dynamic'

// Fallback data for when database is not available
const fallbackStories = [
  {
    id: '1', title: 'The Enchanted Forest', slug: 'enchanted-forest',
    description: 'A magical journey through a forest where trees whisper secrets and fireflies light the path.',
    coverImage: null, ageMin: 4, ageMax: 8, readCount: 12500, favoriteCount: 890,
    rating: 4.8, ratingCount: 234, duration: 10, premium: false,
    categories: [{ category: { name: 'Fantasy', color: '#8b5cf6', icon: null } }],
    author: null,
  },
  {
    id: '2', title: 'Captain Coral\'s Ocean Quest', slug: 'captain-coral',
    description: 'Join Captain Coral and her crew of friendly sea creatures on an underwater adventure.',
    coverImage: null, ageMin: 5, ageMax: 10, readCount: 9800, favoriteCount: 650,
    rating: 4.7, ratingCount: 189, duration: 12, premium: false,
    categories: [{ category: { name: 'Adventure', color: '#06b6d4', icon: null } }],
    author: null,
  },
  {
    id: '3', title: 'The Sleepy Dragon', slug: 'sleepy-dragon',
    description: 'A gentle bedtime story about a dragon who just wants to nap, but the kingdom needs his help.',
    coverImage: null, ageMin: 3, ageMax: 7, readCount: 15200, favoriteCount: 1100,
    rating: 4.9, ratingCount: 312, duration: 8, premium: false,
    categories: [{ category: { name: 'Bedtime', color: '#f59e0b', icon: null } }],
    author: null,
  },
  {
    id: '4', title: 'Luna\'s Starlight Garden', slug: 'lunas-starlight-garden',
    description: 'Luna discovers a magical garden that only appears under the starlight.',
    coverImage: null, ageMin: 4, ageMax: 9, readCount: 8700, favoriteCount: 580,
    rating: 4.6, ratingCount: 167, duration: 11, premium: true,
    categories: [{ category: { name: 'Fantasy', color: '#8b5cf6', icon: null } }],
    author: null,
  },
]

const fallbackCategories = [
  { id: '1', name: 'Fantasy', slug: 'fantasy', description: 'Magical worlds and enchanted adventures', icon: null, color: '#8b5cf6', storyCount: 45 },
  { id: '2', name: 'Adventure', slug: 'adventure', description: 'Thrilling quests and brave heroes', icon: null, color: '#06b6d4', storyCount: 38 },
  { id: '3', name: 'Bedtime', slug: 'bedtime', description: 'Gentle stories for sweet dreams', icon: null, color: '#f59e0b', storyCount: 52 },
  { id: '4', name: 'Animals', slug: 'animals', description: 'Cute creatures and their habitats', icon: null, color: '#10b981', storyCount: 41 },
  { id: '5', name: 'Science', slug: 'science', description: 'Discover the wonders of the world', icon: null, color: '#ec4899', storyCount: 29 },
]

const fallbackTestimonials = [
  { id: '1', name: 'Sarah M.', role: 'Parent of 2', content: 'My kids absolutely love StoryNest! The bedtime stories have become our favorite family ritual.', avatar: null, rating: 5 },
  { id: '2', name: 'David K.', role: 'Father of 3', content: 'The interactive elements keep my children engaged and excited about reading every single night.', avatar: null, rating: 5 },
  { id: '3', name: 'Emma L.', role: 'Mom & Teacher', content: 'As a teacher, I recommend StoryNest to all my students\' parents. It\'s educational and enchanting!', avatar: null, rating: 5 },
]

export default async function Home() {
  let stories = fallbackStories
  let categories = fallbackCategories
  let testimonials = fallbackTestimonials

  try {
    const [dbStories, dbCategories, dbTestimonials] = await Promise.all([
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

    // Only use database data if we got results
    if (dbStories.length > 0) stories = dbStories
    if (dbCategories.length > 0) {
      categories = dbCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        storyCount: cat._count.stories,
      }))
    }
    if (dbTestimonials.length > 0) testimonials = dbTestimonials
  } catch (error) {
    // Database not available (e.g., during Vercel build or first deploy)
    // Use fallback data — this is expected and fine
    console.log('Database not available, using fallback data for landing page')
  }

  return (
    <LandingPageClient
      stories={stories}
      categories={categories}
      testimonials={testimonials}
    />
  )
}
