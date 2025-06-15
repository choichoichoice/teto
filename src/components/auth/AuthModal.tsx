'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Lock, User, Loader2, Eye, EyeOff, ArrowLeft, X } from 'lucide-react'
import AdBanner from '@/components/AdBanner'

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
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState(initialTab)

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
    setShowPassword(false)
    setShowConfirmPassword(false)
    setActiveTab(initialTab)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // 테스트 계정 체크
      if (email === 'test@teto.com' && password === 'test123') {
        localStorage.setItem('test_session', 'true')
        setSuccess('테스트 계정으로 로그인 성공!')
        setTimeout(() => {
          onSuccess?.()
          handleClose()
          // 페이지 새로고침으로 AuthContext 업데이트
          window.location.reload()
        }, 1000)
        setLoading(false)
        return
      }

      // 데모 환경에서는 Mock 로그인 사용
      if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co') {
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

        // Mock 성공 응답
        setSuccess('로그인 성공! (데모 모드)')
        setTimeout(() => {
          onSuccess?.()
          handleClose()
        }, 1000)
      } else {
        // 실제 Supabase 로그인
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setError(error.message)
        } else {
          setSuccess('로그인 성공!')
          setTimeout(() => {
            onSuccess?.()
            handleClose()
          }, 1000)
        }
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

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

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess('회원가입 성공! 확인 이메일을 확인해주세요.')
        setTimeout(() => {
          onSuccess?.()
          handleClose()
        }, 2000)
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log(`${provider} 로그인 시작...`)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('OAuth 오류:', error)
        setError(`${provider} 로그인 실패: ${error.message}`)
      } else {
        console.log('OAuth 성공:', data)
        setSuccess(`${provider} 로그인 처리 중...`)
      }
    } catch (err) {
      console.error('소셜 로그인 예외:', err)
      setError(`소셜 로그인 중 오류가 발생했습니다: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] p-0 max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          {/* 상단 광고 */}
          <div className="p-4 border-b">
            <AdBanner size="small" className="mx-auto" />
          </div>
          
          <CardHeader className="space-y-4 pb-8 relative">
            {/* 모바일 뒤로가기 버튼 */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 p-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm">뒤로가기</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* 데스크톱 닫기 버튼 */}
            <div className="hidden md:block absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <CardTitle className="text-3xl md:text-5xl font-bold text-center">환영합니다!</CardTitle>
            <CardDescription className="text-center text-gray-600 text-lg md:text-xl">
              계정에 로그인하거나 새 계정을 만드세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            {error && (
              <div className="relative w-full rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}
            {success && (
              <div className="relative w-full rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="text-sm text-green-800">{success}</div>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-16">
                <TabsTrigger value="login" className="text-xl font-medium">로그인</TabsTrigger>
                <TabsTrigger value="signup" className="text-xl font-medium">회원가입</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                {/* 테스트 계정 안내 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-800">
                    <div className="font-medium mb-2">🧪 테스트 계정</div>
                    <div className="space-y-1">
                      <div>이메일: <code className="bg-blue-100 px-2 py-1 rounded text-xs">test@teto.com</code></div>
                      <div>비밀번호: <code className="bg-blue-100 px-2 py-1 rounded text-xs">test123</code></div>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="email" className="text-xl font-medium">이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-5 h-6 w-6 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-14 h-16 text-xl"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="password" className="text-xl font-medium">비밀번호</Label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-5 h-6 w-6 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-14 pr-14 h-16 text-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-5 h-6 w-6 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-16 text-xl font-medium" disabled={loading}>
                    {loading && <Loader2 className="mr-3 h-6 w-6 animate-spin" />}
                    로그인
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6">
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="fullName" className="text-xl font-medium">이름</Label>
                    <div className="relative">
                      <User className="absolute left-5 top-5 h-6 w-6 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="홍길동"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-14 h-16 text-xl"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="signupEmail" className="text-xl font-medium">이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-5 h-6 w-6 text-gray-400" />
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-14 h-16 text-xl"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="signupPassword" className="text-xl font-medium">비밀번호</Label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-5 h-6 w-6 text-gray-400" />
                      <Input
                        id="signupPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="최소 6자 이상"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-14 pr-14 h-16 text-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-5 h-6 w-6 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="confirmPassword" className="text-xl font-medium">비밀번호 확인</Label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-5 h-6 w-6 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="비밀번호를 다시 입력하세요"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-14 pr-14 h-16 text-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-5 top-5 h-6 w-6 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-16 text-xl font-medium" disabled={loading}>
                    {loading && <Loader2 className="mr-3 h-6 w-6 animate-spin" />}
                    회원가입
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full h-16 text-xl font-medium flex items-center justify-center space-x-4"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24">
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
              <span>Google로 로그인</span>
            </Button>
          </CardContent>
          
          {/* 하단 광고 */}
          <div className="p-4 border-t bg-gray-50">
            <AdBanner size="medium" className="mx-auto" />
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  )
}