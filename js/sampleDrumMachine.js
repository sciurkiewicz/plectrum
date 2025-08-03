// js/sampleDrumMachine.js
// Automat perkusyjny na próbki dźwiękowe (mp3)

class SampleDrumMachine {
    constructor(container) {
        this.container = container;
        this.steps = 16;
        this.samples = [];
        this.grid = [];
        this.currentStep = 0;
        this.drumInterval = null;
        this.setupUI();
    }

    setupUI() {
        this.container.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 0 16px 0;width:100%;max-width:980px;margin:0 auto;">
                <div id="sample-drum-upload-wrap" style="margin-bottom:18px;">
                    <label style="font-size:1.1rem;">Dodaj próbki (mp3/wav): <input type="file" id="sample-drum-upload" multiple accept="audio/mp3,audio/wav" style="margin-left:8px;"></label>
                </div>
                <div id="sample-drum-grid" style="margin-bottom:24px;width:100%;max-width:900px;"></div>
                <div style="display:flex;gap:18px;flex-wrap:wrap;justify-content:center;margin-bottom:18px;">
                    <label style="font-size:1.05rem;">BPM: <input type="number" id="sample-drum-bpm" min="30" max="300" value="120" style="width:70px;margin-left:6px;"></label>
                    <label style="font-size:1.05rem;">Kroki: <input type="number" id="sample-drum-steps" min="4" max="64" value="16" style="width:70px;margin-left:6px;"></label>
                </div>
                <div style="display:flex;gap:14px;justify-content:center;">
                    <button id="sample-drum-start" style="padding:8px 22px;font-size:1.08rem;border-radius:8px;border:none;background:#4caf50;color:#fff;cursor:pointer;">Start</button>
                    <button id="sample-drum-stop" style="padding:8px 22px;font-size:1.08rem;border-radius:8px;border:none;background:#e53935;color:#fff;cursor:pointer;">Stop</button>
                    <button id="sample-drum-clear" style="padding:8px 22px;font-size:1.08rem;border-radius:8px;border:none;background:#23242b;color:#fff;cursor:pointer;">Wyczyść</button>
                </div>
            </div>
        `;
        this.bindEvents();
    }

    bindEvents() {
        const upload = this.container.querySelector('#sample-drum-upload');
        upload.onchange = (e) => {
            // Dodaj nowe pliki do istniejącej listy, unikając duplikatów po nazwie
            const newFiles = Array.from(e.target.files).filter(f => !this.samples.some(s => s.name === f.name));
            this.samples = this.samples.concat(newFiles);
            // Rozszerz grid o nowe próbki
            const oldLen = this.grid.length;
            for (let i = oldLen; i < this.samples.length; i++) {
                this.grid[i] = Array(this.steps).fill(false);
            }
            this.renderGrid();
        };
        this.container.querySelector('#sample-drum-start').onclick = () => {
            if (this.drumInterval) clearInterval(this.drumInterval);
            const bpm = parseInt(this.container.querySelector('#sample-drum-bpm').value, 10);
            this.drumInterval = setInterval(() => this.step(), 60000 / bpm / 4);
        };
        this.container.querySelector('#sample-drum-stop').onclick = () => {
            if (this.drumInterval) {
                clearInterval(this.drumInterval);
                this.drumInterval = null;
            }
        };
        this.container.querySelector('#sample-drum-clear').onclick = () => {
            this.grid = Array.from({length: this.samples.length}, () => Array(this.steps).fill(false));
            this.renderGrid();
        };
        this.container.querySelector('#sample-drum-bpm').onchange = () => {
            if (this.drumInterval) {
                clearInterval(this.drumInterval);
                const bpm = parseInt(this.container.querySelector('#sample-drum-bpm').value, 10);
                this.drumInterval = setInterval(() => this.step(), 60000 / bpm / 4);
            }
        };
        this.container.querySelector('#sample-drum-steps').onchange = () => {
            this.steps = Math.max(4, Math.min(64, parseInt(this.container.querySelector('#sample-drum-steps').value, 10) || 16));
            this.grid = Array.from({length: this.samples.length}, () => Array(this.steps).fill(false));
            this.renderGrid();
        };
    }

    renderGrid() {
        const drumGrid = this.container.querySelector('#sample-drum-grid');
        drumGrid.innerHTML = '';
        if (!this.samples.length) {
            drumGrid.innerHTML = '<p style="color:#888;text-align:center;font-size:1.08rem;margin:24px 0;">Dodaj próbki mp3/wav, aby utworzyć pattern.</p>';
            return;
        }
        const gridWrap = document.createElement('div');
        gridWrap.style.display = 'grid';
        gridWrap.style.gridTemplateColumns = `140px repeat(${this.steps}, 32px)`;
        gridWrap.style.gap = '8px';
        gridWrap.style.justifyContent = 'center';
        gridWrap.style.padding = '12px 0 8px 0';
        for (let r = 0; r < this.samples.length; r++) {
            const label = document.createElement('div');
            label.textContent = this.samples[r].name;
            label.style.cssText = 'display:flex;align-items:center;justify-content:flex-end;height:28px;width:140px;font-size:1.08rem;color:#e0e0e0;font-family:monospace;user-select:none;overflow:hidden;text-overflow:ellipsis;background:#23242b;border-radius:6px;padding-right:8px;';
            gridWrap.appendChild(label);
            for (let s = 0; s < this.steps; s++) {
                const btn = document.createElement('button');
                btn.style.cssText = `width:30px;height:28px;border-radius:8px;border:1px solid #444;background:${this.grid[r][s] ? '#4caf50' : '#23242b'};outline:none;cursor:pointer;transition:background 0.2s;${s === this.currentStep ? 'box-shadow:0 0 0 2px #fff;' : ''}`;
                btn.onclick = () => {
                    this.grid[r][s] = !this.grid[r][s];
                    this.renderGrid();
                };
                gridWrap.appendChild(btn);
            }
        }
        drumGrid.appendChild(gridWrap);
    }

    step() {
        for (let r = 0; r < this.samples.length; r++) {
            if (this.grid[r][this.currentStep]) {
                this.playSample(this.samples[r]);
            }
        }
        this.currentStep = (this.currentStep + 1) % this.steps;
        this.renderGrid();
    }

    playSample(file) {
        const url = URL.createObjectURL(file);
        const audio = new Audio(url);
        audio.currentTime = 0;
        audio.play();
        audio.onended = () => URL.revokeObjectURL(url);
    }
}

export default SampleDrumMachine;
