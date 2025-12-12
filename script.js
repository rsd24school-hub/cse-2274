

async function loadHTML(id, file) {
    const element = document.getElementById(id);
    if (!element) return;
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error('Fetch failed: ' + response.status);
        element.innerHTML = await response.text();

        // If we've just loaded the header fragment, initialize the hamburger toggle
        if (file && file.toLowerCase().includes('header')) {
            try {
                initHeaderToggle();
            } catch (e) {
                console.error('initHeaderToggle failed', e);
            }
        }
    } catch (err) {
        console.error('Error loading', file, err);
    }
}

function initHeaderToggle() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.primary-nav');
    const backdrop = document.querySelector('.nav-backdrop');
    
    if (!menuBtn || !nav || !backdrop) return;

    // Toggle navigation state
    function toggleNav(forceClose = false) {
        const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
        const shouldOpen = forceClose ? false : !isOpen;

        if (shouldOpen) {
            // Open navigation
            nav.classList.add('nav-open');
            backdrop.classList.add('active');
            menuBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('noscroll');

            // Animate links with stagger effect
            const links = nav.querySelectorAll('.nav-link, .dropdown-link');
            links.forEach((link, index) => {
                link.style.opacity = '0';
                link.style.transform = 'translateX(30px)';
                setTimeout(() => {
                    link.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    link.style.opacity = '1';
                    link.style.transform = 'translateX(0)';
                }, 80 + (index * 40));
            });

            // Focus first link after animation
            const firstLink = nav.querySelector('.nav-link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 400);
            }
        } else {
            // Close navigation
            nav.classList.remove('nav-open');
            backdrop.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('noscroll');
            menuBtn.focus();
        }
    }

    // Menu button click
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNav();
    });

    // Backdrop click
    backdrop.addEventListener('click', () => {
        toggleNav(true);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
            toggleNav(true);
        }
    });

    // Close when clicking nav links
    const navLinks = nav.querySelectorAll('.nav-link, .dropdown-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Small delay for better UX
            setTimeout(() => toggleNav(true), 150);
        });
    });

    // Handle dropdown toggles on mobile
    const dropdownBtns = nav.querySelectorAll('.dropdown-btn');
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.classList.contains('nav-open')) return;
        if (menuBtn.contains(e.target) || nav.contains(e.target) || backdrop.contains(e.target)) return;
        toggleNav(true);
    });
}

function ensureContainer(id, tagName) {
    let el = document.getElementById(id);
    if (el) return el;
    el = document.querySelector(tagName) || document.createElement(tagName);
    if (!el.id) el.id = id;
    // insert header at top of body, footer at end
    if (tagName.toLowerCase() === 'header') {
        document.body.insertBefore(el, document.body.firstChild);
    } else if (tagName.toLowerCase() === 'footer') {
        document.body.appendChild(el);
    }
    return el;
}

document.addEventListener('DOMContentLoaded', function () {
    // Ensure header/footer elements exist and have the expected IDs
    ensureContainer('header', 'header');
    ensureContainer('footer', 'footer');

    // Load the fragments into the containers
    loadHTML('header', 'header.html');
    loadHTML('footer', 'footer.html');
 
    window.siteFragmentsLoaded = true;
});

// keep existing variables (may be null on pages without forms)
const form = document.getElementById('contact-form');
const emaildata = document.getElementById('email');
const phonedata = document.getElementById('phone');
const emailErr = document.getElementById('email-error');
const phoneErr = document.getElementById('phone-error');