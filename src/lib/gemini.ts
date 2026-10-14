import { GoogleGenAI } from "@google/genai";
import { SajuAnalysisResponse, SajuPillarsResult, UserSajuInput } from "@/types/saju";

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.");
  }
  return key;
}

const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
  "gemini-3.5-pro",
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateSajuReading(
  input: UserSajuInput,
  pillars: SajuPillarsResult
): Promise<SajuAnalysisResponse["reading"]> {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const elementSummary = Object.entries(pillars.elementCounts)
    .map(([element, count]) => `${element}: ${count}개`)
    .join(", ");

  const timePillarText = pillars.timePillar
    ? `${pillars.timePillar.heavenlyStem}${pillars.timePillar.earthlyBranch}`
    : "모름(미반영)";
  const dayPillarText = `${pillars.dayPillar.heavenlyStem}${pillars.dayPillar.earthlyBranch}`;
  const monthPillarText = `${pillars.monthPillar.heavenlyStem}${pillars.monthPillar.earthlyBranch}`;
  const yearPillarText = `${pillars.yearPillar.heavenlyStem}${pillars.yearPillar.earthlyBranch}`;

  const prompt = `
당신은 사주팔자 팩폭 전문 도사입니다.
진지하고 고루한 한자투 설명문(합쇼체, 해요체)은 절대 금지하며, 사용자를 대놓고 훈수 두고 뼈를 때리는 반말 구어체로 작성해야 합니다.

[말투 및 톤앤매너 규칙 - 중요!]
1. 사용자를 부를 때는 호칭으로 사용자의 실제 이름인 '${input.name}'이나 '너', '임마'라고만 부르세요.
2. 밈/유행어의 맥락을 정확히 이해하고 사용하세요:
   - '줴줴이야(GG이야)'는 절대 사람을 부르는 호칭이 아닙니다! 게임이 어처구니없이 터졌을 때처럼 "이러면 그냥 인생 줴줴이야;;", "사주 꼬라지 보니까 벌써 줴줴이야 판인데?"처럼 '어이없게 망한 상황(GG)'을 표현할 때만 쓰세요.
   - 자주 쓸 도사 표현: "임마", "엄;;", "찐빠", "이건 좀;;", "~해라 좀;;"
3. 분량은 절대 짧게 끊지 말고 각 항목당 최소 4~6문장 이상 길고 구체적으로 디테일하게 서술하세요.

[상담자 정보]
- 이름: ${input.name}
- 성별: ${input.gender === "male" ? "남성" : "여성"}
- 생년월일: ${input.birthYear}년 ${input.birthMonth}월 ${input.birthDay}일 (${input.calendarType === "solar" ? "양력" : "음력"})
- 태어난 시간: ${input.isUnknownTime ? "시간 모름" : `${input.birthHour}시 ${input.birthMinute || 0}분`}
- 고민 분야: ${input.topic}

[사주팔자 명식 데이터]
- 년주: ${yearPillarText}
- 월주: ${monthPillarText}
- 일주: ${dayPillarText} (나를 상징하는 핵심 기운)
- 시주: ${timePillarText}
- 오행 분포: ${elementSummary}

[답변 작성 가이드 - 순수 JSON만 출력]
1. summary (핵심 총평): 사주 원국을 보고 도사가 기가 차서 내뱉는 날카로운 한 줄 팩폭 요약
2. personality (타고난 기질 & 성격 팩폭): 일주와 과다/결핍된 오행을 집요하게 파고들며 성격적 찐빠 지적 (최소 5문장 이상)
3. topicFortune (선택 분야 [${input.topic}] 운세 분석): 왜 지금 이 분야에서 막히는지, 앞으로의 흐름과 현실적 위기 팩폭 (최소 5문장 이상)
4. advice (도사의 현실적 개운법 & 조언): 결핍된 오행을 채우기 위한 일상 속 현실적 솔루션과 정신 번쩍 드는 애정 어린 훈수 (최소 4문장 이상)

[JSON 형식]
{
  "summary": "...",
  "personality": "...",
  "topicFortune": "...",
  "advice": "..."
}
`.trim();

  let lastError: unknown;

  for (const model of CANDIDATE_MODELS) {
    for (let retry = 0; retry < 2; retry++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.9,
          },
        });

        const rawText = response.text || "{}";
        const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedText);

        return {
          summary: parsed.summary || "불과 흙만 가득해서 고집 하나로 밀어붙이다가 자멸하기 딱 좋은 불도저 사주다.",
          personality: parsed.personality || `${input.name}아, 일주 기운 보니까 자존심 하나는 우주를 뚫는다. 남의 말은 죽어도 안 듣고 '내가 맞다' 모드로 달리는데, 상대방 입장에서는 벽 보고 대화하는 느낌이거든? 눈치 좀 챙겨라 좀;;`,
          topicFortune: parsed.topicFortune || `선택한 ${input.topic} 보니까 찐빠가 보통 큰 게 아니다. 본인 페이스대로 들이대다 차이기 일쑤니까 브레이크 안 밟으면 그냥 판 자체가 줴줴이야.`,
          advice: parsed.advice || "부족한 기운 채우려면 일단 물이나 자주 마시고 네 생각만 옳다는 착각부터 버려라. 알겠냐 임마?",
        };
      } catch (err: unknown) {
        lastError = err;
        const errMsg = String(err);
        if (errMsg.includes("503") || errMsg.includes("high demand")) {
          console.warn(`[${model} 일시적 과부하(503), 1초 후 재시도 (${retry + 1}/2)]`);
          await delay(1200);
          continue;
        }
        console.warn(`[${model} 호출 실패, 다음 모델로 대체 시도]:`, err);
        break;
      }
    }
  }

  console.error("[모든 Gemini 후보 모델 호출 실패]:", lastError);
  throw lastError;
}