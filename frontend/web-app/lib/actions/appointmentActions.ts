'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  Appointment,
  BookingFormData,
  AppointmentSlot,
  DoctorCentreSchedule,
} from '@/lib/types/appointment'

// ─── Get all appointments for the logged-in patient ─────────────────────────
export async function getPatientAppointments(): Promise<Appointment[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctor:profiles!appointments_doctor_id_fkey(id, full_name, specialization, qualifications),
      centre:channeling_centres!appointments_centre_id_fkey(id, name, address)
    `)
    .eq('patient_id', user.id)
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false })

  if (error) {
    console.error('getPatientAppointments error:', error.message)
    return []
  }

  return (data as Appointment[]) ?? []
}

// ─── Get a single appointment by ID ─────────────────────────────────────────
export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctor:profiles!appointments_doctor_id_fkey(id, full_name, specialization, qualifications, bio, experience_years),
      centre:channeling_centres!appointments_centre_id_fkey(id, name, address, phone)
    `)
    .eq('id', id)
    .eq('patient_id', user.id)
    .single()

  if (error) {
    console.error('getAppointmentById error:', error.message)
    return null
  }

  return data as Appointment
}

// ─── Get available schedules for a doctor ───────────────────────────────────
export async function getDoctorSchedules(doctorId: string): Promise<DoctorCentreSchedule[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('doctor_centre_schedules')
    .select(`
      *,
      centre:channeling_centres!doctor_centre_schedules_centre_id_fkey(id, name, address)
    `)
    .eq('doctor_id', doctorId)
    .eq('is_active', true)

  if (error) {
    console.error('getDoctorSchedules error:', error.message)
    return []
  }

  return (data as DoctorCentreSchedule[]) ?? []
}

// ─── Get available slots for a schedule on a date ───────────────────────────
export async function getAvailableSlots(
  scheduleId: string,
  date: string
): Promise<AppointmentSlot[]> {
  const supabase = await createClient()

  // Fetch the schedule to build time slots
  const { data: schedule, error: scheduleError } = await supabase
    .from('doctor_centre_schedules')
    .select('start_time, end_time, slot_duration_minutes, total_slots')
    .eq('id', scheduleId)
    .single()

  if (scheduleError || !schedule) return []

  // Fetch already-booked slots for this date
  const { data: booked, error: bookedError } = await supabase
    .from('appointments')
    .select('appointment_time')
    .eq('schedule_id', scheduleId)
    .eq('appointment_date', date)
    .in('status', ['pending_payment', 'confirmed'])

  if (bookedError) {
    console.error('getAvailableSlots booked error:', bookedError.message)
    return []
  }

  const bookedTimes = new Set((booked ?? []).map((b) => b.appointment_time))

  // Generate all time slots between start and end
  const slots: AppointmentSlot[] = []
  const [startH, startM] = schedule.start_time.split(':').map(Number)
  const [endH, endM] = schedule.end_time.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  const duration = schedule.slot_duration_minutes ?? 30

  for (let m = startMinutes; m < endMinutes; m += duration) {
    const hh = String(Math.floor(m / 60)).padStart(2, '0')
    const mm = String(m % 60).padStart(2, '0')
    const time = `${hh}:${mm}`
    slots.push({
      schedule_id: scheduleId,
      date,
      time,
      is_available: !bookedTimes.has(time),
    })
  }

  return slots
}

// ─── Book a new appointment ──────────────────────────────────────────────────
export async function bookAppointment(
  formData: BookingFormData
): Promise<{ success: boolean; appointmentId?: string; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated' }

  // Generate a booking reference
  const bookingRef = `BK${Date.now().toString().slice(-6)}`

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      patient_id: user.id,
      doctor_id: formData.doctor_id,
      centre_id: formData.centre_id,
      schedule_id: formData.schedule_id,
      appointment_date: formData.appointment_date,
      appointment_time: formData.appointment_time,
      reason_for_visit: formData.reason_for_visit ?? null,
      consultation_fee: formData.consultation_fee,
      status: 'pending_payment',
      booking_reference: bookingRef,
    })
    .select('id')
    .single()

  if (error) {
    console.error('bookAppointment error:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/patient/appointments/history')
  return { success: true, appointmentId: data.id }
}

// ─── Cancel an appointment ───────────────────────────────────────────────────
export async function cancelAppointment(
  appointmentId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', appointmentId)
    .eq('patient_id', user.id)
    .in('status', ['pending_payment', 'confirmed'])

  if (error) {
    console.error('cancelAppointment error:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/patient/appointments/history')
  return { success: true }
}

// ─── Reschedule an appointment ───────────────────────────────────────────────
export async function rescheduleAppointment(
  appointmentId: string,
  newDate: string,
  newTime: string,
  newScheduleId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('appointments')
    .update({
      appointment_date: newDate,
      appointment_time: newTime,
      schedule_id: newScheduleId,
      status: 'confirmed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', appointmentId)
    .eq('patient_id', user.id)
    .in('status', ['confirmed'])

  if (error) {
    console.error('rescheduleAppointment error:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/patient/appointments/history')
  revalidatePath(`/patient/appointments/${appointmentId}`)
  return { success: true }
}

// ─── Get next available slot suggestion for a doctor ────────────────────────
export async function getNextAvailableSlot(
  doctorId: string
): Promise<{ date: string; time: string; centre: string; scheduleId: string } | null> {
  const supabase = await createClient()

  const { data: schedules, error } = await supabase
    .from('doctor_centre_schedules')
    .select(`
      id, day_of_week, start_time, slot_duration_minutes, total_slots,
      centre:channeling_centres!doctor_centre_schedules_centre_id_fkey(name)
    `)
    .eq('doctor_id', doctorId)
    .eq('is_active', true)

  if (error || !schedules?.length) return null

  // Check the next 14 days
  for (let offset = 1; offset <= 14; offset++) {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    const dayOfWeek = date.getDay()
    const dateStr = date.toISOString().split('T')[0]

    const matchingSchedules = schedules.filter((s) => s.day_of_week === dayOfWeek)
    for (const schedule of matchingSchedules) {
      const slots = await getAvailableSlots(schedule.id, dateStr)
      const firstAvailable = slots.find((s) => s.is_available)
      if (firstAvailable) {
        return {
          date: dateStr,
          time: firstAvailable.time,
          centre: (schedule.centre as unknown as { name: string })?.name ?? '',
          scheduleId: schedule.id,
        }
      }
    }
  }

  return null
}
