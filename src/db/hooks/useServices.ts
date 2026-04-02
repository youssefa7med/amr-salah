import { useState, useEffect } from 'react'
import { supabase, Service } from '../supabase'
import toast from 'react-hot-toast'

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('category', { ascending: true })

      if (error) throw error
      setServices(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const addService = async (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          ...service,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()

      if (error) throw error
      await fetchServices()
      return data?.[0]
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
      await fetchServices()
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchServices()
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  const getServicesByCategory = (category: string) => {
    return services.filter((s) => s.category === category)
  }

  const updateServicePrice = async (id: string, newPrice: number) => {
    await updateService(id, { price: newPrice })
  }

  const bulkUpdatePrices = async (serviceIds: string[], percentage: number, isIncrease: boolean) => {
    try {
      const updates = services
        .filter((s) => serviceIds.includes(s.id!))
        .map((s) => ({
          id: s.id,
          price: isIncrease ? s.price * (1 + percentage / 100) : s.price * (1 - percentage / 100),
        }))

      for (const update of updates) {
        await updateServicePrice(update.id!, update.price)
      }

      toast.success('Prices updated successfully')
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  return {
    services,
    loading,
    error,
    fetchServices,
    addService,
    updateService,
    deleteService,
    getServicesByCategory,
    updateServicePrice,
    bulkUpdatePrices,
  }
}
