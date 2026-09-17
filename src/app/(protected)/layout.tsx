import Header from '@/components/Header'
import BottomNavBar from '@/components/BottomNavBar'
import { marcarVisitasExpiradas } from '@/lib/actions'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Marcar visitas expiradas en cada carga de página protegida
  await marcarVisitasExpiradas()

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Header />
      <main className="pb-20">{children}</main>
      <BottomNavBar />
    </div>
  )
}
