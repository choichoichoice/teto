'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Kakao: any
  }
}

export default function KakaoSDK() {
  useEffect(() => {
    // 이미 초기화된 경우 중복 방지
    if (window.Kakao?.isInitialized()) {
      console.log('✅ 카카오 SDK 이미 초기화됨')
      return
    }

    // 카카오 SDK 로드
    const loadKakaoSDK = () => {
      const script = document.createElement('script')
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js'
      script.crossOrigin = 'anonymous'
      script.async = true
      
      script.onload = () => {
        // 공식 문서 방식: SDK 로드 후 바로 초기화
        const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY
        
        if (kakaoKey) {
          // SDK를 초기화 합니다
          window.Kakao.init(kakaoKey)
          
          // SDK 초기화 여부를 판단합니다
          console.log('카카오 SDK 초기화 상태:', window.Kakao.isInitialized())
          
          if (window.Kakao.isInitialized()) {
            console.log('🎉 카카오 SDK 초기화 성공!')
            console.log('📋 SDK 버전:', window.Kakao.VERSION)
          }
        } else {
          console.error('❌ NEXT_PUBLIC_KAKAO_APP_KEY가 설정되지 않았습니다')
        }
      }
      
      script.onerror = () => {
        console.error('❌ 카카오 SDK 로드 실패')
      }
      
      document.head.appendChild(script)
    }

    // 카카오 SDK가 없으면 로드
    if (!window.Kakao) {
      loadKakaoSDK()
    }
  }, [])

  return null
} 