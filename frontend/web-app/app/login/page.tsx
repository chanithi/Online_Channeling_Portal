// 'use client'

// import { useState, FormEvent } from 'react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { createClient } from '@/lib/supabase/client'

// export default function LoginPage() {
//   const supabase = createClient()
//   const router = useRouter()

//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleLogin = async (e: FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)

//     try {
//       const { data, error: signInError } = await supabase.auth.signInWithPassword({
//         email: email.trim(),
//         password,
//       })

//       if (signInError) throw signInError

//       const user = data.user
//       if (!user) throw new Error('Login failed')

//       const { data: profile, error: profileError } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', user.id)
//         .single()

//       if (profileError) throw profileError
//       if (!profile?.role) throw new Error('User role not found')

//       if (profile.role === 'patient') {
//         router.push('/patient/dashboard')
//       } else if (profile.role === 'doctor') {
//         router.push('/doctor/dashboard')
//       } else if (profile.role === 'centre_admin') {
//         router.push('/centre-admin/dashboard')
//       } else if (profile.role === 'portal_admin') {
//         router.push('/portal-admin/dashboard')
//       } else {
//         throw new Error('Invalid role')
//       }
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err.message)
//       } else {
//         setError('Something went wrong')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center">
//       <form onSubmit={handleLogin} className="space-y-4 rounded border p-6">
//         <h1 className="text-xl font-bold">Login</h1>

//         <input
//           placeholder="Email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border p-2"
//         />

//         <input
//           placeholder="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border p-2"
//         />

//         {error && <p className="text-red-500">{error}</p>}

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-black px-4 py-2 text-white"
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>

//         <p className="text-sm">
//           Don&apos;t have an account?{' '}
//           <Link href="/register" className="underline">
//             Register
//           </Link>
//         </p>
//       </form>
//     </div>
//   )
// }

// 'use client'

// import Link from 'next/link'
// import { useState, FormEvent } from 'react'
// import { useRouter } from 'next/navigation'
// import { createClient } from '@/lib/supabase/client'

// export default function LoginPage() {
//   const supabase = createClient()
//   const router = useRouter()

//   const [loginEmail, setLoginEmail] = useState('')
//   const [loginPassword, setLoginPassword] = useState('')
//   const [loginErrorMessage, setLoginErrorMessage] = useState('')
//   const [isLoginLoading, setIsLoginLoading] = useState(false)

//   const handleLoginSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     setLoginErrorMessage('')

//     if (!loginEmail.trim()) {
//       setLoginErrorMessage('Email is required.')
//       return
//     }

//     if (!loginPassword) {
//       setLoginErrorMessage('Password is required.')
//       return
//     }

//     setIsLoginLoading(true)

//     try {
//       const { data: signInData, error: signInError } =
//         await supabase.auth.signInWithPassword({
//           email: loginEmail.trim(),
//           password: loginPassword,
//         })

//       if (signInError) throw signInError

//       const authenticatedUser = signInData.user
//       if (!authenticatedUser) {
//         throw new Error('Login failed. Please try again.')
//       }

//       const { data: profileData, error: profileFetchError } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', authenticatedUser.id)
//         .single()

//       if (profileFetchError) throw profileFetchError
//       if (!profileData?.role) throw new Error('User role not found.')

//       if (profileData.role === 'patient') {
//         router.push('/patient/dashboard')
//       } else if (profileData.role === 'doctor') {
//         router.push('/doctor/dashboard')
//       } else if (profileData.role === 'centre_admin') {
//         router.push('/centre-admin/dashboard')
//       } else if (profileData.role === 'portal_admin') {
//         router.push('/portal-admin/dashboard')
//       } else {
//         throw new Error('Invalid role.')
//       }
//     } catch (loginError: unknown) {
//       if (loginError instanceof Error) {
//         setLoginErrorMessage(loginError.message)
//       } else {
//         setLoginErrorMessage('Something went wrong during login.')
//       }
//     } finally {
//       setIsLoginLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 px-6 flex items-center text-slate-900">
//       <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-2">
//         {/* Left Side */}
//         <div className="hidden rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-600 p-10 text-white shadow-lg lg:flex lg:flex-col lg:justify-between">
//           <div>
//             <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-blue-100">
//               MediLink Portal
//             </p>
//             <h1 className="text-4xl font-bold leading-tight">
//               Smarter channeling, simpler care.
//             </h1>
//             <p className="mt-4 max-w-md text-sm leading-6 text-white/90">
//               Sign in to access a connected healthcare experience designed for
//               patients, doctors, and channeling centers.
//             </p>
//           </div>

//           <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
//             <h2 className="text-lg font-semibold">Why MediLink Portal?</h2>

//             <div className="mt-4 space-y-3 text-sm text-white/90">
//               <p>• One secure place for appointments, profiles, and care access.</p>
//               <p>• Built to connect patients, doctors, and channeling centers smoothly.</p>
//               <p>• Fast, reliable, and designed for a better channeling experience.</p>
//             </div>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="flex flex-col justify-center">
//           <form
//             onSubmit={handleLoginSubmit}
//             className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
//           >
//             <div className="mb-6">
//               <p className="mb-2 text-sm font-medium uppercase tracking-wide text-blue-700 lg:hidden">
//                 MediLink Portal
//               </p>
//               <h2 className="text-3xl font-bold">Login</h2>
//               <p className="mt-2 text-sm text-slate-600">
//                 Sign in to continue to your dashboard.
//               </p>
//             </div>

//             <div className="space-y-5">
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-600">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={loginEmail}
//                   onChange={(e) => setLoginEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-600">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   value={loginPassword}
//                   onChange={(e) => setLoginPassword(e.target.value)}
//                   placeholder="Enter your password"
//                   className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   required
//                 />
//               </div>

//               <div className="flex justify-end">
//                 <Link
//                   href="/forgot-password"
//                   className="text-sm font-medium text-blue-700 underline"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               {loginErrorMessage && (
//                 <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
//                   {loginErrorMessage}
//                 </p>
//               )}

//               <button
//                 type="submit"
//                 disabled={isLoginLoading}
//                 className="w-full rounded-lg bg-blue-700 px-4 py-3 text-white transition hover:bg-blue-800 disabled:opacity-50"
//               >
//                 {isLoginLoading ? 'Logging in...' : 'Login'}
//               </button>
//             </div>

//             <p className="mt-6 text-center text-sm text-slate-600">
//               Don&apos;t have an account?{' '}
//               <Link
//                 href="/register"
//                 className="font-medium text-blue-700 underline"
//               >
//                 Register
//               </Link>
//             </p>
//           </form>

//           <div className="mt-6 text-center text-xs text-slate-500">
//             <p>Secure access powered by role-based authentication.</p>
//             <p className="mt-1">© 2026 MediLink Portal</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'

import Link from 'next/link'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginErrorMessage, setLoginErrorMessage] = useState('')
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoginErrorMessage('')

    if (!loginEmail.trim()) {
      setLoginErrorMessage('Email is required.')
      return
    }

    if (!loginPassword) {
      setLoginErrorMessage('Password is required.')
      return
    }

    setIsLoginLoading(true)

    try {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword,
        })

      if (signInError) throw signInError

      const authenticatedUser = signInData.user
      if (!authenticatedUser) {
        throw new Error('Login failed. Please try again.')
      }

      const { data: profileData, error: profileFetchError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authenticatedUser.id)
        .single()

      if (profileFetchError) throw profileFetchError
      if (!profileData?.role) throw new Error('User role not found.')

      if (profileData.role === 'patient') {
        router.push('/patient/dashboard')
      } else if (profileData.role === 'doctor') {
        router.push('/doctor/dashboard')
      } else if (profileData.role === 'centre_admin') {
        router.push('/centre-admin/dashboard')
      } else if (profileData.role === 'portal_admin') {
        router.push('/portal-admin/dashboard')
      } else {
        throw new Error('Invalid role.')
      }
    } catch (loginError: unknown) {
      if (loginError instanceof Error) {
        setLoginErrorMessage(loginError.message)
      } else {
        setLoginErrorMessage('Something went wrong during login.')
      }
    } finally {
      setIsLoginLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-cyan-700 to-blue-600" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-300/20 blur-3xl" />
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center px-6">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          {/* Left Side */}
          <div className="text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
              MediLink Portal
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Welcome back.
              <br />
              <span className="text-cyan-300">
                Sign in to continue.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/90">
              Access your dashboard, manage your profile, and continue your
              healthcare journey through one secure connected portal.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold text-white">
                  Secure Access
                </p>
                <p className="mt-2 text-sm text-white/80">
                  Role-based authentication for every user.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold text-white">
                  Connected Experience
                </p>
                <p className="mt-2 text-sm text-white/80">
                  Built for patients, doctors, and channeling centers.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col justify-center">
            <form
              onSubmit={handleLoginSubmit}
              className="mx-auto w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-lg"
            >
              <div className="mb-6">
                <p className="mb-2 text-sm font-medium uppercase tracking-wide text-cyan-200 lg:hidden">
                  MediLink Portal
                </p>
                <h2 className="text-3xl font-bold">Login</h2>
                <p className="mt-2 text-sm text-white/80">
                  Sign in to continue to your dashboard.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/80">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-white/80">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-cyan-200 underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {loginErrorMessage && (
                  <p className="rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-100">
                    {loginErrorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoginLoading}
                  className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-blue-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  {isLoginLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-white/80">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="font-medium text-cyan-200 underline"
                >
                  Register
                </Link>
              </p>
            </form>

            <div className="mt-6 text-center text-xs text-white/70">
              <p>Secure access powered by role-based authentication.</p>
              <p className="mt-1">© 2026 MediLink Portal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}