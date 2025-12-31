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
    console.log("Caminho base calculado:", basePath);

    const loadComponent = (fileName, elementId) => {
        const url = basePath + fileName;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar: ' + url);
                return response.text();
            })
            .then(htmlText => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                const elements = doc.querySelectorAll('[src], [href]');

                elements.forEach(el => {
                    const src = el.getAttribute('src');
                    const href = el.getAttribute('href');

                    if (src && !src.startsWith('http') && !src.startsWith('//')) {
                        const cleanPath = src.replace(/^(\.\/|\/)/, '');
                        el.setAttribute('src', basePath + cleanPath);
                    }

                    if (href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#')) {
                        const cleanPath = href.replace(/^(\.\/|\/)/, '');
                        el.setAttribute('href', basePath + cleanPath);
                    }
                });

                const placeholder = document.getElementById(elementId);
                if (placeholder) {
                    placeholder.innerHTML = doc.body.innerHTML;

                    if (elementId === 'header-placeholder') {
                        initDropdownHover();
                    }
                }
            })
            .catch(error => {
                console.error('Erro no partials:', error);
            });
    };

    const desktopBreakpoint = 992;

    const initDropdownHover = () => {
        setTimeout(() => {
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
        }, 100);
    };

    loadComponent('partials/header.html', 'header-placeholder');
    loadComponent('partials/footer.html', 'footer-placeholder');

});