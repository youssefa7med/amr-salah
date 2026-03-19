import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase, Client } from '../supabase'
import toast from 'react-hot-toast'

export const useClients = () => {
  const { shopId } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setLoading(true)
      if (!shopId) {
        setClients([])
        return
      }
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('shop_id', shopId)
        .order('createdAt', { ascending: false })

      if (error) throw error
      setClients(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [shopId])

  const addClient = async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (!shopId) throw new Error('Shop ID is required')
      
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...client,
          shop_id: shopId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()

      if (error) throw error
      await fetchClients()
      return data?.[0]
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
      await fetchClients()
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchClients()
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  const searchClients = async (query: string) => {
    try {
      if (!query.trim()) {
        await fetchClients()
        return
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)

      if (error) throw error
      setClients(data || [])
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const getClientByPhone = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('phone', phone)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (err: any) {
      throw err
    }
  }

  return {
    clients,
    loading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    searchClients,
    getClientByPhone,
  }
}
