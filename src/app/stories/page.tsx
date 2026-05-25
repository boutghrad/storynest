'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, SlidersHorizontal, X, Sparkles, TrendingUp,
  Star, Clock, Filter, ChevronDown
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { StoryGrid } from '@/components/stories/StoryGrid'
import type { StoryCardData } from '@/components/stories/StoryCard'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  storyCount: number
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

const sortOptions = [
  { value: 'trending', label: '🔥 Trending', icon: TrendingUp },
  { value: 'featured', label: '⭐ Featured', icon: Sparkles },
  { value: 'popular', label: '💖 Popular', icon: Star },
  { value: 'newest', label: '🆕 Newest', icon: Clock },
]

export default function StoriesExplorerPage() {
  const [stories, setStories] = useState<StoryCardData[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })
  const [ageRange, setAgeRange] = useState([3, 12])
  const [premiumOnly, setPremiumOnly] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories)
      })
      .catch(console.error)
  }, [])

  // Fetch stories
  const fetchStories = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '12')
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (selectedCategories.length > 0) params.set('category', selectedCategories[0])
      params.set('sort', sort)

      const res = await fetch(`/api/stories?${params}`)
      const data = await res.json()

      if (data.stories) {
        let filtered = data.stories as StoryCardData[]
        // Client-side age filtering
        filtered = filtered.filter(
          (s) => s.ageMin >= ageRange[0] && s.ageMax <= ageRange[1]
        )
        // Client-side premium filter
        if (premiumOnly) {
          filtered = filtered.filter((s) => s.premium)
        }
        setStories(filtered)
      }
      if (data.pagination) {
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, selectedCategories, sort, ageRange, premiumOnly])

  useEffect(() => {
    fetchStories()
  }, [fetchStories])

  const handleCategoryToggle = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    )
    setPage(1)
  }

  const handleFavoriteToggle = async (storyId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(storyId)) {
      newFavorites.delete(storyId)
    } else {
      newFavorites.add(storyId)
    }
    setFavorites(newFavorites)

    try {
      const userId = 'demo-user'
      if (favorites.has(storyId)) {
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
    } catch (error) {
      console.error('Error toggling favorite:', error)
      setFavorites(favorites)
    }
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    setPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedCategories([])
    setSort('newest')
    setAgeRange([3, 12])
    setPremiumOnly(false)
    setPage(1)
  }

  const hasActiveFilters = selectedCategories.length > 0 || premiumOnly || ageRange[0] !== 3 || ageRange[1] !== 12

  // Filter sidebar content
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Filter className="size-4 text-purple-500" />
          Categories
        </h3>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <Checkbox
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => handleCategoryToggle(cat.slug)}
                className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
              />
              <span className="text-sm group-hover:text-purple-700 transition-colors">
                {cat.icon} {cat.name}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {cat.storyCount}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Age Range */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Age Range</h3>
        <div className="px-1">
          <Slider
            value={ageRange}
            onValueChange={(val) => {
              setAgeRange(val as number[])
              setPage(1)
            }}
            min={3}
            max={12}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Age {ageRange[0]}</span>
            <span>Age {ageRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Premium Toggle */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">Premium Only</h3>
            <p className="text-xs text-muted-foreground">Show premium stories</p>
          </div>
          <Switch
            checked={premiumOnly}
            onCheckedChange={(checked) => {
              setPremiumOnly(checked)
              setPage(1)
            }}
          />
        </div>
      </div>

      <Separator />

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
          <X className="size-3.5 mr-1" />
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-rose-50/50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-rose-600/5" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
              <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
                Explore Stories
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover magical worlds, one story at a time ✨
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for stories, authors, or topics..."
                className="pl-12 h-12 text-base rounded-xl border-purple-200/50 bg-white/80 backdrop-blur-sm shadow-lg focus-visible:ring-purple-300 focus-visible:border-purple-300"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Filter Chips & Sort */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-2"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryToggle(cat.slug)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border',
                  selectedCategories.includes(cat.slug)
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                    : 'bg-white/80 text-foreground border-purple-100 hover:border-purple-300 hover:bg-purple-50 backdrop-blur-sm'
                )}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                'Loading...'
              ) : (
                <>
                  <span className="font-semibold text-foreground">{pagination.total}</span>{' '}
                  {pagination.total === 1 ? 'story' : 'stories'} found
                </>
              )}
            </p>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-7 text-purple-600 hover:text-purple-700"
              >
                <X className="size-3 mr-1" />
                Clear filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filter button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden gap-1.5">
                  <SlidersHorizontal className="size-3.5" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-purple-600 text-[10px] text-white">
                      {selectedCategories.length + (premiumOnly ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Sparkles className="size-4 text-purple-500" />
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-120px)] mt-4">
                  <FilterSidebar />
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Sort dropdown */}
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-5 shadow-sm">
              <FilterSidebar />
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <StoryGrid
              stories={stories}
              loading={loading}
              onFavoriteToggle={handleFavoriteToggle}
              favorites={favorites}
            />

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="mt-10">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (page > 1) setPage(page - 1)
                        }}
                        className={cn(page <= 1 && 'pointer-events-none opacity-50')}
                      />
                    </PaginationItem>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        // Show first, last, and pages around current
                        if (p === 1 || p === pagination.totalPages) return true
                        if (Math.abs(p - page) <= 1) return true
                        return false
                      })
                      .map((p, idx, arr) => {
                        const prev = arr[idx - 1]
                        const showEllipsis = prev !== undefined && p - prev > 1
                        return (
                          <span key={p} className="flex items-center">
                            {showEllipsis && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setPage(p)
                                }}
                                isActive={page === p}
                              >
                                {p}
                              </PaginationLink>
                            </PaginationItem>
                          </span>
                        )
                      })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (page < pagination.totalPages) setPage(page + 1)
                        }}
                        className={cn(
                          page >= pagination.totalPages &&
                            'pointer-events-none opacity-50'
                        )}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
