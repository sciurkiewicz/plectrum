// Prosty metronom
let metronomeInterval = null;
const bpmInput = document.getElementById('bpm');
const startBtn = document.getElementById('start-metronome');
const stopBtn = document.getElementById('stop-metronome');
const metronomeVisual = document.getElementById('metronome-visual');

function playClick() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 1000;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
}

function startMetronome() {
    stopMetronome();
    const bpm = parseInt(bpmInput.value, 10);
    if (isNaN(bpm) || bpm < 30 || bpm > 300) return;
    metronomeInterval = setInterval(() => {
        playClick();
        metronomeVisual.textContent = '●';
        setTimeout(() => metronomeVisual.textContent = '', 100);
    }, 60000 / bpm);
}

function stopMetronome() {
    if (metronomeInterval) clearInterval(metronomeInterval);
    metronomeVisual.textContent = '';
}

startBtn.addEventListener('click', startMetronome);
stopBtn.addEventListener('click', stopMetronome);

// SPA navigation logic z dynamicznym ładowaniem JS dla sekcji
const sectionScripts = {
    metronome: 'js/metronome.js',
    tuner: 'js/tuner.js',
    chords: 'js/chords.js',
    scales: 'js/scales.js',
    'music-creation': 'js/music-creation.js',
    inspiration: 'js/inspiration.js',
    profile: 'js/profile.js'
};

let loadedSections = {};

function showSection(sectionId) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(sec => sec.style.display = 'none');
    const section = document.getElementById(sectionId);
    if (section) section.style.display = '';

    // Dynamiczne ładowanie JS tylko przy pierwszym wejściu na sekcję
    if (sectionScripts[sectionId] && !loadedSections[sectionId]) {
        const script = document.createElement('script');
        script.src = sectionScripts[sectionId];
        script.onload = () => {
            if (window[sectionId + 'Init']) window[sectionId + 'Init']();
        };
        document.body.appendChild(script);
        loadedSections[sectionId] = true;
    } else if (window[sectionId + 'Init']) {
        window[sectionId + 'Init']();
    }
}

// Obsługa kliknięć w nawigacji
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(this.dataset.section);
    });
});

// Obsługa kliknięć w karty na dashboardzie
const dashboardCards = document.querySelectorAll('.dashboard-card');
dashboardCards.forEach(card => {
    card.addEventListener('click', function() {
        showSection(this.dataset.section);
    });
});

// Domyślnie pokazuj dashboard
showSection('dashboard');
// ...przyszła logika do skal, lekcji, profilu...