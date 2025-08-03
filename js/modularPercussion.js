// js/modularPercussion.js
// Proste efekty perkusyjne do syntezatora modularnego

class ModularPercussion {
    constructor(audioCtx) {
        this.audioCtx = audioCtx;
    }

    playKick(volume = 0.5) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.16);
    }

    playSnare(volume = 0.5) {
        const noiseBuffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate * 0.2, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < output.length; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const noise = this.audioCtx.createBufferSource();
        noise.buffer = noiseBuffer;
        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);
        noise.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start();
        noise.stop(this.audioCtx.currentTime + 0.21);
    }

    playHiHat(volume = 0.3) {
        const noiseBuffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate * 0.05, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < output.length; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const noise = this.audioCtx.createBufferSource();
        noise.buffer = noiseBuffer;
        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);
        noise.connect(gain);
        gain.connect(this.audioCtx.destination);
        noise.start();
        noise.stop(this.audioCtx.currentTime + 0.06);
    }
}

export default ModularPercussion;
