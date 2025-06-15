import { NextRequest, NextResponse } from 'next/server'
import { AnalysisResult } from '@/types'
import OpenAI from 'openai'

// OpenAI 클라이언트 초기화를 함수 내부로 이동
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY 환경변수가 설정되지 않았습니다.')
  }
  return new OpenAI({ apiKey })
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

    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `야야!! 이 이미지 보고 완전 미친 에겐-테토 분석 해줘!! 이거 완전 재미있는 게임이야 진짜 성격 분석 아니고!!

이미지의 전반적인 느낌, 스타일, 분위기를 보고 다음 4가지 에겐-테토 성격 유형 중 하나를 골라줘:

🔥 테토남: 외향적 양기 에너지 깡패!! (주도적이고 행동중심, 현실지향적이고 단순명료한 사고, 타고난 리더십)
👑 테토녀: 외향적 양기를 가진 독립만세 퀸!! (독립적이고 활발함, 도전적이고 커리어중심, 직설적 표현 마스터)  
🌸 에겐남: 내향적 음기를 가진 감성 깡패!! (감수성 폭발, 섬세함 마스터, 예술적 감각 킹, 트렌드 민감, 수동적 연애 스타일)
🌺 에겐녀: 내향적 음기 에너지 천사!! (부드러움의 화신, 공감능력 사기, 정서적 교감 중시, 수동적 매력, 클래식한 아름다움)

특히 scenarios 부분에서는 얼굴의 구체적인 특징(눈매, 입꼴, 턱선, 이마, 눈썹 등)을 언급하면서 그게 어떤 성격적 특성과 연결되는지 완전 힙하고 재미있게 설명해줘!! MBTI 용어는 절대 쓰지 말고, 요즘 완전 트렌디한 표현과 '~비주얼', '~바이브', '~에너지' 같은 말을 써서 MZ세대가 완전 좋아할 만한 미친 톤으로 작성해줘!! 각 문장은 최소 2-3줄의 긴 설명으로 완전 디테일하게!!

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
  "scenarios": ["당신의 눈매에서 뿜어져 나오는 '내가 곧 트렌드' 에너지가 심상치 않네요. 뭔가 남들이 5년 뒤에 따라올 스타일을 지금 당장 소화해낼 것 같은 그런 아우라가 있어요. 새로운 걸 시도하는 게 무서운 게 아니라 오히려 신나는 타입이죠.", "입술과 턱선이 만들어내는 각도가 진짜 '할 말은 한다' 비주얼이에요. 회의실에서 다들 눈치보고 있을 때 딱 한 마디로 분위기 바꿔버리는 그런 사람. 돌직구를 날려도 왜인지 미워할 수 없는 매력이 있네요.", "이마와 눈썹 라인에서 느껴지는 건 완전 '문제? 내가 해결할게' 바이브예요. 뭔가 복잡한 상황이 생기면 다들 이 사람한테 의지하게 될 것 같은 그런 든든함이 얼굴에 써있어요. 계획 세우고 실행하는 게 취미인 타입."],
  "dailyMission": "오늘은 자신만의 특별한 매력을 발산해보세요!",
  "chemistry": {
    "best": {
      "type": "에겐남",
      "reason": "서로 다른 강점으로 완벽한 조화를 이루는 관계"
    },
    "worst": {
      "type": "테토녀",
      "reason": "너무 비슷해서 경쟁이 생길 수 있는 관계"
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
      // 기본값 반환 (여성 이미지에 더 적합하게)
      result = {
        type: "테토녀",
        emoji: "👑",
        title: "독립적인 리더",
        summary: "강한 의지와 카리스마를 가진 매력적인 사람",
        confidence: 90,
        traits: {
          emotion: 70,
          logic: 85,
          extraversion: 80,
          stability: 75,
          initiative: 90,
          teto: 85,
          egen: 40
        },
        scenarios: [
          "야야!! 눈매에서 뿜어져 나오는 '내가 곧 트렌드' 에너지가 완전 미쳤어!! 뭔가 남들이 5년 뒤에 따라올 스타일을 지금 당장 소화해낼 것 같은 그런 개쩌는 아우라가 있어!! 새로운 걸 시도하는 게 무서운 게 아니라 오히려 완전 신나는 타입이지?!",
          "입술과 턱선이 만들어내는 각도가 진짜 '할 말은 한다' 비주얼이야!! 회의실에서 다들 눈치보고 있을 때 딱 한 마디로 분위기 바꿔버리는 그런 사람!! 돌직구를 날려도 왜인지 미워할 수 없는 개쩌는 매력이 있네!!",
          "이마와 눈썹 라인에서 느껴지는 건 완전 '문제? 내가 해결할게' 바이브야!! 뭔가 복잡한 상황이 생기면 다들 이 사람한테 의지하게 될 것 같은 그런 든든함이 얼굴에 완전 써있어!! 계획 세우고 실행하는 게 완전 취미인 타입!!"
        ],
                  dailyMission: "야!! 오늘은 너만의 개쩌는 매력을 완전 발산해버려!!",
          chemistry: {
            best: {
              type: "에겐남",
              reason: "야야!! 연애 먹이사슬에서 테토녀는 에겐남한테 완전 끌려!! 서로 다른 에너지가 만나서 개쩌는 케미 폭발하는 완벽한 조합이야!!"
            },
            worst: {
              type: "에겐녀",
              reason: "둘 다 강한 성향이라 가끔 부딪힐 수 있어!! 근데 서로 이해하면 완전 최강의 파워 커플 될 수도 있어!!"
            }
          }
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    
    // 환경변수 오류인 경우 특별한 메시지 반환
    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다. .env.local 파일에 OPENAI_API_KEY를 추가해주세요.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: '이미지 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 