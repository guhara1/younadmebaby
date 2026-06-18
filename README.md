# 유앤미 가라오케 (younadmebaby.com)

강남 유앤미 가라오케 공식 홈페이지. 서울 서초구 잠원동 티롤호텔 별관 지하에 위치한
가라오케 라운지 안내 사이트입니다.

상단 메뉴와 모든 하위메뉴가 **각각 독립된 URL(폴더형)** 로 존재하며, 페이지마다
중복 없는 고유 본문(한글 2,000~2,500자)을 갖습니다. 정적 HTML로 빌드되어 어떤
정적 호스팅에서도 그대로 배포할 수 있습니다.

## 페이지 구조 (폴더형 URL · 총 22개)

| 상단 메뉴 | URL |
| --- | --- |
| 홈 | `/` |
| 유앤미 소개 | `/about/` |
| └ 매장 소개 | `/about/store/` |
| └ 내부 시설 · 룸 안내 | `/about/facility/` |
| └ 운영 시간 안내 | `/about/hours/` |
| 이용안내 | `/guide/` |
| └ 코스 · 시스템 안내 | `/guide/course/` |
| └ 주대(이용요금) 안내 | `/guide/price/` |
| └ 예약 시 유의사항 | `/guide/notice/` |
| 룸 & 갤러리 | `/rooms/` |
| └ 룸 종류별 안내 | `/rooms/types/` |
| └ 매장 사진 갤러리 | `/rooms/gallery/` |
| 예약 / 문의 | `/reservation/` |
| └ 예약 방법 | `/reservation/how/` |
| └ 실시간 문의 | `/reservation/contact/` |
| └ 담당자(서부장) 연락처 | `/reservation/manager/` |
| 오시는 길 | `/location/` |
| └ 약도 · 지도 | `/location/map/` |
| └ 주차 안내 | `/location/parking/` |
| └ 대중교통 안내 | `/location/transit/` |
| 정책(푸터) | `/youth-protection/` · `/privacy/` |

## 빌드 시스템

22개 페이지의 헤더·내비게이션·푸터가 동일하므로, 마크업 중복을 없애기 위해
간단한 정적 빌드를 사용합니다. **빌드 결과물(루트의 `index.html` 및 각 폴더의
`index.html`)은 순수 정적 HTML이므로, 배포 시 빌드 도구가 필요 없습니다.**

```
src/layout.html        공통 레이아웃(헤더·드롭다운 메뉴·푸터·CTA)
src/content/<name>.html 페이지별 본문 조각(고유 콘텐츠)
site.config.js         내비게이션 + 페이지 매니페스트(제목·설명·URL)
build.js               레이아웃 + 조각 → 폴더형 정적 HTML 생성 (+ sitemap/robots)
tools/charcount.js     페이지별 본문 글자 수(2,000~2,500자) 점검
```

콘텐츠나 메뉴를 수정한 뒤에는 빌드를 다시 실행하세요.

```bash
node build.js          # 전체 페이지 + sitemap.xml + robots.txt 재생성
node tools/charcount.js # 본문 글자 수 점검
```

> 수정 워크플로: `src/content/*.html`(본문) 또는 `site.config.js`(메뉴·메타)를
> 고친 뒤 `node build.js`를 실행 → 변경된 정적 HTML을 커밋.

## NAP (검색 일관성 유지)

사이트 전체에서 아래 정보를 **동일한 형식**으로 사용합니다. 변경 시 `site.config.js`와
`src/`를 함께 수정한 뒤 다시 빌드하세요.

- **상호:** 유앤미 가라오케
- **주소:** 서울특별시 서초구 잠원동 18-5 티롤호텔(TIROL HOTEL) 별관 지하
- **전화(예약):** 010-3431-0531 (서부장)
- **운영시간:** 매일 18:00 – 05:00

## 배포 전 체크리스트

1. **도메인/HTTPS:** `younadmebaby.com`에 SSL 적용 (HTTPS 필수).
2. **실제 사진 교체:** `assets/img/`에 매장/룸 사진(WebP 권장)을 넣고 갤러리의
   플레이스홀더(`.ph`)를 `<img loading="lazy" alt="...">`로 교체.
3. **법적 표기 채우기:** 푸터(`src/layout.html`)의 `대표자`, `사업자등록번호`를 실제 값으로.
4. **지도 좌표:** 지도 임베드와 JSON-LD `geo` 좌표를 정확한 값으로 보정.
5. **카카오톡 링크:** 카카오톡 버튼 `href`를 실제 채널/오픈채팅 주소로 연결.
6. **검색엔진 등록:** Google Search Console·네이버 서치어드바이저 등록 후 `sitemap.xml` 제출.
7. **OG 이미지:** `assets/img/og-cover.jpg`(1200×630 권장) 추가.

## SEO / 가이드라인 준수 메모

- 모바일 우선 설계, 실제 `<a href>` 링크 기반 드롭다운 내비게이션(크롤 가능).
- 페이지마다 고유 `title`·`meta description`. 키워드 나열(도배) 미사용.
- 메인에 `NightClub`(LocalBusiness) JSON-LD, 하위 페이지에 `BreadcrumbList` 구조화 데이터.
- 모든 본문은 페이지별 고유 내용(중복 콘텐츠 회피)이며, 확인 불가한 구체 정보
  (요금·주차장명·지하철 출구번호 등)는 단정하지 않고 "문의/예약 시 안내"로 처리.
- 도어웨이 페이지·숨김 텍스트 등 블랙햇 기법 미사용 (구글 스팸 정책 준수).
- 청소년 출입·고용 금지 표기 및 정책 페이지 포함(법적 표기 의무 대응).
- 유흥 성격상 구글 광고(애드센스) 수익화는 제한되므로 SEO·자체 채널 중심 운영 권장.
