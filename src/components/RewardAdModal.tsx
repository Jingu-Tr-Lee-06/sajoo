"use client";

import React, { useState, useEffect } from "react";
import { PlayCircle, CheckCircle2, AlertCircle } from "lucide-react";

interface RewardAdModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export default function RewardAdModal({
  isOpen,
  onComplete,
  onClose,
}: RewardAdModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(15);
      setIsPlaying(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl overflow-hidden flex flex-col">
        {/* 상단 안내 바 */}
        <div className="px-4 py-3 bg-zinc-800 flex items-center justify-between border-b border-zinc-700">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
            <PlayCircle className="w-4 h-4" />
            <span>스폰서 보상형 동영상 광고</span>
          </div>
          <div className="text-xs text-zinc-400">
            {timeLeft > 0 ? (
              <span className="text-zinc-200 font-mono font-bold bg-zinc-950 px-2 py-0.5 rounded border border-zinc-700">
                {timeLeft}초 남음
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 시청 완료
              </span>
            )}
          </div>
        </div>

        {/* 동영상 광고 영역 */}
        <div className="relative aspect-video bg-black flex flex-col items-center justify-center text-center p-6 select-none">
          {isPlaying ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-400 font-mono">{timeLeft}</span>
              </div>
              <p className="text-zinc-300 text-sm font-medium">
                고화질 스폰서 영상 광고를 송출 중입니다...
              </p>
              <p className="text-zinc-500 text-xs">
                영상을 끝까지 시청하시면 맞춤 사주 풀이가 즉시 공개됩니다.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
              <p className="text-emerald-300 font-semibold text-sm">
                광고 시청이 모두 완료되었습니다!
              </p>
              <p className="text-zinc-400 text-xs">
                아래 버튼을 눌러 소름 돋는 사주 풀이를 확인하세요.
              </p>
            </div>
          )}
        </div>

        {/* 하단 제어 영역 */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex flex-col gap-2">
          {timeLeft > 0 ? (
            <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
                광고 시청 중에는 건너뛸 수 없습니다.
              </span>
              <button
                type="button"
                onClick={onClose}
                className="hover:underline text-zinc-400"
              >
                닫기
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onComplete}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95"
            >
              🎉 사주 풀이 결과 바로 보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}