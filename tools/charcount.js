/* 생성된 페이지의 '보이는 본문' 한글 글자 수(공백 포함) 점검
   - <main> 내부 텍스트만 추출(헤더/푸터/스크립트 제외)
   - 실행: node tools/charcount.js */
const fs = require("fs");
const path = require("path");
const { PAGES } = require("../site.config.js");

const ROOT = path.join(__dirname, "..");

function visibleMainText(html) {
  const m = html.match(/<main id="main">([\s\S]*?)<\/main>/);
  if (!m) return "";
  let s = m[1];
  s = s.replace(/<script[\s\S]*?<\/script>/g, "");
  s = s.replace(/<style[\s\S]*?<\/style>/g, "");
  s = s.replace(/<[^>]+>/g, " ");      // 태그 제거
  s = s.replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&[a-z]+;/g, " ");
  s = s.replace(/[ \t\r\n]+/g, " ").trim(); // 공백 정규화(1칸)
  return s;
}

let warn = 0;
console.log("페이지별 본문 글자 수(공백 포함, 정규화 기준)\n");
for (const p of PAGES) {
  const file = path.join(ROOT, p.out);
  if (!fs.existsSync(file)) { console.log(`  (없음) ${p.out}`); continue; }
  const text = visibleMainText(fs.readFileSync(file, "utf8"));
  const n = text.length;
  let flag = "";
  if (p.home || !p.navKey) { flag = "  (기준 예외)"; }
  else if (n < 2000) { flag = "  ⚠ 부족"; warn++; }
  else if (n > 2500) { flag = "  ⚠ 초과"; warn++; }
  else { flag = "  ✓"; }
  console.log(`  ${String(n).padStart(4)}자  ${p.url}${flag}`);
}
console.log(`\n범위(2000~2500) 벗어난 본문 페이지: ${warn}개`);
