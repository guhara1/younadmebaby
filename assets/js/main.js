/* 유앤미 가라오케 - 공통 스크립트 (경량 바닐라 JS) */
(function () {
  "use strict";

  /* ── 모바일 내비게이션 토글 ── */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ── 헤더 스크롤 상태 (배경 글래스 효과) ── */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ── 현재 연도 자동 표기 ── */
  var y = document.querySelector("[data-year]");
  if (y) { y.textContent = new Date().getFullYear(); }

  /* ── 스크롤 리빌 모션 (점진적 향상) ── */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(
    ".section-head, .card, .step, .gallery-grid figure, .contact-box, " +
    ".price-table, .price-note, .faq details, .map-embed, .info-list, " +
    ".prose h2, .prose p, .prose ul, .hero .btn, .divider"
  );

  if (!reduce && "IntersectionObserver" in window && targets.length) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      // 같은 행 요소들에 부드러운 스태거
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      io.observe(el);
    });
  }
})();
