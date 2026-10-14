"use client";

import React, { useState, useRef, useEffect } from "react";
import RewardAdModal from "@/components/RewardAdModal";
import InterstitialAdModal from "@/components/InterstitialAdModal";
import {
  CalendarType,
  ChatMessage,
  ConsultationTopic,
  Gender,
  SajuAnalysisResponse,
  UserSajuInput,
} from "@/types/saju";
import {
  Sparkles,
  Send,
  RotateCcw,
  Flame,
  ShieldAlert,
  RefreshCw,
  ExternalLink,
  Code2,
} from "lucide-react";

const ERROR_MESSAGE = "아 임마 이거 찐빠가 크네;; 똑바로 입력하라고 한 것만 입력해라 좀;;";

// 노션 관련 외부 링크 모음 (추후 실제 노션 공유 URL로 교체)
const NOTION_LINKS = {
  developer: "https://com-study.notion.site/3f929cd9f9d880c59a07e36535f9f7cb?source=copy_link", // 개발자 정보 / 포트폴리오 노션 링크
  terms: "https://com-study.notion.site/3f929cd9f9d88044bd6ae38ab2e5c6a0?source=copy_link",     // 이용약관
  privacy: "https://com-study.notion.site/3f929cd9f9d880df9952cec7cdbde370?source=copy_link",   // 개인정보처리방침
  legal: "https://com-study.notion.site/3f929cd9f9d880179884f1322d9ac737?source=copy_link",     // 법적고지 및 면책
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: "어서 오너라. 사주팔자 팩폭 전문 도사다.\n\n정통 만세력 데이터 기반으로 너의 명식을 낱낱이 파헤쳐 줄 테니 딴소리하지 말고 시키는 것만 딱 입력해라.\n\n[입력 안내]\n먼저 너의 이름을 입력해라.\n(예시: 홍길동, 이진호)",
      step: 1,
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // 사주 입력 폼 데이터
  const [formData, setFormData] = useState<Partial<UserSajuInput>>({
    calendarType: "solar",
    isUnknownTime: false,
    topic: "종합운",
  });

  // 15초 리워드 비디오 광고 모달
  const [isRewardAdOpen, setIsRewardAdOpen] = useState(false);
  // X로 닫는 일반 전면 팝업 광고 모달
  const [isInterstitialAdOpen, setIsInterstitialAdOpen] = useState(false);
  // 전면 광고 종료 후 실행할 콜백 액션 타입
  const [nextActionAfterInterstitial, setNextActionAfterInterstitial] = useState<
    "changeTopic" | "resetNew" | null
  >(null);

  const [finalResult, setFinalResult] = useState<SajuAnalysisResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, finalResult]);

  const pushBotMessage = (text: string, options?: string[], nextStep?: number) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}-${Math.random()}`,
        sender: "bot",
        text,
        options,
        step: nextStep,
      },
    ]);
    if (nextStep !== undefined) {
      setCurrentStep(nextStep);
    }
  };

  const handleUserSubmit = (textToSend?: string) => {
    const rawVal = (textToSend || inputText).trim();
    if (!rawVal) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: rawVal,
      },
    ]);
    setInputText("");

    switch (currentStep) {
      // 1단계: 이름
      case 1: {
        const nameRegex = /^[가-힣a-zA-Z]{2,10}$/;
        if (!nameRegex.test(rawVal)) {
          pushBotMessage(
            `${ERROR_MESSAGE}\n\n[입력 안내]\n이름은 2~10자의 한글 또는 영문으로만 입력해라.\n(예시: 홍길동, 이진호)`,
            undefined,
            1
          );
          return;
        }

        setFormData((prev) => ({ ...prev, name: rawVal }));
        pushBotMessage(
          `${rawVal}, 확인했다. 다음은 성별이다.\n\n[입력 안내]\n아래 선택지를 누르거나 정확히 '남성' 또는 '여성'으로만 입력해라.\n(예시: 남성, 여성)`,
          ["남성", "여성"],
          2
        );
        break;
      }

      // 2단계: 성별
      case 2: {
        if (rawVal !== "남성" && rawVal !== "여성") {
          pushBotMessage(
            `${ERROR_MESSAGE}\n\n[입력 안내]\n'남성' 또는 '여성' 둘 중 하나만 골라라.\n(예시: 남성, 여성)`,
            ["남성", "여성"],
            2
          );
          return;
        }

        const g: Gender = rawVal === "여성" ? "female" : "male";
        setFormData((prev) => ({ ...prev, gender: g }));
        pushBotMessage(
          "성별 등록 완료. 다음은 생일 기준(양력/음력)이다.\n\n[입력 안내]\n'양력' 또는 '음력' 둘 중 하나만 입력하거나 버튼을 눌러라.\n(예시: 양력, 음력)",
          ["양력", "음력"],
          3
        );
        break;
      }

      // 3단계: 양력/음력
      case 3: {
        if (rawVal !== "양력" && rawVal !== "음력") {
          pushBotMessage(
            `${ERROR_MESSAGE}\n\n[입력 안내]\n'양력' 또는 '음력' 중 하나만 정확히 입력해라.\n(예시: 양력, 음력)`,
            ["양력", "음력"],
            3
          );
          return;
        }

        const cal: CalendarType = rawVal === "음력" ? "lunar" : "solar";
        setFormData((prev) => ({ ...prev, calendarType: cal }));
        pushBotMessage(
          "생일 기준 확인했다. 다음은 태어난 생년월일이다.\n\n[입력 안내]\n하이픈이나 공백 없이 숫자 8자리로만 입력해라.\n(예시: 20020518, 19991205)",
          undefined,
          4
        );
        break;
      }

      // 4단계: 생년월일
      case 4: {
        const dateRegex = /^(19[0-9]{2}|20[0-2][0-9])(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
        if (!dateRegex.test(rawVal)) {
          pushBotMessage(
            `${ERROR_MESSAGE}\n\n[입력 안내]\n반드시 실제 존재하는 생년월일 8자리 숫자로만 입력해라.\n(예시: 20020518, 19980324)`,
            undefined,
            4
          );
          return;
        }

        const year = parseInt(rawVal.substring(0, 4), 10);
        const month = parseInt(rawVal.substring(4, 6), 10);
        const day = parseInt(rawVal.substring(6, 8), 10);

        setFormData((prev) => ({ ...prev, birthYear: year, birthMonth: month, birthDay: day }));
        pushBotMessage(
          "생년월일 확인 완료. 다음은 태어난 시간이다.\n\n[입력 안내]\n태어난 시간을 24시간 기준 숫자(또는 HH:MM)로 입력하거나 모르면 '시간 모름'을 눌러라.\n(예시: 시간 모름, 14:30, 0800)",
          ["시간 모름", "새벽 01:00", "아침 08:30", "점심 12:30", "저녁 18:00"],
          5
        );
        break;
      }

      // 5단계: 태어난 시간
      case 5: {
        if (rawVal === "시간 모름") {
          setFormData((prev) => ({ ...prev, isUnknownTime: true, birthHour: undefined, birthMinute: undefined }));
        } else {
          const timeRegex = /^([01]?[0-9]|2[0-3])(:?[0-5][0-9])?$/;
          const cleaned = rawVal.replace(/[^0-9:]/g, "");
          if (!timeRegex.test(cleaned) && !timeRegex.test(rawVal)) {
            pushBotMessage(
              `${ERROR_MESSAGE}\n\n[입력 안내]\n정확한 시간을 24시간 형식으로 입력하거나 '시간 모름'을 눌러라.\n(예시: 시간 모름, 14:30, 09:00)`,
              ["시간 모름", "새벽 01:00", "아침 08:30", "점심 12:30", "저녁 18:00"],
              5
            );
            return;
          }

          const digits = rawVal.replace(/[^0-9]/g, "");
          const hour = digits.length >= 2 ? parseInt(digits.substring(0, 2), 10) : parseInt(digits, 10);
          const minute = digits.length >= 4 ? parseInt(digits.substring(2, 4), 10) : 0;

          setFormData((prev) => ({
            ...prev,
            isUnknownTime: false,
            birthHour: isNaN(hour) ? 12 : hour,
            birthMinute: isNaN(minute) ? 0 : minute,
          }));
        }

        pushBotMessage(
          "기본 사주 데이터 추출 완료. 마지막으로 상담받고 싶은 고민 분야를 선택해라.\n\n[입력 안내]\n아래 버튼을 누르거나 정확한 명칭을 입력해라.\n(예시: 종합운, 재물운, 연애운, 취업/학업운)",
          ["종합운", "재물운", "연애운", "취업/학업운"],
          6
        );
        break;
      }

      // 6단계: 상담 주제 선택
      case 6: {
        const validTopics: ConsultationTopic[] = ["종합운", "재물운", "연애운", "취업/학업운"];
        if (!validTopics.includes(rawVal as ConsultationTopic)) {
          pushBotMessage(
            `${ERROR_MESSAGE}\n\n[입력 안내]\n지정된 4가지 분야 중에서만 선택해라.\n(예시: 종합운, 재물운, 연애운, 취업/학업운)`,
            validTopics,
            6
          );
          return;
        }

        const topic = rawVal as ConsultationTopic;
        setFormData((prev) => ({ ...prev, topic }));

        pushBotMessage(
          "모든 정보가 오차 없이 등록되었다.\n사주 명식과 오행 분석표를 생성하려면 아래 버튼을 눌러 스폰서 영상을 확인해라.",
          ["🎬 15초 영상 보고 결과 확인하기"],
          7
        );
        break;
      }

      case 7: {
        if (rawVal.includes("영상") || rawVal.includes("확인") || rawVal.includes("결과")) {
          setIsRewardAdOpen(true);
        } else {
          pushBotMessage(
            `${ERROR_MESSAGE}\n\n[입력 안내]\n아래 '🎬 15초 영상 보고 결과 확인하기' 버튼을 눌러라.`,
            ["🎬 15초 영상 보고 결과 확인하기"],
            7
          );
        }
        break;
      }

      default:
        break;
    }
  };

  // 15초 보상형 광고 완료 후 사주 분석 호출
  const handleRewardComplete = async () => {
    setIsRewardAdOpen(false);
    setIsLoading(true);

    pushBotMessage("광고 성실하게 다 봤네 기특하다 임마 ㅋㅋ 사주 명식 까는 중이니까 3초만 얌전히 기다려라;;");

    try {
      const res = await fetch("/api/saju", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("서버 응답 오류 발생");
      }

      const data: SajuAnalysisResponse = await res.json();
      setFinalResult(data);

      pushBotMessage(
        `[사주 분석 완료]\n${data.reading.summary}\n\n결과 명식표는 아래 카드에 정리해 뒀으니 뼈 맞을 준비하고 읽어봐라 임마~~!`
      );
    } catch {
      pushBotMessage("사주 명식 분석 도중 오류가 발생했다. 잠시 후 다시 시도해라.");
    } finally {
      setIsLoading(false);
    }
  };

  // 결과 카드에서 버튼 클릭 시: 전면 팝업 광고(X로 닫는 광고) 오픈
  const handleTriggerInterstitial = (action: "changeTopic" | "resetNew") => {
    setNextActionAfterInterstitial(action);
    setIsInterstitialAdOpen(true);
  };

  // X 버튼 전면 광고 닫았을 때 실행되는 전환 로직
  const handleInterstitialClose = () => {
    setIsInterstitialAdOpen(false);

    if (nextActionAfterInterstitial === "changeTopic") {
      setFinalResult(null);
      pushBotMessage(
        `${formData.name}아, 이번엔 어떤 분야를 새로 봐줄까? 아래 분야 중에서 하나 골라봐라.`,
        ["종합운", "재물운", "연애운", "취업/학업운"],
        6
      );
    } else if (nextActionAfterInterstitial === "resetNew") {
      setFinalResult(null);
      setCurrentStep(1);
      setFormData({
        calendarType: "solar",
        isUnknownTime: false,
        topic: "종합운",
      });
      pushBotMessage(
        "새로운 사주 명식을 분석한다.\n\n[입력 안내]\n보고 싶은 사람의 이름을 입력해라.\n(예시: 홍길동, 이진호)",
        undefined,
        1
      );
    }

    setNextActionAfterInterstitial(null);
  };

  // 상단 헤더의 초기화 버튼
  const handleReset = () => {
    setFinalResult(null);
    setCurrentStep(1);
    setFormData({
      calendarType: "solar",
      isUnknownTime: false,
      topic: "종합운",
    });
    setMessages([
      {
        id: "init-reset",
        sender: "bot",
        text: "처음부터 다시 시작한다.\n\n[입력 안내]\n너의 이름을 정확히 입력해라.\n(예시: 홍길동, 이진호)",
        step: 1,
      },
    ]);
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-[85vh] justify-between">
      {/* 1. 상용 서비스 헤더 */}
      <header className="py-3 px-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Flame className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-zinc-100">
                AI 사주 팩폭 상담소
              </h1>
              <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">정통 만세력 기반 천간지지 연산 엔진 ver 1.2</p>
          </div>
        </div>

        {/* 상단 우측 버튼군 (개발자 정보 + 처음으로) */}
        <div className="flex items-center gap-2">
          {/* <a
            href={NOTION_LINKS.developer}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/80 rounded-xl transition-all flex items-center gap-1.5 text-xs border border-indigo-800/60 shadow-sm"
            title="개발자 정보 (Notion)"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="font-medium">개발자 정보</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a> */}

          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-xl transition-colors flex items-center gap-1.5 text-xs border border-zinc-800"
            title="처음부터 다시하기"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">처음으로</span>
          </button>
        </div>
      </header>

      {/* 2. 대화창 메시지 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            } animate-message-fade`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none font-sans"
              }`}
            >
              {msg.text}
            </div>

            {/* 선택지 옵션 버튼들 */}
            {msg.options && msg.options.length > 0 && currentStep === msg.step && (
              <div className="flex flex-wrap gap-2 mt-2">
                {msg.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleUserSubmit(opt)}
                    className="text-xs px-3.5 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700 text-indigo-300 font-medium transition-all transform active:scale-95 shadow-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 로딩 인디케이터 */}
        {isLoading && (
          <div className="flex items-center space-x-2.5 text-zinc-400 text-xs py-3 px-4 bg-zinc-900/60 rounded-xl border border-zinc-800 w-fit">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
            <span>만세력 정밀 알고리즘으로 명식과 오행 흐름을 연산 중입니다...</span>
          </div>
        )}

        {/* 3. 사주 분석 최종 결과 카드 */}
        {finalResult && (
          <div className="mt-6 rounded-3xl bg-zinc-900/95 border border-zinc-700 p-5 sm:p-6 shadow-2xl space-y-5 animate-message-fade">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> 사주팔자 정밀 명식표
              </span>
              <span className="text-[11px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700/60">
                본원(日干): {finalResult.pillars.dayPillar.heavenlyStem} ({finalResult.pillars.dayPillar.heavenlyElement})
              </span>
            </div>

            {/* 4주 기둥 테이블 */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-zinc-950/70 p-2.5 rounded-2xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] mb-1">시주(時)</span>
                <span className="font-bold text-zinc-200">
                  {finalResult.pillars.timePillar
                    ? `${finalResult.pillars.timePillar.heavenlyStem}${finalResult.pillars.timePillar.earthlyBranch}`
                    : "미반영"}
                </span>
              </div>
              <div className="bg-zinc-950/80 p-2.5 rounded-2xl border border-indigo-500/50 shadow-inner">
                <span className="text-indigo-400 block text-[10px] mb-1">일주(日·나)</span>
                <span className="font-bold text-amber-300">
                  {finalResult.pillars.dayPillar.heavenlyStem}{finalResult.pillars.dayPillar.earthlyBranch}
                </span>
              </div>
              <div className="bg-zinc-950/70 p-2.5 rounded-2xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] mb-1">월주(月)</span>
                <span className="font-bold text-zinc-200">
                  {finalResult.pillars.monthPillar.heavenlyStem}{finalResult.pillars.monthPillar.earthlyBranch}
                </span>
              </div>
              <div className="bg-zinc-950/70 p-2.5 rounded-2xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] mb-1">년주(年)</span>
                <span className="font-bold text-zinc-200">
                  {finalResult.pillars.yearPillar.heavenlyStem}{finalResult.pillars.yearPillar.earthlyBranch}
                </span>
              </div>
            </div>

            {/* 오행 에너지 분포 */}
            <div className="bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800">
              <div className="text-[11px] font-semibold text-zinc-400 mb-2 flex items-center justify-between">
                <span>오행 에너지 분포</span>
                <span className="text-[10px] text-zinc-500">목·화·토·금·수 밸런스</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-300 gap-2">
                {Object.entries(finalResult.pillars.elementCounts).map(([elem, count]) => (
                  <div key={elem} className="flex-1 text-center bg-zinc-900/90 py-1.5 rounded-xl border border-zinc-800">
                    <div className="text-[10px] text-zinc-500">{elem}</div>
                    <div className="font-bold text-indigo-400">{count}개</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 풀이 본문 */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 shadow-sm">
                <div className="font-bold text-amber-300 text-xs mb-1.5 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" /> 핵심 총평
                </div>
                <p className="text-zinc-100 font-medium leading-normal">{finalResult.reading.summary}</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800">
                <div className="font-bold text-zinc-200 text-xs mb-1.5">
                  ⚡ 타고난 기질 & 성격 팩폭
                </div>
                <p className="text-zinc-300 whitespace-pre-wrap">{finalResult.reading.personality}</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800">
                <div className="font-bold text-zinc-200 text-xs mb-1.5">
                  🎯 선택 분야 [{formData.topic}] 운세 분석
                </div>
                <p className="text-zinc-300 whitespace-pre-wrap">{finalResult.reading.topicFortune}</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
                <div className="font-bold text-emerald-400 text-xs mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> 도사의 현실적 개운법 & 조언
                </div>
                <p className="text-zinc-300 whitespace-pre-wrap">{finalResult.reading.advice}</p>
              </div>
            </div>

            {/* 4. 결과 확인 후 액션 버튼 */}
            <div className="pt-3 border-t border-zinc-800 space-y-2.5">
              <p className="text-[11px] text-zinc-400 text-center font-medium">
                원하는 다음 상담 액션을 선택하세요
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleTriggerInterstitial("changeTopic")}
                  className="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>다른 고민 분야 더 물어보기</span>
                </button>
                <button
                  onClick={() => handleTriggerInterstitial("resetNew")}
                  className="py-3 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>다른 사람 사주 보기 (새로 입력)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. 하단 입력 폼 영역 */}
      <footer className="pt-2 pb-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserSubmit();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              currentStep === 1
                ? "이름 입력 (예시: 홍길동)"
                : currentStep === 2
                ? "성별 선택 (예시: 남성, 여성)"
                : currentStep === 3
                ? "달력 기준 선택 (예시: 양력, 음력)"
                : currentStep === 4
                ? "생년월일 8자리 입력 (예시: 20020518)"
                : currentStep === 5
                ? "태어난 시간 입력 (예시: 14:30 또는 시간 모름)"
                : currentStep === 6
                ? "고민 분야 선택 (예시: 종합운, 재물운...)"
                : "상단의 '15초 영상 보고 결과 확인하기' 버튼을 눌러주세요"
            }
            disabled={currentStep === 7 || isLoading}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl py-3 pl-4 pr-12 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || currentStep === 7 || isLoading}
            className="absolute right-2 p-2 rounded-xl bg-indigo-600 text-white disabled:opacity-30 hover:bg-indigo-500 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* 6. 실제 상용 기업형 푸터 (JH's SW Lab) */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 text-center text-[11px] text-zinc-400 space-y-2">
          {/* 노션 문서 바로가기 링크 */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-zinc-400">
            <a
              href={NOTION_LINKS.developer}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors underline-offset-4 hover:underline"
            >
              개발자 소개
            </a>
            <span className="text-zinc-600">•</span>
            <a
              href={NOTION_LINKS.terms}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors underline-offset-4 hover:underline"
            >
              이용약관
            </a>
            <span className="text-zinc-600">•</span>
            <a
              href={NOTION_LINKS.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors underline-offset-4 hover:underline"
            >
              개인정보처리방침
            </a>
            <span className="text-zinc-600">•</span>
            <a
              href={NOTION_LINKS.legal}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-200 transition-colors underline-offset-4 hover:underline"
            >
              책임의 한계와 법적고지
            </a>
          </div>

          {/* 운영 및 문의처 */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400">
            <span>
              운영 및 개발: <strong className="text-zinc-300 font-medium">JH&apos;s SW Lab</strong>
            </span>
            <span className="text-zinc-700">|</span>
            <span>
              문의:{" "}
              <a
                href="mailto:devlee92736@gmail.com"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                devlee92736@gmail.com
              </a>
            </span>
          </div>

          {/* 면책 조항 */}
          <p className="text-[10px] text-zinc-400 max-w-lg mx-auto leading-relaxed">
            본 서비스의 사주 풀이 결과는 전통 명리학 데이터를 AI로 재해석한 엔터테인먼트 콘텐츠이며
          </p>

          <p className="text-[10px] text-zinc-400 max-w-lg mx-auto leading-relaxed">
            삶의 절대적 지침이나 법적·재정적 판단의 근거가 될 수 없습니다.
          </p>

          {/* 저작권 표기 */}
          <p className="text-[10px] text-zinc-400 font-mono pt-1">
            © 2026 JH&apos;s SW Lab. All rights reserved. Powered by Google Gemini.
          </p>
        </div>
      </footer>

      {/* 15초 보상형 동영상 광고 모달 */}
      <RewardAdModal
        isOpen={isRewardAdOpen}
        onComplete={handleRewardComplete}
        onClose={() => setIsRewardAdOpen(false)}
      />

      {/* 우측 상단 X로 닫는 일반 전면 배너 광고 모달 */}
      <InterstitialAdModal
        isOpen={isInterstitialAdOpen}
        onClose={handleInterstitialClose}
      />
    </div>
  );
}