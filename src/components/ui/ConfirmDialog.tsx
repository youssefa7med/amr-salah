import React from 'react'
import { Modal } from './Modal'
import { motion } from 'framer-motion'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  loading?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <p className="text-gray-300">{message}</p>

        <div className="flex gap-3 justify-end">
          <motion.button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {cancelText}
          </motion.button>

          <motion.button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              isDangerous
                ? 'bg-red-500/20 text-red-300 border border-red-500/20 hover:bg-red-500/30'
                : 'bg-gold-400/20 text-gold-400 border border-gold-400/20 hover:bg-gold-400/30'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? 'Loading...' : confirmText}
          </motion.button>
        </div>
      </div>
    </Modal>
  )
}
