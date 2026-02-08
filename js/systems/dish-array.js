// ═════════════════════════════════════════════════════════════════════════════
// DISH ARRAY SYSTEM
// Code-based dish alignment for weak signal stars
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { log } from '../ui/rendering.js';
import { playClick, playStaticBurst, playLockAchieved, playMachineSound, stopMachineSound, getMachineSoundDuration, playDishRotationSound, playDishAlignedSound, playDoorShutSound, getSfxVolume } from './audio.js';
import { STAR_NAMES, STAR_COORDINATES } from '../narrative/stars.js';
import { startRerouteMinigame } from './reroute-minigame.js';
import { addMailMessage } from './mailbox.js';
import { POWER_FAILURE_EMAIL } from '../narrative/emails.js';

// Track if malfunction has occurred this alignment (only trigger once per alignment)
let malfunctionTriggeredThisAlignment = false;

// Track if the player has seen their first malfunction (for budget email)
let firstMalfunctionEmailSent = false;

// Dish positions for full array view
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

// Initialize the dish array system
export function initDishArray() {
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
export function handleKeypadPress(key) {
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
export function alignDishesFromCode(code) {
    // Reset malfunction flag for this alignment
    malfunctionTriggeredThisAlignment = false;

    // Decide if a malfunction will occur (40% chance)
    const willMalfunction = Math.random() < 0.4;
    // Pick which dish index will malfunction (somewhere in the middle)
    const malfunctionIndex = willMalfunction
        ? 1 + Math.floor(Math.random() * (code.length - 2))
        : -1;

    startDishAlignmentSequence(code, 0, malfunctionIndex);
}

// Internal function to run the alignment sequence (can be resumed after malfunction)
function startDishAlignmentSequence(code, startIndex, malfunctionIndex) {
    // Reset malfunction flag when resuming after repair (malfunctionIndex === -1)
    if (malfunctionIndex === -1) {
        malfunctionTriggeredThisAlignment = false;
    }

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

    // Get actual sound duration and calculate per-dish timing to fit within it
    // Leave 500ms buffer at end so last dish is done before the clunk
    const remainingDishes = code.length - startIndex;
    const soundDuration = getMachineSoundDuration();
    const animationBudget = soundDuration - 500;
    const delayPerDish = Math.floor(animationBudget / remainingDishes);

    // Callback for when machine sound naturally finishes (the clunk)
    const noMalfunction = malfunctionIndex < startIndex || malfunctionIndex === -1;
    const onSoundEnded = noMalfunction ? () => finishAlignment() : null;

    // Play machine sound with end callback
    if (startIndex === 0) {
        playMachineSound(onSoundEnded);
        log('Initiating dish array alignment sequence...', 'highlight');
    } else {
        playMachineSound(onSoundEnded);
        log('Resuming dish alignment...', 'info');
    }

    // Animate telemetry values during alignment
    animateTelemetryDuringAlignment(soundDuration);

    // Flash each dish in sequence
    let delay = 0;
    for (let i = startIndex; i < code.length; i++) {
        const char = code[i];
        const dishIndex = i;

        setTimeout(() => {
            // Skip if malfunction already occurred (remaining dishes wait for repair)
            if (malfunctionTriggeredThisAlignment) return;

            // Find the dish with this label
            const dish = gameState.dishArray.dishes.find(d => d.label === char);
            if (!dish) return;

            // Always start the dish aligning (flashing green)
            dish.isAligning = true;
            renderStarmapArray();

            // Check if this dish should malfunction mid-alignment
            if (dishIndex === malfunctionIndex && !malfunctionTriggeredThisAlignment) {
                malfunctionTriggeredThisAlignment = true;
                // Let it flash green briefly, then fail
                setTimeout(() => {
                    dish.isAligning = false;
                    triggerDishMalfunction(code, dishIndex, char);
                }, 800);
                return;
            }

            // After rotation, mark as aligned with confirmation sound
            setTimeout(() => {
                dish.isAligning = false;
                dish.isAligned = true;
                renderStarmapArray();
                updateStarmapArrayStats();
                playDishAlignedSound();
            }, delayPerDish - 400);
        }, delay);
        delay += delayPerDish;
    }
}

// Trigger a dish malfunction and show reroute minigame
function triggerDishMalfunction(code, dishIndex, dishLabel) {
    stopMachineSound();
    playStaticBurst();
    playDoorShutSound();

    const statusEl = document.getElementById('starmap-array-status');
    const aligningTextEl = document.getElementById('array-aligning-text');

    // Hide aligning text
    if (aligningTextEl) aligningTextEl.style.display = 'none';

    log(`CRITICAL: Dish ${dishLabel} power circuit failure!`, 'warning');

    // Send the budget email after first malfunction (delayed so it arrives after the drama)
    if (!firstMalfunctionEmailSent) {
        firstMalfunctionEmailSent = true;
        setTimeout(() => {
            const body = POWER_FAILURE_EMAIL.body.replace(/{PLAYER_NAME}/g, gameState.playerName);
            addMailMessage(POWER_FAILURE_EMAIL.from, POWER_FAILURE_EMAIL.subject, body);
        }, 15000);
    }

    // Mark the dish as malfunctioning (flash red with X on the array map)
    const dish = gameState.dishArray.dishes.find(d => d.label === dishLabel);
    if (dish) {
        dish.isAligning = false;
        dish.isMalfunctioning = true;
    }
    renderStarmapArray();

    // Flash the dish red a few times
    let flashCount = 0;
    const flashInterval = setInterval(() => {
        flashCount++;
        if (dish) dish.malfunctionFlash = flashCount % 2 === 0;
        renderStarmapArray();

        if (flashCount >= 6) {
            clearInterval(flashInterval);
            if (dish) dish.malfunctionFlash = false;
            renderStarmapArray();

            // Update status after flashing
            if (statusEl) {
                statusEl.textContent = `⚠ DISH ${dishLabel} POWER FAILURE`;
                statusEl.className = 'starmap-array-status';
                statusEl.style.color = '#f00';
            }

            // Show malfunction popup after flash sequence
            showMalfunctionPopup(code, dishIndex, dishLabel);
        }
    }, 200);
}

// Show malfunction popup with START REPAIR button
function showMalfunctionPopup(code, dishIndex, dishLabel) {
    const statusEl = document.getElementById('starmap-array-status');

    const popup = document.createElement('div');
    popup.id = 'malfunction-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        border: 2px solid #f00;
        background: rgba(0, 0, 0, 0.95);
        padding: 0;
        width: 360px;
        max-width: 90vw;
        box-shadow: 0 0 40px rgba(255, 0, 0, 0.5);
        font-family: 'VT323', monospace;
        animation: popupAppear 0.3s ease-out;
    `;

    popup.innerHTML = `
        <div style="
            background: linear-gradient(180deg, #300 0%, #100 100%);
            border-bottom: 2px solid #f00;
            padding: 12px 15px;
            text-align: center;
        ">
            <div style="color: #f00; font-size: 12px; letter-spacing: 3px; animation: blink 0.5s infinite;">
                ⚠ CRITICAL ALERT ⚠
            </div>
            <div style="color: #ff0; font-size: 20px; margin-top: 6px; text-shadow: 0 0 10px #ff0;">
                DISH ${dishLabel} - POWER FAILURE
            </div>
        </div>
        <div style="padding: 15px; text-align: center;">
            <div style="color: #f80; font-size: 14px; margin-bottom: 8px;">
                Circuit breaker tripped during alignment.
            </div>
            <div style="color: #aaa; font-size: 12px; margin-bottom: 15px;">
                Power must be manually rerouted to restore<br>
                dish ${dishLabel} before alignment can continue.
            </div>
            <button id="malfunction-repair-btn" style="
                background: transparent;
                border: 2px solid #f00;
                color: #f00;
                font-family: 'VT323', monospace;
                font-size: 18px;
                padding: 10px 30px;
                cursor: pointer;
                letter-spacing: 2px;
                transition: all 0.2s;
            ">
                BEGIN REPAIR
            </button>
        </div>
        <style>
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
            @keyframes popupAppear {
                from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            #malfunction-repair-btn:hover {
                background: rgba(255, 0, 0, 0.2);
                box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
            }
        </style>
    `;

    document.body.appendChild(popup);

    // Play alarm beep in sync with the 0.5s blink animation
    const alarmInterval = setInterval(() => {
        // Stop if popup was removed
        if (!document.getElementById('malfunction-popup')) {
            clearInterval(alarmInterval);
            return;
        }
        try {
            const vol = getSfxVolume();
            const actx = new (window.AudioContext || window.webkitAudioContext)();
            // Two-tone alarm beep (high-low)
            [620, 440].forEach((freq, i) => {
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.frequency.value = freq;
                osc.type = 'square';
                const t = actx.currentTime + i * 0.08;
                gain.gain.setValueAtTime(0.06 * vol, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
                osc.start(t);
                osc.stop(t + 0.07);
            });
            // Close context after beep finishes
            setTimeout(() => actx.close().catch(() => {}), 300);
        } catch (e) { /* audio not available */ }
    }, 500);

    // Handle repair button click
    document.getElementById('malfunction-repair-btn').addEventListener('click', () => {
        clearInterval(alarmInterval);
        playClick();
        popup.remove();

        // Clear malfunction visual on dish
        const dish = gameState.dishArray.dishes.find(d => d.label === dishLabel);
        if (dish) dish.isMalfunctioning = false;
        renderStarmapArray();

        // Launch the reroute minigame
        startRerouteMinigame(
            dishLabel,
            // On success - resume alignment from the malfunctioning dish
            () => {
                log(`Dish ${dishLabel} repaired - resuming alignment`, 'highlight');
                if (statusEl) statusEl.style.color = '';
                startDishAlignmentSequence(code, dishIndex, -1);
            },
            // On cancel/fail - stop alignment entirely, dish stays broken
            () => {
                log(`Dish ${dishLabel} repair aborted - alignment halted`, 'warning');

                // Restore malfunctioning state on the dish
                const abortedDish = gameState.dishArray.dishes.find(d => d.label === dishLabel);
                if (abortedDish) abortedDish.isMalfunctioning = true;

                // Clear alignment-in-progress flag
                gameState.dishArray.alignmentInProgress = false;

                // Reset status
                if (statusEl) {
                    statusEl.textContent = `⚠ DISH ${dishLabel} POWER FAILURE`;
                    statusEl.style.color = '#f00';
                }

                // Hide aligning text
                const aligningTextEl = document.getElementById('array-aligning-text');
                if (aligningTextEl) aligningTextEl.style.display = 'none';

                // Stop machine sound if still playing
                stopMachineSound();

                // Re-show the malfunction popup so player can try repair again
                renderStarmapArray();
                showMalfunctionPopup(code, dishIndex, dishLabel);
            }
        );
    });
}

// Finish the alignment sequence (called when machine sound ends)
function finishAlignment() {
    const statusEl = document.getElementById('starmap-array-status');
    const codeSectionEl = document.getElementById('array-code-section');
    const aligningTextEl = document.getElementById('array-aligning-text');

    // Hide the flashing text
    if (aligningTextEl) aligningTextEl.style.display = 'none';

    // Hide the entire code section since alignment is complete
    if (codeSectionEl) codeSectionEl.style.display = 'none';
    log('Dish array alignment complete', 'success');

    // Play acknowledgement sound immediately — the clunk just played
    playLockAchieved();

    // Clear the flag so button can now appear
    gameState.dishArray.alignmentInProgress = false;

    // Show status and scan button
    if (statusEl) {
        statusEl.textContent = 'ARRAY ALIGNED - READY FOR SCAN';
        statusEl.className = 'starmap-array-status ready';
    }
    updateArrayStatus();
    updateStarmapArrayStats();
}

// Set up alignment code for a weak signal star
export function setupAlignmentCode(star) {
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
        codeDisplay.style.display = 'block';
    }
    if (keypadEl) keypadEl.style.display = 'grid';
    if (confirmedEl) confirmedEl.style.display = 'none';

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
export function clearAlignmentCode() {
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
export function updateTelemetry(star) {
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
    const starIndex = STAR_NAMES.indexOf(star.name);
    let ra, dec;

    if (starIndex >= 0 && STAR_COORDINATES[starIndex]) {
        // Use real astronomical coordinates
        ra = STAR_COORDINATES[starIndex].ra;
        dec = STAR_COORDINATES[starIndex].dec;
    } else {
        // Fallback to generated coordinates if not found
        const hash = star.name.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
        ra = { h: Math.abs(hash % 24), m: Math.abs((hash >> 4) % 60), s: Math.abs((hash >> 8) % 60) };
        dec = { deg: (Math.abs(hash % 180) - 90), m: Math.abs((hash >> 6) % 60), s: Math.abs((hash >> 10) % 60) };
    }

    // Calculate azimuth/elevation based on RA/DEC (simplified approximation)
    const az = Math.abs((ra.h * 15 + ra.m / 4) % 360);
    const el = Math.max(0, Math.min(90, 90 - Math.abs(dec.deg)));

    if (targetEl) targetEl.textContent = star.name.substring(0, 16);
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
    const starIndex = STAR_NAMES.indexOf(star.name);
    let targetAz, targetElev;

    if (starIndex >= 0 && STAR_COORDINATES[starIndex]) {
        const ra = STAR_COORDINATES[starIndex].ra;
        const dec = STAR_COORDINATES[starIndex].dec;
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
export function resetTelemetry() {
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

// Render the full dish array (for dish array panel)
export function renderDishArray() {
    const dishGroup = document.getElementById('dish-group');
    if (!dishGroup) return;

    dishGroup.innerHTML = '';

    gameState.dishArray.dishes.forEach(dish => {
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

        // Status indicator (aligned/offline)
        const statusLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        statusLabel.setAttribute('class', 'dish-power-cost');
        statusLabel.setAttribute('y', 48);
        statusLabel.setAttribute('fill', dish.isAligned ? '#0f0' : '#666');
        statusLabel.setAttribute('font-size', '9');
        statusLabel.setAttribute('text-anchor', 'middle');
        statusLabel.textContent = dish.isAligned ? 'ONLINE' : 'OFFLINE';

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
        g.appendChild(statusLabel);

        // Click handler - clear interference if needed
        g.addEventListener('click', (e) => {
            if (dish.hasInterference) {
                clearDishInterference(dish);
            }
        });

        dishGroup.appendChild(g);
    });

    // Also render the starmap panel version
    renderStarmapArray();
}

// Render the compact array in the starmap view (left panel)
export function renderStarmapArray() {
    const dishGroup = document.getElementById('starmap-dish-group');
    if (!dishGroup) return;

    dishGroup.innerHTML = '';

    // Scaled positions for the smaller SVG (200x200 viewBox)
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
        if (dish.isMalfunctioning) classes += ' malfunctioning';
        else if (dish.isAligning) classes += ' aligning';
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

        // Override colors for malfunctioning dish
        if (dish.isMalfunctioning) {
            const fillOpacity = dish.malfunctionFlash ? 0.6 : 0.3;
            base.setAttribute('fill', `rgba(255, 0, 0, ${fillOpacity})`);
            base.setAttribute('stroke', '#f00');
            base.setAttribute('stroke-width', '2');
        }

        // Dish bowl (smaller)
        const bowl = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        bowl.setAttribute('class', 'dish-bowl');
        bowl.setAttribute('cx', 0);
        bowl.setAttribute('cy', -10);
        bowl.setAttribute('rx', 12);
        bowl.setAttribute('ry', 6);

        // Override colors for malfunctioning dish
        if (dish.isMalfunctioning) {
            const fillOpacity = dish.malfunctionFlash ? 0.5 : 0.2;
            bowl.setAttribute('fill', `rgba(255, 0, 0, ${fillOpacity})`);
            bowl.setAttribute('stroke', '#f00');
            bowl.setAttribute('stroke-width', '2');
        }

        // Label (inside the base box)
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('class', 'dish-label');
        label.setAttribute('y', 8);
        label.textContent = dish.label;

        if (dish.isMalfunctioning) {
            label.setAttribute('fill', '#f00');
        }

        g.appendChild(base);
        g.appendChild(bowl);
        g.appendChild(label);

        // Red X overlay for malfunctioning dish (always visible)
        if (dish.isMalfunctioning) {
            const xColor = dish.malfunctionFlash ? '#ff4444' : '#f00';
            const x1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            x1.setAttribute('x1', -10);
            x1.setAttribute('y1', -16);
            x1.setAttribute('x2', 10);
            x1.setAttribute('y2', 4);
            x1.setAttribute('stroke', xColor);
            x1.setAttribute('stroke-width', '3');
            g.appendChild(x1);

            const x2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            x2.setAttribute('x1', 10);
            x2.setAttribute('y1', -16);
            x2.setAttribute('x2', -10);
            x2.setAttribute('y2', 4);
            x2.setAttribute('stroke', xColor);
            x2.setAttribute('stroke-width', '3');
            g.appendChild(x2);
        }

        dishGroup.appendChild(g);
    });

    // Update starmap array stats
    updateStarmapArrayStats();
}

// Update the starmap array stats display
export function updateStarmapArrayStats() {
    const alignedCount = gameState.dishArray.dishes.filter(d => d.isAligned).length;
    const codeLength = gameState.dishArray.alignmentCode.length;
    const star = gameState.dishArray.currentTargetStar;

    // Update stats display
    const boostEl = document.getElementById('starmap-array-boost');
    const statusEl = document.getElementById('starmap-array-status');
    const scanBtn = document.getElementById('starmap-array-scan-btn');

    if (boostEl) boostEl.textContent = calculateSignalBoost().toFixed(1) + 'x';

    // Status is managed by code input flow, only update if not in code mode
    // Only show default "select target" text when no star is selected at all
    if (statusEl && !gameState.dishArray.codeRequired) {
        if (!star && !gameState.currentStar) {
            statusEl.textContent = 'SELECT TARGET';
            statusEl.className = 'starmap-array-status';
            statusEl.style.color = '';
        }
    }

    // Show/hide scan button based on alignment for weak signals
    // (non-weak stars manage this button in selectStar directly)
    if (scanBtn && codeLength > 0) {
        if (star && alignedCount >= codeLength && !gameState.dishArray.alignmentInProgress) {
            scanBtn.style.display = 'block';
        } else {
            scanBtn.style.display = 'none';
        }
    }
}

// Render mini dish array (for tuning panel)
export function renderMiniDishArray() {
    const container = document.getElementById('mini-array-visual');
    if (!container) return;

    container.innerHTML = '';

    gameState.dishArray.dishes.forEach(dish => {
        let classes = 'mini-dish';
        if (dish.hasInterference) classes += ' interference';
        else if (dish.isRotating) classes += ' rotating';
        else if (dish.isAligned) classes += ' aligned';

        const div = document.createElement('div');
        div.className = classes;
        div.dataset.dishId = dish.id;
        div.textContent = dish.hasInterference ? 'X' : dish.label;
        div.title = dish.hasInterference ? 'Interference detected' :
                    dish.isAligned ? 'Aligned to target' :
                    'Offline';
        container.appendChild(div);
    });

    // Update counts - show aligned dishes
    const alignedCount = gameState.dishArray.dishes.filter(d => d.isAligned).length;
    const totalDishes = gameState.dishArray.dishes.length;

    const miniAligned = document.getElementById('mini-aligned');
    const miniTotal = document.getElementById('mini-total');
    const tuningBoost = document.getElementById('tuning-boost-value');

    if (miniAligned) miniAligned.textContent = alignedCount;
    if (miniTotal) miniTotal.textContent = totalDishes;
    if (tuningBoost) tuningBoost.textContent = calculateSignalBoost().toFixed(1) + 'x';
}

// Start dish rotation (used by alignment code system)
function startDishRotation(dishId) {
    const dish = gameState.dishArray.dishes.find(d => d.id === dishId);
    if (!dish || dish.isRotating) return;

    const targetStar = gameState.dishArray.currentTargetStar;
    if (!targetStar) {
        log('No target star selected for array alignment', 'warning');
        return;
    }

    // If dish has interference, skip it
    if (dish.hasInterference) {
        log(`Dish ${dish.label} has interference - cannot align`, 'warning');
        return;
    }

    // If already aligned, do nothing
    if (dish.isAligned) return;

    // Start rotating to target
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

// Clear dish interference
function clearDishInterference(dish) {
    log(`Clearing interference on Dish ${dish.label}...`, 'warning');
    playStaticBurst();

    // Visual feedback - show clearing
    dish.isRotating = true;
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

// Animate dish rotation
function animateDishRotation(dish) {
    const rotationDuration = 2000 + Math.random() * 1000;
    const startAngle = dish.angle || 0;
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

// Set array target (called when selecting a weak signal star)
export function setArrayTarget(star) {
    if (!star || star.signalStrength !== 'weak') return;

    // Use the code-based alignment system
    setupAlignmentCode(star);
}

// Update array status
export function updateArrayStatus() {
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

// Align all dishes at once
export function alignAllDishes() {
    if (!gameState.dishArray.currentTargetStar) return;

    const unaligned = gameState.dishArray.dishes.filter(d => !d.isAligned && !d.isRotating);

    // Stagger the rotations for visual effect
    unaligned.forEach((dish, index) => {
        setTimeout(() => {
            startDishRotation(dish.id);
        }, index * 300);
    });
}

// Reset array
export function resetArray() {
    // Reset all dishes
    gameState.dishArray.dishes.forEach(dish => {
        dish.isAligned = false;
        dish.isAligning = false;
    });

    clearAlignmentCode();
    renderStarmapArray();

    log('Array reset');
}

// Calculate signal boost based on aligned dishes
export function calculateSignalBoost() {
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

// Check if weak signal can be tuned
export function canTuneWeakSignal() {
    const star = gameState.currentStar;
    if (!star || star.signalStrength !== 'weak') return true;

    // Check if all required dishes are aligned (based on code length)
    const codeLength = gameState.dishArray.alignmentCode.length;
    const alignedCount = gameState.dishArray.dishes.filter(d => d.isAligned).length;
    return alignedCount >= codeLength;
}
