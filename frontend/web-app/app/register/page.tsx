'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const supabase = createClient()
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      const user = data.user
      if (!user) throw new Error('User creation failed')
      
      console.log('Signup response:', data)
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        full_name: fullName,
        email,
        role,
      })
      
      console.log('Profile insert error:', profileError)
      
      if (profileError) throw profileError

      alert('Registration successful!')
      router.push('/login')
    } catch (err: unknown) {
      console.error('Registration error:', err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(JSON.stringify(err))
      }
    }finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleRegister} className="space-y-4 rounded border p-6">
        <h1 className="text-xl font-bold">Register</h1>

        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border p-2"
        />

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

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2"
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="centre_admin">Centre Admin</option>
          <option value="portal_admin">Portal Admin</option>
        </select>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black px-4 py-2 text-white"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}