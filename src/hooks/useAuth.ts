import { useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/db/supabase'

export type UserRole = 'admin' | 'shop' | null

export interface AuthUser {
  user: User | null
  session: Session | null
  role: UserRole
  shopId: string | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthUser>({
    user: null,
    session: null,
    role: null,
    shopId: null,
    loading: true,
    error: null,
  })

  const checkIfAdmin = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data } = await supabase
        .from('admin_users')
        .select('id')
        .eq('auth_user_id', userId)
        .maybeSingle()
      return !!data
    } catch { return false }
  }, [])

  const getShopId = useCallback(async (userId: string): Promise<string | null> => {
    try {
      const { data } = await supabase
        .from('shops')
        .select('id')
        .eq('auth_user_id', userId)
        .maybeSingle()
      return data?.id || null
    } catch { return null }
  }, [])

  useEffect(() => {
    let mounted = true

    const resolveUser = async (session: Session | null) => {
      if (!session) {
        if (mounted) setState({ user: null, session: null, role: null, shopId: null, loading: false, error: null })
        return
      }

      const userId = session.user.id
      const isAdmin = await checkIfAdmin(userId)

      if (isAdmin) {
        if (mounted) setState({ user: session.user, session, role: 'admin', shopId: null, loading: false, error: null })
        return
      }

      const shopId = await getShopId(userId)
      if (shopId) {
        if (mounted) setState({ user: session.user, session, role: 'shop', shopId, loading: false, error: null })
        return
      }

      await supabase.auth.signOut()
      if (mounted) setState({ user: null, session: null, role: null, shopId: null, loading: false, error: 'User not found in system' })
    }

    // ✅ Step 1: Check existing session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      resolveUser(session)
    })

    // ✅ Step 2: Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) resolveUser(session)
    })

    // ✅ Step 3: Fallback timeout
    const timeout = setTimeout(() => {
      if (mounted) setState(prev => prev.loading ? { ...prev, loading: false, error: null } : prev)
    }, 5000)

    return () => {
      mounted = false
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [checkIfAdmin, getShopId])

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      return { error }
    }
    return { error: null }
  }, [])

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }))
    await supabase.auth.signOut()
    setState({ user: null, session: null, role: null, shopId: null, loading: false, error: null })
    return { error: null }
  }, [])

  return {
    ...state,
    signIn,
    signOut,
  }
}
