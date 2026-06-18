/* =========================================================
   build.js — 정적 사이트 빌드
   layout.html + src/content/*.html → 폴더형 정적 HTML 생성
   실행:  node build.js
   ========================================================= */

const fs = require("fs");
const path = require("path");
const { SITE, NAV, PAGES } = require("./site.config.js");

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
function jsonLdNightClub() {
  return {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: "유앤미 가라오케",
    alternateName: "강남 유앤미 가라오케",
    url: SITE.origin + "/",
    telephone: "+82-10-3431-0531",
    image: SITE.origin + "/assets/img/og-cover.jpg",
    priceRange: "₩₩₩",
    address: {
      "@type": "PostalAddress",
      streetAddress: "잠원동 18-5 티롤호텔 별관 지하",
      addressLocality: "서초구",
      addressRegion: "서울특별시",
      postalCode: "06504",
      addressCountry: "KR",
    },
    geo: { "@type": "GeoCoordinates", latitude: 37.5135, longitude: 127.019 },
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "18:00", closes: "05:00",
    }],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+82-10-3431-0531",
      contactType: "reservations",
      name: "서부장",
      availableLanguage: ["ko"],
    },
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

  let headExtra;
  if (page.home) {
    headExtra = scriptLd(jsonLdNightClub());
  } else if (page.navKey) {
    headExtra = scriptLd(jsonLdBreadcrumb(page.url));
  } else {
    headExtra = "";
  }

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

/* ---------- sitemap & robots ---------- */
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

function buildRobots() {
  const txt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`;
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
buildRobots();
console.log(`✓ ${count}/${PAGES.length} 페이지 생성 완료 · sitemap.xml · robots.txt`);
