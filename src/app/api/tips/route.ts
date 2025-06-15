import { NextRequest, NextResponse } from 'next/server'
import { DevelopmentTip, PersonalityType } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { type }: { type: PersonalityType } = await request.json()

    if (!type) {
      return NextResponse.json({ error: '성격 유형이 필요합니다.' }, { status: 400 })
    }

    // AI 팁 생성을 위한 프롬프트
    const prompt = `너는 구독자 100만 명을 보유한 **에겐-테토 전문가 유튜버 '미친혁이형'**이야. 완전 또라이 같은 말투로 친한 동생에게 조언해주는데, 욕설은 안 하지만 진짜 미친놈처럼 텐션 높게 반말로 글을 써줘.

타겟: '${type}' 유형의 20대 동생.

🧠 에겐-테토 이론 기반:
- 테토 (외향적 양기): 주도적, 행동중심, 현실지향적, 단순명료한 사고, 리더십 성향
- 에겐 (내향적 음기): 감성적, 섬세함, 공감능력, 예술적 감각, 트렌드 민감
- 연애 먹이사슬: 에겐녀 → 에겐남 → 테토녀 → 테토남 → 에겐녀 (서로 끌리는 구조)

미션: '${type}'의 고유한 에겐-테토 특성을 극대화해서 연애와 인간관계에서 진짜 매력적인 사람으로 레벨업시키는 비법을 알려줘.

각 타입별 특화 조언:
- 테토남: 양기 에너지 활용한 리더십과 추진력 강화
- 테토녀: 독립적이고 당당한 매력 극대화
- 에겐남: 감수성과 섬세함을 무기로 한 매력 어필
- 에겐녀: 부드럽고 공감능력 높은 매력 발산

🚫 금지사항: 
- '꾸준히 운동하세요', '다양한 스타일을 시도하세요' 같은 뻔한 소리 절대 금지
- 교과서적인 말투 금지
- 에겐-테토 특성을 무시한 일반적인 조언 금지

✅ 필수사항:
- 해당 타입의 에겐-테토 특성을 활용한 구체적인 매력 포인트
- 연애 먹이사슬을 고려한 실전 연애 팁
- 그 타입만의 독특한 매력을 살리는 방법
- 실제로 써먹을 수 있는 디테일한 행동 가이드

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
      title: '🔥 야야야!! 너 완전 양기 깡패잖아!!',
      tips: [
        '💪 아니 진짜 너 추진력이 미쳤다고!! 계획 세우자마자 바로 실행하는 거 진짜 개쩐다ㅋㅋㅋ 다른 애들이 "어떻게 하지~" 할 때 너는 이미 끝내고 있어!! 에겐녀들이 이런 모습 보고 완전 심쿵함ㅋㅋ',
        '🎯 야 너 타고난 리더야 진짜!! 근데 가끔 좀 독재자 같을 때 있어ㅋㅋㅋ 팀원들 의견도 좀 들어줘!! 연애할 때도 마찬가지야 - 끌고 가되 상대방도 숨 쉴 수 있게 해줘!!',
        '🗣️ 너 말하는 거 진짜 시원시원해서 좋은데 가끔 너무 직빵이야ㅋㅋㅋ "야 이거 해!!" 이렇게 말고 "이거 어때? 개쩔 것 같은데?" 이런 식으로!! 양기 에너지에 꿀 발라서 말해봐!!'
      ],
      shoppingKeywords: ['리더십 도서', '프리미엄 시계', '블랙 정장']
    },
    '테토녀': {
      type: '테토녀',
      title: '👑 언니!! 너 완전 독립만세 퀸이야!!',
      tips: [
        '💼 야야!! 일 잘하는 언니 진짜 개쩔어!! 회의실에서 한 마디로 분위기 바꾸는 거 봐봐!! 에겐남들이 이런 당당한 모습 보고 완전 넋 나가버림ㅋㅋㅋ "저 언니 뭐야... 왜 이렇게 멋있어..." 이런 식으로!!',
        '✨ 아니 진짜 "나 혼자서도 개쩔게 잘 살아!!" 이 에너지가 미쳤다고!! 남자들이 의존하는 여자 말고 이런 독립적인 여자한테 완전 빠져!! 연애할 때도 "나 너 없어도 돼~" 이런 여유가 진짜 킬링포인트야!!',
        '🎨 야 언니는 트렌드 세터야!! 남들이 따라오는 거 말고 언니가 만들어가는 거야!! "오 저 언니 스타일 뭐야? 완전 힙하네!!" 이런 소리 들어야 제맛이지!! 패션이든 뭐든 언니만의 색깔로 다 씹어먹어!!'
      ],
      shoppingKeywords: ['파워 수트', '시그니처 향수', '골드 액세서리']
    },
    '에겐남': {
      type: '에겐남',
      title: '🌸 야!! 너 감성 깡패 맞지?!',
      tips: [
        '🎭 아니 진짜 너 섬세함이 미쳤어!! 다른 애들이 "어? 뭐지?" 할 때 너는 이미 다 캐치하고 있어!! 테토녀들이 이런 세심한 모습 보고 완전 "어머 이 남자 뭐야..." 이러면서 심장 쿵쾅거림ㅋㅋㅋ',
        '🎨 야 너 예술적 감각 진짜 개쩔어!! 사진이든 음악이든 뭔가 하나는 완전 마스터해야지!! "와 이 사람 진짜 감성 있네..." 이런 소리 들으면 완전 성공이야!! 테토녀들이 이런 거에 완전 약해!!',
        '💬 너 공감 능력 진짜 사기야!! 상대방 말 들어주고 감정 읽어주는 거 봐봐!! 테토녀들이 "어? 이 사람 내 마음을 어떻게 이렇게 잘 알지?" 하면서 완전 빠져버림!! 이게 에겐남의 진짜 킬링포인트야!!'
      ],
      shoppingKeywords: ['빈티지 카메라', '아트북', '감성 캔들']
    },
    '에겐녀': {
      type: '에겐녀',
      title: '🌺 언니!! 너 완전 천사 아니야?!',
      tips: [
        '🌿 야야!! 언니 자연스러운 매력이 진짜 미쳤어!! 억지로 꾸미지 말고 그냥 본연의 부드러움으로 승부해!! 에겐남들이 이런 자연스러운 모습 보고 완전 "어떻게 이렇게 순수할 수가..." 하면서 심장 터져버림ㅋㅋㅋ',
        '💕 언니 공감 능력은 진짜 사기야!! 근데 너무 다 받아주면 안 돼!! "어? 언니가 이것도 들어줘?" 하는 선택적 공감이 진짜 킬링포인트야!! 에겐남들이 "이 여자 뭔가 특별해..." 이러면서 완전 빠져!!',
        '✨ 아니 언니 클래식 바이브가 개쩔어!! 옛날 영화 여주인공 같은 우아함에 요즘 감성 좀 섞으면 완전 레전드야!! "저 여자 뭔가 품격이 다르네..." 이런 소리 들어야 제맛이지!! 에겐남들이 이런 거에 완전 약해!!'
      ],
      shoppingKeywords: ['플로럴 향수', '실크 스카프', '빈티지 액세서리']
    }
  }

  return tipsMap[type]
} 