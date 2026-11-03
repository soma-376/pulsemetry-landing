import type { Metadata, Viewport } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "lenis/dist/lenis.css";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pulsemetry.co.kr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Pulsemetry — AI에 쓰는 돈, 어디로 가는지",
  description:
    "Claude Code · Codex · Cursor 사용량과 비용을 조직·팀·구성원 단위로 확인하세요. 유휴 좌석과 사용 낭비를 찾아냅니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Pulsemetry",
    title: "AI에 쓰는 돈, 어디로 가는지.",
    description: "Claude Code · Codex · Cursor 사용량과 비용을 한 곳에서.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F4F1",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
