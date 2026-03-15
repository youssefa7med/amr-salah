import React from 'react'
import { Printer } from 'lucide-react'
import { motion } from 'framer-motion'

interface PrintButtonProps {
  onClick?: () => void
  label?: string
  fixed?: boolean
  className?: string
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  onClick,
  label,
  fixed = false,
  className = '',
}) => {
  const handlePrint = () => {
    if (onClick) {
      onClick()
    }
    window.print()
  }

  const baseClasses = `flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400/20 text-gold-400 border border-gold-400/20 hover:bg-gold-400/30 transition-all duration-300 ${className}`
  const fixedClasses = fixed ? 'fixed bottom-6 right-6 p-3 z-40' : ''

  return (
    <motion.button
      onClick={handlePrint}
      className={`${baseClasses} ${fixedClasses}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Printer size={20} />
      {label && <span>{label}</span>}
    </motion.button>
  )
}
