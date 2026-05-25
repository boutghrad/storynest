'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Check,
  X,
  Sparkles,
  Crown,
  Star,
  BookOpen,
  Users,
  Download,
  Heart,
  Shield,
  Zap,
  MessageCircle,
  HelpCircle,
} from 'lucide-react'

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out StoryNest',
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: BookOpen,
    gradient: 'from-zinc-100 to-zinc-50',
    iconBg: 'bg-zinc-100 text-zinc-600',
    buttonVariant: 'outline' as const,
    popular: false,
    features: [
      { text: '5 stories per month', included: true },
      { text: 'Basic story categories', included: true },
      { text: '1 child profile', included: true },
      { text: 'Standard quality audio', included: true },
      { text: 'Ads supported', included: true },
      { text: 'Bookmarks', included: false },
      { text: 'Offline reading', included: false },
      { text: 'Multiple child profiles', included: false },
    ],
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Unlimited stories for avid readers',
    monthlyPrice: 4.99,
    yearlyPrice: 39.99,
    icon: Star,
    gradient: 'from-amber-50 to-orange-50',
    iconBg: 'bg-amber-100 text-amber-600',
    buttonGradient: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600',
    popular: true,
    features: [
      { text: 'Unlimited stories', included: true },
      { text: 'All story categories', included: true },
      { text: '3 child profiles', included: true },
      { text: 'HD quality audio', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Bookmarks & highlights', included: true },
      { text: 'Priority new releases', included: true },
      { text: 'Offline reading', included: false },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    description: 'The complete family experience',
    monthlyPrice: 9.99,
    yearlyPrice: 79.99,
    icon: Crown,
    gradient: 'from-teal-50 to-emerald-50',
    iconBg: 'bg-teal-100 text-teal-600',
    buttonGradient: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600',
    popular: false,
    features: [
      { text: 'Unlimited stories', included: true },
      { text: 'All story categories', included: true },
      { text: '5 child profiles', included: true },
      { text: 'HD quality audio', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Bookmarks & highlights', included: true },
      { text: 'Offline reading', included: true },
      { text: 'Exclusive premium stories', included: true },
    ],
  },
]

const comparisonFeatures = [
  { name: 'Stories per month', free: '5', explorer: 'Unlimited', family: 'Unlimited' },
  { name: 'Child profiles', free: '1', explorer: '3', family: '5' },
  { name: 'Audio quality', free: 'Standard', explorer: 'HD', family: 'HD' },
  { name: 'Ad-free', free: false, explorer: true, family: true },
  { name: 'Bookmarks', free: false, explorer: true, family: true },
  { name: 'Offline reading', free: false, explorer: false, family: true },
  { name: 'Premium stories', free: false, explorer: false, family: true },
  { name: 'Priority releases', free: false, explorer: true, family: true },
  { name: 'Reading analytics', free: false, explorer: true, family: true },
  { name: 'Custom avatars', free: false, explorer: false, family: true },
]

const faqs = [
  {
    question: 'Can I switch plans at any time?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.',
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Absolutely! Both Explorer and Family plans come with a 7-day free trial. No credit card required to start.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
  },
  {
    question: 'What ages are the stories appropriate for?',
    answer: 'Our stories are designed for children ages 2-14, with age-appropriate content labels on each story. Parents can set age filters for each child profile.',
  },
  {
    question: 'How does offline reading work?',
    answer: 'Family plan members can download stories for offline reading. Downloaded stories are available in the app even without an internet connection.',
  },
  {
    question: 'Is StoryNest COPPA compliant?',
    answer: 'Yes, StoryNest is fully COPPA compliant. We take children\'s privacy seriously and never collect personal information from children without parental consent.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/40 via-white to-amber-50/40">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-7xl px-4 pt-12 pb-8 text-center sm:px-6 sm:pt-16 sm:pb-12 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700"
          >
            <Sparkles className="h-4 w-4" />
            Simple, transparent pricing
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Adventure Plan
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Unlock magical stories for your little ones. Every plan comes with a 7-day free trial.
          </p>

          {/* Annual Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              className={cn(
                'text-sm font-medium',
                !annual ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              Monthly
            </span>
            <Switch
              checked={annual}
              onCheckedChange={setAnnual}
              className="data-[state=checked]:bg-teal-500"
            />
            <span
              className={cn(
                'text-sm font-medium',
                annual ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              Annual
            </span>
            {annual && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700"
              >
                Save up to 33%
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute -left-20 top-20 h-40 w-40 rounded-full bg-purple-200/30 blur-3xl" />
        <div className="absolute -right-20 top-20 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-3"
        >
          {plans.map((plan) => {
            const price = annual ? plan.yearlyPrice : plan.monthlyPrice
            const period = annual ? '/year' : '/month'

            return (
              <motion.div key={plan.id} variants={itemVariants}>
                <Card
                  className={cn(
                    'relative overflow-hidden border-0 shadow-lg transition-shadow hover:shadow-xl',
                    plan.popular && 'ring-2 ring-amber-400 shadow-amber-100'
                  )}
                >
                  {plan.popular && (
                    <div className="absolute right-4 top-4">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className={cn('bg-gradient-to-br p-6 pb-2', plan.gradient)}>
                    <div
                      className={cn(
                        'mb-3 flex h-12 w-12 items-center justify-center rounded-xl',
                        plan.iconBg
                      )}
                    >
                      <plan.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <CardContent className="p-6 pt-4">
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">
                          {price === 0 ? 'Free' : `$${price}`}
                        </span>
                        {price > 0 && (
                          <span className="text-sm text-muted-foreground">{period}</span>
                        )}
                      </div>
                      {annual && plan.monthlyPrice > 0 && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          That&apos;s just ${(price / 12).toFixed(2)}/month
                        </p>
                      )}
                    </div>

                    <Button
                      className={cn(
                        'w-full',
                        plan.buttonGradient || 'border-2'
                      )}
                      variant={plan.buttonVariant}
                      size="lg"
                    >
                      {price === 0 ? 'Get Started' : 'Start Free Trial'}
                    </Button>

                    <div className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <div
                          key={feature.text}
                          className="flex items-center gap-2"
                        >
                          {feature.included ? (
                            <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                          ) : (
                            <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                          )}
                          <span
                            className={cn(
                              'text-sm',
                              !feature.included && 'text-muted-foreground/60'
                            )}
                          >
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Annual Savings Callout for Family Plan */}
        {annual && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm text-teal-700 ring-1 ring-teal-200">
              <Crown className="h-4 w-4" />
              Family annual plan saves you ${(9.99 * 12 - 79.99).toFixed(2)} per year!
            </div>
          </motion.div>
        )}

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="mb-6 text-center text-2xl font-bold">Feature Comparison</h2>
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-semibold sm:px-6">
                      Feature
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Free</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      <span className="text-amber-600">Explorer</span>
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      <span className="text-teal-600">Family</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, i) => (
                    <tr
                      key={feature.name}
                      className={cn(
                        'border-t',
                        i % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                      )}
                    >
                      <td className="px-4 py-3 text-sm sm:px-6">{feature.name}</td>
                      {['free', 'explorer', 'family'].map((plan) => {
                        const val = feature[plan as keyof typeof feature]
                        return (
                          <td
                            key={plan}
                            className="px-4 py-3 text-center"
                          >
                            {typeof val === 'boolean' ? (
                              val ? (
                                <Check className="mx-auto h-4 w-4 text-emerald-500" />
                              ) : (
                                <X className="mx-auto h-4 w-4 text-muted-foreground/30" />
                              )
                            ) : (
                              <span className="text-sm font-medium">{val}</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            COPPA Compliant
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            7-Day Free Trial
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-purple-500" />
            24/7 Support
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500" />
            Cancel Anytime
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 mb-16"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need to know about StoryNest
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {faqs.map((faq, i) => (
              <Card
                key={i}
                className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <CardContent className="flex items-start gap-3 p-4 sm:p-5">
                  <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-purple-500" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold sm:text-base">{faq.question}</h3>
                    {expandedFaq === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 text-sm text-muted-foreground leading-relaxed"
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                    className="shrink-0"
                  >
                    <svg
                      className="h-5 w-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-16 text-center"
        >
          <Card className="overflow-hidden border-0 bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 p-[1px]">
            <div className="rounded-xl bg-white p-8 sm:p-12">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ready to start your story adventure? ✨
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Join over 50,000 families who have discovered the magic of StoryNest.
                Start your free trial today — no credit card required.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-rose-500 text-white hover:from-purple-600 hover:to-rose-600"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Free Trial
                </Button>
                <Button variant="outline" size="lg">
                  <Download className="mr-2 h-4 w-4" />
                  Download App
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
