'use client'

import Link from 'next/link'
import { BookOpen, Sparkles, Heart, Mail, Twitter, Instagram, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'

const platformLinks = [
  { href: '/stories', label: 'Browse Stories' },
  { href: '/#categories', label: 'Categories' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/creator', label: 'For Authors' },
]

const supportLinks = [
  { href: '/', label: 'Help Center' },
  { href: '/', label: 'Safety Guide' },
  { href: '/', label: 'Contact Us' },
  { href: '/', label: 'Community' },
]

const legalLinks = [
  { href: '/', label: 'Privacy Policy' },
  { href: '/', label: 'Terms of Service' },
  { href: '/', label: 'COPPA Compliance' },
  { href: '/', label: 'Cookie Policy' },
]

const socialLinks = [
  { href: '/', icon: Twitter, label: 'Twitter' },
  { href: '/', icon: Instagram, label: 'Instagram' },
  { href: '/', icon: Youtube, label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="relative mt-auto">
      {/* Gradient top border */}
      <div className="h-1 gradient-magical" />

      <div className="bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 group mb-4">
                <BookOpen className="h-7 w-7 text-primary animate-float-slow" />
                <span className="text-xl font-bold text-gradient-magical">
                  StoryNest
                </span>
                <Sparkles className="h-4 w-4 text-magical-amber animate-twinkle" />
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
                A magical world where stories come alive. Spark your child&apos;s
                imagination with our curated library of enchanting tales, interactive
                adventures, and bedtime favorites.
              </p>

              {/* Newsletter */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Get magical stories in your inbox ✨
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="parent@email.com"
                    className="flex-1 bg-background/50 border-border/50 focus:border-primary/50"
                  />
                  <Button
                    size="sm"
                    className="gradient-magical text-white border-0 hover:opacity-90 shrink-0"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Platform
              </h3>
              <ul className="space-y-3">
                {platformLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                Made with{' '}
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" />
                </motion.span>{' '}
                for little readers &copy; {new Date().getFullYear()} StoryNest
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
