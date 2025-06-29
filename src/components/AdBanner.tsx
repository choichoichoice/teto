'use client'

import { useEffect, useRef } from 'react'

interface AdBannerProps {
  className?: string
  style?: React.CSSProperties
  adUnit?: string
  width?: string
  height?: string
}

export default function AdBanner({ 
  className, 
  style, 
  adUnit = "DAN-IpeTcqACgSzPdCbT",
  width = "320",
  height = "100"
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    // 이미 초기화되었거나 adRef가 없으면 실행하지 않음
    if (isInitialized.current || !adRef.current) return

    try {
      // 카카오 AdFit 스크립트가 이미 로드되었는지 확인
      let script = document.querySelector('script[src*="ba.min.js"]') as HTMLScriptElement
      
      if (!script) {
        // 스크립트가 없으면 동적으로 추가
        script = document.createElement('script')
        script.src = '//t1.daumcdn.net/kas/static/ba.min.js'
        script.async = true
        script.type = 'text/javascript'
        document.head.appendChild(script)
      }

      isInitialized.current = true

    } catch (error) {
      console.error('카카오 AdFit 로딩 오류:', error)
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      isInitialized.current = false
    }
  }, [])

  return (
    <div className={className} style={style} ref={adRef}>
      <ins 
        className="kakao_ad_area"
        style={{ display: 'none' }}
        data-ad-unit={adUnit}
        data-ad-width={width}
        data-ad-height={height}
      />
    </div>
  )
} 