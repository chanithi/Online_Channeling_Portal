// Types for Member 4 — Appointment Booking & Management

export type AppointmentStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'

export interface DoctorCentreSchedule {
  id: string
  doctor_id: string
  centre_id: string
  day_of_week: number        // 0=Sun … 6=Sat
  start_time: string         // "09:00"
  end_time: string           // "12:00"
  slot_duration_minutes: number
  total_slots: number
  consultation_fee: number
  is_active: boolean
  doctor?: DoctorProfile
  centre?: CentreProfile
}

export interface DoctorProfile {
  id: string
  full_name: string
  specialization: string
  qualifications: string
  bio?: string
  experience_years?: number
}

export interface CentreProfile {
  id: string
  name: string
  address: string
  phone?: string
}

export interface AppointmentSlot {
  schedule_id: string
  date: string               // "2026-04-22"
  time: string               // "09:00"
  is_available: boolean
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  centre_id: string
  schedule_id: string
  appointment_date: string   // "2026-04-22"
  appointment_time: string   // "09:00"
  status: AppointmentStatus
  reason_for_visit?: string
  consultation_fee: number
  booking_reference: string
  created_at: string
  updated_at: string
  // joined
  doctor?: DoctorProfile
  centre?: CentreProfile
}

export interface BookingFormData {
  doctor_id: string
  centre_id: string
  schedule_id: string
  appointment_date: string
  appointment_time: string
  reason_for_visit?: string
  consultation_fee: number
}
