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
    title: "강남 유앤미 가라오케 | 잠원동 티롤호텔 별관 · 예약 서부장 010-3431-0531",
    desc: "강남 유앤미 가라오케 공식 홈페이지. 서초구 잠원동 티롤호텔 별관 지하의 프리미엄 가라오케 라운지. 룸 안내, 이용 시스템, 예약 문의는 서부장 010-3431-0531.",
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

  { out: "youth-protection/index.html", url: "/youth-protection/", navKey: "", content: "youth-protection",
    title: "청소년보호정책 | 유앤미 가라오케",
    desc: "유앤미 가라오케 청소년보호정책. 만 19세 미만 청소년의 출입·고용을 금지하며 청소년 보호 방침을 안내합니다.",
    priority: "0.3", changefreq: "yearly" },
  { out: "privacy/index.html", url: "/privacy/", navKey: "", content: "privacy",
    title: "개인정보처리방침 | 유앤미 가라오케",
    desc: "유앤미 가라오케 개인정보처리방침. 예약 응대 과정에서 수집하는 개인정보의 항목·목적·보유 기간을 안내합니다.",
    priority: "0.3", changefreq: "yearly" },
];

module.exports = { SITE, NAV, PAGES };
