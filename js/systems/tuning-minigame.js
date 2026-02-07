// ═════════════════════════════════════════════════════════════════════════════
// TUNING MINIGAME
// Signal tuning sliders and lock mechanism
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { log } from '../ui/rendering.js';
import { initAudio, playLockAchieved, startTuningTone, stopTuningTone, startStaticHiss, stopStaticHiss, updateStaticHissVolume } from './audio.js';
import { renderMiniDishArray, calculateSignalBoost, canTuneWeakSignal } from './dish-array.js';

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
