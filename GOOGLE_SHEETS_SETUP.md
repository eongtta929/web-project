# Google Sheets 연동 설정 가이드

## 1. Google Cloud Console 설정

### 1-1. 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 이름: "국밥 취향 테스트" (또는 원하는 이름)

### 1-2. Google Sheets API 활성화

1. 좌측 메뉴에서 "API 및 서비스" > "라이브러리" 선택
2. "Google Sheets API" 검색
3. "사용 설정" 클릭

### 1-3. 서비스 계정 생성

1. 좌측 메뉴에서 "API 및 서비스" > "사용자 인증 정보" 선택
2. 상단의 "+ 사용자 인증 정보 만들기" 클릭
3. "서비스 계정" 선택
4. 서비스 계정 세부정보 입력:
   - 이름: "gukbap-survey-exporter"
   - 설명: "국밥 취향 테스트 데이터 내보내기"
5. "만들기 및 계속하기" 클릭
6. 역할 선택: "편집자" (선택사항)
7. "완료" 클릭

### 1-4. 서비스 계정 키 생성

1. 생성된 서비스 계정 클릭
2. "키" 탭 선택
3. "키 추가" > "새 키 만들기" 클릭
4. 키 유형: JSON 선택
5. "만들기" 클릭
6. JSON 파일 다운로드 (안전한 곳에 보관)

## 2. 환경 변수 설정

다운로드한 JSON 파일에서 다음 정보를 확인:

```json
{
  "client_email": "gukbap-survey-exporter@project-id.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

`.env.local` 파일에 추가:

```env
GOOGLE_CLIENT_EMAIL=gukbap-survey-exporter@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

⚠️ **주의:** `private_key`는 따옴표로 감싸고, `\n`을 그대로 유지해야 합니다.

## 3. Google Sheets 준비

### 3-1. 스프레드시트 생성

1. [Google Sheets](https://sheets.google.com) 접속
2. 새 스프레드시트 생성
3. 이름: "국밥 취향 테스트 응답"

### 3-2. 서비스 계정에 권한 부여

1. 스프레드시트 우측 상단 "공유" 버튼 클릭
2. 서비스 계정 이메일 주소 입력
   - 예: `gukbap-survey-exporter@project-id.iam.gserviceaccount.com`
3. 권한: "편집자" 선택
4. "전송" 클릭

### 3-3. Spreadsheet ID 확인

스프레드시트 URL에서 ID 복사:

```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
                                      ↑ 이 부분이 Spreadsheet ID
```

## 4. 사용 방법

### 4-1. 수동 내보내기

1. 어드민 대시보드 접속 (http://localhost:3001/admin)
2. "Google Sheet로 내보내기" 버튼 클릭
3. Spreadsheet ID 입력
4. 형식 선택:
   - 확인: 원문 텍스트 형식 (예: "20대 남성", "속을 따뜻하게...")
   - 취소: 코드 형식 (예: "A1", "A2")
5. 내보내기 완료 확인

### 4-2. 내보내기 옵션

현재 구현된 기능:
- ✅ 전체 응답 내보내기
- ✅ 코드/텍스트 형식 선택
- ✅ 새 시트 자동 생성 (타임스탬프 포함)

추가 구현 가능한 기능:
- 기간별 필터링 (startDate, endDate 파라미터 사용)
- 특정 결과 유형만 내보내기
- 실시간 동기화 (Supabase Edge Functions 활용)

## 5. 내보내기 데이터 구조

### 컬럼 목록

| 컬럼명 | 설명 |
|--------|------|
| ID | 응답 고유 ID (UUID) |
| 응답 일시 | 응답 생성 시간 |
| Q0 (인구통계) | 성별/연령대 |
| Q1 | 현재 상태 |
| Q2 | 메인 토핑 선호도 |
| Q3 | 면 사리 선호도 |
| Q4 | 맵기 선호도 |
| Q5 | 토핑 종류 선호도 |
| Q6 | 국밥 철학 |
| 결과 유형 | clear/white/fire/mara |
| 맑은 국밥 점수 | 0~100 |
| 뽀얀 국밥 점수 | 0~100 |
| 불꽃 국밥 점수 | 0~100 |
| 마라 국밥 점수 | 0~100 |

### 코드 형식 예시

```
A1, A2, A3, clear, 23.8, 32.2, 31.4, 12.6
```

### 텍스트 형식 예시

```
20대 남성, 시원~~한 국물 없나?, 담백하고 쫄깃한 고기 최고!, clear, 23.8, 32.2, 31.4, 12.6
```

## 6. 문제 해결

### 권한 오류

```
Error: The caller does not have permission
```

**해결 방법:**
1. 서비스 계정 이메일이 스프레드시트에 공유되었는지 확인
2. 권한이 "편집자"로 설정되었는지 확인
3. Google Sheets API가 활성화되었는지 확인

### Private Key 오류

```
Error: error:0909006C:PEM routines:get_name:no start line
```

**해결 방법:**
1. `.env.local`에서 `GOOGLE_PRIVATE_KEY`가 따옴표로 감싸져 있는지 확인
2. `\n`이 실제 줄바꿈이 아닌 문자열로 유지되는지 확인
3. 개발 서버 재시작

### Spreadsheet ID 오류

```
Error: Unable to parse range: ...
```

**해결 방법:**
1. Spreadsheet ID가 올바른지 확인
2. URL 전체가 아닌 ID 부분만 입력했는지 확인

## 7. 실시간 동기화 구현 (선택사항)

Supabase Edge Functions를 사용하여 실시간 동기화 구현 가능:

### 7-1. Edge Function 생성

```typescript
// supabase/functions/sync-to-sheets/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  // 새 응답이 저장될 때마다 자동으로 Google Sheets에 추가
  // ...
})
```

### 7-2. Database Webhook 설정

1. Supabase 대시보드 > Database > Webhooks
2. "Create a new hook" 클릭
3. Table: responses
4. Events: INSERT
5. HTTP Request: Edge Function URL

## 8. 데이터 분석 팁

### Google Sheets에서 활용

1. **피벗 테이블**: 인구통계별 결과 분포 분석
2. **차트**: 시간대별 응답 추이 시각화
3. **필터**: 특정 조건의 응답만 확인
4. **조건부 서식**: 높은 점수 강조 표시

### 데이터 스튜디오 연동

1. Google Sheets를 데이터 소스로 연결
2. 대시보드 생성
3. 실시간 업데이트 설정

## 다음 단계

- [ ] 실시간 동기화 구현
- [ ] 기간별 필터링 UI 추가
- [ ] 여러 스프레드시트 관리
- [ ] 내보내기 이력 저장

