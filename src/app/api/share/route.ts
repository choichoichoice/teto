import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { analysisResult, developmentTips, imagePreview, userId } = body

    // 사용자 ID가 없으면 오류 반환
    if (!userId) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // 고유 ID 생성
    const shareId = uuidv4()

    // 데이터베이스에 저장
    const { data, error } = await supabase
      .from('shared_results')
      .insert([
        {
          id: shareId,
          user_id: userId,
          analysis_result: analysisResult,
          development_tips: developmentTips,
          image_preview: imagePreview,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('데이터베이스 저장 오류:', error)
      return NextResponse.json(
        { error: '결과 저장에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ shareId })
  } catch (error) {
    console.error('공유 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const shareId = searchParams.get('id')

    if (!shareId) {
      return NextResponse.json(
        { error: '공유 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 데이터베이스에서 조회
    const { data, error } = await supabase
      .from('shared_results')
      .select('*')
      .eq('id', shareId)
      .single()

    if (error || !data) {
      console.error('데이터 조회 오류:', error)
      return NextResponse.json(
        { error: '공유된 결과를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      analysisResult: data.analysis_result,
      developmentTips: data.development_tips,
      imagePreview: data.image_preview,
      createdAt: data.created_at
    })
  } catch (error) {
    console.error('공유 조회 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 