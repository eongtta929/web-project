'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Stats {
  totalResponses: number;
  todayResponses: number;
  last7Days: { date: string; count: number }[];
  resultDistribution: { type: string; count: number; emoji: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // 전체 응답 수
      const { count: totalCount } = await supabase
        .from('responses')
        .select('*', { count: 'exact', head: true });

      // 오늘 응답 수
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayCount } = await supabase
        .from('responses')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // 최근 7일 응답 추이
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data: recentData } = await supabase
        .from('responses')
        .select('created_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      // 날짜별로 그룹화
      const dailyCounts = new Map<string, number>();
      recentData?.forEach((response) => {
        const date = new Date(response.created_at).toLocaleDateString('ko-KR');
        dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
      });

      const last7Days = Array.from(dailyCounts.entries()).map(([date, count]) => ({
        date,
        count,
      }));

      // 결과 유형별 분포
      const { data: allResponses } = await supabase
        .from('responses')
        .select('result_type');

      const distribution = new Map<string, number>();
      allResponses?.forEach((response) => {
        const type = response.result_type;
        distribution.set(type, (distribution.get(type) || 0) + 1);
      });

      const emojiMap: Record<string, string> = {
        clear: '🍲',
        white: '🥛',
        fire: '🔥',
        mara: '🌶️',
      };

      const resultDistribution = Array.from(distribution.entries()).map(([type, count]) => ({
        type,
        count,
        emoji: emojiMap[type] || '🍲',
      }));

      setStats({
        totalResponses: totalCount || 0,
        todayResponses: todayCount || 0,
        last7Days,
        resultDistribution,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToGoogleSheets = async () => {
    const spreadsheetId = prompt(
      'Google Sheets Spreadsheet ID를 입력하세요:\n\n' +
      '(예: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms)\n\n' +
      'Spreadsheet URL에서 /d/ 뒤의 ID 부분을 복사하세요.'
    );

    if (!spreadsheetId) return;

    const format = confirm(
      '원문 텍스트 형식으로 내보내시겠습니까?\n\n' +
      '확인: 원문 텍스트\n' +
      '취소: 코드 형식 (A1, A2 등)'
    )
      ? 'text'
      : 'code';

    setExporting(true);
    try {
      const response = await fetch('/api/export/google-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId,
          format,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ ${data.message}\n\n시트 이름: ${data.sheetTitle}`);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Export error:', error);
      alert(`❌ 내보내기 실패: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gukbap-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-1">국밥 취향 테스트 통계</p>
        </div>
        <button
          onClick={handleExportToGoogleSheets}
          disabled={exporting}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {exporting ? '내보내는 중...' : '📊 Google Sheet로 내보내기'}
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">총 응답 수</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {stats?.totalResponses.toLocaleString()}
              </p>
            </div>
            <div className="text-5xl">📝</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">오늘 응답 수</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {stats?.todayResponses.toLocaleString()}
              </p>
            </div>
            <div className="text-5xl">🎯</div>
          </div>
        </motion.div>
      </div>

      {/* 최근 7일 응답 추이 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">최근 7일 응답 추이</h2>
        {stats?.last7Days && stats.last7Days.length > 0 ? (
          <div className="space-y-3">
            {stats.last7Days.map((day, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 text-sm text-gray-600">{day.date}</div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gukbap-red h-full flex items-center justify-end pr-3 text-white text-sm font-semibold"
                      style={{
                        width: `${Math.max((day.count / Math.max(...stats.last7Days.map(d => d.count))) * 100, 10)}%`,
                      }}
                    >
                      {day.count}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">최근 7일간 응답이 없습니다.</p>
        )}
      </motion.div>

      {/* 결과 유형별 분포 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">국밥 유형별 분포</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats?.resultDistribution.map((result, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gukbap-ivory to-gukbap-cream rounded-xl p-4 text-center"
            >
              <div className="text-4xl mb-2">{result.emoji}</div>
              <div className="text-sm text-gray-600 mb-1 capitalize">{result.type}</div>
              <div className="text-2xl font-bold text-gray-900">{result.count}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

