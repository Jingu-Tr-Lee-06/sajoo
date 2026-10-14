"use client";

import React from "react";

function AdContainer({
  positionText,
  className,
}: {
  positionText: string;
  className: string;
}) {
  return (
    <aside
      aria-label={`${positionText} 스폰서 광고`}
      className={`border border-dashed border-zinc-700 bg-zinc-900/60 rounded-xl flex flex-col items-center justify-center p-3 text-center select-none text-zinc-500 hover:border-zinc-500 transition-colors ${className}`}
    >
      <span className="text-[10px] font-semibold tracking-wider text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded uppercase mb-1">
        ADVERTISEMENT
      </span>
      <p className="text-xs font-medium text-zinc-400">{positionText}</p>
      <p className="text-[11px] text-zinc-600 mt-0.5">스폰서 맞춤 배너</p>
    </aside>
  );
}

export function TopBannerAd() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-3 pb-1">
      <AdContainer
        positionText="상단 헤더 배너 (Top)"
        className="w-full h-20 md:h-24 shadow-sm"
      />
    </div>
  );
}

export function LeftSideBannerAd() {
  return (
    <div className="hidden xl:block fixed left-4 top-28 z-20">
      <AdContainer
        positionText="좌측 사이드 배너 (Left)"
        className="w-40 h-150 shadow-lg sticky top-28"
      />
    </div>
  );
}

export function RightSideBannerAd() {
  return (
    <div className="hidden xl:block fixed right-4 top-28 z-20">
      <AdContainer
        positionText="우측 사이드 배너 (Right)"
        className="w-40 h-150 shadow-lg sticky top-28"
      />
    </div>
  );
}