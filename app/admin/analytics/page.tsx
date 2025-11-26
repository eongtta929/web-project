'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = {
  clear: '#3B82F6',
  white: '#F59E0B',
  fire: '#EF4444',
  mara: '#8B5CF6',
};

const GUKBAP_NAMES: Record<string, string> = {
  clear: '맑은 국밥',
  white: '뽀얀 국밥',
  fire: '불꽃 국밥',
  mara: '마라 국밥',
};

export default function AnalyticsPage() {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setLoading(false);
    }
  };

  // 인구통계 분석 (Q0)
  const getDemographicData = () => {
    const counts = new Map<string, number>();
    responses.forEach((r) => {
      if (r.q0) {
        counts.set(r.q0, (counts.get(r.q0) || 0) + 1);
      }
    });

    const labels: Record<string, string> = {
      A1: '20대 남성',
      A2: '20대 여성',
      A3: '30대 남성',
      A4: '30대 여성',
      A5: '40대+ 남성',
      A6: '40대+ 여성',
      A7: '선택 안 함',
    };

    return Array.from(counts.entries()).map(([code, count]) => ({
      name: labels[code] || code,
      value: count,
    }));
  };

  // 성별/연령대별 국밥 결과 분포
  const getDemographicByResult = () => {
    const data: Record<string, Record<string, number>> = {};

    responses.forEach((r) => {
      if (r.q0 && r.result_type) {
        if (!data[r.q0]) {
          data[r.q0] = { clear: 0, white: 0, fire: 0, mara: 0 };
        }
        data[r.q0][r.result_type]++;
      }
    });

    const labels: Record<string, string> = {
      A1: '20대 남성',
      A2: '20대 여성',
      A3: '30대 남성',
      A4: '30대 여성',
      A5: '40대+ 남성',
      A6: '40대+ 여성',
    };

    return Object.entries(data)
      .filter(([code]) => code !== 'A7')
      .map(([code, results]) => ({
        name: labels[code] || code,
        맑은국밥: results.clear,
        뽀얀국밥: results.white,
        불꽃국밥: results.fire,
        마라국밥: results.mara,
      }));
  };

  // 맛 선호도 분석 (Q1, Q4, Q6)
  const getTastePreference = (questionId: string) => {
    const counts = new Map<string, number>();
    responses.forEach((r) => {
      const answer = r[questionId.toLowerCase()];
      if (answer) {
        counts.set(answer, (counts.get(answer) || 0) + 1);
      }
    });

    return Array.from(counts.entries()).map(([code, count]) => ({
      name: code,
      value: count,
    }));
  };

  // 토핑 선호도 분석 (Q2, Q3, Q5)
  const getToppingPreference = (questionId: string) => {
    const counts = new Map<string, number>();
    responses.forEach((r) => {
      const answer = r[questionId.toLowerCase()];
      if (answer) {
        counts.set(answer, (counts.get(answer) || 0) + 1);
      }
    });

    return Array.from(counts.entries()).map(([code, count]) => ({
      name: code,
      value: count,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gukbap-red"></div>
      </div>
    );
  }

  const demographicData = getDemographicData();
  const demographicByResult = getDemographicByResult();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">결과 시각화</h1>
        <p className="text-gray-600 mt-1">설문 응답 데이터 분석</p>
      </div>

      {/* 인구통계 분석 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">📊 인구통계 분석</h2>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">성별/연령대별 응답 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demographicData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {demographicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">성별/연령대별 국밥 결과 분포</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={demographicByResult}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="맑은국밥" fill={COLORS.clear} />
              <Bar dataKey="뽀얀국밥" fill={COLORS.white} />
              <Bar dataKey="불꽃국밥" fill={COLORS.fire} />
              <Bar dataKey="마라국밥" fill={COLORS.mara} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 맛 선호도 분석 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">🌶️ 맛 선호도 분석</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Q1: 현재 상태</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={getTastePreference('Q1')}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {getTastePreference('Q1').map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Q4: 맵기 선호도</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={getTastePreference('Q4')}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {getTastePreference('Q4').map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Q6: 국밥 철학</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={getTastePreference('Q6')}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {getTastePreference('Q6').map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* 토핑 선호도 분석 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">🥬 토핑 선호도 분석</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Q2: 메인 토핑</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={getToppingPreference('Q2')}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={COLORS.fire} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Q3: 면 사리</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={getToppingPreference('Q3')}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={COLORS.white} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Q5: 토핑 종류</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={getToppingPreference('Q5')}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={COLORS.mara} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

