'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { User, LogOut, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AuthModal from '@/components/auth/AuthModal'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login')
  const [mounted, setMounted] = useState(false)
  
  // 클라이언트에서만 렌더링되도록 보장
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // useAuth를 안전하게 사용
  let user: any = null
  let loading = false
  let signOut = async () => {}
  
  if (mounted) {
    try {
      const auth = useAuth()
      user = auth.user
      loading = auth.loading
      signOut = auth.signOut
    } catch (error) {
      console.log('AuthProvider not available')
    }
  }
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 왼쪽 영역: 로고와 네비게이션 */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-5">
              <Brain className="h-16 w-16 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">테토-에겐 분석기</span>
            </Link>
            <nav className="flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-2xl"
              >
                홈
              </Link>
              <Link 
                href="/analyze" 
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-2xl"
              >
                분석하기
              </Link>
            </nav>
          </div>

          {/* 오른쪽 영역: 인증 관련 */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-10 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3">
                  <User className="h-7 w-7 text-gray-600" />
                  <span className="text-lg font-medium text-gray-700">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={signOut}
                  className="flex items-center space-x-2 text-lg px-6 py-3 h-auto"
                >
                  <LogOut className="h-6 w-6" />
                  <span>로그아웃</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => {
                    setAuthModalTab('login')
                    setShowAuthModal(true)
                  }}
                  className="flex items-center space-x-2 text-lg px-6 py-3 h-auto"
                  size="lg"
                >
                  <User className="h-6 w-6" />
                  <span>로그인</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAuthModalTab('signup')
                    setShowAuthModal(true)
                  }}
                  className="flex items-center space-x-2 text-lg px-6 py-3 h-auto"
                  size="lg"
                >
                  <User className="h-6 w-6" />
                  <span>회원가입</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
        initialTab={authModalTab}
      />
    </header>
  )
} 