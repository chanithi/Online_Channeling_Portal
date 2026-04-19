'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAvailableSlots, rescheduleAppointment } from '@/lib/actions/appointmentActions'
import type { AppointmentSlot } from '@/lib/types/appointment'

interface Props {
  appointmentId: string
  scheduleId: string
  currentDate: string
  currentTime: string
}

// Build the next 14 days as selectable options
function getUpcomingDates(): { label: string; value: string }[] {
  const dates = []
  for (let i = 1; i <= 14; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dates.push({
      label: d.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      value: d.toISOString().split('T')[0],
    })
  }
  return dates
}

export default function RescheduleModal({
  appointmentId,
  scheduleId,
  currentDate,
  currentTime,
}: Props) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(currentDate)
  const [selectedTime, setSelectedTime] = useState('')
  const [slots, setSlots] = useState<AppointmentSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const dates = getUpcomingDates()

  // Fetch slots whenever the date changes
  useEffect(() => {
    if (!open) return
    setLoadingSlots(true)
    setSelectedTime('')
    getAvailableSlots(scheduleId, selectedDate).then((data) => {
      setSlots(data)
      setLoadingSlots(false)
    })
  }, [selectedDate, open, scheduleId])

  const handleSubmit = () => {
    if (!selectedTime) {
      setError('Please select a time slot.')
      return
    }
    setError('')
    startTransition(async () => {
      const result = await rescheduleAppointment(
        appointmentId,
        selectedDate,
        selectedTime,
        scheduleId
      )
      if (result.success) {
        setOpen(false)
        router.refresh()
      } else {
        setError(result.error ?? 'Failed to reschedule.')
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Reschedule
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Reschedule appointment
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Date selector */}
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Select a new date
            </p>
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {dates.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className={`flex-shrink-0 rounded-xl border px-3 py-2 text-center text-xs font-semibold transition ${
                    selectedDate === d.value
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Slot grid */}
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Select a time slot
            </p>
            {loadingSlots ? (
              <p className="py-4 text-center text-sm text-slate-500">
                Loading slots…
              </p>
            ) : slots.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-500">
                No slots available on this date.
              </p>
            ) : (
              <div className="mb-4 grid grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.is_available || slot.time === currentTime}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`rounded-lg border py-2 text-xs font-semibold transition ${
                      !slot.is_available || slot.time === currentTime
                        ? 'cursor-not-allowed border-slate-100 text-slate-300 line-through'
                        : selectedTime === slot.time
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending || !selectedTime}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {isPending ? 'Saving…' : 'Confirm reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
