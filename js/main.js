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

const galleryWrap = document.querySelector(".gallery-wrap");
const gallery = document.querySelector(".gallery");
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox?.querySelector("img");

const openLightbox = (src, alt = "Projeto em destaque") => {
  if (!lightbox || !lightboxImg || !src) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add("is-open");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightbox?.classList.remove("is-open");
  document.body.style.overflow = "";
};

if (gallery && galleryWrap) {
  const prevBtn = document.querySelector("[data-gallery-prev]");
  const nextBtn = document.querySelector("[data-gallery-next]");
  const moreBtn = document.querySelector("[data-gallery-more]");
  let isDown = false;
  let dragged = false;
  let startX = 0;
  let startScroll = 0;

  const pageSize = () => Math.max(gallery.clientWidth * 0.7, 220);

  const maxScroll = () => gallery.scrollWidth - gallery.clientWidth;

  const updateGalleryUi = () => {
    const max = maxScroll();
    const atStart = gallery.scrollLeft <= 8;
    const atEnd = gallery.scrollLeft >= max - 8;
    prevBtn && (prevBtn.disabled = atStart);
    nextBtn && (nextBtn.disabled = atEnd && max > 8);
    galleryWrap.classList.toggle("is-end", atEnd || max <= 8);
    galleryWrap.classList.toggle("is-start", atStart);
  };

  const scrollByPage = (direction) => {
    gallery.scrollBy({ left: direction * pageSize(), behavior: "smooth" });
  };

  gallery.addEventListener("dragstart", (event) => event.preventDefault());

  gallery.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    isDown = true;
    dragged = false;
    startX = event.clientX;
    startScroll = gallery.scrollLeft;
  });

  gallery.addEventListener("pointermove", (event) => {
    if (!isDown) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) <= 6) return;
    if (!dragged) {
      dragged = true;
      gallery.classList.add("is-dragging");
      gallery.setPointerCapture(event.pointerId);
    }
    gallery.scrollLeft = startScroll - delta;
  });

  const stopDrag = () => {
    isDown = false;
    gallery.classList.remove("is-dragging");
  };

  gallery.addEventListener("pointerup", stopDrag);
  gallery.addEventListener("pointercancel", stopDrag);

  gallery.addEventListener(
    "click",
    (event) => {
      const item = event.target.closest("[data-lightbox]");
      if (!item) return;
      event.preventDefault();
      event.stopPropagation();
      if (dragged) {
        dragged = false;
        return;
      }
      const img = item.querySelector("img");
      openLightbox(img?.currentSrc || img?.src || item.getAttribute("data-lightbox"), img?.alt);
    },
    true
  );

  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByPage(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByPage(-1);
    }
  });

  prevBtn?.addEventListener("click", () => scrollByPage(-1));
  nextBtn?.addEventListener("click", () => scrollByPage(1));
  moreBtn?.addEventListener("click", () => {
    if (gallery.scrollLeft >= maxScroll() - 8) {
      gallery.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    scrollByPage(1);
  });

  gallery.addEventListener("scroll", updateGalleryUi, { passive: true });
  window.addEventListener("resize", updateGalleryUi);
  updateGalleryUi();
}

document.querySelectorAll("[data-lightbox]").forEach((item) => {
  if (item.closest(".gallery")) return;
  item.addEventListener("click", (event) => {
    event.preventDefault();
    const img = item.querySelector("img");
    openLightbox(img?.currentSrc || img?.src || item.getAttribute("data-lightbox"), img?.alt);
  });
});

lightbox?.querySelector("button")?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

window.openWhatsApp = (message) => {
  const text = encodeURIComponent(message || "Olá! Vim pelo site da DP Pinturas e gostaria de solicitar um orçamento.");
  window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank");
};

if (window.lucide) {
  window.lucide.createIcons();
}
