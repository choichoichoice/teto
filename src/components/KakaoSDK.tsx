'use client'

import { useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    Kakao: any
  }
}

export default function KakaoSDK() {
  useEffect(() => {
    const initKakao = () => {
      console.log('카카오 SDK 초기화 시도 중...')
      
      if (window.Kakao) {
        console.log('카카오 SDK 발견됨')
        
        if (!window.Kakao.isInitialized()) {
          const JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY
          console.log('카카오 키 존재 여부:', !!JAVASCRIPT_KEY)
          
          if (JAVASCRIPT_KEY) {
            try {
              window.Kakao.init(JAVASCRIPT_KEY)
              console.log('✅ 카카오 SDK 초기화 완료')
              console.log('SDK 버전:', window.Kakao.VERSION)
            } catch (error) {
              console.error('❌ 카카오 SDK 초기화 실패:', error)
            }
          } else {
            console.error('❌ 카카오 JavaScript 키가 설정되지 않았습니다.')
            console.log('환경변수 NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY를 확인해주세요.')
          }
        } else {
          console.log('카카오 SDK 이미 초기화됨')
        }
      } else {
        console.log('카카오 SDK가 아직 로드되지 않음')
      }
    }

    // SDK가 이미 로드된 경우
    if (window.Kakao) {
      initKakao()
    } else {
      console.log('카카오 SDK 로드 대기 중...')
      // SDK 로드를 기다림
      const checkKakao = setInterval(() => {
        if (window.Kakao) {
          initKakao()
          clearInterval(checkKakao)
        }
      }, 100)
      
      // 10초 후에도 로드되지 않으면 에러 표시
      setTimeout(() => {
        if (!window.Kakao) {
          console.error('❌ 카카오 SDK 로드 실패 - 10초 타임아웃')
          clearInterval(checkKakao)
        }
      }, 10000)
    }
  }, [])

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js"
      integrity="sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
} 