/**
 * Sound System for Shalini's Birthday Surprise
 * Synthesizes audio using the Web Audio API - 100% offline, zero external files required!
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.musicPlaying = false;
        this.musicInterval = null;
        this.musicGain = null;
        this.masterGain = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            this.musicGain.connect(this.masterGain);

            this.initialized = true;
        } catch (e) {
            console.warn("Web Audio API not supported", e);
        }
    }

    resume() {
        if (!this.initialized) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime, 0.05);
        }
        return this.isMuted;
    }

    // Party Popper Sound: Snappy noise burst + resonant thump
    playPop() {
        if (this.isMuted) return;
        try {
            this.resume();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;

            // Low frequency thud
            const osc = this.ctx.createOscillator();
            const oscGain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
            oscGain.gain.setValueAtTime(0.8, now);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
            osc.connect(oscGain);
            oscGain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + 0.15);

            // Noise crackle/snap
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(2400, now);
            filter.Q.setValueAtTime(1.5, now);

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.9, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.masterGain);
            noise.start(now);
        } catch (e) {
            console.warn("Sound playPop error:", e);
        }
    }

    // Magic Sparkle / Chime Cascade
    playSparkle() {
        if (this.isMuted) return;
        try {
            this.resume();
            if (!this.ctx) return;

            const notes = [587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51]; // D pentatonic
            const now = this.ctx.currentTime;

            notes.forEach((freq, idx) => {
                const time = now + idx * 0.06;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, time);

                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.2, time + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

                osc.connect(gain);
                gain.connect(this.masterGain);

                osc.start(time);
                osc.stop(time + 0.55);
            });
        } catch (e) {
            console.warn("Sound playSparkle error:", e);
        }
    }

    // Gift Box Opening: Mystery swell to bright shimmer
    playGiftOpen() {
        if (this.isMuted) return;
        try {
            this.resume();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;

            // Mystery swell
            const swell = this.ctx.createOscillator();
            const swellGain = this.ctx.createGain();
            swell.type = 'sine';
            swell.frequency.setValueAtTime(220, now);
            swell.frequency.exponentialRampToValueAtTime(660, now + 0.6);

            swellGain.gain.setValueAtTime(0.05, now);
            swellGain.gain.linearRampToValueAtTime(0.4, now + 0.5);
            swellGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

            swell.connect(swellGain);
            swellGain.connect(this.masterGain);
            swell.start(now);
            swell.stop(now + 0.8);

            // Sparkle burst right at the pop
            setTimeout(() => {
                this.playSparkle();
                this.playPop();
            }, 500);
        } catch (e) {
            console.warn("Sound playGiftOpen error:", e);
        }
    }

    // Smooth page transition whoosh
    playWhoosh() {
        if (this.isMuted) return;
        try {
            this.resume();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(450, now + 0.2);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.45);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + 0.5);
        } catch (e) {
            console.warn("Sound playWhoosh error:", e);
        }
    }

    // Blowing out candle: Soft breath puff + sizzle
    playBlowCandle() {
        if (this.isMuted) return;
        try {
            this.resume();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.7);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                const envelope = Math.sin((i / bufferSize) * Math.PI);
                data[i] = (Math.random() * 2 - 1) * envelope;
            }

            const puff = this.ctx.createBufferSource();
            puff.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600, now);
            filter.frequency.exponentialRampToValueAtTime(200, now + 0.6);

            const puffGain = this.ctx.createGain();
            puffGain.gain.setValueAtTime(0.4, now);
            puffGain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

            puff.connect(filter);
            filter.connect(puffGain);
            puffGain.connect(this.masterGain);
            puff.start(now);
        } catch (e) {
            console.warn("Sound playBlowCandle error:", e);
        }
    }

    // Resonant crystal wish chime
    playWishChime() {
        if (this.isMuted) return;
        try {
            this.resume();
            if (!this.ctx) return;

            const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C major chord harmonics
            const now = this.ctx.currentTime;

            freqs.forEach((freq, idx) => {
                const time = now + idx * 0.08;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, time);

                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.18, time + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.6);

                osc.connect(gain);
                gain.connect(this.masterGain);

                osc.start(time);
                osc.stop(time + 1.7);
            });
        } catch (e) {
            console.warn("Sound playWishChime error:", e);
        }
    }

    // Grand Finale Fanfare
    playFanfare() {
        if (this.isMuted) return;
        try {
            this.resume();
            if (!this.ctx) return;

            // Joyful arpeggio sequence
            const melody = [
                { f: 523.25, d: 0.12 }, // C5
                { f: 659.25, d: 0.12 }, // E5
                { f: 783.99, d: 0.12 }, // G5
                { f: 1046.50, d: 0.28 }, // C6
                { f: 880.00, d: 0.14 }, // A5
                { f: 1046.50, d: 0.5 }, // C6 long
            ];

            let cursor = this.ctx.currentTime;
            melody.forEach(note => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(note.f, cursor);

                gain.gain.setValueAtTime(0, cursor);
                gain.gain.linearRampToValueAtTime(0.22, cursor + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, cursor + note.d);

                osc.connect(gain);
                gain.connect(this.masterGain);

                osc.start(cursor);
                osc.stop(cursor + note.d + 0.05);

                cursor += note.d * 0.85;
            });
        } catch (e) {
            console.warn("Sound playFanfare error:", e);
        }
    }

    // Ambient Dreamy Background Music (Soft Lo-Fi Chords)
    toggleMusic(start) {
        if (start === undefined) {
            this.musicPlaying = !this.musicPlaying;
        } else {
            this.musicPlaying = start;
        }

        if (this.musicPlaying) {
            this.resume();
            this.startAmbientMusicLoop();
        } else {
            this.stopAmbientMusicLoop();
        }
        return this.musicPlaying;
    }

    startAmbientMusicLoop() {
        if (this.musicInterval) return;
        if (!this.ctx) this.init();

        // Chords: Cmaj9 -> Am9 -> Fmaj7 -> Gsus4
        const chordProgressions = [
            [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
            [220.00, 261.63, 329.63, 392.00, 493.88], // Am9
            [174.61, 261.63, 329.63, 349.23, 440.00], // Fmaj7
            [196.00, 261.63, 293.66, 392.00, 523.25]  // Gsus4 -> G
        ];

        let chordIndex = 0;
        const playChord = () => {
            if (!this.musicPlaying || this.isMuted || !this.ctx) return;

            const chord = chordProgressions[chordIndex % chordProgressions.length];
            chordIndex++;

            const now = this.ctx.currentTime;
            chord.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();

                osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.05);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, now);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.08, now + 0.6);
                gain.gain.setValueAtTime(0.07, now + 2.0);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.musicGain);

                osc.start(now);
                osc.stop(now + 3.5);
            });
        };

        playChord();
        this.musicInterval = setInterval(playChord, 3200);
    }

    stopAmbientMusicLoop() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
    }
}

// Global Sound Instance
window.sound = new SoundEngine();
