// Hero interactive effects — spotlight + sparkle trail
const hero = document.querySelector('.hero');

// Spotlight
const spotlight = document.createElement('div');
spotlight.className = 'hero-spotlight';
hero.appendChild(spotlight);

hero.addEventListener('mouseenter', () => {
  spotlight.style.opacity = '1';
});

hero.addEventListener('mouseleave', () => {
  spotlight.style.opacity = '0';
});

let lastSparkle = 0;

hero.addEventListener('mousemove', (e) => {
  const rect = hero.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  spotlight.style.left = x + 'px';
  spotlight.style.top  = y + 'px';

  const now = Date.now();
  if (now - lastSparkle > 25) {
    lastSparkle = now;
    spawnSparkle(x, y);
  }
});

function spawnSparkle(x, y) {
  const el = document.createElement('div');
  el.className = 'hero-sparkle';

  const size     = Math.random() * 7 + 4;
  const angle    = Math.random() * Math.PI * 2;
  const distance = Math.random() * 55 + 20;
  const duration = Math.random() * 500 + 450;

  el.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;`;
  hero.appendChild(el);

  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance - 25;

  el.animate(
    [
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 0.9 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`, opacity: 0 }
    ],
    { duration, easing: 'ease-out', fill: 'forwards' }
  ).onfinish = () => el.remove();
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color = link.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--color-text)'
            : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((s) => observer.observe(s));
