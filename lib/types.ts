// 심리테스트 타입 정의
export interface SurveyQuestion {
  id: number;
  question: string;
  options: SurveyOption[];
}

export interface SurveyOption {
  id: string;
  text: string;
  value: string;
}

export interface SurveyResult {
  questionId: number;
  selectedOption: string;
  timestamp: string;
}

// 시뮬레이션 게임 타입 정의
export interface GameNode {
  id: string;
  type: 'story' | 'choice' | 'ending';
  content: string;
  choices?: GameChoice[];
  nextNode?: string; // story 타입일 때 자동으로 넘어갈 다음 노드
  delay?: number; // story 타입일 때 대기 시간 (ms)
}

export interface GameChoice {
  id: string;
  text: string;
  nextNode: string;
}

export interface GameState {
  currentNodeId: string;
  history: string[];
  choices: Record<string, string>;
}

