'use client'

import { Suspense } from 'react'
import EscanearContent from './EscanearContent'

export default function EscanearPage() {
  return (
    <Suspense fallback={
      <div className="p-4 flex items-center justify-center">
        <p className="text-[#6B7280]">Cargando...</p>
      </div>
    }>
      <EscanearContent />
    </Suspense>
  )
}
