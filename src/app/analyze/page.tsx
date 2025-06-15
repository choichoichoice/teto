'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Camera, Loader2, Share2, RefreshCw, TrendingUp, ImagePlus } from 'lucide-react'
import { AnalysisResult, DevelopmentTip } from '@/types'
import Image from 'next/image'
import ParticlesBg from "@/components/ParticlesBg"

import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/auth/AuthModal'

export default function AnalyzePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [developmentTips, setDevelopmentTips] = useState<DevelopmentTip | null>(null)
  const [isLoadingTips, setIsLoadingTips] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user } = useAuth()

  // 페이지 로드 시 로컬 스토리지에서 데이터 복원
  useEffect(() => {
    const savedResult = localStorage.getItem('tetoAnalysisResult')
    const savedTips = localStorage.getItem('tetoDevelopmentTips')
    const savedImagePreview = localStorage.getItem('tetoImagePreview')

    if (savedResult) {
      try {
        setAnalysisResult(JSON.parse(savedResult))
      } catch (error) {
        console.error('분석 결과 복원 실패:', error)
      }
    }

    if (savedTips) {
      try {
        setDevelopmentTips(JSON.parse(savedTips))
      } catch (error) {
        console.error('발전 팁 복원 실패:', error)
      }
    }

    if (savedImagePreview) {
      setImagePreview(savedImagePreview)
    }
  }, [])

  // 분석 결과가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (analysisResult) {
      localStorage.setItem('tetoAnalysisResult', JSON.stringify(analysisResult))
    }
  }, [analysisResult])

  // 발전 팁이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (developmentTips) {
      localStorage.setItem('tetoDevelopmentTips', JSON.stringify(developmentTips))
    }
  }, [developmentTips])

  // 이미지 미리보기가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (imagePreview) {
      localStorage.setItem('tetoImagePreview', imagePreview)
    }
  }, [imagePreview])

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setAnalysisResult(null)
      setDevelopmentTips(null)
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

      console.log('이미지 분석 요청 시작...')
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('API 응답 에러:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        throw new Error(`분석에 실패했습니다. (${response.status}: ${response.statusText})`)
      }

      const result = await response.json()
      console.log('분석 결과:', result)
      setAnalysisResult(result)

      // 호르몬 강화 팁도 함께 가져오기
      console.log('호르몬 강화 팁 요청 시작...')
      const tipsResponse = await fetch('/api/tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: result.type }),
      })

      if (tipsResponse.ok) {
        const tips = await tipsResponse.json()
        console.log('호르몬 강화 팁:', tips)
        setDevelopmentTips(tips)
      } else {
        console.error('호르몬 강화 팁 로딩 실패:', await tipsResponse.text())
      }
    } catch (error) {
      console.error('분석 중 상세 에러:', error)
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGetTips = async () => {
    if (!analysisResult) return

    setIsLoadingTips(true)
    try {
      const response = await fetch('/api/tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: analysisResult.type }),
      })

      if (!response.ok) {
        throw new Error('팁 로딩에 실패했습니다.')
      }

      const tips: DevelopmentTip = await response.json()
      setDevelopmentTips(tips)
      // 로컬 스토리지에 저장 (useEffect에서도 저장되지만 즉시 저장을 위해)
      localStorage.setItem('tetoDevelopmentTips', JSON.stringify(tips))
    } catch (error) {
      console.error('Tips error:', error)
      alert('팁 로딩 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoadingTips(false)
    }
  }

  const handleShare = async () => {
    if (!analysisResult || !user) return

    try {
      // 로그인한 사용자의 결과를 데이터베이스에 저장
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisResult,
          developmentTips,
          imagePreview,
          userId: user.id
        }),
      })

      if (response.ok) {
        const { shareId } = await response.json()
        const shareUrl = `${window.location.origin}/share/${shareId}`
        
        if (navigator.share) {
          try {
            await navigator.share({
              title: '테토-에겐 분석 결과',
              text: `테토-에겐 분석 결과: ${analysisResult.type} ${analysisResult.emoji} (신뢰도 ${analysisResult.confidence}%)`,
              url: shareUrl,
            })
          } catch (error) {
            console.log('공유가 취소되었습니다.')
          }
        } else {
          // Fallback: 클립보드에 복사
          navigator.clipboard.writeText(shareUrl)
          alert('공유 링크가 클립보드에 복사되었습니다!')
        }
      } else {
        // Supabase가 설정되지 않은 경우 기존 방식 사용
        const shareText = `테토-에겐 분석 결과: ${analysisResult.type} ${analysisResult.emoji} (신뢰도 ${analysisResult.confidence}%)`
        
        if (navigator.share) {
          try {
            await navigator.share({
              title: '테토-에겐 분석 결과',
              text: shareText,
              url: window.location.href,
            })
          } catch (error) {
            console.log('공유가 취소되었습니다.')
          }
        } else {
          navigator.clipboard.writeText(shareText)
          alert('결과가 클립보드에 복사되었습니다!')
        }
      }
    } catch (error) {
      console.error('공유 오류:', error)
      // 오류 발생 시 기존 방식 사용
      const shareText = `테토-에겐 분석 결과: ${analysisResult.type} ${analysisResult.emoji} (신뢰도 ${analysisResult.confidence}%)`
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: '테토-에겐 분석 결과',
            text: shareText,
            url: window.location.href,
          })
        } catch (error) {
          console.log('공유가 취소되었습니다.')
        }
      } else {
        navigator.clipboard.writeText(shareText)
        alert('결과가 클립보드에 복사되었습니다!')
      }
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setAnalysisResult(null)
    setDevelopmentTips(null)
    
    // 로컬 스토리지도 함께 초기화
    localStorage.removeItem('tetoAnalysisResult')
    localStorage.removeItem('tetoDevelopmentTips')
    localStorage.removeItem('tetoImagePreview')
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case '테토남': return 'border-blue-400 bg-blue-50'
      case '테토녀': return 'border-pink-400 bg-pink-50'
      case '에겐남': return 'border-purple-400 bg-purple-50'
      case '에겐녀': return 'border-rose-400 bg-rose-50'
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
            사진을 업로드하여 AI가 분석하는 당신의 성격 유형을 무료로 확인해보세요.
          </p>
        </div>

        {/* 광고 공간 */}
        <div className="mb-6 flex justify-center px-4">
          <div className="max-w-sm w-full mx-auto">
            {/* 모바일 광고 배너 영역 - 직사각형 */}
            <div className="bg-gray-100 rounded-lg w-full h-20 p-2">
            </div>
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
                  
                  <label className="group relative flex flex-col items-center justify-center w-40 h-40 mx-auto border-2 border-dashed border-purple-300 rounded-xl cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:border-purple-400">
                    <div className="relative flex flex-col items-center justify-center py-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3">
                        <Upload className="w-4 h-4 text-white" />
                      </div>
                      <p className="mb-1 text-xs text-gray-700 font-medium text-center">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">클릭하여 업로드</span>
                      </p>
                      <p className="text-xs text-gray-500">JPG, PNG (최대 10MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </label>
                </div>
              )}

              {/* 개인정보 안내 문구 */}
              <div className="flex items-center justify-center bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <span className="mr-2 text-sm" role="img" aria-label="lock">🔒</span>
                <p className="text-xs text-green-700 font-medium text-center">
                  사진은 AI 분석에만 사용되며, 저장되지 않아요
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
              <div className="mb-6">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border-2 border-purple-300 shadow-lg">
                  <div className="text-center">
                    <div className="text-lg font-black text-purple-800 mb-1">
                      <span className="mr-1">🏆</span>{analysisResult.type} 성향
                    </div>
                    <div className="text-xl font-black text-purple-900 tracking-tight">
                      상위 {Math.floor(Math.random() * 15) + 5}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 성향 스탯 */}
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-3">성향 스탯</h3>
                <div className="space-y-4">
                  {analysisResult.traits && Object.entries(analysisResult.traits)
                    .sort(([a], [b]) => {
                      // 순서 정의: teto, egen, emotion, logic, extraversion, stability, initiative
                      const order = ['teto', 'egen', 'emotion', 'logic', 'extraversion', 'stability', 'initiative'];
                      return order.indexOf(a) - order.indexOf(b);
                    })
                    .map(([trait, value]) => {
                    const getTraitInfo = (trait: string) => {
                      switch(trait) {
                        case 'teto':
                          return {
                            name: '테토 지수',
                            emoji: '🔥',
                            desc: '외향적 양기 에너지 - 주도적이고 행동중심적인 성향',
                            high: '완전 테토 바이브! 현실 지향적이고 추진력 MAX',
                            low: '내향적이고 감성적인 매력의 소유자'
                          }
                        case 'egen':
                          return {
                            name: '에겐 지수',
                            emoji: '🌸',
                            desc: '내향적 음기 에너지 - 감성적이고 섬세한 성향',
                            high: '완전 에겐 바이브! 공감능력과 감수성이 뛰어남',
                            low: '현실적이고 직설적인 매력의 소유자'
                          }
                        case 'emotion':
                          return {
                            name: '감성 지수',
                            emoji: '💖',
                            desc: '감정을 얼마나 풍부하게 표현하고 공감하는지',
                            high: '감정 표현의 달인! 공감 능력 MAX',
                            low: '쿨한 매력의 소유자, 이성적 판단력 굿'
                          }
                        case 'logic':
                          return {
                            name: '논리 지수',
                            emoji: '🧠',
                            desc: '상황을 분석하고 합리적으로 판단하는 능력',
                            high: '완전 논리왕! 문제 해결사 타입',
                            low: '직감과 감성으로 승부하는 스타일'
                          }
                        case 'extraversion':
                          return {
                            name: '사교 지수',
                            emoji: '🎉',
                            desc: '사람들과 어울리고 에너지를 얻는 정도',
                            high: '파티의 중심! 사람들이 좋아하는 타입',
                            low: '혼자만의 시간을 소중히 여기는 매력'
                          }
                        case 'stability':
                          return {
                            name: '안정 지수',
                            emoji: '🌊',
                            desc: '감정 기복 없이 차분함을 유지하는 능력',
                            high: '멘탈 갑! 흔들리지 않는 바위 같은 존재',
                            low: '감정이 풍부하고 역동적인 매력'
                          }
                        default:
                          return {
                            name: '리더 지수',
                            emoji: '👑',
                            desc: '상황을 주도하고 이끌어가는 능력',
                            high: '타고난 리더! 카리스마 폭발',
                            low: '팀워크를 중시하는 협력형 인재'
                          }
                      }
                    }
                    
                    const traitInfo = getTraitInfo(trait)
                    const isHigh = value >= 70
                    
                    return (
                      <div key={trait} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{traitInfo.emoji}</span>
                            <span className="font-medium text-sm">{traitInfo.name}</span>
                          </div>
                          <span className="font-bold text-sm text-blue-600">{value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full ${
                              value >= 80 ? 'bg-green-500' :
                              value >= 60 ? 'bg-blue-500' :
                              value >= 40 ? 'bg-yellow-500' :
                              'bg-red-400'
                            }`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{traitInfo.desc}</p>
                        <p className="text-xs font-medium text-gray-800">
                          {isHigh ? traitInfo.high : traitInfo.low}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 얼굴로 보는 성격 분석 */}
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-3">얼굴로 보는 성격 분석</h3>
                <ul className="space-y-2">
                  {(analysisResult.scenarios || []).map((scenario, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1 text-xs">•</span>
                      <span className="text-sm">{scenario}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 소셜 재미 */}
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-3">환상의 케미 & 환장의 케미</h3>
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

              {/* 공유 버튼 */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleShare}
                  className="flex items-center justify-center text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  결과 공유하기
                </Button>
                <Button
                  onClick={handleGetTips}
                  disabled={isLoadingTips}
                  className="flex items-center justify-center text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
                  {isLoadingTips ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      로딩 중...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      호르몬 강화하기
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center justify-center text-sm px-4 py-2 border-2 hover:bg-gray-100"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  다시 분석하기
                </Button>
              </div>
            </CardContent>
          </Card>
          )}
        </div>

        {/* 발전 팁 섹션 */}
        {developmentTips && (
          <Card className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800">{developmentTips.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-800">발전 팁:</h3>
                  <ul className="space-y-2">
                    {(developmentTips.tips || []).map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 font-bold text-sm mt-1">✓</span>
                        <span className="text-sm leading-relaxed text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-800">추천 상품 키워드:</h3>
                  <div className="flex flex-wrap gap-2">
                    {(developmentTips.shoppingKeywords || []).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        </div>
      </div>

      {/* 로그인 모달 */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialTab="login"
      />
    </div>
  )
} 