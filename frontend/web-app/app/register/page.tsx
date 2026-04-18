// 'use client'

// import { useState, FormEvent } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { useRouter } from 'next/navigation'

// export default function RegisterPage() {
//   const supabase = createClient()
//   const router = useRouter()

//   const [fullName, setFullName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [role, setRole] = useState('patient')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleRegister = async (e: FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)

//     try {
//       const { data, error: signUpError } = await supabase.auth.signUp({
//         email,
//         password,
//       })

//       if (signUpError) throw signUpError

//       const user = data.user
//       if (!user) throw new Error('User creation failed')
      
//       console.log('Signup response:', data)
//       const { error: profileError } = await supabase.from('profiles').insert({
//         id: user.id,
//         full_name: fullName,
//         email,
//         role,
//       })
      
//       console.log('Profile insert error:', profileError)
      
//       if (profileError) throw profileError

//       alert('Registration successful!')
//       router.push('/login')
//     } catch (err: unknown) {
//       console.error('Registration error:', err)

//       if (err instanceof Error) {
//         setError(err.message)
//       } else {
//         setError(JSON.stringify(err))
//       }
//     }finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center">
//       <form onSubmit={handleRegister} className="space-y-4 rounded border p-6">
//         <h1 className="text-xl font-bold">Register</h1>

//         <input
//           placeholder="Full Name"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//           className="w-full border p-2"
//         />

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

//         <select
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="w-full border p-2"
//         >
//           <option value="patient">Patient</option>
//           <option value="doctor">Doctor</option>
//           <option value="centre_admin">Centre Admin</option>
//           <option value="portal_admin">Portal Admin</option>
//         </select>

//         {error && <p className="text-red-500">{error}</p>}

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-black px-4 py-2 text-white"
//         >
//           {loading ? 'Registering...' : 'Register'}
//         </button>
//       </form>
//     </div>
//   )
// }
// 'use client'

// import Link from 'next/link'
// import { useState, FormEvent } from 'react'
// import { useRouter } from 'next/navigation'
// import { createClient } from '@/lib/supabase/client'

// export default function RegisterPage() {
//   const supabase = createClient()
//   const router = useRouter()

//   const [registrationFullName, setRegistrationFullName] = useState('')
//   const [registrationEmail, setRegistrationEmail] = useState('')
//   const [registrationPassword, setRegistrationPassword] = useState('')
//   const [registrationRole, setRegistrationRole] = useState('patient')
//   const [registrationErrorMessage, setRegistrationErrorMessage] = useState('')
//   const [isRegistrationLoading, setIsRegistrationLoading] = useState(false)

//   const isStrongPassword = (password: string) => {
//     const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
//     return strongPasswordPattern.test(password)
//   }

//   const handleRegisterSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     setRegistrationErrorMessage('')

//     if (!registrationFullName.trim()) {
//       setRegistrationErrorMessage('Full name is required.')
//       return
//     }

//     if (!registrationEmail.trim()) {
//       setRegistrationErrorMessage('Email is required.')
//       return
//     }

//     if (!registrationPassword) {
//       setRegistrationErrorMessage('Password is required.')
//       return
//     }

//     if (!isStrongPassword(registrationPassword)) {
//       setRegistrationErrorMessage(
//         'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.'
//       )
//       return
//     }

//     setIsRegistrationLoading(true)

//     try {
//       const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
//         {
//           email: registrationEmail.trim(),
//           password: registrationPassword,
//         }
//       )

//       if (signUpError) throw signUpError

//       const registeredUser = signUpData.user
//       if (!registeredUser) {
//         throw new Error('User creation failed.')
//       }

//       const { error: profileInsertError } = await supabase.from('profiles').insert({
//         id: registeredUser.id,
//         full_name: registrationFullName.trim(),
//         email: registrationEmail.trim(),
//         role: registrationRole,
//       })

//       if (profileInsertError) throw profileInsertError

//       router.push('/login')
//     } catch (registrationError: unknown) {
//       if (registrationError instanceof Error) {
//         setRegistrationErrorMessage(registrationError.message)
//       } else {
//         setRegistrationErrorMessage('Something went wrong during registration.')
//       }
//     } finally {
//       setIsRegistrationLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
//       <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
//         {/* Left Side */}
//         <div className="hidden rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-600 p-10 text-white shadow-lg lg:flex lg:flex-col lg:justify-between">
//           <div>
//             <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-blue-100">
//               MediLink Portal
//             </p>
//             <h1 className="text-4xl font-bold leading-tight">
//               Begin your healthcare access the smart way.
//             </h1>
//             <p className="mt-4 max-w-md text-sm leading-6 text-white/90">
//               Create your account to enter a connected channeling experience for
//               patients, doctors, and healthcare service teams.
//             </p>
//           </div>

//           <div className="mt-6 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
//             <h2 className="text-lg font-semibold">What you get</h2>

//             <div className="mt-3 space-y-2 text-sm text-white/90">
//               <p>✔ Secure and reliable access to your account</p>
//               <p>✔ Organized channeling and appointment flow</p>
//               <p>✔ Fast and simple healthcare interactions</p>
//             </div>
//           </div>

//           <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
//             <h2 className="text-lg font-semibold">Why MediLink Portal?</h2>

//             <div className="mt-4 space-y-3 text-sm text-white/90">
//               <p>• A single place to start your digital healthcare journey.</p>
//               <p>• Designed to simplify channeling for every user.</p>
//               <p>• Built for smoother interaction across the whole portal.</p>
//             </div>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="flex flex-col justify-center">
//           <form
//             onSubmit={handleRegisterSubmit}
//             className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
//           >
//             <div className="mb-6">
//               <p className="mb-2 text-sm font-medium uppercase tracking-wide text-blue-700 lg:hidden">
//                 MediLink Portal
//               </p>
//               <h2 className="text-3xl font-bold">Register</h2>
//               <p className="mt-2 text-sm text-slate-600">
//                 Create your account to continue to the portal.
//               </p>
//             </div>

//             <div className="space-y-5">
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-600">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={registrationFullName}
//                   onChange={(e) => setRegistrationFullName(e.target.value)}
//                   placeholder="Enter your full name"
//                   className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-600">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={registrationEmail}
//                   onChange={(e) => setRegistrationEmail(e.target.value)}
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
//                   value={registrationPassword}
//                   onChange={(e) => setRegistrationPassword(e.target.value)}
//                   placeholder="Create a strong password"
//                   className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   required
//                 />
//                 <p className="mt-1 text-xs text-slate-500">
//                   Use at least 8 characters, including uppercase, lowercase,
//                   and a number.
//                 </p>
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-slate-600">
//                   Role
//                 </label>
//                 <select
//                   value={registrationRole}
//                   onChange={(e) => setRegistrationRole(e.target.value)}
//                   className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                 >
//                   <option value="patient">Patient</option>
//                   <option value="doctor">Doctor</option>
//                   <option value="centre_admin">Centre Admin</option>
//                   <option value="portal_admin">Portal Admin</option>
//                 </select>
//               </div>

//               {registrationErrorMessage && (
//                 <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
//                   {registrationErrorMessage}
//                 </p>
//               )}

//               <button
//                 type="submit"
//                 disabled={isRegistrationLoading}
//                 className="w-full rounded-lg bg-blue-700 px-4 py-3 text-white transition hover:bg-blue-800 disabled:opacity-50"
//               >
//                 {isRegistrationLoading ? 'Creating account...' : 'Register'}
//               </button>
//             </div>

//             <p className="mt-6 text-center text-sm text-slate-600">
//               Already have an account?{' '}
//               <Link
//                 href="/login"
//                 className="font-medium text-blue-700 underline"
//               >
//                 Login
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

export default function RegisterPage() {
  const supabase = createClient()
  const router = useRouter()

  const [registrationFullName, setRegistrationFullName] = useState('')
  const [registrationEmail, setRegistrationEmail] = useState('')
  const [registrationPassword, setRegistrationPassword] = useState('')
  const [registrationRole, setRegistrationRole] = useState('patient')
  const [registrationErrorMessage, setRegistrationErrorMessage] = useState('')
  const [isRegistrationLoading, setIsRegistrationLoading] = useState(false)

  const isStrongPassword = (password: string) => {
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return strongPasswordPattern.test(password)
  }

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setRegistrationErrorMessage('')

    if (!registrationFullName.trim()) {
      setRegistrationErrorMessage('Full name is required.')
      return
    }

    if (!registrationEmail.trim()) {
      setRegistrationErrorMessage('Email is required.')
      return
    }

    if (!registrationPassword) {
      setRegistrationErrorMessage('Password is required.')
      return
    }

    if (!isStrongPassword(registrationPassword)) {
      setRegistrationErrorMessage(
        'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.'
      )
      return
    }

    setIsRegistrationLoading(true)

    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: registrationEmail.trim(),
          password: registrationPassword,
        })

      if (signUpError) throw signUpError

      const registeredUser = signUpData.user
      if (!registeredUser) {
        throw new Error('User creation failed.')
      }

      const { error: profileInsertError } = await supabase.from('profiles').insert({
        id: registeredUser.id,
        full_name: registrationFullName.trim(),
        email: registrationEmail.trim(),
        role: registrationRole,
      })

      if (profileInsertError) throw profileInsertError

      router.push('/login')
    } catch (registrationError: unknown) {
      if (registrationError instanceof Error) {
        setRegistrationErrorMessage(registrationError.message)
      } else {
        setRegistrationErrorMessage('Something went wrong during registration.')
      }
    } finally {
      setIsRegistrationLoading(false)
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
              Create your account.
              <br />
              <span className="text-cyan-300">
                Start your healthcare access.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/90">
              Join a connected platform built for patients, doctors, and
              channeling centers to make healthcare interaction simpler,
              faster, and more organized.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold text-white">
                  Secure Registration
                </p>
                <p className="mt-2 text-sm text-white/80">
                  Create your account with protected role-based access.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold text-white">
                  Unified Experience
                </p>
                <p className="mt-2 text-sm text-white/80">
                  One portal for all key healthcare interactions.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col justify-center">
            <form
              onSubmit={handleRegisterSubmit}
              className="mx-auto w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-lg"
            >
              <div className="mb-6">
                <p className="mb-2 text-sm font-medium uppercase tracking-wide text-cyan-200 lg:hidden">
                  MediLink Portal
                </p>
                <h2 className="text-3xl font-bold">Register</h2>
                <p className="mt-2 text-sm text-white/80">
                  Create your account to continue to the portal.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/80">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={registrationFullName}
                    onChange={(e) => setRegistrationFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-white/80">
                    Email
                  </label>
                  <input
                    type="email"
                    value={registrationEmail}
                    onChange={(e) => setRegistrationEmail(e.target.value)}
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
                    value={registrationPassword}
                    onChange={(e) => setRegistrationPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    required
                  />
                  <p className="mt-1 text-xs text-white/70">
                    Use at least 8 characters, including uppercase, lowercase,
                    and a number.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-white/80">
                    Role
                  </label>
                  <select
                    value={registrationRole}
                    onChange={(e) => setRegistrationRole(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  >
                    <option value="patient" className="text-slate-900">
                      Patient
                    </option>
                    <option value="doctor" className="text-slate-900">
                      Doctor
                    </option>
                    <option value="centre_admin" className="text-slate-900">
                      Centre Admin
                    </option>
                    <option value="portal_admin" className="text-slate-900">
                      Portal Admin
                    </option>
                  </select>
                </div>

                {registrationErrorMessage && (
                  <p className="rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-100">
                    {registrationErrorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isRegistrationLoading}
                  className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-blue-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  {isRegistrationLoading ? 'Creating account...' : 'Register'}
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-white/80">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-cyan-200 underline"
                >
                  Login
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