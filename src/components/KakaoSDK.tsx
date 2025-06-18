'use client'

import { useEffect } from 'react'

export default function KakaoSDK() {
  useEffect(() => {
    // DOM이 완전히 로드된 후 카카오 SDK 초기화
    const initKakao = () => {
      if ((window as any).Kakao && !(window as any).Kakao.isInitialized()) {
        // 개발 환경에서는 테스트 앱 키, 운영에서는 실제 키 사용
        const kakaoKey = process.env.NODE_ENV === 'development' 
          ? 'demo_key_for_development' 
          : process.env.NEXT_PUBLIC_KAKAO_APP_KEY || 'demo_key_for_development'
        
        try {
          (window as any).Kakao.init(kakaoKey)
          console.log('✅ 카카오 SDK 초기화 완료')
        } catch (error) {
          console.warn('⚠️ 카카오 SDK 초기화 실패 (데모 모드):', error)
        }
      }
    }

    // 카카오 SDK가 로드될 때까지 기다린 후 초기화
    const checkKakaoInterval = setInterval(() => {
      if ((window as any).Kakao) {
        clearInterval(checkKakaoInterval)
        initKakao()
      }
    }, 100)

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      clearInterval(checkKakaoInterval)
    }
  }, [])

  return null // UI를 렌더링하지 않는 유틸리티 컴포넌트
} 