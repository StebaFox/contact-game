// ═════════════════════════════════════════════════════════════════════════════
// MAIN ENTRY POINT
// Imports all modules and initializes the game
// ═════════════════════════════════════════════════════════════════════════════

// Core
import { gameState } from './core/game-state.js';
import { initDevMode, setDevFunctions, showDevPanel } from './core/dev-mode.js';
import { checkForEndState, showFinalReport, submitReport, restartGame } from './core/end-game.js';

// UI
import { showView, log, clearCanvas, updateClock } from './ui/rendering.js';
import { toggleColorScheme, toggleLayoutMode, loadColorScheme, loadLayoutMode } from './ui/theme.js';
import { setupBootSequence, setBootFunctions } from './ui/boot-sequence.js';
import {
    generateBackgroundStars,
    generateStarCatalog,
    drawStarVisualization,
    selectStar,
    renderStarMap,
    startStarMapAnimation,
    setupStarMapCanvas,
    setStarmapFunctions,
    setupNavigationButtons
} from './ui/starmap.js';

// Systems
import {
    initAudio,
    playClick,
    playMachineSound,
    stopMachineSound,
    playSecurityBeep,
    setMasterVolume
} from './systems/audio.js';
import { openMailbox, closeMailbox, checkForNewMail } from './systems/mailbox.js';
import {
    initDishArray,
    handleKeypadPress,
    alignDishesFromCode,
    alignAllDishes,
    resetArray,
    setArrayTarget,
    renderStarmapArray,
    updateStarmapArrayStats
} from './systems/dish-array.js';
import {
    initiateScan,
    analyzeSignal,
    generateSignal,
    startSignalAnimation,
    stopSignalAnimation,
    showVerifyPrompt
} from './systems/scanning.js';
import { startTuningMinigame, setTuningFunctions, setupTuningSliders } from './systems/tuning-minigame.js';
import { startPatternRecognitionGame, setPatternFunctions } from './systems/pattern-minigame.js';

// Wire up cross-module function references
function setupModuleConnections() {
    // Boot sequence needs renderStarMap and playSecurityBeep
    setBootFunctions({
        renderStarMap: renderStarMap,
        playSecurityBeep: playSecurityBeep
    });

    // Starmap needs dish-array functions and signal animation
    setStarmapFunctions({
        setArrayTarget: setArrayTarget,
        renderStarmapArray: renderStarmapArray,
        updateStarmapArrayStats: updateStarmapArrayStats,
        stopSignalAnimation: stopSignalAnimation
    });

    // Dev mode needs various functions
    setDevFunctions({
        showView: showView,
        renderStarMap: renderStarMap,
        initiateScan: initiateScan,
        selectStar: selectStar,
        generateSignal: generateSignal,
        startSignalAnimation: startSignalAnimation,
        startPatternRecognitionGame: startPatternRecognitionGame,
        showFinalReport: showFinalReport
    });

    // Tuning minigame needs signal functions
    setTuningFunctions({
        generateSignal: generateSignal,
        startSignalAnimation: startSignalAnimation
    });

    // Pattern minigame needs various functions
    setPatternFunctions({
        stopSignalAnimation: stopSignalAnimation,
        generateSignal: generateSignal,
        startSignalAnimation: startSignalAnimation,
        showVerifyPrompt: showVerifyPrompt
    });
}

// Setup all event listeners
function setupEventListeners() {
    // Scan and analyze buttons
    document.getElementById('scan-btn').addEventListener('click', () => {
        playClick();
        initiateScan();
    });

    document.getElementById('analyze-btn').addEventListener('click', () => {
        playClick();
        analyzeSignal();
    });

    // Clear cache button
    document.getElementById('clear-cache-btn').addEventListener('click', () => {
        playClick();
        gameState.scannedSignals.clear();
        gameState.scanResults.clear();
        log('Scan cache cleared - all signals will be regenerated', 'highlight');
    });

    // Navigation buttons (back and continue)
    setupNavigationButtons();

    // Tuning sliders
    setupTuningSliders();

    // Volume slider
    const volumeSlider = document.getElementById('volume-slider');
    volumeSlider.addEventListener('input', (e) => {
        const volume = parseInt(e.target.value) / 100;
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

    // Mailbox buttons
    document.getElementById('mailbox-btn').addEventListener('click', () => {
        playClick();
        openMailbox();
    });

    document.getElementById('mailbox-back-btn').addEventListener('click', () => {
        playClick();
        closeMailbox();
    });

    // Dish Array buttons
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
            initiateScan();
        });
    }

    const starmapArrayScanBtn = document.getElementById('starmap-array-scan-btn');
    if (starmapArrayScanBtn) {
        starmapArrayScanBtn.addEventListener('click', () => {
            playClick();
            initiateScan();
        });
    }

    // End state buttons
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

    // Keypad buttons for alignment code
    const keypadBtns = document.querySelectorAll('.keypad-btn');
    keypadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            handleKeypadPress(key);
        });
    });

    // BEGIN ALIGNMENT button
    const beginAlignmentBtn = document.getElementById('begin-alignment-btn');
    if (beginAlignmentBtn) {
        beginAlignmentBtn.addEventListener('click', () => {
            playClick();
            const code = gameState.dishArray.alignmentCode;
            alignDishesFromCode(code);
        });
    }
}

// Initialize the game
function initGame() {
    console.log('SIGNAL: Initializing game...');

    // Load saved preferences
    loadColorScheme();
    loadLayoutMode();

    // Setup module connections
    setupModuleConnections();

    // Setup boot sequence
    setupBootSequence();

    // Setup event listeners
    setupEventListeners();

    // Initialize systems
    generateBackgroundStars();
    generateStarCatalog();
    setupStarMapCanvas();
    initDishArray();

    // Start animations
    startStarMapAnimation();

    // Start clock update
    setInterval(updateClock, 1000);

    // Start mail check
    setInterval(checkForNewMail, 30000);

    // Initialize dev mode
    initDevMode();

    console.log('SIGNAL: Game initialized successfully');
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
