# 🍲 국밥 취향 테스트 웹페이지

당신에게 딱 맞는 국밥 스타일을 찾아드립니다!

## 📋 프로젝트 개요

사용자의 취향을 분석하여 4가지 국밥 유형(맑은 국밥, 뽀얀 국밥, 불꽃 국밥, 마라 국밥) 중 하나를 추천하는 인터랙티브 심리테스트 웹 애플리케이션입니다.

### 주요 기능

- ✅ **가중치 기반 점수 시스템**: 문항별 가중치와 선택지별 비율을 활용한 정교한 결과 계산
- ✅ **Supabase 연동**: 실시간 응답 저장 및 통계 분석
- ✅ **어드민 대시보드**: 응답 통계, 차트 시각화, 문항 편집
- ✅ **Google Sheets 내보내기**: 응답 데이터를 Google Sheets로 내보내기
- ✅ **이벤트 배너 관리**: 결과 화면에 표시할 배너 관리

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Sheets (선택사항)
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Supabase 설정

자세한 내용은 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 참조

1. Supabase 프로젝트 생성
2. SQL Editor에서 마이그레이션 실행:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_data.sql`
3. 어드민 사용자 등록:
   ```sql
   INSERT INTO admin_users (email) VALUES ('your-email@example.com');
   ```

### 4. 개발 서버 실행

```bash
npm run dev
```

- 설문 페이지: http://localhost:3001/survey
- 어드민 페이지: http://localhost:3001/admin

## 📊 국밥 유형

| 유형 | 이모지 | 설명 |
|------|--------|------|
| 맑은 국밥 | 🍲 | 깔끔하고 담백한 맛을 선호하는 정갈한 스타일 |
| 뽀얀 국밥 | 🥛 | 진하고 구수한 깊은 맛을 사랑하는 정통파 |
| 불꽃 국밥 | 🔥 | 매콤하고 자극적인 맛을 즐기는 열정파 |
| 마라 국밥 | 🌶️ | 새롭고 독특한 맛을 추구하는 모험가 |

## 🎯 점수 계산 시스템

### 가중치 기반 계산

```
국밥 유형별 최종 점수 = Σ (문항 가중치 × 선택지 비율)
```

### 초기 설정

- **점수 계산 문항**: Q1, Q3, Q4, Q5, Q6 (각 20%)
- **제외 문항**: Q0 (인구통계), Q2 (의견 조사)

### 예시

```
사용자 선택: Q1-A3, Q3-A2, Q4-A1, Q5-A1, Q6-A2

clear = (20% × 1%) + (20% × 8%) + (20% × 50%) + (20% × 42%) + (20% × 18%)
      = 0.2 + 1.6 + 10.0 + 8.4 + 3.6 = 23.8점

결과: white (뽀얀 국밥) - 32.2점으로 최고
```

## 🔧 기술 스택

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage)
- **Charts**: Recharts
- **External API**: Google Sheets API v4

## 📁 프로젝트 구조

```
web-project-main/
├── app/
│   ├── survey/              # 설문 페이지
│   │   └── page.tsx
│   ├── admin/               # 어드민 페이지
│   │   ├── page.tsx         # 대시보드
│   │   ├── login/           # 로그인
│   │   ├── analytics/       # 결과 시각화
│   │   ├── questions/       # 문항 편집
│   │   └── banner/          # 배너 관리
│   └── api/
│       ├── survey/          # 응답 저장 API
│       └── export/          # Google Sheets 내보내기
├── lib/
│   ├── supabase.ts          # Supabase 클라이언트
│   ├── auth.ts              # 인증 유틸리티
│   └── surveyData.ts        # 설문 데이터 및 점수 계산
├── types/
│   └── survey.ts            # TypeScript 타입 정의
├── supabase/
│   └── migrations/          # 데이터베이스 마이그레이션
└── components/              # 재사용 컴포넌트
```

## 🔐 어드민 기능

### 인증

- Supabase Auth 기반 이메일/비밀번호 인증
- `admin_users` 테이블에 등록된 이메일만 접근 가능

### 대시보드

- 총 응답 수 / 오늘 응답 수
- 최근 7일 응답 추이
- 국밥 유형별 분포
- Google Sheets 내보내기

### 결과 시각화

- 인구통계 분석 (성별/연령대별 분포)
- 맛 선호도 분석 (Q1, Q4, Q6)
- 토핑 선호도 분석 (Q2, Q3, Q5)
- 인터랙티브 차트 (Pie, Bar)

### 문항 편집

- 문항 텍스트 수정
- 가중치 조정 (슬라이더)
- 선택지 비율 편집
- 균등 배분 기능

### 배너 관리

- 이미지 업로드 (Supabase Storage)
- 링크 URL 설정
- 활성화/비활성화 토글
- 배너 미리보기

## 📤 Google Sheets 연동

자세한 내용은 [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) 참조

### 설정 단계

1. Google Cloud Console에서 서비스 계정 생성
2. Google Sheets API 활성화
3. 서비스 계정 키 다운로드 (JSON)
4. 환경 변수 설정
5. 스프레드시트에 서비스 계정 공유

### 사용 방법

1. 어드민 대시보드에서 "Google Sheet로 내보내기" 클릭
2. Spreadsheet ID 입력
3. 형식 선택 (코드/텍스트)
4. 내보내기 완료

## 🗄️ 데이터베이스 스키마

### responses (응답 테이블)

```sql
- id: UUID (PK)
- created_at: TIMESTAMPTZ
- q0~q6: TEXT (선택지 코드)
- result_type: TEXT (clear/white/fire/mara)
- scores: JSONB (각 유형별 점수)
```

### questions (문항 설정)

```sql
- id: TEXT (PK)
- question_text: TEXT
- category: TEXT
- order_index: INT
- is_scored: BOOLEAN
- weight: FLOAT
```

### options (선택지 설정)

```sql
- id: TEXT (PK)
- question_id: TEXT (FK)
- option_text: TEXT
- option_index: INT
- ratio_clear/white/fire/mara: FLOAT
```

### event_banners (배너)

```sql
- id: UUID (PK)
- image_url: TEXT
- link_url: TEXT
- is_active: BOOLEAN
- created_at/updated_at: TIMESTAMPTZ
```

## 🔒 보안

- Row Level Security (RLS) 활성화
- 응답 저장: 누구나 가능
- 응답 조회: 어드민만 가능
- 문항/배너 관리: 어드민만 가능
- 환경 변수로 민감 정보 관리

## 🚢 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 환경 변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add GOOGLE_CLIENT_EMAIL
vercel env add GOOGLE_PRIVATE_KEY
```

### 환경 변수 확인

배포 전 다음 환경 변수가 설정되었는지 확인:
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ⚠️ GOOGLE_CLIENT_EMAIL (선택사항)
- ⚠️ GOOGLE_PRIVATE_KEY (선택사항)

## 📝 개발 가이드

### 문항 추가

1. `lib/surveyData.ts`에 문항 추가
2. Supabase에서 `questions`, `options` 테이블 업데이트
3. 가중치 재조정 (합계 100% 유지)

### 결과 유형 추가

1. `types/survey.ts`에서 `ScoreSet` 타입 수정
2. `lib/surveyData.ts`에서 `gukbapResults` 추가
3. 모든 선택지의 비율 업데이트

### 커스텀 차트 추가

1. `app/admin/analytics/page.tsx` 수정
2. Recharts 컴포넌트 활용
3. Supabase 쿼리로 데이터 가져오기

## 🐛 문제 해결

### Supabase 연결 오류

- 환경 변수 확인
- RLS 정책 확인
- 네트워크 연결 확인

### Google Sheets 권한 오류

- 서비스 계정 공유 확인
- API 활성화 확인
- Private Key 형식 확인

### 린트 오류

```bash
npm run lint
```

## 📄 라이선스

MIT License

## 👥 기여

이슈 및 PR 환영합니다!

## 📞 문의

프로젝트 관련 문의사항은 이슈로 등록해주세요.

---

**Made with ❤️ and 🍲**

