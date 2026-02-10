// ═════════════════════════════════════════════════════════════════════════════
// SCANNING SYSTEM
// Signal generation, analysis, and contact protocols
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { autoSave } from '../core/save-system.js';
import { showView, log, typeAnalysisText } from '../ui/rendering.js';
import { playClick, playAnalysisSound, playContactSound, playSecurityBeep, playTypingBeep, playStaticBurst, playPowerDownSound, stopAllMusic, stopNaturalPhenomenaSound, stopAlienSignalSound, startFragmentSignalSound, stopFragmentSignalSound, switchToBackgroundMusic, switchToAlienMusic } from './audio.js';
import { startTuningMinigame } from './tuning-minigame.js';
import { startPatternRecognitionGame } from './pattern-minigame.js';
import { startDecryptionMinigame } from './decryption-minigame.js';
import { startAlignmentTutorial, startSingleFragmentAlignment } from './alignment-minigame.js';
import { startTriangulationMinigame } from './triangulation-minigame.js';
import { sendFirstContactEmail, addMailMessage, checkScanTriggeredEmails } from './mailbox.js';
import { checkAndShowDayComplete } from './day-report.js';
import { ALIEN_CONTACTS } from '../narrative/alien-contacts.js';
import { unlockInvestigation, onFragmentCollected } from './investigation.js';
import { updateStarCatalogDisplay } from '../ui/starmap.js';
import { addJournalEntry, showJournalButton, addFirstScanMusing, addPersonalLog, checkScanMilestoneMusings } from './journal.js';

// Ross 128 star index - requires decryption
const ROSS_128_INDEX = 8;

// Track whether the pre-Ross-128 unease email has been sent
let preRoss128EmailSent = false;

// Check if we should send the CMB unease email (Day 1, after 3rd non-Ross-128 scan)
function checkPreRoss128Unease() {
    if (preRoss128EmailSent) return;
    if (gameState.currentDay !== 1) return;
    if (gameState.decryptionComplete) return; // Already past Ross 128

    // Count Day 1 scans that aren't Ross 128
    let day1ScanCount = 0;
    for (const [id] of gameState.scanResults) {
        if (id !== ROSS_128_INDEX) day1ScanCount++;
    }

    if (day1ScanCount >= 3) {
        preRoss128EmailSent = true;
        const name = gameState.playerName;
        setTimeout(() => {
            addMailMessage(
                'Dr. Eleanor Chen - Radio Astronomy',
                'Background Pattern — Probably Nothing',
                `Dr. ${name},\n\nThis might be nothing, but there's a low-level pattern in the cosmic microwave background data from your sector. It's below our standard detection threshold, but it's structured. Almost like a carrier wave.\n\nI can't isolate the source. It's not coming from any single star — it's more like it's embedded in the background itself.\n\nKeep scanning. If you notice anything unusual in the Ross 128 region, flag it immediately.\n\n- Eleanor`
            );
        }, 10000);
    }
}

// Convert a star ID to a numeric seed (handles string IDs from dynamic stars)
function numericSeed(id) {
    if (typeof id === 'number') return id + 1;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash) + id.charCodeAt(i);
        hash = Math.abs(hash | 0);
    }
    return hash || 1;
}

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
    stopFragmentSignalSound();

    // Clear cached data for Ross 128 if decryption is pending (Day 2 rescan)
    if (star.id === ROSS_128_INDEX && !gameState.decryptionComplete &&
        gameState.scanResults.get(star.id)?.type === 'encrypted_signal') {
        gameState.scannedSignals.delete(star.id);
        gameState.scanResults.delete(star.id);
        gameState.analyzedStars.delete(star.id);
    }

    // Check for cached scan data (with canvas data intact — not from a save/load cycle)
    if (gameState.scannedSignals.has(star.id)) {
        const cachedSignal = gameState.scannedSignals.get(star.id);

        // If canvas data is available, use it for instant replay
        if (cachedSignal.waveformData instanceof ImageData) {
            log(`Retrieving archived scan data: ${star.name}`, 'highlight');
            gameState.currentSignal = cachedSignal;

            document.getElementById('analysis-text').innerHTML =
                '<p>LOADING ARCHIVED SCAN DATA...</p>';

            const waveCanvas = document.getElementById('waveform-canvas');
            const waveCtx = waveCanvas.getContext('2d');
            waveCtx.putImageData(cachedSignal.waveformData, 0, 0);

            const specCanvas = document.getElementById('spectrogram-canvas');
            const specCtx = specCanvas.getContext('2d');
            specCtx.putImageData(cachedSignal.spectrogramData, 0, 0);

            startSignalAnimation();
            log('Archived scan data loaded');
            // Only enable analyze if signal hasn't been fully analyzed yet
            const alreadyAnalyzed = cachedSignal.analyzed || gameState.scanResults.has(star.id);
            document.getElementById('analyze-btn').disabled = alreadyAnalyzed;
            // Keep scan button disabled and mark as complete
            const scanBtn = document.getElementById('scan-btn');
            scanBtn.disabled = true;
            scanBtn.textContent = '✓ SCAN COMPLETE';
            return;
        }
        // If no canvas data (restored from save), fall through to re-scan
    }

    log(`Initiating deep space scan: ${star.name}`, 'highlight');
    log('Aligning radio telescope array...');
    log('Tuning receivers to target frequency...');

    document.getElementById('scan-btn').disabled = true;
    document.getElementById('analysis-text').innerHTML =
        '<p>INITIALIZING SCAN...</p><p>CALIBRATING RECEIVERS...</p>';

    // Clear previous spectrogram/waveform data to prevent persistence from prior scans
    const waveCanvas = document.getElementById('waveform-canvas');
    const waveCtx = waveCanvas.getContext('2d');
    waveCtx.globalAlpha = 1.0;
    waveCtx.fillStyle = '#000';
    waveCtx.fillRect(0, 0, waveCanvas.width, waveCanvas.height);

    const specCanvas = document.getElementById('spectrogram-canvas');
    const specCtx = specCanvas.getContext('2d');
    specCtx.globalAlpha = 1.0;
    specCtx.fillStyle = '#000';
    specCtx.fillRect(0, 0, specCanvas.width, specCanvas.height);

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

    // Deep space (dynamic) signals skip tuning/verification — show encrypted result directly
    if (star.isDynamic && star.hasIntelligence) {
        generateSignal(star, true);
        startSignalAnimation();
        startFragmentSignalSound(star);

        document.getElementById('scan-btn').textContent = '✓ SCAN COMPLETE';
        document.getElementById('analyze-btn').disabled = true;

        setTimeout(() => {
            const contactBox = document.getElementById('contact-protocol-box');
            const contactContent = document.getElementById('contact-protocol-content');
            contactBox.style.display = 'block';
            contactContent.innerHTML = '';

            const display = document.createElement('div');
            display.style.cssText = 'text-align: left; font-size: 14px; line-height: 1.8;';
            contactContent.appendChild(display);

            showDynamicEncryptedResult(star, display);
        }, 1500);
    } else {
        startTuningMinigame(star);
    }
}

// Direct decryption for Ross 128 (bypasses scanning pipeline)
// Used when Ross 128 is already analyzed but needs decryption on Day 2
export function startRoss128DirectDecryption() {
    const star = gameState.currentStar;
    if (!star || star.id !== ROSS_128_INDEX) return;

    // Prevent re-decryption if already completed
    if (gameState.decryptionComplete) {
        log('Ross 128 signal already decrypted.', 'info');
        return;
    }

    // Set up analysis view target info
    document.getElementById('target-name').textContent = star.name;
    document.getElementById('target-coords').textContent = star.coordinates;
    document.getElementById('target-distance').textContent = star.distance;
    document.getElementById('target-type').textContent = star.starType;
    document.getElementById('target-class').textContent = star.starClass;
    document.getElementById('target-temp').textContent = star.temperature;

    // Draw star visualization
    if (drawStarVisualizationFn) drawStarVisualizationFn(star, 'analysis-star-visual');

    showView('analysis-view');

    // Generate analyzed signal and start animation
    generateSignal(star, true);
    startSignalAnimation();

    // Disable scan/analyze buttons (we're bypassing the pipeline)
    document.getElementById('scan-btn').disabled = true;
    document.getElementById('scan-btn').textContent = '✓ SCAN COMPLETE';
    document.getElementById('analyze-btn').disabled = true;

    // Show encrypted signal result directly
    const contactBox = document.getElementById('contact-protocol-box');
    const contactContent = document.getElementById('contact-protocol-content');
    contactBox.style.display = 'block';
    contactContent.innerHTML = '';

    const display = document.createElement('div');
    display.style.cssText = 'text-align: left; font-size: 14px; line-height: 1.8;';
    contactContent.appendChild(display);

    showEncryptedSignalResult(star, display);
}

// Special scan for SRC-7024 during Day 2 cliffhanger
// Starts a normal-looking scan, then triggers crash/scramble sequence
export function initiateSRC7024CrashScan() {
    const star = gameState.currentStar;
    if (!star || star.id !== 'src7024') return;

    log(`Initiating deep space scan: ${star.name}`, 'highlight');
    log('Aligning radio telescope array...');

    // Set up analysis view
    document.getElementById('target-name').textContent = star.name;
    document.getElementById('target-coords').textContent = star.coordinates;
    document.getElementById('target-distance').textContent = star.distance;
    document.getElementById('target-type').textContent = star.starType;
    document.getElementById('target-class').textContent = star.starClass;
    document.getElementById('target-temp').textContent = star.temperature;

    document.getElementById('scan-btn').disabled = true;
    document.getElementById('analyze-btn').disabled = true;
    document.getElementById('analysis-text').innerHTML =
        '<p>INITIALIZING SCAN...</p><p>CALIBRATING RECEIVERS...</p>';

    showView('analysis-view');

    // Phase 1: Normal-looking scan start
    setTimeout(() => {
        log('Signal acquisition in progress...');
        document.getElementById('analysis-text').innerHTML +=
            '<p style="color: #0ff;">SIGNAL DETECTED...</p><p>LOCKING ON TARGET...</p>';
    }, 1500);

    setTimeout(() => {
        log('SIGNAL LOCK ESTABLISHED', 'highlight');
        document.getElementById('analysis-text').innerHTML +=
            '<p style="color: #0f0;">✓ SIGNAL LOCK ESTABLISHED</p>';
        playSecurityBeep('success');
    }, 3000);

    // Phase 2: Things go wrong
    setTimeout(() => {
        log('WARNING: Signal strength increasing exponentially', 'warning');
        document.getElementById('analysis-text').innerHTML +=
            '<p style="color: #ff0;">⚠ SIGNAL STRENGTH ANOMALY</p>';
        playSecurityBeep('warning');
    }, 4000);

    // Phase 2.5: The signal is responding — one extra second of dread
    setTimeout(() => {
        log('ALERT: Signal appears to be responding to our scan...', 'warning');
        document.getElementById('analysis-text').innerHTML +=
            '<p style="color: #f00;">⚠ SIGNAL RESPONDING TO SCAN...</p>';
    }, 4500);

    // Phase 3: Crash begins
    setTimeout(() => {
        // Advance state machine
        import('./day-report.js').then(module => {
            module.advanceDay2Cliffhanger(1);
        });
        startCrashSequence();
    }, 6000);
}

function startCrashSequence() {
    // Stop signal animation audio before crash takes over
    stopSignalAnimation();

    // ── Phase 0: Screen glitch lead-up (distort the analysis view before overlay) ──
    const analysisView = document.getElementById('analysis-view');
    const gameContainer = document.querySelector('.game-container') || document.body;
    let glitchFrame = 0;
    const glitchDuration = 120; // ~2 seconds at 60fps

    function runScreenGlitch() {
        glitchFrame++;
        const progress = glitchFrame / glitchDuration;

        // Increasingly distort the underlying page
        const skewX = (Math.random() - 0.5) * progress * 8;
        const skewY = (Math.random() - 0.5) * progress * 3;
        const translateX = (Math.random() - 0.5) * progress * 20;
        const hueShift = Math.random() * progress * 180;
        const saturation = 100 + progress * 300;
        const blur = progress * 2;

        gameContainer.style.transform = `skew(${skewX}deg, ${skewY}deg) translateX(${translateX}px)`;
        gameContainer.style.filter = `hue-rotate(${hueShift}deg) saturate(${saturation}%) blur(${blur}px)`;

        // Occasional hard flicker
        if (Math.random() < progress * 0.3) {
            gameContainer.style.opacity = Math.random() > 0.5 ? '0.3' : '1';
        }

        // Inject glitch text into analysis
        if (progress > 0.3 && Math.random() < progress * 0.15) {
            const analysisText = document.getElementById('analysis-text');
            if (analysisText) {
                const glitchChars = '█▓▒░╔╗╚╝║═┃━▲▼◆◇○●';
                let glitchStr = '';
                for (let i = 0; i < 20 + Math.random() * 30; i++) {
                    glitchStr += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }
                const colors = ['#f00', '#ff0', '#f0f', '#0ff'];
                analysisText.innerHTML += `<p style="color: ${colors[Math.floor(Math.random() * colors.length)]};">${glitchStr}</p>`;
            }
        }

        if (glitchFrame < glitchDuration) {
            requestAnimationFrame(runScreenGlitch);
        } else {
            // Reset styles and launch the full crash overlay
            gameContainer.style.transform = '';
            gameContainer.style.filter = '';
            gameContainer.style.opacity = '1';
            launchCrashOverlay();
        }
    }

    // Start the screen glitch with a small static pop
    playStaticBurst();
    runScreenGlitch();
}

function launchCrashOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'crash-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: #000; z-index: 9998; pointer-events: all;
    `;

    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = 'width: 100%; height: 100%; display: block;';
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    let frame = 0;
    const totalFrames = 270; // ~4.5 seconds at 60fps

    const codeChars = '0123456789ABCDEFabcdef!@#$%^&*<>{}[]|/\\';
    function randomCode(len) {
        let s = '';
        for (let i = 0; i < len; i++) s += codeChars[Math.floor(Math.random() * codeChars.length)];
        return s;
    }

    const shapes = ['triangle', 'circle', 'hexagon', 'diamond'];

    function drawShape(type, x, y, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        switch (type) {
            case 'triangle':
                ctx.moveTo(x, y - size);
                ctx.lineTo(x - size * 0.866, y + size * 0.5);
                ctx.lineTo(x + size * 0.866, y + size * 0.5);
                ctx.closePath();
                break;
            case 'circle':
                ctx.arc(x, y, size, 0, Math.PI * 2);
                break;
            case 'hexagon':
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i - Math.PI / 2;
                    const px = x + size * Math.cos(angle);
                    const py = y + size * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.closePath();
                break;
            case 'diamond':
                ctx.moveTo(x, y - size);
                ctx.lineTo(x + size * 0.7, y);
                ctx.lineTo(x, y + size);
                ctx.lineTo(x - size * 0.7, y);
                ctx.closePath();
                break;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    function renderCrashFrame() {
        frame++;
        const progress = frame / totalFrames;

        // Background: increasingly dark
        const bgAlpha = Math.min(0.95, 0.2 + progress * 0.75);
        ctx.fillStyle = `rgba(0, 0, 0, ${bgAlpha})`;
        ctx.fillRect(0, 0, w, h);

        // Phase 1: Random code text — slow buildup, then intensifies
        if (progress < 0.75) {
            const textIntensity = Math.min(1, progress * 2);
            const lineCount = Math.floor(textIntensity * 40);
            const fontSize = 14 + Math.floor(progress * 8);
            ctx.font = `${fontSize}px VT323, monospace`;
            for (let i = 0; i < lineCount; i++) {
                const colors = ['#0f0', '#0ff', '#f0f', '#ff0', '#f00'];
                ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                ctx.globalAlpha = Math.random() * 0.8 + 0.2;
                ctx.fillText(randomCode(Math.floor(Math.random() * 30 + 5)),
                    Math.random() * w, Math.random() * h);
            }
            ctx.globalAlpha = 1;
        }

        // Phase 2: Geometric shapes — earlier start, more buildup
        if (progress > 0.15 && progress < 0.85) {
            const shapeProg = (progress - 0.15) / 0.7;
            const shapeCount = Math.floor(shapeProg * shapeProg * 25);
            for (let i = 0; i < shapeCount; i++) {
                const colors = ['#0ff', '#f0f', '#ff0', '#f00', '#0f0'];
                ctx.globalAlpha = Math.random() * 0.6 + 0.1;
                const size = 20 + Math.random() * (60 + shapeProg * 60);
                drawShape(
                    shapes[Math.floor(Math.random() * shapes.length)],
                    Math.random() * w, Math.random() * h,
                    size,
                    colors[Math.floor(Math.random() * colors.length)]
                );
            }
            ctx.globalAlpha = 1;
        }

        // Phase 3: Horizontal scan line distortion — wider range
        if (progress > 0.4 && progress < 0.92) {
            const distortionIntensity = Math.min(1, (progress - 0.4) * 3);
            const barCount = Math.floor(5 + distortionIntensity * 12);
            for (let i = 0; i < barCount; i++) {
                const y = Math.random() * h;
                const barHeight = 2 + Math.random() * (6 + distortionIntensity * 6);
                const shift = (Math.random() - 0.5) * (60 + distortionIntensity * 80);
                ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255, 0, 0' : '0, 255, 255'}, ${Math.random() * 0.4 + distortionIntensity * 0.1})`;
                ctx.fillRect(shift, y, w, barHeight);
            }
        }

        // Phase 4: Color bleaching
        if (progress > 0.75 && progress < 0.95) {
            const bleachAlpha = (progress - 0.75) * 2.5;
            ctx.fillStyle = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 100)}, ${bleachAlpha * 0.3})`;
            ctx.fillRect(0, 0, w, h);
        }

        // Phase 5: Fade to black
        if (progress > 0.92) {
            const fadeAlpha = (progress - 0.92) * 12.5;
            ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
            ctx.fillRect(0, 0, w, h);
        }

        if (frame < totalFrames) {
            requestAnimationFrame(renderCrashFrame);
        } else {
            // Screen is black — stop all music immediately
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, w, h);
            stopAllMusic();

            // Play power-down sound (fades out at end), wait for completion
            playPowerDownSound().then(() => {
                // 5 seconds of dead silence on black screen — agonizing
                setTimeout(() => {
                    overlay.remove();
                    import('./day-report.js').then(module => {
                        module.advanceDay2Cliffhanger(2);
                    });
                }, 5000);
            });
        }
    }

    renderCrashFrame();
}

// Natural phenomena waveform patterns (5 types)
function drawNaturalWaveform(ctx, width, height, type, starId, offset) {
    const seed = numericSeed(starId);
    switch (type) {
        case 0: // Pulsar - sharp periodic spikes
            for (let x = 0; x < width; x++) {
                const xp = x + offset;
                const noise = (Math.random() - 0.5) * 15;
                const period = 40 + (seed % 5) * 8;
                const spike = Math.pow(Math.max(0, Math.cos(xp * Math.PI * 2 / period)), 12) * 55;
                const y = height / 2 + spike + noise - 15;
                if (x === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
            }
            break;
        case 1: // Solar flare - irregular bursts with exponential decay
            for (let x = 0; x < width; x++) {
                const xp = x + offset;
                const noise = (Math.random() - 0.5) * 25;
                const burstPos = (seed * 47) % 200;
                const dist = Math.abs((xp % 250) - burstPos);
                const burst = Math.exp(-dist * 0.03) * 60;
                const rumble = Math.sin(xp * 0.15) * 12;
                const y = height / 2 + burst * (Math.sin(xp * 0.3) > 0 ? 1 : -0.5) + rumble + noise;
                if (x === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
            }
            break;
        case 2: // Magnetospheric - smooth swooping oscillation
            for (let x = 0; x < width; x++) {
                const xp = x + offset;
                const noise = (Math.random() - 0.5) * 10;
                const sweep = Math.sin(xp * 0.005 + seed) * 40;
                const wobble = Math.sin(xp * 0.06) * (15 + 10 * Math.sin(xp * 0.008));
                const y = height / 2 + sweep + wobble + noise;
                if (x === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
            }
            break;
        case 3: // Quasar background - very low amplitude, noisy
            for (let x = 0; x < width; x++) {
                const xp = x + offset;
                const noise = (Math.random() - 0.5) * 35;
                const drift = Math.sin(xp * 0.003) * 8;
                const y = height / 2 + drift + noise;
                if (x === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
            }
            break;
        case 4: // Stellar wind - medium waves with turbulence
        default:
            for (let x = 0; x < width; x++) {
                const xp = x + offset;
                const noise = (Math.random() - 0.5) * 18;
                const wave1 = Math.sin(xp * 0.02) * 30;
                const wave2 = Math.sin(xp * 0.055 + seed) * 18;
                const gust = Math.sin(xp * 0.004) * 15;
                const y = height / 2 + wave1 + wave2 + gust + noise;
                if (x === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
            }
            break;
    }
}

// Natural phenomena spectrogram column (5 types)
function drawNaturalSpectrogramColumn(ctx, x, specHeight, type, starId, offset) {
    const seed = numericSeed(starId);
    switch (type) {
        case 0: { // Pulsar - periodic bright horizontal sweeps
            const period = 40 + (seed % 5) * 8;
            const isPulse = Math.cos(offset * Math.PI * 2 / period) > 0.85;
            const bandCenter = specHeight * (0.3 + (seed % 4) * 0.1);
            const bandWidth = 4 + (seed % 3);
            for (let y = 0; y < specHeight; y++) {
                const inBand = Math.abs(y - bandCenter) < bandWidth;
                const noise = Math.random() * 0.15;
                let intensity = noise;
                if (inBand && isPulse) {
                    intensity += 0.9 * (1 - Math.abs(y - bandCenter) / bandWidth);
                } else if (inBand) {
                    intensity += 0.15;
                }
                const b = Math.floor(intensity * 255);
                ctx.fillStyle = `rgba(0, ${b * 0.9}, ${b}, ${Math.min(1, intensity)})`;
                ctx.fillRect(x, y, 1, 1);
            }
            break;
        }
        case 1: { // Solar flare - broadband burst columns
            const burstCycle = 200 + seed * 13;
            const burstPhase = (offset % burstCycle) / burstCycle;
            const isBurst = burstPhase < 0.08;
            const burstIntensity = isBurst ? Math.exp(-burstPhase * 30) : 0;
            for (let y = 0; y < specHeight; y++) {
                const noise = Math.random() * 0.2;
                const base = 0.05 + 0.05 * Math.sin(y * 0.1);
                let intensity = base + noise + burstIntensity * 0.8;
                const b = Math.floor(Math.min(1, intensity) * 220);
                // Warm orange-green for flares
                const r = Math.floor(b * burstIntensity * 0.6);
                ctx.fillStyle = `rgba(${r}, ${b * 0.8}, ${Math.floor(b * 0.4)}, ${Math.min(1, intensity * 0.8)})`;
                ctx.fillRect(x, y, 1, 1);
            }
            break;
        }
        case 2: { // Magnetospheric - curved frequency drift lines
            const sweepFreq = 0.015 + (seed % 3) * 0.005;
            const sweepCenter = specHeight * (0.3 + 0.4 * Math.sin(offset * sweepFreq));
            const sweepWidth = 6 + 3 * Math.sin(offset * 0.01);
            for (let y = 0; y < specHeight; y++) {
                const dist = Math.abs(y - sweepCenter);
                const inSweep = dist < sweepWidth;
                const noise = Math.random() * 0.12;
                let intensity = noise;
                if (inSweep) {
                    intensity += 0.7 * (1 - dist / sweepWidth);
                }
                // Secondary fainter arc
                const sweep2Center = specHeight * (0.6 - 0.25 * Math.sin(offset * sweepFreq * 0.7 + 2));
                const dist2 = Math.abs(y - sweep2Center);
                if (dist2 < 4) {
                    intensity += 0.3 * (1 - dist2 / 4);
                }
                const b = Math.floor(Math.min(1, intensity) * 230);
                ctx.fillStyle = `rgba(0, ${b}, ${Math.floor(b * 0.7)}, ${Math.min(1, intensity)})`;
                ctx.fillRect(x, y, 1, 1);
            }
            break;
        }
        case 3: { // Quasar background - diffuse glow, slow wandering
            const glowCenter = specHeight * (0.45 + 0.15 * Math.sin(offset * 0.003 + seed));
            const glowWidth = specHeight * 0.3;
            for (let y = 0; y < specHeight; y++) {
                const dist = Math.abs(y - glowCenter);
                const glow = Math.max(0, 1 - dist / glowWidth);
                const noise = Math.random() * 0.25;
                const intensity = glow * 0.35 + noise * 0.4;
                const b = Math.floor(intensity * 140);
                ctx.fillStyle = `rgba(0, ${Math.floor(b * 0.6)}, ${b}, ${intensity * 0.5})`;
                ctx.fillRect(x, y, 1, 1);
            }
            break;
        }
        case 4: // Stellar wind - shifting bands with turbulent edges
        default: {
            const bandPos1 = specHeight * (0.3 + 0.1 * Math.sin(offset * 0.008));
            const bandPos2 = specHeight * (0.65 + 0.08 * Math.sin(offset * 0.006 + 1));
            for (let y = 0; y < specHeight; y++) {
                const dist1 = Math.abs(y - bandPos1);
                const dist2 = Math.abs(y - bandPos2);
                const band1 = dist1 < 8 ? (1 - dist1 / 8) * 0.6 : 0;
                const band2 = dist2 < 6 ? (1 - dist2 / 6) * 0.45 : 0;
                const turbulence = Math.random() * 0.15;
                const intensity = band1 + band2 + turbulence;
                const b = Math.floor(Math.min(1, intensity) * 200);
                ctx.fillStyle = `rgba(0, ${b * 0.85}, ${b}, ${Math.min(1, intensity * 0.7)})`;
                ctx.fillRect(x, y, 1, 1);
            }
            break;
        }
    }
}

// False positive spectrogram column - regular, artificial-looking
function drawFalsePositiveSpectrogramColumn(ctx, x, specHeight, starId, offset) {
    const seed = numericSeed(starId);
    const numHarmonics = 4 + (seed % 3); // 4-6 evenly spaced bands
    const spacing = specHeight / (numHarmonics + 1);
    const pulseFreq = 0.08 + (seed % 4) * 0.02;
    const pulsePhase = Math.sin(offset * pulseFreq) * 0.5 + 0.5;
    // Occasional glitch gap
    const isGlitch = Math.sin(offset * 0.17 + seed * 3) > 0.92;

    for (let y = 0; y < specHeight; y++) {
        const noise = Math.random() * 0.1;
        let intensity = noise;

        if (!isGlitch) {
            for (let h = 1; h <= numHarmonics; h++) {
                const bandCenter = spacing * h;
                const dist = Math.abs(y - bandCenter);
                if (dist < 2) {
                    intensity += pulsePhase * 0.8 * (1 - dist / 2);
                }
            }
        }

        const b = Math.floor(Math.min(1, intensity) * 220);
        // Amber/orange tint for artificial signals
        ctx.fillStyle = `rgba(${Math.floor(b * 0.8)}, ${Math.floor(b * 0.6)}, 0, ${Math.min(1, intensity)})`;
        ctx.fillRect(x, y, 1, 1);
    }
}

// Enhanced alien spectrogram column
function drawAlienSpectrogramColumn(ctx, x, specHeight, starId, offset) {
    const starSeed = numericSeed(starId);
    const band1Pos = 0.2 + (starSeed % 3) * 0.1;
    const band2Pos = 0.4 + (starSeed % 4) * 0.1;
    const band3Pos = 0.6 + (starSeed % 5) * 0.08;
    const bandWidth1 = 3 + (starSeed % 3);
    const bandWidth2 = 3 + ((starSeed + 1) % 3);
    const modFreq = 0.03 + (starSeed % 4) * 0.01;
    const modulation = Math.sin(offset * modFreq) * 0.5 + 0.5;

    // Occasional bright pulse flash across all bands
    const isPulse = Math.sin(offset * 0.07 + starSeed) > 0.9;
    const pulseBoost = isPulse ? 0.5 : 0;

    for (let y = 0; y < specHeight; y++) {
        // Slight frequency wobble on bands
        const wobble = Math.sin(offset * 0.02 + y * 0.1) * 1.5;
        const band1 = Math.abs(y - specHeight * band1Pos + wobble) < bandWidth1 ? 1 : 0;
        const band2 = Math.abs(y - specHeight * band2Pos - wobble) < bandWidth2 ? 1 : 0;
        const band3 = Math.abs(y - specHeight * band3Pos + wobble * 0.5) < bandWidth1 ? 1 : 0;
        const noise = Math.random() * 0.15;

        let intensity = (band1 + band2 + band3) * modulation + noise + pulseBoost * (band1 + band2 + band3);
        const b = Math.floor(Math.min(1, intensity) * 255);

        // Cyan/magenta shift on bright moments
        if (intensity > 0.7) {
            const magenta = Math.floor((intensity - 0.7) * 300);
            ctx.fillStyle = `rgba(${magenta}, ${Math.floor(b * 0.7)}, ${b}, ${Math.min(1, intensity)})`;
        } else {
            ctx.fillStyle = `rgba(0, ${Math.floor(b * 0.8)}, ${b}, ${Math.min(1, intensity)})`;
        }
        ctx.fillRect(x, y, 1, 1);
    }
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
        // Intelligent signal pattern - complex multi-frequency
        const starSeed = numericSeed(star.id);
        const freq1 = 0.008 + (starSeed % 3) * 0.002;
        const freq2 = 0.001 + (starSeed % 5) * 0.0005;
        const freq3 = 0.02 + (starSeed % 7) * 0.003;
        const amp1 = 35 + (starSeed % 4) * 8;
        const amp2 = 20 + (starSeed % 3) * 10;
        const amp3 = 10 + (starSeed % 3) * 5;

        for (let x = 0; x < width; x++) {
            const noise = (Math.random() - 0.5) * 8;
            const signal = Math.sin(x * freq1) * amp1;
            const pulse = Math.sin(x * freq2) * amp2;
            const detail = Math.sin(x * freq3) * amp3;
            const y = height / 2 + signal + pulse + detail + noise;

            if (x === 0) {
                waveCtx.moveTo(x, y);
            } else {
                waveCtx.lineTo(x, y);
            }
        }
    } else if (star.isFalsePositive) {
        // False positive - suspiciously clean, regular sine wave
        waveCtx.strokeStyle = '#c80';
        waveCtx.shadowColor = '#c80';
        const freq = 0.04 + (numericSeed(star.id) % 3) * 0.01;
        for (let x = 0; x < width; x++) {
            const noise = (Math.random() - 0.5) * 4;
            const signal = Math.sin(x * freq) * 45;
            const harmonic = Math.sin(x * freq * 2) * 15;
            const y = height / 2 + signal + harmonic + noise;
            if (x === 0) { waveCtx.moveTo(x, y); } else { waveCtx.lineTo(x, y); }
        }
    } else {
        // Natural phenomena - varied by star type
        const phenomenonType = numericSeed(star.id) % 5;
        drawNaturalWaveform(waveCtx, width, height, phenomenonType, star.id, 0);
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
        // Enhanced alien signal
        for (let x = 0; x < specWidth; x++) {
            drawAlienSpectrogramColumn(specCtx, x, specHeight, star.id, x);
        }
    } else if (star.isFalsePositive) {
        // Artificial-looking regular pattern
        for (let x = 0; x < specWidth; x++) {
            drawFalsePositiveSpectrogramColumn(specCtx, x, specHeight, star.id, x);
        }
    } else {
        // Natural phenomena - varied by star type
        const phenomenonType = numericSeed(star.id) % 5;
        for (let x = 0; x < specWidth; x++) {
            drawNaturalSpectrogramColumn(specCtx, x, specHeight, phenomenonType, star.id, x);
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
            // Alien signal - complex multi-frequency waveform
            waveCtx.fillStyle = '#000';
            waveCtx.fillRect(0, 0, width, height);

            waveCtx.strokeStyle = '#0f0';
            waveCtx.lineWidth = 2;
            waveCtx.shadowBlur = 5;
            waveCtx.shadowColor = '#0f0';
            waveCtx.beginPath();

            gameState.signalOffset += 1.0;

            const starSeed = numericSeed(star.id);
            const freq1 = 0.008 + (starSeed % 3) * 0.002;
            const freq2 = 0.001 + (starSeed % 5) * 0.0005;
            const freq3 = 0.02 + (starSeed % 7) * 0.003;
            const amp1 = 35 + (starSeed % 4) * 8;
            const amp2 = 20 + (starSeed % 3) * 10;
            const amp3 = 10 + (starSeed % 3) * 5;

            for (let x = 0; x < width; x++) {
                const xPos = x + gameState.signalOffset;
                const noise = (Math.random() - 0.5) * 8;
                const signal = Math.sin(xPos * freq1) * amp1;
                const pulse = Math.sin(xPos * freq2) * amp2;
                const detail = Math.sin(xPos * freq3) * amp3;
                const y = height / 2 + signal + pulse + detail + noise;

                if (x === 0) { waveCtx.moveTo(x, y); } else { waveCtx.lineTo(x, y); }
            }
            waveCtx.stroke();
        } else if (star.isFalsePositive) {
            // False positive - suspiciously clean waveform (amber)
            waveCtx.fillStyle = '#000';
            waveCtx.fillRect(0, 0, width, height);

            waveCtx.strokeStyle = '#c80';
            waveCtx.lineWidth = 2;
            waveCtx.shadowBlur = 5;
            waveCtx.shadowColor = '#c80';
            waveCtx.beginPath();

            gameState.signalOffset += 0.8;

            const freq = 0.04 + (numericSeed(star.id) % 3) * 0.01;
            for (let x = 0; x < width; x++) {
                const xPos = x + gameState.signalOffset;
                const noise = (Math.random() - 0.5) * 4;
                const signal = Math.sin(xPos * freq) * 45;
                const harmonic = Math.sin(xPos * freq * 2) * 15;
                const y = height / 2 + signal + harmonic + noise;
                if (x === 0) { waveCtx.moveTo(x, y); } else { waveCtx.lineTo(x, y); }
            }
            waveCtx.stroke();
        } else {
            // Natural phenomena - varied waveform
            waveCtx.fillStyle = '#000';
            waveCtx.fillRect(0, 0, width, height);

            waveCtx.strokeStyle = '#0f0';
            waveCtx.lineWidth = 2;
            waveCtx.shadowBlur = 5;
            waveCtx.shadowColor = '#0f0';
            waveCtx.beginPath();

            gameState.signalOffset += 0.5;

            const phenomenonType = numericSeed(star.id) % 5;
            drawNaturalWaveform(waveCtx, width, height, phenomenonType, star.id, gameState.signalOffset);
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
            drawAlienSpectrogramColumn(specCtx, x, specHeight, star.id, gameState.signalOffset);
        } else if (star.isFalsePositive) {
            drawFalsePositiveSpectrogramColumn(specCtx, x, specHeight, star.id, gameState.signalOffset);
        } else {
            const phenomenonType = numericSeed(star.id) % 5;
            drawNaturalSpectrogramColumn(specCtx, x, specHeight, phenomenonType, star.id, gameState.signalOffset);
        }

        gameState.signalAnimationFrameId = requestAnimationFrame(animateSignals);
    }

    animateSignals();
}

// Stop signal animation and clear canvases to prevent carryover
export function stopSignalAnimation() {
    if (gameState.signalAnimationFrameId) {
        cancelAnimationFrame(gameState.signalAnimationFrameId);
        gameState.signalAnimationFrameId = null;
    }
    gameState.noiseFrameCounter = 0;
    gameState.currentSignal = null;

    // Clear canvases so old spectrogram doesn't bleed into next star
    // Reset globalAlpha first in case it was left at a partial value
    const waveCanvas = document.getElementById('waveform-canvas');
    if (waveCanvas) {
        const ctx = waveCanvas.getContext('2d');
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, waveCanvas.width, waveCanvas.height);
    }
    const specCanvas = document.getElementById('spectrogram-canvas');
    if (specCanvas) {
        const ctx = specCanvas.getContext('2d');
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, specCanvas.width, specCanvas.height);
    }
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

    // Log discovery with personal musing
    const fpMusings = [
        "Another ghost in the machine. But ruling things out is half the job.",
        "Someone's satellite, someone's radar. The sky is cluttered with our own noise.",
        "Ruled out. Every false alarm sharpens the filter for when it matters.",
        "Terrestrial interference. The universe doesn't make this easy.",
        "Not this one. But somewhere out there, in all this noise..."
    ];
    const fpIdx = (gameState.journalEntries || []).filter(e => e.title?.startsWith('False Positive')).length;
    addJournalEntry('discovery', {
        starName: star.name,
        title: `False Positive: ${star.name}`,
        content: `Signal identified as terrestrial interference.\nSource: ${cause.source}\n\n— ${fpMusings[fpIdx % fpMusings.length]}`
    });
    showJournalButton();

    // First scan musing — introduce journal on Day 1
    addFirstScanMusing(star, 'false_positive', cause.source);

    // Auto-save after scan result
    autoSave();

    // Check for pre-Ross-128 unease email trigger
    checkPreRoss128Unease();

    // Scan milestone triggers (emails + journal musings)
    checkScanTriggeredEmails();
    checkScanMilestoneMusings('false_positive');

    const fpObservations = [
        "Another ghost. Every false alarm sharpens the filter for when it matters.",
        "Someone's satellite, someone's radar. The sky is cluttered with our own noise.",
        "Ruled out. But for a moment there, my heart was racing.",
        "Not this one. But the next one could be different."
    ];
    const fpObsIdx = [...gameState.scanResults.values()].filter(r => r.type === 'false_positive').length - 1;

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
        <div style="color: #8a8; font-style: italic; font-size: 13px; margin-top: 10px; border-left: 2px solid #8a8; padding-left: 8px;">
            ${fpObservations[fpObsIdx % fpObservations.length]}
        </div>
    `;

    display.appendChild(resultDiv);

    setTimeout(() => {
        const returnBtn = document.createElement('button');
        returnBtn.textContent = 'RETURN TO ARRAY';
        returnBtn.className = 'btn';
        returnBtn.style.cssText = 'margin-top: 15px; background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0; color: #0f0;';
        returnBtn.addEventListener('click', () => {
            playClick();
            switchToBackgroundMusic();
            stopAlienSignalSound();
            document.getElementById('contact-protocol-box').style.display = 'none';
            document.getElementById('analyze-btn').disabled = false;
            showView('starmap-view');
            log(`False positive from ${star.name} - Source: ${cause.source}`);
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

    // Check dynamic stars requiring decryption (SRC-7024, NEXUS POINT, GENESIS POINT)
    if (star.isDynamic && (star.id === 'src7024' || star.id === 'nexusPoint' || star.id === 'genesis')) {
        showDynamicEncryptedResult(star, display);
        return;
    }

    gameState.scanResults.set(star.id, {
        type: 'verified_signal'
    });

    // Log discovery with personal musing
    const vsMusings = [
        "This is real. All interference checks negative. Something out there is... talking.",
        "My training says stay objective. My hands won't stop shaking.",
        "Confirmed non-natural. The implications are... I can't even write it yet."
    ];
    const vsIdx = (gameState.journalEntries || []).filter(e => e.title?.startsWith('Verified Signal')).length;
    addJournalEntry('discovery', {
        starName: star.name,
        title: `Verified Signal: ${star.name}`,
        content: `Non-natural signal confirmed at ${star.distance}.\nAll terrestrial interference checks negative.\nIntelligent origin probable.\n\n— ${vsMusings[vsIdx % vsMusings.length]}`
    });
    showJournalButton();

    // First scan musing — introduce journal on Day 1
    addFirstScanMusing(star, 'verified_signal');

    // Auto-save after scan result
    autoSave();

    // Check for pre-Ross-128 unease email trigger
    checkPreRoss128Unease();

    // Scan milestone triggers (emails + journal musings)
    checkScanTriggeredEmails();
    checkScanMilestoneMusings('verified_signal');

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
        <div style="color: #f0f; font-style: italic; font-size: 13px; margin-top: 10px; border-left: 2px solid #f0f; padding-left: 8px;">
            My hands are shaking. Stay objective. But... this is real.
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
        });

        buttonContainer.appendChild(yesBtn);
        buttonContainer.appendChild(noBtn);
        contactDiv.appendChild(buttonContainer);
        display.appendChild(contactDiv);
    }, 1500);
}

// Show encrypted signal result (Ross 128 before decryption)
function showEncryptedSignalResult(star, display) {
    // Day 1: Signal detected but decryption NOT available
    const isDay1 = gameState.currentDay === 1;

    gameState.scanResults.set(star.id, {
        type: 'encrypted_signal'
    });
    autoSave();

    const resultDiv = document.createElement('div');
    resultDiv.style.cssText = 'margin-top: 20px; padding: 15px; border: 2px solid #ff0; background: rgba(255, 255, 0, 0.1);';

    if (isDay1) {
        // Day 1: No decryption available - clearance too low
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
                <span style="color: #f00;">
                    QUANTUM DECRYPTION SYSTEM: UNAVAILABLE<br>
                    REQUIRES SIGMA CLEARANCE
                </span><br><br>
                <span style="color: #0f0; font-size: 12px;">
                    Signal data archived for future analysis.<br>
                    Request Sigma clearance elevation in daily report.
                </span>
            </div>
        `;

        display.appendChild(resultDiv);
        playSecurityBeep('warning');

        // Ross 128 encrypted signal musing
        addPersonalLog('The Ross 128 Anomaly',
            `Something is different about Ross 128. The signal has structure — layers of it. Mathematical precision that no natural process could produce.\n\nThe system can't decode it. Not yet. We need Sigma clearance for the quantum decryption array.\n\nI keep staring at the waveform. It's almost like... it's waiting to be read.`
        );

        setTimeout(() => {
            const returnBtn = document.createElement('button');
            returnBtn.textContent = 'RETURN TO ARRAY';
            returnBtn.className = 'btn';
            returnBtn.style.cssText = 'margin-top: 15px; background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0; color: #0f0;';
            returnBtn.addEventListener('click', () => {
                playClick();
                stopAlienSignalSound();
                switchToBackgroundMusic();
                document.getElementById('contact-protocol-box').style.display = 'none';
                document.getElementById('analyze-btn').disabled = false;
                showView('starmap-view');
                log(`Encrypted signal from ${star.name} archived - Sigma clearance required`);

                // Send follow-up email about the encrypted signal discovery
                const name = gameState.playerName;
                setTimeout(() => {
                    addMailMessage(
                        'Dr. Eleanor Chen - Radio Astronomy',
                        `RE: ${star.name} — Encrypted Signal`,
                        `Dr. ${name},\n\nI just saw the alert come through — an encrypted signal from ${star.name}? That's not something you see every day. Or ever, frankly.\n\nThe encoding structure doesn't match anything in our terrestrial database. No known satellite, no military comm protocol, nothing. I ran it through three different pattern libraries and got zero hits.\n\nWhatever this is, it's not noise. Something put that structure there deliberately.\n\nThe bad news is we can't touch it without Sigma clearance — the quantum decryption system is locked behind that. I'd recommend flagging it in your daily report. If Oversight sees what I'm seeing, they'll have to approve the upgrade.\n\nThis could be the one, Dr. ${name}. Don't let it slip through the cracks.\n\n- Eleanor`
                    );
                }, 15000);
            });
            display.appendChild(returnBtn);
        }, 1500);
    } else {
        // Day 2+: Decryption available
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
                        // Success callback — dramatic decode reveal
                        () => {
                            gameState.decryptionComplete = true;
                            gameState.scanResults.set(8, { type: 'verified_signal' });
                            autoSave();

                            // Decryption musing
                            addPersonalLog('Decryption Complete',
                                `Confirmed intelligent. Extrasolar. The mathematical constants alone would be enough — pi, e, the fine structure constant. But there's more. Visual data. Compressed layers we haven't even begun to decode.\n\nI keep checking the results, looking for the error. There is no error.\n\nThis is real.`
                            );
                            updateStarCatalogDisplay();

                            // Show dramatic decode sequence instead of just a log
                            showRoss128DecodeReveal(star);
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
}

// ─────────────────────────────────────────────────────────────────────────────
// Ross 128 Dramatic Decode Reveal
// After decryption minigame, show streaming decoded data before contact protocol
// ─────────────────────────────────────────────────────────────────────────────

function showRoss128DecodeReveal(star) {
    // Create full-screen overlay (like decryption minigame) so the decode sequence is unmissable
    const overlay = document.createElement('div');
    overlay.id = 'decode-reveal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.98);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'VT323', monospace;
    `;

    const container = document.createElement('div');
    container.style.cssText = `
        border: 2px solid #0f0;
        background: #000;
        padding: 0;
        width: 700px;
        max-width: 95vw;
        box-shadow: 0 0 50px rgba(0, 255, 0, 0.3);
    `;

    // Header bar
    const header = document.createElement('div');
    header.style.cssText = `
        background: linear-gradient(180deg, #020 0%, #010 100%);
        border-bottom: 2px solid #0f0;
        padding: 12px 20px;
        text-align: center;
        color: #0f0;
        font-size: 18px;
        text-shadow: 0 0 10px #0f0;
        letter-spacing: 3px;
    `;
    header.textContent = 'SIGNAL DECODE IN PROGRESS';
    container.appendChild(header);

    const display = document.createElement('div');
    display.style.cssText = 'text-align: left; font-size: 14px; line-height: 1.8; max-height: 60vh; overflow-y: auto; padding: 20px 25px;';
    container.appendChild(display);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Define the decode sequence — each entry: { text, color, delay (ms before next), style }
    const decodeLines = [
        // Phase 1: Header
        { text: '[QUANTUM DECRYPTION... COMPLETE]', color: '#0f0', delay: 800, style: 'font-size: 16px; text-shadow: 0 0 8px #0f0;' },
        { text: '[PARSING DECODED DATA STREAM...]', color: '#0f0', delay: 600 },
        { text: '', delay: 300 },

        // Phase 2: Hex noise (fast)
        { text: '0x7A 3F \u2588B \u25882 0xE4 \u2588\u2588 0x1C \u2588F 0xAA 6D \u25883 0xBB 0x9E \u2588\u2588 0x4F...', color: '#0a0', delay: 100, style: 'opacity: 0.6; font-size: 11px;' },
        { text: '\u2588\u2588 0x5E 0x\u2588\u2588 7B 0x9D \u2588\u2588 \u2588\u2588 0xF3 8A 0xD1 \u2588\u2588 0x7C 0xA3 \u2588\u2588...', color: '#0a0', delay: 100, style: 'opacity: 0.6; font-size: 11px;' },
        { text: '0x\u2588\u2588 FF 0x2B \u2588\u2588 0x6C \u25884 0xE8 \u2588\u2588 \u2588\u2588 7A 0x3D \u2588B 0xC6 \u2588\u2588...', color: '#0a0', delay: 100, style: 'opacity: 0.6; font-size: 11px;' },
        { text: '', delay: 400 },

        // Phase 3: Math constants
        { text: 'MATHEMATICAL CONSTANTS DETECTED:', color: '#0ff', delay: 500, style: 'font-size: 13px; margin-top: 5px;' },
        { text: '  \u03C0 = 3.14159265358979...     VERIFIED', color: '#0ff', delay: 400 },
        { text: '  e = 2.71828182845904...     VERIFIED', color: '#0ff', delay: 400 },
        { text: '  \u03C6 = 1.61803398874989...     VERIFIED', color: '#0ff', delay: 400 },
        { text: '  \u03B1 = 7.297352569\u00D710\u207B\u00B3       FINE STRUCTURE CONSTANT \u2014 MATCH', color: '#0f0', delay: 500, style: 'text-shadow: 0 0 5px #0f0;' },
        { text: '', delay: 300 },

        // Phase 4: Physical constants
        { text: 'PHYSICAL CONSTANTS:', color: '#0ff', delay: 400, style: 'font-size: 13px;' },
        { text: '  c  = 299,792,458 m/s        MATCH', color: '#0f0', delay: 400 },
        { text: '  \u210F  = 1.054571817\u00D710\u207B\u00B3\u2074 J\u00B7s MATCH', color: '#0f0', delay: 400 },
        { text: '  G  = 6.674\u2588\u2588\u00D710\u207B\u00B9\u00B9         \u2588\u2588\u2588ORRUPT\u2588\u2588', color: '#f44', delay: 600, style: 'text-shadow: 0 0 3px #f00;' },
        { text: '', delay: 300 },

        // Phase 5: Unknown references
        { text: 'UNKNOWN REFERENCES:', color: '#ff0', delay: 400, style: 'font-size: 13px;' },
        { text: '  \u2588\u2588\u2588\u2588 = \u2588\u2588.\u2588\u2588\u2588 \u00D7 10\u207B\u00B2\u2077      UNRECOGNIZED', color: '#ff0', delay: 500 },
        { text: '  \u2588\u2588\u2588\u2588\u2588\u2588 = 1.616255\u00D710\u207B\u00B3\u2075  PLANCK LENGTH... \u2588\u2588TENDED?', color: '#ff0', delay: 500 },
        { text: '', delay: 400 },

        // Phase 6: Temporal markers
        { text: '\u26A0 TIMESTAMP PREDATES KNOWN REFERENCE FRAMES', color: '#ff0', delay: 700, style: 'animation: warningPulse 1.5s ease-in-out infinite;' },
        { text: '\u26A0 SIGNAL AGE: \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 years (OVERFLOW)', color: '#f44', delay: 800, style: 'text-shadow: 0 0 5px #f00;' },
        { text: '', delay: 400 },

        // Phase 7: Data structure
        { text: '[DATA STRUCTURE ANALYSIS]', color: '#0ff', delay: 400, style: 'font-size: 13px;' },
        { text: '  LAYER 1: Mathematical framework    DECODED', color: '#0f0', delay: 400 },
        { text: '  LAYER 2: Visual data (compressed)  DECODED', color: '#0f0', delay: 400 },
        { text: '  LAYER 3: \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588              ENCRYPTED \u2014 DEEPER LAYER', color: '#f44', delay: 600, style: 'text-shadow: 0 0 3px #f00;' },
        { text: '', delay: 800 },

        // Phase 8: Conclusion
        { text: '\u2550'.repeat(45), color: '#f0f', delay: 300, style: 'text-shadow: 0 0 5px #f0f;' },
        { text: '  SIGNAL ORIGIN:      EXTRASOLAR', color: '#fff', delay: 500, style: 'font-size: 15px; text-shadow: 0 0 8px #fff;' },
        { text: '  CLASSIFICATION:     INTELLIGENT', color: '#f0f', delay: 500, style: 'font-size: 15px; text-shadow: 0 0 10px #f0f;' },
        { text: '  STATUS:             CONFIRMED', color: '#0f0', delay: 500, style: 'font-size: 15px; text-shadow: 0 0 10px #0f0;' },
        { text: '\u2550'.repeat(45), color: '#f0f', delay: 300, style: 'text-shadow: 0 0 5px #f0f;' },
    ];

    let lineIndex = 0;

    function showNextLine() {
        if (lineIndex >= decodeLines.length) {
            // All lines shown — add the contact protocol button
            showDecodeContactButton(star, display);
            return;
        }

        const line = decodeLines[lineIndex];
        const div = document.createElement('div');
        div.textContent = line.text;
        div.style.cssText = `color: ${line.color || '#0f0'}; ${line.style || ''}`;
        div.style.opacity = '0';
        div.style.transition = 'opacity 0.3s';
        display.appendChild(div);

        // Fade in
        requestAnimationFrame(() => { div.style.opacity = '1'; });

        // Play typing beep for non-empty lines
        if (line.text.length > 0) {
            playTypingBeep();
        }

        // Scroll to bottom
        display.scrollTop = display.scrollHeight;

        lineIndex++;
        setTimeout(showNextLine, line.delay);
    }

    // Play security beep for dramatic start
    playSecurityBeep('success');
    log('DECRYPTION COMPLETE \u2014 Signal decoded!', 'highlight');

    // Start the sequence
    setTimeout(showNextLine, 500);
}

function showDecodeContactButton(star, display) {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.style.cssText = 'text-align: center; margin-top: 25px;';

    const btn = document.createElement('button');
    btn.textContent = '[ INITIATE CONTACT PROTOCOL ]';
    btn.className = 'btn';
    btn.style.cssText = `
        background: rgba(255, 0, 255, 0.1);
        border: 2px solid #f0f;
        color: #f0f;
        font-family: 'VT323', monospace;
        font-size: 20px;
        padding: 12px 30px;
        cursor: pointer;
        text-shadow: 0 0 10px #f0f;
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
        animation: contactBtnPulse 2s ease-in-out infinite;
    `;

    // Add pulse animation
    if (!document.getElementById('decode-contact-btn-style')) {
        const style = document.createElement('style');
        style.id = 'decode-contact-btn-style';
        style.textContent = `
            @keyframes contactBtnPulse {
                0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 255, 0.3); }
                50% { box-shadow: 0 0 40px rgba(255, 0, 255, 0.6); }
            }
        `;
        document.head.appendChild(style);
    }

    btn.addEventListener('click', () => {
        playClick();
        // Remove the decode reveal overlay before showing contact
        const overlay = document.getElementById('decode-reveal-overlay');
        if (overlay) overlay.remove();
        switchToAlienMusic();
        initiateContact(star);
    });

    buttonWrapper.appendChild(btn);
    display.appendChild(buttonWrapper);
    display.scrollTop = display.scrollHeight;

    // Play a dramatic beep when button appears
    playSecurityBeep('success');
}

// ─────────────────────────────────────────────────────────────────────────────
// Fragment Decode Reveal — post-alignment data dump for each fragment
// ─────────────────────────────────────────────────────────────────────────────

const FRAGMENT_DECODE_SEQUENCES = {
    src7024: {
        header: 'FRAGMENT 1 — SRC-7024 ANALYSIS',
        lines: [
            { text: '[ALIGNMENT LOCKED — DECODING FRAGMENT DATA...]', color: '#0f0', delay: 800, style: 'font-size: 16px; text-shadow: 0 0 8px #0f0;' },
            { text: '', delay: 300 },
            { text: '0xA2 \u2588\u2588 7F 0xE1 \u2588\u2588 0xBC \u25883 0x4D \u2588\u2588 9A 0xF7 \u2588\u2588 0x3B...', color: '#0a0', delay: 100, style: 'opacity: 0.6; font-size: 11px;' },
            { text: '\u2588\u2588 0xD3 0x\u2588\u2588 5E 0x8A \u2588\u2588 \u2588\u2588 0xC1 6B 0xF2 \u2588\u2588 0x7E...', color: '#0a0', delay: 100, style: 'opacity: 0.6; font-size: 11px;' },
            { text: '', delay: 400 },
            { text: 'SOURCE VERIFICATION:', color: '#0ff', delay: 500, style: 'font-size: 13px;' },
            { text: '  Star catalog match:       NONE', color: '#ff0', delay: 400 },
            { text: '  Pulsar database match:    NONE', color: '#ff0', delay: 400 },
            { text: '  Known emitter match:      NONE', color: '#ff0', delay: 400 },
            { text: '  Deep space network match: NONE', color: '#ff0', delay: 400 },
            { text: '', delay: 300 },
            { text: 'SIGNAL STRUCTURE:', color: '#0ff', delay: 400, style: 'font-size: 13px;' },
            { text: '  Layer 1: Coordinate framework    DECODED', color: '#0f0', delay: 400 },
            { text: '  Layer 2: Mathematical primitives  DECODED', color: '#0f0', delay: 400 },
            { text: '  Layer 3: Compressed data payload  PARTIAL', color: '#ff0', delay: 400 },
            { text: '  Layer 4: \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588          LOCKED', color: '#f44', delay: 500, style: 'text-shadow: 0 0 3px #f00;' },
            { text: '', delay: 400 },
            { text: '\u26A0 Signal broadcasts from coordinates with no known stellar object', color: '#ff0', delay: 600 },
            { text: '\u26A0 Data structure suggests additional fragments required', color: '#ff0', delay: 600 },
            { text: '', delay: 500 },
            { text: '\u2550'.repeat(45), color: '#0ff', delay: 300, style: 'text-shadow: 0 0 5px #0ff;' },
            { text: '  SOURCE:        UNCHARTED', color: '#fff', delay: 400, style: 'font-size: 15px;' },
            { text: '  DATA TYPE:     LAYERED ENCODING', color: '#0ff', delay: 400, style: 'font-size: 15px;' },
            { text: '  STATUS:        FRAGMENT 1 OF ? ACQUIRED', color: '#0f0', delay: 500, style: 'font-size: 15px; text-shadow: 0 0 8px #0f0;' },
            { text: '\u2550'.repeat(45), color: '#0ff', delay: 300, style: 'text-shadow: 0 0 5px #0ff;' },
        ],
        buttonText: '[ ARCHIVE FRAGMENT DATA ]',
        buttonColor: '#0ff'
    },
    nexusPoint: {
        header: 'FRAGMENT 2 — NEXUS POINT ANALYSIS',
        lines: [
            { text: '[ALIGNMENT LOCKED — DECODING FRAGMENT DATA...]', color: '#0f0', delay: 800, style: 'font-size: 16px; text-shadow: 0 0 8px #0f0;' },
            { text: '', delay: 300 },
            { text: '0xF1 \u2588\u2588 3D 0xA8 \u2588\u2588 0x6E \u25887 0xBB \u2588\u2588 2C 0xD9 \u2588\u2588 0x51...', color: '#0a0', delay: 100, style: 'opacity: 0.6; font-size: 11px;' },
            { text: '\u2588\u2588 0x94 0x\u2588\u2588 E2 0x7A \u2588\u2588 \u2588\u2588 0x1F 8D 0xC5 \u2588\u2588 0xA6...', color: '#0a0', delay: 100, style: 'opacity: 0.6; font-size: 11px;' },
            { text: '', delay: 400 },
            { text: 'NETWORK TOPOLOGY DETECTED:', color: '#f0f', delay: 500, style: 'font-size: 13px;' },
            { text: '  SRC-7024 \u2500\u2500\u2500\u2500 NEXUS \u2500\u2500\u2500\u2500 ???', color: '#f0f', delay: 500, style: 'text-shadow: 0 0 5px #f0f;' },
            { text: '     \u2502                 \u2502', color: '#f0f', delay: 200, style: 'text-shadow: 0 0 3px #f0f;' },
            { text: '     \u2514\u2500\u2500\u2500\u2500 Ross 128 \u2500\u2500\u2500\u2518', color: '#f0f', delay: 500, style: 'text-shadow: 0 0 3px #f0f;' },
            { text: '', delay: 400 },
            { text: 'DISTANCE ANALYSIS:', color: '#0ff', delay: 400, style: 'font-size: 13px;' },
            { text: '  SRC-7024 \u2194 NEXUS:  \u2588\u2588\u2588\u2588\u2588 Mpc    EXCEEDS OBSERVABLE UNIVERSE', color: '#f44', delay: 500, style: 'text-shadow: 0 0 3px #f00;' },
            { text: '  Signal latency:     0.000 seconds', color: '#f44', delay: 500, style: 'text-shadow: 0 0 3px #f00;' },
            { text: '', delay: 300 },
            { text: '\u26A0 Instantaneous signal propagation — violates known physics', color: '#ff0', delay: 700, style: 'animation: warningPulse 1.5s ease-in-out infinite;' },
            { text: '\u26A0 Network predates all known signal sources', color: '#ff0', delay: 600 },
            { text: '', delay: 500 },
            { text: '\u2550'.repeat(45), color: '#f0f', delay: 300, style: 'text-shadow: 0 0 5px #f0f;' },
            { text: '  SOURCE:        EXTRAGALACTIC RELAY', color: '#fff', delay: 400, style: 'font-size: 15px;' },
            { text: '  DATA TYPE:     NETWORK INFRASTRUCTURE', color: '#f0f', delay: 400, style: 'font-size: 15px;' },
            { text: '  STATUS:        FRAGMENT 2 OF ? ACQUIRED', color: '#0f0', delay: 500, style: 'font-size: 15px; text-shadow: 0 0 8px #0f0;' },
            { text: '\u2550'.repeat(45), color: '#f0f', delay: 300, style: 'text-shadow: 0 0 5px #f0f;' },
        ],
        buttonText: '[ ARCHIVE FRAGMENT DATA ]',
        buttonColor: '#f0f'
    },
    eridani82: {
        header: 'FRAGMENT 3 — 82 ERIDANI COLLABORATIVE DATA',
        lines: [
            { text: '[ALIGNMENT LOCKED — DECODING FRAGMENT DATA...]', color: '#0f0', delay: 800, style: 'font-size: 16px; text-shadow: 0 0 8px #0f0;' },
            { text: '', delay: 300 },
            { text: '0x5C \u2588\u2588 B1 0x3E \u2588\u2588 0xD7 \u25889 0x62 \u2588\u2588 FA 0x84 \u2588\u2588 0xC0...', color: '#0a0', delay: 100, style: 'opacity: 0.6; font-size: 11px;' },
            { text: '\u2588\u2588 0xE6 0x\u2588\u2588 49 0xAB \u2588\u2588 \u2588\u2588 0x73 DE 0x1B \u2588\u2588 0x96...', color: '#0a0', delay: 100, style: 'opacity: 0.6; font-size: 11px;' },
            { text: '', delay: 400 },
            { text: 'ENCODING COMPARISON:', color: '#0ff', delay: 500, style: 'font-size: 13px;' },
            { text: '  Human decryption key:   0x7A3F\u2588\u2588E4\u2588\u25881C\u2588\u2588', color: '#0ff', delay: 400 },
            { text: '  82 Eridani cipher key:  0x7A3F\u2588\u2588E4\u2588\u25881C\u2588\u2588', color: '#0ff', delay: 400 },
            { text: '  Match confidence:       99.97%', color: '#0f0', delay: 500, style: 'text-shadow: 0 0 5px #0f0;' },
            { text: '', delay: 300 },
            { text: 'DATA INTEGRATION:', color: '#0ff', delay: 400, style: 'font-size: 13px;' },
            { text: '  Fragment 1 (SRC-7024)  + Fragment 3 (82 Eridani)  = COMPLEMENTARY', color: '#0f0', delay: 500 },
            { text: '  Fragment 2 (NEXUS)     + Fragment 3 (82 Eridani)  = COMPLEMENTARY', color: '#0f0', delay: 500 },
            { text: '  Combined coherence:     78.4% \u2192 Insufficient for full decode', color: '#ff0', delay: 500 },
            { text: '', delay: 300 },
            { text: '\u26A0 Signal designed for multi-species convergence', color: '#ff0', delay: 600 },
            { text: '\u26A0 One remaining fragment required for complete message', color: '#ff0', delay: 600 },
            { text: '', delay: 500 },
            { text: '\u2550'.repeat(45), color: '#0ff', delay: 300, style: 'text-shadow: 0 0 5px #0ff;' },
            { text: '  SOURCE:        82 ERIDANI (COLLABORATIVE)', color: '#fff', delay: 400, style: 'font-size: 15px;' },
            { text: '  DATA TYPE:     CONVERGENT SIGNAL', color: '#0ff', delay: 400, style: 'font-size: 15px;' },
            { text: '  STATUS:        FRAGMENT 3 OF 4 ACQUIRED', color: '#0f0', delay: 500, style: 'font-size: 15px; text-shadow: 0 0 8px #0f0;' },
            { text: '\u2550'.repeat(45), color: '#0ff', delay: 300, style: 'text-shadow: 0 0 5px #0ff;' },
        ],
        buttonText: '[ ARCHIVE FRAGMENT DATA ]',
        buttonColor: '#0ff'
    },
    synthesis: {
        header: 'FRAGMENT 4 — GENESIS POINT PRIMORDIAL DATA',
        lines: [
            { text: '[ALIGNMENT LOCKED — DECODING FRAGMENT DATA...]', color: '#0f0', delay: 800, style: 'font-size: 16px; text-shadow: 0 0 8px #0f0;' },
            { text: '', delay: 300 },
            { text: '0x00 \u2588\u2588 00 0x00 \u2588\u2588 0x00 \u258800 0x00 \u2588\u2588 00 0x00 \u2588\u2588 0x00...', color: '#0a0', delay: 100, style: 'opacity: 0.6; font-size: 11px;' },
            { text: '!!TEMPORAL ANOMALY!! DATA PREDATES T=0', color: '#f44', delay: 300, style: 'font-size: 12px; text-shadow: 0 0 5px #f00;' },
            { text: '', delay: 400 },
            { text: 'TEMPORAL ANALYSIS:', color: '#f0f', delay: 500, style: 'font-size: 13px;' },
            { text: '  Signal timestamp:     T < 0', color: '#f44', delay: 400, style: 'text-shadow: 0 0 3px #f00;' },
            { text: '  Reference frame:      PRE-COSMIC', color: '#f44', delay: 400, style: 'text-shadow: 0 0 3px #f00;' },
            { text: '  Signal age:           \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 (OVERFLOW)', color: '#f44', delay: 500, style: 'text-shadow: 0 0 5px #f00;' },
            { text: '', delay: 300 },
            { text: 'FRAGMENT INTEGRATION:', color: '#0ff', delay: 400, style: 'font-size: 13px;' },
            { text: '  Fragment 1 (SRC-7024):    LOADED', color: '#0f0', delay: 300 },
            { text: '  Fragment 2 (NEXUS POINT): LOADED', color: '#0f0', delay: 300 },
            { text: '  Fragment 3 (82 Eridani):  LOADED', color: '#0f0', delay: 300 },
            { text: '  Fragment 4 (GENESIS):     LOADED', color: '#0f0', delay: 300 },
            { text: '  Combined coherence:       100.0%', color: '#0f0', delay: 500, style: 'font-size: 15px; text-shadow: 0 0 10px #0f0;' },
            { text: '', delay: 400 },
            { text: '\u26A0 COMPLETE MESSAGE RECONSTRUCTABLE', color: '#f0f', delay: 700, style: 'font-size: 14px; animation: warningPulse 1.5s ease-in-out infinite; text-shadow: 0 0 8px #f0f;' },
            { text: '', delay: 500 },
            { text: '\u2550'.repeat(45), color: '#f0f', delay: 300, style: 'text-shadow: 0 0 5px #f0f;' },
            { text: '  SOURCE:        PRE-UNIVERSAL', color: '#fff', delay: 400, style: 'font-size: 15px;' },
            { text: '  DATA TYPE:     ORIGIN TRANSMISSION', color: '#f0f', delay: 400, style: 'font-size: 15px; text-shadow: 0 0 5px #f0f;' },
            { text: '  STATUS:        ALL FRAGMENTS ACQUIRED', color: '#0f0', delay: 500, style: 'font-size: 15px; text-shadow: 0 0 10px #0f0;' },
            { text: '\u2550'.repeat(45), color: '#f0f', delay: 300, style: 'text-shadow: 0 0 5px #f0f;' },
        ],
        buttonText: '[ ARCHIVE FINAL FRAGMENT ]',
        buttonColor: '#f0f'
    }
};

function showFragmentDecodeReveal(fragmentKey, onComplete) {
    const config = FRAGMENT_DECODE_SEQUENCES[fragmentKey];
    if (!config) { onComplete(); return; }

    const overlay = document.createElement('div');
    overlay.id = 'decode-reveal-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.98); z-index: 10000;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        font-family: 'VT323', monospace;
    `;

    const container = document.createElement('div');
    container.style.cssText = `
        border: 2px solid #0f0; background: #000; padding: 0;
        width: 700px; max-width: 95vw;
        box-shadow: 0 0 50px rgba(0, 255, 0, 0.3);
    `;

    const header = document.createElement('div');
    header.style.cssText = `
        background: linear-gradient(180deg, #020 0%, #010 100%);
        border-bottom: 2px solid #0f0; padding: 12px 20px;
        text-align: center; color: #0f0; font-size: 18px;
        text-shadow: 0 0 10px #0f0; letter-spacing: 3px;
    `;
    header.textContent = config.header;
    container.appendChild(header);

    const display = document.createElement('div');
    display.style.cssText = 'text-align: left; font-size: 14px; line-height: 1.8; max-height: 60vh; overflow-y: auto; padding: 20px 25px;';
    container.appendChild(display);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    let lineIndex = 0;

    function showNextLine() {
        if (lineIndex >= config.lines.length) {
            // Show continue button
            const buttonWrapper = document.createElement('div');
            buttonWrapper.style.cssText = 'text-align: center; margin-top: 25px;';

            const btn = document.createElement('button');
            btn.textContent = config.buttonText;
            btn.className = 'btn';
            btn.style.cssText = `
                background: rgba(0, 0, 0, 0.3);
                border: 2px solid ${config.buttonColor};
                color: ${config.buttonColor};
                font-family: 'VT323', monospace;
                font-size: 20px; padding: 12px 30px; cursor: pointer;
                text-shadow: 0 0 10px ${config.buttonColor};
                box-shadow: 0 0 20px ${config.buttonColor}40;
                animation: contactBtnPulse 2s ease-in-out infinite;
            `;
            btn.addEventListener('click', () => {
                playClick();
                overlay.style.transition = 'opacity 0.5s';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    onComplete();
                }, 500);
            });
            buttonWrapper.appendChild(btn);
            display.appendChild(buttonWrapper);
            display.scrollTop = display.scrollHeight;
            playSecurityBeep('success');
            return;
        }

        const line = config.lines[lineIndex];
        const div = document.createElement('div');
        div.textContent = line.text;
        div.style.cssText = `color: ${line.color || '#0f0'}; ${line.style || ''}`;
        div.style.opacity = '0';
        div.style.transition = 'opacity 0.3s';
        display.appendChild(div);
        requestAnimationFrame(() => { div.style.opacity = '1'; });
        if (line.text.length > 0) playTypingBeep();
        display.scrollTop = display.scrollHeight;
        lineIndex++;
        setTimeout(showNextLine, line.delay);
    }

    playSecurityBeep('success');
    setTimeout(showNextLine, 500);
}

// Show encrypted result for dynamic stars (SRC-7024, NEXUS POINT, GENESIS POINT)
function showDynamicEncryptedResult(star, display) {
    const isSrc7024 = star.id === 'src7024';
    const isGenesis = star.id === 'genesis';
    const difficulty = isSrc7024 ? 'easy' : (isGenesis ? 'hard' : 'medium');
    const fragmentKey = isGenesis ? 'synthesis' : star.id;
    const fragmentLabel = isSrc7024 ? 'SRC-7024 signal data'
        : (isGenesis ? 'GENESIS POINT primordial data' : 'NEXUS POINT deep space data');
    const fragmentNum = isSrc7024 ? 1 : (isGenesis ? 4 : 2);

    gameState.scanResults.set(star.id, { type: 'encrypted_signal' });
    autoSave();

    const resultDiv = document.createElement('div');
    resultDiv.style.cssText = 'margin-top: 20px; padding: 15px; border: 2px solid #ff0; background: rgba(255, 255, 0, 0.1);';

    const borderColor = isSrc7024 ? '#0ff' : (isGenesis ? '#0f0' : '#f0f');
    const originLabel = isSrc7024 ? 'NON-CATALOGED' : (isGenesis ? 'PRIMORDIAL' : 'EXTRAGALACTIC');
    const warningLabel = isSrc7024 ? 'Multi-layered encoding detected'
        : (isGenesis ? 'Pre-cosmic temporal encoding detected' : 'Ultra-dense data compression detected');
    resultDiv.innerHTML = `
        <div style="color: ${borderColor}; font-size: 18px; text-shadow: 0 0 10px ${borderColor}; margin-bottom: 10px;">
            ⚠ ENCRYPTED SIGNAL DETECTED ⚠
        </div>
        <div style="color: #0ff; font-size: 14px;">
            Signal verified as ${originLabel} origin<br>
            Distance: ${star.distance} light years<br><br>
            <span style="color: #f0f; text-shadow: 0 0 5px #f0f;">
                WARNING: ${warningLabel}<br>
                Standard protocols cannot decode content
            </span><br><br>
            <span style="color: #0f0;">
                QUANTUM DECRYPTION SYSTEM: AVAILABLE<br>
                DIFFICULTY ASSESSMENT: ${difficulty.toUpperCase()}
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
        question.style.cssText = `color: ${borderColor}; text-shadow: 0 0 5px ${borderColor}; font-size: 18px; margin-bottom: 15px;`;
        decryptDiv.appendChild(question);

        const buttonContainer = document.createElement('div');

        const yesBtn = document.createElement('button');
        yesBtn.textContent = 'DECRYPT';
        yesBtn.className = 'btn';
        yesBtn.style.cssText = 'background: rgba(0, 255, 0, 0.1); border: 2px solid #0f0; color: #0f0; margin: 5px; padding: 8px 20px;';
        yesBtn.addEventListener('click', () => {
            playClick();
            stopFragmentSignalSound();
            buttonContainer.remove();
            question.textContent = '[INITIALIZING QUANTUM PROCESSOR...]';

            setTimeout(() => {
                document.getElementById('contact-protocol-box').style.display = 'none';
                startDecryptionMinigame(
                    // Success callback
                    () => {
                        if (isSrc7024) {
                            // SRC-7024: Chain into alignment minigame (3 sub-frags, easy)
                            log('DECRYPTION COMPLETE — Initiating fragment alignment...', 'highlight');
                            startSingleFragmentAlignment(
                                'src7024',
                                '\u03A8\u2234\u232C\u2609 \u25C6 \u221E\u27D0\u238E\u2B21 \u25C6 \u2609\u232C\u2234\u03A8',
                                // Alignment success
                                () => {
                                    showFragmentDecodeReveal('src7024', () => {
                                        if (!gameState.fragments.sources[fragmentKey]) {
                                            gameState.fragments.collected.push(fragmentKey);
                                            gameState.fragments.sources[fragmentKey] = true;
                                            log(`FRAGMENT ${fragmentNum} ACQUIRED: ${fragmentLabel}`, 'highlight');
                                            addPersonalLog('Fragment 1: SRC-7024',
                                                `The first fragment. Pulled from a signal source that shouldn't exist — no star, no known object, just... a point in space, broadcasting.\n\nThe data has structure. Layers. Like pages of a book written in mathematics we almost understand.\n\nThere's more out there. I can feel it.`
                                            );
                                        }
                                        gameState.scanResults.set(star.id, { type: 'verified_signal' });
                                        autoSave();
                                        showView('starmap-view');
                                        document.getElementById('analyze-btn').disabled = false;
                                        scheduleSrc7024PostAlignmentEmails();
                                    });
                                },
                                // Alignment cancel
                                () => {
                                    showView('starmap-view');
                                    log('Fragment alignment aborted.', 'warning');
                                    document.getElementById('analyze-btn').disabled = false;
                                },
                                { fragmentCount: 3, difficulty: 'easy' }
                            );
                        } else if (isGenesis) {
                            // GENESIS POINT: Chain into alignment minigame (6 sub-frags, hard)
                            log('DECRYPTION COMPLETE — Initiating fragment alignment...', 'highlight');
                            startSingleFragmentAlignment(
                                'synthesis',
                                '\u03A3\u221E\u2295\u2297 \u25C6 \u2B21\u03A8\u25CA\u03A9 \u25C6 \u2297\u2295\u221E\u03A3',
                                // Alignment success
                                () => {
                                    showFragmentDecodeReveal('synthesis', () => {
                                        if (!gameState.fragments.sources[fragmentKey]) {
                                            gameState.fragments.collected.push(fragmentKey);
                                            gameState.fragments.sources[fragmentKey] = true;
                                            log(`FRAGMENT ${fragmentNum} ACQUIRED: ${fragmentLabel}`, 'highlight');
                                            addPersonalLog('Fragment 4: Genesis Point',
                                                `The final fragment. Primordial. The timestamp on this data predates everything — stars, galaxies, the cosmic microwave background itself.\n\nFour fragments. Four pieces of something that was never meant to stay hidden forever.\n\nI think it was meant to be found. By someone patient enough. Curious enough.\n\nI think it was meant for us.`
                                            );
                                        }
                                        gameState.scanResults.set(star.id, { type: 'verified_signal' });
                                        onFragmentCollected();
                                        schedulePostGenesisEmails();
                                        autoSave();
                                        showView('starmap-view');
                                        document.getElementById('analyze-btn').disabled = false;
                                        checkAndShowDayComplete();
                                    });
                                },
                                // Alignment cancel
                                () => {
                                    showView('starmap-view');
                                    log('Fragment alignment aborted.', 'warning');
                                    document.getElementById('analyze-btn').disabled = false;
                                },
                                { fragmentCount: 6, difficulty: 'hard' }
                            );
                        } else {
                            // NEXUS POINT: Chain into alignment minigame (4 sub-frags, medium)
                            log('DECRYPTION COMPLETE — Initiating fragment alignment...', 'highlight');
                            startSingleFragmentAlignment(
                                'nexusPoint',
                                '\u03A9\u2235\u238E\u2302 \u25C7 \u039B\u2080\u221E\u210F \u25C7 \u2302\u238E\u2235\u03A9',
                                // Alignment success
                                () => {
                                    showFragmentDecodeReveal('nexusPoint', () => {
                                        if (!gameState.fragments.sources[fragmentKey]) {
                                            gameState.fragments.collected.push(fragmentKey);
                                            gameState.fragments.sources[fragmentKey] = true;
                                            log(`FRAGMENT ${fragmentNum} ACQUIRED: ${fragmentLabel}`, 'highlight');
                                            addPersonalLog('Fragment 2: Nexus Point',
                                                `A nexus. Something is connecting these signals across distances that should make communication impossible.\n\nThe coordinates don't correspond to any cataloged object. It's extragalactic — or beyond even that.\n\nWhoever built this network didn't just send a message. They built an infrastructure.`
                                            );
                                        }
                                        gameState.scanResults.set(star.id, { type: 'verified_signal' });
                                        onFragmentCollected();
                                        schedulePreBigBangEmails();
                                        autoSave();
                                        showView('starmap-view');
                                        document.getElementById('analyze-btn').disabled = false;
                                        checkAndShowDayComplete();
                                    });
                                },
                                // Alignment cancel
                                () => {
                                    showView('starmap-view');
                                    log('Fragment alignment aborted.', 'warning');
                                    document.getElementById('analyze-btn').disabled = false;
                                },
                                { fragmentCount: 4, difficulty: 'medium' }
                            );
                        }
                    },
                    // Cancel callback
                    () => {
                        showView('starmap-view');
                        log('Decryption aborted.', 'warning');
                        document.getElementById('analyze-btn').disabled = false;
                    },
                    difficulty
                );
            }, 1500);
        });

        const noBtn = document.createElement('button');
        noBtn.textContent = 'ABORT';
        noBtn.className = 'btn';
        noBtn.style.cssText = 'background: rgba(255, 0, 0, 0.1); border: 2px solid #f00; color: #f00; margin: 5px; padding: 8px 20px;';
        noBtn.addEventListener('click', () => {
            playClick();
            stopFragmentSignalSound();
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

// Schedule scientist emails about triangulation (after Fragment 1)
function scheduleTriangulationEmails() {
    const name = gameState.playerName;

    setTimeout(() => {
        addMailMessage(
            'Dr. Marcus Webb - Xenolinguistics',
            'SRC-7024 Encoding Analysis',
            `Dr. ${name},\n\nI've been analyzing the decoded SRC-7024 data. The encoding has definite positional structure — these aren't random symbols. The mathematical sequences embed what appear to be spatial coordinates.\n\nWhatever sent this signal wanted us to find something specific.\n\nCheck the PROJECT LIGHTHOUSE investigation page. I believe we can triangulate these coordinates.\n\n- Marcus`
        );
    }, 15000);

    setTimeout(() => {
        addMailMessage(
            'Dr. Eleanor Chen - Radio Astronomy',
            'Triangulation Vectors in SRC-7024 Data',
            `Dr. ${name},\n\nCross-referencing the SRC-7024 fragment with pulsar timing arrays — these look like triangulation vectors. Three reference points, all pointing to a single location in deep space.\n\nI've flagged the triangulation option on your investigation page. This is big.\n\n- Eleanor`
        );
    }, 30000);

    setTimeout(() => {
        addMailMessage(
            'Dr. James Whitmore - SETI Director',
            '[URGENT] Triangulate SRC-7024 Coordinates',
            `Dr. ${name},\n\nDr. Chen and Dr. Webb both confirm: the SRC-7024 data contains triangulation vectors pointing to an unknown location in deep space.\n\nIf these are real coordinates, we need to triangulate NOW. Use PROJECT LIGHTHOUSE to initiate the sequence.\n\nThis could change everything.\n\n- James Whitmore\n  SETI Program Director`
        );
    }, 45000);
}

// Schedule post-alignment emails for SRC-7024, then unlock investigation
function scheduleSrc7024PostAlignmentEmails() {
    const name = gameState.playerName;

    // First email: Chen explains the signal is fragmented — frames the hunt
    setTimeout(() => {
        addMailMessage(
            'Dr. Eleanor Chen - Signal Intelligence',
            'SRC-7024 Signal Structure — It\'s Incomplete',
            `Dr. ${name},\n\nI've been running structural analysis on the SRC-7024 data since your alignment locked in. Here's the problem: the signal is incomplete.\n\nNot corrupted — deliberately partitioned. The encoding contains header markers that reference additional data blocks we don't have. Like receiving chapter 1 of a book with a table of contents that lists chapters we've never seen.\n\nWhoever — whatever — sent this, they split the message across multiple transmission points. SRC-7024 was just the first piece.\n\nThe other pieces are out there somewhere. We need to find them.\n\n- Eleanor`
        );
    }, 3000);

    setTimeout(() => {
        addMailMessage(
            'Dr. Marcus Webb - Xenolinguistics',
            'SRC-7024 Fragment Analysis',
            `Dr. ${name},\n\nMy hands are actually shaking. In twenty years of xenolinguistics, I've never seen encoding this purposeful.\n\nEleanor's right — this is only a fragment. But even this piece has definite positional structure. The mathematical sequences embed what appear to be spatial coordinates. Triangulation vectors pointing us to the next piece, maybe.\n\nWhatever sent this signal wanted us to follow the trail.\n\n- Marcus`
        );
    }, 12000);

    setTimeout(() => {
        addMailMessage(
            'Dr. Eleanor Chen - Signal Intelligence',
            'Triangulation Vectors in SRC-7024 Data',
            `Dr. ${name},\n\nI've been cross-referencing Marcus's coordinate analysis against every pulsar database we have. The vectors are real.\n\nThree reference points, all converging on a single location in deep space. Nothing in our catalogs matches these coordinates. If this fragment is pointing us to the next piece of the message...\n\nWe need to follow the trail.\n\n- Eleanor`
        );
    }, 22000);

    setTimeout(() => {
        addMailMessage(
            'Dr. James Whitmore - SETI Director',
            '[URGENT] PROJECT LIGHTHOUSE — Investigation Page Activated',
            `Dr. ${name},\n\nChen and Webb both confirm: the SRC-7024 fragment contains triangulation vectors pointing to an unknown location in deep space. If the rest of the message is out there, this is how we find it.\n\nI've authorized the creation of a dedicated investigation workspace — PROJECT LIGHTHOUSE. You'll find it in your navigation panel.\n\nThis is a treasure hunt, ${name}. And we just found the first clue.\n\n- James Whitmore\n  SETI Program Director`
        );

        // Unlock investigation page after this email arrives
        unlockInvestigation();
        onFragmentCollected();
    }, 32000);
}

// Schedule scientist emails about pre-Big Bang constants (after Fragment 2)
function schedulePreBigBangEmails() {
    const name = gameState.playerName;

    setTimeout(() => {
        addMailMessage(
            'Dr. Sarah Okonkwo - Astrobiology',
            'NEXUS POINT Data — I need to tell someone',
            `Dr. ${name},\n\nI need to tell someone because I can't tell my team without causing a panic.\n\nThe physical constants in the NEXUS POINT fragment don't match our universe. They describe different initial conditions — as if someone is documenting the parameters of a DIFFERENT cosmos. And the temporal markers predate the Big Bang by billions of years.\n\nThat sentence should be meaningless. It should be gibberish. But the math is clean.\n\nI'm terrified.\n\nTwo fragments down. The message is still incomplete. Keep scanning — any star could be carrying another piece.\n\n- Sarah`
        );
    }, 20000);

    setTimeout(() => {
        addMailMessage(
            'Dr. Eleanor Chen - Radio Astronomy',
            'RE: NEXUS POINT — A different perspective',
            `Dr. ${name},\n\nSarah just told me. I know she's scared. I'm not.\n\nI'm awed.\n\nThink about it — if they wanted to hurt us, they wouldn't have scattered the message across multiple stars for collaborative decryption. They wouldn't have embedded coordinates we could follow. This feels like... a gift.\n\nSomeone wanted to be found. Someone wanted us to understand.\n\nLet's keep going.\n\n- Eleanor`
        );
    }, 40000);

    // Only hint at 82 Eridani if the player hasn't found it after scanning half the Day 3 stars
    scheduleEridaniHintIfNeeded();
}

// Check periodically if the player needs a hint about 82 Eridani
function scheduleEridaniHintIfNeeded() {
    const ERIDANI_INDEX = 26;
    const DAY3_STARS = [20, 21, 22, 23, 24, 25, 26, 27, 28];
    const CHECK_INTERVAL = 15000; // Check every 15s
    const SCAN_THRESHOLD = 5; // Half of 9 Day 3 stars

    const checkTimer = setInterval(() => {
        // Stop checking if fragment already found
        if (gameState.fragments.sources.eridani82) {
            clearInterval(checkTimer);
            return;
        }

        const day3Scanned = DAY3_STARS.filter(id => gameState.scanResults.has(id)).length;

        if (day3Scanned >= SCAN_THRESHOLD && !gameState.scanResults.has(ERIDANI_INDEX)) {
            clearInterval(checkTimer);
            const name = gameState.playerName;
            addMailMessage(
                'Dr. Marcus Webb - Xenolinguistics',
                'RE: NEXUS POINT Analysis — "Before Time"',
                `Dr. ${name},\n\nDr. Okonkwo is right. The temporal markers in Fragment 2 point to events before the Big Bang. I keep coming back to the 82 Eridani signal — that civilization mentioned "what came before."\n\nWe need their data. If they've decoded another piece of this message, combining it with ours might reveal the full picture.\n\nHave you established contact with 82 Eridani yet?\n\n- Marcus`
            );
        }
    }, CHECK_INTERVAL);

    // Safety: stop checking after 10 minutes regardless
    setTimeout(() => clearInterval(checkTimer), 600000);
}

// Schedule emails after all 3 fragments collected, guiding to genesis triangulation
function scheduleGenesisTriangulationEmails() {
    const name = gameState.playerName;

    setTimeout(() => {
        addMailMessage(
            'Dr. James Whitmore - SETI Director',
            'Before we go further',
            `Dr. ${name},\n\nBefore Eleanor sends you the triangulation data — I need a moment.\n\nI started this program thirty years ago. Fought the funding cuts. Every year, the same question from the oversight committee: "Why are we still listening?" I never had a good answer. Just faith.\n\nNow I'm looking at three fragments of a message from before the Big Bang, and I'm crying at my desk like a child.\n\nThank you. For everything.\n\n- James`
        );
    }, 5000);

    setTimeout(() => {
        addMailMessage(
            'Dr. Eleanor Chen - Radio Astronomy',
            'All Three Fragments — Pattern Emerging',
            `Dr. ${name},\n\nWith all three fragments decoded, I ran a cross-correlation analysis. The data from SRC-7024, NEXUS POINT, and 82 Eridani aren't just pieces of a message — they contain a SECOND set of triangulation vectors.\n\nThese vectors don't point to any known object. They converge on a position that predates our earliest sky surveys.\n\nCheck PROJECT LIGHTHOUSE. We need to triangulate this immediately.\n\n- Eleanor`
        );
    }, 15000);

    setTimeout(() => {
        addMailMessage(
            'Dr. Marcus Webb - Xenolinguistics',
            'RE: Fragment Cross-Analysis — "The Origin Point"',
            `Dr. ${name},\n\nEleanor is right. These three fragments, when combined, contain precise triangulation data pointing to what the encoding describes as a "genesis coordinate."\n\nWhatever created these signals is directing us to the source — the very origin of the message.\n\nUse the investigation page to run the triangulation. I believe this is the final piece.\n\n- Marcus`
        );
    }, 30000);
}

// Schedule emails after GENESIS POINT synthesis fragment collected
function schedulePostGenesisEmails() {
    const name = gameState.playerName;

    setTimeout(() => {
        addMailMessage(
            'Dr. James Whitmore - SETI Director',
            'It\'s just us now',
            `Dr. ${name},\n\nI've cleared the building. It's just us now — the original team. Chen, Webb, Okonkwo, and you.\n\nAll four fragments are decoded. The complete message is reconstructable.\n\nOpen PROJECT LIGHTHOUSE when you're ready. Take your time.\n\nWe've been waiting 13.8 billion years. A few more minutes won't matter.\n\n- James`
        );
    }, 5000);
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

    // Archive contact in journal with personal musing
    if (messageData) {
        let contactText = '';
        if (messageData.hasImage) {
            contactText = [...(messageData.beforeImage || []), '[IMAGE DATA]', ...(messageData.afterImage || [])].join('\n');
        } else if (messageData.messages) {
            contactText = messageData.messages.join('\n');
        } else if (Array.isArray(messageData)) {
            contactText = messageData.join('\n');
        }

        // Contact-specific personal musings
        const contactMusings = {
            8:  "They sent us a map. A star chart showing our own solar system, seen from eleven light years away. They know where we are. They've known for a long time.",
            10: "They heard Voyager. Our golden record, our music, our greeting — and they've been listening ever since. They mentioned 'the old signal.' What old signal?",
            11: "An automated eulogy, broadcasting for 847,293 cycles. They decoded their piece before the end. Even their dying act was an attempt to connect.",
            12: "Three pulses. The simplest question in any language: 'Is anyone there?' And we can hear them... but we can't answer. The signal is eight years old. They're still waiting.",
            16: "An invitation. They showed us their world — blue and green, like ours — and they want us to visit. This isn't first contact. This is a welcome.",
            13: "They showed us their face. Across the void of space, the first thing they chose to share was who they are. Isn't that the most human thing imaginable?",
            28: "They received our 1974 Arecibo message and sent it back — modified, expanded. They're not just listening. They're in dialogue with us across decades.",
            21: "'The network awaits new members.' A network of civilizations, all connected by something they call 'the first signal.' And they think we're almost ready.",
            26: "Seventeen generations they've watched us. They've seen our worst and our best. And still they think we're worth connecting with. 'No single civilization can read it alone.' It requires cooperation.",
            25: "A megastructure. Broadcasting for millions of years. Built specifically for civilizations reaching our level of technology to find. We didn't discover them — they arranged to be discovered."
        };
        const musing = contactMusings[star.id];
        if (musing) {
            contactText += `\n\n— ${musing}`;
        }

        addJournalEntry('contact', {
            starName: star.name,
            title: `Contact: ${star.name}`,
            content: contactText
        });
        showJournalButton();

        // Personal reflections after key contacts
        if (star.id === ROSS_128_INDEX) {
            addPersonalLog('First Contact',
                `They sent us a map. A star chart showing our own solar system, seen from eleven light years away.\n\nThey know where we are. They've known for a long time.\n\nThe signal is eight years old. Whatever sent this — they're still out there. Waiting.\n\nAnd we have no way to answer.`
            );
        }
    }
}

// No-op: fragments are now awarded through decryption minigames, not contacts directly
function awardContactFragment(star) {
    // Fragments are now part of the breadcrumb trail:
    // Fragment 1: SRC-7024 scan → easy decryption
    // Fragment 2: NEXUS POINT scan → medium decryption
    // Fragment 3: 82 Eridani contact → hard decryption (triggered in showPostContactActions)
    // Fragment 4: Synthesis alignment (from Investigation page)
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

    // Show post-contact actions
    function showPostContactActions(star) {
        if (!star) return;

        // Ross 128 — first alien contact: send email + alignment tutorial
        if (star.id === ROSS_128_INDEX && gameState.decryptionComplete && !gameState.tutorialCompleted) {
            setTimeout(() => {
                showRoss128PostContact();
            }, 2000);
        }

        // 82 Eridani — collaborative decryption data (Fragment 3)
        const ERIDANI_82_INDEX = 26;
        if (star.id === ERIDANI_82_INDEX && !gameState.fragments.sources.eridani82) {
            setTimeout(() => {
                showEridaniDecryptionOffer();
            }, 2000);
        }
    }

    function showRoss128PostContact() {
        const display = document.getElementById('message-display');

        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'text-align: center; margin-top: 25px;';

        const btn = document.createElement('button');
        btn.textContent = '[ CONTINUE ANALYSIS ]';
        btn.className = 'btn';
        btn.style.cssText = `
            background: rgba(0, 255, 0, 0.1);
            border: 2px solid #0f0;
            color: #0f0;
            font-family: 'VT323', monospace;
            font-size: 18px;
            padding: 10px 25px;
            cursor: pointer;
            text-shadow: 0 0 8px #0f0;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
        `;

        btn.addEventListener('click', () => {
            playClick();

            // Send Eleanor Chen post-decryption email
            const pName = gameState.playerName;
            setTimeout(() => {
                addMailMessage(
                    'Dr. Eleanor Chen - Radio Astronomy',
                    'RE: Ross 128 — Decryption Results',
                    `${pName},\n\nI've been staring at the decoded output for the last hour. I don't even know where to begin.\n\nThe signal isn't just a message. Embedded alongside it are fragments of what can only be described as scientific data — mathematical constants, molecular structures, quantum states. Some of it maps to known physics. Some of it... doesn't. Not yet.\n\nBut here's what's keeping me up: the encoding predates anything we thought possible. The timestamp markers in the signal structure suggest an origin point that shouldn't exist. I've triple-checked. The math doesn't lie.\n\nWhoever sent this was thinking in timescales we can barely comprehend.\n\nWe need to keep scanning. If Ross 128 had this, there may be more signals out there — more pieces of whatever puzzle this is. I have a feeling we've only scratched the surface.\n\nStay sharp out there.\n\n- Eleanor`
                );
            }, 20000);

            // Launch alignment tutorial if not completed
            if (!gameState.tutorialCompleted) {
                log('INITIALIZING ALIGNMENT TRAINING...', 'info');
                startAlignmentTutorial(
                    () => {
                        log('Training complete! Return to starmap to continue scanning.', 'info');
                        showView('starmap-view');
                        document.getElementById('analyze-btn').disabled = false;
                    },
                    () => {
                        log('Training skipped. Return to starmap to continue scanning.', 'info');
                        gameState.tutorialCompleted = true;
                        showView('starmap-view');
                        document.getElementById('analyze-btn').disabled = false;
                    }
                );
            } else {
                showView('starmap-view');
                log('Return to starmap to continue scanning.', 'info');
                document.getElementById('analyze-btn').disabled = false;
            }
        });

        wrapper.appendChild(btn);
        display.appendChild(wrapper);
        display.scrollTop = display.scrollHeight;
    }

    function showEridaniDecryptionOffer() {
        const prompt = document.createElement('div');
        prompt.className = 'message-line';
        prompt.style.cssText = 'color: #f0f; text-shadow: 0 0 10px #f0f; font-size: 18px; margin-top: 30px; text-align: center;';
        prompt.innerHTML = `
            <div style="margin-bottom: 15px;">
                ◆ COLLABORATIVE DATA DETECTED ◆
            </div>
            <div style="color: #0ff; font-size: 14px; margin-bottom: 15px;">
                82 Eridani has transmitted encrypted collaborative data.<br>
                Combined with our fragments, this may reveal the full message.<br><br>
                <span style="color: #ff0;">DECRYPTION DIFFICULTY: HARD</span>
            </div>
        `;
        messageDisplay.appendChild(prompt);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'margin-top: 15px; text-align: center;';

        const yesBtn = document.createElement('button');
        yesBtn.textContent = 'INITIATE DECRYPTION';
        yesBtn.className = 'btn';
        yesBtn.style.cssText = 'background: rgba(255, 0, 255, 0.1); border: 2px solid #f0f; color: #f0f; margin: 0 10px; padding: 10px 20px;';
        yesBtn.addEventListener('click', () => {
            playClick();
            buttonContainer.remove();
            prompt.innerHTML = '<div style="color: #f0f;">[INITIALIZING COLLABORATIVE DECRYPTION...]</div>';

            setTimeout(() => {
                startDecryptionMinigame(
                    // Success callback
                    () => {
                        // Chain into alignment minigame (5 sub-frags, hard)
                        log('DECRYPTION COMPLETE — Initiating fragment alignment...', 'highlight');
                        startSingleFragmentAlignment(
                            'eridani82',
                            '\u2206\u25CA\u2B21\u2727 \u25CF \u221E\u2295\u2234\u2297 \u25CF \u2727\u2B21\u25CA\u2206',
                            // Alignment success
                            () => {
                                showFragmentDecodeReveal('eridani82', () => {
                                    if (!gameState.fragments.sources.eridani82) {
                                        gameState.fragments.collected.push('eridani82');
                                        gameState.fragments.sources.eridani82 = true;
                                        log('FRAGMENT 3 ACQUIRED: 82 Eridani collaborative data', 'highlight');
                                        addPersonalLog('Fragment 3: 82 Eridani',
                                            `82 Eridani sees the same patterns we do. Different species, different star, different everything — and yet they recognized the signal too.\n\nWe're not alone in being not alone.\n\nTheir data fits with ours like a key in a lock. Whoever designed this wanted multiple civilizations to find it. To work together. To piece it together.\n\nOne fragment left.`
                                        );
                                    }
                                    onFragmentCollected();
                                    scheduleGenesisTriangulationEmails();
                                    autoSave();
                                    showView('starmap-view');
                                    checkAndShowDayComplete();
                                });
                            },
                            // Alignment cancel
                            () => {
                                log('Fragment alignment aborted.', 'warning');
                                showView('contact-view');
                            },
                            { fragmentCount: 5, difficulty: 'hard' }
                        );
                    },
                    // Cancel callback
                    () => {
                        log('Decryption aborted.', 'warning');
                        showView('contact-view');
                    },
                    'hard'
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
            prompt.innerHTML = '<div style="color: #aa0;">[DECRYPTION DEFERRED]</div>';
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
