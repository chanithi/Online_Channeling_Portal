'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cancelAppointment } from '@/lib/actions/appointmentActions'

export default function CancelAppointmentButton({
  appointmentId,
}: {
  appointmentId: string
}) {
  const [showDialog, setShowDialog] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCancel = () => {
    setError('')
    startTransition(async () => {
      const result = await cancelAppointment(appointmentId)
      if (result.success) {
        setShowDialog(false)
        router.refresh()
      } else {
        setError(result.error ?? 'Failed to cancel appointment.')
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        Cancel
      </button>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">
              Cancel appointment?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              This action cannot be undone. Are you sure you want to cancel
              this appointment?
            </p>

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowDialog(false)}
                disabled={isPending}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Keep appointment
              </button>
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {isPending ? 'Cancelling…' : 'Yes, cancel it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
