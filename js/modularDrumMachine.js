// js/modularDrumMachine.js
// Kopia automatu perkusyjnego z drumMachineTemplate, dostosowana do modalu syntezatora modularnego

import { ROCK_SOUNDS, playRockSound } from './drums.js';

class ModularDrumMachine {
    constructor(container) {
        this.container = container;
        this.steps = 16;
        this.rows = ROCK_SOUNDS.length;
        this.grid = Array.from({length: this.rows}, () => Array(this.steps).fill(false));
        this.currentStep = 0;
        this.drumInterval = null;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div id="modular-drum-grid"></div>
            <label>BPM: <input type="number" id="modular-drum-bpm" min="30" max="300" value="120"></label>
            <label>Kroki: <input type="number" id="modular-drum-steps" min="4" max="64" value="16"></label>
            <button id="modular-drum-start">Start</button>
            <button id="modular-drum-stop">Stop</button>
            <button id="modular-drum-clear">Wyczyść</button>
        `;
        this.renderGrid();
        this.bindEvents();
    }

    renderGrid() {
        const drumGrid = this.container.querySelector('#modular-drum-grid');
        drumGrid.innerHTML = '';
        const gridWrap = document.createElement('div');
        gridWrap.style.display = 'grid';
        gridWrap.style.gridTemplateColumns = `90px repeat(${this.steps}, 28px)`;
        gridWrap.style.gap = '6px';

        for (let r = 0; r < this.rows; r++) {
            const label = document.createElement('div');
            label.textContent = ROCK_SOUNDS[r].name;
            label.style.cssText = 'display:flex;align-items:center;justify-content:flex-end;height:26px;width:90px;font-size:1.05rem;color:#e0e0e0;font-family:monospace;user-select:none;';
            gridWrap.appendChild(label);

            for (let s = 0; s < this.steps; s++) {
                const btn = document.createElement('button');
                btn.style.cssText = `width:26px;height:26px;border-radius:6px;border:1px solid #444;background:${this.grid[r][s] ? '#4caf50' : '#23242b'};outline:none;cursor:pointer;${s === this.currentStep ? 'box-shadow:0 0 0 2px #fff;' : ''}`;
                btn.onclick = () => {
                    this.grid[r][s] = !this.grid[r][s];
                    this.renderGrid();
                };
                gridWrap.appendChild(btn);
            }
        }
        drumGrid.appendChild(gridWrap);
    }

    bindEvents() {
        this.container.querySelector('#modular-drum-start').onclick = () => {
            if (this.drumInterval) clearInterval(this.drumInterval);
            const bpm = parseInt(this.container.querySelector('#modular-drum-bpm').value, 10);
            this.drumInterval = setInterval(() => this.step(), 60000 / bpm / 4);
        };
        this.container.querySelector('#modular-drum-stop').onclick = () => {
            if (this.drumInterval) {
                clearInterval(this.drumInterval);
                this.drumInterval = null;
            }
        };
        this.container.querySelector('#modular-drum-clear').onclick = () => {
            this.grid = Array.from({length: this.rows}, () => Array(this.steps).fill(false));
            this.renderGrid();
        };
        this.container.querySelector('#modular-drum-bpm').onchange = () => {
            if (this.drumInterval) {
                clearInterval(this.drumInterval);
                const bpm = parseInt(this.container.querySelector('#modular-drum-bpm').value, 10);
                this.drumInterval = setInterval(() => this.step(), 60000 / bpm / 4);
            }
        };
        this.container.querySelector('#modular-drum-steps').onchange = () => {
            this.steps = Math.max(4, Math.min(64, parseInt(this.container.querySelector('#modular-drum-steps').value, 10) || 16));
            this.grid = Array.from({length: this.rows}, () => Array(this.steps).fill(false));
            this.renderGrid();
        };
    }

    step() {
        for (let r = 0; r < this.rows; r++) {
            if (this.grid[r][this.currentStep]) {
                playRockSound(ROCK_SOUNDS[r].type);
            }
        }
        this.currentStep = (this.currentStep + 1) % this.steps;
        this.renderGrid();
    }
}

export default ModularDrumMachine;
