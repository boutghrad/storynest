'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  BookOpen,
  Sparkles,
  Star,
  Moon,
  Heart,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    if (!password) {
      setError('Please enter your password')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid email or password')
        return
      }

      setSuccess('Welcome back! Redirecting...')

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding / Illustration */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-rose-500 lg:flex">
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {[
            { w: 45, h: 45, l: 12, t: 8, x: 5, dur: 4.2, del: 0.1 },
            { w: 30, h: 30, l: 75, t: 22, x: -8, dur: 3.5, del: 0.8 },
            { w: 60, h: 60, l: 45, t: 55, x: 3, dur: 5.0, del: 1.4 },
            { w: 25, h: 25, l: 88, t: 70, x: -4, dur: 3.8, del: 0.5 },
            { w: 50, h: 50, l: 30, t: 85, x: 7, dur: 4.6, del: 1.9 },
            { w: 35, h: 35, l: 60, t: 35, x: -6, dur: 3.2, del: 0.3 },
            { w: 40, h: 40, l: 5, t: 60, x: 4, dur: 4.8, del: 1.1 },
            { w: 55, h: 55, l: 80, t: 45, x: -3, dur: 3.6, del: 1.6 },
            { w: 28, h: 28, l: 50, t: 10, x: 9, dur: 5.2, del: 0.7 },
            { w: 42, h: 42, l: 20, t: 40, x: -5, dur: 4.0, del: 1.3 },
            { w: 38, h: 38, l: 70, t: 90, x: 6, dur: 3.4, del: 0.9 },
            { w: 52, h: 52, l: 35, t: 15, x: -7, dur: 4.4, del: 1.7 },
            { w: 22, h: 22, l: 92, t: 30, x: 2, dur: 5.5, del: 0.4 },
            { w: 48, h: 48, l: 15, t: 75, x: -9, dur: 3.9, del: 1.0 },
            { w: 33, h: 33, l: 55, t: 65, x: 8, dur: 4.1, del: 0.6 },
            { w: 58, h: 58, l: 40, t: 50, x: -2, dur: 3.3, del: 1.5 },
            { w: 27, h: 27, l: 85, t: 5, x: 5, dur: 4.7, del: 1.8 },
            { w: 44, h: 44, l: 65, t: 80, x: -4, dur: 3.7, del: 0.2 },
            { w: 36, h: 36, l: 10, t: 45, x: 3, dur: 5.1, del: 1.2 },
            { w: 50, h: 50, l: 25, t: 25, x: -6, dur: 4.3, del: 0.8 },
          ].map((b, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: b.w,
                height: b.h,
                left: `${b.l}%`,
                top: `${b.t}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, b.x, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: b.dur,
                repeat: Infinity,
                delay: b.del,
              }}
            />
          ))}
        </motion.div>

        <div className="relative z-10 max-w-md px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm p-2">
              <Image
                src="/logo.png"
                alt="StoryNest"
                width={64}
                height={64}
                className="rounded-xl"
              />
            </div>
            <h1 className="text-4xl font-bold">StoryNest</h1>
            <p className="mt-3 text-lg text-white/80">
              Where every story sparks imagination
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm">
                <Star className="h-4 w-4 text-amber-300" />
                <span>10K+ Stories</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm">
                <Heart className="h-4 w-4 text-rose-300" />
                <span>50K+ Families</span>
              </div>
            </div>
          </motion.div>

          {/* Decorative icons */}
          <motion.div
            className="absolute left-10 top-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Moon className="h-8 w-8 text-white/20" />
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-10"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="h-10 w-10 text-white/20" />
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-purple-50/30 via-white to-amber-50/30 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <Image
              src="/logo.png"
              alt="StoryNest"
              width={56}
              height={56}
              className="rounded-xl"
            />
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <h2 className="text-2xl font-bold">Welcome Back!</h2>
              <CardDescription>
                Sign in to continue your story adventure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Success message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {success}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/signup"
                      className="text-xs text-purple-600 hover:text-purple-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (error) setError('')
                      }}
                      className="h-11 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(checked) => setRemember(checked === true)}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Remember me
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full bg-gradient-to-r from-purple-500 to-rose-500 text-white hover:from-purple-600 hover:to-rose-600"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                    />
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="relative flex items-center py-2">
                  <Separator className="flex-1" />
                  <span className="mx-4 text-xs text-muted-foreground">or</span>
                  <Separator className="flex-1" />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full"
                  onClick={() => {
                    setLoading(true)
                    // Placeholder for Google OAuth integration
                    setTimeout(() => {
                      setLoading(false)
                      setError('Google sign-in is coming soon!')
                    }, 1500)
                  }}
                  disabled={loading}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/auth/signup"
                    className="font-medium text-purple-600 hover:text-purple-700"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
