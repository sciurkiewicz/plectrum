// Dynamiczne ładowanie nawigacji z nav.html
function loadNav() {
    fetch('nav.html')
        .then(response => response.text())
        .then(html => {
            const navContainer = document.getElementById('main-nav');
            if (navContainer) navContainer.innerHTML = html;
        });
}

document.addEventListener('DOMContentLoaded', loadNav);