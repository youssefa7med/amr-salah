import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { nameAr: string; price: number; duration: number }) => Promise<void>
  initialData?: {
    nameAr: string
    price: number
    duration: number
  } | null
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    nameAr: '',
    price: '',
    duration: '30',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        nameAr: initialData.nameAr,
        price: initialData.price.toString(),
        duration: initialData.duration.toString(),
      })
    } else {
      setFormData({ nameAr: '', price: '', duration: '30' })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nameAr.trim()) {
      newErrors.nameAr = 'اسم الخدمة مطلوب'
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'السعر يجب أن يكون أكبر من صفر'
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = 'المدة يجب أن تكون أكبر من صفر'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsLoading(true)
      await onSave({
        nameAr: formData.nameAr.trim(),
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-black/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">
                  {initialData ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
                </h2>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-1 hover:bg-white/10 rounded-lg transition disabled:opacity-50"
                >
                  <X size={20} className="text-gray-300" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Service Name (Arabic) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    اسم الخدمة *
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: قص شعر عادي"
                    value={formData.nameAr}
                    onChange={(e) => handleInputChange('nameAr', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                      errors.nameAr
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-white/20 focus:ring-gold-400/50 focus:border-gold-400'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.nameAr && <p className="text-red-400 text-xs mt-1">{errors.nameAr}</p>}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    السعر (ج.م) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="50"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                      errors.price
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-white/20 focus:ring-gold-400/50 focus:border-gold-400'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    المدة (دقائق) *
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                      errors.duration
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-white/20 focus:ring-gold-400/50 focus:border-gold-400'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.duration && <p className="text-red-400 text-xs mt-1">{errors.duration}</p>}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 border border-white/20 rounded-lg text-white hover:bg-white/5 transition disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-gold-400/20 text-gold-400 border border-gold-400/20 rounded-lg hover:bg-gold-400/30 transition disabled:opacity-50 font-medium"
                  >
                    {isLoading ? '...جاري الحفظ' : initialData ? 'تحديث' : 'حفظ'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
