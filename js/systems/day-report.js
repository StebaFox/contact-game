// ═════════════════════════════════════════════════════════════════════════════
// DAY REPORT SYSTEM
// End-of-day summaries and day transitions
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { showView, log } from '../ui/rendering.js';
import { playClick, playSecurityBeep, playBootUpSound, resumeAllMusic, setDay3Music } from './audio.js';
import { autoSave } from '../core/save-system.js';
import { getDayProgress, advanceDay, DAY_CONFIG, checkDayComplete } from '../core/day-system.js';
import { startFinalAlignment } from './alignment-minigame.js';
import { showFinalMessage } from '../narrative/final-message.js';
import { addMailMessage } from './mailbox.js';
import { ROSS128_DECRYPT_EMAIL, DAY2_CHEN_SIGNAL_EMAIL, DAY2_BLACKOUT_EMAIL } from '../narrative/emails.js';
import { addSRC7024 } from './investigation.js';
import { addPersonalLog } from './journal.js';

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

    // Already shown the popup for this day — just ensure nav button is visible
    if (gameState.dayReportShown === gameState.currentDay) {
        if (!gameState.daysCompleted.includes(gameState.currentDay)) {
            showDayReportButton();
        }
        return false;
    }

    // Mark that we've shown the report for this day
    gameState.dayReportShown = gameState.currentDay;

    // Day 2: Insert SRC-7024 cliffhanger reveal before showing popup
    if (gameState.currentDay === 2) {
        setTimeout(() => {
            triggerDay2Cliffhanger();
        }, 2000);
    } else {
        // Show the day complete popup after a brief delay
        setTimeout(() => {
            showDayCompletePopup();
        }, 1500);
    }

    return true;
}

// Show the "End of Day Report" nav button so the player can file when ready
export function showDayReportButton() {
    const btn = document.getElementById('day-report-btn');
    if (btn) btn.style.display = '';
}

// Hide the "End of Day Report" nav button
export function hideDayReportButton() {
    const btn = document.getElementById('day-report-btn');
    if (btn) btn.style.display = 'none';
}

// Called when player clicks the nav button — open the classification flow
export function openDayReport() {
    hideDayReportButton();
    showInteractiveClassification();
}

// ─────────────────────────────────────────────────────────────────────────────
// Day 2 Cliffhanger — SRC-7024 Reveal
// ─────────────────────────────────────────────────────────────────────────────

function triggerDay2Cliffhanger() {
    // If sequence already completed (or SRC-7024 already present from a prior run), skip
    if (gameState.day2CliffhangerPhase >= 5 ||
        (gameState.dynamicStars && gameState.dynamicStars.find(s => s.id === 'src7024') &&
         gameState.day2CliffhangerPhase === -1)) {
        showDayCompletePopup();
        return;
    }

    // Start Phase 0: Send Dr. Chen email, wait for player to read it
    gameState.day2CliffhangerPhase = 0;
    autoSave();

    playSecurityBeep('warning');
    log('ALERT: Overnight analysis flagged anomalous deep space signature...', 'warning');

    setTimeout(() => {
        const body = DAY2_CHEN_SIGNAL_EMAIL.body.replace(/{PLAYER_NAME}/g, gameState.playerName);
        addMailMessage(DAY2_CHEN_SIGNAL_EMAIL.from, DAY2_CHEN_SIGNAL_EMAIL.subject, body);
        log('New priority message in your mailbox.', 'highlight');
    }, 1500);
}

// State machine for Day 2 cliffhanger — called by mailbox.js and scanning.js
export function advanceDay2Cliffhanger(triggerPhase) {
    if (gameState.day2CliffhangerPhase !== triggerPhase) return;

    switch (triggerPhase) {
        case 0:
            // Player read Chen email and closed mailbox → Phase 1: add SRC-7024
            gameState.day2CliffhangerPhase = 1;
            autoSave();

            setTimeout(() => {
                addSRC7024();
                const src = gameState.dynamicStars.find(s => s.id === 'src7024');
                if (src) src.addedAt = Date.now();
                playSecurityBeep('success');
                log('NEW TARGET ADDED TO STARMAP: SRC-7024', 'highlight');
                log('Select SRC-7024 on the starmap to begin scanning.', 'info');

                addPersonalLog('SRC-7024',
                    `Dr. Chen flagged a signal source that isn't in any known catalog. Military, civilian, deep space network — nothing. Zero matches.\n\nShe's calling it SRC-7024. Coordinates don't correspond to any charted star, pulsar, or known emitter. It's just... there. Broadcasting from a point in space that should be empty.\n\nI've been doing this long enough to know that "unknown source" usually means "we haven't checked the right database yet." But Chen has checked them all. Twice.\n\nI need to scan it.`
                );

                autoSave();
            }, 500);
            break;

        case 1:
            // Player scanned SRC-7024 → Phase 2 (crash sequence handles itself)
            gameState.day2CliffhangerPhase = 2;
            autoSave();
            break;

        case 2:
            // Crash sequence complete → Phase 3: quick reboot
            gameState.day2CliffhangerPhase = 3;
            autoSave();
            startQuickReboot();
            break;

        case 3:
            // Reboot complete → Phase 4: send blackout email
            gameState.day2CliffhangerPhase = 4;
            autoSave();

            addPersonalLog('System Crash',
                `The entire array went dark mid-scan. Every dish. Every sensor. Simultaneously.\n\nThat doesn't happen by accident. Electromagnetic interference doesn't knock out hardened military-grade equipment across a distributed network.\n\nSomething triggered the shutdown. Something in the signal.\n\nOr something that didn't want us to finish scanning.`
            );

            // Delay long enough for the loading bar sequence to finish (~4s)
            setTimeout(() => {
                const time = new Date().toTimeString().substring(0, 5);
                const body = DAY2_BLACKOUT_EMAIL.body
                    .replace(/{PLAYER_NAME}/g, gameState.playerName)
                    .replace(/{TIME}/g, time);
                addMailMessage(DAY2_BLACKOUT_EMAIL.from, DAY2_BLACKOUT_EMAIL.subject, body);
                log('EMERGENCY ALERT: New priority message received.', 'warning');

                addPersonalLog('The Blackout',
                    `The western seaboard just went dark. The entire power grid — three states — blacked out at the exact moment our array locked onto SRC-7024.\n\nOperations is calling it a coincidence. A "correlated infrastructure event." That's what they have to call it, because the alternative is that a signal from deep space knocked out the power grid of a continent.\n\nI keep thinking about the energy required to do that. We pointed a radio telescope at empty space, and empty space pushed back hard enough to shut down everything for hundreds of miles.\n\nWhatever SRC-7024 is, it knows we're listening. And it responded.`
                );
            }, 7000);
            break;

        case 4:
            // Player read blackout email → show day report
            gameState.day2CliffhangerPhase = 5;
            autoSave();
            showDayCompletePopup();
            break;
    }
}

function startQuickReboot() {
    playBootUpSound();

    const overlay = document.createElement('div');
    overlay.id = 'reboot-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: #000; z-index: 9999;
        font-family: 'VT323', monospace; padding: 40px; overflow: hidden;
    `;
    document.body.appendChild(overlay);

    const rebootLines = [
        { text: '', delay: 800 },
        { text: 'SYSTEM FAILURE DETECTED', delay: 400, cls: 'error' },
        { text: 'ERROR CODE: 0xDEAD7024', delay: 300, cls: 'error' },
        { text: '', delay: 500 },
        { text: 'EMERGENCY REBOOT INITIATED...', delay: 600 },
        { text: '', delay: 400 },
        { text: 'RESTORING CORE SYSTEMS........... OK', delay: 500 },
        { text: 'SENSOR ARRAY.................... RECONNECTING', delay: 400 },
        { text: 'SIGNAL PROCESSING............... ONLINE', delay: 350 },
        { text: 'DEEP SPACE ARRAY................ STANDBY', delay: 350 },
        { text: 'DATA INTEGRITY CHECK............ WARNINGS', delay: 400, cls: 'warning' },
        { text: '', delay: 300 },
        { text: 'SYSTEM RESTORED — PARTIAL DATA LOSS DETECTED', delay: 500, cls: 'warning' },
        { text: 'RESUMING OPERATIONS...', delay: 800 }
    ];

    let lineIndex = 0;
    function typeNextLine() {
        if (lineIndex >= rebootLines.length) {
            setTimeout(() => {
                // Switch to starmap view under the overlay
                showView('starmap-view');
                // Start the loading bar sequence FIRST so its overlay (z-index 9999)
                // is already covering the starmap before we fade the reboot overlay
                import('../ui/boot-sequence.js').then(module => {
                    module.initializeStarmapSequence();
                    // Now fade and remove the reboot overlay — loading bar overlay is underneath
                    overlay.style.transition = 'opacity 0.5s';
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        overlay.remove();
                        resumeAllMusic();
                        advanceDay2Cliffhanger(3);
                    }, 500);
                });
            }, 1000);
            return;
        }

        const lineData = rebootLines[lineIndex];
        const lineEl = document.createElement('div');
        lineEl.style.cssText = 'font-size: 16px; margin: 4px 0; opacity: 0; transition: opacity 0.2s;';

        if (lineData.cls === 'error') {
            lineEl.style.color = '#f00';
            lineEl.style.textShadow = '0 0 10px #f00';
        } else if (lineData.cls === 'warning') {
            lineEl.style.color = '#ff0';
            lineEl.style.textShadow = '0 0 5px #ff0';
        } else {
            lineEl.style.color = '#0f0';
            lineEl.style.textShadow = '0 0 5px #0f0';
        }

        lineEl.textContent = lineData.text;
        overlay.appendChild(lineEl);

        requestAnimationFrame(() => { lineEl.style.opacity = '1'; });

        if (lineData.text.length > 0) {
            playSecurityBeep('normal');
        }

        lineIndex++;
        setTimeout(typeNextLine, lineData.delay);
    }

    typeNextLine();
}

// ─────────────────────────────────────────────────────────────────────────────
// Day Complete Popup
// ─────────────────────────────────────────────────────────────────────────────

function showDayCompletePopup() {
    const dayConfig = DAY_CONFIG[gameState.currentDay];
    if (!dayConfig) return;

    playSecurityBeep('success');

    // Count scanned vs total available
    const scanned = dayConfig.availableStars.filter(i => gameState.analyzedStars.has(i)).length;
    const total = dayConfig.availableStars.length;
    const remaining = total - scanned;

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

    const continueText = remaining > 0
        ? `<div style="color: #888; font-size: 14px; margin-bottom: 20px;">
               ${remaining} additional target${remaining > 1 ? 's' : ''} available for optional survey.
           </div>`
        : '';

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
                MINIMUM SURVEY THRESHOLD REACHED
            </div>
            <div style="color: #fff; font-size: 28px; text-shadow: 0 0 15px #0f0; margin-bottom: 20px;">
                ${dayConfig.title}
            </div>
            <div style="color: #0ff; font-size: 16px; margin-bottom: 15px;">
                ${scanned} / ${total} assigned targets analyzed.<br>
                Minimum survey requirement met — daily report authorized.
            </div>
            ${continueText}
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
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
                    FILE DAY REPORT
                </button>
                ${remaining > 0 ? `<button id="continue-scanning-btn" style="
                    background: transparent;
                    border: 1px solid #666;
                    color: #888;
                    font-family: 'VT323', monospace;
                    font-size: 16px;
                    padding: 15px 30px;
                    cursor: pointer;
                ">
                    CONTINUE SCANNING
                </button>` : ''}
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('send-day-report-btn').addEventListener('click', () => {
        playClick();
        overlay.remove();
        showInteractiveClassification();
    });

    const continueBtn = document.getElementById('continue-scanning-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            playClick();
            overlay.remove();
            // Show the "End of Day Report" nav button so player can file when ready
            showDayReportButton();
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Classification Step
// Player fills out a form before the report is generated
// ─────────────────────────────────────────────────────────────────────────────

function showInteractiveClassification() {
    const day = gameState.currentDay;
    const choices = {};

    const overlay = document.createElement('div');
    overlay.id = 'classification-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: #000; z-index: 9000;
        display: flex; align-items: center; justify-content: center;
        font-family: 'VT323', monospace; overflow-y: auto; padding: 20px;
    `;

    let formHTML, setupFn;
    if (day === 1) {
        ({ formHTML, setupFn } = buildDay1ClassificationForm(choices));
    } else if (day === 2) {
        ({ formHTML, setupFn } = buildDay2ClassificationForm(choices));
    } else {
        ({ formHTML, setupFn } = buildDay3ClassificationForm(choices));
    }

    overlay.innerHTML = formHTML;
    document.body.appendChild(overlay);
    setupFn(overlay, choices);

    overlay.querySelector('#compile-report-btn').addEventListener('click', () => {
        playClick();
        autoFillMissing(day, choices);
        overlay.remove();
        showDayReport(choices);
    });
}

// ─── Day 1: Signal Classification ─────────────────────────────────────────

function buildDay1ClassificationForm(choices) {
    choices.classifications = {};
    choices.recommendation = null;

    // 4 key signals flagged for review: indices 0, 4, 6, 8
    const displayStars = [0, 4, 6, 8];

    // Helper to get scan result description
    function getScanSummary(starIndex) {
        const result = gameState.scanResults.get(starIndex);
        if (!result) return { text: 'PENDING ANALYSIS', color: '#666' };
        if (result.type === 'natural') return { text: `NATURAL — ${result.phenomenonType || 'Classified phenomenon'}`, color: '#0ff' };
        if (result.type === 'false_positive') return { text: `FALSE POSITIVE — ${result.source || 'Terrestrial source'}`, color: '#f80' };
        if (result.type === 'verified_signal') return { text: 'VERIFIED EXTRASOLAR SIGNAL', color: '#f0f' };
        if (result.type === 'encrypted_signal') return { text: 'ENCRYPTED SIGNAL — DECRYPTION REQUIRED', color: '#ff0' };
        return { text: 'SIGNAL DETECTED', color: '#0f0' };
    }

    let signalRows = '';
    displayStars.forEach(idx => {
        const star = gameState.stars[idx];
        if (!star) return;
        const isRoss128 = idx === 8;
        const rowClass = isRoss128 ? 'signal-row signal-row-highlight' : 'signal-row';
        const scan = getScanSummary(idx);

        signalRows += `
            <div class="${rowClass}" data-star-index="${idx}">
                <div class="signal-info">
                    <span class="signal-name">${star.name}</span>
                    <span class="signal-meta">${star.distance} ly | ${star.starType} ${star.starClass} | ${star.temperature}</span>
                    <span class="signal-result" style="color: ${scan.color}; font-size: 11px; display: block; margin-top: 2px;">${scan.text}</span>
                </div>
                <div class="signal-buttons">
                    <button class="classify-btn" data-value="NATURAL">NATURAL</button>
                    <button class="classify-btn" data-value="TERRESTRIAL">TERRESTRIAL</button>
                    <button class="classify-btn" data-value="ANOMALOUS">ANOMALOUS</button>
                </div>
                <div class="signal-check" id="check-${idx}"></div>
            </div>
        `;
    });

    const formHTML = `
        <div class="classification-panel">
            <div class="classification-header">
                DAILY SIGNAL CLASSIFICATION
                <div class="classification-subheader">
                    Automated pre-screening flagged ${displayStars.length} of 10 signals for manual review.<br>
                    Remaining signals auto-classified. Assign your operator assessment below.
                </div>
            </div>
            <div class="classification-body">
                <div class="classification-section-label">FLAGGED SIGNALS</div>
                ${signalRows}

                <div class="classification-section-label" style="margin-top: 20px;">RECOMMENDATION</div>
                <div style="display: flex; gap: 8px; padding: 8px 0;">
                    <button class="recommend-btn" data-value="STANDARD_PROTOCOLS">STANDARD PROTOCOLS</button>
                    <button class="recommend-btn" data-value="ELEVATED_ANALYSIS">ELEVATED ANALYSIS</button>
                </div>
            </div>
            <div class="classification-footer">
                <button id="compile-report-btn">COMPILE REPORT</button>
            </div>
        </div>
    `;

    function setupFn(overlay, choices) {
        // Wire up classification buttons
        overlay.querySelectorAll('.signal-row').forEach(row => {
            const idx = parseInt(row.dataset.starIndex);
            row.querySelectorAll('.classify-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    playClick();
                    // Deactivate siblings
                    row.querySelectorAll('.classify-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    choices.classifications[idx] = btn.dataset.value;

                    // Show check
                    const check = overlay.querySelector(`#check-${idx}`);
                    if (check) { check.textContent = '✓'; check.classList.add('done'); }

                    // Ross 128 special feedback
                    if (idx === 8 && btn.dataset.value === 'ANOMALOUS') {
                        playSecurityBeep('success');
                        row.classList.add('classification-flash');
                        setTimeout(() => row.classList.remove('classification-flash'), 600);
                    }

                    updateCompileButton(overlay, choices, 1);
                });
            });
        });

        // Wire up recommendation buttons
        overlay.querySelectorAll('.recommend-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                playClick();
                overlay.querySelectorAll('.recommend-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                choices.recommendation = btn.dataset.value;
                updateCompileButton(overlay, choices, 1);
            });
        });
    }

    return { formHTML, setupFn };
}

// ─── Day 2: Contact Verification & Assessment ─────────────────────────────

function buildDay2ClassificationForm(choices) {
    choices.verifications = {};
    choices.src7024Priority = null;
    choices.missionAssessment = null;

    // Find contacted stars from Day 2 (indices 10-19)
    const dayConfig = DAY_CONFIG[2];
    let contactRows = '';
    dayConfig.availableStars.forEach(idx => {
        if (gameState.contactedStars.has(idx)) {
            const star = gameState.stars[idx];
            if (!star) return;
            contactRows += `
                <div class="verify-row" data-star-index="${idx}">
                    <span class="verify-name">${star.name}</span>
                    <span class="verify-type">VERIFIED SIGNAL</span>
                    <button class="verify-btn" data-star="${idx}">VERIFY</button>
                </div>
            `;
        }
    });

    if (!contactRows) {
        contactRows = '<div style="color: #666; padding: 8px 0;">No contacts established this day.</div>';
    }

    const formHTML = `
        <div class="classification-panel">
            <div class="classification-header">
                CONTACT VERIFICATION & ASSESSMENT
                <div class="classification-subheader">
                    Verify confirmed contacts and assess mission status
                </div>
            </div>
            <div class="classification-body">
                <div class="classification-section-label">CONFIRMED CONTACTS</div>
                ${contactRows}

                <div class="classification-section-label" style="margin-top: 20px;">
                    SRC-7024 — UNCHARTED SIGNAL SOURCE
                    <span style="color: #ff0; font-size: 12px; margin-left: 10px;">PRIORITY ASSESSMENT REQUIRED</span>
                </div>
                <div style="display: flex; gap: 8px; padding: 8px 0;">
                    <button class="priority-btn" data-value="STANDARD">STANDARD</button>
                    <button class="priority-btn" data-value="HIGH">HIGH</button>
                    <button class="priority-btn" data-value="CRITICAL">CRITICAL</button>
                </div>

                <div class="classification-section-label" style="margin-top: 20px;">MISSION ASSESSMENT</div>
                <div style="display: flex; gap: 8px; padding: 8px 0;">
                    <button class="assess-btn" data-value="ROUTINE_SURVEY">ROUTINE SURVEY</button>
                    <button class="assess-btn" data-value="SIGNIFICANT_DISCOVERY">SIGNIFICANT DISCOVERY</button>
                    <button class="assess-btn" data-value="PARADIGM_SHIFT">PARADIGM SHIFT</button>
                </div>
            </div>
            <div class="classification-footer">
                <button id="compile-report-btn">COMPILE REPORT</button>
            </div>
        </div>
    `;

    function setupFn(overlay, choices) {
        // Verify buttons
        overlay.querySelectorAll('.verify-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                playClick();
                const idx = parseInt(btn.dataset.star);
                choices.verifications[idx] = true;
                btn.textContent = 'VERIFIED ✓';
                btn.classList.add('verified');
                updateCompileButton(overlay, choices, 2);
            });
        });

        // Priority buttons
        overlay.querySelectorAll('.priority-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                playClick();
                overlay.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                choices.src7024Priority = btn.dataset.value;
                updateCompileButton(overlay, choices, 2);
            });
        });

        // Assessment buttons
        overlay.querySelectorAll('.assess-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                playClick();
                overlay.querySelectorAll('.assess-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                choices.missionAssessment = btn.dataset.value;
                updateCompileButton(overlay, choices, 2);
            });
        });
    }

    return { formHTML, setupFn };
}

// ─── Day 3: Fragment Status Review ────────────────────────────────────────

function buildDay3ClassificationForm(choices) {
    choices.missionClassification = null;

    const fragmentDefs = [
        { key: 'src7024', label: 'SRC-7024 Signal Data' },
        { key: 'nexusPoint', label: 'NEXUS POINT Deep Space Data' },
        { key: 'eridani82', label: '82 Eridani Collaborative Data' },
        { key: 'synthesis', label: 'Synthesized Message' }
    ];

    let fragmentRows = '';
    fragmentDefs.forEach(f => {
        const collected = gameState.fragments.sources[f.key];
        const statusClass = collected ? 'collected' : 'pending';
        const statusText = collected ? 'COLLECTED' : 'PENDING';
        const btnHTML = collected
            ? `<button class="fragment-ack-btn" data-fragment="${f.key}">ACKNOWLEDGE</button>`
            : `<span style="color: #333; font-size: 12px;">—</span>`;

        fragmentRows += `
            <div class="fragment-row" data-fragment="${f.key}">
                <span class="fragment-status ${statusClass}">${statusText}</span>
                <span class="fragment-name">${f.label}</span>
                ${btnHTML}
            </div>
        `;
    });

    const formHTML = `
        <div class="classification-panel">
            <div class="classification-header">
                FRAGMENT STATUS REVIEW
                <div class="classification-subheader">
                    Review collected data and classify mission outcome
                </div>
            </div>
            <div class="classification-body">
                <div class="classification-section-label">SIGNAL FRAGMENTS</div>
                ${fragmentRows}

                <div class="classification-section-label" style="margin-top: 20px;">OVERALL MISSION CLASSIFICATION</div>
                <div style="display: flex; gap: 8px; padding: 8px 0;">
                    <button class="mission-btn" data-value="SCIENTIFIC_DISCOVERY">SCIENTIFIC DISCOVERY</button>
                    <button class="mission-btn" data-value="FIRST_CONTACT">FIRST CONTACT</button>
                    <button class="mission-btn" data-value="COSMIC_REVELATION">COSMIC REVELATION</button>
                </div>
            </div>
            <div class="classification-footer">
                <button id="compile-report-btn">COMPILE REPORT</button>
            </div>
        </div>
    `;

    function setupFn(overlay, choices) {
        // Fragment acknowledge buttons
        overlay.querySelectorAll('.fragment-ack-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                playClick();
                btn.textContent = 'ACKNOWLEDGED ✓';
                btn.classList.add('acknowledged');
            });
        });

        // Mission classification buttons
        overlay.querySelectorAll('.mission-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                playClick();
                overlay.querySelectorAll('.mission-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                choices.missionClassification = btn.dataset.value;
                updateCompileButton(overlay, choices, 3);
            });
        });
    }

    return { formHTML, setupFn };
}

// ─── Shared Helpers ───────────────────────────────────────────────────────

function updateCompileButton(overlay, choices, day) {
    const btn = overlay.querySelector('#compile-report-btn');
    if (!btn) return;

    let complete = false;
    if (day === 1) {
        const allClassified = [0, 4, 6, 8].every(idx => choices.classifications && choices.classifications[idx]);
        complete = allClassified && choices.recommendation;
    } else if (day === 2) {
        complete = choices.src7024Priority && choices.missionAssessment;
    } else if (day === 3) {
        complete = !!choices.missionClassification;
    }

    if (complete) {
        btn.classList.add('ready');
    }
}

function autoFillMissing(day, choices) {
    if (day === 1) {
        if (!choices.classifications) choices.classifications = {};
        [0, 4, 6, 8].forEach(idx => {
            if (!choices.classifications[idx]) {
                const result = gameState.scanResults.get(idx);
                if (result) {
                    if (result.type === 'false_positive') choices.classifications[idx] = 'TERRESTRIAL';
                    else if (result.type === 'verified_signal' || result.type === 'encrypted_signal') choices.classifications[idx] = 'ANOMALOUS';
                    else choices.classifications[idx] = 'NATURAL';
                } else {
                    choices.classifications[idx] = 'NATURAL';
                }
            }
        });
        // Ross 128 auto-correction
        if (choices.classifications[8] !== 'ANOMALOUS') {
            choices.ross128AutoCorrected = true;
            choices.classifications[8] = 'ANOMALOUS';
        }
        if (!choices.recommendation) choices.recommendation = 'ELEVATED_ANALYSIS';
    } else if (day === 2) {
        if (!choices.src7024Priority) choices.src7024Priority = 'HIGH';
        if (!choices.missionAssessment) choices.missionAssessment = 'SIGNIFICANT_DISCOVERY';
    } else if (day === 3) {
        if (!choices.missionClassification) choices.missionClassification = 'FIRST_CONTACT';
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Day Report Display
// ─────────────────────────────────────────────────────────────────────────────

function showDayReport(choices = null) {
    const report = generateDayReport(choices);

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

function generateDayReport(choices = null) {
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
        return generateDay1Report(naturalCount, falsePositiveCount, verifiedCount, verifiedStars, choices);
    } else if (day === 2) {
        return generateDay2Report(naturalCount, falsePositiveCount, verifiedCount, verifiedStars, choices);
    } else if (day === 3) {
        return generateDay3Report(naturalCount, falsePositiveCount, verifiedCount, verifiedStars, choices);
    }

    return {
        title: `DAY ${day} REPORT`,
        content: '<p>Survey complete.</p>',
        footer: 'Proceed to next day.',
        buttonText: 'CONTINUE'
    };
}

function generateDay1Report(natural, falsePos, verified, verifiedStars, choices = null) {
    const hasAnomalous = verified > 0;
    const starList = verifiedStars.length > 0
        ? verifiedStars.map(s => `<span style="color: #0f0;">&#8226; ${s}</span>`).join('<br>')
        : '<span style="color: #666;">None detected</span>';

    // Build operator classifications table from choices
    let classificationSection = '';
    if (choices && choices.classifications) {
        const classColors = { 'NATURAL': '#0ff', 'TERRESTRIAL': '#f80', 'ANOMALOUS': '#ff0' };
        let rows = '';
        for (const [idx, cls] of Object.entries(choices.classifications)) {
            const star = gameState.stars[parseInt(idx)];
            if (!star) continue;
            const color = classColors[cls] || '#0ff';
            rows += `
                <tr style="border-bottom: 1px solid #020;">
                    <td style="padding: 5px 0; color: #0ff;">${star.name}</td>
                    <td style="text-align: right; color: ${color}; text-shadow: 0 0 3px ${color};">${cls}</td>
                </tr>
            `;
        }
        classificationSection = `
            <div style="color: #0f0; font-size: 16px; margin: 20px 0 10px 0;">
                OPERATOR CLASSIFICATIONS
            </div>
            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                ${rows}
            </table>
        `;
        if (choices.ross128AutoCorrected) {
            classificationSection += `
                <div style="color: #ff0; font-size: 12px; margin-top: 8px; padding: 8px; border: 1px solid #ff0; background: rgba(255, 255, 0, 0.05);">
                    AUTOMATED REVIEW: Signal from ROSS 128 reclassified to ANOMALOUS.<br>
                    Pattern analysis confirms non-natural origin.
                </div>
            `;
        }
    }

    // Ross 128 classification flavor text
    let ross128Flavor = '';
    if (choices && choices.classifications) {
        const ross128Class = choices.classifications[8]; // Ross 128 is index 8
        if (ross128Class === 'ANOMALOUS') {
            ross128Flavor = `
                <div style="color: #0ff; font-size: 13px; margin-top: 10px; padding: 8px; border-left: 2px solid #0ff;">
                    Your classification of the Ross 128 signal as ANOMALOUS has been flagged for priority review.
                    Dr. Chen has requested immediate access to your analysis.
                </div>
            `;
        } else if (ross128Class === 'NATURAL') {
            ross128Flavor = `
                <div style="color: #f80; font-size: 13px; margin-top: 10px; padding: 8px; border-left: 2px solid #f80;">
                    Your classification of Ross 128 as NATURAL has been noted. However, automated spectral
                    analysis has independently flagged the signal for elevated review. Senior staff have been notified.
                </div>
            `;
        } else if (ross128Class === 'TERRESTRIAL') {
            ross128Flavor = `
                <div style="color: #f80; font-size: 13px; margin-top: 10px; padding: 8px; border-left: 2px solid #f80;">
                    Your TERRESTRIAL classification for Ross 128 has been logged. Note: signal origin confirmed
                    at 11.01 light-years, ruling out terrestrial interference. Automated reclassification pending.
                </div>
            `;
        }
    }

    // Status text varies based on recommendation choice
    let statusText;
    if (choices && choices.recommendation === 'ELEVATED_ANALYSIS') {
        statusText = `
            <div style="color: #ff0; font-size: 16px; margin-top: 15px; padding: 10px; border: 1px solid #ff0; background: rgba(255, 255, 0, 0.1);">
                ⚠ ELEVATED ANALYSIS RECOMMENDED ⚠<br>
                <span style="font-size: 14px; color: #0ff;">
                    Operator recommends priority investigation of anomalous signals.<br>
                    Elevated analysis protocols authorized. Additional computing resources allocated.
                </span>
            </div>
        `;
    } else if (hasAnomalous) {
        statusText = `
            <div style="color: #ff0; font-size: 16px; margin-top: 15px; padding: 10px; border: 1px solid #ff0; background: rgba(255, 255, 0, 0.1);">
                ⚠ SYSTEM OVERRIDE: ELEVATED ANALYSIS REQUIRED ⚠<br>
                <span style="font-size: 14px; color: #0ff;">
                    Standard protocols maintained per operator recommendation. Note: senior staff have
                    independently escalated the Ross 128 anomaly. Automatic escalation initiated.
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
                    <td style="text-align: right;">${natural + falsePos + verified}</td>
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

            ${classificationSection}
            ${ross128Flavor}

            <div style="color: #0f0; font-size: 16px; margin: 20px 0 10px 0;">
                VERIFIED EXTRASOLAR SIGNALS
            </div>
            <div style="color: #0ff; font-size: 14px; line-height: 1.8;">
                ${starList}
            </div>

            ${statusText}

            <div style="margin-top: 25px; padding: 15px; border-top: 1px solid #030; font-style: italic;">
                <div style="color: #0a0; font-size: 12px; letter-spacing: 2px; margin-bottom: 8px;">
                    PERSONAL LOG — DR. ${gameState.playerName.toUpperCase()}
                </div>
                <div style="color: #0f0; font-size: 14px; line-height: 1.6; opacity: 0.8;">
                    Something about that Ross 128 signal is keeping me up. The pattern recognition flagged it as anomalous, but it's more than that — there's a structure to it that feels almost... deliberate. Like someone arranged the frequencies to say "I'm here."
                    <br><br>
                    I keep telling myself it could be anything. Magnetar glitch, pulsar harmonic, some cosmic coincidence. But my hands were shaking when I logged the results. After years of static and false positives, what if this is the one?
                    <br><br>
                    Tomorrow I'll have the clearance to dig deeper. Tonight I can't sleep.
                </div>
            </div>
        `,
        footer: 'Report ready for transmission.',
        buttonText: 'SUBMIT REPORT'
    };
}

function generateDay2Report(natural, falsePos, verified, verifiedStars, choices = null) {
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

    // SRC-7024 priority from operator assessment
    const priorityLevel = choices?.src7024Priority || 'HIGH';
    const priorityColor = priorityLevel === 'CRITICAL' ? '#ff0' : priorityLevel === 'HIGH' ? '#0ff' : '#0a0';
    const priorityNote = priorityLevel === 'CRITICAL'
        ? '<br><span style="color: #ff0; font-size: 12px;">OPERATOR ASSESSMENT: CRITICAL — IMMEDIATE action authorized. All array resources redirected.</span>'
        : priorityLevel === 'HIGH'
        ? '<br><span style="color: #0ff; font-size: 12px;">OPERATOR ASSESSMENT: HIGH PRIORITY — Priority review scheduled for next cycle.</span>'
        : '<br><span style="color: #0a0; font-size: 12px;">OPERATOR ASSESSMENT: STANDARD — Queued for standard review. Note: automated systems recommend escalation.</span>';

    // Mission assessment from operator
    const assessment = choices?.missionAssessment || 'SIGNIFICANT_DISCOVERY';
    const assessmentLabels = {
        'ROUTINE_SURVEY': 'ROUTINE SURVEY',
        'SIGNIFICANT_DISCOVERY': 'SIGNIFICANT DISCOVERY',
        'PARADIGM_SHIFT': 'PARADIGM SHIFT'
    };
    const assessmentLabel = assessmentLabels[assessment] || assessment;

    // Footer varies based on assessment
    let footer = 'Report ready for transmission.';
    if (assessment === 'PARADIGM_SHIFT') {
        footer = `Classification: ${assessmentLabel}. All resources redirected.`;
    } else if (assessment === 'SIGNIFICANT_DISCOVERY') {
        footer = `Classification: ${assessmentLabel}. Elevated protocols authorized.`;
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
                    <td style="text-align: right;">${natural + falsePos + verified}</td>
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
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0; color: #0ff;">Mission Assessment:</td>
                    <td style="text-align: right; color: ${assessment === 'PARADIGM_SHIFT' ? '#ff0' : '#0ff'};">${assessmentLabel}</td>
                </tr>
            </table>

            <div style="color: #0f0; font-size: 16px; margin: 20px 0 10px 0;">
                CONFIRMED EXTRASOLAR CONTACTS
            </div>
            <div style="color: #0ff; font-size: 14px; line-height: 1.8;">
                ${starList}
            </div>

            ${decryptStatus}

            <div style="color: ${priorityColor}; font-size: 16px; margin-top: 20px; padding: 15px; border: 2px solid ${priorityColor}; background: rgba(0, 255, 255, 0.1); animation: warningPulse 2s ease-in-out infinite;">
                ◆ ANOMALY ALERT: SRC-7024 ◆<br>
                <span style="font-size: 13px; color: #fff;">
                    Signal source triggered catastrophic array overload during scan attempt.<br>
                    Concurrent western seaboard power grid failure reported.<br>
                    Designation: SRC-7024 | Origin: UNKNOWN | Status: MAXIMUM PRIORITY<br>
                    <span style="color: ${priorityColor};">Priority: ${priorityLevel}</span>
                    ${priorityNote}
                </span>
            </div>

            <div style="margin-top: 25px; padding: 15px; border-top: 1px solid #030; font-style: italic;">
                <div style="color: #0a0; font-size: 12px; letter-spacing: 2px; margin-bottom: 8px;">
                    PERSONAL LOG — DR. ${gameState.playerName.toUpperCase()}
                </div>
                <div style="color: #0f0; font-size: 14px; line-height: 1.6; opacity: 0.8;">
                    The system crash. I can't stop thinking about the system crash.
                    <br><br>
                    When SRC-7024 responded — and I do mean <em>responded</em> — the array overloaded so completely that it knocked out power across three states. That's not a signal. That's a demonstration. Whatever is out there wanted us to know what it's capable of.
                    <br><br>
                    I'm not frightened. Not exactly. But there's something deeply unsettling about pointing a telescope at the sky and having the sky point back.
                    <br><br>
                    Tomorrow, maximum priority. God help us all.
                </div>
            </div>
        `,
        footer: footer,
        buttonText: 'SUBMIT REPORT'
    };
}

function generateDay3Report(natural, falsePos, verified, verifiedStars, choices = null) {
    const starList = verifiedStars.length > 0
        ? verifiedStars.map(s => `<span style="color: #0f0;">&#8226; ${s}</span>`).join('<br>')
        : '<span style="color: #666;">None detected</span>';

    // Mission classification from operator
    const classification = choices?.missionClassification || 'FIRST_CONTACT';
    const classLabels = {
        'SCIENTIFIC_DISCOVERY': 'SCIENTIFIC DISCOVERY',
        'FIRST_CONTACT': 'FIRST CONTACT',
        'COSMIC_REVELATION': 'COSMIC REVELATION'
    };
    const classLabel = classLabels[classification] || classification;
    const classColor = classification === 'COSMIC_REVELATION' ? '#f0f' : classification === 'FIRST_CONTACT' ? '#0ff' : '#0f0';

    return {
        title: 'DAY 3: COSMIC TRIANGULATION - COMPLETE',
        content: `
            <div style="color: #0f0; font-size: 16px; margin-bottom: 15px;">
                FINAL SURVEY SUMMARY
            </div>
            <table style="width: 100%; color: #0ff; font-size: 14px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0;">Stars Analyzed:</td>
                    <td style="text-align: right;">${natural + falsePos + verified}</td>
                </tr>
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0;">Natural Phenomena:</td>
                    <td style="text-align: right;">${natural}</td>
                </tr>
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0;">Verified Contacts:</td>
                    <td style="text-align: right; color: #0f0;">${verified}</td>
                </tr>
                <tr style="border-bottom: 1px solid #033;">
                    <td style="padding: 8px 0; color: ${classColor};">Mission Classification:</td>
                    <td style="text-align: right; color: ${classColor}; text-shadow: 0 0 5px ${classColor};">${classLabel}</td>
                </tr>
            </table>

            <div style="color: #0f0; font-size: 16px; margin: 20px 0 10px 0;">
                NETWORK CONTACTS
            </div>
            <div style="color: #0ff; font-size: 14px; line-height: 1.8;">
                ${starList}
            </div>

            <div style="color: ${classColor}; font-size: 16px; margin-top: 20px; padding: 15px; border: 2px solid ${classColor}; background: rgba(${classification === 'COSMIC_REVELATION' ? '255, 0, 255' : '0, 255, 255'}, 0.1); text-align: center;">
                MISSION CLASSIFICATION: ${classLabel}<br>
                <span style="font-size: 14px; color: #0ff;">
                    ${classification === 'COSMIC_REVELATION'
                        ? 'The universe is speaking. We are listening.'
                        : classification === 'FIRST_CONTACT'
                        ? 'Contact established. The cosmos is not empty.'
                        : 'Unprecedented data collected. Analysis ongoing.'
                    }
                </span>
            </div>

            <div style="margin-top: 25px; padding: 15px; border-top: 1px solid #030; font-style: italic;">
                <div style="color: #0a0; font-size: 12px; letter-spacing: 2px; margin-bottom: 8px;">
                    PERSONAL LOG — DR. ${gameState.playerName.toUpperCase()}
                </div>
                <div style="color: #0f0; font-size: 14px; line-height: 1.6; opacity: 0.8;">
                    I came into this job hoping to find a signal. Just one signal that proved we weren't alone.
                    <br><br>
                    What I found instead is something I don't have words for. A message woven into the fabric of reality itself. Fragments of meaning scattered across the cosmos like breadcrumbs left by someone who knew we'd eventually learn to look.
                    <br><br>
                    Every civilization that answered our calls — they were part of it too. Pieces of a puzzle none of us could solve alone. As if the universe was designed that way on purpose.
                    <br><br>
                    I don't know what comes next. But for the first time in my career, I'm not afraid of the silence between the stars. There is no silence. There never was.
                </div>
            </div>
        `,
        footer: classification === 'COSMIC_REVELATION'
            ? 'Classification: TOP SECRET // COSMIC. The origin point awaits.'
            : classification === 'FIRST_CONTACT'
            ? 'Report forwarded to First Contact Committee. Initiate final sequence.'
            : 'Report submitted to the International Astronomical Union. Initiate final sequence.',
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

            // Switch to Day 3 "On the trail" music
            if (gameState.currentDay === 3) {
                setDay3Music();
            }

            // Send SRC-7024 priority email on Day 3 start
            if (gameState.currentDay === 3) {
                setTimeout(() => {
                    addMailMessage(
                        'Dr. James Whitmore - SETI Director',
                        '[PRIORITY] SRC-7024 — Top Target Today',
                        `Dr. ${gameState.playerName},\n\nSRC-7024 is your top priority today. That uncharted signal source that appeared at the end of yesterday's survey — we need answers.\n\nScan it first. Whatever it is, it's not in any catalog we have access to. Dr. Chen has been monitoring it overnight and reports the signal is getting stronger.\n\nThe entire team is watching. Don't keep us waiting.\n\n- James Whitmore\n  SETI Program Director`
                    );
                }, 5000);
            }
        });
    }, 3000);
}

function triggerFinalSequence() {
    log('DAY 3 SURVEY COMPLETE', 'highlight');

    // Day 3 endgame now flows through the Investigation page
    // If the player has already completed the final puzzle, show report
    if (gameState.finalPuzzleComplete) {
        showView('report-view');
        import('../core/end-game.js').then(module => {
            module.showFinalReport();
        });
        return;
    }

    // Otherwise, guide them to the Investigation page
    const fragCount = gameState.fragments.collected.length;
    if (fragCount < 4) {
        // Point them to the investigation page to finish
        log('Continue analysis through PROJECT LIGHTHOUSE to complete the final sequence.', 'info');
        showView('starmap-view');
    } else {
        // All done, show final report
        showView('report-view');
        import('../core/end-game.js').then(module => {
            module.showFinalReport();
        });
    }
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
        src7024: 'SRC-7024 Signal Data',
        nexusPoint: 'NEXUS POINT Deep Space Data',
        eridani82: '82 Eridani Collaborative Data',
        synthesis: 'Synthesized Message'
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
