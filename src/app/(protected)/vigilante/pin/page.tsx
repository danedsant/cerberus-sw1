'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, CheckCircle, XCircle, Keyboard } from 'lucide-react'
import Link from 'next/link'

export default function PinManualPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    data?: {
      nombre: string
      apellido: string
      tipo_visita: string
      propiedad: string
      placa_vehiculo?: string
    }
  } | null>(null)
  const [pin, setPin] = useState('')

  const handleValidate = async () => {
    if (!pin.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const supabase = createClient()

      // Buscar visita por PIN
      const { data: visita, error } = await supabase
        .from('visitas')
        .select(`
          id,
          codigo_pin,
          tipo_visita,
          estado,
          placa_vehiculo,
          visitantes (nombre, apellido),
          residentes (
            usuario_id,
            usuarios (nombre, apellido),
            propiedades (numero_unidad)
          )
        `)
        .eq('codigo_pin', pin)
        .single()

      if (error || !visita) {
        setResult({
          success: false,
          message: 'PIN no encontrado o inválido',
        })
        return
      }

      if (visita.estado === 'ingresado') {
        setResult({
          success: false,
          message: 'Esta visita ya fue ingresada',
        })
        return
      }

      if (visita.estado === 'cancelado') {
        setResult({
          success: false,
          message: 'Esta visita fue cancelada',
        })
        return
      }

      // Éxito - mostrar datos
      setResult({
        success: true,
        message: 'PIN válido',
        data: {
          nombre: (visita.visitantes as { nombre: string; apellido: string })?.nombre || '',
          apellido: (visita.visitantes as { nombre: string; apellido: string })?.apellido || '',
          tipo_visita: visita.tipo_visita,
          propiedad: (visita.residentes as { propiedades: { numero_unidad: string } })?.propiedades?.numero_unidad || '',
          placa_vehiculo: visita.placa_vehiculo || undefined,
        },
      })
    } catch (err) {
      setResult({
        success: false,
        message: 'Error al validar el PIN',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmEntry = async () => {
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // Buscar visita
      const { data: visita } = await supabase
        .from('visitas')
        .select('id')
        .eq('codigo_pin', pin)
        .single()

      if (visita) {
        // Actualizar estado a ingresado
        await supabase
          .from('visitas')
          .update({
            estado: 'ingresado',
            vigilante_id: user?.id,
            fecha_hora_ingreso: new Date().toISOString(),
          })
          .eq('id', visita.id)
      }

      setResult(null)
      setPin('')
      alert('Ingreso registrado exitosamente')
    } catch (err) {
      alert('Error al registrar ingreso')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 min-h-screen bg-[#1F2937]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/vigilante" className="p-2 hover:bg-[#2a2a2a] rounded-lg">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">PIN Manual</h1>
          <p className="text-gray-400 text-sm">Ingrese el PIN del visitante</p>
        </div>
      </div>

      {/* Input de PIN */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="w-6 h-6 text-[#2563EB]" />
          <label className="text-white font-medium">PIN de Acceso</label>
        </div>
        <input
          type="text"
          value={pin}
          onChange={(e) => setPin(e.target.value.toUpperCase())}
          className="w-full px-6 py-4 rounded-xl bg-[#2a2a2a] text-white text-2xl font-mono text-center tracking-widest focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
          placeholder="Ej. A7-992"
          maxLength={10}
        />
      </div>

      {/* Botón validar */}
      <button
        onClick={handleValidate}
        disabled={loading || !pin.trim()}
        className="w-full h-16 bg-[#2563EB] text-white font-bold text-lg rounded-xl hover:bg-[#2563EB]/90 transition-colors disabled:opacity-50 mb-6"
      >
        {loading ? 'Validando...' : 'Validar PIN'}
      </button>

      {/* Resultado */}
      {result && (
        <div className={`rounded-xl p-6 ${result.success ? 'bg-[#0bf7ae]/20' : 'bg-[#f26d6d]/20'}`}>
          <div className="flex items-center gap-3 mb-4">
            {result.success ? (
              <CheckCircle className="w-10 h-10 text-[#0bf7ae]" />
            ) : (
              <XCircle className="w-10 h-10 text-[#f26d6d]" />
            )}
            <p className={`font-bold text-lg ${result.success ? 'text-[#0bf7ae]' : 'text-[#f26d6d]'}`}>
              {result.message}
            </p>
          </div>

          {result.success && result.data && (
            <div className="space-y-3 mb-6">
              <div className="bg-[#2a2a2a] rounded-lg p-3">
                <p className="text-gray-400 text-sm">Visitante</p>
                <p className="text-white font-bold text-lg">
                  {result.data.nombre} {result.data.apellido}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#2a2a2a] rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Tipo</p>
                  <p className="text-white font-medium">{result.data.tipo_visita}</p>
                </div>
                <div className="bg-[#2a2a2a] rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Propiedad</p>
                  <p className="text-white font-medium">{result.data.propiedad}</p>
                </div>
              </div>
              {result.data.placa_vehiculo && (
                <div className="bg-[#2a2a2a] rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Placa</p>
                  <p className="text-white font-mono font-bold">{result.data.placa_vehiculo}</p>
                </div>
              )}

              <button
                onClick={handleConfirmEntry}
                disabled={loading}
                className="w-full h-14 bg-[#0bf7ae] text-[#1F2937] font-bold rounded-lg hover:bg-[#0bf7ae]/90 transition-colors"
              >
                {loading ? 'Registrando...' : 'Confirmar Ingreso'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
