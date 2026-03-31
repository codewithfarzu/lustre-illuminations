// ===================================
// Brands Swiper Carousel (projects.html only)
// ===================================
if (document.querySelector('.brands-swiper')) {
    new Swiper('.brands-swiper', {
        slidesPerView: 4,
        spaceBetween: 24,
        loop: true,
        autoplay: { delay: 2000, disableOnInteraction: false },
        pagination: { el: '.brands-pagination', clickable: true },
        navigation: { nextEl: '.brands-next', prevEl: '.brands-prev' },
        breakpoints: {
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
        }
    });
}

if (document.querySelector('.brands-swiper-2')) {
    new Swiper('.brands-swiper-2', {
        slidesPerView: 4,
        spaceBetween: 24,
        loop: true,
        dir: 'rtl',
        autoplay: { delay: 2000, disableOnInteraction: false },
        pagination: { el: '.brands-pagination-2', clickable: true },
        navigation: { nextEl: '.brands-next-2', prevEl: '.brands-prev-2' },
        breakpoints: {
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
        }
    });
}

// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================
document.addEventListener('DOMContentLoaded', function () {

    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navCta = document.querySelector('.nav-cta');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.has-dropdown');
    const body = document.body;

    // ---- Mobile Menu Toggle ----
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (navCta) navCta.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
    }

    // ---- Dropdown: mobile click / desktop hover ----
    function handleMouseEnter() { this.classList.add('active'); }
    function handleMouseLeave() { this.classList.remove('active'); }

    function attachHover() {
        dropdownItems.forEach(item => {
            item.addEventListener('mouseenter', handleMouseEnter);
            item.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    function detachHover() {
        dropdownItems.forEach(item => {
            item.removeEventListener('mouseenter', handleMouseEnter);
            item.removeEventListener('mouseleave', handleMouseLeave);
        });
    }

    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        if (!link) return;

        link.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                const isOpen = item.classList.contains('active');
                // Close all dropdowns first
                dropdownItems.forEach(d => d.classList.remove('active'));
                // Toggle current
                if (!isOpen) item.classList.add('active');
            }
        });
    });

    // Initial desktop hover setup
    if (window.innerWidth > 768) attachHover();

    // Re-evaluate on resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            dropdownItems.forEach(d => d.classList.remove('active'));
            attachHover();
        } else {
            detachHover();
        }
    });

    // ---- Close menu on regular nav link click ----
    navLinks.forEach(link => {
        const parentItem = link.closest('.nav-item');
        const isDropdown = parentItem && parentItem.classList.contains('has-dropdown');
        if (isDropdown) return;

        link.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                if (navCta) navCta.classList.remove('active');
                body.classList.remove('menu-open');
            }
            navLinks.forEach(l => {
                const p = l.closest('.nav-item');
                if (!p || !p.classList.contains('has-dropdown')) l.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // ---- Close menu on dropdown item click ----
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                if (navCta) navCta.classList.remove('active');
                body.classList.remove('menu-open');
                dropdownItems.forEach(d => d.classList.remove('active'));
            }
        });
    });

    // ---- Close menu on outside click ----
    document.addEventListener('click', function (e) {
        if (!navMenu || !navToggle) return;
        const insideNav = navMenu.contains(e.target);
        const insideToggle = navToggle.contains(e.target);
        const insideCta = navCta && navCta.contains(e.target);

        if (!insideNav && !insideToggle && !insideCta && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            if (navCta) navCta.classList.remove('active');
            body.classList.remove('menu-open');
            dropdownItems.forEach(d => d.classList.remove('active'));
        }
    });

    // ---- Navbar scroll effect ----
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            navbar.classList.toggle('scrolled', window.pageYOffset > 100);
        });
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target && navbar) {
                window.scrollTo({
                    top: target.offsetTop - navbar.offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Active link on scroll ----
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function () {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (scrollY > top && scrollY <= bottom && link) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
});

// ===================================
// PRODUCT IMAGE HOVER SWAP
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    const productImages = document.querySelectorAll('.product-image img[data-hover]');

    productImages.forEach(img => {
        const originalSrc = img.src;
        const hoverSrc = img.getAttribute('data-hover');

        img.parentElement.addEventListener('mouseenter', function () { img.src = hoverSrc; });
        img.parentElement.addEventListener('mouseleave', function () { img.src = originalSrc; });

        // Show hover image on mobile
        if (window.matchMedia('(max-width: 992px)').matches) {
            img.src = hoverSrc;
        }
    });
});

// ===================================
// SCROLL TO TOP BUTTON
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (!scrollToTopBtn) return;

    window.addEventListener('scroll', function () {
        scrollToTopBtn.classList.toggle('show', window.pageYOffset > 300);
    });

    scrollToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
