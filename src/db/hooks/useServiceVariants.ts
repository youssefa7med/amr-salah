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
        .order('created_at', { ascending: true })

      if (error) throw error
      
      // Transform lowercase columns to camelCase
      if (data && data.length > 0) {
        const transformedData = data.map((variant: any) => ({
          id: variant.id,
          serviceId: variant.serviceid,
          nameAr: variant.name_ar,
          nameEn: variant.name,
          price: variant.price,
          duration: variant.duration,
          isActive: variant.active,
          createdAt: variant.created_at,
          updatedAt: variant.updated_at,
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
          name_ar: variant.nameAr,
          name: variant.nameEn,
          price: variant.price,
          duration: variant.duration,
          active: variant.isActive,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
      if (updates.nameAr) updateData.name_ar = updates.nameAr
      if (updates.nameEn) updateData.name = updates.nameEn
      if (updates.price !== undefined) updateData.price = updates.price
      if (updates.duration !== undefined) updateData.duration = updates.duration
      if (updates.isActive !== undefined) updateData.active = updates.isActive
      
      updateData.updated_at = new Date().toISOString()

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
          nameAr: variant.name_ar,
          nameEn: variant.name,
          price: variant.price,
          duration: variant.duration,
          isActive: variant.active,
          createdAt: variant.created_at,
          updatedAt: variant.updated_at,
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
