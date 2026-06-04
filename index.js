/* PARTICLE SYSTEM */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H + H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -(Math.random() * 0.8 + 0.3);
    this.size = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.55 + 0.15;
    this.life = 0;
    this.maxLife = Math.random() * 300 + 200;
    this.isCross = Math.random() > 0.72;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.life++;
    const t = this.life / this.maxLife;
    const ease = t < 0.2 ? t / 0.2 : t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1;
    this.currentAlpha = this.alpha * ease;
    if (this.life > this.maxLife) this.reset();
  }
  draw() {
    ctx.save(); ctx.globalAlpha = this.currentAlpha;
    ctx.fillStyle = '#C9A84C'; ctx.strokeStyle = '#C9A84C';
    if (!this.isCross) {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.lineWidth = 0.8;
      const s = this.size * 3;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - s); ctx.lineTo(this.x, this.y + s);
      ctx.moveTo(this.x - s * 0.6, this.y - s * 0.2); ctx.lineTo(this.x + s * 0.6, this.y - s * 0.2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

for (let i = 0; i < 80; i++) {
  const p = new Particle();
  p.y = Math.random() * H; p.life = Math.random() * p.maxLife;
  particles.push(p);
}
function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

/* NAV */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 80); });

/* REVEAL */
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => observer.observe(el));

/* PARALLAX */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) heroBg.style.transform = 'scale(1.05) translateY(' + (scrolled * 0.28) + 'px)';
});