class FireworkSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.fireworks = [];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createFirework() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height / 2;
        const firework = new Firework(x, y);
        this.fireworks.push(firework);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.fireworks.forEach((firework, index) => {
            if (firework.particles.length === 0) {
                this.fireworks.splice(index, 1);
            } else {
                firework.update(this.ctx);
            }
        });
    }
}

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.createParticles();
    }

    createParticles() {
        const particleCount = 200;
        const hue = Math.floor(Math.random() * 360);
        for (let i = 0; i < particleCount; i++) {
            const color = `${hue}, 100%, 50%`;
            this.particles.push(new Particle(this.x, this.y, color));
        }
    }

    update(ctx) {
        this.particles.forEach((particle, index) => {
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            } else {
                particle.update(ctx);
            }
        });
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 2 + 1;
        this.velocity = {
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 10
        };
        this.gravity = 0.1;
        this.friction = 0.99;
        this.opacity = 1;
        this.life = 200;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${this.color}, 1)`;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    update(ctx) {
        this.draw(ctx);
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.opacity -= 0.005;
        this.life--;
    }
}

export { FireworkSystem };
