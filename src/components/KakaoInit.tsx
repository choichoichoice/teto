'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function KakaoInit() {
  useEffect(() => {
    // 사용자 제안 방식: 앱 시작시 딱 한 번만 초기화
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_API_KEY;
    
    console.log('🔑 카카오 앱 키 확인:', !!kakaoKey);
    
    const initKakao = () => {
      if (window.Kakao && kakaoKey && !window.Kakao.isInitialized()) {
        try {
          // SDK를 초기화 합니다
          window.Kakao.init(kakaoKey);
          
          // SDK 초기화 여부를 판단합니다
          console.log('✅ 카카오 SDK 초기화 성공!');
          console.log('📋 SDK 버전:', window.Kakao.VERSION);
          console.log('🔑 초기화 상태:', window.Kakao.isInitialized());
        } catch (error) {
          console.error('❌ 카카오 SDK 초기화 실패:', error);
        }
      } else if (!kakaoKey) {
        console.error('❌ NEXT_PUBLIC_KAKAO_API_KEY가 설정되지 않았습니다');
        console.log('💡 .env.local 파일을 확인해주세요');
      }
    };

    // SDK 로드 완료까지 대기
    if (window.Kakao) {
      initKakao();
    } else {
      console.log('⏳ 카카오 SDK 로드 대기 중...');
      
      const checkKakao = setInterval(() => {
        if (window.Kakao) {
          initKakao();
          clearInterval(checkKakao);
        }
      }, 100);
      
      // 10초 후 타임아웃
      setTimeout(() => {
        clearInterval(checkKakao);
        console.warn('⚠️ 카카오 SDK 로드 타임아웃');
      }, 10000);
    }
  }, []); // 빈 배열로 앱 시작시 한 번만 실행

  return null;
} 