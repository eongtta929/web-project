'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAdminAuth, signOut } from '@/lib/auth';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    verifyAuth();
  }, [pathname]);

  const verifyAuth = async () => {
    // 로그인 페이지는 인증 체크 스킵
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const auth = await checkAdminAuth();
    
    if (!auth.isAuthenticated || !auth.isAdmin) {
      router.push('/admin/login');
      return;
    }

    setUser(auth.user);
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/admin/login');
  };

  // 로그인 페이지는 레이아웃 없이 렌더링
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gukbap-red mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="flex items-center space-x-2">
                <span className="text-2xl">🍲</span>
                <span className="text-xl font-bold text-gray-900">국밥 취향 테스트 어드민</span>
              </Link>
              
              <nav className="hidden md:flex space-x-4">
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/admin'
                      ? 'bg-gukbap-red text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  대시보드
                </Link>
                <Link
                  href="/admin/analytics"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/admin/analytics'
                      ? 'bg-gukbap-red text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  결과 시각화
                </Link>
                <Link
                  href="/admin/questions"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/admin/questions'
                      ? 'bg-gukbap-red text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  문항 편집
                </Link>
                <Link
                  href="/admin/banner"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/admin/banner'
                      ? 'bg-gukbap-red text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  배너 관리
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

