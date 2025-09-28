'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import Image from 'next/image'

const DEMO_ACCOUNTS = [
  { email: 'test@example.com', password: 'TestPass123!', name: 'Test User' },
  { email: 'demo@example.com', password: 'DemoPass123!', name: 'Demo User' },
  { email: 'admin@example.com', password: 'AdminPass123!', name: 'Admin User' },
  { email: 'finance@example.com', password: 'FinancePass123!', name: 'Finance Analyst' },
  { email: 'investor@example.com', password: 'InvestorPass123!', name: 'Investor' },
]

export default function DemoLogin() {
  const [selectedAccount, setSelectedAccount] = useState<typeof DEMO_ACCOUNTS[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleQuickLogin = async (account: typeof DEMO_ACCOUNTS[0]) => {
    setIsLoading(true)
    try {
      // Simulate API call
      const formData = new FormData()
      formData.append('username', account.email)
      formData.append('password', account.password)

      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        Cookies.set('access_token', data.access_token, { path: '/' })
        toast.success(`Welcome back, ${account.name}!`)
        router.push('/')
      } else {
        toast.error('Login failed. Please try again.')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-main-bg)] p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Image
            src="/images/login_logo.svg"
            width={231}
            height={48}
            alt="TheNZT Logo"
            className="mx-auto"
          />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Quick Demo Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose a demo account to get started instantly
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="space-y-3">
          {DEMO_ACCOUNTS.map((account, index) => (
            <button
              key={index}
              onClick={() => handleQuickLogin(account)}
              disabled={isLoading}
              className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-[#4B9770] hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{account.name}</h3>
                  <p className="text-sm text-gray-500">{account.email}</p>
                </div>
                <div className="text-xs text-gray-400">
                  Click to login
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B9770] mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Logging in...</p>
          </div>
        )}

        {/* Alternative Login Options */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Or use:</p>
          <div className="flex justify-center space-x-4">
            <a
              href="/login"
              className="text-[#4B9770] hover:text-[#408160] font-medium text-sm"
            >
              Original Login
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/signup"
              className="text-[#4B9770] hover:text-[#408160] font-medium text-sm"
            >
              Sign Up
            </a>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Demo Account Info:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All accounts are pre-created and verified</li>
            <li>• No registration required</li>
            <li>• Full access to all features</li>
            <li>• Perfect for testing the finance system</li>
          </ul>
        </div>
      </div>
    </div>
  )
}