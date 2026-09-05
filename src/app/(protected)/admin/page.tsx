import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { Users, Building, History, UserPlus } from 'lucide-react'
import ResumenDelDia from '@/components/ResumenDelDia'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { count: usuariosCount } = await supabase
    .from('usuarios')
    .select('*', { count: 'exact', head: true })

  const { count: propiedadesCount } = await supabase
    .from('propiedades')
    .select('*', { count: 'exact', head: true })

  const { count: visitasCount } = await supabase
    .from('visitas')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'pendiente')

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]">Panel de Administración</h1>
        <p className="text-[#6B7280] text-sm">Gestiona usuarios, propiedades y accesos</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FDBA74]/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#FDBA74]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1F2937]">{usuariosCount || 0}</p>
              <p className="text-xs text-[#6B7280]">Usuarios</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FDBA74]/20 flex items-center justify-center">
              <Building className="w-5 h-5 text-[#FDBA74]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1F2937]">{propiedadesCount || 0}</p>
              <p className="text-xs text-[#6B7280]">Propiedades</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f8c367]/20 flex items-center justify-center">
              <History className="w-5 h-5 text-[#f8c367]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1F2937]">{visitasCount || 0}</p>
              <p className="text-xs text-[#6B7280]">Visitas Pendientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen del día con IA */}
      <div className="mb-6">
        <ResumenDelDia />
      </div>

      {/* Accesos rápidos */}
      <div className="space-y-3">
        <Link
          href="/admin/usuarios/nuevo"
          className="flex items-center gap-3 bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#0bf7ae]/20 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-[#0bf7ae]" />
          </div>
          <div>
            <p className="font-bold text-[#1F2937]">Registrar Usuario</p>
            <p className="text-sm text-[#6B7280]">Crear nuevo residente o vigilante</p>
          </div>
        </Link>

        <Link
          href="/admin/usuarios"
          className="flex items-center gap-3 bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#2563EB]/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <p className="font-bold text-[#1F2937]">Gestionar Usuarios</p>
            <p className="text-sm text-[#6B7280]">Ver, editar o eliminar usuarios</p>
          </div>
        </Link>

        <Link
          href="/admin/propiedades"
          className="flex items-center gap-3 bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#FDBA74]/20 flex items-center justify-center">
            <Building className="w-5 h-5 text-[#FDBA74]" />
          </div>
          <div>
            <p className="font-bold text-[#1F2937]">Gestionar Propiedades</p>
            <p className="text-sm text-[#6B7280]">Administrar unidades del condominio</p>
          </div>
        </Link>

        <Link
          href="/admin/historial"
          className="flex items-center gap-3 bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#334155]/20 flex items-center justify-center">
            <History className="w-5 h-5 text-[#334155]" />
          </div>
          <div>
            <p className="font-bold text-[#1F2937]">Historial de Accesos</p>
            <p className="text-sm text-[#6B7280]">Consultar registro de ingresos</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
