'use client';

import KakaoShare from '@/components/KakaoShare';

export default function TestKakaoPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-8 text-center">카카오톡 공유 테스트</h1>
      
      <div className="space-y-6">
        {/* 상태 표시 */}
        <div className="p-4 border rounded-lg bg-blue-50">
          <h2 className="font-semibold mb-2">📋 테스트 정보</h2>
          <ul className="text-sm space-y-1">
            <li>• 카카오 SDK가 준비되면 버튼이 활성화됩니다</li>
            <li>• 개발자 도구(F12) → Console에서 로그 확인</li>
            <li>• 카카오톡 앱이나 웹에서 공유 확인</li>
          </ul>
        </div>

        {/* 테토-에겐 분석기 공유 */}
        <div className="p-6 border rounded-lg text-center space-y-4">
          <h3 className="text-lg font-semibold">테토-에겐 분석기 공유</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">공유될 내용:</p>
            <p className="font-medium">🔮 테토-에겐 분석기 | AI 얼굴 분석</p>
            <p className="text-sm">나는 테토일까 에겐일까? AI가 사진으로 성격 유형을 분석해드려요!</p>
          </div>
          
          <KakaoShare
            title="🔮 테토-에겐 분석기 | AI 얼굴 분석"
            description="나는 테토일까 에겐일까? AI가 사진으로 성격 유형을 분석해드려요! 무료 테스트 해보세요 ✨ #테토에겐 #성격분석"
            imageUrl={typeof window !== 'undefined' ? `${window.location.origin}/tetoman.png` : '/tetoman.png'}
            url={typeof window !== 'undefined' ? window.location.origin : 'https://teto.com'}
          />
        </div>

        {/* 추가 테스트 */}
        <div className="p-6 border rounded-lg text-center space-y-4">
          <h3 className="text-lg font-semibold">분석 페이지 공유</h3>
          
          <KakaoShare
            title="AI 얼굴 분석으로 성격 유형 알아보기"
            description="테토남, 테토녀, 에겐남, 에겐녀 중 어떤 유형인지 확인해보세요!"
            imageUrl={typeof window !== 'undefined' ? `${window.location.origin}/tetowoman.png` : '/tetowoman.png'}
            url={typeof window !== 'undefined' ? `${window.location.origin}/analyze` : 'https://teto.com/analyze'}
          />
        </div>

        {/* 성공 시 안내 */}
        <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
          <h3 className="font-semibold text-green-800 mb-2">✅ 성공하면</h3>
          <p className="text-sm text-green-700">카카오톡 공유 팝업창이 나타나고, 친구에게 테토-에겐 분석기를 공유할 수 있습니다!</p>
        </div>
      </div>
    </div>
  );
} 