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

    // Szablon listy akordów z zakładkami i SVG
    const chordListTemplate = `
        <div style="min-height:320px;display:flex;flex-direction:column;align-items:center;">
            <h2 style="text-align:center;">Lista akordów</h2>
            <div style="display:flex;gap:1.2rem;margin-bottom:1.5rem;">
                <button class="chord-tab-btn" data-tab="guitar" style="font-size:1.1rem;padding:0.5rem 1.5rem;border-radius:8px;background:#4caf50;color:#fff;border:none;">Gitara</button>
                <button class="chord-tab-btn" data-tab="bass" style="font-size:1.1rem;padding:0.5rem 1.5rem;border-radius:8px;background:#23242b;color:#e0e0e0;border:1px solid #444;">Bas</button>
                <button class="chord-tab-btn" data-tab="keys" style="font-size:1.1rem;padding:0.5rem 1.5rem;border-radius:8px;background:#23242b;color:#e0e0e0;border:1px solid #444;">Klawisze</button>
            </div>
            <div id="chord-list-content"></div>
        </div>
    `;

    // Proste SVG dla akordów gitarowych (np. x32010 -> C-dur)
    function renderGuitarChordSVG(fingering) {
        // fingering: np. x32010
        const frets = fingering.split('').map(f => f === 'x' ? null : parseInt(f));
        const width = 120, height = 90;
        let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#23242b;border-radius:8px;">
            <g font-family='monospace' font-size='0.9rem'>`;
        // progi
        for (let f = 0; f < 5; f++) {
            svg += `<line x1="20" y1="${20 + f*15}" x2="100" y2="${20 + f*15}" stroke="#aaa" stroke-width="2" />`;
        }
        // struny
        for (let s = 0; s < 6; s++) {
            svg += `<line x1="${20 + s*16}" y1="20" x2="${20 + s*16}" y2="80" stroke="#bbb" stroke-width="2" />`;
        }
        // palce
        for (let s = 0; s < 6; s++) {
            if (frets[s] !== null && frets[s] > 0) {
                svg += `<circle cx="${20 + s*16}" cy="${20 + (frets[s]-1)*15}" r="6" fill="#4caf50" stroke="#fff" />`;
            } else if (frets[s] === 0) {
                svg += `<text x="${20 + s*16}" y="15" fill="#fff" text-anchor="middle">0</text>`;
            } else if (frets[s] === null) {
                svg += `<text x="${20 + s*16}" y="15" fill="#d32f2f" text-anchor="middle">x</text>`;
            }
        }
        svg += '</g></svg>';
        return svg;
    }
    // Proste SVG dla basu (4 struny)
    function renderBassChordSVG(fingering) {
        // fingering: np. x022 (A-dur na basie)
        const frets = fingering.split('').map(f => f === 'x' ? null : parseInt(f));
        const width = 90, height = 70;
        let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#23242b;border-radius:8px;">
            <g font-family='monospace' font-size='0.9rem'>`;
        for (let f = 0; f < 5; f++) {
            svg += `<line x1="15" y1="${15 + f*12}" x2="70" y2="${15 + f*12}" stroke="#aaa" stroke-width="2" />`;
        }
        for (let s = 0; s < 4; s++) {
            svg += `<line x1="${15 + s*18}" y1="15" x2="${15 + s*18}" y2="63" stroke="#bbb" stroke-width="2" />`;
        }
        for (let s = 0; s < 4; s++) {
            if (frets[s] !== null && frets[s] > 0) {
                svg += `<circle cx="${15 + s*18}" cy="${15 + (frets[s]-1)*12}" r="5" fill="#4caf50" stroke="#fff" />`;
            } else if (frets[s] === 0) {
                svg += `<text x="${15 + s*18}" y="10" fill="#fff" text-anchor="middle">0</text>`;
            } else if (frets[s] === null) {
                svg += `<text x="${15 + s*18}" y="10" fill="#d32f2f" text-anchor="middle">x</text>`;
            }
        }
        svg += '</g></svg>';
        return svg;
    }
    // Proste SVG dla klawiszy (pianino, podświetlone klawisze)
    function renderKeysChordSVG(notes) {
        // notes: tablica np. ['C','E','G']
        const keys = ['C','D','E','F','G','A','B'];
        let svg = `<svg width="120" height="60" viewBox="0 0 120 60" style="background:#23242b;border-radius:8px;">
            <g font-family='monospace' font-size='0.9rem'>`;
        for (let i = 0; i < 7; i++) {
            const isActive = notes.includes(keys[i]);
            svg += `<rect x="${5 + i*16}" y="5" width="14" height="30" fill="${isActive ? '#4caf50' : '#fff'}" stroke="#888" />`;
        }
        for (let i = 0; i < 7; i++) {
            svg += `<text x="${12 + i*16}" y="56" fill="#aaa" text-anchor="middle">${keys[i]}</text>`;
        }
        svg += '</g></svg>';
        return svg;
    }

    // Akordy demo (możesz rozwinąć)
    // Pełna lista popularnych akordów gitarowych
    const guitarChords = [
        { name: 'C-dur', fingering: 'x32010' },
        { name: 'A-moll', fingering: 'x02210' },
        { name: 'D-dur', fingering: 'xx0232' },
        { name: 'E-dur', fingering: '022100' },
        { name: 'G-dur', fingering: '320003' },
        { name: 'F-dur', fingering: '133211' },
        { name: 'A-dur', fingering: 'x02220' },
        { name: 'E-moll', fingering: '022000' },
        { name: 'D-moll', fingering: 'xx0231' },
        { name: 'B-dur', fingering: 'x24442' },
        { name: 'H-moll', fingering: 'x24432' },
        { name: 'G-moll', fingering: '355333' },
        { name: 'C-moll', fingering: 'x35543' },
        { name: 'F-moll', fingering: '133111' },
        { name: 'A7', fingering: 'x02020' },
        { name: 'E7', fingering: '020100' },
        { name: 'D7', fingering: 'xx0212' },
        { name: 'G7', fingering: '320001' },
        { name: 'C7', fingering: 'x32310' },
        { name: 'B7', fingering: 'x21202' },
        { name: 'H7', fingering: 'x21202' },
        { name: 'Am7', fingering: 'x02010' },
        { name: 'Em7', fingering: '020000' },
        { name: 'Dm7', fingering: 'xx0211' },
        { name: 'Fmaj7', fingering: 'xx3210' },
        { name: 'Gmaj7', fingering: '320002' },
        { name: 'Amaj7', fingering: 'x02120' },
        { name: 'Emaj7', fingering: '021100' },
        { name: 'C#m', fingering: 'x46654' },
        { name: 'D#m', fingering: 'xx1342' },
        { name: 'Bm', fingering: 'x24432' },
        { name: 'F#', fingering: '244322' },
        { name: 'F#m', fingering: '244222' },
        { name: 'G#m', fingering: '466444' },
        { name: 'B', fingering: 'x24442' }
    ];
    // Popularne akordy basowe (4-strunowy bas, uproszczone)
    const bassChords = [
        { name: 'E', fingering: '0220' },
        { name: 'A', fingering: 'x022' },
        { name: 'D', fingering: 'x002' },
        { name: 'G', fingering: '0032' },
        { name: 'C', fingering: 'x320' },
        { name: 'F', fingering: 'x332' },
        { name: 'B', fingering: 'x244' },
        { name: 'H', fingering: 'x244' },
        { name: 'A-moll', fingering: 'x010' },
        { name: 'E-moll', fingering: '0200' },
        { name: 'D-moll', fingering: 'x001' }
    ];
    // Popularne akordy klawiszowe (tylko białe klawisze, uproszczone)
    const keysChords = [
        { name: 'C-dur', notes: ['C','E','G'] },
        { name: 'A-moll', notes: ['A','C','E'] },
        { name: 'D-dur', notes: ['D','F#','A'] },
        { name: 'E-dur', notes: ['E','G#','B'] },
        { name: 'G-dur', notes: ['G','B','D'] },
        { name: 'F-dur', notes: ['F','A','C'] },
        { name: 'A-dur', notes: ['A','C#','E'] },
        { name: 'E-moll', notes: ['E','G','B'] },
        { name: 'D-moll', notes: ['D','F','A'] },
        { name: 'B-dur', notes: ['B','D#','F#'] },
        { name: 'H-moll', notes: ['B','D','F#'] },
        { name: 'G-moll', notes: ['G','Bb','D'] },
        { name: 'C-moll', notes: ['C','Eb','G'] },
        { name: 'F-moll', notes: ['F','Ab','C'] },
        { name: 'A7', notes: ['A','C#','E','G'] },
        { name: 'E7', notes: ['E','G#','B','D'] },
        { name: 'D7', notes: ['D','F#','A','C'] },
        { name: 'G7', notes: ['G','B','D','F'] },
        { name: 'C7', notes: ['C','E','G','Bb'] },
        { name: 'B7', notes: ['B','D#','F#','A'] },
        { name: 'Am7', notes: ['A','C','E','G'] },
        { name: 'Em7', notes: ['E','G','B','D'] },
        { name: 'Dm7', notes: ['D','F','A','C'] },
        { name: 'Fmaj7', notes: ['F','A','C','E'] },
        { name: 'Gmaj7', notes: ['G','B','D','F#'] },
        { name: 'Amaj7', notes: ['A','C#','E','G#'] },
        { name: 'Emaj7', notes: ['E','G#','B','D#'] }
    ];

    function renderChordList(tab) {
        let html = '<div style="display:flex;flex-wrap:wrap;gap:1.5rem;justify-content:center;">';
        if (tab === 'guitar') {
            guitarChords.forEach(chord => {
                html += `<div style='display:flex;flex-direction:column;align-items:center;gap:0.5rem;'>
                    <span style='font-size:1.1rem;'>${chord.name}</span>
                    ${renderGuitarChordSVG(chord.fingering)}
                </div>`;
            });
        } else if (tab === 'bass') {
            bassChords.forEach(chord => {
                html += `<div style='display:flex;flex-direction:column;align-items:center;gap:0.5rem;'>
                    <span style='font-size:1.1rem;'>${chord.name}</span>
                    ${renderBassChordSVG(chord.fingering)}
                </div>`;
            });
        } else if (tab === 'keys') {
            keysChords.forEach(chord => {
                html += `<div style='display:flex;flex-direction:column;align-items:center;gap:0.5rem;'>
                    <span style='font-size:1.1rem;'>${chord.name}</span>
                    ${renderKeysChordSVG(chord.notes)}
                </div>`;
            });
        }
        html += '</div>';
        return html;
    }

    // Globalny AudioContext do całej aplikacji (jeden na wszystko)
    var globalAudioCtx = null;
    function getAudioCtx() {
        if (!globalAudioCtx || globalAudioCtx.state === 'closed') {
            globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return globalAudioCtx;
    }

    // Zmienione funkcje perkusyjne/metronom na użycie globalnego AudioContext
    function playClick() {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 1000;
        osc.connect(gain); gain.connect(ctx.destination);
        gain.gain.value = 1;
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); };
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

    // Graficzny sprawdzacz akordów – koło współgrających akordów (SVG)
    // Rozbudowane koło akordów: więcej akordów, lepsze kolory, tooltipy, podświetlenie harmonii
    var chordRelations = [
      { name: 'C-dur', color: '#4caf50', harmonies: ['A-moll','D-moll','E-moll','F-dur','G-dur','E7','G7'] },
      { name: 'A-moll', color: '#388e3c', harmonies: ['C-dur','D-moll','E-moll','F-dur','G-dur','E7','G7'] },
      { name: 'G-dur', color: '#1976d2', harmonies: ['C-dur','D-dur','E-moll','A-moll','B7','G7','E7'] },
      { name: 'D-dur', color: '#0288d1', harmonies: ['G-dur','A-dur','H-moll','E-moll','A7','D7'] },
      { name: 'E-moll', color: '#009688', harmonies: ['C-dur','G-dur','A-moll','D-dur','E7','G7'] },
      { name: 'F-dur', color: '#fbc02d', harmonies: ['C-dur','Bb','D-moll','G-moll','A7','Fmaj7'] },
      { name: 'D-moll', color: '#f57c00', harmonies: ['A-moll','C-dur','F-dur','G-dur','D7','A7'] },
      { name: 'A-dur', color: '#e64a19', harmonies: ['D-dur','E-dur','F#m','H7','A7','E7'] },
      { name: 'E-dur', color: '#ab47bc', harmonies: ['A-dur','B-dur','C#m','F#m','E7','A7'] },
      { name: 'B-dur', color: '#8d6e63', harmonies: ['Eb','F-dur','G-moll','D-moll','Bb7'] },
      { name: 'H-moll', color: '#6d4c41', harmonies: ['E-dur','F#m','G-dur','D-dur','B7'] },
      { name: 'G-moll', color: '#455a64', harmonies: ['C-moll','D-dur','Eb','F-dur','G7'] },
      { name: 'C-moll', color: '#607d8b', harmonies: ['G-moll','Ab','Bb','Eb','Cm7'] },
      { name: 'F-moll', color: '#bdbdbd', harmonies: ['Ab','Bb','C-moll','Db','Fm7'] },
      { name: 'A7', color: '#ff7043', harmonies: ['D-dur','E7','F#m','A-dur'] },
      { name: 'E7', color: '#ba68c8', harmonies: ['A-dur','H7','C#m','E-dur','A7'] },
      { name: 'D7', color: '#4dd0e1', harmonies: ['G-dur','A7','H7','D-dur'] },
      { name: 'G7', color: '#64b5f6', harmonies: ['C-dur','D7','E-moll','G-dur'] },
      { name: 'C7', color: '#ffd54f', harmonies: ['F-dur','G7','Bb','C-dur'] },
      { name: 'B7', color: '#a1887f', harmonies: ['E-dur','A-dur','F#m','H-moll'] },
      { name: 'Am7', color: '#81c784', harmonies: ['D7','E7','C-dur','A-moll'] },
      { name: 'Em7', color: '#4fc3f7', harmonies: ['A7','D7','G-dur','E-moll'] },
      { name: 'Dm7', color: '#ffb74d', harmonies: ['G7','C7','F-dur','D-moll'] },
      { name: 'Fmaj7', color: '#fff176', harmonies: ['G7','C-dur','D-moll','F-dur'] },
      { name: 'Gmaj7', color: '#90caf9', harmonies: ['C-dur','D7','E-moll','G-dur'] },
      { name: 'Amaj7', color: '#ce93d8', harmonies: ['D-dur','E7','F#m','A-dur'] },
      { name: 'Emaj7', color: '#b39ddb', harmonies: ['A-dur','B7','C#m','E-dur'] }
    ];

    function renderChordRelationsSVG(selected) {
      // Duże, responsywne koło akordów z większymi odstępami i mniejszymi kulkami
      const size = Math.min(window.innerWidth, window.innerHeight, 900) - 40;
      const cx = size / 2, cy = size / 2;
      // Zwiększ odległość: promień większy, kulki mniejsze
      const r = size / 2 - 30; // większy promień (mniej paddingu)
      const circleR = Math.max(36, Math.floor(size/28)); // mniejsze kulki
      const fontSize = Math.max(16, Math.floor(size/38));
      const chords = chordRelations;
      const selectedIdx = chords.findIndex(c => c.name === selected);
      let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="background:#23242b;border-radius:50%;max-width:100vw;max-height:80vh;">
        <g font-family='monospace' font-size='${fontSize}px'>`;
      // Linie do harmonii
      if (selectedIdx !== -1) {
        const angleSel = (Math.PI * 2 * selectedIdx) / chords.length - Math.PI/2;
        const xSel = cx + r * Math.cos(angleSel);
        const ySel = cy + r * Math.sin(angleSel);
        chords[selectedIdx].harmonies.forEach(h => {
          const idx = chords.findIndex(c => c.name === h);
          if (idx !== -1) {
            const angleH = (Math.PI * 2 * idx) / chords.length - Math.PI/2;
            const xH = cx + r * Math.cos(angleH);
            const yH = cy + r * Math.sin(angleH);
            svg += `<line x1="${xSel}" y1="${ySel}" x2="${xH}" y2="${yH}" stroke="#4caf50" stroke-width="${Math.max(4, Math.floor(size/160))}" opacity="0.85" />`;
          }
        });
      }
      // Kółka i podpisy
      for (let i = 0; i < chords.length; i++) {
        const angle = (Math.PI * 2 * i) / chords.length - Math.PI/2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        let fill = '#23242b', stroke = '#888', text = '#aaa', filter = '';
        if (chords[i].name === selected) {
          fill = chords[i].color; stroke = '#fff'; text = '#fff'; filter = 'drop-shadow(0 0 12px #fff8)';
        } else if (selectedIdx !== -1 && chords[selectedIdx].harmonies.includes(chords[i].name)) {
          fill = chords[i].color; stroke = '#4caf50'; text = '#fff'; filter = 'drop-shadow(0 0 10px #4caf50aa)';
        }
        svg += `<g><circle cx="${x}" cy="${y}" r="${circleR}" fill="${fill}" stroke="${stroke}" stroke-width="3" style="cursor:pointer;filter:${filter}" data-chord="${chords[i].name}" />`;
        svg += `<title>${chords[i].name} - kliknij!</title>`;
        svg += `<text x="${x}" y="${y+fontSize/2}" fill="${text}" text-anchor="middle" font-size="${fontSize}px" style="pointer-events:none;">${chords[i].name}</text></g>`;
      }
      svg += '</g></svg>';
      return svg;
    }

    // Modal graficznego sprawdzacza akordów
    var chordRelationsTemplate = `
      <div style="min-height:420px;display:flex;flex-direction:column;align-items:center;gap:2.2rem;">
        <h2 style="text-align:center;margin-bottom:0.2em;">Graficzny sprawdzacz akordów</h2>
        <div id="chord-relations-svg-wrap" style="width:100%;max-width:420px;display:flex;align-items:center;justify-content:center;"></div>
        <div style="margin-top:1.2rem;font-size:1.1rem;color:#aaa;text-align:center;">Kliknij akord na kole, aby zobaczyć z czym współgra!</div>
      </div>
    `;

    // Rozszerzony modal automatu perkusyjnego: bardzo szeroki, responsywny
    const drumMachineTemplate = `
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

    // Zmienna globalna na interwał metronomu
    var metronomeInterval = null;

    // Rockowe barwy perkusji (syntetyczne, ale stylizowane)
    var ROCK_SOUNDS = [
        { name: 'Kick', type: 'kick' },
        { name: 'Snare', type: 'snare' },
        { name: 'Hi-Hat', type: 'hihat' },
        { name: 'Clap', type: 'clap' },
        { name: 'Tom', type: 'tom' },
        { name: 'Cowbell', type: 'cowbell' },
        { name: 'Crash', type: 'crash' },
        { name: 'Ride', type: 'ride' }
    ];

    cards.forEach(card => {
        card.addEventListener('click', function() {
            // ZAWSZE czyść modalBody przed zmianą zawartości
            modalBody.innerHTML = '';
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
                const TAB_NOTES_PER_PAGE = 16; // było 8, teraz 16 nut na stronę tabulatury

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
                            svg += `<text x="${60 + f * fretSpacing - fretSpacing/2}" y="20" fill="#aaa" text-anchor="middle">${f}</text>`;
                        }
                    }
                    for (let s = 0; s < strings; s++) {
                        svg += `<line x1="60" y1="${40 + s * stringSpacing}" x2="${width - 10}" y2="${40 + s * stringSpacing}" stroke="#bbb" stroke-width="2" />`;
                        svg += `<text x="15" y="${45 + s * stringSpacing}" fill="#aaa" text-anchor="end">${tuning[s]}</text>`;
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
            } else if (section === 'chord-list') {
                modalBody.innerHTML = chordListTemplate;
                modal.classList.add('open');
                let currentTab = 'guitar';
                const content = document.getElementById('chord-list-content');
                content.innerHTML = renderChordList(currentTab);
                document.querySelectorAll('.chord-tab-btn').forEach(btn => {
                    btn.onclick = function() {
                        document.querySelectorAll('.chord-tab-btn').forEach(b => b.style.background = '#23242b');
                        this.style.background = '#4caf50';
                        this.style.color = '#fff';
                        currentTab = this.getAttribute('data-tab');
                        content.innerHTML = renderChordList(currentTab);
                    };
                });
            } else if (section === 'chord-checker') {
                modalBody.innerHTML = chordRelationsTemplate;
                modal.classList.add('open');
                const svgWrap = document.getElementById('chord-relations-svg-wrap');
                let selected = chordRelations[0].name;
                function updateSVG() {
                  svgWrap.innerHTML = renderChordRelationsSVG(selected);
                  // Dodaj obsługę kliknięć na kółkach
                  const svg = svgWrap.querySelector('svg');
                  svg.querySelectorAll('circle').forEach(circle => {
                    circle.onclick = function() {
                      selected = circle.getAttribute('data-chord');
                      updateSVG();
                    };
                  });
                }
                updateSVG();
            } else if (section === 'drum-machine') {
                modalBody.innerHTML = `
        <div style="min-height:340px;display:flex;flex-direction:column;align-items:center;gap:1.2rem;">
            <h2 style="text-align:center;">Automat perkusyjny</h2>
            <div style="margin-bottom:1.2rem;display:flex;gap:1.5rem;align-items:center;">
                <div>
                    <label for="drum-bpm" style="font-size:1.1rem;">Tempo (BPM):</label>
                    <input type="number" id="drum-bpm" min="40" max="240" value="120" style="font-size:1.1rem;padding:0.3rem 1.2rem;border-radius:8px;background:#23242b;color:#e0e0e0;border:1px solid #444;width:80px;">
                </div>
                <div>
                    <label for="drum-steps" style="font-size:1.1rem;">Długość patternu:</label>
                    <input type="number" id="drum-steps" min="4" max="64" value="16" style="font-size:1.1rem;padding:0.3rem 1.2rem;border-radius:8px;background:#23242b;color:#e0e0e0;border:1px solid #444;width:80px;">
                </div>
            </div>
            <div id="drum-grid" style="display:grid;grid-template-columns:repeat(16,28px);gap:6px;margin-bottom:1.2rem;"></div>
            <div style="display:flex;gap:1.2rem;">
                <button id="drum-start" style="font-size:1.1rem;padding:0.6rem 2.2rem;border-radius:8px;">Start</button>
                <button id="drum-stop" style="font-size:1.1rem;padding:0.6rem 2.2rem;border-radius:8px;">Stop</button>
                <button id="drum-clear" style="font-size:1.1rem;padding:0.6rem 1.2rem;border-radius:8px;background:#d32f2f;color:#fff;">Wyczyść</button>
            </div>
            <div style="font-size:1.05rem;color:#aaa;text-align:center;margin-top:1.2rem;max-width:900px;">
                Kliknij w pola, aby aktywować dźwięki. Możesz zmieniać długość patternu i tempo. Automat generuje rockowe barwy perkusji w przeglądarce (Web Audio API).
            </div>
        </div>
    `;
                modal.classList.add('open');
                let steps = 16;
                let SOUNDS = ROCK_SOUNDS.slice(0, 6); // domyślnie 6 instrumentów
                let rows = SOUNDS.length;
                let grid = Array.from({length: rows}, () => Array(steps).fill(false));
                let currentStep = 0;
                let interval = null;
                const drumGrid = document.getElementById('drum-grid');
                const stepsInput = document.getElementById('drum-steps');
                // Render grid
                function renderGrid() {
                    drumGrid.innerHTML = '';
                    // Kontener na całą siatkę z podpisami
                    const gridWrap = document.createElement('div');
                    gridWrap.style.display = 'grid';
                    gridWrap.style.gridTemplateColumns = `90px repeat(${steps}, 28px)`;
                    gridWrap.style.gap = '6px';
                    // Każdy rząd: podpis instrumentu
                    for (let r = 0; r < rows; r++) {
                        // Podpis instrumentu
                        const label = document.createElement('div');
                        label.textContent = SOUNDS[r].name;
                        label.style.display = 'flex';
                        label.style.alignItems = 'center';
                        label.style.justifyContent = 'flex-end';
                        label.style.height = '26px';
                        label.style.width = '90px';
                        label.style.fontSize = '1.05rem';
                        label.style.color = '#e0e0e0';
                        label.style.fontFamily = 'monospace';
                        label.style.userSelect = 'none';
                        gridWrap.appendChild(label);
                        // Przyciski kroków
                        for (let s = 0; s < steps; s++) {
                            const btn = document.createElement('button');
                            btn.style.width = '26px';
                            btn.style.height = '26px';
                            btn.style.borderRadius = '6px';
                            btn.style.border = '1px solid #444';
                            btn.style.background = grid[r][s] ? '#4caf50' : '#23242b';
                            btn.style.outline = 'none';
                            btn.style.cursor = 'pointer';
                            btn.title = SOUNDS[r].name + ' ' + (s+1);
                            btn.onclick = () => {
                                grid[r][s] = !grid[r][s];
                                renderGrid();
                            };
                            if (s === currentStep) btn.style.boxShadow = '0 0 0 2px #fff';
                            gridWrap.appendChild(btn);
                        }
                    }
                    drumGrid.appendChild(gridWrap);
                }
                // Rockowe barwy perkusji (syntetyczne)
                function playRockSound(type) {
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
                function playNoise(duration = 0.05, gainValue = 0.3, band = null) {
                    const ctx = getAudioCtx();
                    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < data.length; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                    const noise = ctx.createBufferSource();
                    noise.buffer = buffer;
                    let node = noise;
                    if (band) {
                        const filter = ctx.createBiquadFilter();
                        filter.type = band.type;
                        filter.frequency.value = band.freq;
                        node.connect(filter);
                        node = filter;
                    }
                    const gain = ctx.createGain();
                    gain.gain.value = gainValue;
                    node.connect(gain).connect(ctx.destination);
                    noise.start();
                    noise.stop(ctx.currentTime + duration);
                    noise.onended = () => { noise.disconnect(); gain.disconnect(); if (band) node.disconnect(); };
                }
                function playSound(row) {
                    playRockSound(SOUNDS[row].type);
                }
                function step() {
                    for (let r = 0; r < rows; r++) {
                        if (grid[r][currentStep]) playSound(r);
                    }
                    currentStep = (currentStep + 1) % steps;
                    renderGrid();
                }
                function start() {
                    if (interval) clearInterval(interval);
                    const bpm = parseInt(document.getElementById('drum-bpm').value, 10);
                    const ms = 60000 / bpm / 4; // 16th notes
                    interval = setInterval(step, ms);
                }
                function stop() {
                    if (interval) clearInterval(interval);
                    interval = null;
                }
                function clearGrid() {
                    grid = Array.from({length: rows}, () => Array(steps).fill(false));
                    renderGrid();
                }
                document.getElementById('drum-start').onclick = start;
                document.getElementById('drum-stop').onclick = stop;
                document.getElementById('drum-clear').onclick = clearGrid;
                document.getElementById('drum-bpm').onchange = function() { if (interval) { stop(); start(); } };
                stepsInput.onchange = function() {
                    steps = Math.max(4, Math.min(64, parseInt(stepsInput.value, 10) || 16));
                    grid = Array.from({length: rows}, () => Array(steps).fill(false));
                    renderGrid();
                };
                renderGrid();
            }
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.classList.remove('open');
        modalBody.innerHTML = '';
        stopMetronomeModal();
    });
    backdrop.addEventListener('click', function() {
        modal.classList.remove('open');
        modalBody.innerHTML = '';
        stopMetronomeModal();
    });
});