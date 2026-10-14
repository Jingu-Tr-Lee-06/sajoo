"use client";

import React from "react";
import { X, ExternalLink, ShieldCheck } from "lucide-react";

interface InterstitialAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InterstitialAdModal({
  isOpen,
  onClose,
}: InterstitialAdModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-message-fade">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden shadow-2xl">
        {/* 우측 상단 X 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-zinc-950/70 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-all"
          aria-label="광고 닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 광고 라벨 */}
        <div className="px-5 pt-4 pb-2 text-[11px] text-zinc-500 font-mono flex items-center gap-1.5 border-b border-zinc-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>SPONSORED ADVERTISEMENT</span>
        </div>

        {/* 광고 본문 배너 영역 */}
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>

          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            프리미엄 파트너십
          </span>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">
            2026 AI 데이터 테크 컨퍼런스 사전등록
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
            최신 생성형 AI 모델 아키텍처와 엔터프라이즈 솔루션을 한자리에서 만나보세요. 얼리버드 참가자 전원 특별 굿즈 증정!
          </p>

          {/* 광고 링크 버튼 */}
          <div className="w-full space-y-2">
            <a
              href="https://ai.google.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
            >
              <span>자세히 알아보기</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              닫고 서비스로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}