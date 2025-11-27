# 🍲 국밥 취향 테스트 프로젝트 인수인계 문서

## 📌 프로젝트 개요

**프로젝트명**: 1953형제돼지국밥 - 국밥 취향 테스트 & 시뮬레이션 게임  
**개발 기간**: 2024년 11월  
**개발자**: eongtta929  
**배포 URL**: [Vercel에서 확인]

---

## 🔑 계정 정보 및 접근 권한

### 1. GitHub 저장소
- **저장소 URL**: https://github.com/eongtta929/web-project
- **계정**: eongtta929
- **브랜치**: main
- **접근 방법**: 
  - GitHub 계정으로 로그인
  - Settings → Collaborators에서 담당자 이메일 추가
  - 또는 저장소 소유권 이전 (Settings → Transfer ownership)

### 2. Vercel (배포 플랫폼)
- **계정**: eongtta929 계정으로 배포됨
- **팀**: eongtta-projects
- **프로젝트명**: web-project
- **배포 URL**: [대시보드에서 확인]
- **접근 방법**:
  - Vercel 대시보드: https://vercel.com/dashboard
  - Settings → Members에서 담당자 초대
  - 또는 프로젝트 이전 (Settings → Transfer Project)

### 3. Supabase (데이터베이스 & 인증)
- **프로젝트 URL**: https://tgsurpohtwmmjssfzydo.supabase.co
- **계정**: eongtta929@gmail.com
- **프로젝트명**: [Supabase 대시보드에서 확인]
- **접근 방법**:
  - Supabase 대시보드: https://supabase.com/dashboard
  - Organization Settings → Members에서 담당자 초대
  - Owner 권한 부여 필요

---

## 📦 프로젝트 구조

```
web-project/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 페이지 (게임 인트로)
│   ├── survey/            # 설문 페이지
│   ├── game/              # 시뮬레이션 게임
│   ├── admin/             # 관리자 대시보드
│   │   ├── login/         # 관리자 로그인
│   │   ├── analytics/     # 결과 시각화
│   │   ├── banner/        # 배너 관리
│   │   └── questions/     # 문항 편집
│   └── api/               # API 라우트
│       ├── survey/        # 설문 결과 저장
│       └── export/        # Google Sheets 내보내기
├── lib/                   # 유틸리티 함수
│   ├── supabase.ts       # Supabase 클라이언트
│   ├── auth.ts           # 인증 함수
│   └── surveyData.ts     # 설문 데이터 & 로직
├── public/
│   └── game-images/      # 게임 이미지 에셋
├── supabase/
│   └── migrations/       # 데이터베이스 스키마
└── types/                # TypeScript 타입 정의
```

---

## 🗄️ 데이터베이스 구조 (Supabase)

### 테이블 목록

#### 1. `responses` - 설문 응답 데이터
```sql
- id (uuid, PK)
- created_at (timestamp)
- result_type (text) - 결과 유형 (clear/white/fire/mara)
- scores (jsonb) - 각 국밥 유형별 점수
- q0 ~ q6 (text) - 각 질문의 선택 코드
```

#### 2. `questions` - 설문 문항
```sql
- id (uuid, PK)
- question_text (text) - 질문 내용
- category (text) - 카테고리
- order_index (int) - 순서
- is_scored (boolean) - 점수 계산 여부
- weight (numeric) - 가중치
```

#### 3. `options` - 설문 선택지
```sql
- id (uuid, PK)
- question_id (uuid, FK)
- option_text (text) - 선택지 내용
- option_index (int) - 순서
- ratio_clear/white/fire/mara (numeric) - 각 국밥 유형 비율
```

#### 4. `admin_users` - 관리자 계정
```sql
- id (uuid, PK)
- email (text, unique) - 관리자 이메일
- created_at (timestamp)
```

#### 5. `event_banners` - 이벤트 배너
```sql
- id (uuid, PK)
- image_url (text) - 배너 이미지 URL
- link_url (text) - 클릭 시 이동 URL
- is_active (boolean) - 활성화 여부
- created_at/updated_at (timestamp)
```

---

## 🔐 환경 변수

### Vercel 환경 변수 (이미 설정됨)
```
NEXT_PUBLIC_SUPABASE_URL=https://tgsurpohtwmmjssfzydo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Supabase에서 확인]
```

### Google Sheets 연동 (선택사항)
```
GOOGLE_SHEETS_PRIVATE_KEY=[Google Cloud Console에서 발급]
GOOGLE_SHEETS_CLIENT_EMAIL=[서비스 계정 이메일]
GOOGLE_SHEET_ID=[스프레드시트 ID]
```

---

## 👨‍💼 관리자 기능

### 관리자 계정 추가 방법
1. Supabase 대시보드 → SQL Editor
2. 다음 쿼리 실행:
```sql
INSERT INTO admin_users (email) 
VALUES ('담당자이메일@example.com');
```
3. Supabase Authentication → Users에서 해당 이메일로 사용자 생성
4. 관리자는 `/admin/login`에서 로그인

### 관리자 페이지 기능
- **대시보드** (`/admin`): 통계 및 Google Sheets 내보내기
- **결과 시각화** (`/admin/analytics`): 차트 및 그래프
- **문항 편집** (`/admin/questions`): 설문 문항 및 가중치 수정
- **배너 관리** (`/admin/banner`): 결과 페이지 배너 업로드/관리

---

## 🚀 배포 및 업데이트

### 자동 배포
- GitHub main 브랜치에 push하면 Vercel이 자동으로 배포
- 배포 상태는 Vercel 대시보드에서 확인

### 수동 배포
```bash
# 로컬에서 빌드 테스트
npm run build

# Vercel CLI로 배포
vercel --prod
```

### 롤백
- Vercel 대시보드 → Deployments
- 이전 배포 선택 → "Promote to Production"

---

## 🔧 유지보수 가이드

### 1. 설문 문항 수정
- 관리자 페이지 (`/admin/questions`)에서 직접 수정
- 또는 Supabase SQL Editor에서 `questions`, `options` 테이블 수정

### 2. 배너 추가/변경
- 관리자 페이지 (`/admin/banner`)에서 업로드
- 이미지는 Supabase Storage에 자동 저장

### 3. 데이터 백업
- Supabase 대시보드 → Database → Backups
- 또는 관리자 페이지에서 Google Sheets로 내보내기

### 4. 이미지 에셋 추가
- `public/game-images/` 폴더에 이미지 추가
- GitHub에 push하면 자동 배포

---

## 🐛 문제 해결

### 관리자 로그인 안 됨
1. Supabase Authentication → URL Configuration 확인
2. Site URL과 Redirect URLs에 배포 도메인 추가
3. `admin_users` 테이블에 이메일 등록 확인

### 설문 응답 저장 안 됨
1. Supabase → Database → Tables → `responses` 확인
2. Row Level Security (RLS) 정책 확인
3. 브라우저 콘솔에서 에러 확인

### 배포 실패
1. Vercel 대시보드 → Deployments → Build Logs 확인
2. TypeScript 에러인 경우 로컬에서 `npm run build` 테스트
3. 환경 변수 설정 확인

---

## 📞 기술 스택

- **프론트엔드**: Next.js 14 (App Router), React, TypeScript
- **스타일링**: Tailwind CSS
- **애니메이션**: Framer Motion
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Auth
- **배포**: Vercel
- **차트**: Recharts
- **폰트**: 이사만루체 (웹폰트)

---

## 📝 주요 기능

### 사용자 기능
1. **설문 조사**: 7개 질문으로 국밥 취향 분석
2. **시뮬레이션 게임**: 국밥 만들기 체험
3. **결과 공유**: 국밥 유형별 결과 및 설명

### 관리자 기능
1. **실시간 통계**: 응답 수, 결과 분포
2. **데이터 시각화**: 인구통계, 선호도 차트
3. **문항 관리**: 질문, 선택지, 가중치 수정
4. **배너 관리**: 이벤트 배너 업로드/활성화
5. **데이터 내보내기**: Google Sheets 연동

---

## 🔄 인수인계 체크리스트

### 계정 이전
- [ ] GitHub 저장소 Collaborator 추가 또는 소유권 이전
- [ ] Vercel 프로젝트 멤버 추가 또는 이전
- [ ] Supabase 프로젝트 멤버 추가 (Owner 권한)
- [ ] 관리자 계정 추가 (`admin_users` 테이블)

### 문서 전달
- [ ] 이 인수인계 문서
- [ ] `SUPABASE_SETUP.md` (Supabase 설정 가이드)
- [ ] `GOOGLE_SHEETS_SETUP.md` (Google Sheets 연동 가이드)
- [ ] `README_GUKBAP.md` (프로젝트 설명)

### 접근 정보 전달
- [ ] Supabase URL 및 API Keys
- [ ] Vercel 배포 URL
- [ ] 관리자 로그인 이메일/비밀번호
- [ ] GitHub 저장소 URL

### 테스트
- [ ] 배포된 사이트 정상 작동 확인
- [ ] 설문 응답 저장 확인
- [ ] 관리자 로그인 확인
- [ ] 데이터 시각화 확인

---

## 📧 연락처

**개발자**: eongtta929  
**이메일**: eongtta929@gmail.com  
**GitHub**: https://github.com/eongtta929

---

## 📅 마지막 업데이트

- **날짜**: 2024년 11월 27일
- **버전**: 1.0
- **최종 커밋**: 7af8da8

---

## 💡 추가 개선 사항 제안

1. **Google Analytics 연동**: 사용자 행동 분석
2. **카카오톡 공유**: 결과 공유 기능 강화
3. **모바일 최적화**: 반응형 디자인 개선
4. **A/B 테스트**: 문항 및 UI 최적화
5. **다국어 지원**: 영어/중국어 버전

---

**이 문서는 프로젝트 인수인계를 위해 작성되었습니다.**  
**문의사항이 있으시면 언제든지 연락 주세요!** 🍲

