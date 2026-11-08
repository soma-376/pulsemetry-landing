// 검색엔진·AI 답변 엔진에 노출되는 사이트 정보. 문구는 docs/product/prd.md 범위 안에서만 쓴다.

export const SITE = {
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pulsemetry.co.kr"
  ).replace(/\/$/, ""),
  name: "Pulsemetry",
  title: "Pulsemetry — Claude Code·Codex 사용량과 비용을 팀별로",
  description:
    "Pulsemetry는 Claude Code와 Codex의 사용 기록을 모아 조직·팀·구성원별 사용량과 비용을 보여줍니다. 공시 단가 기준 금액과 조직 계약 단가를 적용한 금액을 구분해 확인할 수 있습니다.",
  locale: "ko_KR",
};
