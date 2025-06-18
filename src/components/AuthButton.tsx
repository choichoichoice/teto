'use client'

import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useCallback, useEffect, memo } from 'react'
import { cn } from '@/lib/utils'

// 로딩 상태 타입
type LoadingState = 'idle' | 'logging-out' | 'logging-in' | 'refreshing'

// Props 타입 정의
interface AuthButtonProps {
  user: User | null
  className?: string
  showProfileImage?: boolean
  variant?: 'default' | 'compact' | 'full'
  onAuthChange?: (user: User | null) => void
}

// 캐시 무효화 유틸리티
const bustCache = () => {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substr(2, 9)
  
  // 강제 페이지 새로고침을 위한 캐시 무효화
  if (typeof window !== 'undefined') {
    // Service Worker 캐시 무효화
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.update()
        })
      })
    }
    
    // 브라우저 캐시 무효화
    const meta = document.querySelector('meta[http-equiv="Cache-Control"]')
    if (meta) {
      meta.setAttribute('content', 'no-cache, no-store, must-revalidate')
    }
    
    // URL에 타임스탬프 추가해서 캐시 무효화
    const url = new URL(window.location.href)
    url.searchParams.set('_t', timestamp.toString())
    url.searchParams.set('_r', randomId)
    
    window.history.replaceState({}, '', url.toString())
  }
  
  return `${timestamp}-${randomId}`
}

const AuthButton = memo<AuthButtonProps>(({
  user,
  className,
  showProfileImage = true,
  variant = 'default',
  onAuthChange
}) => {
  const router = useRouter()
  const pathname = usePathname()
  
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  
  // 에러 자동 제거
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])
  
  // 캐시 무효화를 포함한 라우터 새로고침
  const forceRefresh = useCallback(async () => {
    setLoadingState('refreshing')
    
    try {
      // 캐시 무효화
      const cacheKey = bustCache()
      
      // 여러 방법으로 새로고침 시도
      await Promise.all([
        // Next.js 라우터 새로고침
        router.refresh(),
        
        // 강제 새로고침을 위한 지연
        new Promise(resolve => setTimeout(resolve, 100)),
        
        // 추가적인 캐시 무효화
        fetch(`${pathname}?_refresh=${cacheKey}`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }).catch(() => {})
      ])
      
      // 완전한 페이지 새로고침 (최후의 수단)
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      }, 500)
      
    } catch (err) {
      console.error('새로고침 중 오류:', err)
      setError('페이지 새로고침에 실패했습니다.')
    } finally {
      setTimeout(() => setLoadingState('idle'), 1000)
    }
  }, [router, pathname])
  
  // 로그아웃 처리 (재시도 로직 포함)
  const handleLogout = useCallback(async () => {
    setLoadingState('logging-out')
    setError(null)
    
    try {
      // Supabase 로그아웃
      const { error: signOutError } = await supabase.auth.signOut({
        scope: 'global' // 모든 세션에서 로그아웃
      })
      
      if (signOutError) throw signOutError
      
      // 로컬 스토리지 클리어
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
        
        // 쿠키도 클리어
        document.cookie.split(";").forEach(c => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
        })
      }
      
      // 콜백 실행
      onAuthChange?.(null)
      
      // 강제 새로고침
      await forceRefresh()
      
    } catch (err: any) {
      console.error('로그아웃 오류:', err)
      setError(`로그아웃 실패: ${err.message}`)
      
      // 재시도 로직
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          handleLogout()
        }, 1000 * (retryCount + 1))
      }
    } finally {
      setLoadingState('idle')
    }
  }, [supabase.auth, onAuthChange, forceRefresh, retryCount])
  
  // 카카오 로그인 처리
  const handleKakaoLogin = useCallback(async () => {
    setLoadingState('logging-in')
    setError(null)
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            _t: Date.now().toString() // 캐시 무효화
          }
        }
      })
      
      if (signInError) throw signInError
      
      // 로그인 성공 시 캐시 무효화
      bustCache()
      
    } catch (err: any) {
      console.error('카카오 로그인 오류:', err)
      setError(`로그인 실패: ${err.message}`)
    } finally {
      setLoadingState('idle')
    }
  }, [supabase.auth])
  
  // 스타일 variants
  const variants = {
    default: "flex items-center gap-4 p-4 rounded-lg bg-white border border-gray-200 shadow-sm",
    compact: "flex items-center gap-2 p-2 rounded-md",
    full: "flex items-center justify-between w-full p-6 rounded-xl bg-gradient-to-r from-white to-gray-50 border border-gray-200 shadow-lg"
  }
  
  // 로딩 중인지 확인
  const isLoading = loadingState !== 'idle'
  
  return (
    <header className={cn(variants[variant], className)}>
      {/* 에러 메시지 */}
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm animate-in slide-in-from-top-2">
          <span className="flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </span>
        </div>
      )}
      
      {user ? (
        // 로그인된 상태
        <div 
          key={`user-${user.id}-${user.updated_at}`} 
          className="flex items-center gap-4 w-full"
        >
          {/* 프로필 영역 */}
          <div className="flex items-center gap-3 flex-1">
            {showProfileImage && user.user_metadata?.avatar_url && (
              <div className="relative">
                <img
                  src={`${user.user_metadata.avatar_url}?t=${Date.now()}`}
                  alt="프로필 사진"
                  className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
            )}
            
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                안녕하세요! 👋
              </span>
              <span className="text-sm text-gray-600">
                {user.user_metadata?.full_name || 
                 user.user_metadata?.name || 
                 user.email?.split('@')[0] || 
                 '사용자'}님
              </span>
            </div>
          </div>
          
          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all duration-200",
              "bg-red-500 hover:bg-red-600 text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
              isLoading && "animate-pulse"
            )}
          >
            {loadingState === 'logging-out' ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                로그아웃 중...
              </span>
            ) : loadingState === 'refreshing' ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                새로고침 중...
              </span>
            ) : (
              '로그아웃'
            )}
          </button>
        </div>
      ) : (
        // 로그인되지 않은 상태
        <button
          onClick={handleKakaoLogin}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200",
            "bg-[#FEE500] hover:bg-[#FDD800] text-[#3C1E1E]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
            "shadow-md hover:shadow-lg",
            isLoading && "animate-pulse"
          )}
        >
          {loadingState === 'logging-in' ? (
            <>
              <div className="w-5 h-5 border-2 border-[#3C1E1E] border-t-transparent rounded-full animate-spin" />
              로그인 중...
            </>
          ) : (
            <>
              {/* 카카오 로고 */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.5 3 2 6.6 2 11.2c0 2.9 1.9 5.5 4.8 7l-1.2 4.4c-.1.4.4.7.7.4l5.4-3.6c.1 0 .2 0 .3 0 5.5 0 10-3.6 10-8.2C22 6.6 17.5 3 12 3z"/>
              </svg>
              카카오로 시작하기
            </>
          )}
        </button>
      )}
      
      {/* 재시도 카운터 (개발 모드에서만) */}
      {process.env.NODE_ENV === 'development' && retryCount > 0 && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
          재시도: {retryCount}/3
        </div>
      )}
    </header>
  )
})

AuthButton.displayName = 'AuthButton'

export default AuthButton

// 사용 예시:
// <AuthButton user={user} />
// <AuthButton user={user} variant="compact" showProfileImage={false} />
// <AuthButton user={user} variant="full" onAuthChange={(user) => console.log('Auth changed:', user)} /> 