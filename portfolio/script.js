/* =====================================================================
   Portfolio — interactions + GSAP motion system
   - entrance timelines (ScrollTrigger) are kept separate from ambient loops
   - everything still works (static) if GSAP fails to load or motion is reduced
   ===================================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const animate = hasGSAP && !reduceMotion;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  if (animate) root.classList.add("has-gsap");


  /* ---------------- Mobile menu ---------------- */
  const navLinks = $("#navLinks");
  $("#menuBtn").addEventListener("click", () => navLinks.classList.toggle("open"));
  $$("a", navLinks).forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

  /* ---------------- Nav state + active link ---------------- */
  const nav = $("#nav");
  const sections = $$("section[id]");
  const links = $$("a", navLinks);
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 10);
    let current = "";
    sections.forEach(s => { if (y >= s.offsetTop - 160) current = s.id; });
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------------- Typing effect ---------------- */
  const phrases = [
    "AI automations with Claude & n8n",
    "prompts that actually work",
    "AI agents that save hours",
    "RAG chatbots on your own data",
    "machine learning models",
  ];
  const typed = $("#typed");
  let pi = 0, ci = phrases[0].length, deleting = true;
  function tick() {
    typed.textContent = phrases[pi].slice(0, ci);
    if (deleting) {
      ci--;
      if (ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; ci = 0; }
    } else {
      ci++;
      if (ci > phrases[pi].length) { deleting = true; setTimeout(tick, 1900); return; }
    }
    setTimeout(tick, deleting ? 30 : 65);
  }
  if (!reduceMotion) setTimeout(tick, 3400);

  /* ---------------- Card spotlight (cursor-follow glow) ---------------- */
  if (canHover) {
    $$(".spot").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--mx", "-999px");
        card.style.setProperty("--my", "-999px");
      });
    });
  }

  /* ---------------- Project filters ---------------- */
  $("#filters").addEventListener("click", e => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    $$(".filter").forEach(b => b.classList.toggle("active", b === btn));
    const f = btn.dataset.filter;
    const shown = [];
    $$(".project").forEach(p => {
      const on = f === "all" || p.dataset.tags.split(" ").includes(f);
      p.classList.toggle("hidden", !on);
      if (on) shown.push(p);
    });
    if (animate) {
      gsap.fromTo(shown, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .06, ease: "power3.out", overwrite: true });
      ScrollTrigger.refresh();
    }
  });

  $("#year").textContent = new Date().getFullYear();

  /* ---------------- Mascot: helmet on / off ---------------- */
  const mascot = $("#mascot");
  const hint = $("#mascotHint");
  const face = $(".faceplate");
  const idleHint = canHover ? "Hover to suit up" : "Tap to suit up";
  hint.textContent = idleHint;
  let suited = false;
  let helmetTl = null;

  function setSuited(on, instant) {
    if (on === suited && !instant) return;
    suited = on;
    mascot.classList.toggle("suited", on);
    mascot.setAttribute("aria-pressed", String(on));
    hint.textContent = on ? "Suit engaged" : idleHint;
    if (!animate) { root.classList.remove("js-boot"); return; } // CSS handles the no-GSAP case
    if (helmetTl) helmetTl.kill();
    helmetTl = gsap.timeline({ defaults: { overwrite: "auto" } });
    if (on) {
      // mask drops down onto the face
      helmetTl.to(face, { yPercent: 0, rotationX: 0, scale: 1, opacity: 1, duration: instant ? 0 : .55, ease: "back.out(1.5)" });
    } else {
      // mask flips up and away
      helmetTl.to(face, { yPercent: -85, rotationX: 60, scale: .9, opacity: 0, duration: instant ? 0 : .5, ease: "power3.in" });
    }
  }

  if (canHover) {
    mascot.addEventListener("pointerenter", () => setSuited(true));
    mascot.addEventListener("pointerleave", () => setSuited(false));
    mascot.addEventListener("focus", () => setSuited(true));
    mascot.addEventListener("blur", () => setSuited(false));
  } else {
    mascot.addEventListener("click", () => setSuited(!suited));
  }
  // keyboard users on hover devices can also toggle
  mascot.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSuited(!suited); }
  });

  /* ---------------- Suit assembly scroll indicator ---------------- */
  (function suitAssembly() {
    const hud = $("#suitHud");
    if (!hud) return;
    const rail = $("#rail"), suit3d = $("#suit3d");
    const pieces = $$(".suit-piece", hud).map(el => ({ el, sec: document.getElementById(el.dataset.section), p: -1 }));
    const dots = $$(".rail-dot", hud).map(el => ({ el, sec: document.getElementById(el.dataset.target) }));
    const pctEl = $("#suitPct"), secEl = $("#suitSec");
    const names = { about: "About", services: "What I do", skills: "Skills", projects: "Projects", research: "Research", experience: "Experience", contact: "Contact" };
    let tilt = 0, lastY = window.scrollY, running = false, lastLabel = "";

    const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const clamp01 = v => Math.min(1, Math.max(0, v));

    function placeDots() {
      const h = document.documentElement.scrollHeight;
      dots.forEach(d => { if (d.sec) d.el.style.top = (d.sec.offsetTop / h * 100).toFixed(2) + "%"; });
    }

    function update() {
      const y = window.scrollY, vh = window.innerHeight, max = maxScroll();
      const atBottom = y >= max - 4;
      const prog = clamp01(y / max);
      rail.style.setProperty("--prog", prog.toFixed(4));
      rail.setAttribute("aria-valuenow", Math.round(prog * 100));

      // each piece locks on while its section travels from 85% to 35% of the viewport
      let sum = 0;
      pieces.forEach(pc => {
        if (!pc.sec) return;
        const top = pc.sec.getBoundingClientRect().top;
        let p = atBottom ? 1 : clamp01((vh * .85 - top) / (vh * .5));
        if (reduceMotion) p = p > .5 ? 1 : 0;
        if (Math.abs(p - pc.p) > .001) { pc.el.style.setProperty("--p", p.toFixed(3)); pc.p = p; }
        sum += p;
      });
      const total = Math.round(sum / pieces.length * 100);
      pctEl.textContent = total + "%";
      hud.classList.toggle("complete", total >= 100);
      hud.classList.toggle("awake", y > vh * .35);

      // current section label + active dots
      let current = "";
      dots.forEach(d => {
        const on = !!d.sec && d.sec.getBoundingClientRect().top < vh * .5;
        d.el.classList.toggle("on", on);
        if (on) current = d.sec.id;
      });
      const label = total >= 100 ? "Suit online" : current ? names[current] : "Standby";
      if (label !== lastLabel) { secEl.textContent = label; lastLabel = label; }

      // 3D tilt from scroll speed, easing back to rest
      if (!reduceMotion) {
        const v = y - lastY;
        tilt += (Math.max(-28, Math.min(28, v * .9)) - tilt) * .12;
        suit3d.style.setProperty("--tilt", tilt.toFixed(2) + "deg");
      }
      lastY = y;
      if (!reduceMotion && Math.abs(tilt) > .05) requestAnimationFrame(update);
      else running = false;
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(update); } }

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", () => { placeDots(); kick(); });
    window.addEventListener("load", () => { placeDots(); kick(); });
    placeDots(); kick();

    // rail: click / drag to scroll, dots jump to sections, keyboard support
    const toRatio = e => { const r = rail.getBoundingClientRect(); return clamp01((e.clientY - r.top) / r.height); };
    let dragging = false;
    rail.addEventListener("pointerdown", e => {
      if (e.target.closest(".rail-dot")) return;
      dragging = true; rail.classList.add("dragging"); rail.setPointerCapture(e.pointerId);
      window.scrollTo({ top: toRatio(e) * maxScroll(), behavior: "instant" });
    });
    rail.addEventListener("pointermove", e => {
      if (dragging) window.scrollTo({ top: toRatio(e) * maxScroll(), behavior: "instant" });
    });
    const stopDrag = () => { dragging = false; rail.classList.remove("dragging"); };
    rail.addEventListener("pointerup", stopDrag);
    rail.addEventListener("pointercancel", stopDrag);
    dots.forEach(d => d.el.addEventListener("click", () => {
      if (d.sec) d.sec.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }));
    rail.addEventListener("keydown", e => {
      if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        window.scrollTo({ top: e.key === "Home" ? 0 : maxScroll() });
        return;
      }
      const step = { ArrowDown: .06, ArrowUp: -.06, PageDown: .2, PageUp: -.2 }[e.key];
      if (step) { e.preventDefault(); window.scrollBy({ top: step * maxScroll() }); }
    });
    $("#suitFig").addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
  })();

  /* ---------------- Welcome note ---------------- */
  const welcome = $("#welcome");
  let afterWelcome = null;
  function closeWelcome() {
    if (!root.classList.contains("js-welcome")) return;
    try { sessionStorage.setItem("welcomed", "1"); } catch (e) {}
    const done = () => { root.classList.remove("js-welcome"); if (afterWelcome) afterWelcome(); };
    if (animate) {
      gsap.to(".welcome-card", { y: 30, scale: .96, opacity: 0, duration: .45, ease: "power3.in" });
      gsap.to(welcome, { opacity: 0, duration: .55, delay: .15, ease: "power2.out", onComplete: done });
    } else {
      done();
    }
  }
  $("#welcomeEnter").addEventListener("click", closeWelcome);
  $("#welcomeClose").addEventListener("click", closeWelcome);
  welcome.addEventListener("click", e => { if (e.target === welcome) closeWelcome(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeWelcome(); });

  /* ---------------- Stop here without GSAP / with reduced motion ---------------- */
  if (!animate) { root.classList.remove("js-boot"); return; }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out" });

  /* =====================================================================
     1. WELCOME + HERO INTRO
     ===================================================================== */
  const showWelcome = root.classList.contains("js-welcome");
  const intro = gsap.timeline({ paused: true });

  // initial states (set by JS so the page is fully visible without it)
  gsap.set(face, { yPercent: 0, rotationX: 0, scale: 1, opacity: 1 });
  suited = true; mascot.classList.add("suited"); mascot.setAttribute("aria-pressed", "true");

  intro
    .from(".hud-ring", { y: -260, opacity: 0, duration: 1.6, ease: "elastic.out(1, .6)", stagger: .15 }, 0)
    .from(".badge", { x: -30, opacity: 0, clipPath: "inset(0 100% 0 0)", duration: .7 }, .1)
    .from(".hero-hi", { x: -20, opacity: 0, duration: .5 }, .25)
    .from(".hero-title .line > span", { yPercent: 110, duration: 1.05, ease: "power4.out", stagger: .12 }, .3)
    .from(".hero-sub, .hero-text, .hero-cta, .hero-socials", { y: 26, opacity: 0, duration: .8, stagger: .09 }, .65)
    // mascot flies in from above, helmet on
    .from(".mascot-wrap", { y: -340, scale: .82, opacity: 0, duration: 1.3, ease: "power4.out" }, .35)
    .from(".thruster", { scaleX: 2.2, scaleY: 3, opacity: 1, duration: 1.4, ease: "power2.out" }, .45)
    .from(".reactor-ring", { scale: .6, opacity: 0, duration: 1.2, stagger: .1, ease: "expo.out" }, .7)
    .from(".hud-tag", { x: i => (i === 1 ? 30 : -30), opacity: 0, duration: .6, stagger: .12 }, 1.2)
    .from([".mascot-hint", ".scroll-cue"], { opacity: 0, duration: .6 }, 1.5)
    // eye flicker, then the helmet opens to reveal the face
    .to(face, { filter: "brightness(1.5) drop-shadow(0 0 14px rgba(127,231,255,.9))", duration: .08, repeat: 3, yoyo: true }, 1.55)
    .add(() => setSuited(false), 2.0);

  function playIntro() { intro.play(0); }

  const showBoot = root.classList.contains("js-boot");

  function runBoot(next) {
    const pct = { v: 0 };
    gsap.timeline({ onComplete: () => { root.classList.remove("js-boot"); next(); } })
      .from(".boot-reactor", { scale: .4, rotation: -120, opacity: 0, duration: 1, ease: "expo.out" }, 0)
      .to("#bootBar", { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, .1)
      .to(pct, { v: 100, duration: 1.3, ease: "power2.inOut", onUpdate: () => { $("#bootPct").textContent = Math.round(pct.v); } }, .1)
      .to(".boot-reactor", { rotation: 120, duration: 1.3, ease: "power2.inOut" }, .3)
      .add(() => { $("#bootLabel").textContent = "Systems online"; }, 1.4)
      .to(".boot-reactor", { scale: 1.12, duration: .2, yoyo: true, repeat: 1, ease: "power2.inOut" }, 1.4)
      .to("#boot", { clipPath: "circle(0% at 50% 50%)", duration: .7, ease: "expo.inOut" }, 1.75);
    gsap.set("#boot", { clipPath: "circle(150% at 50% 50%)" });
  }

  function showWelcomeNote(fadeBackdrop) {
    afterWelcome = playIntro;
    const tl = gsap.timeline();
    if (fadeBackdrop) tl.from(welcome, { opacity: 0, duration: .5, ease: "power2.out" });
    tl
      .from(".welcome-card", { y: 50, scale: .95, opacity: 0, duration: .9, ease: "expo.out" }, .1)
      .from(".welcome-art img", { scale: 1.12, opacity: 0, duration: 1.1, ease: "power3.out" }, .3)
      .from(".welcome-copy > *", { y: 22, opacity: 0, duration: .6, stagger: .08 }, .4);
  }

  // order: boot -> welcome note -> hero intro
  if (showWelcome) {
    gsap.set(".welcome-card", { opacity: 0 });
    const start = () => { gsap.set(".welcome-card", { clearProps: "opacity" }); showWelcomeNote(!showBoot); };
    showBoot ? runBoot(start) : start();
  } else if (showBoot) {
    runBoot(playIntro);
  } else {
    playIntro();
  }

  /* =====================================================================
     2. HERO AMBIENT LOOPS (separate from the entrance)
     ===================================================================== */
  gsap.to(".ring-outer", { rotation: 360, duration: 60, ease: "none", repeat: -1 });
  gsap.to(".ring-inner", { rotation: -360, duration: 28, ease: "none", repeat: -1 });
  gsap.to(".hud-ring-l", { rotation: 360, duration: 90, ease: "none", repeat: -1 });
  gsap.to(".hud-ring-r", { rotation: -360, duration: 110, ease: "none", repeat: -1 });

  // hover-flight: gentle bob + tiny tilt
  gsap.to(mascot, { y: -12, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });
  gsap.to(mascot, { rotation: 1.5, duration: 3.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.2, transformOrigin: "50% 0%" });
  gsap.to(".thruster", { scaleX: .82, opacity: .35, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });

  // breathing glow on the frame (one element only, cheap enough)
  gsap.fromTo("#frame",
    { boxShadow: "0 0 0 1px rgba(227,178,90,.45), 0 0 30px -8px rgba(224,40,63,.45), 0 30px 80px -30px rgba(0,0,0,.9)" },
    { boxShadow: "0 0 0 1px rgba(227,178,90,.7), 0 0 60px -4px rgba(224,40,63,.7), 0 30px 80px -30px rgba(0,0,0,.9)",
      duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

  gsap.utils.toArray(".hud-tag").forEach((t, i) => {
    gsap.to(t, { y: i % 2 ? 6 : -6, duration: 2.8 + i * .4, ease: "sine.inOut", yoyo: true, repeat: -1 });
  });

  // mouse parallax (desktop only)
  if (canHover) {
    const hero = $("#hero");
    const mx = gsap.quickTo(".hero-visual", "x", { duration: .9, ease: "power3.out" });
    const my = gsap.quickTo(".hero-visual", "y", { duration: .9, ease: "power3.out" });
    hero.addEventListener("pointermove", e => {
      const nx = e.clientX / window.innerWidth - .5;
      const ny = e.clientY / window.innerHeight - .5;
      mx(nx * 22); my(ny * 16);
    });
    hero.addEventListener("pointerleave", () => { mx(0); my(0); });
  }

  // scroll-out parallax on the hero
  gsap.to(".hero-left", { yPercent: -6, ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".mascot-wrap", { yPercent: -22, ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });

  /* =====================================================================
     3. SECTION HEADERS — kicker slide + clip reveal + HUD scan sweep
     ===================================================================== */
  $$(".section").forEach(sec => {
    const kicker = $(".kicker", sec);
    const title = $(".section-title, .contact-title", sec);
    if (!title) return;
    const scanEl = document.createElement("span");
    scanEl.className = "title-scan";
    if (title.classList.contains("section-title")) title.appendChild(scanEl);

    const tl = gsap.timeline({ scrollTrigger: { trigger: title, start: "top 85%", toggleActions: "play none none none" } });
    if (kicker) tl.from(kicker, { x: -30, opacity: 0, clipPath: "inset(0 100% 0 0)", duration: .7 }, 0);
    const lines = $$(".line > span", title);
    if (lines.length) {
      tl.from(lines, { yPercent: 110, duration: 1, ease: "power4.out", stagger: .1 }, .1);
      tl.fromTo(scanEl, { left: "0%", opacity: 1 }, { left: "100%", opacity: 0, duration: .9, ease: "power2.inOut" }, .15);
    } else {
      tl.from(title, { y: 50, opacity: 0, clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power4.out" }, .1);
    }
  });

  /* =====================================================================
     4. ABOUT — 3D paragraph reveal, pills, parallax panel
     ===================================================================== */
  gsap.timeline({ scrollTrigger: { trigger: "#about", start: "top 70%", toggleActions: "play none none none" } })
    .from("#about .para", { y: 40, opacity: 0, rotationX: -45, duration: 1, stagger: .15, ease: "back.out(1.4)" }, .35)
    .from("#about .tech-pills span", { scale: .5, opacity: 0, y: 20, duration: .6, stagger: .07, ease: "back.out(1.7)" }, .8)
    .from(".armor-panel", { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "expo.inOut" }, .2)
    .from(".education", { y: 60, opacity: 0, duration: .9 }, .8)
    .add(() => {
      $$("#about .tech-pills span").forEach(p => {
        gsap.to(p, { y: gsap.utils.random(-5, -2), duration: gsap.utils.random(1.8, 2.8), ease: "sine.inOut", yoyo: true, repeat: -1, delay: gsap.utils.random(0, 1) });
      });
    });

  gsap.fromTo("#armorImg", { yPercent: -8 }, { yPercent: 8, ease: "none",
    scrollTrigger: { trigger: ".armor-panel", start: "top bottom", end: "bottom top", scrub: true } });

  /* =====================================================================
     5. CARD GROUPS — staggered rise
     ===================================================================== */
  $$(".stagger").forEach(group => {
    const items = group.classList.contains("research")
      ? [...group.children]
      : group.classList.contains("timeline") ? $$(".tl-item", group) : [...group.children];
    gsap.from(items, {
      y: 50, opacity: 0, duration: .9, stagger: .09, ease: "power3.out",
      scrollTrigger: { trigger: group, start: "top 82%", toggleActions: "play none none none" },
    });
  });

  // timeline rail draws as you scroll
  gsap.from(".tl-line", { scaleY: 0, ease: "none",
    scrollTrigger: { trigger: ".timeline", start: "top 75%", end: "bottom 60%", scrub: true } });

  // count-up for research numbers (keeps the original text)
  $$(".finding-num").forEach(el => {
    const m = el.textContent.match(/^([+]?)([\d,.]+)(.*)$/);
    if (!m) return;
    const [, pre, num, rest] = m;
    const target = parseFloat(num.replace(/,/g, ""));
    const decimals = (num.split(".")[1] || "").length;
    const useComma = num.includes(",");
    const o = { v: 0 };
    gsap.to(o, {
      v: target, duration: 1.6, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      onUpdate: () => {
        let s = o.v.toFixed(decimals);
        if (useComma) s = Number(s).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        el.textContent = pre + s + rest;
      },
    });
  });

  /* =====================================================================
     6. MARQUEE — subtle skew from scroll velocity
     ===================================================================== */
  const skewTo = gsap.quickTo(".marquee-track", "skewX", { duration: .5, ease: "power3.out" });
  ScrollTrigger.create({
    onUpdate: self => skewTo(gsap.utils.clamp(-8, 8, self.getVelocity() / -250)),
  });
  ScrollTrigger.addEventListener("scrollEnd", () => skewTo(0));

  /* =====================================================================
     7. CONTACT — content reveal
     ===================================================================== */
  gsap.timeline({ scrollTrigger: { trigger: "#contact", start: "top 75%", toggleActions: "play none none none" } })
    .from("#contact .contact-text, #contact .btn, #contact .contact-links", { y: 24, opacity: 0, duration: .7, stagger: .1 }, .2)
    ;

  /* =====================================================================
     8. DOODLES — each enters its own way, then idles
     ===================================================================== */
  gsap.to(".contact-reactor", { rotation: 360, duration: 120, ease: "none", repeat: -1 });

  const doodle = (sel, from, idle) => {
    const el = $(sel); if (!el) return;
    gsap.from(el, Object.assign({ opacity: 0, duration: 1.1, ease: "power4.out",
      scrollTrigger: { trigger: el.parentElement, start: "top 75%", toggleActions: "play none none none" },
      onComplete: () => idle && gsap.to(el, Object.assign({ ease: "sine.inOut", yoyo: true, repeat: -1 }, idle)) }, from));
  };
  doodle(".doodle-repulsor", { x: 120, y: -60, rotation: 20 }, { y: -12, rotation: -3, duration: 2.3 });
  doodle(".doodle-shields", { y: -120, scale: .6 , ease: "back.out(1.6)" }, { y: -10, duration: 2.6 });
  doodle(".doodle-landing", { y: -260, rotation: -10, ease: "bounce.out", duration: 1.2 }, null);
  doodle(".doodle-holo", { y: 40, opacity: 0, duration: 1.2, ease: "power3.out" }, { y: -8, duration: 2.8 });
  if (document.querySelector(".doodle-holo .holo-core") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    gsap.to(".doodle-holo .holo-core", { scaleX: -1, transformOrigin: "50% 50%", duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
  doodle(".doodle-neon", { opacity: 0, scale: .9, duration: 1.6, ease: "power2.out" }, { opacity: .55, duration: 1.8 });

  // fonts can shift layout after load — re-measure triggers
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
