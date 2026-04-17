'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type PatientProfileFormProps = {
  patientProfile: {
    id: string
    full_name: string
    email: string
    role: string
    phone: string | null
    preferred_language: string | null
    email_notifications: boolean | null
    sms_notifications: boolean | null
  }
}

export default function PatientProfileForm({
  patientProfile,
}: PatientProfileFormProps) {
  const supabase = createClient()
  const router = useRouter()

  const [patientFullName, setPatientFullName] = useState(
    patientProfile.full_name || ''
  )
  const [patientPhoneNumber, setPatientPhoneNumber] = useState(
    patientProfile.phone || ''
  )
  const [patientPreferredLanguage, setPatientPreferredLanguage] = useState(
    patientProfile.preferred_language || 'English'
  )
  const [isEmailNotificationEnabled, setIsEmailNotificationEnabled] = useState(
    patientProfile.email_notifications ?? true
  )
  const [isSmsNotificationEnabled, setIsSmsNotificationEnabled] = useState(
    patientProfile.sms_notifications ?? false
  )

  const [isProfileUpdateLoading, setIsProfileUpdateLoading] = useState(false)
  const [profileUpdateSuccessMessage, setProfileUpdateSuccessMessage] =
    useState('')
  const [profileUpdateErrorMessage, setProfileUpdateErrorMessage] = useState('')

  const handlePatientProfileUpdate = async (e: FormEvent) => {
    e.preventDefault()

    setIsProfileUpdateLoading(true)
    setProfileUpdateSuccessMessage('')
    setProfileUpdateErrorMessage('')

    try {
      const { error: patientProfileUpdateError } = await supabase
        .from('profiles')
        .update({
          full_name: patientFullName.trim(),
          phone: patientPhoneNumber.trim() || null,
          preferred_language: patientPreferredLanguage,
          email_notifications: isEmailNotificationEnabled,
          sms_notifications: isSmsNotificationEnabled,
          updated_at: new Date().toISOString(),
        })
        .eq('id', patientProfile.id)

      if (patientProfileUpdateError) throw patientProfileUpdateError

      setProfileUpdateSuccessMessage('Profile updated successfully.')
      router.refresh()
    } catch (profileUpdateError: unknown) {
      if (profileUpdateError instanceof Error) {
        setProfileUpdateErrorMessage(profileUpdateError.message)
      } else {
        setProfileUpdateErrorMessage(
          'Something went wrong while updating the profile.'
        )
      }
    } finally {
      setIsProfileUpdateLoading(false)
    }
  }

  const patientProfileCompletionCount =
    Number(Boolean(patientFullName.trim())) +
    Number(Boolean(patientProfile.email)) +
    Number(Boolean(patientProfile.role)) +
    Number(Boolean(patientPhoneNumber.trim()))

  const patientProfileCompletionPercentage = Math.round(
    (patientProfileCompletionCount / 4) * 100
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="mx-auto max-w-2xl rounded-xl border bg-white p-6 shadow-md">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black">Patient Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and update your personal details and preferences.
          </p>
        </div>

        {/* Profile Completion */}
        <div className="mb-6 rounded-lg bg-gray-100 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Profile Completion
            </span>
            <span className="text-sm font-semibold text-black">
              {patientProfileCompletionPercentage}%
            </span>
          </div>
          <div className="h-3 w-full rounded bg-gray-300">
            <div
              className="h-3 rounded bg-black"
              style={{ width: `${patientProfileCompletionPercentage}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handlePatientProfileUpdate} className="space-y-5">
          
          {/* Full Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={patientFullName}
              onChange={(e) => setPatientFullName(e.target.value)}
              className="w-full rounded border p-3 text-black focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={patientProfile.email}
              className="w-full rounded border bg-gray-100 p-3 text-gray-600"
              disabled
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              value={patientProfile.role}
              className="w-full rounded border bg-gray-100 p-3 text-gray-600"
              disabled
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              value={patientPhoneNumber}
              onChange={(e) => setPatientPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="w-full rounded border p-3 text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Language */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Preferred Language
            </label>
            <select
              value={patientPreferredLanguage}
              onChange={(e) =>
                setPatientPreferredLanguage(e.target.value)
              }
              className="w-full rounded border p-3 text-black focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="English">English</option>
              <option value="Sinhala">Sinhala</option>
              <option value="Tamil">Tamil</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold text-black">
              Notification Preferences
            </h2>

            <label className="mb-3 flex items-center gap-3 text-gray-700">
              <input
                type="checkbox"
                checked={isEmailNotificationEnabled}
                onChange={(e) =>
                  setIsEmailNotificationEnabled(e.target.checked)
                }
              />
              Email Notifications
            </label>

            <label className="flex items-center gap-3 text-gray-700">
              <input
                type="checkbox"
                checked={isSmsNotificationEnabled}
                onChange={(e) =>
                  setIsSmsNotificationEnabled(e.target.checked)
                }
              />
              SMS Notifications
            </label>
          </div>

          {/* Messages */}
          {profileUpdateSuccessMessage && (
            <p className="text-sm text-green-600">
              {profileUpdateSuccessMessage}
            </p>
          )}

          {profileUpdateErrorMessage && (
            <p className="text-sm text-red-600">
              {profileUpdateErrorMessage}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isProfileUpdateLoading}
            className="w-full rounded bg-black px-5 py-3 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isProfileUpdateLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}