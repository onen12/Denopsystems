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
