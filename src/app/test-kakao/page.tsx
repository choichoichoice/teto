'use client';

import { useEffect, useState } from 'react';
import KakaoShare from '@/components/KakaoShare';
import KakaoShareAdvanced from '@/components/KakaoShareAdvanced';
import KakaoShareSimple from '@/components/KakaoShareSimple';

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
          
          {/* 환경변수 직접 확인 */}
          <div className="mt-4 p-3 bg-white rounded border">
            <h3 className="font-medium text-sm mb-2">🔍 실시간 디버깅</h3>
            <div className="text-xs space-y-1">
              <p><strong>환경변수 존재:</strong> {process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY ? '✅ 있음' : '❌ 없음'}</p>
              <p><strong>키 길이:</strong> {process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.length || 0}자</p>
              <p><strong>키 전체:</strong> <code className="bg-gray-100 px-1 rounded text-xs">{process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY || '없음'}</code></p>
              <p><strong>예상 키 일치:</strong> {process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY === '61b9975f47847e33120f984735ebc7a7' ? '✅ 맞음' : '❌ 다름'}</p>
              <p><strong>window.Kakao 존재:</strong> {typeof window !== 'undefined' && window.Kakao ? '✅ 있음' : '❌ 없음'}</p>
              <p><strong>초기화 상태:</strong> {typeof window !== 'undefined' && window.Kakao && window.Kakao.isInitialized ? window.Kakao.isInitialized() ? '✅ 완료' : '❌ 미완료' : '확인불가'}</p>
              {typeof window !== 'undefined' && window.Kakao && (
                <p><strong>SDK 버전:</strong> {window.Kakao.VERSION || '알 수 없음'}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-xs space-y-1 text-gray-600">
            <p>• 브라우저 개발자 도구(F12) → Console 탭에서 로그 확인</p>
            <p>• 카카오 개발자센터에서 도메인 등록 확인 필요</p>
          </div>
        </div>

        {/* 컴포넌트 테스트 */}
        <div className="p-4 border rounded-lg space-y-4">
          <div>
            <h2 className="font-semibold mb-2">기본 KakaoShare 컴포넌트</h2>
            <KakaoShare
              title="테토-에겐 분석기 테스트"
              description="컴포넌트를 통한 카카오톡 공유 테스트입니다."
              imageUrl="https://via.placeholder.com/400x300/6366f1/ffffff?text=Component+Test"
              webUrl={typeof window !== 'undefined' ? window.location.href : ''}
            />
          </div>
          
          <div>
            <h2 className="font-semibold mb-2">고급 KakaoShare 컴포넌트 (itemContent 포함)</h2>
            <KakaoShareAdvanced />
          </div>
          
          <div>
            <h2 className="font-semibold mb-2">⚡ 간단한 KakaoShare (sendDefault 방식)</h2>
            <KakaoShareSimple />
          </div>
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

        {/* 강제 초기화 버튼 */}
        <div className="p-4 border rounded-lg bg-red-50">
          <h2 className="font-semibold mb-2">🚨 긴급 해결책</h2>
          <div className="space-x-2 space-y-2">
            <button
              onClick={() => {
                const expectedKey = '61b9975f47847e33120f984735ebc7a7';
                const actualKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
                
                console.log('=== 키 비교 ===');
                console.log('예상 키:', expectedKey);
                console.log('실제 키:', actualKey);
                console.log('일치 여부:', expectedKey === actualKey);
                
                if (window.Kakao) {
                  try {
                    // 직접 키 사용해서 초기화
                    window.Kakao.init(expectedKey);
                    console.log('✅ 직접 키로 초기화 성공');
                    alert('직접 키로 초기화 완료! 이제 공유 버튼을 눌러보세요.');
                  } catch (error) {
                    console.error('❌ 직접 키로 초기화 실패:', error);
                    alert(`초기화 실패: ${error}`);
                  }
                } else {
                  alert('카카오 SDK가 로드되지 않았습니다.');
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              🔧 직접 키로 강제 초기화
            </button>
          
            <button
              onClick={() => {
                console.log('=== 디버깅 정보 ===');
                console.log('환경변수:', process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
                console.log('window.Kakao:', window.Kakao);
                console.log('초기화 상태:', window.Kakao?.isInitialized());
                alert('콘솔을 확인해주세요! (F12 → Console)');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              콘솔에 전체 정보 출력
            </button>
          </div>
        </div>

        {/* 환경 정보 */}
        <div className="p-4 border rounded-lg bg-yellow-50">
          <h2 className="font-semibold mb-2">📋 자주 발생하는 문제들</h2>
          <ul className="text-sm space-y-2">
            <li><strong>1. 환경변수 문제:</strong> .env.local에서 NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY=실제키값 (공백없이!)</li>
            <li><strong>2. 도메인 미등록:</strong> 카카오 개발자센터 → 앱 → 플랫폼 → 웹 → http://localhost:3000 추가</li>
            <li><strong>3. 잘못된 키:</strong> JavaScript 키 (네이티브 앱 키가 아님!)</li>
            <li><strong>4. 브라우저 캐시:</strong> Ctrl+Shift+R로 강력 새로고침</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 