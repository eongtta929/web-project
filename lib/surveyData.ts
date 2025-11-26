import { SurveyData, SurveyResult } from '@/types/survey';

// 심리테스트 데이터 - 국밥 취향 테스트 (가중치 기반 점수 시스템)
export const surveyData: SurveyData = {
  title: "나의 국밥 취향 찾기",
  description: "당신에게 딱 맞는 국밥 스타일을 찾아드립니다!",
  questions: [
    {
      id: "Q0",
      question: "당신은 어떤 국밥 러버신가요?",
      category: "demographic",
      weight: 0,
      isScored: false,
      options: [
        { id: "Q0_A1", text: "20대 남성", value: "20s-male", code: "A1", ratios: { clear: 0, white: 0, fire: 0, mara: 0 } },
        { id: "Q0_A2", text: "20대 여성", value: "20s-female", code: "A2", ratios: { clear: 0, white: 0, fire: 0, mara: 0 } },
        { id: "Q0_A3", text: "30대 남성", value: "30s-male", code: "A3", ratios: { clear: 0, white: 0, fire: 0, mara: 0 } },
        { id: "Q0_A4", text: "30대 여성", value: "30s-female", code: "A4", ratios: { clear: 0, white: 0, fire: 0, mara: 0 } },
        { id: "Q0_A5", text: "40대 이상 남성", value: "40s-male", code: "A5", ratios: { clear: 0, white: 0, fire: 0, mara: 0 } },
        { id: "Q0_A6", text: "40대 이상 여성", value: "40s-female", code: "A6", ratios: { clear: 0, white: 0, fire: 0, mara: 0 } },
        { id: "Q0_A7", text: "선택 안 함", value: "none", code: "A7", ratios: { clear: 0, white: 0, fire: 0, mara: 0 } }
      ]
    },
    {
      id: "Q1",
      question: "지금 당신의 상태는?",
      category: "taste",
      weight: 20,
      isScored: true,
      options: [
        { id: "Q1_A1", text: "속을 따뜻하게 해주는 구수한 국물이 필요해…☆", value: "warm-soup", code: "A1", ratios: { clear: 2, white: 94, fire: 1, mara: 3 } },
        { id: "Q1_A2", text: "시원~~한 국물 없나? 해장이 필요해! ㅠㅠ", value: "refreshing", code: "A2", ratios: { clear: 71, white: 2, fire: 26, mara: 1 } },
        { id: "Q1_A3", text: "입이 심심한 걸? 매콤~한 자극이 필요해!", value: "spicy-kick", code: "A3", ratios: { clear: 1, white: 0, fire: 49, mara: 50 } }
      ]
    },
    {
      id: "Q2",
      question: "당신이 선호하는 국밥 메인 토핑은?",
      category: "opinion",
      weight: 0,
      isScored: false,
      options: [
        { id: "Q2_A1", text: "담백하고 쫄깃한 고기 최고!", value: "meat", code: "A1", ratios: { clear: 0, white: 0, fire: 0, mara: 0 } },
        { id: "Q2_A2", text: "야들야들 부드러운 고기 좋아", value: "soft-meat", code: "A2", ratios: { clear: 0, white: 0, fire: 0, mara: 0 } },
        { id: "Q2_A3", text: "국밥엔 순대가 짱이지~", value: "sundae", code: "A3", ratios: { clear: 0, white: 0, fire: 0, mara: 0 } },
        { id: "Q2_A4", text: "내장 국밥은 없나요?", value: "intestine", code: "A4", ratios: { clear: 0, white: 0, fire: 0, mara: 0 } }
      ]
    },
    {
      id: "Q3",
      question: "면 사리를 추가한다면?",
      category: "topping",
      weight: 20,
      isScored: true,
      options: [
        { id: "Q3_A1", text: "어허! 국밥에 면은 무슨 면!", value: "no-noodle", code: "A1", ratios: { clear: 48, white: 47, fire: 2, mara: 3 } },
        { id: "Q3_A2", text: "통통한 우동사리 너무 좋아~", value: "udon", code: "A2", ratios: { clear: 8, white: 8, fire: 75, mara: 9 } },
        { id: "Q3_A3", text: "특이하게 중국 당면은 어때?", value: "glass-noodle", code: "A3", ratios: { clear: 2, white: 1, fire: 9, mara: 88 } }
      ]
    },
    {
      id: "Q4",
      question: "당신은 맵찔이?!",
      category: "taste",
      weight: 20,
      isScored: true,
      options: [
        { id: "Q4_A1", text: "그래, 나 맵찔이다! 매운 건 완전 사양", value: "no-spicy", code: "A1", ratios: { clear: 50, white: 49, fire: 1, mara: 0 } },
        { id: "Q4_A2", text: "살짝 칼칼한 정도는 OK", value: "mild-spicy", code: "A2", ratios: { clear: 25, white: 24, fire: 37, mara: 14 } },
        { id: "Q4_A3", text: "훗 불닭 매운맛도 껌이에요", value: "super-spicy", code: "A3", ratios: { clear: 0, white: 1, fire: 49, mara: 50 } }
      ]
    },
    {
      id: "Q5",
      question: "토핑은 어떤 게 좋아?",
      category: "topping",
      weight: 20,
      isScored: true,
      options: [
        { id: "Q5_A1", text: "부추 팍팍 넣어야지!", value: "chives", code: "A1", ratios: { clear: 42, white: 41, fire: 15, mara: 2 } },
        { id: "Q5_A2", text: "부추, 대파 팍팍, 김가루 솔솔", value: "all-toppings", code: "A2", ratios: { clear: 1, white: 16, fire: 75, mara: 8 } },
        { id: "Q5_A3", text: "청경채 들어가면 맛있을 것 같은뎅?", value: "bok-choy", code: "A3", ratios: { clear: 0, white: 1, fire: 10, mara: 89 } }
      ]
    },
    {
      id: "Q6",
      question: "당신의 국밥 철학은?",
      category: "taste",
      weight: 20,
      isScored: true,
      options: [
        { id: "Q6_A1", text: "정갈하고 깔끔한 한 그릇", value: "clean", code: "A1", ratios: { clear: 65, white: 33, fire: 1, mara: 1 } },
        { id: "Q6_A2", text: "진하고 구수한 정통 맛", value: "traditional", code: "A2", ratios: { clear: 18, white: 63, fire: 17, mara: 2 } },
        { id: "Q6_A3", text: "새롭고 독특한 경험", value: "unique", code: "A3", ratios: { clear: 2, white: 2, fire: 21, mara: 75 } },
        { id: "Q6_A4", text: "시원하게 속 풀어주는 맛", value: "refreshing", code: "A4", ratios: { clear: 47, white: 2, fire: 49, mara: 2 } }
      ]
    }
  ]
};

// 국밥 타입별 결과
export const gukbapResults = {
  clear: {
    type: 'clear' as const,
    emoji: "🍲",
    title: "맑은 국밥",
    description: "",
    detail: ""
  },
  white: {
    type: 'white' as const,
    emoji: "🥛",
    title: "뽀얀 국밥",
    description: "",
    detail: ""
  },
  fire: {
    type: 'fire' as const,
    emoji: "🔥",
    title: "불꽃 국밥",
    description: "",
    detail: ""
  },
  mara: {
    type: 'mara' as const,
    emoji: "🌶️",
    title: "마라 국밥",
    description: "",
    detail: ""
  }
};

// 가중치 기반 점수 계산 함수
export function calculateResult(answers: SurveyResult[]) {
  const totalScores = {
    clear: 0,
    white: 0,
    fire: 0,
    mara: 0
  };

  // 가중치 기반 점수 계산
  answers.forEach(answer => {
    const question = surveyData.questions.find(q => q.id === answer.questionId);
    
    if (question && question.isScored && answer.ratios) {
      const weight = question.weight / 100; // 백분율을 소수로 변환
      
      totalScores.clear += weight * answer.ratios.clear;
      totalScores.white += weight * answer.ratios.white;
      totalScores.fire += weight * answer.ratios.fire;
      totalScores.mara += weight * answer.ratios.mara;
    }
  });

  // 가장 높은 점수를 가진 타입 찾기 (동점일 경우 clear > white > fire > mara 우선순위)
  const maxScore = Math.max(totalScores.clear, totalScores.white, totalScores.fire, totalScores.mara);
  
  let resultType: 'clear' | 'white' | 'fire' | 'mara' = 'clear';
  if (totalScores.clear === maxScore) resultType = 'clear';
  else if (totalScores.white === maxScore) resultType = 'white';
  else if (totalScores.fire === maxScore) resultType = 'fire';
  else if (totalScores.mara === maxScore) resultType = 'mara';

  return {
    type: resultType,
    scores: totalScores,
    result: gukbapResults[resultType]
  };
}

// 결과를 서버로 전송하는 함수
export async function submitSurveyResults(results: any) {
  try {
    const response = await fetch('/api/survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit survey results');
    }

    return data;
  } catch (error) {
    console.error('Error submitting survey results:', error);
    throw error;
  }
}
