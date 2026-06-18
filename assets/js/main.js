/* 유앤미 가라오케 - 공통 스크립트 (가벼운 바닐라 JS) */
(function () {
  "use strict";

  // 모바일 내비게이션 토글
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // 메뉴 항목 클릭 시 닫기 (모바일)
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 현재 연도 자동 표기
  var y = document.querySelector("[data-year]");
  if (y) { y.textContent = new Date().getFullYear(); }
})();
