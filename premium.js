const header = document.querySelector('header');
const menu = document.querySelector('.menu');
const comparison = document.querySelector('.comparison');
const compare = document.querySelector('.compare');

menu.addEventListener('click', () => header.classList.toggle('open'));
document.querySelectorAll('nav a').forEach((link) => {
  link.addEventListener('click', () => header.classList.remove('open'));
});

const updateTransformation = () => {
  const rect = comparison.getBoundingClientRect();
  const travel = Math.max(1, comparison.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / travel));
  const eased = 1 - Math.pow(1 - progress, 3);
  compare.style.setProperty('--pos', `${Math.round(eased * 100)}%`);
  comparison.style.setProperty('--story-progress', eased.toFixed(3));
};

let ticking = false;
const requestTransformation = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateTransformation();
    ticking = false;
  });
};

window.addEventListener('scroll', requestTransformation, { passive: true });
window.addEventListener('resize', requestTransformation);
updateTransformation();

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  const toast = document.querySelector('.toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll('main > section').forEach((section, index) => {
  if (index && !section.classList.contains('comparison')) section.classList.add('reveal');
  observer.observe(section);
});

document.querySelectorAll('.service-grid article, .process-grid article, .gallery figure, .review-grid article').forEach((card, index) => {
  card.style.setProperty('--delay', `${(index % 6) * 70}ms`);
  card.classList.add('mobile-reveal');
  observer.observe(card);
});
