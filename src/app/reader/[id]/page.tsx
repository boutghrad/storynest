'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Sun, Moon, Maximize,
  Minimize, Type, List, Bookmark, X, Check,
  ArrowLeft, BookOpen, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  duration: number
}

const categoryGradients: Record<string, string> = {
  adventure: 'from-amber-400 to-orange-500',
  fantasy: 'from-purple-400 to-fuchsia-500',
  bedtime: 'from-teal-400 to-cyan-500',
  educational: 'from-emerald-400 to-green-500',
  animals: 'from-rose-400 to-pink-500',
  default: 'from-violet-400 to-purple-500',
}

export default function StoryReaderPage() {
  const params = useParams()
  const router = useRouter()
  const storyId = params.id as string

  const [story, setStory] = useState<StoryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [fontSize, setFontSize] = useState(18)
  const [darkMode, setDarkMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)
  const [readChapters, setReadChapters] = useState<Set<string>>(new Set())
  const [showControls, setShowControls] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const contentRef = useRef<HTMLDivElement>(null)
  const readerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch story
  useEffect(() => {
    if (!storyId) return

    const fetchStory = async () => {
      try {
        const res = await fetch(`/api/stories/${storyId}`)
        if (!res.ok) return
        const data = await res.json()
        const s = data.story as StoryDetail
        setStory(s)

        // Check reading history for last position
        const historyRes = await fetch(`/api/users/history?userId=demo-user`)
        if (historyRes.ok) {
          const historyData = await historyRes.json()
          const entry = historyData.history?.find(
            (h: { storyId: string; chapterId: string | null; progress: number }) => h.storyId === storyId
          )
          if (entry?.chapterId) {
            const chapterIdx = s.chapters.findIndex(
              (ch: Chapter) => ch.id === entry.chapterId
            )
            if (chapterIdx >= 0) setCurrentChapterIndex(chapterIdx)
          }
          // Mark chapters as read based on progress
          if (entry?.progress) {
            const progressPercent = entry.progress
            const chaptersToMark = Math.floor(
              (progressPercent / 100) * s.chapters.length
            )
            const read = new Set<string>()
            for (let i = 0; i < chaptersToMark; i++) {
              read.add(s.chapters[i].id)
            }
            setReadChapters(read)
          }
        }
      } catch (err) {
        console.error('Error fetching story:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStory()
  }, [storyId])

  const currentChapter = story?.chapters[currentChapterIndex]
  const totalChapters = story?.chapters.length || 0
  const overallProgress = totalChapters > 0
    ? ((readChapters.size) / totalChapters) * 100
    : 0

  // Save progress
  const saveProgress = useCallback(
    async (chapterId: string, progress: number) => {
      try {
        await fetch('/api/users/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'demo-user',
            storyId,
            chapterId,
            progress,
          }),
        })
      } catch (err) {
        console.error('Error saving progress:', err)
      }
    },
    [storyId]
  )

  // Track scroll progress within chapter
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return
      const el = contentRef.current
      const scrollTop = el.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      if (scrollHeight > 0) {
        setScrollProgress((scrollTop / scrollHeight) * 100)
      }
    }

    const el = contentRef.current
    if (el) {
      el.addEventListener('scroll', handleScroll)
      return () => el.removeEventListener('scroll', handleScroll)
    }
  }, [currentChapterIndex])

  // Navigate chapter
  const goToChapter = useCallback(
    (index: number) => {
      if (!story || index < 0 || index >= totalChapters) return

      // Mark current chapter as read
      if (currentChapter) {
        setReadChapters((prev) => new Set([...prev, currentChapter.id]))
        const newProgress = ((readChapters.size + 1) / totalChapters) * 100
        saveProgress(currentChapter.id, newProgress)
      }

      setCurrentChapterIndex(index)
      setScrollProgress(0)
      if (contentRef.current) {
        contentRef.current.scrollTop = 0
      }
      setTocOpen(false)
    },
    [story, currentChapter, totalChapters, readChapters, saveProgress]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goToChapter(currentChapterIndex + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goToChapter(currentChapterIndex - 1)
      } else if (e.key === 'Escape') {
        if (tocOpen) setTocOpen(false)
        else router.push(`/story/${storyId}`)
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentChapterIndex, goToChapter, tocOpen, router, storyId])

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }, [])

  const handleMouseMove = () => {
    resetControlsTimer()
  }

  // Font size controls
  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 28))
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12))

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev)

  // Bookmark
  const handleBookmark = async () => {
    setBookmarked(!bookmarked)
    if (!bookmarked && currentChapter) {
      try {
        await fetch('/api/users/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'demo-user',
            storyId,
            chapterId: currentChapter.id,
          }),
        })
      } catch (err) {
        console.error('Error adding bookmark:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="p-4">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-2 w-full mb-6" />
          <div className="max-w-2xl mx-auto space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!story || !currentChapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold mb-2">Story Not Found</h2>
          <Button onClick={() => router.push('/stories')} className="mt-4 gap-2">
            <ArrowLeft className="size-4" />
            Back to Stories
          </Button>
        </div>
      </div>
    )
  }

  const categorySlug = story.categories?.[0]?.category.slug || 'default'
  const gradient = categoryGradients[categorySlug] || categoryGradients.default

  return (
    <div
      ref={readerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'min-h-screen flex flex-col transition-colors duration-300',
        darkMode
          ? 'bg-gray-950 text-gray-100'
          : 'bg-gradient-to-b from-white to-purple-50/30 text-gray-900'
      )}
    >
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className={cn('h-1', darkMode ? 'bg-gray-800' : 'bg-purple-100')}>
          <motion.div
            className={cn('h-full', darkMode ? 'bg-purple-400' : 'bg-gradient-to-r from-purple-500 to-fuchsia-500')}
            initial={{ width: 0 }}
            animate={{
              width: `${((currentChapterIndex + scrollProgress / 100) / totalChapters) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Top Controls Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'fixed top-1 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between',
              darkMode
                ? 'bg-gray-950/90 border-b border-gray-800'
                : 'bg-white/80 backdrop-blur-md border-b border-purple-100/50'
            )}
          >
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/story/${storyId}`)}
                className={cn('gap-1.5', darkMode && 'text-gray-300 hover:text-white')}
              >
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Separator orientation="vertical" className={cn('h-5', darkMode && 'bg-gray-700')} />
              <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-[400px]">
                {story.title}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-2 hidden sm:inline">
                Chapter {currentChapterIndex + 1} of {totalChapters}
              </span>
              <Button variant="ghost" size="icon" className="size-8" onClick={() => setTocOpen(true)}>
                <List className="size-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto pt-16 pb-24"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              {/* Chapter Header */}
              <div className="mb-8 mt-8">
                {/* Chapter gradient image */}
                <div className={cn(
                  'relative h-40 sm:h-52 rounded-2xl overflow-hidden mb-6 bg-gradient-to-br',
                  gradient,
                  darkMode && 'opacity-60'
                )}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="size-16 text-white/40" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className={cn(
                      'text-xs mb-2',
                      darkMode
                        ? 'bg-black/40 text-white border-0'
                        : 'bg-white/20 text-white border-0 backdrop-blur-sm'
                    )}>
                      Chapter {currentChapterIndex + 1}
                    </Badge>
                  </div>
                </div>

                <h1 className={cn(
                  'text-2xl sm:text-3xl font-extrabold mb-2',
                  darkMode && 'text-white'
                )}>
                  {currentChapter.title}
                </h1>
                <div className={cn(
                  'flex items-center gap-3 text-sm',
                  darkMode ? 'text-gray-400' : 'text-muted-foreground'
                )}>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {currentChapter.duration} min read
                  </span>
                  <span>
                    {readChapters.has(currentChapter.id) ? '✓ Read' : 'Unread'}
                  </span>
                </div>
              </div>

              {/* Story Text */}
              <div
                className={cn(
                  'prose max-w-none leading-relaxed',
                  darkMode ? 'prose-invert' : '',
                )}
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
              >
                {currentChapter.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 first-letter:text-3xl first-letter:font-bold first-letter:mr-0.5">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-40 px-4 py-3',
              darkMode
                ? 'bg-gray-950/90 border-t border-gray-800'
                : 'bg-white/80 backdrop-blur-md border-t border-purple-100/50'
            )}
          >
            <div className="max-w-3xl mx-auto">
              {/* Chapter progress mini bar */}
              <div className={cn('h-0.5 rounded-full mb-3', darkMode ? 'bg-gray-800' : 'bg-purple-100')}>
                <motion.div
                  className={cn('h-full rounded-full', darkMode ? 'bg-purple-400' : 'bg-purple-500')}
                  animate={{ width: `${scrollProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                {/* Previous */}
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentChapterIndex === 0}
                  onClick={() => goToChapter(currentChapterIndex - 1)}
                  className={cn('gap-1', darkMode && 'text-gray-300 hover:text-white')}
                >
                  <ChevronLeft className="size-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>

                {/* Center controls */}
                <div className="flex items-center gap-1">
                  {/* Font size */}
                  <Button variant="ghost" size="icon" className="size-8" onClick={decreaseFontSize}>
                    <Type className="size-3.5" />
                  </Button>
                  <span className={cn('text-xs w-6 text-center', darkMode && 'text-gray-400')}>
                    {fontSize}
                  </span>
                  <Button variant="ghost" size="icon" className="size-8" onClick={increaseFontSize}>
                    <Type className="size-5" />
                  </Button>

                  <Separator orientation="vertical" className={cn('h-5 mx-1', darkMode && 'bg-gray-700')} />

                  {/* Chapter selector */}
                  <Select
                    value={currentChapterIndex.toString()}
                    onValueChange={(val) => goToChapter(parseInt(val))}
                  >
                    <SelectTrigger className={cn('w-[130px] h-8 text-xs', darkMode && 'bg-gray-800 border-gray-700')}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {story.chapters.map((ch, idx) => (
                        <SelectItem key={ch.id} value={idx.toString()}>
                          <span className="flex items-center gap-2">
                            {readChapters.has(ch.id) && (
                              <Check className="size-3 text-teal-500" />
                            )}
                            {idx + 1}. {ch.title}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Separator orientation="vertical" className={cn('h-5 mx-1', darkMode && 'bg-gray-700')} />

                  {/* Dark mode toggle */}
                  <Button variant="ghost" size="icon" className="size-8" onClick={toggleDarkMode}>
                    {darkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  </Button>

                  {/* Bookmark */}
                  <Button variant="ghost" size="icon" className="size-8" onClick={handleBookmark}>
                    <Bookmark className={cn('size-4', bookmarked && 'fill-purple-500 text-purple-500')} />
                  </Button>

                  {/* Fullscreen */}
                  <Button variant="ghost" size="icon" className="size-8" onClick={toggleFullscreen}>
                    {isFullscreen ? (
                      <Minimize className="size-4" />
                    ) : (
                      <Maximize className="size-4" />
                    )}
                  </Button>

                  {/* TOC */}
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => setTocOpen(true)}>
                    <List className="size-4" />
                  </Button>
                </div>

                {/* Next */}
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentChapterIndex === totalChapters - 1}
                  onClick={() => goToChapter(currentChapterIndex + 1)}
                  className={cn('gap-1', darkMode && 'text-gray-300 hover:text-white')}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table of Contents Sidebar */}
      <AnimatePresence>
        {tocOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTocOpen(false)}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn(
                'fixed top-0 left-0 bottom-0 z-50 w-72 shadow-2xl',
                darkMode
                  ? 'bg-gray-900 text-white'
                  : 'bg-white'
              )}
            >
              <div className="flex items-center justify-between p-4 border-b border-purple-100">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <List className="size-5 text-purple-500" />
                  Chapters
                </h2>
                <Button variant="ghost" size="icon" className="size-8" onClick={() => setTocOpen(false)}>
                  <X className="size-4" />
                </Button>
              </div>

              {/* Overall progress */}
              <div className="px-4 py-3 border-b border-purple-100/50">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-1.5" />
                <p className="text-xs text-muted-foreground mt-1.5">
                  {readChapters.size} of {totalChapters} chapters read
                </p>
              </div>

              {/* Chapter list */}
              <div className="overflow-y-auto max-h-[calc(100vh-160px)] p-2">
                {story.chapters.map((ch, idx) => (
                  <motion.button
                    key={ch.id}
                    whileHover={{ x: 4 }}
                    onClick={() => goToChapter(idx)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors mb-1',
                      idx === currentChapterIndex
                        ? darkMode
                          ? 'bg-purple-900/40 text-purple-300'
                          : 'bg-purple-50 text-purple-700'
                        : darkMode
                          ? 'hover:bg-gray-800 text-gray-300'
                          : 'hover:bg-purple-50/50'
                    )}
                  >
                    <div className={cn(
                      'flex size-7 items-center justify-center rounded-full text-xs font-semibold shrink-0',
                      idx === currentChapterIndex
                        ? 'bg-purple-600 text-white'
                        : readChapters.has(ch.id)
                          ? 'bg-teal-100 text-teal-600'
                          : darkMode
                            ? 'bg-gray-800 text-gray-500'
                            : 'bg-gray-100 text-gray-500'
                    )}>
                      {readChapters.has(ch.id) && idx !== currentChapterIndex ? (
                        <Check className="size-3.5" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium truncate',
                        idx === currentChapterIndex && 'text-purple-700'
                      )}>
                        {ch.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ch.duration} min
                      </p>
                    </div>
                    {idx === currentChapterIndex && (
                      <div className="size-2 rounded-full bg-purple-500 shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
