/* =====================================================
   CONFIG: edit your social links here.
   Replace each url with your real profile link.
   Links that still contain "YOUR-" are treated as
   placeholders and show a message instead of opening.
   ===================================================== */
const CONFIG = {
  socials: [
    { name: "GitHub",    label: "Code and projects", url: "https://github.com/YOUR-USERNAME",
      icon: '<path d="M9 19c-4 1.500-4-2-6-2m12 4v-3.500a3 3 0 0 0-.8-2.300c2.800-.3 5.800-1.400 5.800-6.200a4.800 4.800 0 0 0-1.300-3.300 4.500 4.500 0 0 0-.1-3.300s-1.100-.3-3.500 1.300a12 12 0 0 0-6.200 0C6.500 2.200 5.400 2.500 5.400 2.500a4.500 4.500 0 0 0-.1 3.300A4.800 4.800 0 0 0 4 9.100c0 4.800 3 5.900 5.800 6.200A3 3 0 0 0 9 17.500V21"/>' },
    { name: "Discord",   label: "Chat with me", url: "https://discord.com/users/YOUR-USER-ID",
      icon: '<path d="M8 8c2.500-1 5.500-1 8 0 2 3 3 6 3 9-1.500 1-3 1.500-4 1.500l-1-1.500c-1 .3-3 .3-4 0L9 18.500C8 18.500 6.500 18 5 17c0-3 1-6 3-9z"/><circle cx="9.500" cy="12.500" r=".8"/><circle cx="14.500" cy="12.500" r=".8"/>' },
    { name: "YouTube",   label: "Videos", url: "https://www.youtube.com/@YOUR-CHANNEL",
      icon: '<rect x="2.500" y="5.500" width="19" height="13" rx="4"/><path d="m10 9.500 5 2.500-5 2.500z"/>' },
    { name: "Minecraft", label: "Minecraft profile", url: "https://YOUR-MINECRAFT-PROFILE-LINK",
      icon: '<path d="M12 2.500 3.500 7v10l8.500 4.500 8.500-4.500V7zM3.500 7 12 11.500 20.500 7M12 11.500v10"/>' }
  ]
};

/* ===== Helpers ===== */
const $ = (s, el = document) => el.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Footer year */
$("#year").textContent = new Date().getFullYear();

/* Toast */
const toast = $("#toast");
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* Social links built from CONFIG */
const socials = $("#socials");
CONFIG.socials.forEach(s => {
  const a = document.createElement("a");
  const isPlaceholder = s.url.includes("YOUR-");
  a.className = "card glass social" + (isPlaceholder ? " is-placeholder" : "");
  a.href = s.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + s.icon + '</svg><span><b>' + s.name + '</b><small>' + s.label + '</small></span>';
  if (isPlaceholder) {
    a.addEventListener("click", e => {
      e.preventDefault();
      showToast(s.name + " link is a placeholder. Edit CONFIG in script.js.");
    });
  }
  socials.appendChild(a);
});

/* Navbar: scrolled style, back-to-top, active link */
const nav = $("#nav"), toTop = $("#top");
const links = [...document.querySelectorAll(".menu a")];
const secs = links.map(l => $(l.getAttribute("href")));
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 20);
  toTop.classList.toggle("show", y > 600);
  let cur = 0;
  secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = i; });
  links.forEach((l, i) => l.classList.toggle("active", i === cur && y > 40));
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

/* Mobile menu */
const burger = $("#burger"), menu = $("#menu");
function setMenu(open) {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", e => { if (e.target.tagName === "A") setMenu(false); });
addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* Scroll reveal */
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  items.forEach((el, i) => { el.style.transitionDelay = (i % 5) * 70 + "ms"; io.observe(el); });
} else {
  items.forEach(el => el.classList.add("in"));
}

/* Background particles (skipped for reduced motion) */
const cv = $("#bg"), ctx = cv.getContext("2d");
let W, H, pts = [];
function size() {
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  pts = Array.from({ length: Math.min(70, Math.floor(W / 20)) }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.4 + 0.4
  }));
}
function draw() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.fillStyle = "rgba(255,79,163,.55)";
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    for (let j = i + 1; j < pts.length; j++) {
      const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 120) {
        ctx.strokeStyle = "rgba(168,85,247," + (0.16 * (1 - d / 120)) + ")";
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }
  });
  if (!document.hidden) requestAnimationFrame(draw);
}
size();
addEventListener("resize", size);
if (!reduce) {
  draw();
  document.addEventListener("visibilitychange", () => { if (!document.hidden) draw(); });
}

/* Custom cursor: desktop with mouse only, no reduced motion */
const cur = $("#cursor");
if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
  addEventListener("mousemove", e => {
    cur.style.transform = "translate(" + (e.clientX - 14) + "px," + (e.clientY - 14) + "px)";
    cur.classList.add("on");
  }, { passive: true });
  document.addEventListener("mouseleave", () => cur.classList.remove("on"));
  document.querySelectorAll("a,button").forEach(el => {
    el.addEventListener("mouseenter", () => cur.classList.add("big"));
    el.addEventListener("mouseleave", () => cur.classList.remove("big"));
  });
}
