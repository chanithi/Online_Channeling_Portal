// // import Image from "next/image";

// // export default function Home() {
// //   return (
// //     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
// //       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
// //         <Image
// //           className="dark:invert"
// //           src="/next.svg"
// //           alt="Next.js logo"
// //           width={100}
// //           height={20}
// //           priority
// //         />
// //         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
// //           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
// //             To get started, edit the page.tsx file.
// //           </h1>
// //           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
// //             Looking for a starting point or more instructions? Head over to{" "}
// //             <a
// //               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //               className="font-medium text-zinc-950 dark:text-zinc-50"
// //             >
// //               Templates
// //             </a>{" "}
// //             or the{" "}
// //             <a
// //               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //               className="font-medium text-zinc-950 dark:text-zinc-50"
// //             >
// //               Learning
// //             </a>{" "}
// //             center.
// //           </p>
// //         </div>
// //         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
// //           <a
// //             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
// //             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //           >
// //             <Image
// //               className="dark:invert"
// //               src="/vercel.svg"
// //               alt="Vercel logomark"
// //               width={16}
// //               height={16}
// //             />
// //             Deploy Now
// //           </a>
// //           <a
// //             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
// //             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //           >
// //             Documentation
// //           </a>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }
// // import { redirect } from 'next/navigation'
// // import { createClient } from '@/lib/supabase/server'

// // export default async function HomePage() {
// //   const supabase = await createClient()

// //   const {
// //     data: { user },
// //   } = await supabase.auth.getUser()

// //   if (!user) {
// //     redirect('/login')
// //   }

// //   const { data: profile } = await supabase
// //     .from('profiles')
// //     .select('role')
// //     .eq('id', user.id)
// //     .single()

// //   if (!profile) {
// //     redirect('/login')
// //   }

// //   if (profile.role === 'patient') redirect('/patient/dashboard')
// //   if (profile.role === 'doctor') redirect('/doctor/dashboard')
// //   if (profile.role === 'centre_admin') redirect('/centre-admin/dashboard')
// //   if (profile.role === 'portal_admin') redirect('/portal-admin/dashboard')

// //   redirect('/login')
// // }

// import Link from 'next/link'

// export default function HomePage() {
//   return (
//     <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">

//       {/* Background Gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-cyan-600 to-blue-500 opacity-90" />

//       {/* Soft Blur Circles */}
//       <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
//       <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

//       {/* Content */}
//       <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
//         <div className="grid max-w-6xl items-center gap-10 lg:grid-cols-2">

//           {/* Left Section */}
//           <div className="text-white">
//             <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
//               MediLink Portal
//             </p>

//             <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
//               Smarter channeling, simpler healthcare access.
//             </h1>

//             <p className="mt-6 max-w-xl text-lg leading-8 text-white/90">
//               A modern healthcare platform connecting patients, doctors, and
//               channeling centers in one seamless experience.
//             </p>

//             <div className="mt-8 flex flex-wrap gap-4">
//               <Link
//                 href="/login"
//                 className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-100"
//               >
//                 Sign In
//               </Link>

//               <Link
//                 href="/register"
//                 className="rounded-lg border border-white px-6 py-3 font-semibold text-white transition hover:bg-white/20"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           </div>

//           {/* Right Section (Glass Card) */}
//           <div className="rounded-3xl bg-white/10 p-8 text-white backdrop-blur-lg shadow-2xl">
//             <h2 className="text-2xl font-bold">
//               Why MediLink Portal?
//             </h2>

//             <div className="mt-6 space-y-4 text-sm leading-6 text-white/90">
//               <p>• One secure platform for all healthcare interactions</p>
//               <p>• Connect patients, doctors, and centers effortlessly</p>
//               <p>• Organized and role-based user experience</p>
//               <p>• Fast, clean, and user-friendly system</p>
//             </div>

//             <div className="mt-6 grid gap-4 sm:grid-cols-2">
//               <div className="rounded-xl bg-white/10 p-4">
//                 <p className="text-xl font-bold">24/7</p>
//                 <p className="text-sm text-white/90">
//                   Access anytime
//                 </p>
//               </div>

//               <div className="rounded-xl bg-white/10 p-4">
//                 <p className="text-xl font-bold">Secure</p>
//                 <p className="text-sm text-white/90">
//                   Protected system
//                 </p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Footer */}
//       <div className="absolute bottom-4 w-full text-center text-sm text-white/70">
//         © 2026 MediLink Portal
//       </div>
//     </div>
//   )
// }

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-cyan-700 to-blue-600" />

      {/* Glow Effects */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-300/20 blur-3xl" />

      {/* Grid Texture */}
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center px-6">
        <div className="mx-auto w-full max-w-7xl">

          {/* TOP HERO */}
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
              MediLink Portal
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Smarter channeling.
              <br />
              <span className="text-cyan-300">
                Better healthcare access.
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/90">
              A seamless platform connecting patients, doctors, and channeling
              centers — designed to simplify healthcare interactions and
              improve accessibility for everyone.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg transition hover:bg-blue-100"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-white px-6 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* SPREAD CONTENT SECTION */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold text-white">
                Secure & Reliable
              </p>
              <p className="mt-2 text-sm text-white/80">
                Role-based authentication ensures safe and structured access for every user.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold text-white">
                Unified Experience
              </p>
              <p className="mt-2 text-sm text-white/80">
                Patients, doctors, and centers operate within one connected system.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold text-white">
                Simplified Channeling
              </p>
              <p className="mt-2 text-sm text-white/80">
                Manage appointments and interactions with clarity and ease.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold text-white">
                Designed for Real Use
              </p>
              <p className="mt-2 text-sm text-white/80">
                Built around actual healthcare workflows, not just features.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold text-white">
                Fast & Intuitive
              </p>
              <p className="mt-2 text-sm text-white/80">
                Clean interface for quick navigation and better usability.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold text-white">
                Always Accessible
              </p>
              <p className="mt-2 text-sm text-white/80">
                Access your healthcare services anytime, anywhere.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full text-center text-sm text-white/70">
        © 2026 MediLink Portal
      </div>
    </div>
  )
}