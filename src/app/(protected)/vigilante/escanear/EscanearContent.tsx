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
  const tipo = searchParams.get('tipo') || 'visitante'
  const [loading, setLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [autoStartCamera, setAutoStartCamera] = useState(false)
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
  const [residenteId, setResidenteId] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('scan') === 'true') {
      setShowCamera(true)
      setAutoStartCamera(true)
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
    setResidenteId(null)

    try {
      const supabase = createClient()

      if (tipo === 'visitante') {
        // Buscar en visitas
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
      } else {
        // Buscar residente por qr_token
        const { data: residente, error } = await supabase
          .from('residentes')
          .select(`
            usuario_id,
            usuarios (nombre, apellido),
            propiedades (numero_unidad)
          `)
          .eq('qr_token', codeToValidate)
          .single()

        if (error || !residente) {
          setResult({
            success: false,
            message: 'Código no encontrado o inválido',
          })
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

      if (tipo === 'visitante') {
        // Flujo visitante
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

          await notificarLlegadaVisita(visita.id)
        }
      } else {
        // Flujo residente
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
      setCodigo('')
      setResidenteId(null)
      alert(tipo === 'visitante' ? 'Ingreso registrado exitosamente' : 'Ingreso de residente registrado')
    } catch (err) {
      alert('Error al registrar ingreso')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/vigilante" className="p-2 hover:bg-white rounded-lg">
          <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Escanear QR</h1>
          <p className="text-[#6B7280] text-sm">
            {tipo === 'residente' ? 'Residente — Escanee su código personal' : 'Escanee el código del visitante'}
          </p>
        </div>
      </div>

      {/* Escáner QR */}
      {showCamera && (
        <div className="mb-6">
          <QRScanner onScan={handleQRScan} autoStart={autoStartCamera} />
          <button
            onClick={() => setShowCamera(false)}
            className="w-full h-12 bg-white text-[#1F2937] font-medium rounded-xl hover:bg-gray-50 transition-colors mt-4"
          >
            Cancelar Escaneo
          </button>
        </div>
      )}

      {/* Botón para abrir cámara */}
      {!showCamera && !result && (
        <>
          <button
            onClick={() => setShowCamera(true)}
            className="w-full h-20 bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-lg rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 mb-6"
          >
            <Camera className="w-8 h-8" />
            <span>Abrir Cámara para Escanear</span>
          </button>

          {/* Separador */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-[#6B7280] text-sm">o ingrese manualmente</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Input de código */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ScanLine className="w-6 h-6 text-[#2563EB]" />
              <label className="text-[#1F2937] font-medium">
                {tipo === 'residente' ? 'Código PIN Personal' : 'Código PIN'}
              </label>
            </div>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              className="w-full px-6 py-4 rounded-xl bg-white text-[#1F2937] text-2xl font-mono text-center tracking-widest focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
              placeholder={tipo === 'residente' ? 'Ej. X7-456' : 'Ej. A7-992'}
              maxLength={10}
            />
          </div>

          {/* Botón validar */}
          <button
            onClick={() => validateCode(codigo)}
            disabled={loading || !codigo.trim()}
            className="w-full h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-lg rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 mb-6"
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
              setCodigo('')
              setResidenteId(null)
              setShowCamera(true)
              setAutoStartCamera(true)
            }}
            className="w-full h-12 bg-white text-[#1F2937] font-medium rounded-lg hover:bg-gray-50 transition-colors mt-3"
          >
            Escanear otro código
          </button>
        </div>
      )}
    </div>
  )
}
