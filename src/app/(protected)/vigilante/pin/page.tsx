'use client'

import { Suspense } from 'react'
import PinManualContent from './PinManualContent'

export default function PinManualPage() {
  return (
    <Suspense fallback={
      <div className="p-4 min-h-screen bg-[#1F2937] flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    }>
      <PinManualContent />
    </Suspense>
  )
}
