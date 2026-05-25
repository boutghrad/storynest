'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  BookOpen,
  Eye,
  DollarSign,
  TrendingUp,
  Shield,
  MoreHorizontal,
  Activity,
  Clock,
  UserPlus,
  FileText,
  Star,
} from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { DataTable } from '@/components/admin/DataTable'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock data
const mockStats = {
  totalUsers: 12458,
  totalStories: 3247,
  totalReads: 892341,
  revenue: 24890.5,
  totalAuthors: 342,
  publishedStories: 2891,
  premiumStories: 456,
  activeSubscriptions: 2491,
}

const mockUsers = [
  { id: 'u1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user', joined: '2025-01-15', subscription: 'Explorer', status: 'active' },
  { id: 'u2', name: 'Mike Chen', email: 'mike@example.com', role: 'author', joined: '2025-02-03', subscription: 'Family', status: 'active' },
  { id: 'u3', name: 'Emily Davis', email: 'emily@example.com', role: 'user', joined: '2025-02-20', subscription: 'Free', status: 'active' },
  { id: 'u4', name: 'Alex Rivera', email: 'alex@example.com', role: 'user', joined: '2025-03-01', subscription: 'Explorer', status: 'suspended' },
  { id: 'u5', name: 'Jordan Lee', email: 'jordan@example.com', role: 'admin', joined: '2024-11-10', subscription: 'Family', status: 'active' },
  { id: 'u6', name: 'Casey Morgan', email: 'casey@example.com', role: 'author', joined: '2025-03-15', subscription: 'Family', status: 'active' },
  { id: 'u7', name: 'Taylor Swift', email: 'taylor@example.com', role: 'user', joined: '2025-04-01', subscription: 'Free', status: 'active' },
  { id: 'u8', name: 'Robin Williams', email: 'robin@example.com', role: 'user', joined: '2025-04-12', subscription: 'Explorer', status: 'active' },
]

const mockStories = [
  { id: 's1', title: 'The Dragon\'s Lullaby', author: 'Elena Starweaver', status: 'published', reads: 12450, rating: 4.8 },
  { id: 's2', title: 'Starlight Adventures', author: 'Mike Chen', status: 'published', reads: 8920, rating: 4.5 },
  { id: 's3', title: 'The Magic Garden', author: 'Iris Prism', status: 'draft', reads: 0, rating: 0 },
  { id: 's4', title: 'Ocean Tales', author: 'Marina Waves', status: 'published', reads: 6780, rating: 4.6 },
  { id: 's5', title: 'Rainbow Riders', author: 'Casey Morgan', status: 'published', reads: 5430, rating: 4.3 },
  { id: 's6', title: 'Cloud Castles', author: 'Sky Stormwright', status: 'draft', reads: 0, rating: 0 },
]

const userGrowthData = [
  { month: 'Jan', users: 1200 },
  { month: 'Feb', users: 2100 },
  { month: 'Mar', users: 3400 },
  { month: 'Apr', users: 4800 },
  { month: 'May', users: 6200 },
  { month: 'Jun', users: 7800 },
  { month: 'Jul', users: 8900 },
  { month: 'Aug', users: 9800 },
  { month: 'Sep', users: 10500 },
  { month: 'Oct', users: 11200 },
  { month: 'Nov', users: 11900 },
  { month: 'Dec', users: 12458 },
]

const categoryReadsData = [
  { category: 'Fantasy', reads: 45000 },
  { category: 'Adventure', reads: 38000 },
  { category: 'Fairy Tale', reads: 32000 },
  { category: 'Sci-Fi', reads: 28000 },
  { category: 'Mystery', reads: 22000 },
  { category: 'Education', reads: 18000 },
]

const subscriptionData = [
  { name: 'Free', value: 7200, color: '#a1a1aa' },
  { name: 'Explorer', value: 3200, color: '#f59e0b' },
  { name: 'Family', value: 2058, color: '#14b8a6' },
]

const recentActivity = [
  { id: 'a1', type: 'user', message: 'New user Sarah Johnson signed up', time: '2 min ago', icon: UserPlus },
  { id: 'a2', type: 'story', message: 'Story "The Dragon\'s Lullaby" reached 10K reads', time: '15 min ago', icon: FileText },
  { id: 'a3', type: 'subscription', message: 'Mike Chen upgraded to Family plan', time: '1 hour ago', icon: DollarSign },
  { id: 'a4', type: 'story', message: 'New story "Ocean Tales" published', time: '2 hours ago', icon: FileText },
  { id: 'a5', type: 'user', message: 'Casey Morgan became an author', time: '3 hours ago', icon: UserPlus },
  { id: 'a6', type: 'subscription', message: 'Emily Davis upgraded to Explorer', time: '5 hours ago', icon: DollarSign },
  { id: 'a7', type: 'review', message: 'New 5-star review on "Starlight Adventures"', time: '6 hours ago', icon: Star },
  { id: 'a8', type: 'user', message: 'Alex Rivera account suspended', time: '8 hours ago', icon: Shield },
]

const userColumns = [
  {
    key: 'name',
    header: 'Name',
    render: (item: Record<string, unknown>) => (
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-rose-400 text-xs text-white font-medium">
          {String(item.name as string).charAt(0)}
        </div>
        <span className="font-medium">{String(item.name)}</span>
      </div>
    ),
  },
  { key: 'email', header: 'Email' },
  {
    key: 'role',
    header: 'Role',
    render: (item: Record<string, unknown>) => (
      <Badge
        variant="secondary"
        className={cn(
          'text-xs',
          item.role === 'admin' && 'bg-purple-100 text-purple-700',
          item.role === 'author' && 'bg-amber-100 text-amber-700',
          item.role === 'user' && 'bg-teal-100 text-teal-700'
        )}
      >
        {String(item.role)}
      </Badge>
    ),
  },
  {
    key: 'joined',
    header: 'Joined',
    render: (item: Record<string, unknown>) =>
      new Date(String(item.joined)).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
  },
  {
    key: 'subscription',
    header: 'Plan',
    render: (item: Record<string, unknown>) => (
      <Badge
        variant="outline"
        className={cn(
          'text-xs',
          item.subscription === 'Family' && 'border-teal-300 text-teal-700',
          item.subscription === 'Explorer' && 'border-amber-300 text-amber-700',
          item.subscription === 'Free' && 'border-zinc-300 text-zinc-600'
        )}
      >
        {String(item.subscription)}
      </Badge>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (item: Record<string, unknown>) => (
      <Badge
        variant="secondary"
        className={cn(
          'text-xs',
          item.status === 'active' && 'bg-emerald-100 text-emerald-700',
          item.status === 'suspended' && 'bg-rose-100 text-rose-700'
        )}
      >
        {String(item.status)}
      </Badge>
    ),
  },
  {
    key: 'actions',
    header: '',
    render: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Profile</DropdownMenuItem>
          <DropdownMenuItem>Edit Role</DropdownMenuItem>
          <DropdownMenuItem className="text-rose-600">Suspend User</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

const storyColumns = [
  {
    key: 'title',
    header: 'Title',
    render: (item: Record<string, unknown>) => (
      <span className="font-medium">{String(item.title)}</span>
    ),
  },
  { key: 'author', header: 'Author' },
  {
    key: 'status',
    header: 'Status',
    render: (item: Record<string, unknown>) => (
      <Badge
        variant="secondary"
        className={cn(
          'text-xs',
          item.status === 'published' && 'bg-emerald-100 text-emerald-700',
          item.status === 'draft' && 'bg-amber-100 text-amber-700'
        )}
      >
        {String(item.status)}
      </Badge>
    ),
  },
  {
    key: 'reads',
    header: 'Reads',
    render: (item: Record<string, unknown>) =>
      (item.reads as number).toLocaleString(),
  },
  {
    key: 'rating',
    header: 'Rating',
    render: (item: Record<string, unknown>) => {
      const rating = item.rating as number
      return rating > 0 ? (
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm">{rating}</span>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">N/A</span>
      )
    },
  },
  {
    key: 'actions',
    header: '',
    render: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit Story</DropdownMenuItem>
          <DropdownMenuItem>Publish / Unpublish</DropdownMenuItem>
          <DropdownMenuItem className="text-rose-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <AdminSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-rose-500 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your StoryNest platform
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Stats Overview */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatsCard
              title="Total Users"
              value={mockStats.totalUsers.toLocaleString()}
              icon={Users}
              gradient="from-purple-500/10 to-violet-500/5"
              iconBg="bg-purple-100 text-purple-600"
              trend={{ value: 18, label: 'vs last month' }}
              delay={0}
            />
            <StatsCard
              title="Total Stories"
              value={mockStats.totalStories.toLocaleString()}
              icon={BookOpen}
              gradient="from-amber-500/10 to-orange-500/5"
              iconBg="bg-amber-100 text-amber-600"
              trend={{ value: 12, label: 'vs last month' }}
              delay={0.1}
            />
            <StatsCard
              title="Total Reads"
              value={`${(mockStats.totalReads / 1000).toFixed(0)}K`}
              icon={Eye}
              gradient="from-teal-500/10 to-emerald-500/5"
              iconBg="bg-teal-100 text-teal-600"
              trend={{ value: 25, label: 'vs last month' }}
              delay={0.2}
            />
            <StatsCard
              title="Revenue"
              value={`$${mockStats.revenue.toLocaleString()}`}
              icon={DollarSign}
              gradient="from-rose-500/10 to-pink-500/5"
              iconBg="bg-rose-100 text-rose-600"
              trend={{ value: 15, label: 'vs last month' }}
              delay={0.3}
            />
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="flex-wrap">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="stories">Stories</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* User Growth Chart */}
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base">User Growth</CardTitle>
                      <CardDescription>Monthly user registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 sm:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="users"
                              stroke="#8b5cf6"
                              strokeWidth={2.5}
                              dot={{ fill: '#8b5cf6', r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Category Reads Chart */}
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base">Reads by Category</CardTitle>
                      <CardDescription>Story reads breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 sm:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryReadsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              }}
                            />
                            <Bar dataKey="reads" radius={[6, 6, 0, 0]}>
                              {categoryReadsData.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={[
                                    '#8b5cf6',
                                    '#f59e0b',
                                    '#14b8a6',
                                    '#f43f5e',
                                    '#6366f1',
                                    '#06b6d4',
                                  ][index % 6]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Subscription Breakdown + Activity */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base">Subscription Breakdown</CardTitle>
                      <CardDescription>Current plan distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 sm:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={subscriptionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={4}
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {subscriptionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity Mini */}
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Activity className="h-4 w-4 text-purple-500" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-72 space-y-3 overflow-y-auto pr-2">
                        {recentActivity.slice(0, 6).map((activity, i) => (
                          <div
                            key={activity.id}
                            className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                              <activity.icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm leading-tight">{activity.message}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">User Management</CardTitle>
                    <CardDescription>Manage and monitor platform users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      data={mockUsers as unknown as Record<string, unknown>[]}
                      columns={userColumns}
                      searchPlaceholder="Search users by name..."
                      searchKey="name"
                      emptyMessage="No users found."
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Stories Tab */}
              <TabsContent value="stories">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">Story Management</CardTitle>
                    <CardDescription>Manage and moderate stories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      data={mockStories as unknown as Record<string, unknown>[]}
                      columns={storyColumns}
                      searchPlaceholder="Search stories by title..."
                      searchKey="title"
                      emptyMessage="No stories found."
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">Activity Timeline</CardTitle>
                    <CardDescription>Recent platform events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative space-y-0">
                      {recentActivity.map((activity, i) => (
                        <div key={activity.id} className="flex gap-4 pb-6 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                              <activity.icon className="h-4 w-4" />
                            </div>
                            {i < recentActivity.length - 1 && (
                              <div className="mt-1 h-full w-px bg-border" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5">
                            <p className="text-sm">{activity.message}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
