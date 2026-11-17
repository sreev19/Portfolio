/* =====================================================================
   JARVIS — scripted portfolio assistant
   - answers only from jarvis-kb.js (no network, no AI model)
   - getReply() is the single "brain" function; swap it for an n8n
     webhook call later without touching the UI
   ===================================================================== */
(function () {
  "use strict";
  const KB = window.JARVIS_KB;
  if (!KB) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- text matching ---------------- */
  const norm = t => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

  function lev1(a, b) { // true if edit distance <= 1
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return edits + (a.length - i) + (b.length - j) <= 1;
  }

  // score how strongly a question matches a list of keys
  function score(text, tokens, keys, strict) {
    let s = 0;
    const used = new Set();                        // each word counts once per topic
    for (const raw of keys) {
      const k = norm(raw);
      if (!k) continue;
      if (k.includes(" ")) {                       // phrase
        if ((" " + text + " ").includes(" " + k + " ")) s += 3;
        continue;
      }
      for (const t of tokens) {                    // single word
        if (used.has(t)) continue;
        let hit = 0;
        if (t === k) hit = 1;
        else if (!strict && k.length >= 4 && t.startsWith(k) && t.length - k.length <= 3) hit = 1;
        else if (!strict && k.length >= 6 && t.length >= 6 && lev1(t, k)) hit = 0.8;
        if (hit) { s += hit; used.add(t); break; }
      }
    }
    return s;
  }

  let lastTopic = null;

  // the single function that decides what JARVIS says
  function getReply(question) {
    const text = norm(question);
    const tokens = text.split(" ").filter(Boolean);
    if (!tokens.length) return { text: KB.fallback, chips: KB.fallbackChips };

    // 1) privacy first
    for (const p of KB.private) {
      if (score(text, tokens, p.keys, true) > 0) { lastTopic = null; return { text: p.answer, chips: KB.fallbackChips }; }
    }

    // 2) best matching topic
    let best = null, bestScore = 0;
    for (const t of KB.topics) {
      const sc = score(text, tokens, t.keys, false) * (t.weight || 1);
      if (sc > bestScore) { best = t; bestScore = sc; }
    }

    // 3) "tell me more" with nothing else specific -> expand the last topic
    const wantsMore = score(text, tokens, KB.moreKeys, true) > 0;
    if (wantsMore && lastTopic && (!best || best.id === lastTopic.id || bestScore < 1)) {
      return { text: lastTopic.more || KB.noMore, chips: lastTopic.chips || KB.fallbackChips };
    }

    if (!best) return { text: KB.fallback, chips: KB.fallbackChips };

    // asking the same topic twice in a row -> give the deeper answer
    if (lastTopic && best.id === lastTopic.id && best.more) {
      return { text: best.more, chips: best.chips || KB.fallbackChips };
    }
    lastTopic = best;
    return { text: best.answer, chips: best.chips || [] };
  }

  /* ---------------- UI ---------------- */
  const reactor = '<svg viewBox="0 0 200 200" aria-hidden="true"><use href="#reactorB" /></svg>';
  const wrap = document.createElement("div");
  wrap.className = "jarvis";
  wrap.innerHTML = `
    <div class="jarvis-hint" id="jarvisHint" hidden>
      <span>Hi, I'm JARVIS. Want a quick briefing on my buddy?</span>
      <button type="button" class="jarvis-hint-x" aria-label="Dismiss">✕</button>
    </div>
    <button class="jarvis-launch" id="jarvisLaunch" type="button" aria-expanded="false" aria-controls="jarvisPanel" aria-label="Chat with JARVIS">
      ${reactor}<span class="jarvis-launch-ring" aria-hidden="true"></span>
    </button>
    <section class="jarvis-panel" id="jarvisPanel" role="dialog" aria-modal="false" aria-labelledby="jarvisTitle" hidden>
      <header class="jarvis-head">
        <span class="jarvis-head-icon">${reactor}</span>
        <div>
          <h2 id="jarvisTitle" class="mono">J.A.R.V.I.S.</h2>
          <p class="mono"><i></i>Online · Srivalli's assistant</p>
        </div>
        <button type="button" class="jarvis-close" aria-label="Close chat">✕</button>
      </header>
      <div class="jarvis-log" id="jarvisLog" role="log" aria-live="polite" aria-relevant="additions"></div>
      <div class="jarvis-chips" id="jarvisChips"></div>
      <form class="jarvis-form" id="jarvisForm" autocomplete="off">
        <label for="jarvisInput" class="sr-only">Ask JARVIS a question</label>
        <input id="jarvisInput" type="text" maxlength="200" placeholder="Ask about skills, projects, experience…" />
        <button type="submit" aria-label="Send"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 21 3l-8.5 18-2.2-7.3Z"/></svg></button>
      </form>
    </section>`;
  document.body.appendChild(wrap);

  const $ = s => wrap.querySelector(s);
  const launch = $("#jarvisLaunch"), panel = $("#jarvisPanel"), log = $("#jarvisLog");
  const chipsEl = $("#jarvisChips"), form = $("#jarvisForm"), input = $("#jarvisInput"), hint = $("#jarvisHint");
  let opened = false, busy = false, greeted = false;

  // render answer text: supports [label](url) links and \n line breaks; never injects HTML
  function renderRich(el, text) {
    const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    let last = 0, m;
    const add = str => str.split("\n").forEach((line, i) => {
      if (i) el.appendChild(document.createElement("br"));
      if (line) el.appendChild(document.createTextNode(line));
    });
    while ((m = re.exec(text))) {
      add(text.slice(last, m.index));
      const a = document.createElement("a");
      a.textContent = m[1];
      a.href = m[2];
      if (/^https?:/.test(m[2])) { a.target = "_blank"; a.rel = "noopener"; }
      el.appendChild(a);
      last = re.lastIndex;
    }
    add(text.slice(last));
  }

  const scrollDown = () => { log.scrollTop = log.scrollHeight; };

  function addUser(text) {
    const b = document.createElement("div");
    b.className = "jmsg jmsg-user";
    b.textContent = text;
    log.appendChild(b);
    scrollDown();
  }

  function setChips(list) {
    chipsEl.textContent = "";
    (list || []).forEach(c => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = c;
      btn.addEventListener("click", () => ask(c));
      chipsEl.appendChild(btn);
    });
  }

  function addBot(reply) {
    return new Promise(resolve => {
      const b = document.createElement("div");
      b.className = "jmsg jmsg-bot";
      const typing = document.createElement("span");
      typing.className = "jtyping";
      typing.setAttribute("aria-label", "JARVIS is typing");
      typing.innerHTML = "<i></i><i></i><i></i>";
      b.appendChild(typing);
      log.appendChild(b);
      scrollDown();
      const delay = reduceMotion ? 0 : Math.min(1100, 380 + reply.text.length * 4);
      setTimeout(() => {
        b.textContent = "";
        renderRich(b, reply.text);
        if (!reduceMotion) b.classList.add("jmsg-in");
        setChips(reply.chips);
        scrollDown();
        resolve();
      }, delay);
    });
  }

  async function ask(q) {
    q = (q || "").trim();
    if (!q || busy) return;
    busy = true;
    setChips([]);
    addUser(q);
    await addBot(getReply(q));
    busy = false;
  }

  function openPanel() {
    if (opened) return;
    opened = true;
    panel.hidden = false;
    hint.hidden = true;
    wrap.classList.add("open");
    launch.setAttribute("aria-expanded", "true");
    if (!greeted) { greeted = true; addBot({ text: KB.greeting, chips: KB.starterChips }); }
    setTimeout(() => input.focus({ preventScroll: true }), 60);
  }
  function closePanel() {
    if (!opened) return;
    opened = false;
    wrap.classList.remove("open");
    launch.setAttribute("aria-expanded", "false");
    setTimeout(() => { if (!opened) panel.hidden = true; }, reduceMotion ? 0 : 260);
    launch.focus({ preventScroll: true });
  }

  launch.addEventListener("click", () => (opened ? closePanel() : openPanel()));
  $(".jarvis-close").addEventListener("click", closePanel);
  form.addEventListener("submit", e => { e.preventDefault(); const v = input.value; input.value = ""; ask(v); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && opened) closePanel(); });

  // one gentle nudge per visit, after the intro has played
  let nudged = false;
  try { nudged = sessionStorage.getItem("jarvisNudged") === "1"; } catch (e) {}
  if (!nudged) {
    const showHint = () => {
      if (opened || document.documentElement.classList.contains("js-welcome") || document.documentElement.classList.contains("js-boot")) {
        setTimeout(showHint, 2000);
        return;
      }
      hint.hidden = false;
      try { sessionStorage.setItem("jarvisNudged", "1"); } catch (e) {}
      setTimeout(() => { hint.hidden = true; }, 9000);
    };
    setTimeout(showHint, 7000);
  }
  hint.addEventListener("click", e => {
    if (e.target.closest(".jarvis-hint-x")) { hint.hidden = true; return; }
    openPanel();
  });

  // expose for testing / future n8n swap
  window.JARVIS = { ask, getReply, open: openPanel, close: closePanel };
})();
