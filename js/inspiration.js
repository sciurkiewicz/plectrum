// Skrypt do obsługi inspiracji na podstronie inspiration.html

// Tutaj możesz dodać swój kod JavaScript, który będzie dotyczył tylko podstrony inspiration.html

document.addEventListener('DOMContentLoaded', function() {
    // Przykładowa funkcja, która może być użyta na podstronie inspiracji
    function pokazInspiracje() {
        const inspiracje = [
            'Inspiracja 1',
            'Inspiracja 2',
            'Inspiracja 3'
        ];

        const kontener = document.getElementById('inspiracje-container');
        kontener.innerHTML = ''; // Czyścimy zawartość kontenera

        inspiracje.forEach(inspiracja => {
            const div = document.createElement('div');
            div.className = 'inspiracja';
            div.textContent = inspiracja;
            kontener.appendChild(div);
        });
    }

    // Wywołanie funkcji po załadowaniu strony
    pokazInspiracje();
});

function inspirationInit() {
    // Inicjalizacja inspiracji
    console.log('Inspiracja aktywna');
}