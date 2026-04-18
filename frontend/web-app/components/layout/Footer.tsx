// export default function Footer() {
//   return (
//     <footer className="mt-10 border-t border-slate-200 bg-white">
//       <div className="mx-auto max-w-7xl px-6 py-4 text-center text-sm text-slate-500">
//         <p>© 2026 MediLink Portal</p>
//         <p className="mt-1">
//           A unified system for patients, doctors, and channeling centers
//         </p>
//       </div>
//     </footer>
//   )
// }
export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-slate-500">
        <p className="font-medium text-slate-900">
          MediLink <span className="text-cyan-500">Portal</span>
        </p>

        <p className="mt-2 text-slate-500">
          A connected healthcare platform for patients, doctors, and channeling centers.
        </p>

        <div className="my-4 h-px w-full bg-slate-200" />

        <p className="text-xs text-slate-400">
          © 2026 MediLink Portal. All rights reserved.
        </p>
      </div>
    </footer>
  )
}