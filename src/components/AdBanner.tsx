'use client'


import { ExternalLink } from 'lucide-react'

interface AdBannerProps {
  size?: 'small' | 'medium' | 'large'
  position?: 'horizontal' | 'vertical'
  className?: string
}

export default function AdBanner({ 
  size = 'medium', 
  position = 'horizontal',
  className = '' 
}: AdBannerProps) {
  const sizeClasses = {
    small: 'h-24',
    medium: 'h-32',
    large: 'h-48'
  }

  const positionClasses = {
    horizontal: 'w-full',
    vertical: 'w-80 h-[754px]'
  }

  return (
    <div className={`
      ${sizeClasses[size]} 
      ${positionClasses[position]} 
      bg-gradient-to-r from-gray-100 to-gray-200 
      border-2 border-dashed border-gray-300 
      flex items-center justify-center 
      hover:border-gray-400 transition-colors
      cursor-pointer
      rounded-lg
      ${className}
    `}>
      <div className="text-center text-gray-500">
        <ExternalLink className="h-8 w-8 mx-auto mb-2" />
        <p className="text-lg font-medium">광고 영역</p>
        <p className="text-sm">Advertisement</p>
      </div>
    </div>
  )
} 