'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface KakaoShareProps {
  title: string;
  description: string;
  imageUrl: string;
  webUrl: string;
  mobileWebUrl?: string;
}

export default function KakaoShare({
  title,
  description,
  imageUrl,
  webUrl,
  mobileWebUrl = webUrl
}: KakaoShareProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const initKakaoButton = () => {
      if (!window.Kakao) {
        console.error('Kakao SDK가 로드되지 않음');
        return;
      }

      if (!window.Kakao.isInitialized()) {
        console.error('Kakao SDK가 초기화되지 않음');
        return;
      }

      if (buttonRef.current) {
        console.log('카카오 버튼 생성 중...');
        
        try {
          // 기존 버튼이 있다면 제거
          buttonRef.current.innerHTML = '';
          
          window.Kakao.Share.createDefaultButton({
            container: buttonRef.current,
            objectType: 'feed',
            content: {
              title: title,
              description: description,
              imageUrl: imageUrl,
              link: {
                mobileWebUrl: mobileWebUrl,
                webUrl: webUrl,
              },
            },
            social: {
              likeCount: 286,
              commentCount: 45,
              sharedCount: 845,
            },
            buttons: [
              {
                title: '웹으로 보기',
                link: {
                  mobileWebUrl: mobileWebUrl,
                  webUrl: webUrl,
                },
              },
            ],
          });
          
          console.log('✅ 카카오 버튼 생성 완료');
        } catch (error) {
          console.error('❌ 카카오 버튼 생성 실패:', error);
          
          // 실패시 수동 버튼으로 대체
          if (buttonRef.current) {
            buttonRef.current.innerHTML = `
              <button class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors">
                <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png" alt="카카오톡 공유" class="w-6 h-6">
                카카오톡 공유하기 (수동)
              </button>
            `;
            
            buttonRef.current.onclick = () => {
              alert('카카오 버튼 생성에 실패했습니다. 콘솔을 확인해주세요.');
            };
          }
        }
      }
    };

    // SDK가 준비될 때까지 기다림
    const checkAndInit = () => {
      if (window.Kakao && window.Kakao.isInitialized()) {
        initKakaoButton();
      } else {
        setTimeout(checkAndInit, 100);
      }
    };

    checkAndInit();
  }, [title, description, imageUrl, webUrl, mobileWebUrl]);

  return (
    <div 
      ref={buttonRef}
      className="inline-block"
    >
      {/* 로딩 중 표시 */}
      <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-600 font-medium rounded-lg">
        <img 
          src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
          alt="카카오톡 공유 로딩 중"
          className="w-6 h-6 opacity-50"
        />
        로딩 중...
      </button>
    </div>
  );
} 