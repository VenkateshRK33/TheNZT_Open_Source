'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Activity,
  Users,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Clock,
  Star
} from 'lucide-react';
import { useAuthStore } from '@/store/useZustandStore';
import Link from 'next/link';
import ProtectedRoute from '@/components/markdown/ProtectedRoute';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: 'Portfolio Value',
      value: '$124,532',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      bgColor: 'bg-[var(--primary-chart-bg)]'
    },
    {
      title: 'Active Positions',
      value: '23',
      change: '+3',
      trend: 'up', 
      icon: BarChart3,
      bgColor: 'bg-[var(--primary-text-bg)]'
    },
    {
      title: 'Today\'s P&L',
      value: '+$2,847',
      change: '+5.2%',
      trend: 'up',
      icon: TrendingUp,
      bgColor: 'bg-[var(--primary-chart-bg)]'
    },
    {
      title: 'Watchlist Items',
      value: '47',
      change: '+2',
      trend: 'up',
      icon: Activity,
      bgColor: 'bg-[var(--primary-text-bg)]'
    }
  ];

  const recentActivities = [
    { action: 'Bought AAPL', amount: '$5,000', time: '2 hours ago', type: 'buy' },
    { action: 'Sold TSLA', amount: '$3,200', time: '4 hours ago', type: 'sell' },
    { action: 'Added NVDA to watchlist', amount: '', time: '6 hours ago', type: 'watch' },
    { action: 'Analyzed MSFT', amount: '', time: '1 day ago', type: 'analysis' }
  ];

  const topStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$175.43', change: '+2.1%', trend: 'up' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.50', change: '-1.8%', trend: 'down' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$875.28', change: '+4.2%', trend: 'up' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$378.85', change: '+0.9%', trend: 'up' }
  ];

  return (
    <ProtectedRoute>
      <main className="min-h-screen w-full flex flex-col lg:px-0 sm:px-6 px-5 bg-[var(--primary-main-bg)]">
        <div className="max-w-7xl mx-auto w-full py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-color)] mb-2">
                  Welcome back, {user?.full_name || 'User'}! 👋
                </h1>
                <p className="text-[var(--color-neutral-500)] flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link 
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-[#4B9770] text-white rounded-md hover:bg-[#408160] transition-colors duration-200 shadow-sm font-medium"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Start New Chat
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className={`${stat.bgColor} rounded-md p-6 border border-[var(--color-primary-100)] hover:shadow-sm transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-md bg-white/50">
                    <stat.icon className="w-6 h-6 text-[#4B9770]" />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-[#4B9770]' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--text-color)] mb-1">{stat.value}</h3>
                  <p className="text-[var(--color-neutral-500)] text-sm">{stat.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Market Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-[var(--primary-chart-bg)] rounded-md p-6 border border-[var(--color-primary-100)]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--text-color)] flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-[#4B9770]" />
                  Top Performing Stocks
                </h2>
                <Link 
                  href="/technical-analysis"
                  className="text-[#4B9770] hover:text-[#408160] text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {topStocks.map((stock, index) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/50 rounded-md hover:bg-white/70 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#4B9770] rounded-md flex items-center justify-center text-white font-bold text-sm mr-3">
                        {stock.symbol.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--text-color)]">{stock.symbol}</h3>
                        <p className="text-sm text-[var(--color-neutral-500)]">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--text-color)]">{stock.price}</p>
                      <p className={`text-sm flex items-center ${
                        stock.trend === 'up' ? 'text-[#4B9770]' : 'text-red-600'
                      }`}>
                        {stock.trend === 'up' ? (
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                        )}
                        {stock.change}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[var(--primary-text-bg)] rounded-md p-6 border border-[var(--color-primary-100)]"
            >
              <h2 className="text-xl font-bold text-[var(--text-color)] mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-[#4B9770]" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-md hover:bg-white/50 transition-colors duration-200"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      activity.type === 'buy' ? 'bg-[#4B9770]' :
                      activity.type === 'sell' ? 'bg-red-500' :
                      activity.type === 'watch' ? 'bg-blue-500' : 'bg-[var(--color-primary-main)]'
                    }`}>
                      {activity.type === 'buy' ? '↗' : 
                       activity.type === 'sell' ? '↘' :
                       activity.type === 'watch' ? '👁' : '📊'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--text-color)]">{activity.action}</p>
                      {activity.amount && (
                        <p className="text-sm text-[var(--color-neutral-500)]">{activity.amount}</p>
                      )}
                      <p className="text-xs text-[var(--color-neutral-300)]">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-[var(--primary-chart-bg)] rounded-md p-6 border border-[var(--color-primary-100)]"
          >
            <h2 className="text-xl font-bold text-[var(--text-color)] mb-6 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-[#4B9770]" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                href="/personalization"
                className="flex flex-col items-center p-4 bg-white/50 rounded-md hover:bg-white/70 transition-all duration-200 group border border-[var(--color-primary-100)]"
              >
                <Users className="w-8 h-8 text-[#4B9770] mb-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-[var(--text-color)]">Personalization</span>
              </Link>
              <Link 
                href="/technical-analysis"
                className="flex flex-col items-center p-4 bg-white/50 rounded-md hover:bg-white/70 transition-all duration-200 group border border-[var(--color-primary-100)]"
              >
                <BarChart3 className="w-8 h-8 text-[#4B9770] mb-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-[var(--text-color)]">Technical Analysis</span>
              </Link>
              <Link 
                href="/my-account"
                className="flex flex-col items-center p-4 bg-white/50 rounded-md hover:bg-white/70 transition-all duration-200 group border border-[var(--color-primary-100)]"
              >
                <Users className="w-8 h-8 text-[#4B9770] mb-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-[var(--text-color)]">My Account</span>
              </Link>
              <Link 
                href="/"
                className="flex flex-col items-center p-4 bg-white/50 rounded-md hover:bg-white/70 transition-all duration-200 group border border-[var(--color-primary-100)]"
              >
                <MessageSquare className="w-8 h-8 text-[#4B9770] mb-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-[var(--text-color)]">Start Chat</span>
              </Link>
            </div>
          </motion.div>

          {/* Welcome Message for New Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-gradient-to-r from-[var(--primary-chart-bg)] to-[var(--primary-text-bg)] rounded-md p-6 border border-[var(--color-primary-100)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#4B9770] rounded-full flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-color)] mb-1">
                    Ready to explore TheNZT?
                  </h3>
                  <p className="text-[var(--color-neutral-500)] text-sm">
                    Start by asking questions about stocks, markets, or financial analysis
                  </p>
                </div>
              </div>
              <Link 
                href="/"
                className="px-4 py-2 bg-[#4B9770] text-white rounded-md hover:bg-[#408160] transition-colors duration-200 font-medium text-sm"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default DashboardPage;