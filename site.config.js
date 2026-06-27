/* =========================================================
   site.config.js — 사이트 전역 설정 (내비게이션 + 페이지 매니페스트)
   build.js가 이 파일을 읽어 모든 정적 HTML을 생성합니다.
   ========================================================= */

const SITE = {
  name: "유앤미 가라오케",
  origin: "https://younadmebaby.com",
  tel: "010-3431-0531",
  telLink: "01034310531",
  manager: "서부장",
  hours: "매일 18:00 – 05:00",
  address: "서울특별시 서초구 잠원동 18-5 티롤호텔 별관 지하",
  // 매장은 잠원동에 위치하되, 인접 지역(롱테일 키워드)을 함께 안내
  nearby: ["강남", "신사", "신사동", "신사역", "논현", "압구정", "잠원동", "반포"],
};

/* 고객 후기 데이터(스키마 AggregateRating·Review + 화면 노출 공용)
   ⚠ 실제 수집 후기로 교체 권장 — 구글 리뷰 구조화데이터 정책 참고 */
const REVIEWS = {
  ratingValue: "4.9",
  reviewCount: 137,
  bestRating: "5",
  items: [
    { author: "김** 님", rating: 5, datePublished: "2026-05-18",
      body: "신사역에서 가까워 접근성이 좋았고, 무료 픽업까지 챙겨 주셔서 일행 모두 편하게 도착했습니다. 음향이 정말 깔끔해서 노래 부르는 맛이 달랐어요." },
    { author: "이** 님", rating: 5, datePublished: "2026-04-30",
      body: "회식 자리로 예약했는데 서부장님이 인원에 맞는 룸을 세심하게 안내해 주셨습니다. 주대도 미리 투명하게 알려 주셔서 부담이 없었어요." },
    { author: "박** 님", rating: 5, datePublished: "2026-04-12",
      body: "강남 일대에서 여러 곳 다녀봤지만 룸 관리 상태가 가장 좋았습니다. 조명과 사운드가 고급스러워서 기념일 모임에 딱이었어요." },
    { author: "정** 님", rating: 5, datePublished: "2026-03-25",
      body: "늦은 시간에 문의했는데도 24시 예약 대기로 친절하게 응대해 주셨습니다. 잠원동 티롤호텔 별관이라 위치도 찾기 쉬웠어요." },
    { author: "최** 님", rating: 4, datePublished: "2026-03-09",
      body: "압구정·논현 쪽에서 이동했는데 거리가 가까워 좋았습니다. 분위기 차분하고 응대가 정중해서 다시 방문할 생각입니다." },
    { author: "한** 님", rating: 5, datePublished: "2026-02-20",
      body: "처음 방문이라 어색할까 걱정했는데 차근차근 안내해 주셔서 편안했습니다. 음향 시설이 특급이라는 말이 과장이 아니더라고요." },
  ],
};

/* 상단 메뉴 + 하위메뉴 (key는 활성 표시에 사용) */
const NAV = [
  { label: "홈", href: "/", key: "home" },
  {
    label: "유앤미 소개", href: "/about/", key: "about",
    children: [
      { label: "매장 소개", href: "/about/store/" },
      { label: "내부 시설 · 룸 안내", href: "/about/facility/" },
      { label: "운영 시간 안내", href: "/about/hours/" },
    ],
  },
  {
    label: "이용안내", href: "/guide/", key: "guide",
    children: [
      { label: "코스 · 시스템 안내", href: "/guide/course/" },
      { label: "주대(이용요금) 안내", href: "/guide/price/" },
      { label: "예약 시 유의사항", href: "/guide/notice/" },
    ],
  },
  {
    label: "룸 & 갤러리", href: "/rooms/", key: "rooms",
    children: [
      { label: "룸 종류별 안내", href: "/rooms/types/" },
      { label: "매장 사진 갤러리", href: "/rooms/gallery/" },
    ],
  },
  {
    label: "예약 / 문의", href: "/reservation/", key: "reservation",
    children: [
      { label: "예약 방법", href: "/reservation/how/" },
      { label: "실시간 문의", href: "/reservation/contact/" },
      { label: "담당자 연락처", href: "/reservation/manager/" },
    ],
  },
  {
    label: "오시는 길", href: "/location/", key: "location",
    children: [
      { label: "약도 · 지도", href: "/location/map/" },
      { label: "주차 안내", href: "/location/parking/" },
      { label: "대중교통 안내", href: "/location/transit/" },
    ],
  },
  {
    label: "지역 안내", href: "/area/", key: "area",
    children: [
      { label: "강남 가라오케", href: "/area/gangnam/" },
      { label: "신사 가라오케", href: "/area/sinsa/" },
      { label: "신사동 가라오케", href: "/area/sinsadong/" },
      { label: "신사역 가라오케", href: "/area/sinsa-station/" },
      { label: "논현 가라오케", href: "/area/nonhyeon/" },
      { label: "압구정 가라오케", href: "/area/apgujeong/" },
      { label: "잠원 가라오케", href: "/area/jamwon/" },
      { label: "반포 가라오케", href: "/area/banpo/" },
    ],
  },
];

/* 생성할 페이지 목록
   - out: 출력 경로(폴더형 URL → index.html)
   - url: 정규 URL(canonical, sitemap)
   - navKey: 활성화할 상단 메뉴
   - content: src/content/<content>.html 조각 파일명
   - priority/changefreq: sitemap용
   - home: true면 메인(JSON-LD NightClub 포함) */
const PAGES = [
  { out: "index.html", url: "/", navKey: "home", content: "home", home: true,
    title: "강남 가라오케 유앤미 | 신사·신사역 인근 잠원동 · 연중무휴 24시 예약 대기",
    desc: "강남·신사 가라오케 유앤미. 신사역 인근 잠원동 티롤호텔 별관 지하, 특급 음향시설과 무료 픽업·24시 예약 대기 시스템. 연중무휴 운영, 예약 담당 서부장.",
    priority: "1.0", changefreq: "weekly" },

  { out: "about/index.html", url: "/about/", navKey: "about", content: "about",
    title: "유앤미 소개 | 강남 유앤미 가라오케 잠원동 티롤호텔 별관",
    desc: "강남 유앤미 가라오케 소개. 서초구 잠원동 티롤호텔 별관 지하 라운지의 분위기와 매장·시설·운영 시간을 한눈에 안내합니다.",
    priority: "0.8", changefreq: "monthly" },
  { out: "about/store/index.html", url: "/about/store/", navKey: "about", content: "about-store",
    title: "매장 소개 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 매장 소개. 잠원동 티롤호텔 별관 지하 라운지의 위치, 분위기, 차별점과 이용 안내를 자세히 소개합니다.",
    priority: "0.7", changefreq: "monthly" },
  { out: "about/facility/index.html", url: "/about/facility/", navKey: "about", content: "about-facility",
    title: "내부 시설 · 룸 안내 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 내부 시설과 룸 안내. 음향·조명 시스템과 룸 구성, 편의 시설을 안내합니다.",
    priority: "0.7", changefreq: "monthly" },
  { out: "about/hours/index.html", url: "/about/hours/", navKey: "about", content: "about-hours",
    title: "운영 시간 안내 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 운영 시간 안내. 영업 시간, 방문 권장 시간대, 예약 시 참고 사항을 안내합니다.",
    priority: "0.6", changefreq: "monthly" },

  { out: "guide/index.html", url: "/guide/", navKey: "guide", content: "guide",
    title: "이용안내 | 강남 유앤미 가라오케 코스·주대·예약",
    desc: "강남 유앤미 가라오케 이용안내. 코스·시스템 흐름, 주대(이용요금), 예약 시 유의사항을 정리했습니다.",
    priority: "0.8", changefreq: "monthly" },
  { out: "guide/course/index.html", url: "/guide/course/", navKey: "guide", content: "guide-course",
    title: "코스 · 시스템 안내 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 코스·시스템 안내. 예약부터 룸 배정, 이용까지의 흐름을 단계별로 설명합니다.",
    priority: "0.7", changefreq: "monthly" },
  { out: "guide/price/index.html", url: "/guide/price/", navKey: "guide", content: "guide-price",
    title: "주대(이용요금) 안내 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 주대(이용요금) 안내. 요금 구성 방식과 투명한 안내 원칙, 문의 방법을 설명합니다.",
    priority: "0.7", changefreq: "monthly" },
  { out: "guide/notice/index.html", url: "/guide/notice/", navKey: "guide", content: "guide-notice",
    title: "예약 시 유의사항 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 예약 시 유의사항. 원활한 방문을 위한 예약·인원·시간 관련 안내 사항을 정리했습니다.",
    priority: "0.6", changefreq: "monthly" },

  { out: "rooms/index.html", url: "/rooms/", navKey: "rooms", content: "rooms",
    title: "룸 & 갤러리 | 강남 유앤미 가라오케 룸 종류·매장 사진",
    desc: "강남 유앤미 가라오케 룸 & 갤러리. 룸 종류별 안내와 매장 사진을 통해 분위기를 미리 확인하세요.",
    priority: "0.7", changefreq: "monthly" },
  { out: "rooms/types/index.html", url: "/rooms/types/", navKey: "rooms", content: "rooms-types",
    title: "룸 종류별 안내 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 룸 종류별 안내. 인원과 목적에 맞는 룸 구성과 특징을 자세히 소개합니다.",
    priority: "0.7", changefreq: "monthly" },
  { out: "rooms/gallery/index.html", url: "/rooms/gallery/", navKey: "rooms", content: "rooms-gallery",
    title: "매장 사진 갤러리 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 매장 사진 갤러리. 룸과 시설 사진으로 매장 분위기를 미리 살펴보세요.",
    priority: "0.6", changefreq: "monthly" },

  { out: "reservation/index.html", url: "/reservation/", navKey: "reservation", content: "reservation",
    title: "예약 / 문의 | 강남 유앤미 가라오케 서부장 010-3431-0531",
    desc: "강남 유앤미 가라오케 예약 / 문의. 전화·카카오톡으로 빠르게 예약하세요. 예약 담당 서부장 010-3431-0531.",
    priority: "0.9", changefreq: "monthly" },
  { out: "reservation/how/index.html", url: "/reservation/how/", navKey: "reservation", content: "reservation-how",
    title: "예약 방법 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 예약 방법. 전화·카카오톡 예약 절차와 미리 알려주시면 좋은 정보를 안내합니다.",
    priority: "0.7", changefreq: "monthly" },
  { out: "reservation/contact/index.html", url: "/reservation/contact/", navKey: "reservation", content: "reservation-contact",
    title: "실시간 문의 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 실시간 문의. 전화·카카오톡 등 빠른 문의 채널과 응대 시간을 안내합니다.",
    priority: "0.7", changefreq: "monthly" },
  { out: "reservation/manager/index.html", url: "/reservation/manager/", navKey: "reservation", content: "reservation-manager",
    title: "담당자(서부장) 연락처 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 예약 담당 서부장 연락처 안내. 친절하고 정직한 응대로 모십니다. 010-3431-0531.",
    priority: "0.7", changefreq: "monthly" },

  { out: "location/index.html", url: "/location/", navKey: "location", content: "location",
    title: "오시는 길 | 강남 유앤미 가라오케 잠원동 티롤호텔 별관",
    desc: "강남 유앤미 가라오케 오시는 길. 서초구 잠원동 18-5 티롤호텔 별관 지하. 지도, 약도, 주차, 대중교통 안내.",
    priority: "0.8", changefreq: "monthly" },
  { out: "location/map/index.html", url: "/location/map/", navKey: "location", content: "location-map",
    title: "약도 · 지도 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 약도·지도 안내. 잠원동 티롤호텔 별관 지하 정문 입구 위치를 지도로 확인하세요.",
    priority: "0.6", changefreq: "monthly" },
  { out: "location/parking/index.html", url: "/location/parking/", navKey: "location", content: "location-parking",
    title: "주차 안내 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 주차 안내. 차량 방문 시 주차 이용 방법과 미리 문의해두면 좋은 사항을 안내합니다.",
    priority: "0.6", changefreq: "monthly" },
  { out: "location/transit/index.html", url: "/location/transit/", navKey: "location", content: "location-transit",
    title: "대중교통 안내 | 강남 유앤미 가라오케",
    desc: "강남 유앤미 가라오케 대중교통 안내. 지하철·버스 등으로 잠원동 매장까지 찾아오는 방법을 안내합니다.",
    priority: "0.6", changefreq: "monthly" },

  { out: "area/index.html", url: "/area/", navKey: "area", content: "area",
    area: { name: "강남·신사 일대", served: ["강남", "신사", "신사동", "신사역", "논현", "압구정", "잠원동", "반포"] },
    title: "지역별 가라오케 안내 | 강남·신사·신사역 유앤미 가라오케",
    desc: "강남·신사·신사역·논현·압구정·잠원·반포 등 지역별 가라오케 안내. 잠원동 티롤호텔 별관 유앤미 가라오케로 가는 가장 가까운 길을 지역별로 정리했습니다.",
    priority: "0.8", changefreq: "monthly" },
  { out: "area/gangnam/index.html", url: "/area/gangnam/", navKey: "area", content: "area-gangnam",
    area: { name: "강남", served: ["강남구", "강남대로", "강남역", "서초"] },
    title: "강남 가라오케 | 유앤미 가라오케 (잠원동 티롤호텔 별관)",
    desc: "강남 가라오케 유앤미. 강남 어디서든 접근성 좋은 잠원동 티롤호텔 별관 지하. 특급 음향, 무료 픽업, 24시 예약 대기. 예약 서부장 010-3431-0531.",
    priority: "0.7", changefreq: "monthly" },
  { out: "area/sinsa/index.html", url: "/area/sinsa/", navKey: "area", content: "area-sinsa",
    area: { name: "신사", served: ["신사", "가로수길", "신사동", "압구정"] },
    title: "신사 가라오케 | 유앤미 가라오케 (신사역 인근 잠원동)",
    desc: "신사 가라오케 유앤미. 가로수길·신사 일대에서 가까운 잠원동 티롤호텔 별관 지하. 특급 음향과 무료 픽업, 24시 예약 대기로 모십니다.",
    priority: "0.7", changefreq: "monthly" },
  { out: "area/sinsadong/index.html", url: "/area/sinsadong/", navKey: "area", content: "area-sinsadong",
    area: { name: "신사동", served: ["신사동", "가로수길", "압구정", "논현"] },
    title: "신사동 가라오케 | 유앤미 가라오케 (잠원동 인접)",
    desc: "신사동 가라오케 유앤미. 신사동 인접 잠원동 티롤호텔 별관 지하 라운지. 깔끔한 룸과 특급 음향, 무료 픽업·24시 예약 대기 안내.",
    priority: "0.7", changefreq: "monthly" },
  { out: "area/sinsa-station/index.html", url: "/area/sinsa-station/", navKey: "area", content: "area-sinsa-station",
    area: { name: "신사역", served: ["신사역", "3호선", "신분당선", "신사동"] },
    title: "신사역 가라오케 | 유앤미 가라오케 (도보·무료 픽업)",
    desc: "신사역 가라오케 유앤미. 신사역에서 가까운 잠원동 티롤호텔 별관 지하. 무료 픽업과 24시 예약 대기, 특급 음향 시설로 편하게 모십니다.",
    priority: "0.7", changefreq: "monthly" },
  { out: "area/nonhyeon/index.html", url: "/area/nonhyeon/", navKey: "area", content: "area-nonhyeon",
    area: { name: "논현", served: ["논현동", "논현역", "학동", "강남"] },
    title: "논현 가라오케 | 유앤미 가라오케 (잠원동 티롤호텔 별관)",
    desc: "논현 가라오케 유앤미. 논현동·논현역 일대에서 가까운 잠원동 티롤호텔 별관 지하. 특급 음향, 무료 픽업, 24시 예약 대기 안내.",
    priority: "0.7", changefreq: "monthly" },
  { out: "area/apgujeong/index.html", url: "/area/apgujeong/", navKey: "area", content: "area-apgujeong",
    area: { name: "압구정", served: ["압구정", "압구정로데오", "청담", "신사동"] },
    title: "압구정 가라오케 | 유앤미 가라오케 (신사·잠원동 인근)",
    desc: "압구정 가라오케 유앤미. 압구정·로데오 일대에서 가까운 잠원동 티롤호텔 별관 지하. 특급 음향과 무료 픽업, 24시 예약 대기로 모십니다.",
    priority: "0.7", changefreq: "monthly" },
  { out: "area/jamwon/index.html", url: "/area/jamwon/", navKey: "area", content: "area-jamwon",
    area: { name: "잠원동", served: ["잠원동", "잠원", "반포", "고속터미널"] },
    title: "잠원 가라오케 | 유앤미 가라오케 (잠원동 티롤호텔 별관 본점)",
    desc: "잠원 가라오케 유앤미. 서초구 잠원동 18-5 티롤호텔 별관 지하 바로 그 자리. 특급 음향, 무료 픽업, 24시 예약 대기. 예약 서부장 010-3431-0531.",
    priority: "0.7", changefreq: "monthly" },
  { out: "area/banpo/index.html", url: "/area/banpo/", navKey: "area", content: "area-banpo",
    area: { name: "반포", served: ["반포동", "반포", "고속터미널", "잠원동"] },
    title: "반포 가라오케 | 유앤미 가라오케 (잠원동 인접)",
    desc: "반포 가라오케 유앤미. 반포·고속터미널 일대에서 가까운 잠원동 티롤호텔 별관 지하. 특급 음향과 무료 픽업, 24시 예약 대기 안내.",
    priority: "0.7", changefreq: "monthly" },

  { out: "youth-protection/index.html", url: "/youth-protection/", navKey: "", content: "youth-protection",
    title: "청소년보호정책 | 유앤미 가라오케",
    desc: "유앤미 가라오케 청소년보호정책. 만 19세 미만 청소년의 출입·고용을 금지하며 청소년 보호 방침을 안내합니다.",
    priority: "0.3", changefreq: "yearly" },
  { out: "privacy/index.html", url: "/privacy/", navKey: "", content: "privacy",
    title: "개인정보처리방침 | 유앤미 가라오케",
    desc: "유앤미 가라오케 개인정보처리방침. 예약 응대 과정에서 수집하는 개인정보의 항목·목적·보유 기간을 안내합니다.",
    priority: "0.3", changefreq: "yearly" },
];

module.exports = { SITE, NAV, PAGES, REVIEWS };
