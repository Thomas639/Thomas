
// ===== PARTICLE ANIMATION =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                this.x -= dx * 0.01;
                this.y -= dy * 0.01;
            }
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== TYPING ANIMATION =====
const phrases = [
    "Building high-throughput automation platforms",
    "AI-augmented development | 50% faster prototyping",
    "Real-time control systems specialist",
    "C# | ASP.NET Core | TwinCAT | Robotics",
    "Turning hardware specs into scalable software",
    "30% throughput gains. 40% less downtime."
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typingText');

function typeEffect() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }
    typingEl.innerHTML = current.substring(0, charIndex) + '<span class="cursor"></span>';

    let speed = isDeleting ? 30 : 60;
    if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 500;
    }
    setTimeout(typeEffect, speed);
}
typeEffect();

// ===== SCROLL ANIMATIONS =====
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });
revealElements.forEach(el => revealObserver.observe(el));

// ===== SKILL BAR ANIMATION =====
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            entry.target.style.width = width + '%';
        }
    });
}, { threshold: 0.3 });
skillBars.forEach(bar => skillObserver.observe(bar));

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            const duration = 2000;
            const start = performance.now();
            function updateCounter(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                entry.target.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(updateCounter);
                else entry.target.textContent = target + (entry.target.getAttribute('data-suffix') || '');
            }
            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ===== NAV SCROLL EFFECTS =====
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section, .section, .ai-section');
const navLinksAll = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    // Scroll progress
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    document.getElementById('scrollProgress').style.width = (scrollTop / scrollHeight * 100) + '%';

    // Nav shadow
    navbar.classList.toggle('scrolled', scrollTop > 50);

    // Active link - if at bottom of page, highlight last section
    let current = '';
    if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 50) {
        current = 'contact';
    } else {
        sections.forEach(sec => {
            if (scrollTop >= sec.offsetTop - 150) {
                current = sec.getAttribute('id');
            }
        });
    }
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
});

// ===== MOBILE NAV TOGGLE =====
document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
    });
});

// ===== NEURAL NETWORK ANIMATION =====
const neuralCanvas = document.getElementById('neuralCanvas');
if (neuralCanvas) {
    const nCtx = neuralCanvas.getContext('2d');
    function resizeNeural() {
        neuralCanvas.width = neuralCanvas.parentElement.offsetWidth;
        neuralCanvas.height = neuralCanvas.parentElement.offsetHeight;
    }
    resizeNeural();
    window.addEventListener('resize', resizeNeural);

    const nodes = [];
    const layers = [4, 6, 8, 6, 4];
    const layerSpacing = neuralCanvas.width / (layers.length + 1);

    layers.forEach((count, layerIdx) => {
        const x = layerSpacing * (layerIdx + 1);
        for (let i = 0; i < count; i++) {
            const y = (neuralCanvas.height / (count + 1)) * (i + 1);
            nodes.push({ x, y, layer: layerIdx, pulse: Math.random() * Math.PI * 2 });
        }
    });

    function drawNeural(time) {
        nCtx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[j].layer === nodes[i].layer + 1) {
                    const pulse = (Math.sin(time * 0.002 + nodes[i].pulse) + 1) / 2;
                    nCtx.beginPath();
                    nCtx.strokeStyle = `rgba(34, 211, 238, ${0.08 + pulse * 0.15})`;
                    nCtx.lineWidth = 0.5 + pulse;
                    nCtx.moveTo(nodes[i].x, nodes[i].y);
                    nCtx.lineTo(nodes[j].x, nodes[j].y);
                    nCtx.stroke();

                    // Traveling data pulse
                    const t = (Math.sin(time * 0.003 + i * 0.5) + 1) / 2;
                    const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
                    const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t;
                    nCtx.beginPath();
                    nCtx.arc(px, py, 1.5, 0, Math.PI * 2);
                    nCtx.fillStyle = `rgba(167, 139, 250, ${pulse * 0.6})`;
                    nCtx.fill();
                }
            }
        }

        // Draw nodes
        nodes.forEach(node => {
            const pulse = (Math.sin(time * 0.003 + node.pulse) + 1) / 2;
            const radius = 4 + pulse * 3;

            // Glow
            nCtx.beginPath();
            nCtx.arc(node.x, node.y, radius + 5, 0, Math.PI * 2);
            nCtx.fillStyle = `rgba(34, 211, 238, ${0.05 + pulse * 0.1})`;
            nCtx.fill();

            // Node
            nCtx.beginPath();
            nCtx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            nCtx.fillStyle = `rgba(34, 211, 238, ${0.4 + pulse * 0.5})`;
            nCtx.fill();
        });

        requestAnimationFrame(drawNeural);
    }
    requestAnimationFrame(drawNeural);
}
