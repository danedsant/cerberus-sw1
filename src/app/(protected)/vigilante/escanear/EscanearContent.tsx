'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { notificarLlegadaVisita } from '@/lib/actions'
import { ArrowLeft, CheckCircle, XCircle, ScanLine, Camera } from 'lucide-react'
import Link from 'next/link'
import QRScanner from '@/components/QRScanner'

export default function EscanearContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
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
  const [codigo, setCodigo] = useState('')

  useEffect(() => {
    if (searchParams.get('scan') === 'true') {
      setShowCamera(true)
    }
  }, [searchParams])

  const handleQRScan = (scannedCode: string) => {
    setCodigo(scannedCode)
    setShowCamera(false)
    validateCode(scannedCode)
  }

  const validateCode = async (codeToValidate: string) => {
    if (!codeToValidate.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const supabase = createClient()

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
        .eq('codigo_pin', codeToValidate)
        .single()

      if (error || !visita) {
        setResult({
          success: false,
          message: 'Código no encontrado o inválido',
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

      setResult({
        success: true,
        message: 'Visita válida',
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
        message: 'Error al validar el código',
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

      const { data: visita } = await supabase
        .from('visitas')
        .select('id')
        .eq('codigo_pin', codigo)
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

        // Enviar notificación de llegada al residente
        await notificarLlegadaVisita(visita.id)
      }

      setResult(null)
      setCodigo('')
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
          <h1 className="text-2xl font-bold text-white">Escanear QR</h1>
          <p className="text-gray-400 text-sm">Escanee el código o ingrese el PIN</p>
        </div>
      </div>

      {/* Escáner QR - se muestra directamente si scan=true */}
      {showCamera && (
        <div className="mb-6">
          <QRScanner onScan={handleQRScan} />
          <button
            onClick={() => setShowCamera(false)}
            className="w-full h-12 bg-[#2a2a2a] text-white font-medium rounded-xl hover:bg-[#3a3a3a] transition-colors"
          >
            Cancelar Escaneo
          </button>
        </div>
      )}

      {/* Botón para abrir cámara (solo si no está abierta y no hay resultado) */}
      {!showCamera && !result && (
        <>
          <button
            onClick={() => setShowCamera(true)}
            className="w-full h-20 bg-[#2563EB] text-white font-bold text-lg rounded-xl hover:bg-[#2563EB]/90 transition-colors flex items-center justify-center gap-3 mb-6"
          >
            <Camera className="w-8 h-8" />
            <span>Abrir Cámara para Escanear</span>
          </button>

          {/* Separador */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-gray-400 text-sm">o ingrese manualmente</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          {/* Input de código */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ScanLine className="w-6 h-6 text-[#2563EB]" />
              <label className="text-white font-medium">Código PIN</label>
            </div>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              className="w-full px-6 py-4 rounded-xl bg-[#2a2a2a] text-white text-2xl font-mono text-center tracking-widest focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
              placeholder="Ej. A7-992"
              maxLength={10}
            />
          </div>

          {/* Botón validar */}
          <button
            onClick={() => validateCode(codigo)}
            disabled={loading || !codigo.trim()}
            className="w-full h-16 bg-[#2563EB] text-white font-bold text-lg rounded-xl hover:bg-[#2563EB]/90 transition-colors disabled:opacity-50 mb-6"
          >
            {loading ? 'Validando...' : 'Validar Código'}
          </button>
        </>
      )}

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

          <button
            onClick={() => {
              setResult(null)
              setCodigo('')
              setShowCamera(true)
            }}
            className="w-full h-12 bg-[#2a2a2a] text-white font-medium rounded-lg hover:bg-[#3a3a3a] transition-colors mt-3"
          >
            Escanear otro código
          </button>
        </div>
      )}
    </div>
  )
}
