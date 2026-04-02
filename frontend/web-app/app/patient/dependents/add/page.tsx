"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function AddDependentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    relationship: "",
    date_of_birth: "",
    gender: "",
    nic_passport: "",
    phone: "",
    blood_group: "",
    allergies: "",
    conditions: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.full_name || !form.relationship || !form.date_of_birth || !form.gender || !form.nic_passport) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("dependents").insert({
      patient_id: user.id,
      full_name: form.full_name,
      relationship: form.relationship,
      date_of_birth: form.date_of_birth,
      gender: form.gender,
      nic_passport: form.nic_passport,
      phone: form.phone,
      blood_group: form.blood_group,
      allergies: form.allergies,
      conditions: form.conditions,
    });

    setLoading(false);

    if (insertError) {
      setError("Something went wrong. Please try again.");
    } else {
      router.push("/patient/dependents");
    }
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
        <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-sm font-bold">P</div>
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
            Home &gt; <Link href="/patient/dependents" className="hover:underline text-gray-600">Family & Dependents</Link> &gt; <span className="text-gray-600">Add Dependent</span>
          </p>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Add Dependent</h1>
              <p className="text-sm text-gray-500 mt-1">Add a family member to book appointments on their behalf</p>
            </div>
            <Link
              href="/patient/dependents"
              className="text-sm border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              ← Back
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl">
            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Personal Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="e.g. Kasun Perera"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Relationship <span className="text-red-400">*</span></label>
                  <select
                    name="relationship"
                    value={form.relationship}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Select relationship</option>
                    <option>Spouse</option>
                    <option>Child</option>
                    <option>Parent</option>
                    <option>Sibling</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Gender <span className="text-red-400">*</span></label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date of Birth <span className="text-red-400">*</span></label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">NIC / Passport Number <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    name="nic_passport"
                    value={form.nic_passport}
                    onChange={handleChange}
                    placeholder="e.g. 990123456V"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Medical Information <span className="text-gray-400 font-normal normal-case">(optional)</span></h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Blood Group</label>
                  <select
                    name="blood_group"
                    value={form.blood_group}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Select blood group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Known Allergies</label>
                  <input
                    type="text"
                    name="allergies"
                    value={form.allergies}
                    onChange={handleChange}
                    placeholder="e.g. Penicillin, Pollen"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Chronic Conditions</label>
                  <textarea
                    name="conditions"
                    value={form.conditions}
                    onChange={handleChange}
                    placeholder="e.g. Diabetes, Hypertension"
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 mb-4">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href="/patient/dependents"
                className="flex-1 text-center border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#1a237e] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-900 transition disabled:opacity-60"
              >
                {loading ? "Adding..." : "Add Dependent"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
