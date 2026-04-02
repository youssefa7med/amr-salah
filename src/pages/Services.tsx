import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { GlassCard } from '../components/ui/GlassCard'
import { useServices } from '../db/hooks/useServices'
import { useServiceVariants } from '../db/hooks/useServiceVariants'
import { motion } from 'framer-motion'
import { Trash2, Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

export const Services: React.FC = () => {
  const { t } = useTranslation()
  const { services, addService, deleteService } = useServices()
  const { addVariant, deleteVariant } = useServiceVariants()
  
  // State for adding main service
  const [serviceFormData, setServiceFormData] = useState({
    nameAr: '',
    nameEn: '',
    price: 0,
    duration: 0,
    category: 'haircut',
  })

  // State for adding sub-service
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [variantFormData, setVariantFormData] = useState({
    nameAr: '',
    nameEn: '',
    price: 0,
  })

  const [serviceVariantsMap, setServiceVariantsMap] = useState<{[key: string]: any[]}>({})
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null)

  const categories = ['haircut', 'beard', 'skincare', 'kids', 'packages']

  // Load variants
  useEffect(() => {
    const loadAllVariants = async () => {
      const variantsMap: {[key: string]: any[]} = {}
      setServiceVariantsMap(variantsMap)
    }
    if (services.length > 0) {
      loadAllVariants()
    }
  }, [services])

  // Add main service
  const handleAddService = async () => {
    if (!serviceFormData.nameAr || serviceFormData.price <= 0) {
      toast.error('الرجاء إدخال اسم الخدمة والسعر')
      return
    }

    try {
      await addService({
        ...serviceFormData,
        active: true,
      })
      toast.success('تم إضافة الخدمة بنجاح')
      setServiceFormData({ nameAr: '', nameEn: '', price: 0, duration: 0, category: 'haircut' })
    } catch (err) {
      toast.error('خطأ في إضافة الخدمة')
    }
  }

  // Add sub-service
  const handleAddVariant = async () => {
    if (!selectedServiceId) {
      toast.error('الرجاء اختيار خدمة أولاً')
      return
    }

    if (!variantFormData.nameAr || variantFormData.price <= 0) {
      toast.error('الرجاء إدخال اسم النوع والسعر')
      return
    }

    try {
      await addVariant({
        serviceId: selectedServiceId,
        nameAr: variantFormData.nameAr,
        nameEn: variantFormData.nameEn,
        price: variantFormData.price,
        isActive: true,
      })
      toast.success('تم إضافة نوع الخدمة')
      setVariantFormData({ nameAr: '', nameEn: '', price: 0 })
    } catch (err) {
      toast.error('خطأ في إضافة النوع')
    }
  }

  const handleDeleteService = async (id: string) => {
    if (confirm('هل تريد حذف هذه الخدمة؟')) {
      try {
        await deleteService(id)
        toast.success('تم حذف الخدمة')
      } catch (err) {
        toast.error('خطأ في حذف الخدمة')
      }
    }
  }

  const handleDeleteVariant = async (variantId: string) => {
    if (confirm('هل تريد حذف هذا النوع؟')) {
      try {
        await deleteVariant(variantId)
        toast.success('تم حذف النوع')
      } catch (err) {
        toast.error('خطأ في حذف النوع')
      }
    }
  }

  const selectedService = services.find(s => s.id === selectedServiceId)

  return (
    <div className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-white">الخدمات والأسعار</h1>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: Add Main Service */}
        <div>
          <GlassCard>
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus size={20} />
                إضافة خدمة رئيسية
              </h2>
              <p className="text-sm text-gray-400">أضف الخدمات الأساسية مثل قص شعر، حلاقة لحية، إلخ</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">اسم الخدمة (عربي) *</label>
                  <input
                    type="text"
                    placeholder="مثال: قص شعر"
                    value={serviceFormData.nameAr}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, nameAr: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Service Name (English)</label>
                  <input
                    type="text"
                    placeholder="Example: Haircut"
                    value={serviceFormData.nameEn}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, nameEn: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">السعر (ج.م) *</label>
                    <input
                      type="number"
                      placeholder="50"
                      value={serviceFormData.price}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">المدة (دقائق)</label>
                    <input
                      type="number"
                      placeholder="30"
                      value={serviceFormData.duration}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, duration: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">الفئة</label>
                  <select
                    value={serviceFormData.category}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {t(`pos.categories.${cat}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddService}
                  className="w-full px-4 py-3 bg-gold-400/20 text-gold-400 border border-gold-400/30 rounded-lg font-bold hover:bg-gold-400/30 transition"
                >
                  ✓ إضافة الخدمة
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT: Add Sub-Service */}
        <div>
          <GlassCard>
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ChevronDown size={20} />
                إضافة نوع خدمة
              </h2>
              <p className="text-sm text-gray-400">أضف أنواع مختلفة لنفس الخدمة بأسعار مختلفة</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">اختر الخدمة الرئيسية *</label>
                  <select
                    value={selectedServiceId || ''}
                    onChange={(e) => setSelectedServiceId(e.target.value || null)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-gold-400"
                  >
                    <option value="">-- اختر خدمة --</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.nameAr} ({service.price} ج.م)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedService && (
                  <>
                    <div className="p-3 bg-gold-400/10 border border-gold-400/20 rounded-lg">
                      <p className="text-sm text-gray-300">الخدمة المختارة:</p>
                      <p className="text-lg font-bold text-gold-400">{selectedService.nameAr}</p>
                      <p className="text-xs text-gray-400">{selectedService.nameEn}</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">نوع الخدمة (عربي)</label>
                      <input
                        type="text"
                        placeholder="مثال: قص فاخر"
                        value={variantFormData.nameAr}
                        onChange={(e) => setVariantFormData({ ...variantFormData, nameAr: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Service Type (English)</label>
                      <input
                        type="text"
                        placeholder="Example: Premium Cut"
                        value={variantFormData.nameEn}
                        onChange={(e) => setVariantFormData({ ...variantFormData, nameEn: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">السعر (ج.م)</label>
                      <input
                        type="number"
                        placeholder="75"
                        value={variantFormData.price}
                        onChange={(e) => setVariantFormData({ ...variantFormData, price: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    <button
                      onClick={handleAddVariant}
                      className="w-full px-4 py-3 bg-blue-500/20 text-blue-400 border border-blue-400/30 rounded-lg font-bold hover:bg-blue-500/30 transition"
                    >
                      + إضافة النوع
                    </button>
                  </>
                )}

                {!selectedService && services.length > 0 && (
                  <div className="p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg text-center text-gray-400">
                    الرجاء اختيار خدمة أولاً
                  </div>
                )}

                {services.length === 0 && (
                  <div className="p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg text-center text-gray-400">
                    أضف خدمة رئيسية أولاً من الجانب الأيسر
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Services List */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">الخدمات الموجودة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, idx) => {
            const serviceVariants = serviceVariantsMap[service.id!] || []
            const isExpanded = expandedServiceId === service.id

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-bold text-lg">{service.nameAr}</p>
                        <p className="text-xs text-gray-400">{service.nameEn}</p>
                        <p className="text-gold-400 font-bold mt-1">{service.price} ج.م</p>
                      </div>
                      <button
                        onClick={() => handleDeleteService(service.id!)}
                        className="p-2 hover:bg-red-500/20 rounded transition"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>

                    {serviceVariants.length > 0 && (
                      <div className="border-t border-white/10 pt-2">
                        <button
                          onClick={() => setExpandedServiceId(isExpanded ? null : service.id!)}
                          className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded transition"
                        >
                          <span className="text-sm text-gray-300">الأنواع ({serviceVariants.length})</span>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {isExpanded && (
                          <div className="mt-2 space-y-2">
                            {serviceVariants.map((variant: any) => (
                              <div key={variant.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                                <div>
                                  <p className="text-white text-sm">{variant.nameAr}</p>
                                  <p className="text-xs text-gray-400">{variant.nameEn}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-gold-400 font-bold text-sm">{variant.price} ج.م</p>
                                  <button onClick={() => handleDeleteVariant(variant.id)} className="p-1">
                                    <X size={14} className="text-red-400" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">لا توجد خدمات. ابدأ بإضافة خدمة رئيسية</p>
          </div>
        )}
      </div>
    </div>
  )
}
