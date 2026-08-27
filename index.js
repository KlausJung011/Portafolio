/* ═══════════════════════════════════════════════
   PORTAFOLIO — index.js
   Animaciones, barras de progreso, nav activa
   ═══════════════════════════════════════════════ */

/* ── 1. SMOOTH SCROLL para nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ── 2. REVEAL al hacer scroll ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // solo una vez
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 3. ANIMACIÓN DE BARRAS DE PROGRESO ── */
function animateBar(fill) {
    const targetWidth = fill.getAttribute('data-width');
    if (targetWidth) {
        // Pequeño delay para que se vea la animación
        requestAnimationFrame(() => {
            fill.style.width = targetWidth + '%';
        });
    }
}

const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animar todas las barras dentro del elemento visible
            entry.target.querySelectorAll('.skill-bar-fill, .lang-level-fill').forEach((fill, i) => {
                setTimeout(() => animateBar(fill), i * 120);
            });
            barObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('#habilidades, #idiomas').forEach(el => barObserver.observe(el));

/* ── 4. NAV LINK ACTIVA al hacer scroll ── */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, {
    threshold: 0.35,
    rootMargin: '-80px 0px -60% 0px'
});

sections.forEach(section => navObserver.observe(section));

/* ── 5. ORBS FLOTANTES en el fondo ── */
function createOrbs() {
    const canvas = document.getElementById('bgCanvas');
    const colors = [
        'rgba(255, 132, 55, 0.06)',
        'rgba(0, 229, 255, 0.05)',
        'rgba(199, 125, 255, 0.05)',
        'rgba(255, 215, 0, 0.04)'
    ];
    const count = 6;

    for (let i = 0; i < count; i++) {
        const orb = document.createElement('div');
        const size = Math.random() * 300 + 150;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const color = colors[i % colors.length];
        const duration = Math.random() * 20 + 15;
        const delay = -(Math.random() * duration);

        orb.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            border-radius: 50%;
            background: radial-gradient(circle, ${color}, transparent 70%);
            filter: blur(${size * 0.25}px);
            animation: orbDrift ${duration}s ${delay}s ease-in-out infinite alternate;
            pointer-events: none;
        `;
        canvas.appendChild(orb);
    }

    // Agregar keyframe dinámico
    if (!document.getElementById('orbKeyframe')) {
        const style = document.createElement('style');
        style.id = 'orbKeyframe';
        style.textContent = `
            @keyframes orbDrift {
                0%   { transform: translate(0, 0) scale(1); opacity: 0.6; }
                33%  { transform: translate(${randPx()}, ${randPx()}) scale(1.08); }
                66%  { transform: translate(${randPx()}, ${randPx()}) scale(0.95); }
                100% { transform: translate(${randPx()}, ${randPx()}) scale(1.03); opacity: 0.9; }
            }
        `;
        document.head.appendChild(style);
    }
}

function randPx() {
    return (Math.random() * 60 - 30) + 'px';
}

/* ── 6. CURSOR GLOW suave (efecto premium) ── */
function initCursorGlow() {
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,132,55,0.06) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        transition: left 0.18s ease, top 0.18s ease;
        mix-blend-mode: screen;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
    });
}

/* ── 7. REVEAL con delay escalonado para grids ── */
function staggerReveal() {
    const grids = document.querySelectorAll(
        '.interests-grid, .soft-skills-grid, .projects-grid, .courses-grid, .about-stats, .languages-grid'
    );
    grids.forEach(grid => {
        const children = grid.children;
        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Array.from(children).forEach((child, i) => {
                        child.style.opacity = '0';
                        child.style.transform = 'translateY(20px)';
                        child.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
                        // Forzar reflow
                        void child.offsetHeight;
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    });
                    gridObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        gridObserver.observe(grid);
    });
}

/* ── INIT ── */
window.addEventListener('load', () => {
    createOrbs();
    initCursorGlow();
    staggerReveal();
});

/* ── TYPING effect en el título del header ── */
window.addEventListener('DOMContentLoaded', () => {
    const titleEl = document.querySelector('.title');
    if (!titleEl) return;

    const text = titleEl.textContent.trim();
    titleEl.textContent = '';
    titleEl.style.borderRight = '2px solid rgba(255,132,55,0.7)';
    titleEl.style.whiteSpace = 'nowrap';
    titleEl.style.overflow = 'hidden';

    let i = 0;
    const delay = 600; // ms antes de empezar
    setTimeout(() => {
        const interval = setInterval(() => {
            if (i <= text.length) {
                titleEl.textContent = text.slice(0, i);
                i++;
            } else {
                titleEl.style.borderRight = 'none';
                clearInterval(interval);
            }
        }, 55);
    }, delay);
});