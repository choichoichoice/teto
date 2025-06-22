import AdBanner from '@/components/AdBanner';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-20 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">개인정보처리방침 및 이용약관</h1>
      <div className="mb-6 text-gray-600 text-lg">시행일자: 2024년 6월 16일</div>
      
      {/* 광고 영역 1 */}
      <div className="mb-8">
        <AdBanner key="privacy-ad-1" className="w-full max-w-2xl mx-auto" />
      </div>
      
      <div className="bg-white rounded-xl border shadow-sm p-8 text-lg leading-relaxed">
        <p className="mb-6">
          안녕하세요! <b>테토-에겐 분석기</b>(이하 '서비스')를 이용해 주셔서 감사합니다. 본 문서는 서비스를 이용하시는 여러분(이하 '이용자')과 서비스 개발자(이하 '개발자') 간의 약속을 담고 있습니다. 서비스 이용에 관한 약관(제1부)과 여러분의 소중한 개인정보를 어떻게 보호하는지에 대한 방침(제2부)으로 구성되어 있습니다.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">제1부 이용약관</h2>
        <b>제1조 (목적)</b>
        <p className="mb-4">본 이용약관은 '서비스' 이용과 관련하여 '개발자'와 '이용자' 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        <b>제2조 (용어의 정의)</b>
        <p className="mb-4">'서비스'라 함은 이용자가 업로드한 사진을 기반으로 AI가 성격 유형을 분석해 주는 모든 관련 서비스를 의미합니다.<br />'이용자'라 함은 본 약관에 따라 개발자가 제공하는 서비스를 받는 모든 사용자를 의미합니다.</p>
        <b>제3조 (서비스의 내용 및 면책)</b>
        <p className="mb-4">개발자는 이용자에게 AI 이미지 분석 기반의 성격 유형 분석 결과를 제공합니다.<br />분석 결과는 AI의 판단에 따른 것으로, 과학적 정확성을 보장하지 않으며 오락적 참고 자료로만 활용되어야 합니다. 개발자는 서비스의 분석 결과로 인해 발생하는 어떠한 문제에 대해서도 책임을 지지 않습니다.<br />개발자는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
        <b>제4조 (이용자의 의무)</b>
        <ul className="list-disc pl-6 mb-4">
          <li>타인의 사진을 무단으로 도용하여 서비스를 이용하는 행위</li>
          <li>음란물, 폭력적인 메시지 등 공서양속에 반하는 콘텐츠를 업로드하는 행위</li>
          <li>서비스의 정상적인 운영을 방해하는 행위</li>
        </ul>
        {/* 광고 영역 2 */}
        <div className="my-8 flex justify-center">
          <AdBanner key="privacy-ad-2" className="w-full max-w-2xl mx-auto" />
        </div>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">제2부 개인정보처리방침</h2>
        <b>개발자는 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령상의 개인정보보호 규정을 준수하며, 이용자 권익 보호에 최선을 다하고 있습니다.</b>
        <br /><br />
        <b>제5조 (개인정보의 처리 목적)</b>
        <p className="mb-4">개발자는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 관련 법령에 따라 필요한 조치를 이행할 예정입니다.</p>
        <ul className="list-disc pl-6 mb-4">
          <li>핵심 서비스 제공: 이용자가 업로드한 사진을 AI 분석 모델에 전달하여 성격 유형 분석 결과를 생성하고 이용자에게 보여주는 목적.</li>
          <li>서비스 개선 및 통계 분석: 서비스 이용 기록, 접속 빈도 등 비식별 데이터를 통계적으로 분석하여 서비스 환경을 개선하고 새로운 기능을 개발하는 목적.</li>
          <li>광고성 정보 제공: 서비스 내에 개발자 또는 제3자의 광고를 게재하여 무료 서비스를 유지합니다. 이 과정에서 개인을 식별할 수 있는 정보는 절대 광고 목적에 사용되지 않습니다.</li>
          <li>고충 처리: 이용자의 문의사항 확인 및 회신, 사실조사를 위한 연락, 처리 결과 통보 등 원활한 의사소통 경로를 확보하는 목적.</li>
        </ul>
        <b>제6조 (처리하는 개인정보의 항목 및 보유 기간)</b>
        <p className="mb-4">처리 항목: 이용자가 AI 분석을 위해 직접 업로드하는 사진 정보.<br />보유 및 파기: 개발자는 이용자의 사진 정보를 서비스 목적 달성 시 지체 없이 파기합니다. AI 분석이 완료된 후 즉시 파기되며 서버에 저장되지 않습니다.</p>
        <b>제7조 (개인정보의 제3자 제공에 관한 사항)</b>
        <p className="mb-4">개발자는 AI 분석 기능의 구현을 위해 이용자의 사진 정보를 Google LLC (Gemini API)에 전송하며, 이 정보는 분석 목적 외에는 사용되지 않습니다. 이 외에는 이용자의 사전 동의 없이 개인정보를 제3자에게 제공하지 않습니다.</p>
        <b>제8조 (개발자 정보 및 문의)</b>
        <p className="mb-2">서비스 및 개인정보 관련 모든 문의는 아래 연락처로 해주시기 바랍니다.</p>
        <ul className="list-disc pl-6 mb-2">
          <li>운영 주체: 테토-에겐 분석기 개발자</li>
          <li>이메일: <a href="mailto:allcrlf@naver.com" className="text-blue-600 underline">allcrlf@naver.com</a></li>
        </ul>
      </div>
      
      {/* 광고 영역 3 */}
      <div className="mt-8">
        <AdBanner key="privacy-ad-3" className="w-full max-w-2xl mx-auto" />
      </div>
    </div>
  );
} 