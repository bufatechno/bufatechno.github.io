// Performance optimizations
let isLowEndDevice = false;
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Detect low-end devices
function detectLowEndDevice() {
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    return memory < 4 || cores < 4;
}

isLowEndDevice = detectLowEndDevice();

// Set current year automatically
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Initialize AOS with performance settings
AOS.init({
    duration: isLowEndDevice ? 500 : 700, /* DIUBAH: 600 -> 500, 800 -> 700 */
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    disable: isLowEndDevice ? 'mobile' : false
});

// Particles.js Configuration - optimized for performance
if (!isLowEndDevice) {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: isLowEndDevice ? 25 : 70, /* DIUBAH: 30 -> 25, 80 -> 70 */
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
                value: 2.5, /* DIUBAH DARI 3 */
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
                distance: isLowEndDevice ? 90 : 140, /* DIUBAH: 100 -> 90, 150 -> 140 */
                color: '#c91414',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: isLowEndDevice ? 0.8 : 1.8, /* DIUBAH: 1 -> 0.8, 2 -> 1.8 */
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
                    distance: 130, /* DIUBAH DARI 140 */
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 380, /* DIUBAH DARI 400 */
                    size: 38, /* DIUBAH DARI 40 */
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 190, /* DIUBAH DARI 200 */
                    duration: 0.4
                },
                push: {
                    particles_nb: 3 /* DIUBAH DARI 4 */
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

// Three.js Background - optimized
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
        geometry = new THREE.BoxGeometry(4, 4, 4); /* DIUBAH DARI 5, 5, 5 */
        material = new THREE.MeshBasicMaterial({
            color: 0xc91414,
            wireframe: true,
            transparent: true,
            opacity: 0.08 /* DIUBAH DARI 0.1 */
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        camera.position.z = 9; /* DIUBAH DARI 10 */

        threeInitialized = true;
        animate();
    } catch (error) {
        console.warn('Three.js initialization failed:', error);
    }
}

function animate() {
    if (!threeInitialized) return;

    requestAnimationFrame(animate);
    mesh.rotation.x += 0.004; /* DIUBAH DARI 0.005 */
    mesh.rotation.y += 0.004; /* DIUBAH DARI 0.005 */
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if (!threeInitialized) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize Three.js with delay
setTimeout(initThree, 800); /* DIUBAH DARI 1000 */

// Matrix Rain Effect - optimized
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

if (canvas && ctx) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");

    const fontSize = 9; /* DIUBAH DARI 10 */
    const columns = canvas.width / fontSize;

    const drops = [];
    for(let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(201, 20, 20, 0.08)'; /* DIUBAH DARI 0.1 */
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

    const matrixInterval = setInterval(drawMatrix, isLowEndDevice ? 45 : 30); /* DIUBAH: 50 -> 45, 35 -> 30 */
}

// Digital Rain Effect - optimized
const digitalCanvas = document.getElementById('digitalRain');
const digitalCtx = digitalCanvas.getContext('2d');

if (digitalCanvas && digitalCtx) {
    digitalCanvas.width = window.innerWidth;
    digitalCanvas.height = window.innerHeight;

    const binary = "01";
    const binaryArray = binary.split("");

    const binaryFontSize = 7; /* DIUBAH DARI 8 */
    const binaryColumns = digitalCanvas.width / binaryFontSize;

    const binaryDrops = [];
    for(let x = 0; x < binaryColumns; x++) {
        binaryDrops[x] = 1;
    }

    function drawDigitalRain() {
        digitalCtx.fillStyle = 'rgba(0, 0, 0, 0.045)'; /* DIUBAH DARI 0.05 */
        digitalCtx.fillRect(0, 0, digitalCanvas.width, digitalCanvas.height);

        digitalCtx.fillStyle = 'rgba(201, 20, 20, 0.04)'; /* DIUBAH DARI 0.05 */
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

    const digitalInterval = setInterval(drawDigitalRain, isLowEndDevice ? 60 : 45); /* DIUBAH: 70 -> 60, 50 -> 45 */
}

// Resize canvases with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        if (digitalCanvas) {
            digitalCanvas.width = window.innerWidth;
            digitalCanvas.height = window.innerHeight;
        }
    }, 200); /* DIUBAH DARI 250 */
});

// Hide loader when page is loaded
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, isLowEndDevice ? 1200 : 800); /* DIUBAH: 1500 -> 1200, 1000 -> 800 */
});

// Navbar scroll effect with throttling
let lastScrollTop = 0;
let ticking = false;

function updateNavbar() {
    const navbar = document.getElementById('navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 40) { /* DIUBAH DARI 50 */
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
}

function requestTick() {
    if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

window.addEventListener('scroll', () => {
    lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    requestTick();
});

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

// Scroll Progress Indicator with throttling
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;

    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrollPercentage + '%';
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateScrollProgress);
});

// Back to top button with throttling
const backToTopButton = document.getElementById('backToTop');

function updateBackToTopButton() {
    if (!backToTopButton) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 250) { /* DIUBAH DARI 300 */
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateBackToTopButton);
});

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

// Hide scroll indicator after scrolling
function updateScrollIndicator() {
    if (!scrollIndicator) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 80) { /* DIUBAH DARI 100 */
        scrollIndicator.style.opacity = '0';
    } else {
        scrollIndicator.style.opacity = '0.7';
    }
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateScrollIndicator);
});

// Parallax effect with throttling
function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');

    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
});

// Fold/Unfold sections on scroll with IntersectionObserver
const sections = document.querySelectorAll('.fold-section');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px' /* DIUBAH DARI -100px */
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('hidden');
        }
    });
}, observerOptions);

sections.forEach(section => {
    // Initially hide all sections except the first one
    if (section.id !== 'home') {
        section.classList.add('hidden');
    }
    sectionObserver.observe(section);
});

// About text animation with IntersectionObserver
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
            }, index * 150); /* DIUBAH DARI 200 */
        }
    });
}, textObserverOptions);

aboutParagraphs.forEach(paragraph => {
    textObserver.observe(paragraph);
});

// Card hover effect
document.querySelectorAll('.app-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'perspective(1000px) rotateX(-5deg) translateY(-10px) scale(1.02)'; /* DIUBAH DARI -12px */
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) translateY(0) scale(1)';
    });
});

// Navbar active link with IntersectionObserver
const sectionsForNav = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserverOptions = {
    threshold: 0.1,
    rootMargin: '-45% 0px -45% 0px' // Trigger when section is in the middle
};

const navObserver = new IntersectionObserver((entries) => {
    let current = '';
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            current = entry.target.getAttribute('id');
        }
    });

    // Set active to the last intersecting section
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            console.log('Active section set to:', current);
        }
    });
}, navObserverOptions);

sectionsForNav.forEach(section => {
    navObserver.observe(section);
});

// Interactive Cursor - only for non-touch devices
if (!isTouchDevice) {
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
            const speed = 0.18; /* DIUBAH DARI 0.2 */

            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;

            followerX += (mouseX - followerX) * (speed * 0.5);
            followerY += (mouseY - followerY) * (speed * 0.5);

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .app-card, .social-link');

        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.4)'; /* DIUBAH DARI 1.5 */
                cursorFollower.style.transform = 'scale(1.4)'; /* DIUBAH DARI 1.5 */
            });

            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
            });
        });
    }
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);

            if (pageLoadTime > 2500) { /* DIUBAH DARI 3000 */
                console.warn('Page load time is high, consider optimizing further');
            }
        }, 0);
    });
}

// Cleanup event listeners on page unload
window.addEventListener('beforeunload', () => {
    // Clear intervals
    if (window.matrixInterval) {
        clearInterval(window.matrixInterval);
    }
    if (window.digitalInterval) {
        clearInterval(window.digitalInterval);
    }

    // Remove event listeners
    window.removeEventListener('scroll', updateNavbar);
    window.removeEventListener('scroll', updateScrollProgress);
    window.removeEventListener('scroll', updateBackToTopButton);
    window.removeEventListener('scroll', updateScrollIndicator);
    window.removeEventListener('scroll', updateParallax);
    window.removeEventListener('scroll', updateActiveNavLink);
});

// About section animation with IntersectionObserver
document.addEventListener('DOMContentLoaded', function() {
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const aboutObserverOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate about section
                    entry.target.classList.add('visible');
                }
            });
        }, aboutObserverOptions);

        aboutObserver.observe(aboutSection);
    }
});