document.documentElement.classList.add("js-enabled");

const sections = Array.from(document.querySelectorAll(".portfolio-section"));
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const dots = Array.from(document.querySelectorAll(".dot"));
const typedText = document.querySelector("#typed-text");
const animatedItems = Array.from(
  document.querySelectorAll(".skill-card, .experience-item, .project-card, .contact-card, .about-panel"),
);

let currentSectionId = "";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

animatedItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index * 60, 360)}ms`);
});

if (window.lucide) {
  window.lucide.createIcons();
}

function setActiveSection(section) {
  const sectionId = section.id;
  section.classList.add("is-visible");

  if (sectionId === currentSectionId) {
    return;
  }

  currentSectionId = sectionId;

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${sectionId}`);
  });

  dots.forEach((dot) => {
    dot.classList.toggle("is-active", dot.getAttribute("href") === `#${sectionId}`);
  });
}

function initActiveState() {
  const hashSection = sections.find((section) => `#${section.id}` === window.location.hash);
  const firstSection = hashSection || sections[0];

  if (firstSection) {
    setActiveSection(firstSection);
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });

    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      setActiveSection(visible.target);
    }
  },
  {
    root: null,
    rootMargin: "-30% 0px -45% 0px",
    threshold: [0, 0.2, 0.45],
  },
);

function startTypewriter() {
  if (!typedText || prefersReducedMotion) {
    return;
  }

  const phrases = [
    "Python, dados e inteligência artificial",
    "RAG, LLMs e automação",
    "Backend, SQL e dashboards",
    "Sistemas embarcados e soluções práticas",
  ];
  let phraseIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;

  function typeNext() {
    const phrase = phrases[phraseIndex];
    typedText.textContent = phrase.slice(0, letterIndex);

    if (!isDeleting && letterIndex < phrase.length) {
      letterIndex += 1;
      window.setTimeout(typeNext, 56);
      return;
    }

    if (!isDeleting && letterIndex === phrase.length) {
      isDeleting = true;
      window.setTimeout(typeNext, 1350);
      return;
    }

    if (isDeleting && letterIndex > 0) {
      letterIndex -= 1;
      window.setTimeout(typeNext, 28);
      return;
    }

    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    window.setTimeout(typeNext, 260);
  }

  typeNext();
}

function handleSectionLinkClick(event) {
  const link = event.currentTarget;
  const targetId = link.getAttribute("href");

  if (!targetId || !targetId.startsWith("#")) {
    return;
  }

  const target = document.querySelector(targetId);

  if (!target) {
    return;
  }

  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.pushState(null, "", targetId);
  setActiveSection(target);
}

initActiveState();
startTypewriter();
navLinks.forEach((link) => link.addEventListener("click", handleSectionLinkClick));
dots.forEach((dot) => dot.addEventListener("click", handleSectionLinkClick));
sections.forEach((section) => observer.observe(section));
