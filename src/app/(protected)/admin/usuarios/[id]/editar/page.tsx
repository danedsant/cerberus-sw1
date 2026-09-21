'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { actualizarUsuario, eliminarUsuario } from '@/lib/actions'
import { ArrowLeft, Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function EditarUsuarioPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [propiedades, setPropiedades] = useState<{ id: string; numero_unidad: string }[]>([])
  const [usuario, setUsuario] = useState<Record<string, unknown> | null>(null)
  const [modal, setModal] = useState<{
    type: 'confirm' | 'success' | 'error'
    message: string
  } | null>(null)

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    rol: 'residente',
    propiedad_id: '',
    telefono: '',
    turno: 'Diurno',
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const { data: propData } = await supabase
        .from('propiedades')
        .select('id, numero_unidad')
        .order('numero_unidad')
      setPropiedades(propData || [])

      const { data: userData } = await supabase
        .from('usuarios')
        .select(`
          *,
          residentes (propiedad_id),
          vigilantes (turno)
        `)
        .eq('id', id)
        .single()

      if (userData) {
        setUsuario(userData)
        setForm({
          nombre: userData.nombre || '',
          apellido: userData.apellido || '',
          cedula: userData.cedula || '',
          email: userData.correo || '',
          rol: userData.rol || 'residente',
          propiedad_id: userData.residentes?.propiedad_id || '',
          telefono: userData.telefono || '',
          turno: userData.vigilantes?.turno || 'Diurno',
        })
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await actualizarUsuario({
        id,
        nombre: form.nombre,
        apellido: form.apellido,
        cedula: form.cedula,
        email: form.email,
        rol: form.rol,
        propiedad_id: form.propiedad_id || undefined,
        telefono: form.telefono || undefined,
        turno: form.turno,
      })
      router.push('/admin/usuarios')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await eliminarUsuario(id)
      setModal({ type: 'success', message: 'El usuario fue eliminado correctamente.' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setModal({ type: 'error', message })
    } finally {
      setLoading(false)
    }
  }

  if (!usuario) {
    return (
      <div className="p-4">
        <p className="text-[#6B7280]">Cargando usuario...</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/usuarios" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Editar Usuario</h1>
            <p className="text-[#6B7280] text-sm">Actualizar datos del usuario</p>
          </div>
        </div>
        <button
          onClick={() => setModal({ type: 'confirm', message: '¿Estás seguro de eliminar este usuario?' })}
          disabled={loading}
          className="p-2 text-[#f26d6d] hover:bg-[#f26d6d]/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1F2937] mb-1">Nombre</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937] mb-1">Apellido</label>
          <input
            type="text"
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937] mb-1">Cédula</label>
          <input
            type="text"
            value={form.cedula}
            onChange={(e) => setForm({ ...form, cedula: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937] mb-1">Correo</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937] mb-1">Teléfono</label>
          <input
            type="tel"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none"
            placeholder="0412-1234567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937] mb-1">Rol</label>
          <select
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none"
          >
            <option value="residente">Residente</option>
            <option value="vigilante">Vigilante</option>
            <option value="administrativo">Administrativo</option>
          </select>
        </div>

        {form.rol === 'residente' && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1">Propiedad</label>
              <select
                value={form.propiedad_id}
                onChange={(e) => setForm({ ...form, propiedad_id: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none"
              >
                <option value="">Seleccionar propiedad</option>
                {propiedades.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.numero_unidad}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {form.rol === 'vigilante' && (
          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1">Turno</label>
            <select
              value={form.turno}
              onChange={(e) => setForm({ ...form, turno: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none"
            >
              <option value="Diurno">Diurno (6AM - 6PM)</option>
              <option value="Nocturno">Nocturno (6PM - 6AM)</option>
            </select>
          </div>
        )}

        {error && (
          <div className="bg-[#f26d6d]/10 border border-[#f26d6d] rounded-lg p-3">
            <p className="text-[#f26d6d] text-sm text-center">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-[#0bf7ae] text-[#1F2937] font-medium rounded-lg hover:bg-[#0bf7ae]/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-modal-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            {modal.type === 'confirm' ? (
              <AlertTriangle className="mx-auto mb-4 h-14 w-14 text-[#f8c367]" />
            ) : modal.type === 'success' ? (
              <CheckCircle className="mx-auto mb-4 h-14 w-14 text-[#0aaf7d]" />
            ) : (
              <XCircle className="mx-auto mb-4 h-14 w-14 text-[#f26d6d]" />
            )}
            <h2 id="user-modal-title" className="text-xl font-bold text-[#1F2937]">
              {modal.type === 'confirm' ? 'Eliminar usuario' : modal.type === 'success' ? 'Operación completada' : 'No se pudo eliminar'}
            </h2>
            <p className="mt-2 text-[#6B7280]">{modal.message}</p>
            <div className="mt-6 flex gap-3">
              {modal.type === 'confirm' && (
                <button
                  onClick={() => {
                    setModal(null)
                    void handleDelete()
                  }}
                  className="h-12 flex-1 rounded-xl bg-[#f26d6d] font-bold text-white transition-colors hover:bg-[#dc5555]"
                >
                  Eliminar
                </button>
              )}
              <button
                onClick={() => {
                  if (modal.type === 'success') {
                    router.push('/admin/usuarios')
                    return
                  }
                  setModal(null)
                }}
                className={`${modal.type === 'confirm' ? 'flex-1 bg-gray-100 text-[#6B7280] hover:bg-gray-200' : 'w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8]'} h-12 rounded-xl font-bold transition-colors`}
              >
                {modal.type === 'confirm' ? 'Cancelar' : 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
