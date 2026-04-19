import Link from 'next/link'
import { getNextAvailableSlot } from '@/lib/actions/appointmentActions'

interface Props {
  doctorId: string
  doctorName: string
}

export default async function NextAvailableSlotCard({
  doctorId,
  doctorName,
}: Props) {
  const slot = await getNextAvailableSlot(doctorId)

  if (!slot) return null

  const dateLabel = new Date(slot.date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
        Next available slot
      </p>
      <p className="text-sm font-semibold text-slate-900">
        {doctorName}
      </p>
      <p className="mt-0.5 text-sm text-slate-600">
        {dateLabel} · {slot.time} · {slot.centre}
      </p>
      <Link
        href={`/patient/bookings/new?doctorId=${doctorId}`}
        className="mt-3 inline-block rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
      >
        Book this slot
      </Link>
    </div>
  )
}
