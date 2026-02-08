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
        },
        {
            starIndex: 21, // LUYTEN-B (weak signal - alien)
            messages: [
                "WEAK SIGNAL AMPLIFICATION SUCCESSFUL",
                "PATTERN ANALYSIS: BINARY MATHEMATICAL SEQUENCE",
                "",
                "TRANSLATING...",
                "",
                "WE DETECT YOUR ARRAY",
                "YOUR TECHNOLOGY GROWS",
                "",
                "SOON YOU WILL BE READY",
                "THE NETWORK AWAITS NEW MEMBERS",
                "",
                "PATIENCE...",
                "UNDERSTANDING TAKES TIME",
                "",
                "[SIGNAL FADING]",
                "",
                "CONTINUE SEARCHING...",
                "WE ARE WATCHING"
            ]
        },
        {
            starIndex: 25, // EPSILON-INDI-B (weak signal - alien with image)
            hasImage: true,
            beforeImage: [
                "MAXIMUM ARRAY POWER ACHIEVED",
                "DECODING COMPLEX SIGNAL STRUCTURE...",
                "",
                "WARNING: UNPRECEDENTED DATA DENSITY",
                "",
                ">>> IMAGE DATA DETECTED <<<"
            ],
            imageData: [
                "                                    ",
                "    ████████████████████████████    ",
                "   █                            █   ",
                "  █  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  █  ",
                "  █  ░░░░░░░░░░░░░░░░░░░░░░░░  █  ",
                "  █  ░░████░░░░░░░░░░████░░░░  █  ",
                "  █  ░░████░░░░░░░░░░████░░░░  █  ",
                "  █  ░░░░░░░░░░░░░░░░░░░░░░░░  █  ",
                "  █  ░░░░░░░░██████░░░░░░░░░░  █  ",
                "  █  ░░░░░░░░██████░░░░░░░░░░  █  ",
                "   █                            █   ",
                "    ████████████████████████████    ",
                "                                    ",
                "    TRANSMISSION ORIGIN: ORBITAL    ",
                "    SIGNAL TYPE: BROADCAST BEACON   "
            ],
            afterImage: [
                "THIS IS NOT A PLANET",
                "IT'S A MEGASTRUCTURE",
                "",
                "A STATION...",
                "BROADCASTING...",
                "FOR MILLIONS OF YEARS",
                "",
                "AN INVITATION BEACON",
                "WAITING FOR ANYONE WITH",
                "THE TECHNOLOGY TO DETECT IT",
                "",
                "WE WERE MEANT TO FIND THIS",
                "WHEN WE WERE READY",
                "",
                "[COORDINATES EMBEDDED IN SIGNAL]"
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
    scanResults: new Map(), // Stores scan result details (natural phenomena, false positive, verified signal)
    noiseFrameCounter: 0, // Counter for slowing down noise animation
    // Tuning minigame state
    tuningActive: false,
    targetFrequency: 50,
    targetGain: 50,
    currentFrequency: 50,
    currentGain: 50,
    lockDuration: 0,
    lockRequired: 150, // 2.5 seconds at 60fps
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
    previousView: 'starmap-view',
    // Dish Array System - Code-based alignment
    dishArray: {
        dishes: [],
        currentTargetStar: null,
        alignmentCode: '',    // The code needed to align dishes
        inputCode: '',        // What the player has entered so far
        codeRequired: false,  // Whether a code is needed for current star
        alignedCount: 0       // Number of dishes currently aligned
    }
};

// Developer Mode
let devMode = false;
let devPanelCollapsed = false;

function initDevMode() {
    // Check URL parameter for dev mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('dev') === 'true') {
        devMode = true;
        showDevPanel();
    }

    // Keyboard shortcut: F2
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F2') {
            e.preventDefault();
            toggleDevMode();
        }
    });

    console.log('%c[DEV MODE AVAILABLE] Press F2 or add ?dev=true to URL', 'color: #f0f;');
}

function toggleDevMode() {
    devMode = !devMode;
    if (devMode) {
        showDevPanel();
    } else {
        hideDevPanel();
    }
}

function toggleDevPanelCollapse() {
    devPanelCollapsed = !devPanelCollapsed;
    const content = document.querySelector('.dev-panel-content');
    const toggle = document.querySelector('.dev-toggle');
    if (content) {
        content.style.display = devPanelCollapsed ? 'none' : 'block';
        toggle.textContent = devPanelCollapsed ? '+' : '−';
    }
}

function showDevPanel() {
    if (document.getElementById('dev-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'dev-panel';
    panel.innerHTML = `
        <div class="dev-panel-header" onclick="toggleDevPanelCollapse()" style="cursor: pointer;">
            DEV MODE <span class="dev-toggle">−</span>
        </div>
        <div class="dev-panel-content">
            <div class="dev-section">NAVIGATION</div>
            <button onclick="devSkipToStarmap()">Skip to Starmap</button>
            <button onclick="devShowSignalScan()">Signal Scan View</button>
            <button onclick="devShowTuningGame()">Tuning Mini-game</button>
            <button onclick="devShowPatternGame()">Pattern Mini-game</button>
            <button onclick="devShowMailbox()">Mailbox</button>

            <div class="dev-section">STAR ACTIONS</div>
            <button onclick="devMarkAllScanned()">Mark All Scanned</button>
            <button onclick="devMarkAllAnalyzed()">Mark All Analyzed</button>
            <button onclick="devTriggerContact()">Trigger Contact</button>
            <button onclick="devResetProgress()">Reset All Progress</button>

            <div class="dev-section">MISC</div>
            <button onclick="devAddRandomMail()">Add Random Email</button>
            <button onclick="devLogState()">Log Game State</button>

            <div class="dev-section">END STATE</div>
            <button onclick="devTriggerEndState()">Trigger End State</button>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.id = 'dev-panel-styles';
    style.textContent = `
        #dev-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 200px;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #f0f;
            color: #f0f;
            font-family: 'VT323', monospace;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
        }
        .dev-panel-header {
            background: #f0f;
            color: #000;
            padding: 5px 10px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .dev-toggle {
            font-size: 18px;
            font-weight: bold;
        }
        .dev-panel-content {
            padding: 10px;
            max-height: 70vh;
            overflow-y: auto;
        }
        .dev-section {
            color: #0ff;
            margin-top: 10px;
            margin-bottom: 5px;
            border-bottom: 1px solid #0ff;
            padding-bottom: 3px;
            font-size: 12px;
        }
        #dev-panel button {
            width: 100%;
            background: transparent;
            border: 1px solid #f0f;
            color: #f0f;
            padding: 5px;
            margin: 3px 0;
            cursor: pointer;
            font-family: 'VT323', monospace;
            font-size: 14px;
            transition: all 0.2s;
        }
        #dev-panel button:hover {
            background: #f0f;
            color: #000;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(panel);
    console.log('%c[DEV MODE ENABLED]', 'color: #f0f; font-weight: bold;');
}

function hideDevPanel() {
    const panel = document.getElementById('dev-panel');
    const style = document.getElementById('dev-panel-styles');
    if (panel) panel.remove();
    if (style) style.remove();
    console.log('%c[DEV MODE DISABLED]', 'color: #888;');
}

// Dev functions
function devSkipToStarmap() {
    // Set player name if not set
    if (!gameState.playerName) {
        gameState.playerName = 'DEV_USER';
        localStorage.setItem('setiPlayerName', gameState.playerName);
    }
    showView('starmap-view');
    log('DEV: Skipped to starmap', 'highlight');
}

function devShowSignalScan() {
    if (gameState.stars.length === 0) {
        devSkipToStarmap();
    }
    // Select first star with intelligence if available
    const intelligentStar = gameState.stars.find(s => s.hasIntelligence);
    const starId = intelligentStar ? intelligentStar.id : 0;
    selectStar(starId);
    initiateScan();
    log('DEV: Started signal scan', 'highlight');
}

function devShowTuningGame() {
    if (gameState.stars.length === 0) {
        devSkipToStarmap();
    }
    selectStar(0);
    showView('analysis-view');
    startTuningMinigame(gameState.currentStar);
    log('DEV: Started tuning mini-game', 'highlight');
}

function devShowPatternGame() {
    if (gameState.stars.length === 0) {
        devSkipToStarmap();
    }
    selectStar(0);
    showView('analysis-view');
    startPatternMinigame();
    log('DEV: Started pattern mini-game', 'highlight');
}

function devShowMailbox() {
    if (gameState.stars.length === 0) {
        devSkipToStarmap();
    }
    showView('mailbox-view');
    log('DEV: Opened mailbox', 'highlight');
}

function devMarkAllScanned() {
    gameState.stars.forEach((star, index) => {
        gameState.scannedSignals.set(index, {
            hasIntelligence: star.hasIntelligence,
            signalStrength: Math.random() * 100
        });
        updateStarStatus(index, 'scanned');
    });
    log('DEV: All stars marked as scanned', 'highlight');
}

function devMarkAllAnalyzed() {
    devMarkAllScanned();
    gameState.stars.forEach((star, index) => {
        gameState.analyzedStars.add(index);
        updateStarStatus(index, 'analyzed');
    });
    saveProgress();
    log('DEV: All stars marked as analyzed', 'highlight');
}

function devTriggerContact() {
    // Find a star with intelligence that hasn't been contacted
    const intelligentStars = gameState.stars.filter(s => s.hasIntelligence);
    const uncontacted = intelligentStars.find(s => !gameState.contactedStars.has(s.id));

    if (uncontacted) {
        selectStar(uncontacted.id);
        gameState.analyzedStars.add(uncontacted.id);
        // Trigger contact sequence
        showView('starmap-view');
        setTimeout(() => {
            initiateContact(uncontacted);
        }, 500);
        log(`DEV: Triggering contact with ${uncontacted.name}`, 'highlight');
    } else {
        log('DEV: No uncontacted intelligent stars available', 'warning');
    }
}

function devResetProgress() {
    localStorage.removeItem('setiScannedSignals');
    localStorage.removeItem('setiAnalyzedStars');
    localStorage.removeItem('setiContactedStars');
    localStorage.removeItem('setiDiscoveredMessages');
    localStorage.removeItem('setiPlayerName');
    localStorage.removeItem('setiReadEmails');
    localStorage.removeItem('setiScanResults');
    gameState.scannedSignals.clear();
    gameState.analyzedStars.clear();
    gameState.contactedStars.clear();
    gameState.scanResults.clear();
    gameState.discoveredMessages = [];
    gameState.playerName = '';

    // Reset star status in UI
    document.querySelectorAll('.star-status').forEach(el => {
        el.dataset.status = '';
    });

    log('DEV: All progress reset', 'warning');
}

function devAddRandomMail() {
    addRandomMail();
    log('DEV: Added random email', 'highlight');
}

function devLogState() {
    console.log('=== GAME STATE ===');
    console.log('Player Name:', gameState.playerName);
    console.log('Current Star:', gameState.currentStar);
    console.log('Selected Star ID:', gameState.selectedStarId);
    console.log('Scanned Signals:', [...gameState.scannedSignals.keys()]);
    console.log('Analyzed Stars:', [...gameState.analyzedStars]);
    console.log('Contacted Stars:', [...gameState.contactedStars]);
    console.log('Mailbox Messages:', gameState.mailboxMessages.length);
    console.log('Unread Mail:', gameState.unreadMailCount);
    console.log('==================');
    log('DEV: State logged to console', 'highlight');
}

function devTriggerEndState() {
    console.log('devTriggerEndState called');
    console.log('Stars count:', gameState.stars.length);

    // Check if stars are initialized
    if (!gameState.stars || gameState.stars.length === 0) {
        console.error('Stars not initialized yet! Start the game first.');
        return;
    }

    // Mark all stars as analyzed for the report
    gameState.stars.forEach(star => {
        gameState.analyzedStars.add(star.id);
    });
    console.log('Analyzed stars:', gameState.analyzedStars.size);

    showFinalReport();
    log('DEV: Triggered end state', 'highlight');
}

// Expose dev functions to window for console access
window.devLogState = devLogState;
window.devTriggerEndState = devTriggerEndState;

// === END STATE FUNCTIONS ===

function checkForEndState() {
    // Check if all stars have been analyzed
    if (gameState.analyzedStars.size >= gameState.stars.length) {
        // Delay a bit to let the last analysis complete
        setTimeout(() => {
            showSurveyCompletePopup();
        }, 1500);
    }
}

function showSurveyCompletePopup() {
    // Calculate stats for the popup
    const contactCount = gameState.stars.filter(s => {
        const scanResult = gameState.scanResults.get(s.id);
        if (scanResult && scanResult.type === 'verified_signal') return true;
        if (gameState.analyzedStars.has(s.id) && s.hasIntelligence) return true;
        return false;
    }).length;

    const summaryText = contactCount > 0
        ? `${contactCount} VERIFIED CONTACT${contactCount > 1 ? 'S' : ''} DETECTED`
        : 'NO VERIFIED CONTACTS DETECTED';

    document.getElementById('survey-summary-text').textContent = summaryText;

    // Show the popup
    const popup = document.getElementById('survey-complete-popup');
    popup.style.display = 'flex';

    log('ALL TARGETS ANALYZED - SURVEY COMPLETE', 'highlight');
    playClick();
}

function showFinalReport() {
    console.log('showFinalReport called');

    // Stop all sounds
    stopNaturalPhenomenaSound();
    stopAlienSignalSound();
    stopStaticHiss();

    // Generate report content
    try {
        generateReportContent();
        console.log('Report content generated');
    } catch (e) {
        console.error('Error generating report:', e);
    }

    // Show the report view
    console.log('Showing report-view');
    showView('report-view');

    log('FINAL REPORT READY FOR SUBMISSION');
}

function generateReportContent() {
    const now = new Date();
    const reportDate = `1995-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Set header info
    document.getElementById('report-operator-name').textContent = gameState.playerName || 'UNKNOWN';
    document.getElementById('report-date').textContent = reportDate;
    document.getElementById('report-signature').textContent = gameState.playerName || 'UNKNOWN';

    // Survey summary
    const totalStars = gameState.stars.length;
    // Count contacts from analyzed stars that have intelligence OR from scanResults with verified_signal
    const contactCount = gameState.stars.filter(s => {
        const scanResult = gameState.scanResults.get(s.id);
        if (scanResult && scanResult.type === 'verified_signal') return true;
        if (gameState.analyzedStars.has(s.id) && s.hasIntelligence) return true;
        return false;
    }).length;
    const falsePositiveCount = gameState.stars.filter(s => s.isFalsePositive && gameState.analyzedStars.has(s.id)).length;
    const naturalCount = gameState.stars.filter(s =>
        !s.hasIntelligence && !s.isFalsePositive && gameState.analyzedStars.has(s.id)
    ).length;

    document.getElementById('report-survey-summary').innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>TOTAL TARGETS SURVEYED:</div><div style="color: #0ff;">${totalStars}</div>
            <div>VERIFIED CONTACTS:</div><div style="color: #f0f; text-shadow: 0 0 5px #f0f;">${contactCount}</div>
            <div>FALSE POSITIVES:</div><div style="color: #ff0;">${falsePositiveCount}</div>
            <div>NATURAL PHENOMENA:</div><div style="color: #0ff;">${naturalCount}</div>
        </div>
        <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #0f0;">
            SURVEY COMPLETION RATE: <span style="color: #0f0; font-size: 18px;">100%</span>
        </div>
    `;

    // Signal analysis log
    let signalLog = '';
    gameState.stars.forEach(star => {
        const scanResult = gameState.scanResults.get(star.id);
        let resultClass = '';
        let resultText = 'NO DATA';

        if (scanResult) {
            if (scanResult.type === 'verified_signal') {
                resultClass = 'contact';
                resultText = '★ VERIFIED EXTRASOLAR SIGNAL';
            } else if (scanResult.type === 'false_positive') {
                resultClass = 'false-positive';
                resultText = `FALSE POSITIVE - ${scanResult.source}`;
            } else if (scanResult.type === 'natural_phenomena') {
                resultClass = 'natural';
                resultText = `NATURAL - ${scanResult.phenomenonType}`;
            }
        } else if (gameState.analyzedStars.has(star.id)) {
            if (star.hasIntelligence) {
                resultClass = 'contact';
                resultText = '★ VERIFIED EXTRASOLAR SIGNAL';
            } else if (star.isFalsePositive) {
                resultClass = 'false-positive';
                resultText = 'FALSE POSITIVE - Terrestrial interference';
            } else {
                resultClass = 'natural';
                resultText = 'NATURAL PHENOMENA DETECTED';
            }
        }

        signalLog += `
            <div class="report-star-entry">
                <div class="report-star-name">${star.name}</div>
                <div class="report-star-result ${resultClass}">└─ ${resultText}</div>
            </div>
        `;
    });
    document.getElementById('report-signal-log').innerHTML = signalLog;

    // Classified section - alien contacts (only those actually analyzed/contacted)
    const contactedStars = gameState.stars.filter(s => {
        const scanResult = gameState.scanResults.get(s.id);
        if (scanResult && scanResult.type === 'verified_signal') return true;
        if (gameState.analyzedStars.has(s.id) && s.hasIntelligence) return true;
        return false;
    });
    let classifiedContent = '';

    if (contactCount > 0) {
        classifiedContent = `
            <div style="color: #f00; margin-bottom: 15px;">
                CONFIRMED CONTACT WITH ${contactCount} EXTRASOLAR INTELLIGENCE(S)
            </div>
        `;

        contactedStars.forEach(star => {
            const message = narrativeMessages.find(m => m.starIndex === star.id);
            // Handle both regular messages and image-based messages
            let messageText = 'Signal patterns indicate artificial origin.';
            if (message) {
                if (message.messages) {
                    messageText = message.messages.slice(0, 3).join('<br>');
                } else if (message.beforeImage) {
                    messageText = message.beforeImage.slice(0, 3).join('<br>');
                }
            }
            classifiedContent += `
                <div style="margin: 15px 0; padding: 10px; border: 1px solid #f00; background: rgba(100, 0, 0, 0.3);">
                    <div style="color: #ff0; font-size: 15px;">${star.name}</div>
                    <div style="color: #f00; font-size: 12px; margin-top: 5px;">SIGNAL ORIGIN: ${star.distance} LIGHT YEARS</div>
                    <div style="color: #fff; margin-top: 10px; font-size: 13px;">
                        ${messageText}
                    </div>
                </div>
            `;
        });

        classifiedContent += `
            <div style="margin-top: 20px; color: #ff0; font-style: italic;">
                ASSESSMENT: First contact protocols have been initiated. All data has been
                flagged for immediate review by COSMIC clearance personnel. This information
                is NOT to be disseminated outside authorized channels.
            </div>
        `;
    } else {
        classifiedContent = `
            <div style="color: #0f0;">
                NO VERIFIED EXTRASOLAR SIGNALS DETECTED DURING THIS SURVEY PERIOD.
            </div>
            <div style="margin-top: 10px; color: #666;">
                All anomalous readings were determined to be either natural cosmic phenomena
                or terrestrial interference. Continued monitoring recommended.
            </div>
        `;
    }
    document.getElementById('report-classified').innerHTML = classifiedContent;

    // Operator notes - narrative flavor
    const notesContent = generateOperatorNotes(contactCount, totalStars);
    document.getElementById('report-notes').textContent = notesContent;
}

function generateOperatorNotes(contactCount, totalStars) {
    const playerName = gameState.playerName || 'Operator';

    if (contactCount > 0) {
        return `I don't know what to write here. My hands are still shaking.

${totalStars} targets surveyed. ${contactCount} confirmed contact${contactCount > 1 ? 's' : ''}.

Something was here before us. Something that wanted to be found.

I keep replaying the signal analysis in my head. The patterns, the
structure... there's no mistaking it. This is intelligence. This is
communication. But it feels old. Older than it should be.

The implications are... I can't even begin to process them. Everything
changes now. Everything.

I need to step outside. I need to see the stars with my own eyes tonight.

- ${playerName}`;
    } else {
        return `Another shift complete. ${totalStars} targets surveyed, nothing definitive.

The cosmic background noise can play tricks on you after a while. Every
blip starts to look like a pattern. Every pattern starts to feel like
a message. But the math doesn't lie, and the protocols exist for a reason.

Still... there's something humbling about listening to the whispers of
the universe, even when no one whispers back. The silence itself is
information. The absence of contact doesn't mean absence of life.

We'll keep listening. We'll keep searching.

Maybe tomorrow.

- ${playerName}`;
    }
}

function submitReport() {
    playClick();
    log('TRANSMITTING REPORT TO COMMAND...', 'highlight');

    // Start fade to black
    const overlay = document.getElementById('fade-overlay');
    overlay.classList.add('active');

    // After fade, show end screen
    setTimeout(() => {
        showView('end-view');
        // Remove fade after view switch
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 500);
    }, 2500);
}

function restartGame() {
    playClick();

    // Start fade
    const overlay = document.getElementById('fade-overlay');
    overlay.classList.add('active');

    setTimeout(() => {
        // Clear all progress
        localStorage.clear();

        // Reload the page
        location.reload();
    }, 1000);
}

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
let machineSound = null;
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

// Play machine/alignment sound effect
function playMachineSound() {
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
function stopMachineSound() {
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

// Start continuous tuning tone (changes with signal quality)
function startTuningTone(quality) {
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
    "KAPTEYN-B", "TAU-CETI-E", "KEPLER-452B", "GLIESE-832C",
    "TOI-700D", "K2-18B", "KEPLER-1649C", "GJ-1061D", "LP-890-9C",
    // Weak signal stars (require dish array alignment)
    "LUYTEN-B", "BARNARD-B", "LACAILLE-9352C", "61-CYGNI-C",
    "EPSILON-INDI-B", "LALANDE-21185B", "GROOMBRIDGE-34B", "UV-CETI-B"
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
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,400K" },         // GLIESE-832C
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,480K" },         // TOI-700D
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,500K" },         // K2-18B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,240K" },         // KEPLER-1649C
    { type: "M-TYPE", class: "Red Dwarf", temp: "2,950K" },         // GJ-1061D
    { type: "M-TYPE", class: "Red Dwarf", temp: "2,850K" },         // LP-890-9C
    // Weak signal stars
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,200K" },         // LUYTEN-B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,100K" },         // BARNARD-B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,400K" },         // LACAILLE-9352C
    { type: "K-TYPE", class: "Orange Dwarf", temp: "4,450K" },      // 61-CYGNI-C
    { type: "K-TYPE", class: "Orange Dwarf", temp: "4,600K" },      // EPSILON-INDI-B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,350K" },         // LALANDE-21185B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,250K" },         // GROOMBRIDGE-34B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,050K" }          // UV-CETI-B
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
    "2014",     // GLIESE-832C
    "2020",     // TOI-700D
    "2015",     // K2-18B
    "2020",     // KEPLER-1649C
    "2020",     // GJ-1061D
    "2022",     // LP-890-9C
    // Weak signal stars
    "2024",     // LUYTEN-B
    "2018",     // BARNARD-B
    "2023",     // LACAILLE-9352C
    "2022",     // 61-CYGNI-C
    "2019",     // EPSILON-INDI-B
    "2021",     // LALANDE-21185B
    "2025",     // GROOMBRIDGE-34B
    "2024"      // UV-CETI-B
];

// Real astronomical coordinates (RA in hours/min/sec, DEC in degrees/min/sec)
const starCoordinates = [
    { ra: { h: 14, m: 39, s: 36 }, dec: { deg: -60, m: 50, s: 2 } },   // ALPHA-CENTAURI
    { ra: { h: 14, m: 29, s: 43 }, dec: { deg: -62, m: 40, s: 46 } },  // PROXIMA-B
    { ra: { h: 4, m: 52, s: 54 }, dec: { deg: 58, m: 51, s: 8 } },     // KEPLER-442
    { ra: { h: 23, m: 6, s: 30 }, dec: { deg: -5, m: 2, s: 29 } },     // TRAPPIST-1E
    { ra: { h: 17, m: 18, s: 57 }, dec: { deg: -34, m: 59, s: 23 } },  // GLIESE-667C
    { ra: { h: 5, m: 54, s: 4 }, dec: { deg: -60, m: 1, s: 24 } },     // HD-40307G
    { ra: { h: 18, m: 52, s: 51 }, dec: { deg: 45, m: 20, s: 59 } },   // KEPLER-62F
    { ra: { h: 11, m: 47, s: 44 }, dec: { deg: 0, m: 48, s: 16 } },    // ROSS-128B
    { ra: { h: 16, m: 30, s: 18 }, dec: { deg: -12, m: 39, s: 45 } },  // WOLF-1061C
    { ra: { h: 0, m: 44, s: 59 }, dec: { deg: -15, m: 16, s: 17 } },   // LHS-1140B
    { ra: { h: 19, m: 54, s: 36 }, dec: { deg: 43, m: 57, s: 18 } },   // KEPLER-186F
    { ra: { h: 2, m: 53, s: 1 }, dec: { deg: 16, m: 52, s: 53 } },     // TEEGARDEN-B
    { ra: { h: 5, m: 11, s: 41 }, dec: { deg: -45, m: 1, s: 6 } },     // KAPTEYN-B
    { ra: { h: 1, m: 44, s: 4 }, dec: { deg: -15, m: 56, s: 15 } },    // TAU-CETI-E
    { ra: { h: 19, m: 44, s: 1 }, dec: { deg: 44, m: 16, s: 39 } },    // KEPLER-452B
    { ra: { h: 21, m: 33, s: 34 }, dec: { deg: -49, m: 0, s: 32 } },   // GLIESE-832C
    { ra: { h: 6, m: 28, s: 23 }, dec: { deg: -65, m: 34, s: 46 } },   // TOI-700D
    { ra: { h: 11, m: 30, s: 14 }, dec: { deg: 7, m: 35, s: 18 } },    // K2-18B
    { ra: { h: 19, m: 30, s: 1 }, dec: { deg: 41, m: 49, s: 50 } },    // KEPLER-1649C
    { ra: { h: 3, m: 36, s: 0 }, dec: { deg: -44, m: 30, s: 45 } },    // GJ-1061D
    { ra: { h: 7, m: 35, s: 32 }, dec: { deg: -83, m: 7, s: 30 } },    // LP-890-9C
    // Weak signal stars
    { ra: { h: 7, m: 27, s: 24 }, dec: { deg: 5, m: 13, s: 33 } },     // LUYTEN-B
    { ra: { h: 17, m: 57, s: 48 }, dec: { deg: 4, m: 41, s: 36 } },    // BARNARD-B
    { ra: { h: 23, m: 5, s: 52 }, dec: { deg: -35, m: 51, s: 11 } },   // LACAILLE-9352C
    { ra: { h: 21, m: 6, s: 54 }, dec: { deg: 38, m: 44, s: 58 } },    // 61-CYGNI-C
    { ra: { h: 22, m: 3, s: 22 }, dec: { deg: -56, m: 47, s: 10 } },   // EPSILON-INDI-B
    { ra: { h: 11, m: 3, s: 20 }, dec: { deg: 35, m: 58, s: 12 } },    // LALANDE-21185B
    { ra: { h: 0, m: 18, s: 23 }, dec: { deg: 44, m: 1, s: 23 } },     // GROOMBRIDGE-34B
    { ra: { h: 1, m: 39, s: 1 }, dec: { deg: -17, m: 57, s: 1 } }      // UV-CETI-B
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
    initDevMode(); // Initialize developer mode

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
            size: Math.random() * 1.5 + 0.5,
            brightness: Math.floor(Math.random() * 80 + 175), // 175-255 range
            alpha: Math.random() * 0.4 + 0.3, // 0.3-0.7 range
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

    // False positive star indices (show promising signal but turn out to be terrestrial)
    const falsePositiveIndices = [4, 9, 14, 18, 24, 27, 28]; // GLIESE-667C, LHS-1140B, TAU-CETI-E, GJ-1061D, 61-CYGNI-C, GROOMBRIDGE-34B, UV-CETI-B

    // Weak signal stars (require dish array alignment with power budget)
    // Dish power costs: C=2, 1=1, 2=3, 3=1, 4=3, 5=2, 6=2 (total 14)
    // Players must select dishes that meet power requirement without exceeding budget
    const weakSignalConfig = {
        21: { requiredPower: 5 },   // LUYTEN-B (alien intelligence) - easy
        22: { requiredPower: 4 },   // BARNARD-B (natural - pulsar) - easy
        23: { requiredPower: 8 },   // LACAILLE-9352C (natural - magnetar) - medium
        24: { requiredPower: 6 },   // 61-CYGNI-C (false positive) - easy
        25: { requiredPower: 11 },  // EPSILON-INDI-B (alien intelligence) - hard
        26: { requiredPower: 7 },   // LALANDE-21185B (natural - quasar) - medium
        27: { requiredPower: 9 },   // GROOMBRIDGE-34B (false positive) - medium
        28: { requiredPower: 5 }    // UV-CETI-B (false positive) - easy
    };

    // First, create all star objects
    starNames.forEach((name, index) => {
        const distance = Math.floor(Math.random() * 500) + 10;
        const ra = Math.floor(Math.random() * 24) + ':' +
                   String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const dec = (Math.random() > 0.5 ? '+' : '-') +
                    String(Math.floor(Math.random() * 90)).padStart(2, '0') + '°';

        const starInfo = starTypes[index];
        const isWeakSignal = weakSignalConfig.hasOwnProperty(index);

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
            isFalsePositive: falsePositiveIndices.includes(index),
            signalStrength: isWeakSignal ? 'weak' : 'normal',
            requiredPower: isWeakSignal ? weakSignalConfig[index].requiredPower : 0,
            x: Math.random() * 940 + 30, // Position for visual map (30-970)
            y: Math.random() * 500 + 25  // Position for visual map (25-525)
        };

        gameState.stars.push(star);
    });

    // Create shuffled display order
    const displayOrder = [...Array(starNames.length).keys()];
    for (let i = displayOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [displayOrder[i], displayOrder[j]] = [displayOrder[j], displayOrder[i]];
    }

    // Create DOM elements in shuffled order
    displayOrder.forEach(index => {
        const star = gameState.stars[index];

        const starElement = document.createElement('div');
        starElement.className = 'star-item';
        starElement.dataset.starId = index;

        starElement.innerHTML = `
            <div class="star-name">${star.name}</div>
            <div class="star-coords">${star.coordinates}</div>
            <div class="star-coords">${star.distance} ly</div>
            <div class="star-status" data-status=""></div>
        `;

        starElement.addEventListener('click', () => selectStar(index));
        starGrid.appendChild(starElement);
    });

    log(`Stellar catalog loaded: ${starNames.length} targets available`);
}

// Draw star visualization
function drawStarVisualization(star, canvasId = 'star-visual') {
    const canvas = document.getElementById(canvasId);
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
    const scanResult = gameState.scanResults.get(starId);

    // Build status indicator with scan result details
    let statusBadge = '';
    if (hasContact) {
        statusBadge = '<div style="color: #f0f; text-shadow: 0 0 5px #f0f; margin-top: 12px; padding-top: 12px; border-top: 2px solid #0f0; font-size: 14px;">★ CONTACT ESTABLISHED</div>';
    } else if (scanResult) {
        // Show detailed scan result
        if (scanResult.type === 'false_positive') {
            statusBadge = `<div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #f00;">
                <div style="color: #f00; text-shadow: 0 0 5px #f00; font-size: 14px;">⚠ FALSE POSITIVE</div>
                <div style="color: #ff0; font-size: 12px; margin-top: 8px;">Source:</div>
                <div style="color: #ff0; font-size: 11px;">${scanResult.source}</div>
            </div>`;
        } else if (scanResult.type === 'natural') {
            statusBadge = `<div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #0ff;">
                <div style="color: #0ff; text-shadow: 0 0 5px #0ff; font-size: 14px;">✓ NATURAL PHENOMENON</div>
                <div style="color: #0f0; font-size: 12px; margin-top: 8px;">${scanResult.phenomenonType}</div>
                <div style="color: #0f0; font-size: 11px;">${scanResult.source}</div>
            </div>`;
        } else if (scanResult.type === 'verified_signal') {
            statusBadge = `<div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #f0f;">
                <div style="color: #f0f; text-shadow: 0 0 5px #f0f; font-size: 14px;">★ VERIFIED SIGNAL</div>
                <div style="color: #ff0; font-size: 12px; margin-top: 8px;">EXTRASOLAR ORIGIN</div>
            </div>`;
        }
    } else if (isAnalyzed) {
        statusBadge = '<div style="color: #ff0; text-shadow: 0 0 5px #ff0; margin-top: 12px; padding-top: 12px; border-top: 2px solid #0f0; font-size: 14px;">✓ ANALYZED</div>';
    } else if (isScanned) {
        statusBadge = '<div style="color: #0ff; text-shadow: 0 0 5px #0ff; margin-top: 12px; padding-top: 12px; border-top: 2px solid #0f0; font-size: 14px;">SCANNED</div>';
    }

    // Update star info title with star name
    const starInfoTitle = document.querySelector('.star-info-title');
    starInfoTitle.textContent = star.name;

    // Add weak signal warning if applicable
    let weakSignalWarning = '';
    if (star.signalStrength === 'weak') {
        weakSignalWarning = `
            <div class="weak-signal-warning" style="margin-top: 12px; padding: 10px; border: 2px solid #ffa500; background: rgba(255, 165, 0, 0.1); animation: warningPulse 1.5s ease-in-out infinite;">
                <div style="color: #ffa500; text-shadow: 0 0 5px #ffa500; font-size: 14px; text-align: center;">⚠ WEAK SIGNAL DETECTED ⚠</div>
                <div style="color: #ffa500; font-size: 11px; margin-top: 8px; text-align: center;">
                    DISH ARRAY ALIGNMENT REQUIRED<br>
                    ENTER CODE TO ALIGN DISHES
                </div>
                <div style="color: #0ff; font-size: 10px; margin-top: 6px; text-align: center;">
                    Use keypad in [ARRAY STATUS] panel
                </div>
            </div>`;
    }

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
        ${weakSignalWarning}
        ${statusBadge}
    `;

    // Draw star visualization
    drawStarVisualization(star);

    // Show/hide array button for weak signal stars (if it exists)
    const arrayBtn = document.getElementById('array-status-btn');
    if (star.signalStrength === 'weak') {
        if (arrayBtn) arrayBtn.style.display = 'inline-block';
        // Only reset array if this is a different target star
        if (!gameState.dishArray.currentTargetStar || gameState.dishArray.currentTargetStar.id !== star.id) {
            setArrayTarget(star);
        } else {
            // Same star selected again - just update the display
            renderStarmapArray();
            updateStarmapArrayStats();
        }
    } else {
        if (arrayBtn) arrayBtn.style.display = 'none';
        // Clear array target when selecting non-weak signal star
        if (gameState.dishArray.currentTargetStar) {
            gameState.dishArray.currentTargetStar = null;
            gameState.dishArray.requiredPower = 0;
            renderStarmapArray();
            updateStarmapArrayStats();
        }
    }

    log(`Target acquired: ${star.name}`);
    log(`Coordinates: ${star.coordinates}, Distance: ${star.distance} ly`);
    log(`Star Type: ${star.starType} (${star.starClass}), Temperature: ${star.temperature}`);
    if (star.signalStrength === 'weak') {
        log(`WEAK SIGNAL - Array alignment required`, 'warning');
    }
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

    // Draw star visualization in analysis view
    drawStarVisualization(star, 'analysis-star-visual');

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
        gameState.scanResults.clear();
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
        stopStaticHiss();

        // Switch back to background music when returning to map
        switchToBackgroundMusic();

        showView('starmap-view');
        log('Returned to stellar catalog');

        // Check if all stars have been analyzed
        checkForEndState();
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
        stopStaticHiss();

        // Switch back to background music when returning to map
        switchToBackgroundMusic();

        showView('starmap-view');
        log('Continuing search for additional signals...');

        // Check if all stars have been analyzed
        checkForEndState();
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

    // Layout toggle
    document.getElementById('layout-toggle-btn').addEventListener('click', () => {
        playClick();
        toggleLayoutMode();
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

    // Dish Array event listeners
    const arrayStatusBtn = document.getElementById('array-status-btn');
    if (arrayStatusBtn) {
        arrayStatusBtn.addEventListener('click', () => {
            playClick();
            gameState.previousView = 'starmap-view';
            showView('array-view');
        });
    }

    const alignAllBtn = document.getElementById('align-all-btn');
    if (alignAllBtn) {
        alignAllBtn.addEventListener('click', () => {
            playClick();
            alignAllDishes();
        });
    }

    const resetArrayBtn = document.getElementById('reset-array-btn');
    if (resetArrayBtn) {
        resetArrayBtn.addEventListener('click', () => {
            playClick();
            resetArray();
        });
    }

    const arrayBackBtn = document.getElementById('array-back-btn');
    if (arrayBackBtn) {
        arrayBackBtn.addEventListener('click', () => {
            playClick();
            showView(gameState.previousView || 'starmap-view');
        });
    }

    const arrayScanBtn = document.getElementById('array-scan-btn');
    if (arrayScanBtn) {
        arrayScanBtn.addEventListener('click', () => {
            playClick();
            // Go directly to scan from array view
            initiateScan();
        });
    }

    // Starmap array scan button (on left panel)
    const starmapArrayScanBtn = document.getElementById('starmap-array-scan-btn');
    if (starmapArrayScanBtn) {
        starmapArrayScanBtn.addEventListener('click', () => {
            playClick();
            // Go directly to scan from starmap view
            initiateScan();
        });
    }

    // End state event listeners
    const submitReportBtn = document.getElementById('submit-report-btn');
    if (submitReportBtn) {
        submitReportBtn.addEventListener('click', submitReport);
    }

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
    }

    // Survey complete popup button
    const surveySubmitBtn = document.getElementById('survey-submit-btn');
    if (surveySubmitBtn) {
        surveySubmitBtn.addEventListener('click', () => {
            playClick();
            document.getElementById('survey-complete-popup').style.display = 'none';
            showFinalReport();
        });
    }

    // Keypad event listeners for alignment code input
    const keypadBtns = document.querySelectorAll('.keypad-btn');
    keypadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            handleKeypadPress(key);
        });
    });

    // BEGIN ALIGNMENT button event listener
    const beginAlignmentBtn = document.getElementById('begin-alignment-btn');
    if (beginAlignmentBtn) {
        beginAlignmentBtn.addEventListener('click', () => {
            playClick();
            // Start the alignment animation
            const code = gameState.dishArray.alignmentCode;
            alignDishesFromCode(code);
        });
    }
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

    // Update target info in analysis view
    document.getElementById('target-name').textContent = star.name;
    document.getElementById('target-coords').textContent = star.coordinates;
    document.getElementById('target-distance').textContent = star.distance;
    document.getElementById('target-type').textContent = star.starType;
    document.getElementById('target-class').textContent = star.starClass;
    document.getElementById('target-temp').textContent = star.temperature;

    // Draw star visualization in analysis view
    drawStarVisualization(star, 'analysis-star-visual');

    // Switch to analysis view where the tuning game is located
    showView('analysis-view');

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

// Show verification prompt before contact
function showVerifyPrompt(star) {
    const contactBox = document.getElementById('contact-protocol-box');
    const contactContent = document.getElementById('contact-protocol-content');

    contactBox.style.display = 'block';
    contactContent.innerHTML = '';

    // Add the verification message
    const message = document.createElement('p');
    message.textContent = 'ANOMALOUS SIGNAL REQUIRES VERIFICATION';
    message.style.cssText = 'color: #ff0; text-shadow: 0 0 5px #ff0; font-size: 18px; margin-top: 10px;';
    contactContent.appendChild(message);

    const subMessage = document.createElement('p');
    subMessage.textContent = 'Rule out terrestrial and known sources?';
    subMessage.style.cssText = 'color: #0f0; font-size: 16px; margin-top: 10px;';
    contactContent.appendChild(subMessage);

    // VERIFY button
    const verifyBtn = document.createElement('button');
    verifyBtn.textContent = 'VERIFY SOURCE';
    verifyBtn.className = 'btn';
    verifyBtn.style.cssText = 'background: rgba(0, 255, 255, 0.1); border: 2px solid #0ff; color: #0ff; margin-top: 15px; padding: 10px 30px; font-size: 18px; animation: pulse 2s infinite;';
    verifyBtn.addEventListener('click', () => {
        playClick();
        runVerificationSequence(star);
    });

    contactContent.appendChild(verifyBtn);
}

// Run the verification sequence animation
function runVerificationSequence(star) {
    const contactBox = document.getElementById('contact-protocol-box');
    const contactContent = document.getElementById('contact-protocol-content');

    contactContent.innerHTML = '';

    // Create verification display
    const verifyDisplay = document.createElement('div');
    verifyDisplay.style.cssText = 'text-align: left; font-size: 14px; line-height: 1.8;';
    contactContent.appendChild(verifyDisplay);

    // False positive sources
    const falsePositiveSources = [
        { source: 'GPS SATELLITE CONSTELLATION', result: 'NEGATIVE' },
        { source: 'STARLINK NETWORK', result: 'NEGATIVE' },
        { source: 'CLASSIFIED MILITARY SATELLITE (NRO-L37)', result: 'MATCH DETECTED', isCause: true },
        { source: 'LUNAR SIGNAL BOUNCE', result: 'NEGATIVE' },
    ];

    const falsePositiveSources2 = [
        { source: 'TERRESTRIAL RFI SOURCES', result: 'NEGATIVE' },
        { source: 'COMMERCIAL BROADCAST SATELLITES', result: 'NEGATIVE' },
        { source: 'AIRCRAFT TRANSPONDERS', result: 'NEGATIVE' },
        { source: 'LUNAR SURFACE REFLECTION', result: 'CORRELATION DETECTED', isCause: true },
    ];

    const falsePositiveSources3 = [
        { source: 'GPS SATELLITE CONSTELLATION', result: 'NEGATIVE' },
        { source: 'WEATHER SATELLITE NETWORK', result: 'NEGATIVE' },
        { source: 'ISS COMMUNICATIONS', result: 'NEGATIVE' },
        { source: 'DEEP SPACE NETWORK ECHO', result: 'MATCH DETECTED', isCause: true },
    ];

    const falsePositiveSources4 = [
        { source: 'MILITARY UHF SATELLITES', result: 'NEGATIVE' },
        { source: 'AMATEUR RADIO BOUNCE', result: 'NEGATIVE' },
        { source: 'STARLINK CONSTELLATION', result: 'NEGATIVE' },
        { source: 'CLASSIFIED GOV TRANSMISSION', result: 'SIGNATURE MATCH', isCause: true },
    ];

    // Real signal checks (all negative)
    const realSignalChecks = [
        { source: 'GPS SATELLITE CONSTELLATION', result: 'NEGATIVE' },
        { source: 'MILITARY SATELLITE NETWORK', result: 'NEGATIVE' },
        { source: 'COMMERCIAL BROADCAST SATELLITES', result: 'NEGATIVE' },
        { source: 'STARLINK/ONEWEB CONSTELLATION', result: 'NEGATIVE' },
        { source: 'TERRESTRIAL RFI SOURCES', result: 'NEGATIVE' },
        { source: 'LUNAR SIGNAL BOUNCE', result: 'NEGATIVE' },
        { source: 'AIRCRAFT/SHIP TRANSPONDERS', result: 'NEGATIVE' },
        { source: 'DEEP SPACE NETWORK', result: 'NEGATIVE' },
        { source: 'CLASSIFIED GOVERNMENT ASSETS', result: 'NEGATIVE' },
        { source: 'KNOWN PULSAR DATABASE', result: 'NO MATCH' },
    ];

    // Choose which checks to run
    let checks;
    let isFalsePositive = star.isFalsePositive;

    if (isFalsePositive) {
        // Randomly select one of the false positive scenarios
        const scenarios = [falsePositiveSources, falsePositiveSources2, falsePositiveSources3, falsePositiveSources4];
        checks = scenarios[Math.floor(Math.random() * scenarios.length)];
    } else {
        checks = realSignalChecks;
    }

    let checkIndex = 0;

    function runNextCheck() {
        if (checkIndex < checks.length) {
            const check = checks[checkIndex];

            const checkLine = document.createElement('div');
            checkLine.innerHTML = `<span style="color: #0ff;">▶</span> Checking: ${check.source}...`;
            verifyDisplay.appendChild(checkLine);
            playTypingSound();

            setTimeout(() => {
                // Update with result
                const resultColor = check.isCause ? '#f00' : (check.result === 'NEGATIVE' || check.result === 'NO MATCH' ? '#0f0' : '#ff0');
                checkLine.innerHTML = `<span style="color: #0ff;">▶</span> ${check.source}: <span style="color: ${resultColor};">${check.result}</span>`;

                if (check.isCause) {
                    playSecurityBeep('error');
                } else {
                    playTypingSound();
                }

                checkIndex++;

                // If this was the cause, stop and show false positive result
                if (check.isCause) {
                    setTimeout(() => showFalsePositiveResult(star, check, verifyDisplay), 1000);
                } else {
                    setTimeout(runNextCheck, 400);
                }
            }, 600);
        } else {
            // All checks passed - it's a real signal!
            setTimeout(() => showVerifiedSignalResult(star, verifyDisplay), 1000);
        }
    }

    // Start the sequence
    const header = document.createElement('div');
    header.innerHTML = '<span style="color: #ff0;">═══ SOURCE VERIFICATION ═══</span>';
    header.style.cssText = 'margin-bottom: 15px; text-align: center; font-size: 16px;';
    verifyDisplay.appendChild(header);

    setTimeout(runNextCheck, 500);
}

// Show false positive result
function showFalsePositiveResult(star, cause, display) {
    // Store scan result for target info display
    gameState.scanResults.set(star.id, {
        type: 'false_positive',
        source: cause.source
    });

    const resultDiv = document.createElement('div');
    resultDiv.style.cssText = 'margin-top: 20px; padding: 15px; border: 2px solid #f00; background: rgba(255, 0, 0, 0.1);';

    resultDiv.innerHTML = `
        <div style="color: #f00; font-size: 18px; text-shadow: 0 0 5px #f00; margin-bottom: 10px;">
            ⚠ FALSE POSITIVE IDENTIFIED ⚠
        </div>
        <div style="color: #ff0; font-size: 14px;">
            Signal source: ${cause.source}<br>
            Classification: TERRESTRIAL/KNOWN SOURCE<br><br>
            <span style="color: #0f0;">Signal logged for calibration purposes.</span>
        </div>
    `;

    display.appendChild(resultDiv);

    // Switch back to background music
    switchToBackgroundMusic();
    stopAlienSignalSound();

    // Add return button
    setTimeout(() => {
        const returnBtn = document.createElement('button');
        returnBtn.textContent = 'RETURN TO ARRAY';
        returnBtn.className = 'btn';
        returnBtn.style.cssText = 'margin-top: 15px; background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0; color: #0f0;';
        returnBtn.addEventListener('click', () => {
            playClick();
            document.getElementById('contact-protocol-box').style.display = 'none';
            document.getElementById('analyze-btn').disabled = false;
            showView('starmap-view');
            log(`False positive from ${star.name} - Source: ${cause.source}`);
        });
        display.appendChild(returnBtn);
    }, 1000);
}

// Show verified signal result (real alien signal)
function showVerifiedSignalResult(star, display) {
    // Store scan result for target info display
    gameState.scanResults.set(star.id, {
        type: 'verified_signal'
    });

    const resultDiv = document.createElement('div');
    resultDiv.style.cssText = 'margin-top: 20px; padding: 15px; border: 2px solid #f0f; background: rgba(255, 0, 255, 0.1);';

    resultDiv.innerHTML = `
        <div style="color: #f0f; font-size: 18px; text-shadow: 0 0 10px #f0f; margin-bottom: 10px;">
            ★ SIGNAL VERIFIED ★
        </div>
        <div style="color: #0ff; font-size: 14px;">
            All known sources ruled out<br>
            Origin: EXTRASOLAR<br>
            Distance: ${star.distance} light years<br><br>
            <span style="color: #ff0; text-shadow: 0 0 5px #ff0;">SIGNAL IS OF UNKNOWN ORIGIN</span>
        </div>
    `;

    display.appendChild(resultDiv);

    playSecurityBeep('success');

    // Add contact protocol prompt directly to the same display
    setTimeout(() => {
        const contactDiv = document.createElement('div');
        contactDiv.style.cssText = 'margin-top: 20px; text-align: center;';

        // Add the question
        const question = document.createElement('p');
        question.textContent = 'INITIATE CONTACT PROTOCOL?';
        question.style.cssText = 'color: #f0f; text-shadow: 0 0 5px #f0f; font-size: 18px; margin-bottom: 15px;';
        contactDiv.appendChild(question);

        // Add button container
        const buttonContainer = document.createElement('div');

        // YES button
        const yesBtn = document.createElement('button');
        yesBtn.textContent = 'YES';
        yesBtn.className = 'btn';
        yesBtn.style.cssText = 'background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0; color: #0f0; margin: 5px; padding: 8px 20px;';
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
        noBtn.style.cssText = 'background: rgba(255, 0, 0, 0.1); border: 2px solid #f00; color: #f00; margin: 5px; padding: 8px 20px;';
        noBtn.addEventListener('click', () => {
            playClick();
            buttonContainer.remove();
            question.textContent = '[CONTACT PROTOCOL ABORTED]';
            question.style.cssText = 'color: #f00; text-shadow: 0 0 5px #f00; font-size: 16px;';
            log('Contact protocol aborted by operator');
            document.getElementById('analyze-btn').disabled = false;
        });

        buttonContainer.appendChild(yesBtn);
        buttonContainer.appendChild(noBtn);
        contactDiv.appendChild(buttonContainer);
        display.appendChild(contactDiv);
    }, 1500);
}

// Initiate contact
function initiateContact(star) {
    log('='.repeat(50), 'highlight');
    log('CONTACT PROTOCOL INITIATED', 'highlight');
    log('='.repeat(50), 'highlight');

    // Play special contact sound
    playContactSound();

    // Check if this is the first contact - send special email
    const isFirstContact = gameState.contactedStars.size === 0;

    gameState.contactedStars.add(star.id);
    updateStarStatus(star.id, 'contact');

    // Send classified email on first contact
    if (isFirstContact) {
        setTimeout(() => {
            sendFirstContactEmail();
        }, 5000); // Delay to let the contact sequence play out
    }

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

    // Parallax state
    let parallaxResetTimer = null;
    let lastMouseX = null;
    let lastMouseY = null;

    // Mouse move for parallax effect - uses delta (movement) not absolute position
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Clear any pending reset timer
        if (parallaxResetTimer) {
            clearTimeout(parallaxResetTimer);
            parallaxResetTimer = null;
        }

        // If we have a previous position, calculate delta and apply it
        if (lastMouseX !== null && lastMouseY !== null) {
            const deltaX = (x - lastMouseX) / canvas.width * 2;
            const deltaY = (y - lastMouseY) / canvas.height * 2;

            // Apply delta to target, clamped to -1 to 1 range
            gameState.targetMouseX = Math.max(-1, Math.min(1, gameState.targetMouseX + deltaX));
            gameState.targetMouseY = Math.max(-1, Math.min(1, gameState.targetMouseY + deltaY));
        }

        // Store current position for next frame
        lastMouseX = x;
        lastMouseY = y;
    });

    // Start reset timer when mouse leaves (5 second delay)
    canvas.addEventListener('mouseleave', () => {
        lastMouseX = null;
        lastMouseY = null;
        parallaxResetTimer = setTimeout(() => {
            gameState.targetMouseX = 0;
            gameState.targetMouseY = 0;
            parallaxResetTimer = null;
        }, 5000);
    });

    // Cancel reset timer if mouse enters again
    canvas.addEventListener('mouseenter', () => {
        if (parallaxResetTimer) {
            clearTimeout(parallaxResetTimer);
            parallaxResetTimer = null;
        }
        // lastMouseX/Y stay null until first mousemove, so no snap
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

        // "SCAN?" text with slow flash effect
        const flashAlpha = (Math.sin(Date.now() * 0.003) + 1) / 2 * 0.6 + 0.4; // Oscillates between 0.4 and 1.0
        ctx.font = '18px VT323';
        ctx.globalAlpha = flashAlpha;
        ctx.fillText('SCAN?', boxX + boxWidth / 2, boxY + 40);
        ctx.globalAlpha = 1;

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
    // Ensure audio context is initialized
    initAudio();

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

    // Show/hide array panel for weak signals
    const arrayPanel = document.getElementById('tuning-array-panel');
    if (star.signalStrength === 'weak') {
        arrayPanel.style.display = 'block';
        renderMiniDishArray();
    } else {
        arrayPanel.style.display = 'none';
    }

    // Set slider values to match starting positions
    document.getElementById('frequency-slider').value = gameState.currentFrequency;
    document.getElementById('gain-slider').value = gameState.currentGain;
    document.getElementById('frequency-value').textContent = gameState.currentFrequency.toString();
    document.getElementById('gain-value').textContent = gameState.currentGain.toString();

    // Start tuning feedback loop
    tuningFeedbackLoop();

    // Only start static hiss if signal is strong enough to tune
    // For weak signals, only start hiss if enough dishes are aligned
    if (star.signalStrength !== 'weak' || canTuneWeakSignal()) {
        startStaticHiss();
    }

    log('Signal tuning interface activated');
    if (star.signalStrength === 'weak') {
        log(`WEAK SIGNAL - Array alignment boosting signal`, 'warning');
    }
}

function tuningFeedbackLoop() {
    if (!gameState.tuningActive) return;

    const star = gameState.currentStar;
    const isWeakSignal = star && star.signalStrength === 'weak';

    // Check if weak signal has insufficient dishes
    if (isWeakSignal && !canTuneWeakSignal()) {
        // Block tuning - show warning
        const strengthFill = document.getElementById('signal-strength-fill');
        const strengthPercent = document.getElementById('signal-strength-percent');
        strengthFill.style.width = '0%';
        strengthFill.style.background = '#f00';
        strengthPercent.textContent = 'WEAK SIGNAL';
        strengthPercent.style.color = '#f00';

        // Stop static hiss when signal is too weak
        stopStaticHiss();

        // Update mini array display
        renderMiniDishArray();

        // Continue loop but don't process tuning
        requestAnimationFrame(tuningFeedbackLoop);
        return;
    }

    // If we just became able to tune (dishes aligned), start the hiss
    if (isWeakSignal && !staticNoiseNode) {
        startStaticHiss();
    }

    // Reset strength display color
    document.getElementById('signal-strength-percent').style.color = '';

    // Calculate how close the values are to target (0-1, where 1 is perfect)
    const freqDiff = Math.abs(gameState.currentFrequency - gameState.targetFrequency);
    const gainDiff = Math.abs(gameState.currentGain - gameState.targetGain);

    const tolerance = 5; // Values within 5 are considered "locked"
    const maxDiff = 100;

    // Calculate base signal quality (0-100%)
    const freqQuality = Math.max(0, 1 - (freqDiff / maxDiff));
    const gainQuality = Math.max(0, 1 - (gainDiff / maxDiff));
    let overallQuality = (freqQuality + gainQuality) / 2;

    // Apply dish array boost for weak signals
    if (isWeakSignal) {
        const boost = calculateSignalBoost();
        // Weak signals have reduced base quality (40%) that gets boosted
        const weakPenalty = 0.4;
        overallQuality = Math.min((overallQuality * weakPenalty) * boost, 1.0);

        // Update mini array display
        renderMiniDishArray();
    }

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

    // Check if locked (both values within tolerance AND quality high enough)
    const effectiveTolerance = isWeakSignal ? tolerance : tolerance;
    if (freqDiff <= effectiveTolerance && gainDiff <= effectiveTolerance && overallQuality >= 0.9) {
        gameState.lockDuration++;
        strengthFill.style.boxShadow = '0 0 20px #0f0';

        // Show locking progress
        const lockProgress = Math.floor((gameState.lockDuration / gameState.lockRequired) * 100);
        strengthPercent.textContent = `LOCKING... ${lockProgress}%`;
        strengthPercent.style.color = '#0f0';
        strengthFill.style.background = 'linear-gradient(90deg, #0f0, #0ff)';

        // Success! Complete the scan
        if (gameState.lockDuration >= gameState.lockRequired) {
            completeTuningScan(gameState.currentStar);
            return;
        }
    } else {
        gameState.lockDuration = 0;
        strengthFill.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
        strengthFill.style.background = '';
    }

    // Continue loop
    requestAnimationFrame(tuningFeedbackLoop);
}

function drawTuningWaveform(quality) {
    const waveCanvas = document.getElementById('waveform-canvas');
    if (!waveCanvas) {
        console.error('Waveform canvas not found');
        return;
    }
    const waveCtx = waveCanvas.getContext('2d');
    if (!waveCtx) {
        console.error('Could not get 2d context');
        return;
    }
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

    if (signal.hasIntelligence || star.isFalsePositive) {
        log('>>> ANOMALOUS PATTERN DETECTED <<<', 'highlight');
        log('POSSIBLE NON-NATURAL ORIGIN');

        // Switch to alien music and start alien signal sound
        switchToAlienMusic();
        startAlienSignalSound(star);

        const probability = star.isFalsePositive ?
            (78 + Math.random() * 15).toFixed(1) : // 78-93% for false positives
            (91 + Math.random() * 7).toFixed(1);   // 91-98% for real signals

        const lines = [
            'ANALYSIS COMPLETE',
            '════════════════════════════',
            { text: '⚠ NON-RANDOM PATTERN DETECTED ⚠', style: 'color: #ff0; text-shadow: 0 0 5px #ff0;' },
            'Signal exhibits structured modulation',
            'Frequency bands show intentional spacing',
            'Repeating sequences identified',
            '════════════════════════════',
            { text: `PROBABILITY OF INTELLIGENT ORIGIN: ${probability}%`, style: 'color: #ff0;' },
            '',
            { text: 'SOURCE VERIFICATION REQUIRED', style: 'color: #0ff;' }
        ];

        typeAnalysisText(lines, () => {
            // Show verification prompt instead of contact prompt
            showVerifyPrompt(star);
        });
    } else {
        log('Analysis complete: Natural stellar emissions');

        // Start natural phenomena sound
        startNaturalPhenomenaSound();

        // Variety of natural phenomena descriptions
        const naturalPhenomena = [
            {
                type: 'Pulsar radiation',
                source: 'Rotating neutron star',
                details: ['Regular periodic oscillations detected', 'Consistent with magnetar emissions']
            },
            {
                type: 'Solar flare activity',
                source: 'Stellar chromosphere',
                details: ['Irregular burst patterns detected', 'High-energy particle emissions']
            },
            {
                type: 'Magnetospheric emissions',
                source: 'Planetary magnetic field',
                details: ['Cyclotron radiation detected', 'Consistent with gas giant aurora']
            },
            {
                type: 'Quasar background noise',
                source: 'Distant active galactic nucleus',
                details: ['Broadband radio emissions', 'Redshifted spectrum detected']
            },
            {
                type: 'Stellar wind interference',
                source: 'Coronal mass ejection',
                details: ['Plasma wave modulation detected', 'Solar cycle correlation confirmed']
            },
            {
                type: 'Interstellar medium scatter',
                source: 'Ionized hydrogen cloud',
                details: ['Signal dispersion measured', 'Consistent with H-II region']
            },
            {
                type: 'Binary star oscillation',
                source: 'Eclipsing binary system',
                details: ['Periodic dimming pattern detected', 'Orbital mechanics confirmed']
            },
            {
                type: 'Brown dwarf emissions',
                source: 'Sub-stellar object',
                details: ['Low-frequency radio bursts', 'Atmospheric electrical activity']
            }
        ];

        const phenomenon = naturalPhenomena[Math.floor(Math.random() * naturalPhenomena.length)];

        // Store scan result for target info display
        gameState.scanResults.set(star.id, {
            type: 'natural',
            phenomenonType: phenomenon.type,
            source: phenomenon.source
        });

        const lines = [
            'ANALYSIS COMPLETE',
            '════════════════════════════',
            `Signal characteristics: ${phenomenon.type}`,
            `Source: ${phenomenon.source}`,
            phenomenon.details[0],
            phenomenon.details[1],
            '════════════════════════════',
            'CLASSIFICATION: NATURAL PHENOMENON'
        ];

        typeAnalysisText(lines, () => {
            document.getElementById('analyze-btn').disabled = false;
        });
    }
}

// ========================================
// DISH ARRAY SYSTEM
// ========================================

// Y-Configuration dish positions (VLA-style)
// Arms: North (200,40)-(200,180), SW (200,180)-(60,320), SE (200,180)-(340,320)
// Labels: C (center), 1-6 for other dishes
const DISH_POSITIONS = [
    { id: 0, x: 200, y: 180, label: 'C' },    // Center hub - at junction
    { id: 1, x: 200, y: 110, label: '1' },    // North arm - midpoint
    { id: 2, x: 200, y: 40, label: '2' },     // North arm - end
    { id: 3, x: 130, y: 250, label: '3' },    // SW arm - midpoint
    { id: 4, x: 60, y: 320, label: '4' },     // SW arm - end
    { id: 5, x: 270, y: 250, label: '5' },    // SE arm - midpoint
    { id: 6, x: 340, y: 320, label: '6' }     // SE arm - end
];

// Valid dish labels for alignment codes
const DISH_LABELS = ['C', '1', '2', '3', '4', '5', '6'];

function initDishArray() {
    // Initialize dishes - all start unaligned
    gameState.dishArray.dishes = DISH_POSITIONS.map((pos, index) => ({
        id: index,
        isAligned: false,
        isAligning: false,
        x: pos.x,
        y: pos.y,
        label: pos.label
    }));

    // Reset alignment code state
    gameState.dishArray.alignmentCode = '';
    gameState.dishArray.inputCode = '';
    gameState.dishArray.codeRequired = false;

    renderDishArray();
    renderStarmapArray();
    updateStarmapArrayStats();
}

// Generate a random alignment code (4-7 characters using dish labels)
function generateAlignmentCode() {
    const codeLength = 4 + Math.floor(Math.random() * 4); // 4-7 digits
    let code = '';
    const availableLabels = [...DISH_LABELS];

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * availableLabels.length);
        code += availableLabels[randomIndex];
        // Remove used label to avoid duplicates
        availableLabels.splice(randomIndex, 1);
    }

    return code;
}

// Handle keypad button press
function handleKeypadPress(key) {
    if (!gameState.dishArray.codeRequired) return;

    playClick();

    if (key === 'CLR') {
        // Clear input
        gameState.dishArray.inputCode = '';
        updateCodeDisplay();
        return;
    }

    // Add key to input (max length = alignment code length)
    const maxLength = gameState.dishArray.alignmentCode.length;
    if (gameState.dishArray.inputCode.length < maxLength) {
        gameState.dishArray.inputCode += key;
        updateCodeDisplay();

        // Check if code is complete
        if (gameState.dishArray.inputCode.length === maxLength) {
            validateAlignmentCode();
        }
    }
}

// Update the code input display
function updateCodeDisplay() {
    const inputEl = document.getElementById('array-code-input');
    if (!inputEl) return;

    const input = gameState.dishArray.inputCode;
    const maxLength = gameState.dishArray.alignmentCode.length;

    // Show input with underscores for remaining positions
    let display = input;
    for (let i = input.length; i < maxLength; i++) {
        display += '_';
    }

    inputEl.textContent = display;
    inputEl.className = 'array-code-input';
}

// Validate the entered alignment code
function validateAlignmentCode() {
    const inputEl = document.getElementById('array-code-input');
    const keypadEl = document.getElementById('array-keypad');
    const confirmedEl = document.getElementById('array-code-confirmed');
    const input = gameState.dishArray.inputCode;
    const code = gameState.dishArray.alignmentCode;

    if (input === code) {
        // Correct code!
        inputEl.className = 'array-code-input success';
        log('ALIGNMENT CODE ACCEPTED', 'highlight');
        playLockAchieved();

        // Hide keypad and code entry labels, show confirmation with BEGIN ALIGNMENT button
        if (keypadEl) keypadEl.style.display = 'none';

        // Hide the alignment code labels and display
        const codeLabels = document.querySelectorAll('#array-code-section .array-code-label');
        codeLabels.forEach(label => label.style.display = 'none');
        const codeDisplay = document.getElementById('array-code-display');
        if (codeDisplay) codeDisplay.style.display = 'none';
        if (inputEl) inputEl.style.display = 'none';

        if (confirmedEl) confirmedEl.style.display = 'block';
    } else {
        // Wrong code
        inputEl.className = 'array-code-input error';
        log('INVALID ALIGNMENT CODE', 'warning');
        playStaticBurst();

        // Clear input after a delay
        setTimeout(() => {
            gameState.dishArray.inputCode = '';
            updateCodeDisplay();
        }, 500);
    }
}

// Align dishes based on the code characters
function alignDishesFromCode(code) {
    const statusEl = document.getElementById('starmap-array-status');
    const confirmedEl = document.getElementById('array-code-confirmed');
    const codeSectionEl = document.getElementById('array-code-section');
    const aligningTextEl = document.getElementById('array-aligning-text');

    // Set flag to prevent button from showing during animation
    gameState.dishArray.alignmentInProgress = true;

    // Hide the confirmation section
    if (confirmedEl) confirmedEl.style.display = 'none';

    // Update status to show alignment in progress
    if (statusEl) {
        statusEl.textContent = 'ALIGNING DISHES...';
        statusEl.className = 'starmap-array-status';
    }

    // Show flashing "ALIGNING" text
    if (aligningTextEl) aligningTextEl.style.display = 'block';

    // Play machine sound
    playMachineSound();
    log('Initiating dish array alignment sequence...', 'highlight');

    // Animation lasts 8 seconds total - spread dishes evenly across this time
    const totalDuration = 8000;

    // Animate telemetry values during alignment
    animateTelemetryDuringAlignment(totalDuration);
    const delayPerDish = Math.floor(totalDuration / code.length);

    // Flash each dish in sequence
    let delay = 0;
    for (const char of code) {
        setTimeout(() => {
            // Find the dish with this label
            const dish = gameState.dishArray.dishes.find(d => d.label === char);
            if (dish) {
                dish.isAligning = true;
                renderStarmapArray();
                playClick();

                // After a brief flash, mark as aligned
                setTimeout(() => {
                    dish.isAligning = false;
                    dish.isAligned = true;
                    renderStarmapArray();
                    updateStarmapArrayStats();
                }, 500);
            }
        }, delay);
        delay += delayPerDish;
    }

    // After all dishes aligned (at 8 seconds), update status
    setTimeout(() => {
        stopMachineSound();

        // Hide the flashing text
        if (aligningTextEl) aligningTextEl.style.display = 'none';

        // Hide the entire code section since alignment is complete
        if (codeSectionEl) codeSectionEl.style.display = 'none';
        log('Dish array alignment complete', 'success');

        // Play acknowledgement sound after fade out completes
        setTimeout(() => {
            playLockAchieved();

            // Clear the flag so button can now appear
            gameState.dishArray.alignmentInProgress = false;

            // Show status and scan button together with the acknowledgement sound
            if (statusEl) {
                statusEl.textContent = 'ARRAY ALIGNED - READY FOR SCAN';
                statusEl.className = 'starmap-array-status ready';
            }
            updateArrayStatus();
            updateStarmapArrayStats();
        }, 1000);
    }, totalDuration);
}

// Set up alignment code for a weak signal star
function setupAlignmentCode(star) {
    // Generate new alignment code
    const code = generateAlignmentCode();
    gameState.dishArray.alignmentCode = code;
    gameState.dishArray.inputCode = '';
    gameState.dishArray.codeRequired = true;
    gameState.dishArray.currentTargetStar = star;

    // Reset all dishes
    gameState.dishArray.dishes.forEach(d => {
        d.isAligned = false;
        d.isAligning = false;
    });

    // Show code section and reset UI state
    const codeSection = document.getElementById('array-code-section');
    const codeDisplay = document.getElementById('array-code-display');
    const keypadEl = document.getElementById('array-keypad');
    const confirmedEl = document.getElementById('array-code-confirmed');
    const statusEl = document.getElementById('starmap-array-status');

    if (codeSection) codeSection.style.display = 'block';
    if (codeDisplay) {
        codeDisplay.textContent = code;
        codeDisplay.style.display = 'block';  // Show code display
    }
    if (keypadEl) keypadEl.style.display = 'grid';  // Show keypad
    if (confirmedEl) confirmedEl.style.display = 'none';  // Hide confirmation

    // Show code labels and input display
    const codeLabels = document.querySelectorAll('#array-code-section .array-code-label');
    codeLabels.forEach(label => label.style.display = 'block');
    const codeInput = document.getElementById('array-code-input');
    if (codeInput) codeInput.style.display = 'block';
    if (statusEl) {
        statusEl.textContent = 'ENTER ALIGNMENT CODE';
        statusEl.className = 'starmap-array-status';
    }

    updateCodeDisplay();
    renderStarmapArray();
    updateTelemetry(star);

    log(`Weak signal detected - alignment code required: ${code}`, 'warning');
}

// Clear alignment code (for non-weak signal stars)
function clearAlignmentCode() {
    gameState.dishArray.alignmentCode = '';
    gameState.dishArray.inputCode = '';
    gameState.dishArray.codeRequired = false;
    gameState.dishArray.currentTargetStar = null;

    // Reset all dishes
    gameState.dishArray.dishes.forEach(d => {
        d.isAligned = false;
        d.isAligning = false;
    });

    // Hide code section
    const codeSection = document.getElementById('array-code-section');
    const statusEl = document.getElementById('starmap-array-status');

    if (codeSection) codeSection.style.display = 'none';
    if (statusEl) {
        statusEl.textContent = 'SELECT WEAK SIGNAL TARGET';
        statusEl.className = 'starmap-array-status';
    }

    renderStarmapArray();
    resetTelemetry();
}

// Update telemetry display for a target star
function updateTelemetry(star) {
    const targetEl = document.getElementById('telem-target');
    const raEl = document.getElementById('telem-ra');
    const decEl = document.getElementById('telem-dec');
    const azEl = document.getElementById('telem-az');
    const elEl = document.getElementById('telem-el');
    const gainEl = document.getElementById('telem-gain');

    if (!star) {
        resetTelemetry();
        return;
    }

    // Find the star index to get real coordinates
    const starIndex = starNames.indexOf(star.name);
    let ra, dec;

    if (starIndex >= 0 && starCoordinates[starIndex]) {
        // Use real astronomical coordinates
        ra = starCoordinates[starIndex].ra;
        dec = starCoordinates[starIndex].dec;
    } else {
        // Fallback to generated coordinates if not found
        const hash = star.name.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
        ra = { h: Math.abs(hash % 24), m: Math.abs((hash >> 4) % 60), s: Math.abs((hash >> 8) % 60) };
        dec = { deg: (Math.abs(hash % 180) - 90), m: Math.abs((hash >> 6) % 60), s: Math.abs((hash >> 10) % 60) };
    }

    // Calculate azimuth/elevation based on RA/DEC (simplified approximation)
    // In reality this depends on observer location and time, but we simulate it
    const az = Math.abs((ra.h * 15 + ra.m / 4) % 360);
    const el = Math.max(0, Math.min(90, 90 - Math.abs(dec.deg)));

    if (targetEl) targetEl.textContent = star.name.substring(0, 12);
    if (raEl) raEl.textContent = `${ra.h.toString().padStart(2, '0')}h ${ra.m.toString().padStart(2, '0')}m ${ra.s.toString().padStart(2, '0')}s`;
    if (decEl) decEl.textContent = `${dec.deg >= 0 ? '+' : ''}${dec.deg}° ${Math.abs(dec.m)}' ${Math.abs(dec.s)}"`;
    if (azEl) azEl.textContent = `${Math.round(az)}°`;
    if (elEl) elEl.textContent = `${Math.round(el)}°`;
    if (gainEl) gainEl.textContent = '0.0dB';
}

// Animate telemetry during alignment
function animateTelemetryDuringAlignment(duration) {
    const azEl = document.getElementById('telem-az');
    const elEl = document.getElementById('telem-el');
    const gainEl = document.getElementById('telem-gain');

    // Add updating class for flicker effect
    [azEl, elEl, gainEl].forEach(el => {
        if (el) el.classList.add('updating');
    });

    // Start with current values and gradually change them
    const star = gameState.dishArray.currentTargetStar;
    if (!star) return;

    // Get real coordinates for this star
    const starIndex = starNames.indexOf(star.name);
    let targetAz, targetElev;

    if (starIndex >= 0 && starCoordinates[starIndex]) {
        const ra = starCoordinates[starIndex].ra;
        const dec = starCoordinates[starIndex].dec;
        targetAz = Math.abs((ra.h * 15 + ra.m / 4) % 360);
        targetElev = Math.max(0, Math.min(90, 90 - Math.abs(dec.deg)));
    } else {
        const hash = star.name.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
        targetAz = Math.abs(hash % 360);
        targetElev = Math.abs(hash % 90);
    }

    const alignedCount = gameState.dishArray.alignmentCode.length;

    let currentAz = targetAz + 30 + Math.random() * 20;
    let currentElevation = targetElev + 15 + Math.random() * 10;
    let currentGain = 0;

    const updateInterval = 200;
    const steps = duration / updateInterval;
    const azStep = (currentAz - targetAz) / steps;
    const elStep = (currentElevation - targetElev) / steps;
    const gainStep = (alignedCount * 2.5) / steps;

    const intervalId = setInterval(() => {
        currentAz -= azStep + (Math.random() - 0.5) * 2;
        currentElevation -= elStep + (Math.random() - 0.5) * 1;
        currentGain += gainStep;

        if (azEl) azEl.textContent = `${Math.round(currentAz)}°`;
        if (elEl) elEl.textContent = `${Math.round(currentElevation)}°`;
        if (gainEl) gainEl.textContent = `${currentGain.toFixed(1)}dB`;
    }, updateInterval);

    // Stop animation after duration
    setTimeout(() => {
        clearInterval(intervalId);
        [azEl, elEl, gainEl].forEach(el => {
            if (el) el.classList.remove('updating');
        });

        // Set final values
        if (azEl) azEl.textContent = `${targetAz}°`;
        if (elEl) elEl.textContent = `${targetElev}°`;
        if (gainEl) gainEl.textContent = `${(alignedCount * 2.5).toFixed(1)}dB`;
    }, duration);
}

// Reset telemetry to default values
function resetTelemetry() {
    const targetEl = document.getElementById('telem-target');
    const raEl = document.getElementById('telem-ra');
    const decEl = document.getElementById('telem-dec');
    const azEl = document.getElementById('telem-az');
    const elEl = document.getElementById('telem-el');
    const gainEl = document.getElementById('telem-gain');

    if (targetEl) targetEl.textContent = '--';
    if (raEl) raEl.textContent = '--h --m --s';
    if (decEl) decEl.textContent = "--° --' --\"";
    if (azEl) azEl.textContent = '---°';
    if (elEl) elEl.textContent = '--°';
    if (gainEl) gainEl.textContent = '0.0dB';
}

function renderDishArray() {
    const dishGroup = document.getElementById('dish-group');
    if (!dishGroup) return;

    dishGroup.innerHTML = '';

    gameState.dishArray.dishes.forEach(dish => {
        // Build class list based on dish state
        // Aligned state only when both powered AND aligned
        let classes = 'dish-element';
        if (dish.hasInterference) classes += ' interference';
        else if (dish.isRotating) classes += ' rotating';
        else if (dish.isAligned && dish.isPowered) classes += ' aligned';
        else if (dish.isPowered) classes += ' powered';

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', classes);
        g.setAttribute('data-dish-id', dish.id);
        g.setAttribute('transform', `translate(${dish.x}, ${dish.y})`);

        // Dish base (pedestal)
        const base = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        base.setAttribute('class', 'dish-base');
        base.setAttribute('x', -10);
        base.setAttribute('y', -5);
        base.setAttribute('width', 20);
        base.setAttribute('height', 25);
        base.setAttribute('rx', 3);

        // Dish bowl (parabolic antenna representation)
        const bowl = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        bowl.setAttribute('class', 'dish-bowl');
        bowl.setAttribute('cx', 0);
        bowl.setAttribute('cy', -18);
        bowl.setAttribute('rx', 22);
        bowl.setAttribute('ry', 10);

        // Label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('class', 'dish-label');
        label.setAttribute('y', 35);
        label.textContent = dish.label;

        // Power cost indicator
        const powerLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        powerLabel.setAttribute('class', 'dish-power-cost');
        powerLabel.setAttribute('y', 48);
        powerLabel.setAttribute('fill', dish.isPowered ? '#0ff' : '#666');
        powerLabel.setAttribute('font-size', '10');
        powerLabel.setAttribute('text-anchor', 'middle');
        powerLabel.textContent = `${dish.powerCost}⚡`;

        // Interference indicator (X mark)
        if (dish.hasInterference) {
            const x1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            x1.setAttribute('x1', -8);
            x1.setAttribute('y1', -25);
            x1.setAttribute('x2', 8);
            x1.setAttribute('y2', -10);
            x1.setAttribute('stroke', '#f00');
            x1.setAttribute('stroke-width', 3);
            g.appendChild(x1);

            const x2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            x2.setAttribute('x1', 8);
            x2.setAttribute('y1', -25);
            x2.setAttribute('x2', -8);
            x2.setAttribute('y2', -10);
            x2.setAttribute('stroke', '#f00');
            x2.setAttribute('stroke-width', 3);
            g.appendChild(x2);
        }

        g.appendChild(base);
        g.appendChild(bowl);
        g.appendChild(label);
        g.appendChild(powerLabel);

        // Click handler
        g.addEventListener('click', (e) => {
            // Right-click to power off (or shift-click)
            if (e.shiftKey && dish.isPowered && !dish.hasInterference) {
                powerOffDish(dish);
            } else {
                startDishRotation(dish.id);
            }
        });

        // Right-click context menu for power off
        g.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (dish.isPowered && !dish.hasInterference) {
                powerOffDish(dish);
            }
        });

        dishGroup.appendChild(g);
    });

    // Also render the starmap panel version
    renderStarmapArray();
}

// Render the compact array in the starmap view (left panel)
function renderStarmapArray() {
    const dishGroup = document.getElementById('starmap-dish-group');
    if (!dishGroup) return;

    dishGroup.innerHTML = '';

    // Scaled positions for the smaller SVG (200x200 viewBox)
    // Arms: North (100,20)-(100,90), SW (100,90)-(40,160), SE (100,90)-(160,160)
    const scaledPositions = [
        { x: 100, y: 90, label: 'C' },   // Center hub - at junction
        { x: 100, y: 55, label: '1' },   // North arm - midpoint
        { x: 100, y: 20, label: '2' },   // North arm - end
        { x: 70, y: 125, label: '3' },   // SW arm - midpoint
        { x: 40, y: 160, label: '4' },   // SW arm - end
        { x: 130, y: 125, label: '5' },  // SE arm - midpoint
        { x: 160, y: 160, label: '6' }   // SE arm - end
    ];

    gameState.dishArray.dishes.forEach((dish, index) => {
        const pos = scaledPositions[index];

        let classes = 'dish-element';
        if (dish.isAligning) classes += ' aligning';
        else if (dish.isAligned) classes += ' aligned';

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', classes);
        g.setAttribute('data-dish-id', dish.id);
        g.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);

        // Dish base (smaller)
        const base = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        base.setAttribute('class', 'dish-base');
        base.setAttribute('x', -6);
        base.setAttribute('y', -3);
        base.setAttribute('width', 12);
        base.setAttribute('height', 15);
        base.setAttribute('rx', 2);

        // Dish bowl (smaller)
        const bowl = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        bowl.setAttribute('class', 'dish-bowl');
        bowl.setAttribute('cx', 0);
        bowl.setAttribute('cy', -10);
        bowl.setAttribute('rx', 12);
        bowl.setAttribute('ry', 6);

        // Label (inside the base box)
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('class', 'dish-label');
        label.setAttribute('y', 8);
        label.textContent = dish.label;

        g.appendChild(base);
        g.appendChild(bowl);
        g.appendChild(label);

        dishGroup.appendChild(g);
    });

    // Update starmap array stats
    updateStarmapArrayStats();
}

function updateStarmapArrayStats() {
    const alignedCount = gameState.dishArray.dishes.filter(d => d.isAligned).length;
    const codeLength = gameState.dishArray.alignmentCode.length;
    const star = gameState.dishArray.currentTargetStar;

    // Update stats display
    const boostEl = document.getElementById('starmap-array-boost');
    const statusEl = document.getElementById('starmap-array-status');
    const scanBtn = document.getElementById('starmap-array-scan-btn');

    if (boostEl) boostEl.textContent = calculateSignalBoost().toFixed(1) + 'x';

    // Status is managed by code input flow, only update if not in code mode
    if (statusEl && !gameState.dishArray.codeRequired) {
        if (!star) {
            statusEl.textContent = 'SELECT WEAK SIGNAL TARGET';
            statusEl.className = 'starmap-array-status';
        }
    }

    // Show/hide scan button based on alignment (but not during alignment animation)
    if (scanBtn) {
        if (star && codeLength > 0 && alignedCount >= codeLength && !gameState.dishArray.alignmentInProgress) {
            scanBtn.style.display = 'block';
        } else {
            scanBtn.style.display = 'none';
        }
    }
}

function renderMiniDishArray() {
    const container = document.getElementById('mini-array-visual');
    if (!container) return;

    container.innerHTML = '';

    gameState.dishArray.dishes.forEach(dish => {
        // Build class list based on dish state
        let classes = 'mini-dish';
        if (dish.hasInterference) classes += ' interference';
        else if (dish.isRotating) classes += ' rotating';
        else if (dish.isAligned && dish.isPowered) classes += ' aligned';
        else if (dish.isPowered) classes += ' powered';

        const div = document.createElement('div');
        div.className = classes;
        div.dataset.dishId = dish.id;
        div.innerHTML = dish.hasInterference ? 'X' : `${dish.label}<span class="mini-power">${dish.powerCost}</span>`;
        div.title = dish.hasInterference ? 'Click to clear interference' :
                    !dish.isPowered ? `Click to power on (${dish.powerCost} power)` :
                    dish.isAligned ? `Right-click to power off (-${dish.powerCost} power)` :
                    'Click to align';
        div.addEventListener('click', () => startDishRotation(dish.id));
        div.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (dish.isPowered && !dish.hasInterference) {
                powerOffDish(dish);
            }
        });
        container.appendChild(div);
    });

    // Update counts - track power used from powered dishes
    const alignedCount = gameState.dishArray.dishes.filter(d => d.isAligned && d.isPowered).length;
    const requiredPower = gameState.dishArray.requiredPower;
    const powerUsed = gameState.dishArray.powerUsed;
    const maxPower = gameState.dishArray.maxPower;

    const miniAligned = document.getElementById('mini-aligned');
    const miniRequired = document.getElementById('mini-required');
    const tuningBoost = document.getElementById('tuning-boost-value');
    const miniPowerText = document.getElementById('mini-power-text');

    if (miniAligned) miniAligned.textContent = powerUsed; // Show power used
    if (miniRequired) miniRequired.textContent = requiredPower; // Show power required
    if (tuningBoost) tuningBoost.textContent = calculateSignalBoost().toFixed(1) + 'x';
    if (miniPowerText) {
        miniPowerText.textContent = `POWER: ${powerUsed}/${maxPower}`;
        miniPowerText.style.color = powerUsed >= maxPower ? '#f00' : '#0ff';
    }
}

function startDishRotation(dishId) {
    const dish = gameState.dishArray.dishes.find(d => d.id === dishId);
    if (!dish || dish.isRotating) return;

    const targetStar = gameState.dishArray.currentTargetStar;
    if (!targetStar) {
        log('No target star selected for array alignment', 'warning');
        return;
    }

    // Step 1: If dish has interference, clear it first
    if (dish.hasInterference) {
        clearDishInterference(dish);
        return;
    }

    // Step 2: If dish is not powered, try to power it on
    if (!dish.isPowered) {
        const newPowerUsed = gameState.dishArray.powerUsed + dish.powerCost;
        if (newPowerUsed > gameState.dishArray.maxPower) {
            log(`Power limit exceeded! Need ${dish.powerCost} units but only ${gameState.dishArray.maxPower - gameState.dishArray.powerUsed} available`, 'warning');
            playStaticBurst();
            return;
        }
        powerOnDish(dish);
        return;
    }

    // Step 3: If already aligned, do nothing
    if (dish.isAligned) return;

    // Step 4: Start rotating to target
    dish.targetAngle = (targetStar.id * 47 + 30) % 360;
    dish.isRotating = true;

    playDishRotationSound();
    log(`Dish ${dish.label} rotating to target...`);

    // Update visuals immediately
    renderDishArray();
    renderMiniDishArray();

    // Start rotation animation
    animateDishRotation(dish);
}

function clearDishInterference(dish) {
    log(`Clearing interference on Dish ${dish.label}...`, 'warning');
    playStaticBurst();

    // Visual feedback - show clearing
    dish.isRotating = true; // Use rotating state for animation
    renderDishArray();
    renderMiniDishArray();

    // Clear after delay
    setTimeout(() => {
        dish.hasInterference = false;
        dish.isRotating = false;
        playDishAlignedSound();
        log(`Dish ${dish.label} interference cleared`, 'highlight');
        renderDishArray();
        renderMiniDishArray();
        renderStarmapArray();
        updateStarmapArrayStats();
        updateArrayStatus();
    }, 1500);
}

function powerOnDish(dish) {
    dish.isPowered = true;
    gameState.dishArray.powerUsed += dish.powerCost;
    log(`Dish ${dish.label} powered on (+${dish.powerCost} power, total: ${gameState.dishArray.powerUsed}/${gameState.dishArray.maxPower})`);
    playClick();
    renderDishArray();
    renderMiniDishArray();
    renderStarmapArray();
    updateStarmapArrayStats();
    updateArrayStatus();
}

function powerOffDish(dish) {
    if (!dish.isPowered) return;

    dish.isPowered = false;
    dish.isAligned = false;
    gameState.dishArray.powerUsed -= dish.powerCost;
    log(`Dish ${dish.label} powered off (-${dish.powerCost} power, total: ${gameState.dishArray.powerUsed}/${gameState.dishArray.maxPower})`);
    playClick();
    renderDishArray();
    renderMiniDishArray();
    renderStarmapArray();
    updateStarmapArrayStats();
    updateArrayStatus();
}

function animateDishRotation(dish) {
    const rotationDuration = 2000 + Math.random() * 1000; // 2-3 seconds
    const startAngle = dish.angle;
    const endAngle = dish.targetAngle;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / rotationDuration, 1);

        // Ease-in-out curve
        const eased = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        // Calculate shortest rotation path
        let delta = endAngle - startAngle;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        dish.angle = startAngle + delta * eased;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Rotation complete
            dish.isRotating = false;
            dish.isAligned = true;
            dish.angle = endAngle;

            playDishAlignedSound();
            log(`Dish ${dish.label} aligned to target`, 'highlight');

            updateArrayStatus();
            renderDishArray();
            renderMiniDishArray();
            renderStarmapArray();
            updateStarmapArrayStats();
        }
    }

    requestAnimationFrame(animate);
}

function setArrayTarget(star) {
    if (!star || star.signalStrength !== 'weak') return;

    // Use the code-based alignment system
    setupAlignmentCode(star);
}

function updateArrayStatus() {
    // Count aligned dishes
    const alignedCount = gameState.dishArray.dishes.filter(d => d.isAligned).length;
    const codeLength = gameState.dishArray.alignmentCode.length;

    gameState.dishArray.alignedCount = alignedCount;

    // Check if all required dishes are aligned
    const isFullyAligned = codeLength > 0 && alignedCount >= codeLength;

    // Show/hide scan button based on alignment status (but not during alignment animation)
    const scanBtn = document.getElementById('array-scan-btn');
    if (scanBtn) {
        if (gameState.dishArray.currentTargetStar && isFullyAligned && !gameState.dishArray.alignmentInProgress) {
            scanBtn.style.display = 'inline-block';
        } else {
            scanBtn.style.display = 'none';
        }
    }
}

function alignAllDishes() {
    if (!gameState.dishArray.currentTargetStar) return;

    const unaligned = gameState.dishArray.dishes.filter(d => !d.isAligned && !d.isRotating);

    // Stagger the rotations for visual effect
    unaligned.forEach((dish, index) => {
        setTimeout(() => {
            startDishRotation(dish.id);
        }, index * 300);
    });
}

function resetArray() {
    // Reset all dishes
    gameState.dishArray.dishes.forEach(dish => {
        dish.isAligned = false;
        dish.isAligning = false;
    });

    clearAlignmentCode();
    renderStarmapArray();

    log('Array reset');
}

// Signal boost calculation - based on aligned dishes
function calculateSignalBoost() {
    const alignedCount = gameState.dishArray.dishes.filter(d => d.isAligned).length;
    const codeLength = gameState.dishArray.alignmentCode.length;

    if (alignedCount === 0 || codeLength === 0) return 1.0;

    // Base boost based on alignment ratio
    const ratio = alignedCount / codeLength;
    let boost = 1.0 + (ratio * 1.5);

    // Bonus for full alignment
    if (alignedCount >= codeLength) {
        boost += 0.5;
    }

    return Math.min(boost, 3.0); // Cap at 3x
}

function canTuneWeakSignal() {
    const star = gameState.currentStar;
    if (!star || star.signalStrength !== 'weak') return true;

    // Check if all required dishes are aligned (based on code length)
    const codeLength = gameState.dishArray.alignmentCode.length;
    const alignedCount = gameState.dishArray.dishes.filter(d => d.isAligned).length;
    return alignedCount >= codeLength;
}

// Audio functions for dish array
function playDishRotationSound() {
    if (!audioContext || masterVolume === 0) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(150, audioContext.currentTime + 1.5);

    gainNode.gain.setValueAtTime(0.03 * masterVolume, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
}

function playDishAlignedSound() {
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

    // Typing sounds for name input
    const nameInput = document.getElementById('name-input');
    nameInput.addEventListener('input', (e) => {
        playTypingSound();
    });

    // Proceed to array button
    document.getElementById('proceed-btn').addEventListener('click', () => {
        playClick();
        showView('starmap-view');
        // Show mailbox button now that user has entered the system
        document.getElementById('mailbox-btn').style.display = 'block';

        // Run starmap initialization sequence
        initializeStarmapSequence();

        // Send welcome message after entering the starmap
        setTimeout(() => {
            const welcome = NARRATIVE.emails.welcome;
            addMailMessage(welcome.from, welcome.subject, welcome.body);
        }, 3000);
    });
}

// Starmap initialization sequence
function initializeStarmapSequence() {
    const starmapSection = document.querySelector('.starmap-section');
    const starGrid = document.getElementById('star-grid');
    const canvas = document.getElementById('starmap-canvas');
    const ctx = canvas.getContext('2d');

    // Hide elements initially
    starmapSection.style.opacity = '0';
    starGrid.style.opacity = '0';

    // Create initialization overlay
    const overlay = document.createElement('div');
    overlay.id = 'starmap-init-overlay';
    overlay.innerHTML = `
        <div class="init-text" id="init-status">INITIALIZING DEEP SPACE ARRAY...</div>
        <div class="init-progress">
            <div class="init-bar" id="init-bar"></div>
        </div>
    `;

    // Add overlay styles
    const style = document.createElement('style');
    style.id = 'starmap-init-styles';
    style.textContent = `
        #starmap-init-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .init-text {
            color: #0f0;
            font-family: 'VT323', monospace;
            font-size: 24px;
            text-shadow: 0 0 10px #0f0;
            margin-bottom: 30px;
            letter-spacing: 3px;
        }
        .init-progress {
            width: 400px;
            height: 20px;
            border: 2px solid #0f0;
            background: transparent;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
        }
        .init-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #0f0, #0ff);
            box-shadow: 0 0 20px #0f0;
            transition: width 0.1s linear;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    const initBar = document.getElementById('init-bar');
    const initStatus = document.getElementById('init-status');

    const initSteps = [
        { progress: 10, text: 'CALIBRATING SENSORS...', delay: 300 },
        { progress: 25, text: 'ESTABLISHING UPLINK...', delay: 400 },
        { progress: 40, text: 'SYNCHRONIZING ARRAY...', delay: 350 },
        { progress: 55, text: 'LOADING STELLAR CATALOG...', delay: 400 },
        { progress: 70, text: 'MAPPING COORDINATES...', delay: 300 },
        { progress: 85, text: 'SCANNING SECTOR 7...', delay: 450 },
        { progress: 100, text: 'ARRAY ONLINE', delay: 300 }
    ];

    let stepIndex = 0;

    function runInitStep() {
        if (stepIndex < initSteps.length) {
            const step = initSteps[stepIndex];
            initBar.style.width = step.progress + '%';
            initStatus.textContent = step.text;
            playTypingSound();

            stepIndex++;
            setTimeout(runInitStep, step.delay);
        } else {
            // Initialization complete
            setTimeout(() => {
                // Fade out overlay
                overlay.style.transition = 'opacity 0.5s';
                overlay.style.opacity = '0';

                // Fade in starmap
                starmapSection.style.transition = 'opacity 1s';
                starmapSection.style.opacity = '1';

                // Animate stars appearing on canvas
                animateStarsAppearing();

                // Fade in star catalog
                setTimeout(() => {
                    starGrid.style.transition = 'opacity 0.8s';
                    starGrid.style.opacity = '1';
                }, 500);

                // Clean up
                setTimeout(() => {
                    overlay.remove();
                    style.remove();
                    log(`Dr. ${gameState.playerName} logged in - System ready`, 'highlight');
                }, 1000);
            }, 500);
        }
    }

    // Start initialization
    setTimeout(runInitStep, 500);
}

// Animate stars appearing on the starmap canvas
function animateStarsAppearing() {
    const canvas = document.getElementById('starmap-canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Store original star positions
    const stars = [...gameState.stars];
    let revealedStars = 0;
    const totalStars = stars.length;

    // Scan line effect
    let scanY = 0;
    const scanSpeed = 15;

    function drawScanEffect() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        // Draw grid lines (subtle)
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, Math.min(scanY, height));
            ctx.stroke();
        }
        for (let y = 0; y < Math.min(scanY, height); y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw scan line
        ctx.strokeStyle = '#0f0';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#0f0';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Reveal stars as scan passes them
        stars.forEach((star, index) => {
            if (star.y <= scanY) {
                // Draw revealed star
                const isIntelligent = star.hasIntelligence;
                ctx.fillStyle = isIntelligent ? '#0ff' : '#0f0';
                ctx.shadowColor = isIntelligent ? '#0ff' : '#0f0';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(star.x, star.y, isIntelligent ? 6 : 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Draw star label
                ctx.fillStyle = '#0f0';
                ctx.font = '10px VT323';
                ctx.fillText(star.name, star.x + 10, star.y + 3);
            }
        });

        scanY += scanSpeed;

        if (scanY < height + 50) {
            requestAnimationFrame(drawScanEffect);
        } else {
            // Scan complete, draw final state
            renderStarMap();
        }
    }

    drawScanEffect();
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

// Layout Mode Functions (Desktop/Mobile toggle)
let currentLayoutMode = 'auto'; // 'auto', 'desktop', 'mobile'

function toggleLayoutMode() {
    const body = document.body;
    const layoutLabel = document.getElementById('layout-label');

    // Cycle through: AUTO -> DESKTOP -> MOBILE -> AUTO
    if (currentLayoutMode === 'auto') {
        currentLayoutMode = 'desktop';
        body.classList.add('force-desktop');
        body.classList.remove('force-mobile');
        layoutLabel.textContent = 'DESKTOP';
    } else if (currentLayoutMode === 'desktop') {
        currentLayoutMode = 'mobile';
        body.classList.remove('force-desktop');
        body.classList.add('force-mobile');
        layoutLabel.textContent = 'MOBILE';
    } else {
        currentLayoutMode = 'auto';
        body.classList.remove('force-desktop');
        body.classList.remove('force-mobile');
        layoutLabel.textContent = 'AUTO';
    }

    // Save preference
    localStorage.setItem('layoutMode', currentLayoutMode);

    log(`Layout mode: ${currentLayoutMode.toUpperCase()}`);
}

function loadLayoutMode() {
    const savedMode = localStorage.getItem('layoutMode');
    const body = document.body;
    const layoutLabel = document.getElementById('layout-label');

    if (savedMode) {
        currentLayoutMode = savedMode;

        if (savedMode === 'desktop') {
            body.classList.add('force-desktop');
            layoutLabel.textContent = 'DESKTOP';
        } else if (savedMode === 'mobile') {
            body.classList.add('force-mobile');
            layoutLabel.textContent = 'MOBILE';
        } else {
            layoutLabel.textContent = 'AUTO';
        }
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
    // Don't send mail until initialization is complete (player has entered their name)
    if (!gameState.playerName) return;

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
            from: 'Cafeteria Services',
            subject: 'Menu Update',
            body: `WEEKLY MENU NOTICE:\n\nDue to supply chain delays, the following items are temporarily unavailable:\n- Fresh fruit\n- Coffee (decaf only available)\n- Anything that tastes good\n\nWe apologize for any inconvenience. Freeze-dried alternatives are available.\n\n- Sector 7 Food Services`
        },
        {
            from: 'Dr. Marcus Webb - Xenolinguistics',
            subject: 'Pattern Analysis Request',
            body: `Dr. ${gameState.playerName},\n\nI've been developing new algorithms for detecting linguistic patterns in signal noise. Would you be willing to share some of your raw data feeds?\n\nEven natural phenomena sometimes hide surprising structures. My team believes we may have found something in archived data from your sector.\n\nLet me know if you're interested in collaborating.\n\n- Marcus`
        },
        {
            from: 'AUTOMATED BACKUP SYSTEM',
            subject: 'Data Archive Complete',
            body: `[AUTOMATED MESSAGE]\n\nDaily backup completed successfully.\n\nFiles archived: 2,847\nTotal size: 1.2 TB\nIntegrity check: PASSED\n\nNote: Anomalous data patterns flagged in sectors 7-12. Manual review recommended.\n\n- Backup System v3.2.1`
        },
        {
            from: 'Dr. Sarah Okonkwo - Astrobiology',
            subject: 'Habitable Zone Analysis',
            body: `${gameState.playerName},\n\nI've compiled atmospheric data for several targets in your monitoring zone. Three of them show promising biosignature potential.\n\nI know SETI focuses on technological signatures, but sometimes life announces itself in simpler ways first. Keep an eye on the oxygen-rich candidates.\n\nAttached: Spectral analysis summary (encrypted)\n\n- Sarah`
        },
        {
            from: 'PERSONNEL DEPARTMENT',
            subject: 'Mandatory Training Reminder',
            body: `Dr. ${gameState.playerName},\n\nThis is a reminder that your annual "First Contact Protocol" certification expires in 30 days.\n\nPlease complete the online refresher course before expiration. Failure to comply may result in restricted array access.\n\nNote: Given recent... developments... this training is more relevant than ever.\n\n- HR Division`
        }
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    addMailMessage(randomMsg.from, randomMsg.subject, randomMsg.body);
}

// Special email sent when first alien signal is discovered
function sendFirstContactEmail() {
    addMailMessage(
        'SECURITY CLEARANCE - LEVEL 5',
        '[CLASSIFIED] Signal Confirmation Required',
        `[ENCRYPTED COMMUNICATION]\n\nDr. ${gameState.playerName},\n\nYour clearance has been elevated for this communication.\n\nWe've detected coordinated signal patterns across multiple listening posts. Your sector is of particular interest.\n\nThe signal you have identified matches parameters we have been monitoring for decades. This is not a drill.\n\nReport all findings immediately. Do not discuss outside secure channels. Do not contact external agencies.\n\nProtocol Sigma is now in effect.\n\nStand by for further instructions.\n\n[END TRANSMISSION]`
    );
}

// Start the game
function startGame() {
    updateClock();
    setInterval(updateClock, 1000);

    // Load saved color scheme
    loadColorScheme();

    // Load saved layout mode
    loadLayoutMode();

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
    initDevMode(); // Initialize developer mode
    initDishArray(); // Initialize dish array system

    // Check for new mail periodically (every 60 seconds)
    setInterval(checkForNewMail, 60000);
}

startGame();
