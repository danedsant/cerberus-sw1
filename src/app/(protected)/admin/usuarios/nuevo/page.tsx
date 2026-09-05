'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { crearUsuario } from '@/lib/actions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NuevoUsuarioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [propiedades, setPropiedades] = useState<{ id: string; numero_unidad: string }[]>([])

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    password: '',
    rol: 'residente',
    propiedad_id: '',
    telefono_contacto: '',
    turno: 'Diurno',
  })

  useEffect(() => {
    const fetchPropiedades = async () => {
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      const { data } = await supabase
        .from('propiedades')
        .select('id, numero_unidad')
        .order('numero_unidad')
      setPropiedades(data || [])
    }
    fetchPropiedades()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await crearUsuario({
        email: form.email,
        password: form.password,
        nombre: form.nombre,
        apellido: form.apellido,
        cedula: form.cedula,
        rol: form.rol,
        propiedad_id: form.propiedad_id || undefined,
        telefono_contacto: form.telefono_contacto || undefined,
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

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/usuarios" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Nuevo Usuario</h1>
          <p className="text-[#6B7280] text-sm">Registrar usuario en el sistema</p>
        </div>
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
            placeholder="V-27.506.542"
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
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937] mb-1">Contraseña</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none"
            placeholder="Mínimo 6 caracteres"
            required
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
                required
              >
                <option value="">Seleccionar propiedad</option>
                {propiedades.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.numero_unidad}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-1">Teléfono</label>
              <input
                type="tel"
                value={form.telefono_contacto}
                onChange={(e) => setForm({ ...form, telefono_contacto: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none"
                placeholder="0412-1234567"
              />
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
          {loading ? 'Creando usuario...' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  )
}
