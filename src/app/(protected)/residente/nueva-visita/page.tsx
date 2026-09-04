'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, QrCode } from 'lucide-react'
import Link from 'next/link'
import { generatePin, generateQR } from '@/lib/qr'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NuevaVisitaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paseData, setPaseData] = useState<{
    qr: string
    pin: string
    visitaId: string
  } | null>(null)

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    tipo_visita: 'social',
    fecha_esperada: '',
    placa_vehiculo: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autorizado')

      // 2. Buscar o crear visitante
      let visitanteId: string

      const { data: visitanteExistente } = await supabase
        .from('visitantes')
        .select('id')
        .eq('cedula', form.cedula)
        .single()

      if (visitanteExistente) {
        visitanteId = visitanteExistente.id
      } else {
        const { data: nuevoVisitante, error: errorVisitante } = await supabase
          .from('visitantes')
          .insert({
            nombre: form.nombre,
            apellido: form.apellido,
            cedula: form.cedula,
          })
          .select('id')
          .single()

        if (errorVisitante) throw errorVisitante
        visitanteId = nuevoVisitante.id
      }

      // 3. Generar PIN
      const pin = generatePin()

      // 4. Crear visita
      const { data: visita, error: errorVisita } = await supabase
        .from('visitas')
        .insert({
          residente_id: user.id,
          visitante_id: visitanteId,
          fecha_esperada: form.fecha_esperada,
          tipo_visita: form.tipo_visita,
          codigo_pin: pin,
          placa_vehiculo: form.placa_vehiculo || null,
          estado: 'pendiente',
        })
        .select('id')
        .single()

      if (errorVisita) throw errorVisita

      // 5. Generar QR
      const qr = await generateQR(visita.id)

      // 6. Mostrar pase
      setPaseData({
        qr,
        pin,
        visitaId: visita.id,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear la visita'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // Si ya se creó la visita, mostrar el pase
  if (paseData) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-[#0bf7ae]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-[#0bf7ae]" />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937] mb-2">Pase Generado</h2>
          <p className="text-[#6B7280] text-sm mb-6">Comparte este código con tu visitante</p>

          {/* QR Code */}
          <div className="mb-6">
            <img
              src={paseData.qr}
              alt="Código QR de acceso"
              className="mx-auto w-48 h-48"
            />
          </div>

          {/* PIN */}
          <div className="bg-[#F3F4F6] rounded-lg p-4 mb-6">
            <p className="text-sm text-[#6B7280] mb-1">PIN de respaldo</p>
            <p className="text-3xl font-mono font-bold text-[#1F2937] tracking-wider">
              {paseData.pin}
            </p>
          </div>

          <Link
            href="/residente"
            className="block w-full h-14 bg-[#0bf7ae] text-[#1F2937] font-medium rounded-lg hover:bg-[#0bf7ae]/90 transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/residente" className="text-[#6B7280]">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-[#1F2937]">Nueva Visita</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
          <h2 className="font-semibold text-[#1F2937]">Datos del Visitante</h2>
          
          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1">Nombre</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none text-[#1F2937]"
              placeholder="Juan"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1">Apellido</label>
            <input
              type="text"
              value={form.apellido}
              onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none text-[#1F2937]"
              placeholder="Pérez"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1">Cédula</label>
            <input
              type="text"
              value={form.cedula}
              onChange={(e) => setForm({ ...form, cedula: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none text-[#1F2937]"
              placeholder="V-12345678"
              required
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
          <h2 className="font-semibold text-[#1F2937]">Detalles de la Visita</h2>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1">Tipo de Visita</label>
            <select
              value={form.tipo_visita}
              onChange={(e) => setForm({ ...form, tipo_visita: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none text-[#1F2937]"
            >
              <option value="social">Social</option>
              <option value="delivery">Delivery</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="transporte">Transporte</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1">Fecha Esperada</label>
            <input
              type="date"
              value={form.fecha_esperada}
              onChange={(e) => setForm({ ...form, fecha_esperada: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none text-[#1F2937]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1">Placa (Opcional)</label>
            <input
              type="text"
              value={form.placa_vehiculo}
              onChange={(e) => setForm({ ...form, placa_vehiculo: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none text-[#1F2937]"
              placeholder="ABC-123"
            />
          </div>
        </div>

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
          {loading ? 'Creando...' : 'Crear Visita y Generar Pase'}
        </button>
      </form>
    </div>
  )
}
