import type { Metadata } from "next";
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
        {/* 구글 애드센스 인증 스크립트 (직접 삽입) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8742188217673300"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <TopBannerAd />
        <LeftSideBannerAd />
        <RightSideBannerAd />
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-2 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}