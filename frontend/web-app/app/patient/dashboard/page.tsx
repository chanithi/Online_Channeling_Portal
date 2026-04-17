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

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/app/components/LogoutButton'

export default async function PatientDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user: authenticatedUser },
  } = await supabase.auth.getUser()

  if (!authenticatedUser) {
    redirect('/login')
  }

  const { data: patientProfile, error: patientProfileError } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', authenticatedUser.id)
    .single()

  if (
    patientProfileError ||
    !patientProfile ||
    patientProfile.role !== 'patient'
  ) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Patient Dashboard</h1>
      <p>Welcome, {patientProfile.full_name}</p>

      <div className="flex gap-3">
        <Link href="/patient/profile" className="rounded border px-4 py-2">
          View Profile
        </Link>
        <LogoutButton />
      </div>
    </div>
  )
}