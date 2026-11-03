import { Landing } from "@/components/landing/Landing";
import { SITE } from "@/lib/site";

// 검색엔진·AI 답변 엔진이 회사와 제품을 같은 개체로 묶도록 구조화 데이터를 남긴다.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: `${SITE.url}/`,
      logo: `${SITE.url}/appicon.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      name: SITE.name,
      url: `${SITE.url}/`,
      inLanguage: "ko-KR",
      publisher: { "@id": `${SITE.url}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE.url}/#product`,
      name: SITE.name,
      description: SITE.description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "macOS, Windows, Linux",
      url: `${SITE.url}/`,
      publisher: { "@id": `${SITE.url}/#organization` },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify 결과의 "<"를 이스케이프해 script 태그가 닫히지 않게 한다.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Landing />
    </>
  );
}
