// Szablon generatora tabulatury z SVG fretboardem
export const tabGeneratorTemplate = `
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

// Konfiguracja instrumentów
export const instruments = {
    guitar: { strings: 6, frets: 24, tuning: ['E', 'B', 'G', 'D', 'A', 'E'] },
    bass:   { strings: 4, frets: 24, tuning: ['G', 'D', 'A', 'E'] }
};

// Funkcje pomocnicze do renderowania fretboardu i tabulatury
export function renderFretboardSVG(currentInstrument, selected, onClick) {
    const { strings, frets, tuning } = instruments[currentInstrument];
    const width = 60 + (frets * 48);
    const height = 60 + strings * 32;
    const fretSpacing = (width - 60) / frets;
    const stringSpacing = (height - 60) / (strings - 1);
    
    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#23242b;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
        <g font-family='monospace' font-size='1.1rem'>`;
    
    // Progi
    for (let f = 0; f <= frets; f++) {
        svg += `<line x1="${60 + f * fretSpacing}" y1="40" x2="${60 + f * fretSpacing}" y2="${height - 20}" stroke="#888" stroke-width="${f === 0 ? 5 : 2}" />`;
        if (f > 0) {
            svg += `<text x="${60 + f * fretSpacing - fretSpacing/2}" y="20" fill="#aaa" text-anchor="middle">${f}</text>`;
        }
    }
    
    // Struny i ich nazwy
    for (let s = 0; s < strings; s++) {
        svg += `<line x1="60" y1="${40 + s * stringSpacing}" x2="${width - 10}" y2="${40 + s * stringSpacing}" stroke="#bbb" stroke-width="2" />`;
        svg += `<text x="15" y="${45 + s * stringSpacing}" fill="#aaa" text-anchor="end">${tuning[s]}</text>`;
    }
    
    // Punkty na progach
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
    return svg;
}

export function renderTab(tabData, currentPage, instrument) {
    const { strings, tuning } = instruments[instrument];
    const TAB_NOTES_PER_PAGE = 16;
    let lines = tuning.map(t => t + '|');
    const startIdx = currentPage * TAB_NOTES_PER_PAGE;
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
    
    return lines.join('\n');
}

export function renderTabPagination(currentPage, totalNotes) {
    const TAB_NOTES_PER_PAGE = 16;
    const totalPages = Math.max(1, Math.ceil(totalNotes / TAB_NOTES_PER_PAGE));
    
    return `
        <div style="display:flex;justify-content:center;align-items:center;gap:1.2rem;margin-top:1.2rem;">
            <button id="tab-prev-page" ${currentPage === 0 ? 'disabled' : ''} style="font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;">Poprzednia strona</button>
            <span style="font-size:1.1rem;">Strona ${currentPage + 1} z ${totalPages}</span>
            <button id="tab-next-page" ${currentPage >= totalPages-1 ? 'disabled' : ''} style="font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;">Następna strona</button>
        </div>
    `;
}