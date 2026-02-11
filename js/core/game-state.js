// ═════════════════════════════════════════════════════════════════════════════
// GAME STATE
// Central state object shared across all modules
// ═════════════════════════════════════════════════════════════════════════════

export const gameState = {
    currentStar: null,
    stars: [],
    analyzedStars: new Set(),
    contactedStars: new Set(),
    currentSignal: null,
    discoveredMessages: [],
    journalEntries: [],
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

    // Day system (3-day narrative)
    currentDay: 1,
    daysCompleted: [],
    demoMode: false, // When true, all content is unlocked

    // Fragment collection for final puzzle (breadcrumb trail)
    fragments: {
        collected: [],
        sources: {
            src7024: null,      // Fragment 1: SRC-7024 scan (Day 3)
            nexusPoint: null,   // Fragment 2: NEXUS POINT scan (Day 3)
            eridani82: null,    // Fragment 3: 82 Eridani collaboration (Day 3)
            synthesis: null     // Fragment 4: Synthesis alignment (Day 3)
        }
    },

    // Investigation / Project Lighthouse
    investigationUnlocked: false,
    dynamicStars: [], // SRC-7024, NEXUS POINT - added during gameplay

    // Starmap mode
    starmapMode: 'array', // 'array' or 'skychart'
    skyChart: { scale: 1, panX: 0, panY: 0, isDragging: false, dragStartX: 0, dragStartY: 0, lastPanX: 0, lastPanY: 0 },

    // Progress flags
    tutorialCompleted: false,
    decryptionComplete: false,
    cmbDetected: false,
    finalPuzzleComplete: false,
    finalMessageActive: false, // True while final message is playing -- suppresses mail
    dayReportShown: 0, // Track which day's report has been shown
    day2CliffhangerPhase: -1, // -1=not started, 0-4=active phases, 5=complete

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
        alignedCount: 0,      // Number of dishes currently aligned
        alignmentInProgress: false // Flag to prevent button showing during animation
    }
};

// Helper function to reset game state
export function resetGameState() {
    gameState.currentStar = null;
    gameState.stars = [];
    gameState.analyzedStars = new Set();
    gameState.contactedStars = new Set();
    gameState.currentSignal = null;
    gameState.discoveredMessages = [];
    gameState.selectedStarId = null;
    gameState.crosshairAngle = 0;
    gameState.signalOffset = 0;
    gameState.isScanning = false;
    gameState.animationFrameId = null;
    gameState.signalAnimationFrameId = null;
    gameState.showScanConfirm = false;
    gameState.backgroundStars = [];
    gameState.scannedSignals = new Map();
    gameState.scanResults = new Map();
    gameState.noiseFrameCounter = 0;

    // Reset tuning state
    gameState.tuningActive = false;
    gameState.targetFrequency = 50;
    gameState.targetGain = 50;
    gameState.currentFrequency = 50;
    gameState.currentGain = 50;
    gameState.lockDuration = 0;

    // Reset starmap mode
    gameState.starmapMode = 'array';
    gameState.skyChart = { scale: 1, panX: 0, panY: 0, isDragging: false, dragStartX: 0, dragStartY: 0, lastPanX: 0, lastPanY: 0 };

    // Reset parallax
    gameState.mouseX = 0;
    gameState.mouseY = 0;
    gameState.targetMouseX = 0;
    gameState.targetMouseY = 0;
    gameState.parallaxOffsetX = 0;
    gameState.parallaxOffsetY = 0;

    // Reset pattern game
    gameState.patternGameActive = false;
    gameState.patternGameBands = [];
    gameState.patternGameCorrectIndices = [];
    gameState.patternGameSelectedIndices = [];
    gameState.patternGameCompleted = false;

    // Reset player info
    gameState.playerName = '';

    // Reset day system
    gameState.currentDay = 1;
    gameState.daysCompleted = [];
    gameState.demoMode = false;

    // Reset fragments
    gameState.fragments = {
        collected: [],
        sources: {
            src7024: null,
            nexusPoint: null,
            eridani82: null,
            synthesis: null
        }
    };

    // Reset investigation
    gameState.investigationUnlocked = false;
    gameState.dynamicStars = [];

    // Reset progress flags
    gameState.tutorialCompleted = false;
    gameState.decryptionComplete = false;
    gameState.cmbDetected = false;
    gameState.finalPuzzleComplete = false;
    gameState.dayReportShown = 0;
    gameState.day2CliffhangerPhase = -1;

    // Reset mailbox
    gameState.mailboxMessages = [];
    gameState.unreadMailCount = 0;
    gameState.lastMailTime = Date.now();
    gameState.previousView = 'starmap-view';

    // Reset dish array
    gameState.dishArray = {
        dishes: [],
        currentTargetStar: null,
        alignmentCode: '',
        inputCode: '',
        codeRequired: false,
        alignedCount: 0,
        alignmentInProgress: false
    };
}
