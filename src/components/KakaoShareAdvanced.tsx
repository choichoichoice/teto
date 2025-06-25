'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function KakaoShareAdvanced() {
  const buttonRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const initKakaoButton = () => {
      if (!window.Kakao) {
        console.error('❌ Kakao SDK가 로드되지 않음');
        return;
      }

      if (!window.Kakao.isInitialized()) {
        console.error('❌ Kakao SDK가 초기화되지 않음');
        setTimeout(initKakaoButton, 500); // 0.5초 후 재시도
        return;
      }

      if (buttonRef.current) {
        console.log('🚀 카카오 고급 버튼 생성 중...');
        
        try {
          // 기존 버튼 제거
          buttonRef.current.innerHTML = '';
          
          window.Kakao.Share.createDefaultButton({
            container: buttonRef.current,
            objectType: 'feed',
            content: {
              title: '🔮 테토-에겐 분석기 | AI 얼굴 분석',
              description: '나는 테토일까 에겐일까? AI가 사진으로 성격 유형을 분석해드려요! 무료 테스트 해보세요 ✨ #테토에겐 #성격분석 #AI얼굴분석 #무료테스트',
              imageUrl: typeof window !== 'undefined' ? `${window.location.origin}/tetoman.png` : 'https://via.placeholder.com/640x640/6366f1/ffffff?text=TETO',
              link: {
                mobileWebUrl: typeof window !== 'undefined' ? window.location.origin : 'https://teto.com',
                webUrl: typeof window !== 'undefined' ? window.location.origin : 'https://teto.com',
              },
            },
            itemContent: {
              profileText: '테토-에겐 분석기',
              profileImageUrl: typeof window !== 'undefined' ? `${window.location.origin}/tetoman.png` : 'https://via.placeholder.com/40x40/6366f1/ffffff?text=T',
              titleImageUrl: typeof window !== 'undefined' ? `${window.location.origin}/tetoman.png` : 'https://via.placeholder.com/640x640/6366f1/ffffff?text=TETO',
              titleImageText: 'AI 얼굴 분석으로 성격 유형 알아보기',
              titleImageCategory: '성격 분석 테스트',
              items: [
                {
                  item: '테토남 👑',
                  itemOp: '주도적이고 현실적',
                },
                {
                  item: '테토녀 💎',
                  itemOp: '당당하고 매력적',
                },
                {
                  item: '에겐남 🌙',
                  itemOp: '섬세하고 감성적',
                },
                {
                  item: '에겐녀 🌸',
                  itemOp: '부드럽고 공감적',
                },
              ],
              sum: '내 유형은?',
              sumOp: '지금 무료 분석',
            },
            social: {
              likeCount: 12845,
              commentCount: 2341,
              sharedCount: 8927,
            },
            buttons: [
              {
                title: '무료 분석하기',
                link: {
                  mobileWebUrl: typeof window !== 'undefined' ? `${window.location.origin}/analyze` : 'https://teto.com/analyze',
                  webUrl: typeof window !== 'undefined' ? `${window.location.origin}/analyze` : 'https://teto.com/analyze',
                },
              },
              {
                title: '홈페이지 보기',
                link: {
                  mobileWebUrl: typeof window !== 'undefined' ? window.location.origin : 'https://teto.com',
                  webUrl: typeof window !== 'undefined' ? window.location.origin : 'https://teto.com',
                },
              },
            ],
          });
          
          console.log('✅ 카카오 고급 버튼 생성 성공!');
        } catch (error) {
          console.error('❌ 카카오 고급 버튼 생성 실패:', error);
          
          // 실패시 간단한 버튼
          if (buttonRef.current) {
            buttonRef.current.innerHTML = `
              <button class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors">
                <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png" alt="카카오톡 공유" class="w-6 h-6">
                카카오톡 공유하기 (에러)
              </button>
            `;
            
            buttonRef.current.onclick = () => {
              alert('카카오 버튼 생성 실패. 환경변수와 도메인 설정을 확인해주세요.');
              console.log('환경변수:', process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
            };
          }
        }
      }
    };

    // 초기화 시도
    const startInit = () => {
      if (typeof window !== 'undefined') {
        initKakaoButton();
      }
    };

    startInit();
  }, []);

  return (
    <div className="space-y-2">
      <div 
        ref={buttonRef}
        className="inline-block"
      >
        {/* 로딩 중 표시 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 font-medium rounded-lg">
          <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
          고급 버튼 로딩 중...
        </div>
      </div>
      
      <p className="text-xs text-gray-500">
        🎯 itemContent가 포함된 풍부한 카카오톡 공유
      </p>
    </div>
  );
} 