document.addEventListener("DOMContentLoaded", function () {

    const getBasePath = () => {
        const path = window.location.pathname;

        if (path.includes('/official-games/')) {
            return '../../';
        }
        else if (path.includes('/pages/')) {
            return '../';
        }
        return './';
    };

    const basePath = getBasePath();

    const loadComponent = (fileName, elementId) => {
        const url = basePath + fileName;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Could not load resource: ' + url);
                }
                return response.text();
            })
            .then(data => {
                let fixedData = data.replaceAll('src="./', `src="${basePath}`);
                fixedData = fixedData.replaceAll('href="./', `href="${basePath}`);

                const placeholder = document.getElementById(elementId);
                if (placeholder) {
                    placeholder.outerHTML = fixedData;
                }

                if (elementId === 'header-placeholder') {
                    initDropdownHover();
                }
            })
            .catch(error => {
                console.error('Error loading component:', error);
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

        if (toggles.length > 0) {
            setToggleAttribute();
            window.addEventListener('resize', setToggleAttribute);
        }
    };

    loadComponent('partials/header.html', 'header-placeholder');
    loadComponent('partials/footer.html', 'footer-placeholder');

});