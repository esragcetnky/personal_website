// Mouse spotlight effect on hero section
const hero = document.querySelector('.hero');
const spotlight = document.createElement('div');
spotlight.className = 'hero-spotlight';
hero.appendChild(spotlight);

hero.addEventListener('mouseenter', () => {
  spotlight.style.opacity = '1';
});

hero.addEventListener('mouseleave', () => {
  spotlight.style.opacity = '0';
});

hero.addEventListener('mousemove', (e) => {
  const rect = hero.getBoundingClientRect();
  spotlight.style.left = (e.clientX - rect.left) + 'px';
  spotlight.style.top  = (e.clientY - rect.top)  + 'px';
});

// Highlight active nav link based on scroll position
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color = link.getAttribute("href") === `#${entry.target.id}`
            ? "var(--color-text)"
            : "";
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((s) => observer.observe(s));
