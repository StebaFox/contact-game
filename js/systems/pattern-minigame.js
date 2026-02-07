// ═════════════════════════════════════════════════════════════════════════════
// PATTERN RECOGNITION MINIGAME
// Signal Pattern Identification — cycle filters to isolate signal patterns
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { log, typeAnalysisText } from '../ui/rendering.js';
import { playClick, playLockAchieved, playStaticBurst, switchToAlienMusic, startAlienSignalSound, startNaturalPhenomenaSound } from './audio.js';
import { checkAndShowDayComplete } from './day-report.js';

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

// ═════════════════════════════════════════════════════════════════════════════
// INTERNAL STATE
// ═════════════════════════════════════════════════════════════════════════════

let patternState = {
    active: false,
    canvas: null,
    ctx: null,
    animationId: null,

    // Filter system
    filters: [],             // Array of filter objects
    currentFilter: 0,        // Index of active filter
    correctFilter: 0,        // Which filter reveals the pattern
    filterImages: [],        // Pre-rendered ImageData per filter

    // Pattern region (where the real signal is in the correct filter)
    patternRegions: [],

    // Mouse/touch drag
    isDragging: false,
    dragStartX: -1,
    dragCurrentX: -1,
    cursorX: -1,

    // Captures
    captures: [],

    // Visual effects
    scanlineY: 0,
    resultFlash: 0,

    // Star info
    star: null,
    signalType: 'natural',
    naturalType: 0,
    starSeed: 0,
    generation: 0
};

// ═════════════════════════════════════════════════════════════════════════════
// FILTER DEFINITIONS
// ═════════════════════════════════════════════════════════════════════════════

const FILTER_NAMES = [
    'BROADBAND',
    'LOW-PASS α',
    'MID-BAND β',
    'HIGH-PASS γ',
    'HARMONIC δ',
    'CROSS-CORR ε'
];

// Each fake filter renderer produces a different visual pattern
// These need to be convincing enough to look like real signals
function fakeFilterRenderer(y, h, off, seed, filterSeed) {
    const s = seed + filterSeed * 73;
    const variant = filterSeed % 6;

    switch (variant) {
        case 0: {
            // Drifting diagonal streaks - looks like a sweeping signal
            const phase = (y + off * 0.3) * 0.08 + s;
            const streak = Math.pow(Math.max(0, Math.sin(phase)), 3);
            return streak * 0.65;
        }
        case 1: {
            // Horizontal bands - looks like frequency-locked signals
            const bandCenter1 = h * (0.3 + Math.sin(s) * 0.1);
            const bandCenter2 = h * (0.6 + Math.cos(s) * 0.1);
            const bw = 5;
            let sig = 0;
            const d1 = Math.abs(y - bandCenter1);
            const d2 = Math.abs(y - bandCenter2);
            if (d1 < bw) sig += (1 - d1 / bw) * 0.7;
            if (d2 < bw) sig += (1 - d2 / bw) * 0.55;
            const mod = Math.sin(off * 0.05 + s) * 0.3 + 0.7;
            return Math.min(1, sig * mod);
        }
        case 2: {
            // Interference fringes - complex moire pattern
            const fringe1 = Math.sin(y * 0.12 + off * 0.05) * Math.sin(y * 0.07 - off * 0.03 + s);
            const fringe2 = Math.sin(y * 0.09 + off * 0.02 + s * 0.5) * 0.3;
            return Math.max(0, fringe1 + fringe2) * 0.6;
        }
        case 3: {
            // Spotty clusters with more blobs
            let sig = 0;
            for (let i = 0; i < 3; i++) {
                const cx = Math.sin(off * (0.03 + i * 0.01) + s + i * 2) * h * 0.3 + h * (0.3 + i * 0.2);
                const dist = Math.abs(y - cx);
                const radius = 7 + i * 3;
                if (dist < radius) sig += (1 - dist / radius) * 0.5;
            }
            return Math.min(1, sig);
        }
        case 4: {
            // Pulsating single band - looks like a natural signal
            const center = h * (0.45 + Math.sin(s * 0.3) * 0.15);
            const dist = Math.abs(y - center);
            const width = 6 + Math.sin(off * 0.03) * 2;
            if (dist < width) {
                const pulse = Math.sin(off * 0.08 + s) * 0.3 + 0.7;
                return (1 - dist / width) * 0.7 * pulse;
            }
            return 0;
        }
        case 5:
        default: {
            // Multi-band harmonic - looks like an alien signal
            let sig = 0;
            const spacing = h / 5;
            for (let i = 1; i <= 3; i++) {
                const center = spacing * (i + 0.5) + Math.sin(s + i) * 5;
                const dist = Math.abs(y - center);
                if (dist < 4) sig += (1 - dist / 4) * 0.6;
            }
            const mod = Math.sin(off * 0.06 + s * 2) * 0.35 + 0.65;
            return Math.min(1, sig * mod);
        }
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// START GAME
// ═════════════════════════════════════════════════════════════════════════════

export function startPatternRecognitionGame(star) {
    gameState.patternGameActive = true;
    gameState.patternGameCompleted = false;

    patternState.active = true;
    patternState.captures = [];
    patternState.resultFlash = 0;
    patternState.scanlineY = 0;
    patternState.isDragging = false;
    patternState.dragStartX = -1;
    patternState.cursorX = -1;
    patternState.generation = 0;
    patternState.star = star;
    patternState.starSeed = star.id + 1;
    patternState.currentFilter = 0;

    // Determine signal visual type
    if (star.hasIntelligence) {
        patternState.signalType = 'alien';
    } else if (star.isFalsePositive) {
        patternState.signalType = 'false_positive';
    } else {
        patternState.signalType = 'natural';
    }
    patternState.naturalType = star.id % 5;

    // Show UI
    document.getElementById('pattern-game').style.display = 'block';
    document.getElementById('analyze-btn').disabled = true;

    // Setup canvas
    patternState.canvas = document.getElementById('pattern-stream');
    patternState.ctx = patternState.canvas.getContext('2d');

    // Reset capture slots
    for (let i = 0; i < 3; i++) {
        const slot = document.getElementById(`capture-slot-${i}`);
        if (!slot) continue;
        slot.classList.remove('captured');
        const slotCanvas = slot.querySelector('canvas');
        if (slotCanvas) {
            const ctx = slotCanvas.getContext('2d');
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, slotCanvas.width, slotCanvas.height);
            ctx.strokeStyle = '#333';
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(2, 2, slotCanvas.width - 4, slotCanvas.height - 4);
            ctx.setLineDash([]);
            ctx.fillStyle = '#333';
            ctx.font = '11px "VT323", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('EMPTY', slotCanvas.width / 2, slotCanvas.height / 2 + 4);
        }
    }

    // Bind canvas and filter button events
    bindCanvasEvents();
    bindFilterButton();

    // Generate first frame
    generateFrame();

    // Start animation loop
    animate();

    document.getElementById('pattern-status').textContent = 'CYCLE FILTERS TO ISOLATE THE SIGNAL PATTERN';
    log('Signal pattern analysis initiated — cycle through filters to find the signal', 'info');
}

// ═════════════════════════════════════════════════════════════════════════════
// FILTER BUTTON
// ═════════════════════════════════════════════════════════════════════════════

function bindFilterButton() {
    const btn = document.getElementById('pattern-filter-btn');
    btn.onclick = () => {
        if (!patternState.active || patternState.captures.length >= 3) return;
        if (patternState.resultFlash !== 0) return;
        playClick();
        cycleFilter();
    };
}

function cycleFilter() {
    patternState.currentFilter = (patternState.currentFilter + 1) % patternState.filters.length;
    updateFilterLabel();
}

function updateFilterLabel() {
    const label = document.getElementById('pattern-filter-label');
    const filter = patternState.filters[patternState.currentFilter];
    label.textContent = filter.name;

    // Color hint: correct filter has no special color, all look the same
    label.style.color = '#0ff';
}

// ═════════════════════════════════════════════════════════════════════════════
// CANVAS EVENT HANDLERS
// ═════════════════════════════════════════════════════════════════════════════

function bindCanvasEvents() {
    const canvas = patternState.canvas;

    canvas.onmousedown = null;
    canvas.onmousemove = null;
    canvas.onmouseup = null;
    canvas.onmouseleave = null;
    canvas.ontouchstart = null;
    canvas.ontouchmove = null;
    canvas.ontouchend = null;
    canvas.onclick = null;

    canvas.onmousedown = (e) => {
        if (!patternState.active || patternState.captures.length >= 3) return;
        if (patternState.resultFlash !== 0) return;
        e.preventDefault();
        const coords = getCanvasCoords(e);
        patternState.isDragging = true;
        patternState.dragStartX = coords.x;
        patternState.dragCurrentX = coords.x;
    };

    canvas.onmousemove = (e) => {
        const coords = getCanvasCoords(e);
        patternState.cursorX = coords.x;
        if (patternState.isDragging) {
            patternState.dragCurrentX = coords.x;
        }
    };

    canvas.onmouseup = (e) => {
        if (!patternState.isDragging) return;
        const coords = getCanvasCoords(e);
        patternState.dragCurrentX = coords.x;
        patternState.isDragging = false;
        checkSelection();
    };

    canvas.onmouseleave = () => {
        patternState.cursorX = -1;
        if (patternState.isDragging) {
            patternState.isDragging = false;
            patternState.dragStartX = -1;
        }
    };

    // Touch support
    canvas.ontouchstart = (e) => {
        if (!patternState.active || patternState.captures.length >= 3) return;
        if (patternState.resultFlash !== 0) return;
        e.preventDefault();
        const touch = e.touches[0];
        const coords = getCanvasCoords(touch);
        patternState.isDragging = true;
        patternState.dragStartX = coords.x;
        patternState.dragCurrentX = coords.x;
    };

    canvas.ontouchmove = (e) => {
        if (!patternState.isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        const coords = getCanvasCoords(touch);
        patternState.dragCurrentX = coords.x;
    };

    canvas.ontouchend = () => {
        if (!patternState.isDragging) return;
        patternState.isDragging = false;
        checkSelection();
    };
}

function getCanvasCoords(e) {
    const rect = patternState.canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (patternState.canvas.width / rect.width),
        y: (e.clientY - rect.top) * (patternState.canvas.height / rect.height)
    };
}

// ═════════════════════════════════════════════════════════════════════════════
// FRAME GENERATION (multiple filter views per frame)
// ═════════════════════════════════════════════════════════════════════════════

function generateFrame() {
    const canvas = patternState.canvas;
    const ctx = patternState.ctx;
    const w = canvas.width;
    const h = canvas.height;

    patternState.generation++;

    // Progressive difficulty: more filters on later captures
    const capturesDone = patternState.captures.length;
    const numFilters = 3 + capturesDone; // 3, 4, 5

    // Choose which filter is the correct one (shows the real pattern)
    patternState.correctFilter = Math.floor(Math.random() * numFilters);

    // Build filter list
    patternState.filters = [];
    const shuffledNames = [...FILTER_NAMES].sort(() => Math.random() - 0.5);
    for (let i = 0; i < numFilters; i++) {
        patternState.filters.push({
            name: shuffledNames[i],
            isCorrect: i === patternState.correctFilter,
            filterSeed: patternState.generation * 31 + i * 17
        });
    }

    // Pattern region for the correct filter
    const patternWidth = 70 + Math.floor(Math.random() * 30);
    const margin = 40;
    const startX = margin + Math.floor(Math.random() * (w - patternWidth - margin * 2));
    patternState.patternRegions = [{ startX, endX: startX + patternWidth }];

    // Precompute smooth noise field (shared across all filters)
    const noiseGridW = Math.ceil(w / 8) + 1;
    const noiseGridH = Math.ceil(h / 8) + 1;
    const noiseGrid = new Float32Array(noiseGridW * noiseGridH);
    for (let i = 0; i < noiseGrid.length; i++) {
        noiseGrid[i] = Math.random();
    }

    // Pre-render each filter view as an ImageData
    patternState.filterImages = [];
    const genSeed = patternState.generation * 137;
    const fadeWidth = 12;

    for (let fi = 0; fi < numFilters; fi++) {
        const filter = patternState.filters[fi];

        // Clear canvas before rendering each filter to prevent old data bleeding through
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);

        for (let x = 0; x < w; x++) {
            // Calculate real pattern intensity (only for correct filter)
            let patternIntensity = 0;
            if (filter.isCorrect) {
                for (const region of patternState.patternRegions) {
                    if (x >= region.startX - fadeWidth && x <= region.endX + fadeWidth) {
                        let fade = 1;
                        if (x < region.startX) {
                            fade = (x - (region.startX - fadeWidth)) / fadeWidth;
                        } else if (x > region.endX) {
                            fade = ((region.endX + fadeWidth) - x) / fadeWidth;
                        }
                        patternIntensity = Math.max(patternIntensity, Math.max(0, fade) * 0.85);
                    }
                }
            }

            drawFilterColumn(ctx, x, h, patternIntensity, x + genSeed, noiseGrid, noiseGridW, filter, capturesDone);
        }

        patternState.filterImages[fi] = ctx.getImageData(0, 0, w, h);
    }

    // Start on a random non-correct filter so player has to search
    patternState.currentFilter = (patternState.correctFilter + 1 + Math.floor(Math.random() * (numFilters - 1))) % numFilters;
    updateFilterLabel();
}

// Draw a single column for a specific filter view
function drawFilterColumn(ctx, x, height, patternIntensity, columnOffset, noiseGrid, noiseGridW, filter, difficulty) {
    const seed = patternState.starSeed;
    const type = patternState.signalType;

    for (let y = 0; y < height; y++) {
        const rnd = Math.random();

        // Smooth noise lookup
        const gx = x / 8, gy = y / 8;
        const gx0 = Math.floor(gx), gy0 = Math.floor(gy);
        const fx = gx - gx0, fy = gy - gy0;
        const idx = gy0 * noiseGridW + gx0;
        const n00 = noiseGrid[idx] || 0;
        const n10 = noiseGrid[idx + 1] || 0;
        const n01 = noiseGrid[idx + noiseGridW] || 0;
        const n11 = noiseGrid[idx + noiseGridW + 1] || 0;
        const smoothNoise = (n00 * (1 - fx) + n10 * fx) * (1 - fy) + (n01 * (1 - fx) + n11 * fx) * fy;

        // Base noise layer - deliberately noisy so signals don't stand out easily
        const rnd2 = Math.random();
        const baseIntensity = smoothNoise * 0.45 + rnd * 0.25 + rnd2 * 0.1;
        let r = Math.floor(baseIntensity * 12);
        let g = Math.floor(baseIntensity * 55);
        let b = Math.floor(baseIntensity * 70);
        let a = 0.35 + baseIntensity * 0.4;

        // Multiple overlapping band structures at different scales
        const bandNoise1 = Math.sin(y * 0.08 + columnOffset * 0.003) * 0.5 + 0.5;
        const bandNoise2 = Math.sin(y * 0.15 + columnOffset * 0.005 + seed) * 0.5 + 0.5;
        const bandNoise3 = Math.sin(y * 0.04 + columnOffset * 0.002 - seed * 0.5) * 0.5 + 0.5;
        const bandNoise4 = Math.sin(y * 0.22 - columnOffset * 0.004 + seed * 1.3) * 0.5 + 0.5;
        const bandContrib = (bandNoise1 * bandNoise2) * 0.18 + (bandNoise3 * bandNoise4) * 0.12;
        g += Math.floor(bandContrib * 45);
        b += Math.floor(bandContrib * 55);
        a += bandContrib * 0.2;

        // Wandering bright patches (slow-moving blobs)
        const blobX = Math.sin(columnOffset * 0.006 + seed * 0.7) * 0.4 + 0.5;
        const blobY = Math.sin(y * 0.02 + columnOffset * 0.004) * 0.5 + 0.5;
        const blobDist = Math.abs(blobX - x / 500) + Math.abs(blobY - y / height);
        if (blobDist < 0.3) {
            const blobStr = (0.3 - blobDist) / 0.3 * 0.25;
            g += Math.floor(blobStr * 60);
            b += Math.floor(blobStr * 40);
            a += blobStr * 0.15;
        }

        // Hot pixel speckles (more frequent)
        if (rnd > 0.975) {
            const spk = rnd * 0.6;
            g = Math.max(g, Math.floor(spk * 120));
            b = Math.max(b, Math.floor(spk * 140));
            a = Math.max(a, spk + 0.2);
        }

        // Vertical streaks (random column brightness variation)
        const colBrightness = Math.sin(x * 0.13 + seed * 3) * 0.5 + 0.5;
        if (colBrightness > 0.7) {
            const streak = (colBrightness - 0.7) * 0.4;
            g += Math.floor(streak * 30);
            b += Math.floor(streak * 35);
            a += streak * 0.1;
        }

        if (filter.isCorrect) {
            // CORRECT FILTER: show real signal pattern in the pattern region
            if (patternIntensity > 0) {
                let sig = 0;
                if (type === 'alien') {
                    sig = alienColumn(y, height, columnOffset, seed);
                } else if (type === 'false_positive') {
                    sig = falsePositiveColumn(y, height, columnOffset, seed);
                } else {
                    sig = naturalColumn(y, height, columnOffset, seed, patternState.naturalType);
                }
                sig *= patternIntensity;

                if (type === 'alien') {
                    r = Math.max(r, Math.floor(sig * 60));
                    g = Math.max(g, Math.floor(sig * 200));
                    b = Math.max(b, Math.floor(sig * 255));
                } else if (type === 'false_positive') {
                    r = Math.max(r, Math.floor(sig * 230));
                    g = Math.max(g, Math.floor(sig * 170));
                    b = Math.max(b, Math.floor(sig * 25));
                } else {
                    r = Math.max(r, Math.floor(sig * 10));
                    g = Math.max(g, Math.floor(sig * 230));
                    b = Math.max(b, Math.floor(sig * 130));
                }
                a = Math.max(a, sig * 0.9 + 0.1);
            }
        } else {
            // WRONG FILTER: show fake structured patterns across the whole width
            // Make fakes strong enough to be convincing decoys
            const fakeSig = fakeFilterRenderer(y, height, columnOffset, seed, filter.filterSeed);
            if (fakeSig > 0) {
                g = Math.max(g, Math.floor(fakeSig * 180));
                b = Math.max(b, Math.floor(fakeSig * 150));
                a = Math.max(a, fakeSig * 0.75 + 0.15);
            }
        }

        ctx.fillStyle = `rgba(${Math.min(255, r)},${Math.min(255, g)},${Math.min(255, b)},${Math.min(1, a)})`;
        ctx.fillRect(x, y, 1, 1);
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// SELECTION CHECKING
// ═════════════════════════════════════════════════════════════════════════════

function checkSelection() {
    if (!patternState.active || patternState.captures.length >= 3) return;

    const startX = Math.min(patternState.dragStartX, patternState.dragCurrentX);
    const endX = Math.max(patternState.dragStartX, patternState.dragCurrentX);
    const selectionWidth = endX - startX;

    if (selectionWidth < 20) {
        patternState.dragStartX = -1;
        return;
    }

    playClick();

    // Must be on the correct filter AND overlapping the pattern region
    const onCorrectFilter = patternState.currentFilter === patternState.correctFilter;

    let bestOverlap = 0;
    let matchedRegion = null;

    if (onCorrectFilter) {
        for (const region of patternState.patternRegions) {
            const overlapStart = Math.max(startX, region.startX);
            const overlapEnd = Math.min(endX, region.endX);
            const overlap = Math.max(0, overlapEnd - overlapStart);
            const regionWidth = region.endX - region.startX;
            const overlapRatio = overlap / regionWidth;

            if (overlapRatio > bestOverlap) {
                bestOverlap = overlapRatio;
                matchedRegion = region;
            }
        }
    }

    if (onCorrectFilter && bestOverlap >= 0.35) {
        handleCapture(matchedRegion);
    } else if (!onCorrectFilter) {
        handleWrongFilter();
    } else {
        handleMiss();
    }

    patternState.dragStartX = -1;
}

function handleCapture(region) {
    patternState.captures.push({ region });
    patternState.resultFlash = 20;

    playCaptureSound();

    // Fill capture slot
    const idx = patternState.captures.length - 1;
    const slot = document.getElementById(`capture-slot-${idx}`);
    if (slot) {
        slot.classList.add('captured');
        const slotCanvas = slot.querySelector('canvas');
        const correctImage = patternState.filterImages[patternState.correctFilter];
        if (slotCanvas && correctImage) {
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = patternState.canvas.width;
            tmpCanvas.height = patternState.canvas.height;
            tmpCanvas.getContext('2d').putImageData(correctImage, 0, 0);

            const slotCtx = slotCanvas.getContext('2d');
            const padding = 20;
            const srcX = Math.max(0, region.startX - padding);
            const srcW = Math.min(tmpCanvas.width - srcX, (region.endX - region.startX) + padding * 2);
            slotCtx.drawImage(tmpCanvas, srcX, 0, srcW, tmpCanvas.height,
                0, 0, slotCanvas.width, slotCanvas.height);
        }
    }

    const remaining = 3 - patternState.captures.length;
    if (remaining > 0) {
        document.getElementById('pattern-status').innerHTML =
            `<span style="color:#0f0;">✓ PATTERN ISOLATED!</span>  ` +
            `<span style="color:#0ff;">${remaining} more needed</span>`;

        log(`Pattern isolated! (${patternState.captures.length}/3)`, 'highlight');

        setTimeout(() => {
            if (patternState.active && patternState.captures.length < 3) {
                generateFrame();
                document.getElementById('pattern-status').textContent =
                    'NEW SIGNAL FRAME — CYCLE FILTERS TO FIND THE PATTERN';
                setTimeout(() => {
                    if (patternState.active && patternState.captures.length < 3) {
                        document.getElementById('pattern-status').textContent =
                            'CYCLE FILTERS TO ISOLATE THE SIGNAL PATTERN';
                    }
                }, 1500);
            }
        }, 1200);
    } else {
        document.getElementById('pattern-status').innerHTML =
            '<span style="color:#0f0; text-shadow:0 0 10px #0f0;">✓ REPEATING PATTERN CONFIRMED</span>';
        log('>>> PATTERN RECOGNITION COMPLETE <<<', 'highlight');

        setTimeout(() => {
            patternState.active = false;
            if (patternState.animationId) cancelAnimationFrame(patternState.animationId);
            completePatternGame(patternState.star);
        }, 2000);
    }
}

function handleWrongFilter() {
    patternState.resultFlash = -12;
    playStaticBurst();

    document.getElementById('pattern-status').innerHTML =
        '<span style="color:#f80;">WRONG FILTER — NO PATTERN ON THIS BAND</span>';

    setTimeout(() => {
        if (patternState.active && patternState.captures.length < 3) {
            document.getElementById('pattern-status').textContent =
                'CYCLE FILTERS TO ISOLATE THE SIGNAL PATTERN';
        }
    }, 1500);
}

function handleMiss() {
    patternState.resultFlash = -12;
    playStaticBurst();

    document.getElementById('pattern-status').innerHTML =
        '<span style="color:#f80;">NO SIGNIFICANT PATTERN — TRY ANOTHER REGION</span>';

    setTimeout(() => {
        if (patternState.active && patternState.captures.length < 3) {
            document.getElementById('pattern-status').textContent =
                'CYCLE FILTERS TO ISOLATE THE SIGNAL PATTERN';
        }
    }, 1500);
}

// ═════════════════════════════════════════════════════════════════════════════
// ANIMATION LOOP
// ═════════════════════════════════════════════════════════════════════════════

function animate() {
    if (!patternState.active) return;
    if (!patternState.canvas || !patternState.canvas.offsetParent) {
        patternState.active = false;
        return;
    }

    const ctx = patternState.ctx;
    const w = patternState.canvas.width;
    const h = patternState.canvas.height;

    // Draw current filter's pre-rendered image
    const currentImage = patternState.filterImages[patternState.currentFilter];
    if (currentImage) {
        ctx.putImageData(currentImage, 0, 0);
    }

    // Noise shimmer
    for (let i = 0; i < 20; i++) {
        const rx = Math.floor(Math.random() * w);
        const ry = Math.floor(Math.random() * h);
        ctx.fillStyle = `rgba(0, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 60)}, 0.1)`;
        ctx.fillRect(rx, ry, 1, 1);
    }

    // Scanline
    patternState.scanlineY = (patternState.scanlineY + 0.4) % h;
    ctx.fillStyle = 'rgba(0, 255, 255, 0.02)';
    ctx.fillRect(0, Math.floor(patternState.scanlineY), w, 2);

    // Cursor guide
    if (patternState.cursorX >= 0 && !patternState.isDragging) {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.floor(patternState.cursorX), 0);
        ctx.lineTo(Math.floor(patternState.cursorX), h);
        ctx.stroke();
    }

    // Selection box
    if (patternState.isDragging && patternState.dragStartX >= 0) {
        const x1 = Math.min(patternState.dragStartX, patternState.dragCurrentX);
        const x2 = Math.max(patternState.dragStartX, patternState.dragCurrentX);
        const selW = x2 - x1;

        if (selW > 3) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
            ctx.fillRect(x1, 0, selW, h);

            ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.strokeRect(x1, 1, selW, h - 2);
            ctx.setLineDash([]);

            ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1, 0); ctx.lineTo(x1, h);
            ctx.moveTo(x2, 0); ctx.lineTo(x2, h);
            ctx.stroke();
        }
    }

    // Result flash
    if (patternState.resultFlash > 0) {
        ctx.fillStyle = `rgba(0, 255, 100, ${patternState.resultFlash * 0.02})`;
        ctx.fillRect(0, 0, w, h);
        patternState.resultFlash--;
    } else if (patternState.resultFlash < 0) {
        ctx.fillStyle = `rgba(255, 60, 0, ${Math.abs(patternState.resultFlash) * 0.02})`;
        ctx.fillRect(0, 0, w, h);
        patternState.resultFlash++;
    }

    // Frame + filter info overlay
    ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.font = '10px "VT323", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`FRAME ${patternState.generation}`, w - 5, 11);
    ctx.textAlign = 'left';
    ctx.fillText(`FILTER: ${patternState.filters[patternState.currentFilter]?.name || ''}`, 5, 11);

    patternState.animationId = requestAnimationFrame(animate);
}

// ═════════════════════════════════════════════════════════════════════════════
// SIGNAL COLUMN RENDERERS (for correct filter)
// ═════════════════════════════════════════════════════════════════════════════

function alienColumn(y, h, off, seed) {
    const b1 = h * (0.20 + (seed % 3) * 0.04);
    const b2 = h * (0.45 + (seed % 4) * 0.03);
    const b3 = h * (0.72 + (seed % 5) * 0.02);
    const bw = 4 + (seed % 2);
    const mod = Math.sin(off * 0.04 + seed) * 0.35 + 0.65;

    let sig = 0;
    if (Math.abs(y - b1) < bw) sig += (1 - Math.abs(y - b1) / bw) * mod;
    if (Math.abs(y - b2) < bw) sig += (1 - Math.abs(y - b2) / bw) * mod;
    if (Math.abs(y - b3) < bw) sig += (1 - Math.abs(y - b3) / bw) * mod;

    if (Math.sin(off * 0.09 + seed * 2) > 0.85) sig *= 1.5;
    return Math.min(1, sig);
}

function falsePositiveColumn(y, h, off, seed) {
    const numH = 4 + (seed % 3);
    const spacing = h / (numH + 1);
    const pulse = Math.sin(off * 0.07) * 0.35 + 0.65;

    let sig = 0;
    for (let i = 1; i <= numH; i++) {
        const center = spacing * i;
        const dist = Math.abs(y - center);
        if (dist < 2.5) sig += (1 - dist / 2.5) * pulse;
    }
    return Math.min(1, sig);
}

function naturalColumn(y, h, off, seed, subtype) {
    let sig = 0;

    switch (subtype) {
        case 0: {
            const center = h * (0.35 + (seed % 4) * 0.08);
            const isPulse = Math.sin(off * 0.15) > 0.2;
            if (Math.abs(y - center) < 5 && isPulse) {
                sig = (1 - Math.abs(y - center) / 5) * 0.9;
            }
            break;
        }
        case 1: {
            const center = h * 0.5;
            const width = h * 0.35;
            const dist = Math.abs(y - center);
            if (dist < width) sig = (1 - dist / width) * 0.7;
            break;
        }
        case 2: {
            const sweep = h * (0.3 + 0.4 * Math.sin(off * 0.025));
            if (Math.abs(y - sweep) < 6) {
                sig = (1 - Math.abs(y - sweep) / 6) * 0.8;
            }
            break;
        }
        case 3: {
            const center = h * 0.45;
            const w = h * 0.3;
            const dist = Math.abs(y - center);
            if (dist < w) sig = (1 - dist / w) * 0.45;
            break;
        }
        case 4:
        default: {
            const b1 = h * (0.3 + 0.06 * Math.sin(off * 0.012));
            const b2 = h * (0.65 + 0.05 * Math.sin(off * 0.009));
            if (Math.abs(y - b1) < 5) sig += (1 - Math.abs(y - b1) / 5) * 0.6;
            if (Math.abs(y - b2) < 4) sig += (1 - Math.abs(y - b2) / 4) * 0.5;
            break;
        }
    }

    return Math.min(1, sig);
}

// ═════════════════════════════════════════════════════════════════════════════
// AUDIO
// ═════════════════════════════════════════════════════════════════════════════

let patternAudioCtx = null;

function getPatternAudioCtx() {
    if (!patternAudioCtx || patternAudioCtx.state === 'closed') {
        patternAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (patternAudioCtx.state === 'suspended') patternAudioCtx.resume();
    return patternAudioCtx;
}

function playCaptureSound() {
    try {
        const ctx = getPatternAudioCtx();
        [880, 1320].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = 'triangle';
            const t = ctx.currentTime + i * 0.08;
            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
            osc.start(t);
            osc.stop(t + 0.15);
        });
    } catch (e) { /* audio not available */ }
}

// ═════════════════════════════════════════════════════════════════════════════
// COMPLETE PATTERN GAME
// ═════════════════════════════════════════════════════════════════════════════

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
            checkAndShowDayComplete();
        });
    }
}
