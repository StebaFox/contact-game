// ═════════════════════════════════════════════════════════════════════════════
// PATTERN RECOGNITION MINIGAME
// Frequency band selection puzzle
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { log, typeAnalysisText } from '../ui/rendering.js';
import { playClick, playLockAchieved, playStaticBurst, switchToAlienMusic, startAlienSignalSound, startNaturalPhenomenaSound } from './audio.js';

// External function references (set by main.js)
let stopSignalAnimationFn = null;
let generateSignalFn = null;
let startSignalAnimationFn = null;
let showVerifyPromptFn = null;

export function setPatternFunctions(fns) {
    stopSignalAnimationFn = fns.stopSignalAnimation;
    generateSignalFn = fns.generateSignal;
    startSignalAnimationFn = fns.startSignalAnimation;
    showVerifyPromptFn = fns.showVerifyPrompt;
}

// Start the pattern recognition game
export function startPatternRecognitionGame(star) {
    gameState.patternGameActive = true;
    gameState.patternGameBands = [];
    gameState.patternGameCorrectIndices = [];
    gameState.patternGameSelectedIndices = [];
    gameState.patternGameCompleted = false;

    // Show pattern game interface
    document.getElementById('pattern-game').style.display = 'block';
    document.getElementById('analyze-btn').disabled = true;

    // Generate 3 VISUALLY DISTINCT component waves
    const component1 = {
        freq: 0.006 + Math.random() * 0.004,
        amp: 18 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        name: 'LOW'
    };

    const component2 = {
        freq: 0.018 + Math.random() * 0.008,
        amp: 12 + Math.random() * 8,
        phase: Math.random() * Math.PI * 2,
        name: 'MEDIUM'
    };

    const component3 = {
        freq: 0.040 + Math.random() * 0.015,
        amp: 8 + Math.random() * 6,
        phase: Math.random() * Math.PI * 2,
        name: 'HIGH'
    };

    gameState.patternComponents = [component1, component2, component3];

    // Generate reference pattern
    const refCanvas = document.getElementById('reference-pattern');
    generateReferencePattern(gameState.patternComponents, refCanvas);

    // Generate 6-8 frequency bands
    const numBands = 6 + Math.floor(Math.random() * 3);

    // Randomly assign which 3 bands will have the correct components
    const correctIndices = [];
    while (correctIndices.length < 3) {
        const idx = Math.floor(Math.random() * numBands);
        if (!correctIndices.includes(idx)) {
            correctIndices.push(idx);
        }
    }
    gameState.patternGameCorrectIndices = correctIndices;

    // Assign each correct band one of the three components
    const componentAssignments = {};
    correctIndices.forEach((idx, i) => {
        componentAssignments[idx] = i;
    });

    // Generate band elements
    const bandsContainer = document.getElementById('pattern-bands');
    bandsContainer.innerHTML = '';

    for (let i = 0; i < numBands; i++) {
        const bandDiv = document.createElement('div');
        bandDiv.className = 'frequency-band';
        bandDiv.dataset.bandIndex = i;

        const label = document.createElement('div');
        label.className = 'band-label';
        const freq = 1420 + i * 150;
        label.textContent = `BAND ${i + 1} (${freq}MHz)`;

        const canvas = document.createElement('canvas');
        canvas.className = 'band-canvas';
        canvas.width = 180;
        canvas.height = 80;

        const isCorrect = correctIndices.includes(i);
        const componentIndex = isCorrect ? componentAssignments[i] : -1;
        generateFrequencyBand(canvas, isCorrect, componentIndex, i, star);

        bandDiv.appendChild(label);
        bandDiv.appendChild(canvas);

        // Click handler
        bandDiv.addEventListener('click', () => {
            if (gameState.patternGameCompleted || bandDiv.classList.contains('locked')) return;

            playClick();
            const index = parseInt(bandDiv.dataset.bandIndex);

            if (bandDiv.classList.contains('selected')) {
                bandDiv.classList.remove('selected');
                const idx = gameState.patternGameSelectedIndices.indexOf(index);
                if (idx > -1) {
                    gameState.patternGameSelectedIndices.splice(idx, 1);
                }
            } else {
                bandDiv.classList.add('selected');
                gameState.patternGameSelectedIndices.push(index);
                checkPatternGameCompletion(star);
            }
        });

        bandsContainer.appendChild(bandDiv);
        gameState.patternGameBands.push({ element: bandDiv, isCorrect, index: i });
    }

    log('Pattern recognition analysis initiated');
    document.getElementById('pattern-status').textContent = 'SELECT 3 FREQUENCY BANDS THAT COMBINE TO CREATE THE TARGET PATTERN';
}

// Generate the reference pattern (combination of all 3 components)
function generateReferencePattern(components, canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#0ff';
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
        let y = height / 2;

        components.forEach(comp => {
            y += Math.sin(x * comp.freq + comp.phase) * comp.amp;
        });

        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
}

// Generate individual frequency band visualization
function generateFrequencyBand(canvas, isCorrect, componentIndex, bandIndex, star) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 3;
    ctx.shadowColor = '#0f0';
    ctx.beginPath();

    if (isCorrect && componentIndex >= 0) {
        // Draw the EXACT component wave
        const component = gameState.patternComponents[componentIndex];

        for (let x = 0; x < width; x++) {
            const noise = (Math.random() - 0.5) * 4;
            const signal = Math.sin(x * component.freq + component.phase) * component.amp;
            const y = height / 2 + signal + noise;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
    } else {
        // Generate decoy wave
        const starId = star ? star.id : 0;
        const seed = bandIndex * 17 + starId * 3;
        const decoyType = seed % 6;

        let freq, amp, phase;

        switch (decoyType) {
            case 0:
                freq = 0.003 + (seed % 5) * 0.001;
                amp = 15 + (seed % 4) * 5;
                phase = (seed % 10) * 0.6;
                break;
            case 1:
                freq = 0.012 + (seed % 4) * 0.002;
                amp = 20 + (seed % 3) * 4;
                phase = (seed % 8) * 0.7;
                break;
            case 2:
                freq = 0.013 + (seed % 4) * 0.001;
                amp = 14 + (seed % 5) * 3;
                phase = (seed % 7) * 0.8;
                break;
            case 3:
                freq = 0.029 + (seed % 5) * 0.002;
                amp = 16 + (seed % 4) * 4;
                phase = (seed % 9) * 0.5;
                break;
            case 4:
                freq = 0.032 + (seed % 3) * 0.002;
                amp = 10 + (seed % 4) * 2;
                phase = (seed % 6) * 0.9;
                break;
            case 5:
                freq = 0.060 + (seed % 4) * 0.005;
                amp = 12 + (seed % 3) * 3;
                phase = (seed % 11) * 0.4;
                break;
        }

        for (let x = 0; x < width; x++) {
            const noiseSample = (Math.random() - 0.5) * 5;
            const signal = Math.sin(x * freq + phase) * amp;
            const y = height / 2 + signal + noiseSample;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
    }

    ctx.stroke();
}

// Check if pattern game is complete
function checkPatternGameCompletion(star) {
    const selected = gameState.patternGameSelectedIndices;
    const correct = gameState.patternGameCorrectIndices;

    if (selected.length !== 3) return;

    const allCorrect = selected.every(idx => correct.includes(idx));

    if (allCorrect) {
        gameState.patternGameCompleted = true;
        playLockAchieved();

        gameState.patternGameBands.forEach(band => {
            if (correct.includes(band.index)) {
                band.element.classList.add('correct');
                band.element.classList.add('locked');
            }
        });

        document.getElementById('pattern-status').innerHTML =
            '<span style="color: #0f0; text-shadow: 0 0 10px #0f0;">✓ PATTERN MATCH CONFIRMED</span>';

        log('>>> PATTERN RECOGNITION COMPLETE <<<', 'highlight');

        setTimeout(() => {
            completePatternGame(star);
        }, 2000);
    } else {
        // Wrong selection
        selected.forEach(idx => {
            if (!correct.includes(idx)) {
                const band = gameState.patternGameBands.find(b => b.index === idx);
                if (band) {
                    band.element.classList.add('wrong');
                    playStaticBurst();

                    setTimeout(() => {
                        band.element.classList.remove('wrong');
                        band.element.classList.remove('selected');
                    }, 500);
                }
            }
        });

        gameState.patternGameSelectedIndices = selected.filter(idx => correct.includes(idx));
        document.getElementById('pattern-status').innerHTML =
            '<span style="color: #f00;">INCORRECT - TRY AGAIN</span>';

        setTimeout(() => {
            document.getElementById('pattern-status').textContent = 'SELECT 3 FREQUENCY BANDS THAT COMBINE TO CREATE THE TARGET PATTERN';
        }, 1500);
    }
}

// Complete the pattern game and continue analysis
function completePatternGame(star) {
    document.getElementById('pattern-game').style.display = 'none';
    gameState.patternGameActive = false;

    const signal = gameState.currentSignal;

    // Regenerate signal with analyzed=true
    if (stopSignalAnimationFn) stopSignalAnimationFn();
    if (generateSignalFn) generateSignalFn(star, true);

    // Cache the analyzed signal
    const waveCanvas = document.getElementById('waveform-canvas');
    const waveCtx = waveCanvas.getContext('2d');
    const waveformData = waveCtx.getImageData(0, 0, waveCanvas.width, waveCanvas.height);

    const specCanvas = document.getElementById('spectrogram-canvas');
    const specCtx = specCanvas.getContext('2d');
    const spectrogramData = specCtx.getImageData(0, 0, specCanvas.width, specCanvas.height);

    gameState.scannedSignals.set(star.id, {
        star: star,
        hasIntelligence: signal.hasIntelligence,
        analyzed: true,
        waveformData: waveformData,
        spectrogramData: spectrogramData
    });

    if (startSignalAnimationFn) startSignalAnimationFn();

    if (signal.hasIntelligence || star.isFalsePositive) {
        log('>>> ANOMALOUS PATTERN DETECTED <<<', 'highlight');
        log('POSSIBLE NON-NATURAL ORIGIN');

        switchToAlienMusic();
        startAlienSignalSound(star);

        const probability = star.isFalsePositive ?
            (78 + Math.random() * 15).toFixed(1) :
            (91 + Math.random() * 7).toFixed(1);

        const lines = [
            'ANALYSIS COMPLETE',
            '════════════════════════════',
            { text: '⚠ NON-RANDOM PATTERN DETECTED ⚠', style: 'color: #ff0; text-shadow: 0 0 5px #ff0;' },
            'Signal exhibits structured modulation',
            'Frequency bands show intentional spacing',
            'Repeating sequences identified',
            '════════════════════════════',
            { text: `PROBABILITY OF INTELLIGENT ORIGIN: ${probability}%`, style: 'color: #ff0;' },
            '',
            { text: 'SOURCE VERIFICATION REQUIRED', style: 'color: #0ff;' }
        ];

        typeAnalysisText(lines, () => {
            if (showVerifyPromptFn) showVerifyPromptFn(star);
        });
    } else {
        log('Analysis complete: Natural stellar emissions');
        startNaturalPhenomenaSound();

        const naturalPhenomena = [
            { type: 'Pulsar radiation', source: 'Rotating neutron star', details: ['Regular periodic oscillations detected', 'Consistent with magnetar emissions'] },
            { type: 'Solar flare activity', source: 'Stellar chromosphere', details: ['Irregular burst patterns detected', 'High-energy particle emissions'] },
            { type: 'Magnetospheric emissions', source: 'Planetary magnetic field', details: ['Cyclotron radiation detected', 'Consistent with gas giant aurora'] },
            { type: 'Quasar background noise', source: 'Distant active galactic nucleus', details: ['Broadband radio emissions', 'Redshifted spectrum detected'] },
            { type: 'Stellar wind interference', source: 'Coronal mass ejection', details: ['Plasma wave modulation detected', 'Solar cycle correlation confirmed'] },
            { type: 'Interstellar medium scatter', source: 'Ionized hydrogen cloud', details: ['Signal dispersion measured', 'Consistent with H-II region'] },
            { type: 'Binary star oscillation', source: 'Eclipsing binary system', details: ['Periodic dimming pattern detected', 'Orbital mechanics confirmed'] },
            { type: 'Brown dwarf emissions', source: 'Sub-stellar object', details: ['Low-frequency radio bursts', 'Atmospheric electrical activity'] }
        ];

        const phenomenon = naturalPhenomena[Math.floor(Math.random() * naturalPhenomena.length)];

        gameState.scanResults.set(star.id, {
            type: 'natural',
            phenomenonType: phenomenon.type,
            source: phenomenon.source
        });

        const lines = [
            'ANALYSIS COMPLETE',
            '════════════════════════════',
            `Signal characteristics: ${phenomenon.type}`,
            `Source: ${phenomenon.source}`,
            phenomenon.details[0],
            phenomenon.details[1],
            '════════════════════════════',
            'CLASSIFICATION: NATURAL PHENOMENON'
        ];

        typeAnalysisText(lines, () => {
            document.getElementById('analyze-btn').disabled = false;
        });
    }
}
