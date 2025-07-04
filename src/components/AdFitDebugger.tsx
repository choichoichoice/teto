'use client'

import { useEffect, useState } from 'react'

interface AdFitDebuggerProps {
  adUnit: string
  width: string
  height: string
}

export default function AdFitDebugger({ adUnit, width, height }: AdFitDebuggerProps) {
  const [debugInfo, setDebugInfo] = useState<{
    scriptLoaded: boolean
    isMobile: boolean
    userAgent: string
    adBlocked: boolean
    adElements: number
  }>({
    scriptLoaded: false,
    isMobile: false,
    userAgent: '',
    adBlocked: false,
    adElements: 0
  })

  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    const checkAdFitStatus = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const scriptLoaded = document.querySelector('script[src*="ba.min.js"]') !== null
      const adElements = document.querySelectorAll('.kakao_ad_area').length
      
      // 간단한 광고 차단 감지
      const testAd = document.createElement('div')
      testAd.innerHTML = '&nbsp;'
      testAd.className = 'adsbox'
      testAd.style.cssText = 'position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;'
      document.body.appendChild(testAd)
      
      const adBlocked = testAd.offsetHeight === 0
      document.body.removeChild(testAd)

      setDebugInfo({
        scriptLoaded,
        isMobile,
        userAgent: navigator.userAgent,
        adBlocked,
        adElements
      })
    }

    checkAdFitStatus()
    
    // 5초 후 다시 체크
    const timer = setTimeout(checkAdFitStatus, 5000)
    
    return () => clearTimeout(timer)
  }, [])

  // 개발 환경에서만 표시
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
      >
        AdFit 디버그
      </button>
      
      {showDebug && (
        <div className="absolute bottom-8 right-0 bg-white border border-gray-300 rounded p-3 shadow-lg w-80 text-xs">
          <div className="font-bold mb-2">AdFit 디버그 정보 ({adUnit})</div>
          <div className="space-y-1">
            <div>📱 모바일: {debugInfo.isMobile ? '✅ Yes' : '❌ No'}</div>
            <div>📜 스크립트 로드: {debugInfo.scriptLoaded ? '✅ Yes' : '❌ No'}</div>
            <div>🚫 광고 차단: {debugInfo.adBlocked ? '❌ Yes' : '✅ No'}</div>
            <div>🎯 광고 요소: {debugInfo.adElements}개</div>
            <div>🌐 User Agent: {debugInfo.userAgent.substring(0, 50)}...</div>
            <div>📏 크기: {width}x{height}</div>
          </div>
          
          <div className="mt-2 pt-2 border-t">
            <div className="font-bold mb-1">체크리스트:</div>
            <div className="space-y-1">
              <div>1. AdFit 대시보드에서 도메인 등록 확인</div>
              <div>2. 광고 단위 승인 상태 확인</div>
              <div>3. 한국 IP에서 접속 확인</div>
              <div>4. 모바일 브라우저 광고 차단 해제</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 