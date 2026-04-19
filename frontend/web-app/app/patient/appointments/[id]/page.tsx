import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAppointmentById } from '@/lib/actions/appointmentActions'
import AppointmentStatusBadge from '@/app/patient/components/AppointmentStatusBadge'
import CancelAppointmentButton from '@/app/patient/components/CancelAppointmentButton'
import RescheduleModal from '@/app/patient/components/RescheduleModal'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ booked?: string }>
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function AppointmentDetailPage({
  params,
  searchParams,
}: Props) {
  const supabase = await createClient()
  const { id } = await params
  const { booked } = await searchParams

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

  const appointment = await getAppointmentById(id)
  if (!appointment) notFound()

  const isUpcoming =
    appointment.status === 'confirmed' ||
    appointment.status === 'pending_payment'

  const canRebook =
    appointment.status === 'completed' || appointment.status === 'cancelled'

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
            <span className="text-slate-800 font-medium">
              {appointment.booking_reference}
            </span>
          </nav>

          {/* Just booked success banner */}
          {booked === 'true' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <span className="text-xl">✅</span>
              <div>
                <p className="font-semibold text-emerald-800">
                  Booking successful!
                </p>
                <p className="text-sm text-emerald-700">
                  Your appointment has been booked. Complete payment below to
                  confirm your slot.
                </p>
              </div>
            </div>
          )}

          {/* Main card */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Booking reference
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {appointment.booking_reference}
                </p>
              </div>
              <AppointmentStatusBadge status={appointment.status} />
            </div>

            {/* Card body */}
            <div className="px-6 py-5 space-y-5">
              {/* Doctor */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Doctor
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-700">
                    {appointment.doctor?.full_name
                      ?.split(' ')
                      .slice(-1)[0]
                      ?.slice(0, 2)
                      .toUpperCase() ?? 'DR'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {appointment.doctor?.full_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {appointment.doctor?.specialization}
                      {appointment.doctor?.qualifications
                        ? ` · ${appointment.doctor.qualifications}`
                        : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Appointment details grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Channeling centre
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {appointment.centre?.name}
                  </p>
                  {appointment.centre?.address && (
                    <p className="text-sm text-slate-500">
                      {appointment.centre.address}
                    </p>
                  )}
                  {appointment.centre?.phone && (
                    <p className="text-sm text-slate-500">
                      {appointment.centre.phone}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Date &amp; time
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {formatDate(appointment.appointment_date)}
                  </p>
                  <p className="text-sm font-medium text-blue-600">
                    {appointment.appointment_time}
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Fee */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Consultation fee
                  </p>
                  <p className="mt-1 text-xl font-bold text-blue-700">
                    LKR {appointment.consultation_fee.toLocaleString()}
                  </p>
                </div>
                {appointment.status === 'pending_payment' && (
                  <Link
                    href={`/patient/appointments/${appointment.id}/payment`}
                    className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                  >
                    Complete payment →
                  </Link>
                )}
              </div>

              {/* Reason for visit */}
              {appointment.reason_for_visit && (
                <>
                  <div className="h-px bg-slate-100" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Reason for visit
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {appointment.reason_for_visit}
                    </p>
                  </div>
                </>
              )}

              {/* Booked on */}
              <div className="h-px bg-slate-100" />
              <p className="text-xs text-slate-400">
                Booked on{' '}
                {new Date(appointment.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Card footer — actions */}
            {(isUpcoming || canRebook) && (
              <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex flex-wrap items-center gap-3">
                {appointment.status === 'confirmed' && (
                  <RescheduleModal
                    appointmentId={appointment.id}
                    scheduleId={appointment.schedule_id}
                    currentDate={appointment.appointment_date}
                    currentTime={appointment.appointment_time}
                  />
                )}

                {isUpcoming && (
                  <CancelAppointmentButton appointmentId={appointment.id} />
                )}

                {canRebook && appointment.doctor_id && (
                  <Link
                    href={`/patient/bookings/new?doctorId=${appointment.doctor_id}`}
                    className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    🔄 Rebook with same doctor
                  </Link>
                )}

                <Link
                  href="/patient/appointments/history"
                  className="ml-auto rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white"
                >
                  ← All appointments
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
