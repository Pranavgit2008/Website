// MOBILE-FIRST Portfolio System - Comprehensive Optimization
class MobileOptimizedPortfolio {
  constructor() {
    this.isLoaded = false;
    this.observers = new Set();
    this.mouse = { x: 0, y: 0 };
    this.sectionOffsets = new Map();
    this.isMobile = window.innerWidth <= 768;
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.init();
  }

  async init() {
    this.preCalculateSections();
    await this.waitForLoadComplete();
    this.setupDeviceOptimizations();
    !this.isMobile && this.setupCursor();
    this.setupDynamicIsland();
    this.setupInstantNavigation();
    this.setupScrollAnimations();
    !this.isMobile && this.setupParticles();
    this.setupMobileOptimizations();
    this.startAnimations();
  }

  preCalculateSections() {
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      this.sectionOffsets.set(section.id, section.offsetTop - (this.isMobile ? 80 : 100));
    });

    window.addEventListener('resize', () => {
      sections.forEach(section => {
        this.sectionOffsets.set(section.id, section.offsetTop - (this.isMobile ? 80 : 100));
      });
    });
  }

  async waitForLoadComplete() {
    const promises = [
      new Promise(resolve => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', resolve);
      }),
      document.fonts?.ready || Promise.resolve()
    ];

    await Promise.all(promises);

    return new Promise(resolve => {
      setTimeout(() => {
        document.body.classList.remove('loading');
        this.isLoaded = true;
        resolve();
      }, this.isMobile ? 100 : 200);
    });
  }

  setupDeviceOptimizations() {
    // Set device-specific CSS variables
    if (this.isMobile) {
      document.documentElement.style.setProperty('--device-multiplier', '0.8');
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
    }

    // Disable animations on low-power devices
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        if (battery.level < 0.2) {
          document.body.classList.add('power-save');
        }
      });
    }

    // Network-aware optimizations
    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        document.body.classList.add('slow-connection');
        // Disable heavy animations
        document.querySelectorAll('.particles-canvas').forEach(el => el.style.display = 'none');
      }
    }
  }

  setupCursor() {
    if (this.isMobile || this.isTouch) return;

    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;

    const updateCursor = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      cursor.style.left = targetX + 'px';
      cursor.style.top = targetY + 'px';
      follower.style.left = currentX + 'px';
      follower.style.top = currentY + 'px';

      requestAnimationFrame(updateCursor);
    };

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursor.classList.add('visible');
    });

    updateCursor();
  }

  setupDynamicIsland() {
    const island = document.getElementById('dynamic-island');

    setTimeout(() => {
      island.classList.add('show');
    }, this.isMobile ? 500 : 800);

    setTimeout(() => {
      island.classList.remove('show');
    }, this.isMobile ? 2000 : 3000);
  }

  setupInstantNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    // Ultra-fast scroll for mobile
    const instantScrollTo = (target) => {
      const start = window.scrollY;
      const distance = target - start;
      const duration = this.isMobile ? Math.min(Math.abs(distance) * 0.3, 400) : Math.min(Math.abs(distance) * 0.5, 800);
      const startTime = performance.now();

      const easeOutQuart = t => 1 - (--t) * t * t * t;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);

        window.scrollTo(0, start + distance * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    navLinks.forEach(link => {
      // Touch-optimized event handling
      const handleNavigation = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const targetSection = link.dataset.section;
        const targetOffset = this.sectionOffsets.get(targetSection);

        if (targetOffset !== undefined) {
          instantScrollTo(targetOffset);

          // Instant feedback
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          // Haptic feedback on supported devices
          if ('vibrate' in navigator && this.isTouch) {
            navigator.vibrate(50);
          }
        }
      };

      if (this.isTouch) {
        link.addEventListener('touchstart', handleNavigation, { passive: false });
      } else {
        link.addEventListener('click', handleNavigation);
      }
    });

    // Optimized scroll tracking
    const updateActiveNav = () => {
      if (!this.isLoaded) return;

      let current = 'home';
      const scrollPosition = window.scrollY + (this.isMobile ? 100 : 150);

      this.sectionOffsets.forEach((offset, sectionId) => {
        if (scrollPosition >= offset) {
          current = sectionId;
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === current) {
          link.classList.add('active');
        }
      });
    };

    // Mobile-optimized scroll listener
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveNav();
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && this.isLoaded) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: this.isMobile ? 0.05 : 0.1,
      rootMargin: this.isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    this.observers.add(observer);
  }

  setupParticles() {
    if (this.isMobile) return;

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 30; // Reduced for performance
    const particleSpeed = 0.40; //Speed

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = (Math.random() - 0.5) * particleSpeed; 
        this.vy = (Math.random() - 0.5) * particleSpeed;

        this.size = Math.random() * 1.2 + 0.8;
        this.alpha = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 122, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Pause animation when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });
  }

  setupMobileOptimizations() {
    if (!this.isMobile) return;

    // Touch event optimizations
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });

    // Prevent zoom on double tap for specific elements
    const preventZoomElements = document.querySelectorAll('.nav-link, .project-link, .social-link');
    preventZoomElements.forEach(el => {
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        el.click();
      });
    });

    // Mobile-specific performance monitoring
    let lastScrollTime = Date.now();
    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - lastScrollTime > 16) { // Ensure 60fps
        lastScrollTime = now;
      }
    }, { passive: true });

    // Safe area optimizations for devices with notches
    if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
      document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
      document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
    }
  }

  startAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      setTimeout(() => {
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
      }, this.isMobile ? 200 : 300);
    }
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
  }
}

// Initialize mobile-optimized portfolio
const portfolio = new MobileOptimizedPortfolio();

// Error handling
window.addEventListener('error', (e) => {
  console.warn('Handled gracefully:', e.message);
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  portfolio.cleanup();
});

// PWA-like features for mobile
if ('serviceWorker' in navigator && window.innerWidth <= 768) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Fail silently
    });
  });
}
