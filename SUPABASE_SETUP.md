# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속 및 로그인
2. "New Project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호 설정
4. 리전 선택 (한국의 경우 Northeast Asia (Seoul) 권장)
5. 프로젝트 생성 완료 대기 (약 2분 소요)

## 2. 데이터베이스 스키마 설정

### 방법 1: SQL Editor 사용 (권장)

1. Supabase 대시보드에서 "SQL Editor" 메뉴 선택
2. "New Query" 클릭
3. `supabase/migrations/001_initial_schema.sql` 파일 내용 복사 후 붙여넣기
4. "Run" 버튼 클릭하여 실행
5. 같은 방법으로 `supabase/migrations/002_seed_data.sql` 실행

### 방법 2: Supabase CLI 사용

```bash
# Supabase CLI 설치
npm install -g supabase

# 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push
```

## 3. 환경 변수 설정

1. Supabase 대시보드에서 "Settings" > "API" 메뉴 선택
2. 다음 정보 확인:
   - Project URL
   - anon public key

3. 프로젝트 루트에 `.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. 어드민 사용자 등록

### 방법 1: SQL Editor 사용

```sql
INSERT INTO admin_users (email) VALUES ('your-email@example.com');
```

### 방법 2: Supabase 대시보드 Table Editor 사용

1. "Table Editor" 메뉴 선택
2. "admin_users" 테이블 선택
3. "Insert" > "Insert row" 클릭
4. email 필드에 이메일 주소 입력
5. "Save" 클릭

## 5. Authentication 설정 (Phase 3에서 사용)

1. Supabase 대시보드에서 "Authentication" > "Providers" 메뉴 선택
2. "Email" 활성화
3. "Enable email confirmations" 체크 (선택사항)
4. "Save" 클릭

## 6. Storage 설정 (Phase 4 배너 이미지용)

1. Supabase 대시보드에서 "Storage" 메뉴 선택
2. "Create a new bucket" 클릭
3. Bucket 이름: `banners`
4. Public bucket 체크
5. "Create bucket" 클릭

## 7. 테이블 구조 확인

생성된 테이블:
- `responses`: 설문 응답 저장
- `questions`: 문항 설정 (어드민 편집용)
- `options`: 선택지 설정 (어드민 편집용)
- `admin_users`: 어드민 사용자 목록
- `event_banners`: 이벤트 배너 관리

## 8. 테스트

1. 개발 서버 실행: `npm run dev`
2. http://localhost:3001/survey 접속
3. 설문 완료 후 Supabase 대시보드에서 `responses` 테이블 확인

## 문제 해결

### RLS (Row Level Security) 오류

응답 저장 시 권한 오류가 발생하면:

```sql
-- responses 테이블의 INSERT 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'responses';

-- 필요시 정책 재생성
DROP POLICY IF EXISTS "Anyone can insert responses" ON responses;
CREATE POLICY "Anyone can insert responses" ON responses
  FOR INSERT WITH CHECK (true);
```

### 환경 변수 인식 안 됨

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 개발 서버 재시작 (`npm run dev` 다시 실행)
- 환경 변수 이름이 `NEXT_PUBLIC_` 접두사로 시작하는지 확인

## 다음 단계

Phase 2 완료 후:
- Phase 3: 어드민 인증 구현
- Phase 4: 어드민 대시보드 및 차트
- Phase 5: Google Sheets 연동

