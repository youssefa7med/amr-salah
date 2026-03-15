import React from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, suffix = '' }) => {
  return (
    <span>
      {value.toLocaleString('ar-EG')}
      {suffix}
    </span>
  )
}
