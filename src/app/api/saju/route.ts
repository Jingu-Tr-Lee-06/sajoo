import { NextRequest, NextResponse } from "next/server";
import { calculateSajuPillars } from "@/lib/lunar-calendar";
import { generateSajuReading } from "@/lib/gemini";
import { SajuAnalysisResponse, UserSajuInput } from "@/types/saju";

/**
 * 사주 분석 요청 처리 서버리스 핸들러 (POST)
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as UserSajuInput;

    // 입력값 기본 유효성 검증
    if (!body.name || !body.gender || !body.birthYear || !body.birthMonth || !body.birthDay) {
      return NextResponse.json(
        { error: "엄;; 필수 사주 정보가 빠졌잖아 줴줴이야! 생년월일시 확인 좀 하자;;" },
        { status: 400 }
      );
    }

    // 1. 만세력 알고리즘을 통한 사주팔자 및 오행 계산
    const pillars = calculateSajuPillars(body);

    // 2. 사주 명식과 특유의 말투를 주입하여 Gemini API 호출
    const reading = await generateSajuReading(body, pillars);

    const responsePayload: SajuAnalysisResponse = {
      pillars,
      reading,
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error: unknown) {
    console.error("[API saju 에러 발생]:", error);
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류 발생";
    return NextResponse.json(
      { error: `이건 좀;; 사주 분석 도중 터졌음: ${errorMessage}` },
      { status: 500 }
    );
  }
}