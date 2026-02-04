// ═════════════════════════════════════════════════════════════════════════════
// DEVELOPER MODE
// Debug tools and shortcuts for development/testing
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from './game-state.js';
import { showView, log } from '../ui/rendering.js';

// Dev mode state
let devMode = false;
let devPanelCollapsed = false;

// These will be set by main.js to avoid circular dependencies
let selectStarFn = null;
let initiateScanFn = null;
let startTuningMinigameFn = null;
let startPatternMinigameFn = null;
let initiateContactFn = null;
let updateStarStatusFn = null;
let saveProgressFn = null;
let showFinalReportFn = null;
let sendRandomMailFn = null;

// Set external functions (called from main.js)
export function setDevFunctions(fns) {
    selectStarFn = fns.selectStar;
    initiateScanFn = fns.initiateScan;
    startTuningMinigameFn = fns.startTuningMinigame;
    startPatternMinigameFn = fns.startPatternMinigame;
    initiateContactFn = fns.initiateContact;
    updateStarStatusFn = fns.updateStarStatus;
    saveProgressFn = fns.saveProgress;
    showFinalReportFn = fns.showFinalReport;
    sendRandomMailFn = fns.sendRandomMail;
}

// Initialize dev mode
export function initDevMode() {
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

// Toggle dev mode on/off
export function toggleDevMode() {
    devMode = !devMode;
    if (devMode) {
        showDevPanel();
    } else {
        hideDevPanel();
    }
}

// Toggle dev panel collapse
export function toggleDevPanelCollapse() {
    devPanelCollapsed = !devPanelCollapsed;
    const content = document.querySelector('.dev-panel-content');
    const toggle = document.querySelector('.dev-toggle');
    if (content) {
        content.style.display = devPanelCollapsed ? 'none' : 'block';
        toggle.textContent = devPanelCollapsed ? '+' : '−';
    }
}

// Show the dev panel
export function showDevPanel() {
    if (document.getElementById('dev-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'dev-panel';
    panel.innerHTML = `
        <div class="dev-panel-header" style="cursor: pointer;">
            DEV MODE <span class="dev-toggle">−</span>
        </div>
        <div class="dev-panel-content">
            <div class="dev-section">NAVIGATION</div>
            <button data-action="skipToStarmap">Skip to Starmap</button>
            <button data-action="showSignalScan">Signal Scan View</button>
            <button data-action="showTuningGame">Tuning Mini-game</button>
            <button data-action="showPatternGame">Pattern Mini-game</button>
            <button data-action="showMailbox">Mailbox</button>

            <div class="dev-section">STAR ACTIONS</div>
            <button data-action="markAllScanned">Mark All Scanned</button>
            <button data-action="markAllAnalyzed">Mark All Analyzed</button>
            <button data-action="triggerContact">Trigger Contact</button>
            <button data-action="resetProgress">Reset All Progress</button>

            <div class="dev-section">MISC</div>
            <button data-action="addRandomMail">Add Random Email</button>
            <button data-action="logState">Log Game State</button>

            <div class="dev-section">END STATE</div>
            <button data-action="triggerEndState">Trigger End State</button>
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

    // Add event listeners
    panel.querySelector('.dev-panel-header').addEventListener('click', toggleDevPanelCollapse);

    panel.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            switch(action) {
                case 'skipToStarmap': devSkipToStarmap(); break;
                case 'showSignalScan': devShowSignalScan(); break;
                case 'showTuningGame': devShowTuningGame(); break;
                case 'showPatternGame': devShowPatternGame(); break;
                case 'showMailbox': devShowMailbox(); break;
                case 'markAllScanned': devMarkAllScanned(); break;
                case 'markAllAnalyzed': devMarkAllAnalyzed(); break;
                case 'triggerContact': devTriggerContact(); break;
                case 'resetProgress': devResetProgress(); break;
                case 'addRandomMail': devAddRandomMail(); break;
                case 'logState': devLogState(); break;
                case 'triggerEndState': devTriggerEndState(); break;
            }
        });
    });

    console.log('%c[DEV MODE ENABLED]', 'color: #f0f; font-weight: bold;');
}

// Hide the dev panel
export function hideDevPanel() {
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
    if (selectStarFn) selectStarFn(starId);
    if (initiateScanFn) initiateScanFn();
    log('DEV: Started signal scan', 'highlight');
}

function devShowTuningGame() {
    if (gameState.stars.length === 0) {
        devSkipToStarmap();
    }
    if (selectStarFn) selectStarFn(0);
    showView('analysis-view');
    if (startTuningMinigameFn) startTuningMinigameFn(gameState.currentStar);
    log('DEV: Started tuning mini-game', 'highlight');
}

function devShowPatternGame() {
    if (gameState.stars.length === 0) {
        devSkipToStarmap();
    }
    if (selectStarFn) selectStarFn(0);
    showView('analysis-view');
    if (startPatternMinigameFn) startPatternMinigameFn();
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
        if (updateStarStatusFn) updateStarStatusFn(index, 'scanned');
    });
    log('DEV: All stars marked as scanned', 'highlight');
}

function devMarkAllAnalyzed() {
    devMarkAllScanned();
    gameState.stars.forEach((star, index) => {
        gameState.analyzedStars.add(index);
        if (updateStarStatusFn) updateStarStatusFn(index, 'analyzed');
    });
    if (saveProgressFn) saveProgressFn();
    log('DEV: All stars marked as analyzed', 'highlight');
}

function devTriggerContact() {
    // Find a star with intelligence that hasn't been contacted
    const intelligentStars = gameState.stars.filter(s => s.hasIntelligence);
    const uncontacted = intelligentStars.find(s => !gameState.contactedStars.has(s.id));

    if (uncontacted) {
        if (selectStarFn) selectStarFn(uncontacted.id);
        gameState.analyzedStars.add(uncontacted.id);
        // Trigger contact sequence
        showView('starmap-view');
        setTimeout(() => {
            if (initiateContactFn) initiateContactFn(uncontacted);
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
    if (sendRandomMailFn) sendRandomMailFn();
    log('DEV: Added random email', 'highlight');
}

export function devLogState() {
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

export function devTriggerEndState() {
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

    if (showFinalReportFn) showFinalReportFn();
    log('DEV: Triggered end state', 'highlight');
}

// Expose dev functions to window for console access
if (typeof window !== 'undefined') {
    window.devLogState = devLogState;
    window.devTriggerEndState = devTriggerEndState;
}
