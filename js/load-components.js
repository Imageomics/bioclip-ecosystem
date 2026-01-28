/**
 * Load header and footer components dynamically
 * Handles path resolution for root vs pages/ directory
 * Prevents FOUC by showing body only after components load
 */
(function () {
    'use strict';

    // Calculate the relative path to the project root
    const isPagesDir = window.location.pathname.includes('/pages/');
    const rootPath = isPagesDir ? '../' : './';

    const componentsPath = rootPath + 'components/';

    // Function to adjust navigation links
    function adjustNavigationLinks(headerElement) {

        // Helper to check if current page matches and set active class
        const currentPath = window.location.pathname;
        const setActive = (element, pageName) => {
            if (!element) return;
            const isMatch = currentPath.endsWith(pageName) ||
                (pageName === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html')));

            if (isMatch) element.classList.add('active');
        };

        // Handle Logo (links to root index)
        const logoLink = headerElement.querySelector('#logo-link');
        if (logoLink) {
            logoLink.href = rootPath + 'index.html';
        }

        // Define navigation items with their path relative to ROOT
        const navItems = [
            { id: '#nav-models', relPath: 'pages/models.html', fileName: 'models.html' },
            { id: '#nav-data', relPath: 'pages/data.html', fileName: 'data.html' },
            { id: '#nav-software', relPath: 'pages/software.html', fileName: 'software.html' },
            { id: '#nav-demos', relPath: 'pages/demos.html', fileName: 'demos.html' }
        ];

        navItems.forEach(item => {
            const element = headerElement.querySelector(item.id);
            if (element) {
                element.href = rootPath + item.relPath;
                setActive(element, item.fileName);
            }
        });
    }

    // Load components
    async function loadComponents() {
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

            document.body.style.visibility = 'visible';

        } catch (error) {
            console.error('Error loading components:', error);
            document.body.style.visibility = 'visible';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadComponents);
    } else {
        loadComponents();
    }
})();
