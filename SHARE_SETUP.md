# 테토-에겐 분석기 공유 기능 설정

## 개요
이 기능을 통해 사용자는 분석 결과를 고유한 URL로 공유할 수 있습니다. 로그인 없이도 누구나 공유된 결과를 볼 수 있습니다.

## 설정 방법

### 1. SUPABASE 프로젝트 생성
1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 설정에서 API URL과 anon key 확인

### 2. 환경 변수 설정
`.env.local` 파일에 다음 변수들을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 데이터베이스 테이블 생성
SUPABASE 대시보드의 SQL Editor에서 `database_setup.sql` 파일의 내용을 실행하세요.

### 4. 패키지 설치
```bash
npm install uuid @types/uuid
```

## 사용 방법

### 공유하기
1. 분석 완료 후 "결과 공유하기" 버튼 클릭
2. 고유한 공유 URL이 생성됨
3. 해당 URL을 다른 사람에게 전송

### 공유된 결과 보기
1. 공유받은 URL 접속
2. 원본 분석 결과와 동일한 내용 표시
3. 업로드된 이미지도 함께 표시

## 기능 특징

### 보안
- 로그인 불필요
- 개인정보 수집 없음
- 이미지는 Base64로 저장되어 안전

### 성능
- 고유 ID 기반 빠른 조회
- 인덱스 최적화
- 30일 후 자동 삭제 (선택사항)

### 호환성
- SUPABASE 미설정 시 기존 방식으로 동작
- 점진적 기능 향상 (Progressive Enhancement)

## 문제 해결

### SUPABASE 연결 실패
- 환경 변수 확인
- SUPABASE 프로젝트 상태 확인
- 네트워크 연결 확인

### 공유 링크 접속 불가
- 공유 ID 유효성 확인
- 데이터베이스 테이블 존재 확인
- RLS 정책 설정 확인

## API 엔드포인트

### POST /api/share
분석 결과를 저장하고 공유 ID 반환

**요청:**
```json
{
  "analysisResult": { ... },
  "developmentTips": { ... },
  "imagePreview": "data:image/..."
}
```

**응답:**
```json
{
  "shareId": "uuid-string"
}
```

### GET /api/share?id={shareId}
공유 ID로 분석 결과 조회

**응답:**
```json
{
  "analysisResult": { ... },
  "developmentTips": { ... },
  "imagePreview": "data:image/...",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 페이지 구조

- `/share/[id]` - 공유된 결과 표시 페이지
- 분석 페이지와 동일한 UI/UX
- 파티클 배경과 그라데이션 적용
- 반응형 디자인 지원 