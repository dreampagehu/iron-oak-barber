const root = document.documentElement;
const hero = document.querySelector('.assembly-hero');
const header = document.querySelector('header');
const menu = document.querySelector('.menu');

menu.addEventListener('click', () => header.classList.toggle('open'));
document.querySelectorAll('nav a').forEach((link) => link.addEventListener('click', () => header.classList.remove('open')));

let ticking = false;
const renderAssembly = () => {
  const rect = hero.getBoundingClientRect();
  const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
  const raw = Math.min(1, Math.max(0, -rect.top / travel));
  const eased = raw < .5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
  root.style.setProperty('--p', eased.toFixed(4));
  root.style.setProperty('--inv', (1 - eased).toFixed(4));
  ticking = false;
};
const requestAssembly = () => { if (!ticking) { ticking = true; requestAnimationFrame(renderAssembly); } };
window.addEventListener('scroll', requestAssembly, { passive: true });
window.addEventListener('resize', requestAssembly);
renderAssembly();

document.querySelectorAll('video').forEach((video) => video.addEventListener('click', () => video.paused ? video.play() : video.pause()));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: .08 });
document.querySelectorAll('main > section:not(.assembly-hero)').forEach((section) => { section.classList.add('reveal'); observer.observe(section); });

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const toast = document.querySelector('.toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
});
