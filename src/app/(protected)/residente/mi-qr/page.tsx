import { createClient } from '@/lib/supabase-server'
import { IdCard } from 'lucide-react'
import QRCodeGenerator from '@/components/QRCodeGenerator'

export default async function MiQRPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: residente } = await supabase
    .from('residentes')
    .select('codigo_pin_personal, qr_token, propiedades(numero_unidad)')
    .eq('usuario_id', user?.id || '')
    .single()

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nombre, apellido')
    .eq('id', user?.id || '')
    .single()

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <IdCard className="w-6 h-6 text-[#0bf7ae]" />
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Mi QR</h1>
          <p className="text-[#6B7280] text-sm">Código de acceso personal permanente</p>
        </div>
      </div>

      {/* QR Card */}
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mb-4">
          <p className="font-bold text-[#1F2937] text-lg">
            {usuario?.nombre} {usuario?.apellido}
          </p>
          <p className="text-[#6B7280] text-sm">
            Residente • {(residente?.propiedades as { numero_unidad?: string })?.numero_unidad || 'Sin propiedad'}
          </p>
        </div>

        {/* QR Code */}
        {residente?.qr_token && (
          <div className="mb-6">
            <QRCodeGenerator value={residente.qr_token} size={200} />
          </div>
        )}

        {/* PIN */}
        <div className="bg-[#F3F4F6] rounded-lg p-4 mb-4">
          <p className="text-sm text-[#6B7280] mb-1">Tu PIN personal</p>
          <p className="text-3xl font-mono font-bold text-[#1F2937] tracking-wider">
            {residente?.codigo_pin_personal || 'No generado'}
          </p>
        </div>

        <p className="text-xs text-[#6B7280]">
          Muestra este código al guardia al ingresar al condominio
        </p>
      </div>
    </div>
  )
}
