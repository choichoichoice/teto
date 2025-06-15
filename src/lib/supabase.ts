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
  
  signInWithPassword: async (credentials: { email: string; password: string }) => {
    // Mock 사용자 생성
    const mockUser = {
      id: 'mock-user-id',
      email: credentials.email,
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
        full_name: '테스트 사용자'
      },
      identities: [],
      factors: [],
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {}
    }
    
    const mockSession = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: mockUser
    }
    
    return {
      data: {
        user: mockUser,
        session: mockSession
      },
      error: null
    }
  },
  
  signUp: async (credentials: { email: string; password: string; options?: any }) => {
    // Mock 회원가입
    return mockAuth.signInWithPassword(credentials)
  },
  
  signOut: async () => {
    return { error: null }
  },
  
  getSession: async () => {
    return { data: { session: null }, error: null }
  }
} 