'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SoupType = 'clear' | 'milky' | 'fire' | 'mala' | null;
type PageType = 'intro' | 'soup-select' | 'story' | 'loading' | 'cooking' | 'stir-game' | 'topping' | 'final-cooking' | 'ending';

const soupImages: Record<Exclude<SoupType, null>, string> = {
  clear: '/game-images/맑은국밥.png',
  milky: '/game-images/뽀얀국밥.png',
  fire: '/game-images/불꽃국밥.png',
  mala: '/game-images/마라국밥.png',
};

const soupNames: Record<Exclude<SoupType, null>, string> = {
  clear: '맑은 국밥',
  milky: '뽀얀 국밥',
  fire: '불꽃 국밥',
  mala: '마라 국밥',
};

export default function GamePage() {
  const [pageType, setPageType] = useState<PageType>('intro');
  const [storyPage, setStoryPage] = useState(1);
  const [selectedSoup, setSelectedSoup] = useState<SoupType>(null);
  const [stirCount, setStirCount] = useState(0);
  const [showGrandma, setShowGrandma] = useState(false);
  const [grandmaMessage, setGrandmaMessage] = useState<'more' | 'stop' | null>(null);
  const [endingPage, setEndingPage] = useState(1);

  // URL 파라미터 확인하여 국밥 선택 페이지로 바로 이동
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('start') === 'soup-select') {
      setPageType('soup-select');
    }
  }, []);

  // 자동 페이지 전환
  useEffect(() => {
    let timer: NodeJS.Timeout;

    // 스토리 1: 눈 깜빡임 후 자동 전환
    if (pageType === 'story' && storyPage === 1) {
      timer = setTimeout(() => {
        setStoryPage(2);
      }, 3000);
    }

    // 로딩 페이지 자동 전환
    if (pageType === 'loading') {
      timer = setTimeout(() => {
        setPageType('cooking');
      }, 3000);
    }

    // 조리 페이지 자동 전환
    if (pageType === 'final-cooking') {
      timer = setTimeout(() => {
        setPageType('ending');
        setEndingPage(1);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [pageType, storyPage]);

  const handleSoupSelect = (soup: Exclude<SoupType, null>) => {
    setSelectedSoup(soup);
    setPageType('story');
    setStoryPage(1);
  };

  const handleStir = () => {
    if (stirCount < 5) {
      setStirCount(prev => prev + 1);
    }
    if (stirCount >= 4) {
      setShowGrandma(true);
      setGrandmaMessage('stop');
    }
  };

  const handleStopStir = () => {
    if (stirCount < 4) {
      setShowGrandma(true);
      setGrandmaMessage('more');
    } else {
      setPageType('topping');
    }
  };

  const handleGrandmaClose = () => {
    setShowGrandma(false);
    setGrandmaMessage(null);
  };

  const handleRestart = () => {
    setPageType('intro');
    setStoryPage(1);
    setSelectedSoup(null);
    setStirCount(0);
    setShowGrandma(false);
    setGrandmaMessage(null);
    setEndingPage(1);
  };

  // 홈 아이콘 컴포넌트
  const HomeIcon = () => (
    <button
      onClick={() => window.location.href = '/'}
      className="fixed top-4 left-4 z-50 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110"
      title="메인으로"
    >
      <img src="/game-images/메인 페이지 아이콘.png" alt="홈" className="w-8 h-8" />
    </button>
  );

  // 인트로 페이지
  if (pageType === 'intro') {
    return (
      <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }}>
        <HomeIcon />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md w-full"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#8B7355] mb-12">
            1953형제돼지국밥
          </h1>
          
          <div className="space-y-6 mb-12">
            <p className="text-2xl font-bold text-[#5C4A32]">
              1953형제돼지국밥에<br />오신 것을 환영합니다!
            </p>
            <p className="text-xl text-[#5C4A32]">처음 방문하셨나요?</p>
            <p className="text-xl text-[#5C4A32]">그렇다면</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/survey'}
              className="game-button w-full"
            >
              내 퍼스널 국밥부터 찾으러 가보기
            </button>
            <button
              onClick={() => setPageType('soup-select')}
              className="game-button w-full"
            >
              바로 내 국밥 만들러 가기
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 국밥 선택 페이지
  if (pageType === 'soup-select') {
    return (
      <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }}>
        <HomeIcon />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md w-full"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[#8B7355] mb-8">
            1953형제돼지국밥
          </h1>
          
          <p className="text-2xl font-bold text-[#5C4A32] mb-12">
            어떤 국밥을 만들어볼까요?
          </p>

          <div className="space-y-4">
            <button
              onClick={() => handleSoupSelect('clear')}
              className="game-button w-full"
            >
              깊고 깔끔한 맑은 국밥
            </button>
            <button
              onClick={() => handleSoupSelect('milky')}
              className="game-button w-full"
            >
              고소하고 부드러운 뽀얀 국밥
            </button>
            <button
              onClick={() => handleSoupSelect('fire')}
              className="game-button w-full"
            >
              얼큰하고 중독적인 불꽃 국밥
            </button>
            <button
              onClick={() => handleSoupSelect('mala')}
              className="game-button w-full"
            >
              알싸한 맛이 돋보이는 마라 국밥
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 스토리 페이지
  if (pageType === 'story') {
    // 스토리 1: 눈 깜빡임
    if (storyPage === 1) {
      return (
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center relative overflow-hidden">
          <HomeIcon />
          <motion.div
            initial={{ clipPath: 'ellipse(50% 0% at 50% 50%)' }}
            animate={{ clipPath: 'ellipse(50% 50% at 50% 50%)' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="absolute inset-0 bg-[#E8E4DB] flex items-center justify-center"
          >
            <p className="text-2xl font-bold text-[#5C4A32]" style={{ fontFamily: 'esamanru, sans-serif' }}>
              여기가 어디지..?
            </p>
          </motion.div>
        </div>
      );
    }

    // 스토리 2
    if (storyPage === 2) {
      return (
        <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }} onClick={() => setStoryPage(3)}>
          <HomeIcon />
          <h1 className="text-2xl font-bold text-[#8B7355] mb-8">1953형제돼지국밥</h1>
          <p className="text-xl text-[#5C4A32] mb-8">춥고, 배고프고...</p>
          <img src="/game-images/꼬르륵 남자애.png" alt="꼬르륵" className="w-64 h-auto" />
        </div>
      );
    }

    // 스토리 3
    if (storyPage === 3) {
      return (
        <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }} onClick={() => setStoryPage(4)}>
          <HomeIcon />
          <p className="text-xl text-[#5C4A32] mb-8">얘야, 정신이 드니?..</p>
          <img src="/game-images/놀란 할머니.png" alt="놀란 할머니" className="w-64 h-auto" />
        </div>
      );
    }

    // 스토리 4
    if (storyPage === 4) {
      return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }} onClick={() => setStoryPage(5)}>
          <HomeIcon />
          <div className="absolute inset-0 opacity-70">
            <img src="/game-images/시장 배경.png" alt="시장" className="w-full h-full object-cover grayscale" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-2xl font-bold text-[#8B7355] mb-8 bg-white/50 px-4 py-2 rounded">1953형제돼지국밥</h1>
            <p className="text-xl text-[#5C4A32] mb-8 bg-white/70 px-4 py-2 rounded">누구세요…?</p>
            <div className="relative inline-block">
              <img src="/game-images/꼬르륵 남자애.png" alt="꼬르륵" className="w-64 h-auto" />
              <img src="/game-images/꼬르륵 신호.png" alt="신호" className="absolute left-0 top-1/2 w-16 h-auto" />
              <img src="/game-images/밥.png" alt="밥" className="absolute right-0 top-0 w-16 h-auto" />
            </div>
          </div>
        </div>
      );
    }

    // 스토리 5
    if (storyPage === 5) {
      return (
        <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }} onClick={() => setStoryPage(6)}>
          <HomeIcon />
          <p className="text-lg text-[#5C4A32] mb-8 text-center px-4">
            일단 밥부터 먹지 않겠니?<br />안으로 따라 들어오거라.
          </p>
          <img src="/game-images/놀란 할머니.png" alt="할머니" className="w-64 h-auto" />
        </div>
      );
    }

    // 스토리 6
    if (storyPage === 6) {
      return (
        <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }} onClick={() => setStoryPage(7)}>
          <HomeIcon />
          <p className="text-lg text-[#5C4A32] mb-8">따신 국밥이라도 얼른 먹으렴.</p>
          <img src="/game-images/웃는 할머니.png" alt="웃는 할머니" className="w-48 h-auto mb-4" />
          {selectedSoup && (
            <img src={soupImages[selectedSoup]} alt="국밥" className="w-32 h-auto" />
          )}
        </div>
      );
    }

    // 스토리 7
    if (storyPage === 7) {
      return (
        <div className="min-h-screen bg-[#E8E4DB] flex items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }} onClick={() => setStoryPage(8)}>
          <HomeIcon />
          <div className="grid grid-cols-2 gap-8 max-w-4xl">
            <div className="text-center">
              <img src="/game-images/먹는 남자애.png" alt="먹는 남자애" className="w-48 h-auto mx-auto mb-4" />
              {selectedSoup && (
                <img src={soupImages[selectedSoup]} alt="국밥" className="w-32 h-auto mx-auto mb-4" />
              )}
              <p className="text-lg text-[#5C4A32]">할머니 너무 맛있어요!</p>
            </div>
            <div className="text-center">
              <img src="/game-images/그냥 할머니.png" alt="할머니" className="w-48 h-auto mx-auto mb-4" />
              <p className="text-sm text-[#5C4A32]">
                (내 손주를 보는 것 같구나..)<br />천천히 먹으렴, 체할라
              </p>
            </div>
          </div>
        </div>
      );
    }

    // 스토리 8
    if (storyPage === 8) {
      return (
        <div className="min-h-screen bg-[#E8E4DB] flex items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }} onClick={() => setStoryPage(9)}>
          <HomeIcon />
          <div className="flex items-center gap-8 max-w-4xl">
            <div className="flex-1 text-center">
              <img src="/game-images/먹는 남자애.png" alt="먹는 남자애" className="w-48 h-auto mx-auto mb-4" />
              {selectedSoup && (
                <img src={soupImages[selectedSoup]} alt="국밥" className="w-32 h-auto mx-auto mb-4" />
              )}
              <p className="text-sm text-[#5C4A32]">
                할머니, 저, 헤어진 여동생을 만나게 되면<br />
                꼭 이 국밥을 만들어주고 싶어요...<br />
                비법을 알려주실 수 있나요?
              </p>
            </div>
            <div className="relative">
              <img src="/game-images/말풍선.png" alt="말풍선" className="w-48 h-auto" />
              <img src="/game-images/여동생.png" alt="여동생" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-auto" />
            </div>
          </div>
        </div>
      );
    }

    // 스토리 9
    if (storyPage === 9) {
      return (
        <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }}>
          <HomeIcon />
          {selectedSoup && (
            <img src={soupImages[selectedSoup]} alt="국밥" className="w-64 h-auto mb-12" />
          )}
          <button
            onClick={() => setPageType('loading')}
            className="game-button"
          >
            국밥 만들러 가기!
          </button>
        </div>
      );
    }
  }

  // 로딩 페이지
  if (pageType === 'loading') {
    return (
      <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center" style={{ fontFamily: 'esamanru, sans-serif' }}>
        <HomeIcon />
        <div className="w-12 h-12 border-4 border-[#E9B84A] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xl text-[#5C4A32]">따라가는 중..</p>
      </div>
    );
  }

  // 요리 페이지 11
  if (pageType === 'cooking') {
    return (
      <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }} onClick={() => setPageType('stir-game')}>
        <HomeIcon />
        <img src="/game-images/요리하는 남자애.png" alt="요리하는 남자애" className="w-64 h-auto mb-8" />
        <div className="text-center space-y-2">
          <p className="text-lg text-[#5C4A32]">우선 국내산 사골을 푹~ 우려내서</p>
          <p className="text-lg text-[#5C4A32]">깊은 맛의 뽀얀 육수를 만들어야 해</p>
        </div>
      </div>
    );
  }

  // 젓기 게임 페이지
  if (pageType === 'stir-game') {
    return (
      <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4 relative" style={{ fontFamily: 'esamanru, sans-serif' }}>
        <HomeIcon />
        <div className="text-center mb-8 space-y-2">
          <p className="text-lg text-[#5C4A32]">비법 육수에</p>
          <p className="text-lg text-[#5C4A32]">고기를 다섯 번 삶아 고기향을 입혀</p>
          <p className="text-lg text-[#5C4A32]">그리고 담백한 맛을 위해 기름을 걷어내면 좋아</p>
        </div>

        <div className="relative mb-8">
          <img src="/game-images/요리하는 남자애.png" alt="요리하는 남자애" className="w-64 h-auto" />
          {stirCount > 0 && (
            <img src="/game-images/땀.png" alt="땀" className="absolute top-0 right-0 w-12 h-auto" />
          )}
        </div>

        <div className="flex gap-4 mb-8">
          {Array.from({ length: stirCount }).map((_, i) => (
            <img key={i} src="/game-images/고기.png" alt="고기" className="w-12 h-auto" />
          ))}
        </div>

        <div className="flex gap-4">
          <button onClick={handleStir} className="game-button" disabled={stirCount >= 5}>
            젓기
          </button>
          <button onClick={handleStopStir} className="game-button">
            그만 젓기
          </button>
        </div>

        {/* 할머니 오버레이 */}
        <AnimatePresence>
          {showGrandma && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <div className="relative">
                <img src="/game-images/눈감은 할머니.png" alt="할머니" className="w-96 h-auto opacity-80" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <button
                    onClick={handleGrandmaClose}
                    className="feedback-button"
                  >
                    {grandmaMessage === 'more' ? '더 저어야 해!' : '이제 그만~'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 토핑 페이지 17
  if (pageType === 'topping' && !selectedSoup) {
    return null;
  }

  if (pageType === 'topping') {
    const toppings: Record<Exclude<SoupType, null>, string[]> = {
      clear: ['/game-images/소금.png', '/game-images/후추.png'],
      milky: ['/game-images/소금.png', '/game-images/후추.png'],
      fire: ['/game-images/우동면.png', '/game-images/고춧가루.png'],
      mala: ['/game-images/당면.png', '/game-images/두부.png', '/game-images/마라소스.png'],
    };

    const currentToppings = selectedSoup ? toppings[selectedSoup] : [];

    return (
      <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }}>
        <HomeIcon />
        <p className="text-xl text-[#5C4A32] mb-8">
          이제 원하는 국밥에 따른 토핑을 넣으면 돼!
        </p>
        <img src="/game-images/재료 넣는 남자애.png" alt="재료 넣는 남자애" className="w-64 h-auto mb-8" />
        
        <div className="flex gap-4 mb-8">
          {currentToppings.map((topping, index) => (
            <motion.img
              key={index}
              src={topping}
              alt={`토핑 ${index + 1}`}
              className="w-20 h-auto"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.3 }}
            />
          ))}
        </div>

        <button
          onClick={() => setPageType('final-cooking')}
          className="game-button"
        >
          조리하기
        </button>
      </div>
    );
  }

  // 조리 페이지 19
  if (pageType === 'final-cooking') {
    return (
      <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center" style={{ fontFamily: 'esamanru, sans-serif' }}>
        <HomeIcon />
        <p className="text-2xl text-[#5C4A32] mb-8">조리 중…</p>
        <img src="/game-images/조리하는 남자애.png" alt="조리하는 남자애" className="w-64 h-auto mb-8" />
        <div className="w-12 h-12 border-4 border-[#E9B84A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 마무리 페이지
  if (pageType === 'ending') {
    // 마무리 1
    if (endingPage === 1) {
      return (
        <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }} onClick={() => setEndingPage(2)}>
          <HomeIcon />
          <p className="text-lg text-[#5C4A32] mb-8">
            자, 네가 만든 국밥이란다. 한 번 먹어보렴.
          </p>
          <img src="/game-images/그냥 할머니.png" alt="할머니" className="w-48 h-auto mb-4" />
          {selectedSoup && (
            <img src={soupImages[selectedSoup]} alt="국밥" className="w-32 h-auto" />
          )}
        </div>
      );
    }

    // 마무리 2
    if (endingPage === 2) {
      return (
        <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }} onClick={() => setEndingPage(3)}>
          <HomeIcon />
          <img src="/game-images/먹는 남자애.png" alt="먹는 남자애" className="w-64 h-auto mb-8" />
          <p className="text-lg text-[#5C4A32] text-center px-4">
            정말 맛있어요…!<br />
            아까 먹었던 그 맛이 나요,<br />
            할머니 감사해요.. 여동생에게 꼭 해줄 거예요!
          </p>
        </div>
      );
    }

    // 마무리 3
    if (endingPage === 3) {
      return (
        <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }} onClick={() => setEndingPage(4)}>
          <HomeIcon />
          <img src="/game-images/웃는 할머니.png" alt="웃는 할머니" className="w-64 h-auto mb-8" />
          <p className="text-lg text-[#5C4A32]">
            멋진 오빠구나. 언제든지 또 오렴.
          </p>
        </div>
      );
    }

    // 마무리 4
    if (endingPage === 4) {
      return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }}>
          <HomeIcon />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 2 }}
            className="absolute inset-0"
          >
            <img src="/game-images/형제돼지국밥 배경.png" alt="배경" className="w-full h-full object-cover" />
          </motion.div>
          
          <div className="relative z-10 text-center">
            <img src="/game-images/손 흔드는 할머니.png" alt="손 흔드는 할머니" className="w-64 h-auto mx-auto mb-8" />
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl font-bold text-[#5C4A32] mb-4 bg-white/80 px-6 py-3 rounded"
            >
              부산을 담은 한 그릇<br />
              가족을 생각하며 형제가 만듭니다.
            </motion.p>
            
            <p className="text-lg text-[#5C4A32] mb-8 bg-white/70 px-4 py-2 rounded">The end.</p>
            
            <div className="space-y-4">
              <button onClick={handleRestart} className="game-button">
                처음으로
              </button>
              <button
                onClick={() => window.location.href = 'https://www.1953bros.com/'}
                className="game-button"
              >
                형제돼지국밥 홈페이지
              </button>
              <button
                onClick={() => window.location.href = '/survey'}
                className="game-button"
              >
                테스트 하러 가기
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
}
