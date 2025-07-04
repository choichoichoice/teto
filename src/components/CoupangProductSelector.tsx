'use client'

import { PersonalityType } from '@/types'
import { getCoupangHTMLByType } from '@/lib/coupang-html'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { ShoppingCart } from 'lucide-react'

interface CoupangProductSelectorProps {
  isOpen: boolean
  onClose: () => void
  userType: PersonalityType
}

export default function CoupangProductSelector({ 
  isOpen, 
  onClose, 
  userType 
}: CoupangProductSelectorProps) {
  // 캐릭터별 HTML 가져오기
  const coupangHTML = getCoupangHTMLByType(userType)

  const getTypeEmoji = (type: PersonalityType) => {
    switch (type) {
      case '테토남': return '💪'
      case '테토녀': return '👑'
      case '에겐남': return '🌸'
      case '에겐녀': return '🌺'
      default: return '✨'
    }
  }

  const getTypeColor = (type: PersonalityType) => {
    switch (type) {
      case '테토남': return 'from-red-500 to-orange-500'
      case '테토녀': return 'from-pink-500 to-rose-500'
      case '에겐남': return 'from-blue-500 to-indigo-500'
      case '에겐녀': return 'from-purple-500 to-violet-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

    return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
           <DialogTitle className="text-center text-2xl font-bold">
              <span className={`bg-gradient-to-r ${getTypeColor(userType)} bg-clip-text text-transparent`}>
                 {getTypeEmoji(userType)} {userType} 맞춤 추천 상품
               </span>
           </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            당신의 성향에 딱 맞는 쿠팡 파트너스 추천 상품들을 확인해보세요! 🛒
          </p>
        </DialogHeader>

        {/* 카카오 AdFit 광고 */}
        <div className="flex w-full justify-center py-4 bg-gray-50 rounded-lg" suppressHydrationWarning>
          {/* 🔍 디버깅용: 광고 영역을 눈에 보이게 만들기 */}
          <div className="relative min-h-[260px] min-w-[250px] bg-purple-100 border-2 border-orange-500 flex items-center justify-center">
            <ins 
              className="kakao_ad_area" 
              style={{ display: "block", minHeight: "250px", minWidth: "250px" }}
              data-ad-unit="DAN-vrIRNccY2pFwiBvC"
              data-ad-width="250"
              data-ad-height="250"
              data-ad-responsive="true"
              data-ad-mobile="true"
            ></ins>
            {/* 디버깅용 텍스트 */}
            <div className="absolute inset-0 flex items-center justify-center text-xs text-orange-600 pointer-events-none z-10">
              <div className="bg-white/80 px-2 py-1 rounded">
                AdFit 영역 (250x250)
              </div>
            </div>
          </div>
        </div>

        {/* 캐릭터별 쿠팡 파트너스 HTML 렌더링 */}
        <div 
          className="coupang-products-container"
          dangerouslySetInnerHTML={{ __html: coupangHTML }}
        />

        {/* 추가 안내 문구 */}
        <div className="bg-yellow-50 p-4 rounded-lg mt-4 border border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-500 rounded-full p-1">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-yellow-900 mb-1">📢 스팸 방지 안내</h4>
              <p className="text-sm text-yellow-800">
                상품 링크는 개인적인 사용만 권장됩니다. 
                사전 동의 없이 메신저나 SNS로 무단 발송 시 법적 제재를 받을 수 있습니다. 
                (과태료 최대 3천만원, 벌금 최대 1천만원)
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 