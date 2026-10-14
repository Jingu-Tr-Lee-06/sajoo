import {
  FiveElement,
  SajuPillar,
  SajuPillarsResult,
  UserSajuInput,
} from "@/types/saju";

// 10천간 (갑을병정무기경신임계)
const HEAVENLY_STEMS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"] as const;

// 12지지 (자축인묘진사오미신유술해)
const EARTHLY_BRANCHES = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"] as const;

// 천간별 오행 매핑
const STEM_ELEMENT_MAP: Record<string, FiveElement> = {
  갑: "목(木)",
  을: "목(木)",
  병: "화(火)",
  정: "화(火)",
  무: "토(土)",
  기: "토(土)",
  경: "금(金)",
  신: "금(金)",
  임: "수(水)",
  계: "수(水)",
};

// 지지별 오행 매핑
const BRANCH_ELEMENT_MAP: Record<string, FiveElement> = {
  인: "목(木)",
  묘: "목(木)",
  사: "화(火)",
  오: "화(火)",
  진: "토(土)",
  술: "토(土)",
  축: "토(土)",
  미: "토(土)",
  신: "금(金)",
  유: "금(金)",
  해: "수(水)",
  자: "수(水)",
};

// 기둥 객체 생성 헬퍼
function createPillar(stem: string, branch: string): SajuPillar {
  return {
    heavenlyStem: stem,
    heavenlyElement: STEM_ELEMENT_MAP[stem] || "토(土)",
    earthlyBranch: branch,
    earthlyElement: BRANCH_ELEMENT_MAP[branch] || "토(土)",
  };
}

/**
 * 년주(年柱) 계산
 * 기준: 1900년 경자년(庚子年) 기준 연산
 */
function calculateYearPillar(year: number): SajuPillar {
  // 갑자년(4년)을 기준으로 천간 지지 인덱스 산출
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;

  const stem = HEAVENLY_STEMS[(stemIndex + 10) % 10];
  const branch = EARTHLY_BRANCHES[(branchIndex + 12) % 12];

  return createPillar(stem, branch);
}

/**
 * 월주(月柱) 계산
 * 월건법: 년간에 따라 정월(인월)의 천간이 정해짐
 */
function calculateMonthPillar(yearStem: string, month: number): SajuPillar {
  // 월 지지는 보통 입춘 기준 인월(1월)부터 순환
  const branchOrder = ["인", "묘", "진", "사", "오", "미", "신", "유", "술", "해", "자", "축"];
  const branch = branchOrder[(month - 1) % 12];

  // 년간에 따른 인월(寅月)의 시작 천간 규칙
  let startStemIndex = 0;
  if (yearStem === "갑" || yearStem === "기") startStemIndex = 2; // 병인월 시작
  else if (yearStem === "을" || yearStem === "경") startStemIndex = 4; // 무인월 시작
  else if (yearStem === "병" || yearStem === "신") startStemIndex = 6; // 경인월 시작
  else if (yearStem === "정" || yearStem === "임") startStemIndex = 8; // 임인월 시작
  else if (yearStem === "무" || yearStem === "계") startStemIndex = 0; // 갑인월 시작

  const stem = HEAVENLY_STEMS[(startStemIndex + (month - 1)) % 10];

  return createPillar(stem, branch);
}

/**
 * 일주(日柱) 계산
 * 율리우스일(Julian Day Number) 기반 60갑자 순환 연산
 */
function calculateDayPillar(year: number, month: number, day: number): SajuPillar {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;

  const stemIndex = Math.floor((jd + 0.5 + 9) % 10);
  const branchIndex = Math.floor((jd + 0.5 + 1) % 12);

  const stem = HEAVENLY_STEMS[(stemIndex + 10) % 10];
  const branch = EARTHLY_BRANCHES[(branchIndex + 12) % 12];

  return createPillar(stem, branch);
}

/**
 * 시주(時柱) 계산
 * 시두법: 일간의 천간에 따라 자시(子時)의 천간 결정
 */
function calculateTimePillar(dayStem: string, hour: number): SajuPillar {
  // 23:30 ~ 01:29 자시, 01:30 ~ 03:29 축시 등
  const adjustedHour = (hour + 1) % 24;
  const branchIndex = Math.floor(adjustedHour / 2);
  const branch = EARTHLY_BRANCHES[branchIndex];

  // 일간에 따른 자시(子時) 시작 천간 결정
  let startStemIndex = 0;
  if (dayStem === "갑" || dayStem === "기") startStemIndex = 0; // 갑자시
  else if (dayStem === "을" || dayStem === "경") startStemIndex = 2; // 병자시
  else if (dayStem === "병" || dayStem === "신") startStemIndex = 4; // 무자시
  else if (dayStem === "정" || dayStem === "임") startStemIndex = 6; // 경자시
  else if (dayStem === "무" || dayStem === "계") startStemIndex = 8; // 임자시

  const stem = HEAVENLY_STEMS[(startStemIndex + branchIndex) % 10];

  return createPillar(stem, branch);
}

/**
 * 사주 4주 산출 및 오행 개수 집계 함수
 */
export function calculateSajuPillars(input: UserSajuInput): SajuPillarsResult {
  const yearPillar = calculateYearPillar(input.birthYear);
  const monthPillar = calculateMonthPillar(yearPillar.heavenlyStem, input.birthMonth);
  const dayPillar = calculateDayPillar(input.birthYear, input.birthMonth, input.birthDay);

  let timePillar: SajuPillar | undefined = undefined;
  if (!input.isUnknownTime && input.birthHour !== undefined) {
    timePillar = calculateTimePillar(dayPillar.heavenlyStem, input.birthHour);
  }

  // 오행 빈도 집계
  const elementCounts: Record<FiveElement, number> = {
    "목(木)": 0,
    "화(火)": 0,
    "토(土)": 0,
    "금(金)": 0,
    "수(水)": 0,
  };

  const pillarsToCount = [yearPillar, monthPillar, dayPillar];
  if (timePillar) {
    pillarsToCount.push(timePillar);
  }

  for (const p of pillarsToCount) {
    elementCounts[p.heavenlyElement] = (elementCounts[p.heavenlyElement] || 0) + 1;
    elementCounts[p.earthlyElement] = (elementCounts[p.earthlyElement] || 0) + 1;
  }

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    timePillar,
    elementCounts,
  };
}