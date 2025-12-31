document.addEventListener("DOMContentLoaded", function () {

    const loadComponent = (url, elementId) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Could not load resource: ' + url);
                }
                return response.text();
            })
            .then(data => {
                const placeholder = document.getElementById(elementId);
                if (placeholder) {
                    placeholder.outerHTML = data;
                }

                if (elementId === 'header-placeholder') {
                    initDropdownHover();
                }
            })
            .catch(error => {
                console.error('Error loading component:', error);
                const el = document.getElementById(elementId);
                if (el) el.innerHTML = "<p>Error loading content.</p>";
            });
    };

    const desktopBreakpoint = 992;

    const initDropdownHover = () => {
        const toggles = document.querySelectorAll('.menu .dropdown-toggle');

        const setToggleAttribute = () => {
            toggles.forEach(toggle => {
                if (window.innerWidth >= desktopBreakpoint) {
                    toggle.setAttribute('data-bs-toggle', 'disabled');
                } else {
                    toggle.setAttribute('data-bs-toggle', 'dropdown');
                }
            });
        };

        setToggleAttribute();
        window.addEventListener('resize', setToggleAttribute);
    };

    loadComponent('/partials/header.html', 'header-placeholder');
    loadComponent('/partials/footer.html', 'footer-placeholder');

});