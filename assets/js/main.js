// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================

document.addEventListener('DOMContentLoaded', function () {

    // Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navCta = document.querySelector('.nav-cta');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.has-dropdown');
    const body = document.body;

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (navCta) {
                navCta.classList.toggle('active');
            }
            body.classList.toggle('menu-open');
        });
    }

    // Handle dropdown toggle on mobile and hover on desktop
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');

        // Mobile click handler
        link.addEventListener('click', function (e) {
            // Only handle dropdown toggle on mobile
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();

                // Toggle this dropdown
                item.classList.toggle('active');

                // Close other dropdowns
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Don't remove active class from the link itself
                return false;
            }
        });

        // Desktop hover handlers
        if (window.innerWidth > 768) {
            item.addEventListener('mouseenter', function () {
                this.classList.add('active');
            });

            item.addEventListener('mouseleave', function () {
                this.classList.remove('active');
            });
        }
    });

    // Close menu when clicking on regular nav links (not dropdowns)
    navLinks.forEach(link => {
        const parentItem = link.closest('.nav-item');
        const isDropdown = parentItem && parentItem.classList.contains('has-dropdown');

        // Only close menu and update active state for non-dropdown links
        if (!isDropdown) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    if (navCta) {
                        navCta.classList.remove('active');
                    }
                    body.classList.remove('menu-open');
                }

                // Update active link only for non-dropdown links
                navLinks.forEach(l => {
                    const parent = l.closest('.nav-item');
                    if (!parent || !parent.classList.contains('has-dropdown')) {
                        l.classList.remove('active');
                    }
                });
                this.classList.add('active');
            });
        }
    });

    // Close menu when clicking on dropdown items
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                if (navCta) {
                    navCta.classList.remove('active');
                }
                body.classList.remove('menu-open');

                // Close all dropdowns
                dropdownItems.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = navToggle.contains(event.target);
        const isClickOnCta = navCta && navCta.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && !isClickOnCta && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            if (navCta) {
                navCta.classList.remove('active');
            }
            body.classList.remove('menu-open');

            // Close all dropdowns
            dropdownItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Don't prevent default for just "#"
            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // Handle window resize - close dropdowns on desktop and re-attach hover
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            dropdownItems.forEach(item => {
                item.classList.remove('active');

                // Re-attach hover listeners for desktop
                item.removeEventListener('mouseenter', handleMouseEnter);
                item.removeEventListener('mouseleave', handleMouseLeave);
                item.addEventListener('mouseenter', handleMouseEnter);
                item.addEventListener('mouseleave', handleMouseLeave);
            });
        } else {
            // Remove hover listeners on mobile
            dropdownItems.forEach(item => {
                item.removeEventListener('mouseenter', handleMouseEnter);
                item.removeEventListener('mouseleave', handleMouseLeave);
            });
        }
    });

    // Hover handler functions
    function handleMouseEnter() {
        this.classList.add('active');
    }

    function handleMouseLeave() {
        this.classList.remove('active');
    }

    // Initial setup for desktop hover
    if (window.innerWidth > 768) {
        dropdownItems.forEach(item => {
            item.addEventListener('mouseenter', handleMouseEnter);
            item.addEventListener('mouseleave', handleMouseLeave);
        });
    }
});

// ===================================
// PRODUCT FILTERING
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const category = this.getAttribute('data-category');

                // Update active button
                categoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Filter products
                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (category === 'all' || cardCategory === category) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.display = 'block';
                        }, 10);
                    } else {
                        card.classList.add('hide');
                        setTimeout(() => {
                            if (card.classList.contains('hide')) {
                                card.style.display = 'none';
                            }
                        }, 300);
                    }
                });
            });
        });
    }
});


// ===================================
// PRODUCT IMAGE HOVER SWAP
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    const productImages = document.querySelectorAll('.product-image img[data-hover]');

    productImages.forEach(img => {
        const originalSrc = img.src;
        const hoverSrc = img.getAttribute('data-hover');

        // On mouse enter
        img.parentElement.addEventListener('mouseenter', function () {
            img.src = hoverSrc;
        });

        // On mouse leave
        img.parentElement.addEventListener('mouseleave', function () {
            img.src = originalSrc;
        });

        const Mobbp = window.matchMedia(`(max-width:992px)`);
        console.log(Mobbp);
        if (Mobbp.matches) {
            img.src = hoverSrc;
        }
    });
});

/* ------------------------------------------------------------------------------- */

/* document.addEventListener('DOMContentLoaded', function () {

}) */


// ===================================
// SCROLL TO TOP BUTTON
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        // Scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
