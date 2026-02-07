// ═════════════════════════════════════════════════════════════════════════════
// DEVELOPER MODE
// Debug tools and shortcuts for development/testing
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from './game-state.js';
import { showView, log } from '../ui/rendering.js';
import { applyDayCode, autoSave } from './save-system.js';
import { loadDayWithProgress } from '../ui/boot-sequence.js';
import { DAY_CONFIG } from './day-system.js';
import { checkAndShowDayComplete } from '../systems/day-report.js';
import { ALIEN_CONTACTS } from '../narrative/alien-contacts.js';
import { showFinalMessage } from '../narrative/final-message.js';
import { startRerouteMinigame } from '../systems/reroute-minigame.js';

// Dev mode state
let devMode = false;
let devPanelCollapsed = false;

// These will be set by main.js to avoid circular dependencies
let selectStarFn = null;
let initiateScanFn = null;
let startTuningMinigameFn = null;
let startPatternMinigameFn = null;
let startDecryptionMinigameFn = null;
let startAlignmentTutorialFn = null;
let startFinalAlignmentFn = null;
let startTriangulationMinigameFn = null;
let initiateContactFn = null;
let updateStarStatusFn = null;
let saveProgressFn = null;
let showFinalReportFn = null;
let sendRandomMailFn = null;
let openInvestigationFn = null;
let unlockInvestigationFn = null;
let onFragmentCollectedFn = null;
let addSRC7024Fn = null;
let addNexusPointFn = null;
let addGenesisPointFn = null;

// Set external functions (called from main.js)
export function setDevFunctions(fns) {
    selectStarFn = fns.selectStar;
    initiateScanFn = fns.initiateScan;
    startTuningMinigameFn = fns.startTuningMinigame;
    startPatternMinigameFn = fns.startPatternMinigame;
    startDecryptionMinigameFn = fns.startDecryptionMinigame;
    startAlignmentTutorialFn = fns.startAlignmentTutorial;
    startFinalAlignmentFn = fns.startFinalAlignment;
    startTriangulationMinigameFn = fns.startTriangulationMinigame;
    initiateContactFn = fns.initiateContact;
    updateStarStatusFn = fns.updateStarStatus;
    saveProgressFn = fns.saveProgress;
    showFinalReportFn = fns.showFinalReport;
    sendRandomMailFn = fns.sendRandomMail;
    openInvestigationFn = fns.openInvestigation;
    unlockInvestigationFn = fns.unlockInvestigation;
    onFragmentCollectedFn = fns.onFragmentCollected;
    addSRC7024Fn = fns.addSRC7024;
    addNexusPointFn = fns.addNexusPoint;
    addGenesisPointFn = fns.addGenesisPoint;
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
            <div class="dev-section">DAY PROGRESSION</div>
            <button data-action="skipToDay1">Skip to Day 1</button>
            <button data-action="skipToDay2">Skip to Day 2</button>
            <button data-action="skipToDay3">Skip to Day 3</button>
            <button data-action="completeCurrentDay">Complete Current Day</button>

            <div class="dev-section">NAVIGATION</div>
            <button data-action="skipToStarmap">Skip to Starmap</button>
            <button data-action="showSignalScan">Signal Scan View</button>
            <button data-action="showMailbox">Mailbox</button>

            <div class="dev-section">MINIGAMES</div>
            <button data-action="showTuningGame">Tuning</button>
            <button data-action="showPatternGame">Pattern Recognition</button>
            <button data-action="showDecryption">Decryption</button>
            <button data-action="showAlignmentTutorial">Alignment Tutorial</button>
            <button data-action="showFinalAlignment">Final Alignment</button>
            <button data-action="showTriangulation">Triangulation</button>
            <button data-action="showReroute">Reroute (Power)</button>

            <div class="dev-section">INVESTIGATION</div>
            <button data-action="unlockInvestigation">Unlock Investigation</button>
            <button data-action="openInvestigation">Open Investigation</button>
            <button data-action="addSRC7024">Add SRC-7024</button>
            <button data-action="addNexusPoint">Add NEXUS POINT</button>
            <button data-action="addGenesisPoint">Add GENESIS POINT</button>
            <button data-action="giveFragment1">Give Fragment 1 (SRC-7024)</button>
            <button data-action="giveFragment2">Give Fragment 2 (Nexus)</button>
            <button data-action="giveFragment3">Give Fragment 3 (Eridani)</button>
            <button data-action="giveFragment4">Give Fragment 4 (Genesis)</button>
            <button data-action="giveAllFragments">Give All Fragments</button>

            <div class="dev-section">STAR ACTIONS</div>
            <button data-action="markAllScanned">Mark All Scanned</button>
            <button data-action="markAllAnalyzed">Mark All Analyzed</button>
            <button data-action="triggerContact">Trigger Contact</button>
            <button data-action="resetProgress">Reset All Progress</button>

            <div class="dev-section">MISC</div>
            <button data-action="addRandomMail">Add Random Email</button>
            <button data-action="logState">Log Game State</button>

            <div class="dev-section">END STATE</div>
            <button data-action="showFinalMessage">Show Final Message</button>
            <button data-action="triggerEndState">Show Final Report</button>
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
                case 'skipToDay1': devSkipToDay(1); break;
                case 'skipToDay2': devSkipToDay(2); break;
                case 'skipToDay3': devSkipToDay(3); break;
                case 'completeCurrentDay': devCompleteCurrentDay(); break;
                case 'skipToStarmap': devSkipToStarmap(); break;
                case 'showSignalScan': devShowSignalScan(); break;
                case 'showTuningGame': devShowTuningGame(); break;
                case 'showPatternGame': devShowPatternGame(); break;
                case 'showDecryption': devShowDecryption(); break;
                case 'showAlignmentTutorial': devShowAlignmentTutorial(); break;
                case 'showFinalAlignment': devShowFinalAlignment(); break;
                case 'showTriangulation': devShowTriangulation(); break;
                case 'showReroute': devShowReroute(); break;
                case 'showMailbox': devShowMailbox(); break;
                case 'markAllScanned': devMarkAllScanned(); break;
                case 'markAllAnalyzed': devMarkAllAnalyzed(); break;
                case 'triggerContact': devTriggerContact(); break;
                case 'resetProgress': devResetProgress(); break;
                case 'addRandomMail': devAddRandomMail(); break;
                case 'logState': devLogState(); break;
                case 'unlockInvestigation': devUnlockInvestigation(); break;
                case 'openInvestigation': devOpenInvestigation(); break;
                case 'addSRC7024': devAddSRC7024(); break;
                case 'addNexusPoint': devAddNexusPoint(); break;
                case 'addGenesisPoint': devAddGenesisPoint(); break;
                case 'giveFragment1': devGiveFragment('src7024'); break;
                case 'giveFragment2': devGiveFragment('nexusPoint'); break;
                case 'giveFragment3': devGiveFragment('eridani82'); break;
                case 'giveFragment4': devGiveFragment('synthesis'); break;
                case 'giveAllFragments': devGiveAllFragments(); break;
                case 'showFinalMessage': devShowFinalMessage(); break;
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

// False positive star indices (matches starmap.js)
const falsePositiveIndices = [4, 7, 9, 14, 18, 24, 27];

// Natural phenomena for random assignment
const naturalPhenomena = [
    { type: 'Pulsar radiation', source: 'Rotating neutron star' },
    { type: 'Solar flare activity', source: 'Stellar chromosphere' },
    { type: 'Magnetospheric emissions', source: 'Planetary magnetic field' },
    { type: 'Quasar background noise', source: 'Distant active galactic nucleus' },
    { type: 'Stellar wind interference', source: 'Coronal mass ejection' }
];

// False positive sources
const falsePositiveSources = [
    'CLASSIFIED RECON SATELLITE (KH-11)',
    'GPS SATELLITE CONSTELLATION',
    'MICROWAVE TOWER HARMONIC',
    'AIRPORT RADAR INTERFERENCE',
    'TELEVISION BROADCAST HARMONIC'
];

// Dev functions - Day progression
function devSkipToDay(day) {
    if (!gameState.playerName) {
        gameState.playerName = 'DEV_USER';
    }

    const dayCodes = {
        1: 'ALPHA-001',
        2: 'SIGMA-042',
        3: 'OMEGA-137'
    };

    const code = dayCodes[day];
    if (code) {
        applyDayCode(code);
        log(`DEV: Skipped to Day ${day} (code: ${code})`, 'highlight');
        // Load the day state directly without page reload
        loadDayWithProgress();
    }
}

function devCompleteCurrentDay() {
    if (gameState.demoMode || gameState.currentDay === 0) {
        log('DEV: Cannot complete day in demo mode', 'warning');
        return;
    }

    const dayConfig = DAY_CONFIG[gameState.currentDay];
    if (!dayConfig) {
        log('DEV: Invalid day configuration', 'warning');
        return;
    }

    // Mark all stars for current day as analyzed with proper scan results
    dayConfig.availableStars.forEach(starIndex => {
        gameState.analyzedStars.add(starIndex);

        // Check if this star has an alien contact
        const hasContact = ALIEN_CONTACTS.some(m => m.starIndex === starIndex);

        if (hasContact) {
            // Verified intelligent signal
            gameState.scanResults.set(starIndex, { type: 'verified_signal' });
            gameState.contactedStars.add(starIndex);
        } else if (falsePositiveIndices.includes(starIndex)) {
            // False positive
            const source = falsePositiveSources[Math.floor(Math.random() * falsePositiveSources.length)];
            gameState.scanResults.set(starIndex, {
                type: 'false_positive',
                source: source
            });
        } else {
            // Natural phenomenon
            const phenomenon = naturalPhenomena[Math.floor(Math.random() * naturalPhenomena.length)];
            gameState.scanResults.set(starIndex, {
                type: 'natural',
                phenomenonType: phenomenon.type,
                source: phenomenon.source
            });
        }
    });

    // Save progress
    autoSave();

    log(`DEV: Completed Day ${gameState.currentDay} - all ${dayConfig.availableStars.length} stars analyzed`, 'highlight');

    // Trigger the day complete check (shows report popup)
    gameState.dayReportShown = 0; // Reset so report shows
    setTimeout(() => {
        checkAndShowDayComplete();
    }, 500);
}

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

function devShowDecryption() {
    if (startDecryptionMinigameFn) {
        startDecryptionMinigameFn(
            () => {
                log('DEV: Decryption SUCCESS!', 'highlight');
            },
            () => {
                log('DEV: Decryption cancelled', 'warning');
            }
        );
    }
    log('DEV: Started decryption mini-game', 'highlight');
}

function devShowAlignmentTutorial() {
    if (startAlignmentTutorialFn) {
        startAlignmentTutorialFn(
            () => {
                log('DEV: Alignment tutorial SUCCESS!', 'highlight');
            },
            () => {
                log('DEV: Alignment tutorial skipped', 'warning');
            }
        );
    }
    log('DEV: Started alignment tutorial', 'highlight');
}

function devShowFinalAlignment() {
    if (startFinalAlignmentFn) {
        startFinalAlignmentFn(
            () => {
                log('DEV: Final alignment SUCCESS!', 'highlight');
            },
            () => {
                log('DEV: Final alignment aborted', 'warning');
            }
        );
    }
    log('DEV: Started final alignment puzzle', 'highlight');
}

function devShowTriangulation() {
    if (startTriangulationMinigameFn) {
        startTriangulationMinigameFn(
            () => {
                log('DEV: Triangulation SUCCESS!', 'highlight');
                showView('starmap-view');
            },
            () => {
                log('DEV: Triangulation cancelled', 'warning');
            }
        );
    }
    log('DEV: Started triangulation minigame', 'highlight');
}

function devShowReroute() {
    // Pick a random dish label for testing
    const dishLabels = ['C', '1', '2', '3', '4', '5', '6'];
    const randomDish = dishLabels[Math.floor(Math.random() * dishLabels.length)];

    startRerouteMinigame(
        randomDish,
        () => {
            log('DEV: Reroute SUCCESS! Power restored.', 'highlight');
        },
        () => {
            log('DEV: Reroute aborted/failed', 'warning');
        }
    );
    log(`DEV: Started reroute minigame for Dish ${randomDish}`, 'highlight');
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
    console.log('Current Day:', gameState.currentDay);
    console.log('Demo Mode:', gameState.demoMode);
    console.log('Days Completed:', gameState.daysCompleted);
    console.log('Day Report Shown:', gameState.dayReportShown);
    console.log('Current Star:', gameState.currentStar);
    console.log('Selected Star ID:', gameState.selectedStarId);
    console.log('Scanned Signals:', [...gameState.scannedSignals.keys()]);
    console.log('Analyzed Stars:', [...gameState.analyzedStars]);
    console.log('Contacted Stars:', [...gameState.contactedStars]);
    console.log('Scan Results:', [...gameState.scanResults.entries()]);
    console.log('Fragments:', gameState.fragments);
    console.log('Investigation Unlocked:', gameState.investigationUnlocked);
    console.log('Dynamic Stars:', gameState.dynamicStars?.map(s => s.id) || []);
    console.log('CMB Detected:', gameState.cmbDetected);
    console.log('Decryption Complete:', gameState.decryptionComplete);
    console.log('Tutorial Complete:', gameState.tutorialCompleted);
    console.log('Mailbox Messages:', gameState.mailboxMessages.length);
    console.log('Unread Mail:', gameState.unreadMailCount);
    console.log('==================');
    log('DEV: State logged to console (F12 to view)', 'highlight');
}

// Dev functions - Investigation
function devUnlockInvestigation() {
    if (unlockInvestigationFn) unlockInvestigationFn();
    log('DEV: Investigation page unlocked', 'highlight');
}

function devOpenInvestigation() {
    if (!gameState.investigationUnlocked) {
        if (unlockInvestigationFn) unlockInvestigationFn();
    }
    if (openInvestigationFn) openInvestigationFn();
    log('DEV: Opened investigation page', 'highlight');
}

function devAddSRC7024() {
    if (addSRC7024Fn) addSRC7024Fn();
    log('DEV: SRC-7024 added to starmap', 'highlight');
}

function devAddNexusPoint() {
    if (addNexusPointFn) addNexusPointFn();
    log('DEV: NEXUS POINT added to starmap', 'highlight');
}

function devAddGenesisPoint() {
    if (addGenesisPointFn) addGenesisPointFn();
    log('DEV: GENESIS POINT added to starmap', 'highlight');
}

function devGiveFragment(fragmentKey) {
    if (onFragmentCollectedFn) onFragmentCollectedFn(fragmentKey);
    log(`DEV: Fragment "${fragmentKey}" collected`, 'highlight');
}

function devGiveAllFragments() {
    ['src7024', 'nexusPoint', 'eridani82'].forEach(key => {
        if (onFragmentCollectedFn) onFragmentCollectedFn(key);
    });
    if (!gameState.investigationUnlocked && unlockInvestigationFn) {
        unlockInvestigationFn();
    }
    log('DEV: All 3 fragments collected (use Synthesis for #4)', 'highlight');
}

function devShowFinalMessage() {
    // Set player name if not set
    if (!gameState.playerName) {
        gameState.playerName = 'Developer';
    }

    log('DEV: Showing final message...', 'highlight');
    showFinalMessage(() => {
        log('DEV: Final message complete', 'highlight');
        showView('starmap-view');
    });
}

export function devTriggerEndState() {
    console.log('devTriggerEndState called');
    console.log('Stars count:', gameState.stars.length);

    // Check if stars are initialized
    if (!gameState.stars || gameState.stars.length === 0) {
        console.error('Stars not initialized yet! Start the game first.');
        log('DEV: Stars not initialized - start game first!', 'warning');
        return;
    }

    // Mark all stars as analyzed with proper scan results
    gameState.stars.forEach((star, index) => {
        gameState.analyzedStars.add(index);

        // Check if this star has an alien contact
        const hasContact = ALIEN_CONTACTS.some(m => m.starIndex === index);

        if (hasContact) {
            gameState.scanResults.set(index, { type: 'verified_signal' });
            gameState.contactedStars.add(index);
        } else if (falsePositiveIndices.includes(index)) {
            const source = falsePositiveSources[Math.floor(Math.random() * falsePositiveSources.length)];
            gameState.scanResults.set(index, {
                type: 'false_positive',
                source: source
            });
        } else {
            const phenomenon = naturalPhenomena[Math.floor(Math.random() * naturalPhenomena.length)];
            gameState.scanResults.set(index, {
                type: 'natural_phenomena',
                phenomenonType: phenomenon.type,
                source: phenomenon.source
            });
        }
    });

    console.log('Analyzed stars:', gameState.analyzedStars.size);
    console.log('Scan results:', gameState.scanResults.size);
    console.log('Contacted stars:', gameState.contactedStars.size);

    if (showFinalReportFn) showFinalReportFn();
    log('DEV: Triggered final report', 'highlight');
}

// Expose dev functions to window for console access
if (typeof window !== 'undefined') {
    window.devLogState = devLogState;
    window.devTriggerEndState = devTriggerEndState;
}
