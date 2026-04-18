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

// import Link from 'next/link'
// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import LogoutButton from '@/app/components/LogoutButton'

// export default async function PatientDashboardPage() {
//   const supabase = await createClient()

//   const {
//     data: { user: authenticatedUser },
//   } = await supabase.auth.getUser()

//   if (!authenticatedUser) {
//     redirect('/login')
//   }

//   const { data: patientProfile, error: patientProfileError } = await supabase
//     .from('profiles')
//     .select('full_name, role')
//     .eq('id', authenticatedUser.id)
//     .single()

//   if (
//     patientProfileError ||
//     !patientProfile ||
//     patientProfile.role !== 'patient'
//   ) {
//     redirect('/login')
//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center gap-4">
//       <h1 className="text-2xl font-bold">Patient Dashboard</h1>
//       <p>Welcome, {patientProfile.full_name}</p>

//       <div className="flex gap-3">
//         <Link href="/patient/profile" className="rounded border px-4 py-2">
//           View Profile
//         </Link>
//         <LogoutButton />
//       </div>
//     </div>
//   )
// }

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/app/components/LogoutButton'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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
    .select(
      'full_name, email, role, phone, preferred_language, email_notifications, sms_notifications'
    )
    .eq('id', authenticatedUser.id)
    .single()

  if (
    patientProfileError ||
    !patientProfile ||
    patientProfile.role !== 'patient'
  ) {
    redirect('/login')
  }

  const patientDisplayName = patientProfile.full_name || 'Patient'
  const patientLanguage =
    patientProfile.preferred_language || 'English'
  const patientPhoneNumber =
    patientProfile.phone || 'Not added yet'

  const profileCompletionCount =
    Number(Boolean(patientProfile.full_name?.trim())) +
    Number(Boolean(patientProfile.email)) +
    Number(Boolean(patientProfile.role)) +
    Number(Boolean(patientProfile.phone?.trim()))

  const profileCompletionPercentage = Math.round(
    (profileCompletionCount / 4) * 100
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        
        {/* Top Section */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 p-6 text-white shadow-lg md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-wide text-blue-100">
              Patient Portal
            </p>
            <h1 className="text-3xl font-bold">
              Welcome back, {patientDisplayName}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              Manage your profile, appointments, preferences, and upcoming
              channeling activities from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/patient/profile"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow hover:bg-blue-50"
            >
              View Profile
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Left Main Section */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                Quick Actions
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Link
                  href="/patient/profile"
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <h3 className="font-semibold text-slate-900">Update Profile</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Edit your personal information and preferences.
                  </p>
                </Link>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">Book Appointment</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Channel with doctors and manage bookings.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">View Notifications</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Check reminders and important updates.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">Payment History</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    View your consultation payment details.
                  </p>
                </div>
              </div>
            </div>

            {/* Upcoming Activity */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                Upcoming Activity
              </h2>

              <div className="space-y-4">
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <h3 className="font-medium text-slate-900">
                    No upcoming appointments yet
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Once booking features are added, your upcoming channeling
                    sessions will appear here.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <h3 className="font-medium text-slate-900">
                    Notification summary
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Appointment reminders, confirmations, and alerts will be
                    shown in this section.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Section */}
          <div className="space-y-6">
            
            {/* Profile Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                Profile Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-500">Full Name</p>
                  <p className="font-medium text-slate-900">{patientDisplayName}</p>
                </div>

                <div>
                  <p className="text-slate-500">Email</p>
                  <p className="font-medium text-slate-900">
                    {patientProfile.email}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Phone Number</p>
                  <p className="font-medium text-slate-900">
                    {patientPhoneNumber}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Preferred Language</p>
                  <p className="font-medium text-slate-900">
                    {patientLanguage}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  Profile Completion
                </h2>
                <span className="text-sm font-semibold text-blue-700">
                  {profileCompletionPercentage}%
                </span>
              </div>

              <div className="mb-3 h-3 w-full rounded-full bg-slate-200">
                <div
                  className="h-3 rounded-full bg-blue-700"
                  style={{ width: `${profileCompletionPercentage}%` }}
                />
              </div>

              <p className="text-sm text-slate-600">
                Complete your patient profile to improve your channeling
                experience and ensure smooth appointment handling.
              </p>
            </div>

            {/* Preferences Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                Preferences
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Email Notifications</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      patientProfile.email_notifications
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {patientProfile.email_notifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">SMS Notifications</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      patientProfile.sms_notifications
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {patientProfile.sms_notifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}