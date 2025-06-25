'use client';

import KakaoShare from '@/components/KakaoShare';
import { useState, useEffect } from 'react';

export default function TestKakaoPage() {
  const [testData, setTestData] = useState({
    title: '테토-에겐 분석 결과',
    description: '당신은 테토남 유형입니다! AI가 분석한 결과를 확인해보세요.',
    imageUrl: '/tetoman.png',
    linkUrl: 'https://localhost:3002/analyze'
  });

  const [userAgent, setUserAgent] = useState('로딩 중...');

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      setTestData(prev => ({
        ...prev,
        linkUrl: window.location.origin + '/analyze'
      }));
      setUserAgent(navigator.userAgent);

      // 카카오 SDK 상태 체크 함수
      const checkKakaoStatus = () => {
        const statusElement = document.getElementById('kakao-status');
        if (statusElement) {
          if (window.Kakao) {
            if (window.Kakao.isInitialized()) {
              statusElement.textContent = '✅ 초기화 완료';
              statusElement.className = 'text-green-600';
            } else {
              statusElement.textContent = '⚠️ SDK 로드됨, 초기화 대기 중';
              statusElement.className = 'text-yellow-600';
            }
          } else {
            statusElement.textContent = '❌ SDK 로드되지 않음';
            statusElement.className = 'text-red-600';
          }
        }
      };

      // 초기 체크
      checkKakaoStatus();
      
      // 1초마다 상태 체크
      const interval = setInterval(checkKakaoStatus, 1000);
      
      return () => clearInterval(interval);
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setTestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          카카오톡 공유 테스트 📱
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">공유 데이터 설정</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                value={testData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={testData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 URL
              </label>
              <input
                type="text"
                value={testData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                링크 URL
              </label>
              <input
                type="text"
                value={testData.linkUrl}
                onChange={(e) => handleInputChange('linkUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">공유 미리보기</h2>
          
          <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
            <div className="flex items-start space-x-4">
              {testData.imageUrl && (
                <img
                  src={testData.imageUrl}
                  alt="미리보기 이미지"
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/tetoman.png';
                  }}
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{testData.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{testData.description}</p>
                <p className="text-xs text-blue-500 mt-2">{testData.linkUrl}</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <KakaoShare
              title={testData.title}
              description={testData.description}
              imageUrl={testData.imageUrl}
              linkUrl={testData.linkUrl}
              className="w-full"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">디버깅 정보</h2>
          
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-gray-100 rounded">
              <strong>카카오 SDK 상태:</strong>{' '}
              <span id="kakao-status" className="text-blue-600">
                확인 중...
              </span>
            </div>
            
            <div className="p-2 bg-gray-100 rounded">
              <strong>환경 변수:</strong>{' '}
              <span className="text-green-600">
                {process.env.NEXT_PUBLIC_KAKAO_APP_KEY ? '설정됨' : '미설정'}
              </span>
            </div>
            
            <div className="p-2 bg-gray-100 rounded">
              <strong>브라우저:</strong>{' '}
              <span className="text-purple-600">{userAgent}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 