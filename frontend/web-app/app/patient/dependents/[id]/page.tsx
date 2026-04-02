"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
export default function EditDependentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  useEffect(() => {
    fetchDependent();
  }, [id]);

  async function fetchDependent() {
    const { data, error } = await supabase
      .from("dependents")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setForm({
        full_name: data.full_name || "",
        relationship: data.relationship || "",
        date_of_birth: data.date_of_birth || "",
        gender: data.gender || "",
        nic_passport: data.nic_passport || "",
        phone: data.phone || "",
        blood_group: data.blood_group || "",
        allergies: data.allergies || "",
        conditions: data.conditions || "",
      });
    }
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.full_name || !form.relationship || !form.date_of_birth || !form.gender || !form.nic_passport) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase
      .from("dependents")
      .update({ ...form })
      .eq("id", id);

    setSaving(false);

    if (updateError) {
      setError("Something went wrong. Please try again.");
    } else {
      setSuccess("Dependent updated successfully!");
      setTimeout(() => router.push("/patient/dependents"), 1200);
    }
  }

  async function handleDelete() {
    await supabase.from("dependents").delete().eq("id", id);
    router.push("/patient/dependents");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
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
            Home &gt;{" "}
            <Link href="/patient/dependents" className="hover:underline text-gray-600">Family & Dependents</Link>{" "}
            &gt; <span className="text-gray-600">Edit Dependent</span>
          </p>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit Dependent</h1>
              <p className="text-sm text-gray-500 mt-1">Update {form.full_name}'s information</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(true)}
                className="text-sm border border-red-200 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition"
              >
                🗑 Remove Dependent
              </button>
              <Link
                href="/patient/dependents"
                className="text-sm border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                ← Back
              </Link>
            </div>
          </div>

          <form onSubmit={handleSave} className="max-w-2xl">
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
                    rows={2}
                    placeholder="e.g. Diabetes, Hypertension"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            {success && <p className="text-sm text-green-600 mb-4">✅ {success}</p>}

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
                disabled={saving}
                className="flex-1 bg-[#1a237e] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-900 transition disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Remove Dependent?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently remove <strong>{form.full_name}</strong> from your profile.
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
