import { PersonalityType } from '@/types'

// 쿠팡 파트너스 필수 고지사항
export const COUPANG_DISCLAIMER = `
<div class="coupang-disclaimer bg-blue-50 p-4 rounded-lg mt-4 border-l-4 border-blue-400">
  <div class="flex items-start gap-2">
    <div class="bg-blue-500 rounded-full p-1 mt-1">
      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
      </svg>
    </div>
    <div class="flex-1">
      <p class="text-sm text-blue-800 font-medium">
        🔔 <strong>쿠팡 파트너스 고지사항</strong>
      </p>
      <p class="text-xs text-blue-700 mt-1 leading-relaxed">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다. 
        구매자에게는 추가 비용이 발생하지 않으며, 서비스 운영에 도움이 됩니다. 감사합니다! 💙
      </p>
    </div>
  </div>
</div>
`

// 캐릭터별 쿠팡 파트너스 HTML
export const COUPANG_HTML_BY_TYPE: Record<PersonalityType, string> = {
  '테토남': `
    <div class="teto-male-products">
      <h3 class="text-xl font-bold text-red-600 mb-6 flex items-center justify-center">
        💪 테토남 맞춤 추천 상품
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">일론머스크 책</h4>
          <iframe src="https://coupa.ng/ciLIqW" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">다슈 올인원</h4>
          <iframe src="https://coupa.ng/ciLJyx" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">아크테릭스 모자</h4>
          <iframe src="https://coupa.ng/ciLJbE" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">아르기닌</h4>
          <iframe src="https://coupa.ng/ciLJcE" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">필립스 전기면도기</h4>
          <iframe src="https://coupa.ng/ciLJdT" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">탐사 스파클링</h4>
          <iframe src="https://coupa.ng/ciLJfA" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
      </div>
      ${COUPANG_DISCLAIMER}
    </div>
  `,
  
  '테토녀': `
    <div class="teto-female-products">
      <h3 class="text-xl font-bold text-pink-600 mb-6 flex items-center justify-center">
        👑 테토녀 맞춤 추천 상품
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">세이노의 가르침</h4>
          <iframe src="https://coupa.ng/ciLJgk" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">가죽 토트백</h4>
          <iframe src="https://coupa.ng/ciLJhS" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">소니 노이즈캔슬링 헤드폰</h4>
          <iframe src="https://coupa.ng/ciLJiH" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">르라보 향수</h4>
          <iframe src="https://coupa.ng/ciLJkq" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
      </div>
      ${COUPANG_DISCLAIMER}
    </div>
  `,
  
  '에겐남': `
    <div class="egen-male-products">
      <h3 class="text-xl font-bold text-blue-600 mb-6 flex items-center justify-center">
        🌸 에겐남 맞춤 추천 상품
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">고려은단 비타민 C</h4>
          <iframe src="https://coupa.ng/ciLJtm" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">호카 신발</h4>
          <iframe src="https://coupa.ng/ciLJv9" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">드립커피 입문세트</h4>
          <iframe src="https://coupa.ng/ciLJvH" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">미미 떡볶이</h4>
          <iframe src="https://coupa.ng/ciLJsD" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">요거트</h4>
          <iframe src="https://coupa.ng/ciLJxI" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
      </div>
      ${COUPANG_DISCLAIMER}
    </div>
  `,
  
  '에겐녀': `
    <div class="egen-female-products">
      <h3 class="text-xl font-bold text-purple-600 mb-6 flex items-center justify-center">
        🌺 에겐녀 맞춤 추천 상품
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">불편한 편의점</h4>
          <iframe src="https://coupa.ng/ciLJm0" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">산리오 다이어리 꾸미기</h4>
          <iframe src="https://coupa.ng/ciLJo3" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">어뮤즈 젤핏 틴트</h4>
          <iframe src="https://coupa.ng/ciLJpS" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">미피 무드등</h4>
          <iframe src="https://coupa.ng/ciLJqU" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">하리보</h4>
          <iframe src="https://coupa.ng/ciLJrC" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">미미 떡볶이</h4>
          <iframe src="https://coupa.ng/ciLJsD" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">에이블리 티셔츠</h4>
          <iframe src="https://coupa.ng/ciLJA8" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">캔따게 캔오프너</h4>
          <iframe src="https://coupa.ng/ciLJHO" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
        <div class="text-center">
          <h4 class="text-sm font-medium text-gray-700 mb-2">요거트</h4>
          <iframe src="https://coupa.ng/ciLJxI" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>
        </div>
      </div>
      ${COUPANG_DISCLAIMER}
    </div>
  `
}

// 캐릭터별 HTML 가져오기
export function getCoupangHTMLByType(type: PersonalityType): string {
  return COUPANG_HTML_BY_TYPE[type] || ''
}

// HTML을 업데이트하는 함수 (사용자님이 HTML 제공 시 사용)
export function updateCoupangHTML(type: PersonalityType, newHTML: string): void {
  COUPANG_HTML_BY_TYPE[type] = `
    <div class="${type.toLowerCase().replace('남', '-male').replace('녀', '-female')}-products">
      ${newHTML}
      ${COUPANG_DISCLAIMER}
    </div>
  `
} 