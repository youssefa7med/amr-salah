import { useState, useEffect, useCallback } from 'react'
import { supabase, Expense } from '../supabase'
import { getEgyptDateString } from '../../utils/egyptTime'
import toast from 'react-hot-toast'

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true)

      console.log('Fetching expenses from database...')
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false })

      if (error) throw error
      console.log('Expenses fetched:', data?.length || 0, 'records')
      setExpenses(data || [])
      setError(null)
    } catch (err: any) {
      console.error('Error fetching expenses:', err)
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expense,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error
      await fetchExpenses()
      return data?.[0]
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchExpenses()
    } catch (err: any) {
      toast.error(err.message)
      throw err
    }
  }

  const getExpensesByDateRange = async (startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .gte('expense_date', startDate)
        .lte('expense_date', endDate)
        .order('expense_date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err: any) {
      toast.error(err.message)
      return []
    }
  }

  const getTodayExpenses = async () => {
    try {
      const today = getEgyptDateString()
      const { data, error } = await supabase
        .from('expenses')
        .select('amount')
        .eq('expense_date', today)

      if (error) throw error
      return data?.reduce((sum: number, e: any) => sum + (e.amount || 0), 0) || 0
    } catch (err: any) {
      toast.error(err.message)
      return 0
    }
  }

  const getExpensesByCategory = async (category: string, startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('amount')
        .eq('category', category)
        .gte('date', startDate)
        .lte('date', endDate)

      if (error) throw error
      return data?.reduce((sum: number, e: any) => sum + (e.amount || 0), 0) || 0
    } catch (err: any) {
      toast.error(err.message)
      return 0
    }
  }

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    deleteExpense,
    getExpensesByDateRange,
    getTodayExpenses,
    getExpensesByCategory,
  }
}
