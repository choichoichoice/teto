import { Heart, Github, Brain } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 정보 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <Brain className="h-16 w-16 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">테토-에겐 분석기</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              사진으로 알아보는 당신의 성격 유형! 테토남, 테토녀, 에겐남, 에겐녀 중 
              어디에 가까운지 AI가 분석해드립니다.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>by ALLCRLF</span>
            </div>
          </div>

          {/* 서비스 링크 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">서비스</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/analyze" className="text-gray-600 hover:text-purple-600 transition-colors">
                  성격 분석하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 지원 링크 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">지원</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-purple-600 transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-purple-600 transition-colors">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-purple-600 transition-colors">
                  개인정보처리방침 및 이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 테토-에겐 분석기. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link 
              href="https://github.com" 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 