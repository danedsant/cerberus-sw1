'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import logo from '@/img/Logo.png'

type AppLoaderProps = {
  visible: boolean
}

export default function AppLoader({ visible }: AppLoaderProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#F3F4F6]"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <motion.div
              animate={{ opacity: [0.7, 1, 0.8] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center justify-center"
            >
              <Image
                src={logo}
                alt="Cerberus Logo"
                width={170}
                height={170}
                priority
                className="drop-shadow-[0_12px_28px_rgba(37,99,235,0.18)]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
