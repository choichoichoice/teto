'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Camera, Loader2, Share2, RefreshCw, TrendingUp, ImagePlus } from 'lucide-react'
import { AnalysisResult, DevelopmentTip } from '@/types'
import Image from 'next/image'
import ParticlesBg from "@/components/ParticlesBg"
import AdBanner from "@/components/AdBanner"

import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/auth/AuthModal'

export default function AnalyzePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [developmentTips, setDevelopmentTips] = useState<DevelopmentTip | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user } = useAuth()

  // 사용자별 localStorage 키 생성 (보안 강화)
  const getUserStorageKey = (key: string, userId?: string) => {
    const targetUserId = userId || user?.id || 'anonymous'
    return `${key}_user_${targetUserId}`
  }

  // 현재 사용자가 아닌 다른 사용자들의 민감한 데이터만 정리 (보안 강화)
  const clearOtherUsersData = (currentUserId: string) => {
    console.log('🔐 다른 사용자들의 데이터 보안 정리 중...')
    
    const keysToCheck = [
      'tetoAnalysisResult',
      'tetoDevelopmentTips', 
      'tetoImagePreview'
    ]
    
    // localStorage의 모든 키를 확인
    const allKeys = Object.keys(localStorage)
    
    allKeys.forEach(key => {
      keysToCheck.forEach(baseKey => {
        // 현재 사용자 키 패턴과 일치하는지 확인
        if (key.startsWith(`${baseKey}_user_`) && !key.includes(`_user_${currentUserId}`)) {
          console.log(`🗑️ 다른 사용자 데이터 제거: ${key}`)
          localStorage.removeItem(key)
        }
      })
    })
    
    console.log('✅ 다른 사용자 데이터 정리 완료')
  }

  // 완전한 데이터 초기화 (로그아웃 시 사용)
  const clearAllUserData = () => {
    console.log('🧹 모든 사용자 데이터 완전 삭제 (로그아웃)')
    
    const keysToRemove = [
      'tetoAnalysisResult',
      'tetoDevelopmentTips', 
      'tetoImagePreview'
    ]
    
    Object.keys(localStorage).forEach(key => {
      keysToRemove.forEach(baseKey => {
        if (key.startsWith(`${baseKey}_user_`)) {
          console.log(`🗑️ 완전 제거: ${key}`)
          localStorage.removeItem(key)
        }
      })
    })
  }

  // 사용자가 변경될 때 데이터 보안 격리 및 복원
  useEffect(() => {
    const newUserId = user?.id || null
    
    // 사용자가 변경된 경우
    if (currentUserId !== newUserId) {
      console.log(`👤 사용자 변경: ${currentUserId} → ${newUserId}`)
      
      // 현재 UI 상태 즉시 초기화 (보안을 위해)
      setAnalysisResult(null)
      setDevelopmentTips(null)
      setImagePreview(null)
      setSelectedImage(null)
      
      if (newUserId) {
        // 새로운 사용자가 로그인한 경우
        console.log(`🔐 사용자 ${newUserId} 로그인 - 보안 격리 시작`)
        
        // 다른 사용자들의 데이터만 정리 (자신의 데이터는 보존)
        clearOtherUsersData(newUserId)
        
        setCurrentUserId(newUserId)
        
        // 현재 사용자의 데이터 복원 시도
        setTimeout(() => {
          console.log(`📱 사용자 ${newUserId}의 개인 데이터 복원 시도`)
          
          const savedResult = localStorage.getItem(getUserStorageKey('tetoAnalysisResult', newUserId))
          const savedTips = localStorage.getItem(getUserStorageKey('tetoDevelopmentTips', newUserId))
          const savedImagePreview = localStorage.getItem(getUserStorageKey('tetoImagePreview', newUserId))

          if (savedResult) {
            try {
              console.log('✅ 개인 분석 결과 복원')
              setAnalysisResult(JSON.parse(savedResult))
            } catch (error) {
              console.error('❌ 분석 결과 복원 실패:', error)
              localStorage.removeItem(getUserStorageKey('tetoAnalysisResult', newUserId))
            }
          }

          if (savedTips) {
            try {
              console.log('✅ 개인 발전 팁 복원')
              setDevelopmentTips(JSON.parse(savedTips))
            } catch (error) {
              console.error('❌ 발전 팁 복원 실패:', error)
              localStorage.removeItem(getUserStorageKey('tetoDevelopmentTips', newUserId))
            }
          }

          if (savedImagePreview) {
            console.log('✅ 개인 이미지 미리보기 복원')
            setImagePreview(savedImagePreview)
          }
          
          console.log('✅ 개인 데이터 복원 완료')
        }, 100)
      } else {
        // 로그아웃된 경우 - 완전한 데이터 정리
        console.log('🚪 로그아웃 감지 - 모든 데이터 정리')
        clearAllUserData()
        setCurrentUserId(null)
      }
    }
  }, [user?.id, currentUserId])

  // 분석 결과가 변경될 때마다 현재 사용자의 localStorage에만 저장
  useEffect(() => {
    if (analysisResult && user?.id) {
      const key = getUserStorageKey('tetoAnalysisResult')
      localStorage.setItem(key, JSON.stringify(analysisResult))
      console.log(`💾 개인 분석 결과 저장: ${key}`)
    }
  }, [analysisResult, user?.id])

  // 발전 팁이 변경될 때마다 현재 사용자의 localStorage에만 저장
  useEffect(() => {
    if (developmentTips && user?.id) {
      const key = getUserStorageKey('tetoDevelopmentTips')
      localStorage.setItem(key, JSON.stringify(developmentTips))
      console.log(`💾 개인 발전 팁 저장: ${key}`)
    }
  }, [developmentTips, user?.id])

  // 이미지 미리보기가 변경될 때마다 현재 사용자의 localStorage에만 저장
  useEffect(() => {
    if (imagePreview && user?.id) {
      const key = getUserStorageKey('tetoImagePreview')
      localStorage.setItem(key, imagePreview)
      console.log(`💾 개인 이미지 미리보기 저장: ${key}`)
    }
  }, [imagePreview, user?.id])

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      
      if (!file) {
        return
      }
      
      // 파일 크기 체크 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다.')
        return
      }
      
      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.')
        return
      }
      setSelectedImage(file)
      
      const reader = new FileReader()
      
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string)
        }
      }
      
      reader.onerror = (error) => {
        console.error('파일 읽기 오류:', error)
        alert('파일을 읽는 중 오류가 발생했습니다.')
      }
      
      reader.readAsDataURL(file)
      setAnalysisResult(null)
      setDevelopmentTips(null)
      
      // 입력 필드 초기화 (같은 파일 재선택 가능하도록)
      event.target.value = ''
    } catch (error) {
      console.error('파일 선택 중 심각한 오류:', error)
      alert('파일 선택 중 오류가 발생했습니다.')
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    // 로그인 체크
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('분석에 실패했습니다.')
      }

      const result = await response.json()
      setAnalysisResult(result)

      // 호르몬 강화 팁도 함께 가져오기
      const tipsResponse = await fetch('/api/tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: result.type }),
      })

      if (tipsResponse.ok) {
        const tips = await tipsResponse.json()
        setDevelopmentTips(tips)
      }
    } catch (error) {
      console.error('분석 중 상세 에러:', error)
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setAnalysisResult(null)
    setDevelopmentTips(null)
    
    // 현재 사용자의 localStorage에서만 제거
    if (user?.id) {
      localStorage.removeItem(getUserStorageKey('tetoAnalysisResult'))
      localStorage.removeItem(getUserStorageKey('tetoDevelopmentTips'))
      localStorage.removeItem(getUserStorageKey('tetoImagePreview'))
      console.log('🗑️ 개인 데이터 초기화 완료')
    }
  }

  const handleShare = async () => {
    if (!analysisResult) return

    try {
      // 1단계: 데이터베이스 공유 시도 (Supabase가 설정된 경우)
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisResult,
          imagePreview,
          developmentTips,
          userId: user?.id || null, // userId 없어도 허용
        }),
      })

      let shareUrl
      let shareTitle = `내 테토-에겐 분석 결과: ${analysisResult.type}`
      let shareText = `AI가 분석한 내 테토-에겐 유형은 ${analysisResult.type}! 당신도 분석해보세요!`
      
      if (response.ok) {
        // Supabase 공유 성공
        const { shareId } = await response.json()
        shareUrl = `${window.location.origin}/share/${shareId}`
        console.log('✅ 데이터베이스 공유 성공:', shareUrl)
      } else {
        // Supabase 실패 시 사용자에게 명확하게 알림
        console.log('❌ 데이터베이스 공유 실패')
        const errorData = await response.json().catch(() => null)
        
        alert(`❌ 공유 기능을 사용할 수 없습니다.\n\n문제: 데이터베이스 연결이 설정되지 않았습니다.\n해결방법: 관리자에게 Supabase 설정을 요청해주세요.\n\n현재는 스크린샷을 찍어서 직접 공유해주세요! 📸`)
        return
      }
      
      // 2단계: 공유 방법 선택
      // 카카오톡 공유 가능한지 확인
      if ((window as any).Kakao && (window as any).Kakao.Share) {
        try {
          console.log('🔄 카카오톡 공유 시도...')
          
          // 카카오톡 공유
          await (window as any).Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: shareTitle,
              description: shareText,
              imageUrl: imagePreview || `${window.location.origin}/tetoman.png`,
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
            buttons: [
              {
                title: '나도 분석하기',
                link: {
                  mobileWebUrl: window.location.origin,
                  webUrl: window.location.origin,
                },
              },
            ],
          })
          console.log('✅ 카카오톡 공유 완료')
          alert('카카오톡으로 공유되었습니다! 🎉')
          return
        } catch (kakaoError) {
          console.error('카카오톡 공유 실패:', kakaoError)
        }
      }
      
      // 3단계: 웹 기본 공유 API 시도
      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl,
          })
          console.log('✅ 웹 공유 완료')
          return
        } catch (shareError) {
          if (shareError.name !== 'AbortError') {
            console.error('웹 공유 실패:', shareError)
          }
        }
      }
      
      // 4단계: 폴백 - 클립보드 복사 + SNS 선택
      try {
        await navigator.clipboard.writeText(shareUrl)
        console.log('✅ 클립보드 복사 완료')
        
        // 공유 옵션 모달
        const shareOptions = [
          { name: '카카오톡', url: `https://sharer.kakao.com/talk/friends/?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
          { name: '페이스북', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
          { name: '트위터', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
        ]
        
        const userChoice = confirm(`🔗 링크가 클립보드에 복사되었습니다!\n\n어떤 방법으로 공유하시겠어요?\n\n✅ 확인: 카카오톡으로 공유\n❌ 취소: 직접 붙여넣기`)
        
        if (userChoice) {
          // 카카오톡 웹 공유 페이지 열기
          const kakaoShareUrl = `https://sharer.kakao.com/talk/friends/?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
          window.open(kakaoShareUrl, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes')
          console.log('✅ 카카오톡 웹 공유 페이지 열림')
        } else {
          alert('클립보드에 복사된 링크를 원하는 곳에 붙여넣어 주세요! 📋')
        }
      } catch (clipboardError) {
        console.error('클립보드 복사 실패:', clipboardError)
        
        // 마지막 수단: 프롬프트로 URL 표시
        prompt('링크를 복사해서 공유해주세요:', shareUrl)
      }
      
    } catch (error) {
      console.error('공유 총 오류:', error)
      alert('공유 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  // 호르몬 강화하기 페이지로 이동
  const handleHormoneBoost = () => {
    if (!analysisResult || !developmentTips) return
    
    // 분석 결과에 따른 맞춤 추천 페이지로 이동
    const searchQuery = developmentTips.shoppingKeywords.join(' ')
    const searchUrl = `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(searchQuery)}`
    
    window.open(searchUrl, '_blank')
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case '테토남': return 'border-red-400 bg-red-50'
      case '테토녀': return 'border-pink-400 bg-pink-50'
      case '에겐남': return 'border-blue-400 bg-blue-50'
      case '에겐녀': return 'border-purple-400 bg-purple-50'
      default: return 'border-gray-400 bg-gray-50'
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 min-h-[200vh]">
      <ParticlesBg />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 제목 섹션 */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 px-4">
            테토-에겐 성격 분석
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-200 px-4">
            사진을 업로드하여 AI가 분석하는 당신의 테토-에겐 유형을 무료로 확인해보세요.
          </p>
          
          {/* 개발 모드에서만 보안 상태 표시 */}
          {process.env.NODE_ENV === 'development' && user && (
            <div className="mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-xs mx-auto max-w-sm">
              🔐 개인 데이터 보안 격리 활성화 (사용자: {user.email?.split('@')[0]})
            </div>
          )}
        </div>

        {/* 광고 영역 1 */}
        <div className="mb-6 flex justify-center px-4">
          <div className="max-w-sm w-full mx-auto">
            <AdBanner key="analyze-ad-1" className="w-full" />
          </div>
        </div>

        {/* 메인 콘텐츠 - 단일 컬럼 레이아웃 */}
        <div className="max-w-sm mx-auto px-4">

        {/* 이미지 업로드 섹션 */}
        <Card className="mb-8 p-3 bg-white/95 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="pt-0">
            <div className="flex flex-col items-center space-y-4">
              {imagePreview ? (
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={453}
                      height={453}
                      className="rounded-2xl object-cover shadow-2xl border-4 border-white"
                    />
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleReset}
                      className="mt-8 text-2xl px-10 py-6 bg-white/90 backdrop-blur-sm hover:bg-white border-2 border-purple-200 hover:border-purple-400 transition-all duration-300"
                    >
                      <RefreshCw className="mr-3 h-6 w-6" />
                      다른 사진 선택하기
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-sm mx-auto">
                  <div className="text-center mb-4">
                    <h2 className="text-base font-bold text-gray-800 mb-2 flex items-center justify-center gap-1">
                      <Camera className="w-4 h-4 text-purple-600" />
                      사진 업로드
                    </h2>
                    <div className="px-2">
                      <p className="text-xs text-gray-600">
                        얼굴이 잘 보이는 사진을 업로드해주세요.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                                         {/* 카메라로 촬영 */}
                     <label 
                       htmlFor="camera-input"
                       className="group relative flex flex-col items-center justify-center w-40 h-32 mx-auto border-2 border-dashed border-purple-300 rounded-xl cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:border-purple-400"
                     >
                       <div className="relative flex flex-col items-center justify-center py-2">
                         <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
                           <Camera className="w-3 h-3 text-white" />
                         </div>
                         <p className="mb-1 text-xs text-gray-700 font-medium text-center">
                           <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">카메라로 촬영</span>
                         </p>
                         <p className="text-xs text-gray-500">JPG, PNG (최대 10MB)</p>
                       </div>
                       <input
                         id="camera-input"
                         type="file"
                         className="hidden"
                         accept="image/*"
                         capture="environment"
                         onChange={handleImageSelect}
                         multiple={false}
                       />
                     </label>

                     {/* 갤러리에서 선택 */}
                     <label 
                       htmlFor="gallery-input"
                       className="group relative flex flex-col items-center justify-center w-40 h-32 mx-auto border-2 border-dashed border-green-300 rounded-xl cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:border-green-400"
                     >
                       <div className="relative flex flex-col items-center justify-center py-2">
                         <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-2">
                           <Upload className="w-3 h-3 text-white" />
                         </div>
                         <p className="mb-1 text-xs text-gray-700 font-medium text-center">
                           <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold">갤러리에서 선택</span>
                         </p>
                         <p className="text-xs text-gray-500">JPG, PNG (최대 10MB)</p>
                       </div>
                       <input
                         id="gallery-input"
                         type="file"
                         className="hidden"
                         accept="image/*"
                         onChange={handleImageSelect}
                         multiple={false}
                       />
                     </label>
                  </div>
                </div>
              )}

              {/* 개인정보 안내 문구 */}
              <div className="flex items-center justify-center bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <span className="mr-2 text-sm" role="img" aria-label="lock">🔒</span>
                <p className="text-xs text-green-700 font-medium text-center">
                  사진은 AI 분석에만 사용되며, 개인별로 완전히 보안 격리되어 저장돼요
                </p>
              </div>

              {selectedImage && !analysisResult && (
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  size="lg"
                  className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 h-auto rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                      <div className="relative flex items-center">
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin" />
                          AI가 열심히 분석 중...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                          {user ? '✨ 분석 시작하기 ✨' : '✨ 로그인 후 분석하기 ✨'}
                        </>
                      )}
                    </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 분석 결과 섹션 - 항상 표시되지만 내용은 조건부 */}
        <div className={`mb-8 min-h-[800px] ${!analysisResult ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
          {analysisResult && (
            <Card className={`border-2 ${getTypeColor(analysisResult.type)}`}>
              <CardHeader>
                <CardTitle className="text-center text-lg">
                  {analysisResult.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* 핵심 정체성 */}
                <div className="text-center mb-6">
                  <div className="flex flex-col items-center mb-4">
                    <Image
                      src={
                        analysisResult.type === '테토남' ? '/tetoman.png'
                        : analysisResult.type === '테토녀' ? '/tetowoman.png'
                        : analysisResult.type === '에겐남' ? '/egenman.png'
                        : '/egenwoman.png'
                      }
                      alt={analysisResult.type}
                      width={80}
                      height={80}
                      className="mb-2"
                    />
                    <h2 className="text-lg font-bold mb-2">
                      👑{analysisResult.type}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      {analysisResult.summary}
                    </p>
                    <p className="text-xs text-gray-500">
                      신뢰도: {analysisResult.confidence}%
                    </p>
                  </div>
                </div>

                {/* 성향 순위 */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-medium text-center text-gray-800 text-sm">성향 분석</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(analysisResult.traits)
                      .filter(([key]) => !['teto', 'egen'].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-white p-2 rounded">
                          <span className="text-xs font-medium">
                            {key === 'emotion' ? '감정적' :
                             key === 'logic' ? '논리적' :
                             key === 'extraversion' ? '외향적' :
                             key === 'stability' ? '안정적' :
                             key === 'initiative' ? '주도적' : key}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold w-8 text-right">{value}%</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* AI 분석 근거 */}
                <div className="bg-gray-50 p-3 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-800 mb-2 text-sm">🤖 AI 분석 포인트</h3>
                  <div className="space-y-2">
                    {analysisResult.scenarios.map((scenario, index) => (
                      <p key={index} className="text-xs text-gray-600 leading-relaxed">
                        • {scenario}
                      </p>
                    ))}
                  </div>
                </div>

                {/* 오늘의 미션 */}
                <div className="bg-blue-50 p-3 rounded-lg mb-6">
                  <h3 className="font-medium text-blue-800 mb-2 text-sm flex items-center">
                    ✨ 오늘의 미션
                  </h3>
                  <p className="text-blue-700 text-xs">{analysisResult.dailyMission}</p>
                </div>

                {/* 연애 케미스트리 */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3 text-sm text-center">💕 연애 케미스트리</h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Image
                          src={
                            analysisResult.chemistry.best.type === '테토남' ? '/tetoman.png'
                            : analysisResult.chemistry.best.type === '테토녀' ? '/tetowoman.png'
                            : analysisResult.chemistry.best.type === '에겐남' ? '/egenman.png'
                            : '/egenwoman.png'
                          }
                          alt={analysisResult.chemistry.best.type}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <h4 className="font-medium text-green-800 text-sm">
                          환상의 케미: {analysisResult.chemistry.best.type}
                        </h4>
                      </div>
                      <p className="text-green-700 text-xs">{analysisResult.chemistry.best.reason}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Image
                          src={
                            analysisResult.chemistry.worst.type === '테토남' ? '/tetoman.png'
                            : analysisResult.chemistry.worst.type === '테토녀' ? '/tetowoman.png'
                            : analysisResult.chemistry.worst.type === '에겐남' ? '/egenman.png'
                            : '/egenwoman.png'
                          }
                          alt={analysisResult.chemistry.worst.type}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <h4 className="font-medium text-red-800 text-sm">
                          환장의 케미: {analysisResult.chemistry.worst.type}
                        </h4>
                      </div>
                      <p className="text-red-700 text-xs">{analysisResult.chemistry.worst.reason}</p>
                    </div>
                  </div>
                </div>

                {/* 호르몬 강화하기 */}
                {developmentTips && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3 text-sm text-center flex items-center justify-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      {developmentTips.title}
                    </h3>
                    
                    {/* 일상 팁 */}
                    <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                      <h4 className="font-medium text-yellow-800 mb-2 text-sm">💡 일상 실천 팁</h4>
                      <ul className="space-y-1">
                        {developmentTips.tips.map((tip: string, index: number) => (
                          <li key={index} className="text-yellow-700 text-xs">• {tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 추천 상품 키워드 */}
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <h4 className="font-medium text-indigo-800 mb-2 text-sm">🛒 추천 상품 키워드</h4>
                      <div className="flex flex-wrap gap-1">
                        {developmentTips.shoppingKeywords.map((keyword: string, index: number) => (
                          <span 
                            key={index} 
                            className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 공유하기 및 호르몬 강화하기 버튼 */}
                <div className="text-center space-y-3">
                  <Button
                    onClick={handleShare}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 text-sm"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    결과 공유하기
                  </Button>
                  
                  {/* 호르몬 강화하기 버튼 */}
                  <Button
                    onClick={handleHormoneBoost}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 text-sm"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    호르몬 강화하기 🛒
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 광고 영역 2 */}
        <div className="mb-6 flex justify-center px-4">
          <div className="max-w-sm w-full mx-auto">
            <AdBanner key="analyze-ad-2" className="w-full" />
          </div>
        </div>

        </div>
      </div>

      {/* 인증 모달 */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false)
          // 로그인 성공 후 분석 자동 시작
          if (selectedImage) {
            setTimeout(() => {
              handleAnalyze()
            }, 500)
          }
        }}
        initialTab="login"
      />
    </div>
  )
} 