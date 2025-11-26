import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { supabase } from '@/lib/supabase';

// Google Sheets API 클라이언트 생성
function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// 선택지 코드를 텍스트로 변환
const optionLabels: Record<string, Record<string, string>> = {
  Q0: {
    A1: '20대 남성',
    A2: '20대 여성',
    A3: '30대 남성',
    A4: '30대 여성',
    A5: '40대 이상 남성',
    A6: '40대 이상 여성',
    A7: '선택 안 함',
  },
  Q1: {
    A1: '속을 따뜻하게 해주는 구수한 국물이 필요해…☆',
    A2: '시원~~한 국물 없나? 해장이 필요해! ㅠㅠ',
    A3: '입이 심심한 걸? 매콤~한 자극이 필요해!',
  },
  Q2: {
    A1: '담백하고 쫄깃한 고기 최고!',
    A2: '야들야들 부드러운 고기 좋아',
    A3: '국밥엔 순대가 짱이지~',
    A4: '내장 국밥은 없나요?',
  },
  Q3: {
    A1: '어허! 국밥에 면은 무슨 면!',
    A2: '통통한 우동사리 너무 좋아~',
    A3: '특이하게 중국 당면은 어때?',
  },
  Q4: {
    A1: '그래, 나 맵찔이다! 매운 건 완전 사양',
    A2: '살짝 칼칼한 정도는 OK',
    A3: '훗 불닭 매운맛도 껌이에요',
  },
  Q5: {
    A1: '부추 팍팍 넣어야지!',
    A2: '부추, 대파 팍팍, 김가루 솔솔',
    A3: '청경채 들어가면 맛있을 것 같은뎅?',
  },
  Q6: {
    A1: '정갈하고 깔끔한 한 그릇',
    A2: '진하고 구수한 정통 맛',
    A3: '새롭고 독특한 경험',
    A4: '시원하게 속 풀어주는 맛',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spreadsheetId, format = 'code', startDate, endDate } = body;

    if (!spreadsheetId) {
      return NextResponse.json(
        { success: false, error: 'Spreadsheet ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // Supabase에서 응답 데이터 가져오기
    let query = supabase
      .from('responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: responses, error: fetchError } = await query;

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      );
    }

    // 데이터 변환
    const headers = [
      'ID',
      '응답 일시',
      'Q0 (인구통계)',
      'Q1',
      'Q2',
      'Q3',
      'Q4',
      'Q5',
      'Q6',
      '결과 유형',
      '맑은 국밥 점수',
      '뽀얀 국밥 점수',
      '불꽃 국밥 점수',
      '마라 국밥 점수',
    ];

    const rows = responses?.map((response: any) => {
      const convertValue = (questionId: string, code: string) => {
        if (format === 'text' && optionLabels[questionId]?.[code]) {
          return optionLabels[questionId][code];
        }
        return code;
      };

      return [
        response.id,
        new Date(response.created_at).toLocaleString('ko-KR'),
        convertValue('Q0', response.q0 || ''),
        convertValue('Q1', response.q1 || ''),
        convertValue('Q2', response.q2 || ''),
        convertValue('Q3', response.q3 || ''),
        convertValue('Q4', response.q4 || ''),
        convertValue('Q5', response.q5 || ''),
        convertValue('Q6', response.q6 || ''),
        response.result_type || '',
        response.scores?.clear?.toFixed(1) || '0',
        response.scores?.white?.toFixed(1) || '0',
        response.scores?.fire?.toFixed(1) || '0',
        response.scores?.mara?.toFixed(1) || '0',
      ];
    });

    // Google Sheets에 쓰기
    const sheets = getGoogleSheetsClient();

    // 새 시트 추가
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const sheetTitle = `응답_${timestamp}`;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetTitle,
              },
            },
          },
        ],
      },
    });

    // 데이터 쓰기
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetTitle}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers, ...(rows || [])],
      },
    });

    return NextResponse.json({
      success: true,
      message: `${rows?.length || 0}개의 응답이 Google Sheets로 내보내졌습니다.`,
      sheetTitle,
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

