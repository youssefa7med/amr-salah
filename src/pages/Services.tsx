import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GlassCard } from '../components/ui/GlassCard'
import { useServices } from '../db/hooks/useServices'
import { motion } from 'framer-motion'
import { Trash2, Plus, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'

export const Services: React.FC = () => {
  const { t } = useTranslation()
  const { services, addService, deleteService, updateService } = useServices()
  
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    price: '',
    duration: '30',
    category: 'haircut',
  })
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleReset = () => {
    setFormData({ nameAr: '', nameEn: '', price: '', duration: '30', category: 'haircut' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nameAr || !formData.nameEn || !formData.price) {
      toast.error('الرجاء ملأ جميع الحقول المطلوبة')
      return
    }

    try {
      if (editingId) {
        await updateService(editingId, {
          nameAr: formData.nameAr,
          nameEn: formData.nameEn,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          category: formData.category,
        } as any)
        toast.success('تم تحديث الخدمة')
      } else {
        await addService({
          nameAr: formData.nameAr,
          nameEn: formData.nameEn,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          category: formData.category,
          active: true,
        } as any)
        toast.success('تم إضافة الخدمة')
      }
      handleReset()
    } catch (err) {
      toast.error('حدث خطأ')
    }
  }

  const handleEdit = (service: any) => {
    setFormData({
      nameAr: service.nameAr,
      nameEn: service.nameEn,
      price: service.price.toString(),
      duration: service.duration?.toString() || '30',
      category: service.category || 'haircut',
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل تريد حذف هذه الخدمة؟')) {
      try {
        await deleteService(id)
        toast.success('تم حذف الخدمة')
      } catch (err) {
        toast.error('حدث خطأ')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">الخدمات والأسعار</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold-400/20 text-gold-400 border border-gold-400/20 rounded-lg hover:bg-gold-400/30 transition"
          >
            <Plus size={20} />
            إضافة خدمة
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">الاسم (عربي) *</label>
                  <input
                    type="text"
                    placeholder="قص شعر"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Name (English) *</label>
                  <input
                    type="text"
                    placeholder="Haircut"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">السعر (ج.م) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="50"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">المدة (دقائق)</label>
                  <input
                    type="number"
                    placeholder="30"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-2">الفئة</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                  >
                    <option value="haircut">قص شعر</option>
                    <option value="beard">حلاقة لحية</option>
                    <option value="skincare">عناية بالبشرة</option>
                    <option value="kids">حلاقة أطفال</option>
                    <option value="packages">باقة</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/5 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold-400/20 text-gold-400 border border-gold-400/20 rounded-lg hover:bg-gold-400/30 transition"
                >
                  {editingId ? 'تحديث' : 'حفظ'}
                </button>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}

      {/* Services List */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">({services.length}) الخدمات الموجودة</h2>
        
        {services.length === 0 ? (
          <GlassCard>
            <div className="text-center py-12">
              <p className="text-gray-400">لا توجد خدمات. ابدأ بإضافة خدمة جديدة</p>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard>
                  <div className="space-y-3">
                    {/* Service Info */}
                    <div>
                      <p className="text-white font-bold text-lg">{service.nameAr}</p>
                      <p className="text-xs text-gray-400">{service.nameEn}</p>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 py-3 border-y border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">السعر:</span>
                        <span className="text-gold-400 font-bold">{service.price} ج.م</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">المدة:</span>
                        <span className="text-white">{service.duration} دقائق</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">الفئة:</span>
                        <span className="text-white text-sm">{service.category}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-400/20 rounded hover:bg-blue-500/30 transition text-sm"
                      >
                        <Edit2 size={16} />
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 border border-red-400/20 rounded hover:bg-red-500/30 transition text-sm"
                      >
                        <Trash2 size={16} />
                        حذف
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
