'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { generatePin } from '@/lib/qr'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('Credenciales incorrectas')
        setLoading(false)
        return
      }

      const { data: usuario, error: dbError } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', data.user.id)
        .single()

      if (dbError || !usuario) {
        setError('Usuario no encontrado en la base de datos')
        setLoading(false)
        return
      }

      // Si es residente, verificar si tiene QR/PIN personal
      if (usuario.rol === 'residente') {
        const { data: residente } = await supabase
          .from('residentes')
          .select('codigo_pin_personal, qr_token')
          .eq('usuario_id', data.user.id)
          .single()

        // Si no tiene QR/PIN, generarlo
        if (!residente?.codigo_pin_personal || !residente?.qr_token) {
          const pin = generatePin()
          const qrToken = `residente-${data.user.id}-${Date.now()}`
          
          await supabase
            .from('residentes')
            .update({
              codigo_pin_personal: pin,
              qr_token: qrToken,
            })
            .eq('usuario_id', data.user.id)
        }

        window.location.href = '/residente'
      } else if (usuario.rol === 'vigilante') {
        window.location.href = '/vigilante'
      } else if (usuario.rol === 'administrativo' || usuario.rol === 'superadmin') {
        window.location.href = '/admin'
      } else {
        setError('Rol no válido')
        setLoading(false)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <Image
              src="/logo.png"
              alt="Cerberus Logo"
              width={100}
              height={100}
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Cerberus</h1>
          <p className="text-[#6B7280] text-sm mt-1">Sistema de Control de Acceso</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none text-[#1F2937]"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0bf7ae] focus:border-transparent outline-none text-[#1F2937]"
              placeholder="••••••••"
              required
            />
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
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
