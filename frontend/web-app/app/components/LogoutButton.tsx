// 'use client'

// import { useRouter } from 'next/navigation'
// import { createClient } from '@/lib/supabase/client'

// export default function LogoutButton() {
//   const router = useRouter()

//   const handleLogout = async () => {
//     const supabase = createClient()
//     await supabase.auth.signOut()
//     router.push('/login')
//     router.refresh()
//   }

//   return (
//     <button
//       onClick={handleLogout}
//       className="rounded bg-black px-4 py-2 text-white"
//     >
//       Logout
//     </button>
//   )
// }

'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
    >
      Logout
    </button>
  )
}