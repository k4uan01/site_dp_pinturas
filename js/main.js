const WHATSAPP = "5548996228018";

const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav a");
const sections = [...document.querySelectorAll("section[id]")];

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);

  const current = [...sections].reverse().find((section) => window.scrollY + 120 >= section.offsetTop);
  if (current) {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
    });
  }
});

toggle?.addEventListener("click", () => {
  nav?.classList.toggle("is-open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => nav?.classList.remove("is-open"));
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${(index % 6) * 70}ms`;
  observer.observe(el);
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    const open = item.classList.contains("is-open");
    document.querySelectorAll(".faq-item").forEach((el) => el.classList.remove("is-open"));
    if (!open) item.classList.add("is-open");
  });
});

const ba = document.querySelector(".ba");
if (ba) {
  const wrap = ba.querySelector(".ba__before-wrap");
  const handle = ba.querySelector(".ba__handle");
  let dragging = false;

  const setPos = (clientX) => {
    const rect = ba.getBoundingClientRect();
    const percent = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 4), 96);
    wrap.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    handle.style.left = `${percent}%`;
  };

  const start = (event) => {
    dragging = true;
    ba.classList.add("is-dragging");
    setPos(event.touches ? event.touches[0].clientX : event.clientX);
  };

  const move = (event) => {
    if (!dragging) return;
    setPos(event.touches ? event.touches[0].clientX : event.clientX);
  };

  const end = () => {
    dragging = false;
    ba.classList.remove("is-dragging");
  };

  ba.addEventListener("mousedown", start);
  ba.addEventListener("touchstart", start, { passive: true });
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, { passive: true });
  window.addEventListener("mouseup", end);
  window.addEventListener("touchend", end);
}

const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox?.querySelector("img");

document.querySelectorAll("[data-lightbox]").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = item.getAttribute("data-lightbox") || item.querySelector("img")?.src;
    lightbox.classList.add("is-open");
  });
});

lightbox?.querySelector("button")?.addEventListener("click", () => {
  lightbox.classList.remove("is-open");
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.classList.remove("is-open");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") lightbox?.classList.remove("is-open");
});

window.openWhatsApp = (message) => {
  const text = encodeURIComponent(message || "Olá! Vim pelo site da DP Pinturas e gostaria de solicitar um orçamento.");
  window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank");
};

if (window.lucide) {
  window.lucide.createIcons();
}
