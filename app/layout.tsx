import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "국밥 브랜드 - 인터랙티브 체험",
  description: "국밥 브랜드의 심리테스트와 시뮬레이션 게임",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}

