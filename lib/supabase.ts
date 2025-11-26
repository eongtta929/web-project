import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성
// 환경 변수는 .env.local 파일에 설정해야 합니다
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 데이터베이스 타입 정의
export interface ResponseRow {
  id: string;
  created_at: string;
  q0: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  result_type: 'clear' | 'white' | 'fire' | 'mara';
  scores: {
    clear: number;
    white: number;
    fire: number;
    mara: number;
  };
}

export interface QuestionRow {
  id: string;
  question_text: string;
  category: string;
  order_index: number;
  is_scored: boolean;
  weight: number;
}

export interface OptionRow {
  id: string;
  question_id: string;
  option_text: string;
  option_index: number;
  ratio_clear: number;
  ratio_white: number;
  ratio_fire: number;
  ratio_mara: number;
}

export interface AdminUserRow {
  id: string;
  email: string;
  created_at: string;
}

export interface EventBannerRow {
  id: string;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

