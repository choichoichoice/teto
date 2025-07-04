import { Heart, Github, Brain } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <>
      {/* 풋터 상단 광고 배너 */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="flex w-full justify-center py-2" suppressHydrationWarning>
          <ins 
            className="kakao_ad_area" 
            style={{ display: "none" }}
            data-ad-unit="DAN-4I9yaFsLEaO37ij4"
            data-ad-width="320"
            data-ad-height="50"
            data-ad-responsive="true"
            data-ad-mobile="true"
          ></ins>
        </div>
      </div>
      
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-2 py-4">
          <div className="grid grid-cols-1 gap-3">
            {/* 브랜드 정보 */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-bold text-gray-900">테토-에겐 분석기</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                AI가 사진으로 테토-에겐 유형을 분석해드립니다.
              </p>
              <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                <span>Made with</span>
                <Heart className="h-3 w-3 text-red-500" />
                <span>by ALLCRLF</span>
              </div>
            </div>

            {/* 링크들 */}
            <div className="flex justify-center space-x-4">
              <Link href="/analyze" className="text-xs text-gray-600 hover:text-purple-600 transition-colors">
                분석하기
              </Link>
              <Link href="/faq" className="text-xs text-gray-600 hover:text-purple-600 transition-colors">
                FAQ
              </Link>
              <Link href="/contact" className="text-xs text-gray-600 hover:text-purple-600 transition-colors">
                문의
              </Link>
              <Link href="/privacy" className="text-xs text-gray-600 hover:text-purple-600 transition-colors">
                약관
              </Link>
            </div>
          </div>

          <div className="border-t mt-2 pt-2 flex justify-center items-center">
            <p className="text-gray-500 text-xs">
              © 2024 테토-에겐 분석기
            </p>
          </div>
        </div>
      </footer>
    </>
  )
} 