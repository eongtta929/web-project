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
      <div className="min-h-screen flex items-center justify-center bg-gukbap-ivory">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E9B84A] mx-auto mb-4"></div>
          <p className="text-gukbap-darkBrown text-lg">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gukbap-ivory">
      {/* 헤더 */}
      <header className="bg-gukbap-cream shadow-lg border-b-2 border-gukbap-darkBrown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="flex items-center space-x-2">
                <span className="text-2xl text-gukbap-darkBrown">국밥 취향 테스트 어드민</span>
              </Link>
              
              <nav className="hidden md:flex space-x-2">
                <Link
                  href="/admin"
                  className={`px-4 py-2 rounded-2xl text-base font-bold transition-all ${
                    pathname === '/admin'
                      ? 'bg-[#E9B84A] text-[#5C4A32] shadow-md'
                      : 'text-gukbap-darkBrown hover:bg-gukbap-ivory'
                  }`}
                >
                  대시보드
                </Link>
                <Link
                  href="/admin/analytics"
                  className={`px-4 py-2 rounded-2xl text-base font-bold transition-all ${
                    pathname === '/admin/analytics'
                      ? 'bg-[#E9B84A] text-[#5C4A32] shadow-md'
                      : 'text-gukbap-darkBrown hover:bg-gukbap-ivory'
                  }`}
                >
                  결과 시각화
                </Link>
                <Link
                  href="/admin/questions"
                  className={`px-4 py-2 rounded-2xl text-base font-bold transition-all ${
                    pathname === '/admin/questions'
                      ? 'bg-[#E9B84A] text-[#5C4A32] shadow-md'
                      : 'text-gukbap-darkBrown hover:bg-gukbap-ivory'
                  }`}
                >
                  문항 편집
                </Link>
                <Link
                  href="/admin/banner"
                  className={`px-4 py-2 rounded-2xl text-base font-bold transition-all ${
                    pathname === '/admin/banner'
                      ? 'bg-[#E9B84A] text-[#5C4A32] shadow-md'
                      : 'text-gukbap-darkBrown hover:bg-gukbap-ivory'
                  }`}
                >
                  배너 관리
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gukbap-brown">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-gukbap-brown hover:bg-gukbap-darkBrown rounded-2xl transition-colors shadow-md"
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

