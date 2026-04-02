"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
type Dependent = {
  id: string;
  full_name: string;
  relationship: string;
  date_of_birth: string;
  gender: string;
  nic_passport: string;
};

export default function DependentsPage() {
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchDependents();
  }, []);

  async function fetchDependents() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("dependents")
      .select("*")
      .eq("patient_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setDependents(data);
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    await supabase.from("dependents").delete().eq("id", deleteId);
    setShowConfirm(false);
    setDeleteId(null);
    fetchDependents();
  }

  function confirmDelete(id: string) {
    setDeleteId(id);
    setShowConfirm(true);
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function calculateAge(dob: string) {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-[#1a237e] text-white px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-8">
          <span className="font-bold text-xl tracking-tight">
            <span className="text-white">Medi</span>
            <span className="text-blue-300">Channel</span>
          </span>
          <div className="hidden md:flex gap-6 text-sm">
            <Link href="/patient/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
            <Link href="/patient/doctors" className="hover:text-blue-200 transition">Find Doctors</Link>
            <Link href="/patient/bookings" className="hover:text-blue-200 transition">My Bookings</Link>
            <Link href="/patient/payments" className="hover:text-blue-200 transition">Payments</Link>
            <Link href="/patient/notifications" className="hover:text-blue-200 transition">Notifications</Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-sm font-bold">P</div>
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-52 min-h-screen bg-white border-r border-gray-200 pt-6 px-3 shrink-0">
          <p className="text-xs text-gray-400 uppercase font-semibold px-3 mb-2">Main</p>
          <nav className="space-y-1 mb-4">
            <Link href="/patient/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">🏠 Dashboard</Link>
            <Link href="/patient/bookings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">📋 My Appointments</Link>
            <Link href="/patient/payments" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">💳 Payment History</Link>
          </nav>
          <p className="text-xs text-gray-400 uppercase font-semibold px-3 mb-2">Profile</p>
          <nav className="space-y-1 mb-4">
            <Link href="/patient/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">👤 My Profile</Link>
            <Link href="/patient/dependents" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-blue-50 text-[#1a237e] font-medium">👨‍👩‍👧 Dependents</Link>
            <Link href="/patient/notifications" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">🔔 Notifications</Link>
            <Link href="/patient/favourites" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">⭐ Favourites</Link>
          </nav>
          <p className="text-xs text-gray-400 uppercase font-semibold px-3 mb-2">Support</p>
          <nav className="space-y-1">
            <Link href="/patient/help" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">❓ Help & Support</Link>
            <Link href="/patient/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">⚙️ Settings</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Breadcrumb */}
          <p className="text-sm text-gray-400 mb-1">
            Home &gt; <span className="text-gray-600">Family & Dependents</span>
          </p>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Family & Dependents</h1>
              <p className="text-sm text-gray-500 mt-1">Manage family profiles for booking appointments</p>
            </div>
            <Link
              href="/patient/dependents/add"
              className="bg-[#1a237e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition"
            >
              + Add Dependent
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading...</div>
          ) : dependents.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
              <div className="text-5xl mb-4">👨‍👩‍👧</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No dependents added yet</h3>
              <p className="text-sm text-gray-400 mb-6">Add family members so you can book appointments on their behalf</p>
              <Link
                href="/patient/dependents/add"
                className="bg-[#1a237e] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition"
              >
                + Add First Dependent
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {dependents.map((dep) => (
                <div
                  key={dep.id}
                  className="bg-white rounded-xl border border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#1a237e] text-white flex items-center justify-center font-bold text-sm">
                      {getInitials(dep.full_name)}
                    </div>
                    {/* Info */}
                    <div>
                      <h3 className="font-semibold text-gray-800">{dep.full_name}</h3>
                      <p className="text-sm text-gray-500">
                        {dep.relationship} &bull; {dep.gender} &bull; Age {calculateAge(dep.date_of_birth)}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">NIC/Passport: {dep.nic_passport}</p>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-blue-50 text-[#1a237e] px-3 py-1 rounded-full font-medium">
                      {dep.relationship}
                    </span>
                    <Link
                      href={`/patient/dependents/${dep.id}`}
                      className="text-sm border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => confirmDelete(dep.id)}
                      className="text-sm border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Remove Dependent?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently remove this dependent from your profile.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 transition"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
