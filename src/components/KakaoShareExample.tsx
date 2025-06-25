'use client';

import KakaoShare from './KakaoShare';

export default function KakaoShareExample() {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">카카오톡 공유하기 예시</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">현재 페이지 공유</h3>
          <KakaoShare
            title="TETO - 나만의 특별한 서비스"
            description="TETO에서 제공하는 멋진 기능들을 친구들과 함께 체험해보세요!"
            imageUrl="https://via.placeholder.com/400x300/ffeb3b/000000?text=TETO"
            webUrl={typeof window !== 'undefined' ? window.location.href : 'https://teto.com'}
          />
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-700">커스텀 콘텐츠 공유</h3>
          <KakaoShare
            title="딸기 치즈 케이크"
            description="#케이크 #딸기 #삼평동 #카페 #분위기 #소개팅"
            imageUrl="http://k.kakaocdn.net/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png"
            webUrl="https://developers.kakao.com"
          />
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h4 className="font-semibold text-sm text-gray-600 mb-2">설정 안내:</h4>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• .env.local 파일에 NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY 추가 필요</li>
          <li>• 카카오 개발자센터에서 앱 등록 및 도메인 설정 필요</li>
          <li>• 플랫폼 설정에서 웹 도메인 등록 필요</li>
        </ul>
      </div>
    </div>
  );
} 