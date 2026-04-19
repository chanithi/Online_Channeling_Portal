'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-slate-900">
          MediLink <span className="text-cyan-500">Portal</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm text-slate-600">
          <Link
            href="/patient/dashboard"
            className="transition hover:text-blue-700"
          >
            Dashboard
          </Link>

          <Link
            href="/patient/appointments/history"
            className="transition hover:text-blue-700"
          >
            My Appointments
          </Link>

          <Link
            href="/patient/profile"
            className="transition hover:text-blue-700"
          >
            Profile
          </Link>
        </nav>
      </div>
    </header>
  )
}