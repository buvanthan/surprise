/**
 * Fireworks System
 * Luminous celebration fireworks canvas engine for Page 5 and interactive bursts.
 */
class FireworksEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.rockets = [];
        this.sparks = [];
        this.isRunning = false;
        this.animFrame = null;
        this.autoLaunchTimer = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.colors = [
            '#ff0055', '#ff7700', '#ffd700', '#00ffcc', '#00aaff',
            '#a855f7', '#ec4899', '#ffffff', '#70e000', '#ff00aa'
        ];
    }

    init() {
        if (this.canvas) return;
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'fireworks-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9998';
        this.canvas.style.opacity = '0';
        this.canvas.style.transition = 'opacity 0.6s ease';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());
        this.loop = this.loop.bind(this);
    }

    resize() {
        if (!this.canvas) return;
        const dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
    }

    start() {
        this.init();
        this.isRunning = true;
        this.canvas.style.opacity = '1';
        this.rockets = [];
        this.sparks = [];

        // Launch a couple of immediate grand fireworks
        this.launch(this.width * 0.3, this.height * 0.28);
        setTimeout(() => this.launch(this.width * 0.7, this.height * 0.25), 250);
        setTimeout(() => this.launch(this.width * 0.5, this.height * 0.2), 500);

        if (!this.animFrame) {
            this.animFrame = requestAnimationFrame(this.loop);
        }

        // Auto launch interval
        this.scheduleNextAutoLaunch();
    }

    scheduleNextAutoLaunch() {
        if (!this.isRunning) return;
        const delay = 600 + Math.random() * 900;
        this.autoLaunchTimer = setTimeout(() => {
            if (!this.isRunning) return;
            const targetX = this.width * 0.15 + Math.random() * this.width * 0.7;
            const targetY = this.height * 0.12 + Math.random() * this.height * 0.35;
            this.launch(targetX, targetY);
            this.scheduleNextAutoLaunch();
        }, delay);
    }

    stop() {
        this.isRunning = false;
        if (this.autoLaunchTimer) clearTimeout(this.autoLaunchTimer);
        if (this.canvas) {
            this.canvas.style.opacity = '0';
        }
        setTimeout(() => {
            if (!this.isRunning) {
                this.rockets = [];
                this.sparks = [];
                if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
                if (this.animFrame) {
                    cancelAnimationFrame(this.animFrame);
                    this.animFrame = null;
                }
            }
        }, 600);
    }

    launch(targetX, targetY) {
        const startX = targetX + (Math.random() * 80 - 40);
        const startY = this.height;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.rockets.push(new FireworkRocket(startX, startY, targetX, targetY, color));
    }

    explode(x, y, color) {
        const count = 55 + Math.floor(Math.random() * 35);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 6.5;
            this.sparks.push(new FireworkSpark(x, y, angle, speed, color));
        }

        if (window.sound) {
            window.sound.playSparkle();
        }
    }

    loop() {
        if (!this.isRunning && this.rockets.length === 0 && this.sparks.length === 0) {
            this.animFrame = null;
            return;
        }

        // Subtle motion trail
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = 'lighter';

        // Update rockets
        for (let i = this.rockets.length - 1; i >= 0; i--) {
            const r = this.rockets[i];
            r.update();
            r.draw(this.ctx);

            if (r.hasArrived()) {
                this.explode(r.x, r.y, r.color);
                this.rockets.splice(i, 1);
            }
        }

        // Update sparks
        for (let i = this.sparks.length - 1; i >= 0; i--) {
            const s = this.sparks[i];
            s.update();
            s.draw(this.ctx);

            if (s.isDead()) {
                this.sparks.splice(i, 1);
            }
        }

        this.animFrame = requestAnimationFrame(this.loop);
    }
}

class FireworkRocket {
    constructor(x, y, targetX, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;

        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.hypot(dx, dy);
        const speed = 11 + Math.random() * 3;

        this.vx = (dx / dist) * speed;
        this.vy = (dy / dist) * speed;
        this.trail = [];
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 5) this.trail.shift();

        this.x += this.vx;
        this.y += this.vy;
    }

    hasArrived() {
        return this.y <= this.targetY;
    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        if (this.trail.length > 0) {
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
        }
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class FireworkSpark {
    constructor(x, y, angle, speed, color) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = color;
        this.friction = 0.94;
        this.gravity = 0.08;
        this.alpha = 1;
        this.decay = 0.012 + Math.random() * 0.015;
        this.radius = 1.8 + Math.random() * 1.5;
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    isDead() {
        return this.alpha <= 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

window.fireworks = new FireworksEngine();
