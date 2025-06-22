'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Lock, User, Loader2, Eye, EyeOff, X, ArrowLeft } from 'lucide-react'
import { supabase, isSupabaseConfigured, mockAuth } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  initialTab?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialTab = 'login' }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [kakaoLoading, setKakaoLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [showTabSelect, setShowTabSelect] = useState(true)

  // AuthContext에서 refreshAuth 함수 가져오기
  const { refreshAuth } = useAuth()

  // 초기 탭 변경 시 업데이트
  useEffect(() => {
    setActiveTab(initialTab)
    setShowTabSelect(true)
  }, [initialTab])

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
    setShowPassword(false)
    setShowConfirmPassword(false)
    setShowTabSelect(true)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleBackToTabSelect = () => {
    setShowTabSelect(true)
    setError('')
    setSuccess('')
  }

  const handleTabSelect = (tab: 'login' | 'signup') => {
    setActiveTab(tab)
    setShowTabSelect(false)
    setError('')
    setSuccess('')
  }

  const handleAuthSuccess = async () => {
    try {
      console.log('🎉 인증 성공, AuthContext 새로고침')
      
      // 강제로 브라우저 캐시 무효화
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-state-changed'))
      }
      
      await refreshAuth()
      
      setTimeout(() => {
        onSuccess?.()
        handleClose()
      }, 800) // 조금 더 긴 지연
    } catch (error) {
      console.error('❌ AuthContext 새로고침 오류:', error)
      // 에러가 발생해도 성공 처리
      setTimeout(() => {
        onSuccess?.()
        handleClose()
      }, 800)
    }
  }

  const handleKakaoLogin = async () => {
    setKakaoLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isSupabaseConfigured()) {
        // 실제 카카오 로그인
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'kakao',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) {
          throw error
        }
        
        // OAuth는 리다이렉트되므로 성공 메시지는 콜백에서 처리
      } else {
        // Mock 카카오 로그인
        console.log('🧪 Mock 카카오 로그인 시도')
        
        // 2초 로딩 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const result = await mockAuth.signInWithOAuth({ 
          provider: 'kakao' 
        })
        
        if (result.error) {
          throw result.error
        }
        
        setSuccess('카카오 로그인 성공! (개발 모드) 🎉')
        
        // 강제로 브라우저 캐시 무효화
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-state-changed'))
          
          // 여러 방법으로 상태 변경 알림
          setTimeout(() => {
            window.dispatchEvent(new Event('focus'))
            window.dispatchEvent(new Event('resize'))
            window.dispatchEvent(new StorageEvent('storage', {
              key: 'mock_auth_user',
              newValue: JSON.stringify(result.data.user),
              storageArea: localStorage
            }))
          }, 100)
        }
        
        setTimeout(() => {
          handleAuthSuccess()
        }, 1500) // 조금 더 긴 지연
      }
    } catch (err: any) {
      console.error('카카오 로그인 오류:', err)
      setError(err.message || '카카오 로그인 중 오류가 발생했습니다.')
    } finally {
      setKakaoLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isSupabaseConfigured()) {
        // 실제 구글 로그인
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) {
          throw error
        }
        
        // OAuth는 리다이렉트되므로 성공 메시지는 콜백에서 처리
      } else {
        // Mock 구글 로그인
        console.log('Mock 구글 로그인 시도')
        
        // 2초 로딩 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const result = await mockAuth.signInWithOAuth({ 
          provider: 'google' 
        })
        
        if (result.error) {
          throw result.error
        }
        
        setSuccess('구글 로그인 성공! (개발 모드)')
        
        setTimeout(() => {
          handleAuthSuccess()
        }, 1000)
      }
    } catch (err: any) {
      console.error('구글 로그인 오류:', err)
      setError(err.message || '구글 로그인 중 오류가 발생했습니다.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // 간단한 유효성 검사
      if (!email || !password) {
        setError('이메일과 비밀번호를 입력해주세요.')
        setLoading(false)
        return
      }
      
      if (password.length < 6) {
        setError('비밀번호는 최소 6자 이상이어야 합니다.')
        setLoading(false)
        return
      }

      let result
      
      if (isSupabaseConfigured()) {
        // 실제 Supabase 인증
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (result.error) {
          throw result.error
        }
        
        setSuccess('로그인 성공!')
      } else {
        // Mock 인증 (개발 환경)
        console.log('Mock 로그인 시도:', { email })
        result = await mockAuth.signInWithPassword({ email, password })
        
        if (result.error) {
          throw result.error
        }
        
        setSuccess('로그인 성공! (개발 모드)')
      }
      
      setTimeout(() => {
        handleAuthSuccess()
      }, 1000)
      
    } catch (err: any) {
      console.error('로그인 오류:', err)
      setError(err.message || '로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // 유효성 검사
      if (!email || !password || !fullName) {
        setError('모든 필드를 입력해주세요.')
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError('비밀번호는 최소 6자 이상이어야 합니다.')
        setLoading(false)
        return
      }

      let result
      
      if (isSupabaseConfigured()) {
        // 실제 Supabase 회원가입
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        })
        
        if (result.error) {
          throw result.error
        }
        
        if (result.data?.user && !result.data.session) {
          setSuccess('회원가입 완료! 이메일을 확인하여 계정을 활성화해주세요.')
        } else {
          setSuccess('회원가입 및 로그인 완료!')
        }
      } else {
        // Mock 회원가입 (개발 환경)
        console.log('Mock 회원가입 시도:', { email, fullName })
        result = await mockAuth.signUp({ 
          email, 
          password, 
          options: { data: { full_name: fullName } }
        })
        
        if (result.error) {
          throw result.error
        }
        
        setSuccess('회원가입 완료! (개발 모드)')
      }
      
      setTimeout(() => {
        handleAuthSuccess()
      }, 2000)
      
    } catch (err: any) {
      console.error('회원가입 오류:', err)
      setError(err.message || '회원가입 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <Card className="border-0 shadow-none">
          <CardHeader className="space-y-4 pb-6 relative">
            {/* 상단 버튼들 */}
            <div className="flex items-center justify-between">
              {/* 뒤로가기 버튼 (탭 선택 화면이 아닐 때만 표시) */}
              {!showTabSelect && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToTabSelect}
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              
              {/* 빈 공간 (뒤로가기 버튼이 없을 때 중앙 정렬을 위함) */}
              {showTabSelect && <div></div>}
              
              {/* 닫기 버튼 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                테토-에겐 분석기
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                로그인하고 테토-에겐 성향 분석을 시작해 보세요
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="px-6 pb-6">
            {showTabSelect ? (
              // 탭 선택 화면
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">로그인 방법을 선택하세요</h3>
                </div>
                
                {/* 카카오 로그인 버튼 */}
                <Button
                  onClick={handleKakaoLogin}
                  disabled={kakaoLoading}
                  className="w-full flex items-center justify-center space-x-3 bg-yellow-400 hover:bg-yellow-500 text-black py-3 h-auto border-0"
                >
                  {kakaoLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.013-.472-.529l1.324-3.917C2.646 16.078 1.5 14.23 1.5 12.185 1.5 6.665 6.201 3 12 3z"/>
                    </svg>
                  )}
                  <span className="font-medium">
                    {kakaoLoading ? '카카오 로그인 중...' : '카카오로 로그인'}
                  </span>
                </Button>
                
                {/* 구글 로그인 버튼 */}
                <Button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 py-3 h-auto"
                  variant="outline"
                >
                  {googleLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  <span className="font-medium">
                    {googleLoading ? '구글 로그인 중...' : '구글로 로그인'}
                  </span>
                </Button>
                
                {/* 구분선 */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">또는</span>
                  </div>
                </div>
                
                {/* 이메일 로그인/회원가입 버튼들 */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleTabSelect('login')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-auto"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    이메일로 로그인
                  </Button>
                  
                  <Button
                    onClick={() => handleTabSelect('signup')}
                    variant="outline"
                    className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 py-3 h-auto"
                  >
                    <User className="h-5 w-5 mr-2" />
                    새 계정 만들기
                  </Button>
                </div>
                
                {/* 에러 및 성공 메시지 */}
                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mt-4">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md mt-4">
                    {success}
                  </div>
                )}
              </div>
            ) : (
              // 로그인/회원가입 폼
              <>
                {activeTab === 'login' ? (
                  // 로그인 폼
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">이메일로 로그인</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-email">이메일</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="이메일을 입력하세요"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password">비밀번호</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="비밀번호를 입력하세요"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                        {error}
                      </div>
                    )}
                    
                    {success && (
                      <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
                        {success}
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          로그인 중...
                        </>
                      ) : (
                        '로그인'
                      )}
                    </Button>
                  </form>
                ) : (
                  // 회원가입 폼
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">새 계정 만들기</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">이름</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="이름을 입력하세요"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">이메일</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="이메일을 입력하세요"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">비밀번호</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="비밀번호를 입력하세요 (최소 6자)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">비밀번호 확인</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="비밀번호를 다시 입력하세요"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                        {error}
                      </div>
                    )}
                    
                    {success && (
                      <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
                        {success}
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          가입 중...
                        </>
                      ) : (
                        '회원가입'
                      )}
                    </Button>
                  </form>
                )}
              </>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                {isSupabaseConfigured() ? 
                  '실제 계정이 생성됩니다. 이메일 인증이 필요할 수 있습니다.' :
                  '현재 개발 모드로 실행 중입니다. 실제 계정이 생성되지 않습니다.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}