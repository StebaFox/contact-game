// ═════════════════════════════════════════════════════════════════════════════
// DECRYPTION MINIGAME
// Interactive pattern-capture puzzle for Day 2 signal decryption
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { showView, log } from '../ui/rendering.js';
import { playClick, getMasterVolume } from './audio.js';
import { autoSave } from '../core/save-system.js';

// ─────────────────────────────────────────────────────────────────────────────
// Decryption State
// ─────────────────────────────────────────────────────────────────────────────

let decryptionState = {
    active: false,
    canvas: null,
    ctx: null,
    animationId: null,
    startTime: 0,

    // Grid of blocks
    grid: [],
    gridWidth: 24,
    gridHeight: 12,
    blockSize: 0,

    // Locked cells (captured patterns become locked)
    lockedCells: [], // Array of {x, y, char} for locked cells

    // Coherence mechanics
    coherence: 0,
    targetCoherence: 100,
    patternsNeeded: 8,
    patternsCaptured: 0,

    // Active target pattern
    targetPattern: null,
    targetTimer: 0,
    targetDuration: 2500, // How long target stays visible
    targetCooldown: 0,
    missedPatterns: 0,

    // Dangerous pattern (overlaps locked cells)
    isDangerous: false,
    dangerousCells: [], // Which locked cells are at risk

    // Lock window
    lockWindow: false,
    windowStart: 0,
    windowDuration: 4000,

    // Visual effects
    flashCells: [],
    pulseIntensity: 0,
    scanlineY: 0,

    // Audio - reuse single context to prevent crackling
    audioContext: null,
    audioGain: null,

    // Callbacks
    onSuccess: null,
    onCancel: null
};

// Character set for blocks
const BLOCK_CHARS = '0123456789ABCDEF';
const PATTERN_CHARS = '0123456789ABCDEF□■●○◆◇▲△';

// ─────────────────────────────────────────────────────────────────────────────
// Start Decryption Minigame
// ─────────────────────────────────────────────────────────────────────────────

// Difficulty presets
const DIFFICULTY_PRESETS = {
    easy: {
        patternsNeeded: 5,
        targetDuration: 3500,
        windowDuration: 5000,
        dangerousChance: 0,       // No dangerous patterns
        minPatternWidth: 3,
        maxPatternWidth: 5,
        minPatternHeight: 3,
        maxPatternHeight: 4
    },
    medium: {
        patternsNeeded: 8,
        targetDuration: 2500,
        windowDuration: 4000,
        dangerousChance: 0.3,     // Occasional dangerous patterns
        minPatternWidth: 2,
        maxPatternWidth: 5,
        minPatternHeight: 2,
        maxPatternHeight: 4
    },
    hard: {
        patternsNeeded: 12,
        targetDuration: 1800,
        windowDuration: 3000,
        dangerousChance: 0.6,     // Frequent dangerous patterns
        minPatternWidth: 2,
        maxPatternWidth: 4,
        minPatternHeight: 2,
        maxPatternHeight: 3
    }
};

export function startDecryptionMinigame(onSuccess, onCancel, difficulty = 'medium') {
    decryptionState.onSuccess = onSuccess;
    decryptionState.onCancel = onCancel;

    // Apply difficulty preset
    const preset = DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS.medium;
    decryptionState.patternsNeeded = preset.patternsNeeded;
    decryptionState.targetDuration = preset.targetDuration;
    decryptionState.windowDuration = preset.windowDuration;
    decryptionState.dangerousChance = preset.dangerousChance;
    decryptionState.minPatternWidth = preset.minPatternWidth;
    decryptionState.maxPatternWidth = preset.maxPatternWidth;
    decryptionState.minPatternHeight = preset.minPatternHeight;
    decryptionState.maxPatternHeight = preset.maxPatternHeight;

    // Show instruction screen first
    showDecryptionInstructions(() => {
        // Start the actual game after instructions
        beginDecryptionGame();
    }, onCancel);
}

function showDecryptionInstructions(onBegin, onCancel) {
    const overlay = document.createElement('div');
    overlay.id = 'decryption-instructions';
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

    overlay.innerHTML = `
        <div style="
            border: 2px solid #0f0;
            background: #000;
            padding: 30px 40px;
            max-width: 600px;
            text-align: center;
            box-shadow: 0 0 50px rgba(0, 255, 0, 0.3);
        ">
            <div style="color: #0f0; font-size: 28px; text-shadow: 0 0 20px #0f0; margin-bottom: 20px;">
                QUANTUM DECRYPTION PROTOCOL
            </div>

            <div style="color: #0ff; font-size: 16px; margin-bottom: 25px; line-height: 1.6;">
                Encrypted signal detected. Extract the hidden data patterns.
            </div>

            <div style="text-align: left; padding: 20px; border: 1px solid #030; background: rgba(0, 50, 0, 0.2); margin-bottom: 25px;">
                <div style="color: #ff0; font-size: 14px; margin-bottom: 15px;">OBJECTIVES:</div>

                <div style="color: #0f0; font-size: 13px; margin-bottom: 12px;">
                    <span style="color: #0ff;">▶</span> Highlighted patterns will appear in the data stream
                </div>
                <div style="color: #0f0; font-size: 13px; margin-bottom: 12px;">
                    <span style="color: #0ff;">▶</span> <span style="color: #ff0;">CLICK</span> patterns before they fade to lock them
                </div>
                <div style="color: #0f0; font-size: 13px; margin-bottom: 12px;">
                    <span style="color: #0ff;">▶</span> Locked data appears in <span style="color: #0ff;">CYAN</span> - protect it!
                </div>
                <div style="color: #0f0; font-size: 13px; margin-bottom: 12px;">
                    <span style="color: #f80;">▶</span> <span style="color: #f80;">ORANGE</span> patterns overlap locked data - miss them and data is LOST
                </div>
                <div style="color: #0f0; font-size: 13px;">
                    <span style="color: #0ff;">▶</span> Capture <span style="color: #ff0;">${decryptionState.patternsNeeded} patterns</span> to complete decryption
                </div>
            </div>

            <div style="display: flex; justify-content: center; gap: 20px;">
                <button id="decrypt-begin-btn" style="
                    background: transparent;
                    border: 2px solid #0f0;
                    color: #0f0;
                    font-family: 'VT323', monospace;
                    font-size: 20px;
                    padding: 12px 40px;
                    cursor: pointer;
                    text-shadow: 0 0 10px #0f0;
                    animation: pulse-glow 1s infinite;
                ">
                    BEGIN DECRYPTION
                </button>
                <button id="decrypt-skip-btn" style="
                    background: transparent;
                    border: 2px solid #666;
                    color: #666;
                    font-family: 'VT323', monospace;
                    font-size: 16px;
                    padding: 12px 25px;
                    cursor: pointer;
                ">
                    ABORT
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('decrypt-begin-btn').addEventListener('click', () => {
        playClick();
        overlay.remove();
        onBegin();
    });

    document.getElementById('decrypt-skip-btn').addEventListener('click', () => {
        playClick();
        overlay.remove();
        if (onCancel) onCancel();
    });
}

function beginDecryptionGame() {
    decryptionState.active = true;

    // Reset state
    decryptionState.coherence = 0;
    decryptionState.patternsCaptured = 0;
    decryptionState.missedPatterns = 0;
    decryptionState.targetPattern = null;
    decryptionState.targetTimer = 0;
    decryptionState.targetCooldown = 500;
    decryptionState.lockWindow = false;
    decryptionState.windowStart = 0;
    decryptionState.flashCells = [];
    decryptionState.pulseIntensity = 0;
    decryptionState.scanlineY = 0;
    decryptionState.lockedCells = [];
    decryptionState.isDangerous = false;
    decryptionState.dangerousCells = [];

    // Create the decryption UI
    createDecryptionUI();

    // Initialize canvas and grid
    setupCanvas();
    initializeGrid();

    // Start animation
    decryptionState.startTime = Date.now();
    animate();

    // Start ambient audio
    startDecryptionAudio();

    console.log('SIGNAL: Decryption minigame started');
}

// ─────────────────────────────────────────────────────────────────────────────
// Create UI
// ─────────────────────────────────────────────────────────────────────────────

function createDecryptionUI() {
    const overlay = document.createElement('div');
    overlay.id = 'decryption-overlay';
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

    overlay.innerHTML = `
        <div style="
            border: 2px solid #0f0;
            background: #000;
            padding: 0;
            width: 750px;
            max-width: 95vw;
            box-shadow: 0 0 50px rgba(0, 255, 0, 0.3);
        ">
            <!-- Header -->
            <div style="
                background: linear-gradient(180deg, #020 0%, #010 100%);
                border-bottom: 2px solid #0f0;
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>
                    <div style="color: #0f0; font-size: 11px; letter-spacing: 2px;">
                        QUANTUM DECRYPTION ANALYSIS v2.1
                    </div>
                    <div style="color: #0ff; font-size: 16px; text-shadow: 0 0 10px #0ff;">
                        SIGNAL PATTERN EXTRACTION
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="color: #ff0; font-size: 14px;">
                        PATTERNS: <span id="patterns-captured">0</span>/<span id="patterns-needed">8</span>
                    </div>
                </div>
            </div>

            <!-- Instructions -->
            <div style="
                background: rgba(0, 255, 255, 0.05);
                border-bottom: 1px solid #033;
                padding: 8px 15px;
                color: #0ff;
                font-size: 13px;
                text-align: center;
            ">
                <span style="color: #ff0;">⚡ CLICK</span> highlighted patterns to extract signal data
            </div>

            <!-- Canvas Container -->
            <div style="padding: 15px; background: #000;">
                <canvas id="decryption-canvas" style="
                    width: 100%;
                    height: 320px;
                    border: 1px solid #030;
                    background: #000;
                    cursor: crosshair;
                "></canvas>
            </div>

            <!-- Status -->
            <div style="padding: 12px 15px; border-top: 1px solid #030;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="color: #0f0; font-size: 13px;">DECRYPTION PROGRESS:</div>
                    <div id="coherence-value" style="color: #0ff; font-size: 18px; text-shadow: 0 0 10px #0ff;">0%</div>
                </div>

                <!-- Progress Bar -->
                <div style="
                    width: 100%;
                    height: 20px;
                    border: 2px solid #0f0;
                    background: #010;
                    position: relative;
                    overflow: hidden;
                ">
                    <div id="coherence-bar" style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #030, #0f0);
                        transition: width 0.2s ease-out;
                        box-shadow: 0 0 10px #0f0;
                    "></div>
                </div>

                <!-- Status Text -->
                <div id="status-text" style="
                    color: #0ff;
                    font-size: 13px;
                    text-align: center;
                    margin-top: 10px;
                    min-height: 18px;
                ">
                    SCANNING FOR SIGNAL PATTERNS...
                </div>
            </div>

            <!-- Buttons -->
            <div style="
                padding: 12px 15px;
                border-top: 1px solid #030;
                display: flex;
                justify-content: center;
                gap: 15px;
            ">
                <button id="decrypt-lock-btn" style="
                    background: transparent;
                    border: 2px solid #444;
                    color: #444;
                    font-family: 'VT323', monospace;
                    font-size: 16px;
                    padding: 10px 35px;
                    cursor: not-allowed;
                    text-shadow: none;
                " disabled>
                    LOCK DECRYPTION
                </button>
                <button id="decrypt-cancel-btn" style="
                    background: transparent;
                    border: 2px solid #f00;
                    color: #f00;
                    font-family: 'VT323', monospace;
                    font-size: 16px;
                    padding: 10px 25px;
                    cursor: pointer;
                    text-shadow: 0 0 5px #f00;
                ">
                    ABORT
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Update pattern count display
    document.getElementById('patterns-needed').textContent = decryptionState.patternsNeeded;

    // Add event listeners
    document.getElementById('decrypt-lock-btn').addEventListener('click', attemptLock);
    document.getElementById('decrypt-cancel-btn').addEventListener('click', cancelDecryption);
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas Setup
// ─────────────────────────────────────────────────────────────────────────────

function setupCanvas() {
    decryptionState.canvas = document.getElementById('decryption-canvas');
    decryptionState.ctx = decryptionState.canvas.getContext('2d');

    const rect = decryptionState.canvas.getBoundingClientRect();
    decryptionState.canvas.width = rect.width * window.devicePixelRatio;
    decryptionState.canvas.height = rect.height * window.devicePixelRatio;
    decryptionState.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Calculate block size
    const width = rect.width;
    const height = rect.height;
    decryptionState.blockSize = Math.floor(Math.min(
        width / decryptionState.gridWidth,
        height / decryptionState.gridHeight
    ));

    // Add click handler
    decryptionState.canvas.addEventListener('click', handleCanvasClick);
}

function initializeGrid() {
    decryptionState.grid = [];
    for (let y = 0; y < decryptionState.gridHeight; y++) {
        const row = [];
        for (let x = 0; x < decryptionState.gridWidth; x++) {
            row.push({
                char: BLOCK_CHARS[Math.floor(Math.random() * BLOCK_CHARS.length)],
                brightness: 0.2 + Math.random() * 0.3,
                changeTimer: Math.random() * 500,
                highlighted: false
            });
        }
        decryptionState.grid.push(row);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Click Handler
// ─────────────────────────────────────────────────────────────────────────────

function handleCanvasClick(e) {
    if (!decryptionState.active || decryptionState.lockWindow) return;

    const rect = decryptionState.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const blockSize = decryptionState.blockSize;
    const offsetX = (rect.width - blockSize * decryptionState.gridWidth) / 2;
    const offsetY = (rect.height - blockSize * decryptionState.gridHeight) / 2;

    const gridX = Math.floor((x - offsetX) / blockSize);
    const gridY = Math.floor((y - offsetY) / blockSize);

    // Check if clicked on target pattern
    if (decryptionState.targetPattern) {
        const tp = decryptionState.targetPattern;
        if (gridX >= tp.x && gridX < tp.x + tp.width &&
            gridY >= tp.y && gridY < tp.y + tp.height) {
            capturePattern();
            return;
        }
    }

    // Clicked wrong area - small penalty visual
    addFlashEffect(gridX, gridY, '#f00', 0.3);
    playErrorBlip();
}

function capturePattern() {
    if (!decryptionState.targetPattern) return;

    decryptionState.patternsCaptured++;

    // Add flash effect at pattern location and LOCK these cells
    const tp = decryptionState.targetPattern;
    for (let py = tp.y; py < tp.y + tp.height; py++) {
        for (let px = tp.x; px < tp.x + tp.width; px++) {
            addFlashEffect(px, py, '#0f0', 1);

            // Lock this cell with the pattern character
            const lockedChar = tp.chars[py - tp.y][px - tp.x];
            decryptionState.lockedCells.push({
                x: px,
                y: py,
                char: lockedChar
            });
        }
    }

    // Clear dangerous state
    decryptionState.isDangerous = false;
    decryptionState.dangerousCells = [];

    // Update coherence
    decryptionState.coherence = (decryptionState.patternsCaptured / decryptionState.patternsNeeded) * 100;
    decryptionState.pulseIntensity = 1;

    // Clear target
    decryptionState.targetPattern = null;
    decryptionState.targetCooldown = 800 + Math.random() * 400;

    // Play capture sound
    playCaptureSound();

    // Update UI
    document.getElementById('patterns-captured').textContent = decryptionState.patternsCaptured;

    // Check if we have enough patterns
    if (decryptionState.patternsCaptured >= decryptionState.patternsNeeded) {
        startLockWindow();
    }

    log(`Pattern captured! (${decryptionState.patternsCaptured}/${decryptionState.patternsNeeded})`, 'info');
}

function addFlashEffect(x, y, color, intensity) {
    decryptionState.flashCells.push({
        x, y, color, intensity, decay: 0.05
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern Generation
// ─────────────────────────────────────────────────────────────────────────────

function generateTargetPattern() {
    // Random size based on difficulty
    const minW = decryptionState.minPatternWidth || 2;
    const maxW = decryptionState.maxPatternWidth || 5;
    const minH = decryptionState.minPatternHeight || 2;
    const maxH = decryptionState.maxPatternHeight || 4;
    const width = minW + Math.floor(Math.random() * (maxW - minW + 1));
    const height = minH + Math.floor(Math.random() * (maxH - minH + 1));

    // Try to find a position that doesn't overlap locked cells
    let x, y;
    let attempts = 0;
    let overlappingLocked = [];

    do {
        x = Math.floor(Math.random() * (decryptionState.gridWidth - width));
        y = Math.floor(Math.random() * (decryptionState.gridHeight - height));

        // Check for overlap with locked cells
        overlappingLocked = [];
        for (const locked of decryptionState.lockedCells) {
            if (locked.x >= x && locked.x < x + width &&
                locked.y >= y && locked.y < y + height) {
                overlappingLocked.push(locked);
            }
        }

        attempts++;
    } while (overlappingLocked.length > 0 && attempts < 20);

    // If we couldn't find a clear spot, allow overlap but mark as dangerous
    // On easy difficulty (dangerousChance = 0), keep trying to avoid overlaps
    const dangerousChance = decryptionState.dangerousChance || 0;
    let isDangerous = overlappingLocked.length > 0;
    if (isDangerous && dangerousChance === 0) {
        // On easy, just place it somewhere clear even if suboptimal
        isDangerous = false;
        overlappingLocked = [];
    } else if (!isDangerous && dangerousChance > 0 && decryptionState.lockedCells.length > 0 && Math.random() < dangerousChance) {
        // On medium/hard, sometimes deliberately create dangerous patterns
        // by placing near locked cells
        const lockedCell = decryptionState.lockedCells[Math.floor(Math.random() * decryptionState.lockedCells.length)];
        x = Math.max(0, Math.min(lockedCell.x - Math.floor(width / 2), decryptionState.gridWidth - width));
        y = Math.max(0, Math.min(lockedCell.y - Math.floor(height / 2), decryptionState.gridHeight - height));
        // Recheck overlaps
        overlappingLocked = [];
        for (const locked of decryptionState.lockedCells) {
            if (locked.x >= x && locked.x < x + width &&
                locked.y >= y && locked.y < y + height) {
                overlappingLocked.push(locked);
            }
        }
        isDangerous = overlappingLocked.length > 0;
    }
    decryptionState.isDangerous = isDangerous;
    decryptionState.dangerousCells = overlappingLocked;

    // Generate pattern characters
    const chars = [];
    for (let py = 0; py < height; py++) {
        const row = [];
        for (let px = 0; px < width; px++) {
            row.push(PATTERN_CHARS[Math.floor(Math.random() * PATTERN_CHARS.length)]);
        }
        chars.push(row);
    }

    decryptionState.targetPattern = {
        x, y, width, height, chars,
        pulsePhase: 0,
        isDangerous: isDangerous
    };
    decryptionState.targetTimer = decryptionState.targetDuration;

    // Highlight grid cells
    for (let py = y; py < y + height; py++) {
        for (let px = x; px < x + width; px++) {
            if (decryptionState.grid[py] && decryptionState.grid[py][px]) {
                decryptionState.grid[py][px].highlighted = true;
            }
        }
    }

    // Audio feedback
    if (isDangerous) {
        playDangerWarningTone();
        log('WARNING: Signal interference detected!', 'warning');
    } else {
        playPatternAppearSound();
    }
}

function clearTargetPattern() {
    if (!decryptionState.targetPattern) return;

    const tp = decryptionState.targetPattern;
    for (let py = tp.y; py < tp.y + tp.height; py++) {
        for (let px = tp.x; px < tp.x + tp.width; px++) {
            if (decryptionState.grid[py] && decryptionState.grid[py][px]) {
                decryptionState.grid[py][px].highlighted = false;
            }
        }
    }
    decryptionState.targetPattern = null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Lock Window
// ─────────────────────────────────────────────────────────────────────────────

function startLockWindow() {
    decryptionState.lockWindow = true;
    decryptionState.windowStart = Date.now();
    decryptionState.coherence = 100;
    enableLockButton();
    playSuccessChime();
}

function enableLockButton() {
    const btn = document.getElementById('decrypt-lock-btn');
    if (!btn) return;

    btn.disabled = false;
    btn.style.border = '2px solid #0f0';
    btn.style.color = '#0f0';
    btn.style.cursor = 'pointer';
    btn.style.textShadow = '0 0 10px #0f0';
    btn.style.animation = 'pulse-glow 0.5s infinite';
}

function disableLockButton() {
    const btn = document.getElementById('decrypt-lock-btn');
    if (!btn) return;

    btn.disabled = true;
    btn.style.border = '2px solid #444';
    btn.style.color = '#444';
    btn.style.cursor = 'not-allowed';
    btn.style.textShadow = 'none';
    btn.style.animation = 'none';
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation Loop
// ─────────────────────────────────────────────────────────────────────────────

function animate() {
    if (!decryptionState.active) return;

    const ctx = decryptionState.ctx;
    const rect = decryptionState.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const dt = 16; // Approximate frame time

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Update grid characters (random changes)
    updateGrid(dt);

    // Update target pattern
    updateTargetPattern(dt);

    // Draw grid
    drawGrid(ctx, width, height);

    // Draw scanline effect
    drawScanline(ctx, width, height);

    // Draw flash effects
    drawFlashEffects(ctx, width, height);

    // Update pulse
    if (decryptionState.pulseIntensity > 0) {
        decryptionState.pulseIntensity *= 0.95;
    }

    // Update UI
    updateUI();

    // Check lock window timeout
    if (decryptionState.lockWindow) {
        const elapsed = Date.now() - decryptionState.windowStart;
        if (elapsed > decryptionState.windowDuration) {
            // Window expired - pattern degrading
            decryptionState.lockWindow = false;
            disableLockButton();
            decryptionState.coherence = 80;
            decryptionState.patternsCaptured = Math.floor(decryptionState.patternsNeeded * 0.8);
            decryptionState.targetCooldown = 500;
            log('Lock window expired - pattern degrading...', 'warning');
        }
    }

    decryptionState.animationId = requestAnimationFrame(animate);
}

function updateGrid(dt) {
    for (let y = 0; y < decryptionState.gridHeight; y++) {
        for (let x = 0; x < decryptionState.gridWidth; x++) {
            const cell = decryptionState.grid[y][x];

            cell.changeTimer -= dt;
            if (cell.changeTimer <= 0) {
                // Change character
                cell.char = BLOCK_CHARS[Math.floor(Math.random() * BLOCK_CHARS.length)];
                cell.brightness = 0.15 + Math.random() * 0.35;
                cell.changeTimer = 100 + Math.random() * 400;
            }
        }
    }
}

function updateTargetPattern(dt) {
    if (decryptionState.lockWindow) return;

    if (decryptionState.targetPattern) {
        decryptionState.targetTimer -= dt;
        const prevPhase = decryptionState.targetPattern.pulsePhase;
        decryptionState.targetPattern.pulsePhase += dt * 0.01;
        // Tick sound each blink cycle (when sine crosses from negative to positive)
        if (Math.sin(prevPhase) <= 0 && Math.sin(decryptionState.targetPattern.pulsePhase) > 0) {
            playPatternBlinkTick();
        }

        if (decryptionState.targetTimer <= 0) {
            // Pattern expired - player missed it
            decryptionState.missedPatterns++;

            // PENALTY: Reduce progress
            if (decryptionState.patternsCaptured > 0) {
                // Normal miss: lose some progress
                const progressLoss = decryptionState.isDangerous ? 0 : 1;

                if (decryptionState.isDangerous && decryptionState.dangerousCells.length > 0) {
                    // DANGEROUS MISS: Delete the locked cells that were at risk!
                    for (const endangered of decryptionState.dangerousCells) {
                        // Remove from locked cells
                        const idx = decryptionState.lockedCells.findIndex(
                            c => c.x === endangered.x && c.y === endangered.y
                        );
                        if (idx >= 0) {
                            decryptionState.lockedCells.splice(idx, 1);
                            // Flash red at deleted location
                            addFlashEffect(endangered.x, endangered.y, '#f00', 1);
                        }
                    }

                    // Lose captured patterns based on deleted cells
                    const cellsLost = decryptionState.dangerousCells.length;
                    const patternsToLose = Math.ceil(cellsLost / 4); // Roughly 1 pattern per 4 cells
                    decryptionState.patternsCaptured = Math.max(0, decryptionState.patternsCaptured - patternsToLose);

                    log('DATA CORRUPTED! Locked patterns damaged!', 'warning');
                    playDangerSound();
                } else {
                    // Normal miss - small penalty
                    decryptionState.patternsCaptured = Math.max(0, decryptionState.patternsCaptured - progressLoss);
                    playMissSound();
                }

                // Update coherence
                decryptionState.coherence = (decryptionState.patternsCaptured / decryptionState.patternsNeeded) * 100;

                // Update UI
                document.getElementById('patterns-captured').textContent = decryptionState.patternsCaptured;
            } else {
                playMissSound();
            }

            clearTargetPattern();
            decryptionState.targetCooldown = 600 + Math.random() * 400;
            decryptionState.isDangerous = false;
            decryptionState.dangerousCells = [];
        }
    } else {
        decryptionState.targetCooldown -= dt;
        if (decryptionState.targetCooldown <= 0 && decryptionState.patternsCaptured < decryptionState.patternsNeeded) {
            generateTargetPattern();
        }
    }
}

function drawGrid(ctx, width, height) {
    const blockSize = decryptionState.blockSize;
    const gridWidth = decryptionState.gridWidth;
    const gridHeight = decryptionState.gridHeight;

    const offsetX = (width - blockSize * gridWidth) / 2;
    const offsetY = (height - blockSize * gridHeight) / 2;

    // Build a lookup for locked cells
    const lockedLookup = {};
    for (const locked of decryptionState.lockedCells) {
        lockedLookup[`${locked.x},${locked.y}`] = locked;
    }

    // Build a lookup for endangered cells
    const endangeredLookup = {};
    for (const endangered of decryptionState.dangerousCells) {
        endangeredLookup[`${endangered.x},${endangered.y}`] = true;
    }

    ctx.font = `${Math.floor(blockSize * 0.7)}px 'Courier New', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const cell = decryptionState.grid[y][x];
            const px = offsetX + x * blockSize;
            const py = offsetY + y * blockSize;
            const cellKey = `${x},${y}`;
            const isLocked = lockedLookup[cellKey];
            const isEndangered = endangeredLookup[cellKey];
            const isDangerousTarget = decryptionState.isDangerous && cell.highlighted;

            // Background
            let bgAlpha = 0.05;
            let bgColor = '0, 255, 0'; // green

            if (isLocked) {
                // Locked cells have cyan background
                bgAlpha = 0.2 + 0.1 * Math.sin(Date.now() * 0.003);
                bgColor = '0, 255, 255';

                if (isEndangered) {
                    // Endangered locked cells flash red!
                    const dangerPulse = Math.sin(Date.now() * 0.02);
                    if (dangerPulse > 0) {
                        bgColor = '255, 0, 0';
                        bgAlpha = 0.3 + 0.2 * dangerPulse;
                    }
                }
            } else if (cell.highlighted) {
                bgAlpha = 0.15 + 0.1 * Math.sin(Date.now() * 0.008);
                if (isDangerousTarget) {
                    bgColor = '255, 100, 0'; // orange-red for dangerous
                }
            }

            ctx.fillStyle = `rgba(${bgColor}, ${bgAlpha})`;
            ctx.fillRect(px, py, blockSize - 1, blockSize - 1);

            // Character
            let charColor;
            let displayChar = cell.char;

            if (isLocked) {
                // Locked cells show their locked character in bright cyan
                const pulse = 0.8 + 0.2 * Math.sin(Date.now() * 0.005);
                displayChar = isLocked.char;

                if (isEndangered) {
                    // Flash between cyan and red
                    const dangerPulse = Math.sin(Date.now() * 0.02);
                    charColor = dangerPulse > 0 ? `rgba(255, 50, 50, 1)` : `rgba(0, 255, 255, ${pulse})`;
                } else {
                    charColor = `rgba(0, 255, 255, ${pulse})`;
                }
            } else if (cell.highlighted) {
                // Target pattern cell
                const pulse = 0.7 + 0.3 * Math.sin(Date.now() * 0.01);
                if (isDangerousTarget) {
                    charColor = `rgba(255, 150, 0, ${pulse})`; // orange for dangerous
                } else {
                    charColor = `rgba(255, 255, 0, ${pulse})`; // yellow normally
                }
            } else {
                charColor = `rgba(0, 255, 0, ${cell.brightness})`;
            }

            ctx.fillStyle = charColor;
            ctx.fillText(displayChar, px + blockSize / 2, py + blockSize / 2);

            // Border for locked cells
            if (isLocked) {
                const borderColor = isEndangered && Math.sin(Date.now() * 0.02) > 0
                    ? 'rgba(255, 0, 0, 0.8)'
                    : 'rgba(0, 255, 255, 0.6)';
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 2;
                ctx.strokeRect(px, py, blockSize - 1, blockSize - 1);
            }
            // Border for highlighted (target) cells
            else if (cell.highlighted) {
                const borderColor = isDangerousTarget
                    ? `rgba(255, 100, 0, ${0.5 + 0.5 * Math.sin(Date.now() * 0.008)})`
                    : `rgba(255, 255, 0, ${0.5 + 0.5 * Math.sin(Date.now() * 0.008)})`;
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 2;
                ctx.strokeRect(px, py, blockSize - 1, blockSize - 1);
            }
        }
    }

    // Draw target pattern overlay with special characters
    if (decryptionState.targetPattern) {
        const tp = decryptionState.targetPattern;
        const pulse = 0.8 + 0.2 * Math.sin(tp.pulsePhase);
        const isDangerous = tp.isDangerous;

        ctx.font = `bold ${Math.floor(blockSize * 0.75)}px 'Courier New', monospace`;

        for (let py = 0; py < tp.height; py++) {
            for (let px = 0; px < tp.width; px++) {
                const screenX = offsetX + (tp.x + px) * blockSize;
                const screenY = offsetY + (tp.y + py) * blockSize;

                // Special pattern character - RED if dangerous, cyan if normal
                if (isDangerous) {
                    ctx.fillStyle = `rgba(255, 100, 50, ${pulse})`;
                } else {
                    ctx.fillStyle = `rgba(0, 255, 255, ${pulse})`;
                }
                ctx.fillText(tp.chars[py][px], screenX + blockSize / 2, screenY + blockSize / 2);
            }
        }
    }

    // Pulse overlay
    if (decryptionState.pulseIntensity > 0.01) {
        ctx.fillStyle = `rgba(0, 255, 0, ${decryptionState.pulseIntensity * 0.2})`;
        ctx.fillRect(offsetX, offsetY, blockSize * gridWidth, blockSize * gridHeight);
    }
}

function drawScanline(ctx, width, height) {
    decryptionState.scanlineY += 2;
    if (decryptionState.scanlineY > height) {
        decryptionState.scanlineY = 0;
    }

    const gradient = ctx.createLinearGradient(0, decryptionState.scanlineY - 20, 0, decryptionState.scanlineY + 20);
    gradient.addColorStop(0, 'rgba(0, 255, 0, 0)');
    gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, decryptionState.scanlineY - 20, width, 40);
}

function drawFlashEffects(ctx, width, height) {
    const blockSize = decryptionState.blockSize;
    const offsetX = (width - blockSize * decryptionState.gridWidth) / 2;
    const offsetY = (height - blockSize * decryptionState.gridHeight) / 2;

    decryptionState.flashCells = decryptionState.flashCells.filter(flash => {
        flash.intensity -= flash.decay;
        if (flash.intensity <= 0) return false;

        const px = offsetX + flash.x * blockSize;
        const py = offsetY + flash.y * blockSize;

        ctx.fillStyle = flash.color.replace(')', `, ${flash.intensity})`).replace('rgb', 'rgba');
        ctx.fillRect(px, py, blockSize - 1, blockSize - 1);

        return true;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// UI Updates
// ─────────────────────────────────────────────────────────────────────────────

function updateUI() {
    const coherenceValue = document.getElementById('coherence-value');
    const coherenceBar = document.getElementById('coherence-bar');
    const statusText = document.getElementById('status-text');

    if (!coherenceValue) return;

    const coherence = Math.round(decryptionState.coherence);
    coherenceValue.textContent = `${coherence}%`;
    coherenceBar.style.width = `${coherence}%`;

    // Update bar color based on state
    if (decryptionState.isDangerous) {
        coherenceBar.style.background = 'linear-gradient(90deg, #f00, #ff0)';
    } else {
        coherenceBar.style.background = 'linear-gradient(90deg, #0f0, #0ff)';
    }

    if (decryptionState.lockWindow) {
        const remaining = decryptionState.windowDuration - (Date.now() - decryptionState.windowStart);
        const seconds = Math.ceil(remaining / 1000);
        statusText.textContent = `⚡ DECRYPTION READY - LOCK NOW! (${seconds}s)`;
        statusText.style.color = '#0f0';
        coherenceValue.style.color = '#0f0';
        coherenceValue.style.textShadow = '0 0 20px #0f0';
    } else if (decryptionState.targetPattern) {
        const remaining = Math.ceil(decryptionState.targetTimer / 1000 * 10) / 10;
        if (decryptionState.isDangerous) {
            // DANGER WARNING
            statusText.innerHTML = `<span style="color:#f00">⚠ INTERFERENCE! LOCKED DATA AT RISK!</span> CLICK NOW! (${remaining}s)`;
            statusText.style.color = '#f00';
        } else {
            statusText.textContent = `⚠ PATTERN DETECTED - CLICK TO CAPTURE (${remaining}s)`;
            statusText.style.color = '#ff0';
        }
    } else if (decryptionState.patternsCaptured >= decryptionState.patternsNeeded) {
        statusText.textContent = 'FINALIZING DECRYPTION...';
        statusText.style.color = '#0f0';
    } else {
        statusText.textContent = 'SCANNING FOR SIGNAL PATTERNS...';
        statusText.style.color = '#0ff';
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Audio - Reuse single AudioContext to prevent crackling/buildup
// ─────────────────────────────────────────────────────────────────────────────

function getAudioContext() {
    if (!decryptionState.audioContext) {
        decryptionState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended
    if (decryptionState.audioContext.state === 'suspended') {
        decryptionState.audioContext.resume();
    }
    return decryptionState.audioContext;
}

function startDecryptionAudio() {
    // Initialize audio context early
    getAudioContext();
}

function stopDecryptionAudio() {
    // Close audio context when done to free resources
    if (decryptionState.audioContext) {
        decryptionState.audioContext.close().catch(() => {});
        decryptionState.audioContext = null;
    }
}

function playCaptureSound() {
    try {
        const vol = getMasterVolume();
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.1 * vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
}

function playErrorBlip() {
    try {
        const vol = getMasterVolume();
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 200;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.05 * vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
}

function playMissSound() {
    try {
        const vol = getMasterVolume();
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.08 * vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
}

function playPatternAppearSound() {
    try {
        const vol = getMasterVolume();
        const ctx = getAudioContext();

        // Quick digital chirp — two-tone ascending blip
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.06);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.07 * vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
}

function playDangerWarningTone() {
    try {
        const vol = getMasterVolume();
        const ctx = getAudioContext();

        // Pulsing low warning — two quick buzzes
        for (let i = 0; i < 2; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = 150;
            osc.type = 'sawtooth';
            gain.gain.setValueAtTime(0.06 * vol, ctx.currentTime + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.08);

            osc.start(ctx.currentTime + i * 0.12);
            osc.stop(ctx.currentTime + i * 0.12 + 0.08);
        }
    } catch (e) {}
}

function playPatternBlinkTick() {
    try {
        const vol = getMasterVolume();
        const ctx = getAudioContext();

        // Soft tick — very short high-freq click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 1200;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.03 * vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.02);
    } catch (e) {}
}

function playDangerSound() {
    try {
        const vol = getMasterVolume();
        const ctx = getAudioContext();

        // Alarming descending tone
        [600, 500, 400, 300].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = freq;
            osc.type = 'square';
            gain.gain.setValueAtTime(0.1 * vol, ctx.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.15);

            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + i * 0.08 + 0.15);
        });
    } catch (e) {}
}

function playSuccessChime() {
    try {
        const vol = getMasterVolume();
        const ctx = getAudioContext();

        [500, 700, 900, 1200].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.08 * vol, ctx.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.2);

            osc.start(ctx.currentTime + i * 0.08);
            osc.stop(ctx.currentTime + i * 0.08 + 0.2);
        });
    } catch (e) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────────────────────────

function attemptLock() {
    if (!decryptionState.lockWindow) {
        log('Decryption not ready!', 'warning');
        return;
    }

    playClick();
    showDecryptionSuccess();
}

function showDecryptionSuccess() {
    cancelAnimationFrame(decryptionState.animationId);
    decryptionState.active = false;

    const overlay = document.getElementById('decryption-overlay');
    if (!overlay) return;

    // Flash effect - use an overlay div instead of changing background (keeps it opaque)
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 255, 0, 0.4);
        pointer-events: none;
        z-index: 99999;
        transition: opacity 0.2s ease-out;
    `;
    overlay.appendChild(flash);
    setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 200);
    }, 50);

    // Update UI with transition message
    const statusText = document.getElementById('status-text');
    if (statusText) {
        statusText.innerHTML = `
            <div style="color: #0f0; font-size: 20px; text-shadow: 0 0 20px #0f0;">
                ✓ DECRYPTION COMPLETE
            </div>
        `;
    }

    // Start the visual transition - fade non-locked code, show locked forming groups
    setTimeout(() => {
        showCodeFragmentationTransition(overlay);
    }, 1000);

    // Update buttons
    const lockBtn = document.getElementById('decrypt-lock-btn');
    const cancelBtn = document.getElementById('decrypt-cancel-btn');
    if (lockBtn) lockBtn.style.display = 'none';
    if (cancelBtn) {
        cancelBtn.textContent = 'CONTINUE';
        cancelBtn.style.border = '2px solid #0f0';
        cancelBtn.style.color = '#0f0';
        cancelBtn.onclick = () => completeDecryption(true);
    }

    log('DECRYPTION SUCCESSFUL - Signal decoded!', 'highlight');
}

function showCodeFragmentationTransition(overlay) {
    const statusText = document.getElementById('status-text');
    const canvas = decryptionState.canvas;
    const ctx = decryptionState.ctx;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Collect locked cells and their characters
    const lockedChars = decryptionState.lockedCells.map(c => c.char).join('');

    // Phase 1: Fade out non-locked code
    if (statusText) {
        statusText.innerHTML = `
            <div style="color: #0ff; font-size: 16px;">
                ISOLATING DECRYPTED DATA...
            </div>
        `;
    }

    // Animate fade of non-locked cells
    let fadeProgress = 0;
    function fadeAnimation() {
        fadeProgress += 0.02;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        const blockSize = decryptionState.blockSize;
        const offsetX = (width - blockSize * decryptionState.gridWidth) / 2;
        const offsetY = (height - blockSize * decryptionState.gridHeight) / 2;

        // Build locked lookup
        const lockedLookup = {};
        for (const locked of decryptionState.lockedCells) {
            lockedLookup[`${locked.x},${locked.y}`] = locked;
        }

        ctx.font = `${Math.floor(blockSize * 0.7)}px 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let y = 0; y < decryptionState.gridHeight; y++) {
            for (let x = 0; x < decryptionState.gridWidth; x++) {
                const px = offsetX + x * blockSize;
                const py = offsetY + y * blockSize;
                const cellKey = `${x},${y}`;
                const isLocked = lockedLookup[cellKey];

                if (isLocked) {
                    // Locked cells stay bright
                    const pulse = 0.8 + 0.2 * Math.sin(Date.now() * 0.005);
                    ctx.fillStyle = `rgba(0, 255, 255, ${pulse})`;
                    ctx.fillText(isLocked.char, px + blockSize / 2, py + blockSize / 2);

                    ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(px, py, blockSize - 1, blockSize - 1);
                } else {
                    // Non-locked cells fade out
                    const alpha = Math.max(0, 0.3 - fadeProgress * 0.5);
                    if (alpha > 0) {
                        const cell = decryptionState.grid[y][x];
                        ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
                        ctx.fillText(cell.char, px + blockSize / 2, py + blockSize / 2);
                    }
                }
            }
        }

        if (fadeProgress < 1) {
            requestAnimationFrame(fadeAnimation);
        } else {
            // Phase 2: Show fragmentation message
            showFragmentationMessage(overlay, lockedChars);
        }
    }

    fadeAnimation();
}

function showFragmentationMessage(overlay, lockedChars) {
    const statusText = document.getElementById('status-text');

    // Update message
    if (statusText) {
        statusText.innerHTML = `
            <div style="color: #ff0; font-size: 16px; margin-bottom: 10px;">
                ⚠ SIGNAL FRAGMENTED
            </div>
            <div style="color: #0ff; font-size: 14px;">
                Data decoded but split across quantum states.<br>
                Alignment required to reconstruct message.
            </div>
        `;
    }

    // Store the locked characters for the alignment puzzle
    decryptionState.fragmentedCode = lockedChars;

    // Update continue button
    const cancelBtn = document.getElementById('decrypt-cancel-btn');
    if (cancelBtn) {
        cancelBtn.textContent = 'BEGIN ALIGNMENT';
        cancelBtn.style.border = '2px solid #0ff';
        cancelBtn.style.color = '#0ff';
        cancelBtn.style.animation = 'pulse-glow 1s infinite';
    }
}

function cancelDecryption() {
    playClick();
    completeDecryption(false);
}

function completeDecryption(success) {
    decryptionState.active = false;

    if (decryptionState.animationId) {
        cancelAnimationFrame(decryptionState.animationId);
    }

    // Clean up audio context
    stopDecryptionAudio();

    // Remove overlay
    const overlay = document.getElementById('decryption-overlay');
    if (overlay) overlay.remove();

    // Update game state
    if (success) {
        gameState.decryptionComplete = true;
        // Store the fragmented code for alignment
        gameState.fragmentedCode = decryptionState.fragmentedCode || '';
        autoSave();

        if (decryptionState.onSuccess) {
            decryptionState.onSuccess();
        }
    } else {
        if (decryptionState.onCancel) {
            decryptionState.onCancel();
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

export function isDecryptionComplete() {
    return gameState.decryptionComplete;
}

export function getFragmentedCode() {
    return gameState.fragmentedCode || decryptionState.fragmentedCode || '';
}
