'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, Heart, Clock, Eye, Users, Crown, Share2,
  BookOpen, ChevronRight, ArrowLeft, Sparkles, Play,
  Hash, Tag
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { StoryCard, type StoryCardData } from '@/components/stories/StoryCard'
import { cn } from '@/lib/utils'

interface Chapter {
  id: string
  title: string
  content: string
  order: number
  duration: number
  image: string | null
}

interface StoryDetail {
  id: string
  title: string
  slug: string
  description: string | null
  coverImage: string | null
  ageMin: number
  ageMax: number
  language: string
  featured: boolean
  trending: boolean
  published: boolean
  premium: boolean
  readCount: number
  favoriteCount: number
  rating: number
  ratingCount: number
  duration: number
  createdAt: string
  author: {
    id: string
    bio: string | null
    avatar: string | null
    verified: boolean
    user: {
      name: string | null
      image: string | null
    }
  } | null
  chapters: Chapter[]
  categories: {
    category: {
      id: string
      name: string
      slug: string
      icon: string | null
      color: string | null
    }
  }[]
  tags: {
    tag: {
      id: string
      name: string
      slug: string
    }
  }[]
}

const categoryGradients: Record<string, string> = {
  adventure: 'from-amber-400 to-orange-500',
  fantasy: 'from-purple-400 to-fuchsia-500',
  bedtime: 'from-teal-400 to-cyan-500',
  educational: 'from-emerald-400 to-green-500',
  animals: 'from-rose-400 to-pink-500',
  default: 'from-violet-400 to-purple-500',
}

export default function StoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const storyId = params.id as string

  const [story, setStory] = useState<StoryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [relatedStories, setRelatedStories] = useState<StoryCardData[]>([])
  const [showShareToast, setShowShareToast] = useState(false)

  useEffect(() => {
    if (!storyId) return

    const fetchStory = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/stories/${storyId}`)
        if (!res.ok) {
          setError('Story not found')
          return
        }
        const data = await res.json()
        setStory(data.story)

        // Check reading progress
        const historyRes = await fetch(`/api/users/history?userId=demo-user`)
        if (historyRes.ok) {
          const historyData = await historyRes.json()
          const entry = historyData.history?.find(
            (h: { storyId: string; progress: number }) => h.storyId === storyId
          )
          if (entry) {
            setReadingProgress(entry.progress)
          }
        }
      } catch (err) {
        console.error('Error fetching story:', err)
        setError('Failed to load story')
      } finally {
        setLoading(false)
      }
    }

    const fetchRelated = async () => {
      try {
        const res = await fetch('/api/stories?limit=3&sort=popular')
        const data = await res.json()
        if (data.stories) {
          setRelatedStories(
            data.stories.filter((s: StoryCardData) => s.id !== storyId).slice(0, 3)
          )
        }
      } catch (err) {
        console.error('Error fetching related stories:', err)
      }
    }

    fetchStory()
    fetchRelated()
  }, [storyId])

  const handleFavoriteToggle = async () => {
    const newState = !isFavorited
    setIsFavorited(newState)
    try {
      const userId = 'demo-user'
      if (!newState) {
        await fetch('/api/users/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, storyId }),
        })
      } else {
        await fetch('/api/users/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, storyId }),
        })
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
      setIsFavorited(!newState)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: story?.title,
        text: story?.description || '',
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setShowShareToast(true)
      setTimeout(() => setShowShareToast(false), 2000)
    }
  }

  const handleStartReading = () => {
    // Save progress
    fetch('/api/users/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'demo-user',
        storyId,
        chapterId: story?.chapters[0]?.id,
        progress: 5,
      }),
    }).catch(console.error)

    router.push(`/reader/${storyId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-rose-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <Skeleton className="h-8 w-24 mb-8" />
          <div className="rounded-3xl overflow-hidden mb-8">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-rose-50/50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold mb-2">Story Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The story you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push('/stories')} className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Stories
          </Button>
        </motion.div>
      </div>
    )
  }

  const primaryCategory = story.categories?.[0]?.category
  const categorySlug = primaryCategory?.slug || 'default'
  const gradient = categoryGradients[categorySlug] || categoryGradients.default
  const icon = primaryCategory?.icon || '📖'

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="size-5 fill-amber-400 text-amber-400" />)
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <div key={i} className="relative">
            <Star className="size-5 text-amber-400" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="size-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )
      } else {
        stars.push(<Star key={i} className="size-5 text-amber-400/30" />)
      }
    }
    return stars
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-rose-50/50">
      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm"
          >
            Link copied to clipboard! ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/stories')}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Stories
          </Button>
        </motion.div>
      </div>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl shadow-2xl"
        >
          {/* Hero Background */}
          <div className={cn('relative h-64 sm:h-80 md:h-96 bg-gradient-to-br', gradient)}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl sm:text-9xl drop-shadow-xl">{icon}</span>
            </div>

            {/* Badges on hero */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {story.premium && (
                <Badge className="bg-amber-500/90 text-white border-0 backdrop-blur-sm gap-1">
                  <Crown className="size-3" />
                  Premium
                </Badge>
              )}
              {story.trending && (
                <Badge className="bg-rose-500/90 text-white border-0 backdrop-blur-sm">
                  🔥 Trending
                </Badge>
              )}
              {story.featured && !story.trending && (
                <Badge className="bg-teal-500/90 text-white border-0 backdrop-blur-sm">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {story.categories?.map((sc) => (
                    <Badge
                      key={sc.category.id}
                      className="bg-white/20 text-white border-0 backdrop-blur-sm"
                    >
                      {sc.category.icon} {sc.category.name}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
                  {story.title}
                </h1>
                {story.author && (
                  <div className="flex items-center gap-2 text-white/90">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg">
                      {story.author.avatar || story.author.user.image || '✍️'}
                    </div>
                    <span className="font-medium">{story.author.user.name}</span>
                    {story.author.verified && (
                      <Badge className="bg-teal-500/80 text-white border-0 text-[10px] px-1.5">
                        Verified
                      </Badge>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-sm"
        >
          <div className="flex items-center gap-1.5">
            {renderStars(story.rating)}
            <span className="font-bold text-amber-600 ml-1">{story.rating}</span>
            <span className="text-muted-foreground">({story.ratingCount} reviews)</span>
          </div>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Eye className="size-4" />
            {story.readCount.toLocaleString()} reads
          </div>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Heart className="size-4" />
            {story.favoriteCount} favorites
          </div>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-4" />
            {story.duration} min
          </div>
          <Separator orientation="vertical" className="h-5" />
          <Badge variant="outline" className="text-xs">
            Ages {story.ageMin}-{story.ageMax}
          </Badge>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-wrap gap-3"
        >
          <Button
            size="lg"
            onClick={handleStartReading}
            className="gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-lg shadow-purple-500/25 text-base px-8 h-12"
          >
            {readingProgress > 0 ? (
              <>
                <Play className="size-5" />
                Continue Reading
              </>
            ) : (
              <>
                <BookOpen className="size-5" />
                Start Reading
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleFavoriteToggle}
            className={cn(
              'gap-2 h-12',
              isFavorited && 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
            )}
          >
            <Heart className={cn('size-5', isFavorited && 'fill-rose-500')} />
            {isFavorited ? 'Favorited' : 'Add to Favorites'}
          </Button>
          <Button variant="outline" size="lg" onClick={handleShare} className="gap-2 h-12">
            <Share2 className="size-5" />
            Share
          </Button>
        </motion.div>

        {/* Reading Progress */}
        {readingProgress > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-1.5">
              <span>Reading Progress</span>
              <span>{Math.round(readingProgress)}%</span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </motion.div>
        )}

        {/* Content Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Sparkles className="size-5 text-purple-500" />
                About This Story
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                {story.description}
              </p>
            </motion.div>

            {/* Table of Contents */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Hash className="size-5 text-purple-500" />
                Chapters
              </h2>
              <div className="space-y-2">
                {story.chapters
                  .sort((a, b) => a.order - b.order)
                  .map((chapter, index) => (
                    <motion.div
                      key={chapter.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <button
                        onClick={handleStartReading}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50/50 transition-colors group text-left"
                      >
                        <div className="flex size-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-semibold text-sm shrink-0 group-hover:bg-purple-200 transition-colors">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm group-hover:text-purple-700 transition-colors truncate">
                            {chapter.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {chapter.duration} min read
                          </p>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground group-hover:text-purple-500 transition-colors shrink-0" />
                      </button>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-5 shadow-sm"
              >
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Tag className="size-4 text-purple-500" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((st) => (
                    <Badge key={st.tag.id} variant="secondary" className="text-xs">
                      {st.tag.name}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Story Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-5 shadow-sm"
            >
              <h3 className="font-semibold text-sm mb-3">Story Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chapters</span>
                  <span className="font-medium">{story.chapters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Duration</span>
                  <span className="font-medium">
                    {story.chapters.reduce((acc, ch) => acc + ch.duration, 0)} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium uppercase">{story.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium">
                    {new Date(story.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Author Info */}
            {story.author && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-5 shadow-sm"
              >
                <h3 className="font-semibold text-sm mb-3">About the Author</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-fuchsia-200 flex items-center justify-center text-2xl">
                    {story.author.avatar || story.author.user.image || '✍️'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {story.author.user.name}
                      {story.author.verified && (
                        <span className="ml-1 text-teal-500">✓</span>
                      )}
                    </p>
                  </div>
                </div>
                {story.author.bio && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                    {story.author.bio}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl p-8 sm:p-10 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
                {readingProgress > 0 ? 'Continue Your Adventure' : 'Begin Your Adventure'}
              </h2>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                {readingProgress > 0
                  ? `You've already read ${Math.round(readingProgress)}%. Pick up where you left off!`
                  : `Dive into "${story.title}" and discover a world of wonder and imagination.`}
              </p>
              <Button
                size="lg"
                onClick={handleStartReading}
                className="bg-white text-purple-700 hover:bg-white/90 shadow-lg text-base px-8 h-12"
              >
                {readingProgress > 0 ? (
                  <>
                    <Play className="size-5 mr-2" />
                    Continue Reading
                  </>
                ) : (
                  <>
                    <BookOpen className="size-5 mr-2" />
                    Start Reading Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Related Stories */}
        {relatedStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-12"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="size-5 text-purple-500" />
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedStories.map((rs) => (
                <StoryCard key={rs.id} story={rs} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
