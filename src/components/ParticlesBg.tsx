'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Particles 컴포넌트를 동적으로 로드하여 SSR 문제 방지
const Particles = dynamic(() => import("react-tsparticles"), {
  ssr: false,
  loading: () => null
})

export default function ParticlesBg() {
  const [isClient, setIsClient] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 클라이언트 사이드가 아니거나 에러가 발생했다면 렌더링하지 않음
  if (!isClient || hasError) {
    return null
  }

  try {
    return (
      <Particles
        id="tsparticles"
        options={{
          fullScreen: { enable: false },
          background: { color: "transparent" },
          particles: {
            number: { 
              value: 30, // 모바일 성능을 위해 파티클 수 감소
              density: { enable: true, value_area: 800 }
            },
            color: { value: "#fff" },
            shape: { type: "circle" },
            opacity: { 
              value: 0.3, // 투명도 낮춤
              random: false,
              animation: { enable: false }
            },
            size: { 
              value: 2, // 크기 줄임
              random: true,
              animation: { enable: false }
            },
            move: { 
              enable: true, 
              speed: 0.5, // 속도 줄임
              direction: "none", 
              outModes: "out",
              bounce: false,
              attract: { enable: false }
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onHover: { enable: false }, // 모바일에서 호버 비활성화
              onClick: { enable: false }, // 클릭 이벤트 비활성화
              resize: true
            }
          },
          retina_detect: true
        }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      />
    )
  } catch (error) {
    console.error('ParticlesBg 렌더링 오류:', error)
    setHasError(true)
    return null
  }
} 