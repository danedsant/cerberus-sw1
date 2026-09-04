import BottomNavBar from '@/components/BottomNavBar'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <main className="pb-20">{children}</main>
      <BottomNavBar />
    </div>
  )
}
