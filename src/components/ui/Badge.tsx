import React from 'react'

interface BadgeProps {
  label: string
  variant?: 'gold' | 'success' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'gold', size = 'md' }) => {
  const variantClasses = {
    gold: 'bg-gold-400/20 text-gold-400 border border-gold-400/20',
    success: 'bg-green-500/20 text-green-300 border border-green-500/20',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/20',
    info: 'bg-blue-500/20 text-blue-300 border border-blue-500/20',
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {label}
    </span>
  )
}
