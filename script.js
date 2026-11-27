const nav = document.querySelector(".nav");
const menuBtn = document.querySelector(".menu-btn");
menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("mobile-open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});
document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => nav.classList.remove("mobile-open")));

document.getElementById("year").textContent = new Date().getFullYear();

function chooseHotspot(packageName, price) {
  document.getElementById("service").value = "Hotspot Prepaid";
  document.getElementById("message").value = `I would like the ${packageName} hotspot package (${price}). Please send me the payment and connection instructions.`;
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  document.getElementById("name").focus();
}

function prefillFibre(packageName, price, speed) {
  document.getElementById("service").value = "Fibre Internet";
  document.getElementById("message").value = `I am interested in the ${packageName} fibre package (${price}, up to ${speed}). Please confirm availability and next steps.`;
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  document.getElementById("name").focus();
}

function prefillFibreAvailability() {
  document.getElementById("service").value = "Check Fibre Availability";
  document.getElementById("message").value = "Please check if Excom fibre is available at my location.";
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  document.getElementById("name").focus();
}

function prefillVoucher(text) {
  document.getElementById("service").value = "Hotspot Voucher";
  document.getElementById("message").value = text;
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  document.getElementById("name").focus();
}

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  // Primary WhatsApp for installations & inquiries
  const whatsappNumber = "256704682970";
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const location = document.getElementById("location").value.trim();
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value.trim();
  const text = `Hello Denop Systems,%0A%0AMy name is ${encodeURIComponent(name)}.%0APhone: ${encodeURIComponent(phone)}%0ALocation: ${encodeURIComponent(location || "Not provided")}%0AService: ${encodeURIComponent(service)}%0AMessage: ${encodeURIComponent(message || "I would like more information.")}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
});

// photos: use real photo images/<name>.jpg if present, else illustration fallback
document.querySelectorAll("img[data-n]").forEach(im => {
  im.onerror = () => { im.onerror = null; im.src = `images/${im.dataset.fb}.svg`; };
  im.src = `images/${im.dataset.n}.jpg`;
});
// scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll("[data-r]").forEach(el => io.observe(el));
// hero speed counter
const sp = document.querySelector("[data-count]");
if (sp && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const t = +sp.dataset.count; let n = 0;
  const id = setInterval(() => { n += Math.ceil((t - n) / 8); sp.textContent = n; if (n >= t) clearInterval(id); }, 45);
}

// rotating hero word
const words = ["just works.", "streams 4K.", "powers study.", "keeps up."], rot = document.getElementById("rot");
if (rot && !matchMedia("(prefers-reduced-motion: reduce)").matches) { let w = 0;
  setInterval(() => { rot.classList.add("out"); setTimeout(() => { w = (w + 1) % words.length; rot.textContent = words[w]; rot.classList.remove("out"); }, 450); }, 2800); }

// plan finder
const dev = document.getElementById("dev");
if (dev) {
  const plans = [["Basic", 30, "50,000 UGX / month", "Perfect for browsing, study and light streaming."], ["Chiva", 60, "75,000 UGX / month", "Great for 4K and busy households."], ["Challenger", 100, "130,000 UGX / month", "Whole-house power for work and gaming."]];
  let f = 1.5;
  const calc = () => {
    const need = +dev.value * f; const p = need <= 25 ? plans[0] : need <= 50 ? plans[1] : plans[2];
    document.getElementById("devOut").textContent = dev.value;
    document.getElementById("gPlan").textContent = p[0]; document.getElementById("gSpeed").textContent = p[1];
    document.getElementById("gNote").textContent = p[3]; document.getElementById("gBar").style.width = p[1] + "%";
    document.getElementById("gBtn").onclick = () => prefillFibre(p[0], p[2], p[1] + " Mbps");
  };
  dev.oninput = calc;
  document.querySelectorAll("#chips .chip").forEach(c => c.onclick = () => { document.querySelectorAll("#chips .chip").forEach(x => x.classList.remove("on")); c.classList.add("on"); f = +c.dataset.f; calc(); });
  calc();
}
