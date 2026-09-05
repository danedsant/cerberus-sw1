'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface QRCodeGeneratorProps {
  value: string
  size?: number
}

export default function QRCodeGenerator({ value, size = 200 }: QRCodeGeneratorProps) {
  const [qrDataUrl, setQrDataUrl] = useState('')

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: {
        dark: '#1F2937',
        light: '#FFFFFF',
      },
    }).then(setQrDataUrl)
  }, [value, size])

  if (!qrDataUrl) {
    return (
      <div 
        className="bg-gray-200 animate-pulse rounded-lg"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <img
      src={qrDataUrl}
      alt="Código QR de acceso"
      className="mx-auto"
      style={{ width: size, height: size }}
    />
  )
}
