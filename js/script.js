/* ---------- Menu mobile ---------- */
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

if (toggle && links) {
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });
}

/* ---------- Fermer le menu en cliquant sur un lien ---------- */
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (links) links.classList.remove('open');
    });
});

/* ---------- Animations au scroll (fade-in) ---------- */
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ---------- Formulaire de contact (simulation) ---------- */
const form = document.querySelector('#contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.querySelector('#form-status');
        if (status) {
            status.textContent = 'Merci pour votre message, je vous répondrai rapidement.';
            status.style.color = 'var(--success)';
        }
        form.reset();
    });
}

/* ---------- Année dynamique dans le footer ---------- */
const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Popover des technologies & outils ---------- */
const logoPopover = document.getElementById('logo-popover');
const logoBackdrop = document.getElementById('logo-backdrop');
const logoPopoverTitle = document.getElementById('logo-popover-title');
const logoPopoverDesc = document.getElementById('logo-popover-desc');
const logoPopoverClose = document.querySelector('.logo-popover-close');

function closeLogoPopover() {
    if (logoPopover) logoPopover.classList.remove('open');
    if (logoBackdrop) logoBackdrop.classList.remove('open');
}

function openLogoPopover(item) {
    if (!logoPopover || !item) return;
    const name = item.getAttribute('data-name') || '';
    const desc = item.getAttribute('data-desc') || '';
    if (logoPopoverTitle) logoPopoverTitle.textContent = name;
    if (logoPopoverDesc) logoPopoverDesc.textContent = desc;

    logoPopover.style.visibility = 'hidden';
    logoPopover.classList.add('open');
    if (logoBackdrop) logoBackdrop.classList.add('open');

    const rect = item.getBoundingClientRect();
    const popRect = logoPopover.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = rect.left + rect.width / 2 - popRect.width / 2;
    let top = rect.bottom + 12;

    left = Math.max(12, Math.min(left, vw - popRect.width - 12));
    if (top + popRect.height > vh - 12) {
        top = Math.max(12, rect.top - popRect.height - 12);
    }

    logoPopover.style.left = left + 'px';
    logoPopover.style.top = top + 'px';
    logoPopover.style.visibility = 'visible';
}

document.querySelectorAll('.logo-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        openLogoPopover(item);
    });
});

if (logoBackdrop) logoBackdrop.addEventListener('click', closeLogoPopover);
if (logoPopoverClose) logoPopoverClose.addEventListener('click', closeLogoPopover);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLogoPopover();
});

window.addEventListener('resize', closeLogoPopover);
window.addEventListener('scroll', closeLogoPopover, { passive: true });
