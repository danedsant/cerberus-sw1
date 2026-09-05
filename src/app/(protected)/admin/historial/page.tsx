'use client'

import { useState, useEffect } from 'react'
import { obtenerHistorial } from '@/lib/actions'
import { Filter, Users, Building, CarTaxiFront, Package, Wrench } from 'lucide-react'

interface HistorialItem {
  id: string
  fecha: string
  tipo: string
  tipoVisita: string
  persona: string
  propiedad: string
  residente: string
  vigilante: string
  metodo: string
  placa: string | null
  estado: string
}

const tipoVisitaConfig: Record<string, { label: string; icon: typeof Users; color: string }> = {
  social: { label: 'Social', icon: Users, color: 'text-[#0bf7ae]' },
  delivery: { label: 'Delivery', icon: Package, color: 'text-[#FDBA74]' },
  mantenimiento: { label: 'Servicio', icon: Wrench, color: 'text-[#2563EB]' },
  transporte: { label: 'Transporte', icon: CarTaxiFront, color: 'text-[#334155]' },
  residente: { label: 'Residente', icon: Users, color: 'text-[#0bf7ae]' },
}

export default function HistorialPage() {
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    tipoVisita: '',
  })

  const fetchHistorial = async () => {
    setLoading(true)
    try {
      const data = await obtenerHistorial({
        fechaInicio: filtros.fechaInicio || undefined,
        fechaFin: filtros.fechaFin || undefined,
        tipoVisita: filtros.tipoVisita || undefined,
      })
      setHistorial(data as HistorialItem[])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistorial()
  }, [])

  const handleFilter = () => {
    fetchHistorial()
  }

  const handleClearFilters = () => {
    setFiltros({ fechaInicio: '', fechaFin: '', tipoVisita: '' })
    setTimeout(() => fetchHistorial(), 0)
  }

  const formatFecha = (fecha: string) => {
    if (!fecha) return '—'
    const date = new Date(fecha)
    return date.toLocaleString('es-VE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Historial</h1>
          <p className="text-[#6B7280] text-sm">Registro de accesos al condominio</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-lg transition-colors ${
            showFilters ? 'bg-[#0bf7ae] text-[#1F2937]' : 'bg-white text-[#6B7280]'
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="font-bold text-[#1F2937] mb-3">Filtros</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#6B7280] mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6B7280] mb-1">Fecha Fin</label>
              <input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-[#6B7280] mb-1">Tipo de Visita</label>
              <select
                value={filtros.tipoVisita}
                onChange={(e) => setFiltros({ ...filtros, tipoVisita: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Todos</option>
                <option value="social">Social</option>
                <option value="delivery">Delivery</option>
                <option value="mantenimiento">Servicio</option>
                <option value="transporte">Transporte</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleFilter}
              className="flex-1 h-10 bg-[#0bf7ae] text-[#1F2937] font-medium rounded-lg text-sm"
            >
              Aplicar
            </button>
            <button
              onClick={handleClearFilters}
              className="flex-1 h-10 bg-gray-100 text-[#6B7280] font-medium rounded-lg text-sm"
            >
              Limpiar
            </button>
          </div>
        </div>
      )}

      {/* Lista de historial */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-[#6B7280]">Cargando historial...</p>
          </div>
        ) : historial.length > 0 ? (
          historial.map((item) => {
            const tipoConfig = tipoVisitaConfig[item.tipoVisita] || tipoVisitaConfig.social
            const Icon = tipoConfig.icon

            return (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center ${tipoConfig.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1F2937]">{item.persona}</p>
                      <p className="text-sm text-[#6B7280]">
                        {tipoConfig.label} • {item.propiedad}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                    item.tipo === 'Residente' ? 'bg-[#0bf7ae]' : 'bg-[#2563EB]'
                  }`}>
                    {item.tipo}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-[#6B7280]">Fecha/Hora</p>
                    <p className="text-[#1F2937]">{formatFecha(item.fecha)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Vigilante</p>
                    <p className="text-[#1F2937]">{item.vigilante || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Método</p>
                    <p className="text-[#1F2937]">{item.metodo}</p>
                  </div>
                  {item.placa && (
                    <div>
                      <p className="text-xs text-[#6B7280]">Placa</p>
                      <p className="font-mono text-[#1F2937]">{item.placa}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-[#6B7280]">No hay registros de accesos</p>
          </div>
        )}
      </div>
    </div>
  )
}
