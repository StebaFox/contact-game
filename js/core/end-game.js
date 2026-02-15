// ═════════════════════════════════════════════════════════════════════════════
// END GAME
// Survey completion, final report, and game ending
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from './game-state.js';
import { showView, log } from '../ui/rendering.js';
import { playClick, stopNaturalPhenomenaSound, stopAlienSignalSound, stopStaticHiss } from '../systems/audio.js';
import { ALIEN_CONTACTS } from '../narrative/alien-contacts.js';

// Check if all stars have been analyzed (triggers end state)
export function checkForEndState() {
    // Check if all stars have been analyzed
    if (gameState.analyzedStars.size >= gameState.stars.length) {
        // Delay a bit to let the last analysis complete
        setTimeout(() => {
            showSurveyCompletePopup();
        }, 1500);
    }
}

// Show the survey complete popup
export function showSurveyCompletePopup() {
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

// Show the final report view
export function showFinalReport() {
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

// Generate the report content
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
            const message = ALIEN_CONTACTS.find(m => m.starIndex === star.id);
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

// Generate operator notes for the report
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

// Submit the final report
export function submitReport() {
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

// Restart the game
export function restartGame() {
    playClick();

    // Start fade
    const overlay = document.getElementById('fade-overlay');
    overlay.classList.add('active');

    setTimeout(() => {
        // Clear all progress
        try { localStorage.clear(); } catch (e) {}

        // Reload the page
        location.reload();
    }, 1000);
}
