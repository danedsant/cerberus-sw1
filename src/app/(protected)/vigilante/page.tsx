import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { ScanLine, Keyboard, Clock } from 'lucide-react'

export default async function VigilanteDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre, apellido')
    .eq('id', user?.id || '')
    .single()

  const { count: visitasPendientes } = await supabase
    .from('visitas')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'pendiente')

  return (
    <div className="p-4 min-h-screen bg-[#1F2937]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Portería</h1>
        <p className="text-gray-400">
          Bienvenido, {usuario?.nombre} {usuario?.apellido}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="mb-8 bg-[#2563EB]/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-[#2563EB]" />
          <div>
            <p className="text-2xl font-bold text-white">{visitasPendientes || 0}</p>
            <p className="text-sm text-gray-400">Visitas pendientes hoy</p>
          </div>
        </div>
      </div>

      {/* Botones principales - Tamaño grande para móvil */}
      <div className="space-y-4">
        <Link
          href="/vigilante/escanear?scan=true"
          className="flex items-center justify-center gap-4 w-full h-24 bg-[#2563EB] text-white rounded-xl font-bold text-lg hover:bg-[#2563EB]/90 transition-colors"
        >
          <ScanLine className="w-8 h-8" />
          <span>Escanear QR</span>
        </Link>

        <Link
          href="/vigilante/pin"
          className="flex items-center justify-center gap-4 w-full h-24 bg-white text-[#1F2937] rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
        >
          <Keyboard className="w-8 h-8" />
          <span>Ingresar PIN</span>
        </Link>
      </div>

      {/* Últimos ingresos */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-white mb-4">Últimos ingresos</h2>
        <UltimosIngresos />
      </div>
    </div>
  )
}

async function UltimosIngresos() {
  const supabase = await createClient()

  const { data: ingresos } = await supabase
    .from('visitas')
    .select(`
      id,
      fecha_hora_ingreso,
      tipo_visita,
      visitantes (nombre, apellido)
    `)
    .eq('estado', 'ingresado')
    .order('fecha_hora_ingreso', { ascending: false })
    .limit(5)

  if (!ingresos || ingresos.length === 0) {
    return (
      <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
        <p className="text-gray-400">No hay ingresos recientes</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {ingresos.map((ingreso) => {
        const visitante = ingreso.visitantes as unknown as { nombre: string; apellido: string } | null
        return (
          <div key={ingreso.id} className="bg-[#2a2a2a] rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">
                {visitante?.nombre} {visitante?.apellido}
              </p>
              <p className="text-sm text-gray-400">{ingreso.tipo_visita}</p>
            </div>
            <p className="text-sm text-gray-400">
              {ingreso.fecha_hora_ingreso
                ? new Date(ingreso.fecha_hora_ingreso).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
                : '—'}
            </p>
          </div>
        )
      })}
    </div>
  )
}
