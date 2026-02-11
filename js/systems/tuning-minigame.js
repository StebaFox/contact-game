// ═════════════════════════════════════════════════════════════════════════════
// TUNING MINIGAME
// Signal tuning sliders and lock mechanism
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { log } from '../ui/rendering.js';
import { initAudio, playLockAchieved, startTuningTone, stopTuningTone, startStaticHiss, stopStaticHiss, updateStaticHissVolume } from './audio.js';
import { renderMiniDishArray, calculateSignalBoost, canTuneWeakSignal } from './dish-array.js';
import { addMailMessage } from './mailbox.js';
import { addJournalEntry, showJournalButton } from './journal.js';

// External function references (set by main.js)
let generateSignalFn = null;
let startSignalAnimationFn = null;

export function setTuningFunctions(fns) {
    generateSignalFn = fns.generateSignal;
    startSignalAnimationFn = fns.startSignalAnimation;
}

// Signal drift state for weak signals
let driftState = {
    freqOffset: 0,
    gainOffset: 0,
    freqVelocity: 0,
    gainVelocity: 0,
    driftTimer: 0
};

// Start the tuning minigame
export function startTuningMinigame(star) {
    // Ensure audio context is initialized
    initAudio();

    // Generate random target values for this star
    gameState.targetFrequency = Math.floor(Math.random() * 60) + 20; // 20-80
    gameState.targetGain = Math.floor(Math.random() * 60) + 20; // 20-80

    // Start sliders far from target to ensure red color at start
    gameState.currentFrequency = Math.random() < 0.5 ? 0 : 100;
    gameState.currentGain = Math.random() < 0.5 ? 0 : 100;
    gameState.lockDuration = 0;
    gameState.tuningActive = true;

    // Reset drift state
    driftState = { freqOffset: 0, gainOffset: 0, freqVelocity: 0, gainVelocity: 0, driftTimer: 0 };

    // Clear spectrogram canvas to prevent any carryover from previous star
    const specCanvas = document.getElementById('spectrogram-canvas');
    if (specCanvas) {
        const ctx = specCanvas.getContext('2d');
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, specCanvas.width, specCanvas.height);
    }

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

    // Show auto-tune button if player has tuned 3+ stars (not for weak signals)
    let existingAutoBtn = document.getElementById('auto-tune-btn');
    if (existingAutoBtn) existingAutoBtn.remove();

    if (gameState.analyzedStars.size >= 3 && star.signalStrength !== 'weak') {
        const isFirstTime = gameState.analyzedStars.size === 3;
        const autoBtn = document.createElement('button');
        autoBtn.id = 'auto-tune-btn';
        autoBtn.textContent = '[ AUTO-TUNE ]';
        autoBtn.className = 'auto-tune-btn';
        autoBtn.title = 'Automatically tune to signal';
        autoBtn.addEventListener('click', () => {
            autoBtn.disabled = true;
            autoBtn.style.opacity = '0.4';
            autoTune();
        });
        const tuningGame = document.getElementById('tuning-game');
        if (tuningGame) {
            tuningGame.style.position = 'relative';
            tuningGame.appendChild(autoBtn);
        }

        // Notify player when auto-tune first becomes available
        if (isFirstTime) {
            // Brief attention-grabbing pulse on the button
            autoBtn.style.animation = 'autotune-intro 0.6s ease-out 3';
            if (!document.getElementById('autotune-intro-style')) {
                const style = document.createElement('style');
                style.id = 'autotune-intro-style';
                style.textContent = `
                    @keyframes autotune-intro {
                        0% { box-shadow: 0 0 5px rgba(0,255,0,0.3); }
                        50% { box-shadow: 0 0 20px rgba(0,255,0,0.8); transform: scale(1.05); }
                        100% { box-shadow: 0 0 5px rgba(0,255,0,0.3); }
                    }
                `;
                document.head.appendChild(style);
            }

            // Send email about auto-tune (delayed so it doesn't interrupt active tuning)
            const name = gameState.playerName;
            setTimeout(() => {
                addMailMessage(
                    'DSRA Array Operations',
                    'System Upgrade: Auto-Tune Calibration Complete',
                    `${name},\n\nGood news: after three successful signal acquisitions, the array has accumulated enough calibration data to enable automatic tuning.\n\nYou'll see an [AUTO-TUNE] button on future scans. It uses your previous lock patterns to sweep the sliders automatically. Should save you some time on the routine targets.\n\nNote: Auto-tune is disabled for weak signals. Those still need manual finesse and dish alignment. The system can't reliably compensate for signal drift on its own.\n\nKeep up the good work out there.\n\n-- Array Operations`
                );
            }, 10000);

            // Journal entry
            addJournalEntry('discovery', {
                starName: 'SYSTEM',
                title: 'Auto-Tune Calibration Complete',
                content: 'After 3 successful signal acquisitions, the array has enough calibration data to enable automatic tuning. [AUTO-TUNE] button now available on standard-strength signals.'
            });
            showJournalButton();
        }
    }

    // Start tuning feedback loop
    tuningFeedbackLoop();

    // Only start static hiss if signal is strong enough to tune
    if (star.signalStrength !== 'weak' || canTuneWeakSignal()) {
        startStaticHiss();
    }

    log('Signal tuning interface activated');
    if (star.signalStrength === 'weak') {
        log(`WEAK SIGNAL - Array alignment boosting signal`, 'warning');
    }

    // Show tutorial tooltip on very first scan
    if (gameState.analyzedStars.size === 0 && !document.getElementById('tuning-tooltip')) {
        showTuningTooltip();
    }
}

// First-scan tutorial tooltip
function showTuningTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'tuning-tooltip';
    tooltip.innerHTML = `
        <div style="margin-bottom: 6px; color: #0f0; font-weight: bold;">SIGNAL TUNING</div>
        Adjust <span style="color: #0ff;">FREQUENCY</span> and <span style="color: #0ff;">GAIN</span> sliders until the signal locks.<br>
        Watch the waveform. <span style="color: #0f0;">Green</span> means you're close.
    `;
    tooltip.style.cssText = `
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.92);
        border: 1px solid #0f0;
        color: #aaa;
        padding: 10px 16px;
        font-family: "VT323", monospace;
        font-size: 14px;
        line-height: 1.4;
        z-index: 100;
        max-width: 320px;
        text-align: center;
        pointer-events: auto;
        cursor: pointer;
        animation: tooltip-pulse 2s ease-in-out infinite;
    `;

    // Add pulse animation if not already present
    if (!document.getElementById('tuning-tooltip-style')) {
        const style = document.createElement('style');
        style.id = 'tuning-tooltip-style';
        style.textContent = `
            @keyframes tooltip-pulse {
                0%, 100% { border-color: #0f0; box-shadow: 0 0 5px rgba(0,255,0,0.3); }
                50% { border-color: #0a0; box-shadow: 0 0 15px rgba(0,255,0,0.5); }
            }
        `;
        document.head.appendChild(style);
    }

    const tuningGame = document.getElementById('tuning-game');
    if (tuningGame) {
        tuningGame.style.position = 'relative';
        tuningGame.appendChild(tooltip);
    }

    // Dismiss on click
    tooltip.addEventListener('click', () => tooltip.remove());

    // Dismiss on slider interaction
    const dismissOnSlider = () => {
        if (tooltip.parentNode) tooltip.remove();
        document.getElementById('frequency-slider')?.removeEventListener('input', dismissOnSlider);
        document.getElementById('gain-slider')?.removeEventListener('input', dismissOnSlider);
    };
    document.getElementById('frequency-slider')?.addEventListener('input', dismissOnSlider);
    document.getElementById('gain-slider')?.addEventListener('input', dismissOnSlider);

    // Auto-dismiss after 8 seconds
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.style.transition = 'opacity 0.5s';
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 500);
        }
    }, 8000);
}

// Auto-tune: animate sliders toward target over ~2.5 seconds
function autoTune() {
    const freqSlider = document.getElementById('frequency-slider');
    const gainSlider = document.getElementById('gain-slider');
    const startFreq = gameState.currentFrequency;
    const startGain = gameState.currentGain;
    const targetFreq = gameState.targetFrequency;
    const targetGain = gameState.targetGain;
    const duration = 2500; // ms
    const startTime = Date.now();

    // Dismiss tooltip if present
    const tooltip = document.getElementById('tuning-tooltip');
    if (tooltip) tooltip.remove();

    function animateStep() {
        if (!gameState.tuningActive) return;

        const elapsed = Date.now() - startTime;
        const t = Math.min(1, elapsed / duration);
        // Ease-in-out curve
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        const freq = Math.round(startFreq + (targetFreq - startFreq) * ease);
        const gain = Math.round(startGain + (targetGain - startGain) * ease);

        gameState.currentFrequency = freq;
        gameState.currentGain = gain;
        if (freqSlider) freqSlider.value = freq;
        if (gainSlider) gainSlider.value = gain;

        const freqVal = document.getElementById('frequency-value');
        const gainVal = document.getElementById('gain-value');
        if (freqVal) freqVal.textContent = freq.toString();
        if (gainVal) gainVal.textContent = gain.toString();

        if (t < 1) {
            requestAnimationFrame(animateStep);
        }
        // The tuningFeedbackLoop handles lock detection naturally
    }

    requestAnimationFrame(animateStep);
}

// Main tuning feedback loop
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
    if (isWeakSignal) {
        startStaticHiss();
    }

    // Reset strength display color
    document.getElementById('signal-strength-percent').style.color = '';

    // Apply signal drift for weak signals (target wanders)
    if (isWeakSignal) {
        driftState.driftTimer++;

        // Randomly change drift velocity (slow, wandering motion)
        if (driftState.driftTimer % 30 === 0) {
            driftState.freqVelocity += (Math.random() - 0.5) * 0.3;
            driftState.gainVelocity += (Math.random() - 0.5) * 0.3;
            // Dampen velocity to prevent runaway
            driftState.freqVelocity *= 0.8;
            driftState.gainVelocity *= 0.8;
        }

        // Apply velocity to offset
        driftState.freqOffset += driftState.freqVelocity;
        driftState.gainOffset += driftState.gainVelocity;

        // Clamp drift range (±4 units)
        const maxDriftRange = 4;
        driftState.freqOffset = Math.max(-maxDriftRange, Math.min(maxDriftRange, driftState.freqOffset));
        driftState.gainOffset = Math.max(-maxDriftRange, Math.min(maxDriftRange, driftState.gainOffset));

        // Spring force pulling back toward center
        driftState.freqVelocity -= driftState.freqOffset * 0.02;
        driftState.gainVelocity -= driftState.gainOffset * 0.02;
    }

    // Calculate effective target (base + drift)
    const effectiveTargetFreq = gameState.targetFrequency + (isWeakSignal ? driftState.freqOffset : 0);
    const effectiveTargetGain = gameState.targetGain + (isWeakSignal ? driftState.gainOffset : 0);

    // Calculate how close the values are to target
    const freqDiff = Math.abs(gameState.currentFrequency - effectiveTargetFreq);
    const gainDiff = Math.abs(gameState.currentGain - effectiveTargetGain);

    const tolerance = 5;
    const maxDiff = 80;

    // Calculate base signal quality with power curve (steeper near target)
    // Power of 2 means: diff=5 → ~88%, diff=10 → ~77%, diff=20 → ~56%
    const freqQuality = Math.pow(Math.max(0, 1 - (freqDiff / maxDiff)), 2);
    const gainQuality = Math.pow(Math.max(0, 1 - (gainDiff / maxDiff)), 2);
    let overallQuality = (freqQuality + gainQuality) / 2;

    // Apply dish array boost for weak signals
    if (isWeakSignal) {
        const boost = calculateSignalBoost();
        const weakPenalty = 0.4;
        overallQuality = Math.min((overallQuality * weakPenalty) * boost, 1.0);
        renderMiniDishArray();
    }

    const qualityPercent = Math.floor(overallQuality * 100);

    // Update tuning tone based on quality
    startTuningTone(overallQuality);

    // Update static hiss volume (inverse of quality)
    updateStaticHissVolume((1 - overallQuality) * 0.08);

    // Update UI
    const strengthFill = document.getElementById('signal-strength-fill');
    const strengthPercent = document.getElementById('signal-strength-percent');
    strengthFill.style.width = qualityPercent + '%';
    strengthPercent.textContent = qualityPercent + '%';

    // Draw noisy waveform that clears up as quality improves
    drawTuningWaveform(overallQuality);

    // Check if locked
    if (freqDiff <= tolerance && gainDiff <= tolerance && overallQuality >= 0.9) {
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
        // Show drift warning when close but signal is wandering
        if (isWeakSignal && qualityPercent >= 70 && (freqDiff > tolerance || gainDiff > tolerance)) {
            strengthPercent.textContent = qualityPercent + '% ◈ DRIFT';
            strengthPercent.style.color = '#ff0';
        }

        gameState.lockDuration = 0;
        strengthFill.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
        strengthFill.style.background = '';
    }

    // Continue loop
    requestAnimationFrame(tuningFeedbackLoop);
}

// Draw the tuning waveform with quality-based visualization
function drawTuningWaveform(quality) {
    const waveCanvas = document.getElementById('waveform-canvas');
    if (!waveCanvas) return;

    const waveCtx = waveCanvas.getContext('2d');
    if (!waveCtx) return;

    const width = waveCanvas.width;
    const height = waveCanvas.height;

    waveCtx.fillStyle = '#000';
    waveCtx.fillRect(0, 0, width, height);

    // Color temperature feedback based on quality
    const qualityPercent = quality * 100;
    let strokeColor, shadowColor;

    if (qualityPercent < 30) {
        strokeColor = '#ff0000';
        shadowColor = '#ff0000';
    } else if (qualityPercent < 70) {
        const blend = (qualityPercent - 30) / 40;
        const red = 255;
        const green = Math.floor(100 + (155 * blend));
        const blue = 0;
        strokeColor = `rgb(${red}, ${green}, ${blue})`;
        shadowColor = strokeColor;
    } else {
        const blend = (qualityPercent - 70) / 30;
        const red = 0;
        const green = 255;
        const blue = Math.floor(255 * blend);
        strokeColor = `rgb(${red}, ${green}, ${blue})`;
        shadowColor = strokeColor;
    }

    const noiseAmount = 120 * (1 - quality);
    const signalStrength = quality;
    const timeOffset = gameState.signalOffset || 0;

    // LAYER 1: Draw noise layer
    if (quality < 0.95) {
        waveCtx.strokeStyle = strokeColor;
        waveCtx.globalAlpha = 0.3 + (0.4 * (1 - quality));
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
    waveCtx.globalAlpha = signalStrength;
    waveCtx.strokeStyle = strokeColor;
    waveCtx.lineWidth = 2;
    waveCtx.shadowBlur = 5 + (10 * quality);
    waveCtx.shadowColor = shadowColor;

    waveCtx.beginPath();
    for (let x = 0; x < width; x++) {
        const xPos = x + timeOffset;
        const signal = Math.sin(xPos * 0.02) * 50 * signalStrength;
        const pulse = Math.sin(xPos * 0.005) * 20 * signalStrength;
        const fineNoise = (Math.random() - 0.5) * 5 * (1 - quality);
        const y = height / 2 + signal + pulse + fineNoise;

        if (x === 0) {
            waveCtx.moveTo(x, y);
        } else {
            waveCtx.lineTo(x, y);
        }
    }
    waveCtx.stroke();

    waveCtx.globalAlpha = 1.0;
    gameState.signalOffset = (gameState.signalOffset || 0) + 1;
}

// Complete the tuning scan
function completeTuningScan(star) {
    gameState.tuningActive = false;

    // Stop audio
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
        if (generateSignalFn) generateSignalFn(star);

        // Cache the signal data
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

        if (startSignalAnimationFn) startSignalAnimationFn();
        log('Signal acquisition complete');
        document.getElementById('analyze-btn').disabled = false;
        // Keep scan button disabled and mark as complete
        const scanBtn = document.getElementById('scan-btn');
        scanBtn.disabled = true;
        scanBtn.textContent = '✓ SCAN COMPLETE';
    }, 1000);
}

// Setup tuning slider event listeners
export function setupTuningSliders() {
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
}
