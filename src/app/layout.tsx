import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { TopBannerAd, LeftSideBannerAd, RightSideBannerAd } from "@/components/BannerAds";

export const metadata: Metadata = {
  title: "AI 사주 도사의 팩폭 상담소",
  description: "만세력 기반 정확한 명식과 20대 감성 AI가 풀어주는 솔직하고 유쾌한 1:1 맞춤 사주 풀이",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <head>
        {/* 구글 애드센스 공식 연동 스크립트 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8742188217673300"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        {/* 1. 상단 가로 배너 광고 */}
        <TopBannerAd />

        {/* 2. 좌측 및 우측 사이드 배너 광고 (데스크톱 전용 고정) */}
        <LeftSideBannerAd />
        <RightSideBannerAd />

        {/* 메인 콘텐츠 영역 (중앙 정렬 컨테이너) */}
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-2 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}