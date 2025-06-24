'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Camera, Loader2, Share2, RefreshCw, TrendingUp, ImagePlus, Download } from 'lucide-react'
import { AnalysisResult, DevelopmentTip } from '@/types'
import Image from 'next/image'
import ParticlesBg from "@/components/ParticlesBg"
import AdBanner from "@/components/AdBanner"
import html2canvas from 'html2canvas'

import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/auth/AuthModal'
import CoupangProductSelector from '@/components/CoupangProductSelector'

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
  
  const { user } = useAuth()

  // 일일 분석 제한 설정
  const DAILY_ANALYSIS_LIMIT = 2

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

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('분석에 실패했습니다.')
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
  // 📱 모바일 최적화 저장 시스템
  const handleSaveResult = async () => {
    if (!analysisResult || !analysisResultRef.current) return
    
    setIsSavingImage(true)
    
    try {
      console.log('📱 모바일 최적화 이미지 생성 시작...')
      
      // 📱 이미지 로딩 완료 대기 (깨짐 방지)
      const images = analysisResultRef.current.querySelectorAll('img')
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve()
        return new Promise((resolve) => {
          img.onload = () => resolve(true)
          img.onerror = () => resolve(true) // 에러여도 계속 진행
        })
      }))
      
      // 📱 모바일 화면에 맞는 최적화된 이미지 생성
      const isMobileDevice = isMobile()
      const canvas = await html2canvas(analysisResultRef.current, {
        backgroundColor: '#ffffff',
        scale: isMobileDevice ? 1.5 : 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false, // SVG 렌더링 문제 방지
        imageTimeout: 10000, // 이미지 로딩 타임아웃 증가
        scrollX: 0,
        scrollY: 0,
        width: analysisResultRef.current.scrollWidth,
        height: analysisResultRef.current.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-analysis-result]') as HTMLElement
          if (clonedElement) {
            clonedElement.style.padding = '20px'
            clonedElement.style.margin = '0'
            clonedElement.style.maxWidth = 'none'
            clonedElement.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'
            clonedElement.style.borderRadius = '12px'
            clonedElement.style.border = '1px solid #e5e7eb'
            
            // 🔧 이미지 깨짐 완벽 방지 처리
            const images = clonedElement.querySelectorAll('img')
            images.forEach((img, index) => {
              // Next.js 최적화 속성 모두 제거
              img.removeAttribute('srcset')
              img.removeAttribute('sizes')
              img.removeAttribute('loading')
              img.removeAttribute('decoding')
              img.removeAttribute('fetchpriority')
              
              // 원본 이미지 경로로 변경
              const src = img.getAttribute('src')
              if (src && src.includes('/_next/image')) {
                // Next.js 최적화된 이미지를 원본 경로로 변경
                const urlParams = new URLSearchParams(src.split('?')[1])
                const originalUrl = urlParams.get('url')
                if (originalUrl) {
                  img.src = originalUrl
                }
              }
              
              // 강제 스타일 적용
              img.style.imageRendering = 'crisp-edges'
              img.style.objectFit = 'contain'
              img.style.maxWidth = '100%'
              img.style.maxHeight = '100%'
              img.style.width = 'auto'
              img.style.height = 'auto'
              img.style.display = 'block'
              img.style.margin = '0 auto'
              
              // 크기 고정 (캐릭터 이미지들)
              if (img.alt && (img.alt.includes('테토') || img.alt.includes('에겐'))) {
                img.style.width = '80px'
                img.style.height = '80px'
              }
            })
            
            // 불필요한 영역 제거
            const excludedContent = clonedElement.querySelector('.save-excluded-content')
            if (excludedContent) {
              excludedContent.remove()
            }
          }
        }
      })
      
      // 📱 거의 안 보이는 워터마크 추가
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.font = '12px sans-serif'
        ctx.textAlign = 'right'
        const watermarkText = 'teto-egen.com'
        const textX = canvas.width - 15
        const textY = canvas.height - 10
        
        // 거의 투명한 워터마크
        ctx.fillStyle = 'rgba(150, 150, 150, 0.3)'
        ctx.fillText(watermarkText, textX, textY)
      }
      
              // 📱 최적화된 이미지 변환
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob!)
          }, 'image/png', 0.9)
        })
        
        const fileName = `테토에겐_${analysisResult.type}_${new Date().toISOString().split('T')[0]}.png`
        
        // 📱 스마트 저장 시스템
       if (isMobile()) {
         const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
         const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
         
         console.log(`🍎 디바이스 감지: iOS=${isIOS}, Safari=${isSafari}`)
         
         // 🍎 방법 1: iOS Web Share API (iOS 12.2+)
         if (isIOS && navigator.share) {
           try {
             const file = new File([blob], fileName, { type: 'image/png' })
             
             // iOS에서 파일 공유 지원 여부 확인
             if (navigator.canShare && navigator.canShare({ files: [file] })) {
               await navigator.share({
                 title: '🍎 테토-에겐 AI 분석 결과',
                 text: `나는 ${analysisResult.type}! 테토-에겐 성격 분석 결과를 확인해보세요!`,
                 files: [file]
               })
               console.log('✅ iOS Web Share API로 저장 완료')
               alert('🍎 iOS 네이티브 공유가 완료되었습니다!\n\n"사진에 저장"을 선택하면 포토 앱에 저장됩니다! 📱')
               return
             } else {
               // 파일 없이 URL 공유 (iOS 구버전 호환)
               await navigator.share({
                 title: '🍎 테토-에겐 AI 분석 결과',
                 text: `나는 ${analysisResult.type}! 테토-에겐 성격 분석 결과를 확인해보세요!`,
                 url: window.location.href
               })
               console.log('✅ iOS Web Share API (URL) 완료')
             }
           } catch (shareError) {
             console.log('🍎 Web Share API 실패, 클립보드 방법 시도:', shareError)
           }
         }
         
         // 🍎 방법 2: iOS 클립보드 API (iOS 13.4+)
         if (isIOS && navigator.clipboard && navigator.clipboard.write) {
           try {
             await navigator.clipboard.write([
               new ClipboardItem({
                 'image/png': blob
               })
             ])
             console.log('✅ iOS 클립보드에 이미지 복사 완료')
             alert('🍎 이미지가 클립보드에 복사되었습니다!\n\n포토 앱을 열고 "+" 버튼 → "붙여넣기"로 저장하세요! 📸')
             return
           } catch (clipboardError) {
             console.log('🍎 클립보드 API 실패, 다운로드 방법 시도:', clipboardError)
           }
         }
         
         // 🍎 방법 3: iOS Safari 호환 다운로드 (모든 iOS 버전)
         const url = URL.createObjectURL(blob)
         
         if (isIOS) {
           // iOS Safari에서 이미지 새 창 열기
           const newWindow = window.open('', '_blank')
           if (newWindow) {
             newWindow.document.write(`
               <!DOCTYPE html>
               <html>
               <head>
                 <meta charset="UTF-8">
                 <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
                 <title>🍎 테토-에겐 분석결과</title>
                 <style>
                   body {
                     margin: 0;
                     padding: 15px;
                     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                     text-align: center;
                     min-height: 100vh;
                   }
                   .container {
                     max-width: 100%;
                     margin: 0 auto;
                   }
                   img {
                     max-width: 100%;
                     height: auto;
                     border-radius: 16px;
                     box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                     margin-bottom: 20px;
                     border: 2px solid rgba(255,255,255,0.2);
                   }
                   .instruction {
                     background: rgba(255,255,255,0.95);
                     backdrop-filter: blur(10px);
                     padding: 20px;
                     border-radius: 16px;
                     margin: 20px 0;
                     color: #1d1d1f;
                     box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                   }
                   .instruction h3 {
                     margin: 0 0 15px 0;
                     font-size: 18px;
                     font-weight: 700;
                     color: #007AFF;
                   }
                   .instruction p {
                     margin: 8px 0;
                     font-size: 16px;
                     line-height: 1.5;
                   }
                   .step {
                     background: #007AFF;
                     color: white;
                     border-radius: 12px;
                     padding: 15px;
                     margin: 10px 0;
                     font-weight: 600;
                   }
                   .apple-logo {
                     font-size: 24px;
                     margin-bottom: 10px;
                   }
                 </style>
               </head>
               <body>
                 <div class="container">
                   <div class="apple-logo">🍎</div>
                   <img src="${url}" alt="테토-에겐 분석결과" id="resultImage" />
                   <div class="instruction">
                     <h3>📱 iPhone 포토 앱에 저장하기</h3>
                     <div class="step">
                       <strong>1단계:</strong> 위 이미지를 길게 눌러주세요 (Long Press)
                     </div>
                     <div class="step">
                       <strong>2단계:</strong> 팝업 메뉴에서 "이미지 저장" 또는 "사진에 저장" 선택
                     </div>
                     <div class="step">
                       <strong>3단계:</strong> 포토 앱에서 저장된 이미지 확인! 🎉
                     </div>
                     <p style="margin-top: 15px; font-size: 14px; color: #666;">
                       💡 저장이 안 되시나요? 설정 → Safari → 다운로드에서 위치를 확인해보세요.
                     </p>
                   </div>
                 </div>
                 <script>
                   // 이미지 로드 완료 후 알림
                   document.getElementById('resultImage').onload = function() {
                     setTimeout(() => {
                       alert('🍎 iPhone 사용자님!\\n\\n이미지를 길게 눌러서 "사진에 저장"을 선택해주세요! 📸');
                     }, 1000);
                   };
                 </script>
               </body>
               </html>
             `)
             newWindow.document.close()
             console.log('✅ iOS Safari 호환 저장 페이지 열림')
           } else {
             // 팝업 차단된 경우 직접 다운로드 시도
             const link = document.createElement('a')
             link.href = url
             link.download = fileName
             link.style.display = 'none'
             document.body.appendChild(link)
             link.click()
             document.body.removeChild(link)
             alert('🍎 다운로드가 시작되었습니다!\n\nSafari 하단의 다운로드 버튼을 확인해주세요! 📥')
           }
         } else {
           // 안드로이드 및 기타 모바일
           const link = document.createElement('a')
           link.href = url
           link.download = fileName
           link.style.display = 'none'
           document.body.appendChild(link)
           link.click()
           document.body.removeChild(link)
           alert('📱 이미지 다운로드 완료!\n\n갤러리 또는 다운로드 폴더에서 확인하세요! 🎉')
         }
         
         // URL 해제 (메모리 최적화)
         setTimeout(() => URL.revokeObjectURL(url), 3000)
        
              } else {
          // 💻 데스크톱: 다운로드
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = fileName
          link.style.display = 'none'
          
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          // URL 해제
          setTimeout(() => URL.revokeObjectURL(url), 1000)
          
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

                     {/* 친구에게 추천하기 및 기타 버튼들 */}
                     <div className="text-center space-y-3">
                       <Button
                         onClick={handleRecommendToFriend}
                         className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 text-sm"
                       >
                         <Share2 className="mr-2 h-4 w-4" />
                         친구에게 추천하기
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
                   </div>
                </CardContent>
              </Card>
            </>
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

      {/* 쿠팡 파트너스 상품 선택 모달 */}
      {analysisResult && (
        <CoupangProductSelector
          isOpen={showCoupangProducts}
          onClose={() => setShowCoupangProducts(false)}
          userType={analysisResult.type}
        />
      )}
    </div>
  )
} 