'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Star, Clock, Eye, Crown, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const categoryGradients: Record<string, string> = {
  adventure: 'from-amber-400 to-orange-500',
  fantasy: 'from-purple-400 to-fuchsia-500',
  bedtime: 'from-teal-400 to-cyan-500',
  educational: 'from-emerald-400 to-green-500',
  animals: 'from-rose-400 to-pink-500',
  default: 'from-violet-400 to-purple-500',
}

const categoryIcons: Record<string, string> = {
  adventure: '🗺️',
  fantasy: '🧙',
  bedtime: '🌙',
  educational: '📚',
  animals: '🐾',
  default: '📖',
}

export interface StoryCardData {
  id: string
  title: string
  slug: string
  description: string | null
  coverImage: string | null
  ageMin: number
  ageMax: number
  premium: boolean
  readCount: number
  favoriteCount: number
  rating: number
  ratingCount: number
  duration: number
  featured: boolean
  trending: boolean
  categories: {
    category: {
      id: string
      name: string
      slug: string
      color: string | null
      icon: string | null
    }
  }[]
  _count?: {
    chapters: number
  }
  author?: {
    user: {
      name: string | null
      image: string | null
    }
  } | null
}

interface StoryCardProps {
  story: StoryCardData
  isFavorited?: boolean
  onFavoriteToggle?: (storyId: string) => void
  className?: string
}

export function StoryCard({ story, isFavorited = false, onFavoriteToggle, className }: StoryCardProps) {
  const [favorited, setFavorited] = useState(isFavorited)
  const [imgError, setImgError] = useState(false)

  const primaryCategory = story.categories?.[0]?.category
  const categorySlug = primaryCategory?.slug || 'default'
  const gradient = categoryGradients[categorySlug] || categoryGradients.default
  const icon = primaryCategory?.icon || categoryIcons[categorySlug] || categoryIcons.default

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorited(!favorited)
    onFavoriteToggle?.(story.id)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
        )
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <div key={i} className="relative">
            <Star className="size-3 text-amber-400" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="size-3 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )
      } else {
        stars.push(
          <Star key={i} className="size-3 text-amber-400/30" />
        )
      }
    }
    return stars
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn('group relative', className)}
    >
      <Link href={`/story/${story.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:border-white/40">
          {/* Cover Image */}
          <div className={cn('relative h-48 overflow-hidden bg-gradient-to-br', gradient)}>
            {!imgError && story.coverImage ? (
              <img
                src={story.coverImage}
                alt={story.title}
                className="h-full w-full object-cover opacity-40 mix-blend-overlay"
                onError={() => setImgError(true)}
              />
            ) : null}
            {/* Overlay pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl drop-shadow-lg">{icon}</span>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {story.premium && (
                <Badge className="bg-amber-500/90 text-white border-0 backdrop-blur-sm gap-1 text-[10px]">
                  <Crown className="size-3" />
                  Premium
                </Badge>
              )}
              {story.trending && (
                <Badge className="bg-rose-500/90 text-white border-0 backdrop-blur-sm text-[10px]">
                  🔥 Trending
                </Badge>
              )}
              {story.featured && !story.trending && (
                <Badge className="bg-teal-500/90 text-white border-0 backdrop-blur-sm text-[10px]">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            {/* Favorite button */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleFavorite}
              className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/40"
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={cn(
                  'size-4 transition-colors',
                  favorited ? 'fill-rose-500 text-rose-500' : 'text-white'
                )}
              />
            </motion.button>

            {/* Age range badge */}
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-black/40 text-white border-0 backdrop-blur-sm text-[10px]">
                Ages {story.ageMin}-{story.ageMax}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-2.5">
            {/* Category badges */}
            <div className="flex flex-wrap gap-1.5">
              {story.categories?.slice(0, 2).map((sc) => (
                <Badge
                  key={sc.category.id}
                  variant="secondary"
                  className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 border-purple-100"
                >
                  {sc.category.icon} {sc.category.name}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h3 className="font-bold text-base line-clamp-1 group-hover:text-purple-700 transition-colors">
              {story.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {story.description}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-1">
                {renderStars(story.rating)}
                <span className="font-medium text-amber-600">{story.rating}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {story.readCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {story.duration}m
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="size-3" />
                  {story.favoriteCount}
                </span>
              </div>
              {story._count && (
                <span className="flex items-center gap-1">
                  <Users className="size-3" />
                  {story._count.chapters} ch.
                </span>
              )}
            </div>
          </div>

          {/* Hover gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  )
}
