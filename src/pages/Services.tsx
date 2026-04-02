import React, { useState } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { useServices } from '../db/hooks/useServices'
import { motion } from 'framer-motion'
import { Trash2, Plus, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { ServiceModal } from '../components/ServiceModal'

export const Services: React.FC = () => {
  const { services, addService, deleteService, updateService } = useServices()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<any | null>(null)

  const handleOpenAddModal = () => {
    setEditingService(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (service: any) => {
    setEditingService(service)
    setIsModalOpen(true)
  }

  const handleSave = async (data: { nameAr: string; price: number; duration: number }) => {
    try {
      if (editingService) {
        await updateService(editingService.id, { ...data, nameEn: data.nameAr } as any)
        toast.success('تم تحديث الخدمة')
      } else {
        await addService({
          ...data,
          nameEn: data.nameAr,
          category: 'haircut',
          active: true,
        } as any)
        toast.success('تم إضافة الخدمة')
      }
      setIsModalOpen(false)
      setEditingService(null)
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل تريد حذف هذه الخدمة؟')) {
      try {
        await deleteService(id)
        toast.success('تم حذف الخدمة')
      } catch (err: any) {
        toast.error(err.message || 'حدث خطأ')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">الخدمات</h1>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-gold-400/20 text-gold-400 border border-gold-400/20 rounded-lg hover:bg-gold-400/30 transition font-medium"
        >
          <Plus size={20} />
          + إضافة خدمة
        </button>
      </div>

      {/* Services List */}
      {services.length === 0 ? (
        <GlassCard>
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">لا توجد خدمات</p>
            <p className="text-gray-500 text-sm mt-2">ابدأ بإضافة خدمة جديدة</p>
          </div>
        </GlassCard>
      ) : (
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">#</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">اسم الخدمة</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-300">السعر</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-300">المدة</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-300">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, idx) => (
                  <motion.tr
                    key={service.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4 text-gray-400 text-sm">{idx + 1}</td>
                    <td className="px-6 py-4 text-white font-medium">{service.nameAr}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gold-400 font-bold">{service.price} ج.م</span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">{service.duration} د</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(service)}
                          className="p-2 hover:bg-blue-500/20 rounded transition"
                          title="تعديل"
                        >
                          <Edit2 size={16} className="text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id!)}
                          className="p-2 hover:bg-red-500/20 rounded transition"
                          title="حذف"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          <div className="border-t border-white/10 mt-6 pt-4 text-sm text-gray-400">
            إجمالي الخدمات: <span className="text-gold-400 font-bold">{services.length}</span>
          </div>
        </GlassCard>
      )}

      {/* Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingService(null)
        }}
        onSave={handleSave}
        initialData={
          editingService
            ? { nameAr: editingService.nameAr, price: editingService.price, duration: editingService.duration }
            : null
        }
      />
    </div>
  )
}
