'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp, getCurrentUser } from '@/lib/auth';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 이미 로그인되어 있으면 대시보드로 리다이렉트
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (user) {
      router.push('/admin');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = mode === 'login' 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (result.success) {
        router.push('/admin');
      } else {
        setError(result.error || '오류가 발생했습니다.');
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gukbap-ivory">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gukbap-cream rounded-3xl shadow-2xl p-8 border-2 border-gukbap-darkBrown">
          <div className="text-center mb-8">
            <h1 className="text-4xl text-gukbap-darkBrown mb-2">
              국밥 취향 테스트
            </h1>
            <p className="text-gukbap-brown text-lg">어드민 로그인</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-base text-gukbap-darkBrown mb-2">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gukbap-brown rounded-2xl focus:ring-2 focus:ring-[#E9B84A] focus:border-[#E9B84A] bg-white text-gukbap-darkBrown"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-base text-gukbap-darkBrown mb-2">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gukbap-brown rounded-2xl focus:ring-2 focus:ring-gukbap-red focus:border-gukbap-red bg-white text-gukbap-darkBrown"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E9B84A] text-[#5C4A32] py-4 rounded-2xl text-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-sm text-[#E9B84A] hover:underline"
            >
              {mode === 'login' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gukbap-brown">
            <p className="text-xs text-gukbap-brown text-center">
              어드민 계정은 사전에 등록된 이메일만 사용할 수 있습니다.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

