'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Credenciales incorrectas')
      setLoading(false)
      return
    }

    // Obtener rol del usuario
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', data.user.id)
      .single()

    if (usuario?.rol === 'residente') {
      router.push('/residente')
    } else if (usuario?.rol === 'vigilante') {
      router.push('/vigilante')
    } else if (usuario?.rol === 'administrativo' || usuario?.rol === 'superadmin') {
      router.push('/admin')
    } else {
      router.push('/')
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
