import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

// 공유 미리보기 이미지. 정적 호스팅에서 PNG로 서빙되도록 .png 경로의 라우트로 둔다.
// 빌드 시 한 번 생성한다. 한글 글리프가 필요해 Pretendard OTF를 직접 읽는다.
export async function GET() {
  const fontDir = join(
    process.cwd(),
    "node_modules/pretendard/dist/public/static",
  );
  const [semibold, medium, icon] = await Promise.all([
    readFile(join(fontDir, "Pretendard-SemiBold.otf")),
    readFile(join(fontDir, "Pretendard-Medium.otf")),
    readFile(join(process.cwd(), "public/appicon.png")),
  ]);
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#F4F4F1",
        color: "#111827",
        fontFamily: "Pretendard",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* ImageResponse 안에서는 next/image를 쓸 수 없다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} width={44} height={44} alt="" />
        <span style={{ fontSize: 32, fontWeight: 600 }}>Pulsemetry</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span
          style={{ fontSize: 84, fontWeight: 600, letterSpacing: "-0.04em" }}
        >
          AI에 쓰는 돈,
        </span>
        <span
          style={{
            fontSize: 84,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "#6B7280",
          }}
        >
          어디로 가는지.
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 28,
          fontWeight: 500,
          color: "#4B5563",
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 3,
            background: "#33538F",
          }}
        />
        Claude Code · Codex 사용량과 비용을 팀별로
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: semibold, weight: 600, style: "normal" },
        { name: "Pretendard", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
