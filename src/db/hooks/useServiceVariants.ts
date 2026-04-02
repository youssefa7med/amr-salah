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
        .order('createdAt', { ascending: true })

      if (error) throw error
      setVariants(data || [])
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
          ...variant,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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
      const { error } = await supabase
        .from('service_variants')
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
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
        .eq('serviceId', serviceId)
        .eq('active', true)
        .order('price', { ascending: true })

      if (error) throw error
      return data || []
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
