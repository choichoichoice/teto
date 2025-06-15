'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('인증 오류:', error)
          router.push('/')
          return
        }

        if (data.session) {
          // 인증 성공 시 홈페이지로 리다이렉트
          router.push('/')
        } else {
          // 인증 실패 시 홈페이지로 리다이렉트
          router.push('/')
        }
      } catch (error) {
        console.error('인증 처리 중 오류:', error)
        router.push('/')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  )
} 