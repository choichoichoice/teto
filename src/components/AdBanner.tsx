'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface AdBannerProps {
  className?: string
  style?: React.CSSProperties
  slot?: string
}

export default function AdBanner({ 
  className, 
  style, 
  slot = "3552030876" 
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    // 이미 초기화되었거나 adRef가 없으면 실행하지 않음
    if (isInitialized.current || !adRef.current) return

    try {
      // AdSense 스크립트가 이미 로드되었는지 확인
      let script = document.querySelector('script[src*="adsbygoogle.js"]') as HTMLScriptElement
      
      if (!script) {
        // 스크립트가 없으면 동적으로 추가
        script = document.createElement('script')
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3689089253422901'
        script.async = true
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
      }

      // 스크립트 로딩 후 광고 초기화
      const initAd = () => {
        if (typeof window !== 'undefined' && !isInitialized.current) {
          try {
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
            isInitialized.current = true
          } catch (error) {
            console.error('AdSense 초기화 오류:', error)
          }
        }
      }

      // 짧은 딜레이 후 초기화 (스크립트 로딩 시간 확보)
      const timer = setTimeout(initAd, 100)
      
      return () => {
        clearTimeout(timer)
      }

    } catch (error) {
      console.error('AdSense 로딩 오류:', error)
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      isInitialized.current = false
    }
  }, [])

  return (
    <div className={className} style={style} ref={adRef}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3689089253422901"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
} 