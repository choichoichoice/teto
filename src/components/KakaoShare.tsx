'use client';

import { useState } from 'react';

interface KakaoShareProps {
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl: string;
  className?: string;
  children?: React.ReactNode;
}

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function KakaoShare({
  title,
  description,
  imageUrl,
  linkUrl,
  className = '',
  children
}: KakaoShareProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleKakaoShare = async () => {
    // 사용자 제안: 간단한 초기화 상태 체크
    if (!window.Kakao?.isInitialized()) {
      console.error('❌ 카카오 SDK가 초기화되지 않았습니다.');
      alert('카카오톡 공유 기능을 사용할 수 없습니다. 페이지를 새로고침 해주세요.');
      return;
    }

    setIsSharing(true);

    try {
      console.log('📱 카카오톡 공유 시작...');
      
      await window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: title,
          description: description,
          imageUrl: imageUrl || '/tetoman.png',
          link: {
            mobileWebUrl: linkUrl,
            webUrl: linkUrl,
          },
        },
        buttons: [
          {
            title: '결과 보기',
            link: {
              mobileWebUrl: linkUrl,
              webUrl: linkUrl,
            },
          },
        ],
      });
      
      console.log('🎉 카카오톡 공유 성공!');
      
    } catch (error) {
      console.error('❌ 카카오톡 공유 실패:', error);
      
      // 폴백 시스템
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: description,
            url: linkUrl,
          });
          console.log('✅ 웹 공유 성공');
        } catch (shareError) {
          console.log('웹 공유 취소됨');
          copyToClipboard();
        }
      } else {
        copyToClipboard();
      }
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(linkUrl);
      alert('📋 링크가 클립보드에 복사되었습니다!');
      console.log('✅ 클립보드 복사 성공');
    } catch (clipboardError) {
      console.log('클립보드 복사 실패');
      alert(`📝 링크를 수동으로 복사해주세요:\n${linkUrl}`);
    }
  };

  return (
    <button
      onClick={handleKakaoShare}
      disabled={isSharing}
      className={`
        bg-yellow-400 hover:bg-yellow-500 
        text-black font-bold py-2 px-4 rounded-lg
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isSharing ? (
        <span>공유 중...</span>
      ) : (
        children || (
          <span className="flex items-center gap-2">
            📱 카카오톡 공유
          </span>
        )
      )}
    </button>
  );
} 