'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Search,
  Sun,
  Moon,
  Menu,
  User,
  LogIn,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/stories', label: 'Stories' },
  { href: '/pricing', label: 'Pricing' },
]

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong shadow-lg shadow-primary/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="h-8 w-8 text-primary animate-float" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-magical-amber animate-twinkle" />
            </motion.div>
            <span className="text-xl font-bold text-gradient-magical">
              StoryNest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors rounded-lg hover:bg-primary/5 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-3/4 rounded-full" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex text-foreground/60 hover:text-foreground hover:bg-primary/5"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-foreground/60 hover:text-foreground hover:bg-primary/5"
              >
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </motion.div>
              </Button>
            )}

            {/* Login / Signup - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-foreground/70 hover:text-foreground hover:bg-primary/5"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="gradient-magical text-white border-0 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sign up free
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-foreground/60 hover:text-foreground"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="text-gradient-magical font-bold">
                      StoryNest
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center px-4 py-3 text-base font-medium text-foreground/70 hover:text-foreground rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="h-px bg-border my-4" />
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="justify-start w-full px-4 text-foreground/70 hover:text-foreground"
                    >
                      <LogIn className="h-4 w-4 mr-3" />
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="gradient-magical text-white border-0 hover:opacity-90 w-full">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Sign up free
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
