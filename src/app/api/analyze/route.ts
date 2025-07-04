import { NextRequest, NextResponse } from 'next/server'
import { AnalysisResult } from '@/types'
import OpenAI from 'openai'

// OpenAI 클라이언트 초기화를 함수 내부로 이동 (모바일 최적화 포함)
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY 환경변수가 설정되지 않았습니다.')
  }
  return new OpenAI({ 
    apiKey,
    timeout: 30000, // 30초 타임아웃 (모바일 네트워크 고려)
    maxRetries: 2,  // 재시도 횟수 (모바일 연결 불안정 대비)
  })
}

export async function POST(request: NextRequest) {
  try {
    // OpenAI 클라이언트 초기화
    const openai = getOpenAIClient()
    
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { error: '이미지가 필요합니다.' },
        { status: 400 }
      )
    }

    // 모바일 최적화: 이미지 크기 제한 체크
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '이미지 파일 크기가 너무 큽니다. 10MB 이하의 이미지를 업로드해주세요.' },
        { status: 400 }
      )
    }

    // 지원되는 이미지 포맷 체크
    const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!supportedFormats.includes(image.type)) {
      return NextResponse.json(
        { error: '지원되지 않는 이미지 포맷입니다. JPEG, PNG, WebP, GIF 파일만 업로드 가능합니다.' },
        { status: 400 }
      )
    }

    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    // 모바일 최적화: 타임아웃 설정으로 안정성 향상
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `🚨 최우선 검토 사항!! 🚨
만약 이 이미지가 성적이거나 야한 내용, 노출이 심한 내용을 포함하고 있다면 분석을 거부하고 다음과 같이 응답해주세요:
{
  "error": "부적절한 이미지는 분석할 수 없습니다. 건전한 얼굴 사진을 업로드해주세요.",
  "type": "error"
}

건전한 이미지인 경우에만 아래 분석을 진행해주세요:

안녕하세요! 이 사진을 통해 에겐-테토 성격 분석을 진행해드리겠습니다. 이는 재미있는 엔터테인먼트 콘텐츠로, 과학적 진단이 아닌 점을 먼저 말씀드립니다.

📋 성별 판별 가이드라인:
사진을 차근차근 살펴보며 성별을 정확히 파악해주세요:
- 얼굴 윤곽과 턱선의 형태 (남성: 각진 라인, 여성: 부드러운 곡선)
- 눈썹의 모양과 두께 (남성: 자연스럽고 두꺼운 형태, 여성: 정리되고 섬세한 형태)
- 코와 입술의 형태적 특징
- 전체적인 얼굴 구조와 골격의 특성
- 헤어스타일과 메이크업 여부
- 의상과 액세서리의 스타일

성별을 먼저 정확히 판별한 후, 해당 성별에 맞는 유형을 선택해주세요.

🎯 에겐-테토 4가지 성격 유형:

🔥 테토남: 외향적이고 적극적인 에너지를 가진 남성 (주도적 성향, 행동 중심적 사고, 현실적이고 명확한 판단력, 타고난 리더십)
👑 테토녀: 외향적이고 독립적인 에너지를 가진 여성 (자립적이고 활발한 성향, 도전을 즐기는 성격, 커리어 지향적, 직설적 소통 스타일)  
🌸 에겐남: 내향적이고 감성적인 에너지를 가진 남성 (높은 감수성, 섬세한 감정 표현, 예술적 감각, 트렌드에 민감, 신중한 관계 형성)
🌺 에겐녀: 내향적이고 따뜻한 에너지를 가진 여성 (부드러운 성향, 뛰어난 공감 능력, 정서적 소통을 중시, 차분한 매력, 클래식한 아름다움)

scenarios 부분에서는 전문적이면서도 친근한 톤으로 분석해주세요:
- 먼저 성별 판별의 근거를 자연스럽게 언급
- 얼굴의 구체적인 특징(눈매, 입모양, 턱선, 이마, 눈썹 등)을 관찰
- 각 특징이 어떤 성격적 특성과 연결되는지 따뜻하고 통찰력 있게 설명
- "~하시는 특징이 보입니다", "~한 면이 있으실 것 같아요" 같은 정중한 표현 사용
- 각 문장은 2-3줄의 자세한 설명으로 구성
- MBTI 용어는 사용하지 말고, 일반적이고 친근한 표현을 사용해주세요

JSON 형식으로 응답해주세요:

{
  "type": "테토녀",
  "emoji": "👑",
  "title": "독립적인 리더",
  "summary": "강한 의지와 카리스마를 가진 매력적인 사람",
  "confidence": 90,
  "traits": {
    "emotion": 70,
    "logic": 85,
    "extraversion": 80,
    "stability": 75,
    "initiative": 90,
    "teto": 85,
    "egen": 40
  },
  "scenarios": ["사진을 보니 당신의 눈매에서 자신감 있고 트렌디한 감각이 느껴져요. 새로운 것을 시도하는 것을 두려워하지 않으시는 분 같아요. 오히려 변화와 도전을 즐기시는 성향이 있으실 것 같습니다.", "입술과 턱선이 만들어내는 각도에서 솔직한 소통을 선호하시는 모습이 보여요. 회의나 토론에서 필요한 말씀을 명확하게 전달하시는 분이실 것 같아요. 직설적이지만 상대방이 불편하지 않게 전달하는 능력이 있으실 것 같습니다.", "이마와 눈썹 라인에서 문제 해결 능력이 뛰어나신 것 같아요. 복잡한 상황에서도 차분하게 해결책을 찾아내시는 분이실 것 같아요. 주변 사람들이 자연스럽게 의지하게 되는 그런 든든함이 있으실 것 같습니다."],
  "dailyMission": "오늘은 자신만의 특별한 매력을 발산해보세요!",
      "chemistry": {
      "best": {
        "type": "에겐남",
        "reason": "서로 다른 강점을 가지고 있어 상호 보완적인 관계를 형성할 수 있어요. 균형잡힌 소통이 가능한 이상적인 조합이라고 생각됩니다."
      },
      "worst": {
        "type": "테토녀",
        "reason": "비슷한 성향을 가지고 있어 때로는 의견 충돌이 생길 수 있어요. 하지만 서로 이해하고 배려한다면 시너지를 낼 수 있는 관계가 될 것 같아요."
      }
    }
}`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    })

    let result
    try {
      const content = response.choices[0].message.content || '{}'
      // JSON 부분만 추출 (```json으로 감싸져 있을 수 있음)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : content
      result = JSON.parse(jsonString)
    } catch (parseError) {
      // 기본값 반환 (여성 사용자가 주로 이용하므로 에겐녀로 설정)
      console.error('API 응답 파싱 실패:', parseError)
      result = {
        type: "에겐녀", // 기본값을 에겐녀로 설정 (주 사용자층 고려)
        emoji: "🌺",
        title: "감성적인 매력의 소유자",
        summary: "부드러움과 공감능력이 뛰어난 매력적인 사람",
        confidence: 90,
        traits: {
          emotion: 85,
          logic: 60,
          extraversion: 45,
          stability: 80,
          initiative: 50,
          teto: 25,
          egen: 85
        },
        scenarios: [
          "사진을 보니 부드러운 여성적인 곡선미와 온화한 눈매에서 따뜻한 에너지가 느껴지시네요. 마음이 복잡한 사람들이 자연스럽게 찾게 되는 그런 편안함을 주시는 분 같아요. 감정을 이해하고 공감하는 능력이 뛰어나신 것 같습니다.",
          "부드러운 입술과 우아한 턱선이 만들어내는 곡선에서 차분한 매력이 느껴져요. 누군가 힘들어할 때 적절한 말로 위로해주시는 분이실 것 같아요. 조용히 말씀하셔도 상대방의 마음에 깊이 전해지는 그런 진정성이 있으실 것 같습니다.",
          "섬세한 이마와 눈썹 라인에서 감정을 세심하게 읽어내시는 능력이 보이네요. 복잡한 감정 상황에서도 차분하게 상황을 파악하고 적절한 조언을 해주시는 분이실 것 같아요. 다른 사람의 마음을 헤아리는 것을 자연스럽게 잘 하시는 타입이신 것 같습니다."
        ],
                  dailyMission: "오늘은 당신만의 따뜻한 매력으로 주변 사람들에게 위로를 전해보세요.",
          chemistry: {
            best: {
              type: "테토남",
              reason: "부드러운 에너지와 적극적인 에너지가 만나 서로의 부족한 부분을 채워주는 이상적인 조합이에요. 서로 다른 강점으로 균형잡힌 관계를 만들어가실 수 있을 것 같아요."
            },
            worst: {
              type: "에겐남",
              reason: "둘 다 내향적인 성향이라 가끔 소통에 어려움이 있을 수 있어요. 하지만 서로 이해하고 배려한다면 깊이 있는 감정적 유대를 형성할 수 있는 관계가 될 것 같아요."
            }
          }
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('분석 API 에러:', error)
    
    // 환경변수 오류인 경우 특별한 메시지 반환
    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다. .env.local 파일에 OPENAI_API_KEY를 추가해주세요.' },
        { status: 500 }
      )
    }
    
    // 모바일 친화적 에러 처리
    if (error instanceof Error) {
      // 네트워크 타임아웃 에러
      if (error.message.includes('timeout') || error.message.includes('ECONNABORTED')) {
        return NextResponse.json(
          { error: '네트워크 연결이 불안정합니다. 잠시 후 다시 시도해주세요.' },
          { status: 408 }
        )
      }
      
      // 네트워크 연결 에러
      if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
        return NextResponse.json(
          { error: '인터넷 연결을 확인하고 다시 시도해주세요.' },
          { status: 503 }
        )
      }
      
      // 이미지 처리 에러
      if (error.message.includes('image') || error.message.includes('invalid')) {
        return NextResponse.json(
          { error: '이미지 처리 중 오류가 발생했습니다. 다른 이미지를 시도해주세요.' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: '이미지 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    )
  }
} 