import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from './ProfileForm'

type ProfileData = {
  full_name: string
  email: string
  role: string
  phone: string | null
}

type DoctorData = {
  name: string
  specialization: string | null
  phone: string | null
}

export default async function DoctorProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, email, role, phone')
    .eq('id', user.id)
    .single<ProfileData>()

  if (profileError || !profile || profile.role !== 'doctor') {
    redirect('/login')
  }

  const { data: doctor } = await supabase
    .from('doctors')
    .select('name, specialization, phone')
    .eq('userid', user.id)
    .maybeSingle<DoctorData>()

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Doctor Profile</h1>
        <Link href="/doctor/dashboard" className="text-sm underline">
          Back to Dashboard
        </Link>
      </div>

      <ProfileForm
        userId={user.id}
        initialProfile={profile}
        initialDoctor={doctor ?? null}
      />
    </div>
  )
}
