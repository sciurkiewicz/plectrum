// Globalny AudioContext do całej aplikacji
let globalAudioCtx = null;

export function getAudioCtx() {
    if (!globalAudioCtx || globalAudioCtx.state === 'closed') {
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return globalAudioCtx;
}

// Pomocnicza funkcja do generowania szumu
export function playNoise(duration = 0.05, gainValue = 0.3, band = null) {
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
    noise.onended = () => { 
        noise.disconnect(); 
        gain.disconnect(); 
        if (band) node.disconnect(); 
    };
}