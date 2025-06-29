// Prosty metronom
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.modal-close');
    const backdrop = document.querySelector('.modal-backdrop');
    const cards = document.querySelectorAll('.dashboard-card');

    // Szablon metronomu do modala
    const metronomeTemplate = `
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
            <div id="metronome-visual-modal" style="font-size:5rem; margin-top:2rem; color:#aaa; text-align:center;">&#9679;</div>
        </div>
    `;

    // Szablon generatora tabulatury z SVG fretboardem
    const tabGeneratorTemplate = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 320px; width:100%; position:relative;">
            <h2 style="text-align:center;">Generator Tabulatury</h2>
            <div style="margin-bottom:1.2rem;">
                <span style="font-size:1.1rem; margin-right:0.5rem;">Instrument:</span>
                <select id="instrument-select" style="font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;background:#23242b;color:#e0e0e0;border:1px solid #444;">
                    <option value="guitar">Gitara</option>
                    <option value="bass">Bas</option>
                </select>
            </div>
            <div id="fretboard-wrap-rel" style="position:relative; width:100%; max-width:700px;">
                <div id="fretboard-scroll-wrap" style="overflow-x:auto; width:100%; max-width:700px; margin-bottom:1.2rem;">
                    <div id="fretboard-svg-container" style="min-width:900px;"></div>
                </div>
            </div>
            <div style="display:flex; justify-content:center; align-items:center; gap:2rem; margin-bottom:1.2rem;">
                <button id="prev-note-btn" style="font-size:1.2rem;padding:0.7rem 2.2rem;border-radius:8px;">Poprzedni dźwięk</button>
                <button id="next-note-btn" style="font-size:1.2rem;padding:0.7rem 2.2rem;border-radius:8px;">Następny dźwięk</button>
                <button id="clear-fretboard-btn" style="font-size:1.1rem;padding:0.6rem 1.5rem;border-radius:8px;background:#d32f2f;color:#fff;border:none;">Wyczyść fretboard</button>
            </div>
            <div style="width:100%;max-width:520px;background:#181a20;border-radius:8px;padding:1rem 1.2rem;min-height:120px;white-space:pre;font-family:monospace;color:#e0e0e0;box-shadow:0 2px 8px rgba(0,0,0,0.15);" id="tab-preview"></div>
        </div>
    `;

    let metronomeInterval = null;
    function playClick() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 1000;
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    }
    function startMetronomeModal() {
        stopMetronomeModal();
        const bpmInput = document.getElementById('bpm-modal');
        const metronomeVisual = document.getElementById('metronome-visual-modal');
        metronomeVisual.textContent = '\u25cf';
        metronomeVisual.style.color = '#aaa'; // domyślnie szara
        const bpm = parseInt(bpmInput.value, 10);
        if (isNaN(bpm) || bpm < 30 || bpm > 300) return;
        metronomeInterval = setInterval(() => {
            playClick();
            metronomeVisual.style.color = '#4caf50'; // zielony po dźwięku
            setTimeout(() => {
                metronomeVisual.style.color = '#aaa'; // powrót do szarego
            }, 100);
        }, 60000 / bpm);
    }
    function stopMetronomeModal() {
        if (metronomeInterval) clearInterval(metronomeInterval);
        metronomeInterval = null;
        const metronomeVisual = document.getElementById('metronome-visual-modal');
        if (metronomeVisual) {
            metronomeVisual.textContent = '\u25cf';
            metronomeVisual.style.color = '#aaa';
        }
    }

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const section = card.getAttribute('data-section');
            if (section === 'metronome') {
                modalBody.innerHTML = metronomeTemplate;
                modal.classList.add('open');
                // Kropka widoczna od razu, wyśrodkowana
                const metronomeVisual = document.getElementById('metronome-visual-modal');
                metronomeVisual.textContent = '\u25cf';
                metronomeVisual.style.color = '#aaa';
                document.getElementById('start-metronome-modal').onclick = startMetronomeModal;
                document.getElementById('stop-metronome-modal').onclick = stopMetronomeModal;
            } else if (section === 'tab-generator') {
                modalBody.innerHTML = tabGeneratorTemplate;
                modal.classList.add('open');
                // --- logika SVG fretboardu i tabulatury ---
                const instrumentSelect = document.getElementById('instrument-select');
                const fretboardContainer = document.getElementById('fretboard-svg-container');
                const tabPreview = document.getElementById('tab-preview');
                const nextBtn = document.getElementById('next-note-btn');
                const prevBtn = document.getElementById('prev-note-btn');
                const clearBtn = document.getElementById('clear-fretboard-btn');
                const fretboardBtns = document.getElementById('fretboard-btns');
                const fretboardScrollWrap = document.getElementById('fretboard-scroll-wrap');
                const fretboardWrapRel = document.getElementById('fretboard-wrap-rel');

                const instruments = {
                    guitar: { strings: 6, frets: 24, tuning: ['E', 'B', 'G', 'D', 'A', 'E'] },
                    bass:   { strings: 4, frets: 24, tuning: ['G', 'D', 'A', 'E'] }
                };
                let currentInstrument = 'guitar';
                let selected = []; // lista zaznaczonych pozycji
                let tabData = [];
                let tabPos = -1;
                let tabPage = 0;
                const TAB_NOTES_PER_PAGE = 8;

                function positionFretboardBtns() {
                    // Ustaw przyciski pomiędzy progami 12 i 13
                    const { frets } = instruments[currentInstrument];
                    const fretIdx = 12; // pomiędzy 12 a 13 progiem
                    const width = 60 + (frets * 48);
                    const fretSpacing = (width - 60) / frets;
                    const leftBase = 60 + fretIdx * fretSpacing;
                    // Przesuń przyciski względem scrolla
                    const scrollLeft = fretboardScrollWrap.scrollLeft;
                    const wrapRect = fretboardWrapRel.getBoundingClientRect();
                    const scrollRect = fretboardScrollWrap.getBoundingClientRect();
                    // Pozycja względem kontenera scrollowanego
                    const btnsLeft = leftBase - scrollLeft - 60;
                    prevBtn.style.left = `${btnsLeft - 90}px`;
                    nextBtn.style.left = `${btnsLeft + 40}px`;
                    prevBtn.style.top = `0px`;
                    nextBtn.style.top = `0px`;
                }

                function renderFretboardSVG() {
                    const { strings, frets, tuning } = instruments[currentInstrument];
                    const width = 60 + (frets * 48);
                    const height = 60 + strings * 32;
                    const fretSpacing = (width - 60) / frets;
                    const stringSpacing = (height - 60) / (strings - 1);
                    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#23242b;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
                        <g font-family='monospace' font-size='1.1rem'>`;
                    for (let f = 0; f <= frets; f++) {
                        svg += `<line x1="${60 + f * fretSpacing}" y1="40" x2="${60 + f * fretSpacing}" y2="${height - 20}" stroke="#888" stroke-width="${f === 0 ? 5 : 2}" />`;
                        if (f > 0) {
                            svg += `<text x="${60 + f * fretSpacing - fretSpacing/2}" y="30" fill="#aaa" text-anchor="middle">${f}</text>`;
                        }
                    }
                    for (let s = 0; s < strings; s++) {
                        svg += `<line x1="60" y1="${40 + s * stringSpacing}" x2="${width - 10}" y2="${40 + s * stringSpacing}" stroke="#bbb" stroke-width="2" />`;
                        svg += `<text x="30" y="${45 + s * stringSpacing}" fill="#aaa" text-anchor="end">${tuning[s]}</text>`;
                    }
                    for (let s = 0; s < strings; s++) {
                        for (let f = 0; f < frets; f++) {
                            const x = 60 + (f - 0.5) * fretSpacing;
                            const y = 40 + s * stringSpacing;
                            const isSelected = selected.some(sel => sel.string === s && sel.fret === f);
                            svg += `<g style='cursor:pointer;'>`;
                            svg += `<circle cx="${x}" cy="${y}" r="13" fill="${isSelected ? '#4caf50' : 'rgba(255,255,255,0.07)'}" stroke="${isSelected ? '#fff' : 'none'}" data-string="${s}" data-fret="${f}" />`;
                            svg += `<text x="${x}" y="${y + 5}" fill="#e0e0e0" text-anchor="middle" font-size="1rem" style="user-select:none;-webkit-user-select:none;pointer-events:auto;" data-string="${s}" data-fret="${f}">${f}</text>`;
                            svg += `</g>`;
                        }
                    }
                    svg += '</g></svg>';
                    fretboardContainer.innerHTML = svg;
                    const svgElem = fretboardContainer.querySelector('svg');
                    svgElem.querySelectorAll('circle, text').forEach(el => {
                        el.addEventListener('click', e => {
                            const s = parseInt(el.getAttribute('data-string'));
                            const f = parseInt(el.getAttribute('data-fret'));
                            // Na jednej strunie może być tylko jeden przycisk wciśnięty
                            selected = selected.filter(sel => sel.string !== s);
                            selected.push({ string: s, fret: f });
                            renderFretboardSVG();
                        });
                    });
                    setTimeout(positionFretboardBtns, 0);
                }
                function addNote() {
                    tabData = tabData.slice(0, tabPos+1);
                    // Dodaj wszystkie zaznaczone pozycje jako jeden krok tabulatury
                    tabData.push([...selected]);
                    tabPos++;
                    // Jeśli nowa strona, przejdź do niej
                    tabPage = Math.floor(tabPos / TAB_NOTES_PER_PAGE);
                    renderTab();
                }
                function prevNote() {
                    if (tabPos >= 0) tabPos--;
                    tabPage = Math.floor(tabPos / TAB_NOTES_PER_PAGE);
                    renderTab();
                }
                function renderTab() {
                    const { strings, tuning } = instruments[currentInstrument];
                    let lines = tuning.map(t => t + '|');
                    const startIdx = tabPage * TAB_NOTES_PER_PAGE;
                    const endIdx = Math.min(tabData.length, startIdx + TAB_NOTES_PER_PAGE);
                    for (let i = startIdx; i < endIdx; i++) {
                        const notes = tabData[i];
                        for (let s = 0; s < strings; s++) {
                            const note = Array.isArray(notes) ? notes.find(n => n.string === s) : undefined;
                            if (note) {
                                lines[s] += note.fret.toString().padEnd(2,'-');
                            } else {
                                lines[s] += '--';
                            }
                        }
                    }
                    tabPreview.textContent = lines.join('\n');
                    // Render paginację
                    let pagination = document.getElementById('tab-pagination');
                    if (!pagination) {
                        pagination = document.createElement('div');
                        pagination.id = 'tab-pagination';
                        pagination.style = 'display:flex;justify-content:center;align-items:center;gap:1.2rem;margin-top:1.2rem;';
                        tabPreview.parentNode.appendChild(pagination);
                    }
                    const totalPages = Math.max(1, Math.ceil(tabData.length / TAB_NOTES_PER_PAGE));
                    pagination.innerHTML = `
                        <button id='tab-prev-page' ${tabPage === 0 ? 'disabled' : ''} style='font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;'>Poprzednia strona</button>
                        <span style='font-size:1.1rem;'>Strona ${tabPage+1} z ${totalPages}</span>
                        <button id='tab-next-page' ${tabPage >= totalPages-1 ? 'disabled' : ''} style='font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;'>Następna strona</button>
                    `;
                    document.getElementById('tab-prev-page').onclick = () => { tabPage--; renderTab(); };
                    document.getElementById('tab-next-page').onclick = () => { tabPage++; renderTab(); };
                }
                instrumentSelect.onchange = () => {
                    currentInstrument = instrumentSelect.value;
                    selected = [];
                    tabData = [];
                    tabPos = -1;
                    tabPage = 0;
                    renderFretboardSVG();
                    renderTab();
                };
                nextBtn.onclick = addNote;
                prevBtn.onclick = prevNote;
                clearBtn.onclick = () => {
                    selected = [];
                    renderFretboardSVG();
                };
                fretboardScrollWrap.addEventListener('scroll', positionFretboardBtns);
                window.addEventListener('resize', positionFretboardBtns);
                renderFretboardSVG();
                renderTab();
                setTimeout(positionFretboardBtns, 0);
                // --- koniec logiki SVG fretboardu ---
            } else {
                const title = card.querySelector('.card-title').textContent;
                modalBody.textContent = `Tutaj pojawi się funkcja: ${title}`;
                modal.classList.add('open');
            }
        });
    });
    function closeModal() {
        modal.classList.remove('open');
        stopMetronomeModal(); // zatrzymaj metronom przy zamknięciu
    }
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
});