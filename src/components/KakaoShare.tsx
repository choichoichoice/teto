'use client';

import { useEffect } from 'react';

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
  
  const shareToKakao = () => {
    console.log('카카오톡 공유 버튼 클릭됨');
    
    if (!window.Kakao) {
      console.error('Kakao SDK가 로드되지 않음');
      alert('카카오톡 SDK가 로드되지 않았습니다. 페이지를 새로고침해주세요.');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      console.error('Kakao SDK가 초기화되지 않음');
      alert('카카오톡 SDK가 초기화되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    console.log('카카오톡 공유 실행 중...');
    
    try {
      window.Kakao.Share.sendDefault({
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
      console.log('카카오톡 공유 성공');
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
      alert('카카오톡 공유에 실패했습니다. 브라우저 콘솔을 확인해주세요.');
    }
  };

  return (
    <button
      onClick={shareToKakao}
      className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors"
    >
      <img 
        src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
        alt="카카오톡 공유 보내기 버튼"
        className="w-6 h-6"
      />
      카카오톡 공유하기
    </button>
  );
} 