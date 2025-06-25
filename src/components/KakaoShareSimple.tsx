'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface KakaoShareSimpleProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  webUrl?: string;
  mobileWebUrl?: string;
}

export default function KakaoShareSimple({
  title = '🔮 테토-에겐 분석기 | AI 얼굴 분석',
  description = '나는 테토일까 에겐일까? AI가 사진으로 성격 유형을 분석해드려요! 무료 테스트 해보세요 ✨',
  imageUrl = '/tetoman.png',
  webUrl,
  mobileWebUrl
}: KakaoShareSimpleProps) {

  useEffect(() => {
    // URL 기본값 설정
    if (typeof window !== 'undefined') {
      webUrl = webUrl || window.location.origin;
      mobileWebUrl = mobileWebUrl || webUrl;
    }
  }, []);

  const shareKakao = () => {
    console.log('🚀 카카오톡 공유 시작 (sendDefault 방식)');
    
    if (!window.Kakao) {
      console.error('❌ Kakao SDK가 로드되지 않음');
      alert('카카오톡 SDK가 로드되지 않았습니다. 페이지를 새로고침해주세요.');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      console.error('❌ Kakao SDK가 초기화되지 않음');
      alert('카카오톡 SDK가 초기화되지 않았습니다. 환경변수를 확인해주세요.');
      return;
    }

    try {
      const finalWebUrl = webUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://teto.com');
      const finalMobileWebUrl = mobileWebUrl || finalWebUrl;
      const finalImageUrl = imageUrl.startsWith('/') && typeof window !== 'undefined' 
        ? `${window.location.origin}${imageUrl}` 
        : imageUrl;

      console.log('공유 데이터:', {
        title,
        description,
        imageUrl: finalImageUrl,
        webUrl: finalWebUrl,
        mobileWebUrl: finalMobileWebUrl
      });

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: title,
          description: description,
          imageUrl: finalImageUrl,
          link: {
            mobileWebUrl: finalMobileWebUrl,
            webUrl: finalWebUrl,
          },
        },
        buttons: [
          {
            title: '무료 분석 시작하기',
            link: {
              mobileWebUrl: finalMobileWebUrl + '/analyze',
              webUrl: finalWebUrl + '/analyze',
            },
          },
          {
            title: '홈페이지 보기',
            link: {
              mobileWebUrl: finalMobileWebUrl,
              webUrl: finalWebUrl,
            },
          },
        ],
      });

      console.log('✅ 카카오톡 공유 성공!');
    } catch (error) {
      console.error('❌ 카카오톡 공유 실패:', error);
      alert(`카카오톡 공유에 실패했습니다: ${error}`);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={shareKakao}
        className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
      >
        <img 
          src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
          alt="카카오톡 공유하기"
          className="w-6 h-6"
        />
        카카오톡으로 공유하기
      </button>
      
      <p className="text-xs text-gray-500">
        ⚡ sendDefault 방식 (간단한 버전)
      </p>
    </div>
  );
} 