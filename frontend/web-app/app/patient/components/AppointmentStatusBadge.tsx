import type { AppointmentStatus } from '@/lib/types/appointment'

const config: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  pending_payment: {
    label: 'Pending Payment',
    className: 'bg-amber-100 text-amber-800',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-emerald-100 text-emerald-800',
  },
  completed: {
    label: 'Completed',
    className: 'bg-slate-100 text-slate-700',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-700',
  },
  rescheduled: {
    label: 'Rescheduled',
    className: 'bg-blue-100 text-blue-700',
  },
}

export default function AppointmentStatusBadge({
  status,
}: {
  status: AppointmentStatus
}) {
  const { label, className } = config[status] ?? {
    label: status,
    className: 'bg-slate-100 text-slate-600',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  )
}
