// 시뮬레이션 게임 관련 타입 정의
export interface GameChoice {
  id: string;
  text: string;
  nextNodeId: string;
}

export interface GameNode {
  id: string;
  type: 'story' | 'choice' | 'ending';
  content: string;
  choices?: GameChoice[];
  delay?: number; // 자동 진행 딜레이 (ms)
  nextNodeId?: string; // story 타입일 때 자동으로 다음 노드로
}

export interface GameData {
  title: string;
  startNodeId: string;
  nodes: Record<string, GameNode>;
}
