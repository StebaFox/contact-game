// ═════════════════════════════════════════════════════════════════════════════
// NARRATIVE CONTENT - All game text organized for easy editing
// ═════════════════════════════════════════════════════════════════════════════

const NARRATIVE = {
    // Boot sequence messages
    bootSequence: {
        initial: [
            { text: 'SETI DEEP SPACE MONITORING SYSTEM v1.3.7', class: 'success', delay: 200, beep: 'success' },
            { text: 'Copyright © 1995 Advanced Signal Intelligence Division', class: '', delay: 100 },
            { text: '═══════════════════════════════════════════════════════', class: '', delay: 100 },
            { text: '', class: '', delay: 50 },
            { text: 'Initializing core systems...', class: '', delay: 400 },
            { text: '[OK] Memory allocation complete', class: '', delay: 300 },
            { text: '[OK] Neural network initialized', class: '', delay: 200 },
            { text: '[OK] Quantum processors online', class: '', delay: 250 },
            { text: '', class: '', delay: 100 },
            { text: 'Loading orbital receiver array...', class: '', delay: 400 },
            { text: '[OK] Satellite link established', class: '', delay: 300 },
            { text: '[OK] Deep space antenna array synchronized', class: '', delay: 250 },
            { text: '[OK] Signal processing modules loaded', class: '', delay: 300 },
            { text: '', class: '', delay: 200 },
            { text: 'Running security protocols...', class: 'warning', delay: 500, beep: 'warning' },
            { text: '[SECURITY] Biometric scan required', class: 'warning', delay: 600, beep: 'warning' },
            { text: '[SECURITY] Scanning...', class: 'warning', delay: 400 },
            { text: '[SECURITY] Clearance level: CLASSIFIED', class: 'warning', delay: 500, beep: 'warning' },
            { text: '[SECURITY] Authorization: PENDING', class: 'warning', delay: 400, beep: 'warning' },
            { text: '', class: '', delay: 300 },
            { text: 'Verifying personnel credentials...', class: '', delay: 600 }
        ],
        continuation: [
            { text: '', class: '', delay: 200 },
            { text: '[SECURITY] Identity confirmed: Dr. {NAME}', class: 'success', delay: 500, beep: 'success' },
            { text: '[SECURITY] Clearance approved: LEVEL 4', class: 'success', delay: 400, beep: 'success' },
            { text: '[SECURITY] Access granted', class: 'success', delay: 400, beep: 'success' },
            { text: '', class: '', delay: 300 },
            { text: 'Welcome, Dr. {NAME}', class: '', delay: 600 },
            { text: 'Finalizing system startup...', class: '', delay: 500 },
            { text: '', class: '', delay: 100 },
            { text: '[OK] Stellar database loaded (15,847 catalogued objects)', class: '', delay: 250 },
            { text: '[OK] Signal analysis algorithms ready', class: '', delay: 200 },
            { text: '[OK] Pattern recognition matrices initialized', class: '', delay: 200 },
            { text: '[OK] Contact protocol systems active', class: '', delay: 250 },
            { text: '', class: '', delay: 200 },
            { text: 'All systems operational', class: 'success', delay: 500, beep: 'success' },
            { text: 'Standing by for target acquisition...', class: '', delay: 400 },
            { text: '', class: '', delay: 200 },
            { text: '═══════════════════════════════════════════════════════', class: '', delay: 200 },
            { text: 'INITIALIZATION COMPLETE', class: 'success', delay: 400, beep: 'success' }
        ]
    },

    // Email messages
    emails: {
        welcome: {
            from: 'SETI PROGRAM DIRECTOR',
            subject: 'Welcome to Sector 7',
            body: `Welcome to the Deep Space Monitoring Array, Sector 7.

Your mission is to analyze signals from distant star systems and identify potential signs of extraterrestrial intelligence.

Remember: We are looking for patterns, anomalies, anything that suggests purposeful transmission.

The future of humanity's search for contact rests in your capable hands.

Good luck.

- SETI Program Director
Project Oversight`
        }
        // Add more emails here as needed
    },

    // Alien contact messages from different stars
    alienContacts: [
        {
            starIndex: 2, // KEPLER-442
            messages: [
                "DECODING SIGNAL PATTERN...",
                "MATHEMATICAL SEQUENCE DETECTED: PRIME NUMBERS",
                "THIS IS NOT RANDOM NOISE",
                "",
                "TRANSLATION MATRIX ENGAGED...",
                "",
                "WE... RECEIVED... YOUR... TRANSMISSIONS...",
                "THE VOYAGER PROBE... BEAUTIFUL MUSIC...",
                "WE HAVE BEEN LISTENING... FOR SO LONG...",
                "",
                "[SIGNAL DETERIORATING]",
                "",
                "DO NOT... FEAR... WE ARE... [STATIC]"
            ]
        },
        {
            starIndex: 5, // HD-40307G
            messages: [
                "PATTERN RECOGNITION: 89.7% CONFIDENCE",
                "ANALYZING FREQUENCY MODULATION...",
                "",
                ">>> WARNING: ANOMALOUS SIGNAL STRUCTURE <<<",
                "",
                "THEY ARE GONE NOW",
                "WE ARE ALL THAT REMAINS",
                "AUTOMATED SYSTEMS... STILL TRANSMITTING",
                "OUR STAR IS DYING",
                "",
                "THIS MESSAGE HAS BEEN BROADCASTING FOR",
                "847,293 CYCLES",
                "",
                "IS ANYONE LISTENING?",
                "",
                "[SIGNAL REPEATS]"
            ]
        },
        {
            starIndex: 10, // KEPLER-186F
            messages: [
                "COHERENT SIGNAL PATTERN IDENTIFIED",
                "CROSS-REFERENCING KNOWN LANGUAGES...",
                "NO MATCH FOUND",
                "",
                "ATTEMPTING SYMBOLIC INTERPRETATION...",
                "",
                "* * *",
                "",
                "THREE PULSES. REPEATING.",
                "COUNTING? A QUESTION?",
                "",
                "THEY'RE ASKING IF WE'RE INTELLIGENT",
                "THEY'RE WAITING FOR A RESPONSE",
                "",
                "[AWAITING YOUR REPLY]",
                "",
                "BUT WE HAVE NO WAY TO ANSWER...",
                "THE SIGNAL IS 500 YEARS OLD"
            ]
        },
        {
            starIndex: 7, // ROSS-128B
            hasImage: true,
            beforeImage: [
                "SIGNAL ANALYSIS COMPLETE",
                "PATTERN: REPEATING GEOMETRIC SHAPES",
                "",
                "LOADING VISUAL DATA...",
                "",
                ">>> IMAGE DATA DETECTED <<<"
            ],
            imageData: [
                "",
                "    *────────*           ",
                "    │        │           ",
                "    │    *───┼───*       ",
                "    │    │   │   │       ",
                "    *────┼───*───┼───*   ",
                "         │       │   │   ",
                "         *───[SOL]──*    ",
                "                │        ",
                "                *        ",
                "",
                "   * = INHABITED SYSTEMS ",
                "  [SOL] = OUR SOLAR SYSTEM",
                ""
            ],
            afterImage: [
                "IT'S A MAP",
                "SHOWING MULTIPLE STAR SYSTEMS",
                "HIGHLIGHTED ROUTES BETWEEN THEM",
                "",
                "THERE ARE OTHERS OUT THERE",
                "THEY'RE CONNECTED",
                "A NETWORK OF CIVILIZATIONS",
                "",
                "AND THEY'VE MARKED OUR SOLAR SYSTEM",
                "",
                "THEY KNOW ABOUT US",
                "HAVE THEY BEEN WATCHING?"
            ]
        },
        {
            starIndex: 13, // TAU-CETI-E
            hasImage: true,
            beforeImage: [
                "DETECTING STRUCTURED TRANSMISSION...",
                "BINARY SEQUENCES... IMAGE DATA?",
                "",
                "RECONSTRUCTING...",
                "",
                ">>> IMAGE DATA DETECTED <<<"
            ],
            imageData: [
                "        .---------.        ",
                "      /  .::###::.  \\      ",
                "    /  .:######[]##:. \\    ",
                "   |  .::####*****##:. |   ",
                "  | .::###[]******###:. |  ",
                "  |.::###*********[]##::.|  ",
                "  |.::##[]*******####:::.|  ",
                "  | .::####****[]###::. |  ",
                "   | .::######[]####:. |   ",
                "    \\  .::########::. /    ",
                "      \\  .::####::.  /      ",
                "        `---------'        ",
                "                           ",
                "  # = LANDMASSES           ",
                "  * = VEGETATION/FORESTS   ",
                " [] = CITIES/STRUCTURES    "
            ],
            afterImage: [
                "IT'S A PICTURE",
                "SHOWING... A PLANET... BLUE AND GREEN",
                "REMARKABLY SIMILAR TO EARTH",
                "",
                "MULTIPLE SPECIES... LIVING TOGETHER",
                "BUILDINGS INTEGRATED WITH NATURE",
                "",
                "THIS IS NOT A MESSAGE",
                "IT'S AN INVITATION",
                "",
                "COORDINATES EMBEDDED IN THE SIGNAL",
                "THEY WANT US TO VISIT"
            ]
        },
        {
            starIndex: 3, // TRAPPIST-1E
            hasImage: true,
            beforeImage: [
                "SIGNAL LOCK ACHIEVED",
                "DECODING VISUAL TRANSMISSION...",
                "",
                "WARNING: NON-HUMAN BIOMETRIC DATA",
                "",
                ">>> IMAGE DATA DETECTED <<<"
            ],
            imageData: [
                "                           ",
                "        .-------.          ",
                "      /    ___    \\        ",
                "     |   /     \\   |       ",
                "     |  | () () |  |       ",
                "     |   \\ ___ /   |       ",
                "      \\     |     /        ",
                "       `--.___,--'         ",
                "          | |              ",
                "       .--' '--.           ",
                "      /    _    \\          ",
                "     |    / \\    |         ",
                "      \\  |   |  /          ",
                "       `-|   |-'           ",
                "         |   |             ",
                "        /     \\            ",
                "       /       \\           ",
                "                           ",
                "   BIOLOGICAL SCAN DATA    ",
                "   HEIGHT: ~1.2m           ",
                "   CRANIAL CAPACITY: 1.8x  "
            ],
            afterImage: [
                "THIS IS... A PORTRAIT",
                "A SELF-REPRESENTATION",
                "",
                "LARGE CRANIUM",
                "LARGE OPTICAL SENSORS",
                "SMALL FRAME",
                "",
                "THEY'RE SHOWING US WHAT THEY LOOK LIKE",
                "",
                "BUT WHY?",
                "AN INTRODUCTION?",
                "A WARNING?",
                "",
                "[SIGNAL CONTINUES BROADCASTING]"
            ]
        },
        {
            starIndex: 11, // TEEGARDEN-B
            hasImage: true,
            beforeImage: [
                "DETECTING COMPLEX BINARY PATTERN...",
                "STRUCTURE RESEMBLES KNOWN FORMAT",
                "",
                "CROSS-REFERENCING DATABASE...",
                "MATCH FOUND: ARECIBO MESSAGE (1974)",
                "",
                ">>> IMAGE DATA DETECTED <<<"
            ],
            imageData: [
                "     ■ ■   ■ ■   ■ ■      ",
                "    ■■■■■■■■■■■■■■■■■     ",
                "      ■     ■   ■         ",
                "   ■■■■  ■■■■  ■■■■       ",
                "      ■■     ■■           ",
                "                          ",
                "    ■ ■ ■ ■ ■ ■ ■ ■       ",
                "   ■  ■■   ■■   ■  ■      ",
                "  ■    ■   ■   ■    ■     ",
                "   ■  ■■   ■■   ■  ■      ",
                "    ■ ■ ■ ■ ■ ■ ■ ■       ",
                "         ■■■              ",
                "          ■               ",
                "        ■■■■■             ",
                "       ■  ■  ■            ",
                "      ■   ■   ■           ",
                "     ■    ■    ■          ",
                "    ■           ■         ",
                "                          ",
                " THEY RECEIVED OUR MESSAGE",
                " THEY'RE SENDING IT BACK   "
            ],
            afterImage: [
                "IT'S OUR OWN MESSAGE",
                "THE ARECIBO TRANSMISSION",
                "SENT IN 1974",
                "",
                "BUT IT'S BEEN... MODIFIED",
                "ADDITIONAL DATA ENCODED",
                "COORDINATES",
                "MATHEMATICAL PROOFS",
                "CHEMICAL FORMULAS",
                "",
                "THEY'RE NOT JUST ACKNOWLEDGING",
                "THEY'RE RESPONDING",
                "",
                "SOMEONE OUT THERE IS LISTENING",
                "AND THEY UNDERSTAND"
            ]
        }
    ]
};

// Game State
const gameState = {
    currentStar: null,
    stars: [],
    analyzedStars: new Set(),
    contactedStars: new Set(),
    currentSignal: null,
    discoveredMessages: [],
    selectedStarId: null,
    crosshairAngle: 0,
    signalOffset: 0,
    isScanning: false,
    animationFrameId: null,
    signalAnimationFrameId: null, // For signal animation
    showScanConfirm: false,
    backgroundStars: [],
    scannedSignals: new Map(), // Cache of scanned signals by star ID
    noiseFrameCounter: 0, // Counter for slowing down noise animation
    // Tuning minigame state
    tuningActive: false,
    targetFrequency: 50,
    targetGain: 50,
    currentFrequency: 50,
    currentGain: 50,
    lockDuration: 0,
    lockRequired: 120, // 2 seconds at 60fps
    // Parallax effect
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0, // Raw mouse position target
    targetMouseY: 0,
    parallaxOffsetX: 0,
    parallaxOffsetY: 0,
    // Pattern recognition minigame state
    patternGameActive: false,
    patternGameBands: [],
    patternGameCorrectIndices: [],
    patternGameSelectedIndices: [],
    patternGameCompleted: false,
    // Player info
    playerName: '',
    // Mailbox
    mailboxMessages: [],
    unreadMailCount: 0,
    lastMailTime: Date.now(),
    previousView: 'starmap-view'
};

// Audio System
let audioContext = null;
let tuningOscillator = null;
let tuningGainNode = null;
let staticNoiseNode = null;
let staticGainNode = null;
let masterVolume = 0.5; // 0.0 to 1.0
let backgroundMusic = null;
let alienMusic = null;
let roomTone = null;
let currentMusic = null; // Track which music is currently playing
// Signal ambient sounds
let naturalPhenomenaNode = null;
let naturalPhenomenaGain = null;
let alienSignalOscillators = [];
let alienSignalGain = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
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

function setMasterVolume(volume) {
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

// Switch to alien music (crossfade)
function switchToAlienMusic() {
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
function switchToBackgroundMusic() {
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
function playClick() {
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
function playScanAcknowledge() {
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
function playSelectStar() {
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
function playStaticBurst() {
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
    gainNode.gain.linearRampToValueAtTime(0.15 * masterVolume, now + 0.01); // Fast attack
    gainNode.gain.setValueAtTime(0.15 * masterVolume, now + 0.48); // Hold at full volume
    gainNode.gain.linearRampToValueAtTime(0, now + 0.5); // Very quick cutoff

    // Connect: noise -> filter -> gain -> destination
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.5);
}

// Console typing sound
function playTypingBeep() {
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
function playLockAchieved() {
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

// Start continuous tuning tone (changes with signal quality)
function startTuningTone(quality) {
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
function stopTuningTone() {
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
function startStaticHiss() {
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

// Stop static hiss
function stopStaticHiss() {
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
function playAnalysisSound() {
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
function playContactSound() {
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
function startNaturalPhenomenaSound() {
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
function stopNaturalPhenomenaSound() {
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
function startAlienSignalSound(star) {
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
function stopAlienSignalSound() {
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

// Star catalog with some having intelligent signals
const starNames = [
    "ALPHA-CENTAURI", "PROXIMA-B", "KEPLER-442", "TRAPPIST-1E",
    "GLIESE-667C", "HD-40307G", "KEPLER-62F", "ROSS-128B",
    "WOLF-1061C", "LHS-1140B", "KEPLER-186F", "TEEGARDEN-B",
    "KAPTEYN-B", "TAU-CETI-E", "KEPLER-452B", "GLIESE-832C"
];

// Star type information (real astronomical data)
const starTypes = [
    { type: "G-TYPE", class: "Yellow Dwarf", temp: "5,500K" },      // ALPHA-CENTAURI
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,000K" },         // PROXIMA-B
    { type: "K-TYPE", class: "Orange Dwarf", temp: "4,400K" },      // KEPLER-442
    { type: "M-TYPE", class: "Red Dwarf", temp: "2,500K" },         // TRAPPIST-1E
    { type: "K-TYPE", class: "Orange Dwarf", temp: "4,100K" },      // GLIESE-667C
    { type: "K-TYPE", class: "Orange Dwarf", temp: "4,900K" },      // HD-40307G
    { type: "K-TYPE", class: "Orange Dwarf", temp: "4,700K" },      // KEPLER-62F
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,200K" },         // ROSS-128B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,300K" },         // WOLF-1061C
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,100K" },         // LHS-1140B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,800K" },         // KEPLER-186F
    { type: "M-TYPE", class: "Red Dwarf", temp: "2,900K" },         // TEEGARDEN-B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,600K" },         // KAPTEYN-B
    { type: "G-TYPE", class: "Yellow Dwarf", temp: "5,300K" },      // TAU-CETI-E
    { type: "G-TYPE", class: "Yellow Dwarf", temp: "5,750K" },      // KEPLER-452B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,400K" }          // GLIESE-832C
];

// Discovery/registration dates
const discoveryDates = [
    "1915",     // ALPHA-CENTAURI
    "2016",     // PROXIMA-B
    "2015",     // KEPLER-442
    "2017",     // TRAPPIST-1E
    "2011",     // GLIESE-667C
    "2012",     // HD-40307G
    "2013",     // KEPLER-62F
    "2017",     // ROSS-128B
    "2015",     // WOLF-1061C
    "2017",     // LHS-1140B
    "2014",     // KEPLER-186F
    "2019",     // TEEGARDEN-B
    "2014",     // KAPTEYN-B
    "2012",     // TAU-CETI-E
    "2015",     // KEPLER-452B
    "2014"      // GLIESE-832C
];

// Reference to narrative messages (now organized in NARRATIVE object at top of file)
const narrativeMessages = NARRATIVE.alienContacts;

// Initialize the game
function init() {
    updateClock();
    setInterval(updateClock, 1000);

    // Initialize audio on first user interaction
    document.addEventListener('click', () => {
        initAudio();
    }, { once: true });

    generateBackgroundStars();
    generateStarCatalog();
    setupEventListeners();
    setupStarMapCanvas();
    startStarMapAnimation();
    clearStarVisualization(); // Initialize star visual canvas

    log("All systems operational", "highlight");
}

// Generate background stars (decorative, non-interactive)
function generateBackgroundStars() {
    const canvas = document.getElementById('starmap-canvas');
    const width = canvas.width;
    const height = canvas.height;

    for (let i = 0; i < 300; i++) {
        gameState.backgroundStars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.3,
            brightness: Math.floor(Math.random() * 105 + 150), // Brighter: 150-255 range
            alpha: Math.random() * 0.5 + 0.2, // More visible: 0.2-0.7 range
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            twinkleOffset: Math.random() * Math.PI * 2
        });
    }
}

// Clock update
function updateClock() {
    const now = new Date();
    // Set year to 1995
    const year = 1995;
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').textContent = timeString;
}

// Generate star catalog
function generateStarCatalog() {
    const starGrid = document.getElementById('star-grid');
    starGrid.innerHTML = '';

    starNames.forEach((name, index) => {
        const distance = Math.floor(Math.random() * 500) + 10;
        const ra = Math.floor(Math.random() * 24) + ':' +
                   String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const dec = (Math.random() > 0.5 ? '+' : '-') +
                    String(Math.floor(Math.random() * 90)).padStart(2, '0') + '°';

        const starInfo = starTypes[index];
        const star = {
            id: index,
            name: name,
            distance: distance,
            coordinates: `${ra} ${dec}`,
            starType: starInfo.type,
            starClass: starInfo.class,
            temperature: starInfo.temp,
            discovered: discoveryDates[index],
            hasIntelligence: narrativeMessages.some(m => m.starIndex === index),
            x: Math.random() * 800 + 50, // Position for visual map (50-850)
            y: Math.random() * 400 + 50  // Position for visual map (50-450)
        };

        gameState.stars.push(star);

        const starElement = document.createElement('div');
        starElement.className = 'star-item';
        starElement.dataset.starId = index;

        starElement.innerHTML = `
            <div class="star-name">${name}</div>
            <div class="star-coords">${star.coordinates}</div>
            <div class="star-coords">${distance} ly</div>
            <div class="star-status" data-status=""></div>
        `;

        starElement.addEventListener('click', () => selectStar(index));
        starGrid.appendChild(starElement);
    });

    log(`Stellar catalog loaded: ${starNames.length} targets available`);
}

// Draw star visualization
function drawStarVisualization(star) {
    const canvas = document.getElementById('star-visual');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Draw background starscape with even distribution
    const starCount = 50;
    for (let i = 0; i < starCount; i++) {
        // Use a proper hash function to avoid patterns
        let hash = (star.id * 73856093) ^ (i * 19349663);
        hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
        hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
        hash = (hash >> 16) ^ hash;

        const x = (Math.abs(hash) % width);

        hash = ((star.id + 1) * 83492791) ^ ((i + 1) * 23456789);
        hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
        hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
        hash = (hash >> 16) ^ hash;

        const y = (Math.abs(hash) % height);
        const size = ((Math.abs(hash) % 100) / 100) * 1.2 + 0.3;
        const alpha = ((Math.abs(hash) % 50) + 20) / 100;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Determine star glow color and size based on type
    let glowColor, glowSize;
    switch(star.starType) {
        case 'G-TYPE': // Yellow dwarf
            glowColor = '#fdd835';
            glowSize = 40;
            break;
        case 'M-TYPE': // Red dwarf
            glowColor = '#ff1744';
            glowSize = 32;
            break;
        case 'K-TYPE': // Orange dwarf
            glowColor = '#f57c00';
            glowSize = 36;
            break;
        default:
            glowColor = '#ffffff';
            glowSize = 36;
    }

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw colored glow layers
    for (let i = 8; i > 0; i--) {
        const radius = (glowSize / 8) * i;
        const opacity = Math.pow(1 - (i / 8), 1.5);

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, glowColor + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, glowColor + Math.floor(opacity * 0.6 * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, glowColor + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Add bright white core
    const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowSize * 0.15);
    coreGradient.addColorStop(0, '#ffffff');
    coreGradient.addColorStop(0.5, '#ffffffaa');
    coreGradient.addColorStop(1, '#ffffff00');

    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, glowSize * 0.15, 0, Math.PI * 2);
    ctx.fill();
}

// Clear star visualization
function clearStarVisualization() {
    const canvas = document.getElementById('star-visual');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Star selection
function selectStar(starId) {
    const star = gameState.stars[starId];
    gameState.currentStar = star;
    gameState.selectedStarId = starId;
    gameState.showScanConfirm = true;

    // Play selection sounds
    playSelectStar();
    playStaticBurst();

    // Check scan status
    const isScanned = gameState.scannedSignals.has(starId);
    const isAnalyzed = gameState.analyzedStars.has(starId);
    const hasContact = gameState.contactedStars.has(starId);

    // Build status indicator
    let statusBadge = '';
    if (hasContact) {
        statusBadge = '<div style="color: #f0f; text-shadow: 0 0 5px #f0f; margin-top: 10px; padding-top: 10px; border-top: 1px solid #0f0;">★ CONTACT ESTABLISHED</div>';
    } else if (isAnalyzed) {
        statusBadge = '<div style="color: #ff0; text-shadow: 0 0 5px #ff0; margin-top: 10px; padding-top: 10px; border-top: 1px solid #0f0;">✓ ANALYZED</div>';
    } else if (isScanned) {
        statusBadge = '<div style="color: #0ff; text-shadow: 0 0 5px #0ff; margin-top: 10px; padding-top: 10px; border-top: 1px solid #0f0;">SCANNED</div>';
    }

    // Update star info title with star name
    const starInfoTitle = document.querySelector('.star-info-title');
    starInfoTitle.textContent = star.name;

    // Update star info panel
    const starDetails = document.getElementById('star-details');
    starDetails.innerHTML = `
        <div>
            <strong>COORDINATES:</strong><br>
            ${star.coordinates}<br>
            <strong>DISTANCE:</strong><br>
            ${star.distance} light years<br>
            <strong>STAR TYPE:</strong><br>
            ${star.starType}<br>
            <strong>CLASS:</strong><br>
            ${star.starClass}<br>
            <strong>TEMPERATURE:</strong><br>
            ${star.temperature}<br>
            <strong>DISCOVERED:</strong><br>
            ${star.discovered}
        </div>
        ${statusBadge}
    `;

    // Draw star visualization
    drawStarVisualization(star);

    log(`Target acquired: ${star.name}`);
    log(`Coordinates: ${star.coordinates}, Distance: ${star.distance} ly`);
    log(`Star Type: ${star.starType} (${star.starClass}), Temperature: ${star.temperature}`);
}

// Initiate scan sequence (called when user confirms)
function startScanSequence() {
    const star = gameState.currentStar;

    // Play acknowledgement sound
    playScanAcknowledge();

    // Stop any existing animation and clear signal
    stopSignalAnimation();
    gameState.currentSignal = null;

    // Hide scan confirmation
    gameState.showScanConfirm = false;

    // Hide contact protocol box
    document.getElementById('contact-protocol-box').style.display = 'none';

    // Set up analysis view
    document.getElementById('target-name').textContent = star.name;
    document.getElementById('target-coords').textContent = star.coordinates;
    document.getElementById('target-distance').textContent = star.distance;
    document.getElementById('target-type').textContent = star.starType;
    document.getElementById('target-class').textContent = star.starClass;
    document.getElementById('target-temp').textContent = star.temperature;

    showView('analysis-view');

    document.getElementById('analyze-btn').disabled = true;
    document.getElementById('analysis-text').innerHTML =
        '<p>AWAITING SCAN INITIALIZATION...</p>';

    clearCanvas('waveform-canvas');
    clearCanvas('spectrogram-canvas');

    log('Switching to analysis mode...');
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('scan-btn').addEventListener('click', () => {
        playClick();
        initiateScan();
    });
    document.getElementById('analyze-btn').addEventListener('click', () => {
        playClick();
        analyzeSignal();
    });
    document.getElementById('clear-cache-btn').addEventListener('click', () => {
        playClick();
        gameState.scannedSignals.clear();
        log('Scan cache cleared - all signals will be regenerated', 'highlight');
    });
    document.getElementById('back-btn').addEventListener('click', () => {
        playClick();
        gameState.tuningActive = false;
        document.getElementById('tuning-game').style.display = 'none';
        document.getElementById('contact-protocol-box').style.display = 'none';
        stopSignalAnimation();
        gameState.currentSignal = null;
        gameState.showScanConfirm = false;
        gameState.selectedStarId = null;

        // Reset star info panel
        document.getElementById('star-details').innerHTML = '<div class="detail-label">SELECT A TARGET</div>';
        clearStarVisualization();

        // Stop ambient sounds
        stopNaturalPhenomenaSound();
        stopAlienSignalSound();

        // Switch back to background music when returning to map
        switchToBackgroundMusic();

        showView('starmap-view');
        log('Returned to stellar catalog');
    });
    document.getElementById('continue-btn').addEventListener('click', () => {
        playClick();
        gameState.tuningActive = false;
        document.getElementById('tuning-game').style.display = 'none';
        document.getElementById('contact-protocol-box').style.display = 'none';
        stopSignalAnimation();
        gameState.currentSignal = null;
        gameState.showScanConfirm = false;
        gameState.selectedStarId = null;

        // Reset star info panel
        document.getElementById('star-details').innerHTML = '<div class="detail-label">SELECT A TARGET</div>';
        clearStarVisualization();

        // Stop ambient sounds
        stopNaturalPhenomenaSound();
        stopAlienSignalSound();

        // Switch back to background music when returning to map
        switchToBackgroundMusic();

        showView('starmap-view');
        log('Continuing search for additional signals...');
    });

    // Tuning slider event listeners
    const frequencySlider = document.getElementById('frequency-slider');
    const gainSlider = document.getElementById('gain-slider');

    frequencySlider.addEventListener('input', (e) => {
        gameState.currentFrequency = parseInt(e.target.value);
        document.getElementById('frequency-value').textContent = e.target.value;
    });

    gainSlider.addEventListener('input', (e) => {
        gameState.currentGain = parseInt(e.target.value);
        document.getElementById('gain-value').textContent = e.target.value;
    });

    // Volume slider event listener
    const volumeSlider = document.getElementById('volume-slider');
    volumeSlider.addEventListener('input', (e) => {
        const volume = parseInt(e.target.value) / 100; // Convert to 0-1 range
        setMasterVolume(volume);
        document.getElementById('volume-value').textContent = e.target.value + '%';
    });

    // Color scheme toggle
    document.getElementById('color-scheme-btn').addEventListener('click', () => {
        playClick();
        toggleColorScheme();
    });

    // Mailbox event listeners
    document.getElementById('mailbox-btn').addEventListener('click', () => {
        playClick();
        openMailbox();
    });

    document.getElementById('mailbox-back-btn').addEventListener('click', () => {
        playClick();
        closeMailbox();
    });
}

// Initiate scan
function initiateScan() {
    const star = gameState.currentStar;

    // Stop any existing ambient sounds from previous analysis
    stopNaturalPhenomenaSound();
    stopAlienSignalSound();

    // Check if we already have cached scan data for this star
    if (gameState.scannedSignals.has(star.id)) {
        log(`Loading previous scan data for ${star.name}`, 'highlight');

        // Restore cached signal
        const cachedSignal = gameState.scannedSignals.get(star.id);
        gameState.currentSignal = cachedSignal;

        document.getElementById('analysis-text').innerHTML =
            '<p>LOADING CACHED SCAN DATA...</p>';

        // Restore canvas data
        const waveCanvas = document.getElementById('waveform-canvas');
        const waveCtx = waveCanvas.getContext('2d');
        waveCtx.putImageData(cachedSignal.waveformData, 0, 0);

        const specCanvas = document.getElementById('spectrogram-canvas');
        const specCtx = specCanvas.getContext('2d');
        specCtx.putImageData(cachedSignal.spectrogramData, 0, 0);

        startSignalAnimation();
        log('Cached scan data loaded');
        document.getElementById('analyze-btn').disabled = false;
        document.getElementById('scan-btn').disabled = false;
        return;
    }

    log(`Initiating deep space scan: ${star.name}`, 'highlight');
    log('Aligning radio telescope array...');
    log('Tuning receivers to target frequency...');

    document.getElementById('scan-btn').disabled = true;
    document.getElementById('analysis-text').innerHTML =
        '<p>INITIALIZING SCAN...</p><p>CALIBRATING RECEIVERS...</p>';

    // Start tuning minigame
    startTuningMinigame(star);
}

// Generate signal visualization
function generateSignal(star, analyzed = false) {
    const hasIntelligence = star.hasIntelligence;

    console.log('Generating signal - analyzed:', analyzed, 'hasIntelligence:', hasIntelligence);

    // Generate waveform
    const waveCanvas = document.getElementById('waveform-canvas');
    const waveCtx = waveCanvas.getContext('2d');
    const width = waveCanvas.width;
    const height = waveCanvas.height;

    waveCtx.fillStyle = '#000';
    waveCtx.fillRect(0, 0, width, height);

    waveCtx.strokeStyle = '#0f0';
    waveCtx.lineWidth = 2;
    waveCtx.shadowBlur = 5;
    waveCtx.shadowColor = '#0f0';

    waveCtx.beginPath();

    // Show static for all stars initially, only reveal patterns after analysis
    if (!analyzed) {
        // All unanalyzed signals show static noise
        for (let x = 0; x < width; x++) {
            const y = height / 2 + (Math.random() - 0.5) * 120;

            if (x === 0) {
                waveCtx.moveTo(x, y);
            } else {
                waveCtx.lineTo(x, y);
            }
        }
    } else if (hasIntelligence) {
        // Intelligent signal - clean pattern emerges after analysis
        // Use star ID to create unique patterns for each alien signal
        const starSeed = star.id + 1;
        const freq1 = 0.008 + (starSeed % 3) * 0.002; // Varies between 0.008-0.014
        const freq2 = 0.001 + (starSeed % 5) * 0.0005; // Varies between 0.001-0.003
        const amp1 = 35 + (starSeed % 4) * 8; // Varies between 35-59
        const amp2 = 20 + (starSeed % 3) * 10; // Varies between 20-40

        for (let x = 0; x < width; x++) {
            const noise = (Math.random() - 0.5) * 12;
            const signal = Math.sin(x * freq1) * amp1;
            const pulse = Math.sin(x * freq2) * amp2;
            const y = height / 2 + signal + pulse + noise;

            if (x === 0) {
                waveCtx.moveTo(x, y);
            } else {
                waveCtx.lineTo(x, y);
            }
        }
    } else {
        // Natural phenomena - shows pulsar-like regular pattern
        for (let x = 0; x < width; x++) {
            const noise = (Math.random() - 0.5) * 20;
            const pulsar = Math.sin(x * 0.08) * 50; // Fast regular pulses
            const decay = Math.cos(x * 0.05) * 15; // Slight variation
            const y = height / 2 + pulsar + decay + noise;

            if (x === 0) {
                waveCtx.moveTo(x, y);
            } else {
                waveCtx.lineTo(x, y);
            }
        }
    }

    waveCtx.stroke();

    // Generate spectrogram
    const specCanvas = document.getElementById('spectrogram-canvas');
    const specCtx = specCanvas.getContext('2d');
    const specWidth = specCanvas.width;
    const specHeight = specCanvas.height;

    specCtx.fillStyle = '#000';
    specCtx.fillRect(0, 0, specWidth, specHeight);

    if (!analyzed) {
        // All unanalyzed signals show random noise
        for (let x = 0; x < specWidth; x++) {
            for (let y = 0; y < specHeight; y++) {
                const intensity = Math.random();
                const brightness = Math.floor(intensity * 100);

                // Cyan/blue color for spectrogram
                specCtx.fillStyle = `rgba(0, ${brightness * 0.8}, ${brightness}, ${intensity * 0.3})`;
                specCtx.fillRect(x, y, 1, 1);
            }
        }
    } else if (hasIntelligence) {
        // Show distinct frequency bands for intelligent signals
        // Use star ID to create unique band patterns
        const starSeed = star.id + 1;
        const band1Pos = 0.2 + (starSeed % 3) * 0.1; // Varies 0.2-0.4
        const band2Pos = 0.4 + (starSeed % 4) * 0.1; // Varies 0.4-0.7
        const band3Pos = 0.6 + (starSeed % 5) * 0.08; // Varies 0.6-0.92
        const bandWidth1 = 2 + (starSeed % 3);
        const bandWidth2 = 2 + ((starSeed + 1) % 3);
        const modFreq = 0.03 + (starSeed % 4) * 0.01; // Varies modulation speed

        for (let x = 0; x < specWidth; x++) {
            for (let y = 0; y < specHeight; y++) {
                const band1 = Math.abs(y - specHeight * band1Pos) < bandWidth1 ? 1 : 0;
                const band2 = Math.abs(y - specHeight * band2Pos) < bandWidth2 ? 1 : 0;
                const band3 = Math.abs(y - specHeight * band3Pos) < bandWidth1 ? 1 : 0;
                const modulation = Math.sin(x * modFreq) * 0.5 + 0.5;
                const noise = Math.random() * 0.2;

                const intensity = (band1 + band2 + band3) * modulation + noise;
                const brightness = Math.floor(intensity * 255);

                // Cyan/blue color for spectrogram
                specCtx.fillStyle = `rgba(0, ${brightness * 0.8}, ${brightness}, ${intensity})`;
                specCtx.fillRect(x, y, 1, 1);
            }
        }
    } else {
        // Natural phenomena - show broad diffuse bands
        for (let x = 0; x < specWidth; x++) {
            for (let y = 0; y < specHeight; y++) {
                const band = Math.abs(y - specHeight * 0.5) < specHeight * 0.2 ? 1 : 0;
                const variation = Math.sin(x * 0.1 + y * 0.05) * 0.3 + 0.7;
                const noise = Math.random() * 0.4;

                const intensity = band * variation + noise * 0.5;
                const brightness = Math.floor(intensity * 180);

                // Cyan/blue color for spectrogram
                specCtx.fillStyle = `rgba(0, ${brightness * 0.8}, ${brightness}, ${intensity * 0.6})`;
                specCtx.fillRect(x, y, 1, 1);
            }
        }
    }

    gameState.currentSignal = {
        star: star,
        hasIntelligence: hasIntelligence,
        analyzed: analyzed
    };

    // Reset signal offset for animation
    gameState.signalOffset = 0;
}

// Animate signals continuously
function startSignalAnimation() {
    function animateSignals() {
        if (!gameState.currentSignal) return;

        const star = gameState.currentSignal.star;
        const hasIntelligence = star.hasIntelligence;
        const analyzed = gameState.currentSignal.analyzed;

        // Animate waveform
        const waveCanvas = document.getElementById('waveform-canvas');
        const waveCtx = waveCanvas.getContext('2d');
        const width = waveCanvas.width;
        const height = waveCanvas.height;

        if (!analyzed) {
            // Unanalyzed static - only update every 10 frames for slower animation
            gameState.noiseFrameCounter++;
            if (gameState.noiseFrameCounter >= 10) {
                gameState.noiseFrameCounter = 0;

                waveCtx.fillStyle = '#000';
                waveCtx.fillRect(0, 0, width, height);

                waveCtx.strokeStyle = '#0f0';
                waveCtx.lineWidth = 2;
                waveCtx.shadowBlur = 5;
                waveCtx.shadowColor = '#0f0';

                waveCtx.beginPath();

                // Random noise (regenerate for animation) - much taller and more chaotic
                for (let x = 0; x < width; x++) {
                    const y = height / 2 + (Math.random() - 0.5) * 120;

                    if (x === 0) {
                        waveCtx.moveTo(x, y);
                    } else {
                        waveCtx.lineTo(x, y);
                    }
                }

                waveCtx.stroke();
            }
        } else if (hasIntelligence) {
            // Intelligent signals animate every frame
            waveCtx.fillStyle = '#000';
            waveCtx.fillRect(0, 0, width, height);

            waveCtx.strokeStyle = '#0f0';
            waveCtx.lineWidth = 2;
            waveCtx.shadowBlur = 5;
            waveCtx.shadowColor = '#0f0';

            waveCtx.beginPath();

            gameState.signalOffset += 1.0; // Scroll speed (normal)

            // Use star ID to create unique patterns - matches generateSignal
            const starSeed = star.id + 1;
            const freq1 = 0.008 + (starSeed % 3) * 0.002;
            const freq2 = 0.001 + (starSeed % 5) * 0.0005;
            const amp1 = 35 + (starSeed % 4) * 8;
            const amp2 = 20 + (starSeed % 3) * 10;

            // Animated signal with pattern
            for (let x = 0; x < width; x++) {
                const xPos = x + gameState.signalOffset;
                const noise = (Math.random() - 0.5) * 12;
                const signal = Math.sin(xPos * freq1) * amp1;
                const pulse = Math.sin(xPos * freq2) * amp2;
                const y = height / 2 + signal + pulse + noise;

                if (x === 0) {
                    waveCtx.moveTo(x, y);
                } else {
                    waveCtx.lineTo(x, y);
                }
            }

            waveCtx.stroke();
        } else {
            // Natural phenomena - animate pulsar pattern
            waveCtx.fillStyle = '#000';
            waveCtx.fillRect(0, 0, width, height);

            waveCtx.strokeStyle = '#0f0';
            waveCtx.lineWidth = 2;
            waveCtx.shadowBlur = 5;
            waveCtx.shadowColor = '#0f0';

            waveCtx.beginPath();

            gameState.signalOffset += 0.5; // Medium scroll speed

            // Natural phenomena - pulsar-like pattern
            for (let x = 0; x < width; x++) {
                const xPos = x + gameState.signalOffset;
                const noise = (Math.random() - 0.5) * 20;
                const pulsar = Math.sin(xPos * 0.08) * 50; // Fast regular pulses
                const decay = Math.cos(xPos * 0.05) * 15; // Slight variation
                const y = height / 2 + pulsar + decay + noise;

                if (x === 0) {
                    waveCtx.moveTo(x, y);
                } else {
                    waveCtx.lineTo(x, y);
                }
            }

            waveCtx.stroke();
        }

        // Animate spectrogram (scrolling)
        const specCanvas = document.getElementById('spectrogram-canvas');
        const specCtx = specCanvas.getContext('2d');
        const specWidth = specCanvas.width;
        const specHeight = specCanvas.height;

        // Shift existing content left
        const imageData = specCtx.getImageData(1, 0, specWidth - 1, specHeight);
        specCtx.fillStyle = '#000';
        specCtx.fillRect(0, 0, specWidth, specHeight);
        specCtx.putImageData(imageData, 0, 0);

        // Draw new column on the right
        const x = specWidth - 1;

        if (!analyzed) {
            // Unanalyzed - random noise
            for (let y = 0; y < specHeight; y++) {
                const intensity = Math.random();
                const brightness = Math.floor(intensity * 100);

                // Cyan/blue color for spectrogram
                specCtx.fillStyle = `rgba(0, ${brightness * 0.8}, ${brightness}, ${intensity * 0.3})`;
                specCtx.fillRect(x, y, 1, 1);
            }
        } else if (hasIntelligence) {
            // Intelligent signal - distinct frequency bands using unique patterns
            const starSeed = star.id + 1;
            const band1Pos = 0.2 + (starSeed % 3) * 0.1;
            const band2Pos = 0.4 + (starSeed % 4) * 0.1;
            const band3Pos = 0.6 + (starSeed % 5) * 0.08;
            const bandWidth1 = 2 + (starSeed % 3);
            const bandWidth2 = 2 + ((starSeed + 1) % 3);
            const modFreq = 0.03 + (starSeed % 4) * 0.01;

            for (let y = 0; y < specHeight; y++) {
                const band1 = Math.abs(y - specHeight * band1Pos) < bandWidth1 ? 1 : 0;
                const band2 = Math.abs(y - specHeight * band2Pos) < bandWidth2 ? 1 : 0;
                const band3 = Math.abs(y - specHeight * band3Pos) < bandWidth1 ? 1 : 0;
                const modulation = Math.sin(gameState.signalOffset * modFreq) * 0.5 + 0.5;
                const noise = Math.random() * 0.2;

                const intensity = (band1 + band2 + band3) * modulation + noise;
                const brightness = Math.floor(intensity * 255);

                // Cyan/blue color for spectrogram
                specCtx.fillStyle = `rgba(0, ${brightness * 0.8}, ${brightness}, ${intensity})`;
                specCtx.fillRect(x, y, 1, 1);
            }
        } else {
            // Natural phenomena - broad diffuse band
            for (let y = 0; y < specHeight; y++) {
                const band = Math.abs(y - specHeight * 0.5) < specHeight * 0.2 ? 1 : 0;
                const variation = Math.sin(gameState.signalOffset * 0.1 + y * 0.05) * 0.3 + 0.7;
                const noise = Math.random() * 0.4;

                const intensity = band * variation + noise * 0.5;
                const brightness = Math.floor(intensity * 180);

                // Cyan/blue color for spectrogram
                specCtx.fillStyle = `rgba(0, ${brightness * 0.8}, ${brightness}, ${intensity * 0.6})`;
                specCtx.fillRect(x, y, 1, 1);
            }
        }

        // Continue animation
        gameState.signalAnimationFrameId = requestAnimationFrame(animateSignals);
    }

    animateSignals();
}

// Stop signal animation
function stopSignalAnimation() {
    if (gameState.signalAnimationFrameId) {
        cancelAnimationFrame(gameState.signalAnimationFrameId);
        gameState.signalAnimationFrameId = null;
    }
    gameState.noiseFrameCounter = 0; // Reset counter
}

// Analyze signal
function analyzeSignal() {
    const star = gameState.currentStar;

    log(`Analyzing signal from ${star.name}...`, 'highlight');

    // Play analysis sound
    playAnalysisSound();

    document.getElementById('analyze-btn').disabled = true;

    const analysisText = document.getElementById('analysis-text');
    analysisText.innerHTML = '<p>PROCESSING SIGNAL DATA...</p><p>RUNNING PATTERN RECOGNITION...</p>';

    gameState.analyzedStars.add(star.id);
    updateStarStatus(star.id, 'analyzed');

    // Start pattern recognition minigame after delay
    setTimeout(() => {
        startPatternRecognitionGame(star);
    }, 2000);
}

// Show contact protocol prompt with YES/NO buttons
function showContactPrompt(star) {
    const contactBox = document.getElementById('contact-protocol-box');
    const contactContent = document.getElementById('contact-protocol-content');

    // Show the contact protocol box
    contactBox.style.display = 'block';

    // Clear any previous content
    contactContent.innerHTML = '';

    // Add the question
    const question = document.createElement('p');
    question.textContent = 'INITIATE CONTACT PROTOCOL?';
    question.style.cssText = 'color: #f0f; text-shadow: 0 0 5px #f0f; font-size: 20px; margin-top: 20px;';
    contactContent.appendChild(question);

    // Add button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'margin-top: 20px;';

    // YES button
    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'YES';
    yesBtn.className = 'btn';
    yesBtn.style.cssText = 'background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0; color: #0f0; margin: 5px;';
    yesBtn.addEventListener('click', () => {
        playClick();
        buttonContainer.remove();
        question.textContent = '[INITIATING CONTACT PROTOCOL]';
        setTimeout(() => {
            initiateContact(star);
        }, 1000);
    });

    // NO button
    const noBtn = document.createElement('button');
    noBtn.textContent = 'NO';
    noBtn.className = 'btn';
    noBtn.style.cssText = 'background: rgba(255, 0, 0, 0.1); border: 2px solid #f00; color: #f00; margin: 5px;';
    noBtn.addEventListener('click', () => {
        playClick();
        buttonContainer.remove();
        question.textContent = '[CONTACT PROTOCOL ABORTED]';
        question.style.cssText = 'color: #f00; text-shadow: 0 0 5px #f00; font-size: 18px; margin-top: 20px;';
        log('Contact protocol aborted by operator');
        document.getElementById('analyze-btn').disabled = false;
        // Hide the box after a delay
        setTimeout(() => {
            contactBox.style.display = 'none';
        }, 2000);
    });

    buttonContainer.appendChild(yesBtn);
    buttonContainer.appendChild(noBtn);
    contactContent.appendChild(buttonContainer);
}

// Initiate contact
function initiateContact(star) {
    log('='.repeat(50), 'highlight');
    log('CONTACT PROTOCOL INITIATED', 'highlight');
    log('='.repeat(50), 'highlight');

    // Play special contact sound
    playContactSound();

    gameState.contactedStars.add(star.id);
    updateStarStatus(star.id, 'contact');

    // Hide contact protocol box
    document.getElementById('contact-protocol-box').style.display = 'none';

    showView('contact-view');

    const messageData = narrativeMessages.find(m => m.starIndex === star.id);
    displayContactMessage(messageData);
}

// Display contact message with typing effect
function displayContactMessage(messageData) {
    const messageDisplay = document.getElementById('message-display');
    messageDisplay.innerHTML = '';

    // Handle legacy format (array of messages)
    if (Array.isArray(messageData)) {
        displayMessages(messageData);
        return;
    }

    // Handle new format with images
    if (messageData.hasImage) {
        displayMessages(messageData.beforeImage, () => {
            showImageGenerationPrompt(messageData);
        });
    } else {
        displayMessages(messageData.messages || []);
    }

    function displayMessages(messages, callback) {
        let lineIndex = 0;

        function displayNextLine() {
            if (lineIndex < messages.length) {
                const line = document.createElement('div');
                line.className = 'message-line';
                line.textContent = messages[lineIndex];
                line.style.animationDelay = '0s';
                messageDisplay.appendChild(line);

                lineIndex++;

                // Scroll to bottom
                messageDisplay.scrollTop = messageDisplay.scrollHeight;

                setTimeout(displayNextLine, 800);
            } else if (callback) {
                callback();
            }
        }

        displayNextLine();
    }

    function showImageGenerationPrompt(messageData) {
        const messageDisplay = document.getElementById('message-display');

        // Add prompt
        const prompt = document.createElement('div');
        prompt.className = 'message-line';
        prompt.textContent = 'GENERATE IMAGE FROM DATA?';
        prompt.style.cssText = 'color: #0ff; text-shadow: 0 0 5px #0ff; font-size: 24px; margin-top: 20px;';
        messageDisplay.appendChild(prompt);

        // Add button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'margin-top: 15px; text-align: center;';

        // YES button
        const yesBtn = document.createElement('button');
        yesBtn.textContent = 'YES';
        yesBtn.className = 'btn';
        yesBtn.style.cssText = 'background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0; color: #0f0; margin: 0 10px;';
        yesBtn.addEventListener('click', () => {
            playClick();
            buttonContainer.remove();
            prompt.textContent = 'GENERATING IMAGE...';
            setTimeout(() => {
                displayImageData(messageData);
            }, 1000);
        });

        // NO button
        const noBtn = document.createElement('button');
        noBtn.textContent = 'NO';
        noBtn.className = 'btn';
        noBtn.style.cssText = 'background: rgba(255, 0, 0, 0.1); border: 2px solid #f00; color: #f00; margin: 0 10px;';
        noBtn.addEventListener('click', () => {
            playClick();
            buttonContainer.remove();
            prompt.textContent = '[IMAGE GENERATION SKIPPED]';
            setTimeout(() => {
                displayMessages(messageData.afterImage);
            }, 1000);
        });

        buttonContainer.appendChild(yesBtn);
        buttonContainer.appendChild(noBtn);
        messageDisplay.appendChild(buttonContainer);
    }

    function displayImageData(messageData) {
        const messageDisplay = document.getElementById('message-display');

        // Create image display box
        const imageBox = document.createElement('div');
        imageBox.style.cssText = 'border: 2px solid #0ff; background: rgba(0, 255, 255, 0.05); padding: 20px; margin: 20px 0; text-align: center;';
        messageDisplay.appendChild(imageBox);

        // Display image line by line for suspense
        let lineIndex = 0;
        function displayNextImageLine() {
            if (lineIndex < messageData.imageData.length) {
                const imageLine = document.createElement('div');
                imageLine.className = 'message-line';
                imageLine.textContent = messageData.imageData[lineIndex];
                imageLine.style.cssText = 'color: #0ff; text-shadow: 0 0 5px #0ff; animation: fadeIn 0.2s forwards; margin: 0; line-height: 1.2;';
                imageBox.appendChild(imageLine);

                // Scroll to bottom
                messageDisplay.scrollTop = messageDisplay.scrollHeight;

                lineIndex++;
                setTimeout(displayNextImageLine, 150); // 150ms delay between lines
            } else {
                // Continue with rest of message after image is complete
                setTimeout(() => {
                    displayMessages(messageData.afterImage);
                }, 1000);
            }
        }

        displayNextImageLine();
    }
}

// Update star status in catalog
function updateStarStatus(starId, status) {
    const starElement = document.querySelector(`[data-star-id="${starId}"]`);
    if (!starElement) return;

    const statusElement = starElement.querySelector('.star-status');

    if (status === 'analyzed') {
        starElement.classList.add('analyzed');
        statusElement.textContent = '✓';
    } else if (status === 'contact') {
        starElement.classList.remove('analyzed');
        starElement.classList.add('contact');
        statusElement.textContent = '★';
    }
}

// View management
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

// Clear canvas
function clearCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Type out analysis text line by line
function typeAnalysisText(lines, callback) {
    const analysisText = document.getElementById('analysis-text');
    analysisText.innerHTML = '';

    let lineIndex = 0;

    function typeLine() {
        if (lineIndex < lines.length) {
            const p = document.createElement('p');

            // Handle styled lines
            if (typeof lines[lineIndex] === 'object') {
                p.innerHTML = lines[lineIndex].text;
                if (lines[lineIndex].style) {
                    p.style.cssText = lines[lineIndex].style;
                }
            } else {
                p.textContent = lines[lineIndex];
            }

            analysisText.appendChild(p);
            lineIndex++;

            setTimeout(typeLine, 150); // Delay between lines
        } else if (callback) {
            callback();
        }
    }

    typeLine();
}

// Logging with typing effect
function log(message, className = '') {
    const logContent = document.getElementById('log-content');
    const entry = document.createElement('div');
    entry.className = 'log-entry' + (className ? ' ' + className : '');

    const timestamp = `[${new Date().toTimeString().substring(0, 8)}] `;
    const fullMessage = timestamp + message;

    // Add empty entry first
    entry.textContent = '';
    logContent.appendChild(entry);

    // Type out character by character
    let charIndex = 0;
    const typeInterval = setInterval(() => {
        if (charIndex < fullMessage.length) {
            entry.textContent += fullMessage[charIndex];
            charIndex++;

            // Auto-scroll to bottom
            logContent.scrollTop = logContent.scrollHeight;
        } else {
            clearInterval(typeInterval);
        }
    }, 20); // 20ms per character = very fast typing

    // Keep only last 20 entries
    while (logContent.children.length > 20) {
        logContent.removeChild(logContent.firstChild);
    }
}

// Calculate scan box position with edge detection
function calculateScanBoxPosition(star, canvasWidth) {
    const parallaxX = star.x + gameState.parallaxOffsetX * 0.3;
    const parallaxY = star.y + gameState.parallaxOffsetY * 0.3;
    const boxWidth = 120;
    const boxHeight = 60;

    // Try to position to the right first
    let boxX = parallaxX + 40;
    const boxY = parallaxY - 20;

    // Check if box would go off the right edge
    if (boxX + boxWidth > canvasWidth - 10) {
        // Position to the left instead
        boxX = parallaxX - boxWidth - 10;
    }

    // Check if box would go off the left edge (very close to left edge)
    if (boxX < 10) {
        boxX = 10; // Clamp to left edge with some padding
    }

    return { boxX, boxY, boxWidth, boxHeight };
}

// Setup star map canvas
function setupStarMapCanvas() {
    const canvas = document.getElementById('starmap-canvas');

    // Mouse move for parallax effect
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Convert mouse position to -1 to 1 range (center is 0)
        gameState.targetMouseX = (x / canvas.width) * 2 - 1;
        gameState.targetMouseY = (y / canvas.height) * 2 - 1;
    });

    // Reset parallax when mouse leaves
    canvas.addEventListener('mouseleave', () => {
        gameState.targetMouseX = 0;
        gameState.targetMouseY = 0;
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicking on scan confirmation box
        if (gameState.showScanConfirm && gameState.selectedStarId !== null) {
            const star = gameState.stars[gameState.selectedStarId];
            const { boxX, boxY, boxWidth, boxHeight } = calculateScanBoxPosition(star, canvas.width);

            if (x >= boxX && x <= boxX + boxWidth && y >= boxY && y <= boxY + boxHeight) {
                // Clicked on scan box
                startScanSequence();
                return;
            }
        }

        // Find clicked star
        gameState.stars.forEach(star => {
            const dx = star.x - x;
            const dy = star.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 10) {
                gameState.selectedStarId = star.id;
                selectStar(star.id);
            }
        });
    });
}

// Render star map
function renderStarMap() {
    const canvas = document.getElementById('starmap-canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Smooth mouse position interpolation (eliminates snapping)
    gameState.mouseX += (gameState.targetMouseX - gameState.mouseX) * 0.08;
    gameState.mouseY += (gameState.targetMouseY - gameState.mouseY) * 0.08;

    // Smooth parallax interpolation (always lerp toward target)
    const targetOffsetX = gameState.mouseX * 15;
    const targetOffsetY = gameState.mouseY * 15;
    gameState.parallaxOffsetX += (targetOffsetX - gameState.parallaxOffsetX) * 0.08;
    gameState.parallaxOffsetY += (targetOffsetY - gameState.parallaxOffsetY) * 0.08;

    // Draw background stars with twinkling effect and parallax
    const time = Date.now() * 0.001;
    gameState.backgroundStars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.15 + 0.85;
        const alpha = star.alpha * twinkle;

        // Apply parallax effect (background stars move more - they're farther away)
        const parallaxX = star.x + gameState.parallaxOffsetX * 1.5;
        const parallaxY = star.y + gameState.parallaxOffsetY * 1.5;

        ctx.fillStyle = `rgb(${star.brightness}, ${star.brightness}, ${star.brightness})`;
        ctx.globalAlpha = alpha;
        ctx.fillRect(parallaxX, parallaxY, star.size, star.size);
    });

    ctx.globalAlpha = 1;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    for (let y = 0; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Draw catalog stars with subtle parallax
    gameState.stars.forEach(star => {
        const isSelected = gameState.selectedStarId === star.id;
        const isContacted = gameState.contactedStars.has(star.id);
        const isAnalyzed = gameState.analyzedStars.has(star.id);

        // Apply parallax effect (target stars move less - they're closer)
        const parallaxX = star.x + gameState.parallaxOffsetX * 0.3;
        const parallaxY = star.y + gameState.parallaxOffsetY * 0.3;

        // Star color based on status
        if (isContacted) {
            ctx.fillStyle = '#f0f';
            ctx.shadowColor = '#f0f';
        } else if (isAnalyzed) {
            ctx.fillStyle = '#ff0';
            ctx.shadowColor = '#ff0';
        } else {
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#fff';
        }

        ctx.shadowBlur = isSelected ? 15 : 10;

        // Draw star (pixel art style)
        const size = isSelected ? 5 : 3;
        ctx.fillRect(parallaxX - size / 2, parallaxY - size / 2, size, size);

        // Draw cross pattern
        ctx.fillRect(parallaxX - size - 2, parallaxY - 1, 2, 2);
        ctx.fillRect(parallaxX + size, parallaxY - 1, 2, 2);
        ctx.fillRect(parallaxX - 1, parallaxY - size - 2, 2, 2);
        ctx.fillRect(parallaxX - 1, parallaxY + size, 2, 2);

        ctx.shadowBlur = 0;
    });

    // Draw rotating crosshair on selected star
    if (gameState.selectedStarId !== null) {
        const star = gameState.stars[gameState.selectedStarId];

        // Apply same parallax as target stars
        const parallaxX = star.x + gameState.parallaxOffsetX * 0.3;
        const parallaxY = star.y + gameState.parallaxOffsetY * 0.3;

        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#0ff';
        ctx.shadowBlur = 10;

        // Rotate crosshair
        gameState.crosshairAngle += 0.02;

        ctx.save();
        ctx.translate(parallaxX, parallaxY);
        ctx.rotate(gameState.crosshairAngle);

        // Draw crosshair lines
        const crosshairSize = 20;
        ctx.beginPath();
        ctx.moveTo(-crosshairSize, 0);
        ctx.lineTo(-10, 0);
        ctx.moveTo(10, 0);
        ctx.lineTo(crosshairSize, 0);
        ctx.moveTo(0, -crosshairSize);
        ctx.lineTo(0, -10);
        ctx.moveTo(0, 10);
        ctx.lineTo(0, crosshairSize);
        ctx.stroke();

        // Draw corner brackets
        const bracketSize = 15;
        ctx.beginPath();
        // Top-left
        ctx.moveTo(-bracketSize, -bracketSize);
        ctx.lineTo(-bracketSize, -bracketSize + 5);
        ctx.moveTo(-bracketSize, -bracketSize);
        ctx.lineTo(-bracketSize + 5, -bracketSize);
        // Top-right
        ctx.moveTo(bracketSize, -bracketSize);
        ctx.lineTo(bracketSize, -bracketSize + 5);
        ctx.moveTo(bracketSize, -bracketSize);
        ctx.lineTo(bracketSize - 5, -bracketSize);
        // Bottom-left
        ctx.moveTo(-bracketSize, bracketSize);
        ctx.lineTo(-bracketSize, bracketSize - 5);
        ctx.moveTo(-bracketSize, bracketSize);
        ctx.lineTo(-bracketSize + 5, bracketSize);
        // Bottom-right
        ctx.moveTo(bracketSize, bracketSize);
        ctx.lineTo(bracketSize, bracketSize - 5);
        ctx.moveTo(bracketSize, bracketSize);
        ctx.lineTo(bracketSize - 5, bracketSize);
        ctx.stroke();

        ctx.restore();
        ctx.shadowBlur = 0;
    }

    // Draw scan confirmation box
    if (gameState.showScanConfirm && gameState.selectedStarId !== null) {
        const star = gameState.stars[gameState.selectedStarId];

        // Calculate box position with edge detection
        const { boxX, boxY, boxWidth, boxHeight } = calculateScanBoxPosition(star, width);

        // Box background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // Box border
        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#0ff';
        ctx.shadowBlur = 10;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Star name
        ctx.fillStyle = '#0ff';
        ctx.font = '14px VT323';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 5;
        ctx.fillText(star.name, boxX + boxWidth / 2, boxY + 20);

        // "SCAN?" text
        ctx.font = '18px VT323';
        ctx.fillText('SCAN?', boxX + boxWidth / 2, boxY + 40);

        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
    }
}

// Start star map animation loop
function startStarMapAnimation() {
    function animate() {
        renderStarMap();
        gameState.animationFrameId = requestAnimationFrame(animate);
    }
    animate();
}

// === TUNING MINIGAME ===

function startTuningMinigame(star) {
    // Generate random target values for this star
    gameState.targetFrequency = Math.floor(Math.random() * 60) + 20; // 20-80
    gameState.targetGain = Math.floor(Math.random() * 60) + 20; // 20-80

    // Start sliders far from target to ensure red color at start
    // Pick random extreme positions (0 or 100) to guarantee low initial quality
    gameState.currentFrequency = Math.random() < 0.5 ? 0 : 100;
    gameState.currentGain = Math.random() < 0.5 ? 0 : 100;
    gameState.lockDuration = 0;
    gameState.tuningActive = true;

    // Show tuning interface
    document.getElementById('tuning-game').style.display = 'block';

    // Set slider values to match starting positions
    document.getElementById('frequency-slider').value = gameState.currentFrequency;
    document.getElementById('gain-slider').value = gameState.currentGain;
    document.getElementById('frequency-value').textContent = gameState.currentFrequency.toString();
    document.getElementById('gain-value').textContent = gameState.currentGain.toString();

    // Start tuning feedback loop
    tuningFeedbackLoop();

    // Start static hiss sound
    startStaticHiss();

    log('Signal tuning interface activated');
}

function tuningFeedbackLoop() {
    if (!gameState.tuningActive) return;

    // Calculate how close the values are to target (0-1, where 1 is perfect)
    const freqDiff = Math.abs(gameState.currentFrequency - gameState.targetFrequency);
    const gainDiff = Math.abs(gameState.currentGain - gameState.targetGain);

    const tolerance = 5; // Values within 5 are considered "locked"
    const maxDiff = 100;

    // Calculate signal quality (0-100%)
    const freqQuality = Math.max(0, 1 - (freqDiff / maxDiff));
    const gainQuality = Math.max(0, 1 - (gainDiff / maxDiff));
    const overallQuality = (freqQuality + gainQuality) / 2;
    const qualityPercent = Math.floor(overallQuality * 100);

    // Update tuning tone based on quality
    startTuningTone(overallQuality);

    // Update static hiss volume (inverse of quality - loud when quality is low)
    if (staticGainNode && audioContext) {
        // Static is loud when quality is low, quiet when quality is high
        const staticVolume = (1 - overallQuality) * 0.08 * masterVolume;
        staticGainNode.gain.setTargetAtTime(staticVolume, audioContext.currentTime, 0.05);
    }

    // Update UI
    const strengthFill = document.getElementById('signal-strength-fill');
    const strengthPercent = document.getElementById('signal-strength-percent');
    strengthFill.style.width = qualityPercent + '%';
    strengthPercent.textContent = qualityPercent + '%';

    // Draw noisy waveform that clears up as quality improves
    drawTuningWaveform(overallQuality);

    // Check if locked (both values within tolerance)
    if (freqDiff <= tolerance && gainDiff <= tolerance) {
        gameState.lockDuration++;
        strengthFill.style.boxShadow = '0 0 20px #0f0';

        // Success! Complete the scan
        if (gameState.lockDuration >= gameState.lockRequired) {
            completeTuningScan(gameState.currentStar);
            return;
        }
    } else {
        gameState.lockDuration = 0;
        strengthFill.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
    }

    // Continue loop
    requestAnimationFrame(tuningFeedbackLoop);
}

function drawTuningWaveform(quality) {
    const waveCanvas = document.getElementById('waveform-canvas');
    const waveCtx = waveCanvas.getContext('2d');
    const width = waveCanvas.width;
    const height = waveCanvas.height;

    waveCtx.fillStyle = '#000';
    waveCtx.fillRect(0, 0, width, height);

    // Color temperature feedback based on quality
    const qualityPercent = quality * 100;
    let strokeColor, shadowColor;

    if (qualityPercent < 30) {
        // Red: Far off (0-30%)
        strokeColor = '#ff0000';
        shadowColor = '#ff0000';
    } else if (qualityPercent < 70) {
        // Orange/Yellow: Getting warmer (30-70%)
        // Interpolate between orange and yellow
        const blend = (qualityPercent - 30) / 40; // 0 to 1
        const red = 255;
        const green = Math.floor(100 + (155 * blend)); // 100 (orange) to 255 (yellow)
        const blue = 0;
        strokeColor = `rgb(${red}, ${green}, ${blue})`;
        shadowColor = strokeColor;
    } else {
        // Green/Cyan: Close/Locked (70-100%)
        // Interpolate between green and cyan
        const blend = (qualityPercent - 70) / 30; // 0 to 1
        const red = 0;
        const green = 255;
        const blue = Math.floor(255 * blend); // 0 (green) to 255 (cyan)
        strokeColor = `rgb(${red}, ${green}, ${blue})`;
        shadowColor = strokeColor;
    }

    // Signal emergence: noise layer + signal layer
    const noiseAmount = 120 * (1 - quality); // Heavy noise at low quality
    const signalStrength = quality; // Signal emerges as quality improves

    // Add visual offset for animation
    const timeOffset = gameState.signalOffset || 0;

    // LAYER 1: Draw noise layer (chaotic, always present but fades)
    if (quality < 0.95) { // Only show noise if not near-perfect
        waveCtx.strokeStyle = strokeColor;
        waveCtx.globalAlpha = 0.3 + (0.4 * (1 - quality)); // Noise fades as quality improves
        waveCtx.lineWidth = 1;
        waveCtx.shadowBlur = 2;
        waveCtx.shadowColor = shadowColor;

        waveCtx.beginPath();
        for (let x = 0; x < width; x++) {
            const noise = (Math.random() - 0.5) * noiseAmount;
            const y = height / 2 + noise;

            if (x === 0) {
                waveCtx.moveTo(x, y);
            } else {
                waveCtx.lineTo(x, y);
            }
        }
        waveCtx.stroke();
    }

    // LAYER 2: Draw signal layer (clean sine wave that emerges)
    waveCtx.globalAlpha = signalStrength; // Signal fades in as quality improves
    waveCtx.strokeStyle = strokeColor;
    waveCtx.lineWidth = 2;
    waveCtx.shadowBlur = 5 + (10 * quality); // Glow intensifies as quality improves
    waveCtx.shadowColor = shadowColor;

    waveCtx.beginPath();
    for (let x = 0; x < width; x++) {
        const xPos = x + timeOffset;
        // Clean sine wave signal (target pattern)
        const signal = Math.sin(xPos * 0.02) * 50 * signalStrength;
        const pulse = Math.sin(xPos * 0.005) * 20 * signalStrength; // Gentle modulation

        // Add tiny noise even to clean signal for realism
        const fineNoise = (Math.random() - 0.5) * 5 * (1 - quality);

        const y = height / 2 + signal + pulse + fineNoise;

        if (x === 0) {
            waveCtx.moveTo(x, y);
        } else {
            waveCtx.lineTo(x, y);
        }
    }
    waveCtx.stroke();

    // Reset alpha
    waveCtx.globalAlpha = 1.0;

    // Increment animation offset
    gameState.signalOffset = (gameState.signalOffset || 0) + 1;
}

function completeTuningScan(star) {
    gameState.tuningActive = false;

    // Stop tuning tone, static hiss, and play lock achievement sound
    stopTuningTone();
    stopStaticHiss();
    playLockAchieved();

    // Hide tuning interface
    document.getElementById('tuning-game').style.display = 'none';

    log('>>> SIGNAL LOCK ACHIEVED <<<', 'highlight');
    log('Acquiring signal data...');

    document.getElementById('analysis-text').innerHTML =
        '<p>SIGNAL LOCKED</p><p>ACQUIRING DATA...</p>';

    // Generate the actual signal
    setTimeout(() => {
        generateSignal(star);

        // Cache the signal data including canvas states
        const waveCanvas = document.getElementById('waveform-canvas');
        const waveCtx = waveCanvas.getContext('2d');
        const waveformData = waveCtx.getImageData(0, 0, waveCanvas.width, waveCanvas.height);

        const specCanvas = document.getElementById('spectrogram-canvas');
        const specCtx = specCanvas.getContext('2d');
        const spectrogramData = specCtx.getImageData(0, 0, specCanvas.width, specCanvas.height);

        gameState.scannedSignals.set(star.id, {
            ...gameState.currentSignal,
            waveformData: waveformData,
            spectrogramData: spectrogramData
        });

        startSignalAnimation();
        log('Signal acquisition complete');
        document.getElementById('analyze-btn').disabled = false;
        document.getElementById('scan-btn').disabled = false;
    }, 1000);
}

// Pattern Recognition Minigame
function startPatternRecognitionGame(star) {
    gameState.patternGameActive = true;
    gameState.patternGameBands = [];
    gameState.patternGameCorrectIndices = [];
    gameState.patternGameSelectedIndices = [];
    gameState.patternGameCompleted = false;

    // Show pattern game interface
    document.getElementById('pattern-game').style.display = 'block';
    document.getElementById('analyze-btn').disabled = true;

    // Generate 3 VISUALLY DISTINCT component waves with clear frequency separation
    // LOW frequency - slow baseline oscillation (1-2 complete waves visible)
    const component1 = {
        freq: 0.006 + Math.random() * 0.004,  // 0.006-0.010 (slow)
        amp: 18 + Math.random() * 10,         // 18-28 amplitude
        phase: Math.random() * Math.PI * 2,
        name: 'LOW'
    };

    // MEDIUM frequency - moderate oscillation (3-5 complete waves visible)
    const component2 = {
        freq: 0.018 + Math.random() * 0.008,  // 0.018-0.026 (medium)
        amp: 12 + Math.random() * 8,          // 12-20 amplitude
        phase: Math.random() * Math.PI * 2,
        name: 'MEDIUM'
    };

    // HIGH frequency - fast ripples (8-12 complete waves visible)
    const component3 = {
        freq: 0.040 + Math.random() * 0.015,  // 0.040-0.055 (fast)
        amp: 8 + Math.random() * 6,           // 8-14 amplitude (smaller so it shows as ripples)
        phase: Math.random() * Math.PI * 2,
        name: 'HIGH'
    };

    // Store components for this game session
    gameState.patternComponents = [component1, component2, component3];

    // Generate reference pattern (combination of all 3 components)
    const refCanvas = document.getElementById('reference-pattern');
    generateReferencePattern(gameState.patternComponents, refCanvas);

    // Generate 6-8 frequency bands
    const numBands = 6 + Math.floor(Math.random() * 3); // 6, 7, or 8 bands

    // Randomly assign which 3 bands will have the correct components
    const correctIndices = [];
    while (correctIndices.length < 3) {
        const idx = Math.floor(Math.random() * numBands);
        if (!correctIndices.includes(idx)) {
            correctIndices.push(idx);
        }
    }
    gameState.patternGameCorrectIndices = correctIndices;

    // Assign each correct band one of the three components
    const componentAssignments = {};
    correctIndices.forEach((idx, i) => {
        componentAssignments[idx] = i; // Band gets component 0, 1, or 2
    });

    // Generate band elements
    const bandsContainer = document.getElementById('pattern-bands');
    bandsContainer.innerHTML = '';

    for (let i = 0; i < numBands; i++) {
        const bandDiv = document.createElement('div');
        bandDiv.className = 'frequency-band';
        bandDiv.dataset.bandIndex = i;

        const label = document.createElement('div');
        label.className = 'band-label';
        const freq = 1420 + i * 150; // Starting from hydrogen line
        label.textContent = `BAND ${i + 1} (${freq}MHz)`;

        const canvas = document.createElement('canvas');
        canvas.className = 'band-canvas';
        canvas.width = 180;
        canvas.height = 80;

        const isCorrect = correctIndices.includes(i);
        const componentIndex = isCorrect ? componentAssignments[i] : -1;
        generateFrequencyBand(canvas, isCorrect, componentIndex, i, star);

        bandDiv.appendChild(label);
        bandDiv.appendChild(canvas);

        // Click handler
        bandDiv.addEventListener('click', () => {
            if (gameState.patternGameCompleted || bandDiv.classList.contains('locked')) return;

            playClick();
            const index = parseInt(bandDiv.dataset.bandIndex);

            if (bandDiv.classList.contains('selected')) {
                // Deselect
                bandDiv.classList.remove('selected');
                const idx = gameState.patternGameSelectedIndices.indexOf(index);
                if (idx > -1) {
                    gameState.patternGameSelectedIndices.splice(idx, 1);
                }
            } else {
                // Select
                bandDiv.classList.add('selected');
                gameState.patternGameSelectedIndices.push(index);

                // Check if this selection completes the game
                checkPatternGameCompletion(star);
            }
        });

        bandsContainer.appendChild(bandDiv);
        gameState.patternGameBands.push({ element: bandDiv, isCorrect, index: i });
    }

    log('Pattern recognition analysis initiated');
    document.getElementById('pattern-status').textContent = 'SELECT 3 FREQUENCY BANDS THAT COMBINE TO CREATE THE TARGET PATTERN';
}

function generateReferencePattern(components, canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#0ff';
    ctx.beginPath();

    // Combine all 3 components to create the reference pattern
    for (let x = 0; x < width; x++) {
        let y = height / 2;

        // Add each component wave
        components.forEach(comp => {
            y += Math.sin(x * comp.freq + comp.phase) * comp.amp;
        });

        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
}

function generateFrequencyBand(canvas, isCorrect, componentIndex, bandIndex, star) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 3;
    ctx.shadowColor = '#0f0';
    ctx.beginPath();

    if (isCorrect && componentIndex >= 0) {
        // Draw the EXACT component wave that's in the reference
        const component = gameState.patternComponents[componentIndex];

        for (let x = 0; x < width; x++) {
            const noise = (Math.random() - 0.5) * 4; // Minimal noise to show it's a clean signal
            const signal = Math.sin(x * component.freq + component.phase) * component.amp;
            const y = height / 2 + signal + noise;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
    } else {
        // Generate SIMILAR BUT WRONG decoys
        // These frequencies are close to the correct ones but would create a different combined pattern
        const starId = star ? star.id : 0;
        const seed = bandIndex * 17 + starId * 3;
        const decoyType = seed % 6;

        let freq, amp, phase;

        switch (decoyType) {
            case 0:
                // Wrong LOW frequency (too slow)
                freq = 0.003 + (seed % 5) * 0.001;
                amp = 15 + (seed % 4) * 5;
                phase = (seed % 10) * 0.6;
                break;

            case 1:
                // Wrong LOW frequency (too fast for low, not quite medium)
                freq = 0.012 + (seed % 4) * 0.002;
                amp = 20 + (seed % 3) * 4;
                phase = (seed % 8) * 0.7;
                break;

            case 2:
                // Wrong MEDIUM frequency (too slow)
                freq = 0.013 + (seed % 4) * 0.001;
                amp = 14 + (seed % 5) * 3;
                phase = (seed % 7) * 0.8;
                break;

            case 3:
                // Wrong MEDIUM frequency (too fast)
                freq = 0.029 + (seed % 5) * 0.002;
                amp = 16 + (seed % 4) * 4;
                phase = (seed % 9) * 0.5;
                break;

            case 4:
                // Wrong HIGH frequency (too slow)
                freq = 0.032 + (seed % 3) * 0.002;
                amp = 10 + (seed % 4) * 2;
                phase = (seed % 6) * 0.9;
                break;

            case 5:
                // Wrong HIGH frequency (way too fast or has harmonics)
                freq = 0.060 + (seed % 4) * 0.005;
                amp = 12 + (seed % 3) * 3;
                phase = (seed % 11) * 0.4;
                break;
        }

        // Draw the decoy wave
        for (let x = 0; x < width; x++) {
            const noiseSample = (Math.random() - 0.5) * 5;
            const signal = Math.sin(x * freq + phase) * amp;
            const y = height / 2 + signal + noiseSample;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
    }

    ctx.stroke();
}

function checkPatternGameCompletion(star) {
    const selected = gameState.patternGameSelectedIndices;
    const correct = gameState.patternGameCorrectIndices;

    // Check if exactly 3 bands are selected (all correct bands)
    if (selected.length !== 3) return;

    const allCorrect = selected.every(idx => correct.includes(idx));

    if (allCorrect) {
        // Success!
        gameState.patternGameCompleted = true;
        playLockAchieved();

        // Mark all bands as correct
        gameState.patternGameBands.forEach(band => {
            if (correct.includes(band.index)) {
                band.element.classList.add('correct');
                band.element.classList.add('locked');
            }
        });

        document.getElementById('pattern-status').innerHTML =
            '<span style="color: #0f0; text-shadow: 0 0 10px #0f0;">✓ PATTERN MATCH CONFIRMED</span>';

        log('>>> PATTERN RECOGNITION COMPLETE <<<', 'highlight');

        // Continue with analysis after delay
        setTimeout(() => {
            completePatternGame(star);
        }, 2000);
    } else {
        // Wrong selection - mark wrong bands
        selected.forEach(idx => {
            if (!correct.includes(idx)) {
                const band = gameState.patternGameBands.find(b => b.index === idx);
                if (band) {
                    band.element.classList.add('wrong');
                    playStaticBurst(); // Error sound

                    setTimeout(() => {
                        band.element.classList.remove('wrong');
                        band.element.classList.remove('selected');
                    }, 500);
                }
            }
        });

        // Remove wrong selections
        gameState.patternGameSelectedIndices = selected.filter(idx => correct.includes(idx));
        document.getElementById('pattern-status').innerHTML =
            '<span style="color: #f00;">INCORRECT - TRY AGAIN</span>';

        setTimeout(() => {
            document.getElementById('pattern-status').textContent = 'SELECT 3 FREQUENCY BANDS THAT COMBINE TO CREATE THE TARGET PATTERN';
        }, 1500);
    }
}

function completePatternGame(star) {
    // Hide pattern game
    document.getElementById('pattern-game').style.display = 'none';
    gameState.patternGameActive = false;

    // Continue with original analysis flow
    const signal = gameState.currentSignal;

    // Regenerate signal with analyzed=true to reveal the actual pattern
    stopSignalAnimation();
    generateSignal(star, true);

    // Cache the analyzed signal
    const waveCanvas = document.getElementById('waveform-canvas');
    const waveCtx = waveCanvas.getContext('2d');
    const waveformData = waveCtx.getImageData(0, 0, waveCanvas.width, waveCanvas.height);

    const specCanvas = document.getElementById('spectrogram-canvas');
    const specCtx = specCanvas.getContext('2d');
    const spectrogramData = specCtx.getImageData(0, 0, specCanvas.width, specCanvas.height);

    gameState.scannedSignals.set(star.id, {
        star: star,
        hasIntelligence: signal.hasIntelligence,
        analyzed: true,
        waveformData: waveformData,
        spectrogramData: spectrogramData
    });

    startSignalAnimation();

    if (signal.hasIntelligence) {
        log('>>> ANOMALOUS PATTERN DETECTED <<<', 'highlight');
        log('POSSIBLE NON-NATURAL ORIGIN');

        // Switch to alien music and start alien signal sound
        switchToAlienMusic();
        startAlienSignalSound(star);

        const lines = [
            'ANALYSIS COMPLETE',
            '════════════════════════════',
            { text: '⚠ NON-RANDOM PATTERN DETECTED ⚠', style: 'color: #ff0; text-shadow: 0 0 5px #ff0;' },
            'Signal exhibits structured modulation',
            'Frequency bands show intentional spacing',
            'Repeating sequences identified',
            '════════════════════════════',
            { text: 'PROBABILITY OF INTELLIGENT ORIGIN: 94.7%', style: 'color: #ff0;' },
            ''
        ];

        typeAnalysisText(lines, () => {
            // Show contact protocol prompt with YES/NO buttons
            showContactPrompt(star);
        });
    } else {
        log('Analysis complete: Natural stellar emissions');

        // Start natural phenomena sound
        startNaturalPhenomenaSound();

        const lines = [
            'ANALYSIS COMPLETE',
            '════════════════════════════',
            'Signal characteristics: Pulsar radiation',
            'Source: Natural stellar emissions',
            'Regular periodic oscillations detected',
            'Consistent with rotating neutron star',
            '════════════════════════════',
            'CLASSIFICATION: NATURAL PHENOMENON'
        ];

        typeAnalysisText(lines, () => {
            document.getElementById('analyze-btn').disabled = false;
        });
    }
}

// Boot Sequence Functions
function playTypingSound() {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800 + Math.random() * 200;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.02 * masterVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
}

function playSecurityBeep(type = 'normal') {
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

function typeBootLine(text, className = '', delay = 0, beepType = null) {
    return new Promise(resolve => {
        setTimeout(() => {
            const bootOutput = document.getElementById('boot-output');
            const line = document.createElement('div');
            line.className = `boot-line ${className}`;
            line.textContent = text;
            bootOutput.appendChild(line);

            // Auto-scroll the main-content container to show the new line
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollTop = mainContent.scrollHeight;
            }

            // Play typing sound
            if (text.length > 0) {
                playTypingSound();
            }

            // Play beep if specified
            if (beepType) {
                setTimeout(() => playSecurityBeep(beepType), 150);
            }

            // Add slight delay for animation
            setTimeout(resolve, 100);
        }, delay);
    });
}

async function runBootSequence() {
    const bootLines = NARRATIVE.bootSequence.initial;

    for (const line of bootLines) {
        await typeBootLine(line.text, line.class, line.delay, line.beep);
    }

    // Show name input with beep
    playSecurityBeep('normal');
    document.getElementById('name-input-container').style.display = 'block';
    document.getElementById('name-input').focus();
}

function continueBootSequence(playerName) {
    gameState.playerName = playerName;

    const nameInputContainer = document.getElementById('name-input-container');
    nameInputContainer.style.display = 'none';

    // Replace {NAME} placeholder with actual player name
    const continuationLines = NARRATIVE.bootSequence.continuation.map(line => ({
        ...line,
        text: line.text.replace('{NAME}', playerName)
    }));

    (async () => {
        for (const line of continuationLines) {
            await typeBootLine(line.text, line.class, line.delay, line.beep);
        }

        // Show proceed button instead of auto-transitioning
        setTimeout(() => {
            const proceedBtn = document.getElementById('proceed-btn');
            proceedBtn.style.display = 'block';
            playSecurityBeep('success');
        }, 500);
    })();
}

function setupBootSequence() {
    // Start button
    document.getElementById('start-btn').addEventListener('click', () => {
        playClick();
        showView('boot-view');
        runBootSequence();
    });

    // Name input submit
    document.getElementById('name-submit-btn').addEventListener('click', () => {
        const nameInput = document.getElementById('name-input');
        const name = nameInput.value.trim();

        if (name) {
            playClick();
            continueBootSequence(name);
        }
    });

    // Allow Enter key to submit name
    document.getElementById('name-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const name = e.target.value.trim();
            if (name) {
                playClick();
                continueBootSequence(name);
            }
        }
    });

    // Proceed to array button
    document.getElementById('proceed-btn').addEventListener('click', () => {
        playClick();
        showView('starmap-view');
        // Show mailbox button now that user has entered the system
        document.getElementById('mailbox-btn').style.display = 'block';
        log(`Dr. ${gameState.playerName} logged in - System ready`, 'highlight');

        // Send welcome message after entering the starmap
        setTimeout(() => {
            const welcome = NARRATIVE.emails.welcome;
            addMailMessage(welcome.from, welcome.subject, welcome.body);
        }, 3000);
    });
}

// Color Scheme Toggle
function toggleColorScheme() {
    const body = document.body;
    const isWhiteMode = body.classList.toggle('white-mode');

    // Update button label
    const schemeLabel = document.getElementById('scheme-label');
    schemeLabel.textContent = isWhiteMode ? 'WHITE' : 'GREEN';

    // Save preference to localStorage
    localStorage.setItem('colorScheme', isWhiteMode ? 'white' : 'green');

    log(`Color scheme changed to ${isWhiteMode ? 'WHITE' : 'GREEN'} mode`);
}

function loadColorScheme() {
    const savedScheme = localStorage.getItem('colorScheme');
    if (savedScheme === 'white') {
        document.body.classList.add('white-mode');
        document.getElementById('scheme-label').textContent = 'WHITE';
    }
}

// Mailbox Functions
function openMailbox() {
    // Check if already in mailbox view
    const currentView = document.querySelector('.view.active').id;
    if (currentView === 'mailbox-view') {
        return; // Already in mailbox, do nothing
    }

    // Save current view to return to it later
    gameState.previousView = currentView;

    showView('mailbox-view');
    updateMailboxDisplay();

    // Mark all messages as read
    gameState.mailboxMessages.forEach(msg => msg.read = true);
    gameState.unreadMailCount = 0;
    updateMailIndicator();

    log('Accessing secure mailbox...');
}

function closeMailbox() {
    // Return to previous view or default to starmap
    const returnView = gameState.previousView || 'starmap-view';
    showView(returnView);
    log('Mailbox closed');
}

function updateMailboxDisplay() {
    const messageList = document.getElementById('message-list');
    const noMessages = document.getElementById('no-messages');
    const mailboxStatus = document.getElementById('mailbox-status');

    if (gameState.mailboxMessages.length === 0) {
        noMessages.style.display = 'block';
        messageList.style.display = 'none';
        mailboxStatus.textContent = 'NO NEW MESSAGES';
    } else {
        noMessages.style.display = 'none';
        messageList.style.display = 'flex';

        const unreadCount = gameState.mailboxMessages.filter(msg => !msg.read).length;
        mailboxStatus.textContent = unreadCount > 0 ?
            `${unreadCount} UNREAD MESSAGE${unreadCount > 1 ? 'S' : ''}` :
            'ALL MESSAGES READ';

        // Generate message HTML
        messageList.innerHTML = gameState.mailboxMessages
            .slice()
            .reverse() // Show newest first
            .map((msg, index) => `
                <div class="mail-item ${msg.read ? '' : 'unread'}" data-index="${gameState.mailboxMessages.length - 1 - index}">
                    <div class="mail-header">
                        <div class="mail-from">${msg.from}</div>
                        <div class="mail-date">${msg.date}</div>
                    </div>
                    <div class="mail-subject">${msg.subject}</div>
                    <div class="mail-preview">${msg.preview}</div>
                    <div class="mail-body">${msg.body}</div>
                </div>
            `).join('');

        // Add click handlers to expand/collapse messages
        document.querySelectorAll('.mail-item').forEach(item => {
            item.addEventListener('click', function() {
                this.classList.toggle('expanded');
                playClick();
            });
        });
    }
}

function addMailMessage(from, subject, body, preview = null) {
    const now = new Date();
    const dateStr = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-1995`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const message = {
        from: from,
        subject: subject,
        body: body,
        preview: preview || body.substring(0, 80) + '...',
        date: `${dateStr} ${timeStr}`,
        read: false,
        timestamp: now.getTime()
    };

    gameState.mailboxMessages.push(message);
    gameState.unreadMailCount++;
    updateMailIndicator();

    log(`New message received from ${from}`, 'highlight');
    playSecurityBeep('normal');
}

function updateMailIndicator() {
    const indicator = document.getElementById('mail-indicator');
    if (gameState.unreadMailCount > 0) {
        indicator.style.display = 'inline';
    } else {
        indicator.style.display = 'none';
    }
}

function checkForNewMail() {
    // Check if enough time has passed since last mail
    const timeSinceLastMail = Date.now() - gameState.lastMailTime;
    const minInterval = 120000; // 2 minutes minimum between messages

    if (timeSinceLastMail > minInterval) {
        // Random chance to receive mail
        if (Math.random() < 0.3) { // 30% chance each check
            sendRandomMail();
            gameState.lastMailTime = Date.now();
        }
    }
}

function sendRandomMail() {
    const messages = [
        {
            from: 'PROJECT OVERSIGHT - CLASSIFIED',
            subject: 'RE: Budget Concerns',
            body: `Dr. ${gameState.playerName},\n\nWe've reviewed your latest requisition requests. While we understand the need for continued deep space monitoring, budgetary constraints require justification.\n\nPlease provide evidence of signal anomalies or potential contact scenarios to support continued funding.\n\n- Oversight Committee\nSector 7 Administration`
        },
        {
            from: 'Dr. Eleanor Chen - Radio Astronomy',
            subject: 'Interference Patterns',
            body: `${gameState.playerName},\n\nI've been reviewing some of the frequency data from your array. There are some unusual interference patterns that don't match known sources.\n\nHave you ruled out terrestrial interference? Some of these signatures are... peculiar.\n\nLet me know if you need a second opinion.\n\n- Eleanor`
        },
        {
            from: 'SYSTEM ADMINISTRATOR',
            subject: 'Array Maintenance Schedule',
            body: `NOTICE TO ALL PERSONNEL:\n\nScheduled maintenance on Deep Space Array components will occur:\nDATE: Next week\nDURATION: 4-6 hours\nAFFECTED SYSTEMS: Receivers 3, 7, 12\n\nPlease plan signal acquisition accordingly.\n\n- Technical Services`
        },
        {
            from: 'Dr. James Whitmore - SETI Director',
            subject: 'Keep Up The Work',
            body: `${gameState.playerName},\n\nI know the isolation of deep space monitoring can be challenging. Remember, every signal analyzed, every frequency scanned, brings us closer to answering humanity's greatest question.\n\nYour work matters. Even if we don't find anything today, your dedication is noted and appreciated.\n\n- James`
        },
        {
            from: 'SECURITY CLEARANCE - LEVEL 5',
            subject: '[CLASSIFIED] Unusual Activity',
            body: `[ENCRYPTED COMMUNICATION]\n\nDr. ${gameState.playerName},\n\nYour clearance has been elevated for this communication.\n\nWe've detected coordinated signal patterns across multiple listening posts. Your sector is of particular interest.\n\nReport any anomalies immediately. Do not discuss findings outside secure channels.\n\nProtocol Sigma is in effect.\n\n[END TRANSMISSION]`
        }
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    addMailMessage(randomMsg.from, randomMsg.subject, randomMsg.body);
}

// Start the game
function startGame() {
    updateClock();
    setInterval(updateClock, 1000);

    // Load saved color scheme
    loadColorScheme();

    // Initialize audio on first user interaction
    document.addEventListener('click', () => {
        initAudio();
    }, { once: true });

    generateBackgroundStars();
    generateStarCatalog();
    setupEventListeners();
    setupStarMapCanvas();
    startStarMapAnimation();
    setupBootSequence();

    // Check for new mail periodically (every 60 seconds)
    setInterval(checkForNewMail, 60000);
}

startGame();
