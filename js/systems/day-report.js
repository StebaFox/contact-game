// ═════════════════════════════════════════════════════════════════════════════
// DAY REPORT SYSTEM
// End-of-day summaries and day transitions
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { showView, log } from '../ui/rendering.js';
import { playClick, playSecurityBeep } from './audio.js';
import { autoSave } from '../core/save-system.js';
import { getDayProgress, advanceDay, DAY_CONFIG, checkDayComplete } from '../core/day-system.js';
import { startFinalAlignment } from './alignment-minigame.js';
import { showFinalMessage } from '../narrative/final-message.js';
import { addMailMessage } from './mailbox.js';
import { ROSS128_DECRYPT_EMAIL } from '../narrative/emails.js';

// ─────────────────────────────────────────────────────────────────────────────
// Check Day Completion
// ─────────────────────────────────────────────────────────────────────────────

export function checkAndShowDayComplete() {
    // Don't check in demo mode
    if (gameState.demoMode || gameState.currentDay === 0) {
        return false;
    }

    // Check if current day is complete
    if (!checkDayComplete()) {
        return false;
    }

    // Don't show again if already shown for this day
    if (gameState.dayReportShown === gameState.currentDay) {
        return false;
    }

    // Mark that we've shown the report for this day
    gameState.dayReportShown = gameState.currentDay;

    // Show the day complete popup after a brief delay
    setTimeout(() => {
        showDayCompletePopup();
    }, 1500);

    return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Day Complete Popup
// ─────────────────────────────────────────────────────────────────────────────

function showDayCompletePopup() {
    const dayConfig = DAY_CONFIG[gameState.currentDay];
    if (!dayConfig) return;

    playSecurityBeep('success');

    const overlay = document.createElement('div');
    overlay.id = 'day-complete-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'VT323', monospace;
    `;

    overlay.innerHTML = `
        <div style="
            border: 2px solid #0f0;
            background: #000;
            padding: 30px 50px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 0 50px rgba(0, 255, 0, 0.3);
        ">
            <div style="color: #0f0; font-size: 14px; letter-spacing: 3px; margin-bottom: 10px;">
                SURVEY COMPLETE
            </div>
            <div style="color: #fff; font-size: 28px; text-shadow: 0 0 15px #0f0; margin-bottom: 20px;">
                ${dayConfig.title}
            </div>
            <div style="color: #0ff; font-size: 16px; margin-bottom: 30px;">
                All assigned targets have been analyzed.<br>
                Prepare daily report for transmission.
            </div>
            <button id="send-day-report-btn" style="
                background: transparent;
                border: 2px solid #0f0;
                color: #0f0;
                font-family: 'VT323', monospace;
                font-size: 20px;
                padding: 15px 40px;
                cursor: pointer;
                text-shadow: 0 0 10px #0f0;
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
                animation: pulse-glow 2s ease-in-out infinite;
            ">
                SEND FINAL REPORT
            </button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('send-day-report-btn').addEventListener('click', () => {
        playClick();
        overlay.remove();
        showDayReport();
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Day Report Display
// ─────────────────────────────────────────────────────────────────────────────

function showDayReport() {
    const report = generateDayReport();

    const overlay = document.createElement('div');
    overlay.id = 'day-report-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 9000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'VT323', monospace;
        overflow-y: auto;
        padding: 20px;
    `;

    overlay.innerHTML = `
        <div style="
            border: 2px solid #0f0;
            background: #000;
            max-width: 700px;
            width: 100%;
            box-shadow: 0 0 50px rgba(0, 255, 0, 0.3);
            position: relative;
            z-index: 1;
        ">
            <!-- Header -->
            <div style="
                background: linear-gradient(180deg, #020 0%, #010 100%);
                border-bottom: 2px solid #0f0;
                padding: 15px 20px;
            ">
                <div style="color: #0f0; font-size: 12px; letter-spacing: 2px;">
                    SETI INSTITUTE - DAILY OPERATIONS REPORT
                </div>
                <div style="color: #fff; font-size: 22px; text-shadow: 0 0 10px #0f0; margin-top: 5px;">
                    ${report.title}
                </div>
                <div style="color: #0ff; font-size: 14px; margin-top: 5px;">
                    Submitted by: Dr. ${gameState.playerName}
                </div>
            </div>

            <!-- Report Body -->
            <div style="padding: 20px; max-height: 400px; overflow-y: auto;">
                ${report.content}
            </div>

            <!-- Footer -->
            <div style="
                border-top: 2px solid #0f0;
                padding: 15px 20px;
                text-align: center;
            ">
                <div style="color: #0ff; font-size: 14px; margin-bottom: 15px;">
                    ${report.footer}
                </div>
                <button id="continue-to-next-day-btn" style="
                    background: transparent;
                    border: 2px solid #0f0;
                    color: #0f0;
                    font-family: 'VT323', monospace;
                    font-size: 18px;
                    padding: 12px 35px;
                    cursor: pointer;
                    text-shadow: 0 0 10px #0f0;
                ">
                    ${report.buttonText}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('continue-to-next-day-btn').addEventListener('click', () => {
        playClick();
        overlay.remove();
        transitionToNextDay();
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Generate Report Content
// ─────────────────────────────────────────────────────────────────────────────

function generateDayReport() {
    const day = gameState.currentDay;
    const dayConfig = DAY_CONFIG[day];

    // Count results for this day
    let naturalCount = 0;
    let falsePositiveCount = 0;
    let verifiedCount = 0;
    const verifiedStars = [];

    dayConfig.availableStars.forEach(starIndex => {
        const result = gameState.scanResults.get(starIndex);
        if (result) {
            if (result.type === 'natural') naturalCount++;
            else if (result.type === 'false_positive') falsePositiveCount++;
            else if (result.type === 'verified_signal') {
                verifiedCount++;
                const star = gameState.stars[starIndex];
                if (star) verifiedStars.push(star.name);
            }
        }
    });

    // Day-specific reports
    if (day === 1) {
        return generateDay1Report(naturalCount, falsePositiveCount, verifiedCount, verifiedStars);
    } else if (day === 2) {
        return generateDay2Report(naturalCount, falsePositiveCount, verifiedCount, verifiedStars);
    } else if (day === 3) {
        return generateDay3Report(naturalCount, falsePositiveCount, verifiedCount, verifiedStars);
    }

    return {
        title: `DAY ${day} REPORT`,
        content: '<p>Survey complete.</p>',
        footer: 'Proceed to next day.',
        buttonText: 'CONTINUE'
    };
}

function generateDay1Report(natural, falsePos, verified, verifiedStars) {
    const hasAnomalous = verified > 0;
    const starList = verifiedStars.length > 0
        ? verifiedStars.map(s => `<span style="color: #0f0;">&#8226; ${s}</span>`).join('<br>')
        : '<span style="color: #666;">None detected</span>';

    let statusText;
    if (hasAnomalous) {
        statusText = `
            <div style="color: #ff0; font-size: 16px; margin-top: 15px; padding: 10px; border: 1px solid #ff0; background: rgba(255, 255, 0, 0.1);">
                ⚠ ANOMALOUS SIGNAL DETECTED ⚠<br>
                <span style="font-size: 14px; color: #0ff;">
                    Signal characteristics inconsistent with known phenomena.<br>
                    Recommend elevated analysis protocols.
                </span>
            </div>
        `;
    } else {
        statusText = `
            <div style="color: #0f0; margin-top: 15px; padding: 10px; border: 1px solid #030;">
                All signals classified. No anomalies requiring follow-up.
            </div>
        `;
    }

    return {
        title: 'DAY 1: ROUTINE SURVEY - COMPLETE',
        content: `
            <div style="color: #0f0; font-size: 16px; margin-bottom: 15px;">
                SURVEY SUMMARY
            </div>
            <table style="width: 100%; color: #0ff; font-size: 14px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0;">Stars Analyzed:</td>
                    <td style="text-align: right;">${natural + falsePos + verified} / 10</td>
                </tr>
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0;">Natural Phenomena:</td>
                    <td style="text-align: right;">${natural}</td>
                </tr>
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0;">False Positives (Terrestrial):</td>
                    <td style="text-align: right;">${falsePos}</td>
                </tr>
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0; color: #ff0;">Anomalous Signals:</td>
                    <td style="text-align: right; color: #ff0;">${verified}</td>
                </tr>
            </table>

            <div style="color: #0f0; font-size: 16px; margin: 20px 0 10px 0;">
                VERIFIED EXTRASOLAR SIGNALS
            </div>
            <div style="color: #0ff; font-size: 14px; line-height: 1.8;">
                ${starList}
            </div>

            ${statusText}
        `,
        footer: 'Report ready for transmission.',
        buttonText: 'SUBMIT REPORT'
    };
}

function generateDay2Report(natural, falsePos, verified, verifiedStars) {
    const hasDecrypted = gameState.decryptionComplete;
    const starList = verifiedStars.length > 0
        ? verifiedStars.map(s => `<span style="color: #0f0;">&#8226; ${s}</span>`).join('<br>')
        : '<span style="color: #666;">None detected</span>';

    let decryptStatus;
    if (hasDecrypted) {
        decryptStatus = `
            <div style="color: #0f0; font-size: 16px; margin-top: 15px; padding: 10px; border: 1px solid #0f0; background: rgba(0, 255, 0, 0.1);">
                ✓ QUANTUM DECRYPTION SUCCESSFUL<br>
                <span style="font-size: 14px; color: #0ff;">
                    Signal content decoded. First contact protocols initiated.<br>
                    Multiple civilizations confirmed. Coordinate data received.
                </span>
            </div>
        `;
    } else {
        decryptStatus = `
            <div style="color: #ff0; margin-top: 15px; padding: 10px; border: 1px solid #ff0;">
                Decryption pending - encrypted signal requires analysis.
            </div>
        `;
    }

    return {
        title: 'DAY 2: VERIFICATION PROTOCOLS - COMPLETE',
        content: `
            <div style="color: #0f0; font-size: 16px; margin-bottom: 15px;">
                SURVEY SUMMARY
            </div>
            <table style="width: 100%; color: #0ff; font-size: 14px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0;">Stars Analyzed:</td>
                    <td style="text-align: right;">${natural + falsePos + verified} / 10</td>
                </tr>
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0;">Natural Phenomena:</td>
                    <td style="text-align: right;">${natural}</td>
                </tr>
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0;">False Positives:</td>
                    <td style="text-align: right;">${falsePos}</td>
                </tr>
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0; color: #0f0;">Verified Contacts:</td>
                    <td style="text-align: right; color: #0f0;">${verified}</td>
                </tr>
            </table>

            <div style="color: #0f0; font-size: 16px; margin: 20px 0 10px 0;">
                CONFIRMED EXTRASOLAR CONTACTS
            </div>
            <div style="color: #0ff; font-size: 14px; line-height: 1.8;">
                ${starList}
            </div>

            ${decryptStatus}

            <div style="color: #f0f; font-size: 14px; margin-top: 15px; padding: 10px; border: 1px solid #f0f; background: rgba(255, 0, 255, 0.1);">
                CMB ANOMALY DETECTED<br>
                <span style="font-size: 13px;">Triangulation data received from contacts.</span>
            </div>
        `,
        footer: 'Report ready for transmission.',
        buttonText: 'SUBMIT REPORT'
    };
}

function generateDay3Report(natural, falsePos, verified, verifiedStars) {
    const starList = verifiedStars.length > 0
        ? verifiedStars.map(s => `<span style="color: #0f0;">&#8226; ${s}</span>`).join('<br>')
        : '<span style="color: #666;">None detected</span>';

    return {
        title: 'DAY 3: COSMIC TRIANGULATION - COMPLETE',
        content: `
            <div style="color: #0f0; font-size: 16px; margin-bottom: 15px;">
                FINAL SURVEY SUMMARY
            </div>
            <table style="width: 100%; color: #0ff; font-size: 14px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0;">Stars Analyzed:</td>
                    <td style="text-align: right;">${natural + falsePos + verified} / 8</td>
                </tr>
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0;">Natural Phenomena:</td>
                    <td style="text-align: right;">${natural}</td>
                </tr>
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0;">Verified Contacts:</td>
                    <td style="text-align: right; color: #0f0;">${verified}</td>
                </tr>
            </table>

            <div style="color: #0f0; font-size: 16px; margin: 20px 0 10px 0;">
                NETWORK CONTACTS
            </div>
            <div style="color: #0ff; font-size: 14px; line-height: 1.8;">
                ${starList}
            </div>

            <div style="color: #f0f; font-size: 16px; margin-top: 20px; padding: 15px; border: 2px solid #f0f; background: rgba(255, 0, 255, 0.1); text-align: center;">
                ALL TRIANGULATION DATA COLLECTED<br>
                <span style="font-size: 14px; color: #0ff;">
                    Coordinates locked. Preparing final alignment sequence.
                </span>
            </div>
        `,
        footer: 'The origin point awaits. Initiate final sequence.',
        buttonText: 'BEGIN FINAL SEQUENCE'
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Day Transition
// ─────────────────────────────────────────────────────────────────────────────

function transitionToNextDay() {
    const currentDay = gameState.currentDay;

    // Mark current day as complete
    if (!gameState.daysCompleted.includes(currentDay)) {
        gameState.daysCompleted.push(currentDay);
    }

    if (currentDay >= 3) {
        // Day 3 complete - trigger final sequence
        triggerFinalSequence();
        return;
    }

    // Show authorization screen before advancing
    showAuthorizationScreen(currentDay);
}

function showAuthorizationScreen(completedDay) {
    playSecurityBeep('warning');

    const authMessages = {
        1: {
            title: 'PRIORITY STATUS UPGRADE',
            message: 'Your anomalous signal detection has been verified.<br>Clearance elevated to Level 5.',
            protocol: 'SIGMA PROTOCOL AUTHORIZED',
            accessCode: 'SIGMA-042',
            buttonText: 'PROCEED TO DAY 2'
        },
        2: {
            title: 'MAXIMUM CLEARANCE GRANTED',
            message: 'Decryption successful. Multiple contacts confirmed.<br>Clearance elevated to Level 6.',
            protocol: 'OMEGA PROTOCOL AUTHORIZED',
            accessCode: 'OMEGA-137',
            buttonText: 'PROCEED TO DAY 3'
        }
    };

    const auth = authMessages[completedDay] || authMessages[1];

    const overlay = document.createElement('div');
    overlay.id = 'authorization-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 9000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'VT323', monospace;
    `;

    overlay.innerHTML = `
        <div style="
            border: 2px solid #ff0;
            background: #000;
            padding: 40px 60px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 0 50px rgba(255, 255, 0, 0.3);
            position: relative;
            z-index: 1;
        ">
            <div style="color: #ff0; font-size: 12px; letter-spacing: 3px; margin-bottom: 10px;">
                ◆ INCOMING TRANSMISSION ◆
            </div>
            <div style="color: #fff; font-size: 28px; text-shadow: 0 0 15px #ff0; margin-bottom: 20px;">
                ${auth.title}
            </div>
            <div style="color: #0ff; font-size: 16px; margin-bottom: 25px; line-height: 1.6;">
                ${auth.message}
            </div>
            <div style="color: #0f0; font-size: 18px; margin-bottom: 15px; padding: 15px; border: 1px solid #0f0; background: rgba(0, 255, 0, 0.1);">
                ${auth.protocol}
            </div>
            <div style="color: #0ff; font-size: 14px; margin-bottom: 25px; padding: 10px; border: 1px dashed #0ff; background: rgba(0, 255, 255, 0.05);">
                NEW ACCESS CODE: <span style="color: #ff0; font-size: 18px; letter-spacing: 2px;">${auth.accessCode}</span>
            </div>
            <button id="proceed-authorization-btn" style="
                background: transparent;
                border: 2px solid #0f0;
                color: #0f0;
                font-family: 'VT323', monospace;
                font-size: 20px;
                padding: 15px 40px;
                cursor: pointer;
                text-shadow: 0 0 10px #0f0;
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
                animation: pulse-glow 2s ease-in-out infinite;
            ">
                ${auth.buttonText}
            </button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('proceed-authorization-btn').addEventListener('click', () => {
        playClick();
        overlay.remove();

        // Now advance to next day
        gameState.currentDay = completedDay + 1;
        autoSave();

        // Show transition screen
        showDayTransition();
    });
}

function showDayTransition() {
    const nextDayConfig = DAY_CONFIG[gameState.currentDay];
    if (!nextDayConfig) return;

    const overlay = document.createElement('div');
    overlay.id = 'day-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 9000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'VT323', monospace;
    `;

    overlay.innerHTML = `
        <div style="color: #0f0; font-size: 14px; letter-spacing: 3px; margin-bottom: 20px; opacity: 0.7;">
            [ NEXT SHIFT ]
        </div>
        <div style="color: #fff; font-size: 36px; text-shadow: 0 0 20px #0f0; margin-bottom: 15px;">
            ${nextDayConfig.title}
        </div>
        <div style="color: #0ff; font-size: 18px; margin-bottom: 40px;">
            ${nextDayConfig.subtitle}
        </div>
        <div style="color: #0f0; font-size: 14px; opacity: 0.8;">
            Initializing systems...
        </div>
    `;

    document.body.appendChild(overlay);

    // Wait, then initialize new day (keep screen black until ready)
    setTimeout(() => {
        // Hide starmap elements while we update them
        const starmapSection = document.querySelector('.starmap-section');
        const starGrid = document.getElementById('star-grid');
        if (starmapSection) starmapSection.style.opacity = '0';
        if (starGrid) starGrid.style.opacity = '0';

        // Update star catalog for new day
        import('../ui/starmap.js').then(module => {
            if (module.updateStarCatalogDisplay) {
                module.updateStarCatalogDisplay();
            }
        });

        // DON'T fade out yet - initializeStarmapSequence will create its own black overlay
        // Remove this overlay only AFTER the new one is in place
        import('../ui/boot-sequence.js').then(module => {
            // Small delay to ensure initializeStarmapSequence creates its overlay first
            setTimeout(() => {
                overlay.remove();
            }, 100);
            module.initializeStarmapSequence();
            log(`Day ${gameState.currentDay} - Dr. ${gameState.playerName} reporting for duty`, 'highlight');

            // Send Ross 128 decryption email on Day 2 start
            if (gameState.currentDay === 2 && !gameState.decryptionComplete) {
                setTimeout(() => {
                    const body = ROSS128_DECRYPT_EMAIL.body.replace(/{PLAYER_NAME}/g, gameState.playerName);
                    addMailMessage(ROSS128_DECRYPT_EMAIL.from, ROSS128_DECRYPT_EMAIL.subject, body);
                }, 5000);
            }
        });
    }, 3000);
}

function triggerFinalSequence() {
    log('FINAL SEQUENCE INITIATED', 'highlight');

    // Check if all 4 fragments have been collected
    const requiredFragments = ['ross128', 'gliese832', 'hd219134', 'cmbSource'];
    const collectedFragments = gameState.fragments.collected || [];
    const missingFragments = requiredFragments.filter(f => !collectedFragments.includes(f));

    if (missingFragments.length > 0) {
        // Some fragments are missing - show what's needed
        log('WARNING: Incomplete fragment collection', 'warning');
        showFragmentStatusPopup(missingFragments);
        return;
    }

    // All fragments collected - start final alignment puzzle
    log('All fragments collected - initiating cosmic alignment...', 'info');

    setTimeout(() => {
        startFinalAlignment(
            // Success callback
            () => {
                log('COSMIC MESSAGE DECODED', 'highlight');
                gameState.finalPuzzleComplete = true;
                autoSave();
                // Show the full final message
                setTimeout(() => {
                    showFinalMessage(() => {
                        // After final message, show the standard report
                        showView('report-view');
                        import('../core/end-game.js').then(module => {
                            module.showFinalReport();
                        });
                    });
                }, 1000);
            },
            // Cancel callback
            () => {
                log('Alignment sequence aborted', 'warning');
                showView('starmap-view');
            }
        );
    }, 1500);
}

function showFragmentStatusPopup(missing) {
    const overlay = document.createElement('div');
    overlay.id = 'fragment-status-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 9000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'VT323', monospace;
    `;

    const fragmentNames = {
        ross128: 'Ross 128 Signal Data',
        gliese832: 'Gliese 832 Coordinates',
        hd219134: 'Network Intelligence',
        cmbSource: 'CMB Source Location'
    };

    const missingList = missing.map(f =>
        `<div style="color: #f00; margin: 5px 0;">✗ ${fragmentNames[f]}</div>`
    ).join('');

    overlay.innerHTML = `
        <div style="
            border: 2px solid #ff0;
            background: #000;
            padding: 30px 50px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 0 50px rgba(255, 255, 0, 0.3);
        ">
            <div style="color: #ff0; font-size: 14px; letter-spacing: 3px; margin-bottom: 10px;">
                ⚠ SEQUENCE INCOMPLETE ⚠
            </div>
            <div style="color: #fff; font-size: 22px; text-shadow: 0 0 15px #ff0; margin-bottom: 20px;">
                MISSING FRAGMENTS
            </div>
            <div style="color: #0ff; font-size: 14px; margin-bottom: 20px;">
                The cosmic message cannot be reconstructed<br>
                without all signal fragments.
            </div>
            <div style="margin: 20px 0; text-align: left; padding: 15px; border: 1px solid #333; background: rgba(255, 0, 0, 0.1);">
                ${missingList}
            </div>
            <div style="color: #0a0; font-size: 12px; margin-bottom: 20px;">
                Complete triangulation and establish all contacts<br>
                to collect the remaining fragments.
            </div>
            <button id="fragment-close-btn" style="
                background: transparent;
                border: 2px solid #0f0;
                color: #0f0;
                font-family: 'VT323', monospace;
                font-size: 18px;
                padding: 12px 35px;
                cursor: pointer;
                text-shadow: 0 0 10px #0f0;
            ">
                CONTINUE
            </button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('fragment-close-btn').addEventListener('click', () => {
        playClick();
        overlay.remove();
        showView('starmap-view');
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export function initDayReportState() {
    // Initialize the dayReportShown tracker if not present
    if (gameState.dayReportShown === undefined) {
        gameState.dayReportShown = 0;
    }
}
