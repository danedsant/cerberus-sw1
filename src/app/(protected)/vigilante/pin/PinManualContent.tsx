'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { notificarLlegadaVisita } from '@/lib/actions'
import { ArrowLeft, CheckCircle, XCircle, Keyboard } from 'lucide-react'
import Link from 'next/link'

export default function PinManualContent() {
  const searchParams = useSearchParams()
  const tipo = searchParams.get('tipo') || 'visitante'
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
  const [residenteId, setResidenteId] = useState<string | null>(null)
  const [modal, setModal] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleValidate = async () => {
    if (!pin.trim()) return

    setLoading(true)
    setResult(null)
    setResidenteId(null)

    try {
      const supabase = createClient()

      if (tipo === 'visitante') {
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
          setResult({ success: false, message: 'PIN no encontrado o inválido' })
          return
        }

        if (visita.estado === 'ingresado') {
          setResult({ success: false, message: 'Esta visita ya fue ingresada' })
          return
        }

        if (visita.estado === 'cancelado') {
          setResult({ success: false, message: 'Esta visita fue cancelada' })
          return
        }

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
      } else {
        const { data: residente, error } = await supabase
          .from('residentes')
          .select(`
            usuario_id,
            usuarios (nombre, apellido),
            propiedades (numero_unidad)
          `)
          .eq('codigo_pin_personal', pin)
          .single()

        if (error || !residente) {
          setResult({ success: false, message: 'PIN no encontrado o inválido' })
          return
        }

        setResidenteId(residente.usuario_id)

        setResult({
          success: true,
          message: 'Residente identificado',
          data: {
            nombre: (residente.usuarios as { nombre: string; apellido: string })?.nombre || '',
            apellido: (residente.usuarios as { nombre: string; apellido: string })?.apellido || '',
            tipo_visita: 'Residente',
            propiedad: (residente.propiedades as { numero_unidad: string })?.numero_unidad || '',
          },
        })
      }
    } catch {
      setResult({ success: false, message: 'Error al validar el PIN' })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmEntry = async () => {
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (tipo === 'visitante') {
        const { data: visita } = await supabase
          .from('visitas')
          .select('id')
          .eq('codigo_pin', pin)
          .single()

        if (visita) {
          await supabase
            .from('visitas')
            .update({
              estado: 'ingresado',
              vigilante_id: user?.id,
              fecha_hora_ingreso: new Date().toISOString(),
            })
            .eq('id', visita.id)

          await notificarLlegadaVisita(visita.id)
        }
      } else {
        if (residenteId) {
          await supabase
            .from('ingresos_residentes')
            .insert({
              residente_id: residenteId,
              vigilante_id: user?.id,
              fecha_hora: new Date().toISOString(),
            })
        }
      }

      setResult(null)
      setPin('')
      setResidenteId(null)
      setModal({
        type: 'success',
        message: tipo === 'visitante' ? 'Ingreso registrado exitosamente' : 'Ingreso de residente registrado',
      })
    } catch {
      setModal({ type: 'error', message: 'Error al registrar ingreso' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/vigilante" className="p-2 hover:bg-white rounded-lg">
          <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">PIN Manual</h1>
          <p className="text-[#6B7280] text-sm">
            {tipo === 'residente' ? 'Residente — Ingrese su PIN personal' : 'Ingrese el PIN del visitante'}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="w-6 h-6 text-[#2563EB]" />
          <label className="text-[#1F2937] font-medium">
            {tipo === 'residente' ? 'PIN Personal' : 'PIN de Acceso'}
          </label>
        </div>
        <input
          type="text"
          value={pin}
          onChange={(e) => setPin(e.target.value.toUpperCase())}
          className="w-full px-6 py-4 rounded-xl bg-white text-[#1F2937] text-2xl font-mono text-center tracking-widest focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
          placeholder={tipo === 'residente' ? 'Ej. X7-456' : 'Ej. A7-992'}
          maxLength={10}
        />
      </div>

      <button
        onClick={handleValidate}
        disabled={loading || !pin.trim()}
        className="w-full h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-lg rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 mb-6"
      >
        {loading ? 'Validando...' : 'Validar PIN'}
      </button>

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
              <div className="bg-white rounded-lg p-3">
                <p className="text-[#6B7280] text-sm">{tipo === 'residente' ? 'Residente' : 'Visitante'}</p>
                <p className="text-[#1F2937] font-bold text-lg">
                  {result.data.nombre} {result.data.apellido}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-[#6B7280] text-sm">Tipo</p>
                  <p className="text-[#1F2937] font-medium">{result.data.tipo_visita}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-[#6B7280] text-sm">Propiedad</p>
                  <p className="text-[#1F2937] font-medium">{result.data.propiedad}</p>
                </div>
              </div>
              {result.data.placa_vehiculo && (
                <div className="bg-white rounded-lg p-3">
                  <p className="text-[#6B7280] text-sm">Placa</p>
                  <p className="text-[#1F2937] font-mono font-bold">{result.data.placa_vehiculo}</p>
                </div>
              )}

              <button
                onClick={handleConfirmEntry}
                disabled={loading}
                className="w-full h-14 bg-gradient-to-br from-[#0bf7ae] to-[#09d698] text-[#1F2937] font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? 'Registrando...' : 'Confirmar Ingreso'}
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setResult(null)
              setPin('')
              setResidenteId(null)
            }}
            className="w-full h-12 bg-white text-[#1F2937] font-medium rounded-lg hover:bg-gray-50 transition-colors mt-3"
          >
            Ingresar otro PIN
          </button>
        </div>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="entry-modal-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            {modal.type === 'success' ? (
              <CheckCircle className="mx-auto mb-4 h-14 w-14 text-[#0aaf7d]" />
            ) : (
              <XCircle className="mx-auto mb-4 h-14 w-14 text-[#f26d6d]" />
            )}
            <h2 id="entry-modal-title" className="text-xl font-bold text-[#1F2937]">
              {modal.type === 'success' ? 'Ingreso confirmado' : 'No se pudo registrar'}
            </h2>
            <p className="mt-2 text-[#6B7280]">{modal.message}</p>
            <button
              onClick={() => setModal(null)}
              className="mt-6 h-12 w-full rounded-xl bg-[#2563EB] font-bold text-white transition-colors hover:bg-[#1d4ed8]"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
