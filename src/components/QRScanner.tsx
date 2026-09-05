'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface QRScannerProps {
  onScan: (code: string) => void
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState('')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [isScanning])

  const startScanner = async () => {
    if (!containerRef.current) return

    try {
      setError('')
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
          scanner.stop().catch(() => {})
          setIsScanning(false)
        },
        () => {}
      )

      setIsScanning(true)
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifique los permisos.')
      console.error(err)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop()
        setIsScanning(false)
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <div className="mb-6">
      {/* Contenedor del escáner */}
      <div
        id="qr-reader"
        ref={containerRef}
        className={`rounded-xl overflow-hidden mb-4 ${isScanning ? 'block' : 'hidden'}`}
        style={{ minHeight: '300px' }}
      />

      {/* Mensaje de error */}
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
            className="flex-1 h-14 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-[#2563EB]/90 transition-colors"
          >
            Iniciar Cámara
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
