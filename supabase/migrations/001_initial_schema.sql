-- 국밥 취향 테스트 데이터베이스 스키마

-- 응답 테이블
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  q0 TEXT,  -- 선택지 코드 (A1~A7)
  q1 TEXT,  -- 선택지 코드 (A1~A3)
  q2 TEXT,  -- 선택지 코드 (A1~A4)
  q3 TEXT,  -- 선택지 코드 (A1~A3)
  q4 TEXT,  -- 선택지 코드 (A1~A3)
  q5 TEXT,  -- 선택지 코드 (A1~A3)
  q6 TEXT,  -- 선택지 코드 (A1~A4)
  result_type TEXT CHECK (result_type IN ('clear', 'white', 'fire', 'mara')),
  scores JSONB  -- {"clear": 12.5, "white": 8.3, "fire": 5.2, "mara": 3.1}
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_result_type ON responses(result_type);
CREATE INDEX IF NOT EXISTS idx_responses_q0 ON responses(q0);

-- 문항 설정 테이블 (어드민용)
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,  -- 'Q0', 'Q1' 등
  question_text TEXT NOT NULL,
  category TEXT,  -- 'demographic', 'taste', 'topping', 'opinion'
  order_index INT NOT NULL,
  is_scored BOOLEAN DEFAULT true,  -- 점수 계산 포함 여부
  weight FLOAT DEFAULT 0  -- 문항 가중치 (0~100, 점수 문항들의 합 = 100)
);

-- 선택지 설정 테이블
CREATE TABLE IF NOT EXISTS options (
  id TEXT PRIMARY KEY,  -- 'Q1_A1' 등
  question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_index INT NOT NULL,  -- A1=1, A2=2...
  -- 비율로 저장 (각 선택지 내 합계 = 100)
  ratio_clear FLOAT DEFAULT 25,
  ratio_white FLOAT DEFAULT 25,
  ratio_fire FLOAT DEFAULT 25,
  ratio_mara FLOAT DEFAULT 25,
  CONSTRAINT ratios_sum_100 CHECK (
    ratio_clear + ratio_white + ratio_fire + ratio_mara = 100
  )
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_options_question_id ON options(question_id);

-- 어드민 사용자 테이블
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 이벤트 배너 테이블
CREATE TABLE IF NOT EXISTS event_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 배너 업데이트 시 updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_banners_updated_at
  BEFORE UPDATE ON event_banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 설정
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_banners ENABLE ROW LEVEL SECURITY;

-- 응답 테이블: 모두 삽입 가능, 읽기는 어드민만
CREATE POLICY "Anyone can insert responses" ON responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read responses" ON responses
  FOR SELECT USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

-- 문항/선택지 테이블: 모두 읽기 가능, 수정은 어드민만
CREATE POLICY "Anyone can read questions" ON questions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage questions" ON questions
  FOR ALL USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

CREATE POLICY "Anyone can read options" ON options
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage options" ON options
  FOR ALL USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

-- 배너 테이블: 활성 배너는 모두 읽기 가능, 관리는 어드민만
CREATE POLICY "Anyone can read active banners" ON event_banners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can read all banners" ON event_banners
  FOR SELECT USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

CREATE POLICY "Admins can manage banners" ON event_banners
  FOR ALL USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

-- 어드민 사용자 테이블: 어드민만 읽기 가능
CREATE POLICY "Admins can read admin_users" ON admin_users
  FOR SELECT USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

