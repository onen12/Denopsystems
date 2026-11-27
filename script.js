"use strict";
/* ---- Settings: edit these ---- */
const WHATSAPP = "256704682970";
const SUPPORT = { open: 8, close: 20 }; // support hours, Kampala time (24h). Adjust to your real hours.
const TZ = "Africa/Kampala";

/* ---- Icons ---- */
const P = {
  fibre: '<path d="M4 14c4 0 4-8 8-8s4 8 8 8"/><circle cx="4" cy="14" r="1.5"/><circle cx="20" cy="14" r="1.5"/><path d="M4 19h16"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10.5 10.5 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/>',
  tools: '<path d="M14.5 6.5a4 4 0 0 0 5 5L10 21l-3-3 9.5-9.5zM7 3l2 2-2 2-2-2z"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="2"/><rect x="17" y="14" width="4" height="6" rx="2"/><path d="M19 20a4 4 0 0 1-4 2h-2"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16 15h2"/>',
  building: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chat: '<path d="M21 12a9 9 0 1 1-3.6-7.2L21 3l-1.2 3.7A9 9 0 0 1 21 12z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
};
document.querySelectorAll("i[data-i]").forEach(el => {
  el.classList.add("i");
  el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[el.dataset.i] || ""}</svg>`;
});

/* ---- Nav ---- */
const nav = document.querySelector(".nav"), menuBtn = document.querySelector(".menu-btn");
menuBtn?.addEventListener("click", () => { const o = nav.classList.toggle("mobile-open"); menuBtn.setAttribute("aria-expanded", o); });
document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => nav.classList.remove("mobile-open")));
document.getElementById("year").textContent = new Date().getFullYear();

/* ---- Live Kampala time + support status ---- */
const pad = n => String(n).padStart(2, "0"), hr = h => pad(h) + ":00";
document.getElementById("hoursTxt").textContent = `Daily, ${hr(SUPPORT.open)} to ${hr(SUPPORT.close)} (Kampala time)`;
function tick() {
  const now = new Date();
  const t = now.toLocaleTimeString("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false });
  const d = now.toLocaleDateString("en-GB", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" });
  const h = +now.toLocaleTimeString("en-GB", { timeZone: TZ, hour: "2-digit", hour12: false });
  const on = h >= SUPPORT.open && h < SUPPORT.close;
  document.getElementById("siteClock").textContent = `${d} · ${t} Kampala`;
  document.getElementById("sstate").textContent = on ? "Support online" : `Support opens ${hr(SUPPORT.open)}`;
  document.getElementById("sdot").classList.toggle("off", !on);
}
tick(); setInterval(tick, 15000);

/* ---- Contact form helpers ---- */
const $ = id => document.getElementById(id);
function toForm(service, message) {
  $("service").value = service; $("message").value = message;
  $("contact").scrollIntoView({ behavior: "smooth" }); setTimeout(() => $("name").focus({ preventScroll: true }), 600);
}
const chooseHotspot = (n, p) => toForm("Hotspot Prepaid", `I would like the ${n} hotspot package (${p}). Please send me the payment and connection instructions.`);
const prefillFibre = (n, p, s) => toForm("Fibre Internet", `I am interested in the ${n} fibre package (${p}, up to ${s}). Please confirm availability and next steps.`);
const prefillFibreAvailability = () => toForm("Check Fibre Availability", "Please check if Excom fibre is available at my location.");
const prefillVoucher = t => toForm("Hotspot Voucher", t);
$("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const text = `Hello Denop Systems,\n\nMy name is ${$("name").value.trim()}.\nPhone: ${$("phone").value.trim()}\nLocation: ${$("location").value.trim() || "Not provided"}\nService: ${$("service").value}\nMessage: ${$("message").value.trim() || "-"}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

/* ---- Motion (respects reduced-motion) ---- */
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll("[data-r]").forEach(el => io.observe(el));
const arc = $("arc"), num = $("gaugeNum"), cnt = document.querySelector("[data-count]");
if (arc) {
  if (calm) { arc.style.strokeDashoffset = 0; num.textContent = 100; }
  else { setTimeout(() => arc.style.strokeDashoffset = 0, 300); let n = 0; const id = setInterval(() => { n += 2; num.textContent = n; if (n >= 100) clearInterval(id); }, 34); }
}
const words = ["just works.", "streams 4K.", "powers study.", "keeps up."], rot = $("rot");
if (rot && !calm) { let w = 0; setInterval(() => { rot.classList.add("out"); setTimeout(() => { w = (w + 1) % words.length; rot.textContent = words[w]; rot.classList.remove("out"); }, 450); }, 3000); }

/* ---- Plan finder ---- */
const dev = $("dev");
if (dev) {
  const plans = [["Basic", 30, "50,000 UGX / month", "Perfect for browsing, study and light streaming."], ["Chiva", 60, "75,000 UGX / month", "Great for 4K and busy households."], ["Challenger", 100, "130,000 UGX / month", "Whole-house power for work and gaming."]];
  let f = 1.5;
  const calc = () => {
    const need = +dev.value * f, p = need <= 25 ? plans[0] : need <= 50 ? plans[1] : plans[2];
    $("devOut").textContent = dev.value; $("gPlan").textContent = p[0]; $("gSpeed").textContent = p[1]; $("gNote").textContent = p[3]; $("gBar").style.width = p[1] + "%";
    $("gBtn").onclick = () => prefillFibre(p[0], p[2], p[1] + " Mbps");
  };
  dev.addEventListener("input", calc);
  document.querySelectorAll("#chips .chip").forEach(c => c.addEventListener("click", () => { document.querySelectorAll("#chips .chip").forEach(x => x.classList.remove("on")); c.classList.add("on"); f = +c.dataset.f; calc(); }));
  calc();
}

/* ---- "Our work": shown only for photos you add to /images (pole.jpg, splice.jpg, home.jpg, hotspot.jpg) ---- */
const work = $("work");
if (work) {
  const figs = [...work.querySelectorAll("figure")]; let loaded = 0, done = 0;
  figs.forEach(fg => { const im = fg.querySelector("img"); im.onload = () => { loaded++; fin(); }; im.onerror = () => { fg.remove(); fin(); }; im.src = `images/${im.dataset.n}.jpg`; });
  function fin() { if (++done === figs.length && loaded) { work.hidden = false; work.querySelectorAll("figure").forEach(f => f.setAttribute("data-r", "")); } }
}
