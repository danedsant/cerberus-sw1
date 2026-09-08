'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface QRScannerProps {
  onScan: (code: string) => void
  autoStart?: boolean
}

export default function QRScanner({ onScan, autoStart = false }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)

  const startScanner = useCallback(async () => {
    if (!containerRef.current || scannerRef.current || startedRef.current) return

    startedRef.current = true
    setLoading(true)
    setError('')

    try {
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText)
          stopScanner()
        },
        () => {}
      )

      setIsScanning(true)
    } catch (err) {
      console.error('Camera error:', err)
      setError('No se pudo acceder a la cámara. Verifique los permisos.')
      startedRef.current = false
    } finally {
      setLoading(false)
    }
  }, [onScan])

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
      } catch {}
      scannerRef.current = null
      setIsScanning(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (autoStart && !startedRef.current) {
      const timer = setTimeout(() => {
        startScanner()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [autoStart, startScanner])

  return (
    <div className="mb-6">
      {/* Contenedor de la cámara - SIEMPRE visible */}
      <div
        id="qr-reader"
        ref={containerRef}
        className="rounded-xl overflow-hidden mb-4 bg-black"
        style={{ minHeight: '300px' }}
      />

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <p className="text-white">Iniciando cámara...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-[#f26d6d]/20 rounded-lg p-4 mb-4">
          <p className="text-[#f26d6d] text-sm text-center">{error}</p>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3">
        {!isScanning ? (
          <button
            onClick={startScanner}
            disabled={loading}
            className="flex-1 h-14 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#2563EB]/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Iniciando...' : 'Iniciar Cámara'}
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="flex-1 h-14 bg-[#f26d6d] text-white font-bold rounded-xl hover:bg-[#f26d6d]/90 transition-colors"
          >
            Detener Cámara
          </button>
        )}
      </div>

      {/* Instrucciones */}
      {isScanning && (
        <p className="text-center text-gray-400 text-sm mt-4">
          Apunte la cámara al código QR del visitante
        </p>
      )}
    </div>
  )
}
