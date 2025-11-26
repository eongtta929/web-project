import { GameData } from '@/types/game';

// 시뮬레이션 게임 데이터 - 국밥집 운영 스토리
export const gameData: GameData = {
  title: "국밥집 사장님 되기",
  startNodeId: "start",
  nodes: {
    start: {
      id: "start",
      type: "story",
      content: "당신은 오늘부터 국밥집 사장님입니다.\n\n할아버지께서 물려주신 작은 국밥집...\n\n과연 성공적으로 운영할 수 있을까요?",
      delay: 3000,
      nextNodeId: "morning"
    },
    morning: {
      id: "morning",
      type: "story",
      content: "아침 6시, 새벽 장사 준비 시간입니다.\n\n국물을 끓이는 냄새가 골목에 퍼집니다.",
      delay: 2500,
      nextNodeId: "first-customer"
    },
    "first-customer": {
      id: "first-customer",
      type: "choice",
      content: "첫 손님이 들어왔습니다.\n\n'사장님, 국밥 하나 주세요!'\n\n어떻게 대응하시겠습니까?",
      choices: [
        {
          id: "choice-warm",
          text: "따뜻하게 인사하며 주문을 받는다",
          nextNodeId: "warm-service"
        },
        {
          id: "choice-quick",
          text: "빠르게 주문을 받고 조리에 집중한다",
          nextNodeId: "quick-service"
        },
        {
          id: "choice-chat",
          text: "손님과 이야기를 나누며 취향을 물어본다",
          nextNodeId: "chat-service"
        }
      ]
    },
    "warm-service": {
      id: "warm-service",
      type: "story",
      content: "손님이 당신의 따뜻한 미소에 기분 좋게 식사를 시작합니다.\n\n'여기 국밥 정말 맛있네요!'",
      delay: 2500,
      nextNodeId: "lunch-rush"
    },
    "quick-service": {
      id: "quick-service",
      type: "story",
      content: "빠른 서빙에 손님이 만족스러워합니다.\n\n'여기 회전율 좋은데? 다음에 또 와야겠어.'",
      delay: 2500,
      nextNodeId: "lunch-rush"
    },
    "chat-service": {
      id: "chat-service",
      type: "story",
      content: "손님과의 대화로 단골이 될 가능성이 보입니다.\n\n'사장님 정말 친절하시네요. 자주 올게요!'",
      delay: 2500,
      nextNodeId: "lunch-rush"
    },
    "lunch-rush": {
      id: "lunch-rush",
      type: "choice",
      content: "점심시간, 손님들이 몰려들기 시작합니다!\n\n주문이 밀리고 있습니다.\n\n어떻게 하시겠습니까?",
      choices: [
        {
          id: "choice-quality",
          text: "천천히 하더라도 맛을 유지한다",
          nextNodeId: "quality-focus"
        },
        {
          id: "choice-speed",
          text: "빠르게 서빙하는 것에 집중한다",
          nextNodeId: "speed-focus"
        },
        {
          id: "choice-help",
          text: "아르바이트생을 급하게 구한다",
          nextNodeId: "hire-help"
        }
      ]
    },
    "quality-focus": {
      id: "quality-focus",
      type: "story",
      content: "손님들이 조금 기다렸지만, 맛에 감동합니다.\n\n'역시 맛집은 기다릴 가치가 있어!'",
      delay: 2500,
      nextNodeId: "evening"
    },
    "speed-focus": {
      id: "speed-focus",
      type: "story",
      content: "빠른 서빙으로 많은 손님을 받았습니다.\n\n매출이 올라가고 있습니다!",
      delay: 2500,
      nextNodeId: "evening"
    },
    "hire-help": {
      id: "hire-help",
      type: "story",
      content: "아르바이트생의 도움으로 위기를 넘겼습니다.\n\n팀워크의 중요성을 느낍니다.",
      delay: 2500,
      nextNodeId: "evening"
    },
    evening: {
      id: "evening",
      type: "choice",
      content: "저녁 시간, 단골 할머니께서 오셨습니다.\n\n'사장님, 오늘 국밥이 좀 싱거운 것 같아요.'\n\n어떻게 대응하시겠습니까?",
      choices: [
        {
          id: "choice-apologize",
          text: "죄송하다며 새로 만들어드린다",
          nextNodeId: "apologize-ending"
        },
        {
          id: "choice-adjust",
          text: "간을 맞춰드리고 취향을 기억한다",
          nextNodeId: "adjust-ending"
        },
        {
          id: "choice-explain",
          text: "건강을 생각해 염도를 낮췄다고 설명한다",
          nextNodeId: "explain-ending"
        }
      ]
    },
    "apologize-ending": {
      id: "apologize-ending",
      type: "ending",
      content: "🏆 완벽주의 사장님\n\n당신은 손님의 만족을 최우선으로 생각하는 사장님입니다.\n\n할머니는 당신의 정성에 감동하여 더욱 자주 방문하게 되었습니다.\n\n국밥집은 '정성 가득한 맛집'으로 소문이 났습니다!"
    },
    "adjust-ending": {
      id: "adjust-ending",
      type: "ending",
      content: "🎯 세심한 사장님\n\n당신은 손님 개개인의 취향을 기억하는 사장님입니다.\n\n단골들이 '우리 사장님은 내 입맛을 알아'라며 자랑합니다.\n\n국밥집은 '단골이 많은 동네 맛집'이 되었습니다!"
    },
    "explain-ending": {
      id: "explain-ending",
      type: "ending",
      content: "💚 건강 지킴이 사장님\n\n당신은 손님의 건강까지 생각하는 사장님입니다.\n\n할머니는 당신의 마음씨에 감동하여 주변에 소문을 냈습니다.\n\n국밥집은 '건강한 한 끼를 책임지는 맛집'으로 유명해졌습니다!"
    }
  }
};
