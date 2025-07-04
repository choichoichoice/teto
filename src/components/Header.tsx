'use client'

import Link from 'next/link'
import { useState } from 'react'
import { User, LogOut, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AuthModal from '@/components/auth/AuthModal'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login')
  const { user, signOut, refreshAuth } = useAuth()
  
  // 로그아웃 함수
  const handleSignOut = async () => {
    try {
      await signOut()
      alert('로그아웃되었습니다!')
    } catch (error) {
      console.error('로그아웃 오류:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    }
  }

  // 로그인 성공 시 호출되는 함수
  const handleAuthSuccess = async () => {
    try {
      console.log('Header: 인증 성공, AuthContext 새로고침')
      await refreshAuth()
      setShowAuthModal(false)
    } catch (error) {
      console.error('Header: AuthContext 새로고침 오류:', error)
      setShowAuthModal(false)
    }
  }

  return (
    <>
      <header className="border-b-2 border-gray-200 bg-white shadow-lg relative z-40">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* 왼쪽 영역: 로고와 네비게이션 */}
            <div className="flex items-center space-x-2 sm:space-x-6 relative z-50 flex-1 min-w-0">
              <Link 
                href="/" 
                className="flex items-center space-x-1 sm:space-x-2 hover:opacity-80 transition-opacity cursor-pointer touch-manipulation clickable shrink-0"
                style={{ minHeight: '40px', minWidth: 'auto' }}
                onClick={() => {
                  console.log('홈 링크 클릭됨')
                }}
              >
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 pointer-events-none" />
                <span className="text-sm sm:text-lg font-bold text-gray-900 pointer-events-none">테토-에겐</span>
              </Link>
              <nav className="flex items-center space-x-1 sm:space-x-4">
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all font-semibold text-xs sm:text-base px-2 sm:px-4 py-2 rounded-lg cursor-pointer touch-manipulation clickable block border-2 border-transparent hover:border-purple-200"
                  style={{ minHeight: '40px', minWidth: 'auto' }}
                  onClick={() => {
                    console.log('홈 네비 클릭됨')
                  }}
                >
                  홈
                </Link>
                <Link 
                  href="/analyze" 
                  className="text-white bg-purple-600 hover:bg-purple-700 transition-all font-semibold text-xs sm:text-base px-2 sm:px-4 py-2 rounded-lg cursor-pointer touch-manipulation clickable block border-2 border-purple-600 hover:border-purple-700 shadow-md"
                  style={{ minHeight: '40px', minWidth: 'auto' }}
                  onClick={() => {
                    console.log('분석하기 클릭됨')
                  }}
                >
                  분석하기
                </Link>
              </nav>
            </div>

            {/* 오른쪽 영역: 인증 관련 - 항상 바로 표시 */}
            <div className="flex items-center space-x-1 sm:space-x-3 relative z-50 shrink-0">
              {user ? (
                // 로그인된 사용자
                <div className="flex items-center space-x-1 sm:space-x-3">
                  <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 max-w-20 truncate">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('로그아웃 클릭됨')
                      handleSignOut()
                    }}
                    className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto cursor-pointer touch-manipulation clickable border-2 hover:border-red-300 hover:bg-red-50"
                    type="button"
                    style={{ minHeight: '40px', minWidth: 'auto' }}
                  >
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4 pointer-events-none" />
                    <span className="pointer-events-none font-semibold hidden sm:inline">로그아웃</span>
                  </Button>
                </div>
              ) : (
                // 로그인 안된 사용자 - 항상 바로 표시
                <div className="flex items-center space-x-1 sm:space-x-3">
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('로그인 버튼 클릭됨')
                      setAuthModalTab('login')
                      setShowAuthModal(true)
                    }}
                    className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto cursor-pointer touch-manipulation clickable bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 hover:border-blue-700 shadow-md"
                    size="sm"
                    type="button"
                    style={{ minHeight: '40px', minWidth: 'auto' }}
                  >
                    <User className="h-3 w-3 sm:h-4 sm:w-4 pointer-events-none" />
                    <span className="pointer-events-none font-semibold">로그인</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('회원가입 버튼 클릭됨')
                      setAuthModalTab('signup')
                      setShowAuthModal(true)
                    }}
                    className="hidden md:flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto cursor-pointer touch-manipulation clickable border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 shadow-md"
                    size="sm"
                    type="button"
                    style={{ minHeight: '40px', minWidth: 'auto' }}
                  >
                    <User className="h-3 w-3 sm:h-4 sm:w-4 pointer-events-none" />
                    <span className="pointer-events-none font-semibold">회원가입</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          initialTab={authModalTab}
        />
      </header>
      
                    {/* 헤더 하단 광고 배너 - CSS 무시 강제 표시 */}
        <div style={{ 
          width: '100vw',
          backgroundColor: '#ef4444',
          padding: '20px',
          display: 'block',
          position: 'relative',
          zIndex: 99999,
          margin: '0',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {/* 🔍 CSS 무시 모바일 강제 디버깅 */}
            <div style={{ 
              width: '100%',
              backgroundColor: '#fef08a',
              border: '4px solid #dc2626',
              padding: '16px',
              textAlign: 'center',
              display: 'block',
              minHeight: '100px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#991b1b',
              boxSizing: 'border-box'
            }}>
              <div style={{ marginBottom: '10px' }}>🚨 헤더 광고 영역 🚨</div>
              <ins 
                className="kakao_ad_area" 
                style={{ 
                  display: "block", 
                  minHeight: "50px", 
                  width: "100%",
                  maxWidth: "350px",
                  margin: "10px auto",
                  backgroundColor: "#ffffff",
                  border: "2px dashed #999999"
                }}
                data-ad-unit="DAN-eS5pNSPkANAP1JnD"
                data-ad-width="350"
                data-ad-height="50"
                data-ad-responsive="true"
                data-ad-mobile="true"
              ></ins>
              <div style={{ marginTop: '10px', fontSize: '14px' }}>
                이 빨간 영역이 보이면 CSS 정상!
              </div>
            </div>
          </div>
        </div>
    </>
  )
} 