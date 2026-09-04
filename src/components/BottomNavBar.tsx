'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, UserPlus, User, LogOut } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const residenteTabs = [
  { name: 'Inicio', href: '/residente', icon: Home },
  { name: 'Invitar', href: '/residente/nueva-visita', icon: UserPlus },
  { name: 'Perfil', href: '/residente/perfil', icon: User },
]

export default function BottomNavBar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {residenteTabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-[#0bf7ae]'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{tab.name}</span>
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-[#6B7280] hover:text-[#f26d6d] transition-colors"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-xs font-medium">Salir</span>
        </button>
      </div>
    </nav>
  )
}
