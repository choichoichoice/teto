'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface KakaoShareProps {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export default function KakaoShare({ title, description, imageUrl, url }: KakaoShareProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkKakao = () => {
      if (window.Kakao && window.Kakao.isInitialized()) {
        setIsReady(true);
        console.log('✅ 카카오 SDK 준비 완료');
      } else {
        console.log('⏳ 카카오 SDK 대기 중...');
        setTimeout(checkKakao, 100);
      }
    };

    checkKakao();
  }, []);

  const handleShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert('카카오 SDK가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description,
          imageUrl,
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
        buttons: [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
        ],
      });
      console.log('✅ 카카오톡 공유 성공');
    } catch (error) {
      console.error('❌ 카카오톡 공유 실패:', error);
      alert('공유에 실패했습니다.');
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={!isReady}
      className={`inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all ${
        isReady
          ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      <img 
        src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
        alt="카카오톡 공유하기"
        className="w-6 h-6"
      />
      {isReady ? '카카오톡 공유하기' : '로딩 중...'}
    </button>
  );
} 