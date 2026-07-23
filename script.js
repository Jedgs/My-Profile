const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navList = document.querySelector(".nav-list");
const navLinks = [...document.querySelectorAll(".nav-list a")];
const sections = [...document.querySelectorAll("main section[id]")];
const internalLinks = [...document.querySelectorAll('a[href^="#"]')];

const toggleMenu = (open) => {
  menuButton.classList.toggle("open", open);
  navList.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
};

menuButton.addEventListener("click", () => {
  toggleMenu(!navList.classList.contains("open"));
});

internalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId === "#" ? document.documentElement : document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();
    toggleMenu(false);

    if (targetId === "#top" || targetId === "#home") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (history.pushState) {
      history.pushState(null, "", targetId);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navList.classList.contains("open")) {
    toggleMenu(false);
    menuButton.focus();
  }
});

document.addEventListener("click", (event) => {
  if (
    navList.classList.contains("open") &&
    !navList.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    toggleMenu(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) toggleMenu(false);
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);

  const current = sections.reduce((active, section) => {
    return window.scrollY >= section.offsetTop - 180 ? section.id : active;
  }, "home");

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
document.getElementById("year").textContent = new Date().getFullYear();
