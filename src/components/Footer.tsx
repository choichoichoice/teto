import { Heart, Github, Brain } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <>
             {/* 풋터 상단 광고 배너 - 모바일 강제 표시 */}
       <div className="w-full bg-blue-500 p-4 block" style={{ 
         position: 'relative',
         zIndex: 9999
       }}>
         <div className="w-full max-w-screen-sm mx-auto">
           {/* 🔍 모바일 강제 디버깅: 무조건 보이게 만들기 */}
           <div 
             className="w-full bg-green-300 border-4 border-blue-600 p-4 text-center block"
             style={{ 
               minHeight: '80px',
               fontSize: '16px',
               fontWeight: 'bold'
             }}
           >
            <div className="text-blue-800 mb-2">🚨 푸터 광고 영역 🚨</div>
            <ins 
              className="kakao_ad_area" 
              style={{ 
                display: "block !important", 
                minHeight: "50px", 
                width: "100%",
                maxWidth: "350px",
                margin: "0 auto"
              }}
              data-ad-unit="DAN-4I9yaFsLEaO37ij4"
              data-ad-width="350"
              data-ad-height="50"
              data-ad-responsive="true"
              data-ad-mobile="true"
            ></ins>
            <div className="text-blue-800 mt-2 text-sm">
              이 영역이 보이면 광고 영역 정상 / 안 보이면 CSS 문제
            </div>
          </div>
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