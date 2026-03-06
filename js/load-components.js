/**
 * Load header and footer components dynamically
 * Handles path resolution for root vs pages/ directory
 * Prevents FOUC by showing body only after components load
 * Loads Lucide icons and initializes them after all content is in the DOM
 */
(function () {
    'use strict';

    // Calculate the relative path to the project root
    const isPagesDir = window.location.pathname.includes('/pages/');
    const rootPath = isPagesDir ? '../' : './';

    const componentsPath = rootPath + 'components/';

    // Dynamically load Lucide if not already present
    function loadLucide() {
        return new Promise((resolve) => {
            if (window.lucide) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/lucide@0.563.0';
            script.onload = resolve;
            script.onerror = resolve; // fail silently, icons just won't render
            document.head.appendChild(script);
        });
    }

    // Single source of truth for all nav pages — add new pages here only
    const navItems = [
        { id: 'nav-models',   relPath: 'pages/models.html',   fileName: 'models.html',   label: 'Models'   },
        { id: 'nav-data',     relPath: 'pages/data.html',     fileName: 'data.html',     label: 'Data'     },
        { id: 'nav-software', relPath: 'pages/software.html', fileName: 'software.html', label: 'Software' },
        { id: 'nav-demos',    relPath: 'pages/demos.html',    fileName: 'demos.html',    label: 'Demos'    },
        { id: 'nav-papers',   relPath: 'pages/papers.html',   fileName: 'papers.html',   label: 'Papers'   }
    ];

    // Build and inject nav links into both desktop and mobile navs
    function adjustNavigationLinks(headerElement) {
        const currentPath = window.location.pathname;

        const logoLink = headerElement.querySelector('#logo-link');
        if (logoLink) logoLink.href = rootPath + 'index.html';

        const desktopNav      = headerElement.querySelector('.nav-links');
        const mobileContainer = headerElement.querySelector('.mobile-nav .container');

        navItems.forEach(item => {
            const href     = rootPath + item.relPath;
            const isActive = currentPath.endsWith(item.fileName);

            const createLink = (id) => {
                const a = document.createElement('a');
                a.href      = href;
                a.id        = id;
                a.textContent = item.label;
                if (isActive) a.classList.add('active');
                return a;
            };

            if (desktopNav)      desktopNav.appendChild(createLink(item.id));
            if (mobileContainer) mobileContainer.appendChild(createLink('mob-' + item.id));
        });
    }

    // Wire up the mobile nav toggle button
    function setupMobileNav(headerEl) {
        const toggle    = headerEl.querySelector('#nav-toggle');
        const mobileNav = headerEl.querySelector('#mobile-nav');

        if (!toggle || !mobileNav) return;

        toggle.addEventListener('click', () => {
            const isOpen = headerEl.classList.toggle('nav-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
            mobileNav.setAttribute('aria-hidden', String(!isOpen));
        });

        // Close when a mobile nav link is tapped
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                headerEl.classList.remove('nav-open');
                toggle.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
            });
        });

        // Close when tapping outside the header
        document.addEventListener('click', (e) => {
            if (!headerEl.contains(e.target) && headerEl.classList.contains('nav-open')) {
                headerEl.classList.remove('nav-open');
                toggle.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Load components
    async function loadComponents() {
        // Safety timeout: Ensure page is visible after 3s even if loading hangs
        const safetyTimeout = setTimeout(() => {
            document.body.style.visibility = 'visible';
        }, 3000);

        try {
            const [headerResponse, footerResponse] = await Promise.all([
                fetch(componentsPath + 'header.html'),
                fetch(componentsPath + 'footer.html')
            ]);

            if (!headerResponse.ok || !footerResponse.ok) throw new Error('Failed to load components');

            const headerHTML = await headerResponse.text();
            const footerHTML = await footerResponse.text();

            const headerElement = document.createElement('div');
            headerElement.innerHTML = headerHTML.trim();

            const footerElement = document.createElement('div');
            footerElement.innerHTML = footerHTML.trim();

            // Adjust navigation links
            adjustNavigationLinks(headerElement.firstElementChild);

            // Insert into DOM
            document.body.insertBefore(headerElement.firstElementChild, document.body.firstChild);
            document.body.appendChild(footerElement.firstElementChild);

            // Wire up mobile nav now that the header is in the DOM
            setupMobileNav(document.querySelector('.site-header'));

        } catch (error) {
            console.error('Error loading components:', error);
        } finally {
            clearTimeout(safetyTimeout);
            document.body.style.visibility = 'visible';

            // Load Lucide and initialize all icons (header + page body)
            await loadLucide();
            if (window.lucide) lucide.createIcons();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadComponents);
    } else {
        loadComponents();
    }
})();
