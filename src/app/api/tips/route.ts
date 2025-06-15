import { NextRequest, NextResponse } from 'next/server'
import { DevelopmentTip, PersonalityType } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { type }: { type: PersonalityType } = await request.json()

    if (!type) {
      return NextResponse.json({ error: '성격 유형이 필요합니다.' }, { status: 400 })
    }

    // AI 팁 생성을 위한 프롬프트
    const prompt = `너는 구독자 100만 명을 보유한 **연애/라이프스타일 유튜버 '혁이 형'**이야. 형이 친한 동생에게 조언해주듯, 유머와 돌직구를 섞은 반말로 글을 써줘.

타겟: '${type}' 유형의 20대 동생.

미션: '${type}'의 잠재력을 폭발시켜서 그냥 괜찮은 사람에서 '진짜 매력적인 사람'으로 레벨업시키는 비법을 알려줘.

🚫 금지사항: 
- '꾸준히 운동하세요', '다양한 스타일을 시도하세요', '사회 활동에 참여하세요' 같은 네이버 검색하면 나오는 뻔한 소리는 절대 금지
- 교과서적인 말투 금지
- 너무 착한 조언 금지

✅ 필수사항:
- 진짜 사람들이 "오 이거 좀 아는데?" 싶은 디테일한 포인트
- 실제로 매력 터진다고 느끼는 구체적인 행동
- 좀 센스있는 추천 상품 (뻔한 거 말고)
- 재미있고 기억에 남는 조언

JSON 형식으로 답변해줘:
{
  "title": "재미있는 제목 (이모지 포함)",
  "tips": ["팁1", "팁2", "팁3"],
  "shoppingKeywords": ["키워드1", "키워드2", "키워드3"]
}`

    // OpenAI API 호출
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.8,
      }),
    })

    if (!openaiResponse.ok) {
      console.error('OpenAI API Error:', await openaiResponse.text())
      
      // 데모용 더미 데이터 반환
      const dummyTips = getDummyTips(type)
      return NextResponse.json(dummyTips)
    }

    const data = await openaiResponse.json()
    const content = data.choices[0].message.content

    try {
      // JSON 파싱 시도
      const result = JSON.parse(content)
      return NextResponse.json(result)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      
      // 파싱 실패 시 더미 데이터 반환
      const dummyTips = getDummyTips(type)
      return NextResponse.json(dummyTips)
    }

  } catch (error) {
    console.error('Tips error:', error)
    return NextResponse.json(
      { error: '팁 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

function getDummyTips(type: PersonalityType): DevelopmentTip {
  const tipsMap: Record<PersonalityType, DevelopmentTip> = {
    '테토남': {
      type: '테토남',
      title: '🔥 야, 너 진짜 개쩌는 리더 될 수 있어',
      tips: [
        '🎯 목표는 크게, 실행은 바로바로 - 매주 "이거 해내면 개쩔겠다" 싶은 목표 하나씩 박살내기',
        '💬 카리스마 + 유머 = 완전체 - 진지할 땐 진지하게, 웃길 땐 확실하게. 이게 진짜 리더의 매력이야',
        '🏋️‍♂️ 몸이 받쳐줘야 말발도 선다 - 헬스장에서 땀 흘리는 모습이 진짜 섹시함'
      ],
      shoppingKeywords: ['무선 이어폰', '프로틴 파우더', '블랙 가죽 지갑']
    },
    '테토녀': {
      type: '테토녀',
      title: '👑 언니, 이미 완벽한데 더 완벽해질래?',
      tips: [
        '💼 일 잘하는 여자가 제일 섹시해 - 회의에서 한 마디로 분위기 바꾸는 그 느낌 알지?',
        '✨ 레드립 하나면 세상이 달라져 - 평소엔 누드톤, 승부처엔 레드. 이게 진짜 아는 사람',
        '🗣️ 네트워킹은 술자리가 아니라 브런치에서 - 오전 11시 브런치 약속이 진짜 고급진 인맥'
      ],
      shoppingKeywords: ['시그니처 향수', '실크 스카프', '골드 액세서리']
    },
    '에겐남': {
      type: '에겐남',
      title: '🌸 야, 너 착한 거 말고 매력적인 거 해봐',
      tips: [
        '🎨 취미 하나는 제대로 파야지 - 기타든 그림이든 뭐든 "오 좀 하네?" 소리 들을 정도로',
        '🤝 착한 건 좋은데 재미없으면 안 돼 - 가끔은 장난도 치고 티키타카도 해야 기억에 남아',
        '🧘‍♂️ 멘탈 관리는 선택이 아니라 필수 - 명상 앱 하나 깔고 매일 10분. 이게 진짜 어른'
      ],
      shoppingKeywords: ['아날로그 시계', '캔들', '원목 소품']
    },
    '에겐녀': {
      type: '에겐녀',
      title: '🌺 언니 너무 착해서 손해보는 거 아냐?',
      tips: [
        '🌿 인스타 감성 말고 진짜 감성 - 집에 식물 키우고 직접 찍은 사진 올리기. 이게 진짜 힙함',
        '💕 경계선은 확실히 그어야 해 - 착한 건 좋지만 "안 돼"라고 말할 줄도 알아야지',
        '🍯 셀프케어는 사치가 아니라 투자야 - 한 달에 한 번은 나만을 위한 시간 확보하기'
      ],
      shoppingKeywords: ['디퓨저', '핸드크림 세트', '티 블렌딩 키트']
    }
  }

  return tipsMap[type]
} 