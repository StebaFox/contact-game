// ═════════════════════════════════════════════════════════════════════════════
// BOOT SEQUENCE
// Game startup animation and player name entry
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { showView, log } from './rendering.js';
import { playClick, playTypingBeep } from '../systems/audio.js';
import { BOOT_INITIAL, BOOT_CONTINUATION } from '../narrative/boot-messages.js';
import { WELCOME_EMAIL } from '../narrative/emails.js';
import { ALIEN_CONTACTS } from '../narrative/alien-contacts.js';
import { addMailMessage } from '../systems/mailbox.js';
import {
    hasSaveFile,
    loadSave,
    applySaveData,
    deleteSave,
    applyDayCode,
    isValidDayCode,
    getSaveInfo,
    autoSave
} from '../core/save-system.js';
import { getCurrentDayConfig, getDayBootMessages, DAY_CONFIG } from '../core/day-system.js';
import { updateStarCatalogDisplay } from './starmap.js';

// External function references (set by main.js to avoid circular deps)
let renderStarMapFn = null;
let playSecurityBeepFn = null;

export function setBootFunctions(fns) {
    renderStarMapFn = fns.renderStarMap;
    playSecurityBeepFn = fns.playSecurityBeep;
}

// Play typing sound (wrapper for consistency)
function playTypingSound() {
    playTypingBeep();
}

// Play security beep
function playSecurityBeep(type) {
    if (playSecurityBeepFn) playSecurityBeepFn(type);
}

// Type a single boot line
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

// Run the initial boot sequence
async function runBootSequence() {
    const bootLines = BOOT_INITIAL;

    for (const line of bootLines) {
        await typeBootLine(line.text, line.class, line.delay, line.beep);
    }

    // Show name input with beep
    playSecurityBeep('normal');
    document.getElementById('name-input-container').style.display = 'block';
    document.getElementById('name-input').focus();
}

// Continue boot sequence after name entry
function continueBootSequence(playerName) {
    gameState.playerName = playerName;

    const nameInputContainer = document.getElementById('name-input-container');
    nameInputContainer.style.display = 'none';

    // Replace {NAME} placeholder with actual player name
    const continuationLines = BOOT_CONTINUATION.map(line => ({
        ...line,
        text: line.text.replace('{NAME}', playerName)
    }));

    (async () => {
        for (const line of continuationLines) {
            await typeBootLine(line.text, line.class, line.delay, line.beep);
        }

        // Add day-specific boot messages
        const dayMessages = getDayBootMessages();
        if (dayMessages.length > 0) {
            await typeBootLine('', '', 200); // Small gap
            for (const msg of dayMessages) {
                await typeBootLine(msg, 'highlight', 150);
            }
        }

        // Show day indicator if not demo mode
        if (!gameState.demoMode && gameState.currentDay > 0) {
            const dayConfig = getCurrentDayConfig();
            await typeBootLine('', '', 200);
            await typeBootLine(`═══ ${dayConfig.title} ═══`, 'highlight', 200);
        }

        // Save the game state after name entry
        autoSave();

        // Show proceed button instead of auto-transitioning
        setTimeout(() => {
            const proceedBtn = document.getElementById('proceed-btn');
            proceedBtn.style.display = 'block';
            playSecurityBeep('success');
        }, 500);
    })();
}

// ─────────────────────────────────────────────────────────────────────────────
// Save/Resume System
// ─────────────────────────────────────────────────────────────────────────────

// Update start screen based on save file existence
function updateStartScreen() {
    const saveInfo = getSaveInfo();
    const startBtnContainer = document.getElementById('start-btn-container');

    if (!startBtnContainer) return;

    // Style for all menu buttons
    const menuButtonStyle = `
        display: block;
        width: 280px;
        margin: 10px auto;
        padding: 12px 20px;
        background: transparent;
        border: 2px solid #0f0;
        color: #0f0;
        font-family: 'VT323', monospace;
        font-size: 18px;
        cursor: pointer;
        text-shadow: 0 0 5px #0f0;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
        transition: all 0.2s;
    `;

    const secondaryButtonStyle = `
        display: block;
        width: 280px;
        margin: 10px auto;
        padding: 10px 20px;
        background: transparent;
        border: 1px solid #0a0;
        color: #0a0;
        font-family: 'VT323', monospace;
        font-size: 14px;
        cursor: pointer;
        text-shadow: 0 0 3px #0a0;
        transition: all 0.2s;
    `;

    // Update existing start button
    const startBtn = document.getElementById('start-btn');
    startBtn.style.cssText = menuButtonStyle;
    startBtn.textContent = 'NEW GAME';

    // Create additional buttons if save exists
    if (saveInfo) {
        if (!document.getElementById('resume-btn')) {
            const resumeBtn = document.createElement('button');
            resumeBtn.id = 'resume-btn';
            resumeBtn.className = 'btn';
            resumeBtn.innerHTML = `CONTINUE (Day ${saveInfo.currentDay} - ${saveInfo.progress}%)`;
            resumeBtn.style.cssText = menuButtonStyle;

            // Insert before start button
            startBtnContainer.insertBefore(resumeBtn, startBtn);

            resumeBtn.addEventListener('click', () => {
                playClick();
                fadeToBlackThen(() => resumeGame());
            });
        }
    }

    // Add demo mode button
    if (!document.getElementById('demo-btn')) {
        const demoBtn = document.createElement('button');
        demoBtn.id = 'demo-btn';
        demoBtn.className = 'btn';
        demoBtn.textContent = 'DEMO MODE';
        demoBtn.style.cssText = secondaryButtonStyle;
        startBtnContainer.appendChild(demoBtn);

        demoBtn.addEventListener('click', () => {
            playClick();
            applyDayCode('DEMO-000');
            gameState.playerName = 'RESEARCHER';
            // Demo mode skips boot, goes straight to starmap
            fadeToBlackThen(() => {
                loadDemoMode();
            }, true);
        });
    }

    // Add security access button (day codes)
    if (!document.getElementById('daycode-btn')) {
        const dayCodeBtn = document.createElement('button');
        dayCodeBtn.id = 'daycode-btn';
        dayCodeBtn.className = 'btn';
        dayCodeBtn.textContent = 'SECURITY ACCESS';
        dayCodeBtn.style.cssText = secondaryButtonStyle;
        startBtnContainer.appendChild(dayCodeBtn);

        dayCodeBtn.addEventListener('click', () => {
            playClick();
            showSecurityLogin();
        });
    }
}

// Fade to black transition
function fadeToBlackThen(callback, stayBlack = false) {
    const overlay = document.createElement('div');
    overlay.id = 'fade-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0;
        z-index: 9999;
        transition: opacity 0.5s ease-in;
    `;
    document.body.appendChild(overlay);

    // Trigger fade
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });

    // Execute callback after fade
    setTimeout(() => {
        callback();
        // Fade back in (unless stayBlack)
        if (!stayBlack) {
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 500);
            }, 100);
        } else {
            overlay.remove();
        }
    }, 500);
}

// Show the initialize system screen (black screen with button)
function showInitializeScreen() {
    // Hide start view
    showView('boot-view');

    // Clear boot output and hide name input
    document.getElementById('boot-output').innerHTML = '';
    document.getElementById('name-input-container').style.display = 'none';
    document.getElementById('proceed-btn').style.display = 'none';

    // Create initialize button container
    const initContainer = document.createElement('div');
    initContainer.id = 'init-screen';
    initContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-height: 400px;
    `;

    initContainer.innerHTML = `
        <button id="initialize-btn" style="
            background: transparent;
            border: 2px solid #0f0;
            color: #0f0;
            font-family: 'VT323', monospace;
            font-size: 24px;
            padding: 20px 50px;
            cursor: pointer;
            text-shadow: 0 0 10px #0f0;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
            animation: pulse-glow 2s ease-in-out infinite;
        ">
            INITIALIZE SYSTEM
        </button>
        <style>
            @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.3); }
                50% { box-shadow: 0 0 40px rgba(0, 255, 0, 0.6); }
            }
        </style>
    `;

    document.getElementById('boot-output').appendChild(initContainer);

    // Add click handler
    document.getElementById('initialize-btn').addEventListener('click', () => {
        playClick();
        initContainer.remove();
        runBootSequence();
    });
}

// Resume from saved game
function resumeGame() {
    const saveData = loadSave();
    if (!saveData) {
        console.error('SIGNAL: No save data found');
        return;
    }

    // Apply saved state
    applySaveData(saveData);

    // Update star catalog display for locked stars
    updateStarCatalogDisplay();

    // Skip boot sequence, go directly to starmap
    showView('starmap-view');
    document.getElementById('mailbox-btn').style.display = 'block';

    // Initialize starmap
    initializeStarmapSequence();

    log(`Welcome back, Dr. ${gameState.playerName}`, 'highlight');
    log(`Resuming Day ${gameState.currentDay} operations...`, 'info');
}

// Load a day directly (from day code) - skips boot, shows loading bar
function loadDayWithProgress() {
    // Mark previous days' stars as analyzed (they would have been scanned)
    markPreviousDaysAsScanned();

    // Update star catalog display
    updateStarCatalogDisplay();

    // Go directly to starmap with loading sequence
    showView('starmap-view');
    document.getElementById('mailbox-btn').style.display = 'block';

    // Initialize starmap with loading bar
    initializeStarmapSequence();

    // Log appropriate message based on day
    const dayConfig = getCurrentDayConfig();
    log(`Security clearance verified - ${gameState.playerName}`, 'highlight');
    log(`${dayConfig.title}`, 'info');
}

// False positive star indices (matches starmap.js)
const falsePositiveIndices = [4, 7, 9, 14, 18, 24, 27];

// Natural phenomena for random assignment
const naturalPhenomena = [
    { type: 'Pulsar radiation', source: 'Rotating neutron star' },
    { type: 'Solar flare activity', source: 'Stellar chromosphere' },
    { type: 'Magnetospheric emissions', source: 'Planetary magnetic field' },
    { type: 'Quasar background noise', source: 'Distant active galactic nucleus' },
    { type: 'Stellar wind interference', source: 'Coronal mass ejection' },
    { type: 'Interstellar medium scatter', source: 'Ionized hydrogen cloud' },
    { type: 'Binary star oscillation', source: 'Eclipsing binary system' },
    { type: 'Brown dwarf emissions', source: 'Sub-stellar object' }
];

// False positive sources
const falsePositiveSources = [
    'CLASSIFIED RECON SATELLITE (KH-11)',
    'GPS SATELLITE CONSTELLATION',
    'MICROWAVE TOWER HARMONIC',
    'AIRPORT RADAR INTERFERENCE',
    'TELEVISION BROADCAST HARMONIC'
];

// Mark all stars from previous days as analyzed with appropriate scan results
function markPreviousDaysAsScanned() {
    // Get all stars from days before the current day
    for (let day = 1; day < gameState.currentDay; day++) {
        const dayConfig = DAY_CONFIG[day];
        if (dayConfig && dayConfig.availableStars) {
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
        }
    }

    console.log(`SIGNAL: Marked ${gameState.analyzedStars.size} stars as analyzed from previous days`);
    console.log(`SIGNAL: Generated ${gameState.scanResults.size} scan results, ${gameState.contactedStars.size} contacts`);
}

// Load demo mode - all content unlocked, no boot sequence
function loadDemoMode() {
    // Update star catalog display (shows all stars)
    updateStarCatalogDisplay();

    // Go directly to starmap
    showView('starmap-view');
    document.getElementById('mailbox-btn').style.display = 'block';

    // Initialize starmap with loading bar
    initializeStarmapSequence();

    // Log demo mode message
    log('DEMO MODE ACTIVE', 'highlight');
    log('All star systems unlocked - explore freely', 'info');
}

// Show security login modal (high security access)
function showSecurityLogin() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'security-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.98);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    modal.innerHTML = `
        <div style="
            background: #000;
            border: 3px solid #f00;
            padding: 0;
            width: 420px;
            box-shadow: 0 0 50px rgba(255, 0, 0, 0.3), inset 0 0 30px rgba(255, 0, 0, 0.1);
        ">
            <!-- Header -->
            <div style="
                background: linear-gradient(180deg, #300 0%, #100 100%);
                border-bottom: 2px solid #f00;
                padding: 15px;
                text-align: center;
            ">
                <div style="color: #f00; font-size: 12px; letter-spacing: 3px; margin-bottom: 5px;">
                    ◆ RESTRICTED ACCESS ◆
                </div>
                <div style="color: #ff0; font-size: 22px; text-shadow: 0 0 10px #ff0; letter-spacing: 2px;">
                    SECURITY CLEARANCE REQUIRED
                </div>
            </div>

            <!-- Form -->
            <div style="padding: 25px;">
                <!-- Warning -->
                <div style="
                    background: rgba(255, 0, 0, 0.1);
                    border: 1px solid #f00;
                    padding: 10px;
                    margin-bottom: 20px;
                    text-align: center;
                ">
                    <div style="color: #f00; font-size: 11px;">
                        ⚠ UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE ⚠
                    </div>
                </div>

                <!-- Name field -->
                <div style="margin-bottom: 15px;">
                    <label style="color: #0f0; font-size: 12px; display: block; margin-bottom: 5px;">
                        OPERATOR ID:
                    </label>
                    <input type="text" id="security-name"
                        placeholder="Enter designation..."
                        maxlength="20"
                        style="
                            background: #001100;
                            border: 1px solid #0a0;
                            color: #0f0;
                            padding: 10px 15px;
                            font-family: 'VT323', monospace;
                            font-size: 18px;
                            width: 100%;
                            box-sizing: border-box;
                        "
                    />
                </div>

                <!-- Password field -->
                <div style="margin-bottom: 15px;">
                    <label style="color: #0f0; font-size: 12px; display: block; margin-bottom: 5px;">
                        ACCESS CODE:
                    </label>
                    <input type="text" id="security-code"
                        placeholder="XXXXX-###"
                        style="
                            background: #001100;
                            border: 1px solid #0a0;
                            color: #0f0;
                            padding: 10px 15px;
                            font-family: 'VT323', monospace;
                            font-size: 18px;
                            width: 100%;
                            box-sizing: border-box;
                            text-transform: uppercase;
                        "
                    />
                </div>

                <!-- Error message -->
                <div id="security-error" style="
                    color: #f00;
                    text-align: center;
                    min-height: 20px;
                    margin-bottom: 15px;
                    text-shadow: 0 0 5px #f00;
                "></div>

                <!-- Buttons -->
                <div style="display: flex; gap: 10px;">
                    <button id="security-submit" style="
                        flex: 1;
                        background: transparent;
                        border: 2px solid #0f0;
                        color: #0f0;
                        padding: 12px;
                        font-family: 'VT323', monospace;
                        font-size: 16px;
                        cursor: pointer;
                        text-shadow: 0 0 5px #0f0;
                    ">
                        AUTHENTICATE
                    </button>
                    <button id="security-cancel" style="
                        flex: 1;
                        background: transparent;
                        border: 1px solid #666;
                        color: #666;
                        padding: 12px;
                        font-family: 'VT323', monospace;
                        font-size: 16px;
                        cursor: pointer;
                    ">
                        ABORT
                    </button>
                </div>
            </div>

            <!-- Footer -->
            <div style="
                border-top: 1px solid #333;
                padding: 10px;
                text-align: center;
                background: rgba(0, 0, 0, 0.5);
            ">
                <div style="color: #444; font-size: 10px;">
                    Access codes issued at end of each operational day
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const nameInput = document.getElementById('security-name');
    const codeInput = document.getElementById('security-code');
    const errorDiv = document.getElementById('security-error');
    const submitBtn = document.getElementById('security-submit');
    const cancelBtn = document.getElementById('security-cancel');

    nameInput.focus();

    function attemptLogin() {
        const name = nameInput.value.trim();
        const code = codeInput.value.trim();

        if (!name) {
            errorDiv.textContent = 'ERROR: OPERATOR ID REQUIRED';
            nameInput.focus();
            return;
        }

        if (!code) {
            errorDiv.textContent = 'ERROR: ACCESS CODE REQUIRED';
            codeInput.focus();
            return;
        }

        if (isValidDayCode(code)) {
            playClick();
            // Set the player name from the login
            gameState.playerName = name;
            const result = applyDayCode(code);
            if (result.success) {
                modal.remove();
                // Skip boot sequence, go directly to starmap with loading bar
                fadeToBlackThen(() => {
                    loadDayWithProgress();
                }, true);
            }
        } else {
            errorDiv.textContent = 'ACCESS DENIED: INVALID CREDENTIALS';
            playClick();
        }
    }

    submitBtn.addEventListener('click', attemptLogin);

    cancelBtn.addEventListener('click', () => {
        playClick();
        modal.remove();
    });

    // Typing sounds for inputs
    nameInput.addEventListener('input', () => {
        playTypingSound();
    });

    codeInput.addEventListener('input', () => {
        playTypingSound();
    });

    // Tab between fields, Enter to submit
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            codeInput.focus();
        }
    });

    codeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            attemptLogin();
        }
    });

    // Close on escape
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.remove();
        }
    });
}

// Setup boot sequence event listeners
export function setupBootSequence() {
    // Check for save file and update start screen
    updateStartScreen();

    // Start button (new game)
    document.getElementById('start-btn').addEventListener('click', () => {
        playClick();
        // Delete any existing save for fresh start
        deleteSave();
        gameState.currentDay = 1;
        gameState.demoMode = false;
        // Fade to black, then show initialize button
        fadeToBlackThen(() => {
            showInitializeScreen();
        }, true); // stayBlack = true, we handle the view ourselves
    });

    // Note: Resume, Demo, and Security Access buttons are created dynamically
    // in updateStartScreen() with their own event listeners attached

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
            addMailMessage(WELCOME_EMAIL.from, WELCOME_EMAIL.subject, WELCOME_EMAIL.body);
        }, 3000);
    });
}

// Starmap initialization sequence
export function initializeStarmapSequence() {
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
    const scanSpeed = 5; // Slower for more visible effect

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
            if (renderStarMapFn) renderStarMapFn();
        }
    }

    drawScanEffect();
}
