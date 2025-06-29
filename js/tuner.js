// Skrypt do obsługi stroika na podstronie tuner.html

// Tutaj możesz dodać kod JavaScript do obsługi funkcji stroika
// Na przykład, jeśli stroik ma przyciski do strojenia, możesz dodać ich obsługę tutaj

document.addEventListener('DOMContentLoaded', (event) => {
    // Kod, który ma zostać wykonany po załadowaniu strony

    // Przykład: Ustawienie domyślnej wartości strojenia
    let defaultTuning = 'E';
    document.getElementById('tuningValue').innerText = defaultTuning;

    // Obsługa przycisku strojenia
    document.getElementById('tuneButton').addEventListener('click', () => {
        // Kod do wykonania strojenia
        // Możesz dodać logikę do zmiany wartości strojenia

        let currentTuning = document.getElementById('tuningValue').innerText;
        // Przykładowa logika zmiany strojenia
        if (currentTuning === 'E') {
            currentTuning = 'A';
        } else if (currentTuning === 'A') {
            currentTuning = 'D';
        } else {
            currentTuning = 'E';
        }
        document.getElementById('tuningValue').innerText = currentTuning;
    });
});

function tunerInit() {
    // Inicjalizacja stroika
    console.log('Stroik aktywny');
}