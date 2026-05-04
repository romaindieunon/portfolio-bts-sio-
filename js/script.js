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

/* ---------- Formulaire de contact (ouvre le client mail) ---------- */
const form = document.querySelector('#contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.querySelector('#form-status');

        const prenom  = (form.querySelector('#prenom')?.value  || '').trim();
        const nom     = (form.querySelector('#nom')?.value     || '').trim();
        const email   = (form.querySelector('#email')?.value   || '').trim();
        const message = (form.querySelector('#message')?.value || '').trim();

        if (!prenom || !nom || !email || !message) {
            if (status) {
                status.textContent = 'Merci de remplir tous les champs avant d\u2019envoyer.';
                status.style.color = '#dc2626';
            }
            return;
        }

        const destinataire = 'romaindieunon26@gmail.com';
        const sujet  = `Contact portfolio \u2014 ${prenom} ${nom}`;
        const corps  =
            `Bonjour Romain,\n\n` +
            `${message}\n\n` +
            `\u2014\n` +
            `Nom : ${prenom} ${nom}\n` +
            `E-mail : ${email}`;

        const mailto =
            'mailto:' + encodeURIComponent(destinataire) +
            '?subject=' + encodeURIComponent(sujet) +
            '&body=' + encodeURIComponent(corps);

        window.location.href = mailto;

        if (status) {
            status.textContent = 'Votre messagerie s\u2019ouvre avec le message pr\u00e9-rempli. Cliquez sur Envoyer pour finaliser l\u2019envoi.';
            status.style.color = 'var(--success)';
        }
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

/* ---------- Lightbox zoomable pour captures et schémas ---------- */
const procLightbox = document.getElementById('proc-lightbox');
const procLightboxImg = document.getElementById('proc-lightbox-img');
const procLightboxClose = document.querySelector('.proc-lightbox-close');

let lbScale = 1;        // échelle courante (1 = pixels natifs de l'image)
let lbFitScale = 1;     // échelle qui fait pile rentrer l'image dans l'écran
let lbMinScale = 1;     // = lbFitScale
let lbMaxScale = 8;     // borne haute (recalculée en fonction de l'image)
let lbTx = 0;
let lbTy = 0;
let lbDragging = false;
let lbDragStart = { x: 0, y: 0, tx: 0, ty: 0 };

function lbCalculateFitScale() {
    if (!procLightboxImg || !procLightboxImg.naturalWidth) return 1;
    const fitW = (window.innerWidth * 0.95) / procLightboxImg.naturalWidth;
    const fitH = (window.innerHeight * 0.95) / procLightboxImg.naturalHeight;
    return Math.min(fitW, fitH, 1);  // jamais d'agrandissement initial au-dessus de 1×
}

function lbApplyTransform() {
    if (!procLightboxImg) return;
    // .zoomed = on est au-dessus de la taille initiale ajustée → curseur "grab"
    if (lbScale > lbFitScale * 1.001) {
        procLightboxImg.classList.add('zoomed');
    } else {
        procLightboxImg.classList.remove('zoomed');
    }
    procLightboxImg.style.transform =
        `translate(calc(-50% + ${lbTx}px), calc(-50% + ${lbTy}px)) scale(${lbScale})`;
}

// Active une transition douce pour une action volontaire (touches +/-/0, double-clic)
function lbWithSmooth(callback) {
    if (!procLightboxImg) { callback(); return; }
    procLightboxImg.classList.add('smooth');
    callback();
    setTimeout(() => procLightboxImg.classList.remove('smooth'), 220);
}

function lbResetZoom(smooth) {
    const action = () => {
        lbScale = lbFitScale;
        lbTx = 0;
        lbTy = 0;
        lbApplyTransform();
    };
    if (smooth) lbWithSmooth(action);
    else action();
}

function lbZoomBy(factor, cx, cy) {
    const newScale = Math.min(Math.max(lbScale * factor, lbMinScale), lbMaxScale);
    if (newScale === lbScale) return;
    // Le centre de l'image en viewport est à (W/2 + tx, H/2 + ty)
    const cxImg = window.innerWidth / 2 + lbTx;
    const cyImg = window.innerHeight / 2 + lbTy;
    // Point sous le curseur en coordonnées image (avant échelle)
    const px = (cx - cxImg) / lbScale;
    const py = (cy - cyImg) / lbScale;
    // Réajustement pour que le même point reste sous le curseur après zoom
    lbTx = cx - window.innerWidth / 2 - px * newScale;
    lbTy = cy - window.innerHeight / 2 - py * newScale;
    lbScale = newScale;
    lbApplyTransform();
}

function lbInitialiseImage() {
    lbFitScale = lbCalculateFitScale();
    lbMinScale = lbFitScale;
    // Borne haute : on permet au minimum 100 % (pixels natifs), ou jusqu'à 10× le fit pour les petites images
    lbMaxScale = Math.max(1, lbFitScale * 10);
    lbResetZoom();
}

function openProcLightbox(src, alt) {
    if (!procLightbox || !procLightboxImg) return;
    procLightboxImg.classList.remove('zoomed', 'smooth');
    procLightboxImg.src = src;
    procLightboxImg.alt = alt || '';
    procLightbox.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (procLightboxImg.complete && procLightboxImg.naturalWidth > 0) {
        lbInitialiseImage();
    } else {
        procLightboxImg.onload = () => lbInitialiseImage();
    }
}

function closeProcLightbox() {
    if (!procLightbox) return;
    procLightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbResetZoom();
}

document.querySelectorAll('.proc-screen img').forEach(img => {
    img.addEventListener('click', () => openProcLightbox(img.src, img.alt));
});

if (procLightboxClose) {
    procLightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeProcLightbox();
    });
}

if (procLightbox) {
    // Clic sur le fond (pas sur l'image) ferme la lightbox
    procLightbox.addEventListener('click', (e) => {
        if (e.target === procLightbox) closeProcLightbox();
    });

    // Zoom à la molette — exponentiel, plafonné, pour un ressenti fluide et progressif
    procLightbox.addEventListener('wheel', (e) => {
        e.preventDefault();
        // On borne deltaY pour neutraliser les pics anormaux (certaines souris/tactiles envoient ±300 ou ±500)
        const clamped = Math.max(-100, Math.min(100, e.deltaY));
        // 0.0007 donne ~7 % de zoom par tic standard de molette — doux et précis
        const factor = Math.exp(-clamped * 0.0007);
        lbZoomBy(factor, e.clientX, e.clientY);
    }, { passive: false });

    // Glisser-déposer pour panoramiquer (uniquement quand on dépasse la taille initiale ajustée)
    procLightboxImg.addEventListener('mousedown', (e) => {
        if (lbScale <= lbFitScale * 1.001) return;
        lbDragging = true;
        lbDragStart = { x: e.clientX, y: e.clientY, tx: lbTx, ty: lbTy };
        procLightbox.classList.add('grabbing');
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        if (!lbDragging) return;
        lbTx = lbDragStart.tx + (e.clientX - lbDragStart.x);
        lbTy = lbDragStart.ty + (e.clientY - lbDragStart.y);
        lbApplyTransform();
    });
    document.addEventListener('mouseup', () => {
        lbDragging = false;
        if (procLightbox) procLightbox.classList.remove('grabbing');
    });

    // Double-clic = zoom 2× sur le curseur, ou reset si déjà zoomé (avec transition douce)
    procLightboxImg.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (lbScale > 1.001) {
            lbResetZoom(true);
        } else {
            lbWithSmooth(() => lbZoomBy(2.5, e.clientX, e.clientY));
        }
    });
}

// Raccourcis clavier (avec transition douce)
document.addEventListener('keydown', (e) => {
    if (!procLightbox || !procLightbox.classList.contains('open')) return;
    if (e.key === 'Escape') {
        closeProcLightbox();
    } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        lbWithSmooth(() => lbZoomBy(1.25, window.innerWidth / 2, window.innerHeight / 2));
    } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        lbWithSmooth(() => lbZoomBy(0.8, window.innerWidth / 2, window.innerHeight / 2));
    } else if (e.key === '0') {
        e.preventDefault();
        lbResetZoom(true);
    }
});
