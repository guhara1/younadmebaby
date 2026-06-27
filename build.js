/* =========================================================
   build.js — 정적 사이트 빌드
   layout.html + src/content/*.html → 폴더형 정적 HTML 생성
   실행:  node build.js
   ========================================================= */

const fs = require("fs");
const path = require("path");
const { SITE, NAV, PAGES, REVIEWS } = require("./site.config.js");

const ROOT = __dirname;
const layout = fs.readFileSync(path.join(ROOT, "src/layout.html"), "utf8");

/* ---------- 내비게이션 HTML 생성 (페이지별 활성 표시) ---------- */
function buildNav(currentUrl) {
  const cur = (href) => (href === currentUrl ? ' aria-current="page"' : "");
  const items = NAV.map((item) => {
    if (!item.children) {
      return `            <li><a href="${item.href}"${cur(item.href)}>${item.label}</a></li>`;
    }
    const subs = item.children
      .map((c) => `                <li><a href="${c.href}"${cur(c.href)}>${c.label}</a></li>`)
      .join("\n");
    return [
      `            <li class="has-sub">`,
      `              <a href="${item.href}"${cur(item.href)}>${item.label}</a>`,
      `              <button class="sub-toggle" aria-expanded="false" aria-label="${item.label} 하위메뉴 열기"></button>`,
      `              <ul class="submenu">`,
      subs,
      `              </ul>`,
      `            </li>`,
    ].join("\n");
  });
  return `          <ul class="menu">\n${items.join("\n")}\n          </ul>`;
}

/* ---------- 빵부스러기(Breadcrumb) 경로 계산 ---------- */
function breadcrumbTrail(url) {
  const trail = [{ name: "홈", url: "/" }];
  for (const item of NAV) {
    if (item.href === url && item.href !== "/") { trail.push({ name: item.label, url: item.href }); return trail; }
    if (item.children) {
      const child = item.children.find((c) => c.href === url);
      if (child) {
        trail.push({ name: item.label, url: item.href });
        trail.push({ name: child.label, url: child.href });
        return trail;
      }
    }
  }
  return trail; // 홈만 (정책 페이지 등은 fragment 내 breadcrumb 사용)
}

/* ---------- JSON-LD 생성 ---------- */
const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "잠원동 18-5 티롤호텔 별관 지하",
  addressLocality: "서초구",
  addressRegion: "서울특별시",
  postalCode: "06504",
  addressCountry: "KR",
};
const GEO = { "@type": "GeoCoordinates", latitude: 37.5135, longitude: 127.019 };
const OPENING_HOURS = [{
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
  opens: "00:00", closes: "23:59",
}];

/* AggregateRating + Review (메인·지역 페이지 공용)
   ⚠ 실제 수집 후기로 교체 권장 (site.config.js REVIEWS) */
function ratingAndReviews() {
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: REVIEWS.ratingValue,
      reviewCount: String(REVIEWS.reviewCount),
      bestRating: REVIEWS.bestRating,
    },
    review: REVIEWS.items.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.datePublished,
      reviewRating: { "@type": "Rating", ratingValue: String(r.rating), bestRating: REVIEWS.bestRating },
      reviewBody: r.body,
    })),
  };
}

function jsonLdNightClub() {
  return {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: "유앤미 가라오케",
    alternateName: "강남 가라오케 유앤미",
    url: SITE.origin + "/",
    telephone: "+82-10-3431-0531",
    image: SITE.origin + "/assets/img/og-cover.jpg",
    priceRange: "₩₩₩",
    address: ADDRESS,
    geo: GEO,
    openingHoursSpecification: OPENING_HOURS,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+82-10-3431-0531",
      contactType: "reservations",
      name: "서부장",
      availableLanguage: ["ko"],
    },
    ...ratingAndReviews(),
  };
}

/* 지역 랜딩페이지용 LocalBusiness(NightClub) — areaServed + 평점/후기 포함 */
function jsonLdAreaBusiness(page) {
  return {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: `유앤미 가라오케 — ${page.area.name} 가라오케`,
    alternateName: `${page.area.name} 유앤미 가라오케`,
    url: SITE.origin + page.url,
    telephone: "+82-10-3431-0531",
    image: SITE.origin + "/assets/img/og-cover.jpg",
    priceRange: "₩₩₩",
    address: ADDRESS,
    geo: GEO,
    areaServed: page.area.served.map((a) => ({ "@type": "Place", name: a })),
    openingHoursSpecification: OPENING_HOURS,
    ...ratingAndReviews(),
  };
}

/* 메인 FAQ 구조화데이터 (home.html의 FAQ와 내용 일치 유지) */
const HOME_FAQ = [
  ["예약은 어떻게 하나요?", "전화(010-3431-0531) 또는 카카오톡으로 인원과 방문 예정 시간을 알려주시면 됩니다. 24시 예약 대기로 접수하며, 방문 전 예약을 권장합니다."],
  ["운영 시간이 어떻게 되나요?", "연중무휴로 24시간 운영합니다. 낮이든 새벽이든 언제든 방문하실 수 있으며, 예약 문의도 24시간 받고 있습니다. 다만 방문 전 전화로 룸 현황을 확인해 주시면 더 편하게 안내해 드립니다."],
  ["위치와 픽업은 어떻게 되나요?", "서초구 잠원동 티롤호텔 별관 지하에 있으며 신사역·강남과 인접합니다. 무료 픽업을 지원하니 예약 시 위치를 알려주시면 안내해 드립니다."],
  ["주대(이용요금)는 어떻게 안내되나요?", "코스와 주대는 예약·방문 시 명확히 안내해 드립니다. 자세한 내용은 이용안내 페이지를 참고하시거나 담당자에게 문의하세요."],
];
function jsonLdFaqPage() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

function jsonLdBreadcrumb(url) {
  const trail = breadcrumbTrail(url);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: SITE.origin + t.url,
    })),
  };
}

function scriptLd(obj) {
  return `  <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n  </script>`;
}

/* ---------- 페이지 렌더 ---------- */
function render(page) {
  const fragmentPath = path.join(ROOT, "src/content", page.content + ".html");
  const content = fs.readFileSync(fragmentPath, "utf8").trimEnd();
  const canonical = SITE.origin + page.url;

  const ld = [];
  if (page.home) {
    ld.push(jsonLdNightClub());
    ld.push(jsonLdFaqPage());
  } else if (page.area) {
    ld.push(jsonLdAreaBusiness(page));
    ld.push(jsonLdBreadcrumb(page.url));
  } else if (page.navKey) {
    ld.push(jsonLdBreadcrumb(page.url));
  }
  const headExtra = ld.map(scriptLd).join("\n");

  let html = layout
    .replace(/{{TITLE}}/g, page.title)
    .replace(/{{DESC}}/g, page.desc)
    .replace(/{{CANONICAL}}/g, canonical)
    .replace("{{HEAD_EXTRA}}", headExtra)
    .replace("{{NAV}}", buildNav(page.url))
    .replace("{{CONTENT}}", content);

  const outPath = path.join(ROOT, page.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
  return outPath;
}

/* ---------- sitemap · rss · robots ---------- */
function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = PAGES.map((p) => [
    "  <url>",
    `    <loc>${SITE.origin}${p.url}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${p.changefreq || "monthly"}</changefreq>`,
    `    <priority>${p.priority || "0.5"}</priority>`,
    "  </url>",
  ].join("\n")).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");
}

/* RSS 2.0 피드 — 네이버 서치어드바이저 RSS 제출 + 색인 발견 가속용 */
function buildRss() {
  const now = new Date();
  const pubDate = now.toUTCString();
  const items = PAGES
    .filter((p) => p.priority !== "0.3") // 정책 페이지 제외
    .sort((a, b) => parseFloat(b.priority || "0.5") - parseFloat(a.priority || "0.5"))
    .map((p) => [
      "    <item>",
      `      <title>${xmlEscape(p.title)}</title>`,
      `      <link>${SITE.origin}${p.url}</link>`,
      `      <guid isPermaLink="true">${SITE.origin}${p.url}</guid>`,
      `      <pubDate>${pubDate}</pubDate>`,
      `      <description>${xmlEscape(p.desc)}</description>`,
      "    </item>",
    ].join("\n")).join("\n");
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
    `  <channel>\n` +
    `    <title>${xmlEscape(SITE.name)}</title>\n` +
    `    <link>${SITE.origin}/</link>\n` +
    `    <description>강남·신사 가라오케 유앤미 — 신사역 인근 잠원동 티롤호텔 별관, 연중무휴 24시간 운영.</description>\n` +
    `    <language>ko</language>\n` +
    `    <lastBuildDate>${pubDate}</lastBuildDate>\n` +
    `    <atom:link href="${SITE.origin}/feed.xml" rel="self" type="application/rss+xml" />\n` +
    `${items}\n` +
    `  </channel>\n` +
    `</rss>\n`;
  fs.writeFileSync(path.join(ROOT, "feed.xml"), xml, "utf8");
}

function buildRobots() {
  const txt = [
    "User-agent: *",
    "Allow: /",
    "",
    "# 네이버 검색로봇",
    "User-agent: Yeti",
    "Allow: /",
    "",
    "# 구글 검색로봇",
    "User-agent: Googlebot",
    "Allow: /",
    "",
    "# 빙 검색로봇",
    "User-agent: bingbot",
    "Allow: /",
    "",
    `Sitemap: ${SITE.origin}/sitemap.xml`,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(ROOT, "robots.txt"), txt, "utf8");
}

/* ---------- 실행 ---------- */
let count = 0;
for (const page of PAGES) {
  try {
    render(page);
    count++;
  } catch (e) {
    console.error(`✗ ${page.out} — ${e.message}`);
  }
}
buildSitemap();
buildRss();
buildRobots();
console.log(`✓ ${count}/${PAGES.length} 페이지 생성 완료 · sitemap.xml · feed.xml · robots.txt`);
