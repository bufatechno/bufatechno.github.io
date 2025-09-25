// ======== PERFORMANCE OPTIMIZATIONS ========
let isLowEndDevice = false;
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
let resizeTimeout;
let scrollTimeout;
let animationFrameId;

// Detect low-end devices
function detectLowEndDevice() {
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    return memory < 4 || cores < 4;
}

isLowEndDevice = detectLowEndDevice();

// ======== INITIALIZATION ========
document.addEventListener('DOMContentLoaded', function() {
    // Set current year automatically
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize AOS with performance settings
    AOS.init({
        duration: isLowEndDevice ? 500 : 700,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        disable: isLowEndDevice ? 'mobile' : false
    });
    
    // Initialize Three.js with delay
    setTimeout(initThree, 800);
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Hide loader when page is loaded
    window.addEventListener('load', hideLoader);
    
    // Performance monitoring
    if ('performance' in window) {
        monitorPerformance();
    }
});

// ======== LOADING SCREEN ========
function hideLoader() {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, isLowEndDevice ? 1200 : 800);
}

// ======== SCROLL EFFECTS ========
function initializeScrollEffects() {
    // Navbar scroll effect with throttling
    window.addEventListener('scroll', throttle(() => {
        updateNavbar();
        updateScrollProgress();
        updateBackToTopButton();
        updateScrollIndicator();
        updateParallax();
    }, 16));
    
    // Smooth scrolling with performance optimization
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function updateNavbar() {
    const navbar = document.getElementById('navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrollPercentage + '%';
}

function updateBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 250) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
}

function updateScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (!scrollIndicator) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 80) {
        scrollIndicator.style.opacity = '0';
    } else {
        scrollIndicator.style.opacity = '0.7';
    }
}

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');

    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// ======== INTERACTIVE ELEMENTS ========
function initializeInteractiveElements() {
    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Scroll indicator click
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.getElementById('about').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Card hover effect
    document.querySelectorAll('.app-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'perspective(1000px) rotateX(-5deg) translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) translateY(0) scale(1)';
        });
    });
    
    // Interactive Cursor - only for non-touch devices
    if (!isTouchDevice) {
        initializeInteractiveCursor();
    }
    
    // Navbar active link with IntersectionObserver
    initializeActiveNavLink();
    
    // Fold/Unfold sections on scroll with IntersectionObserver
    initializeFoldSections();
    
    // About text animation with IntersectionObserver
    initializeAboutTextAnimation();
    
    // Mobile Navbar Enhancements
    initializeMobileNavbar();
}

// ======== NAVIGATION ========
function initializeActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const navObserverOptions = {
        threshold: 0.1,
        rootMargin: '-45% 0px -45% 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        let current = '';
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                current = entry.target.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });
}

function initializeMobileNavbar() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.querySelector('body');
    
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            if (navbarCollapse) {
                navbarCollapse.classList.toggle('show');
                
                if (navbarCollapse.classList.contains('show')) {
                    body.style.overflow = 'hidden';
                    body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
                } else {
                    body.style.overflow = '';
                    body.style.paddingRight = '';
                }
            }
        });
    }
    
    // Close navbar when clicking outside with debouncing
    document.addEventListener('click', function(event) {
        if (!navbarToggler || !navbarCollapse) return;
        
        const isClickInsideNavbar = navbarCollapse.contains(event.target) || navbarToggler.contains(event.target);
        
        if (!isClickInsideNavbar && navbarCollapse.classList.contains('show')) {
            clearTimeout(clickTimeout);
            clickTimeout = setTimeout(() => {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
                body.style.paddingRight = '';
            }, 10);
        }
    });
    
    // Close navbar when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!navbarCollapse) return;
            
            if (navbarCollapse.classList.contains('show')) {
                setTimeout(() => {
                    navbarCollapse.classList.remove('show');
                    if (navbarToggler) {
                        navbarToggler.setAttribute('aria-expanded', 'false');
                    }
                    body.style.overflow = '';
                    body.style.paddingRight = '';
                }, 150);
            }
        });
    });
    
    // Close navbar when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (!navbarCollapse || !navbarToggler) return;
        
        if (event.key === 'Escape' && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
            navbarToggler.setAttribute('aria-expanded', 'false');
            navbarToggler.focus();
            body.style.overflow = '';
            body.style.paddingRight = '';
        }
    });
    
    // Handle window resize with throttling
    window.addEventListener('resize', throttle(() => {
        if (!navbarCollapse || !navbarToggler) return;
        
        if (navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
            navbarToggler.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
            body.style.paddingRight = '';
        }
        
        if (window.innerWidth > 992) {
            body.style.overflow = '';
            body.style.paddingRight = '';
        }
    }, 100));
}

// ======== ANIMATIONS ========
function initializeFoldSections() {
    const sections = document.querySelectorAll('.fold-section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.id !== 'home') {
            section.classList.add('hidden');
        }
        sectionObserver.observe(section);
    });
}

function initializeAboutTextAnimation() {
    const aboutParagraphs = document.querySelectorAll('.about-text p');
    const textObserverOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
            }
        });
    }, textObserverOptions);

    aboutParagraphs.forEach(paragraph => {
        textObserver.observe(paragraph);
    });
}

// ======== INTERACTIVE CURSOR ========
function initializeInteractiveCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            const speed = 0.18;

            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;

            followerX += (mouseX - followerX) * (speed * 0.5);
            followerY += (mouseY - followerY) * (speed * 0.5);

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';

            animationFrameId = requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .app-card, .social-link');

        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.4)';
                cursorFollower.style.transform = 'scale(1.4)';
            });

            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
            });
        });
    }
}

// ======== THREE.JS BACKGROUND ========
let scene, camera, renderer, geometry, material, mesh;
let threeInitialized = false;

function initThree() {
    if (isLowEndDevice || threeInitialized) return;

    try {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isLowEndDevice });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(isLowEndDevice ? 1 : window.devicePixelRatio);
        document.getElementById('three-container').appendChild(renderer.domElement);

        // Create a wireframe cube
        geometry = new THREE.BoxGeometry(4, 4, 4);
        material = new THREE.MeshBasicMaterial({
            color: 0xc91414,
            wireframe: true,
            transparent: true,
            opacity: 0.08
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        camera.position.z = 9;

        threeInitialized = true;
        animateThree();
    } catch (error) {
        console.warn('Three.js initialization failed:', error);
    }
}

function animateThree() {
    if (!threeInitialized) return;

    requestAnimationFrame(animateThree);
    mesh.rotation.x += 0.004;
    mesh.rotation.y += 0.004;
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if (!threeInitialized) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ======== PARTICLES.JS ========
if (!isLowEndDevice) {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: isLowEndDevice ? 25 : 70,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#c91414'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 2.5,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: isLowEndDevice ? 90 : 140,
                color: '#c91414',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: isLowEndDevice ? 0.8 : 1.8,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: !isTouchDevice,
                    mode: 'grab'
                },
                onclick: {
                    enable: !isTouchDevice,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 130,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 380,
                    size: 38,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 190,
                    duration: 0.4
                },
                push: {
                    particles_nb: 3
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

// ======== MATRIX RAIN EFFECT ========
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

if (canvas && ctx) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");

    const fontSize = 9;
    const columns = canvas.width / fontSize;

    const drops = [];
    for(let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(201, 20, 20, 0.08)';
        ctx.font = fontSize + 'px monospace';

        for(let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    const matrixInterval = setInterval(drawMatrix, isLowEndDevice ? 45 : 30);
}

// ======== DIGITAL RAIN EFFECT ========
const digitalCanvas = document.getElementById('digitalRain');
const digitalCtx = digitalCanvas.getContext('2d');

if (digitalCanvas && digitalCtx) {
    digitalCanvas.width = window.innerWidth;
    digitalCanvas.height = window.innerHeight;

    const binary = "01";
    const binaryArray = binary.split("");

    const binaryFontSize = 7;
    const binaryColumns = digitalCanvas.width / binaryFontSize;

    const binaryDrops = [];
    for(let x = 0; x < binaryColumns; x++) {
        binaryDrops[x] = 1;
    }

    function drawDigitalRain() {
        digitalCtx.fillStyle = 'rgba(0, 0, 0, 0.045)';
        digitalCtx.fillRect(0, 0, digitalCanvas.width, digitalCanvas.height);

        digitalCtx.fillStyle = 'rgba(201, 20, 20, 0.04)';
        digitalCtx.font = binaryFontSize + 'px monospace';

        for(let i = 0; i < binaryDrops.length; i++) {
            const text = binaryArray[Math.floor(Math.random() * binaryArray.length)];
            digitalCtx.fillText(text, i * binaryFontSize, binaryDrops[i] * binaryFontSize);

            if(binaryDrops[i] * binaryFontSize > digitalCanvas.height && Math.random() > 0.975) {
                binaryDrops[i] = 0;
            }
            binaryDrops[i]++;
        }
    }

    const digitalInterval = setInterval(drawDigitalRain, isLowEndDevice ? 60 : 45);
}

// ======== RESIZE HANDLING ========
window.addEventListener('resize', throttle(() => {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    if (digitalCanvas) {
        digitalCanvas.width = window.innerWidth;
        digitalCanvas.height = window.innerHeight;
    }
}, 200));

// ======== PERFORMANCE MONITORING ========
function monitorPerformance() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);

            if (pageLoadTime > 2500) {
                console.warn('Page load time is high, consider optimizing further');
            }
        }, 0);
    });
}

// ======== CLEANUP ========
window.addEventListener('beforeunload', () => {
    // Clear intervals
    if (window.matrixInterval) {
        clearInterval(window.matrixInterval);
    }
    if (window.digitalInterval) {
        clearInterval(window.digitalInterval);
    }
    
    // Cancel animation frames
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Remove event listeners
    window.removeEventListener('scroll', updateNavbar);
    window.removeEventListener('scroll', updateScrollProgress);
    window.removeEventListener('scroll', updateBackToTopButton);
    window.removeEventListener('scroll', updateScrollIndicator);
    window.removeEventListener('scroll', updateParallax);
});

// ======== THROTTLE FUNCTION ========
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ======== DEBOUNCE FUNCTION ========
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    }
}
