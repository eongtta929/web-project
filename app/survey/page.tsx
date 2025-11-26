'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { surveyData, calculateResult, submitSurveyResults } from '@/lib/surveyData';
import { SurveyResult } from '@/types/survey';
import PageTransition from '@/components/PageTransition';
import ProgressBar from '@/components/ProgressBar';
import { supabase } from '@/lib/supabase';

type ViewState = 'intro' | 'questions' | 'result';

const resultNames: Record<string, string> = {
  clear: '맑은 국밥',
  white: '뽀얀 국밥',
  fire: '불꽃 국밥',
  mara: '마라 국밥',
};

const resultDescriptions: Record<string, { title: string; description: string }> = {
  clear: {
    title: '잡내 없이 깔끔하게!',
    description: '사골의 깊은 맛을 담은 전통 한 그릇, 맑은국밥이 취향인 당신!',
  },
  white: {
    title: '12시간 정성이 만든 고소한 백탕!',
    description: '온 가족이 사랑하는 부드러운 맛, 뽀얀국밥이 취향인 당신!',
  },
  fire: {
    title: '얼큰하고 깔끔한 맛이 일품',
    description: '자꾸만 생각나는 중독성, 불꽃국밥이 취향인 당신!',
  },
  mara: {
    title: '사골 육수와 마라의 알싸한 만남!',
    description: '새로운 국밥의 발견, 마라국밥이 취향인 당신!',
  },
};

export default function SurveyPage() {
  const [viewState, setViewState] = useState<ViewState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<SurveyResult[]>([]);
  const [finalResult, setFinalResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBanner, setActiveBanner] = useState<any>(null);

  const currentQuestion = surveyData.questions[currentQuestionIndex];
  const totalQuestions = surveyData.questions.length;

  useEffect(() => {
    loadActiveBanner();
  }, []);

  const loadActiveBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('event_banners')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (!error && data) {
        setActiveBanner(data);
      }
    } catch (error) {
      console.error('Error loading banner:', error);
    }
  };

  const handleStart = () => {
    setViewState('questions');
  };

  const handleOptionSelect = async (option: any) => {
    const newResult: SurveyResult = {
      questionId: currentQuestion.id,
      selectedOption: option.value,
      selectedCode: option.code,
      ratios: option.ratios,
      timestamp: new Date()
    };

    const updatedResults = [...results, newResult];
    setResults(updatedResults);

    // 마지막 질문인 경우
    if (currentQuestionIndex === totalQuestions - 1) {
      setIsSubmitting(true);
      
      // 결과 계산
      const calculatedResult = calculateResult(updatedResults);
      setFinalResult(calculatedResult);
      
      try {
        // 서버에 결과 전송
        await submitSurveyResults({
          answers: updatedResults,
          result: calculatedResult
        });
        setViewState('result');
      } catch (error) {
        console.error('Failed to submit results:', error);
        setViewState('result'); // 에러가 나도 결과는 보여줌
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // 다음 질문으로
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 300);
    }
  };

  const handleRestart = () => {
    setViewState('intro');
    setCurrentQuestionIndex(0);
    setResults([]);
    setFinalResult(null);
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#E8E4DB]" style={{ fontFamily: 'esamanru, sans-serif' }}>
      <HomeIcon />
      <div className="w-full max-w-2xl">
        {viewState === 'intro' && (
          <PageTransition key="intro">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-[#8B7355] mb-4">
                  {surveyData.title}
                </h1>
                <p className="text-lg md:text-xl text-[#5C4A32] mb-8">
                  {surveyData.description}
                </p>
                <button
                  onClick={handleStart}
                  className="game-button"
                >
                  시작하기
                </button>
              </motion.div>
            </div>
          </PageTransition>
        )}

        {viewState === 'questions' && (
          <PageTransition key={`question-${currentQuestionIndex}`}>
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <ProgressBar 
                current={currentQuestionIndex + 1} 
                total={totalQuestions} 
              />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-[#5C4A32] mb-8 text-center leading-relaxed">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-4 mt-8">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionSelect(option)}
                      className="w-full p-4 text-left text-base md:text-lg bg-white hover:bg-[#E9B84A] border-2 border-[#E9B84A] text-[#5C4A32] font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                    >
                      <span className="text-[#5C4A32]">{option.text}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </PageTransition>
        )}

        {viewState === 'result' && finalResult && (
          <PageTransition key="result">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* 결과 타이틀 */}
                <h2 className="text-2xl md:text-3xl font-bold text-[#5C4A32] mb-2">
                  당신은...
                </h2>
                <h1 className="text-4xl md:text-5xl font-bold text-[#5C4A32] mb-4">
                  {resultNames[finalResult.type]} 러버!!
                </h1>

                {/* 국밥 이미지 */}
                <div className="mb-6">
                  <img 
                    src={`/game-images/${resultNames[finalResult.type].replace(' ', '')}.png`}
                    alt={resultNames[finalResult.type]}
                    className="w-64 h-64 mx-auto object-contain"
                  />
                </div>

                {/* 설명 영역 */}
                <div className="bg-[#E8E4DB] rounded-2xl p-6 mb-6">
                  <p className="text-lg font-bold text-[#5C4A32] mb-2">
                    {resultDescriptions[finalResult.type].title}
                  </p>
                  <p className="text-lg text-[#5C4A32]">
                    {resultDescriptions[finalResult.type].description}
                  </p>
                </div>

                {/* 국밥 전체 순위 */}
                <div className="bg-[#E8E4DB] rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-[#5C4A32] mb-4">
                    국밥 전체 순위
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(finalResult.scores)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([type, score], index) => (
                        <div
                          key={type}
                          className={`p-4 rounded-xl ${
                            type === finalResult.type
                              ? 'bg-[#E9B84A] border-2 border-[#5C4A32]'
                              : 'bg-white'
                          }`}
                        >
                          <p className="text-sm text-[#5C4A32] mb-1">
                            {type === 'clear' && '맑은 국밥'}
                            {type === 'white' && '뽀얀 국밥'}
                            {type === 'fire' && '불꽃 국밥'}
                            {type === 'mara' && '마라 국밥'}
                          </p>
                          <p className="text-2xl font-bold text-[#5C4A32]">
                            {index + 1}위
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 이벤트 배너 영역 */}
                {activeBanner && (
                  <div className="mb-6">
                    {activeBanner.link_url ? (
                      <a
                        href={activeBanner.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-2xl overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={activeBanner.image_url}
                          alt="이벤트 배너"
                          className="w-full h-auto"
                        />
                      </a>
                    ) : (
                      <div className="rounded-2xl overflow-hidden">
                        <img
                          src={activeBanner.image_url}
                          alt="이벤트 배너"
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 버튼 */}
                <div className="space-y-4">
                  <button
                    onClick={handleRestart}
                    className="game-button w-full"
                  >
                    테스트 다시 하기
                  </button>
                  <button
                    onClick={() => window.location.href = '/game?start=soup-select'}
                    className="game-button w-full"
                  >
                    국밥 만들러 가기!
                  </button>
                </div>
              </motion.div>
            </div>
          </PageTransition>
        )}
      </div>
    </div>
  );
}
