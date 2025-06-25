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
    if (!window.Kakao?.isInitialized()) {
      console.error('카카오 SDK가 초기화되지 않았습니다.');
      alert('카카오톡 공유 기능을 사용할 수 없습니다.');
      return;
    }

    setIsSharing(true);

    try {
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
      console.log('카카오톡 공유 성공!');
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
      // 폴백: 웹 공유 또는 링크 복사
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: description,
            url: linkUrl,
          });
        } catch (shareError) {
          console.log('웹 공유 취소됨');
        }
      } else {
        // 클립보드에 링크 복사
        try {
          await navigator.clipboard.writeText(linkUrl);
          alert('링크가 클립보드에 복사되었습니다!');
        } catch (clipboardError) {
          alert(`공유 링크: ${linkUrl}`);
        }
      }
    } finally {
      setIsSharing(false);
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