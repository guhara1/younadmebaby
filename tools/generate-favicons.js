/* 파비콘 래스터 생성기 (순수 Node, 외부 의존성 없음)
   favicon.svg와 동일한 기하학적 마크(골드 "U" 모노그램 + 골드 점)를
   PNG / ICO 로 렌더링합니다. 4x 슈퍼샘플링 안티앨리어싱.
   실행: node tools/generate-favicons.js */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const ROOT = path.join(__dirname, "..");

/* ---------- 디자인 파라미터 (favicon.svg와 일치, 정규화 0~1) ---------- */
const RR = 0.22;                 // 라운드 사각형 코너 반경
const XL = 0.32, XR = 0.68;      // U 좌/우 기둥 중심선
const HW = 0.0656;               // U 획 반폭 (stroke-width 8.4/64 / 2)
const YT = 0.22, YBC = 0.56;     // U 기둥 상단 / 바닥 호 중심
const RAD = 0.18;                // U 바닥 호 반경
const DOT = { x: 0.806, y: 0.656, r: 0.0484 }; // 트레일링 점 (51.6,42,3.1 / 64)
const BORDER = 0.045;

const GOLD_TOP = [246, 236, 200], GOLD_BOT = [198, 159, 82];
const BG_TOP = [28, 24, 40], BG_BOT = [10, 9, 13];
const GOLD_LINE = [200, 164, 92];

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
function mix3(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }

function roundRectSDF(x, y) {
  const dx = Math.abs(x - 0.5) - (0.5 - RR);
  const dy = Math.abs(y - 0.5) - (0.5 - RR);
  const ax = Math.max(dx, 0), ay = Math.max(dy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(dx, dy), 0) - RR;
}
function segDistV(x, y, sx, y0, y1) {
  const cy = clamp(y, y0, y1);
  return Math.hypot(x - sx, y - cy);
}
function uDist(x, y) {
  const dl = segDistV(x, y, XL, YT, YBC);
  const dr = segDistV(x, y, XR, YT, YBC);
  const da = (y >= YBC) ? Math.abs(Math.hypot(x - 0.5, y - YBC) - RAD) : Infinity;
  return Math.min(dl, dr, da);
}
function goldByY(y) {
  const t = clamp((y - YT) / (YBC + RAD - YT), 0, 1);
  return mix3(GOLD_TOP, GOLD_BOT, t);
}

/* 한 서브샘플의 RGBA 반환 */
function sample(x, y) {
  const s = roundRectSDF(x, y);
  if (s > 0) return [0, 0, 0, 0];                       // 라운드 사각형 밖 → 투명
  let col = mix3(BG_TOP, BG_BOT, clamp(y, 0, 1));        // 배경 그라데이션
  if (s > -BORDER) col = mix3(col, GOLD_LINE, 0.45);     // 가장자리 골드 보더
  if (uDist(x, y) <= HW) col = goldByY(y);               // U 모노그램
  const dd = Math.hypot(x - DOT.x, y - DOT.y);
  if (dd <= DOT.r) col = goldByY(y);                     // 트레일링 점
  return [col[0], col[1], col[2], 255];
}

/* ---------- 래스터화 (4x 슈퍼샘플) ---------- */
function render(size) {
  const S = 4, buf = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < S; sy++) {
        for (let sx = 0; sx < S; sx++) {
          const nx = (px + (sx + 0.5) / S) / size;
          const ny = (py + (sy + 0.5) / S) / size;
          const c = sample(nx, ny);
          r += c[0] * c[3]; g += c[1] * c[3]; b += c[2] * c[3]; a += c[3];
        }
      }
      const n = S * S, i = (py * size + px) * 4;
      const aa = a / n;
      buf[i] = aa ? Math.round(r / a) : 0;
      buf[i + 1] = aa ? Math.round(g / a) : 0;
      buf[i + 2] = aa ? Math.round(b / a) : 0;
      buf[i + 3] = Math.round(aa);
    }
  }
  return buf;
}

/* ---------- PNG 인코더 ---------- */
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function encodePNG(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter none
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

/* ---------- ICO (PNG 임베드) ---------- */
function encodeICO(sizes) {
  const pngs = sizes.map((s) => encodePNG(s, render(s)));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
  const entries = [];
  let offset = 6 + sizes.length * 16;
  sizes.forEach((s, i) => {
    const e = Buffer.alloc(16);
    e[0] = s >= 256 ? 0 : s; e[1] = s >= 256 ? 0 : s;
    e[2] = 0; e[3] = 0;
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(pngs[i].length, 8); e.writeUInt32LE(offset, 12);
    offset += pngs[i].length;
    entries.push(e);
  });
  return Buffer.concat([header, ...entries, ...pngs]);
}

/* ---------- 출력 ---------- */
function write(rel, buf) {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, buf);
  console.log(`  ✓ ${rel} (${buf.length.toLocaleString()} B)`);
}

console.log("파비콘 생성:");
write("favicon.ico", encodeICO([16, 32, 48]));
write("apple-touch-icon.png", encodePNG(180, render(180)));
write("assets/img/icon-192.png", encodePNG(192, render(192)));
write("assets/img/icon-512.png", encodePNG(512, render(512)));
write("assets/img/favicon-32.png", encodePNG(32, render(32)));
console.log("완료.");
