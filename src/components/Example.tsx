'use client'

import { useEffect, useState, useCallback, memo } from 'react'
import { cn } from '@/lib/utils'

// 재사용 가능한 커스텀 훅
const useLogger = (name: string) => {
  useEffect(() => {
    console.log(`✨ ${name} 컴포넌트가 마운트되었습니다`)
    return () => console.log(`🧹 ${name} 컴포넌트가 언마운트되었습니다`)
  }, [name])
}

const useFadeIn = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  
  return isVisible
}

// Props 타입 정의
interface ExampleProps {
  message?: string
  className?: string
  variant?: 'default' | 'gradient' | 'minimal'
  onMount?: () => void
}

const Example = memo<ExampleProps>(({ 
  message = "안녕하세요, 아름다운 세상! ✨",
  className,
  variant = 'gradient',
  onMount 
}) => {
  const isVisible = useFadeIn(300)
  
  useLogger('Example')
  
  const handleMount = useCallback(() => {
    onMount?.()
  }, [onMount])
  
  useEffect(() => {
    handleMount()
  }, [handleMount])
  
  const variants = {
    default: "bg-white border-gray-200 text-gray-800",
    gradient: "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200 text-gray-800",
    minimal: "bg-transparent border-transparent text-gray-600"
  }
  
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border p-8 transition-all duration-500 hover:shadow-xl",
      "min-h-[200px] flex items-center justify-center",
      variants[variant],
      className
    )}>
      {/* 배경 애니메이션 효과 */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-pulse group-hover:translate-x-full transition-transform duration-1000" />
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className={cn(
        "relative text-center space-y-4 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        {/* 메시지 텍스트 */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {message}
        </h2>
        
        {/* 구분선 */}
        <div className={cn(
          "mx-auto h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000",
          isVisible ? "w-16 opacity-100" : "w-0 opacity-0"
        )} />
        
        {/* 서브 텍스트 */}
        <p className={cn(
          "text-sm text-gray-500 font-medium transition-all duration-700 delay-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          깔끔하고 모던한 React 컴포넌트 💫
        </p>
        
        {/* 상태 표시 */}
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium transition-all duration-700 delay-500",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          컴포넌트 활성화됨
        </div>
      </div>
    </div>
  )
})

Example.displayName = 'Example'

export default Example

// 사용 예시:
// <Example />
// <Example message="커스텀 메시지" variant="minimal" />
// <Example onMount={() => console.log('마운트 완료!')} /> 