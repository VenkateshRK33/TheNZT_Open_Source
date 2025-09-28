'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export default function SupabaseLogin() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (session?.user) {
        router.push('/')
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (session?.user) {
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4B9770]"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
          <p className="mb-4">You are logged in as: {user.email}</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-main-bg)]">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to TheNZT
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Finance Query System
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4B9770',
                    brandAccent: '#408160',
                  },
                },
              },
            }}
            providers={['google', 'github']}
            redirectTo={`${window.location.origin}/`}
          />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Or use the{' '}
            <a href="/login" className="text-[#4B9770] hover:text-[#408160] font-medium">
              original login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}