document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.id = 'particle-container';
    document.body.appendChild(container);

    const PARTICLE_COUNT = 50;
    const POKEMON_RANGE = 151; // Gen 1 sprites are recognizable
    const particles = [];

    // Mouse state
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    class Particle {
        constructor() {
            this.element = document.createElement('img');
            this.id = Math.floor(Math.random() * POKEMON_RANGE) + 1;
            this.element.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.id}.png`;
            this.element.classList.add('particle');

            // Random initial position
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;

            // Base velocity
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;

            // Depth for parallax (0.5 to 2.0)
            this.depth = Math.random() * 1.5 + 0.5;

            container.appendChild(this.element);
        }

        update() {
            // Constant subtle floating
            this.x += this.vx;
            this.y += this.vy;

            // Mouse influence (Parallax)
            // Move opposite to mouse interaction
            // Center of screen is reference
            const dx = (mouseX - window.innerWidth / 2) * 0.05 * this.depth;
            const dy = (mouseY - window.innerHeight / 2) * 0.05 * this.depth;

            // Wrap around screen
            if (this.x < -100) this.x = window.innerWidth + 100;
            if (this.x > window.innerWidth + 100) this.x = -100;
            if (this.y < -100) this.y = window.innerHeight + 100;
            if (this.y > window.innerHeight + 100) this.y = -100;

            // Apply transform
            this.element.style.transform = `translate(${this.x - dx}px, ${this.y - dy}px) scale(${this.depth * 0.5})`;
        }
    }

    // Initialize particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        particles.forEach(p => p.update());
        requestAnimationFrame(animate);
    }

    animate();
});
