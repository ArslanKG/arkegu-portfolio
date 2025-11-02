"use client"

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiUser, FiLogOut, FiSettings, FiBarChart, FiFileText, FiUsers, FiMessageSquare } from 'react-icons/fi'

const AdminDashboard = () => {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: '/admin',
      redirect: true 
    })
  }

  const dashboardStats = [
    {
      title: 'Blog Posts',
      value: '12',
      change: '+2 this week',
      icon: FiFileText,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Total Views',
      value: '2,547',
      change: '+12% this month',
      icon: FiBarChart,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Comments',
      value: '89',
      change: '+5 pending',
      icon: FiMessageSquare,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Admin Users',
      value: '1',
      change: 'Active',
      icon: FiSettings,
      color: 'from-orange-500 to-red-500'
    }
  ]

  const quickActions = [
    {
      title: 'New Blog Post',
      description: 'Create a new blog post',
      icon: FiFileText,
      action: () => router.push('/admin/dashboard/posts/new'),
      color: 'border-blue-500 hover:bg-blue-500/10'
    },
    {
      title: 'Manage Posts',
      description: 'View and edit existing posts',
      icon: FiBarChart,
      action: () => router.push('/admin/dashboard/posts'),
      color: 'border-purple-500 hover:bg-purple-500/10'
    },
    {
      title: 'Comments',
      description: 'Review and moderate comments',
      icon: FiMessageSquare,
      action: () => router.push('/admin/dashboard/comments'),
      color: 'border-green-500 hover:bg-green-500/10'
    },
    {
      title: 'Settings',
      description: 'Configure admin settings',
      icon: FiSettings,
      action: () => router.push('/admin/settings'),
      color: 'border-orange-500 hover:bg-orange-500/10'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-700/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Admin Dashboard
              </h1>
            </motion.div>

            {/* User Info & Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2 text-gray-300">
                <FiUser className="w-4 h-4" />
                <span className="text-sm">
                  Welcome, {session?.user?.name || session?.user?.username}
                </span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
              >
                <FiLogOut className="w-4 h-4" />
                Sign Out
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {session?.user?.name || session?.user?.username}!
          </h2>
          <p className="text-gray-400">
            Manage your portfolio and blog content from this admin panel.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-xl hover:border-gray-600/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                onClick={action.action}
                className={`bg-gray-900/50 border ${action.color} rounded-xl p-6 text-left transition-all duration-300 group`}
              >
                <action.icon className="w-8 h-8 text-gray-400 group-hover:text-white mb-3 transition-colors" />
                <h4 className="text-lg font-medium text-white mb-2">{action.title}</h4>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {action.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity (Placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="text-center py-8">
            <p className="text-gray-400">No recent activity to display</p>
            <p className="text-sm text-gray-500 mt-2">
              Activity will appear here as you use the admin panel
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard