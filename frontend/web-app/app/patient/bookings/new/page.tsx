import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getDoctorSchedules } from '@/lib/actions/appointmentActions'
import BookingForm from '@/app/patient/components/BookingForm'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface Props {
  searchParams: Promise<{ doctorId?: string }>
}

export default async function NewBookingPage({ searchParams }: Props) {
  const supabase = await createClient()
  const params = await searchParams

  // Auth guard
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!profile || profile.role !== 'patient') redirect('/login')

  const doctorId = params.doctorId
  if (!doctorId) redirect('/patient/dashboard')

  // Fetch doctor info
  const { data: doctor } = await supabase
    .from('profiles')
    .select('id, full_name, specialization, qualifications')
    .eq('id', doctorId)
    .eq('role', 'doctor')
    .single()

  if (!doctor) redirect('/patient/dashboard')

  // Fetch doctor's schedules (with centre info)
  const schedules = await getDoctorSchedules(doctorId)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/patient/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <span>›</span>
            <Link
              href="/patient/appointments/history"
              className="hover:text-blue-600"
            >
              My Appointments
            </Link>
            <span>›</span>
            <span className="text-slate-800 font-medium">Book Appointment</span>
          </nav>

          {/* Doctor summary */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
              Booking for
            </p>
            <h1 className="text-xl font-bold text-slate-900">
              {doctor.full_name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {doctor.specialization}
              {doctor.qualifications ? ` · ${doctor.qualifications}` : ''}
            </p>
          </div>

          {/* 3-step booking form */}
          <BookingForm
            doctorId={doctor.id}
            doctorName={doctor.full_name}
            schedules={schedules}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
