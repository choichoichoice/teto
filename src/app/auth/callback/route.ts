import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    try {
      // 쿠키를 사용한 서버측 Supabase 클라이언트 생성
      const cookieStore = cookies()
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          flowType: 'pkce'
        }
      })
      
      // 인증 코드를 세션으로 교환
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('OAuth 콜백 오류:', error)
        // 오류 시 홈페이지로 리다이렉트하되 에러 파라미터 추가
        return NextResponse.redirect(`${requestUrl.origin}?auth_error=oauth_failed`)
      }
      
      console.log('OAuth 인증 성공')
    } catch (error) {
      console.error('OAuth 처리 중 예외 발생:', error)
      return NextResponse.redirect(`${requestUrl.origin}?auth_error=oauth_exception`)
    }
  }

  // 인증 후 사용자를 홈페이지로 리다이렉트
  return NextResponse.redirect(`${requestUrl.origin}?auth_success=true`)
} 