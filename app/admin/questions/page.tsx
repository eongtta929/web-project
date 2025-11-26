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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gukbap-red"></div>
      </div>
    );
  }

  const totalWeight = getTotalWeight();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">문항 편집</h1>
          <p className="text-gray-600 mt-1">설문 문항 및 가중치 관리</p>
        </div>
        <button
          onClick={redistributeWeights}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          균등 배분
        </button>
      </div>

      {/* 가중치 합계 표시 */}
      <div
        className={`p-4 rounded-lg ${
          Math.abs(totalWeight - 100) < 0.01
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}
      >
        <p
          className={`text-sm font-semibold ${
            Math.abs(totalWeight - 100) < 0.01 ? 'text-green-800' : 'text-red-800'
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
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            {/* 문항 헤더 */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {editingQuestion === question.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={question.question_text}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateQuestionText(question.id, e.currentTarget.value);
                        }
                      }}
                    />
                    <button
                      onClick={() => setEditingQuestion(null)}
                      className="px-3 py-2 bg-gray-200 rounded-lg"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">{question.question_text}</h3>
                    <button
                      onClick={() => setEditingQuestion(question.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      수정
                    </button>
                  </div>
                )}
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded">
                    {question.category}
                  </span>
                  {question.is_scored && (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">
                      점수 계산 포함
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 가중치 조정 (점수 계산 문항만) */}
            {question.is_scored && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <h4 className="text-sm font-semibold text-gray-700">선택지</h4>
              {options[question.id]?.map((option) => (
                <div key={option.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-gray-900 flex-1">{option.option_text}</p>
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
                    <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2">국밥 유형별 비율</p>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <label className="text-xs text-gray-600">맑은 (%)</label>
                          <input
                            type="number"
                            defaultValue={option.ratio_clear}
                            className="w-full px-2 py-1 text-sm border rounded"
                            id={`clear-${option.id}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">뽀얀 (%)</label>
                          <input
                            type="number"
                            defaultValue={option.ratio_white}
                            className="w-full px-2 py-1 text-sm border rounded"
                            id={`white-${option.id}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">불꽃 (%)</label>
                          <input
                            type="number"
                            defaultValue={option.ratio_fire}
                            className="w-full px-2 py-1 text-sm border rounded"
                            id={`fire-${option.id}`}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">마라 (%)</label>
                          <input
                            type="number"
                            defaultValue={option.ratio_mara}
                            className="w-full px-2 py-1 text-sm border rounded"
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
                        className="mt-2 px-4 py-2 bg-gukbap-red text-white rounded text-sm font-semibold hover:bg-opacity-90"
                      >
                        저장
                      </button>
                    </div>
                  )}

                  {question.is_scored && (
                    <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <span className="text-gray-600">🍲 {option.ratio_clear}%</span>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-600">🥛 {option.ratio_white}%</span>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-600">🔥 {option.ratio_fire}%</span>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-600">🌶️ {option.ratio_mara}%</span>
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

