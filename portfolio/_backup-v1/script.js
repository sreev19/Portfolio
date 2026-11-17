// ---------- Theme (light by default, remembers choice) ----------
const root = document.documentElement;
const saved = (() => { try { return localStorage.getItem("theme"); } catch { return null; } })();
root.setAttribute("data-theme", saved || "light");
document.getElementById("themeToggle").addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch {}
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Mobile menu ----------
const navLinks = document.getElementById("navLinks");
document.getElementById("menuBtn").addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

// ---------- Nav border + active link ----------
const nav = document.getElementById("nav");
const sections = [...document.querySelectorAll("section[id]")];
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 10);
  let current = "";
  sections.forEach(s => { if (y >= s.offsetTop - 140) current = s.id; });
  navLinks.querySelectorAll("a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Typing effect ----------
const phrases = [
  "AI automations with Claude & n8n",
  "prompts that actually work",
  "AI agents that save hours",
  "RAG chatbots on your own data",
  "machine learning models",
];
const typed = document.getElementById("typed");
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
if (!reduceMotion) setTimeout(tick, 2200);

// ---------- Project filters ----------
document.getElementById("filters").addEventListener("click", e => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b === btn));
  const f = btn.dataset.filter;
  document.querySelectorAll(".project").forEach(p => {
    p.classList.toggle("hidden", f !== "all" && !p.dataset.tags.split(" ").includes(f));
  });
});

// ---------- Gentle fade-in on scroll ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();
