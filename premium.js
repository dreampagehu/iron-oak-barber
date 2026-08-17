const root = document.documentElement;
const hero = document.querySelector('.assembly-hero');
const header = document.querySelector('header');
const menu = document.querySelector('.menu');
const percent = document.querySelector('.assembly-percent');

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
  percent.textContent = String(Math.round(eased * 100)).padStart(2, '0');
  header.classList.toggle('scrolled', window.scrollY > 40);
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

const itemObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('in-view');
    itemObserver.unobserve(entry.target);
  }
}), { threshold: .12 });
document.querySelectorAll('.service-grid article,.process-grid article,.work figure,.review-grid article,.price-grid article,.phone').forEach((item, index) => {
  item.style.setProperty('--delay', `${(index % 4) * 90}ms`);
  itemObserver.observe(item);
});

const videoObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.play().catch(() => {});
  else entry.target.pause();
}), { threshold: .35 });
document.querySelectorAll('video').forEach((video) => videoObserver.observe(video));

document.querySelectorAll('.work figure,.service-grid article').forEach((card) => card.addEventListener('pointermove', (event) => {
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  card.style.setProperty('--my', `${event.clientY - rect.top}px`);
}));

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const toast = document.querySelector('.toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
});
