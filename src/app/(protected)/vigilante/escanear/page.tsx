'use client'

import { Suspense } from 'react'
import EscanearContent from './EscanearContent'

export default function EscanearPage() {
  return (
    <Suspense fallback={
      <div className="p-4 min-h-screen bg-[#1F2937] flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    }>
      <EscanearContent />
    </Suspense>
  )
}
