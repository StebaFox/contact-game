// ═════════════════════════════════════════════════════════════════════════════
// AUDIO SYSTEM
// All sound effects, music, and audio management
// ═════════════════════════════════════════════════════════════════════════════

// Audio state (module-level)
let audioContext = null;
let tuningOscillator = null;
let tuningGainNode = null;
let staticNoiseNode = null;
let staticGainNode = null;
let masterVolume = 0.5; // 0.0 to 1.0
let backgroundMusic = null;
let alienMusic = null;
let roomTone = null;
let machineSound = null;
let currentMusic = null; // Track which music is currently playing

// Signal ambient sounds
let naturalPhenomenaNode = null;
let naturalPhenomenaGain = null;
let alienSignalOscillators = [];
let alienSignalGain = null;

// Initialize audio system
export function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Resume AudioContext if suspended (required after user interaction)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // Initialize and play background music
    if (!backgroundMusic) {
        backgroundMusic = document.getElementById('background-music');
        backgroundMusic.volume = masterVolume * 0.3; // Background music at 30% of master volume
        backgroundMusic.play().catch(err => {
            console.log('Background music autoplay prevented:', err);
        });
        currentMusic = backgroundMusic;
    }

    // Initialize alien music (but don't play yet)
    if (!alienMusic) {
        alienMusic = document.getElementById('alien-music');
        alienMusic.volume = 0; // Start silent
    }

    // Initialize and play room tone
    if (!roomTone) {
        roomTone = document.getElementById('room-tone');
        roomTone.volume = masterVolume * 0.35; // Room tone at 35% of master volume
        roomTone.play().catch(err => {
            console.log('Room tone autoplay prevented:', err);
        });
    }
}

// Set master volume
export function setMasterVolume(volume) {
    masterVolume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1

    // Update currently playing music volume
    if (currentMusic === backgroundMusic && backgroundMusic) {
        backgroundMusic.volume = masterVolume * 0.3;
    } else if (currentMusic === alienMusic && alienMusic) {
        alienMusic.volume = masterVolume * 0.3;
    }

    // Update room tone volume
    if (roomTone) {
        roomTone.volume = masterVolume * 0.35; // Keep room tone at 35%
    }
}

// Get current master volume
export function getMasterVolume() {
    return masterVolume;
}

// Switch to alien music (crossfade)
export function switchToAlienMusic() {
    if (!alienMusic || currentMusic === alienMusic) return;

    // Start alien music
    alienMusic.currentTime = 0;
    alienMusic.play().catch(err => console.log('Alien music play prevented:', err));

    // Crossfade
    const fadeSteps = 30;
    const fadeInterval = 50; // ms
    let step = 0;

    const fade = setInterval(() => {
        step++;
        const progress = step / fadeSteps;

        // Fade out background music
        if (backgroundMusic) {
            backgroundMusic.volume = masterVolume * 0.3 * (1 - progress);
        }

        // Fade in alien music
        if (alienMusic) {
            alienMusic.volume = masterVolume * 0.3 * progress;
        }

        if (step >= fadeSteps) {
            clearInterval(fade);
            if (backgroundMusic) {
                backgroundMusic.pause();
            }
            currentMusic = alienMusic;
        }
    }, fadeInterval);
}

// Switch back to background music (crossfade)
export function switchToBackgroundMusic() {
    if (!backgroundMusic || currentMusic === backgroundMusic) return;

    // Start background music
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().catch(err => console.log('Background music play prevented:', err));

    // Crossfade
    const fadeSteps = 30;
    const fadeInterval = 50; // ms
    let step = 0;

    const fade = setInterval(() => {
        step++;
        const progress = step / fadeSteps;

        // Fade out alien music
        if (alienMusic) {
            alienMusic.volume = masterVolume * 0.3 * (1 - progress);
        }

        // Fade in background music
        if (backgroundMusic) {
            backgroundMusic.volume = masterVolume * 0.3 * progress;
        }

        if (step >= fadeSteps) {
            clearInterval(fade);
            if (alienMusic) {
                alienMusic.pause();
            }
            currentMusic = backgroundMusic;
        }
    }, fadeInterval);
}

// UI click sound
export function playClick() {
    // Initialize audio on first user interaction
    if (!audioContext) {
        initAudio();
    }
    if (!audioContext || masterVolume === 0) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.1 * masterVolume;

    oscillator.start(audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Scan acknowledge sound (confirmation tone)
export function playScanAcknowledge() {
    if (!audioContext || masterVolume === 0) return;

    // Two-tone acknowledgement
    [600, 800].forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.18 * masterVolume; // Increased volume

        const startTime = audioContext.currentTime + (i * 0.08);
        oscillator.start(startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
        oscillator.stop(startTime + 0.1);
    });
}

// Star selection sound (simple beep)
export function playSelectStar() {
    if (!audioContext || masterVolume === 0) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.12 * masterVolume;

    oscillator.start(audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
    oscillator.stop(audioContext.currentTime + 0.08);
}

// Static burst sound (short "chht")
export function playStaticBurst() {
    if (!audioContext || masterVolume === 0) return;

    // Create white noise buffer
    const bufferSize = audioContext.sampleRate * 0.5; // 500ms burst
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Fill with random noise
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    // Create noise source
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = buffer;

    // Create filter for radio static character
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 4000; // Higher frequency for sharper "chht"
    filter.Q.value = 1.0;

    // Create gain with envelope
    const gainNode = audioContext.createGain();
    const now = audioContext.currentTime;

    // Quick attack, hold, then sharp cutoff
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.05 * masterVolume, now + 0.01); // Fast attack
    gainNode.gain.setValueAtTime(0.05 * masterVolume, now + 0.48); // Hold at full volume
    gainNode.gain.linearRampToValueAtTime(0, now + 0.5); // Very quick cutoff

    // Connect: noise -> filter -> gain -> destination
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.5);
}

// Console typing sound
export function playTypingBeep() {
    // Initialize audio on first user interaction
    if (!audioContext) {
        initAudio();
    }
    if (!audioContext || masterVolume === 0) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1200;
    oscillator.type = 'square';
    gainNode.gain.value = 0.015 * masterVolume; // Very quiet

    oscillator.start(audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.02);
    oscillator.stop(audioContext.currentTime + 0.02);
}

// Signal lock achievement sound
export function playLockAchieved() {
    if (!audioContext || masterVolume === 0) return;

    // Multi-tone success sound
    [800, 1000, 1200].forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1 * masterVolume;

        const startTime = audioContext.currentTime + (i * 0.08);
        oscillator.start(startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        oscillator.stop(startTime + 0.3);
    });
}

// Play machine/alignment sound effect
export function playMachineSound() {
    if (masterVolume === 0) return;

    if (!machineSound) {
        machineSound = document.getElementById('machine-sound');
    }

    if (machineSound) {
        machineSound.currentTime = 0;
        machineSound.volume = masterVolume * 0.5;
        machineSound.play().catch(err => {
            console.log('Machine sound play prevented:', err);
        });
    }
}

// Stop machine sound with fade out
export function stopMachineSound() {
    if (machineSound && !machineSound.paused) {
        // Fade out over 1 second
        const fadeOutDuration = 1000;
        const fadeStep = 50;
        const steps = fadeOutDuration / fadeStep;
        const initialVolume = machineSound.volume;
        const volumeStep = initialVolume / steps;

        const fadeInterval = setInterval(() => {
            if (machineSound.volume > volumeStep) {
                machineSound.volume -= volumeStep;
            } else {
                machineSound.volume = 0;
                machineSound.pause();
                machineSound.currentTime = 0;
                machineSound.volume = initialVolume; // Reset for next play
                clearInterval(fadeInterval);
            }
        }, fadeStep);
    }
}

// Play metallic door shut sound (power failure)
let doorShutSound = null;
export function playDoorShutSound() {
    if (masterVolume === 0) return;

    if (!doorShutSound) {
        doorShutSound = document.getElementById('door-shut-sound');
    }

    if (doorShutSound) {
        doorShutSound.currentTime = 0;
        doorShutSound.volume = masterVolume * 0.6;
        doorShutSound.play().catch(err => {
            console.log('Door shut sound play prevented:', err);
        });
    }
}

// Start continuous tuning tone (changes with signal quality)
export function startTuningTone(quality) {
    // Ensure audio context exists
    if (!audioContext) {
        initAudio();
    }

    if (!audioContext || masterVolume === 0) {
        stopTuningTone();
        return;
    }

    if (!tuningOscillator) {
        tuningOscillator = audioContext.createOscillator();
        tuningGainNode = audioContext.createGain();

        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        tuningOscillator.connect(filter);
        filter.connect(tuningGainNode);
        tuningGainNode.connect(audioContext.destination);

        tuningOscillator.type = 'sawtooth';

        // Start at zero volume for smooth fade-in
        tuningGainNode.gain.value = 0;

        tuningOscillator.start();
    }

    // Update frequency and volume based on quality (0-1)
    const baseFreq = 100;
    const targetFreq = baseFreq + (quality * 300); // 100Hz to 400Hz
    const volume = (0.015 + (quality * 0.05)) * masterVolume; // Reduced volume

    tuningOscillator.frequency.setTargetAtTime(targetFreq, audioContext.currentTime, 0.05);
    tuningGainNode.gain.setTargetAtTime(volume, audioContext.currentTime, 0.1); // Slower fade for smoother start
}

// Stop tuning tone
export function stopTuningTone() {
    if (tuningOscillator) {
        tuningGainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        setTimeout(() => {
            if (tuningOscillator) {
                tuningOscillator.stop();
                tuningOscillator = null;
                tuningGainNode = null;
            }
        }, 250);
    }
}

// Create white noise buffer for static
function createWhiteNoiseBuffer() {
    if (!audioContext) return null;

    const bufferSize = audioContext.sampleRate * 2; // 2 seconds of noise
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Fill with random values between -1 and 1
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    return buffer;
}

// Start static hiss (loud at start, diminishes with signal quality)
export function startStaticHiss() {
    // Ensure audio context exists
    if (!audioContext) {
        initAudio();
    }

    if (!audioContext || masterVolume === 0) {
        stopStaticHiss();
        return;
    }

    if (!staticNoiseNode) {
        // Create noise source
        staticNoiseNode = audioContext.createBufferSource();
        staticNoiseNode.buffer = createWhiteNoiseBuffer();
        staticNoiseNode.loop = true;

        // Create gain node for volume control
        staticGainNode = audioContext.createGain();

        // Create filter to make it sound more like radio static (bandpass)
        const filter = audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3000; // Center around 3kHz
        filter.Q.value = 0.5; // Wider band

        // Connect: noise -> filter -> gain -> destination
        staticNoiseNode.connect(filter);
        filter.connect(staticGainNode);
        staticGainNode.connect(audioContext.destination);

        // Start at maximum volume (will be updated by tuningFeedbackLoop)
        staticGainNode.gain.value = 0.03 * masterVolume;

        staticNoiseNode.start();
    }
}

// Update static hiss volume (called during tuning)
export function updateStaticHissVolume(volume) {
    if (staticGainNode) {
        staticGainNode.gain.setTargetAtTime(volume * masterVolume, audioContext.currentTime, 0.1);
    }
}

// Stop static hiss
export function stopStaticHiss() {
    if (staticNoiseNode) {
        // Fade out smoothly
        staticGainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        setTimeout(() => {
            if (staticNoiseNode) {
                staticNoiseNode.stop();
                staticNoiseNode = null;
                staticGainNode = null;
            }
        }, 350);
    }
}

// Analysis processing sound
export function playAnalysisSound() {
    if (!audioContext || masterVolume === 0) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 400;
    oscillator.type = 'square';
    gainNode.gain.value = 0.05 * masterVolume;

    oscillator.start(audioContext.currentTime);

    // Warble effect
    for (let i = 0; i < 5; i++) {
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime + (i * 0.1));
        oscillator.frequency.setValueAtTime(450, audioContext.currentTime + (i * 0.1) + 0.05);
    }

    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Contact detected sound (special!)
export function playContactSound() {
    if (!audioContext || masterVolume === 0) return;

    // Ascending harmonic tones
    [200, 300, 400, 500, 600].forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.08 * masterVolume;

        const startTime = audioContext.currentTime + (i * 0.12);
        oscillator.start(startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
        oscillator.stop(startTime + 0.5);
    });
}

// Natural phenomena ambient sound (static hiss for pulsars, etc.)
export function startNaturalPhenomenaSound() {
    if (!audioContext || masterVolume === 0) {
        stopNaturalPhenomenaSound();
        return;
    }

    if (!naturalPhenomenaNode) {
        // Create white noise
        const bufferSize = audioContext.sampleRate * 2;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        naturalPhenomenaNode = audioContext.createBufferSource();
        naturalPhenomenaNode.buffer = buffer;
        naturalPhenomenaNode.loop = true;

        // Filter for natural radio emissions
        const filter = audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 0.3;

        naturalPhenomenaGain = audioContext.createGain();
        naturalPhenomenaGain.gain.value = 0.03 * masterVolume; // Subtle

        naturalPhenomenaNode.connect(filter);
        filter.connect(naturalPhenomenaGain);
        naturalPhenomenaGain.connect(audioContext.destination);

        naturalPhenomenaNode.start();
    }
}

// Stop natural phenomena sound
export function stopNaturalPhenomenaSound() {
    if (naturalPhenomenaNode) {
        naturalPhenomenaGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        setTimeout(() => {
            if (naturalPhenomenaNode) {
                naturalPhenomenaNode.stop();
                naturalPhenomenaNode = null;
                naturalPhenomenaGain = null;
            }
        }, 550);
    }
}

// Alien signal ambient sound (deep mysterious tones like Contact movie)
export function startAlienSignalSound(star) {
    if (!audioContext || masterVolume === 0) {
        stopAlienSignalSound();
        return;
    }

    if (alienSignalOscillators.length === 0) {
        alienSignalGain = audioContext.createGain();
        alienSignalGain.gain.value = 0.06 * masterVolume;
        alienSignalGain.connect(audioContext.destination);

        // Use star ID to create unique sound for each alien signal
        const starSeed = star ? (star.id + 1) : 1;
        const fundamental = 40 + (starSeed % 5) * 5; // Varies 40-60Hz
        const harmonicPattern = [
            [1, 1.5, 2, 3, 4.5],      // Pattern 0
            [1, 1.618, 2.5, 3.236, 5], // Pattern 1 (golden ratio based)
            [1, 1.333, 2, 3, 4],       // Pattern 2
            [1, 1.414, 2.828, 4, 5.657] // Pattern 3 (sqrt(2) based)
        ];
        const harmonics = harmonicPattern[starSeed % 4];

        harmonics.forEach((ratio, i) => {
            const osc = audioContext.createOscillator();
            const oscGain = audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = fundamental * ratio;

            // Lower harmonics are louder
            const volume = 1 / (i + 1);
            oscGain.gain.value = volume;

            osc.connect(oscGain);
            oscGain.connect(alienSignalGain);

            osc.start();
            alienSignalOscillators.push({ osc, oscGain });
        });

        // Add slow pulsing modulation with unique speed
        const lfo = audioContext.createOscillator();
        lfo.frequency.value = 0.4 + (starSeed % 4) * 0.1; // Varies 0.4-0.7 Hz
        const lfoGain = audioContext.createGain();
        lfoGain.gain.value = 0.03;

        lfo.connect(lfoGain);
        lfoGain.connect(alienSignalGain.gain);
        lfo.start();

        alienSignalOscillators.push({ osc: lfo, oscGain: lfoGain });
    }
}

// Stop alien signal sound
export function stopAlienSignalSound() {
    if (alienSignalOscillators.length > 0) {
        if (alienSignalGain) {
            alienSignalGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        }

        setTimeout(() => {
            alienSignalOscillators.forEach(({ osc }) => {
                osc.stop();
            });
            alienSignalOscillators = [];
            alienSignalGain = null;
        }, 550);
    }
}

// Dish rotation sound
export function playDishRotationSound() {
    if (!audioContext || masterVolume === 0) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(150, audioContext.currentTime + 0.9);

    gainNode.gain.setValueAtTime(0.03 * masterVolume, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.2);
}

// Dish aligned sound
export function playDishAlignedSound() {
    if (!audioContext || masterVolume === 0) return;

    [400, 600].forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.06 * masterVolume;

        const startTime = audioContext.currentTime + (i * 0.1);
        oscillator.start(startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
        oscillator.stop(startTime + 0.15);
    });
}

// Security beep (used in boot sequence)
export function playSecurityBeep(type = 'normal') {
    // Initialize audio on first user interaction
    if (!audioContext) {
        initAudio();
    }
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'warning') {
        oscillator.frequency.value = 600;
        gainNode.gain.setValueAtTime(0.08 * masterVolume, audioContext.currentTime);
    } else if (type === 'success') {
        oscillator.frequency.value = 1200;
        gainNode.gain.setValueAtTime(0.06 * masterVolume, audioContext.currentTime);
    } else {
        oscillator.frequency.value = 900;
        gainNode.gain.setValueAtTime(0.05 * masterVolume, audioContext.currentTime);
    }

    oscillator.type = 'sine';
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
}
