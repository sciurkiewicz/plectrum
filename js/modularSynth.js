// js/modularSynth.js
// Syntezator modularny - generowanie ambientowych dźwięków za pomocą suwaków

class ModularSynth {
    constructor(container) {
        this.container = container;
        this.audioCtx = null;
        this.setupUI();
    }

    setupUI() {
        this.container.innerHTML = `
            <label>Tempo perkusji: <input type="range" min="40" max="240" step="1" value="120" id="modular-perc-tempo"></label><br>
            <div style="margin-top:10px">
                <button id="modular-kick">Kick</button>
                <button id="modular-snare">Snare</button>
                <button id="modular-hihat">HiHat</button>
            </div>
        `;
        this.bindEvents();
    }

    bindEvents() {
        // ...tylko efekty perkusyjne...
        // Efekty perkusyjne
        import('./modularPercussion.js').then(({ default: ModularPercussion }) => {
            const playKick = () => {
                if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                new ModularPercussion(this.audioCtx).playKick();
            };
            const playSnare = () => {
                if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                new ModularPercussion(this.audioCtx).playSnare();
            };
            const playHiHat = () => {
                if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                new ModularPercussion(this.audioCtx).playHiHat();
            };
            this.container.querySelector('#modular-kick').onclick = playKick;
            this.container.querySelector('#modular-snare').onclick = playSnare;
            this.container.querySelector('#modular-hihat').onclick = playHiHat;
            const getTempo = () => parseInt(this.container.querySelector('#modular-perc-tempo').value, 10);
            let percInterval = null;
            let percStep = 0;
            const sequence = ['kick', 'hihat', 'snare', 'hihat']; // prosty pattern
            const playPerc = () => {
                if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const perc = new ModularPercussion(this.audioCtx);
                switch (sequence[percStep % sequence.length]) {
                    case 'kick': perc.playKick(); break;
                    case 'snare': perc.playSnare(); break;
                    case 'hihat': perc.playHiHat(); break;
                }
                percStep++;
            };
            this.container.querySelector('#modular-kick').onclick = () => {
                if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                new ModularPercussion(this.audioCtx).playKick();
            };
            this.container.querySelector('#modular-snare').onclick = () => {
                if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                new ModularPercussion(this.audioCtx).playSnare();
            };
            this.container.querySelector('#modular-hihat').onclick = () => {
                if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                new ModularPercussion(this.audioCtx).playHiHat();
            };
            // Automatyczne odtwarzanie patternu
            const autoBtn = document.createElement('button');
            autoBtn.textContent = 'Auto Perc';
            autoBtn.style.marginLeft = '10px';
            this.container.querySelector('#modular-hihat').after(autoBtn);
            autoBtn.onclick = () => {
                if (percInterval) {
                    clearInterval(percInterval);
                    percInterval = null;
                    autoBtn.textContent = 'Auto Perc';
                } else {
                    percStep = 0;
                    percInterval = setInterval(playPerc, 60000 / getTempo());
                    autoBtn.textContent = 'Stop Perc';
                }
            };
            this.container.querySelector('#modular-perc-tempo').oninput = () => {
                if (percInterval) {
                    clearInterval(percInterval);
                    percInterval = setInterval(playPerc, 60000 / getTempo());
                }
            };
        });
    }

    start() {
        // Usunięto generator fal
    }

    stop() {
        // Usunięto generator fal
    }

    ambientModulation() {
        // Usunięto ambient modulation
    }
}

export default ModularSynth;
