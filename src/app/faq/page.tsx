'use client'
import { useState } from 'react';

const FAQ_LIST = [
  {
    q: 'Q1. 분석 결과는 과학적 근거가 있나요?',
    a: '아니요, 저희 서비스의 분석 결과는 과학적, 의학적 진단이 아닙니다. AI가 사진 속 인물의 표정, 분위기 등 시각적 특징을 학습된 데이터와 비교하여 가장 가능성이 높은 성격 유형을 찾아주는 재미를 위한 엔터테인먼트 콘텐츠입니다. 결과는 가볍게 즐겨주세요!',
  },
  {
    q: 'Q2. 제가 올린 사진은 안전하게 관리되나요?',
    a: '네, 사용자의 개인정보를 최우선으로 생각합니다. 업로드하신 사진은 성격 유형 분석을 위한 목적으로만 실시간으로 사용되며, 분석이 끝난 후 저희 서버에 즉시 파기되어 어디에도 저장되지 않습니다. 안심하고 이용하세요.',
  },
  {
    q: 'Q3. 어떤 사진을 올려야 분석이 잘 되나요?',
    a: 'AI가 얼굴을 잘 인식할 수 있도록, 정면을 바라보는 선명한 얼굴 사진을 추천합니다. 선글라스나 모자로 얼굴을 가리지 않고, 너무 어둡거나 흔들리지 않은 사진일수록 더 흥미로운 결과를 얻으실 수 있습니다.',
  },
  {
    q: 'Q4. 이 서비스는 무료인가요?',
    a: '네, 현재 "테토-에겐 분석기"의 모든 기능은 완전 무료로 제공되고 있습니다.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-20 max-w-3xl">
      <h1 className="text-5xl font-bold mb-12">자주 묻는 질문 (FAQ)</h1>
      <p className="mb-12 text-xl text-gray-600">
        FAQ 페이지는 사용자의 궁금증을 미리 해결하여 고객 문의를 줄이고 서비스 만족도를 높이는 역할을 합니다.
      </p>
      <div className="divide-y-2 border-2 rounded-2xl bg-white">
        {FAQ_LIST.map((item, idx) => (
          <div key={idx}>
            <button
              className="w-full text-left py-8 px-6 font-semibold text-2xl flex justify-between items-center focus:outline-none"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
            >
              <span>{item.q}</span>
              <span className="ml-4 text-2xl">{openIndex === idx ? '▲' : '▼'}</span>
            </button>
            {openIndex === idx && (
              <div className="pb-8 px-6 text-gray-700 text-xl bg-gray-50 rounded-b-xl">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 