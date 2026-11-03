// 랜딩에 표시하는 숫자는 모두 예시 데이터다. 실제 고객 수치가 아니다.

export const LINKS = {
  contact: "/contact",
  demo: process.env.NEXT_PUBLIC_DEMO_URL ?? "https://app.pulsemetry.co.kr",
};

export const HERO_AMOUNT = "$1,228";
export const IDLE_USD = 780;
export const WASTE_USD = 448;

export const SEAT_TOTAL = 148;
export const SEAT_IDLE = 31;

// 서버와 클라이언트가 같은 좌석을 고르도록 고정 시드 LCG를 쓴다.
function pickIdleSeats() {
  const idle = new Set<number>();
  let x = 11;
  for (let i = 0; i < 2000 && idle.size < SEAT_IDLE; i++) {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    idle.add(x % SEAT_TOTAL);
  }
  return idle;
}

const idleSeats = pickIdleSeats();
export const SEATS = Array.from({ length: SEAT_TOTAL }, (_, i) =>
  idleSeats.has(i),
);

export const STEPS = [
  {
    n: "01",
    page: "개요",
    title: "지출과 낭비를 한 화면에.",
    sub: "벤더 · 좌석 · 모델별 지출",
  },
  {
    n: "02",
    page: "성과",
    title: "빨라졌는지, 비싸졌는지.",
    sub: "사이클 타임 · 사이클 비용 · 재작업 비용",
  },
  {
    n: "03",
    page: "보안",
    title: "승인하지 않은 AI까지.",
    sub: "미승인 도구 · 민감 정보 · 정책 적용",
  },
];

export const KPIS = [
  { label: "사용자 수", value: "117", unit: "명" },
  { label: "사용 환산액", value: "$3,212", unit: "" },
  { label: "좌석 효율", value: "2.4", unit: "×" },
];

export const WASTE = [
  { label: "유휴 좌석", value: "$780", color: "#8A5A28", width: "100%" },
  { label: "사용 낭비", value: "$448", color: "#33538F", width: "57%" },
];

export const VENDORS = [
  { name: "Claude", share: 70, color: "#6B4E93" },
  { name: "OpenAI", share: 22, color: "#A9743C" },
  { name: "Cursor", share: 8, color: "#9CA3AF" },
];

export const GROUPS = [
  { name: "활발", rule: "주 4일 이상", lead: "2.6일", rework: "$34.80" },
  { name: "보통", rule: "주 2–4일", lead: "3.2일", rework: "$29.10" },
  { name: "낮음", rule: "주 2일 미만", lead: "3.9일", rework: "$24.60" },
];

export const SEC_KPIS = [
  { label: "미승인 AI", value: "5", unit: "건", fg: "#8A5A28" },
  { label: "보안 위험", value: "7", unit: "건", fg: "#DC2626" },
  { label: "정책 적용", value: "87", unit: "%", fg: "#111827" },
];

export const SHADOW = [
  { tool: "Gemini CLI", ago: "4일 전", n: "2명" },
  { tool: "Windsurf", ago: "9일 전", n: "6명" },
  { tool: "OpenAI API 개인 키", ago: "13일 전", n: "3명" },
];

export const OS_LIST = ["macOS", "Windows", "Linux"];

export const INSTALL_CMD =
  "curl -fsSL 'https://api-pulsemetry.co.kr/unix?code=ETB8-ZEZG-PPSA' | sh";

export const INSTALL_LINES = [
  "darwin / arm64",
  "pulsemetryd 2.4.0",
  "코드웍스 연결",
];
