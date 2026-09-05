import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { UserPlus, Edit, Trash2 } from 'lucide-react'

export default async function UsuariosPage() {
  const supabase = await createClient()

  const { data: usuarios } = await supabase
    .from('usuarios')
    .select(`
      *,
      residentes (propiedad_id, propiedades (numero_unidad)),
      vigilantes (turno)
    `)
    .order('nombre')

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Usuarios</h1>
          <p className="text-[#6B7280] text-sm">Gestiona los usuarios del sistema</p>
        </div>
        <Link
          href="/admin/usuarios/nuevo"
          className="flex items-center gap-2 bg-[#0bf7ae] text-[#1F2937] px-4 py-3 rounded-lg font-medium hover:bg-[#0bf7ae]/90 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          <span>Nuevo</span>
        </Link>
      </div>

      {/* Lista de usuarios */}
      <div className="space-y-3">
        {usuarios && usuarios.length > 0 ? (
          usuarios.map((usuario) => (
            <div key={usuario.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-[#1F2937]">
                    {usuario.nombre} {usuario.apellido}
                  </p>
                  <p className="text-sm text-[#6B7280]">{usuario.correo}</p>
                  <p className="text-xs text-[#6B7280]">Cédula: {usuario.cedula}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                      usuario.rol === 'residente' ? 'bg-[#0bf7ae]' :
                      usuario.rol === 'vigilante' ? 'bg-[#2563EB]' :
                      usuario.rol === 'administrativo' ? 'bg-[#FDBA74]' :
                      'bg-[#334155]'
                    }`}>
                      {usuario.rol === 'residente' ? 'Residente' :
                       usuario.rol === 'vigilante' ? 'Vigilante' :
                       usuario.rol === 'administrativo' ? 'Administrativo' :
                       'Superadmin'}
                    </span>
                    {usuario.rol === 'residente' && usuario.residentes?.propiedades && (
                      <span className="text-xs text-[#6B7280]">
                        • {usuario.residentes.propiedades.numero_unidad}
                      </span>
                    )}
                    {usuario.rol === 'vigilante' && usuario.vigilantes && (
                      <span className="text-xs text-[#6B7280]">
                        • Turno: {usuario.vigilantes.turno}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/usuarios/${usuario.id}/editar`}
                    className="p-2 text-[#6B7280] hover:text-[#2563EB] transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-[#6B7280]">No hay usuarios registrados</p>
            <Link
              href="/admin/usuarios/nuevo"
              className="inline-block mt-4 text-[#0bf7ae] font-medium hover:underline"
            >
              Crear primer usuario
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
