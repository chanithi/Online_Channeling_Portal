import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PatientProfileForm from './PatientProfileForm'

export default async function PatientProfilePage() {
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
      'id, full_name, email, role, phone, preferred_language, email_notifications, sms_notifications'
    )
    .eq('id', authenticatedUser.id)
    .single()

  if (patientProfileError || !patientProfile) {
    redirect('/login')
  }

  if (patientProfile.role !== 'patient') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <PatientProfileForm patientProfile={patientProfile} />
    </div>
  )
}