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
        const now = performance.now();
        if (!this.lastFrameTime) this.lastFrameTime = now;
        const deltaTime = now - this.lastFrameTime;
        
        if (deltaTime > 16) { // 限制帧率在60fps左右
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 使用更高效的数组遍历方式
            for (let i = this.fireworks.length - 1; i >= 0; i--) {
                const firework = this.fireworks[i];
                if (firework.particles.length === 0) {
                    this.fireworks.splice(i, 1);
                } else {
                    firework.update(this.ctx);
                }
            }
            
            this.lastFrameTime = now;
        }
        requestAnimationFrame(() => this.animate());
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
        const particleCount = 100; // 减少粒子数量
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
        this.radius = Math.random() * 3 + 1;
        this.velocity = {
            x: (Math.random() - 0.5) * 15,
            y: (Math.random() - 0.5) * 15
        };
        this.gravity = 0.08;
        this.friction = 0.97;
        this.opacity = 1;
        this.life = 300;
        this.hue = parseInt(color.split(',')[0]);
        this.sparkle = Math.random() > 0.8;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        
        // 渐变颜色
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 50%, ${this.opacity})`);
        gradient.addColorStop(1, `hsla(${this.hue + 30}, 100%, 50%, ${this.opacity * 0.5})`);
        
        ctx.fillStyle = gradient;
        
        // 闪烁效果
        if (this.sparkle) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 1)`;
        } else {
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.8)`;
        }
        
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
        this.opacity -= 0.003;
        this.life--;
        
        // 颜色变化
        this.hue += 0.5;
    }
}

class CelebrationManager {
    constructor() {
        this.loadingElement = document.getElementById('loading');
        this.startButton = document.getElementById('startButton');
        this.starsContainer = document.getElementById('stars');
        this.countdownElement = document.getElementById('countdown');
        this.audio = new Audio('new-year.mp3');
        this.fireworkSystem = null;
        this.fireworkInterval = null;
        this.init();
    }

    init() {
        this.createStars();
        this.setupEventListeners();
        this.hideLoading();
    }

    createStars() {
        for (let i = 0; i < 500; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            this.starsContainer.appendChild(star);
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        this.startButton.addEventListener('click', () => {
            console.log('Button clicked');
            this.startCelebration();
        });
    }

    hideLoading() {
        setTimeout(() => {
            this.loadingElement.classList.add('hidden');
        }, 1000);
    }

    startCelebration() {
        this.startButton.classList.add('hidden');
        this.startCountdown();
        this.playMusic();
        this.startFireworks();
    }

    startFireworks() {
        // 确保canvas存在
        if (!document.querySelector('canvas')) {
            this.fireworkSystem = new FireworkSystem();
        }
        // 首次立即创建烟花
        this.fireworkSystem.createFirework();
        // 设置定时器持续创建烟花
        this.fireworkInterval = setInterval(() => {
            this.fireworkSystem.createFirework();
        }, 200);
    }

    startCountdown() {
        let timeLeft = 3;
        const interval = setInterval(() => {
            this.countdownElement.textContent = timeLeft;
            this.countdownElement.style.fontSize = `${100 + timeLeft * 10}px`;
            this.countdownElement.style.opacity = 1 - timeLeft * 0.1;
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(interval);
                this.countdownElement.style.display = 'none';
                this.showGreeting();
            }
        }, 1000);
    }

    playMusic() {
        this.audio.loop = true;
        this.audio.play().catch(error => {
            console.error('音乐播放失败:', error);
        });
    }

    showGreeting() {
        const greeting = document.createElement('div');
        greeting.className = 'greeting';
        greeting.textContent = '周悦，新年快乐';
        document.body.appendChild(greeting);
    }
}

// 初始化庆祝管理器
window.addEventListener('load', () => {
    console.log('Page fully loaded');
    const manager = new CelebrationManager();
    console.log('CelebrationManager initialized:', manager);
});
