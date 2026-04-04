import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import toast from 'react-hot-toast'

export interface VisitLog {
  id: string
  clientId: string
  clientName: string
  visitDate: string
  visitTime?: string
  servicesCount?: number
  totalSpent?: number
  servicetype?: string
  barberId?: string
  barberName?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Transform database lowercase columns to camelCase
const transformVisitLogData = (data: any): VisitLog => ({
  id: data.id,
  clientId: data.clientid,
  clientName: data.clientname,
  visitDate: data.visit_date,
  visitTime: data.visit_time,
  servicesCount: data.services_count,
  totalSpent: data.total_spent,
  servicetype: data.servicetype,
  barberId: data.barberid,
  barberName: data.barbername,
  notes: data.notes,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
})

export const useVisitLogs = () => {
  const [visitLogs, setVisitLogs] = useState<VisitLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVisitLogs = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('visit_logs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      const transformedData = (data || []).map(transformVisitLogData)
      setVisitLogs(transformedData)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisitLogs()
  }, [])

  const addVisitLog = async (log: Omit<VisitLog, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Map camelCase to database lowercase columns
      const { data, error } = await supabase
        .from('visit_logs')
        .insert({
          clientid: log.clientId,
          clientname: log.clientName || '',
          servicetype: log.servicetype || 'general',
          barberid: log.barberId,
          barbername: log.barberName || '',
          visit_date: log.visitDate,
          visit_time: log.visitTime,
          services_count: log.servicesCount || 0,
          total_spent: log.totalSpent || 0,
          notes: log.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error
      await fetchVisitLogs()
      return data?.[0] ? transformVisitLogData(data[0]) : undefined
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  const getClientVisitLogs = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('visit_logs')
        .select('*')
        .eq('clientid', clientId)
        .order('visit_date', { ascending: false })

      if (error) throw error
      return (data || []).map(transformVisitLogData)
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  return {
    visitLogs,
    loading,
    error,
    fetchVisitLogs,
    addVisitLog,
    getClientVisitLogs,
  }
}
