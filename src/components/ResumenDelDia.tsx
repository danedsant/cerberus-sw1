'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Sparkles, RefreshCw } from 'lucide-react'

export default function ResumenDelDia() {
  const [resumen, setResumen] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generarResumen = async () => {
    setLoading(true)
    setError('')
    setResumen('')

    try {
      const supabase = createClient()

      // Obtener visitas de hoy
      const hoy = new Date().toISOString().split('T')[0]
      const { data: visitas, error: errVisitas } = await supabase
        .from('visitas')
        .select(`
          id,
          tipo_visita,
          estado,
          fecha_hora_ingreso,
          placa_vehiculo,
          visitantes (nombre, apellido),
          residentes (
            propiedades (numero_unidad)
          )
        `)
        .eq('fecha_esperada', hoy)

      if (errVisitas) throw errVisitas

      // Obtener ingresos de residentes de hoy
      const { data: ingresos } = await supabase
        .from('ingresos_residentes')
        .select(`
          id,
          fecha_hora,
          residentes (
            propiedades (numero_unidad)
          )
        `)
        .gte('fecha_hora', `${hoy}T00:00:00`)
        .lte('fecha_hora', `${hoy}T23:59:59`)

      // Estadísticas básicas
      const totalVisitas = visitas?.length || 0
      const visitasIngresadas = visitas?.filter((v: Record<string, unknown>) => v.estado === 'ingresado').length || 0
      const visitasPendientes = visitas?.filter((v: Record<string, unknown>) => v.estado === 'pendiente').length || 0
      const totalIngresosResidentes = ingresos?.length || 0

      // Contar por tipo
      const porTipo = visitas?.reduce((acc: Record<string, number>, v: Record<string, unknown>) => {
        const tipo = v.tipo_visita as string
        acc[tipo] = (acc[tipo] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      // Contar por propiedad
      const porPropiedad = visitas?.reduce((acc: Record<string, number>, v: Record<string, unknown>) => {
        const residentes = v.residentes as { propiedades: { numero_unidad: string } } | null
        const prop = residentes?.propiedades?.numero_unidad || 'N/A'
        acc[prop] = (acc[prop] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      // Horarios pico (agrupar por hora)
      const porHora = visitas?.filter((v: Record<string, unknown>) => v.fecha_hora_ingreso).reduce((acc: Record<string, number>, v: Record<string, unknown>) => {
        const hora = new Date(v.fecha_hora_ingreso as string).getHours().toString()
        acc[hora] = (acc[hora] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const horaPico = Object.entries(porHora as Record<string, number>).sort((a, b) => b[1] - a[1])[0]

      // Construir datos para Gemini
      const datosResumen = {
        fecha: hoy,
        totalVisitas,
        visitasIngresadas,
        visitasPendientes,
        totalIngresosResidentes,
        porTipo,
        porPropiedad,
        horaPico: horaPico ? `${horaPico[0]}:00 (${horaPico[1]} visitas)` : 'Sin datos',
      }

      // Llamar a Gemini API
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
      
      if (!apiKey) {
        // Si no hay API key, generar resumen local
        const resumenLocal = generarResumenLocal(datosResumen)
        setResumen(resumenLocal)
        return
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Eres un asistente de un sistema de control de acceso para condominios. Genera un resumen breve y puntual en español de la actividad del día basado en estos datos:

Fecha: ${datosResumen.fecha}
Total de visitas: ${datosResumen.totalVisitas}
Visitas ingresadas: ${datosResumen.visitasIngresadas}
Visitas pendientes: ${datosResumen.visitasPendientes}
Ingresos de residentes: ${datosResumen.totalIngresosResidentes}
Visitas por tipo: ${JSON.stringify(datosResumen.porTipo)}
Apartamentos más activos: ${JSON.stringify(datosResumen.porPropiedad)}
Hora pico: ${datosResumen.horaPico}

Genera un resumen de 3-4 líneas en lenguaje natural, destacando los puntos más importantes en bullet points. ajusta el formato adecuadamente sabiendo que es texto plano la salida, ajusta el formato adecuadamente antes de presentarlo. Sé conciso y profesional. y has un comentario final de cierre. puedes usar emojis para resaltar los puntos importantes.`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 200,
            }
          })
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Gemini API error:', response.status, errorText)
        throw new Error(`Gemini API ${response.status}: ${errorText.substring(0, 200)}`)
      }

      const data = await response.json()
      const textoGenerado = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (textoGenerado) {
        setResumen(textoGenerado)
      } else {
        setResumen(generarResumenLocal(datosResumen))
      }

    } catch (err) {
      console.error(err)
      const errMsg = err instanceof Error ? err.message : 'Error desconocido'
      setError(`Error: ${errMsg}`)
      // Generar resumen local como fallback
      const supabase = createClient()
      const hoy = new Date().toISOString().split('T')[0]
      const { data: visitas } = await supabase
        .from('visitas')
        .select('id, estado, tipo_visita')
        .eq('fecha_esperada', hoy)

      const datosBasicos = {
        fecha: hoy,
        totalVisitas: visitas?.length || 0,
        visitasIngresadas: visitas?.filter((v: Record<string, unknown>) => v.estado === 'ingresado').length || 0,
        visitasPendientes: visitas?.filter((v: Record<string, unknown>) => v.estado === 'pendiente').length || 0,
        totalIngresosResidentes: 0,
        porTipo: {},
        porPropiedad: {},
        horaPico: 'Sin datos',
      }
      setResumen(generarResumenLocal(datosBasicos))
    } finally {
      setLoading(false)
    }
  }

  const generarResumenLocal = (datos: {
    fecha: string
    totalVisitas: number
    visitasIngresadas: number
    visitasPendientes: number
    totalIngresosResidentes: number
    porTipo: Record<string, number>
    porPropiedad: Record<string, number>
    horaPico: string
  }) => {
    const lineas = []
    lineas.push(`📅 Resumen del ${datos.fecha}`)
    lineas.push(`\n🚪 Total de visitas: ${datos.totalVisitas}`)
    lineas.push(`✅ Ingresadas: ${datos.visitasIngresadas} | ⏳ Pendientes: ${datos.visitasPendientes}`)
    
    if (datos.totalIngresosResidentes > 0) {
      lineas.push(`🏠 Ingresos de residentes: ${datos.totalIngresosResidentes}`)
    }
    
    if (datos.horaPico !== 'Sin datos') {
      lineas.push(`⏰ Hora pico: ${datos.horaPico}`)
    }

    const tipos = Object.entries(datos.porTipo)
    if (tipos.length > 0) {
      lineas.push(`\n📋 Por tipo: ${tipos.map(([k, v]) => `${k}(${v})`).join(', ')}`)
    }

    const props = Object.entries(datos.porPropiedad).sort((a, b) => b[1] - a[1]).slice(0, 3)
    if (props.length > 0) {
      lineas.push(`🏢 Apartamentos activos: ${props.map(([k, v]) => `${k}(${v})`).join(', ')}`)
    }

    return lineas.join('\n')
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FDBA74]" />
          <h2 className="text-lg font-bold text-[#1F2937]">Resumen del Día con Gemini</h2>
        </div>
        <button
          onClick={generarResumen}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#FDBA74] text-[#1F2937] font-medium rounded-lg hover:bg-[#FDBA74]/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Generando...' : 'Generar'}
        </button>
      </div>

      {error && (
        <div className="bg-[#f26d6d]/10 rounded-lg p-3 mb-4">
          <p className="text-[#f26d6d] text-sm">{error}</p>
        </div>
      )}

      {resumen && (
        <div className="bg-[#F3F4F6] rounded-lg p-4">
          <pre className="text-[#1F2937] text-sm whitespace-pre-wrap font-sans">{resumen}</pre>
        </div>
      )}

      {!resumen && !loading && (
        <p className="text-gray-400 text-sm text-center py-4">
          Haz clic en &quot;Generar&quot; para ver el resumen de actividad de hoy
        </p>
      )}
    </div>
  )
}
