/**
 * 사주 서비스 전역 타입 정의 모듈
 */

// 성별 타입
export type Gender = "male" | "female";

// 달력 종류 (양력/음력)
export type CalendarType = "solar" | "lunar";

// 상담 고민 분야
export type ConsultationTopic = "종합운" | "재물운" | "연애운" | "취업/학업운";

// 사용자가 입력한 사주 기본 정보 인터페이스
export interface UserSajuInput {
  name: string;
  gender: Gender;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  calendarType: CalendarType;
  birthHour?: number;
  birthMinute?: number;
  isUnknownTime: boolean;
  topic: ConsultationTopic;
}

// 오행 (목, 화, 토, 금, 수)
export type FiveElement = "목(木)" | "화(火)" | "토(土)" | "금(金)" | "수(水)";

// 개별 기둥(주) 데이터 구조 (천간과 지지)
export interface SajuPillar {
  heavenlyStem: string;         // 천간 (예: 갑, 을, 병...)
  heavenlyElement: FiveElement; // 천간 오행
  earthlyBranch: string;        // 지지 (예: 자, 축, 인...)
  earthlyElement: FiveElement;  // 지지 오행
}

// 사주팔자 4개 기둥 및 오행 분석 결과 인터페이스
export interface SajuPillarsResult {
  yearPillar: SajuPillar;       // 년주
  monthPillar: SajuPillar;      // 월주
  dayPillar: SajuPillar;        // 일주
  timePillar?: SajuPillar;      // 시주 (시간 모름일 경우 없음)
  elementCounts: Record<FiveElement, number>; // 오행별 개수
}

// Gemini API 응답 구조화 데이터 인터페이스
export interface SajuAnalysisResponse {
  pillars: SajuPillarsResult;
  reading: {
    summary: string;            // 한 줄 요약
    personality: string;        // 타고난 기질과 오행 분석
    topicFortune: string;       // 선택 분야 운세 분석
    advice: string;             // 개운법 및 실천적 훈수
  };
}

// 챗봇 대화 메시지 인터페이스
export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: string[];          // 빠른 응답 선택지 버튼
  step?: number;               // 대화 진행 단계
}