'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { ScanLine, Keyboard, Clock, User, Users } from 'lucide-react'
import { useEffect } from 'react'

export default function VigilanteDashboard() {
  const [tipoIngreso, setTipoIngreso] = useState<'visitante' | 'residente'>('visitante')
  const [usuario, setUsuario] = useState<{ nombre: string; apellido: string } | null>(null)
  const [visitasPendientes, setVisitasPendientes] = useState(0)
  const [ultimosIngresos, setUltimosIngresos] = useState<Array<{
    id: string
    fecha_hora_ingreso: string | null
    tipo_visita: string
    visitante_nombre: string
    visitante_apellido: string
    tipo: string
  }>>([])

  useEffect(() => {
    const supabase = createClient()

    const cargarDatos = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: usuarioData } = await supabase
        .from('usuarios')
        .select('nombre, apellido')
        .eq('id', user?.id || '')
        .single()

      setUsuario(usuarioData)

      const { count } = await supabase
        .from('visitas')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'pendiente')

      setVisitasPendientes(count || 0)

      // Últimas visitas
      const { data: visitas } = await supabase
        .from('visitas')
        .select(`
          id,
          fecha_hora_ingreso,
          tipo_visita,
          visitantes (nombre, apellido)
        `)
        .eq('estado', 'ingresado')
        .order('fecha_hora_ingreso', { ascending: false })
        .limit(3)

      const ingresosVisitas = (visitas || []).map((v: { id: string; fecha_hora_ingreso: string | null; tipo_visita: string; visitantes: unknown }) => ({
        id: v.id,
        fecha_hora_ingreso: v.fecha_hora_ingreso,
        tipo_visita: v.tipo_visita,
        visitante_nombre: (v.visitantes as { nombre: string; apellido: string })?.nombre || '',
        visitante_apellido: (v.visitantes as { nombre: string; apellido: string })?.apellido || '',
        tipo: 'Visita',
      }))

      // Últimos ingresos de residentes
      const { data: ingresosResidentes } = await supabase
        .from('ingresos_residentes')
        .select(`
          id,
          fecha_hora,
          residentes (
            usuarios (nombre, apellido)
          )
        `)
        .order('fecha_hora', { ascending: false })
        .limit(3)

      const ingresosRes = (ingresosResidentes || []).map((ir: { id: string; fecha_hora: string | null; residentes: unknown }) => {
        const res = ir.residentes as { usuarios: { nombre: string; apellido: string } } | null
        return {
          id: ir.id,
          fecha_hora_ingreso: ir.fecha_hora,
          tipo_visita: 'Residente',
          visitante_nombre: res?.usuarios?.nombre || '',
          visitante_apellido: res?.usuarios?.apellido || '',
          tipo: 'Residente',
        }
      })

      const todos = [...ingresosVisitas, ...ingresosRes]
        .sort((a, b) => {
          const fechaA = a.fecha_hora_ingreso ? new Date(a.fecha_hora_ingreso).getTime() : 0
          const fechaB = b.fecha_hora_ingreso ? new Date(b.fecha_hora_ingreso).getTime() : 0
          return fechaB - fechaA
        })
        .slice(0, 5)

      setUltimosIngresos(todos)
    }

    cargarDatos()
  }, [])

  return (
    <div className="p-4 min-h-screen bg-[#1F2937]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Portería</h1>
        <p className="text-gray-400">
          Bienvenido, {usuario?.nombre} {usuario?.apellido}
        </p>
      </div>

      {/* Selector de tipo de ingreso */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">Tipo de ingreso</p>
        <div className="flex gap-2">
          <button
            onClick={() => setTipoIngreso('visitante')}
            className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-medium transition-colors ${
              tipoIngreso === 'visitante'
                ? 'bg-[#2563EB] text-white'
                : 'bg-[#2a2a2a] text-gray-400'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Visitante</span>
          </button>
          <button
            onClick={() => setTipoIngreso('residente')}
            className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-medium transition-colors ${
              tipoIngreso === 'residente'
                ? 'bg-[#0bf7ae] text-[#1F2937]'
                : 'bg-[#2a2a2a] text-gray-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Residente</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mb-6 bg-[#2563EB]/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-[#2563EB]" />
          <div>
            <p className="text-2xl font-bold text-white">{visitasPendientes}</p>
            <p className="text-sm text-gray-400">Visitas pendientes hoy</p>
          </div>
        </div>
      </div>

      {/* Botones principales */}
      <div className="space-y-4">
        <Link
          href={`/vigilante/escanear?scan=true&tipo=${tipoIngreso}`}
          className="flex items-center justify-center gap-4 w-full h-24 bg-[#2563EB] text-white rounded-xl font-bold text-lg hover:bg-[#2563EB]/90 transition-colors"
        >
          <ScanLine className="w-8 h-8" />
          <span>Escanear QR</span>
        </Link>

        <Link
          href={`/vigilante/pin?tipo=${tipoIngreso}`}
          className="flex items-center justify-center gap-4 w-full h-24 bg-white text-[#1F2937] rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
        >
          <Keyboard className="w-8 h-8" />
          <span>Ingresar PIN</span>
        </Link>
      </div>

      {/* Últimos ingresos */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-white mb-4">Últimos ingresos</h2>
        {ultimosIngresos.length === 0 ? (
          <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
            <p className="text-gray-400">No hay ingresos recientes</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ultimosIngresos.map((ingreso) => (
              <div key={ingreso.id} className="bg-[#2a2a2a] rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">
                    {ingreso.visitante_nombre} {ingreso.visitante_apellido}
                  </p>
                  <p className="text-sm text-gray-400">{ingreso.tipo_visita}</p>
                </div>
                <p className="text-sm text-gray-400">
                  {ingreso.fecha_hora_ingreso
                    ? new Date(ingreso.fecha_hora_ingreso).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
                    : '—'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
