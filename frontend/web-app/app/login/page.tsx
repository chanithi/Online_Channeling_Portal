'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) throw signInError

      const user = data.user
      if (!user) throw new Error('Login failed')

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError
      if (!profile?.role) throw new Error('User role not found')

      if (profile.role === 'patient') {
        router.push('/patient/dashboard')
      } else if (profile.role === 'doctor') {
        router.push('/doctor/dashboard')
      } else if (profile.role === 'centre_admin') {
        router.push('/centre-admin/dashboard')
      } else if (profile.role === 'portal_admin') {
        router.push('/portal-admin/dashboard')
      } else {
        throw new Error('Invalid role')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="space-y-4 rounded border p-6">
        <h1 className="text-xl font-bold">Login</h1>

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2"
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black px-4 py-2 text-white"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}