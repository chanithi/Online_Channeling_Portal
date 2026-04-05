import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/app/components/LogoutButton'

export default async function DoctorDashboard() {
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

  if (error || !profile || profile.role !== 'doctor') {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
      <p>Welcome, {profile.full_name}</p>
      <Link href="/doctor/profile" className="rounded bg-black px-4 py-2 text-white">
        View Profile
      </Link>
      <LogoutButton />
    </div>
  )
}