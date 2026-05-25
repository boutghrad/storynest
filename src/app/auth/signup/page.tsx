'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
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
  Sun,
  Heart,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [agreements, setAgreements] = useState({
    ageVerification: false,
    terms: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Client-side validation
    if (!form.name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!form.email.trim()) {
      setError('Please enter your email')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!agreements.ageVerification) {
      setError('Please confirm you are at least 18 years old')
      return
    }

    if (!agreements.terms) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setSuccess('Account created successfully! Redirecting...')

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

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-teal-600 via-emerald-500 to-amber-500 lg:flex">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {[
            { w: 40, h: 40, l: 8, t: 15, x: 6, dur: 4.1, del: 0.2 },
            { w: 55, h: 55, l: 70, t: 30, x: -7, dur: 3.6, del: 0.9 },
            { w: 30, h: 30, l: 40, t: 60, x: 4, dur: 4.9, del: 1.3 },
            { w: 48, h: 48, l: 85, t: 80, x: -3, dur: 3.3, del: 0.6 },
            { w: 35, h: 35, l: 20, t: 45, x: 8, dur: 5.1, del: 1.7 },
            { w: 60, h: 60, l: 55, t: 10, x: -5, dur: 3.8, del: 0.4 },
            { w: 25, h: 25, l: 90, t: 55, x: 3, dur: 4.5, del: 1.1 },
            { w: 42, h: 42, l: 15, t: 85, x: -9, dur: 3.4, del: 1.5 },
            { w: 50, h: 50, l: 65, t: 70, x: 5, dur: 4.7, del: 0.7 },
            { w: 38, h: 38, l: 35, t: 25, x: -6, dur: 3.9, del: 1.0 },
            { w: 45, h: 45, l: 78, t: 5, x: 2, dur: 5.3, del: 0.3 },
            { w: 28, h: 28, l: 5, t: 50, x: -4, dur: 4.2, del: 1.6 },
            { w: 52, h: 52, l: 50, t: 40, x: 7, dur: 3.7, del: 0.8 },
            { w: 33, h: 33, l: 82, t: 95, x: -8, dur: 4.4, del: 1.4 },
            { w: 58, h: 58, l: 25, t: 70, x: 3, dur: 3.1, del: 0.5 },
            { w: 22, h: 22, l: 60, t: 88, x: -2, dur: 5.0, del: 1.9 },
            { w: 44, h: 44, l: 95, t: 38, x: 9, dur: 3.5, del: 0.1 },
            { w: 36, h: 36, l: 12, t: 30, x: -5, dur: 4.8, del: 1.2 },
            { w: 48, h: 48, l: 45, t: 95, x: 4, dur: 3.2, del: 0.6 },
            { w: 30, h: 30, l: 72, t: 50, x: -6, dur: 4.6, del: 1.8 },
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
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold">Join StoryNest</h1>
            <p className="mt-3 text-lg text-white/80">
              Unlock a world of magical stories for your family
            </p>

            <div className="mt-10 space-y-4">
              {[
                { icon: BookOpen, text: 'Unlimited access to 10,000+ stories' },
                { icon: Shield, text: 'Safe, ad-free reading environment' },
                { icon: Star, text: 'Personalized recommendations' },
                { icon: Heart, text: 'Multiple child profiles included' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="flex items-center gap-3 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-white/90">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="absolute right-10 top-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <Sun className="h-10 w-10 text-white/20" />
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-teal-50/30 via-white to-amber-50/30 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
              <Sparkles className="h-7 w-7" />
            </div>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <h2 className="text-2xl font-bold">Create Account</h2>
              <CardDescription>
                Start your storytelling journey today
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
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="signupPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password (min. 6 characters)"
                      value={form.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className="h-11 pr-10"
                      required
                      minLength={6}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        updateField('confirmPassword', e.target.value)
                      }
                      className="h-11 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="ageVerification"
                      checked={agreements.ageVerification}
                      onCheckedChange={(checked) =>
                        setAgreements((prev) => ({
                          ...prev,
                          ageVerification: checked === true,
                        }))
                      }
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="ageVerification"
                      className="text-xs leading-tight text-muted-foreground"
                    >
                      I confirm I am at least 18 years old and creating this
                      account for a child
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreements.terms}
                      onCheckedChange={(checked) =>
                        setAgreements((prev) => ({
                          ...prev,
                          terms: checked === true,
                        }))
                      }
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="terms"
                      className="text-xs leading-tight text-muted-foreground"
                    >
                      I agree to the{' '}
                      <span className="text-teal-600 hover:underline cursor-pointer">
                        Terms of Service
                      </span>{' '}
                      and{' '}
                      <span className="text-teal-600 hover:underline cursor-pointer">
                        Privacy Policy
                      </span>
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                    />
                  ) : (
                    'Create Account'
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
                      setError('Google sign-up is coming soon!')
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
                  Sign up with Google
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="font-medium text-teal-600 hover:text-teal-700"
                  >
                    Sign in
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
