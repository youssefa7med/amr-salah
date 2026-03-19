import { useEffect, useState } from 'react'
import { supabase } from '@/db/supabase'
import toast from 'react-hot-toast'
import { ArrowUpRight, Users, TrendingUp, DollarSign } from 'lucide-react'

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalShops: 0,
    activeShops: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        // Get total shops
        const { data: shops, error: shopsError } = await supabase
          .from('shops')
          .select('id, subscription_status')

        if (shopsError) throw shopsError

        // Get current month revenue
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const yearMonth = `${year}-${month}`

        const { data: usageLogs, error: usageError } = await supabase
          .from('usage_logs')
          .select('billable_amount')
          .eq('year_month', yearMonth)

        if (usageError) throw usageError

        const monthlyRev = usageLogs?.reduce((sum, log) => sum + (log.billable_amount || 0), 0) || 0

        // Get all time revenue
        const { data: allUsageLogs, error: allUsageError } = await supabase
          .from('usage_logs')
          .select('billable_amount')

        if (allUsageError) throw allUsageError

        const totalRev = allUsageLogs?.reduce((sum, log) => sum + (log.billable_amount || 0), 0) || 0

        setStats({
          totalShops: shops?.length || 0,
          activeShops: shops?.filter(s => s.subscription_status === 'active').length || 0,
          totalRevenue: totalRev,
          monthlyRevenue: monthlyRev,
        })
      } catch (error: any) {
        console.error('Error fetching stats:', error)
        toast.error('Failed to load admin statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const StatCard = ({
    title,
    value,
    icon: Icon,
    format = 'text',
  }: {
    title: string
    value: number | string
    icon: any
    format?: 'text' | 'currency' | 'percent'
  }) => (
    <div className='bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-lg p-6 hover:border-gold-400/30 transition'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-slate-300 text-sm font-medium'>{title}</h3>
        <Icon className='text-gold-400' size={20} />
      </div>
      <div className='flex items-baseline gap-2'>
        <p className='text-3xl font-bold text-white'>
          {format === 'currency'
            ? `ج.م ${Number(value).toLocaleString('ar-EG')}`
            : format === 'percent'
              ? `${value}%`
              : value}
        </p>
      </div>
      <p className='text-slate-400 text-xs mt-2 flex items-center gap-1'>
        <ArrowUpRight size={12} className='text-green-400' />
        {title === 'Monthly Revenue' ? 'This month' : 'Total'}
      </p>
    </div>
  )

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-80'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-gold-400'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>Admin Dashboard</h1>
        <p className='text-slate-400'>System overview and performance metrics</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard title='Total Shops' value={stats.totalShops} icon={Users} format='text' />
        <StatCard title='Active Shops' value={stats.activeShops} icon={TrendingUp} format='text' />
        <StatCard title='Total Revenue' value={stats.totalRevenue} icon={DollarSign} format='currency' />
        <StatCard title='Monthly Revenue' value={stats.monthlyRevenue} icon={DollarSign} format='currency' />
      </div>
    </div>
  )
}
