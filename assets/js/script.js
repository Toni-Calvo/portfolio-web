document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navList = document.querySelector('.nav-list');
    const langButtons = document.querySelectorAll('.lang-btn');
    const navLinks = document.querySelectorAll('.nav-list a');

    const savedScrollY = localStorage.getItem('scrollPosition');
    const isLanguageChange = localStorage.getItem('isLanguageChange');

    // Set the scroll position on language change or page load
    if (savedScrollY) {
        window.requestAnimationFrame(() => {
            setTimeout(() => {
                const scrollOptions = {};
                if (isLanguageChange === 'true') {
                    scrollOptions.behavior = 'auto';
                    localStorage.removeItem('isLanguageChange');
                } else {
                    scrollOptions.behavior = 'smooth';
                }

                window.scrollTo(0, parseInt(savedScrollY), scrollOptions);
                localStorage.removeItem('scrollPosition');
            }, 50); 
        });
    }

    window.changeLanguage = function(lang) {
        localStorage.setItem('scrollPosition', window.scrollY);
        localStorage.setItem('isLanguageChange', 'true');

        let targetPage = '';
        if (lang === 'es') {
            targetPage = 'index_es.html';
        } else {
            targetPage = 'index.html';
        }

        window.location.href = targetPage;
    };


    // Set the current year in the footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Update the active language button based on the current page
    const getCurrentPageName = () => {
        const path = window.location.pathname;
        const page = path.split('/').pop();
        return page.split('.')[0];
    };

    const updateLanguageButtons = (currentPage) => {
        let found = false;
        langButtons.forEach(button => {
            if ((currentPage === 'index' && button.dataset.lang === 'en') ||
                (currentPage === 'index_es' && button.dataset.lang === 'es')) {
                button.classList.add('active');
                found = true;
            } else {
                button.classList.remove('active');
            }
        });
        
        if (!found) {
            langButtons.forEach(button => {
                if (button.dataset.lang === 'en') {
                    button.classList.add('active');
                }
            });
        }
    };

    const currentPageName = getCurrentPageName();
    updateLanguageButtons(currentPageName);

    hamburgerMenu.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active') && window.innerWidth <= 768) {
                navList.classList.remove('active');
            }
        });
    });


    // Delay function
    function debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }


    // Constellation effect
    const DENSITY_PARTICLES = 7e-5;
    const MAX_DISTANCE = 100;
    const SHADOW_BLUR = 5;

    const canvas = document.getElementById('constellationCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
        }

        // Particle movement
        update() {
            // Check canvas borders
            if (this.x + this.radius > canvas.width) 
                this.x = this.radius;

            else if (this.x + this.radius > canvas.width || this.x - this.radius < 0) 
                this.x = canvas.width - this.radius;

            else if (this.y + this.radius > canvas.height || this.y - this.radius < 0) 
                this.y = this.radius;

            else if (this.y - this.radius < 0) 
                this.y = canvas.height - this.radius;
            
            // Update position
            this.x += this.speedX;
            this.y += this.speedY;

            if (Math.random() < 0.05) {
                this.speedX = Math.max(Math.min(this.speedX + Math.random() * 0.05 - 0.025, 0.3), -0.3);
                this.speedY = Math.max(Math.min(this.speedY + Math.random() * 0.05 - 0.025, 0.3), -0.3);
            }
        }

        draw() {
            const color = 'rgba(255, 255, 255, 0.7)';
            ctx.fillStyle = color;
            ctx.shadowBlur = SHADOW_BLUR;
            ctx.shadowColor = color;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }


    // Instantiate Particles
    function initParticles() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const NUM_PARTICLES = Math.floor(canvas.width * canvas.height * DENSITY_PARTICLES)

        particles = []
        for (let i = 0; i < NUM_PARTICLES; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            particles.push(new Particle(x, y));
        }
    }


    function drawConnections() {
        for (let i = 0; i < particles.length - 1; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];

                const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);

                if (distance < MAX_DISTANCE) {
                    const opacity = 1 - distance / MAX_DISTANCE;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 1;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }


    // Main loop for the animation
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawConnections();
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationFrameId = requestAnimationFrame(animate);
    }

    const debouncedInitParticles = debounce(initParticles, 100)
    window.addEventListener('resize', debouncedInitParticles);

    initParticles();
    animate();
});