export default function ContactPage() {
  return (
    <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-20 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">문의하기 (Contact Us)</h1>
      <p className="mb-8 text-lg text-gray-700">
        사용자가 서비스 이용 중 겪는 문제나 기타 문의사항을 전달할 수 있는 소통 창구입니다.
      </p>
      <div className="mb-10 p-6 bg-white rounded-xl border shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">무엇을 도와드릴까요?</h2>
        <p className="mb-4 text-lg">
          "테토-에겐 분석기"를 이용해 주셔서 감사합니다.<br />
          서비스 이용 중 궁금한 점이나 불편한 점이 있으신가요?
        </p>
        <p className="mb-4 text-lg">
          먼저 <a href="/faq" className="text-purple-600 underline hover:text-purple-800">자주 묻는 질문(FAQ) 페이지</a>를 확인해 보시면 더 빠르게 답변을 찾으실 수 있습니다.
        </p>
        <p className="mb-4 text-lg">
          만약 FAQ로 해결되지 않는 문제나 제휴, 기타 문의가 있으시다면 아래 이메일로 연락 주세요.<br />
          최대한 신속하게 확인 후 답변드리겠습니다.
        </p>
        <div className="mb-2 text-lg">
          <span className="font-semibold">문의 이메일:</span> <a href="mailto:allcrlf@naver.com" className="text-blue-600 underline">allcrlf@naver.com</a>
        </div>
        <div className="text-sm text-gray-500">
          (영업일 기준 2~3일 이내에 답변을 드리기 위해 노력하고 있습니다.)
        </div>
      </div>
    </div>
  );
} 