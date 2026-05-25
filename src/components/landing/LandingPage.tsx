'use client'

import * as React from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import {
  BookOpen,
  Sparkles,
  Star,
  ChevronRight,
  MapPin,
  BookMarked,
  Share2,
  Users,
  Shield,
  Zap,
  Heart,
  Check,
  ArrowRight,
  Quote,
  Clock,
  Eye,
  Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

/* ============================================
   TYPES
   ============================================ */
interface Story {
  id: string
  title: string
  slug: string
  description: string | null
  coverImage: string | null
  ageMin: number
  ageMax: number
  readCount: number
  favoriteCount: number
  rating: number
  ratingCount: number
  duration: number
  premium: boolean
  categories: { category: { name: string; color: string | null; icon: string | null } }[]
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  storyCount: number
}

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar: string | null
  rating: number
}

/* ============================================
   ANIMATION VARIANTS
   ============================================ */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

/* ============================================
   SECTION WRAPPER WITH SCROLL ANIMATION
   ============================================ */
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

/* ============================================
   HERO SECTION
   ============================================ */
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden gradient-hero">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 pattern-dots opacity-50" />

      {/* Floating books/stars */}
      <motion.div
        className="absolute top-20 left-[10%] text-4xl opacity-20"
        animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        📖
      </motion.div>
      <motion.div
        className="absolute top-32 right-[15%] text-3xl opacity-20"
        animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-[20%] text-3xl opacity-20"
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        🦋
      </motion.div>
      <motion.div
        className="absolute bottom-40 right-[10%] text-4xl opacity-20"
        animate={{ y: [8, -8, 8], rotate: [3, -3, 3] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        🌙
      </motion.div>
      <motion.div
        className="absolute top-[60%] left-[5%] text-2xl opacity-15"
        animate={{ y: [-6, 6, -6], rotate: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute top-[40%] right-[5%] text-2xl opacity-15"
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        🧚
      </motion.div>

      {/* Sparkles — positions are deterministic to avoid hydration mismatch */}
      {[
        { top: 22, left: 45, dur: 2.4, del: 0.3 },
        { top: 58, left: 72, dur: 3.1, del: 1.8 },
        { top: 35, left: 18, dur: 2.7, del: 0.9 },
        { top: 75, left: 62, dur: 3.5, del: 2.4 },
        { top: 48, left: 88, dur: 2.2, del: 1.2 },
        { top: 15, left: 35, dur: 3.0, del: 2.7 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: s.dur,
            repeat: Infinity,
            delay: s.del,
          }}
        >
          <Sparkles className="h-3 w-3 text-magical-amber" />
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="h-4 w-4" />
            Magical stories for ages 3–12
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Where Stories</span>
            <br />
            <span className="text-gradient-magical">Come Alive</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Spark your child&apos;s imagination with our magical library of enchanting
            tales, interactive adventures, and bedtime favorites. Every story is a
            new world waiting to be explored.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="gradient-magical text-white border-0 hover:opacity-90 transition-opacity shadow-xl shadow-primary/25 text-base px-8 py-6 h-auto"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Start Reading Free
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/stories">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 text-primary hover:bg-primary/5 text-base px-8 py-6 h-auto"
                >
                  Explore Stories
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>50,000+ happy families</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 text-magical-amber fill-magical-amber"
                />
              ))}
              <span className="ml-1">4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-primary" />
              <span>1,000+ stories</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

/* ============================================
   FEATURED STORIES SECTION
   ============================================ */
const storyGradients = [
  'from-violet-500 via-purple-400 to-fuchsia-400',
  'from-amber-400 via-orange-400 to-rose-400',
  'from-teal-400 via-emerald-400 to-cyan-400',
  'from-rose-400 via-pink-400 to-purple-400',
  'from-amber-400 via-yellow-300 to-orange-400',
  'from-teal-400 via-cyan-400 to-violet-400',
]

function FeaturedStoriesSection({ stories }: { stories: Story[] }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  return (
    <AnimatedSection className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={staggerItem} className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-magical-amber" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Featured Stories
                </span>
              </motion.div>
              <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-bold text-foreground">
                Stories Kids{' '}
                <span className="text-gradient-magical">Love</span>
              </motion.h2>
            </motion.div>
          </div>
          <Link
            href="/stories"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            See all stories
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Scrollable stories */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="snap-start shrink-0 w-[260px] sm:w-[280px]"
            >
              <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 h-full">
                {/* Cover image placeholder */}
                <div
                  className={`relative h-40 bg-gradient-to-br ${storyGradients[i % storyGradients.length]} overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  {/* Floating book icon */}
                  <motion.div
                    className="absolute bottom-3 right-3"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    <BookOpen className="h-8 w-8 text-white/80" />
                  </motion.div>
                  {/* Premium badge */}
                  {story.premium && (
                    <Badge className="absolute top-3 left-3 bg-magical-amber text-white border-0 text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {/* Age range */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                    Ages {story.ageMin}-{story.ageMax}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                    {story.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {story.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-magical-amber fill-magical-amber" />
                        {story.rating.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {(story.readCount / 1000).toFixed(1)}k
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {story.duration}m
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile see all link */}
        <div className="mt-4 sm:hidden text-center">
          <Link
            href="/stories"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            See all stories
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </AnimatedSection>
  )
}

/* ============================================
   CATEGORIES SECTION
   ============================================ */
const categoryColors: Record<string, string> = {
  Adventure: 'from-amber-400 to-orange-500',
  Fantasy: 'from-violet-400 to-purple-500',
  Bedtime: 'from-purple-400 to-indigo-400',
  Educational: 'from-teal-400 to-emerald-500',
  Animals: 'from-rose-400 to-pink-500',
  Mystery: 'from-orange-400 to-red-400',
  'Science Fiction': 'from-cyan-400 to-teal-500',
  'Fairy Tales': 'from-pink-400 to-rose-400',
  Nature: 'from-green-400 to-emerald-500',
  Music: 'from-fuchsia-400 to-purple-500',
}

function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <AnimatedSection className="py-20 lg:py-28 gradient-magical-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={staggerItem} className="flex items-center justify-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Explore
              </span>
            </motion.div>
            <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-bold text-foreground">
              Find the Perfect{' '}
              <span className="text-gradient-magical">Story Category</span>
            </motion.h2>
            <motion.p variants={staggerItem} className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Browse our magical library by category — from thrilling adventures to
              soothing bedtime tales.
            </motion.p>
          </motion.div>
        </div>

        {/* Category grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={staggerItem}>
              <Card className="group cursor-pointer border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 overflow-hidden h-full">
                <CardContent className="p-5 text-center">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                      categoryColors[cat.name] || 'from-primary to-primary/60'
                    } flex items-center justify-center mx-auto mb-3 text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {cat.icon || '📚'}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {cat.storyCount} {cat.storyCount === 1 ? 'story' : 'stories'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  )
}

/* ============================================
   HOW IT WORKS SECTION
   ============================================ */
const steps = [
  {
    icon: BookOpen,
    title: 'Choose a Story',
    description: 'Browse our magical library of curated stories for every age and interest.',
    color: 'from-violet-400 to-purple-500',
    emoji: '📖',
  },
  {
    icon: Zap,
    title: 'Read & Explore',
    description: 'Dive into interactive reading experiences with beautiful illustrations and audio.',
    color: 'from-amber-400 to-orange-500',
    emoji: '✨',
  },
  {
    icon: Share2,
    title: 'Save & Share',
    description: 'Build your collection, track progress, and share the magic with family.',
    color: 'from-teal-400 to-emerald-500',
    emoji: '💝',
  },
]

function HowItWorksSection() {
  return (
    <AnimatedSection className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={staggerItem} className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-magical-amber" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Simple & Magical
              </span>
            </motion.div>
            <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-bold text-foreground">
              How StoryNest{' '}
              <span className="text-gradient-magical">Works</span>
            </motion.h2>
          </motion.div>
        </div>

        {/* Steps */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {steps.map((step, i) => (
            <motion.div key={step.title} variants={staggerItem} className="relative text-center">
              {/* Connector line (hidden on mobile) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px border-t-2 border-dashed border-primary/20" />
              )}

              {/* Step number */}
              <div className="relative inline-block mb-6">
                <div
                  className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform`}
                >
                  <span className="text-4xl">{step.emoji}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-magical text-white text-sm font-bold flex items-center justify-center shadow-lg">
                  {i + 1}
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  )
}

/* ============================================
   TESTIMONIALS SECTION
   ============================================ */
function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <AnimatedSection className="py-20 lg:py-28 gradient-magical-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={staggerItem} className="flex items-center justify-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-magical-rose" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Loved by Families
              </span>
            </motion.div>
            <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-bold text-foreground">
              What Parents{' '}
              <span className="text-gradient-magical">Say</span>
            </motion.h2>
          </motion.div>
        </div>

        {/* Testimonial cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div key={t.id} variants={staggerItem}>
              <Card className="glass border-border/30 hover:border-primary/20 transition-all duration-300 hover:shadow-lg h-full">
                <CardContent className="p-6">
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < t.rating
                            ? 'text-magical-amber fill-magical-amber'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="relative mb-4">
                    <Quote className="absolute -top-1 -left-1 h-5 w-5 text-primary/20 rotate-180" />
                    <p className="text-sm text-foreground/80 leading-relaxed pl-4">
                      {t.content}
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-white font-semibold text-sm">
                      {t.avatar || t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  )
}

/* ============================================
   PRICING SECTION
   ============================================ */
const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect to get started with StoryNest',
    features: [
      '5 stories per month',
      'Basic categories access',
      'Standard reading experience',
      'Single child profile',
      'Community support',
    ],
    cta: 'Get Started Free',
    popular: false,
    gradient: '',
  },
  {
    name: 'Monthly',
    price: '$4.99',
    period: '/month',
    description: 'Unlimited magical adventures for your little one',
    features: [
      'Unlimited stories',
      'All categories access',
      'Interactive reading experience',
      'Up to 5 child profiles',
      'Audio narration',
      'Offline reading',
      'Progress tracking',
      'Priority support',
    ],
    cta: 'Start Monthly Plan',
    popular: true,
    gradient: 'gradient-magical',
  },
  {
    name: 'Yearly',
    price: '$39.99',
    period: '/year',
    description: 'Best value — save 33% with annual billing',
    features: [
      'Everything in Monthly',
      'Early access to new stories',
      'Custom story requests',
      'Unlimited child profiles',
      'Family sharing',
      'Printable activities',
      'Ad-free experience',
      'Dedicated support',
    ],
    cta: 'Start Yearly Plan',
    popular: false,
    gradient: '',
  },
]

function PricingSection() {
  return (
    <AnimatedSection id="pricing" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={staggerItem} className="flex items-center justify-center gap-2 mb-3">
              <Crown className="h-5 w-5 text-magical-amber" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Simple Pricing
              </span>
            </motion.div>
            <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-bold text-foreground">
              Choose Your{' '}
              <span className="text-gradient-magical">Adventure Plan</span>
            </motion.h2>
            <motion.p variants={staggerItem} className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Start free and upgrade when you&apos;re ready. Cancel anytime.
            </motion.p>
          </motion.div>
        </div>

        {/* Pricing cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={staggerItem}>
              <Card
                className={`relative overflow-hidden h-full transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? 'border-primary/50 shadow-lg shadow-primary/10 scale-[1.02] md:scale-105'
                    : 'border-border/50 hover:border-primary/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 gradient-magical" />
                )}
                <CardContent className="p-6 lg:p-8 flex flex-col h-full">
                  {plan.popular && (
                    <Badge className="w-fit mb-4 gradient-magical text-white border-0">
                      Most Popular ✨
                    </Badge>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm ml-1">
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-foreground/80"
                      >
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'gradient-magical text-white border-0 hover:opacity-90 shadow-lg shadow-primary/20'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    } transition-all`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  )
}

/* ============================================
   FAQ SECTION
   ============================================ */
const faqs = [
  {
    question: 'What ages is StoryNest designed for?',
    answer:
      'StoryNest is designed for children ages 3 to 12. Our stories are categorized by age range, so you can easily find age-appropriate content. Each story clearly displays its recommended age range.',
  },
  {
    question: 'Is StoryNest safe for children?',
    answer:
      'Absolutely! Safety is our top priority. All stories are reviewed by our editorial team, and we are fully COPPA compliant. We never show ads to children, and all content is age-appropriate and educational.',
  },
  {
    question: 'Can I try StoryNest for free?',
    answer:
      'Yes! Our free plan gives you access to 5 stories per month with basic features. No credit card required. You can upgrade anytime to unlock unlimited stories and premium features.',
  },
  {
    question: 'How does the reading experience work?',
    answer:
      'Our interactive reading experience includes beautiful illustrations, optional audio narration, and progress tracking. Children can read at their own pace, and parents can monitor reading activity through the dashboard.',
  },
  {
    question: 'Can I create profiles for multiple children?',
    answer:
      'Yes! The Monthly plan supports up to 5 child profiles, and the Yearly plan offers unlimited profiles. Each child gets their own personalized reading experience with age-appropriate recommendations.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Of course! You can cancel your subscription at any time with no questions asked. You\'ll continue to have access until the end of your billing period. No hidden fees or cancellation charges.',
  },
]

function FAQSection() {
  return (
    <AnimatedSection className="py-20 lg:py-28 gradient-magical-soft">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={staggerItem} className="flex items-center justify-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Got Questions?
              </span>
            </motion.div>
            <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-bold text-foreground">
              Frequently Asked{' '}
              <span className="text-gradient-magical">Questions</span>
            </motion.h2>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass border-border/30">
            <CardContent className="p-2 sm:p-4">
              <Accordion type="single" collapsible className="w-full" suppressHydrationWarning>
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatedSection>
  )
}

/* ============================================
   CTA SECTION
   ============================================ */
function CTASection() {
  return (
    <AnimatedSection className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-cta p-8 sm:p-12 lg:p-16 text-center">
          {/* Decorative elements */}
          <motion.div
            className="absolute top-4 left-8 text-3xl opacity-30"
            animate={{ y: [-5, 5, -5], rotate: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute bottom-4 right-8 text-3xl opacity-30"
            animate={{ y: [5, -5, 5], rotate: [5, -5, 5] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            📚
          </motion.div>
          <motion.div
            className="absolute top-1/2 right-[15%] text-2xl opacity-20"
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            🌟
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Start Your Story Journey
              <br />
              Today
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
              Join 50,000+ families already creating magical reading moments.
              Free to start — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 shadow-xl text-base px-8 py-6 h-auto font-bold"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Sign Up Free
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/stories">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 text-base px-8 py-6 h-auto"
                  >
                    View All Stories
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  )
}

/* ============================================
   MAIN LANDING PAGE CLIENT COMPONENT
   ============================================ */
export default function LandingPageClient({
  stories,
  categories,
  testimonials,
}: {
  stories: Story[]
  categories: Category[]
  testimonials: Testimonial[]
}) {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeaturedStoriesSection stories={stories} />
      <CategoriesSection categories={categories} />
      <HowItWorksSection />
      <TestimonialsSection testimonials={testimonials} />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  )
}
