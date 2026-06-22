/* =============================================================
   One Way Insurance — main.js
   Global interactions: mobile nav, sticky header, scroll reveal,
   FAQ accordion, active nav state, footer year.
   ============================================================= */
(function () {
  "use strict";

  /* -----------------------------------------------------------
     Mobile navigation (hamburger)
     ----------------------------------------------------------- */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("primary-menu");
  const backdrop = document.querySelector(".nav-backdrop");

  function openMenu() {
    menu.classList.add("is-open");
    backdrop && backdrop.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    menu.classList.remove("is-open");
    backdrop && backdrop.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });
    backdrop && backdrop.addEventListener("click", closeMenu);
    // Close when a nav link is tapped (mobile)
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 992) closeMenu();
      });
    });
    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    // Reset on resize back to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 992) closeMenu();
    });
  }

  /* -----------------------------------------------------------
     Sticky header shadow on scroll
     ----------------------------------------------------------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -----------------------------------------------------------
     Active navigation link based on current page
     ----------------------------------------------------------- */
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav__link").forEach(function (link) {
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* -----------------------------------------------------------
     Scroll reveal animations (IntersectionObserver)
     ----------------------------------------------------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* -----------------------------------------------------------
     FAQ accordion
     ----------------------------------------------------------- */
  document.querySelectorAll(".faq__item").forEach(function (item) {
    const q = item.querySelector(".faq__q");
    const a = item.querySelector(".faq__a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      const open = item.classList.contains("is-open");
      // close siblings
      const parent = item.closest(".faq");
      if (parent) {
        parent.querySelectorAll(".faq__item.is-open").forEach(function (it) {
          if (it !== item) {
            it.classList.remove("is-open");
            it.querySelector(".faq__q").setAttribute("aria-expanded", "false");
            it.querySelector(".faq__a").style.maxHeight = null;
          }
        });
      }
      if (open) {
        item.classList.remove("is-open");
        q.setAttribute("aria-expanded", "false");
        a.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        q.setAttribute("aria-expanded", "true");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* -----------------------------------------------------------
     Animated stat counters (count-up on scroll)
     Handles formats like 15K+, 98%, $250M+, 4.9/5, 24/7, 50.
     ----------------------------------------------------------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counters = document.querySelectorAll(
    ".hero__stat strong, .stat-block strong, .article-stat strong"
  );

  function runCount(el) {
    const raw = el.dataset.raw || el.textContent.trim();
    el.dataset.raw = raw;
    const m = raw.match(/^(\D*)([\d][\d.,]*)(.*)$/);
    if (!m) return;
    const prefix = m[1];
    const numStr = m[2].replace(/,/g, "");
    const suffix = m[3];
    const target = parseFloat(numStr);
    if (isNaN(target)) return;
    if (reduceMotion) { el.textContent = raw; return; }
    const decimals = (numStr.split(".")[1] || "").length;
    const duration = 1300;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = prefix + (decimals ? val.toFixed(decimals) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = raw;
    }
    requestAnimationFrame(frame);
  }

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const co = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCount(entry.target);
              co.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (el) { co.observe(el); });
    } else {
      counters.forEach(runCount);
    }
  }

  /* -----------------------------------------------------------
     Scroll-spy for legal table of contents (Privacy / SMS)
     ----------------------------------------------------------- */
  const tocLinks = Array.prototype.slice.call(
    document.querySelectorAll('.legal-toc a[href^="#"]')
  );
  if (tocLinks.length && "IntersectionObserver" in window) {
    const map = tocLinks
      .map(function (link) {
        const sec = document.getElementById(link.getAttribute("href").slice(1));
        return sec ? { link: link, sec: sec } : null;
      })
      .filter(Boolean);
    if (map.length) {
      const spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              tocLinks.forEach(function (l) { l.classList.remove("is-active"); });
              const hit = map.find(function (m) { return m.sec === entry.target; });
              if (hit) hit.link.classList.add("is-active");
            }
          });
        },
        { rootMargin: "-100px 0px -65% 0px", threshold: 0 }
      );
      map.forEach(function (m) { spy.observe(m.sec); });
    }
  }

  /* -----------------------------------------------------------
     Carousel (testimonials) — arrow navigation
     ----------------------------------------------------------- */
  document.querySelectorAll(".carousel").forEach(function (car) {
    const track = car.querySelector(".carousel__track");
    const prev = car.querySelector(".carousel__btn--prev");
    const next = car.querySelector(".carousel__btn--next");
    if (!track) return;

    function step() {
      const card = track.firstElementChild;
      if (!card) return track.clientWidth;
      const cs = getComputedStyle(track);
      const gap = parseFloat(cs.columnGap || cs.gap) || 0;
      return card.getBoundingClientRect().width + gap;
    }
    function updateButtons() {
      const maxScroll = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= maxScroll;
    }
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    track.addEventListener("scroll", function () { window.requestAnimationFrame(updateButtons); }, { passive: true });
    window.addEventListener("resize", updateButtons);
    updateButtons();
  });

  /* -----------------------------------------------------------
     Footer year
     ----------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
