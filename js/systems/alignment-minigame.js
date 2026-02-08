// ═════════════════════════════════════════════════════════════════════════════
// ALIGNMENT MINIGAME
// Fragment alignment puzzle - tutorial (2 frags) and final (4 frags)
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { showView, log } from '../ui/rendering.js';
import { playClick, getSfxVolume, switchToBackgroundMusic, stopAlienSignalSound } from './audio.js';
import { autoSave } from '../core/save-system.js';

// ─────────────────────────────────────────────────────────────────────────────
// Alignment State
// ─────────────────────────────────────────────────────────────────────────────

let alignmentState = {
    active: false,
    isTutorial: false,
    canvas: null,
    ctx: null,
    animationId: null,

    // Fragment data
    fragments: [],
    selectedFragment: null,
    dragOffset: { x: 0, y: 0 },
    isDragging: false,

    // Alignment zones
    alignmentZones: [],
    alignmentTolerance: 15,

    // Result
    alignedCount: 0,
    requiredAlignments: 2,

    // Visual
    pulsePhase: 0,
    scanlineY: 0,
    particles: [],

    // Callbacks
    onSuccess: null,
    onCancel: null,

    // Single-fragment mode
    singleFragmentKey: null,
    customRevealMessage: null,
    singleOptions: null
};

// Fragment visual patterns - each is a piece of a larger message
const FRAGMENT_PATTERNS = {
    // Tutorial fragments (2) - enhanced alien aesthetic
    tutorial1: {
        symbol: '◢◣',
        glyph: '▓▒░',
        color: '#0ff',
        encrypted: '7F4A 2C91',
        message: 'BEFORE YOU',
        // Extra alien decorations
        alienChars: ['Ψ', 'Ω', '∆', '⊕'],
        borderPattern: '░▒▓▒',
        pulseColor: '#00ffff'
    },
    tutorial2: {
        symbol: '◥◤',
        glyph: '░▒▓',
        color: '#0f0',
        encrypted: 'B3D8 E6F0',
        message: 'WE WAITED',
        alienChars: ['Σ', '∞', '⬡', '⊗'],
        borderPattern: '▓▒░▒',
        pulseColor: '#00ff00'
    },
    // Full puzzle fragments (4) - Day 3 breadcrumb trail
    src7024: {
        symbol: '◆◇◆',
        glyph: '▓█▓',
        color: '#0ff',
        encrypted: 'A7C3 9F2E 4B61',
        message: 'REMEMBER',
        alienChars: ['Ψ', '∴', '⌬', '☉'],
        borderPattern: '╔═╦═╗',
        pulseColor: '#00ffff'
    },
    nexusPoint: {
        symbol: '◇◆◇',
        glyph: '█▓█',
        color: '#ff0',
        encrypted: '8D5A C0F7 1E92',
        message: 'US NOT',
        alienChars: ['Ω', '∵', '⎔', '⚡'],
        borderPattern: '╠═╬═╣',
        pulseColor: '#ffff00'
    },
    eridani82: {
        symbol: '●○●',
        glyph: '░█░',
        color: '#0f0',
        encrypted: '3B4F D8A6 7C15',
        message: 'AS CREATORS',
        alienChars: ['∆', '◊', '⬡', '✧'],
        borderPattern: '╚═╩═╝',
        pulseColor: '#00ff00'
    },
    synthesis: {
        symbol: '○●○',
        glyph: '█░█',
        color: '#f0f',
        encrypted: 'E2B9 6D08 F3CA',
        message: 'BUT FAMILY',
        alienChars: ['Σ', '∞', '⊕', '⊗'],
        borderPattern: '║═║═║',
        pulseColor: '#ff00ff'
    }
};

// Sub-fragment patterns for multi-piece signal alignment
// Each signal type has enough sub-pieces for its difficulty level
const SIGNAL_SUB_FRAGMENTS = {
    src7024: [
        { symbol: 'Ψ∴', glyph: '▓▒', color: '#0ff', encrypted: '7F4A', message: 'Ψ∴⌬',
          alienChars: ['Ψ', '∴', '⌬', '☉'], borderPattern: '╔═╗', pulseColor: '#00ffff' },
        { symbol: '⌬☉', glyph: '▒░', color: '#0ff', encrypted: '2C91', message: '☉◆∞',
          alienChars: ['◆', '∞', '⟐', '⎔'], borderPattern: '╠═╣', pulseColor: '#00ffff' },
        { symbol: '◆⟐', glyph: '░▓', color: '#0ff', encrypted: '9F2E', message: '⟐⎔⬡',
          alienChars: ['⬡', '⊕', '◇', '⊗'], borderPattern: '╚═╝', pulseColor: '#00ffff' }
    ],
    nexusPoint: [
        { symbol: 'Ω∵', glyph: '█▓', color: '#ff0', encrypted: '8D5A', message: 'Ω∵⎔',
          alienChars: ['Ω', '∵', '⎔', '⚡'], borderPattern: '┌─┐', pulseColor: '#ffff00' },
        { symbol: 'Λ∞', glyph: '▓█', color: '#ff0', encrypted: 'C0F7', message: 'Λ∞ℏ',
          alienChars: ['Λ', '∞', 'ℏ', '⊕'], borderPattern: '├─┤', pulseColor: '#ffff00' },
        { symbol: '◆⟐', glyph: '█░', color: '#ff0', encrypted: '1E92', message: '◆⟐✧',
          alienChars: ['◆', '⟐', '✧', '⬡'], borderPattern: '└─┘', pulseColor: '#ffff00' },
        { symbol: '☉∴', glyph: '░█', color: '#ff0', encrypted: 'A3B8', message: '☉∴⌬',
          alienChars: ['☉', '∴', '⌬', '⊗'], borderPattern: '│═│', pulseColor: '#ffff00' }
    ],
    eridani82: [
        { symbol: '∆◊', glyph: '░█', color: '#0f0', encrypted: '3B4F', message: '∆◊⬢',
          alienChars: ['∆', '◊', '⬢', '⊛'], borderPattern: '╔═╗', pulseColor: '#00ff00' },
        { symbol: '⬡✧', glyph: '█░', color: '#0f0', encrypted: 'D8A6', message: '⬡✧◈',
          alienChars: ['⬡', '✧', '◈', '⊜'], borderPattern: '╠═╣', pulseColor: '#00ff00' },
        { symbol: '⊗⊕', glyph: '▓░', color: '#0f0', encrypted: '7C15', message: '⊗⊕⬣',
          alienChars: ['⊗', '⊕', '⬣', '◎'], borderPattern: '╚═╝', pulseColor: '#00ff00' },
        { symbol: '✦⊙', glyph: '░▓', color: '#0f0', encrypted: 'E4D2', message: '✦⊙⬟',
          alienChars: ['✦', '⊙', '⬟', '⟐'], borderPattern: '║═║', pulseColor: '#00ff00' },
        { symbol: 'Ψ☉', glyph: '█▓', color: '#0f0', encrypted: 'F9A1', message: 'Ψ☉∴',
          alienChars: ['Ψ', '☉', '∴', 'Ω'], borderPattern: '╬═╬', pulseColor: '#00ff00' }
    ],
    synthesis: [
        { symbol: 'Σ∞', glyph: '█▓', color: '#f0f', encrypted: 'E2B9', message: 'Σ∞⊕',
          alienChars: ['Σ', '∞', '⊕', '⊗'], borderPattern: '┏━┓', pulseColor: '#ff00ff' },
        { symbol: '⊕⊗', glyph: '▓█', color: '#f0f', encrypted: '6D08', message: '⊕⊗⬡',
          alienChars: ['⬡', '⊛', 'Ψ', '∆'], borderPattern: '┣━┫', pulseColor: '#ff00ff' },
        { symbol: '⬡Ψ', glyph: '░█', color: '#f0f', encrypted: 'F3CA', message: '⬡Ψ◊',
          alienChars: ['◊', '✧', 'Ω', '⎔'], borderPattern: '┗━┛', pulseColor: '#ff00ff' },
        { symbol: '◊Ω', glyph: '█░', color: '#f0f', encrypted: 'A1F7', message: '◊Ω⚡',
          alienChars: ['⚡', 'Λ', '∴', '☉'], borderPattern: '╋━╋', pulseColor: '#ff00ff' },
        { symbol: '⚡∴', glyph: '▓░', color: '#f0f', encrypted: 'B4E3', message: '⚡∴⟐',
          alienChars: ['⟐', '◆', '⊜', '⬣'], borderPattern: '┠━┨', pulseColor: '#ff00ff' },
        { symbol: '◆⊜', glyph: '░▓', color: '#f0f', encrypted: 'C8D5', message: '◆⊜✦',
          alienChars: ['✦', '⊙', '⬟', '∞'], borderPattern: '┯━┷', pulseColor: '#ff00ff' }
    ]
};

// ─────────────────────────────────────────────────────────────────────────────
// Start Alignment Game
// ─────────────────────────────────────────────────────────────────────────────

export function startAlignmentTutorial(onSuccess, onCancel) {
    alignmentState.singleFragmentKey = null;
    alignmentState.customRevealMessage = null;
    startAlignment(true, onSuccess, onCancel);
}

export function startFinalAlignment(onSuccess, onCancel) {
    alignmentState.singleFragmentKey = null;
    alignmentState.customRevealMessage = null;
    startAlignment(false, onSuccess, onCancel);
}

export function startSingleFragmentAlignment(fragmentKey, revealMessage, onSuccess, onCancel, options = {}) {
    alignmentState.singleFragmentKey = fragmentKey;
    alignmentState.customRevealMessage = revealMessage;
    alignmentState.singleOptions = options;
    startAlignment(true, onSuccess, onCancel);
}

function startAlignment(isTutorial, onSuccess, onCancel) {
    alignmentState.onSuccess = onSuccess;
    alignmentState.onCancel = onCancel;
    alignmentState.active = true;
    alignmentState.isTutorial = isTutorial;

    // Reset state
    alignmentState.fragments = [];
    alignmentState.selectedFragment = null;
    alignmentState.isDragging = false;
    alignmentState.alignedCount = 0;
    alignmentState.alignmentZones = [];
    alignmentState.pulsePhase = 0;
    alignmentState.particles = [];

    const isSingle = !!alignmentState.singleFragmentKey;
    const singleOpts = alignmentState.singleOptions || {};
    const singleCount = singleOpts.fragmentCount || 3;
    alignmentState.requiredAlignments = isSingle ? singleCount : (isTutorial ? 2 : 4);

    // Difficulty settings
    const difficulty = isSingle ? (singleOpts.difficulty || 'easy') : (isTutorial ? 'easy' : 'hard');
    if (difficulty === 'easy') {
        alignmentState.alignmentTolerance = 15;
        alignmentState.rotationEnabled = false;
        alignmentState.driftEnabled = false;
    } else if (difficulty === 'medium') {
        alignmentState.alignmentTolerance = 12;
        alignmentState.rotationEnabled = false;
        alignmentState.driftEnabled = true;
        alignmentState.driftPhase = 0;
    } else {
        alignmentState.alignmentTolerance = 8;
        alignmentState.rotationEnabled = true;
        alignmentState.driftEnabled = true;
        alignmentState.driftPhase = 0;
    }

    // Create UI
    createAlignmentUI(isTutorial);

    // Setup canvas
    setupCanvas();

    // Initialize fragments
    initializeFragments(isTutorial);

    // Start animation
    animate();

    console.log(`SIGNAL: Alignment ${isTutorial ? 'tutorial' : 'final puzzle'} started`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Create UI
// ─────────────────────────────────────────────────────────────────────────────

function createAlignmentUI(isTutorial) {
    const overlay = document.createElement('div');
    overlay.id = 'alignment-overlay';
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

    const isSingle = !!alignmentState.singleFragmentKey;
    const title = isSingle
        ? 'SIGNAL FRAGMENT ALIGNMENT'
        : isTutorial
            ? 'FRAGMENT ALIGNMENT TRAINING'
            : 'COSMIC MESSAGE RECONSTRUCTION';
    const subtitle = isSingle
        ? `Align ${alignmentState.requiredAlignments} decoded signal fragments to decode its content`
        : isTutorial
            ? 'Practice aligning signal fragments'
            : 'Align all 4 fragments to reveal the message';

    overlay.innerHTML = `
        <div style="
            border: 2px solid #0ff;
            background: #000;
            padding: 0;
            width: 800px;
            max-width: 95vw;
            box-shadow: 0 0 50px rgba(0, 255, 255, 0.3);
        ">
            <!-- Header -->
            <div style="
                background: linear-gradient(180deg, #011 0%, #001 100%);
                border-bottom: 2px solid #0ff;
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>
                    <div style="color: #0ff; font-size: 11px; letter-spacing: 2px;">
                        ${isTutorial ? 'TRAINING MODE' : 'OMEGA PROTOCOL'}
                    </div>
                    <div style="color: #fff; font-size: 16px; text-shadow: 0 0 10px #0ff;">
                        ${title}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="color: #ff0; font-size: 14px;">
                        ALIGNED: <span id="aligned-count">0</span>/<span id="aligned-needed">${alignmentState.requiredAlignments}</span>
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
                <span style="color: #ff0;">⚡ STUDY</span> corner symbols on fragments | <span style="color: #ff0;">MATCH</span> them to slot hints | <span style="color: #ff0;">DRAG</span> to align${alignmentState.rotationEnabled ? ' | <span style="color: #f0f;">RIGHT-CLICK</span> to rotate' : ''}
            </div>

            <!-- Canvas Container -->
            <div style="padding: 15px; background: #000;">
                <canvas id="alignment-canvas" style="
                    width: 100%;
                    height: 400px;
                    border: 1px solid #033;
                    background: #000;
                    cursor: grab;
                "></canvas>
            </div>

            <!-- Message Preview -->
            <div style="
                padding: 10px 15px;
                border-top: 1px solid #033;
                background: rgba(0, 0, 0, 0.5);
            ">
                <div id="message-label" style="color: #0ff; font-size: 12px; margin-bottom: 5px;">ENCRYPTED CODE:</div>
                <div id="message-preview" style="
                    color: #ff0;
                    font-size: 24px;
                    text-align: center;
                    letter-spacing: 3px;
                    min-height: 30px;
                    text-shadow: 0 0 10px #ff0;
                    font-family: 'VT323', monospace;
                ">
                    [AWAITING ALIGNMENT...]
                </div>
            </div>

            <!-- Buttons -->
            <div style="
                padding: 12px 15px;
                border-top: 1px solid #033;
                display: flex;
                justify-content: center;
                gap: 15px;
            ">
                <button id="alignment-confirm-btn" style="
                    background: transparent;
                    border: 2px solid #444;
                    color: #444;
                    font-family: 'VT323', monospace;
                    font-size: 16px;
                    padding: 10px 35px;
                    cursor: not-allowed;
                    text-shadow: none;
                " disabled>
                    CONFIRM ALIGNMENT
                </button>
                <button id="alignment-cancel-btn" style="
                    background: transparent;
                    border: 2px solid #f00;
                    color: #f00;
                    font-family: 'VT323', monospace;
                    font-size: 16px;
                    padding: 10px 25px;
                    cursor: pointer;
                    text-shadow: 0 0 5px #f00;
                ">
                    ${isTutorial ? 'SKIP' : 'ABORT'}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Event listeners
    document.getElementById('alignment-confirm-btn').addEventListener('click', confirmAlignment);
    document.getElementById('alignment-cancel-btn').addEventListener('click', cancelAlignment);
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas Setup
// ─────────────────────────────────────────────────────────────────────────────

function setupCanvas() {
    alignmentState.canvas = document.getElementById('alignment-canvas');
    alignmentState.ctx = alignmentState.canvas.getContext('2d');

    const rect = alignmentState.canvas.getBoundingClientRect();
    alignmentState.canvas.width = rect.width * window.devicePixelRatio;
    alignmentState.canvas.height = rect.height * window.devicePixelRatio;
    alignmentState.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Mouse/touch events
    alignmentState.canvas.addEventListener('mousedown', handleMouseDown);
    alignmentState.canvas.addEventListener('mousemove', handleMouseMove);
    alignmentState.canvas.addEventListener('mouseup', handleMouseUp);
    alignmentState.canvas.addEventListener('mouseleave', handleMouseUp);
    alignmentState.canvas.addEventListener('contextmenu', handleRightClick);

    // Touch events
    alignmentState.canvas.addEventListener('touchstart', handleTouchStart);
    alignmentState.canvas.addEventListener('touchmove', handleTouchMove);
    alignmentState.canvas.addEventListener('touchend', handleTouchEnd);
}

function initializeFragments(isTutorial) {
    const rect = alignmentState.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const fragmentSize = 80;
    const zoneSize = 90;

    // Helper to pick random subset of alien chars for zone hint
    function getZoneHint(alienChars) {
        if (!alienChars || alienChars.length < 2) return '??';
        // Pick 2 random chars from the fragment's alienChars
        const shuffled = [...alienChars].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 2).join('');
    }

    const isSingle = !!alignmentState.singleFragmentKey;

    if (isSingle) {
        // Multi-sub-fragment signal alignment
        const key = alignmentState.singleFragmentKey;
        const subFrags = SIGNAL_SUB_FRAGMENTS[key] || [];
        const singleOpts = alignmentState.singleOptions || {};
        const count = Math.min(singleOpts.fragmentCount || 3, subFrags.length);
        const hasRotation = alignmentState.rotationEnabled;

        // Build fragment list, then scatter randomly on left half
        alignmentState.fragments = [];
        const leftRegionW = width * 0.4;
        const margin = fragmentSize + 10;

        // Generate random non-overlapping positions on the left side
        const positions = [];
        for (let i = 0; i < count; i++) {
            let x, y, attempts = 0;
            do {
                x = margin / 2 + Math.random() * (leftRegionW - margin);
                y = margin / 2 + Math.random() * (height - margin);
                attempts++;
            } while (attempts < 50 && positions.some(p =>
                Math.abs(p.x - x) < fragmentSize + 8 && Math.abs(p.y - y) < fragmentSize + 8
            ));
            positions.push({ x, y });
        }

        for (let i = 0; i < count; i++) {
            const sf = subFrags[i];
            alignmentState.fragments.push({
                id: `${key}_${i}`,
                ...sf,
                x: positions[i].x,
                y: positions[i].y,
                width: fragmentSize,
                height: fragmentSize,
                aligned: false,
                targetZone: i,
                rotation: hasRotation ? (Math.floor(Math.random() * 4)) * (Math.PI / 2) : 0
            });
        }

        // Position zones on right side
        const zoneSpacing = Math.min(100, (height - 20) / count);
        const zoneStartY = (height - count * zoneSpacing) / 2;

        alignmentState.alignmentZones = [];
        for (let i = 0; i < count; i++) {
            const sf = subFrags[i];
            alignmentState.alignmentZones.push({
                x: width - 150 - (count > 3 && i % 2 === 0 ? 80 : 0),
                y: zoneStartY + i * zoneSpacing,
                width: zoneSize,
                height: zoneSize,
                hintChars: getZoneHint(sf.alienChars),
                occupied: false
            });
        }
    } else if (isTutorial) {
        // Tutorial: 2 fragments, 2 zones
        // Fragments start on the left side
        alignmentState.fragments = [
            {
                id: 'tutorial1',
                ...FRAGMENT_PATTERNS.tutorial1,
                x: 50,
                y: height / 2 - 60,
                width: fragmentSize,
                height: fragmentSize,
                aligned: false,
                targetZone: 0
            },
            {
                id: 'tutorial2',
                ...FRAGMENT_PATTERNS.tutorial2,
                x: 50,
                y: height / 2 + 30,
                width: fragmentSize,
                height: fragmentSize,
                aligned: false,
                targetZone: 1
            }
        ];

        // Zones on the right side - hint is random subset of alienChars
        alignmentState.alignmentZones = [
            {
                x: width - 150,
                y: height / 2 - 70,
                width: zoneSize,
                height: zoneSize,
                hintChars: getZoneHint(FRAGMENT_PATTERNS.tutorial1.alienChars),
                occupied: false
            },
            {
                x: width - 150,
                y: height / 2 + 30,
                width: zoneSize,
                height: zoneSize,
                hintChars: getZoneHint(FRAGMENT_PATTERNS.tutorial2.alienChars),
                occupied: false
            }
        ];
    } else {
        // Final: 4 fragments, 4 zones
        const fragmentKeys = ['src7024', 'nexusPoint', 'eridani82', 'synthesis'];

        // Scatter fragments randomly on left half
        const finalLeftW = width * 0.4;
        const finalMargin = fragmentSize + 10;
        const finalPositions = [];
        for (let i = 0; i < fragmentKeys.length; i++) {
            let x, y, attempts = 0;
            do {
                x = finalMargin / 2 + Math.random() * (finalLeftW - finalMargin);
                y = finalMargin / 2 + Math.random() * (height - finalMargin);
                attempts++;
            } while (attempts < 50 && finalPositions.some(p =>
                Math.abs(p.x - x) < fragmentSize + 8 && Math.abs(p.y - y) < fragmentSize + 8
            ));
            finalPositions.push({ x, y });
        }

        alignmentState.fragments = fragmentKeys.map((key, i) => ({
            id: key,
            ...FRAGMENT_PATTERNS[key],
            x: finalPositions[i].x,
            y: finalPositions[i].y,
            width: fragmentSize,
            height: fragmentSize,
            aligned: false,
            targetZone: i,
            rotation: alignmentState.rotationEnabled ? (Math.floor(Math.random() * 4)) * (Math.PI / 2) : 0
        }));

        // 4 zones arranged on the right - hints are random subsets of alienChars
        alignmentState.alignmentZones = fragmentKeys.map((key, i) => ({
            x: width - 200 + (i % 2) * 100,
            y: 40 + Math.floor(i / 2) * 110,
            width: zoneSize,
            height: zoneSize,
            hintChars: getZoneHint(FRAGMENT_PATTERNS[key].alienChars),
            occupied: false
        }));
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Input Handlers
// ─────────────────────────────────────────────────────────────────────────────

function getCanvasCoords(e) {
    const rect = alignmentState.canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function handleMouseDown(e) {
    const pos = getCanvasCoords(e);
    selectFragment(pos.x, pos.y);
}

function handleMouseMove(e) {
    if (!alignmentState.isDragging || !alignmentState.selectedFragment) return;

    const pos = getCanvasCoords(e);
    moveFragment(pos.x, pos.y);
}

function handleMouseUp(e) {
    if (alignmentState.isDragging && alignmentState.selectedFragment) {
        checkAlignment();
    }
    alignmentState.isDragging = false;
    alignmentState.selectedFragment = null;
    alignmentState.canvas.style.cursor = 'grab';
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = alignmentState.canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    selectFragment(x, y);
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!alignmentState.isDragging || !alignmentState.selectedFragment) return;

    const touch = e.touches[0];
    const rect = alignmentState.canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    moveFragment(x, y);
}

function handleTouchEnd(e) {
    e.preventDefault();
    if (alignmentState.isDragging && alignmentState.selectedFragment) {
        checkAlignment();
    }
    alignmentState.isDragging = false;
    alignmentState.selectedFragment = null;
}

function handleRightClick(e) {
    e.preventDefault();
    if (!alignmentState.rotationEnabled) return;

    const pos = getCanvasCoords(e);

    // Find fragment under cursor and rotate it
    for (let i = alignmentState.fragments.length - 1; i >= 0; i--) {
        const f = alignmentState.fragments[i];
        if (f.aligned) continue;

        if (pos.x >= f.x && pos.x <= f.x + f.width &&
            pos.y >= f.y && pos.y <= f.y + f.height) {
            f.rotation = (f.rotation || 0) + Math.PI / 2; // Rotate 90 degrees
            playFragmentPickup();
            return;
        }
    }
}

function selectFragment(x, y) {
    // Find fragment under cursor
    for (let i = alignmentState.fragments.length - 1; i >= 0; i--) {
        const f = alignmentState.fragments[i];
        if (f.aligned) continue; // Can't move aligned fragments

        if (x >= f.x && x <= f.x + f.width &&
            y >= f.y && y <= f.y + f.height) {
            alignmentState.selectedFragment = f;
            alignmentState.isDragging = true;
            alignmentState.dragOffset = {
                x: x - f.x,
                y: y - f.y
            };
            alignmentState.canvas.style.cursor = 'grabbing';

            // Move to front (draw last)
            alignmentState.fragments.splice(i, 1);
            alignmentState.fragments.push(f);

            playFragmentPickup();
            return;
        }
    }
}

function moveFragment(x, y) {
    if (!alignmentState.selectedFragment) return;

    alignmentState.selectedFragment.x = x - alignmentState.dragOffset.x;
    alignmentState.selectedFragment.y = y - alignmentState.dragOffset.y;
}

function checkAlignment() {
    if (!alignmentState.selectedFragment) return;

    const f = alignmentState.selectedFragment;
    const fCenterX = f.x + f.width / 2;
    const fCenterY = f.y + f.height / 2;

    // Check against all zones
    for (let i = 0; i < alignmentState.alignmentZones.length; i++) {
        const zone = alignmentState.alignmentZones[i];
        if (zone.occupied) continue;

        const zoneCenterX = zone.x + zone.width / 2;
        const zoneCenterY = zone.y + zone.height / 2;

        const dist = Math.sqrt(
            Math.pow(fCenterX - zoneCenterX, 2) +
            Math.pow(fCenterY - zoneCenterY, 2)
        );

        if (dist < alignmentState.alignmentTolerance + zone.width / 2) {
            // Check rotation (must be upright - within ~10 degrees of 0 or 2*PI multiples)
            if (alignmentState.rotationEnabled && f.rotation !== undefined) {
                const normalizedRot = ((f.rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
                if (normalizedRot > 0.2 && normalizedRot < Math.PI * 2 - 0.2) {
                    // Not upright - give visual feedback
                    playAlignmentError();
                    addAlignmentParticles(fCenterX, fCenterY, '#ff0');
                    return;
                }
            }
            // Check if correct zone
            if (f.targetZone === i) {
                // Snap to zone
                f.x = zone.x + (zone.width - f.width) / 2;
                f.y = zone.y + (zone.height - f.height) / 2;
                f.aligned = true;
                zone.occupied = true;
                alignmentState.alignedCount++;

                playAlignmentSuccess();
                addAlignmentParticles(zoneCenterX, zoneCenterY, f.color);

                updateUI();

                // Check if all aligned
                if (alignmentState.alignedCount >= alignmentState.requiredAlignments) {
                    enableConfirmButton();
                }
                return;
            } else {
                // Wrong zone - bounce back
                playAlignmentError();
                addAlignmentParticles(fCenterX, fCenterY, '#f00');
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation
// ─────────────────────────────────────────────────────────────────────────────

function animate() {
    if (!alignmentState.active) return;

    const ctx = alignmentState.ctx;
    const rect = alignmentState.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Draw background grid
    drawGrid(ctx, width, height);

    // Draw alignment zones
    drawZones(ctx);

    // Draw fragments
    drawFragments(ctx);

    // Draw particles
    drawParticles(ctx);

    // Draw scanline
    drawScanline(ctx, width, height);

    // Update
    alignmentState.pulsePhase += 0.03;
    updateParticles();

    // Apply gentle drift to unaligned fragments (hard mode only)
    if (alignmentState.driftEnabled) {
        alignmentState.driftPhase = (alignmentState.driftPhase || 0) + 0.01;
        const rect2 = alignmentState.canvas.getBoundingClientRect();
        alignmentState.fragments.forEach((f, i) => {
            if (f.aligned || f === alignmentState.selectedFragment) return;
            const driftX = Math.sin(alignmentState.driftPhase + i * 1.5) * 0.3;
            const driftY = Math.cos(alignmentState.driftPhase * 0.7 + i * 2.1) * 0.2;
            f.x = Math.max(0, Math.min(rect2.width - f.width, f.x + driftX));
            f.y = Math.max(0, Math.min(rect2.height - f.height, f.y + driftY));
        });
    }

    alignmentState.animationId = requestAnimationFrame(animate);
}

function drawGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    const gridSize = 30;

    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function drawZones(ctx) {
    alignmentState.alignmentZones.forEach((zone, i) => {
        const pulse = 0.5 + 0.3 * Math.sin(alignmentState.pulsePhase + i * 0.5);

        // Neutral zone color - no color hints, player must match by studying symbols
        const zoneColor = '#0ff';

        // Zone background - neutral
        if (zone.occupied) {
            ctx.fillStyle = `rgba(0, 255, 0, 0.15)`;
        } else {
            ctx.fillStyle = `rgba(0, 255, 255, ${0.02 + pulse * 0.02})`;
        }
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);

        // Dashed inner border pattern
        if (!zone.occupied) {
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 + pulse * 0.1})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(zone.x + 6, zone.y + 6, zone.width - 12, zone.height - 12);
            ctx.setLineDash([]);
        }

        // Orientation indicator bar (top edge — shows expected fragment orientation)
        if (!zone.occupied) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + pulse * 0.1})`;
            ctx.fillRect(zone.x + 6, zone.y + 4, zone.width - 12, 4);
            // Small triangle below bar
            ctx.beginPath();
            ctx.moveTo(zone.x + zone.width / 2 - 4, zone.y + 10);
            ctx.lineTo(zone.x + zone.width / 2, zone.y + 14);
            ctx.lineTo(zone.x + zone.width / 2 + 4, zone.y + 10);
            ctx.fill();
        }

        // Zone border
        ctx.strokeStyle = zone.occupied
            ? '#0f0'
            : `rgba(0, 255, 255, ${0.3 + pulse * 0.3})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);

        // Zone hint - random subset of matching fragment's alien chars
        // Player must study fragments to find which one has these symbols
        if (!zone.occupied && zone.hintChars) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + pulse * 0.3})`;
            ctx.font = 'bold 24px "VT323", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(zone.hintChars, zone.x + zone.width / 2, zone.y + zone.height / 2);

            // Subtle "MATCH" label
            ctx.font = '9px "VT323", monospace';
            ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
            ctx.fillText('MATCH SYMBOLS', zone.x + zone.width / 2, zone.y + zone.height / 2 + 25);
        }

        // Zone label
        ctx.fillStyle = zone.occupied
            ? 'rgba(0, 255, 0, 0.6)'
            : 'rgba(0, 255, 255, 0.5)';
        ctx.font = '10px "VT323", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`SLOT ${i + 1}`, zone.x + zone.width / 2, zone.y - 8);
    });
}

function drawFragments(ctx) {
    alignmentState.fragments.forEach((f, i) => {
        const isSelected = f === alignmentState.selectedFragment;
        const pulse = 0.8 + 0.2 * Math.sin(alignmentState.pulsePhase + i);
        const fastPulse = 0.5 + 0.5 * Math.sin(alignmentState.pulsePhase * 3 + i);

        const rotation = f.rotation || 0;
        const centerX = f.x + f.width / 2;
        const centerY = f.y + f.height / 2;

        // Apply rotation transform
        if (rotation !== 0) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.translate(-centerX, -centerY);
        }

        // Shadow for selected
        if (isSelected) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(f.x + 4, f.y + 4, f.width, f.height);
        }

        // Fragment background with gradient
        const gradient = ctx.createLinearGradient(f.x, f.y, f.x + f.width, f.y + f.height);
        if (f.aligned) {
            gradient.addColorStop(0, 'rgba(0, 255, 0, 0.25)');
            gradient.addColorStop(1, 'rgba(0, 255, 0, 0.1)');
        } else {
            gradient.addColorStop(0, `rgba(${hexToRgb(f.color)}, ${0.2 + (isSelected ? 0.1 : 0)})`);
            gradient.addColorStop(1, `rgba(${hexToRgb(f.color)}, ${0.05})`);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(f.x, f.y, f.width, f.height);

        // Orientation bar (top edge — rotates with fragment to show orientation)
        if (!f.aligned) {
            const barH = 5;
            const barGrad = ctx.createLinearGradient(f.x, f.y, f.x + f.width, f.y);
            barGrad.addColorStop(0, f.color);
            barGrad.addColorStop(0.5, '#fff');
            barGrad.addColorStop(1, f.color);
            ctx.fillStyle = barGrad;
            ctx.fillRect(f.x + 2, f.y + 2, f.width - 4, barH);
            // Small triangle marker below bar
            ctx.beginPath();
            ctx.moveTo(f.x + f.width / 2 - 5, f.y + barH + 3);
            ctx.lineTo(f.x + f.width / 2, f.y + barH + 7);
            ctx.lineTo(f.x + f.width / 2 + 5, f.y + barH + 3);
            ctx.fillStyle = f.color;
            ctx.fill();
        }

        // Inner border pattern (decorative alien lines)
        if (f.borderPattern) {
            ctx.font = '8px "VT323", monospace';
            ctx.fillStyle = `rgba(${hexToRgb(f.color)}, ${0.3 + pulse * 0.2})`;
            ctx.textAlign = 'center';
            ctx.fillText(f.borderPattern, f.x + f.width / 2, f.y + 10);
            ctx.fillText(f.borderPattern, f.x + f.width / 2, f.y + f.height - 5);
        }

        // Corner alien symbols (rotating through them based on phase)
        if (f.alienChars && f.alienChars.length > 0) {
            ctx.font = '10px "VT323", monospace';
            const cornerAlpha = 0.4 + fastPulse * 0.4;
            ctx.fillStyle = `rgba(${hexToRgb(f.pulseColor || f.color)}, ${cornerAlpha})`;

            // Four corners with different symbols
            ctx.textAlign = 'left';
            ctx.fillText(f.alienChars[0], f.x + 4, f.y + 22);
            ctx.textAlign = 'right';
            ctx.fillText(f.alienChars[1], f.x + f.width - 4, f.y + 22);
            ctx.textAlign = 'left';
            ctx.fillText(f.alienChars[2], f.x + 4, f.y + f.height - 12);
            ctx.textAlign = 'right';
            ctx.fillText(f.alienChars[3], f.x + f.width - 4, f.y + f.height - 12);
        }

        // Fragment border with glow effect
        ctx.strokeStyle = f.aligned
            ? '#0f0'
            : (isSelected ? '#fff' : f.color);
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.strokeRect(f.x, f.y, f.width, f.height);

        // Pulsing outer glow for unaligned fragments
        if (!f.aligned) {
            ctx.strokeStyle = `rgba(${hexToRgb(f.pulseColor || f.color)}, ${fastPulse * 0.3})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(f.x - 2, f.y - 2, f.width + 4, f.height + 4);
        }

        // Fragment main symbol (larger)
        ctx.fillStyle = f.aligned ? '#0f0' : f.color;
        ctx.font = `bold 24px "VT323", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(f.symbol, f.x + f.width / 2, f.y + f.height / 2 - 8);

        // Fragment glyph pattern below symbol
        ctx.font = '14px "VT323", monospace';
        ctx.fillStyle = `rgba(${hexToRgb(f.color)}, ${pulse * 0.7})`;
        ctx.fillText(f.glyph, f.x + f.width / 2, f.y + f.height / 2 + 18);

        // Restore rotation transform
        if (rotation !== 0) {
            ctx.restore();
        }

        // Fragment label below (drawn without rotation so it's readable)
        ctx.font = '10px "VT323", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'center';
        ctx.fillText(f.id.toUpperCase(), f.x + f.width / 2, f.y + f.height + 12);
    });
}

function drawParticles(ctx) {
    alignmentState.particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${p.alpha})`;
        ctx.fill();
    });
}

function drawScanline(ctx, width, height) {
    alignmentState.scanlineY += 1.5;
    if (alignmentState.scanlineY > height) {
        alignmentState.scanlineY = 0;
    }

    const gradient = ctx.createLinearGradient(0, alignmentState.scanlineY - 15, 0, alignmentState.scanlineY + 15);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
    gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.08)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, alignmentState.scanlineY - 15, width, 30);
}

function updateParticles() {
    alignmentState.particles = alignmentState.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        p.size *= 0.98;
        return p.alpha > 0;
    });
}

function addAlignmentParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 / 20) * i;
        alignmentState.particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * (2 + Math.random() * 2),
            vy: Math.sin(angle) * (2 + Math.random() * 2),
            size: 3 + Math.random() * 3,
            alpha: 1,
            color: color
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// UI Updates
// ─────────────────────────────────────────────────────────────────────────────

function updateUI() {
    const countEl = document.getElementById('aligned-count');
    const messageEl = document.getElementById('message-preview');

    if (countEl) {
        countEl.textContent = alignmentState.alignedCount;
    }

    if (messageEl) {
        const alignedFrags = alignmentState.fragments.filter(f => f.aligned);
        if (alignedFrags.length === 0) {
            messageEl.textContent = '[AWAITING ALIGNMENT...]';
            messageEl.style.color = '#666';
        } else {
            // Sort by target zone to get correct order
            alignedFrags.sort((a, b) => a.targetZone - b.targetZone);
            // Show encrypted code, not the actual message yet
            const encryptedCode = alignedFrags.map(f => f.encrypted).join(' | ');
            messageEl.textContent = encryptedCode;
            messageEl.style.color = '#ff0'; // Yellow for encrypted
        }
    }
}

function enableConfirmButton() {
    const btn = document.getElementById('alignment-confirm-btn');
    if (!btn) return;

    btn.disabled = false;
    btn.style.border = '2px solid #0f0';
    btn.style.color = '#0f0';
    btn.style.cursor = 'pointer';
    btn.style.textShadow = '0 0 10px #0f0';
    btn.style.animation = 'pulse-glow 0.5s infinite';
}

// ─────────────────────────────────────────────────────────────────────────────
// Audio
// ─────────────────────────────────────────────────────────────────────────────

function playFragmentPickup() {
    try {
        const vol = getSfxVolume();
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.08 * vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
}

function playAlignmentSuccess() {
    try {
        const vol = getSfxVolume();
        const ctx = new (window.AudioContext || window.webkitAudioContext)();

        [600, 800, 1000].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.1 * vol, ctx.currentTime + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.15);

            osc.start(ctx.currentTime + i * 0.05);
            osc.stop(ctx.currentTime + i * 0.05 + 0.15);
        });
    } catch (e) {}
}

function playAlignmentError() {
    try {
        const vol = getSfxVolume();
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 200;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.08 * vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────────────────────────

function confirmAlignment() {
    if (alignmentState.alignedCount < alignmentState.requiredAlignments) {
        return;
    }

    playClick();
    showAlignmentSuccess();
}

function showAlignmentSuccess() {
    cancelAnimationFrame(alignmentState.animationId);

    const overlay = document.getElementById('alignment-overlay');
    if (!overlay) return;

    // Flash effect - use an overlay div instead of changing background (keeps it opaque)
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 255, 255, 0.4);
        pointer-events: none;
        z-index: 99999;
        transition: opacity 0.2s ease-out;
    `;
    overlay.appendChild(flash);
    setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 200);
    }, 50);

    // Build full message and encrypted code
    const alignedFrags = alignmentState.fragments.filter(f => f.aligned);
    alignedFrags.sort((a, b) => a.targetZone - b.targetZone);
    const fullMessage = alignmentState.customRevealMessage || alignedFrags.map(f => f.message).join(' ');
    const encryptedCode = alignedFrags.map(f => f.encrypted).join(' | ');

    // Update label
    const labelEl = document.getElementById('message-label');
    if (labelEl) {
        labelEl.textContent = 'DECODING...';
        labelEl.style.color = '#ff0';
    }

    // Animate transformation from encrypted to decoded
    const messageEl = document.getElementById('message-preview');
    if (messageEl) {
        animateCodeTransformation(encryptedCode, fullMessage, messageEl, labelEl);
    }

    // Update buttons
    const confirmBtn = document.getElementById('alignment-confirm-btn');
    const cancelBtn = document.getElementById('alignment-cancel-btn');

    if (confirmBtn) confirmBtn.style.display = 'none';
    if (cancelBtn) {
        cancelBtn.textContent = 'CONTINUE';
        cancelBtn.style.border = '2px solid #0f0';
        cancelBtn.style.color = '#0f0';
        cancelBtn.onclick = () => completeAlignment(true);
    }

    log('ALIGNMENT COMPLETE - Message decoded!', 'highlight');
}

// Animate the transformation from encrypted code to decoded message
function animateCodeTransformation(encrypted, decoded, messageEl, labelEl) {
    const scrambleChars = '0123456789ABCDEF@#$%^&*!?><[]{}|';
    const duration = 2500; // Total animation time in ms
    const startTime = Date.now();

    // Pad strings to same length for smoother transition
    const maxLen = Math.max(encrypted.length, decoded.length);
    const paddedEncrypted = encrypted.padEnd(maxLen);
    const paddedDecoded = decoded.padEnd(maxLen);

    function updateScramble() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Calculate how many characters should be "revealed"
        const revealedCount = Math.floor(progress * paddedDecoded.length);

        let displayText = '';
        for (let i = 0; i < paddedDecoded.length; i++) {
            if (i < revealedCount) {
                // Character is revealed
                displayText += paddedDecoded[i];
            } else if (progress > 0.1 && Math.random() < 0.3) {
                // Scramble effect
                displayText += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            } else {
                // Original encrypted character
                displayText += paddedEncrypted[i] || scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }
        }

        messageEl.textContent = displayText.trim();

        // Color transition: yellow -> cyan -> green
        if (progress < 0.5) {
            const t = progress * 2;
            messageEl.style.color = `rgb(${255 - t * 255}, ${255}, ${t * 255})`;
            messageEl.style.textShadow = `0 0 10px rgba(${255 - t * 255}, 255, ${t * 255}, 0.8)`;
        } else {
            const t = (progress - 0.5) * 2;
            messageEl.style.color = `rgb(0, ${255 - t * 105}, ${255 - t * 255})`;
            messageEl.style.textShadow = `0 0 20px rgba(0, 255, 0, ${0.5 + t * 0.5})`;
        }

        if (progress < 1) {
            requestAnimationFrame(updateScramble);
        } else {
            // Final state
            messageEl.innerHTML = `
                <div style="color: #0f0; text-shadow: 0 0 20px #0f0; font-size: 28px;">
                    ${decoded}
                </div>
            `;
            if (labelEl) {
                labelEl.textContent = alignmentState.singleFragmentKey ? 'DECODED SIGNAL:' : 'DECODED MESSAGE:';
                labelEl.style.color = '#0f0';
            }
        }
    }

    requestAnimationFrame(updateScramble);
}

function cancelAlignment() {
    playClick();
    completeAlignment(false);
}

function completeAlignment(success) {
    alignmentState.active = false;

    if (alignmentState.animationId) {
        cancelAnimationFrame(alignmentState.animationId);
    }

    // Remove overlay
    const overlay = document.getElementById('alignment-overlay');
    if (overlay) overlay.remove();

    // Stop alien signal sounds and switch back to starmap music
    stopAlienSignalSound();
    switchToBackgroundMusic();

    // Handle completion
    if (success) {
        if (alignmentState.singleFragmentKey) {
            // Single-fragment mode — callback handles fragment collection
            log('FRAGMENT ALIGNED — Signal decoded!', 'highlight');
        } else if (alignmentState.isTutorial) {
            gameState.tutorialCompleted = true;
            log('Alignment training complete!', 'info');
        } else {
            gameState.finalPuzzleComplete = true;
            log('COSMIC MESSAGE DECODED', 'highlight');
        }
        autoSave();

        if (alignmentState.onSuccess) {
            alignmentState.onSuccess();
        }
    } else {
        if (alignmentState.onCancel) {
            alignmentState.onCancel();
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    }
    // Handle shorthand hex
    const shortResult = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (shortResult) {
        return `${parseInt(shortResult[1] + shortResult[1], 16)}, ${parseInt(shortResult[2] + shortResult[2], 16)}, ${parseInt(shortResult[3] + shortResult[3], 16)}`;
    }
    return '255, 255, 255';
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export function isAlignmentTutorialComplete() {
    return gameState.tutorialCompleted;
}

export function isFinalPuzzleComplete() {
    return gameState.finalPuzzleComplete;
}
