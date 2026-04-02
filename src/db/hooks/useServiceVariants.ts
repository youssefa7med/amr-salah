import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import toast from 'react-hot-toast'

export interface ServiceVariant {
  id: string
  serviceId: string
  nameAr: string
  nameEn: string
  price: number
  duration?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const useServiceVariants = () => {
  const [variants, setVariants] = useState<ServiceVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVariants = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('service_variants')
        .select('*')
        .eq('active', true)
        .order('createdat', { ascending: true })

      if (error) throw error
      
      // Transform lowercase columns to camelCase
      if (data && data.length > 0) {
        const transformedData = data.map((variant: any) => ({
          id: variant.id,
          serviceId: variant.serviceid,
          nameAr: variant.namear,
          nameEn: variant.nameen,
          price: variant.price,
          duration: variant.duration,
          isActive: variant.active,
          createdAt: variant.createdat,
          updatedAt: variant.updatedat,
        }))
        setVariants(transformedData)
      } else {
        setVariants([])
      }
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVariants()
  }, [])

  const addVariant = async (variant: Omit<ServiceVariant, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('service_variants')
        .insert({
          serviceid: variant.serviceId,
          namear: variant.nameAr,
          nameen: variant.nameEn,
          price: variant.price,
          duration: variant.duration,
          active: variant.isActive,
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString(),
        })
        .select()

      if (error) throw error
      await fetchVariants()
      return data?.[0]
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  const updateVariant = async (id: string, updates: Partial<ServiceVariant>) => {
    try {
      const updateData: any = {}
      
      if (updates.serviceId) updateData.serviceid = updates.serviceId
      if (updates.nameAr) updateData.namear = updates.nameAr
      if (updates.nameEn) updateData.nameen = updates.nameEn
      if (updates.price !== undefined) updateData.price = updates.price
      if (updates.duration !== undefined) updateData.duration = updates.duration
      if (updates.isActive !== undefined) updateData.active = updates.isActive
      
      updateData.updatedat = new Date().toISOString()

      const { error } = await supabase
        .from('service_variants')
        .update(updateData)
        .eq('id', id)

      if (error) throw error
      await fetchVariants()
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  const deleteVariant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('service_variants')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchVariants()
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  const getVariantsByServiceId = async (serviceId: string) => {
    try {
      const { data, error } = await supabase
        .from('service_variants')
        .select('*')
        .eq('serviceid', serviceId)
        .eq('active', true)
        .order('price', { ascending: true })

      if (error) throw error
      
      // Transform lowercase columns to camelCase
      if (data && data.length > 0) {
        return data.map((variant: any) => ({
          id: variant.id,
          serviceId: variant.serviceid,
          nameAr: variant.namear,
          nameEn: variant.nameen,
          price: variant.price,
          duration: variant.duration,
          isActive: variant.active,
          createdAt: variant.createdat,
          updatedAt: variant.updatedat,
        }))
      }
      return []
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  return {
    variants,
    loading,
    error,
    fetchVariants,
    addVariant,
    updateVariant,
    deleteVariant,
    getVariantsByServiceId,
  }
}
