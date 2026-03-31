import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/app/components/LogoutButton'

export default async function ChannelingCentreDashboard() {
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

  if (error || !profile || profile.role !== 'centre_admin') {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Centre Admin Dashboard</h1>
      <p>Welcome, {profile.full_name}</p>
      <LogoutButton />
    </div>
  )
}