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
    // DOM이 완전히 로드된 후 카카오 SDK 초기화
    const initKakao = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        // 여기에 실제 JavaScript 키를 넣어주세요
        const JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY
        if (JAVASCRIPT_KEY) {
          window.Kakao.init(JAVASCRIPT_KEY)
          console.log('Kakao SDK 초기화 완료')
        } else {
          console.error('카카오 JavaScript 키가 설정되지 않았습니다.')
        }
      }
    }

    // SDK가 이미 로드된 경우
    if (window.Kakao) {
      initKakao()
    } else {
      // SDK 로드를 기다림
      const checkKakao = setInterval(() => {
        if (window.Kakao) {
          initKakao()
          clearInterval(checkKakao)
        }
      }, 100)
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