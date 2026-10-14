/**
 * 환경 변수 및 외부 API Key 중앙 관리 모듈
 * 
 * 모든 민감 키와 설정값을 이 파일에서 통합 관리하며,
 * 필수 환경 변수 누락 시 즉각적인 오류 메시지를 반환합니다.
 */

// Gemini API Key 추출 및 검증
export function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "[환경 변수 오류] GEMINI_API_KEY가 설정되지 않았습니다. .env.local 파일에 유효한 Gemini API 키를 입력해 주세요."
    );
  }

  return apiKey.trim();
}

// 사용할 Gemini 모델명 (빠른 응답 속도와 하루 1,500회 무료 할당량을 지원하는 플래시 모델)
export const GEMINI_MODEL_NAME = "gemini-2.5-flash";

// 광고 관련 클라이언트 ID (미설정 시 테스트 모드로 동작)
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";