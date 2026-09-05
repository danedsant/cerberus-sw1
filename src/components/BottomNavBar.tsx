'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, UserPlus, IdCard, LogOut, Users, Building, History, ScanLine } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const tabsByRole: Record<string, { name: string; href: string; icon: typeof Home }[]> = {
  residente: [
    { name: 'Inicio', href: '/residente', icon: Home },
    { name: 'Mi QR', href: '/residente/mi-qr', icon: IdCard },
    { name: 'Invitar', href: '/residente/nueva-visita', icon: UserPlus },
  ],
  administrativo: [
    { name: 'Inicio', href: '/admin', icon: Home },
    { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
    { name: 'Propiedades', href: '/admin/propiedades', icon: Building },
    { name: 'Historial', href: '/admin/historial', icon: History },
  ],
  superadmin: [
    { name: 'Inicio', href: '/admin', icon: Home },
    { name: 'Usuarios', href: '/admin/usuarios', icon: Users },
    { name: 'Propiedades', href: '/admin/propiedades', icon: Building },
    { name: 'Historial', href: '/admin/historial', icon: History },
  ],
  vigilante: [
    { name: 'Inicio', href: '/vigilante', icon: Home },
    { name: 'Escanear', href: '/vigilante/escanear', icon: ScanLine },
    { name: 'Historial', href: '/vigilante/historial', icon: History },
  ],
}

const accentByRole: Record<string, string> = {
  residente: 'text-[#0bf7ae]',
  administrativo: 'text-[#FDBA74]',
  superadmin: 'text-[#334155]',
  vigilante: 'text-[#2563EB]',
}

export default function BottomNavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [rol, setRol] = useState<string | null>(null)

  useEffect(() => {
    const fetchRol = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('rol')
          .eq('id', user.id)
          .single()
        setRol(usuario?.rol || null)
      }
    }
    fetchRol()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const tabs = rol ? tabsByRole[rol] : tabsByRole.residente
  const activeColor = rol ? accentByRole[rol] : 'text-[#0bf7ae]'

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? activeColor
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
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-[#6B7280] hover:text-[#f26d6d] transition-colors"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-xs font-medium">Salir</span>
        </button>
      </div>
    </nav>
  )
}
