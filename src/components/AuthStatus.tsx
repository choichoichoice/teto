'use client'

import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, User } from 'lucide-react'

export default function AuthStatus() {
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    // URL 파라미터에서 인증 결과 확인
    const authSuccess = searchParams.get('auth_success')
    const authError = searchParams.get('auth_error')

    if (authSuccess === 'true') {
      setAuthMessage({
        type: 'success',
        message: 'OAuth 인증이 성공적으로 완료되었습니다!'
      })
      
      // 3초 후 메시지 제거
      setTimeout(() => setAuthMessage(null), 3000)
    } else if (authError) {
      let errorMessage = 'OAuth 인증 중 오류가 발생했습니다.'
      
      switch (authError) {
        case 'oauth_failed':
          errorMessage = 'OAuth 인증에 실패했습니다. 다시 시도해주세요.'
          break
        case 'oauth_exception':
          errorMessage = 'OAuth 처리 중 예외가 발생했습니다.'
          break
      }
      
      setAuthMessage({
        type: 'error',
        message: errorMessage
      })
      
      // 5초 후 메시지 제거
      setTimeout(() => setAuthMessage(null), 5000)
    }
  }, [searchParams])

  if (loading) {
    return null // 로딩 중에는 아무것도 표시하지 않음
  }

  return (
    <>
      {/* OAuth 인증 결과 메시지 */}
      {authMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert className={`${
            authMessage.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
          } shadow-lg`}>
            {authMessage.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={`${
              authMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {authMessage.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* 로그인된 사용자 정보 표시 (개발 모드에서만) */}
      {user && process.env.NODE_ENV === 'development' && (
        <div className="container mx-auto px-4 py-4">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>로그인된 사용자 정보</span>
              </CardTitle>
              <CardDescription>현재 로그인된 사용자의 정보입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>이메일:</strong> {user.email}
                </div>
                <div>
                  <strong>이름:</strong> {user.user_metadata?.full_name || '설정되지 않음'}
                </div>
                <div>
                  <strong>가입일:</strong> {new Date(user.created_at).toLocaleDateString('ko-KR')}
                </div>
                <div>
                  <strong>인증 방법:</strong> {
                    user.app_metadata?.provider || 
                    (user.email?.includes('gmail.com') ? 'Google' : 
                     user.email?.includes('kakao.com') ? 'Kakao' : 'Email')
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
} 