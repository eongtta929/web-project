'use client';

import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#E8E4DB] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'esamanru, sans-serif' }}>
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
            onClick={() => window.location.href = '/game?start=soup-select'}
            className="game-button w-full"
          >
            바로 내 국밥 만들러 가기
          </button>
        </div>
      </motion.div>
    </div>
  );
}
