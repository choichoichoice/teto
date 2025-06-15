'use client'

import { useState, useEffect } from 'react'
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
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            테토-에겐 성격 분석
          </h1>
          <p className="text-3xl md:text-4xl text-gray-200">
            사진을 업로드하여 AI가 분석하는 당신의 성격 유형을 무료로 확인해보세요.
          </p>
        </div>

        {/* 메인 레이아웃: 사이드 광고 + 중앙 콘텐츠 */}
        <div className="flex gap-12 max-w-full mx-auto">
          {/* 왼쪽 사이드 광고 */}
          <div className="hidden xl:block flex-shrink-0">
            <div className="space-y-8">
              <AdBanner position="vertical" className="w-80 h-[1200px]" />
              <AdBanner position="vertical" className="w-80 h-[800px]" />
              <AdBanner position="vertical" className="w-80 h-[600px]" />
            </div>
          </div>

          {/* 중앙 메인 콘텐츠 */}
          <div className="flex-1 max-w-5xl mx-auto xl:mx-0">

        {/* 이미지 업로드 섹션 */}
        <Card className="mb-12 p-10 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="pt-0">
            <div className="flex flex-col items-center space-y-10">
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
                <div className="w-full max-w-6xl">
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                      <Camera className="w-10 h-10 text-purple-600" />
                      사진 업로드
                    </h2>
                    <div className="w-[475px] mx-auto">
                      <p className="text-2xl text-gray-600 leading-relaxed">
                        얼굴이 잘 보이는 사진을 업로드해주세요.<br />
                        정면 사진이 가장 정확한 분석 결과를 제공합니다.
                      </p>
                    </div>
                  </div>
                  
                  <label className="group relative flex flex-col items-center justify-center w-full h-[28rem] border-3 border-dashed border-purple-300 rounded-3xl cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:border-purple-400 hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex flex-col items-center justify-center pt-8 pb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <p className="mb-4 text-2xl text-gray-700 font-medium">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                      </p>
                      <p className="text-xl text-gray-500">PNG, JPG 또는 JPEG (최대 10MB)</p>
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
              <div className="flex items-center justify-center bg-green-50 px-8 py-6 rounded-2xl border border-green-200">
                <span className="mr-4 text-3xl" role="img" aria-label="lock">🔒</span>
                <p className="text-2xl text-green-700 font-medium text-center">
                  사진은 AI 분석에만 사용되며, 서버에 절대 저장되지 않아요
                </p>
              </div>

              {selectedImage && !analysisResult && (
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  size="lg"
                  className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-3xl px-16 py-10 h-auto rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-4 h-10 w-10 animate-spin" />
                        AI가 열심히 분석 중...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-4 h-10 w-10" />
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
                <CardTitle className="text-center text-5xl md:text-6xl">
                  {analysisResult.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* 핵심 정체성 */}
                <div className="text-center mb-12">
                  <div className="flex flex-col items-center mb-6">
                    <Image
                      src={
                        analysisResult.type === '테토남' ? '/tetoman.png'
                        : analysisResult.type === '테토녀' ? '/tetowoman.png'
                        : analysisResult.type === '에겐남' ? '/egenman.png'
                        : '/egenwoman.png'
                      }
                      alt={analysisResult.type}
                      width={180}
                      height={180}
                      className="mb-4"
                    />
                    <h2 className="text-6xl font-bold mb-4">
                      {analysisResult.type} {analysisResult.emoji}
                    </h2>
                    <p className="text-3xl text-gray-600 mb-4">
                      {analysisResult.summary}
                    </p>
                    <p className="text-2xl text-gray-500">
                      신뢰도: {analysisResult.confidence}%
                    </p>
                  </div>
                </div>

              {/* 성향 스탯 */}
              <div className="mb-12">
                <h3 className="text-4xl font-semibold mb-6">성향 스탯</h3>
                <div className="space-y-6">
                  {analysisResult.traits && Object.entries(analysisResult.traits).map(([trait, value]) => (
                    <div key={trait} className="space-y-3">
                      <div className="flex justify-between text-2xl">
                        <span className="font-medium">
                          {trait === 'emotion' ? '감성' :
                           trait === 'logic' ? '이성' :
                           trait === 'extraversion' ? '외향성' :
                           trait === 'stability' ? '안정성' :
                           '주도력'}
                        </span>
                        <span>{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-blue-600 h-4 rounded-full"
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 맞춤 해설 */}
              <div className="mb-12">
                <h3 className="text-4xl font-semibold mb-6">나를 위한 맞춤 해설서</h3>
                <ul className="space-y-4">
                  {(analysisResult.scenarios || []).map((scenario, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-blue-500 mt-1 text-2xl">•</span>
                      <span className="text-2xl">{scenario}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 행동 유도 */}
              <div className="mb-12">
                <h3 className="text-4xl font-semibold mb-6">오늘의 매력 강화 미션</h3>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-blue-800 text-2xl">{analysisResult.dailyMission}</p>
                </div>
              </div>

              {/* 소셜 재미 */}
              <div className="mb-12">
                <h3 className="text-4xl font-semibold mb-6">환상의 케미 & 환장의 케미</h3>
                <div className="space-y-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-3 text-2xl">
                      환상의 케미: {analysisResult.chemistry.best.type}
                    </h4>
                    <p className="text-green-700 text-2xl">{analysisResult.chemistry.best.reason}</p>
                  </div>
                  <div className="bg-red-50 p-6 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-3 text-2xl">
                      환장의 케미: {analysisResult.chemistry.worst.type}
                    </h4>
                    <p className="text-red-700 text-2xl">{analysisResult.chemistry.worst.reason}</p>
                  </div>
                </div>
              </div>

              {/* 공유 버튼 */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={handleShare}
                  className="flex items-center justify-center text-2xl px-10 py-8 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Share2 className="mr-3 h-8 w-8" />
                  결과 공유하기
                </Button>
                <Button
                  onClick={handleGetTips}
                  disabled={isLoadingTips}
                  className="flex items-center justify-center text-2xl px-10 py-8 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
                  {isLoadingTips ? (
                    <>
                      <Loader2 className="mr-3 h-8 w-8 animate-spin" />
                      로딩 중...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-3 h-8 w-8" />
                      호르몬 강화하기
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center justify-center text-2xl px-10 py-8 border-2 hover:bg-gray-100"
                >
                  <RefreshCw className="mr-3 h-8 w-8" />
                  다시 분석하기
                </Button>
              </div>
            </CardContent>
          </Card>
          )}
        </div>

        {/* 발전 팁 섹션 */}
        {developmentTips && (
          <Card className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-3xl">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <span className="text-blue-800">{developmentTips.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-semibold mb-6 text-gray-800">발전 팁:</h3>
                  <ul className="space-y-6">
                    {(developmentTips.tips || []).map((tip, index) => (
                      <li key={index} className="flex items-start space-x-4">
                        <span className="text-green-500 font-bold text-3xl mt-1">✓</span>
                        <span className="text-2xl leading-relaxed text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-3xl font-semibold mb-6 text-gray-800">추천 상품 키워드:</h3>
                  <div className="flex flex-wrap gap-4">
                    {(developmentTips.shoppingKeywords || []).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-8 py-4 bg-purple-100 text-purple-800 rounded-full text-xl font-medium border border-purple-200"
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

          {/* 오른쪽 사이드 광고 */}
          <div className="hidden xl:block flex-shrink-0">
            <div className="space-y-8">
              <AdBanner position="vertical" className="w-80 h-[1200px]" />
              <AdBanner position="vertical" className="w-80 h-[800px]" />
              <AdBanner position="vertical" className="w-80 h-[600px]" />
            </div>
          </div>
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