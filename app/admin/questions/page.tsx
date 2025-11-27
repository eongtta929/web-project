'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Question {
  id: string;
  question_text: string;
  category: string;
  order_index: number;
  is_scored: boolean;
  weight: number;
}

interface Option {
  id: string;
  question_id: string;
  option_text: string;
  option_index: number;
  ratio_clear: number;
  ratio_white: number;
  ratio_fire: number;
  ratio_mara: number;
}

export default function QuestionsManagementPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [options, setOptions] = useState<Record<string, Option[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editingOption, setEditingOption] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 문항 로드
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .order('order_index', { ascending: true });

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);

      // 선택지 로드
      const { data: optionsData, error: optionsError } = await supabase
        .from('options')
        .select('*')
        .order('option_index', { ascending: true });

      if (optionsError) throw optionsError;

      // 문항별로 그룹화
      const grouped: Record<string, Option[]> = {};
      optionsData?.forEach((option) => {
        if (!grouped[option.question_id]) {
          grouped[option.question_id] = [];
        }
        grouped[option.question_id].push(option);
      });
      setOptions(grouped);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuestionWeight = async (questionId: string, newWeight: number) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ weight: newWeight })
        .eq('id', questionId);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error updating weight:', error);
      alert('가중치 업데이트에 실패했습니다.');
    }
  };

  const updateQuestionText = async (questionId: string, newText: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ question_text: newText })
        .eq('id', questionId);

      if (error) throw error;
      setEditingQuestion(null);
      loadData();
    } catch (error) {
      console.error('Error updating question:', error);
      alert('문항 업데이트에 실패했습니다.');
    }
  };

  const updateOptionRatios = async (
    optionId: string,
    ratios: { clear: number; white: number; fire: number; mara: number }
  ) => {
    // 합계가 100인지 확인
    const sum = ratios.clear + ratios.white + ratios.fire + ratios.mara;
    if (Math.abs(sum - 100) > 0.01) {
      alert('비율의 합계는 100이어야 합니다.');
      return;
    }

    try {
      const { error } = await supabase
        .from('options')
        .update({
          ratio_clear: ratios.clear,
          ratio_white: ratios.white,
          ratio_fire: ratios.fire,
          ratio_mara: ratios.mara,
        })
        .eq('id', optionId);

      if (error) throw error;
      setEditingOption(null);
      loadData();
    } catch (error) {
      console.error('Error updating option:', error);
      alert('선택지 업데이트에 실패했습니다.');
    }
  };

  const redistributeWeights = async () => {
    const scoredQuestions = questions.filter((q) => q.is_scored);
    const equalWeight = 100 / scoredQuestions.length;

    try {
      for (const question of scoredQuestions) {
        await supabase
          .from('questions')
          .update({ weight: equalWeight })
          .eq('id', question.id);
      }
      alert('가중치가 균등하게 재배분되었습니다!');
      loadData();
    } catch (error) {
      console.error('Error redistributing weights:', error);
      alert('가중치 재배분에 실패했습니다.');
    }
  };

  const getTotalWeight = () => {
    return questions
      .filter((q) => q.is_scored)
      .reduce((sum, q) => sum + q.weight, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E9B84A]"></div>
      </div>
    );
  }

  const totalWeight = getTotalWeight();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl text-gukbap-darkBrown">문항 편집</h1>
          <p className="text-gukbap-brown mt-1 text-lg">설문 문항 및 가중치 관리</p>
        </div>
        <button
          onClick={redistributeWeights}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          균등 배분
        </button>
      </div>

      {/* 가중치 합계 표시 */}
      <div
        className={`p-4 rounded-2xl border-4 ${
          Math.abs(totalWeight - 100) < 0.01
            ? 'bg-green-100 border-green-400'
            : 'bg-red-100 border-red-400'
        }`}
      >
        <p
          className={`text-base font-bold ${
            Math.abs(totalWeight - 100) < 0.01 ? 'text-green-900' : 'text-red-900'
          }`}
        >
          점수 계산 문항 가중치 합계: {totalWeight.toFixed(1)}%
          {Math.abs(totalWeight - 100) < 0.01 ? ' ✓' : ' (100%가 되어야 합니다)'}
        </p>
      </div>

      {/* 문항 목록 */}
      <div className="space-y-6">
        {questions.map((question) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gukbap-cream rounded-3xl shadow-lg p-6 border-2 border-gukbap-darkBrown"
          >
            {/* 문항 헤더 */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {editingQuestion === question.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={question.question_text}
                      className="flex-1 px-3 py-2 border border-gukbap-brown rounded-2xl bg-white text-gukbap-darkBrown font-bold"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateQuestionText(question.id, e.currentTarget.value);
                        }
                      }}
                    />
                    <button
                      onClick={() => setEditingQuestion(null)}
                      className="px-3 py-2 bg-gray-300 rounded-2xl font-bold"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl text-gukbap-darkBrown">{question.question_text}</h3>
                    <button
                      onClick={() => setEditingQuestion(question.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      수정
                    </button>
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 text-xs bg-gukbap-ivory text-gukbap-brown rounded-full">
                    {question.category}
                  </span>
                  {question.is_scored && (
                    <span className="px-3 py-1 text-xs bg-green-200 text-green-900 rounded-full">
                      점수 계산 포함
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 가중치 조정 (점수 계산 문항만) */}
            {question.is_scored && (
              <div className="mb-4 p-4 bg-gukbap-ivory rounded-2xl border border-gukbap-brown">
                <label className="block text-base text-gukbap-darkBrown mb-2">
                  문항 가중치: {question.weight.toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={question.weight}
                  onChange={(e) => updateQuestionWeight(question.id, parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {/* 선택지 목록 */}
            <div className="space-y-3">
              <h4 className="text-base text-gukbap-darkBrown">선택지</h4>
              {options[question.id]?.map((option) => (
                <div key={option.id} className="p-3 bg-white rounded-2xl border border-gukbap-brown">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-gukbap-darkBrown flex-1">{option.option_text}</p>
                    <button
                      onClick={() =>
                        setEditingOption(editingOption === option.id ? null : option.id)
                      }
                      className="text-xs text-blue-600 hover:underline ml-2"
                    >
                      {editingOption === option.id ? '닫기' : '비율 수정'}
                    </button>
                  </div>

                  {editingOption === option.id && question.is_scored && (
                    <div className="mt-3 p-3 bg-gukbap-ivory rounded-xl border border-gukbap-brown">
                      <p className="text-xs text-gukbap-darkBrown mb-2">국밥 유형별 비율</p>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <label className="text-xs text-gukbap-brown">맑은 (%)</label>
                          <input
                            type="number"
                            defaultValue={option.ratio_clear}
                            className="w-full px-2 py-1 text-sm border border-gukbap-brown rounded-lg font-bold"
                            id={`clear-${option.id}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gukbap-brown">뽀얀 (%)</label>
                          <input
                            type="number"
                            defaultValue={option.ratio_white}
                            className="w-full px-2 py-1 text-sm border border-gukbap-brown rounded-lg font-bold"
                            id={`white-${option.id}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gukbap-brown">불꽃 (%)</label>
                          <input
                            type="number"
                            defaultValue={option.ratio_fire}
                            className="w-full px-2 py-1 text-sm border border-gukbap-brown rounded-lg font-bold"
                            id={`fire-${option.id}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gukbap-brown">마라 (%)</label>
                          <input
                            type="number"
                            defaultValue={option.ratio_mara}
                            className="w-full px-2 py-1 text-sm border border-gukbap-brown rounded-lg font-bold"
                            id={`mara-${option.id}`}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const clear = parseFloat(
                            (document.getElementById(`clear-${option.id}`) as HTMLInputElement)
                              .value
                          );
                          const white = parseFloat(
                            (document.getElementById(`white-${option.id}`) as HTMLInputElement)
                              .value
                          );
                          const fire = parseFloat(
                            (document.getElementById(`fire-${option.id}`) as HTMLInputElement)
                              .value
                          );
                          const mara = parseFloat(
                            (document.getElementById(`mara-${option.id}`) as HTMLInputElement)
                              .value
                          );
                          updateOptionRatios(option.id, { clear, white, fire, mara });
                        }}
                        className="mt-2 px-4 py-2 bg-[#E9B84A] text-[#5C4A32] rounded-2xl text-sm hover:bg-opacity-90 shadow-md"
                      >
                        저장
                      </button>
                    </div>
                  )}

                  {question.is_scored && (
                    <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center justify-center gap-1">
                        <img src="/game-images/맑은국밥.png" alt="맑은국밥" className="w-4 h-4 object-contain" />
                        <span className="text-gukbap-brown">{option.ratio_clear}%</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <img src="/game-images/뽀얀국밥.png" alt="뽀얀국밥" className="w-4 h-4 object-contain" />
                        <span className="text-gukbap-brown">{option.ratio_white}%</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <img src="/game-images/불꽃국밥.png" alt="불꽃국밥" className="w-4 h-4 object-contain" />
                        <span className="text-gukbap-brown">{option.ratio_fire}%</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <img src="/game-images/마라국밥.png" alt="마라국밥" className="w-4 h-4 object-contain" />
                        <span className="text-gukbap-brown">{option.ratio_mara}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

