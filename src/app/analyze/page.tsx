'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Camera, Loader2, Share2, RefreshCw, TrendingUp, ImagePlus, Download } from 'lucide-react'
import { AnalysisResult, DevelopmentTip } from '@/types'
import Image from 'next/image'
import ParticlesBg from "@/components/ParticlesBg"

import html2canvas from 'html2canvas'

import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/auth/AuthModal'
import CoupangProductSelector from '@/components/CoupangProductSelector'
import KakaoShare from '@/components/KakaoShare'
import AdFitDebugger from '@/components/AdFitDebugger'

export default function AnalyzePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [developmentTips, setDevelopmentTips] = useState<DevelopmentTip | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCoupangProducts, setShowCoupangProducts] = useState(false)
  
  // 일일 분석 제한 관련 상태
  const [dailyAnalysisCount, setDailyAnalysisCount] = useState(0)
  const [isAnalysisLimitReached, setIsAnalysisLimitReached] = useState(false)
  
  // 이미지 저장 관련 상태
  const [isSavingImage, setIsSavingImage] = useState(false)
  const analysisResultRef = useRef<HTMLDivElement>(null)
  
  // 카운트다운 관련 상태 제거됨
  
  const { user } = useAuth()

  // 일일 분석 제한 설정
  const DAILY_ANALYSIS_LIMIT = 2 // 하루 2회 제한

  // 사용자별 localStorage 키 생성 (보안 강화)
  const getUserStorageKey = (key: string, userId?: string) => {
    const targetUserId = userId || user?.id || 'anonymous'
    return `${key}_user_${targetUserId}`
  }

  // 오늘 날짜 문자열 생성 (YYYY-MM-DD)
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0]
  }

  // 일일 분석 횟수 키 생성
  const getDailyAnalysisKey = (userId?: string) => {
    const targetUserId = userId || user?.id || 'anonymous'
    const today = getTodayString()
    return `dailyAnalysis_${today}_user_${targetUserId}`
  }

  // 오늘의 분석 횟수 조회
  const getTodayAnalysisCount = () => {
    try {
      const key = getDailyAnalysisKey()
      const count = localStorage.getItem(key)
      return count ? parseInt(count, 10) : 0
    } catch (error) {
      console.error('분석 횟수 조회 실패:', error)
      return 0
    }
  }

  // 분석 횟수 증가
  const incrementAnalysisCount = () => {
    try {
      const key = getDailyAnalysisKey()
      const currentCount = getTodayAnalysisCount()
      const newCount = currentCount + 1
      localStorage.setItem(key, newCount.toString())
      setDailyAnalysisCount(newCount)
      setIsAnalysisLimitReached(newCount >= DAILY_ANALYSIS_LIMIT)
      console.log(`📊 분석 횟수 증가: ${newCount}/${DAILY_ANALYSIS_LIMIT}`)
      return newCount
    } catch (error) {
      console.error('분석 횟수 증가 실패:', error)
      return 0
    }
  }

  // 분석 횟수 상태 업데이트
  const updateAnalysisLimitStatus = () => {
    const count = getTodayAnalysisCount()
    setDailyAnalysisCount(count)
    setIsAnalysisLimitReached(count >= DAILY_ANALYSIS_LIMIT)
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
          
          // 일일 분석 횟수 상태 업데이트
          updateAnalysisLimitStatus()
          
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

  // 컴포넌트 마운트 시 일일 분석 횟수 확인
  useEffect(() => {
    updateAnalysisLimitStatus()
  }, [])

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      
      if (!file) {
        return
      }
      
      // 모바일 최적화: 파일 크기 체크 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`📏 이미지 파일이 너무 큽니다!\n\n• 현재 크기: ${(file.size / 1024 / 1024).toFixed(1)}MB\n• 최대 크기: 10MB\n• 이미지 크기를 줄여서 다시 시도해주세요`)
        event.target.value = ''
        return
      }
      
      // 모바일 최적화: 지원되는 이미지 포맷 체크
      const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!supportedFormats.includes(file.type)) {
        alert(`🚨 지원되지 않는 이미지 포맷입니다!\n\n• 지원 포맷: JPEG, PNG, WebP, GIF\n• 현재 포맷: ${file.type || '알 수 없음'}\n• 다른 이미지를 선택해주세요`)
        event.target.value = ''
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
        alert('📱 파일을 읽는 중 오류가 발생했습니다.\n\n• 이미지가 손상되었을 수 있습니다\n• 다른 이미지를 선택해주세요\n• 기기 저장 공간을 확인해주세요')
      }
      
      reader.readAsDataURL(file)
      setAnalysisResult(null)
      setDevelopmentTips(null)
      
      // 입력 필드 초기화 (같은 파일 재선택 가능하도록)
      event.target.value = ''
    } catch (error) {
      console.error('파일 선택 중 심각한 오류:', error)
      alert('📱 파일 선택 중 오류가 발생했습니다.\n\n• 앱을 다시 시작해보세요\n• 기기 저장 공간을 확인해주세요\n• 다른 이미지를 선택해주세요')
    }
  }

  // 카운트다운 함수 제거됨

  const handleAnalyze = async () => {
    if (!selectedImage) return

    // 로그인 체크
    if (!user) {
      setShowAuthModal(true)
      return
    }

    // 일일 분석 제한 체크 💰
    const currentCount = getTodayAnalysisCount()
    if (currentCount >= DAILY_ANALYSIS_LIMIT) {
      alert(`💰 일일 분석 제한에 도달했습니다!\n\n오늘은 ${DAILY_ANALYSIS_LIMIT}번의 분석을 모두 사용하셨어요.\n내일 다시 시도해주세요! 🌅\n\n(AI 분석 비용 절약을 위한 제한입니다)`)
      return
    }

    setIsAnalyzing(true)
    
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      // API 호출에 타임아웃 추가 (45초)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000) // 45초 타임아웃
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)

      // 모바일 친화적 HTTP 상태 코드 처리
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        switch (response.status) {
          case 400:
            alert(`🚨 ${errorData.error || '잘못된 요청입니다.'}\n\n• 이미지 파일을 다시 확인해주세요\n• 10MB 이하의 JPEG, PNG 파일을 업로드해주세요`)
            return
          case 408:
            alert(`⏱️ ${errorData.error || '요청 시간이 초과되었습니다.'}\n\n• 네트워크 연결을 확인해주세요\n• 잠시 후 다시 시도해주세요`)
            return
          case 413:
            alert(`📏 이미지 파일이 너무 큽니다!\n\n• 10MB 이하의 이미지를 업로드해주세요\n• 이미지 크기를 줄여서 다시 시도해주세요`)
            return
          case 503:
            alert(`🌐 서비스 연결에 문제가 있습니다.\n\n• 인터넷 연결을 확인해주세요\n• 잠시 후 다시 시도해주세요`)
            return
          default:
            alert(`❌ ${errorData.error || '분석에 실패했습니다.'}\n\n• 잠시 후 다시 시도해주세요`)
            return
        }
      }

      const result = await response.json()
      setAnalysisResult(result)

      // 분석 성공 시 횟수 증가 💰
      const newCount = incrementAnalysisCount()
      console.log(`💰 분석 완료! 오늘 사용: ${newCount}/${DAILY_ANALYSIS_LIMIT}`)

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

      // 남은 횟수 안내
      const remainingCount = DAILY_ANALYSIS_LIMIT - newCount
      if (remainingCount > 0) {
        setTimeout(() => {
          alert(`✅ 분석 완료!\n\n오늘 남은 분석 횟수: ${remainingCount}번`)
        }, 1000)
      } else {
        setTimeout(() => {
          alert(`✅ 분석 완료!\n\n💰 오늘의 분석 횟수를 모두 사용했어요!\n내일 다시 만나요! 🌅`)
        }, 1000)
      }

    } catch (error) {
      console.error('분석 중 상세 에러:', error)
      
      // 모바일 친화적 에러 처리
      if (error instanceof Error) {
        // AbortController 타임아웃 에러 감지
        if (error.name === 'AbortError') {
          alert('⏱️ 분석 시간이 너무 오래 걸리고 있습니다.\n\n• 네트워크 연결이 느릴 수 있습니다\n• 더 작은 이미지로 다시 시도해보세요\n• 잠시 후 다시 시도해주세요')
          return
        }
        
        // 네트워크 에러 감지
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          alert('📱 네트워크 연결이 불안정합니다.\n\n• WiFi 또는 데이터 연결을 확인해주세요\n• 잠시 후 다시 시도해주세요')
          return
        }
        
        // 타임아웃 에러 감지
        if (error.message.includes('timeout') || error.message.includes('TimeoutError')) {
          alert('⏱️ 네트워크 응답이 지연되고 있습니다.\n\n• 네트워크 상태를 확인해주세요\n• 잠시 후 다시 시도해주세요')
          return
        }
      }
      
      alert('🤖 분석 중 오류가 발생했습니다.\n\n• 이미지를 다시 선택해주세요\n• 네트워크 연결을 확인해주세요\n• 잠시 후 다시 시도해주세요')
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

  // 친구에게 추천하기 - 사이트 자체를 공유 (카카오톡 로그인 사용자 우선 처리)
  const handleRecommendToFriend = async () => {
    const shareTitle = '테토-에겐 성격 분석 - 무료 AI 분석'
    const shareText = '사진으로 내 테토-에겐 유형을 분석해보세요! 정말 재밌어요 😄'
    const shareUrl = window.location.origin
    
    console.log('👥 친구에게 추천하기 시작...')
    
    // 카카오톡 로그인 사용자인지 확인
    const isKakaoUser = user?.email?.includes('kakao.com') || 
                       user?.user_metadata?.provider === 'kakao' ||
                       user?.app_metadata?.provider === 'kakao'
    
    if (isKakaoUser) {
      console.log('🟨 카카오톡 로그인 사용자 감지 - 카카오톡 우선 공유 시도!')
      
      // 카카오톡 사용자에게 즉시 카카오톡 공유 제안
      const wantKakaoShare = confirm(`🟨 카카오톡으로 로그인하셨네요!\n\n카카오톡으로 바로 친구들에게 추천할까요?\n\n✅ 확인: 카카오톡으로 추천\n❌ 취소: 다른 방법 선택`)
      
      if (wantKakaoShare) {
        // 카카오톡 SDK 공유 시도
        if ((window as any).Kakao && (window as any).Kakao.Share) {
          try {
            console.log('🔄 카카오톡 우선 공유 시도...')
            
            await (window as any).Kakao.Share.sendDefault({
              objectType: 'feed',
              content: {
                title: shareTitle,
                description: shareText,
                imageUrl: `${window.location.origin}/tetoman.png`,
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl,
                },
              },
              buttons: [
                {
                  title: '테토-에겐 분석하기',
                  link: {
                    mobileWebUrl: shareUrl,
                    webUrl: shareUrl,
                  },
                },
              ],
            })
            console.log('✅ 카카오톡 우선 추천 완료')
            alert('친구에게 카카오톡으로 추천했어요! 🎉\n\n카카오톡 사용자라 더 빠르게 공유되었습니다!')
            return
          } catch (kakaoError) {
            console.error('카카오톡 SDK 실패, 웹 공유로 전환:', kakaoError)
            
            // SDK 실패 시 카카오톡 웹 공유로 폴백
            const kakaoWebUrl = `https://sharer.kakao.com/talk/friends/?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
            window.open(kakaoWebUrl, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes')
            alert('카카오톡 웹 공유 페이지를 열었습니다! 📱')
            return
          }
        } else {
          // 카카오톡 SDK가 없으면 웹 공유
          console.log('카카오톡 SDK 없음, 웹 공유로 진행')
          const kakaoWebUrl = `https://sharer.kakao.com/talk/friends/?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
          window.open(kakaoWebUrl, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes')
          alert('카카오톡 웹 공유 페이지를 열었습니다! 📱')
          return
        }
      }
    }
    
    // 일반 사용자 또는 카카오톡 사용자가 다른 방법을 선택한 경우
    console.log('📱 일반 공유 모드로 진행...')
    
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
            imageUrl: `${window.location.origin}/tetoman.png`,
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: '테토-에겐 분석하기',
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
          ],
        })
        console.log('✅ 카카오톡 추천 완료')
        alert('친구에게 카카오톡으로 추천했어요! 🎉')
        return
      } catch (kakaoError) {
        console.error('카카오톡 추천 실패:', kakaoError)
      }
    }
    
    // 웹 기본 공유 API 시도
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
        console.log('✅ 웹 추천 완료')
        return
      } catch (shareError) {
        if ((shareError as any).name !== 'AbortError') {
          console.error('웹 추천 실패:', shareError)
        }
      }
    }
    
    // 폴백 - 클립보드 복사
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      console.log('✅ 클립보드 복사 완료')
      
      const userChoice = confirm(`🔗 추천 메시지가 클립보드에 복사되었습니다!\n\n어떤 방법으로 친구에게 추천하시겠어요?\n\n✅ 확인: 카카오톡으로 추천\n❌ 취소: 직접 붙여넣기`)
      
      if (userChoice) {
        // 카카오톡 웹 공유 페이지 열기
        const kakaoShareUrl = `https://sharer.kakao.com/talk/friends/?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        window.open(kakaoShareUrl, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes')
        console.log('✅ 카카오톡 웹 추천 페이지 열림')
      } else {
        alert('클립보드에 복사된 메시지를 친구에게 보내주세요! 📋')
      }
    } catch (clipboardError) {
      console.error('클립보드 복사 실패:', clipboardError)
      prompt('링크를 복사해서 친구에게 공유해주세요:', `${shareText}\n${shareUrl}`)
    }
  }

  // 모바일 기기 감지
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // 분석결과를 이미지로 저장하기 - 모바일/데스크톱 별 다른 방식
  // 🚀 고속 모바일 최적화 저장 시스템
  const handleSaveResult = async () => {
    if (!analysisResult || !analysisResultRef.current) return
    
    setIsSavingImage(true)
    
    try {
      console.log('🚀 고속 이미지 생성 시작...')
      
      // 🚀 모바일 고속 모드: 간단한 옵션으로 빠른 렌더링
      const isMobileDevice = isMobile()
      const canvas = await html2canvas(analysisResultRef.current, {
        backgroundColor: '#ffffff',
        scale: isMobileDevice ? 1 : 1.5, // 모바일 해상도 낮춤 (속도 UP)
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 3000, // 3초로 단축 (10초 → 3초)
        logging: false, // 로그 비활성화로 속도 향상
        removeContainer: true, // 컨테이너 제거로 속도 향상
        onclone: (clonedDoc) => {
          // 🚀 최소한의 처리로 속도 극대화
          const clonedElement = clonedDoc.querySelector('[data-analysis-result]') as HTMLElement
          if (clonedElement) {
            // 간단한 스타일만 적용
            clonedElement.style.padding = '15px'
            clonedElement.style.backgroundColor = '#ffffff'
            clonedElement.style.borderRadius = '8px'
            
            // 불필요한 영역만 제거
            const excludedContent = clonedElement.querySelector('.save-excluded-content')
            if (excludedContent) {
              excludedContent.remove()
            }
          }
        }
      })
      
      // 🚀 고속 이미지 변환 (품질 최적화)
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!)
        }, 'image/jpeg', 0.8) // PNG → JPEG, 품질 0.8로 파일 크기 축소
      })
      
      const fileName = `테토에겐_${analysisResult.type}_${Date.now()}.jpg`
      
      // 🚀 초고속 저장 시스템
      if (isMobile()) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        
        // 🚀 방법 1: 모바일 Web Share API (가장 빠름)
        if (navigator.share) {
          try {
            const file = new File([blob], fileName, { type: 'image/jpeg' })
            await navigator.share({
              title: `테토-에겐 분석 결과: ${analysisResult.type}`,
              text: `나는 ${analysisResult.type}! 테토-에겐 성격 분석 결과를 확인해보세요!`,
              files: [file]
            })
            console.log('✅ 모바일 공유 완료')
            return
          } catch (shareError) {
            console.log('Web Share API 실패, 다운로드 방법 시도:', shareError)
          }
        }
        
        // 🚀 방법 2: 직접 다운로드 (호환성 최고)
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
                alert('🚀 이미지 저장 완료!\n\n다운로드 폴더를 확인해보세요!')
      } else {
        // 💻 데스크톱: 직접 다운로드
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        console.log('✅ 데스크톱 이미지 다운로드 완료:', fileName)
        alert('💻 분석결과가 다운로드되었습니다!\n\n다운로드 폴더에서 확인해보세요! 📥')
      }
      
    } catch (error) {
      console.error('❌ 저장 실패:', error)
      alert('💥 저장 중 오류가 발생했습니다.\n다시 시도하거나 스크린샷을 이용해주세요.')
    } finally {
      setIsSavingImage(false)
    }
  }

  // 호르몬 강화하기 - 쿠팡 파트너스 상품 모달 열기
  const handleHormoneBoost = () => {
    if (!analysisResult) return
    setShowCoupangProducts(true)
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

        {/* 메인 콘텐츠 - 단일 컬럼 레이아웃 */}
        <div className="max-w-md mx-auto px-4">



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

              {/* 일일 분석 제한 상태 표시 */}
              {user && (
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm" role="img" aria-label="money">💰</span>
                    <p className="text-sm text-orange-700 font-medium text-center">
                      오늘의 AI 분석: <span className="font-bold">{dailyAnalysisCount}/{DAILY_ANALYSIS_LIMIT}번</span> 사용
                      {isAnalysisLimitReached ? 
                        <span className="block text-xs text-orange-600 mt-1">내일 다시 이용해주세요! 🌅</span> :
                        <span className="block text-xs text-orange-600 mt-1">남은 횟수: {DAILY_ANALYSIS_LIMIT - dailyAnalysisCount}번</span>
                      }
                    </p>
                  </div>
                </div>
              )}

              {selectedImage && !analysisResult && (
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || isAnalysisLimitReached}
                  size="lg"
                  className={`relative overflow-hidden ${
                    isAnalysisLimitReached 
                      ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  } text-white text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 h-auto rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 ${
                    isAnalysisLimitReached ? '' : 'transform hover:scale-105'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin" />
                        AI가 열심히 분석 중...
                      </>
                    ) : isAnalysisLimitReached ? (
                      <>
                        <span className="mr-2 sm:mr-3 text-base">💰</span>
                        오늘 분석 완료 (내일 다시!)
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
            <>
                                            {/* 📱 갤러리 저장 */}
               <Card className="mb-4 bg-gradient-to-r from-green-500 to-emerald-600 border-0 shadow-lg">
                 <CardContent className="p-4">
                   <div className="text-center">
                     <div className="mb-3">
                       <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-2">
                         <Download className="h-6 w-6 text-white" />
                       </div>
                       <h3 className="font-bold text-white mb-1 text-lg">
                         📱 갤러리에 저장
                       </h3>
                       <p className="text-green-100 text-sm">
                         모든 기기에서 사용 가능
                       </p>
                     </div>
                     
                     <Button
                       onClick={handleSaveResult}
                       disabled={isSavingImage}
                       className="w-full bg-white text-green-700 hover:text-green-800 px-6 py-3 text-base font-bold shadow-lg hover:scale-105 transition-all duration-200 border-0 hover:bg-green-50"
                     >
                       {isSavingImage ? (
                         <>
                           <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                           이미지 생성 중...
                         </>
                       ) : (
                         <>
                           <Download className="mr-2 h-5 w-5" />
                           원클릭 저장
                         </>
                       )}
                     </Button>
                   </div>
                 </CardContent>
               </Card>

              <Card 
                ref={analysisResultRef}
                data-analysis-result
                className={`border-2 ${getTypeColor(analysisResult.type)}`}
              >
                <CardHeader>
                  <CardTitle className="text-center text-lg">
                    {analysisResult.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* 핵심 정체성 */}
                  <div className="text-center mb-6">
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-20 h-20 flex items-center justify-center mb-2">
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
                          className="object-contain max-w-full max-h-full"
                          style={{ imageRendering: 'auto' }}
                          priority
                        />
                      </div>
                      <h2 className="text-lg font-bold mb-2">
                        👑{analysisResult.type}
                      </h2>
                      <p className="text-sm text-gray-600 mb-2">
                        {analysisResult.summary}
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
                          <div className="w-6 h-6 flex items-center justify-center">
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
                              className="object-contain rounded-full"
                              style={{ imageRendering: 'auto' }}
                            />
                          </div>
                          <h4 className="font-medium text-green-800 text-sm">
                            환상의 케미: {analysisResult.chemistry.best.type}
                          </h4>
                        </div>
                        <p className="text-green-700 text-xs">{analysisResult.chemistry.best.reason}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 flex items-center justify-center">
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
                              className="object-contain rounded-full"
                              style={{ imageRendering: 'auto' }}
                            />
                          </div>
                          <h4 className="font-medium text-red-800 text-sm">
                            환장의 케미: {analysisResult.chemistry.worst.type}
                          </h4>
                        </div>
                        <p className="text-red-700 text-xs">{analysisResult.chemistry.worst.reason}</p>
                      </div>
                    </div>
                  </div>

                                     {/* 호르몬 강화하기 - 저장 시에는 제외될 영역 */}
                   <div className="save-excluded-content">
                     {developmentTips && (
                       <div className="mb-6">
                         <h3 className="font-medium text-gray-800 mb-3 text-sm text-center flex items-center justify-center">
                           <TrendingUp className="mr-2 h-4 w-4" />
                           {developmentTips.title}
                         </h3>
                         
                         {/* 일상 팁 */}
                         <div className="bg-yellow-50 p-3 rounded-lg">
                           <h4 className="font-medium text-yellow-800 mb-2 text-sm">💡 일상 실천 팁</h4>
                           <ul className="space-y-3">
                             {developmentTips.tips.map((tip: string, index: number) => (
                               <li key={index} className="text-yellow-700 text-xs leading-relaxed">• {tip}</li>
                             ))}
                           </ul>
                         </div>
                       </div>
                     )}

                     {/* 친구에게 추천하기 및 기타 버튼들 */}
                     <div className="text-center space-y-3">
                       <KakaoShare
                         title={`나의 테토-에겐 분석 결과: ${analysisResult.type} 💯`}
                         description={`${analysisResult.summary}\n\n나도 테스트 해보기! 👇`}
                         imageUrl={analysisResult.type === '테토남' ? '/tetoman.png'
                           : analysisResult.type === '테토녀' ? '/tetowoman.png'
                           : analysisResult.type === '에겐남' ? '/egenman.png'
                           : '/egenwoman.png'}
                         linkUrl="https://teto-choichoichoices-projects.vercel.app/analyze"
                         className="w-full"
                       >
                         <span className="flex items-center justify-center">
                           💬 카카오톡 공유하기
                         </span>
                       </KakaoShare>
                       
                       {/* 호르몬 강화하기 버튼 */}
                       <Button
                         onClick={handleHormoneBoost}
                         className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 text-sm"
                       >
                         <TrendingUp className="mr-2 h-4 w-4" />
                         호르몬 강화하기 🛒
                       </Button>
                     </div>
                   </div>
                </CardContent>
              </Card>
            </>
          )}
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

      {/* 쿠팡 파트너스 상품 선택 모달 */}
      {analysisResult && (
        <CoupangProductSelector
          isOpen={showCoupangProducts}
          onClose={() => setShowCoupangProducts(false)}
          userType={analysisResult.type}
        />
      )}
      
      {/* AdFit 디버깅 컴포넌트 (개발 환경에서만 표시) */}
      <AdFitDebugger adUnit="DAN-eS5pNSPkANAP1JnD" width="320" height="50" />
    </div>
  )
} 