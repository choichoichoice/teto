'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share2, ArrowLeft } from 'lucide-react'
import { AnalysisResult, DevelopmentTip } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import ParticlesBg from "@/components/ParticlesBg"

export default function SharePage() {
  const params = useParams()
  const shareId = params.id as string
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [developmentTips, setDevelopmentTips] = useState<DevelopmentTip | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSharedResult = async () => {
      try {
        // 1단계: 임시 공유인지 확인 (temp_로 시작하는 경우)
        if (shareId && shareId.startsWith('temp_')) {
          console.log('🔍 임시 공유 데이터 로딩 시도...')
          
          const tempData = localStorage.getItem(`temp_share_${shareId}`)
          if (tempData) {
            const shareData = JSON.parse(tempData)
            
            // 만료 시간 확인
            const expiresAt = new Date(shareData.expiresAt)
            if (new Date() > expiresAt) {
              // 만료된 데이터 삭제
              localStorage.removeItem(`temp_share_${shareId}`)
              throw new Error('공유 링크가 만료되었습니다. (24시간 제한)')
            }
            
            setAnalysisResult(shareData.analysisResult)
            setDevelopmentTips(shareData.developmentTips)
            setImagePreview(shareData.imagePreview)
            console.log('✅ 임시 공유 데이터 로딩 완료')
            return
          } else {
            throw new Error('임시 공유 데이터를 찾을 수 없습니다.')
          }
        }
        
        // 2단계: 정규 데이터베이스 공유 시도
        const response = await fetch(`/api/share?id=${shareId}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '결과를 불러올 수 없습니다.')
        }

        const data = await response.json()
        setAnalysisResult(data.analysisResult)
        setDevelopmentTips(data.developmentTips)
        setImagePreview(data.imagePreview)
        console.log('✅ 데이터베이스 공유 데이터 로딩 완료')
      } catch (error) {
        console.error('공유 결과 로딩 오류:', error)
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (shareId) {
      fetchSharedResult()
    }
  }, [shareId])

  const getTypeColor = (type: string) => {
    switch (type) {
      case '테토남': return 'border-blue-400 bg-blue-50'
      case '테토녀': return 'border-pink-400 bg-pink-50'
      case '에겐남': return 'border-purple-400 bg-purple-50'
      case '에겐녀': return 'border-rose-400 bg-rose-50'
      default: return 'border-gray-400 bg-gray-50'
    }
  }

  const handleShare = async () => {
    const shareText = `테토-에겐 분석 결과: ${analysisResult?.type} ${analysisResult?.emoji}`
    
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
      navigator.clipboard.writeText(window.location.href)
      alert('링크가 클립보드에 복사되었습니다!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <ParticlesBg />
        <div className="relative text-white text-3xl">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <ParticlesBg />
        <div className="relative text-center text-white">
          <h1 className="text-4xl font-bold mb-4">오류가 발생했습니다</h1>
          <p className="text-2xl mb-8">{error}</p>
          <Link href="/">
            <Button className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-8 py-4">
              <ArrowLeft className="mr-2 h-6 w-6" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <ParticlesBg />
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              공유된 분석 결과
            </h1>
            <Link href="/">
              <Button variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20 text-xl px-6 py-3">
                <ArrowLeft className="mr-2 h-5 w-5" />
                새로운 분석하기
              </Button>
            </Link>
          </div>

          {/* 분석 결과 섹션 */}
          {analysisResult && (
            <Card className={`mb-8 border-2 ${getTypeColor(analysisResult.type)}`}>
              <CardHeader>
                <CardTitle className="text-center text-5xl md:text-6xl">
                  {analysisResult.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* 핵심 정체성 */}
                <div className="text-center mb-12">
                  <div className="flex flex-col items-center mb-6">
                    {imagePreview && (
                      <Image
                        src={imagePreview}
                        alt="분석된 이미지"
                        width={200}
                        height={200}
                        className="rounded-lg object-cover mb-4"
                      />
                    )}
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
                <div className="flex justify-center">
                  <Button
                    onClick={handleShare}
                    className="flex items-center justify-center text-2xl px-10 py-8 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Share2 className="mr-3 h-8 w-8" />
                    이 결과 공유하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 발전 팁 섹션 */}
          {developmentTips && (
            <Card className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-3xl">
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
      </div>
    </div>
  )
} 