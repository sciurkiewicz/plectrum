import { Modal } from './modal/modal.js';
import { metronomeTemplate, startMetronome, stopMetronome } from './metronome.js';
import { 
    chordListTemplate, 
    chordRelationsTemplate, 
    renderChordList, 
    renderChordRelationsSVG,
    renderGuitarChordSVG,
    renderBassChordSVG,
    renderKeysChordSVG,
    guitarChords,
    bassChords,
    keysChords
} from './chords.js';
import { tabGeneratorTemplate, renderFretboardSVG, renderTab, renderTabPagination } from './tabGenerator.js';
import { drumMachineTemplate, ROCK_SOUNDS, playRockSound } from './drums.js';
import ModularSynth from './modularSynth.js';

document.addEventListener('DOMContentLoaded', function() {
    const modal = new Modal();
    const cards = document.querySelectorAll('.dashboard-card');

    // Stan aplikacji
    let metronomeInterval = null;
    let selected = [];
    let tabData = [];
    let tabPos = -1;
    let tabPage = 0;
    let currentInstrument = 'guitar';
    let drumInterval = null;

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const section = card.getAttribute('data-section');
            
            if (section === 'metronome') {
                modal.open(metronomeTemplate);
                const metronomeVisual = document.getElementById('metronome-visual-modal');
                document.getElementById('start-metronome-modal').onclick = () => {
                    const bpm = parseInt(document.getElementById('bpm-modal').value, 10);
                    startMetronome(bpm, (isActive) => {
                        metronomeVisual.style.color = isActive ? '#4caf50' : '#aaa';
                    });
                };
                document.getElementById('stop-metronome-modal').onclick = stopMetronome;
            } 
            else if (section === 'tab-generator') {
                modal.open(tabGeneratorTemplate);
                const fretboardContainer = document.getElementById('fretboard-svg-container');
                const tabPreview = document.getElementById('tab-preview');
                const instrumentSelect = document.getElementById('instrument-select');
                
                function updateFretboard() {
                    fretboardContainer.innerHTML = renderFretboardSVG(currentInstrument, selected);
                    const svgElements = fretboardContainer.querySelectorAll('circle, text');
                    svgElements.forEach(el => {
                        el.addEventListener('click', e => {
                            const s = parseInt(el.getAttribute('data-string'));
                            const f = parseInt(el.getAttribute('data-fret'));
                            selected = selected.filter(sel => sel.string !== s);
                            selected.push({ string: s, fret: f });
                            updateFretboard();
                        });
                    });
                }

                function updateTab() {
                    // Aktualizuj wyświetlaną zawartość tabulatury
                    tabPreview.textContent = renderTab(tabData.slice(0, tabPos + 1), tabPage, currentInstrument);
                    
                    // Usuń starą paginację jeśli istnieje
                    const oldPagination = document.getElementById('tab-pagination');
                    if (oldPagination) {
                        oldPagination.remove();
                    }
                    
                    // Utwórz nową paginację
                    const pagination = document.createElement('div');
                    pagination.id = 'tab-pagination';
                    pagination.innerHTML = renderTabPagination(tabPage, tabData.length);
                    tabPreview.parentNode.appendChild(pagination);

                    // Dodaj obsługę przycisków paginacji
                    document.getElementById('tab-prev-page')?.addEventListener('click', () => {
                        if (tabPage > 0) {
                            tabPage--;
                            updateTab();
                        }
                    });
                    document.getElementById('tab-next-page')?.addEventListener('click', () => {
                        if (tabPage < Math.ceil(tabData.length / 16) - 1) {
                            tabPage++;
                            updateTab();
                        }
                    });
                }

                instrumentSelect.onchange = () => {
                    currentInstrument = instrumentSelect.value;
                    selected = [];
                    tabData = [];
                    tabPos = -1;
                    tabPage = 0;
                    updateFretboard();
                    updateTab();
                };

                document.getElementById('next-note-btn').onclick = () => {
                    tabData = tabData.slice(0, tabPos + 1);
                    tabData.push([...selected]);
                    tabPos++;
                    tabPage = Math.floor(tabPos / 16);
                    updateTab();
                };

                document.getElementById('prev-note-btn').onclick = () => {
                    if (tabPos >= 0) {
                        tabPos--;
                        // Przywróć zaznaczone nuty z poprzedniego kroku
                        if (tabPos >= 0) {
                            selected = [...tabData[tabPos]];
                        } else {
                            selected = [];
                        }
                        tabPage = Math.floor(Math.max(0, tabPos) / 16);
                        updateFretboard();
                        updateTab();
                    }
                };

                document.getElementById('clear-fretboard-btn').onclick = () => {
                    selected = [];
                    updateFretboard();
                };

                updateFretboard();
                updateTab();
            } 
            else if (section === 'chord-list') {
                modal.open(chordListTemplate);
                let currentTab = 'guitar';
                const content = document.getElementById('chord-list-content');
                content.innerHTML = renderChordList(currentTab);

                document.querySelectorAll('.chord-tab-btn').forEach(btn => {
                    btn.onclick = function() {
                        document.querySelectorAll('.chord-tab-btn').forEach(b => {
                            b.style.background = '#23242b';
                            b.style.color = '#e0e0e0';
                        });
                        this.style.background = '#4caf50';
                        this.style.color = '#fff';
                        currentTab = this.getAttribute('data-tab');
                        content.innerHTML = renderChordList(currentTab);
                    };
                });
            } 
            else if (section === 'chord-checker') {
                modal.open(chordRelationsTemplate);
                const svgWrap = document.getElementById('chord-relations-svg-wrap');
                const chordInfo = document.getElementById('chord-info');
                const chordName = document.getElementById('chord-name');
                const guitarDiagram = document.getElementById('guitar-diagram');
                const bassDiagram = document.getElementById('bass-diagram');
                const keysDiagram = document.getElementById('keys-diagram');
                let selected = null;

                function updateDiagrams(chordName) {
                    const guitarChord = guitarChords.find(c => c.name === chordName);
                    const bassChord = bassChords.find(c => c.name === chordName);
                    const keysChord = keysChords.find(c => c.name === chordName);

                    if (guitarChord || bassChord || keysChord) {
                        chordInfo.style.display = 'block';
                        document.getElementById('chord-name').textContent = chordName;
                        
                        if (guitarChord) {
                            guitarDiagram.innerHTML = renderGuitarChordSVG(guitarChord.fingering);
                        } else {
                            guitarDiagram.innerHTML = '<p style="color:#666;text-align:center;">Brak diagramu</p>';
                        }
                        
                        if (bassChord) {
                            bassDiagram.innerHTML = renderBassChordSVG(bassChord.fingering);
                        } else {
                            bassDiagram.innerHTML = '<p style="color:#666;text-align:center;">Brak diagramu</p>';
                        }
                        
                        if (keysChord) {
                            keysDiagram.innerHTML = renderKeysChordSVG(keysChord.notes);
                        } else {
                            keysDiagram.innerHTML = '<p style="color:#666;text-align:center;">Brak diagramu</p>';
                        }
                    } else {
                        chordInfo.style.display = 'none';
                    }
                }

                function updateChordWheel() {
                    svgWrap.innerHTML = renderChordRelationsSVG(selected);
                    const svg = svgWrap.querySelector('svg');
                    svg.querySelectorAll('.chord-circle').forEach(group => {
                        group.onmouseenter = function() {
                            const chord = this.getAttribute('data-chord');
                            updateDiagrams(chord);
                        };
                        group.onclick = function() {
                            selected = this.getAttribute('data-chord');
                            updateChordWheel();
                            updateDiagrams(selected);
                        };
                    });
                }

                updateChordWheel();
            } 
            else if (section === 'drum-machine') {
                modal.open(drumMachineTemplate);
                let steps = 16;
                let rows = ROCK_SOUNDS.length;
                let grid = Array.from({length: rows}, () => Array(steps).fill(false));
                let currentStep = 0;
                
                const drumGrid = document.getElementById('drum-grid');
                const stepsInput = document.getElementById('drum-steps');

                function renderGrid() {
                    drumGrid.innerHTML = '';
                    const gridWrap = document.createElement('div');
                    gridWrap.style.display = 'grid';
                    gridWrap.style.gridTemplateColumns = `90px repeat(${steps}, 28px)`;
                    gridWrap.style.gap = '6px';

                    for (let r = 0; r < rows; r++) {
                        const label = document.createElement('div');
                        label.textContent = ROCK_SOUNDS[r].name;
                        label.style.cssText = 'display:flex;align-items:center;justify-content:flex-end;height:26px;width:90px;font-size:1.05rem;color:#e0e0e0;font-family:monospace;user-select:none;';
                        gridWrap.appendChild(label);

                        for (let s = 0; s < steps; s++) {
                            const btn = document.createElement('button');
                            btn.style.cssText = `width:26px;height:26px;border-radius:6px;border:1px solid #444;background:${grid[r][s] ? '#4caf50' : '#23242b'};outline:none;cursor:pointer;${s === currentStep ? 'box-shadow:0 0 0 2px #fff;' : ''}`;
                            btn.onclick = () => {
                                grid[r][s] = !grid[r][s];
                                renderGrid();
                            };
                            gridWrap.appendChild(btn);
                        }
                    }
                    drumGrid.appendChild(gridWrap);
                }

                function step() {
                    for (let r = 0; r < rows; r++) {
                        if (grid[r][currentStep]) {
                            playRockSound(ROCK_SOUNDS[r].type);
                        }
                    }
                    currentStep = (currentStep + 1) % steps;
                    renderGrid();
                }

                document.getElementById('drum-start').onclick = () => {
                    if (drumInterval) clearInterval(drumInterval);
                    const bpm = parseInt(document.getElementById('drum-bpm').value, 10);
                    drumInterval = setInterval(step, 60000 / bpm / 4);
                };

                document.getElementById('drum-stop').onclick = () => {
                    if (drumInterval) {
                        clearInterval(drumInterval);
                        drumInterval = null;
                    }
                };

                document.getElementById('drum-clear').onclick = () => {
                    grid = Array.from({length: rows}, () => Array(steps).fill(false));
                    renderGrid();
                };

                document.getElementById('drum-bpm').onchange = function() {
                    if (drumInterval) {
                        clearInterval(drumInterval);
                        const bpm = parseInt(this.value, 10);
                        drumInterval = setInterval(step, 60000 / bpm / 4);
                    }
                };

                stepsInput.onchange = function() {
                    steps = Math.max(4, Math.min(64, parseInt(this.value, 10) || 16));
                    grid = Array.from({length: rows}, () => Array(steps).fill(false));
                    renderGrid();
                };

                renderGrid();
            }
            else if (section === 'modular-synth') {
                // Otwórz modal z syntezatorem modularnym
                const modalHtml = `
                    <h2>Automat perkusyjny</h2>
                    <div id="custom-drum-machine-modal"></div>
                `;
                modal.open(modalHtml);
                setTimeout(() => {
                    import('./sampleDrumMachine.js').then(({ default: SampleDrumMachine }) => {
                        new SampleDrumMachine(document.getElementById('custom-drum-machine-modal'));
                    });
                }, 0);
            }
        });
    });

    // Nasłuchuj na zamknięcie modalu
    document.addEventListener('modal-closed', () => {
        // Zatrzymaj wszystkie aktywne procesy
        stopMetronome();
        if (drumInterval) {
            clearInterval(drumInterval);
            drumInterval = null;
        }
    });
});