// Particle animation for all sections
        const canvases = {
            home: document.getElementById('bgCanvas'),
            projects: document.createElement('canvas'),
            skills: document.createElement('canvas'),
            education: document.createElement('canvas'),
            experience: document.createElement('canvas'),
            contact: document.getElementById('contactCanvas'),
            footer: document.createElement('canvas')
        };

        const sections = ['projects', 'skills', 'education', 'experience', 'contact', 'footer'];

        document.addEventListener('DOMContentLoaded', () => {
            // Initialize and append canvases
            sections.forEach(section => {
                canvases[section].id = `${section}Canvas`;
                canvases[section].className = 'section-canvas';
                const sectionElement = document.querySelector(`#${section}`);
                if (sectionElement) {
                    sectionElement.appendChild(canvases[section]);
                }
            });

            function resizeCanvas() {
                Object.values(canvases).forEach(canvas => {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                });
            }

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            const particlesArray = {};
            const particleCount = 50;

            class Particle {
                constructor(canvas) {
                    this.canvas = canvas;
                    this.ctx = canvas.getContext('2d');
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2 + 1;
                    this.speedX = Math.random() * 1 - 0.5;
                    this.speedY = Math.random() * 1 - 0.5;
                    this.color = `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.2})`;
                }

                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;

                    if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
                    if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;

                    if (this.size > 0.5) this.size -= 0.01;
                }

                draw() {
                    this.ctx.fillStyle = this.color;
                    this.ctx.beginPath();
                    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }

            function initParticles(section) {
                particlesArray[section] = [];
                for (let i = 0; i < particleCount; i++) {
                    particlesArray[section].push(new Particle(canvases[section]));
                }
            }

            function animateParticles(section) {
                const ctx = canvases[section].getContext('2d');
                ctx.clearRect(0, 0, canvases[section].width, canvases[section].height);
                for (let i = 0; i < particlesArray[section].length; i++) {
                    particlesArray[section][i].update();
                    particlesArray[section][i].draw();

                    for (let j = i; j < particlesArray[section].length; j++) {
                        const dx = particlesArray[section][i].x - particlesArray[section][j].x;
                        const dy = particlesArray[section][i].y - particlesArray[section][j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 80) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 / distance})`;
                            ctx.lineWidth = 0.5;
                            ctx.moveTo(particlesArray[section][i].x, particlesArray[section][i].y);
                            ctx.lineTo(particlesArray[section][j].x, particlesArray[section][j].y);
                            ctx.stroke();
                        }
                    }

                    if (particlesArray[section][i].size <= 0.5) {
                        particlesArray[section].splice(i, 1);
                        i--;
                        particlesArray[section].push(new Particle(canvases[section]));
                    }
                }
                requestAnimationFrame(() => animateParticles(section));
            }

            Object.keys(canvases).forEach(section => {
                initParticles(section);
                animateParticles(section);
            });

            // Theme toggle
            const themeToggle = document.getElementById('theme-toggle');
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-theme');
                if (document.body.classList.contains('light-theme')) {
                    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                } else {
                    themeToggle.innerHTML = '<i class="fas fa-adjust"></i>';
                }
            });

            // Enhanced scroll animation for timeline and skills
            window.addEventListener('scroll', () => {
                const header = document.querySelector('header');
                const homeTitle = document.querySelector('.home-content h1');
                const titleTop = homeTitle.getBoundingClientRect().top + window.pageYOffset;
                const scrollPosition = window.pageYOffset;
                const viewportHeight = window.innerHeight;

                if (scrollPosition >= titleTop + homeTitle.offsetHeight) {
                    header.style.opacity = '0';
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.opacity = '1';
                    header.style.transform = 'translateY(0)';
                }

                const timelineComponents = document.querySelectorAll('.timeline_component');
                timelineComponents.forEach(component => {
                    const componentTop = component.getBoundingClientRect().top + window.pageYOffset;
                    const componentHeight = component.offsetHeight;

                    let progress = 0;
                    if (scrollPosition + viewportHeight > componentTop) {
                        const scrolledDistance = scrollPosition + viewportHeight - componentTop;
                        progress = Math.min((scrolledDistance / componentHeight) * 100, 100);
                    }
                    progress = Math.max(progress, 0);

                    component.querySelector('.timeline_progress-bar').style.height = `${progress}%`;

                    const items = component.querySelectorAll('.timeline_item');
                    items.forEach(item => {
                        const itemTop = item.getBoundingClientRect().top;
                        if (itemTop < viewportHeight * 0.8 && !item.classList.contains('visible')) {
                            item.classList.add('visible');
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 50);
                        }
                    });
                });

                const skillCards = document.querySelectorAll('.skill-card');
                skillCards.forEach(card => {
                    const cardTop = card.getBoundingClientRect().top;
                    const progressBar = card.querySelector('.progress-bar');
                    const progressValue = card.getAttribute('data-progress');

                    if (cardTop < window.innerHeight * 0.8 && !progressBar.classList.contains('animated')) {
                        progressBar.style.width = `${progressValue}%`;
                        progressBar.classList.add('animated');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    }
                });

                const sectionTitles = document.querySelectorAll('.section-title');
                sectionTitles.forEach(title => {
                    const titleTop = title.getBoundingClientRect().top;
                    if (titleTop < window.innerHeight * 0.8 && !title.classList.contains('animated')) {
                        title.classList.add('animated');
                        setTimeout(() => {
                            title.style.opacity = '1';
                            title.style.transform = 'translateY(0)';
                        }, 100);
                    }
                });
            });

            const socialIcons = document.querySelectorAll('.social-icons a');
            let lastClickTime = 0;
            const debounceDelay = 300;

            socialIcons.forEach(icon => {
                icon.addEventListener('click', (e) => {
                    const now = Date.now();
                    if (now - lastClickTime < debounceDelay) {
                        e.preventDefault();
                        return;
                    }
                    lastClickTime = now;

                    const href = icon.getAttribute('data-href');
                    if (href) {
                        e.preventDefault();
                        window.open(href, '_blank');
                    }
                });

                icon.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const href = icon.getAttribute('data-href');
                    if (href) {
                        window.open(href, '_blank');
                    }
                });
            });
        });
