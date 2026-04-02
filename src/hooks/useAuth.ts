import { useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/db/supabase'

export interface AuthUser {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

/**
 * Single Shop Auth Hook - Amr Salah Barber Shop
 * No multi-tenancy, no role checking (single owner)
 * Just simple Supabase Auth verification
 */
export function useAuth() {
  const [state, setState] = useState<AuthUser>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let mounted = true

    const resolveUser = async (session: Session | null) => {
      if (!session) {
        if (mounted) setState({ user: null, session: null, loading: false, error: null })
        return
      }

      // Simply authenticated if session exists
      if (mounted) {
        setState({ user: session.user, session, loading: false, error: null })
      }
    }

    // ✅ Check existing session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      resolveUser(session)
    })

    // ✅ Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) resolveUser(session)
    })

    // ✅ Fallback timeout
    const timeout = setTimeout(() => {
      if (mounted) setState(prev => prev.loading ? { ...prev, loading: false, error: null } : prev)
    }, 5000)

    return () => {
      mounted = false
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

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
    setState({ user: null, session: null, loading: false, error: null })
    return { error: null }
  }, [])

  return {
    ...state,
    signIn,
    signOut,
  }
}
