import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getPatientAppointments } from '@/lib/actions/appointmentActions'
import AppointmentStatusBadge from '@/app/patient/components/AppointmentStatusBadge'
import CancelAppointmentButton from '@/app/patient/components/CancelAppointmentButton'
import RescheduleModal from '@/app/patient/components/RescheduleModal'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import type { AppointmentStatus } from '@/lib/types/appointment'

interface Props {
  searchParams: Promise<{ tab?: string }>
}

const TABS: { key: AppointmentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'confirmed', label: 'Upcoming' },
  { key: 'pending_payment', label: 'Pending Payment' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function AppointmentHistoryPage({ searchParams }: Props) {
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

  const activeTab = (params.tab as AppointmentStatus | 'all') ?? 'all'
  const appointments = await getPatientAppointments()

  const filtered =
    activeTab === 'all'
      ? appointments
      : appointments.filter((a) => a.status === activeTab)

  // Count per tab for badges
  const counts = {
    all: appointments.length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    pending_payment: appointments.filter((a) => a.status === 'pending_payment').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  }

  // Left border accent per status
  const accentClass: Record<AppointmentStatus, string> = {
    confirmed: 'border-l-emerald-500',
    pending_payment: 'border-l-amber-400',
    completed: 'border-l-slate-400',
    cancelled: 'border-l-red-400',
    rescheduled: 'border-l-blue-400',
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Page header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <nav className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                <Link href="/patient/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
                <span>›</span>
                <span className="text-slate-800 font-medium">
                  My Appointments
                </span>
              </nav>
              <h1 className="text-2xl font-bold text-slate-900">
                My Appointments
              </h1>
            </div>
            <Link
              href="/patient/appointments/history"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              + New booking
            </Link>
          </div>

          {/* Filter tabs */}
          <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {TABS.map((tab) => (
              <Link
                key={tab.key}
                href={`/patient/appointments/history?tab=${tab.key}`}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                    activeTab === tab.key
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {counts[tab.key]}
                </span>
              </Link>
            ))}
          </div>

          {/* Appointments list */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-base font-semibold text-slate-700">
                No appointments found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {activeTab === 'all'
                  ? "You haven't made any bookings yet."
                  : `No ${activeTab.replace('_', ' ')} appointments.`}
              </p>
              <Link
                href="/patient/dashboard"
                className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Find a doctor
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((appt) => (
                <div
                  key={appt.id}
                  className={`rounded-2xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md ${
                    accentClass[appt.status] ?? 'border-l-slate-300'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    {/* Left — doctor + details */}
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                        {appt.doctor?.full_name
                          ?.split(' ')
                          .slice(-1)[0]
                          ?.slice(0, 2)
                          .toUpperCase() ?? 'DR'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {appt.doctor?.full_name ?? 'Doctor'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {appt.doctor?.specialization} ·{' '}
                          {appt.centre?.name ?? 'Centre'}
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {formatDate(appt.appointment_date)} ·{' '}
                          {appt.appointment_time}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          Ref: {appt.booking_reference}
                        </p>
                      </div>
                    </div>

                    {/* Right — badge + actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <AppointmentStatusBadge status={appt.status} />

                      {/* View details */}
                      <Link
                        href={`/patient/appointments/${appt.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        View
                      </Link>

                      {/* Reschedule (confirmed only) */}
                      {appt.status === 'confirmed' && (
                        <RescheduleModal
                          appointmentId={appt.id}
                          scheduleId={appt.schedule_id}
                          currentDate={appt.appointment_date}
                          currentTime={appt.appointment_time}
                        />
                      )}

                      {/* Cancel (confirmed or pending_payment) */}
                      {(appt.status === 'confirmed' ||
                        appt.status === 'pending_payment') && (
                        <CancelAppointmentButton appointmentId={appt.id} />
                      )}

                      {/* Rebook (completed or cancelled) */}
                      {(appt.status === 'completed' ||
                        appt.status === 'cancelled') &&
                        appt.doctor_id && (
                          <Link
                            href={`/patient/bookings/new?doctorId=${appt.doctor_id}`}
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            Rebook
                          </Link>
                        )}

                      {/* Complete payment (pending_payment) */}
                      {appt.status === 'pending_payment' && (
                        <Link
                          href={`/patient/appointments/${appt.id}`}
                          className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                        >
                          Pay now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
