/**
 * Party Popper & Confetti Engine
 * Custom high-performance particle system rendering on HTML5 Canvas.
 * Supports hearts, stars, ribbons, rectangles, circles, physics, and page-specific color palettes.
 */
class PartyPopperEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationFrame = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Custom palettes for each page
        this.palettes = {
            1: ['#ff2a85', '#ff70a6', '#ff9770', '#b5179e', '#7209b7', '#f72585', '#e0aaff', '#c77dff'], // Pink + Purple
            2: ['#ffd700', '#ffbe0b', '#fb5607', '#ff007f', '#ff758f', '#ffaa00', '#ffe66d', '#ff5964'], // Gold + Pink + Orange
            3: ['#00f0ff', '#38bdf8', '#818cf8', '#c084fc', '#a855f7', '#60a5fa', '#06b6d4', '#e879f9'], // Cyan + Lavender + Blue
            4: ['#ffd700', '#facc15', '#a855f7', '#7e22ce', '#ffffff', '#ede9fe', '#fef08a', '#c084fc'], // Gold + Purple + White
            5: ['#ff0055', '#ff5500', '#ffaa00', '#ffee00', '#00dd88', '#00bbff', '#7700ff', '#ff00aa', '#ffffff'] // Rainbow
        };

        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'popper-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());
        this.loop = this.loop.bind(this);
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
    }

    /**
     * Launch poppers from specified origin
     * @param {Object} options
     * - origin: 'left' | 'right' | 'both' | 'center' | 'bottom-corners' | 'all'
     * - page: 1 | 2 | 3 | 4 | 5
     * - count: number of particles
     */
    launch(options = {}) {
        const page = options.page || 1;
        const colors = this.palettes[page] || this.palettes[1];
        const origin = options.origin || 'both';
        const count = options.count || 80;

        if (origin === 'left' || origin === 'both' || origin === 'all') {
            this.emitFromPoint(0, this.height * 0.75, 45, 35, colors, count);
            this.triggerPopperVisual('left');
        }
        if (origin === 'right' || origin === 'both' || origin === 'all') {
            this.emitFromPoint(this.width, this.height * 0.75, 135, 35, colors, count);
            this.triggerPopperVisual('right');
        }
        if (origin === 'center') {
            this.emitRadial(this.width / 2, this.height / 2, colors, count * 1.5);
        }
        if (origin === 'bottom-corners' || origin === 'all') {
            this.emitFromPoint(0, this.height, 55, 30, colors, count * 0.8);
            this.emitFromPoint(this.width, this.height, 125, 30, colors, count * 0.8);
        }

        if (window.sound) {
            window.sound.playPop();
        }

        if (!this.animationFrame) {
            this.animationFrame = requestAnimationFrame(this.loop);
        }
    }

    triggerPopperVisual(side) {
        const el = document.querySelector(`.side-popper.${side}`);
        if (el) {
            el.classList.remove('recoil');
            void el.offsetWidth; // trigger reflow
            el.classList.add('recoil');
        }
    }

    emitFromPoint(x, y, baseAngleDeg, spreadDeg, colors, count) {
        for (let i = 0; i < count; i++) {
            const angle = (baseAngleDeg + (Math.random() * spreadDeg * 2 - spreadDeg)) * (Math.PI / 180);
            const speed = 12 + Math.random() * 24;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shapes = ['rect', 'star', 'heart', 'ribbon', 'circle'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];

            this.particles.push(new PopperParticle(x, y, angle, speed, color, shape));
        }
    }

    emitRadial(x, y, colors, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 6 + Math.random() * 22;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shapes = ['rect', 'star', 'heart', 'ribbon'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];

            this.particles.push(new PopperParticle(x, y, angle, speed, color, shape));
        }
    }

    loop() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            p.draw(this.ctx);

            if (p.isDead()) {
                this.particles.splice(i, 1);
            }
        }

        if (this.particles.length > 0) {
            this.animationFrame = requestAnimationFrame(this.loop);
        } else {
            this.animationFrame = null;
        }
    }

    clear() {
        this.particles = [];
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
}

class PopperParticle {
    constructor(x, y, angle, speed, color, shape) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = -Math.sin(angle) * speed;
        this.color = color;
        this.shape = shape;

        this.size = 8 + Math.random() * 10;
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() * 12 - 6);
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.1 + Math.random() * 0.15;

        this.gravity = 0.42 + Math.random() * 0.18;
        this.drag = 0.96;
        this.opacity = 1;
        this.fade = 0.006 + Math.random() * 0.008;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.vy += this.gravity;

        this.rotation += this.rotSpeed;
        this.wobble += this.wobbleSpeed;
        this.opacity -= this.fade;
    }

    isDead() {
        return this.opacity <= 0 || this.y > window.innerHeight + 50;
    }

    draw(ctx) {
        if (this.opacity <= 0) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.scale(Math.cos(this.wobble), 1);
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;

        if (this.shape === 'rect') {
            ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
        } else if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.shape === 'star') {
            this.drawStar(ctx, 0, 0, 5, this.size * 0.7, this.size * 0.35);
        } else if (this.shape === 'heart') {
            this.drawHeart(ctx, 0, 0, this.size * 0.6);
        } else if (this.shape === 'ribbon') {
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-this.size, -this.size / 2);
            ctx.bezierCurveTo(-this.size / 2, this.size, this.size / 2, -this.size, this.size, this.size / 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    drawHeart(ctx, cx, cy, s) {
        ctx.beginPath();
        const topCurveHeight = s * 0.3;
        ctx.moveTo(cx, cy + topCurveHeight);
        ctx.bezierCurveTo(cx, cy, cx - s, cy, cx - s, cy + topCurveHeight);
        ctx.bezierCurveTo(cx - s, cy + (s + topCurveHeight) / 1.5, cx, cy + (s + topCurveHeight), cx, cy + (s + topCurveHeight) * 1.2);
        ctx.bezierCurveTo(cx, cy + (s + topCurveHeight), cx + s, cy + (s + topCurveHeight) / 1.5, cx + s, cy + topCurveHeight);
        ctx.bezierCurveTo(cx + s, cy, cx, cy, cx, cy + topCurveHeight);
        ctx.closePath();
        ctx.fill();
    }
}

// Global instance
window.popperEngine = new PartyPopperEngine();
