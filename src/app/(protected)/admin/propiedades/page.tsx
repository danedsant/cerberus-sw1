'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { crearPropiedad, actualizarPropiedad, eliminarPropiedad } from '@/lib/actions'
import { Plus, Edit, Trash2, X, Check } from 'lucide-react'

interface Propiedad {
  id: string
  numero_unidad: string
  residentes?: { usuario_id: string }[]
}

export default function PropiedadesPage() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formValue, setFormValue] = useState('')
  const [error, setError] = useState('')

  const fetchPropiedades = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('propiedades')
      .select(`
        *,
        residentes (usuario_id)
      `)
      .order('numero_unidad')
    setPropiedades(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPropiedades()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (editingId) {
        await actualizarPropiedad(editingId, formValue)
      } else {
        await crearPropiedad(formValue)
      }
      setShowForm(false)
      setEditingId(null)
      setFormValue('')
      await fetchPropiedades()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (propiedad: Propiedad) => {
    setEditingId(propiedad.id)
    setFormValue(propiedad.numero_unidad)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return

    setLoading(true)
    try {
      await eliminarPropiedad(id)
      await fetchPropiedades()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormValue('')
    setError('')
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Propiedades</h1>
          <p className="text-[#6B7280] text-sm">Administrar unidades del condominio</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#0bf7ae] text-[#1F2937] px-4 py-3 rounded-lg font-medium hover:bg-[#0bf7ae]/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva</span>
          </button>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1F2937]">
              {editingId ? 'Editar Propiedad' : 'Nueva Propiedad'}
            </h2>
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1F2937] mb-1">
              Número de Unidad
            </label>
            <input
              type="text"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none"
              placeholder="Ej. Apto 1A"
              required
            />
          </div>

          {error && (
            <div className="bg-[#f26d6d]/10 border border-[#f26d6d] rounded-lg p-3 mb-4">
              <p className="text-[#f26d6d] text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#0bf7ae] text-[#1F2937] font-medium rounded-lg hover:bg-[#0bf7ae]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      )}

      {/* Lista de propiedades */}
      <div className="space-y-3">
        {propiedades.length > 0 ? (
          propiedades.map((propiedad) => (
            <div key={propiedad.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#1F2937]">{propiedad.numero_unidad}</p>
                  <p className="text-sm text-[#6B7280]">
                    {propiedad.residentes && propiedad.residentes.length > 0
                      ? 'Ocupado'
                      : 'Disponible'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(propiedad)}
                    className="p-2 text-[#6B7280] hover:text-[#2563EB] transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(propiedad.id)}
                    className="p-2 text-[#6B7280] hover:text-[#f26d6d] transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-[#6B7280]">No hay propiedades registradas</p>
          </div>
        )}
      </div>
    </div>
  )
}
