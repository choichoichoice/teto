import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

// Supabase가 설정되지 않았을 때도 앱이 작동하도록 함
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Supabase 연결 상태 확인
export const isSupabaseConfigured = (): boolean => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://demo.supabase.co')
}

// 개발 환경에서 사용할 Mock 인증
export const mockAuth = {
  isEnabled: !isSupabaseConfigured(),
  
  // 로컬 스토리지 키
  STORAGE_KEY: 'mock_auth_user',
  
  // Mock 사용자 생성
  createMockUser: (email: string, fullName?: string) => ({
    id: `mock-user-${Date.now()}`,
    email: email,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    phone_confirmed_at: null,
    confirmation_sent_at: null,
    recovery_sent_at: null,
    email_change_sent_at: null,
    new_email: null,
    new_phone: null,
    invited_at: null,
    action_link: null,
    user_metadata: {
      full_name: fullName || email.split('@')[0],
      avatar_url: fullName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff` : null
    },
    identities: [],
    factors: [],
    aud: 'authenticated',
    role: 'authenticated',
    app_metadata: {}
  }),
  
  // Mock 세션 생성
  createMockSession: (user: any) => ({
    access_token: `mock-access-token-${Date.now()}`,
    refresh_token: `mock-refresh-token-${Date.now()}`,
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: user
  }),
  
  // 저장된 사용자 가져오기
  getStoredUser: () => {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem(mockAuth.STORAGE_KEY)
      if (stored) {
        const user = JSON.parse(stored)
        console.log('Mock 사용자 로드됨:', user.email)
        return user
      }
      console.log('저장된 Mock 사용자 없음')
      return null
    } catch (error) {
      console.warn('Mock 사용자 로드 실패:', error)
      return null
    }
  },
  
  // 사용자 저장
  storeUser: (user: any) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(mockAuth.STORAGE_KEY, JSON.stringify(user))
      console.log('Mock 사용자 저장됨:', user.email)
      
      // localStorage 변경 이벤트 직접 발생
      window.dispatchEvent(new StorageEvent('storage', {
        key: mockAuth.STORAGE_KEY,
        newValue: JSON.stringify(user),
        storageArea: localStorage
      }))
    } catch (error) {
      console.warn('Mock 사용자 저장 실패:', error)
    }
  },
  
  // 사용자 삭제
  removeUser: () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(mockAuth.STORAGE_KEY)
      console.log('Mock 사용자 삭제됨')
      
      // localStorage 변경 이벤트 직접 발생
      window.dispatchEvent(new StorageEvent('storage', {
        key: mockAuth.STORAGE_KEY,
        newValue: null,
        storageArea: localStorage
      }))
    } catch (error) {
      console.warn('Mock 사용자 삭제 실패:', error)
    }
  },
  
  signInWithPassword: async (credentials: { email: string; password: string }) => {
    console.log('Mock 로그인 시작:', credentials.email)
    
    // 간단한 유효성 검사
    if (!credentials.email || !credentials.password) {
      return {
        data: { user: null, session: null },
        error: { message: '이메일과 비밀번호를 입력해주세요.' }
      }
    }
    
    if (credentials.password.length < 6) {
      return {
        data: { user: null, session: null },
        error: { message: '비밀번호는 최소 6자 이상이어야 합니다.' }
      }
    }
    
    // Mock 로그인 처리
    const mockUser = mockAuth.createMockUser(credentials.email)
    const mockSession = mockAuth.createMockSession(mockUser)
    
    // 로컬 스토리지에 저장
    mockAuth.storeUser(mockUser)
    
    console.log('Mock 로그인 완료:', mockUser.email)
    
    return {
      data: {
        user: mockUser,
        session: mockSession
      },
      error: null
    }
  },
  
  signInWithOAuth: async (options: { provider: string; options?: any }) => {
    console.log('Mock OAuth 로그인 시작:', options.provider)
    
    // Mock OAuth 로그인 (구글, 카카오 등)
    if (options.provider === 'google') {
      // Google Mock 사용자 생성
      const mockUser = mockAuth.createMockUser('user@gmail.com', 'Google 사용자')
      const mockSession = mockAuth.createMockSession(mockUser)
      
      // 로컬 스토리지에 저장
      mockAuth.storeUser(mockUser)
      
      console.log('Mock Google 로그인 완료')
      
      return {
        data: {
          user: mockUser,
          session: mockSession,
          url: null // Mock에서는 리다이렉트하지 않음
        },
        error: null
      }
    }
    
    if (options.provider === 'kakao') {
      // Kakao Mock 사용자 생성
      const mockUser = mockAuth.createMockUser('user@kakao.com', '카카오 사용자')
      const mockSession = mockAuth.createMockSession(mockUser)
      
      // 로컬 스토리지에 저장
      mockAuth.storeUser(mockUser)
      
      console.log('Mock Kakao 로그인 완료')
      
      return {
        data: {
          user: mockUser,
          session: mockSession,
          url: null // Mock에서는 리다이렉트하지 않음
        },
        error: null
      }
    }
    
    return {
      data: { user: null, session: null, url: null },
      error: { message: '지원하지 않는 OAuth 제공자입니다.' }
    }
  },
  
  signUp: async (credentials: { email: string; password: string; options?: any }) => {
    console.log('Mock 회원가입 시작:', credentials.email)
    
    // 간단한 유효성 검사
    if (!credentials.email || !credentials.password) {
      return {
        data: { user: null, session: null },
        error: { message: '이메일과 비밀번호를 입력해주세요.' }
      }
    }
    
    if (credentials.password.length < 6) {
      return {
        data: { user: null, session: null },
        error: { message: '비밀번호는 최소 6자 이상이어야 합니다.' }
      }
    }
    
    // Mock 회원가입 처리
    const fullName = credentials.options?.data?.full_name
    const mockUser = mockAuth.createMockUser(credentials.email, fullName)
    const mockSession = mockAuth.createMockSession(mockUser)
    
    // 로컬 스토리지에 저장
    mockAuth.storeUser(mockUser)
    
    console.log('Mock 회원가입 완료:', mockUser.email)
    
    return {
      data: {
        user: mockUser,
        session: mockSession
      },
      error: null
    }
  },
  
  signOut: async () => {
    console.log('Mock 로그아웃 시작')
    mockAuth.removeUser()
    console.log('Mock 로그아웃 완료')
    return { error: null }
  },
  
  getSession: async () => {
    console.log('🔍 Mock 세션 확인 중...')
    const user = mockAuth.getStoredUser()
    if (user) {
      const session = mockAuth.createMockSession(user)
      console.log('✅ Mock 세션 반환:', user.email)
      return { 
        data: { session }, 
        error: null 
      }
    }
    console.log('❌ Mock 세션 없음')
    return { 
      data: { session: null }, 
      error: null 
    }
  }
} 