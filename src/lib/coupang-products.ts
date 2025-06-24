import { PersonalityType } from '@/types'

// 쿠팡 파트너스 상품 정보 타입
interface CoupangProduct {
  id: string
  name: string
  url: string
  description: string
  category: string
}

// 캐릭터별 쿠팡 파트너스 상품 추천
export const COUPANG_PRODUCTS: Record<PersonalityType, CoupangProduct[]> = {
  '테토남': [
    {
      id: 'teto_male_1',
      name: '프리미엄 남성 단백질 파우더',
      url: 'https://coupa.ng/cfVKCh', // 실제 쿠팡 파트너스 링크로 교체
      description: '근육량 증가와 테스토스테론 부스팅에 도움',
      category: '헬스/건강'
    },
    {
      id: 'teto_male_2',
      name: '남성 전용 종합 비타민',
      url: 'https://coupa.ng/cfVKCi', // 실제 쿠팡 파트너스 링크로 교체
      description: '활력과 에너지 증진을 위한 맞춤 영양제',
      category: '건강/영양'
    },
    {
      id: 'teto_male_3',
      name: '남성용 프리미엄 향수',
      url: 'https://coupa.ng/cfVKCj', // 실제 쿠팡 파트너스 링크로 교체
      description: '강렬하고 매력적인 남성미를 강조하는 향수',
      category: '뷰티/향수'
    }
  ],
  '테토녀': [
    {
      id: 'teto_female_1',
      name: '여성 리더십 강화 서적',
      url: 'https://coupa.ng/cfVKCk', // 실제 쿠팡 파트너스 링크로 교체
      description: '당당하고 독립적인 여성을 위한 자기계발서',
      category: '도서/자기계발'
    },
    {
      id: 'teto_female_2',
      name: '파워 수트 스타일 재킷',
      url: 'https://coupa.ng/cfVKCl', // 실제 쿠팡 파트너스 링크로 교체
      description: '프로페셔널하고 당당한 이미지 연출',
      category: '패션/의류'
    },
    {
      id: 'teto_female_3',
      name: '시그니처 골드 액세서리',
      url: 'https://coupa.ng/cfVKCm', // 실제 쿠팡 파트너스 링크로 교체
      description: '독립적이고 세련된 매력을 어필하는 액세서리',
      category: '패션/액세서리'
    }
  ],
  '에겐남': [
    {
      id: 'egen_male_1',
      name: '남성용 스킨케어 세트',
      url: 'https://coupa.ng/cfVKCn', // 실제 쿠팡 파트너스 링크로 교체
      description: '섬세하고 깔끔한 피부관리를 위한 세트',
      category: '뷰티/스킨케어'
    },
    {
      id: 'egen_male_2',
      name: '빈티지 감성 카메라',
      url: 'https://coupa.ng/cfVKCo', // 실제 쿠팡 파트너스 링크로 교체
      description: '예술적 감각과 창의성을 표현하는 카메라',
      category: '전자/카메라'
    },
    {
      id: 'egen_male_3',
      name: '아로마테라피 디퓨저',
      url: 'https://coupa.ng/cfVKCp', // 실제 쿠팡 파트너스 링크로 교체
      description: '감성적이고 편안한 공간 연출',
      category: '생활/인테리어'
    }
  ],
  '에겐녀': [
    {
      id: 'egen_female_1',
      name: '내추럴 뷰티 스킨케어',
      url: 'https://coupa.ng/cfVKCq', // 실제 쿠팡 파트너스 링크로 교체
      description: '부드럽고 자연스러운 아름다움을 위한 케어',
      category: '뷰티/스킨케어'
    },
    {
      id: 'egen_female_2',
      name: '감성 캔들 세트',
      url: 'https://coupa.ng/cfVKCr', // 실제 쿠팡 파트너스 링크로 교체
      description: '따뜻하고 포근한 분위기 연출',
      category: '생활/인테리어'
    },
    {
      id: 'egen_female_3',
      name: '플로럴 프래그런스',
      url: 'https://coupa.ng/cfVKCs', // 실제 쿠팡 파트너스 링크로 교체
      description: '우아하고 여성스러운 매력을 강조하는 향수',
      category: '뷰티/향수'
    }
  ]
}

// 캐릭터별 상품 가져오기
export function getProductsByType(type: PersonalityType): CoupangProduct[] {
  return COUPANG_PRODUCTS[type] || []
}

// 특정 카테고리의 상품 가져오기
export function getProductsByCategory(type: PersonalityType, category: string): CoupangProduct[] {
  return COUPANG_PRODUCTS[type]?.filter(product => product.category === category) || []
}

// 쿠팡 파트너스 링크 추적을 위한 함수
export function trackCoupangClick(productId: string, userType: PersonalityType) {
  // 클릭 추적 로직 (Google Analytics, 자체 분석 등)
  if (typeof window !== 'undefined') {
    // gtag 이벤트 전송 (Google Analytics 사용 시)
    if ((window as any).gtag) {
      (window as any).gtag('event', 'coupang_product_click', {
        'product_id': productId,
        'user_type': userType,
        'event_category': 'affiliate',
        'event_label': `${userType}_${productId}`
      })
    }
    
    // 콘솔 로그 (개발 환경)
    console.log(`🛒 쿠팡 상품 클릭: ${productId} (${userType})`)
  }
} 