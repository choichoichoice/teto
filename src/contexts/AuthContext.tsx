'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured, mockAuth } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  signOut: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUserId, setLastUserId] = useState<string | null>(null)

  // 브라우저 완전 새로고침 (최후의 수단)
  const forcePageRefresh = useCallback(() => {
    console.log('🔄 강제 페이지 새로고침 실행!')
    if (typeof window !== 'undefined') {
      // 캐시 무력화를 위한 URL 파라미터 추가
      const timestamp = Date.now()
      const url = new URL(window.location.href)
      url.searchParams.set('_refresh', timestamp.toString())
      
      setTimeout(() => {
        window.location.href = url.toString()
      }, 100)
    }
  }, [])

  // 인증 상태를 새로고침하는 함수 (더욱 강화된 버전)
  const refreshAuth = useCallback(async () => {
    try {
      console.log('🔄 AuthContext 새로고침 시작')
      
      if (isSupabaseConfigured()) {
        // 실제 Supabase 인증
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.warn('❌ Supabase 세션 가져오기 실패:', error.message)
          setError(error.message)
        } else {
          const newUserId = session?.user?.id || null
          const currentUserId = user?.id || null
          
          // 사용자가 바뀐 경우 강제 새로고침
          if (newUserId && currentUserId && newUserId !== currentUserId) {
            console.log('🔄 사용자 변경 감지, 강제 새로고침!')
            forcePageRefresh()
            return
          }
          
          setSession(session)
          setUser(session?.user ?? null)
          setError(null)
          console.log('✅ Supabase 세션 업데이트:', session?.user?.email || 'null')
        }
      } else {
        // Mock 인증 - 강화된 로직
        console.log('🧪 Mock 세션 확인 중...')
        const result = await mockAuth.getSession()
        
        if (result.data.session) {
          const newUser = result.data.session.user
          const currentEmail = user?.email
          const newEmail = newUser.email
          const newUserId = newUser.id
          
          console.log(`🔍 사용자 변경 확인: ${currentEmail} → ${newEmail}`)
          
          // 사용자가 변경되었거나 새로 로그인한 경우
          if (currentEmail !== newEmail) {
            console.log(`🔄 Mock 사용자 변경: ${currentEmail} → ${newEmail}`)
            
            // 이전 사용자 ID 기록
            if (user?.id && user.id !== newUserId) {
              setLastUserId(user.id)
            }
            
            setSession(result.data.session)
            setUser(newUser)
            
            // 강제로 브라우저 캐시 무효화
            if (typeof window !== 'undefined') {
              // 여러 방법으로 캐시 무력화
              window.dispatchEvent(new Event('auth-state-changed'))
              window.dispatchEvent(new StorageEvent('storage', {
                key: mockAuth.STORAGE_KEY,
                newValue: JSON.stringify(newUser),
                storageArea: localStorage
              }))
              
              // DOM 강제 업데이트
              setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
              }, 50)
              
              // 극단적인 경우 페이지 새로고침
              setTimeout(() => {
                const timeSinceChange = Date.now() - parseInt(localStorage.getItem('auth_change_time') || '0')
                if (timeSinceChange > 5000) { // 5초 후에도 업데이트 안 되면
                  console.log('🚨 긴급 새로고침 실행!')
                  forcePageRefresh()
                }
              }, 5000)
              
              localStorage.setItem('auth_change_time', Date.now().toString())
            }
          }
        } else {
          // 로그아웃된 경우
          if (user) {
            console.log('🚪 Mock 로그아웃 감지')
            setLastUserId(user.id)
            setSession(null)
            setUser(null)
            
            // 로그아웃 시에도 강제 캐시 무력화
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('auth-state-changed'))
              localStorage.removeItem('auth_change_time')
            }
          }
        }
        setError(null)
      }
    } catch (err) {
      console.warn('❌ 인증 상태 새로고침 오류:', err)
      setError('인증 시스템 오류가 발생했습니다.')
    }
  }, [user, forcePageRefresh])

  useEffect(() => {
    const initAuth = async () => {
      console.log('🚀 Auth 초기화 시작')
      setLoading(true)
      
      try {
        if (isSupabaseConfigured()) {
          // 실제 Supabase 인증
          console.log('🔐 Supabase 인증 초기화')
          
          // 현재 세션 가져오기
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) {
            console.warn('❌ Supabase 세션 가져오기 실패:', error.message)
            setError(error.message)
          } else {
            setSession(session)
            setUser(session?.user ?? null)
            setError(null)
            console.log('✅ Supabase 세션 로드:', session?.user?.email || 'null')
          }
          
          // 인증 상태 변경 감지
          const { data } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              console.log('🔔 Supabase Auth 상태 변경:', event)
              setSession(session)
              setUser(session?.user ?? null)
              setError(null)
            }
          )
          
          return () => {
            data.subscription.unsubscribe()
          }
        } else {
          // Mock 인증
          console.log('🧪 Mock 인증 초기화')
          
          const result = await mockAuth.getSession()
          if (result.data.session) {
            setSession(result.data.session)
            setUser(result.data.session.user)
            console.log('✅ Mock 세션 복원됨:', result.data.session.user.email)
          } else {
            setSession(null)
            setUser(null)
            console.log('❌ Mock 세션 없음')
          }
          setError(null)
        }
      } catch (err) {
        console.warn('❌ 인증 초기화 오류:', err)
        setError('인증 시스템을 초기화할 수 없습니다.')
      } finally {
        setLoading(false)
        console.log('✅ Auth 초기화 완료')
      }
    }

    let cleanup: (() => void) | undefined

    initAuth().then((cleanupFn) => {
      cleanup = cleanupFn
    })
    
    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [])

  // Mock 모드에서 localStorage 변경사항 실시간 감지 (극강화된 버전)
  useEffect(() => {
    if (!isSupabaseConfigured() && !loading) {
      console.log('👂 초강력 localStorage 변경 감지 시작')
      
      // localStorage 변경 이벤트 리스너 (개선된 버전)
      const handleStorageChange = async (e: StorageEvent) => {
        if (e.key === mockAuth.STORAGE_KEY) {
          console.log('🔔 localStorage 변경 감지:', e.newValue ? '로그인' : '로그아웃')
          
          // 즉시 상태 새로고침
          await refreshAuth()
          
          // 추가 지연 후 한 번 더 확인
          setTimeout(async () => {
            await refreshAuth()
          }, 500)
        }
      }
      
      // 커스텀 이벤트 리스너들
      const handleAuthStateChanged = async () => {
        console.log('🔔 커스텀 인증 상태 변경 이벤트')
        await refreshAuth()
      }
      
      // Focus 이벤트에서도 상태 확인 (탭 전환 시)
      const handleFocus = async () => {
        console.log('👁️ 포커스 이벤트 - 상태 확인')
        await refreshAuth()
      }
      
      // 주기적 상태 확인 (더 자주, 더 철저하게)
      const checkMockAuth = async () => {
        const result = await mockAuth.getSession()
        const hasSession = !!result.data.session
        const currentHasSession = !!session
        const sessionUserId = result.data.session?.user?.id
        const currentUserId = user?.id
        
        // 세션 존재 여부가 다르거나 사용자 ID가 다른 경우
        if (hasSession !== currentHasSession || (sessionUserId && sessionUserId !== currentUserId)) {
          console.log('⏰ 주기적 확인에서 Mock 상태 변경 감지')
          console.log(`   세션: ${currentHasSession} → ${hasSession}`)
          console.log(`   사용자: ${currentUserId} → ${sessionUserId}`)
          await refreshAuth()
        }
      }

      // 이벤트 리스너 등록
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('auth-state-changed', handleAuthStateChanged)
      window.addEventListener('focus', handleFocus)
      window.addEventListener('visibilitychange', handleFocus)
      
      // 1.5초마다 확인 (더 자주)
      const interval = setInterval(checkMockAuth, 1500)
      
      // 초기 체크도 한 번 더
      setTimeout(checkMockAuth, 100)
      
      return () => {
        console.log('🔇 초강력 localStorage 감지 종료')
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('auth-state-changed', handleAuthStateChanged)
        window.removeEventListener('focus', handleFocus)
        window.removeEventListener('visibilitychange', handleFocus)
        clearInterval(interval)
      }
    }
  }, [loading, session, user, refreshAuth])

  const signOut = async () => {
    try {
      console.log('🚪 로그아웃 시도')
      setLoading(true)
      
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut()
        console.log('✅ Supabase 로그아웃 완료')
      } else {
        await mockAuth.signOut()
        setUser(null)
        setSession(null)
        console.log('✅ Mock 로그아웃 완료')
        
        // 강제로 상태 변경 이벤트 발생
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-state-changed'))
          localStorage.removeItem('auth_change_time')
          
          // 로그아웃 후 1초 뒤 페이지 새로고침 (선택적)
          setTimeout(() => {
            if (window.location.pathname === '/analyze') {
              forcePageRefresh()
            }
          }, 1000)
        }
      }
      
      setError(null)
    } catch (err) {
      console.warn('❌ 로그아웃 오류:', err)
      // 에러가 발생해도 로컬 상태는 초기화
      setUser(null)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    error,
    signOut,
    refreshAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 