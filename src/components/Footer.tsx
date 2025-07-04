import { Heart, Github, Brain } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <>
                    {/* 풋터 상단 광고 배너 - CSS 무시 강제 표시 */}
        <div style={{ 
          width: '100vw',
          backgroundColor: '#3b82f6',
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
              backgroundColor: '#bbf7d0',
              border: '4px solid #2563eb',
              padding: '16px',
              textAlign: 'center',
              display: 'block',
              minHeight: '100px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1e40af',
              boxSizing: 'border-box'
            }}>
              <div style={{ marginBottom: '10px' }}>🚨 푸터 광고 영역 🚨</div>
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
                data-ad-unit="DAN-4I9yaFsLEaO37ij4"
                data-ad-width="350"
                data-ad-height="50"
                data-ad-responsive="true"
                data-ad-mobile="true"
              ></ins>
              <div style={{ marginTop: '10px', fontSize: '14px' }}>
                이 파란 영역이 보이면 CSS 정상!
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