// ═════════════════════════════════════════════════════════════════════════════
// AUDIO SYSTEM
// All sound effects, music, and audio management
// ═════════════════════════════════════════════════════════════════════════════

// Hash a string star ID to a numeric seed
function hashStarId(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash) + id.charCodeAt(i);
        hash = Math.abs(hash | 0);
    }
    return hash || 1;
}

// Audio state (module-level)
let audioContext = null;
let tuningOscillator = null;
let tuningGainNode = null;
let staticNoiseNode = null;
let staticGainNode = null;
let musicVolume = 0.5; // 0.0 to 1.0
let sfxVolume = 0.5;   // 0.0 to 1.0
let backgroundMusic = null;
let alienMusic = null;
let roomTone = null;
let glassCathedralMusic = null;
let machineSound = null;
let currentMusic = null; // Track which music is currently playing
let musicBeforeFinalMessage = null; // Remember what was playing before final message

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
        backgroundMusic.volume = musicVolume * 0.3; // Background music at 30% of music volume
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
        roomTone.volume = musicVolume * 0.35; // Room tone at 35% of music volume
        roomTone.play().catch(err => {
            console.log('Room tone autoplay prevented:', err);
        });
    }
}

// Set music volume
export function setMusicVolume(volume) {
    musicVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('seti-musicVolume', musicVolume);

    // Update currently playing music volume
    if (currentMusic === backgroundMusic && backgroundMusic) {
        backgroundMusic.volume = musicVolume * 0.3;
    } else if (currentMusic === alienMusic && alienMusic) {
        alienMusic.volume = musicVolume * 0.3;
    } else if (currentMusic === glassCathedralMusic && glassCathedralMusic) {
        glassCathedralMusic.volume = musicVolume * 0.4;
    }

    // Update room tone volume
    if (roomTone) {
        roomTone.volume = musicVolume * 0.35;
    }
}

// Set SFX volume
export function setSfxVolume(volume) {
    sfxVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('seti-sfxVolume', sfxVolume);
}

// Get volumes
export function getMusicVolume() {
    return musicVolume;
}

export function getSfxVolume() {
    return sfxVolume;
}

// Load saved volume settings from localStorage
export function loadVolumeSettings() {
    const savedMusic = localStorage.getItem('seti-musicVolume');
    const savedSfx = localStorage.getItem('seti-sfxVolume');
    if (savedMusic !== null) musicVolume = parseFloat(savedMusic);
    if (savedSfx !== null) sfxVolume = parseFloat(savedSfx);
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
            backgroundMusic.volume = musicVolume * 0.3 * (1 - progress);
        }

        // Fade in alien music
        if (alienMusic) {
            alienMusic.volume = musicVolume * 0.3 * progress;
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
            alienMusic.volume = musicVolume * 0.3 * (1 - progress);
        }

        // Fade in background music
        if (backgroundMusic) {
            backgroundMusic.volume = musicVolume * 0.3 * progress;
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

// Switch to Glass Cathedral music for final message (crossfade)
export function switchToGlassCathedral() {
    if (!glassCathedralMusic) {
        glassCathedralMusic = document.getElementById('glass-cathedral-music');
    }
    if (!glassCathedralMusic) return;

    // Remember what was playing so we can restore it later
    musicBeforeFinalMessage = currentMusic;

    glassCathedralMusic.currentTime = 0;
    glassCathedralMusic.volume = 0;
    glassCathedralMusic.play().catch(err => console.log('Glass Cathedral play prevented:', err));

    // Crossfade from current music
    const fadeSteps = 60; // Slower crossfade for dramatic effect
    const fadeInterval = 50;
    let step = 0;

    const fade = setInterval(() => {
        step++;
        const progress = step / fadeSteps;

        // Fade out whatever is currently playing
        if (backgroundMusic && currentMusic === backgroundMusic) {
            backgroundMusic.volume = musicVolume * 0.3 * (1 - progress);
        }
        if (alienMusic && currentMusic === alienMusic) {
            alienMusic.volume = musicVolume * 0.3 * (1 - progress);
        }
        // Also fade out room tone for a cleaner transition
        if (roomTone) {
            roomTone.volume = musicVolume * 0.35 * (1 - progress);
        }

        // Fade in Glass Cathedral
        glassCathedralMusic.volume = musicVolume * 0.4 * progress;

        if (step >= fadeSteps) {
            clearInterval(fade);
            if (backgroundMusic) backgroundMusic.pause();
            if (alienMusic) alienMusic.pause();
            if (roomTone) roomTone.pause();
            currentMusic = glassCathedralMusic;
        }
    }, fadeInterval);
}

// Restore music after final message closes (crossfade back)
export function restoreMusicAfterFinalMessage() {
    if (!glassCathedralMusic) return;

    const restoreTo = musicBeforeFinalMessage || backgroundMusic;

    if (restoreTo) {
        restoreTo.play().catch(() => {});
    }
    if (roomTone) {
        roomTone.play().catch(() => {});
    }

    const fadeSteps = 40;
    const fadeInterval = 50;
    let step = 0;

    const fade = setInterval(() => {
        step++;
        const progress = step / fadeSteps;

        // Fade out Glass Cathedral
        glassCathedralMusic.volume = musicVolume * 0.4 * (1 - progress);

        // Fade in restored music
        if (restoreTo) {
            restoreTo.volume = musicVolume * 0.3 * progress;
        }
        if (roomTone) {
            roomTone.volume = musicVolume * 0.35 * progress;
        }

        if (step >= fadeSteps) {
            clearInterval(fade);
            glassCathedralMusic.pause();
            glassCathedralMusic.currentTime = 0;
            currentMusic = restoreTo;
            musicBeforeFinalMessage = null;
        }
    }, fadeInterval);
}

// Stop all music and ambient audio immediately (for crash/shutdown)
export function stopAllMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.volume = 0;
    }
    if (alienMusic) {
        alienMusic.pause();
        alienMusic.volume = 0;
    }
    if (glassCathedralMusic) {
        glassCathedralMusic.pause();
        glassCathedralMusic.volume = 0;
    }
    if (roomTone) {
        roomTone.pause();
        roomTone.volume = 0;
    }
    currentMusic = null;
}

// Resume all ambient audio after reboot
export function resumeAllMusic() {
    if (backgroundMusic) {
        backgroundMusic.volume = musicVolume * 0.3;
        backgroundMusic.play().catch(() => {});
        currentMusic = backgroundMusic;
    }
    if (roomTone) {
        roomTone.volume = musicVolume * 0.35;
        roomTone.play().catch(() => {});
    }
}

// Echoing ping — sonar-like tone with reverb tail for star reveals
export function playEchoingPing() {
    if (!audioContext || sfxVolume === 0) return;

    // Three pings: initial + two fading echoes
    const baseFreq = 1400;
    const pings = [
        { delay: 0, vol: 0.12, dur: 0.4 },
        { delay: 0.35, vol: 0.06, dur: 0.3 },
        { delay: 0.6, vol: 0.025, dur: 0.25 }
    ];

    pings.forEach(({ delay, vol, dur }) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, audioContext.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, audioContext.currentTime + delay + dur);

        gain.gain.setValueAtTime(vol * sfxVolume, audioContext.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + dur);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(audioContext.currentTime + delay);
        osc.stop(audioContext.currentTime + delay + dur);
    });
}

// UI click sound
export function playClick() {
    // Initialize audio on first user interaction
    if (!audioContext) {
        initAudio();
    }
    if (!audioContext || sfxVolume === 0) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.1 * sfxVolume;

    oscillator.start(audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Zoom in sound — short rising chirp
export function playZoomIn() {
    if (!audioContext || sfxVolume === 0) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.08);
    gain.gain.setValueAtTime(0.06 * sfxVolume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.1);
}

// Zoom out sound — short falling chirp
export function playZoomOut() {
    if (!audioContext || sfxVolume === 0) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.08);
    gain.gain.setValueAtTime(0.06 * sfxVolume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.1);
}

// Scan acknowledge sound (confirmation tone)
export function playScanAcknowledge() {
    if (!audioContext || sfxVolume === 0) return;

    // Two-tone acknowledgement
    [600, 800].forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.18 * sfxVolume; // Increased volume

        const startTime = audioContext.currentTime + (i * 0.08);
        oscillator.start(startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
        oscillator.stop(startTime + 0.1);
    });
}

// Star selection sound (simple beep)
export function playSelectStar() {
    if (!audioContext || sfxVolume === 0) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.12 * sfxVolume;

    oscillator.start(audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
    oscillator.stop(audioContext.currentTime + 0.08);
}

// Static burst sound (short "chht")
export function playStaticBurst() {
    if (!audioContext || sfxVolume === 0) return;

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
    gainNode.gain.linearRampToValueAtTime(0.05 * sfxVolume, now + 0.01); // Fast attack
    gainNode.gain.setValueAtTime(0.05 * sfxVolume, now + 0.48); // Hold at full volume
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
    if (!audioContext || sfxVolume === 0) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1200;
    oscillator.type = 'square';
    gainNode.gain.value = 0.015 * sfxVolume; // Very quiet

    oscillator.start(audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.02);
    oscillator.stop(audioContext.currentTime + 0.02);
}

// Signal lock achievement sound
export function playLockAchieved() {
    if (!audioContext || sfxVolume === 0) return;

    // Multi-tone success sound
    [800, 1000, 1200].forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1 * sfxVolume;

        const startTime = audioContext.currentTime + (i * 0.08);
        oscillator.start(startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        oscillator.stop(startTime + 0.3);
    });
}

// Play machine/alignment sound effect
export function playMachineSound(onEnded) {
    if (!machineSound) {
        machineSound = document.getElementById('machine-sound');
    }

    if (machineSound) {
        // Remove any previous ended listener
        machineSound.onended = null;

        if (sfxVolume === 0) {
            // If muted, still fire callback after the sound's natural duration
            if (onEnded) {
                const dur = (machineSound.duration || 8.76) * 1000;
                setTimeout(onEnded, dur);
            }
            return;
        }

        machineSound.currentTime = 0;
        machineSound.volume = sfxVolume * 0.5;

        // Fire callback when sound naturally finishes
        if (onEnded) {
            machineSound.onended = () => {
                machineSound.onended = null;
                onEnded();
            };
        }

        machineSound.play().catch(err => {
            console.log('Machine sound play prevented:', err);
        });
    } else if (onEnded) {
        // No sound element - fire callback after fallback delay
        setTimeout(onEnded, 8760);
    }
}

// Get the machine sound's actual duration in ms
export function getMachineSoundDuration() {
    if (!machineSound) {
        machineSound = document.getElementById('machine-sound');
    }
    if (machineSound && machineSound.duration && isFinite(machineSound.duration)) {
        return machineSound.duration * 1000;
    }
    return 8760; // fallback
}

// Stop machine sound with fade out
export function stopMachineSound() {
    if (machineSound) machineSound.onended = null; // Clear callback
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
    if (sfxVolume === 0) return;

    if (!doorShutSound) {
        doorShutSound = document.getElementById('door-shut-sound');
    }

    if (doorShutSound) {
        doorShutSound.currentTime = 0;
        doorShutSound.volume = sfxVolume * 0.6;
        doorShutSound.play().catch(err => {
            console.log('Door shut sound play prevented:', err);
        });
    }
}

// Play power down SFX with fade-out at the end. Returns a promise that resolves when done.
let powerDownSound = null;
export function playPowerDownSound() {
    if (sfxVolume === 0) return Promise.resolve();

    if (!powerDownSound) {
        powerDownSound = document.getElementById('power-down-sound');
    }

    if (!powerDownSound) return Promise.resolve();

    powerDownSound.currentTime = 0;
    const peakVolume = sfxVolume * 0.7;
    powerDownSound.volume = peakVolume;
    powerDownSound.play().catch(err => {
        console.log('Power down sound play prevented:', err);
    });

    return new Promise(resolve => {
        const FADE_DURATION = 1.5; // fade out over last 1.5 seconds

        function checkFade() {
            if (!powerDownSound || powerDownSound.paused || powerDownSound.ended) {
                resolve();
                return;
            }

            const remaining = powerDownSound.duration - powerDownSound.currentTime;
            if (remaining <= FADE_DURATION) {
                powerDownSound.volume = Math.max(0, peakVolume * (remaining / FADE_DURATION));
            }

            if (remaining <= 0.05) {
                powerDownSound.pause();
                powerDownSound.volume = peakVolume;
                resolve();
            } else {
                requestAnimationFrame(checkFade);
            }
        }

        // Start checking once we know the duration
        if (powerDownSound.readyState >= 1) {
            checkFade();
        } else {
            powerDownSound.addEventListener('loadedmetadata', checkFade, { once: true });
            // Safety fallback
            setTimeout(resolve, 5000);
        }
    });
}

// Play boot up SFX
let bootUpSound = null;
export function playBootUpSound() {
    if (sfxVolume === 0) return;

    if (!bootUpSound) {
        bootUpSound = document.getElementById('boot-up-sound');
    }

    if (bootUpSound) {
        bootUpSound.currentTime = 0;
        bootUpSound.volume = sfxVolume * 0.6;
        bootUpSound.play().catch(err => {
            console.log('Boot up sound play prevented:', err);
        });
    }
}

// Start continuous tuning tone (changes with signal quality)
export function startTuningTone(quality) {
    // Ensure audio context exists
    if (!audioContext) {
        initAudio();
    }

    if (!audioContext || sfxVolume === 0) {
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
    const volume = (0.015 + (quality * 0.05)) * sfxVolume; // Reduced volume

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

    if (!audioContext || sfxVolume === 0) {
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
        staticGainNode.gain.value = 0.03 * sfxVolume;

        staticNoiseNode.start();
    }
}

// Update static hiss volume (called during tuning)
export function updateStaticHissVolume(volume) {
    if (staticGainNode) {
        staticGainNode.gain.setTargetAtTime(volume * sfxVolume, audioContext.currentTime, 0.1);
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
    if (!audioContext || sfxVolume === 0) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 400;
    oscillator.type = 'square';
    gainNode.gain.value = 0.05 * sfxVolume;

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
    if (!audioContext || sfxVolume === 0) return;

    // Ascending harmonic tones
    [200, 300, 400, 500, 600].forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.08 * sfxVolume;

        const startTime = audioContext.currentTime + (i * 0.12);
        oscillator.start(startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
        oscillator.stop(startTime + 0.5);
    });
}

// Natural phenomena ambient sound (static hiss for pulsars, etc.)
export function startNaturalPhenomenaSound() {
    if (!audioContext || sfxVolume === 0) {
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
        naturalPhenomenaGain.gain.value = 0.03 * sfxVolume; // Subtle

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
    if (!audioContext || sfxVolume === 0) {
        stopAlienSignalSound();
        return;
    }

    if (alienSignalOscillators.length === 0) {
        alienSignalGain = audioContext.createGain();
        alienSignalGain.gain.value = 0.06 * sfxVolume;
        alienSignalGain.connect(audioContext.destination);

        // Use star ID to create unique sound for each alien signal
        const starSeed = star ? (typeof star.id === 'number' ? star.id + 1 : hashStarId(star.id)) : 1;
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

// Fragment signal sound — structural, almost musical resonance unique to each fragment star
let fragmentSignalOscillators = [];
let fragmentSignalGain = null;

export function startFragmentSignalSound(star) {
    if (!audioContext || sfxVolume === 0) {
        stopFragmentSignalSound();
        return;
    }

    if (fragmentSignalOscillators.length > 0) return; // Already playing

    fragmentSignalGain = audioContext.createGain();
    fragmentSignalGain.gain.value = 0;
    fragmentSignalGain.connect(audioContext.destination);

    // Fade in
    fragmentSignalGain.gain.linearRampToValueAtTime(0.08 * sfxVolume, audioContext.currentTime + 1.5);

    const starSeed = star ? (typeof star.id === 'number' ? star.id + 1 : hashStarId(star.id)) : 1;

    // Musical chord structure — each fragment star gets a unique chord
    const chords = [
        [220, 277.18, 329.63, 440],       // A minor: A3, C#4, E4, A4
        [261.63, 329.63, 392, 523.25],     // C major: C4, E4, G4, C5
        [293.66, 369.99, 440, 587.33],     // D major: D4, F#4, A4, D5
        [196, 246.94, 293.66, 392],        // G major: G3, B3, D4, G4
        [174.61, 220, 261.63, 349.23]      // F major: F3, A3, C4, F4
    ];
    const chord = chords[starSeed % chords.length];

    // Main chord tones — sine waves for a clean, crystalline sound
    chord.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const oscGain = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        // Higher notes slightly quieter for balance
        oscGain.gain.value = 0.8 / (i * 0.3 + 1);

        osc.connect(oscGain);
        oscGain.connect(fragmentSignalGain);
        osc.start();
        fragmentSignalOscillators.push({ osc, oscGain });
    });

    // Add a shimmering high harmonic — triangle wave for texture
    const shimmer = audioContext.createOscillator();
    const shimmerGain = audioContext.createGain();
    shimmer.type = 'triangle';
    shimmer.frequency.value = chord[chord.length - 1] * 2; // Octave above top note
    shimmerGain.gain.value = 0.15;
    shimmer.connect(shimmerGain);
    shimmerGain.connect(fragmentSignalGain);
    shimmer.start();
    fragmentSignalOscillators.push({ osc: shimmer, oscGain: shimmerGain });

    // Slow pulsing vibrato on the shimmer for an organic feel
    const vibrato = audioContext.createOscillator();
    const vibratoGain = audioContext.createGain();
    vibrato.frequency.value = 0.3 + (starSeed % 3) * 0.15; // 0.3-0.6 Hz
    vibratoGain.gain.value = 0.08;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(shimmerGain.gain);
    vibrato.start();
    fragmentSignalOscillators.push({ osc: vibrato, oscGain: vibratoGain });

    // Slow chord tone shifting — notes gently drift in pitch
    const drift = audioContext.createOscillator();
    const driftGain = audioContext.createGain();
    drift.frequency.value = 0.05; // Very slow
    driftGain.gain.value = 3; // Subtle pitch bend in Hz
    drift.connect(driftGain);
    chord.forEach((freq, i) => {
        if (fragmentSignalOscillators[i]) {
            driftGain.connect(fragmentSignalOscillators[i].osc.frequency);
        }
    });
    drift.start();
    fragmentSignalOscillators.push({ osc: drift, oscGain: driftGain });
}

export function stopFragmentSignalSound() {
    if (fragmentSignalOscillators.length > 0) {
        if (fragmentSignalGain && audioContext) {
            fragmentSignalGain.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
        }

        setTimeout(() => {
            fragmentSignalOscillators.forEach(({ osc }) => {
                try { osc.stop(); } catch (e) {}
            });
            fragmentSignalOscillators = [];
            fragmentSignalGain = null;
        }, 850);
    }
}

// Dish rotation sound
export function playDishRotationSound() {
    if (!audioContext || sfxVolume === 0) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(150, audioContext.currentTime + 0.9);

    gainNode.gain.setValueAtTime(0.03 * sfxVolume, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.2);
}

// Dish aligned sound
export function playDishAlignedSound() {
    if (!audioContext || sfxVolume === 0) return;

    [400, 600].forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.06 * sfxVolume;

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
        gainNode.gain.setValueAtTime(0.08 * sfxVolume, audioContext.currentTime);
    } else if (type === 'success') {
        oscillator.frequency.value = 1200;
        gainNode.gain.setValueAtTime(0.06 * sfxVolume, audioContext.currentTime);
    } else {
        oscillator.frequency.value = 900;
        gainNode.gain.setValueAtTime(0.05 * sfxVolume, audioContext.currentTime);
    }

    oscillator.type = 'sine';
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
}

// Email notification - short ring/chime
export function playEmailNotification() {
    if (!audioContext || sfxVolume === 0) return;

    const now = audioContext.currentTime;

    // Two-tone ring: high-low-high pattern
    const tones = [
        { freq: 1400, start: 0, dur: 0.08 },
        { freq: 1800, start: 0.1, dur: 0.08 },
        { freq: 1400, start: 0.2, dur: 0.06 },
        { freq: 1800, start: 0.28, dur: 0.12 }
    ];

    tones.forEach(({ freq, start, dur }) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.07 * sfxVolume, now + start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

        osc.start(now + start);
        osc.stop(now + start + dur);
    });
}
