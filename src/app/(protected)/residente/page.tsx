import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { UserPlus } from 'lucide-react'
import VisitCard from '@/components/VisitCard'

export default async function ResidenteDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: visitas } = await supabase
    .from('visitas')
    .select(`
      *,
      visitantes (nombre, apellido)
    `)
    .eq('residente_id', user?.id || '')
    .order('fecha_creacion', { ascending: false })

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Mis Visitas</h1>
          <p className="text-[#6B7280] text-sm">Gestiona tus invitaciones</p>
        </div>
        <Link
          href="/residente/nueva-visita"
          className="flex items-center gap-2 bg-[#0bf7ae] text-[#1F2937] px-4 py-3 rounded-lg font-medium hover:bg-[#0bf7ae]/90 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          <span>Nueva</span>
        </Link>
      </div>

      {/* Lista de visitas */}
      <div>
        {visitas && visitas.length > 0 ? (
          visitas.map((visita) => (
            <VisitCard
              key={visita.id}
              visitante={visita.visitantes}
              tipo_visita={visita.tipo_visita}
              fecha_esperada={visita.fecha_esperada}
              estado={visita.estado}
              codigo_pin={visita.codigo_pin}
              placa_vehiculo={visita.placa_vehiculo}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-[#6B7280]">No tienes visitas programadas</p>
            <Link
              href="/residente/nueva-visita"
              className="inline-block mt-4 text-[#0bf7ae] font-medium hover:underline"
            >
              Crear primera invitación
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
