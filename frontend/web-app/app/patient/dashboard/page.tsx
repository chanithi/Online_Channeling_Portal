// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import LogoutButton from '@/app/components/LogoutButton'

// export default async function PatientDashboard() {
//   const supabase = await createClient()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (!user) {
//     redirect('/login')
//   }

//   const { data: profile, error } = await supabase
//     .from('profiles')
//     .select('full_name, role')
//     .eq('id', user.id)
//     .single()

//   if (error || !profile || profile.role !== 'patient') {
//     redirect('/login')
//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center gap-4">
//       <h1 className="text-2xl font-bold">Patient Dashboard</h1>
//       <p>Welcome, {profile.full_name}</p>
//       <LogoutButton />
//     </div>
//   )
// }

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/app/components/LogoutButton'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default async function PatientDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (error || !profile || profile.role !== 'patient') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-4xl rounded-3xl bg-white p-8 shadow-md border border-slate-200">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Patient Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Welcome, {profile.full_name}
            </h1>
            <p className="mt-2 text-slate-600">
              Manage your profile, preferences, and future healthcare services
              from your dashboard.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Profile Access
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                View and update your personal details and notification
                preferences.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Secure Access
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Your dashboard is protected with role-based authentication.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <LogoutButton />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}