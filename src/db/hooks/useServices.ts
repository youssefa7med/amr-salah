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
      console.log('=== DEBUG: Fetching Services ===')

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('category', { ascending: true })

      console.log('Fetch error:', error)
      console.log('Fetch data:', data)
      
      if (data && data.length > 0) {
        console.log('📊 First service structure:')
        console.log('Column names:', Object.keys(data[0]))
        console.log('Full object:', JSON.stringify(data[0], null, 2))
        
        // Transform lowercase columns to camelCase
        const transformedData = data.map((service: any) => ({
          id: service.id,
          nameAr: service.namear,
          nameEn: service.nameen,
          price: service.price,
          duration: service.duration,
          category: service.category,
          active: service.active,
          createdAt: service.createdat,
          updatedAt: service.updatedat,
          shop_id: service.shop_id,
        }))
        
        console.log('✅ Transformed data:', transformedData[0])
        setServices(transformedData)
      } else {
        setServices([])
      }

      if (error) throw error
      setError(null)
    } catch (err: any) {
      console.error('❌ FETCH ERROR:', err)
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
      console.log('=== DEBUG: Adding Service ===')
      console.log('Input service:', service)
      
      const insertData = {
        namear: service.nameAr,
        nameen: service.nameEn,
        price: service.price,
        duration: service.duration,
        category: service.category,
        active: service.active,
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
      }
      console.log('Data being inserted:', insertData)
      
      const { data, error } = await supabase
        .from('services')
        .insert(insertData)
        .select()

      console.log('Supabase response - Error:', error)
      console.log('Supabase response - Data:', data)

      if (error) {
        console.error('❌ INSERT ERROR:', error)
        throw error
      }
      
      console.log('✅ Service added successfully:', data?.[0])
      await fetchServices()
      return data?.[0]
    } catch (err: any) {
      console.error('❌ FULL ERROR:', err)
      toast.error(err.message)
      throw err
    }
  }

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const updateData: any = {}
      
      if (updates.nameAr) updateData.namear = updates.nameAr
      if (updates.nameEn) updateData.nameen = updates.nameEn
      if (updates.price !== undefined) updateData.price = updates.price
      if (updates.duration !== undefined) updateData.duration = updates.duration
      if (updates.category) updateData.category = updates.category
      if (updates.active !== undefined) updateData.active = updates.active
      
      updateData.updatedat = new Date().toISOString()

      const { error } = await supabase
        .from('services')
        .update(updateData)
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
