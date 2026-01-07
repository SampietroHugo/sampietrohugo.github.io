const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = document.querySelector('.theme-icon');

function toggleTheme() {
    body.classList.toggle('light-mode');
    const isLightMode = body.classList.contains('light-mode');

    if (isLightMode) {
        themeIcon.className = 'bx bx-moon theme-icon';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.className = 'bx bx-sun theme-icon';
        localStorage.setItem('theme', 'dark');
    }
}

themeToggle.addEventListener('click', toggleTheme);

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme == 'light') {
        body.classList.add('light-mode');
        themeIcon.className = 'bx bx-moon theme-icon';
    } else {
        body.classList.remove('light-mode');
        themeIcon.className = 'bx bx-sun theme-icon';
    }
}

if (document.readyState === 'loading0') {
    document.addEventListener('DOMContentLoaded', loadSavedTheme);
} else {
    loadSavedTheme();
}
