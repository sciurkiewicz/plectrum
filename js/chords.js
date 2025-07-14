// Skrypt do obsługi akordów na podstronie chords.html

// Tutaj możesz dodać funkcje i zmienne związane z obsługą akordów

function przykladowaFunkcja() {
    // Przykładowa funkcja do obsługi akordów
    console.log("Akordy są super!");
}

// Dane akordów dla różnych instrumentów i funkcje do ich renderowania
export const guitarChords = [
    { name: 'C-dur', fingering: 'x32010' },
    { name: 'A-moll', fingering: 'x02210' },
    { name: 'D-dur', fingering: 'xx0232' },
    { name: 'E-dur', fingering: '022100' },
    { name: 'F-dur', fingering: '133211' },
    { name: 'G-dur', fingering: '320003' },
    { name: 'A-dur', fingering: 'x02220' },
    { name: 'H-moll', fingering: 'x24432' },
    { name: 'C7', fingering: 'x32310' },
    { name: 'F7', fingering: '131211' },
    { name: 'B7', fingering: 'x24242' },
    { name: 'E7', fingering: '020100' },
    { name: 'A7', fingering: 'x02020' },
    { name: 'D7', fingering: 'xx0212' },
    { name: 'G7', fingering: '320001' },
    { name: 'Em', fingering: '022000' },
    { name: 'Am', fingering: 'x02210' },
    { name: 'Dm', fingering: 'xx0231' },
    { name: 'Bm', fingering: 'x24432' },
    { name: 'F#m', fingering: '244222' },
    { name: 'G#m', fingering: '466444' },
    { name: 'B', fingering: 'x24442' }
];

export const bassChords = [
    { name: 'E', fingering: '0220' },
    { name: 'A', fingering: 'x022' },
    { name: 'D', fingering: 'xx023' },
    { name: 'G', fingering: '3200' },
    { name: 'C', fingering: 'x320' },
    { name: 'F', fingering: '133' },
    { name: 'Bb', fingering: '113' },
    { name: 'Eb', fingering: 'x112' },
    { name: 'Ab', fingering: '466' },
    { name: 'Db', fingering: 'x466' },
    { name: 'Gb', fingering: '244' },
    { name: 'B', fingering: 'x244' },
    { name: 'E7', fingering: '020100' },
    { name: 'A7', fingering: 'x02020' },
    { name: 'D7', fingering: 'xx0212' },
    { name: 'G7', fingering: '320001' },
    { name: 'Cm', fingering: 'x35543' },
    { name: 'Fm', fingering: '133111' },
    { name: 'Bm', fingering: 'x24432' },
    { name: 'F#m', fingering: '244222' },
    { name: 'G#m', fingering: '466444' },
    { name: 'B', fingering: 'x24442' }
];

export const keysChords = [
    { name: 'C-dur', notes: ['C','E','G'] },
    { name: 'A-moll', notes: ['A','C','E'] },
    { name: 'D-dur', notes: ['D','F#','A'] },
    { name: 'E-moll', notes: ['E','G','B'] },
    { name: 'F-dur', notes: ['F','A','C'] },
    { name: 'G-dur', notes: ['G','B','D'] },
    { name: 'A-dur', notes: ['A','C#','E'] },
    { name: 'H-moll', notes: ['B','D','F#'] },
    { name: 'C7', notes: ['C','E','G','Bb'] },
    { name: 'F7', notes: ['F','A','C','Eb'] },
    { name: 'B7', notes: ['B','D#','F#','A'] },
    { name: 'E7', notes: ['E','G#','B','D'] },
    { name: 'A7', notes: ['A','C#','E','G'] },
    { name: 'D7', notes: ['D','F#','A','C'] },
    { name: 'G7', notes: ['G','B','D','F'] },
    { name: 'Em', notes: ['E','G','B'] },
    { name: 'Am', notes: ['A','C','E'] },
    { name: 'Dm', notes: ['D','F','A'] },
    { name: 'Bm', notes: ['B','D','F#'] },
    { name: 'F#m', notes: ['F#','A','C#'] },
    { name: 'G#m', notes: ['G#','B','D#'] },
    { name: 'Emaj7', notes: ['E','G#','B','D#'] }
];

export const chordRelations = [
    { name: 'C-dur', color: '#4caf50', harmonies: ['A-moll','D-moll','E-moll','F-dur','G-dur','E7','G7'] },
    { name: 'A-moll', color: '#388e3c', harmonies: ['C-dur','D-moll','E-moll','F-dur','G-dur','E7','G7'] },
    { name: 'D-dur', color: '#2196f3', harmonies: ['B-moll','G-moll','A-dur','C-dur','E7'] },
    { name: 'E-moll', color: '#9c27b0', harmonies: ['C-dur','A-moll','D-moll','F-dur','G-dur'] },
    { name: 'F-dur', color: '#f44336', harmonies: ['C-dur','D-moll','E-moll','A-moll','G7'] },
    { name: 'G-dur', color: '#ff9800', harmonies: ['C-dur','A-moll','D-moll','E-moll','F-dur'] },
    { name: 'A-dur', color: '#3f51b5', harmonies: ['D-moll','E-moll','F#','B7'] },
    { name: 'H-moll', color: '#9e9e9e', harmonies: ['D-dur','F#','A-dur','C#'] },
    { name: 'C7', color: '#795548', harmonies: ['F-dur','G-dur','E7'] },
    { name: 'F7', color: '#607d8b', harmonies: ['Bb','C','D7'] },
    { name: 'B7', color: '#ffc107', harmonies: ['E7','A7','D7'] },
    { name: 'E7', color: '#8bc34a', harmonies: ['C-dur','A-moll','D-moll','G-dur'] },
    { name: 'A7', color: '#673ab7', harmonies: ['D7','E7','C#m'] },
    { name: 'D7', color: '#e91e63', harmonies: ['G7','C7','F#m'] },
    { name: 'G7', color: '#00bcd4', harmonies: ['C-dur','A-moll','D-moll','E-moll'] },
    { name: 'Em', color: '#4caf50', harmonies: ['C-dur','A-moll','D-moll'] },
    { name: 'Am', color: '#8bc34a', harmonies: ['C-dur','D-moll','E-moll'] },
    { name: 'Dm', color: '#ffc107', harmonies: ['C-dur','E-moll','F-dur'] },
    { name: 'Bm', color: '#9c27b0', harmonies: ['D-dur','F#','A-dur'] },
    { name: 'F#m', color: '#2196f3', harmonies: ['A-dur','C#m','E-dur'] },
    { name: 'G#m', color: '#673ab7', harmonies: ['B','D#','F#'] },
    { name: 'Emaj7', color: '#b39ddb', harmonies: ['A-dur','B7','C#m','E-dur'] }
];

// Funkcje renderowania akordów
export function renderGuitarChordSVG(fingering) {
    const frets = fingering.split('').map(f => f === 'x' ? null : parseInt(f));
    const width = 120, height = 90;
    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#23242b;border-radius:8px;">
        <g font-family='monospace' font-size='0.9rem'>`;
    // Progi
    for (let f = 0; f < 5; f++) {
        svg += `<line x1="20" y1="${20 + f*15}" x2="100" y2="${20 + f*15}" stroke="#aaa" stroke-width="2" />`;
    }
    // Struny
    for (let s = 0; s < 6; s++) {
        svg += `<line x1="${20 + s*16}" y1="20" x2="${20 + s*16}" y2="80" stroke="#bbb" stroke-width="2" />`;
    }
    // Palce
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

export function renderBassChordSVG(fingering) {
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

export function renderKeysChordSVG(notes) {
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

export function renderChordList(tab) {
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

export function renderChordRelationsSVG(selected) {
    const size = 380; // stały rozmiar
    const cx = size / 2, cy = size / 2;
    const r = size / 2 - 30;
    const circleR = 24; // mniejsze kółka
    const fontSize = 14; // mniejsza czcionka
    const chords = chordRelations;
    const selectedIdx = chords.findIndex(c => c.name === selected);
    
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="background:#23242b;border-radius:50%;">
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
                svg += `<line x1="${xSel}" y1="${ySel}" x2="${xH}" y2="${yH}" stroke="#4caf50" stroke-width="3" opacity="0.85" />`;
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
            fill = chords[i].color;
            stroke = '#fff';
            text = '#fff';
            filter = 'drop-shadow(0 0 8px #fff8)';
        } else if (selectedIdx !== -1 && chords[selectedIdx].harmonies.includes(chords[i].name)) {
            fill = chords[i].color;
            stroke = '#4caf50';
            text = '#fff';
            filter = 'drop-shadow(0 0 6px #4caf50aa)';
        }
        svg += `<g class="chord-circle" data-chord="${chords[i].name}">`;
        svg += `<circle cx="${x}" cy="${y}" r="${circleR}" fill="${fill}" stroke="${stroke}" stroke-width="2" style="cursor:pointer;filter:${filter};transition:all 0.3s ease;" />`;
        svg += `<text x="${x}" y="${y+fontSize/2}" fill="${text}" text-anchor="middle" font-size="${fontSize}px" style="pointer-events:none;transition:all 0.3s ease;user-select:none;">${chords[i].name}</text></g>`;
    }
    svg += '</g></svg>';
    return svg;
}

// Szablony komponentów
export const chordListTemplate = `
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

export const chordRelationsTemplate = `
    <div style="min-height:420px;display:flex;flex-direction:column;align-items:center;">
        <h2 style="text-align:center;margin-bottom:1.5rem;">Graficzny sprawdzacz akordów</h2>
        <div style="display:flex;gap:3rem;align-items:flex-start;justify-content:center;width:100%;">
            <div style="background:#23242b;padding:2rem;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
                <div id="chord-relations-svg-wrap" style="width:380px;"></div>
                <div style="margin-top:1.2rem;font-size:1.1rem;color:#aaa;text-align:center;">
                    Kliknij akord na kole, aby zobaczyć z czym harmonizuje!
                </div>
            </div>
            <div id="chord-info" style="background:#23242b;padding:2rem;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.2);width:380px;">
                <h3 style="text-align:center;margin-bottom:1.5rem;color:#e0e0e0;">Jak zagrać: <span id="chord-name"></span></h3>
                <div style="display:flex;flex-direction:column;gap:1.8rem;">
                    <div>
                        <h4 style="color:#aaa;margin-bottom:0.8rem;">Gitara:</h4>
                        <div id="guitar-diagram" style="display:flex;justify-content:center;"></div>
                    </div>
                    <div>
                        <h4 style="color:#aaa;margin-bottom:0.8rem;">Bas:</h4>
                        <div id="bass-diagram" style="display:flex;justify-content:center;"></div>
                    </div>
                    <div>
                        <h4 style="color:#aaa;margin-bottom:0.8rem;">Pianino:</h4>
                        <div id="keys-diagram" style="display:flex;justify-content:center;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;