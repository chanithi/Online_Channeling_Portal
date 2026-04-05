'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ProfileData = {
  full_name: string
  email: string
  role: string
  phone: string | null
}

type DoctorData = {
  name: string
  specialization: string | null
  phone: string | null
}

type ProfileFormProps = {
  userId: string
  initialProfile: ProfileData
  initialDoctor: DoctorData | null
}

export default function ProfileForm({
  userId,
  initialProfile,
  initialDoctor,
}: ProfileFormProps) {
  const supabase = createClient()

  const [fullName, setFullName] = useState(initialProfile.full_name)
  const [phone, setPhone] = useState(initialDoctor?.phone ?? initialProfile.phone ?? '')
  const [specialization, setSpecialization] = useState(
    initialDoctor?.specialization ?? ''
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const cleanedName = fullName.trim()
      const cleanedPhone = phone.trim()
      const cleanedSpecialization = specialization.trim()

      if (!cleanedName) {
        throw new Error('Full name is required')
      }

      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          full_name: cleanedName,
          phone: cleanedPhone || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (profileUpdateError) {
        throw profileUpdateError
      }

      const { error: doctorUpsertError } = await supabase.from('doctors').upsert(
        {
          userid: userId,
          name: cleanedName,
          phone: cleanedPhone || null,
          specialization: cleanedSpecialization || null,
        },
        { onConflict: 'userid' }
      )

      if (doctorUpsertError) {
        throw doctorUpsertError
      }

      setSuccess('Profile updated successfully.')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to update profile')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded border p-4">
        <h2 className="mb-3 text-lg font-semibold">View Profile</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Full Name:</span> {fullName || '-'}
          </p>
          <p>
            <span className="font-medium">Email:</span> {initialProfile.email}
          </p>
          <p>
            <span className="font-medium">Role:</span> {initialProfile.role}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {phone || '-'}
          </p>
          <p>
            <span className="font-medium">Specialization:</span>{' '}
            {specialization || '-'}
          </p>
        </div>
      </section>

      <section className="rounded border p-4">
        <h2 className="mb-3 text-lg font-semibold">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="full-name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded border p-2"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="specialization" className="text-sm font-medium">
              Specialization
            </label>
            <input
              id="specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>
    </div>
  )
}
