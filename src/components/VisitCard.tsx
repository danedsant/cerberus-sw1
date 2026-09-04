import { Users, Package, Wrench, CarTaxiFront } from 'lucide-react'

interface VisitCardProps {
  visitante: {
    nombre: string
    apellido: string
  }
  tipo_visita: string
  fecha_esperada: string
  estado: string
  codigo_pin: string
  placa_vehiculo?: string
}

const tipoVisitaConfig = {
  social: { icon: Users, label: 'Social', color: 'text-[#0bf7ae]' },
  delivery: { icon: Package, label: 'Delivery', color: 'text-[#FDBA74]' },
  mantenimiento: { icon: Wrench, label: 'Servicio', color: 'text-[#2563EB]' },
  transporte: { icon: CarTaxiFront, label: 'Transporte', color: 'text-[#334155]' },
}

const estadoConfig = {
  pendiente: { label: 'Pendiente', color: 'bg-[#f8c367]' },
  ingresado: { label: 'Ingresado', color: 'bg-[#0bf7ae]' },
  cancelado: { label: 'Cancelado', color: 'bg-[#f26d6d]' },
}

export default function VisitCard({
  visitante,
  tipo_visita,
  fecha_esperada,
  estado,
  codigo_pin,
  placa_vehiculo,
}: VisitCardProps) {
  const tipoConfig = tipoVisitaConfig[tipo_visita as keyof typeof tipoVisitaConfig]
  const estadoInfo = estadoConfig[estado as keyof typeof estadoConfig]
  const Icon = tipoConfig?.icon || Users

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center ${tipoConfig?.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-[#1F2937]">
              {visitante.nombre} {visitante.apellido}
            </p>
            <p className="text-sm text-[#6B7280]">
              {tipoConfig?.label} • {fecha_esperada}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${estadoInfo?.color}`}>
          {estadoInfo?.label}
        </span>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-[#6B7280]">PIN de acceso</p>
          <p className="font-mono font-bold text-[#1F2937]">{codigo_pin}</p>
        </div>
        {placa_vehiculo && (
          <div className="text-right">
            <p className="text-xs text-[#6B7280]">Placa</p>
            <p className="font-mono font-medium text-[#1F2937]">{placa_vehiculo}</p>
          </div>
        )}
      </div>
    </div>
  )
}
