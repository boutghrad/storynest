'use client'

import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { StoryCard, type StoryCardData } from './StoryCard'
import { BookOpen } from 'lucide-react'

interface StoryGridProps {
  stories: StoryCardData[]
  loading?: boolean
  onFavoriteToggle?: (storyId: string) => void
  favorites?: Set<string>
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

function StoryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm shadow-lg">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-2.5">
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}

export function StoryGrid({ stories, loading = false, onFavoriteToggle, favorites }: StoryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StoryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!stories.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-rose-100 flex items-center justify-center">
            <BookOpen className="size-10 text-purple-400" />
          </div>
          <div className="absolute -top-1 -right-1 text-2xl">🔍</div>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No Stories Found</h3>
        <p className="text-muted-foreground max-w-sm">
          We couldn&apos;t find any stories matching your search. Try adjusting your filters or search terms!
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {stories.map((story) => (
        <motion.div key={story.id} variants={itemVariants}>
          <StoryCard
            story={story}
            isFavorited={favorites?.has(story.id)}
            onFavoriteToggle={onFavoriteToggle}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
