import Image from "next/image";
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Brain, Users, Sparkles, ArrowRight } from 'lucide-react'
import ParticlesBg from "@/components/ParticlesBg";
import AuthStatus from "@/components/AuthStatus";

import KakaoShare from "@/components/KakaoShare";
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* OAuth 상태 표시 컴포넌트 */}
      <Suspense fallback={null}>
        <AuthStatus />
      </Suspense>

      {/* 히어로 섹션 */}
      <div className="flex w-full justify-center my-4">
  <ins 
    className="kakao_ad_area" 
    style={{ display: "none" }}
    data-ad-unit="DAN-eS5pNSPkANAP1JnD"
    data-ad-width="320"
    data-ad-height="50"
  ></ins>
</div>
      <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <ParticlesBg />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-2 py-16">
          <div className="text-center max-w-sm mx-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                테토-에겐 분석기
              </span>
            </h1>
            <p className="text-sm sm:text-base mb-4 text-gray-200 leading-relaxed px-2">
              AI가 사진을 분석하여 테토-에겐 유형을 무료로 알려드립니다.
            </p>
            <div className="flex flex-col items-center space-y-3">
              <Button 
                size="sm" 
                asChild
                className="bg-white text-purple-600 hover:bg-gray-100 text-sm px-4 py-3 h-auto"
              >
                <Link href="/analyze" className="flex items-center space-x-2">
                  <Camera className="h-3 w-3" />
                  <span>무료 분석 시작</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-gray-300 mb-2">친구들과 함께 테스트해보세요!</p>
                <KakaoShare
                  title="🔮 테토-에겐 분석기 | AI 얼굴 분석"
                  description="나는 테토일까 에겐일까? AI가 사진으로 성격 유형을 분석해드려요! 무료 테스트 해보세요 ✨ #테토에겐 #성격분석"
                  imageUrl="/tetoman.png"
                  linkUrl={typeof window !== 'undefined' ? window.location.origin : 'https://teto.com'}
                />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 특징 섹션 */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 px-2">
              AI 테토-에겐 분석기로<br />
              무료로 당신의 고유 특성을 발견해보세요.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
            <Card className="text-center px-1 py-2 border-none shadow-sm">
              <CardHeader className="pb-1">
                <div className="mx-auto w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                  <Brain className="h-3 w-3 text-purple-600" />
                </div>
                <CardTitle className="text-sm font-semibold mb-1">AI 정밀 분석</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm text-gray-600 leading-tight">
                  AI로 얼굴 분석하여 테토-에겐 유형 판단
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center px-1 py-2 border-none shadow-sm">
              <CardHeader className="pb-1">
                <div className="mx-auto w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                  <Users className="h-3 w-3 text-blue-600" />
                </div>
                <CardTitle className="text-sm font-semibold mb-1">4가지 유형</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm text-gray-600 leading-tight">
                  테토남, 테토녀, 에겐남, 에겐녀로 구분
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center px-1 py-2 border-none shadow-sm">
              <CardHeader className="pb-1">
                <div className="mx-auto w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mb-1">
                  <Sparkles className="h-3 w-3 text-green-600" />
                </div>
                <CardTitle className="text-sm font-semibold mb-1">맞춤 추천</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm text-gray-600 leading-tight">
                  개인화된 상품과 팁 추천
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* 성격 유형 소개 섹션 */}
      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 px-2">
              4가지 테토-에겐 유형을 알아보세요
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              각 유형마다 고유한 특성과 매력이 있습니다
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1 sm:gap-2 max-w-sm mx-auto">
                        <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors p-1">
              <CardHeader className="text-center pb-0">
                <div className="flex justify-center mb-1">
                  <Image src="/tetoman.png" alt="테토남" width={60} height={60} className="w-6 h-6 sm:w-8 sm:h-8" style={{ width: "auto", height: "auto" }} />
                </div>
                <CardTitle className="text-blue-600 text-sm font-semibold mb-1">테토남</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-1">
                <CardDescription className="text-sm text-muted-foreground leading-tight text-center">
                  외향적 양기<br />
                  주도적이고 현실적
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-200 hover:border-pink-400 transition-colors p-1">
              <CardHeader className="text-center pb-0">
                <div className="flex justify-center mb-1">
                  <Image src="/tetowoman.png" alt="테토녀" width={60} height={60} className="w-6 h-6 sm:w-8 sm:h-8" style={{ width: "auto", height: "auto" }} />
                </div>
                <CardTitle className="text-pink-600 text-sm font-semibold mb-1">테토녀</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-1">
                <CardDescription className="text-sm text-muted-foreground leading-tight text-center">
                  외향적 양기<br />
                  당당하고 매력적
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors p-1">
              <CardHeader className="text-center pb-0">
                <div className="flex justify-center mb-1">
                  <Image src="/egenman.png" alt="에겐남" width={60} height={60} className="w-6 h-6 sm:w-8 sm:h-8" style={{ width: "auto", height: "auto" }} />
                </div>
                <CardTitle className="text-purple-600 text-sm font-semibold mb-1">에겐남</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-1">
                <CardDescription className="text-sm text-muted-foreground leading-tight text-center">
                  내향적 음기<br />
                  섬세하고 감성적
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-rose-200 hover:border-rose-400 transition-colors p-1">
              <CardHeader className="text-center pb-0">
                <div className="flex justify-center mb-1">
                  <Image src="/egenwoman.png" alt="에겐녀" width={60} height={60} className="w-6 h-6 sm:w-8 sm:h-8" style={{ width: "auto", height: "auto" }} />
                </div>
                <CardTitle className="text-rose-600 text-sm font-semibold mb-1">에겐녀</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-1">
                <CardDescription className="text-sm text-muted-foreground leading-tight text-center">
                  내향적 음기<br />
                  부드럽고 공감적
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* CTA 섹션 */}
      <section className="py-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-2 text-center">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 px-2">
            지금 바로 테토-에겐 유형을 무료로 알아보세요!
          </h2>
          <p className="text-sm mb-4 max-w-xs mx-auto leading-relaxed px-2">
            한 장의 사진으로 성격과 강점을 발견하세요.
          </p>
          <Button 
            size="sm" 
            asChild
            className="bg-white text-purple-600 hover:bg-gray-100 text-sm px-4 py-3 h-auto"
          >
            <Link href="/analyze" className="flex items-center space-x-2">
              <Camera className="h-3 w-3" />
              <span>무료 분석 시작</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </section>


    </div>
  );
}
