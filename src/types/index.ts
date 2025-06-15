export type PersonalityType = '테토남' | '테토녀' | '에겐남' | '에겐녀'

export interface AnalysisResult {
  type: '테토남' | '테토녀' | '에겐남' | '에겐녀'
  emoji: string
  title: string
  summary: string
  confidence: number
  traits: {
    emotion: number
    logic: number
    extraversion: number
    stability: number
    initiative: number
  }
  scenarios: string[]
  dailyMission: string
  chemistry: {
    best: {
      type: string
      reason: string
    }
    worst: {
      type: string
      reason: string
    }
  }
}

export interface DevelopmentTip {
  type: string
  title: string
  tips: string[]
  shoppingKeywords: string[]
}

export interface User {
  id: string
  email: string
  created_at: string
}

export interface AnalysisHistory {
  id: string
  user_id: string
  image_url: string
  result: AnalysisResult
  created_at: string
} 