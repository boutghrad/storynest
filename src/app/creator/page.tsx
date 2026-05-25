'use client'

import { useState } from 'react'
import { motion, Reorder } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  BookOpen,
  FileText,
  ImageIcon,
  Clock,
  Eye,
  EyeOff,
  Save,
  Send,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface Chapter {
  id: string
  title: string
  content: string
  image: string | null
  duration: number
  order: number
}

interface Story {
  id: string
  title: string
  description: string
  coverImage: string | null
  categories: string[]
  tags: string[]
  ageMin: number
  ageMax: number
  language: string
  premium: boolean
  published: boolean
  chapters: Chapter[]
}

const mockStories: Story[] = [
  {
    id: 's1',
    title: 'The Dragon\'s Lullaby',
    description: 'A gentle tale of a baby dragon who can\'t sleep and the forest creatures who help.',
    coverImage: null,
    categories: ['Fantasy', 'Bedtime'],
    tags: ['dragons', 'nature', 'friendship'],
    ageMin: 3,
    ageMax: 8,
    language: 'en',
    premium: false,
    published: true,
    chapters: [
      { id: 'ch1', title: 'The Sleepless Dragon', content: 'Once upon a time, in a cave at the top of Crystal Mountain...', image: null, duration: 3, order: 1 },
      { id: 'ch2', title: 'The Owl\'s Song', content: 'The wise old owl heard Ember\'s sighs from across the forest...', image: null, duration: 4, order: 2 },
      { id: 'ch3', title: 'The Lullaby', content: 'And so all the creatures of the forest sang together...', image: null, duration: 3, order: 3 },
    ],
  },
  {
    id: 's2',
    title: 'Starlight Adventures',
    description: 'Join Luna as she travels through the night sky on a beam of starlight.',
    coverImage: null,
    categories: ['Adventure', 'Sci-Fi'],
    tags: ['space', 'stars', 'imagination'],
    ageMin: 5,
    ageMax: 10,
    language: 'en',
    premium: true,
    published: false,
    chapters: [
      { id: 'ch4', title: 'The Shooting Star', content: 'Luna was gazing out her window when she saw it...', image: null, duration: 4, order: 1 },
      { id: 'ch5', title: 'Among the Stars', content: 'The starbeam carried Luna higher and higher...', image: null, duration: 5, order: 2 },
    ],
  },
]

const availableCategories = ['Fantasy', 'Adventure', 'Bedtime', 'Fairy Tale', 'Sci-Fi', 'Mystery', 'Education', 'Nature', 'Friendship', 'Humor']
const availableTags = ['dragons', 'magic', 'nature', 'friendship', 'space', 'stars', 'imagination', 'animals', 'fairies', 'knights', 'princess', 'robots']
const languages = ['en', 'es', 'fr', 'de', 'zh', 'ja']

const coverGradients = [
  'from-purple-400 to-pink-400',
  'from-amber-400 to-orange-400',
  'from-teal-400 to-emerald-400',
  'from-rose-400 to-red-400',
]

export default function CreatorPage() {
  const [stories, setStories] = useState<Story[]>(mockStories)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)
  const [addChapterOpen, setAddChapterOpen] = useState(false)
  const [newChapter, setNewChapter] = useState({ title: '', content: '', duration: 3 })

  // New story form state
  const [newStory, setNewStory] = useState<Partial<Story>>({
    title: '',
    description: '',
    coverImage: null,
    categories: [],
    tags: [],
    ageMin: 3,
    ageMax: 12,
    language: 'en',
    premium: false,
    published: false,
    chapters: [],
  })

  const handleCreateStory = () => {
    if (!newStory.title) return
    const story: Story = {
      id: `s-${Date.now()}`,
      title: newStory.title || 'Untitled Story',
      description: newStory.description || '',
      coverImage: null,
      categories: newStory.categories || [],
      tags: newStory.tags || [],
      ageMin: newStory.ageMin || 3,
      ageMax: newStory.ageMax || 12,
      language: newStory.language || 'en',
      premium: newStory.premium || false,
      published: false,
      chapters: [],
    }
    setStories([story, ...stories])
    setNewStory({
      title: '',
      description: '',
      coverImage: null,
      categories: [],
      tags: [],
      ageMin: 3,
      ageMax: 12,
      language: 'en',
      premium: false,
      published: false,
      chapters: [],
    })
    setIsCreating(false)
    setSelectedStory(story)
  }

  const handleAddChapter = () => {
    if (!selectedStory || !newChapter.title || !newChapter.content) return
    const chapter: Chapter = {
      id: `ch-${Date.now()}`,
      title: newChapter.title,
      content: newChapter.content,
      image: null,
      duration: newChapter.duration,
      order: selectedStory.chapters.length + 1,
    }
    const updatedStory = {
      ...selectedStory,
      chapters: [...selectedStory.chapters, chapter],
    }
    setSelectedStory(updatedStory)
    setStories(stories.map((s) => (s.id === updatedStory.id ? updatedStory : s)))
    setNewChapter({ title: '', content: '', duration: 3 })
    setAddChapterOpen(false)
  }

  const handleDeleteChapter = (chapterId: string) => {
    if (!selectedStory) return
    const updatedStory = {
      ...selectedStory,
      chapters: selectedStory.chapters
        .filter((c) => c.id !== chapterId)
        .map((c, i) => ({ ...c, order: i + 1 })),
    }
    setSelectedStory(updatedStory)
    setStories(stories.map((s) => (s.id === updatedStory.id ? updatedStory : s)))
  }

  const toggleCategory = (category: string) => {
    const cats = newStory.categories || []
    setNewStory({
      ...newStory,
      categories: cats.includes(category)
        ? cats.filter((c) => c !== category)
        : [...cats, category],
    })
  }

  const toggleTag = (tag: string) => {
    const tags = newStory.tags || []
    setNewStory({
      ...newStory,
      tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    })
  }

  const toggleStoryCategory = (category: string) => {
    if (!selectedStory) return
    const cats = selectedStory.categories
    const updated = {
      ...selectedStory,
      categories: cats.includes(category)
        ? cats.filter((c) => c !== category)
        : [...cats, category],
    }
    setSelectedStory(updatedStory)
    setStories(stories.map((s) => (s.id === updated.id ? updated : s)))
  }

  const toggleStoryTag = (tag: string) => {
    if (!selectedStory) return
    const tags = selectedStory.tags
    const updated = {
      ...selectedStory,
      tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    }
    setSelectedStory(updated)
    setStories(stories.map((s) => (s.id === updated.id ? updated : s)))
  }

  // If editing a story, show the editor
  if (selectedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-purple-50/30">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* Editor Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStory(null)}
              >
                ← Back
              </Button>
              <h1 className="text-xl font-bold sm:text-2xl">{selectedStory.title}</h1>
              <Badge
                variant="secondary"
                className={cn(
                  selectedStory.published
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                )}
              >
                {selectedStory.published ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button
                size="sm"
                className="gap-1 bg-gradient-to-r from-purple-500 to-rose-500 text-white hover:from-purple-600 hover:to-rose-600"
              >
                <Send className="h-4 w-4" />
                Publish
              </Button>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Story Details */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">Story Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={selectedStory.title}
                      onChange={(e) => {
                        const updated = { ...selectedStory, title: e.target.value }
                        setSelectedStory(updated)
                        setStories(stories.map((s) => (s.id === updated.id ? updated : s)))
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={selectedStory.description}
                      onChange={(e) => {
                        const updated = { ...selectedStory, description: e.target.value }
                        setSelectedStory(updated)
                        setStories(stories.map((s) => (s.id === updated.id ? updated : s)))
                      }}
                      rows={3}
                    />
                  </div>

                  {/* Cover Image Upload Placeholder */}
                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground/50" />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Click to upload
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <Label>Categories</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {availableCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => toggleStoryCategory(cat)}
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                            selectedStory.categories.includes(cat)
                              ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-300'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleStoryTag(tag)}
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                            selectedStory.tags.includes(tag)
                              ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          )}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Age Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Min Age</Label>
                      <Input
                        type="number"
                        min={2}
                        max={14}
                        value={selectedStory.ageMin}
                        onChange={(e) => {
                          const updated = { ...selectedStory, ageMin: parseInt(e.target.value) || 3 }
                          setSelectedStory(updated)
                          setStories(stories.map((s) => (s.id === updated.id ? updated : s)))
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Age</Label>
                      <Input
                        type="number"
                        min={2}
                        max={14}
                        value={selectedStory.ageMax}
                        onChange={(e) => {
                          const updated = { ...selectedStory, ageMax: parseInt(e.target.value) || 12 }
                          setSelectedStory(updated)
                          setStories(stories.map((s) => (s.id === updated.id ? updated : s)))
                        }}
                      />
                    </div>
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={selectedStory.language}
                      onValueChange={(val) => {
                        const updated = { ...selectedStory, language: val }
                        setSelectedStory(updated)
                        setStories(stories.map((s) => (s.id === updated.id ? updated : s)))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Premium Toggle */}
                  <div className="flex items-center justify-between">
                    <Label>Premium Story</Label>
                    <Switch
                      checked={selectedStory.premium}
                      onCheckedChange={(checked) => {
                        const updated = { ...selectedStory, premium: checked }
                        setSelectedStory(updated)
                        setStories(stories.map((s) => (s.id === updated.id ? updated : s)))
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chapter Manager */}
            <div className="space-y-4 lg:col-span-2">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Chapters ({selectedStory.chapters.length})
                    </CardTitle>
                    <Dialog open={addChapterOpen} onOpenChange={setAddChapterOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                        >
                          <Plus className="h-4 w-4" />
                          Add Chapter
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Chapter</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Chapter Title</Label>
                            <Input
                              placeholder="Enter chapter title"
                              value={newChapter.title}
                              onChange={(e) =>
                                setNewChapter({ ...newChapter, title: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea
                              placeholder="Write your chapter content..."
                              value={newChapter.content}
                              onChange={(e) =>
                                setNewChapter({ ...newChapter, content: e.target.value })
                              }
                              rows={6}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Duration (minutes)</Label>
                            <Input
                              type="number"
                              min={1}
                              max={30}
                              value={newChapter.duration}
                              onChange={(e) =>
                                setNewChapter({
                                  ...newChapter,
                                  duration: parseInt(e.target.value) || 2,
                                })
                              }
                            />
                          </div>
                          <Button
                            onClick={handleAddChapter}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                          >
                            Add Chapter
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedStory.chapters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground/30" />
                      <p className="mt-3 text-sm text-muted-foreground">
                        No chapters yet. Add your first chapter to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedStory.chapters.map((chapter, i) => (
                        <div
                          key={chapter.id}
                          className="rounded-lg border bg-card transition-colors hover:bg-muted/30"
                        >
                          <button
                            className="flex w-full items-center gap-3 p-3 text-left"
                            onClick={() =>
                              setExpandedChapter(
                                expandedChapter === chapter.id ? null : chapter.id
                              )
                            }
                          >
                            <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground cursor-grab" />
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700">
                              {i + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">{chapter.title}</p>
                              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {chapter.duration} min
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteChapter(chapter.id)
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                              {expandedChapter === chapter.id ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </button>
                          {expandedChapter === chapter.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="border-t px-3 pb-3 pt-2"
                            >
                              <Textarea
                                value={chapter.content}
                                onChange={(e) => {
                                  const updatedChapters = selectedStory.chapters.map((c) =>
                                    c.id === chapter.id
                                      ? { ...c, content: e.target.value }
                                      : c
                                  )
                                  const updated = { ...selectedStory, chapters: updatedChapters }
                                  setSelectedStory(updated)
                                  setStories(
                                    stories.map((s) => (s.id === updated.id ? updated : s))
                                  )
                                }}
                                rows={6}
                                className="text-sm"
                              />
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Story list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-purple-50/30">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                Story Creator
              </span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Write, manage, and publish your stories
            </p>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create New Story</span>
            <span className="sm:hidden">New</span>
          </Button>
        </motion.div>

        {/* Create New Story Form */}
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-amber-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">New Story</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreating(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="Enter story title"
                      value={newStory.title || ''}
                      onChange={(e) =>
                        setNewStory({ ...newStory, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={newStory.language || 'en'}
                      onValueChange={(val) =>
                        setNewStory({ ...newStory, language: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your story..."
                    value={newStory.description || ''}
                    onChange={(e) =>
                      setNewStory({ ...newStory, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                          (newStory.categories || []).includes(cat)
                            ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-300'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                          (newStory.tags || []).includes(tag)
                            ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        )}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Min Age</Label>
                    <Input
                      type="number"
                      min={2}
                      max={14}
                      value={newStory.ageMin || 3}
                      onChange={(e) =>
                        setNewStory({
                          ...newStory,
                          ageMin: parseInt(e.target.value) || 3,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Age</Label>
                    <Input
                      type="number"
                      min={2}
                      max={14}
                      value={newStory.ageMax || 12}
                      onChange={(e) =>
                        setNewStory({
                          ...newStory,
                          ageMax: parseInt(e.target.value) || 12,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newStory.premium || false}
                        onCheckedChange={(checked) =>
                          setNewStory({ ...newStory, premium: checked })
                        }
                      />
                      <Label className="text-sm">Premium</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateStory}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                  >
                    <Sparkles className="mr-1 h-4 w-4" />
                    Create Story
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* My Stories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-4 text-lg font-semibold">My Stories</h2>
          {stories.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground/20" />
                <h3 className="mt-4 text-lg font-semibold">No stories yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first story and share it with the world!
                </p>
                <Button
                  onClick={() => setIsCreating(true)}
                  className="mt-4 gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                >
                  <Plus className="h-4 w-4" />
                  Create Story
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stories.map((story, i) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="group cursor-pointer overflow-hidden border-0 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div
                      className={cn(
                        'flex h-36 items-center justify-center bg-gradient-to-br',
                        coverGradients[i % coverGradients.length]
                      )}
                    >
                      <BookOpen className="h-10 w-10 text-white/80" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold leading-tight line-clamp-1">
                            {story.title}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {story.description}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'ml-2 shrink-0 text-xs',
                            story.published
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          )}
                        >
                          {story.published ? (
                            <Eye className="mr-1 h-3 w-3" />
                          ) : (
                            <EyeOff className="mr-1 h-3 w-3" />
                          )}
                          {story.published ? 'Live' : 'Draft'}
                        </Badge>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        {story.chapters.length} chapters
                        <span className="text-border">·</span>
                        Ages {story.ageMin}-{story.ageMax}
                        {story.premium && (
                          <>
                            <span className="text-border">·</span>
                            <Badge className="bg-amber-100 text-amber-700 text-[10px] px-1.5">
                              Premium
                            </Badge>
                          </>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {story.categories.slice(0, 3).map((cat) => (
                          <Badge
                            key={cat}
                            variant="outline"
                            className="text-[10px] px-1.5"
                          >
                            {cat}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        onClick={() => setSelectedStory(story)}
                        className="mt-3 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                        size="sm"
                      >
                        <Pencil className="mr-1 h-4 w-4" />
                        Edit Story
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
