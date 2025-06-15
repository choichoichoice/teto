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
    console.log('API 요청 시작...')
    
    // OpenAI 클라이언트 초기화
    const openai = getOpenAIClient()
    
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      console.error('이미지가 없습니다.')
      return NextResponse.json(
        { error: '이미지가 필요합니다.' },
        { status: 400 }
      )
    }

    console.log('이미지 변환 시작...')
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    console.log('OpenAI API 호출 시작...')
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `이 이미지를 보고 창의적인 캐릭터 분석을 해주세요. 이것은 재미있는 게임이며 실제 성격 분석이 아닙니다.

이미지의 전반적인 느낌, 스타일, 분위기를 바탕으로 다음 4가지 가상의 캐릭터 유형 중 하나를 선택해주세요:

🔥 테토남: 강하고 주도적인 에너지 (리더십, 카리스마)
👑 테토녀: 독립적이고 당당한 에너지 (자신감, 개성)  
🌸 에겐남: 부드럽고 감성적인 에너지 (섬세함, 공감)
🌺 에겐녀: 따뜻하고 포근한 에너지 (친근함, 배려)

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
    "initiative": 90
  },
  "scenarios": ["자신만의 스타일을 당당하게 표현하는 모습", "어려운 상황에서도 흔들리지 않는 모습", "새로운 도전을 즐기는 모습"],
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

    console.log('OpenAI 응답:', response.choices[0].message.content)
    
    let result
    try {
      const content = response.choices[0].message.content || '{}'
      // JSON 부분만 추출 (```json으로 감싸져 있을 수 있음)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : content
      result = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError)
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
          initiative: 90
        },
        scenarios: [
          "자신만의 스타일을 당당하게 표현하는 모습",
          "어려운 상황에서도 흔들리지 않는 모습", 
          "새로운 도전을 즐기는 모습"
        ],
        dailyMission: "오늘은 자신만의 특별한 매력을 발산해보세요!",
        chemistry: {
          best: {
            type: "에겐남",
            reason: "서로 다른 강점으로 완벽한 조화를 이루는 관계"
          },
          worst: {
            type: "테토녀",
            reason: "너무 비슷해서 경쟁이 생길 수 있는 관계"
          }
        }
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('API 에러:', error)
    
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