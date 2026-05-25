'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: { value: number; label: string }
  gradient?: string
  iconBg?: string
  delay?: number
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  gradient = 'from-purple-500/10 to-rose-500/10',
  iconBg = 'bg-purple-100 text-purple-600',
  delay = 0,
  className,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        className={cn(
          'relative overflow-hidden border-0 bg-gradient-to-br shadow-lg backdrop-blur-sm',
          gradient,
          className
        )}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-2xl font-bold sm:text-3xl">{value}</p>
              {trend && (
                <p
                  className={cn(
                    'text-xs font-medium',
                    trend.value >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  )}
                >
                  {trend.value >= 0 ? '+' : ''}
                  {trend.value}% {trend.label}
                </p>
              )}
            </div>
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl sm:h-14 sm:w-14',
                iconBg
              )}
            >
              <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
