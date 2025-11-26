// 심리테스트 관련 타입 정의

export interface ScoreSet {
  clear: number;   // 맑은 국밥
  white: number;   // 뽀얀 국밥
  fire: number;    // 불꽃 국밥
  mara: number;    // 마라 국밥
}

export interface SurveyOption {
  id: string;
  text: string;
  value: string;
  code: string;    // A1, A2, A3 등
  ratios: ScoreSet; // 각 국밥 유형별 비율 (합계 100%)
}

export interface SurveyQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: SurveyOption[];
  weight: number;  // 문항 가중치 (점수 계산 문항들의 합계 = 100%)
  isScored: boolean; // 점수 계산 포함 여부
  category: string; // 'demographic', 'taste', 'topping', 'opinion'
}

export interface SurveyResult {
  questionId: string;
  selectedOption: string;
  selectedCode: string; // A1, A2 등
  ratios: ScoreSet;
  timestamp: Date;
}

export interface SurveyData {
  title: string;
  description: string;
  questions: SurveyQuestion[];
}

export interface GukbapResult {
  type: 'clear' | 'white' | 'fire' | 'mara';
  emoji: string;
  title: string;
  description: string;
  detail: string;
}
