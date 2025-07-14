import { getAudioCtx } from './audioContext.js';

// Skrypt do obsługi metronomu na podstronie metronome.html
// ...możesz skopiować logikę z main.js lub rozwinąć ją dalej...

let metronomeInterval = null;

export function playClick() {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1000;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 1;
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
    osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
    };
}

export function startMetronome(bpm, visualCallback) {
    stopMetronome();
    if (isNaN(bpm) || bpm < 30 || bpm > 300) return;
    
    metronomeInterval = setInterval(() => {
        playClick();
        if (visualCallback) {
            visualCallback(true);
            setTimeout(() => visualCallback(false), 100);
        }
    }, 60000 / bpm);
}

export function stopMetronome() {
    if (metronomeInterval) {
        clearInterval(metronomeInterval);
        metronomeInterval = null;
    }
}

export const metronomeTemplate = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 320px;">
        <h2 style="text-align:center;">Metronom</h2>
        <div id="metronome-controls-modal" style="display:flex; flex-direction:column; align-items:center; gap:1.5rem; margin-bottom:2.5rem;">
            <label for="bpm-modal" style="font-size:1.4rem;">Tempo (BPM):</label>
            <input type="number" id="bpm-modal" min="30" max="300" value="120" style="font-size:2.5rem; text-align:center; width:150px; padding:1.1rem 1.8rem; border-radius:12px; border:1px solid #444; background:#23242b; color:#e0e0e0;">
            <div style="display:flex; gap:2.5rem;">
                <button id="start-metronome-modal" style="font-size:2.5rem; padding:1.7rem 4.5rem; border-radius:16px;">Start</button>
                <button id="stop-metronome-modal" style="font-size:2.5rem; padding:1.7rem 4.5rem; border-radius:16px;">Stop</button>
            </div>
        </div>
        <div id="metronome-visual-modal" style="font-size:5rem; margin-top:2rem; color:#aaa; text-align:center;">●</div>
    </div>
`;

export function metronomeInit() {
    // Inicjalizacja metronomu (np. resetowanie stanu, podpinanie eventów jeśli trzeba)
    // Możesz tu dodać kod, który ma się wykonać po wejściu na sekcję metronomu
    console.log('Metronom aktywny');
}