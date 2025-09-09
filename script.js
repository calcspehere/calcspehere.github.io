// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle icon
        const icon = this.themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Update toggle button aria-label
        this.themeToggle.setAttribute('aria-label', 
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add a nice transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Header scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Smooth scrolling for anchor links
        this.setupSmoothScrolling();
        
        // Active section highlighting
        this.setupActiveSection();
    }

    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.header.style.background = scrolled 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(255, 255, 255, 0.95)';
        
        // Update for dark theme
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            this.header.style.background = scrolled 
                ? 'rgba(15, 23, 42, 0.98)' 
                : 'rgba(15, 23, 42, 0.95)';
        }
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        const headerHeight = this.header.offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            }
        });
    }

    setupActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const navLink = document.querySelector(`a[href="#${entry.target.id}"]`);
                if (navLink) {
                    if (entry.isIntersecting) {
                        document.querySelectorAll('.nav-link').forEach(link => 
                            link.classList.remove('active'));
                        navLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });

        sections.forEach(section => observer.observe(section));
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupCardHoverEffects();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Animate elements on scroll
        const animateElements = document.querySelectorAll(
            '.calculator-card, .article-card, .tutorial-card, .section-header'
        );
        
        animateElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const suffix = element.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 100;
        const duration = 2000;
        const stepTime = duration / 100;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, stepTime);
    }

    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.calculator-card, .article-card, .tutorial-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                this.addRippleEffect(card);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
            
            // Add click animation
            card.addEventListener('click', (e) => {
                this.createClickEffect(e, card);
            });
        });
    }

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(99, 102, 241, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        ripple.style.pointerEvents = 'none';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createClickEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const clickEffect = document.createElement('div');
        clickEffect.style.position = 'absolute';
        clickEffect.style.left = x + 'px';
        clickEffect.style.top = y + 'px';
        clickEffect.style.width = '10px';
        clickEffect.style.height = '10px';
        clickEffect.style.borderRadius = '50%';
        clickEffect.style.background = 'var(--primary-color)';
        clickEffect.style.transform = 'scale(0)';
        clickEffect.style.animation = 'clickPulse 0.4s ease-out';
        clickEffect.style.pointerEvents = 'none';
        clickEffect.style.zIndex = '1000';
        
        element.appendChild(clickEffect);
        
        setTimeout(() => {
            clickEffect.remove();
        }, 400);
    }
}

// Search Functionality
class SearchManager {
    constructor() {
        this.searchData = this.generateSearchData();
        this.searchToggle = document.getElementById('searchToggle');
        this.searchDropdown = document.getElementById('searchDropdown');
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        this.init();
    }

    init() {
        if (!this.searchToggle || !this.searchDropdown || !this.searchInput) return;

        // Toggle search dropdown
        this.searchToggle.addEventListener('click', () => {
            this.toggleSearchDropdown();
        });

        // Handle search input
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.closeSearchDropdown();
            }
        });

        // Handle keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearchDropdown();
            }
        });
    }

    generateSearchData() {
        return [
            // Calculators
            {
                type: 'calculator',
                title: 'Basic Calculator',
                description: 'Perform basic arithmetic operations with our user-friendly calculator.',
                url: 'calculators/basic-calculator.html',
                icon: 'fas fa-calculator'
            },
            {
                type: 'calculator',
                title: 'Scientific Calculator',
                description: 'Advanced mathematical functions including trigonometry and logarithms.',
                url: '#',
                icon: 'fas fa-square-root-alt'
            },
            {
                type: 'calculator',
                title: 'Percentage Calculator',
                description: 'Calculate percentages, percentage increase, and percentage decrease easily.',
                url: 'calculators/percentage-calculator.html',
                icon: 'fas fa-percent'
            },
            {
                type: 'calculator',
                title: 'Compound Interest Calculator',
                description: 'Calculate compound interest for investments and savings planning.',
                url: 'calculators/compound-interest-calculator.html',
                icon: 'fas fa-chart-line'
            },
            {
                type: 'calculator',
                title: 'Unit Converter',
                description: 'Convert between different units of measurement quickly and accurately.',
                url: '#',
                icon: 'fas fa-ruler'
            },
            {
                type: 'calculator',
                title: 'Geometry Calculator',
                description: 'Calculate area, perimeter, and volume for various geometric shapes.',
                url: '#',
                icon: 'fas fa-shapes'
            },
            // Articles
            {
                type: 'article',
                title: 'Understanding Compound Interest: A Complete Guide',
                description: 'Learn how compound interest works and discover strategies to maximize your investments and savings growth over time.',
                url: 'articles/understanding-compound-interest.html',
                icon: 'fas fa-book'
            },
            {
                type: 'article',
                title: 'Essential Geometry Formulas Every Student Should Know',
                description: 'A comprehensive collection of geometry formulas for calculating area, perimeter, volume, and surface area of common shapes.',
                url: 'articles/geometry-formulas-guide.html',
                icon: 'fas fa-book'
            },
            {
                type: 'article',
                title: 'Quadratic Equations Explained: Methods and Applications',
                description: 'Master quadratic equations with step-by-step explanations, multiple solving methods, and real-world applications.',
                url: 'articles/geometry-formulas-guide.html',
                icon: 'fas fa-book'
            },
            {
                type: 'article',
                title: 'Probability Basics: From Theory to Practice',
                description: 'Understand probability concepts, learn calculation methods, and explore practical applications in everyday life.',
                url: 'articles/probability-basics.html',
                icon: 'fas fa-book'
            },
            {
                type: 'article',
                title: 'Introduction to Derivatives: Concepts and Applications',
                description: 'Learn the fundamentals of derivatives, including rules, techniques, and real-world applications in various fields.',
                url: 'articles/derivatives-introduction.html',
                icon: 'fas fa-book'
            },
            {
                type: 'article',
                title: 'Financial Mathematics: Making Smart Money Decisions',
                description: 'Explore mathematical concepts behind personal finance, including loans, mortgages, and investment calculations.',
                url: 'articles/financial-mathematics.html',
                icon: 'fas fa-book'
            }
        ];
    }

    toggleSearchDropdown() {
        const isActive = this.searchDropdown.classList.contains('active');
        if (isActive) {
            this.closeSearchDropdown();
        } else {
            this.openSearchDropdown();
        }
    }

    openSearchDropdown() {
        this.searchDropdown.classList.add('active');
        this.searchInput.focus();
        this.displayInitialResults();
    }

    closeSearchDropdown() {
        this.searchDropdown.classList.remove('active');
        this.searchInput.value = '';
        this.searchResults.innerHTML = '';
    }

    displayInitialResults() {
        const recentItems = this.searchData.slice(0, 6);
        this.displayResults(recentItems, 'Popular items');
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.displayInitialResults();
            return;
        }

        const results = this.searchData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length > 0) {
            this.displayResults(results, `Found ${results.length} result${results.length > 1 ? 's' : ''}`);
        } else {
            this.displayNoResults(query);
        }
    }

    displayResults(results, title) {
        const resultsHTML = results.map(item => `
            <div class="search-result-item" onclick="window.location.href='${item.url}'">
                <div class="search-result-title">
                    <i class="${item.icon}" style="margin-right: 0.5rem; color: var(--primary-color);"></i>
                    ${item.title}
                </div>
                <div class="search-result-description">${item.description}</div>
                <span class="search-result-type">${item.type}</span>
            </div>
        `).join('');

        this.searchResults.innerHTML = `
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">
                ${title}
            </div>
            ${resultsHTML}
        `;
    }

    displayNoResults(query) {
        this.searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <div>No results found for "${query}"</div>
                <div style="font-size: 0.8rem; margin-top: 0.5rem;">Try searching for calculators, articles, or mathematical terms</div>
            </div>
        `;
    }
}

// Performance Optimization
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.preloadCriticalResources();
    }

    setupLazyLoading() {
        // Lazy load images when they come into view
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupImageOptimization() {
        // Add loading="lazy" to images below the fold
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (index > 2) { // Skip first few images
                img.loading = 'lazy';
            }
        });
    }

    preloadCriticalResources() {
        // Preload critical CSS and fonts
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
}

// Analytics and Tracking
class AnalyticsManager {
    constructor() {
        this.init();
    }

    init() {
        this.trackPageViews();
        this.trackUserInteractions();
        this.trackScrollDepth();
    }

    trackPageViews() {
        // Track page views (placeholder for actual analytics)
        console.log('Page view tracked:', window.location.pathname);
    }

    trackUserInteractions() {
        // Track button clicks and form submissions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, .card-link, .nav-link')) {
                console.log('Interaction tracked:', e.target.textContent.trim());
            }
        });
    }

    trackScrollDepth() {
        let maxScroll = 0;
        const trackingPoints = [25, 50, 75, 100];
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                trackingPoints.forEach(point => {
                    if (scrollPercent >= point && maxScroll >= point) {
                        console.log(`Scroll depth tracked: ${point}%`);
                    }
                });
            }
        });
    }
}

// SEO and Accessibility Manager
class SEOManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateMetaTags();
        this.setupStructuredData();
        this.improveAccessibility();
    }

    updateMetaTags() {
        // Update meta description based on current page
        const currentSection = this.getCurrentSection();
        if (currentSection) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription && currentSection !== 'home') {
                // Update description based on section
                const descriptions = {
                    calculators: 'Explore our comprehensive collection of mathematical calculators including basic, scientific, percentage, and geometry calculators.',
                    articles: 'Read educational articles about mathematics, including guides on compound interest, geometry formulas, and algebraic concepts.',
                    tutorials: 'Learn mathematics with our interactive tutorials covering basic arithmetic, fractions, decimals, and algebraic expressions.',
                    about: 'Learn about CalcSphere, your ultimate destination for mathematical calculations, tools, and educational resources.'
                };
                metaDescription.content = descriptions[currentSection] || metaDescription.content;
            }
        }
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                return section.id;
            }
        }
        return 'home';
    }

    setupStructuredData() {
        // Add structured data for better SEO
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "CalcSphere",
            "description": "Advanced mathematical tools and calculators",
            "url": window.location.origin,
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Any",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    improveAccessibility() {
        // Add ARIA labels and improve keyboard navigation
        const interactiveElements = document.querySelectorAll('button, a, input');
        interactiveElements.forEach(element => {
            if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
                element.setAttribute('aria-label', 'Interactive element');
            }
        });

        // Improve focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
}

// Error Handling and Monitoring
class ErrorManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupErrorHandling();
        this.setupPerformanceMonitoring();
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
            // In production, send to error tracking service
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            // In production, send to error tracking service
        });
    }

    setupPerformanceMonitoring() {
        // Monitor performance metrics
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        });
    }
}

// Scroll Reveal Animation Manager
class ScrollRevealManager {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.setupObserver();
        this.addRevealElements();
    }

    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    addRevealElements() {
        // Add reveal classes to elements
        const selectors = [
            '.calculator-card',
            '.article-card',
            '.tutorial-card',
            '.stats-item',
            '.feature-card',
            '.section-title',
            '.section-description'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                element.classList.add('reveal-on-scroll');
                element.style.animationDelay = `${index * 0.1}s`;
                this.observer.observe(element);
            });
        });
    }
}

// Parallax Effect Manager
class ParallaxManager {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.setupParallaxElements();
        this.bindScrollEvent();
    }

    setupParallaxElements() {
        const floatingElements = document.querySelectorAll('.floating-elements .floating-shape');
        floatingElements.forEach(element => {
            this.elements.push({
                element: element,
                speed: Math.random() * 0.5 + 0.2
            });
        });
    }

    bindScrollEvent() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateParallax() {
        const scrollTop = window.pageYOffset;
        
        this.elements.forEach(item => {
            const yPos = -(scrollTop * item.speed);
            item.element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ThemeManager();
    new NavigationManager();
    new AnimationManager();
    new SearchManager();
    new PerformanceManager();
    new ScrollRevealManager();
    new ParallaxManager();
    
    // Add loading complete class for CSS animations
    document.body.classList.add('loaded');
    
    // Initialize analytics
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID');
    }
    
    console.log('CalcSphere initialized successfully!');
});

// Utility Functions
function initializeTooltips() {
    const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
    elementsWithTooltips.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
