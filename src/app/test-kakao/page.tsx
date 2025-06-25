'use client';

import { useEffect, useState } from 'react';
import KakaoShare from '@/components/KakaoShare';

export default function TestKakaoPage() {
  const [kakaoStatus, setKakaoStatus] = useState<string>('확인 중...');

  useEffect(() => {
    const checkKakaoStatus = () => {
      if (typeof window !== 'undefined') {
        if (window.Kakao) {
          if (window.Kakao.isInitialized()) {
            setKakaoStatus('✅ 카카오 SDK 초기화 완료');
          } else {
            setKakaoStatus('⚠️ 카카오 SDK 로드됨, 초기화 대기 중...');
          }
        } else {
          setKakaoStatus('❌ 카카오 SDK 로드되지 않음');
        }
      }
    };

    // 초기 체크
    checkKakaoStatus();

    // 주기적으로 상태 체크
    const interval = setInterval(checkKakaoStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const testKakaoDirectly = () => {
    console.log('직접 테스트 시작');
    
    if (!window.Kakao) {
      alert('카카오 SDK가 로드되지 않았습니다.');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      alert('카카오 SDK가 초기화되지 않았습니다.');
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '테스트 공유',
        description: '카카오톡 공유 테스트입니다.',
        imageUrl: 'https://via.placeholder.com/400x300/4a90e2/ffffff?text=TEST',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">카카오톡 공유 테스트</h1>
      
      <div className="space-y-6">
        {/* 상태 확인 */}
        <div className="p-4 border rounded-lg bg-gray-50">
          <h2 className="font-semibold mb-2">카카오 SDK 상태</h2>
          <p className="text-sm">{kakaoStatus}</p>
          
          <div className="mt-4 text-xs space-y-1 text-gray-600">
            <p>• 브라우저 개발자 도구(F12) → Console 탭에서 로그 확인</p>
            <p>• 카카오 개발자센터에서 도메인 등록 확인 필요</p>
            <p>• NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY 환경변수 확인</p>
          </div>
        </div>

        {/* 컴포넌트 테스트 */}
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-4">KakaoShare 컴포넌트 테스트</h2>
          <KakaoShare
            title="테토-에겐 분석기 테스트"
            description="컴포넌트를 통한 카카오톡 공유 테스트입니다."
            imageUrl="https://via.placeholder.com/400x300/6366f1/ffffff?text=Component+Test"
            webUrl={typeof window !== 'undefined' ? window.location.href : ''}
          />
        </div>

        {/* 직접 테스트 */}
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-4">직접 API 호출 테스트</h2>
          <button
            onClick={testKakaoDirectly}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            직접 카카오 API 호출
          </button>
        </div>

        {/* 환경 정보 */}
        <div className="p-4 border rounded-lg bg-yellow-50">
          <h2 className="font-semibold mb-2">체크리스트</h2>
          <ul className="text-sm space-y-1">
            <li>□ .env.local에 NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY 설정</li>
            <li>□ 카카오 개발자센터에서 JavaScript 키 발급</li>
            <li>□ 카카오 개발자센터 플랫폼 설정에서 도메인 등록 (localhost:3000)</li>
            <li>□ 브라우저 콘솔에서 에러 메시지 확인</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 