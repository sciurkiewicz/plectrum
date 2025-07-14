import { getAudioCtx, playNoise } from './audioContext.js';

// Rockowe barwy perkusji (syntetyczne, ale stylizowane)
export const ROCK_SOUNDS = [
    { name: 'Kick', type: 'kick' },
    { name: 'Snare', type: 'snare' },
    { name: 'Hi-Hat', type: 'hihat' },
    { name: 'Clap', type: 'clap' },
    { name: 'Tom', type: 'tom' },
    { name: 'Cowbell', type: 'cowbell' },
    { name: 'Crash', type: 'crash' },
    { name: 'Ride', type: 'ride' }
];

// Funkcje generowania dźwięków perkusyjnych
export function playRockSound(type) {
    const ctx = getAudioCtx();
    if (type === 'kick') {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(120, ctx.currentTime);
        o.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.13);
        g.gain.setValueAtTime(1, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.14);
        o.start(); o.stop(ctx.currentTime + 0.15);
        o.onended = () => { o.disconnect(); g.disconnect(); };
    } else if (type === 'snare') {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(180, ctx.currentTime);
        g.gain.setValueAtTime(0.5, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.09);
        o.start(); o.stop(ctx.currentTime + 0.1);
        o.onended = () => { o.disconnect(); g.disconnect(); };
        // Dodaj szum do snare
        playNoise(0.07, 0.25, {type: 'highpass', freq: 1200});
    } else if (type === 'hihat') {
        playNoise(0.03, 0.18, {type: 'highpass', freq: 8000});
    } else if (type === 'clap') {
        playNoise(0.06, 0.32, {type: 'bandpass', freq: 1800});
    } else if (type === 'tom') {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(180, ctx.currentTime);
        o.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.18);
        g.gain.setValueAtTime(0.8, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.19);
        o.start(); o.stop(ctx.currentTime + 0.2);
        o.onended = () => { o.disconnect(); g.disconnect(); };
    } else if (type === 'cowbell') {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'square';
        o.frequency.setValueAtTime(900, ctx.currentTime);
        g.gain.setValueAtTime(0.5, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
        o.start(); o.stop(ctx.currentTime + 0.09);
        o.onended = () => { o.disconnect(); g.disconnect(); };
    } else if (type === 'crash') {
        playNoise(0.25, 0.22, {type: 'highpass', freq: 6000});
    } else if (type === 'ride') {
        playNoise(0.18, 0.18, {type: 'highpass', freq: 5000});
    }
}

// Szablon automatu perkusyjnego
export const drumMachineTemplate = `
    <div style="min-height:420px;display:flex;flex-direction:column;align-items:center;gap:2.2rem;width:100vw;max-width:1600px;">
        <h2 style="text-align:center;">Automat perkusyjny</h2>
        <div style="margin-bottom:1.2rem;display:flex;gap:2.5rem;align-items:center;flex-wrap:wrap;justify-content:center;">
            <div>
                <label for="drum-bpm" style="font-size:1.1rem;">Tempo (BPM):</label>
                <input type="number" id="drum-bpm" min="40" max="240" value="120" style="font-size:1.1rem;padding:0.3rem 1.2rem;border-radius:8px;background:#23242b;color:#e0e0e0;border:1px solid #444;width:80px;">
            </div>
            <div>
                <label for="drum-steps" style="font-size:1.1rem;">Długość patternu:</label>
                <input type="number" id="drum-steps" min="4" max="64" value="16" style="font-size:1.1rem;padding:0.3rem 1.2rem;border-radius:8px;background:#23242b;color:#e0e0e0;border:1px solid #444;width:80px;">
            </div>
        </div>
        <div id="drum-grid" style="overflow-x:auto;width:100vw;max-width:1500px;margin-bottom:1.2rem;"></div>
        <div style="display:flex;gap:1.2rem;justify-content:center;">
            <button id="drum-start" style="font-size:1.1rem;padding:0.6rem 2.2rem;border-radius:8px;">Start</button>
            <button id="drum-stop" style="font-size:1.1rem;padding:0.6rem 2.2rem;border-radius:8px;">Stop</button>
            <button id="drum-clear" style="font-size:1.1rem;padding:0.6rem 1.2rem;border-radius:8px;background:#d32f2f;color:#fff;">Wyczyść</button>
        </div>
        <div style="font-size:1.05rem;color:#aaa;text-align:center;margin-top:1.2rem;max-width:1200px;">
            Kliknij w pola, aby aktywować dźwięki. Możesz zmieniać długość patternu i tempo. Automat generuje rockowe barwy perkusji w przeglądarce (Web Audio API).
        </div>
    </div>
`;