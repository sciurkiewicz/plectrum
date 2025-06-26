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

// ...przyszła logika do skal, lekcji, profilu...