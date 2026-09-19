'use client'

import { Suspense } from 'react'
import PinManualContent from './PinManualContent'

export default function PinManualPage() {
  return (
    <Suspense fallback={
      <div className="p-4 flex items-center justify-center">
        <p className="text-[#6B7280]">Cargando...</p>
      </div>
    }>
      <PinManualContent />
    </Suspense>
  )
}
