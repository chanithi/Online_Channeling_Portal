'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  getAvailableSlots,
  bookAppointment,
} from '@/lib/actions/appointmentActions'
import type {
  DoctorCentreSchedule,
  AppointmentSlot,
} from '@/lib/types/appointment'

interface Props {
  doctorId: string
  doctorName: string
  schedules: DoctorCentreSchedule[]
}

// Build the next 14 days
function getUpcomingDates(dayOfWeek: number): { label: string; value: string }[] {
  const dates = []
  for (let i = 1; i <= 60; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    if (d.getDay() === dayOfWeek) {
      dates.push({
        label: d.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
        value: d.toISOString().split('T')[0],
      })
      if (dates.length >= 6) break
    }
  }
  return dates
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function BookingForm({ doctorId, doctorName, schedules }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 1 — Centre/schedule selection
  const [selectedSchedule, setSelectedSchedule] =
    useState<DoctorCentreSchedule | null>(null)

  // Step 2 — Date + time
  const [availableDates, setAvailableDates] = useState<
    { label: string; value: string }[]
  >([])
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState<AppointmentSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedTime, setSelectedTime] = useState('')

  // Step 3 — Review + reason
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  // When a schedule is chosen, rebuild available dates
  useEffect(() => {
    if (!selectedSchedule) return
    const dates = getUpcomingDates(selectedSchedule.day_of_week)
    setAvailableDates(dates)
    setSelectedDate(dates[0]?.value ?? '')
    setSelectedTime('')
    setSlots([])
  }, [selectedSchedule])

  // When date changes, fetch slots
  useEffect(() => {
    if (!selectedSchedule || !selectedDate) return
    setLoadingSlots(true)
    setSelectedTime('')
    getAvailableSlots(selectedSchedule.id, selectedDate).then((data) => {
      setSlots(data)
      setLoadingSlots(false)
    })
  }, [selectedDate, selectedSchedule])

  const handleBook = () => {
    if (!selectedSchedule || !selectedDate || !selectedTime) return
    setError('')
    startTransition(async () => {
      const result = await bookAppointment({
        doctor_id: doctorId,
        centre_id: selectedSchedule.centre_id,
        schedule_id: selectedSchedule.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        reason_for_visit: reason.trim() || undefined,
        consultation_fee: selectedSchedule.consultation_fee,
      })
      if (result.success && result.appointmentId) {
        router.push(
          `/patient/appointments/${result.appointmentId}?booked=true`
        )
      } else {
        setError(result.error ?? 'Booking failed. Please try again.')
      }
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Step progress */}
      <div className="mb-6 flex items-center gap-3">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                step >= s
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {s}
            </div>
            <span
              className={`text-sm font-medium ${
                step >= s ? 'text-slate-800' : 'text-slate-400'
              }`}
            >
              {s === 1 ? 'Centre' : s === 2 ? 'Date & Time' : 'Review'}
            </span>
            {s < 3 && (
              <div
                className={`h-0.5 w-8 rounded ${
                  step > s ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Choose centre ── */}
      {step === 1 && (
        <div>
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Select channeling centre
          </h2>
          {schedules.length === 0 ? (
            <p className="text-sm text-slate-500">
              No schedules available for this doctor.
            </p>
          ) : (
            <div className="space-y-3">
              {schedules.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSchedule(s)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    selectedSchedule?.id === s.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {(s.centre as { name?: string })?.name ?? 'Centre'}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {(s.centre as { address?: string })?.address}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {DAY_NAMES[s.day_of_week]}s · {s.start_time} –{' '}
                        {s.end_time}
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      LKR {s.consultation_fee.toLocaleString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              disabled={!selectedSchedule}
              onClick={() => setStep(2)}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-blue-700"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Date + Time ── */}
      {step === 2 && (
        <div>
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Select date &amp; time slot
          </h2>

          {/* Date row */}
          <p className="mb-2 text-sm font-medium text-slate-700">
            Available dates
          </p>
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {availableDates.map((d) => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`flex-shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  selectedDate === d.value
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Time slots */}
          <p className="mb-2 text-sm font-medium text-slate-700">
            Available time slots
          </p>
          {loadingSlots ? (
            <p className="py-6 text-center text-sm text-slate-500">
              Loading slots…
            </p>
          ) : slots.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No slots on this date.
            </p>
          ) : (
            <div className="mb-2 grid grid-cols-5 gap-2 sm:grid-cols-6">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.is_available}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`rounded-lg border py-2 text-xs font-semibold transition ${
                    !slot.is_available
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
          <p className="mb-5 text-xs text-slate-400">
            Strikethrough slots are already booked
          </p>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ← Back
            </button>
            <button
              disabled={!selectedTime}
              onClick={() => setStep(3)}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-blue-700"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review + confirm ── */}
      {step === 3 && selectedSchedule && (
        <div>
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Review &amp; confirm
          </h2>

          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="mb-2 flex justify-between">
              <span className="text-slate-500">Doctor</span>
              <span className="font-semibold text-slate-900">{doctorName}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-slate-500">Centre</span>
              <span className="font-semibold text-slate-900">
                {(selectedSchedule.centre as { name?: string })?.name}
              </span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-slate-500">Date</span>
              <span className="font-semibold text-slate-900">
                {new Date(selectedDate).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-slate-500">Time</span>
              <span className="font-semibold text-blue-600">{selectedTime}</span>
            </div>
            <div className="border-t border-slate-200 pt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">
                  Consultation fee
                </span>
                <span className="font-bold text-blue-700">
                  LKR {selectedSchedule.consultation_fee.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Reason for visit */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Reason for visit{' '}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Briefly describe your symptoms or reason…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            />
          </div>

          {error && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ← Back
            </button>
            <button
              onClick={handleBook}
              disabled={isPending}
              className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:bg-blue-700"
            >
              {isPending ? 'Booking…' : 'Confirm booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
