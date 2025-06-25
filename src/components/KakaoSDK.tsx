'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Kakao: any
  }
}

export default function KakaoSDK() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'
    script.integrity = 'sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfhD0+VqfJhAWCMnAKK/'
    script.crossOrigin = 'anonymous'
    script.async = true
    
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY
        if (kakaoKey) {
          window.Kakao.init(kakaoKey)
          console.log('카카오 SDK 초기화 완료:', window.Kakao.isInitialized())
        } else {
          console.error('카카오 앱 키가 설정되지 않았습니다.')
        }
      }
    }
    
    script.onerror = () => {
      console.error('카카오 SDK 로드 실패')
    }
    
    document.head.appendChild(script)
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return null
} 