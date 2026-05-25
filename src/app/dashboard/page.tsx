'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BookOpen,
  Flame,
  Heart,
  Award,
  Plus,
  Play,
  Clock,
  Star,
  Trash2,
  Edit3,
  User,
  ChevronRight,
  Sparkles,
  Baby,
} from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'

// Mock data for dashboard
const mockUser = {
  id: 'demo-user-1',
  name: 'Sarah',
  email: 'sarah@example.com',
  readingStreak: 12,
  storiesRead: 47,
  favoritesCount: 15,
  badgesEarned: 8,
}

const mockContinueReading = [
  { id: '1', title: 'The Dragon\'s Lullaby', progress: 65, lastChapter: 'Chapter 5: The Hidden Cave', coverImage: null, slug: 'dragons-lullaby' },
  { id: '2', title: 'Starlight Adventures', progress: 30, lastChapter: 'Chapter 2: Shooting Stars', coverImage: null, slug: 'starlight-adventures' },
  { id: '3', title: 'The Magic Garden', progress: 85, lastChapter: 'Chapter 8: The Golden Butterfly', coverImage: null, slug: 'magic-garden' },
  { id: '4', title: 'Whispers of the Forest', progress: 12, lastChapter: 'Chapter 1: The Old Oak', coverImage: null, slug: 'whispers-forest' },
]

const mockFavorites = [
  { id: 'f1', title: 'The Enchanted Kingdom', authorName: 'Elena Starweaver', coverImage: null, slug: 'enchanted-kingdom' },
  { id: 'f2', title: 'Moonbeam Dreams', authorName: 'Oliver Page', coverImage: null, slug: 'moonbeam-dreams' },
  { id: 'f3', title: 'Ocean Tales', authorName: 'Marina Waves', coverImage: null, slug: 'ocean-tales' },
  { id: 'f4', title: 'Rainbow Riders', authorName: 'Iris Prism', coverImage: null, slug: 'rainbow-riders' },
  { id: 'f5', title: 'Cloud Castles', authorName: 'Sky Stormwright', coverImage: null, slug: 'cloud-castles' },
  { id: 'f6', title: 'Pebble the Brave', authorName: 'Rocky Stone', coverImage: null, slug: 'pebble-brave' },
]

const mockHistory = [
  { id: 'h1', title: 'The Dragon\'s Lullaby', readDate: '2025-05-24', progress: 65, slug: 'dragons-lullaby' },
  { id: 'h2', title: 'Starlight Adventures', readDate: '2025-05-23', progress: 30, slug: 'starlight-adventures' },
  { id: 'h3', title: 'The Enchanted Kingdom', readDate: '2025-05-22', progress: 100, slug: 'enchanted-kingdom' },
  { id: 'h4', title: 'Moonbeam Dreams', readDate: '2025-05-21', progress: 100, slug: 'moonbeam-dreams' },
  { id: 'h5', title: 'Ocean Tales', readDate: '2025-05-20', progress: 100, slug: 'ocean-tales' },
]

const mockChildProfiles = [
  { id: 'cp1', name: 'Lily', age: 6, avatar: null, grade: '1st Grade' },
  { id: 'cp2', name: 'Max', age: 8, avatar: null, grade: '3rd Grade' },
]

const mockBadges = [
  { id: 'b1', name: 'First Story', icon: '📖', category: 'reading', earned: true },
  { id: 'b2', name: 'Bookworm', icon: '🐛', category: 'reading', earned: true },
  { id: 'b3', name: '7-Day Streak', icon: '🔥', category: 'streak', earned: true },
  { id: 'b4', name: 'Explorer', icon: '🧭', category: 'achievement', earned: true },
  { id: 'b5', name: 'Collector', icon: '💎', category: 'achievement', earned: true },
  { id: 'b6', name: 'Night Owl', icon: '🦉', category: 'reading', earned: true },
  { id: 'b7', name: 'Speed Reader', icon: '⚡', category: 'achievement', earned: true },
  { id: 'b8', name: 'Kind Heart', icon: '💝', category: 'social', earned: true },
  { id: 'b9', name: '30-Day Streak', icon: '🌟', category: 'streak', earned: false },
  { id: 'b10', name: '100 Stories', icon: '🏆', category: 'reading', earned: false },
  { id: 'b11', name: 'Storyteller', icon: '🎙️', category: 'social', earned: false },
  { id: 'b12', name: 'Master Reader', icon: '👑', category: 'achievement', earned: false },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const coverGradients = [
  'from-purple-400 to-pink-400',
  'from-amber-400 to-orange-400',
  'from-teal-400 to-emerald-400',
  'from-rose-400 to-red-400',
  'from-violet-400 to-purple-400',
  'from-cyan-400 to-teal-400',
]

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [addChildOpen, setAddChildOpen] = useState(false)
  const [newChild, setNewChild] = useState({ name: '', age: '', grade: '' })
  const [childProfiles, setChildProfiles] = useState(mockChildProfiles)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleAddChild = () => {
    if (!newChild.name || !newChild.age) return
    setChildProfiles([
      ...childProfiles,
      {
        id: `cp-${Date.now()}`,
        name: newChild.name,
        age: parseInt(newChild.age),
        avatar: null,
        grade: newChild.grade || null,
      },
    ])
    setNewChild({ name: '', age: '', grade: '' })
    setAddChildOpen(false)
  }

  const handleRemoveChild = (id: string) => {
    setChildProfiles(childProfiles.filter((c) => c.id !== id))
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-amber-50/50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                <span className="bg-gradient-to-r from-purple-600 to-rose-500 bg-clip-text text-transparent">
                  My Story Nest
                </span>
              </h1>
              <p className="mt-1 text-muted-foreground">
                Welcome back, {mockUser.name}! 🌟 Ready for an adventure?
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-semibold text-orange-700">
                {mockUser.readingStreak} day streak!
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Stats Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatsCard
              title="Stories Read"
              value={mockUser.storiesRead}
              icon={BookOpen}
              gradient="from-purple-500/10 to-violet-500/5"
              iconBg="bg-purple-100 text-purple-600"
              trend={{ value: 12, label: 'this month' }}
              delay={0}
            />
            <StatsCard
              title="Reading Streak"
              value={`${mockUser.readingStreak} days`}
              icon={Flame}
              gradient="from-amber-500/10 to-orange-500/5"
              iconBg="bg-amber-100 text-amber-600"
              delay={0.1}
            />
            <StatsCard
              title="Favorites"
              value={mockUser.favoritesCount}
              icon={Heart}
              gradient="from-rose-500/10 to-pink-500/5"
              iconBg="bg-rose-100 text-rose-600"
              delay={0.2}
            />
            <StatsCard
              title="Badges Earned"
              value={mockUser.badgesEarned}
              icon={Award}
              gradient="from-teal-500/10 to-emerald-500/5"
              iconBg="bg-teal-100 text-teal-600"
              delay={0.3}
            />
          </motion.div>

          {/* Continue Reading */}
          <motion.div variants={itemVariants}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
                <Play className="h-5 w-5 text-purple-500" />
                Continue Reading
              </h2>
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
                {mockContinueReading.map((story, i) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="w-64 overflow-hidden border-0 shadow-md transition-shadow hover:shadow-lg sm:w-72">
                      <div
                        className={cn(
                          'flex h-28 items-center justify-center bg-gradient-to-br sm:h-32',
                          coverGradients[i % coverGradients.length]
                        )}
                      >
                        <BookOpen className="h-10 w-10 text-white/80" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold leading-tight">{story.title}</h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {story.lastChapter}
                        </p>
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{story.progress}%</span>
                          </div>
                          <Progress value={story.progress} className="h-2" />
                        </div>
                        <Button
                          size="sm"
                          className="mt-3 w-full bg-gradient-to-r from-purple-500 to-rose-500 text-white hover:from-purple-600 hover:to-rose-600"
                        >
                          Continue
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>

          {/* Favorites */}
          <motion.div variants={itemVariants}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
                <Heart className="h-5 w-5 text-rose-500" />
                My Favorites
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {mockFavorites.map((fav, i) => (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="group overflow-hidden border-0 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div
                      className={cn(
                        'flex h-28 items-center justify-center bg-gradient-to-br sm:h-32',
                        coverGradients[i % coverGradients.length]
                      )}
                    >
                      <Star className="h-8 w-8 text-white/70" />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-sm font-semibold leading-tight line-clamp-1">
                        {fav.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {fav.authorName}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 w-full text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Heart className="mr-1 h-3 w-3 fill-current" />
                        Unfavorite
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reading History & Child Profiles */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Reading History */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-amber-500" />
                    Reading History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.readDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <Badge
                            variant={item.progress === 100 ? 'default' : 'secondary'}
                            className={cn(
                              'text-xs',
                              item.progress === 100 &&
                                'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                            )}
                          >
                            {item.progress === 100 ? 'Completed' : `${item.progress}%`}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 shrink-0 text-xs"
                      >
                        {item.progress === 100 ? 'Read Again' : 'Continue'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Child Profiles */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Baby className="h-5 w-5 text-teal-500" />
                      Child Profiles
                    </CardTitle>
                    <Dialog open={addChildOpen} onOpenChange={setAddChildOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600"
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add Child
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Child Profile</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="childName">Name</Label>
                            <Input
                              id="childName"
                              placeholder="Enter child's name"
                              value={newChild.name}
                              onChange={(e) =>
                                setNewChild({ ...newChild, name: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="childAge">Age</Label>
                            <Input
                              id="childAge"
                              type="number"
                              placeholder="Enter age"
                              min="2"
                              max="14"
                              value={newChild.age}
                              onChange={(e) =>
                                setNewChild({ ...newChild, age: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="childGrade">Grade (Optional)</Label>
                            <Input
                              id="childGrade"
                              placeholder="e.g., 2nd Grade"
                              value={newChild.grade}
                              onChange={(e) =>
                                setNewChild({ ...newChild, grade: e.target.value })
                              }
                            />
                          </div>
                          <Button
                            onClick={handleAddChild}
                            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600"
                          >
                            Add Profile
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {childProfiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Baby className="h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        No child profiles yet. Add one to personalize their reading!
                      </p>
                    </div>
                  ) : (
                    childProfiles.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 text-white">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{child.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Age {child.age}
                            {child.grade && ` · ${child.grade}`}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                            onClick={() => handleRemoveChild(child.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Badges Section */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  My Badges
                </CardTitle>
                <CardDescription>
                  {mockBadges.filter((b) => b.earned).length} of {mockBadges.length} earned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {mockBadges.map((badge, i) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-xl p-3 text-center transition-all',
                        badge.earned
                          ? 'bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100'
                          : 'bg-muted/30 opacity-50'
                      )}
                    >
                      <span className="text-2xl sm:text-3xl">{badge.icon}</span>
                      <span
                        className={cn(
                          'text-xs font-medium leading-tight',
                          badge.earned ? 'text-amber-700' : 'text-muted-foreground'
                        )}
                      >
                        {badge.name}
                      </span>
                      {!badge.earned && (
                        <span className="text-[10px] text-muted-foreground">🔒 Locked</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-amber-50/50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="mt-8">
          <Skeleton className="h-6 w-40" />
          <div className="mt-4 flex gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-72 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
