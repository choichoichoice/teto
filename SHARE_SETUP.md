# 테토-에겐 분석기 공유 기능 설정

## 개요
이 기능을 통해 사용자는 분석 결과를 다양한 방법으로 공유할 수 있습니다. **Supabase 설정 없이도 기본적인 공유가 가능**하며, 로그인 여부와 관계없이 모든 사용자가 이용할 수 있습니다.

## 공유 방법 (우선순위)

### 1. 카카오톡 공유 (1순위) 📱
- 카카오 SDK를 통한 네이티브 공유
- 이미지, 제목, 설명과 함께 공유
- 즉시 친구에게 전송 가능

### 2. 웹 기본 공유 API (2순위) 🌐
- 모바일 기기의 기본 공유 기능 활용
- iOS Safari, Android Chrome 등에서 지원
- 사용자가 원하는 앱 선택 가능

### 3. 클립보드 복사 + SNS 선택 (3순위) 📋
- 링크를 클립보드에 자동 복사
- 카카오톡, 페이스북, 트위터 선택지 제공
- 모든 브라우저에서 작동

### 4. 프롬프트 표시 (최종 폴백) 💬
- 클립보드 접근이 불가능한 경우
- 사용자가 직접 URL 복사

## 설정 방법

### 1. 기본 공유 (설정 불필요) ✅
**별도 설정 없이 바로 사용 가능합니다!**
- 로컬 저장 방식으로 공유
- 임시 데이터를 localStorage에 저장
- 현재 페이지 URL로 공유

### 2. 영구 공유 (Supabase 설정 - 선택사항) 🚀
더 안정적인 공유를 원한다면 Supabase를 설정하세요:

#### Supabase 프로젝트 생성
1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 설정에서 API URL과 anon key 확인

#### 환경 변수 설정
`.env.local` 파일에 다음 변수들을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 데이터베이스 테이블 생성
Supabase 대시보드의 SQL Editor에서 `database_setup.sql` 파일의 내용을 실행하세요.

### 3. 카카오톡 공유 강화 (선택사항) 🎯
더 나은 카카오톡 공유를 원한다면:

#### 카카오 개발자 계정 설정
1. [developers.kakao.com](https://developers.kakao.com)에서 앱 생성
2. JavaScript 키 확인

#### 환경 변수 추가
```env
NEXT_PUBLIC_KAKAO_APP_KEY=your_kakao_app_key_here
```

## 사용법 변화

### 이전 (문제 상황)
- ❌ Supabase 없으면 공유 불가
- ❌ 로그인 필수
- ❌ 설정 복잡

### 현재 (개선 완료)
- ✅ **설정 없이도 즉시 공유 가능**
- ✅ **로그인 불필요**
- ✅ **다양한 공유 방법 자동 선택**
- ✅ **폴백 시스템으로 항상 작동**

## 공유 시나리오

### 시나리오 1: 완전 설정 (최고 경험)
1. Supabase + 카카오 모두 설정
2. 영구 링크 생성 → 카카오톡 네이티브 공유
3. 친구가 언제든 접속 가능

### 시나리오 2: 기본 설정 (권장)
1. 별도 설정 없음
2. 임시 링크 생성 → 카카오톡 웹 공유
3. 24시간 내 접속 권장

### 시나리오 3: 최소 기능
1. 구형 브라우저 등
2. URL 복사 → 수동 붙여넣기
3. 기본적인 공유 가능

## 보안 및 개인정보

### 데이터 보호 ✅
- 사용자별 완전 격리
- 개인정보 수집 최소화
- 이미지는 Base64로 안전 저장

### 자동 정리 ✅
- 임시 데이터는 브라우저 종료 시 삭제
- Supabase 데이터는 30일 후 자동 삭제
- 불필요한 데이터 누적 방지

## 문제 해결

### 공유가 안 되는 경우
1. **브라우저 새로고침** 후 다시 시도
2. **팝업 차단 해제** (카카오톡 공유 시)
3. **쿠키/localStorage 허용** 확인
4. **네트워크 연결** 상태 확인

### 카카오톡 공유 문제
- 카카오톡 앱이 설치되어 있는지 확인
- 웹 공유 페이지가 열리지 않으면 팝업 차단 해제
- 모바일에서는 카카오톡 앱으로 자동 전환

### 공유 링크 접속 불가
- **임시 공유**: 24시간 내 접속 권장
- **영구 공유**: Supabase 설정 상태 확인
- **캐시 문제**: 브라우저 새로고침

## API 변경사항

### POST /api/share (개선됨)
**이전**: userId 필수
```json
{
  "analysisResult": { ... },
  "userId": "required"  // 필수였음
}
```

**현재**: userId 선택사항
```json
{
  "analysisResult": { ... },
  "userId": "optional"  // 선택사항
}
```

### 응답 처리
```javascript
// Supabase 설정 시
{ "shareId": "uuid-string" }

// Supabase 미설정 시  
{ "error": "Supabase가 설정되지 않았습니다." }
// → 클라이언트에서 로컬 공유로 폴백
```

## 성능 최적화

### 로딩 시간 단축 ⚡
- 카카오 SDK 사전 로드
- 공유 버튼 클릭 시 즉시 반응
- 네트워크 오류 시 자동 폴백

### 사용자 경험 개선 🎯
- 공유 방법 자동 선택
- 명확한 피드백 메시지
- 실패 시 대안 제시

이제 **모든 사용자가 설정 없이도 즉시 공유할 수 있습니다!** 🎉 