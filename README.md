# 🍲 국밥 브랜드 - 인터랙티브 웹사이트

Next.js와 React로 구현한 국밥 브랜드의 인터랙티브 페이지입니다.

## 📋 프로젝트 개요

이 프로젝트는 두 가지 인터랙티브 체험을 제공합니다:

1. **심리테스트** (`/survey`) - 사용자의 국밥 취향을 알아보는 5가지 질문
2. **시뮬레이션 게임** (`/game`) - 국밥집 사장님이 되어 선택을 통해 이야기를 만들어가는 게임

## 🛠 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **애니메이션**: Framer Motion
- **데이터 저장**: Next.js API Routes (Google Sheets 연동 예정)

## 📁 프로젝트 구조

```
├── app/
│   ├── api/
│   │   └── survey/
│   │       └── route.ts          # 설문 결과 저장 API
│   ├── game/
│   │   └── page.tsx              # 시뮬레이션 게임 페이지
│   └── survey/
│       └── page.tsx              # 심리테스트 페이지
├── src/
│   ├── app/
│   │   ├── globals.css           # 전역 스타일
│   │   ├── layout.tsx            # 루트 레이아웃
│   │   └── page.tsx              # 메인 페이지
│   ├── components/
│   │   ├── PageTransition.tsx    # 페이지 전환 애니메이션
│   │   └── ProgressBar.tsx       # 진행률 표시 바
│   ├── lib/
│   │   ├── surveyData.ts         # 심리테스트 데이터
│   │   └── gameData.ts           # 게임 데이터
│   └── types/
│       ├── survey.ts             # 심리테스트 타입 정의
│       └── game.ts               # 게임 타입 정의
├── tailwind.config.ts            # Tailwind 설정
└── package.json
```

## 🎨 디자인 시스템

### 컬러 팔레트 (국밥 브랜드 테마)

```typescript
colors: {
  gukbap: {
    ivory: "#FFF8F0",      // 배경 - 아이보리
    cream: "#F5E6D3",      // 서브 배경 - 크림
    brown: "#8B6F47",      // 메인 브라운
    darkBrown: "#5C4A2F",  // 다크 브라운 (텍스트)
    red: "#D84315",        // 포인트 레드
    lightRed: "#FF6F43",   // 라이트 레드 (호버)
  }
}
```

### 주요 컴포넌트 클래스

- `.btn-primary` - 주요 버튼 (빨간색, 둥근 모서리)
- `.btn-option` - 선택지 버튼 (흰색 배경, 브라운 테두리)
- `.card` - 카드 컨테이너 (흰색, 그림자, 둥근 모서리)

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
npm start
```

## 📝 데이터 수정 방법

### 심리테스트 질문 수정

`src/lib/surveyData.ts` 파일에서 질문과 선택지를 수정할 수 있습니다:

```typescript
export const surveyData: SurveyData = {
  title: "나의 국밥 취향 찾기",
  description: "당신에게 딱 맞는 국밥 스타일을 찾아드립니다!",
  questions: [
    {
      id: "q1",
      question: "질문 내용",
      options: [
        { id: "q1-a", text: "선택지 1", value: "value1" },
        { id: "q1-b", text: "선택지 2", value: "value2" },
        // ...
      ]
    },
    // ...
  ]
};
```

### 게임 스토리 수정

`src/lib/gameData.ts` 파일에서 게임 시나리오를 수정할 수 있습니다:

```typescript
export const gameData: GameData = {
  title: "국밥집 사장님 되기",
  startNodeId: "start",
  nodes: {
    start: {
      id: "start",
      type: "story",           // 'story' | 'choice' | 'ending'
      content: "스토리 내용",
      delay: 3000,             // 자동 진행 딜레이 (ms)
      nextNodeId: "next-node"  // 다음 노드 ID
    },
    // ...
  }
};
```

## 🔗 Google Sheets 연동 (예정)

현재 `app/api/survey/route.ts`는 더미 함수로 구현되어 있습니다.
Google Sheets 연동을 위해서는 다음 단계를 따르세요:

1. Google Apps Script 생성
2. Web App으로 배포
3. `app/api/survey/route.ts`에서 Apps Script URL로 데이터 전송
4. Apps Script에서 Google Sheets에 데이터 저장

## ✨ 주요 기능

### 심리테스트 페이지 (`/survey`)

- ✅ 한 화면에 하나의 질문만 표시
- ✅ 선택 시 부드러운 애니메이션과 함께 다음 질문으로 전환
- ✅ 진행률 표시 바
- ✅ 완료 후 결과 저장 (API 연동 준비)
- ✅ 모바일 반응형 디자인

### 시뮬레이션 게임 페이지 (`/game`)

- ✅ 스토리 자동 진행 (설정된 딜레이 후)
- ✅ 선택지 기반 분기 시스템
- ✅ 다양한 엔딩
- ✅ 방문한 노드 추적
- ✅ 부드러운 페이지 전환 애니메이션

### 공통 기능

- ✅ Framer Motion을 활용한 자연스러운 애니메이션
- ✅ 모바일 우선 반응형 디자인
- ✅ 따뜻한 국밥 브랜드 컬러 시스템
- ✅ TypeScript로 타입 안정성 보장

## 🎯 설계 의도

### 1. 컴포넌트 분리

- **PageTransition**: 모든 페이지 전환에 일관된 애니메이션 적용
- **ProgressBar**: 재사용 가능한 진행률 표시 컴포넌트

### 2. 데이터 분리

- 질문/게임 데이터를 별도 파일로 분리하여 쉽게 수정 가능
- TypeScript 타입 정의로 데이터 구조 명확화

### 3. 사용자 경험

- 한 화면에 하나의 집중 요소만 표시
- 부드러운 애니메이션으로 자연스러운 흐름
- 모바일 우선 설계로 다양한 기기 지원

### 4. 확장성

- API Route 구조로 쉬운 백엔드 연동
- 노드 기반 게임 시스템으로 복잡한 스토리 구현 가능
- 컴포넌트 재사용으로 유지보수 용이

## 📱 반응형 디자인

- **모바일**: 320px ~ 768px
- **태블릿**: 768px ~ 1024px
- **데스크톱**: 1024px 이상

모든 페이지는 모바일 우선으로 설계되었으며, Tailwind의 반응형 클래스를 활용합니다.

## 🎨 애니메이션

Framer Motion을 사용한 주요 애니메이션:

- **페이드 인/아웃**: 페이지 전환 시
- **슬라이드**: 선택지 등장 시
- **스케일**: 버튼 호버 시
- **진행률 바**: 부드러운 증가 애니메이션

## 📄 라이선스

이 프로젝트는 국밥 브랜드를 위한 맞춤 제작 웹사이트입니다.

---

Made with ❤️ and 🍲

