import GoogleAnalytics from '@/components/GoogleAnalytics';

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "1953형제돼지국밥 인터랙티브 웹사이트",
  description: "퍼스널 국밥 찾기 + 브랜드 스토리 시뮬레이션 게임 two track website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
                <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}

