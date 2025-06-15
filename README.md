# 테토-에겐 분석기

사진으로 알아보는 성격 유형 분석 서비스입니다. AI가 당신의 사진을 분석하여 테토남, 테토녀, 에겐남, 에겐녀 중 어떤 유형에 가까운지 알려드립니다.

## 🚀 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Library**: shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4 Vision API

## 📋 주요 기능

### 랜딩페이지
- 헤더, 히어로 섹션, 푸터로 구성
- 서비스 소개 및 4가지 성격 유형 설명
- 반응형 디자인

### 이미지 분석
- 사진 업로드 및 AI 분석
- 4가지 유형별 분석 결과 제공 (테토남, 테토녀, 에겐남, 에겐녀)
- 신뢰도 백분율 및 분석 근거 제시

### 호르몬 발전 팁
- 성격 유형별 맞춤 발전 팁 제공
- 추천 상품 키워드 제공
- 결과 공유 기능

### 사용자 대시보드
- 분석 기록 관리
- 통계 정보 제공
- 인증된 사용자만 접근 가능

### 인증 시스템
- 이메일/비밀번호 로그인
- Google OAuth 로그인
- 회원가입 및 이메일 인증

## 🛠️ 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd teto-analyzer
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-api-key

# OpenAI API 설정
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Supabase 설정
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 URL과 anon key를 환경변수에 설정
3. Authentication 설정에서 Google OAuth 활성화 (선택사항)

### 5. OpenAI API 설정
1. [OpenAI](https://platform.openai.com)에서 API 키 생성
2. 환경변수에 API 키 설정

### 6. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API 라우트
│   │   ├── analyze/       # 이미지 분석 API
│   │   └── tips/          # 발전 팁 API
│   ├── auth/              # 인증 페이지
│   │   ├── login/         # 로그인
│   │   ├── signup/        # 회원가입
│   │   └── callback/      # OAuth 콜백
│   ├── analyze/           # 분석 페이지
│   ├── dashboard/         # 대시보드
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── Header.tsx        # 헤더
│   └── Footer.tsx        # 푸터
├── lib/                  # 유틸리티 함수
│   ├── utils.ts          # 공통 유틸리티
│   └── supabase.ts       # Supabase 클라이언트
└── types/                # TypeScript 타입 정의
    └── index.ts
```

## 🎨 성격 유형

### 테토남 💪
- 테스토스테론적 자질이 드러나는 성향
- 연애에서 주도적, 자신감 있는 태도
- 강인함과 직설적 성향 강조

### 테토녀 👑
- 테스토스테론적 성향을 가진 여성
- 독립적이고 주도적인 연애 스타일
- 자신에게 부족한 성향을 보완하는 상대에게 끌림

### 에겐남 🌸
- 에스트로겐적 성향을 가진 남성
- 감성적이고 공감 능력이 뛰어남
- 연애에서 부드럽고 반응적인 태도

### 에겐녀 🌺
- 부드럽고 감성적인 정서 중심의 여성 유형
- 감정의 흐름, 공감, 안정감을 중시
- 연애에서 주도적이지 않고 반응 중심적 태도

## 🔧 개발 정보

### API 엔드포인트

- `POST /api/analyze` - 이미지 분석
- `POST /api/tips` - 발전 팁 생성

### 데이터베이스 스키마 (예정)

```sql
-- 사용자 테이블 (Supabase Auth 기본 제공)
-- 분석 히스토리 테이블
CREATE TABLE analysis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  image_url TEXT,
  result JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📝 사용법

1. **홈페이지 방문**: 서비스 소개 및 성격 유형 정보 확인
2. **회원가입/로그인**: 분석 기록 저장을 위한 계정 생성
3. **사진 업로드**: 얼굴이 잘 보이는 사진 업로드
4. **AI 분석**: 성격 유형 분석 결과 확인
5. **발전 팁 확인**: 맞춤형 개선 팁 및 상품 추천 확인
6. **결과 공유**: 분석 결과를 SNS나 메신저로 공유
7. **대시보드**: 분석 기록 및 통계 확인

## 🚀 배포

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 환경변수 설정
Vercel 대시보드에서 환경변수를 설정하세요:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

## 📄 라이선스

MIT License

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의나 버그 리포트는 GitHub Issues를 이용해주세요.

'use client'

import { useEffect } from 'react'

export default function Example() {
  useEffect(() => {
    console.log('in useEffect')
  })
  return <p>Hello world</p>
}
