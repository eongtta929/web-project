-- 1. 기존 제약조건 삭제
ALTER TABLE options DROP CONSTRAINT IF EXISTS ratios_sum_100;

-- 2. 새 제약조건 추가 (합이 100이거나 모두 0 허용)
ALTER TABLE options ADD CONSTRAINT ratios_sum_100 
CHECK (
  (ratio_clear + ratio_white + ratio_fire + ratio_mara = 100)
  OR 
  (ratio_clear = 0 AND ratio_white = 0 AND ratio_fire = 0 AND ratio_mara = 0)
);

-- 3. 초기 문항 데이터 삽입
INSERT INTO questions (id, question_text, category, order_index, is_scored, weight) VALUES
  ('Q0', '당신은 어떤 국밥 러버신가요?', 'demographic', 0, false, 0),
  ('Q1', '지금 당신의 상태는?', 'taste', 1, true, 20),
  ('Q2', '당신이 선호하는 국밥 메인 토핑은?', 'opinion', 2, false, 0),
  ('Q3', '면 사리를 추가한다면?', 'topping', 3, true, 20),
  ('Q4', '당신은 맵찔이?!', 'taste', 4, true, 20),
  ('Q5', '토핑은 어떤 게 좋아?', 'topping', 5, true, 20),
  ('Q6', '당신의 국밥 철학은?', 'taste', 6, true, 20);

-- 4. Q0 선택지
INSERT INTO options (id, question_id, option_text, option_index, ratio_clear, ratio_white, ratio_fire, ratio_mara) VALUES
  ('Q0_A1', 'Q0', '20대 남성', 1, 0, 0, 0, 0),
  ('Q0_A2', 'Q0', '20대 여성', 2, 0, 0, 0, 0),
  ('Q0_A3', 'Q0', '30대 남성', 3, 0, 0, 0, 0),
  ('Q0_A4', 'Q0', '30대 여성', 4, 0, 0, 0, 0),
  ('Q0_A5', 'Q0', '40대 이상 남성', 5, 0, 0, 0, 0),
  ('Q0_A6', 'Q0', '40대 이상 여성', 6, 0, 0, 0, 0),
  ('Q0_A7', 'Q0', '선택 안 함', 7, 0, 0, 0, 0);

-- 5. Q1 선택지
INSERT INTO options (id, question_id, option_text, option_index, ratio_clear, ratio_white, ratio_fire, ratio_mara) VALUES
  ('Q1_A1', 'Q1', '속을 따뜻하게 해주는 구수한 국물이 필요해…☆', 1, 2, 94, 1, 3),
  ('Q1_A2', 'Q1', '시원~~한 국물 없나? 해장이 필요해! ㅠㅠ', 2, 71, 2, 26, 1),
  ('Q1_A3', 'Q1', '입이 심심한 걸? 매콤~한 자극이 필요해!', 3, 1, 0, 49, 50);

-- 6. Q2 선택지
INSERT INTO options (id, question_id, option_text, option_index, ratio_clear, ratio_white, ratio_fire, ratio_mara) VALUES
  ('Q2_A1', 'Q2', '담백하고 쫄깃한 고기 최고!', 1, 0, 0, 0, 0),
  ('Q2_A2', 'Q2', '야들야들 부드러운 고기 좋아', 2, 0, 0, 0, 0),
  ('Q2_A3', 'Q2', '국밥엔 순대가 짱이지~', 3, 0, 0, 0, 0),
  ('Q2_A4', 'Q2', '내장 국밥은 없나요?', 4, 0, 0, 0, 0);

-- 7. Q3 선택지
INSERT INTO options (id, question_id, option_text, option_index, ratio_clear, ratio_white, ratio_fire, ratio_mara) VALUES
  ('Q3_A1', 'Q3', '어허! 국밥에 면은 무슨 면!', 1, 48, 47, 2, 3),
  ('Q3_A2', 'Q3', '통통한 우동사리 너무 좋아~', 2, 8, 8, 75, 9),
  ('Q3_A3', 'Q3', '특이하게 중국 당면은 어때?', 3, 2, 1, 9, 88);

-- 8. Q4 선택지
INSERT INTO options (id, question_id, option_text, option_index, ratio_clear, ratio_white, ratio_fire, ratio_mara) VALUES
  ('Q4_A1', 'Q4', '그래, 나 맵찔이다! 매운 건 완전 사양', 1, 50, 49, 1, 0),
  ('Q4_A2', 'Q4', '살짝 칼칼한 정도는 OK', 2, 25, 24, 37, 14),
  ('Q4_A3', 'Q4', '훗 불닭 매운맛도 껌이에요', 3, 0, 1, 49, 50);

-- 9. Q5 선택지
INSERT INTO options (id, question_id, option_text, option_index, ratio_clear, ratio_white, ratio_fire, ratio_mara) VALUES
  ('Q5_A1', 'Q5', '부추 팍팍 넣어야지!', 1, 42, 41, 15, 2),
  ('Q5_A2', 'Q5', '부추, 대파 팍팍, 김가루 솔솔', 2, 1, 16, 75, 8),
  ('Q5_A3', 'Q5', '청경채 들어가면 맛있을 것 같은뎅?', 3, 0, 1, 10, 89);

-- 10. Q6 선택지
INSERT INTO options (id, question_id, option_text, option_index, ratio_clear, ratio_white, ratio_fire, ratio_mara) VALUES
  ('Q6_A1', 'Q6', '정갈하고 깔끔한 한 그릇', 1, 65, 33, 1, 1),
  ('Q6_A2', 'Q6', '진하고 구수한 정통 맛', 2, 18, 63, 17, 2),
  ('Q6_A3', 'Q6', '새롭고 독특한 경험', 3, 2, 2, 21, 75),
  ('Q6_A4', 'Q6', '시원하게 속 풀어주는 맛', 4, 47, 2, 49, 2);