// ── Hero fluid canvas ─────────────────────────────────────────
const heroEl = document.querySelector('.hero');
const canvas = document.getElementById('hero-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = heroEl.offsetWidth;
  canvas.height = heroEl.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const DROPS_COLORS = [
  [147, 197, 253],
  [96,  165, 250],
  [191, 219, 254],
  [186, 230, 253],
  [125, 211, 252],
];

class Drop {
  constructor(x, y, vx, vy) {
    const c      = DROPS_COLORS[Math.floor(Math.random() * DROPS_COLORS.length)];
    this.x       = x;
    this.y       = y;
    this.vx      = vx * 0.35 + (Math.random() - 0.5) * 2;
    this.vy      = vy * 0.35 + (Math.random() - 0.5) * 2;
    this.r       = Math.random() * 18 + 7;
    this.rgb     = c;
    this.alpha   = 0.30 + Math.random() * 0.25;
    this.life    = 1.0;
    this.decay   = 0.010 + Math.random() * 0.014;
  }

  update() {
    this.x    += this.vx;
    this.y    += this.vy;
    this.vx   *= 0.96;
    this.vy   *= 0.96;
    this.life -= this.decay;
    this.r    *= 0.997;
  }

  draw() {
    const a   = this.alpha * this.life;
    const [r, g, b] = this.rgb;
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
    grd.addColorStop(0, `rgba(${r},${g},${b},${a})`);
    grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
  }
}

let drops = [];
let prevX = -1000, prevY = -1000;

heroEl.addEventListener('mousemove', (e) => {
  const rect  = heroEl.getBoundingClientRect();
  const x     = e.clientX - rect.left;
  const y     = e.clientY - rect.top;
  const vx    = x - prevX;
  const vy    = y - prevY;
  const speed = Math.hypot(vx, vy);
  const count = Math.min(Math.ceil(speed * 0.35) + 1, 6);

  for (let i = 0; i < count; i++) drops.push(new Drop(x, y, vx, vy));

  prevX = x;
  prevY = y;
});

(function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drops = drops.filter(d => d.life > 0);
  drops.forEach(d => { d.update(); d.draw(); });
  requestAnimationFrame(animateCanvas);
})();

// ── Cursor rings ──────────────────────────────────────────────
const rings = document.querySelectorAll('.hero-ring');
const LAGS  = [0.22, 0.13, 0.08, 0.05];
let target  = { x: -500, y: -500 };
let rPos    = Array.from({ length: rings.length }, () => ({ x: -500, y: -500 }));

heroEl.addEventListener('mousemove', (e) => {
  const rect = heroEl.getBoundingClientRect();
  target.x = e.clientX - rect.left;
  target.y = e.clientY - rect.top;
  rings.forEach(r => r.style.opacity = '1');
});

heroEl.addEventListener('mouseleave', () => {
  rings.forEach(r => r.style.opacity = '0');
});

(function animateRings() {
  rPos.forEach((pos, i) => {
    const src = i === 0 ? target : rPos[i - 1];
    pos.x += (src.x - pos.x) * LAGS[i];
    pos.y += (src.y - pos.y) * LAGS[i];
    rings[i].style.left = pos.x + 'px';
    rings[i].style.top  = pos.y + 'px';
  });
  requestAnimationFrame(animateRings);
})();

// ── Active nav link on scroll ─────────────────────────────────
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

sections.forEach(s => observer.observe(s));

// ── Mobile nav toggle ─────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navLinksList = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinksList.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

navLinksList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinksList.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});
