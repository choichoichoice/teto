'use client'

import { useEffect, useState } from 'react'

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
  const [isClient, setIsClient] = useState(false)
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    console.log('🎯 카카오 AdFit 광고 로드 시도:', { adUnit, width, height })

    // 스크립트 로딩 확인 및 광고 활성화
    const checkAndLoadAd = () => {
      try {
        // 카카오 AdFit 스크립트 확인
        const script = document.querySelector('script[src*="ba.min.js"]')
        
        if (script) {
          console.log('✅ 카카오 AdFit 스크립트 발견됨')
          
          // 광고 영역 활성화
          const adElements = document.querySelectorAll(`[data-ad-unit="${adUnit}"]`)
          adElements.forEach((element) => {
            if (element instanceof HTMLElement) {
              element.style.display = 'block'
            }
          })
          
          setAdLoaded(true)
          console.log(`🎉 광고 활성화 완료: ${adUnit}`)
        } else {
          console.warn('⚠️ 카카오 AdFit 스크립트를 찾을 수 없습니다')
          setAdError(true)
        }
      } catch (error) {
        console.error('❌ 광고 로드 중 오류:', error)
        setAdError(true)
      }
    }

    // 약간의 지연 후 광고 로드 시도
    const timer = setTimeout(checkAndLoadAd, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [isClient, adUnit, width, height])

  // 클라이언트 렌더링이 완료되기 전에는 placeholder 표시
  if (!isClient) {
    return (
      <div 
        className={className} 
        style={style}
      >
        <div
          style={{ 
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '12px'
          }}
        >
          광고 준비 중...
        </div>
      </div>
    )
  }

  return (
    <div className={className} style={style} suppressHydrationWarning>
      <ins 
        className="kakao_ad_area"
        style={{ 
          display: adLoaded ? 'block' : 'none',
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: adError ? '#fff3cd' : '#f8f9fa',
          border: `1px solid ${adError ? '#ffeaa7' : '#e9ecef'}`,
          textAlign: 'center',
          lineHeight: `${height}px`,
          color: adError ? '#856404' : '#999',
          fontSize: '12px'
        }}
        data-ad-unit={adUnit}
        data-ad-width={width}
        data-ad-height={height}
      >
        {adError ? '광고 로드 오류' : (adLoaded ? '' : '광고 로딩 중...')}
      </ins>
      
      {/* 광고 로드 실패 시 대체 콘텐츠 */}
      {adError && (
        <div style={{ 
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '11px',
          textAlign: 'center',
          padding: '10px'
        }}>
          광고 준비 중입니다<br/>
          <small style={{ color: '#999' }}>곧 정상 서비스될 예정입니다</small>
        </div>
      )}
    </div>
  )
} 