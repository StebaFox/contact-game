// ═════════════════════════════════════════════════════════════════════════════
// SCANNING SYSTEM
// Signal generation, analysis, and contact protocols
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { autoSave } from '../core/save-system.js';
import { showView, log, typeAnalysisText } from '../ui/rendering.js';
import { playClick, playAnalysisSound, playContactSound, playSecurityBeep, playTypingBeep, stopNaturalPhenomenaSound, stopAlienSignalSound, switchToBackgroundMusic } from './audio.js';
import { startTuningMinigame } from './tuning-minigame.js';
import { startPatternRecognitionGame } from './pattern-minigame.js';
import { startDecryptionMinigame } from './decryption-minigame.js';
import { startAlignmentTutorial } from './alignment-minigame.js';
import { startTriangulationMinigame } from './triangulation-minigame.js';
import { sendFirstContactEmail } from './mailbox.js';
import { checkAndShowDayComplete } from './day-report.js';
import { ALIEN_CONTACTS } from '../narrative/alien-contacts.js';

// Ross 128 star index - requires decryption
const ROSS_128_INDEX = 10;

// Day 3 stars that provide fragments or trigger triangulation
const GLIESE_832_INDEX = 25;  // Megastructure beacon - gives fragment
const VAN_MAANENS_INDEX = 21; // The Network - triggers triangulation offer

// External function references
let drawStarVisualizationFn = null;

export function setScanningFunctions(fns) {
    drawStarVisualizationFn = fns.drawStarVisualization;
}

// Initiate scan
export function initiateScan() {
    const star = gameState.currentStar;

    // Stop any existing ambient sounds
    stopNaturalPhenomenaSound();
    stopAlienSignalSound();

    // Check for cached scan data
    if (gameState.scannedSignals.has(star.id)) {
        log(`Loading previous scan data for ${star.name}`, 'highlight');

        const cachedSignal = gameState.scannedSignals.get(star.id);
        gameState.currentSignal = cachedSignal;

        document.getElementById('analysis-text').innerHTML =
            '<p>LOADING CACHED SCAN DATA...</p>';

        const waveCanvas = document.getElementById('waveform-canvas');
        const waveCtx = waveCanvas.getContext('2d');
        waveCtx.putImageData(cachedSignal.waveformData, 0, 0);

        const specCanvas = document.getElementById('spectrogram-canvas');
        const specCtx = specCanvas.getContext('2d');
        specCtx.putImageData(cachedSignal.spectrogramData, 0, 0);

        startSignalAnimation();
        log('Cached scan data loaded');
        document.getElementById('analyze-btn').disabled = false;
        document.getElementById('scan-btn').disabled = false;
        return;
    }

    log(`Initiating deep space scan: ${star.name}`, 'highlight');
    log('Aligning radio telescope array...');
    log('Tuning receivers to target frequency...');

    document.getElementById('scan-btn').disabled = true;
    document.getElementById('analysis-text').innerHTML =
        '<p>INITIALIZING SCAN...</p><p>CALIBRATING RECEIVERS...</p>';

    // Update target info
    document.getElementById('target-name').textContent = star.name;
    document.getElementById('target-coords').textContent = star.coordinates;
    document.getElementById('target-distance').textContent = star.distance;
    document.getElementById('target-type').textContent = star.starType;
    document.getElementById('target-class').textContent = star.starClass;
    document.getElementById('target-temp').textContent = star.temperature;

    // Draw star visualization
    if (drawStarVisualizationFn) drawStarVisualizationFn(star, 'analysis-star-visual');

    showView('analysis-view');
    startTuningMinigame(star);
}

// Generate signal visualization
export function generateSignal(star, analyzed = false) {
    const hasIntelligence = star.hasIntelligence;

    // Generate waveform
    const waveCanvas = document.getElementById('waveform-canvas');
    const waveCtx = waveCanvas.getContext('2d');
    const width = waveCanvas.width;
    const height = waveCanvas.height;

    waveCtx.fillStyle = '#000';
    waveCtx.fillRect(0, 0, width, height);

    waveCtx.strokeStyle = '#0f0';
    waveCtx.lineWidth = 2;
    waveCtx.shadowBlur = 5;
    waveCtx.shadowColor = '#0f0';

    waveCtx.beginPath();

    if (!analyzed) {
        // Static noise for unanalyzed signals
        for (let x = 0; x < width; x++) {
            const y = height / 2 + (Math.random() - 0.5) * 120;
            if (x === 0) {
                waveCtx.moveTo(x, y);
            } else {
                waveCtx.lineTo(x, y);
            }
        }
    } else if (hasIntelligence) {
        // Intelligent signal pattern
        const starSeed = star.id + 1;
        const freq1 = 0.008 + (starSeed % 3) * 0.002;
        const freq2 = 0.001 + (starSeed % 5) * 0.0005;
        const amp1 = 35 + (starSeed % 4) * 8;
        const amp2 = 20 + (starSeed % 3) * 10;

        for (let x = 0; x < width; x++) {
            const noise = (Math.random() - 0.5) * 12;
            const signal = Math.sin(x * freq1) * amp1;
            const pulse = Math.sin(x * freq2) * amp2;
            const y = height / 2 + signal + pulse + noise;

            if (x === 0) {
                waveCtx.moveTo(x, y);
            } else {
                waveCtx.lineTo(x, y);
            }
        }
    } else {
        // Natural phenomena - pulsar pattern
        for (let x = 0; x < width; x++) {
            const noise = (Math.random() - 0.5) * 20;
            const pulsar = Math.sin(x * 0.08) * 50;
            const decay = Math.cos(x * 0.05) * 15;
            const y = height / 2 + pulsar + decay + noise;

            if (x === 0) {
                waveCtx.moveTo(x, y);
            } else {
                waveCtx.lineTo(x, y);
            }
        }
    }

    waveCtx.stroke();

    // Generate spectrogram
    const specCanvas = document.getElementById('spectrogram-canvas');
    const specCtx = specCanvas.getContext('2d');
    const specWidth = specCanvas.width;
    const specHeight = specCanvas.height;

    specCtx.fillStyle = '#000';
    specCtx.fillRect(0, 0, specWidth, specHeight);

    if (!analyzed) {
        // Random noise
        for (let x = 0; x < specWidth; x++) {
            for (let y = 0; y < specHeight; y++) {
                const intensity = Math.random();
                const brightness = Math.floor(intensity * 100);
                specCtx.fillStyle = `rgba(0, ${brightness * 0.8}, ${brightness}, ${intensity * 0.3})`;
                specCtx.fillRect(x, y, 1, 1);
            }
        }
    } else if (hasIntelligence) {
        // Distinct frequency bands
        const starSeed = star.id + 1;
        const band1Pos = 0.2 + (starSeed % 3) * 0.1;
        const band2Pos = 0.4 + (starSeed % 4) * 0.1;
        const band3Pos = 0.6 + (starSeed % 5) * 0.08;
        const bandWidth1 = 2 + (starSeed % 3);
        const bandWidth2 = 2 + ((starSeed + 1) % 3);
        const modFreq = 0.03 + (starSeed % 4) * 0.01;

        for (let x = 0; x < specWidth; x++) {
            for (let y = 0; y < specHeight; y++) {
                const band1 = Math.abs(y - specHeight * band1Pos) < bandWidth1 ? 1 : 0;
                const band2 = Math.abs(y - specHeight * band2Pos) < bandWidth2 ? 1 : 0;
                const band3 = Math.abs(y - specHeight * band3Pos) < bandWidth1 ? 1 : 0;
                const modulation = Math.sin(x * modFreq) * 0.5 + 0.5;
                const noise = Math.random() * 0.2;

                const intensity = (band1 + band2 + band3) * modulation + noise;
                const brightness = Math.floor(intensity * 255);

                specCtx.fillStyle = `rgba(0, ${brightness * 0.8}, ${brightness}, ${intensity})`;
                specCtx.fillRect(x, y, 1, 1);
            }
        }
    } else {
        // Natural phenomena - broad diffuse bands
        for (let x = 0; x < specWidth; x++) {
            for (let y = 0; y < specHeight; y++) {
                const band = Math.abs(y - specHeight * 0.5) < specHeight * 0.2 ? 1 : 0;
                const variation = Math.sin(x * 0.1 + y * 0.05) * 0.3 + 0.7;
                const noise = Math.random() * 0.4;

                const intensity = band * variation + noise * 0.5;
                const brightness = Math.floor(intensity * 180);

                specCtx.fillStyle = `rgba(0, ${brightness * 0.8}, ${brightness}, ${intensity * 0.6})`;
                specCtx.fillRect(x, y, 1, 1);
            }
        }
    }

    gameState.currentSignal = {
        star: star,
        hasIntelligence: hasIntelligence,
        analyzed: analyzed
    };

    gameState.signalOffset = 0;
}

// Animate signals continuously
export function startSignalAnimation() {
    function animateSignals() {
        if (!gameState.currentSignal) return;

        const star = gameState.currentSignal.star;
        const hasIntelligence = star.hasIntelligence;
        const analyzed = gameState.currentSignal.analyzed;

        const waveCanvas = document.getElementById('waveform-canvas');
        const waveCtx = waveCanvas.getContext('2d');
        const width = waveCanvas.width;
        const height = waveCanvas.height;

        if (!analyzed) {
            gameState.noiseFrameCounter++;
            if (gameState.noiseFrameCounter >= 10) {
                gameState.noiseFrameCounter = 0;

                waveCtx.fillStyle = '#000';
                waveCtx.fillRect(0, 0, width, height);

                waveCtx.strokeStyle = '#0f0';
                waveCtx.lineWidth = 2;
                waveCtx.shadowBlur = 5;
                waveCtx.shadowColor = '#0f0';
                waveCtx.beginPath();

                for (let x = 0; x < width; x++) {
                    const y = height / 2 + (Math.random() - 0.5) * 120;
                    if (x === 0) {
                        waveCtx.moveTo(x, y);
                    } else {
                        waveCtx.lineTo(x, y);
                    }
                }
                waveCtx.stroke();
            }
        } else if (hasIntelligence) {
            waveCtx.fillStyle = '#000';
            waveCtx.fillRect(0, 0, width, height);

            waveCtx.strokeStyle = '#0f0';
            waveCtx.lineWidth = 2;
            waveCtx.shadowBlur = 5;
            waveCtx.shadowColor = '#0f0';
            waveCtx.beginPath();

            gameState.signalOffset += 1.0;

            const starSeed = star.id + 1;
            const freq1 = 0.008 + (starSeed % 3) * 0.002;
            const freq2 = 0.001 + (starSeed % 5) * 0.0005;
            const amp1 = 35 + (starSeed % 4) * 8;
            const amp2 = 20 + (starSeed % 3) * 10;

            for (let x = 0; x < width; x++) {
                const xPos = x + gameState.signalOffset;
                const noise = (Math.random() - 0.5) * 12;
                const signal = Math.sin(xPos * freq1) * amp1;
                const pulse = Math.sin(xPos * freq2) * amp2;
                const y = height / 2 + signal + pulse + noise;

                if (x === 0) {
                    waveCtx.moveTo(x, y);
                } else {
                    waveCtx.lineTo(x, y);
                }
            }
            waveCtx.stroke();
        } else {
            waveCtx.fillStyle = '#000';
            waveCtx.fillRect(0, 0, width, height);

            waveCtx.strokeStyle = '#0f0';
            waveCtx.lineWidth = 2;
            waveCtx.shadowBlur = 5;
            waveCtx.shadowColor = '#0f0';
            waveCtx.beginPath();

            gameState.signalOffset += 0.5;

            for (let x = 0; x < width; x++) {
                const xPos = x + gameState.signalOffset;
                const noise = (Math.random() - 0.5) * 20;
                const pulsar = Math.sin(xPos * 0.08) * 50;
                const decay = Math.cos(xPos * 0.05) * 15;
                const y = height / 2 + pulsar + decay + noise;

                if (x === 0) {
                    waveCtx.moveTo(x, y);
                } else {
                    waveCtx.lineTo(x, y);
                }
            }
            waveCtx.stroke();
        }

        // Animate spectrogram (scrolling)
        const specCanvas = document.getElementById('spectrogram-canvas');
        const specCtx = specCanvas.getContext('2d');
        const specWidth = specCanvas.width;
        const specHeight = specCanvas.height;

        const imageData = specCtx.getImageData(1, 0, specWidth - 1, specHeight);
        specCtx.fillStyle = '#000';
        specCtx.fillRect(0, 0, specWidth, specHeight);
        specCtx.putImageData(imageData, 0, 0);

        const x = specWidth - 1;

        if (!analyzed) {
            for (let y = 0; y < specHeight; y++) {
                const intensity = Math.random();
                const brightness = Math.floor(intensity * 100);
                specCtx.fillStyle = `rgba(0, ${brightness * 0.8}, ${brightness}, ${intensity * 0.3})`;
                specCtx.fillRect(x, y, 1, 1);
            }
        } else if (hasIntelligence) {
            const starSeed = star.id + 1;
            const band1Pos = 0.2 + (starSeed % 3) * 0.1;
            const band2Pos = 0.4 + (starSeed % 4) * 0.1;
            const band3Pos = 0.6 + (starSeed % 5) * 0.08;
            const bandWidth1 = 2 + (starSeed % 3);
            const bandWidth2 = 2 + ((starSeed + 1) % 3);
            const modFreq = 0.03 + (starSeed % 4) * 0.01;

            for (let y = 0; y < specHeight; y++) {
                const band1 = Math.abs(y - specHeight * band1Pos) < bandWidth1 ? 1 : 0;
                const band2 = Math.abs(y - specHeight * band2Pos) < bandWidth2 ? 1 : 0;
                const band3 = Math.abs(y - specHeight * band3Pos) < bandWidth1 ? 1 : 0;
                const modulation = Math.sin(gameState.signalOffset * modFreq) * 0.5 + 0.5;
                const noise = Math.random() * 0.2;

                const intensity = (band1 + band2 + band3) * modulation + noise;
                const brightness = Math.floor(intensity * 255);

                specCtx.fillStyle = `rgba(0, ${brightness * 0.8}, ${brightness}, ${intensity})`;
                specCtx.fillRect(x, y, 1, 1);
            }
        } else {
            for (let y = 0; y < specHeight; y++) {
                const band = Math.abs(y - specHeight * 0.5) < specHeight * 0.2 ? 1 : 0;
                const variation = Math.sin(gameState.signalOffset * 0.1 + y * 0.05) * 0.3 + 0.7;
                const noise = Math.random() * 0.4;

                const intensity = band * variation + noise * 0.5;
                const brightness = Math.floor(intensity * 180);

                specCtx.fillStyle = `rgba(0, ${brightness * 0.8}, ${brightness}, ${intensity * 0.6})`;
                specCtx.fillRect(x, y, 1, 1);
            }
        }

        gameState.signalAnimationFrameId = requestAnimationFrame(animateSignals);
    }

    animateSignals();
}

// Stop signal animation
export function stopSignalAnimation() {
    if (gameState.signalAnimationFrameId) {
        cancelAnimationFrame(gameState.signalAnimationFrameId);
        gameState.signalAnimationFrameId = null;
    }
    gameState.noiseFrameCounter = 0;
}

// Analyze signal
export function analyzeSignal() {
    const star = gameState.currentStar;

    log(`Analyzing signal from ${star.name}...`, 'highlight');
    playAnalysisSound();

    document.getElementById('analyze-btn').disabled = true;

    const analysisText = document.getElementById('analysis-text');
    analysisText.innerHTML = '<p>PROCESSING SIGNAL DATA...</p><p>RUNNING PATTERN RECOGNITION...</p>';

    gameState.analyzedStars.add(star.id);
    updateStarStatus(star.id, 'analyzed');

    setTimeout(() => {
        startPatternRecognitionGame(star);
    }, 2000);
}

// Show verification prompt
export function showVerifyPrompt(star) {
    const contactBox = document.getElementById('contact-protocol-box');
    const contactContent = document.getElementById('contact-protocol-content');

    contactBox.style.display = 'block';
    contactContent.innerHTML = '';

    const message = document.createElement('p');
    message.textContent = 'ANOMALOUS SIGNAL REQUIRES VERIFICATION';
    message.style.cssText = 'color: #ff0; text-shadow: 0 0 5px #ff0; font-size: 18px; margin-top: 10px;';
    contactContent.appendChild(message);

    const subMessage = document.createElement('p');
    subMessage.textContent = 'Rule out terrestrial and known sources?';
    subMessage.style.cssText = 'color: #0f0; font-size: 16px; margin-top: 10px;';
    contactContent.appendChild(subMessage);

    const verifyBtn = document.createElement('button');
    verifyBtn.textContent = 'VERIFY SOURCE';
    verifyBtn.className = 'btn';
    verifyBtn.style.cssText = 'background: rgba(0, 255, 255, 0.1); border: 2px solid #0ff; color: #0ff; margin-top: 15px; padding: 10px 30px; font-size: 18px; animation: pulse 2s infinite;';
    verifyBtn.addEventListener('click', () => {
        playClick();
        runVerificationSequence(star);
    });

    contactContent.appendChild(verifyBtn);
}

// Run verification sequence
function runVerificationSequence(star) {
    const contactBox = document.getElementById('contact-protocol-box');
    const contactContent = document.getElementById('contact-protocol-content');

    contactContent.innerHTML = '';

    const verifyDisplay = document.createElement('div');
    verifyDisplay.style.cssText = 'text-align: left; font-size: 14px; line-height: 1.8;';
    contactContent.appendChild(verifyDisplay);

    // False positive sources (1995-era technology)
    const falsePositiveSources = [
        [
            { source: 'GPS SATELLITE CONSTELLATION', result: 'NEGATIVE' },
            { source: 'INTELSAT NETWORK', result: 'NEGATIVE' },
            { source: 'CLASSIFIED RECON SATELLITE (KH-11)', result: 'MATCH DETECTED', isCause: true },
            { source: 'LUNAR SIGNAL BOUNCE', result: 'NEGATIVE' },
        ],
        [
            { source: 'TERRESTRIAL RFI SOURCES', result: 'NEGATIVE' },
            { source: 'COMMERCIAL BROADCAST SATELLITES', result: 'NEGATIVE' },
            { source: 'AIRCRAFT TRANSPONDERS', result: 'NEGATIVE' },
            { source: 'LUNAR SURFACE REFLECTION', result: 'CORRELATION DETECTED', isCause: true },
        ],
        [
            { source: 'GPS SATELLITE CONSTELLATION', result: 'NEGATIVE' },
            { source: 'GOES WEATHER SATELLITES', result: 'NEGATIVE' },
            { source: 'MIR SPACE STATION', result: 'NEGATIVE' },
            { source: 'DEEP SPACE NETWORK ECHO', result: 'MATCH DETECTED', isCause: true },
        ],
        [
            { source: 'FLTSATCOM UHF SATELLITES', result: 'NEGATIVE' },
            { source: 'AMATEUR RADIO BOUNCE', result: 'NEGATIVE' },
            { source: 'INMARSAT NETWORK', result: 'NEGATIVE' },
            { source: 'CLASSIFIED NSA TRANSMISSION', result: 'SIGNATURE MATCH', isCause: true },
        ]
    ];

    // Real signal checks (1995-era technology)
    const realSignalChecks = [
        { source: 'GPS SATELLITE CONSTELLATION', result: 'NEGATIVE' },
        { source: 'DSCS MILITARY NETWORK', result: 'NEGATIVE' },
        { source: 'COMMERCIAL BROADCAST SATELLITES', result: 'NEGATIVE' },
        { source: 'INTELSAT/INMARSAT NETWORK', result: 'NEGATIVE' },
        { source: 'TERRESTRIAL RFI SOURCES', result: 'NEGATIVE' },
        { source: 'LUNAR SIGNAL BOUNCE', result: 'NEGATIVE' },
        { source: 'AIRCRAFT/SHIP TRANSPONDERS', result: 'NEGATIVE' },
        { source: 'DEEP SPACE NETWORK', result: 'NEGATIVE' },
        { source: 'CLASSIFIED GOVERNMENT ASSETS', result: 'NEGATIVE' },
        { source: 'KNOWN PULSAR DATABASE', result: 'NO MATCH' },
    ];

    let checks;
    const isFalsePositive = star.isFalsePositive;

    if (isFalsePositive) {
        checks = falsePositiveSources[Math.floor(Math.random() * falsePositiveSources.length)];
    } else {
        checks = realSignalChecks;
    }

    let checkIndex = 0;

    function runNextCheck() {
        if (checkIndex < checks.length) {
            const check = checks[checkIndex];

            const checkLine = document.createElement('div');
            checkLine.innerHTML = `<span style="color: #0ff;">▶</span> Checking: ${check.source}...`;
            verifyDisplay.appendChild(checkLine);
            playTypingBeep();

            setTimeout(() => {
                const resultColor = check.isCause ? '#f00' : (check.result === 'NEGATIVE' || check.result === 'NO MATCH' ? '#0f0' : '#ff0');
                checkLine.innerHTML = `<span style="color: #0ff;">▶</span> ${check.source}: <span style="color: ${resultColor};">${check.result}</span>`;

                if (check.isCause) {
                    playSecurityBeep('warning');
                } else {
                    playTypingBeep();
                }

                checkIndex++;

                if (check.isCause) {
                    setTimeout(() => showFalsePositiveResult(star, check, verifyDisplay), 1000);
                } else {
                    setTimeout(runNextCheck, 400);
                }
            }, 600);
        } else {
            setTimeout(() => showVerifiedSignalResult(star, verifyDisplay), 1000);
        }
    }

    const header = document.createElement('div');
    header.innerHTML = '<span style="color: #ff0;">═══ SOURCE VERIFICATION ═══</span>';
    header.style.cssText = 'margin-bottom: 15px; text-align: center; font-size: 16px;';
    verifyDisplay.appendChild(header);

    setTimeout(runNextCheck, 500);
}

// Show false positive result
function showFalsePositiveResult(star, cause, display) {
    gameState.scanResults.set(star.id, {
        type: 'false_positive',
        source: cause.source
    });

    // Auto-save after scan result
    autoSave();

    const resultDiv = document.createElement('div');
    resultDiv.style.cssText = 'margin-top: 20px; padding: 15px; border: 2px solid #f00; background: rgba(255, 0, 0, 0.1);';

    resultDiv.innerHTML = `
        <div style="color: #f00; font-size: 18px; text-shadow: 0 0 5px #f00; margin-bottom: 10px;">
            ⚠ FALSE POSITIVE IDENTIFIED ⚠
        </div>
        <div style="color: #ff0; font-size: 14px;">
            Signal source: ${cause.source}<br>
            Classification: TERRESTRIAL/KNOWN SOURCE<br><br>
            <span style="color: #0f0;">Signal logged for calibration purposes.</span>
        </div>
    `;

    display.appendChild(resultDiv);

    switchToBackgroundMusic();
    stopAlienSignalSound();

    setTimeout(() => {
        const returnBtn = document.createElement('button');
        returnBtn.textContent = 'RETURN TO ARRAY';
        returnBtn.className = 'btn';
        returnBtn.style.cssText = 'margin-top: 15px; background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0; color: #0f0;';
        returnBtn.addEventListener('click', () => {
            playClick();
            document.getElementById('contact-protocol-box').style.display = 'none';
            document.getElementById('analyze-btn').disabled = false;
            showView('starmap-view');
            log(`False positive from ${star.name} - Source: ${cause.source}`);
            // Check if day is complete after false positive
            checkAndShowDayComplete();
        });
        display.appendChild(returnBtn);
    }, 1000);
}

// Show verified signal result
function showVerifiedSignalResult(star, display) {
    // Check if this is Ross 128 and decryption is needed
    if (star.id === ROSS_128_INDEX && !gameState.decryptionComplete) {
        showEncryptedSignalResult(star, display);
        return;
    }

    gameState.scanResults.set(star.id, {
        type: 'verified_signal'
    });

    // Auto-save after scan result
    autoSave();

    const resultDiv = document.createElement('div');
    resultDiv.style.cssText = 'margin-top: 20px; padding: 15px; border: 2px solid #f0f; background: rgba(255, 0, 255, 0.1);';

    resultDiv.innerHTML = `
        <div style="color: #f0f; font-size: 18px; text-shadow: 0 0 10px #f0f; margin-bottom: 10px;">
            ★ SIGNAL VERIFIED ★
        </div>
        <div style="color: #0ff; font-size: 14px;">
            All known sources ruled out<br>
            Origin: EXTRASOLAR<br>
            Distance: ${star.distance} light years<br><br>
            <span style="color: #ff0; text-shadow: 0 0 5px #ff0;">SIGNAL IS OF UNKNOWN ORIGIN</span>
        </div>
    `;

    display.appendChild(resultDiv);
    playSecurityBeep('success');

    setTimeout(() => {
        const contactDiv = document.createElement('div');
        contactDiv.style.cssText = 'margin-top: 20px; text-align: center;';

        const question = document.createElement('p');
        question.textContent = 'INITIATE CONTACT PROTOCOL?';
        question.style.cssText = 'color: #f0f; text-shadow: 0 0 5px #f0f; font-size: 18px; margin-bottom: 15px;';
        contactDiv.appendChild(question);

        const buttonContainer = document.createElement('div');

        const yesBtn = document.createElement('button');
        yesBtn.textContent = 'YES';
        yesBtn.className = 'btn';
        yesBtn.style.cssText = 'background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0; color: #0f0; margin: 5px; padding: 8px 20px;';
        yesBtn.addEventListener('click', () => {
            playClick();
            buttonContainer.remove();
            question.textContent = '[INITIATING CONTACT PROTOCOL]';
            setTimeout(() => {
                initiateContact(star);
            }, 1000);
        });

        const noBtn = document.createElement('button');
        noBtn.textContent = 'NO';
        noBtn.className = 'btn';
        noBtn.style.cssText = 'background: rgba(255, 0, 0, 0.1); border: 2px solid #f00; color: #f00; margin: 5px; padding: 8px 20px;';
        noBtn.addEventListener('click', () => {
            playClick();
            buttonContainer.remove();
            question.textContent = '[CONTACT PROTOCOL ABORTED]';
            question.style.cssText = 'color: #f00; text-shadow: 0 0 5px #f00; font-size: 16px;';
            log('Contact protocol aborted by operator');
            document.getElementById('analyze-btn').disabled = false;
            // Check if day is complete
            checkAndShowDayComplete();
        });

        buttonContainer.appendChild(yesBtn);
        buttonContainer.appendChild(noBtn);
        contactDiv.appendChild(buttonContainer);
        display.appendChild(contactDiv);
    }, 1500);
}

// Show encrypted signal result (Ross 128 before decryption)
function showEncryptedSignalResult(star, display) {
    const resultDiv = document.createElement('div');
    resultDiv.style.cssText = 'margin-top: 20px; padding: 15px; border: 2px solid #ff0; background: rgba(255, 255, 0, 0.1);';

    resultDiv.innerHTML = `
        <div style="color: #ff0; font-size: 18px; text-shadow: 0 0 10px #ff0; margin-bottom: 10px;">
            ⚠ ENCRYPTED SIGNAL DETECTED ⚠
        </div>
        <div style="color: #0ff; font-size: 14px;">
            Signal verified as EXTRASOLAR origin<br>
            Distance: ${star.distance} light years<br><br>
            <span style="color: #f0f; text-shadow: 0 0 5px #f0f;">
                WARNING: Signal contains complex encoding<br>
                Standard protocols cannot decode content
            </span><br><br>
            <span style="color: #0f0;">
                QUANTUM DECRYPTION SYSTEM: AVAILABLE
            </span>
        </div>
    `;

    display.appendChild(resultDiv);
    playSecurityBeep('warning');

    setTimeout(() => {
        const decryptDiv = document.createElement('div');
        decryptDiv.style.cssText = 'margin-top: 20px; text-align: center;';

        const question = document.createElement('p');
        question.textContent = 'INITIATE QUANTUM DECRYPTION?';
        question.style.cssText = 'color: #ff0; text-shadow: 0 0 5px #ff0; font-size: 18px; margin-bottom: 15px;';
        decryptDiv.appendChild(question);

        const buttonContainer = document.createElement('div');

        const yesBtn = document.createElement('button');
        yesBtn.textContent = 'DECRYPT';
        yesBtn.className = 'btn';
        yesBtn.style.cssText = 'background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0; color: #0f0; margin: 5px; padding: 8px 20px;';
        yesBtn.addEventListener('click', () => {
            playClick();
            buttonContainer.remove();
            question.textContent = '[INITIALIZING QUANTUM PROCESSOR...]';

            setTimeout(() => {
                document.getElementById('contact-protocol-box').style.display = 'none';
                startDecryptionMinigame(
                    // Success callback
                    () => {
                        log('DECRYPTION COMPLETE - Signal decoded!', 'highlight');
                        // Award first fragment
                        if (!gameState.fragments.sources.ross128) {
                            gameState.fragments.collected.push('ross128');
                            gameState.fragments.sources.ross128 = true;
                            log('FRAGMENT ACQUIRED: Ross 128 signal data', 'highlight');
                        }

                        // Launch alignment tutorial if not completed
                        // Start immediately - alignment has its own full-screen overlay
                        if (!gameState.tutorialCompleted) {
                            log('INITIALIZING ALIGNMENT TRAINING...', 'info');
                            startAlignmentTutorial(
                                () => {
                                    log('Training complete! Return to Ross 128 to establish contact.', 'info');
                                    showView('starmap-view');
                                    document.getElementById('analyze-btn').disabled = false;
                                },
                                () => {
                                    log('Training skipped. Return to Ross 128 to establish contact.', 'info');
                                    gameState.tutorialCompleted = true; // Mark as done if skipped
                                    showView('starmap-view');
                                    document.getElementById('analyze-btn').disabled = false;
                                }
                            );
                        } else {
                            // Tutorial already done, just continue
                            showView('starmap-view');
                            log('Return to Ross 128 to establish contact.', 'info');
                            document.getElementById('analyze-btn').disabled = false;
                        }
                    },
                    // Cancel callback
                    () => {
                        showView('starmap-view');
                        log('Decryption aborted.', 'warning');
                        document.getElementById('analyze-btn').disabled = false;
                    }
                );
            }, 1500);
        });

        const noBtn = document.createElement('button');
        noBtn.textContent = 'ABORT';
        noBtn.className = 'btn';
        noBtn.style.cssText = 'background: rgba(255, 0, 0, 0.1); border: 2px solid #f00; color: #f00; margin: 5px; padding: 8px 20px;';
        noBtn.addEventListener('click', () => {
            playClick();
            buttonContainer.remove();
            question.textContent = '[DECRYPTION ABORTED]';
            question.style.cssText = 'color: #f00; text-shadow: 0 0 5px #f00; font-size: 16px;';
            log('Quantum decryption aborted by operator');
            document.getElementById('analyze-btn').disabled = false;
        });

        buttonContainer.appendChild(yesBtn);
        buttonContainer.appendChild(noBtn);
        decryptDiv.appendChild(buttonContainer);
        display.appendChild(decryptDiv);
    }, 1500);
}

// Initiate contact
function initiateContact(star) {
    log('='.repeat(50), 'highlight');
    log('CONTACT PROTOCOL INITIATED', 'highlight');
    log('='.repeat(50), 'highlight');

    playContactSound();

    const isFirstContact = gameState.contactedStars.size === 0;

    gameState.contactedStars.add(star.id);
    updateStarStatus(star.id, 'contact');

    // Award fragments for specific Day 3 contacts
    awardContactFragment(star);

    // Auto-save after contact
    autoSave();

    if (isFirstContact) {
        setTimeout(() => {
            sendFirstContactEmail();
        }, 5000);
    }

    document.getElementById('contact-protocol-box').style.display = 'none';
    showView('contact-view');

    const messageData = ALIEN_CONTACTS.find(m => m.starIndex === star.id);
    displayContactMessage(messageData, star);
}

// Award fragments for Day 3 contacts
function awardContactFragment(star) {
    // Van Maanen's Star - "The Network" - gives hd219134 fragment (shared network data)
    if (star.id === VAN_MAANENS_INDEX && !gameState.fragments.sources.hd219134) {
        gameState.fragments.collected.push('hd219134');
        gameState.fragments.sources.hd219134 = true;
        log('FRAGMENT ACQUIRED: Network shared intelligence data', 'highlight');
    }

    // Gliese 832 - Megastructure beacon - gives gliese832 fragment
    if (star.id === GLIESE_832_INDEX && !gameState.fragments.sources.gliese832) {
        gameState.fragments.collected.push('gliese832');
        gameState.fragments.sources.gliese832 = true;
        log('FRAGMENT ACQUIRED: Gliese 832 megastructure coordinates', 'highlight');
    }
}

// Display contact message
function displayContactMessage(messageData, star) {
    const messageDisplay = document.getElementById('message-display');
    messageDisplay.innerHTML = '';

    // Store star for post-message actions
    const currentStar = star;

    if (Array.isArray(messageData)) {
        displayMessages(messageData, () => showPostContactActions(currentStar));
        return;
    }

    if (messageData.hasImage) {
        displayMessages(messageData.beforeImage, () => {
            showImageGenerationPrompt(messageData, currentStar);
        });
    } else {
        displayMessages(messageData.messages || [], () => showPostContactActions(currentStar));
    }

    function displayMessages(messages, callback) {
        let lineIndex = 0;

        function displayNextLine() {
            if (lineIndex < messages.length) {
                const line = document.createElement('div');
                line.className = 'message-line';
                line.textContent = messages[lineIndex];
                line.style.animationDelay = '0s';
                messageDisplay.appendChild(line);

                lineIndex++;
                messageDisplay.scrollTop = messageDisplay.scrollHeight;
                setTimeout(displayNextLine, 800);
            } else if (callback) {
                callback();
            }
        }

        displayNextLine();
    }

    function showImageGenerationPrompt(messageData, star) {
        const prompt = document.createElement('div');
        prompt.className = 'message-line';
        prompt.textContent = 'GENERATE IMAGE FROM DATA?';
        prompt.style.cssText = 'color: #0ff; text-shadow: 0 0 5px #0ff; font-size: 24px; margin-top: 20px;';
        messageDisplay.appendChild(prompt);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'margin-top: 15px; text-align: center;';

        const yesBtn = document.createElement('button');
        yesBtn.textContent = 'YES';
        yesBtn.className = 'btn';
        yesBtn.style.cssText = 'background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0; color: #0f0; margin: 0 10px;';
        yesBtn.addEventListener('click', () => {
            playClick();
            buttonContainer.remove();
            prompt.textContent = 'GENERATING IMAGE...';
            setTimeout(() => {
                displayImageData(messageData, star);
            }, 1000);
        });

        const noBtn = document.createElement('button');
        noBtn.textContent = 'NO';
        noBtn.className = 'btn';
        noBtn.style.cssText = 'background: rgba(255, 0, 0, 0.1); border: 2px solid #f00; color: #f00; margin: 0 10px;';
        noBtn.addEventListener('click', () => {
            playClick();
            buttonContainer.remove();
            prompt.textContent = '[IMAGE GENERATION SKIPPED]';
            setTimeout(() => {
                displayMessages(messageData.afterImage, () => showPostContactActions(star));
            }, 1000);
        });

        buttonContainer.appendChild(yesBtn);
        buttonContainer.appendChild(noBtn);
        messageDisplay.appendChild(buttonContainer);
    }

    function displayImageData(messageData, star) {
        // Wrapper to center the image box
        const imageWrapper = document.createElement('div');
        imageWrapper.style.cssText = 'text-align: center; margin: 20px 0;';
        messageDisplay.appendChild(imageWrapper);

        const imageBox = document.createElement('div');
        imageBox.style.cssText = 'border: 2px solid #0ff; background: rgba(0, 255, 255, 0.05); padding: 10px; display: inline-block; text-align: left; overflow-x: auto; max-width: 100%;';
        imageWrapper.appendChild(imageBox);

        let lineIndex = 0;
        function displayNextImageLine() {
            if (lineIndex < messageData.imageData.length) {
                const imageLine = document.createElement('div');
                imageLine.className = 'message-line';
                imageLine.textContent = messageData.imageData[lineIndex];
                imageLine.style.cssText = 'color: #0ff; text-shadow: 0 0 3px #0ff; animation: fadeIn 0.2s forwards; margin: 0; line-height: 1.0; font-size: 10px; white-space: pre; font-family: "Courier New", monospace;';
                imageBox.appendChild(imageLine);

                messageDisplay.scrollTop = messageDisplay.scrollHeight;

                lineIndex++;
                setTimeout(displayNextImageLine, 50);
            } else {
                setTimeout(() => {
                    displayMessages(messageData.afterImage, () => showPostContactActions(star));
                }, 1000);
            }
        }

        displayNextImageLine();
    }

    // Show post-contact actions (triangulation offer for Day 3)
    function showPostContactActions(star) {
        if (!star) return;

        // Check if this is Gliese 832 (megastructure) - offer triangulation
        if (star.id === GLIESE_832_INDEX && !gameState.cmbDetected) {
            setTimeout(() => {
                showTriangulationOffer();
            }, 2000);
        }
    }

    function showTriangulationOffer() {
        const prompt = document.createElement('div');
        prompt.className = 'message-line';
        prompt.style.cssText = 'color: #0ff; text-shadow: 0 0 10px #0ff; font-size: 18px; margin-top: 30px; text-align: center;';
        prompt.innerHTML = `
            <div style="margin-bottom: 15px;">
                ◆ TRIANGULATION DATA DETECTED ◆
            </div>
            <div style="color: #0a0; font-size: 14px; margin-bottom: 15px;">
                Signal contains coordinate vectors from multiple civilizations.<br>
                Cross-reference to locate CMB signal origin?
            </div>
        `;
        messageDisplay.appendChild(prompt);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'margin-top: 15px; text-align: center;';

        const yesBtn = document.createElement('button');
        yesBtn.textContent = 'INITIATE TRIANGULATION';
        yesBtn.className = 'btn';
        yesBtn.style.cssText = 'background: rgba(0, 255, 255, 0.1); border: 2px solid #0ff; color: #0ff; margin: 0 10px; padding: 10px 20px;';
        yesBtn.addEventListener('click', () => {
            playClick();
            buttonContainer.remove();
            prompt.innerHTML = '<div style="color: #0ff;">[INITIALIZING TRIANGULATION ARRAY...]</div>';

            setTimeout(() => {
                startTriangulationMinigame(
                    // Success callback
                    () => {
                        log('TRIANGULATION COMPLETE - CMB origin located!', 'highlight');
                        showView('starmap-view');
                        checkAndShowDayComplete();
                    },
                    // Cancel callback
                    () => {
                        log('Triangulation aborted.', 'warning');
                        showView('contact-view');
                    }
                );
            }, 1500);
        });

        const noBtn = document.createElement('button');
        noBtn.textContent = 'LATER';
        noBtn.className = 'btn';
        noBtn.style.cssText = 'background: rgba(100, 100, 0, 0.1); border: 2px solid #aa0; color: #aa0; margin: 0 10px; padding: 10px 20px;';
        noBtn.addEventListener('click', () => {
            playClick();
            buttonContainer.remove();
            prompt.innerHTML = '<div style="color: #aa0;">[TRIANGULATION DEFERRED]</div>';
        });

        buttonContainer.appendChild(yesBtn);
        buttonContainer.appendChild(noBtn);
        messageDisplay.appendChild(buttonContainer);
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
    }
}

// Update star status in catalog
export function updateStarStatus(starId, status) {
    const starElement = document.querySelector(`[data-star-id="${starId}"]`);
    if (!starElement) return;

    const statusElement = starElement.querySelector('.star-status');

    if (status === 'analyzed') {
        starElement.classList.add('analyzed');
        statusElement.textContent = '✓';
    } else if (status === 'contact') {
        starElement.classList.remove('analyzed');
        starElement.classList.add('contact');
        statusElement.textContent = '★';
    }
}
