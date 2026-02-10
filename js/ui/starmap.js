// ═════════════════════════════════════════════════════════════════════════════
// STARMAP UI
// Star catalog, canvas rendering, and star selection
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { showView, log, clearCanvas, calculateScanBoxPosition } from './rendering.js';
import { playClick, playSelectStar, playStaticBurst, playScanAcknowledge, playZoomIn, playZoomOut, stopNaturalPhenomenaSound, stopAlienSignalSound, stopFragmentSignalSound, stopStaticHiss, stopTuningTone, switchToBackgroundMusic } from '../systems/audio.js';
import { STAR_NAMES, STAR_TYPES, DISCOVERY_DATES, STAR_COORDINATES, STAR_DISTANCES, WEAK_SIGNAL_START_INDEX } from '../narrative/stars.js';
import { ALIEN_CONTACTS } from '../narrative/alien-contacts.js';
import { checkForEndState } from '../core/end-game.js';
import { isStarLocked, getStarDayRequirement, DAY_CONFIG } from '../core/day-system.js';
import { checkAndShowDayComplete } from '../systems/day-report.js';

// External function references (set by main.js to avoid circular deps)
let setArrayTargetFn = null;
let renderStarmapArrayFn = null;
let updateStarmapArrayStatsFn = null;
let drawStarVisualizationFn = null;
let stopSignalAnimationFn = null;
let updateTelemetryFn = null;
let startDirectDecryptionFn = null;
let initiateSRC7024CrashScanFn = null;

export function setStarmapFunctions(fns) {
    setArrayTargetFn = fns.setArrayTarget;
    if (fns.stopSignalAnimation) stopSignalAnimationFn = fns.stopSignalAnimation;
    renderStarmapArrayFn = fns.renderStarmapArray;
    updateStarmapArrayStatsFn = fns.updateStarmapArrayStats;
    if (fns.drawStarVisualization) {
        drawStarVisualizationFn = fns.drawStarVisualization;
    }
    if (fns.updateTelemetry) updateTelemetryFn = fns.updateTelemetry;
    if (fns.startDirectDecryption) startDirectDecryptionFn = fns.startDirectDecryption;
    if (fns.initiateSRC7024CrashScan) initiateSRC7024CrashScanFn = fns.initiateSRC7024CrashScan;
}

// Helper to get the selected star object (regular or dynamic)
function getSelectedStar() {
    const id = gameState.selectedStarId;
    if (id === null || id === undefined) return null;
    if (typeof id === 'number' && gameState.stars[id]) return gameState.stars[id];
    if (gameState.dynamicStars) {
        return gameState.dynamicStars.find(s => s.id === id) || null;
    }
    return null;
}

// Deselect current star (click empty space on canvas)
function deselectStar() {
    if (gameState.selectedStarId === null) return;
    gameState.selectedStarId = null;
    gameState.showScanConfirm = false;
    gameState.currentSignal = null;
    document.querySelectorAll('.star-item').forEach(item => item.classList.remove('selected'));
    document.getElementById('star-details').innerHTML = '<div class="detail-label">SELECT A TARGET</div>';
    clearStarVisualization();
    const scanBtn = document.getElementById('scan-btn');
    if (scanBtn) { scanBtn.disabled = false; scanBtn.textContent = 'INITIATE SCAN'; }
    const starmapScanBtn = document.getElementById('starmap-array-scan-btn');
    if (starmapScanBtn) starmapScanBtn.style.display = 'none';
}

// Get pixel position for a star (handles dynamic stars with fractional coords)
function getStarPixelXY(star, canvasWidth, canvasHeight) {
    if (star.isDynamic) {
        return { x: star.x * canvasWidth, y: star.y * canvasHeight };
    }
    return { x: star.x, y: star.y };
}

// False positive star indices (Day 1: 4, 7, 9; Day 2: 14, 18; Day 3: 24, 27)
const falsePositiveIndices = [4, 7, 9, 14, 18, 24, 27];

// Weak signal configurations (power requirements)
const weakSignalConfig = {
    // Day 1 weak signals (2 stars - one is false positive)
    3: { requiredPower: 4 },    // LALANDE 21185 - easy weak signal
    7: { requiredPower: 5 },    // ROSS 248 - weak signal FALSE POSITIVE
    // Day 2 weak signal (1 star)
    13: { requiredPower: 6 },   // STRUVE 2398 - binary system, weak signal
    // Day 3 weak signals (7 stars: indices 21-27)
    21: { requiredPower: 5 },   // VAN MAANEN'S STAR - easy
    22: { requiredPower: 4 },   // WOLF 424 - easy
    23: { requiredPower: 8 },   // GLIESE 687 - medium
    24: { requiredPower: 6 },   // GLIESE 674 (false positive) - easy
    25: { requiredPower: 11 },  // GLIESE 832 - hard
    26: { requiredPower: 7 },   // 82 ERIDANI - medium
    27: { requiredPower: 9 },   // DELTA PAVONIS (false positive) - medium
    28: { requiredPower: 7 }    // VEGA - medium
};

// Pre-rendered nebula canvas (generated once, drawn each frame with parallax)
let nebulaCanvas = null;

// Generate background stars and nebula for parallax effect
export function generateBackgroundStars() {
    const canvas = document.getElementById('starmap-canvas');
    const width = canvas.width;
    const height = canvas.height;

    gameState.backgroundStars = [];

    for (let i = 0; i < 300; i++) {
        gameState.backgroundStars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            brightness: Math.floor(Math.random() * 80 + 175),
            alpha: Math.random() * 0.4 + 0.3,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            twinkleOffset: Math.random() * Math.PI * 2
        });
    }

    // Generate nebula on offscreen canvas (slightly oversized for parallax movement)
    const pad = 40;
    nebulaCanvas = document.createElement('canvas');
    nebulaCanvas.width = width + pad * 2;
    nebulaCanvas.height = height + pad * 2;
    const nCtx = nebulaCanvas.getContext('2d');

    // Galactic center bulge position (0-1 along the band, 0.4 = slightly left of center)
    const nw = nebulaCanvas.width, nh = nebulaCanvas.height;
    const bulgeT = 0.4;
    const bulgeFactor = (t) => {
        const dist = Math.abs(t - bulgeT);
        return 1 + 1.2 * Math.exp(-dist * dist * 35); // peaks at 2.2x at center, tighter falloff
    };

    // Milky way — glow spots along the diagonal band (slightly brighter near bulge)
    const bandAngle = Math.atan2(-0.75 * nh, nw);
    for (let i = 0; i < 16; i++) {
        const t = (i + 0.5) / 16;
        const cx = t * nw;
        const cy = nh * 0.85 - t * nh * 0.75;
        const bulge = bulgeFactor(t);
        const r = (55 + Math.random() * 20) * Math.min(bulge, 1.6);
        const a = 0.19 + 0.08 * (bulge - 1); // slightly brighter base
        const grad = nCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(48, 58, 115, ${Math.min(a, 0.35)})`);
        grad.addColorStop(0.5, `rgba(42, 52, 105, ${Math.min(a * 0.4, 0.18)})`);
        grad.addColorStop(1, 'rgba(30, 40, 80, 0)');
        nCtx.fillStyle = grad;
        nCtx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }

    // White nebula wisps — irregular curving tendrils built from chained blobs
    const bandDx = Math.cos(bandAngle);
    const bandDy = Math.sin(bandAngle);
    const perpDx = -bandDy; // perpendicular to band
    const perpDy = bandDx;
    for (let i = 0; i < 8; i++) {
        const startT = Math.random() * 0.75 + 0.1;
        const segments = 4 + Math.floor(Math.random() * 4); // 4-7 blobs per wisp
        const baseAlpha = 0.04 + Math.random() * 0.05;
        let cx = startT * nw;
        let cy = nh * 0.85 - startT * nh * 0.75 + (Math.random() - 0.5) * 20;
        // Each wisp wanders with its own drift
        let drift = (Math.random() - 0.5) * 0.8; // perpendicular wander tendency

        for (let s = 0; s < segments; s++) {
            const blobRx = 20 + Math.random() * 35;
            const blobRy = 5 + Math.random() * 8;
            // Rotate each blob slightly differently
            const angle = bandAngle + (Math.random() - 0.5) * 0.6 + drift * 0.3;
            const a = baseAlpha * (1 - s * 0.08); // fade along length

            nCtx.save();
            nCtx.translate(cx, cy);
            nCtx.rotate(angle);
            const grad = nCtx.createRadialGradient(0, 0, 0, 0, 0, blobRx);
            grad.addColorStop(0, `rgba(220, 225, 240, ${Math.min(a, 0.12)})`);
            grad.addColorStop(0.4, `rgba(210, 215, 235, ${Math.min(a * 0.5, 0.07)})`);
            grad.addColorStop(1, 'rgba(190, 200, 225, 0)');
            nCtx.scale(1, blobRy / blobRx);
            nCtx.fillStyle = grad;
            nCtx.fillRect(-blobRx, -blobRx, blobRx * 2, blobRx * 2);
            nCtx.restore();

            // Step along band direction + wander perpendicular
            drift += (Math.random() - 0.5) * 0.6;
            drift = Math.max(-1.2, Math.min(1.2, drift)); // clamp wander
            const step = 25 + Math.random() * 20;
            cx += bandDx * step + perpDx * drift * 8;
            cy += bandDy * step + perpDy * drift * 8;
        }
    }

    // Dense star clusters forming the milky way river (bulges at galactic center)
    for (let i = 0; i < 1200; i++) {
        const t = Math.random();
        const bandX = t * nw;
        const bandCenterY = nh * 0.85 - t * nh * 0.75;
        const bulge = bulgeFactor(t);
        // Gaussian spread, wider at the bulge
        const r1 = Math.random(), r2 = Math.random();
        const gaussian = Math.sqrt(-2 * Math.log(r1)) * Math.cos(2 * Math.PI * r2);
        const spread = 30 * bulge;
        const bandY = bandCenterY + gaussian * spread;
        const distFromCenter = Math.abs(bandY - bandCenterY) / (spread * 1.5);
        const alpha = Math.max(0, (1 - distFromCenter * 0.8)) * (Math.random() * 0.5 + 0.2);
        const size = Math.random() * 1.5 + 0.3;
        nCtx.fillStyle = `rgba(200, 210, 235, ${Math.min(alpha, 0.7)})`;
        nCtx.fillRect(bandX, bandY, size, size);
    }

    // Dark dust lanes — dark patches that cut across the band (drawn on top to obscure)
    nCtx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 6; i++) {
        const t = Math.random() * 0.7 + 0.15;
        const cx = t * nw;
        const cy = nh * 0.85 - t * nh * 0.75 + (Math.random() - 0.5) * 15;
        // Elongated dark patches along the band, slightly angled
        const rx = 40 + Math.random() * 60;
        const ry = 5 + Math.random() * 10;
        const angle = bandAngle + (Math.random() - 0.5) * 0.4;
        const a = 0.15 + Math.random() * 0.2;

        nCtx.save();
        nCtx.translate(cx, cy);
        nCtx.rotate(angle);
        const grad = nCtx.createRadialGradient(0, 0, 0, 0, 0, rx);
        grad.addColorStop(0, `rgba(0, 0, 0, ${a})`);
        grad.addColorStop(0.5, `rgba(0, 0, 0, ${a * 0.4})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        nCtx.scale(1, ry / rx);
        nCtx.fillStyle = grad;
        nCtx.fillRect(-rx, -rx, rx * 2, rx * 2);
        nCtx.restore();
    }
    nCtx.globalCompositeOperation = 'source-over';
}

// Get star color based on spectral type
function getSpectralColor(starType) {
    const spectralClass = starType.charAt(0).toUpperCase();
    switch(spectralClass) {
        case 'O': return { color: '#9bb0ff', size: 50 };
        case 'B': return { color: '#aabfff', size: 45 };
        case 'A': return { color: '#cad7ff', size: 42 };
        case 'F': return { color: '#f8f7ff', size: 40 };
        case 'G': return { color: '#fff4ea', size: 38 };
        case 'K': return { color: '#ffd2a1', size: 35 };
        case 'M': return { color: '#ffcc6f', size: 32 };
        case 'D': return { color: '#f0f0ff', size: 28 };
        default: return { color: '#ffffff', size: 36 };
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// SKY CHART — RA/Dec projection utilities
// ═════════════════════════════════════════════════════════════════════════════

const SKY_PAD = 30; // padding from canvas edges

// Pre-rendered sky chart background canvas
let skyChartBgCanvas = null;

// Cached label bounding boxes for click detection (populated during render)
let cachedSkyLabelBounds = []; // { starId, x1, y1, x2, y2 } in world coords
let cachedArrayLabelBounds = []; // { starId, x1, y1, x2, y2 } in screen coords

// Convert RA/Dec coordinate to canvas x,y (equirectangular projection)
function projectRADec(coord, canvasWidth, canvasHeight) {
    const raHours = coord.ra.h + coord.ra.m / 60 + (coord.ra.s || 0) / 3600;
    const decDeg = coord.dec.deg + (coord.dec.deg >= 0 ? 1 : -1) * (coord.dec.m / 60 + (coord.dec.s || 0) / 3600);
    const x = SKY_PAD + (raHours / 24) * (canvasWidth - SKY_PAD * 2);
    const y = SKY_PAD + ((90 - decDeg) / 180) * (canvasHeight - SKY_PAD * 2);
    return { x, y };
}

// Pre-compute sky chart positions for all catalog stars
function computeSkyChartPositions(canvasWidth, canvasHeight) {
    gameState.stars.forEach((star, index) => {
        const coord = STAR_COORDINATES[index];
        const pos = projectRADec(coord, canvasWidth, canvasHeight);
        star.skyX = pos.x;
        star.skyY = pos.y;
    });
}

// Sky chart positions for dynamic stars
const DYNAMIC_SKY_COORDS = {
    'src7024': { ra: { h: 11, m: 48, s: 0 }, dec: { deg: 1, m: 0, s: 0 } },      // Near Ross 128
    'nexusPoint': { ra: { h: 12, m: 0, s: 0 }, dec: { deg: 30, m: 0, s: 0 } },    // Arbitrary
    'genesis': { ra: { h: 3, m: 20, s: 0 }, dec: { deg: -43, m: 0, s: 0 } }        // Near 82 Eridani
};

function getDynamicStarSkyPos(dStar, canvasWidth, canvasHeight) {
    const coord = DYNAMIC_SKY_COORDS[dStar.id];
    if (coord) return projectRADec(coord, canvasWidth, canvasHeight);
    return { x: dStar.x * canvasWidth, y: dStar.y * canvasHeight };
}

// Draw RA/Dec axis labels (shared by both views)
function drawAxisLabels(ctx, width, height) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 255, 0, 0.25)';
    ctx.font = '10px VT323';
    ctx.textAlign = 'center';
    for (let h = 0; h <= 24; h += 3) {
        const x = SKY_PAD + (h / 24) * (width - SKY_PAD * 2);
        ctx.fillText(h + 'h', x, height - 5);
    }
    ctx.textAlign = 'right';
    for (let d = -60; d <= 60; d += 30) {
        const y = SKY_PAD + ((90 - d) / 180) * (height - SKY_PAD * 2);
        ctx.fillText((d >= 0 ? '+' : '') + d + '\u00B0', SKY_PAD - 5, y + 3);
    }
    ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Label collision avoidance
// Pre-computes label side (left/right) for all visible stars so names don't overlap
// ─────────────────────────────────────────────────────────────────────────────

function resolveLabels(stars, ctx, canvasWidth, canvasHeight, scale = 1) {
    // Returns Map<starId, { side: 'left'|'right', dy: number }> for label placement
    const pad = 5 / scale;
    const margin = 3 / scale; // extra gap between labels to prevent visual touching
    const fontSize = 12 / scale;
    ctx.font = `${fontSize}px VT323`;

    // Pre-populate obstacles with star dot positions so labels avoid other stars
    const placed = []; // { x1, y1, x2, y2 }
    stars.forEach(s => {
        const r = s.radius || 4 / scale;
        placed.push({ x1: s.x - r, y1: s.y - r, x2: s.x + r, y2: s.y + r });
    });

    // Build candidate data for each star
    const candidates = stars.map(s => {
        const w = ctx.measureText(s.name).width;
        const h = fontSize;
        const r = s.radius || 4 / scale;
        // Right-side bounding box (textAlign left)
        const rx1 = s.x + r + pad;
        const ry1 = s.y + 3 / scale - h;
        // Left-side bounding box (textAlign right)
        const lx1 = s.x - r - pad - w;
        const ly1 = ry1;
        // Fits within canvas?
        const rightFits = rx1 + w <= canvasWidth - pad;
        const leftFits = lx1 >= pad;
        return { id: s.id, w, h, rx1, ry1, lx1, ly1, rightFits, leftFits, priority: s.priority || 0 };
    });

    // Sort by priority (current day first) then left-to-right so important stars place first
    candidates.sort((a, b) => b.priority - a.priority || a.rx1 - b.rx1);

    const result = new Map();

    function overlaps(x1, y1, w, h) {
        const x2 = x1 + w;
        const y2 = y1 + h;
        for (const box of placed) {
            if (x1 - margin < box.x2 && x2 + margin > box.x1 &&
                y1 - margin < box.y2 && y2 + margin > box.y1) return true;
        }
        return false;
    }

    for (const c of candidates) {
        const rightOverlap = !c.rightFits || overlaps(c.rx1, c.ry1, c.w, c.h);
        const leftOverlap = !c.leftFits || overlaps(c.lx1, c.ly1, c.w, c.h);

        let side, dy = 0;
        if (!rightOverlap) {
            side = 'left'; // textAlign left = label goes to right of star
            placed.push({ x1: c.rx1, y1: c.ry1, x2: c.rx1 + c.w, y2: c.ry1 + c.h });
        } else if (!leftOverlap) {
            side = 'right'; // textAlign right = label goes to left of star
            placed.push({ x1: c.lx1, y1: c.ly1, x2: c.lx1 + c.w, y2: c.ly1 + c.h });
        } else {
            // Both sides overlap — try vertical offsets (below then above)
            const shifts = [c.h + margin * 2, -(c.h + margin * 2)];
            let found = false;
            for (const shift of shifts) {
                if (c.rightFits && !overlaps(c.rx1, c.ry1 + shift, c.w, c.h)) {
                    side = 'left'; dy = shift;
                    placed.push({ x1: c.rx1, y1: c.ry1 + shift, x2: c.rx1 + c.w, y2: c.ry1 + shift + c.h });
                    found = true; break;
                }
                if (c.leftFits && !overlaps(c.lx1, c.ly1 + shift, c.w, c.h)) {
                    side = 'right'; dy = shift;
                    placed.push({ x1: c.lx1, y1: c.ly1 + shift, x2: c.lx1 + c.w, y2: c.ly1 + shift + c.h });
                    found = true; break;
                }
            }
            if (!found) {
                // Last resort — place to right, accept overlap
                side = c.rightFits ? 'left' : 'right';
                const bx = side === 'left' ? c.rx1 : c.lx1;
                placed.push({ x1: bx, y1: c.ry1, x2: bx + c.w, y2: c.ry1 + c.h });
            }
        }
        result.set(c.id, { side, dy });
    }

    return result;
}

// Generate sky chart background with real galactic plane
export function generateSkyChartBackground() {
    const canvas = document.getElementById('starmap-canvas');
    const W = canvas.width, H = canvas.height;

    skyChartBgCanvas = document.createElement('canvas');
    skyChartBgCanvas.width = W;
    skyChartBgCanvas.height = H;
    const ctx = skyChartBgCanvas.getContext('2d');

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    // Galactic plane formula (J2000)
    const DEG = Math.PI / 180;
    const DEC_NGP = 27.128 * DEG;
    const RA_NGP = 192.859 * DEG;
    const L_NCP = 122.932 * DEG;

    const galacticPoints = [];
    for (let l = 0; l < 360; l += 2) {
        const lRad = l * DEG;
        const sinDec = Math.cos(DEC_NGP) * Math.cos(lRad - L_NCP);
        const dec = Math.asin(sinDec);
        const ra = RA_NGP + Math.atan2(Math.sin(lRad - L_NCP), -Math.sin(DEC_NGP) * Math.cos(lRad - L_NCP));
        const raH = ((ra / DEG / 15) % 24 + 24) % 24;
        galacticPoints.push({ ra: raH, dec: dec / DEG, l: l });
    }

    // Glow blobs along galactic plane (subtler)
    galacticPoints.forEach(p => {
        const px = SKY_PAD + (p.ra / 24) * (W - SKY_PAD * 2);
        const py = SKY_PAD + ((90 - p.dec) / 180) * (H - SKY_PAD * 2);
        const distFromCenter = Math.min(p.l, 360 - p.l) / 180;
        const bulge = 1 + 1.2 * Math.exp(-distFromCenter * distFromCenter * 8);
        const brightness = 0.09 * bulge;
        const r = (24 + 14 * (1 - distFromCenter)) * bulge;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
        grad.addColorStop(0, `rgba(40, 50, 100, ${Math.min(brightness, 0.25)})`);
        grad.addColorStop(0.6, `rgba(35, 45, 85, ${Math.min(brightness * 0.3, 0.08)})`);
        grad.addColorStop(1, 'rgba(30, 40, 70, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(px - r, py - r, r * 2, r * 2);
    });

    // Pre-compute canvas positions and local tangent/perpendicular for each galactic point
    const galacticCanvas = galacticPoints.map(p => ({
        x: SKY_PAD + (p.ra / 24) * (W - SKY_PAD * 2),
        y: SKY_PAD + ((90 - p.dec) / 180) * (H - SKY_PAD * 2)
    }));
    const galacticTangents = galacticPoints.map((p, idx) => {
        const prev = galacticCanvas[(idx - 1 + galacticCanvas.length) % galacticCanvas.length];
        const next = galacticCanvas[(idx + 1) % galacticCanvas.length];
        const dx = next.x - prev.x, dy = next.y - prev.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        return { tanX: dx / len, tanY: dy / len, perpX: -dy / len, perpY: dx / len };
    });

    // Dense stars along galactic plane — jitter along tangent + spread perpendicular
    for (let i = 0; i < 1200; i++) {
        const idx = Math.floor(Math.random() * galacticPoints.length);
        const p = galacticPoints[idx];
        const tang = galacticTangents[idx];
        const base = galacticCanvas[idx];
        const distFromCenter = Math.min(p.l, 360 - p.l) / 180;
        const spread = 30 + 20 * (1 - distFromCenter);
        // Perpendicular gaussian spread
        const r1 = Math.random(), r2 = Math.random();
        const gaussPerp = Math.sqrt(-2 * Math.log(r1)) * Math.cos(2 * Math.PI * r2);
        const perpOff = gaussPerp * spread * 0.5;
        // Along-band jitter to prevent stripes
        const tanOff = (Math.random() - 0.5) * 20;
        const px = base.x + tang.perpX * perpOff + tang.tanX * tanOff;
        const py = base.y + tang.perpY * perpOff + tang.tanY * tanOff;
        const a = Math.random() * 0.5 + 0.15;
        ctx.fillStyle = `rgba(200, 210, 240, ${a})`;
        ctx.fillRect(px, py, Math.random() * 1.5 + 0.4, Math.random() * 1.5 + 0.4);
    }

    // Sparse background stars (brighter)
    for (let i = 0; i < 500; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        ctx.fillStyle = `rgba(215, 215, 235, ${Math.random() * 0.5 + 0.15})`;
        ctx.fillRect(x, y, Math.random() * 1.4 + 0.4, Math.random() * 1.4 + 0.4);
    }

    // Dark dust lanes — multi-segment chains that wander along the band
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 5; i++) {
        let idx = Math.floor(Math.random() * galacticPoints.length);
        const segments = 3 + Math.floor(Math.random() * 4); // 3-6 blobs per lane
        const baseAlpha = 0.08 + Math.random() * 0.12;
        let drift = 0; // perpendicular wander

        for (let s = 0; s < segments; s++) {
            // Wrap index within bounds
            const ci = ((idx + s * 3) % galacticPoints.length + galacticPoints.length) % galacticPoints.length;
            const tang = galacticTangents[ci];
            const base = galacticCanvas[ci];
            const localAngle = Math.atan2(tang.tanY, tang.tanX);

            // Vary thickness per segment for irregularity
            const rx = 25 + Math.random() * 45;
            const ry = 3 + Math.random() * 10;
            const angle = localAngle + (Math.random() - 0.5) * 0.5;
            const a = baseAlpha * (1 - s * 0.1);

            // Wander perpendicular to band
            drift += (Math.random() - 0.5) * 12;
            drift = Math.max(-18, Math.min(18, drift));
            const cx = base.x + tang.perpX * drift;
            const cy = base.y + tang.perpY * drift;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
            grad.addColorStop(0, `rgba(0, 0, 0, ${a})`);
            grad.addColorStop(0.5, `rgba(0, 0, 0, ${a * 0.35})`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.scale(1, ry / rx);
            ctx.fillStyle = grad;
            ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
            ctx.restore();
        }
    }
    // Extra dust lanes clustered around the galactic bulge (l near 0/360)
    const bulgeIndices = [];
    galacticPoints.forEach((p, idx) => {
        const distL = Math.min(p.l, 360 - p.l);
        if (distL < 40) bulgeIndices.push(idx);
    });
    for (let i = 0; i < 4; i++) {
        const startIdx = bulgeIndices[Math.floor(Math.random() * bulgeIndices.length)];
        const segments = 2 + Math.floor(Math.random() * 3);
        const baseAlpha = 0.06 + Math.random() * 0.1;
        let drift = 0;

        for (let s = 0; s < segments; s++) {
            const ci = ((startIdx + s * 2) % galacticPoints.length + galacticPoints.length) % galacticPoints.length;
            const tang = galacticTangents[ci];
            const base = galacticCanvas[ci];
            const localAngle = Math.atan2(tang.tanY, tang.tanX);
            const rx = 20 + Math.random() * 35;
            const ry = 3 + Math.random() * 8;
            const angle = localAngle + (Math.random() - 0.5) * 0.6;
            const a = baseAlpha * (1 - s * 0.12);
            drift += (Math.random() - 0.5) * 14;
            drift = Math.max(-22, Math.min(22, drift));
            const cx = base.x + tang.perpX * drift;
            const cy = base.y + tang.perpY * drift;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
            grad.addColorStop(0, `rgba(0, 0, 0, ${a})`);
            grad.addColorStop(0.5, `rgba(0, 0, 0, ${a * 0.35})`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.scale(1, ry / rx);
            ctx.fillStyle = grad;
            ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
            ctx.restore();
        }
    }
    ctx.globalCompositeOperation = 'source-over';

    // Bright nebula wisps — white/pale elongated clouds along the band
    for (let i = 0; i < 6; i++) {
        const idx = Math.floor(Math.random() * galacticPoints.length);
        const tang = galacticTangents[idx];
        const base = galacticCanvas[idx];
        const localAngle = Math.atan2(tang.tanY, tang.tanX);
        const rx = 40 + Math.random() * 60;
        const ry = 5 + Math.random() * 8;
        const angle = localAngle + (Math.random() - 0.5) * 0.4;
        // Offset slightly from center of band
        const perpOff = (Math.random() - 0.5) * 20;
        const cx = base.x + tang.perpX * perpOff;
        const cy = base.y + tang.perpY * perpOff;
        const a = 0.03 + Math.random() * 0.04;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        grad.addColorStop(0, `rgba(220, 225, 240, ${a})`);
        grad.addColorStop(0.4, `rgba(210, 215, 235, ${a * 0.5})`);
        grad.addColorStop(1, 'rgba(200, 210, 230, 0)');
        ctx.scale(1, ry / rx);
        ctx.fillStyle = grad;
        ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
        ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';
}

// Clamp sky chart pan within bounds
function clampPan(w, h) {
    const sc = gameState.skyChart;
    sc.panX = Math.max(w - w * sc.scale, Math.min(0, sc.panX));
    sc.panY = Math.max(h - h * sc.scale, Math.min(0, sc.panY));
}

// Generate star catalog
export function generateStarCatalog() {
    const starGrid = document.getElementById('star-grid');
    starGrid.innerHTML = '';

    // First, create all star objects with real astronomical data
    STAR_NAMES.forEach((name, index) => {
        // Use real coordinates from stars.js
        const coords = STAR_COORDINATES[index];
        const ra = `${coords.ra.h}h ${String(coords.ra.m).padStart(2, '0')}m`;
        const decSign = coords.dec.deg >= 0 ? '+' : '';
        const dec = `${decSign}${coords.dec.deg}° ${Math.abs(coords.dec.m)}'`;

        const starInfo = STAR_TYPES[index];
        const isWeakSignal = weakSignalConfig.hasOwnProperty(index);

        // Generate position with minimum spacing to avoid label overlap
        let px, py, tooClose;
        const minDist = 50; // Minimum pixel distance between stars
        let attempts = 0;
        do {
            px = Math.random() * 900 + 50; // 50-950 (extra margin for labels)
            py = Math.random() * 470 + 40; // 40-510
            tooClose = false;
            for (const existing of gameState.stars) {
                const dx = existing.x - px;
                const dy = existing.y - py;
                if (Math.sqrt(dx * dx + dy * dy) < minDist) {
                    tooClose = true;
                    break;
                }
            }
            attempts++;
        } while (tooClose && attempts < 80);

        const star = {
            id: index,
            name: name,
            distance: STAR_DISTANCES[index],  // Real distance in light years
            coordinates: `${ra} ${dec}`,
            starType: starInfo.type,
            starClass: starInfo.class,
            temperature: starInfo.temp,
            discovered: DISCOVERY_DATES[index],
            hasIntelligence: ALIEN_CONTACTS.some(m => m.starIndex === index),
            isFalsePositive: falsePositiveIndices.includes(index),
            signalStrength: isWeakSignal ? 'weak' : 'normal',
            requiredPower: isWeakSignal ? weakSignalConfig[index].requiredPower : 0,
            x: px,
            y: py
        };

        gameState.stars.push(star);
    });

    // Pre-compute sky chart positions from real RA/Dec
    const canvas = document.getElementById('starmap-canvas');
    computeSkyChartPositions(canvas.width, canvas.height);

    // Create shuffled display order
    const displayOrder = [...Array(STAR_NAMES.length).keys()];
    for (let i = displayOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [displayOrder[i], displayOrder[j]] = [displayOrder[j], displayOrder[i]];
    }

    // Create DOM elements in shuffled order
    displayOrder.forEach(index => {
        const star = gameState.stars[index];

        const starElement = document.createElement('div');
        starElement.className = 'star-item';
        starElement.dataset.starId = index;

        starElement.innerHTML = `
            <div class="star-name">${star.name}</div>
            <div class="star-coords">${star.coordinates}</div>
            <div class="star-coords">${star.distance} ly</div>
            <div class="star-status" data-status=""></div>
        `;

        starElement.addEventListener('click', () => selectStar(index));
        starGrid.appendChild(starElement);
    });

    log(`Stellar catalog loaded: ${STAR_NAMES.length} targets available`);

    // Update display for locked stars
    updateStarCatalogDisplay();
}

// Update star catalog display based on current day/locked status
export function updateStarCatalogDisplay() {
    const starItems = document.querySelectorAll('.star-item');

    starItems.forEach(item => {
        const starId = parseInt(item.dataset.starId);
        const starDay = getStarDayRequirement(starId);
        const isCurrentDay = starDay === gameState.currentDay;
        const isPreviousDay = starDay < gameState.currentDay;
        const isFutureDay = starDay > gameState.currentDay;
        const isAnalyzed = gameState.analyzedStars.has(starId);

        // In demo mode, show all stars
        if (gameState.demoMode || gameState.currentDay === 0) {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
            return;
        }

        // Check if this is Ross 128 needing decryption on Day 2
        const ross128NeedsDecrypt = starId === 8 && !gameState.decryptionComplete &&
            gameState.scanResults.get(starId)?.type === 'encrypted_signal' &&
            gameState.currentDay >= 2;

        if (isFutureDay) {
            // Hide future day stars completely
            item.style.display = 'none';
        } else if (isPreviousDay && ross128NeedsDecrypt) {
            // Special: Ross 128 on Day 2 - highlighted prominently for rescan/decryption
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
            item.style.border = '1px solid #ff0';
            item.style.boxShadow = '0 0 12px rgba(255, 255, 0, 0.3), inset 0 0 8px rgba(255, 255, 0, 0.05)';
            item.style.background = 'rgba(255, 255, 0, 0.05)';

            // Pin to top of catalog
            item.style.order = '-1';

            // Remove old indicators
            const oldIndicator = item.querySelector('.analyzed-indicator');
            if (oldIndicator) oldIndicator.remove();

            // Add decrypt indicator
            if (!item.querySelector('.decrypt-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'decrypt-indicator';
                indicator.style.cssText = 'color: #ff0; font-size: 10px; margin-top: 4px; animation: warningPulse 1.5s ease-in-out infinite;';
                indicator.textContent = '⚠ ENCRYPTED SIGNAL - RESCAN TO DECRYPT';
                item.appendChild(indicator);
            }

            const statusEl = item.querySelector('.star-status');
            if (statusEl) {
                statusEl.dataset.status = 'encrypted';
                statusEl.textContent = '⚠ DECRYPT';
                statusEl.style.color = '#ff0';
            }
        } else if (isPreviousDay) {
            // Show previous day stars (dimmed, already analyzed)
            item.style.display = 'block';
            item.style.opacity = '0.5';
            item.style.pointerEvents = 'auto';
            item.style.border = '';
            item.style.boxShadow = '';
            item.style.background = '';
            item.style.order = '';

            // Remove decrypt indicator if present
            const decryptIndicator = item.querySelector('.decrypt-indicator');
            if (decryptIndicator) decryptIndicator.remove();

            // Restore CSS classes for previous-day stars
            const isContacted = gameState.contactedStars.has(starId);
            if (isContacted) {
                item.classList.add('contact');
                item.classList.remove('analyzed');
            } else {
                item.classList.add('analyzed');
                item.classList.remove('contact');
            }

            // Add "ANALYZED" indicator if not present
            if (!item.querySelector('.analyzed-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'analyzed-indicator';
                indicator.style.cssText = 'color: #ff0; font-size: 10px; margin-top: 4px;';
                indicator.textContent = '[ANALYZED - DAY ' + starDay + ']';
                item.appendChild(indicator);
            }

            // Update status
            const statusEl = item.querySelector('.star-status');
            if (statusEl && !statusEl.dataset.status) {
                statusEl.dataset.status = 'analyzed';
                if (isContacted) {
                    statusEl.textContent = '★';
                } else {
                    statusEl.textContent = '● COMPLETE';
                    statusEl.style.color = '#ff0';
                }
            }
        } else {
            // Current day stars - show normally
            item.style.display = 'block';
            item.style.opacity = isAnalyzed ? '0.7' : '1';
            item.style.pointerEvents = 'auto';

            // Remove any old indicators
            const oldIndicator = item.querySelector('.analyzed-indicator');
            if (oldIndicator) oldIndicator.remove();

            // Restore CSS classes for analyzed/contacted stars
            const isContacted = gameState.contactedStars.has(starId);
            if (isContacted) {
                item.classList.add('contact');
                item.classList.remove('analyzed');
            } else if (isAnalyzed) {
                item.classList.add('analyzed');
                item.classList.remove('contact');
            }

            // Update status based on analyzed state
            const statusEl = item.querySelector('.star-status');
            if (statusEl && isAnalyzed && !statusEl.dataset.status) {
                statusEl.dataset.status = 'analyzed';
                if (isContacted) {
                    statusEl.textContent = '★';
                } else {
                    statusEl.textContent = '✓';
                }
            }
        }
    });

    // First-star recommendation (Day 1, no scans yet)
    if (gameState.currentDay === 1 && gameState.analyzedStars.size === 0 &&
        !gameState.demoMode) {
        const firstStar = document.querySelector('.star-item[data-star-id="0"]');
        if (firstStar && !firstStar.querySelector('.recommend-label')) {
            const label = document.createElement('div');
            label.className = 'recommend-label';
            label.textContent = '\u25C6 RECOMMENDED FIRST TARGET';
            label.style.cssText = 'color: #0ff; font-size: 10px; margin-top: 2px;';
            firstStar.appendChild(label);
        }
        if (firstStar) firstStar.classList.add('star-recommended');
    } else {
        // Remove recommendation after first scan
        starItems.forEach(item => {
            const label = item.querySelector('.recommend-label');
            if (label) label.remove();
            item.classList.remove('star-recommended');
        });
    }

    // Update dynamic instruction text
    updateStarmapInstruction();
}

// Update starmap instruction text based on Day 1 progress
export function updateStarmapInstruction() {
    const instruction = document.querySelector('#starmap-view .instruction');
    if (!instruction) return;

    if (gameState.demoMode || gameState.currentDay === 0 || gameState.currentDay > 1) {
        instruction.textContent = 'SELECT TARGET FOR SIGNAL ANALYSIS';
        return;
    }

    const day1Stars = DAY_CONFIG[1].availableStars;
    const scanCount = [...gameState.analyzedStars].filter(id => day1Stars.includes(id)).length;
    const required = DAY_CONFIG[1].starsRequired;
    const ross128Scanned = gameState.analyzedStars.has(8);

    if (scanCount === 0) {
        instruction.textContent = 'SELECT YOUR FIRST TARGET \u2014 10 STARS ASSIGNED, 7 MINIMUM REQUIRED';
    } else if (scanCount < 4) {
        instruction.textContent = `CONTINUE SURVEY \u2014 ${scanCount} OF ${required} TARGETS ANALYZED`;
    } else if (!ross128Scanned && scanCount < required) {
        instruction.textContent = 'ROSS 128 REGION FLAGGED FOR ATTENTION \u2014 CHECK MAILBOX';
    } else if (scanCount < required) {
        instruction.textContent = `CONTINUE SURVEY \u2014 ${scanCount} OF ${required} TARGETS ANALYZED`;
    } else {
        instruction.textContent = 'DAY OBJECTIVES MET \u2014 FILE YOUR REPORT';
    }
}

// Draw star visualization
export function drawStarVisualization(star, canvasId = 'star-visual') {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Draw background starscape with even distribution
    const starCount = 50;
    for (let i = 0; i < starCount; i++) {
        // Use a proper hash function to avoid patterns
        let hash = (star.id * 73856093) ^ (i * 19349663);
        hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
        hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
        hash = (hash >> 16) ^ hash;

        const x = (Math.abs(hash) % width);

        hash = ((star.id + 1) * 83492791) ^ ((i + 1) * 23456789);
        hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
        hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
        hash = (hash >> 16) ^ hash;

        const y = (Math.abs(hash) % height);
        const size = ((Math.abs(hash) % 100) / 100) * 1.2 + 0.3;
        const alpha = ((Math.abs(hash) % 50) + 20) / 100;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    const { color: glowColor, size: glowSize } = getSpectralColor(star.starType);

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw colored glow layers
    for (let i = 8; i > 0; i--) {
        const radius = (glowSize / 8) * i;
        const opacity = Math.pow(1 - (i / 8), 1.5);

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, glowColor + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, glowColor + Math.floor(opacity * 0.6 * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, glowColor + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Add bright white core
    const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowSize * 0.15);
    coreGradient.addColorStop(0, '#ffffff');
    coreGradient.addColorStop(0.5, '#ffffffaa');
    coreGradient.addColorStop(1, '#ffffff00');

    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, glowSize * 0.15, 0, Math.PI * 2);
    ctx.fill();
}

// Clear star visualization
export function clearStarVisualization() {
    const canvas = document.getElementById('star-visual');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Star selection
export function selectStar(starId) {
    // Check if star is locked
    if (isStarLocked(starId)) {
        const requiredDay = getStarDayRequirement(starId);
        log(`Target locked - requires Day ${requiredDay} clearance`, 'error');
        playClick();
        return;
    }

    const star = gameState.stars[starId];
    gameState.currentStar = star;
    gameState.selectedStarId = starId;

    // Highlight selected star in catalog
    document.querySelectorAll('.star-item').forEach(item => item.classList.remove('selected'));
    const selectedItem = document.querySelector(`.star-item[data-star-id="${starId}"]`);
    if (selectedItem) selectedItem.classList.add('selected');

    // Play selection sounds
    playSelectStar();
    playStaticBurst();

    // Check scan status
    const isScanned = gameState.scannedSignals.has(starId);
    const isAnalyzed = gameState.analyzedStars.has(starId);
    const hasContact = gameState.contactedStars.has(starId);
    const scanResult = gameState.scanResults.get(starId);

    // Special case: Ross 128 (index 8) needs decryption on Day 2+
    const needsDecryption = star.id === 8 && !gameState.decryptionComplete && gameState.currentDay >= 2;

    // Determine if this star is "complete" (can't be scanned again)
    const isComplete = needsDecryption || hasContact || (scanResult && (scanResult.type === 'false_positive' || scanResult.type === 'natural' || scanResult.type === 'verified_signal' || scanResult.type === 'encrypted_signal'));

    // Only show scan confirmation if not complete
    gameState.showScanConfirm = !isComplete;

    // Build status indicator with scan result details
    let statusBadge = '';
    if (needsDecryption) {
        statusBadge = `<div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #ff0; animation: warningPulse 1.5s ease-in-out infinite;">
            <div style="color: #ff0; text-shadow: 0 0 5px #ff0; font-size: 14px;">⚠ ENCRYPTED SIGNAL</div>
            <div style="color: #0ff; font-size: 12px; margin-top: 8px;">EXTRASOLAR ORIGIN - ENCODED</div>
            <div style="color: #0f0; font-size: 12px; margin-top: 8px; text-shadow: 0 0 5px #0f0;">QUANTUM DECRYPTION: AVAILABLE</div>
        </div>`;
    } else if (hasContact) {
        statusBadge = '<div style="color: #f0f; text-shadow: 0 0 5px #f0f; margin-top: 12px; padding-top: 12px; border-top: 2px solid #0f0; font-size: 14px;">★ CONTACT ESTABLISHED</div>';
    } else if (scanResult) {
        // Show detailed scan result
        if (scanResult.type === 'false_positive') {
            statusBadge = `<div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #f00;">
                <div style="color: #f00; text-shadow: 0 0 5px #f00; font-size: 14px;">⚠ FALSE POSITIVE</div>
                <div style="color: #ff0; font-size: 12px; margin-top: 8px;">Source:</div>
                <div style="color: #ff0; font-size: 11px;">${scanResult.source}</div>
            </div>`;
        } else if (scanResult.type === 'natural') {
            statusBadge = `<div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #0ff;">
                <div style="color: #0ff; text-shadow: 0 0 5px #0ff; font-size: 14px;">✓ NATURAL PHENOMENON</div>
                <div style="color: #0f0; font-size: 12px; margin-top: 8px;">${scanResult.phenomenonType}</div>
                <div style="color: #0f0; font-size: 11px;">${scanResult.source}</div>
            </div>`;
        } else if (scanResult.type === 'verified_signal') {
            statusBadge = `<div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #f0f;">
                <div style="color: #f0f; text-shadow: 0 0 5px #f0f; font-size: 14px;">★ VERIFIED SIGNAL</div>
                <div style="color: #ff0; font-size: 12px; margin-top: 8px;">EXTRASOLAR ORIGIN</div>
            </div>`;
        } else if (scanResult.type === 'encrypted_signal') {
            if (gameState.decryptionComplete) {
                // Post-decryption: signal decoded, ready for contact
                statusBadge = `<div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #0f0;">
                    <div style="color: #0f0; text-shadow: 0 0 5px #0f0; font-size: 14px;">✓ SIGNAL DECRYPTED</div>
                    <div style="color: #0ff; font-size: 12px; margin-top: 8px;">EXTRASOLAR ORIGIN CONFIRMED</div>
                    <div style="color: #ff0; font-size: 12px; margin-top: 8px;">SCAN TO ESTABLISH CONTACT</div>
                </div>`;
            } else {
                // Day 1: can't decrypt yet
                statusBadge = `<div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #ff0; animation: warningPulse 1.5s ease-in-out infinite;">
                    <div style="color: #ff0; text-shadow: 0 0 5px #ff0; font-size: 14px;">⚠ ENCRYPTED SIGNAL</div>
                    <div style="color: #0ff; font-size: 12px; margin-top: 8px;">EXTRASOLAR ORIGIN - ENCODED</div>
                    <div style="color: #f00; font-size: 12px; margin-top: 8px;">DECRYPTION: REQUIRES SIGMA CLEARANCE</div>
                </div>`;
            }
        }
    } else if (isAnalyzed) {
        statusBadge = '<div style="color: #ff0; text-shadow: 0 0 5px #ff0; margin-top: 12px; padding-top: 12px; border-top: 2px solid #0f0; font-size: 14px;">✓ ANALYZED</div>';
    } else if (isScanned) {
        statusBadge = '<div style="color: #0ff; text-shadow: 0 0 5px #0ff; margin-top: 12px; padding-top: 12px; border-top: 2px solid #0f0; font-size: 14px;">SCANNED</div>';
    }

    // Update star info title with star name
    const starInfoTitle = document.querySelector('.star-info-title');
    starInfoTitle.textContent = star.name;

    // Add weak signal warning if applicable (only show if not yet complete)
    let weakSignalWarning = '';
    if (star.signalStrength === 'weak' && !isComplete) {
        weakSignalWarning = `
            <div class="weak-signal-warning" style="margin-top: 12px; padding: 10px; border: 2px solid #ffa500; background: rgba(255, 165, 0, 0.1); animation: warningPulse 1.5s ease-in-out infinite;">
                <div style="color: #ffa500; text-shadow: 0 0 5px #ffa500; font-size: 14px; text-align: center;">⚠ WEAK SIGNAL DETECTED ⚠</div>
                <div style="color: #ffa500; font-size: 11px; margin-top: 8px; text-align: center;">
                    DISH ARRAY ALIGNMENT REQUIRED<br>
                    ENTER CODE TO ALIGN DISHES
                </div>
                <div style="color: #0ff; font-size: 10px; margin-top: 6px; text-align: center;">
                    Use keypad in [ARRAY STATUS] panel
                </div>
            </div>`;
    }

    // Update star info panel
    const starDetails = document.getElementById('star-details');
    starDetails.innerHTML = `
        <div>
            <strong>COORDINATES:</strong><br>
            ${star.coordinates}<br>
            <strong>DISTANCE:</strong><br>
            ${star.distance} light years<br>
            <strong>STAR TYPE:</strong><br>
            ${star.starType}<br>
            <strong>CLASS:</strong><br>
            ${star.starClass}<br>
            <strong>TEMPERATURE:</strong><br>
            ${star.temperature}<br>
            <strong>DISCOVERED:</strong><br>
            ${star.discovered}
        </div>
        ${weakSignalWarning}
        ${statusBadge}
    `;

    // Draw star visualization
    drawStarVisualization(star);

    // Show/hide array button for weak signal stars (if it exists)
    // Only show array controls if star is not yet complete
    const arrayBtn = document.getElementById('array-status-btn');
    if (star.signalStrength === 'weak' && !isComplete) {
        if (arrayBtn) arrayBtn.style.display = 'inline-block';
        // Only reset array if this is a different target star
        if (!gameState.dishArray.currentTargetStar || gameState.dishArray.currentTargetStar.id !== star.id) {
            if (setArrayTargetFn) setArrayTargetFn(star);
        } else {
            // Same star selected again - just update the display
            if (renderStarmapArrayFn) renderStarmapArrayFn();
            if (updateStarmapArrayStatsFn) updateStarmapArrayStatsFn();
        }
    } else {
        if (arrayBtn) arrayBtn.style.display = 'none';
        // Clear array target and show ready state for non-weak signal stars
        gameState.dishArray.currentTargetStar = null;
        gameState.dishArray.requiredPower = 0;
        gameState.dishArray.codeRequired = false;
        gameState.dishArray.alignmentCode = '';
        gameState.dishArray.inputCode = '';
        // Hide code section and keypad
        const codeSection = document.getElementById('array-code-section');
        if (codeSection) codeSection.style.display = 'none';
        // Update telemetry to show current star
        if (updateTelemetryFn) updateTelemetryFn(star);
        // Show ready status for non-complete stars, default for complete
        const statusEl = document.getElementById('starmap-array-status');
        const starmapScanBtn = document.getElementById('starmap-array-scan-btn');
        if (needsDecryption) {
            // Ross 128 Day 2+: show decryption prompt in array panel
            if (statusEl) {
                statusEl.innerHTML = '<span style="color: #ff0; animation: warningPulse 1.5s ease-in-out infinite;">⚠ ENCRYPTED SIGNAL DETECTED</span>';
            }
            if (starmapScanBtn) {
                starmapScanBtn.textContent = 'BEGIN DECRYPTION';
                starmapScanBtn.style.display = 'block';
                starmapScanBtn.style.borderColor = '#0f0';
                starmapScanBtn.style.color = '#0f0';
                starmapScanBtn.style.animation = 'pulse 2s infinite';
                // Replace click handler for decryption
                starmapScanBtn.onclick = () => {
                    playClick();
                    if (startDirectDecryptionFn) startDirectDecryptionFn();
                };
            }
        } else if (statusEl) {
            if (!isComplete) {
                statusEl.textContent = 'ARRAY READY';
                statusEl.className = 'starmap-array-status';
                statusEl.style.color = '#0f0';
            } else {
                statusEl.textContent = 'SCAN COMPLETE';
                statusEl.className = 'starmap-array-status';
                statusEl.style.color = '#ff0';
            }
            // Show BEGIN ANALYSIS button for non-complete stars
            if (starmapScanBtn) {
                starmapScanBtn.textContent = 'BEGIN ANALYSIS';
                starmapScanBtn.style.display = !isComplete ? 'block' : 'none';
                starmapScanBtn.style.borderColor = '';
                starmapScanBtn.style.color = '';
                starmapScanBtn.style.animation = '';
                starmapScanBtn.onclick = null; // Reset to default handler
            }
        }
        // Reset dish visuals to all aligned for normal signals
        gameState.dishArray.dishes.forEach(d => {
            d.isAligned = !isComplete;
            d.isAligning = false;
            d.isMalfunctioning = false;
        });
        if (renderStarmapArrayFn) renderStarmapArrayFn();
        if (updateStarmapArrayStatsFn) updateStarmapArrayStatsFn();
    }

    log(`Target acquired: ${star.name}`);
    log(`Coordinates: ${star.coordinates}, Distance: ${star.distance} ly`);
    log(`Star Type: ${star.starType} (${star.starClass}), Temperature: ${star.temperature}`);
    if (star.signalStrength === 'weak' && !isComplete) {
        log(`WEAK SIGNAL - Array alignment required`, 'warning');
    }
}

// Select a dynamic star (SRC-7024 or NEXUS POINT)
function selectDynamicStar(dStar) {
    gameState.selectedStarId = dStar.id;
    gameState.currentStar = dStar;

    playSelectStar();
    playStaticBurst();

    // Deselect any catalog star
    document.querySelectorAll('.star-item').forEach(item => item.classList.remove('selected'));

    // Update star info panel
    const starInfoTitle = document.querySelector('.star-info-title');
    starInfoTitle.textContent = dStar.name;

    const starDetails = document.getElementById('star-details');

    // Check scan status
    const isComplete = gameState.scanResults.has(dStar.id) || gameState.contactedStars.has(dStar.id);
    const isLockedDay2 = dStar.id === 'src7024' && gameState.currentDay < 3 && gameState.day2CliffhangerPhase !== 1;

    // Enable scan confirmation if scannable
    gameState.showScanConfirm = !isComplete && !isLockedDay2;

    let statusBadge = '';
    if (isComplete) {
        statusBadge = `<div style="color: #0f0; margin-top: 12px; padding-top: 12px; border-top: 2px solid #0f0; font-size: 14px;">✓ ANALYZED</div>`;
    } else if (isLockedDay2) {
        statusBadge = `<div style="color: #ff0; margin-top: 12px; padding-top: 12px; border-top: 2px solid #ff0; font-size: 14px;">
            ⚠ DAY 2 SURVEY COMPLETE<br>
            <span style="font-size: 12px; color: #0ff;">Analysis deferred to Day 3</span>
        </div>`;
    }

    starDetails.innerHTML = `
        <div>
            <strong>DESIGNATION:</strong><br>
            ${dStar.name}<br>
            <strong>COORDINATES:</strong><br>
            ${dStar.coordinates}<br>
            <strong>DISTANCE:</strong><br>
            ${dStar.distance} ly<br>
            <strong>TYPE:</strong><br>
            ${dStar.starType}<br>
            <strong>CLASS:</strong><br>
            ${dStar.starClass}<br>
        </div>
        <div style="color: #0ff; margin-top: 12px; padding: 10px; border: 1px solid #0ff; background: rgba(0, 255, 255, 0.05); font-size: 12px;">
            SIGNAL TYPE: UNKNOWN<br>
            ORIGIN: ${dStar.starType}
        </div>
        ${statusBadge}
    `;

    // Hide array controls for dynamic stars
    const arrayBtn = document.getElementById('array-status-btn');
    if (arrayBtn) arrayBtn.style.display = 'none';
    const starmapScanBtn = document.getElementById('starmap-array-scan-btn');
    if (starmapScanBtn) starmapScanBtn.style.display = 'none';

    // Draw a special visualization for dynamic stars
    const canvas = document.getElementById('star-visual');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw distinct visual based on type
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const color = dStar.dynamicType === 'signal' ? '#0ff' : (dStar.dynamicType === 'genesis' ? '#0f0' : '#f0f');

    for (let r = 50; r > 5; r -= 5) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.1 + (50 - r) / 50 * 0.5;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    log(`Target acquired: ${dStar.name}`);
    log(`Type: ${dStar.starType} | Distance: ${dStar.distance} ly`);
}

// Initiate scan sequence (called when user confirms)
export function startScanSequence() {
    const star = gameState.currentStar;

    // Day 2 cliffhanger: SRC-7024 crash scan intercept
    if (star && star.id === 'src7024' && gameState.day2CliffhangerPhase === 1 && initiateSRC7024CrashScanFn) {
        gameState.showScanConfirm = false;
        initiateSRC7024CrashScanFn();
        return;
    }

    // Play acknowledgement sound
    playScanAcknowledge();

    // Stop any existing animation and clear signal
    if (stopSignalAnimationFn) stopSignalAnimationFn();
    gameState.currentSignal = null;

    // Hide scan confirmation
    gameState.showScanConfirm = false;

    // Hide contact protocol box
    document.getElementById('contact-protocol-box').style.display = 'none';

    // Set up analysis view
    document.getElementById('target-name').textContent = star.name;
    document.getElementById('target-coords').textContent = star.coordinates;
    document.getElementById('target-distance').textContent = star.distance;
    document.getElementById('target-type').textContent = star.starType;
    document.getElementById('target-class').textContent = star.starClass;
    document.getElementById('target-temp').textContent = star.temperature;

    // Draw star visualization in analysis view (skip for dynamic stars with non-numeric IDs)
    if (!star.isDynamic) {
        drawStarVisualization(star, 'analysis-star-visual');
    }

    showView('analysis-view');

    // Reset scan button to enabled state (may be disabled from prior scans or crash sequence)
    const scanBtn = document.getElementById('scan-btn');
    scanBtn.disabled = false;
    scanBtn.textContent = 'INITIATE SCAN';

    document.getElementById('analyze-btn').disabled = true;
    document.getElementById('analysis-text').innerHTML =
        '<p>AWAITING SCAN INITIALIZATION...</p>';

    clearCanvas('waveform-canvas');
    clearCanvas('spectrogram-canvas');

    log('Switching to analysis mode...');
}

// Render star map (branches between array view and sky chart)
export function renderStarMap() {
    if (gameState.starmapMode === 'skychart') {
        renderSkyChart();
    } else {
        renderArrayView();
    }
}

// Sky Chart view — real RA/Dec projection with galactic plane
function renderSkyChart() {
    const canvas = document.getElementById('starmap-canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const sc = gameState.skyChart;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Apply zoom/pan transform
    ctx.save();
    ctx.translate(sc.panX, sc.panY);
    ctx.scale(sc.scale, sc.scale);

    // Draw pre-rendered sky chart background (galactic plane)
    if (skyChartBgCanvas) {
        ctx.drawImage(skyChartBgCanvas, 0, 0);
    }

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.15)';
    ctx.lineWidth = 1 / sc.scale;
    for (let x = 0; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Pre-compute label placements to avoid overlaps
    cachedSkyLabelBounds = []; // Reset for this frame
    const skyLabelStars = [];
    gameState.stars.forEach(star => {
        const starDay = getStarDayRequirement(star.id);
        const isPreviousDay = starDay < gameState.currentDay && !gameState.demoMode && gameState.currentDay > 0;
        const isFutureDay = starDay > gameState.currentDay && !gameState.demoMode && gameState.currentDay > 0;
        if (isFutureDay) return;
        const isSelected = gameState.selectedStarId === star.id;
        if (isSelected) return; // selected stars show scan box, not label
        const isHighlighted = !isPreviousDay || (star.id === 8 && isPreviousDay && !gameState.decryptionComplete &&
            gameState.scanResults.get(star.id)?.type === 'encrypted_signal');
        skyLabelStars.push({
            id: star.id, name: star.name,
            x: star.skyX, y: star.skyY,
            radius: (isHighlighted ? 4 : 4) / sc.scale,
            priority: isPreviousDay ? 0 : 1
        });
    });
    const skyLabelSides = resolveLabels(skyLabelStars, ctx, width, height, sc.scale);

    // Draw catalog stars at RA/Dec positions
    gameState.stars.forEach(star => {
        const isSelected = gameState.selectedStarId === star.id;
        const isContacted = gameState.contactedStars.has(star.id);
        const isAnalyzed = gameState.analyzedStars.has(star.id);
        const starDay = getStarDayRequirement(star.id);
        const isPreviousDay = starDay < gameState.currentDay && !gameState.demoMode && gameState.currentDay > 0;
        const isFutureDay = starDay > gameState.currentDay && !gameState.demoMode && gameState.currentDay > 0;

        if (isFutureDay) return;

        const sx = star.skyX;
        const sy = star.skyY;

        const isRoss128Decrypt = star.id === 8 && isPreviousDay && !gameState.decryptionComplete &&
            gameState.scanResults.get(star.id)?.type === 'encrypted_signal';
        const { color: spectralColor } = getSpectralColor(star.starType);
        const isHighlighted = !isPreviousDay || isRoss128Decrypt;

        let starColor, labelColor;
        if (isRoss128Decrypt) {
            const pulse = (Math.sin(Date.now() * 0.004) + 1) / 2;
            ctx.globalAlpha = 0.7 + pulse * 0.3;
            starColor = '#ff0';
            labelColor = '#ff0';

            // Pulsing beacon rings to draw player attention
            const ringPulse = (Date.now() % 2000) / 2000;
            for (let r = 0; r < 2; r++) {
                const phase = (ringPulse + r * 0.5) % 1;
                const ringRadius = (8 + phase * 22) / sc.scale;
                const ringAlpha = (1 - phase) * 0.5;
                ctx.strokeStyle = `rgba(255, 255, 0, ${ringAlpha})`;
                ctx.lineWidth = 1.5 / sc.scale;
                ctx.beginPath();
                ctx.arc(sx, sy, ringRadius, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else if (isPreviousDay) {
            ctx.globalAlpha = 0.15;
            starColor = spectralColor;
            labelColor = spectralColor;
        } else if (isContacted) {
            starColor = '#f0f';
            labelColor = '#f0f';
        } else if (isAnalyzed) {
            const scanResult = gameState.scanResults.get(star.id);
            if (scanResult?.type === 'false_positive') {
                starColor = '#f00';
                labelColor = '#f00';
            } else if (scanResult?.type === 'natural') {
                starColor = '#0ff';
                labelColor = '#0ff';
            } else if (scanResult?.type === 'verified_signal') {
                starColor = '#f0f';
                labelColor = '#f0f';
            } else {
                starColor = '#ff0';
                labelColor = '#ff0';
            }
        } else {
            starColor = spectralColor;
            labelColor = spectralColor;
        }

        const radius = (isSelected && isHighlighted ? 6 : 4) / sc.scale;
        ctx.fillStyle = starColor;
        ctx.shadowColor = starColor;
        ctx.shadowBlur = (isSelected && isHighlighted ? 18 : (isHighlighted ? 12 : 6)) / sc.scale;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Label (hide when scan box is showing for this star)
        if (!isSelected) {
            ctx.shadowBlur = 3 / sc.scale;
            ctx.fillStyle = labelColor;
            const labelFontSize = 12 / sc.scale;
            ctx.font = `${labelFontSize}px VT323`;
            const pad = 5 / sc.scale;
            const labelInfo = skyLabelSides.get(star.id) || { side: 'left', dy: 0 };
            const labelY = sy + 3 / sc.scale + labelInfo.dy;
            const textW = ctx.measureText(star.name).width;
            let labelDrawX;
            if (labelInfo.side === 'right') {
                ctx.textAlign = 'right';
                labelDrawX = sx - radius - pad;
                ctx.fillText(star.name, labelDrawX, labelY);
                cachedSkyLabelBounds.push({ starId: star.id, x1: labelDrawX - textW, y1: labelY - labelFontSize, x2: labelDrawX, y2: labelY });
            } else {
                ctx.textAlign = 'left';
                labelDrawX = sx + radius + pad;
                ctx.fillText(star.name, labelDrawX, labelY);
                cachedSkyLabelBounds.push({ starId: star.id, x1: labelDrawX, y1: labelY - labelFontSize, x2: labelDrawX + textW, y2: labelY });
            }
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    });

    // Draw dynamic stars at their sky chart positions
    if (gameState.dynamicStars && gameState.dynamicStars.length > 0) {
        gameState.dynamicStars.forEach(dStar => {
            const pos = getDynamicStarSkyPos(dStar, width, height);
            const isSelected = gameState.selectedStarId === dStar.id;
            const pulse = (Math.sin(Date.now() * 0.004) + 1) / 2;
            const age = dStar.addedAt ? (Date.now() - dStar.addedAt) / 1000 : 10;
            const growScale = Math.min(1, age / 3);

            if (dStar.dynamicType === 'signal') {
                const size = ((isSelected ? 8 : 6) * growScale) / sc.scale;
                ctx.save();
                ctx.translate(pos.x, pos.y);
                ctx.rotate(Math.PI / 4);
                ctx.fillStyle = `rgba(0, 255, 255, ${0.6 + pulse * 0.4})`;
                ctx.shadowColor = '#0ff';
                ctx.shadowBlur = (15 + pulse * 10) / sc.scale;
                ctx.fillRect(-size / 2, -size / 2, size, size);
                ctx.restore();
                if (growScale > 0.5) {
                    ctx.fillStyle = `rgba(0, 255, 255, ${0.7 * growScale})`;
                    ctx.font = `${16 / sc.scale}px VT323`;
                    ctx.textAlign = 'center';
                    ctx.shadowBlur = 5 / sc.scale;
                    ctx.shadowColor = '#0ff';
                    ctx.fillText('SRC-7024', pos.x, pos.y + 20 / sc.scale);
                    ctx.shadowBlur = 0;
                }
            } else if (dStar.dynamicType === 'genesis') {
                const size = ((isSelected ? 8 : 6) * growScale) / sc.scale;
                const goldPulse = (Math.sin(Date.now() * 0.005) + 1) / 2;
                ctx.fillStyle = `rgba(${Math.floor(50 + 200 * goldPulse)}, 255, ${Math.floor(50 * goldPulse)}, ${0.6 + pulse * 0.4})`;
                ctx.shadowColor = '#0f0';
                ctx.shadowBlur = (15 + pulse * 10) / sc.scale;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
                    const hx = pos.x + Math.cos(angle) * size;
                    const hy = pos.y + Math.sin(angle) * size;
                    if (i === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.fill();
                if (growScale > 0.5) {
                    ctx.fillStyle = `rgba(0, 255, 0, ${0.7 * growScale})`;
                    ctx.font = `${16 / sc.scale}px VT323`;
                    ctx.textAlign = 'center';
                    ctx.shadowBlur = 5 / sc.scale;
                    ctx.shadowColor = '#0f0';
                    ctx.fillText('GENESIS POINT', pos.x, pos.y + 20 / sc.scale);
                    ctx.shadowBlur = 0;
                }
            } else if (dStar.dynamicType === 'nexus') {
                const size = ((isSelected ? 8 : 6) * growScale) / sc.scale;
                const magentaPulse = (Math.sin(Date.now() * 0.006) + 1) / 2;
                ctx.fillStyle = `rgba(255, ${Math.floor(100 * magentaPulse)}, 255, ${0.6 + pulse * 0.4})`;
                ctx.shadowColor = '#f0f';
                ctx.shadowBlur = (15 + pulse * 10) / sc.scale;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 + Date.now() * 0.001;
                    const r = i % 2 === 0 ? size : size * 0.4;
                    const hx = pos.x + Math.cos(angle) * r;
                    const hy = pos.y + Math.sin(angle) * r;
                    if (i === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.fill();
                if (growScale > 0.5) {
                    ctx.fillStyle = `rgba(255, 100, 255, ${0.7 * growScale})`;
                    ctx.font = `${16 / sc.scale}px VT323`;
                    ctx.textAlign = 'center';
                    ctx.shadowBlur = 5 / sc.scale;
                    ctx.shadowColor = '#f0f';
                    ctx.fillText('NEXUS POINT', pos.x, pos.y + 20 / sc.scale);
                    ctx.shadowBlur = 0;
                }
            }
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        });
    }

    // Draw crosshair on selected star
    if (gameState.selectedStarId !== null) {
        const star = getSelectedStar();
        if (star) {
            let cx, cy;
            if (star.isDynamic) {
                const pos = getDynamicStarSkyPos(star, width, height);
                cx = pos.x;
                cy = pos.y;
            } else {
                cx = star.skyX;
                cy = star.skyY;
            }

            ctx.strokeStyle = '#0ff';
            ctx.lineWidth = 2 / sc.scale;
            ctx.shadowColor = '#0ff';
            ctx.shadowBlur = 10 / sc.scale;

            gameState.crosshairAngle += 0.02;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(gameState.crosshairAngle);

            const crosshairSize = 20 / sc.scale;
            const inner = 10 / sc.scale;
            ctx.beginPath();
            ctx.moveTo(-crosshairSize, 0); ctx.lineTo(-inner, 0);
            ctx.moveTo(inner, 0); ctx.lineTo(crosshairSize, 0);
            ctx.moveTo(0, -crosshairSize); ctx.lineTo(0, -inner);
            ctx.moveTo(0, inner); ctx.lineTo(0, crosshairSize);
            ctx.stroke();

            const bracketSize = 15 / sc.scale;
            const bLeg = 5 / sc.scale;
            ctx.beginPath();
            ctx.moveTo(-bracketSize, -bracketSize); ctx.lineTo(-bracketSize, -bracketSize + bLeg);
            ctx.moveTo(-bracketSize, -bracketSize); ctx.lineTo(-bracketSize + bLeg, -bracketSize);
            ctx.moveTo(bracketSize, -bracketSize); ctx.lineTo(bracketSize, -bracketSize + bLeg);
            ctx.moveTo(bracketSize, -bracketSize); ctx.lineTo(bracketSize - bLeg, -bracketSize);
            ctx.moveTo(-bracketSize, bracketSize); ctx.lineTo(-bracketSize, bracketSize - bLeg);
            ctx.moveTo(-bracketSize, bracketSize); ctx.lineTo(-bracketSize + bLeg, bracketSize);
            ctx.moveTo(bracketSize, bracketSize); ctx.lineTo(bracketSize, bracketSize - bLeg);
            ctx.moveTo(bracketSize, bracketSize); ctx.lineTo(bracketSize - bLeg, bracketSize);
            ctx.stroke();

            ctx.restore();
            ctx.shadowBlur = 0;
        }
    }

    // Draw scan box on selected star
    if (gameState.selectedStarId !== null) {
        const star = getSelectedStar();
        if (!star) { ctx.restore(); drawAxisLabels(ctx, width, height); return; }

        let sx, sy;
        if (star.isDynamic) {
            const pos = getDynamicStarSkyPos(star, width, height);
            sx = pos.x;
            sy = pos.y;
        } else {
            sx = star.skyX;
            sy = star.skyY;
        }

        const boxWidth = 120 / sc.scale;
        const boxHeight = 60 / sc.scale;
        let boxX = sx + 40 / sc.scale;
        const boxY = sy - 20 / sc.scale;
        if (boxX + boxWidth > width - 10 / sc.scale) boxX = sx - boxWidth - 10 / sc.scale;
        if (boxX < 10 / sc.scale) boxX = 10 / sc.scale;

        if (gameState.showScanConfirm) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
            ctx.strokeStyle = '#0ff';
            ctx.lineWidth = 2 / sc.scale;
            ctx.shadowColor = '#0ff';
            ctx.shadowBlur = 10 / sc.scale;
            ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
            ctx.fillStyle = '#0ff';
            ctx.font = `${14 / sc.scale}px VT323`;
            ctx.textAlign = 'center';
            ctx.shadowBlur = 5 / sc.scale;
            ctx.fillText(star.name, boxX + boxWidth / 2, boxY + 20 / sc.scale);
            const flashAlpha = (Math.sin(Date.now() * 0.003) + 1) / 2 * 0.6 + 0.4;
            ctx.font = `${18 / sc.scale}px VT323`;
            ctx.globalAlpha = flashAlpha;
            ctx.fillText('SCAN?', boxX + boxWidth / 2, boxY + 40 / sc.scale);
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            ctx.textAlign = 'left';
        } else {
            // Check if this star needs decryption (Ross 128 Day 2+)
            const starNeedsDecrypt = !star.isDynamic && star.id === 8 && !gameState.decryptionComplete && gameState.currentDay >= 2;
            if (starNeedsDecrypt) {
                // Decrypt prompt box (like SCAN? but for decryption)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
                ctx.strokeStyle = '#0f0';
                ctx.lineWidth = 2 / sc.scale;
                ctx.shadowColor = '#0f0';
                ctx.shadowBlur = 10 / sc.scale;
                ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
                ctx.fillStyle = '#ff0';
                ctx.font = `${14 / sc.scale}px VT323`;
                ctx.textAlign = 'center';
                ctx.shadowBlur = 5 / sc.scale;
                ctx.fillText(star.name, boxX + boxWidth / 2, boxY + 20 / sc.scale);
                const flashAlpha = (Math.sin(Date.now() * 0.003) + 1) / 2 * 0.6 + 0.4;
                ctx.font = `${18 / sc.scale}px VT323`;
                ctx.fillStyle = '#0f0';
                ctx.globalAlpha = flashAlpha;
                ctx.fillText('DECRYPT?', boxX + boxWidth / 2, boxY + 40 / sc.scale);
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                ctx.textAlign = 'left';
            } else {
                const hasContact = gameState.contactedStars.has(gameState.selectedStarId);
                const scanResult = gameState.scanResults.get(gameState.selectedStarId);
                if (hasContact || scanResult) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
                    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
                    const borderColor = hasContact ? '#f0f' : (scanResult && scanResult.type === 'false_positive' ? '#f00' : '#ff0');
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = 1 / sc.scale;
                    ctx.shadowColor = borderColor;
                    ctx.shadowBlur = 5 / sc.scale;
                    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
                    ctx.fillStyle = borderColor;
                    ctx.font = `${14 / sc.scale}px VT323`;
                    ctx.textAlign = 'center';
                    ctx.fillText(star.name, boxX + boxWidth / 2, boxY + 20 / sc.scale);
                    ctx.globalAlpha = 0.6;
                    ctx.font = `${16 / sc.scale}px VT323`;
                    const label = hasContact ? '★ CONTACT' : (scanResult && scanResult.type === 'false_positive' ? '⚠ FALSE POSITIVE' : '✓ COMPLETE');
                    ctx.fillText(label, boxX + boxWidth / 2, boxY + 40 / sc.scale);
                    ctx.globalAlpha = 1;
                    ctx.shadowBlur = 0;
                    ctx.textAlign = 'left';
                }
            }
        }
    }

    // Restore zoom transform
    ctx.restore();

    // Draw axis labels on top (outside zoom)
    drawAxisLabels(ctx, width, height);

    // Draw zoom indicator
    if (sc.scale > 1.01) {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.font = '12px VT323';
        ctx.textAlign = 'right';
        ctx.fillText(`${sc.scale.toFixed(1)}x`, width - 10, 18);
    }
}

// Array View — original parallax starmap
function renderArrayView() {
    const canvas = document.getElementById('starmap-canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Smooth mouse position interpolation (eliminates snapping)
    gameState.mouseX += (gameState.targetMouseX - gameState.mouseX) * 0.08;
    gameState.mouseY += (gameState.targetMouseY - gameState.mouseY) * 0.08;

    // Smooth parallax interpolation (always lerp toward target)
    const targetOffsetX = gameState.mouseX * 15;
    const targetOffsetY = gameState.mouseY * 15;
    gameState.parallaxOffsetX += (targetOffsetX - gameState.parallaxOffsetX) * 0.08;
    gameState.parallaxOffsetY += (targetOffsetY - gameState.parallaxOffsetY) * 0.08;

    // Draw background stars with twinkling effect and parallax
    const time = Date.now() * 0.001;
    gameState.backgroundStars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.15 + 0.85;
        const alpha = star.alpha * twinkle;

        // Apply parallax effect (background stars move more - they're farther away)
        const parallaxX = star.x + gameState.parallaxOffsetX * 1.5;
        const parallaxY = star.y + gameState.parallaxOffsetY * 1.5;

        ctx.fillStyle = `rgb(${star.brightness}, ${star.brightness}, ${star.brightness})`;
        ctx.globalAlpha = alpha;
        ctx.fillRect(parallaxX, parallaxY, star.size, star.size);
    });

    ctx.globalAlpha = 1;

    // Draw nebula / milky way (pre-rendered, with parallax)
    if (nebulaCanvas) {
        const nebPx = gameState.parallaxOffsetX * 1.2 - 40;
        const nebPy = gameState.parallaxOffsetY * 1.2 - 40;
        ctx.drawImage(nebulaCanvas, nebPx, nebPy);
    }

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.15)';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    for (let y = 0; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Pre-compute label placements to avoid overlaps in array view
    cachedArrayLabelBounds = []; // Reset for this frame
    const arrayLabelStars = [];
    gameState.stars.forEach(star => {
        const starDay = getStarDayRequirement(star.id);
        const isPreviousDay = starDay < gameState.currentDay && !gameState.demoMode && gameState.currentDay > 0;
        const isFutureDay = starDay > gameState.currentDay && !gameState.demoMode && gameState.currentDay > 0;
        if (isFutureDay) return;
        const isSelected = gameState.selectedStarId === star.id;
        if (isSelected) return;
        const pX = star.x + gameState.parallaxOffsetX * 0.3;
        const pY = star.y + gameState.parallaxOffsetY * 0.3;
        arrayLabelStars.push({
            id: star.id, name: star.name,
            x: pX, y: pY, radius: 4,
            priority: isPreviousDay ? 0 : 1
        });
    });
    const arrayLabelSides = resolveLabels(arrayLabelStars, ctx, width, height);

    // Draw catalog stars with subtle parallax
    gameState.stars.forEach(star => {
        const isSelected = gameState.selectedStarId === star.id;
        const isContacted = gameState.contactedStars.has(star.id);
        const isAnalyzed = gameState.analyzedStars.has(star.id);
        const starDay = getStarDayRequirement(star.id);
        const isPreviousDay = starDay < gameState.currentDay && !gameState.demoMode && gameState.currentDay > 0;
        const isFutureDay = starDay > gameState.currentDay && !gameState.demoMode && gameState.currentDay > 0;

        // Skip rendering future day stars entirely
        if (isFutureDay) {
            return;
        }

        // Apply parallax effect (target stars move less - they're closer)
        const parallaxX = star.x + gameState.parallaxOffsetX * 0.3;
        const parallaxY = star.y + gameState.parallaxOffsetY * 0.3;

        // Check if this is Ross 128 needing decryption
        const isRoss128Decrypt = star.id === 8 && isPreviousDay && !gameState.decryptionComplete &&
            gameState.scanResults.get(star.id)?.type === 'encrypted_signal';

        // Get spectral color for this star
        const { color: spectralColor } = getSpectralColor(star.starType);
        const isHighlighted = !isPreviousDay || isRoss128Decrypt;

        // Determine star color and alpha based on status
        let starColor, labelColor;
        if (isRoss128Decrypt) {
            const pulse = (Math.sin(Date.now() * 0.004) + 1) / 2;
            ctx.globalAlpha = 0.7 + pulse * 0.3;
            starColor = '#ff0';
            labelColor = '#ff0';

            // Pulsing beacon rings to draw player attention
            const ringPulse = (Date.now() % 2000) / 2000; // 0→1 over 2s
            for (let r = 0; r < 2; r++) {
                const phase = (ringPulse + r * 0.5) % 1;
                const ringRadius = 8 + phase * 22;
                const ringAlpha = (1 - phase) * 0.5;
                ctx.strokeStyle = `rgba(255, 255, 0, ${ringAlpha})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(parallaxX, parallaxY, ringRadius, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else if (isPreviousDay) {
            ctx.globalAlpha = 0.15;
            starColor = spectralColor;
            labelColor = spectralColor;
        } else if (isContacted) {
            starColor = '#f0f';
            labelColor = '#f0f';
        } else if (isAnalyzed) {
            // Color based on scan result type
            const scanResult = gameState.scanResults.get(star.id);
            if (scanResult?.type === 'false_positive') {
                starColor = '#f00';
                labelColor = '#f00';
            } else if (scanResult?.type === 'natural') {
                starColor = '#0ff';
                labelColor = '#0ff';
            } else if (scanResult?.type === 'verified_signal') {
                starColor = '#f0f';
                labelColor = '#f0f';
            } else {
                starColor = '#ff0';
                labelColor = '#ff0';
            }
        } else {
            starColor = spectralColor;
            labelColor = spectralColor;
        }

        // Draw glowing circle
        const radius = isSelected && isHighlighted ? 6 : 4;
        ctx.fillStyle = starColor;
        ctx.shadowColor = starColor;
        ctx.shadowBlur = isSelected && isHighlighted ? 18 : (isHighlighted ? 12 : 6);
        ctx.beginPath();
        ctx.arc(parallaxX, parallaxY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw star name label (skip if this star has a scan/status box showing)
        if (!isSelected) {
            ctx.shadowBlur = 3;
            ctx.fillStyle = labelColor;
            ctx.font = '12px VT323';
            const labelInfo = arrayLabelSides.get(star.id) || { side: 'left', dy: 0 };
            const labelY = parallaxY + 3 + labelInfo.dy;
            const textW = ctx.measureText(star.name).width;
            let labelDrawX;
            if (labelInfo.side === 'right') {
                ctx.textAlign = 'right';
                labelDrawX = parallaxX - radius - 5;
                ctx.fillText(star.name, labelDrawX, labelY);
                cachedArrayLabelBounds.push({ starId: star.id, x1: labelDrawX - textW, y1: labelY - 12, x2: labelDrawX, y2: labelY });
            } else {
                ctx.textAlign = 'left';
                labelDrawX = parallaxX + radius + 5;
                ctx.fillText(star.name, labelDrawX, labelY);
                cachedArrayLabelBounds.push({ starId: star.id, x1: labelDrawX, y1: labelY - 12, x2: labelDrawX + textW, y2: labelY });
            }
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    });

    // Draw dynamic stars (SRC-7024, NEXUS POINT)
    if (gameState.dynamicStars && gameState.dynamicStars.length > 0) {
        gameState.dynamicStars.forEach(dStar => {
            const dx = dStar.x * width;
            const dy = dStar.y * height;
            const parallaxX = dx + gameState.parallaxOffsetX * 0.3;
            const parallaxY = dy + gameState.parallaxOffsetY * 0.3;
            const isSelected = gameState.selectedStarId === dStar.id;
            const pulse = (Math.sin(Date.now() * 0.004) + 1) / 2;

            // Animate grow-in if recently added
            const age = dStar.addedAt ? (Date.now() - dStar.addedAt) / 1000 : 10;
            const growScale = Math.min(1, age / 3); // Grows over 3 seconds

            // Extra glow burst during grow-in
            if (age < 3) {
                const burstAlpha = Math.max(0, 0.5 - age * 0.17);
                const burstRadius = 20 + age * 15;
                const burstColor = dStar.dynamicType === 'signal' ? '0, 255, 255'
                    : dStar.dynamicType === 'genesis' ? '0, 255, 0' : '255, 100, 255';
                ctx.fillStyle = `rgba(${burstColor}, ${burstAlpha})`;
                ctx.beginPath();
                ctx.arc(parallaxX, parallaxY, burstRadius * growScale, 0, Math.PI * 2);
                ctx.fill();
            }

            if (dStar.dynamicType === 'signal') {
                // SRC-7024: Pulsing cyan diamond
                const size = (isSelected ? 8 : 6) * growScale;
                ctx.save();
                ctx.translate(parallaxX, parallaxY);
                ctx.rotate(Math.PI / 4); // Diamond shape

                ctx.fillStyle = `rgba(0, 255, 255, ${0.6 + pulse * 0.4})`;
                ctx.shadowColor = '#0ff';
                ctx.shadowBlur = 15 + pulse * 10;
                ctx.fillRect(-size / 2, -size / 2, size, size);

                // Outer glow ring
                ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + pulse * 0.3})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(-size - 2, -size - 2, (size + 2) * 2, (size + 2) * 2);
                ctx.restore();

                // Label
                if (growScale > 0.5) {
                    ctx.fillStyle = `rgba(0, 255, 255, ${0.7 * growScale})`;
                    ctx.font = '16px VT323';
                    ctx.textAlign = 'center';
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#0ff';
                    ctx.fillText('SRC-7024', parallaxX, parallaxY + 20);
                    ctx.shadowBlur = 0;
                }
            } else if (dStar.dynamicType === 'genesis') {
                // GENESIS POINT: Pulsing green/gold hexagonal shape
                const size = (isSelected ? 8 : 6) * growScale;
                const goldPulse = (Math.sin(Date.now() * 0.005) + 1) / 2;

                ctx.fillStyle = `rgba(${Math.floor(50 + 200 * goldPulse)}, 255, ${Math.floor(50 * goldPulse)}, ${0.6 + pulse * 0.4})`;
                ctx.shadowColor = '#0f0';
                ctx.shadowBlur = 15 + pulse * 10;

                // Hexagonal shape
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
                    const sx = parallaxX + Math.cos(angle) * size;
                    const sy = parallaxY + Math.sin(angle) * size;
                    if (i === 0) ctx.moveTo(sx, sy);
                    else ctx.lineTo(sx, sy);
                }
                ctx.closePath();
                ctx.fill();

                // Outer ring
                ctx.strokeStyle = `rgba(0, 255, 0, ${0.3 + pulse * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(parallaxX, parallaxY, size + 4, 0, Math.PI * 2);
                ctx.stroke();

                // Label
                if (growScale > 0.5) {
                    ctx.fillStyle = `rgba(0, 255, 0, ${0.7 * growScale})`;
                    ctx.font = '16px VT323';
                    ctx.textAlign = 'center';
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#0f0';
                    ctx.fillText('GENESIS POINT', parallaxX, parallaxY + 20);
                    ctx.shadowBlur = 0;
                }
            } else if (dStar.dynamicType === 'nexus') {
                // NEXUS POINT: Pulsing magenta/white
                const size = (isSelected ? 8 : 6) * growScale;
                const magentaPulse = (Math.sin(Date.now() * 0.006) + 1) / 2;

                ctx.fillStyle = `rgba(255, ${Math.floor(100 * magentaPulse)}, 255, ${0.6 + pulse * 0.4})`;
                ctx.shadowColor = '#f0f';
                ctx.shadowBlur = 15 + pulse * 10;

                // Draw as a star/asterisk shape
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 + Date.now() * 0.001;
                    const r = i % 2 === 0 ? size : size * 0.4;
                    const sx = parallaxX + Math.cos(angle) * r;
                    const sy = parallaxY + Math.sin(angle) * r;
                    if (i === 0) ctx.moveTo(sx, sy);
                    else ctx.lineTo(sx, sy);
                }
                ctx.closePath();
                ctx.fill();

                // Label
                if (growScale > 0.5) {
                    ctx.fillStyle = `rgba(255, 100, 255, ${0.7 * growScale})`;
                    ctx.font = '16px VT323';
                    ctx.textAlign = 'center';
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#f0f';
                    ctx.fillText('NEXUS POINT', parallaxX, parallaxY + 20);
                    ctx.shadowBlur = 0;
                }
            }

            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        });
    }

    // Draw rotating crosshair on selected star
    if (gameState.selectedStarId !== null) {
        const star = getSelectedStar();
        if (star) {
        // Get pixel position (handles dynamic stars with fractional coords)
        const pos = getStarPixelXY(star, width, height);

        // Apply same parallax as target stars
        const parallaxX = pos.x + gameState.parallaxOffsetX * 0.3;
        const parallaxY = pos.y + gameState.parallaxOffsetY * 0.3;

        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#0ff';
        ctx.shadowBlur = 10;

        // Rotate crosshair
        gameState.crosshairAngle += 0.02;

        ctx.save();
        ctx.translate(parallaxX, parallaxY);
        ctx.rotate(gameState.crosshairAngle);

        // Draw crosshair lines
        const crosshairSize = 20;
        ctx.beginPath();
        ctx.moveTo(-crosshairSize, 0);
        ctx.lineTo(-10, 0);
        ctx.moveTo(10, 0);
        ctx.lineTo(crosshairSize, 0);
        ctx.moveTo(0, -crosshairSize);
        ctx.lineTo(0, -10);
        ctx.moveTo(0, 10);
        ctx.lineTo(0, crosshairSize);
        ctx.stroke();

        // Draw corner brackets
        const bracketSize = 15;
        ctx.beginPath();
        // Top-left
        ctx.moveTo(-bracketSize, -bracketSize);
        ctx.lineTo(-bracketSize, -bracketSize + 5);
        ctx.moveTo(-bracketSize, -bracketSize);
        ctx.lineTo(-bracketSize + 5, -bracketSize);
        // Top-right
        ctx.moveTo(bracketSize, -bracketSize);
        ctx.lineTo(bracketSize, -bracketSize + 5);
        ctx.moveTo(bracketSize, -bracketSize);
        ctx.lineTo(bracketSize - 5, -bracketSize);
        // Bottom-left
        ctx.moveTo(-bracketSize, bracketSize);
        ctx.lineTo(-bracketSize, bracketSize - 5);
        ctx.moveTo(-bracketSize, bracketSize);
        ctx.lineTo(-bracketSize + 5, bracketSize);
        // Bottom-right
        ctx.moveTo(bracketSize, bracketSize);
        ctx.lineTo(bracketSize, bracketSize - 5);
        ctx.moveTo(bracketSize, bracketSize);
        ctx.lineTo(bracketSize - 5, bracketSize);
        ctx.stroke();

        ctx.restore();
        ctx.shadowBlur = 0;
        }
    }

    // Draw scan confirmation box or completion indicator
    if (gameState.selectedStarId !== null) {
        const star = getSelectedStar();
        if (!star) return;
        // Convert dynamic star fractional coords to pixel coords for box positioning
        const pos = getStarPixelXY(star, width, height);
        const positionedStar = star.isDynamic ? { ...star, x: pos.x, y: pos.y } : star;
        const { boxX, boxY, boxWidth, boxHeight } = calculateScanBoxPosition(positionedStar, width);

        if (gameState.showScanConfirm) {
            // Box background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

            // Box border
            ctx.strokeStyle = '#0ff';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#0ff';
            ctx.shadowBlur = 10;
            ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

            // Star name
            ctx.fillStyle = '#0ff';
            ctx.font = '14px VT323';
            ctx.textAlign = 'center';
            ctx.shadowBlur = 5;
            ctx.fillText(star.name, boxX + boxWidth / 2, boxY + 20);

            // "SCAN?" text with slow flash effect
            const flashAlpha = (Math.sin(Date.now() * 0.003) + 1) / 2 * 0.6 + 0.4;
            ctx.font = '18px VT323';
            ctx.globalAlpha = flashAlpha;
            ctx.fillText('SCAN?', boxX + boxWidth / 2, boxY + 40);
            ctx.globalAlpha = 1;

            ctx.shadowBlur = 0;
            ctx.textAlign = 'left';
        } else {
            // Check if this star needs decryption (Ross 128 Day 2+)
            const starNeedsDecrypt = !star.isDynamic && star.id === 8 && !gameState.decryptionComplete && gameState.currentDay >= 2;
            if (starNeedsDecrypt) {
                // Decrypt prompt box
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
                ctx.strokeStyle = '#0f0';
                ctx.lineWidth = 2;
                ctx.shadowColor = '#0f0';
                ctx.shadowBlur = 10;
                ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
                ctx.fillStyle = '#ff0';
                ctx.font = '14px VT323';
                ctx.textAlign = 'center';
                ctx.shadowBlur = 5;
                ctx.fillText(star.name, boxX + boxWidth / 2, boxY + 20);
                const flashAlpha = (Math.sin(Date.now() * 0.003) + 1) / 2 * 0.6 + 0.4;
                ctx.font = '18px VT323';
                ctx.fillStyle = '#0f0';
                ctx.globalAlpha = flashAlpha;
                ctx.fillText('DECRYPT?', boxX + boxWidth / 2, boxY + 40);
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                ctx.textAlign = 'left';
            } else {
                // Show completion indicator for already-scanned stars
                const hasContact = gameState.contactedStars.has(gameState.selectedStarId);
                const scanResult = gameState.scanResults.get(gameState.selectedStarId);

                if (hasContact || scanResult) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
                    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

                    const borderColor = hasContact ? '#f0f' : (scanResult && scanResult.type === 'false_positive' ? '#f00' : '#ff0');
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = 1;
                    ctx.shadowColor = borderColor;
                    ctx.shadowBlur = 5;
                    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

                    ctx.fillStyle = borderColor;
                    ctx.font = '14px VT323';
                    ctx.textAlign = 'center';
                    ctx.fillText(star.name, boxX + boxWidth / 2, boxY + 20);

                    ctx.globalAlpha = 0.6;
                    ctx.font = '16px VT323';
                    const label = hasContact ? '★ CONTACT' : (scanResult && scanResult.type === 'false_positive' ? '⚠ FALSE POSITIVE' : '✓ COMPLETE');
                    ctx.fillText(label, boxX + boxWidth / 2, boxY + 40);
                    ctx.globalAlpha = 1;

                    ctx.shadowBlur = 0;
                    ctx.textAlign = 'left';
                }
            }
        }
    }

    // Draw RA/Dec axis labels as decorative overlay
    drawAxisLabels(ctx, width, height);
}

// Start star map animation loop
export function startStarMapAnimation() {
    function animate() {
        renderStarMap();
        gameState.animationFrameId = requestAnimationFrame(animate);
    }
    animate();
}

// Setup starmap canvas event listeners
export function setupStarMapCanvas() {
    const canvas = document.getElementById('starmap-canvas');

    // Parallax state
    let parallaxResetTimer = null;
    let lastMouseX = null;
    let lastMouseY = null;

    // Mouse move for parallax effect - uses delta (movement) not absolute position
    canvas.addEventListener('mousemove', (e) => {
        // No parallax in sky chart mode (pan is handled separately)
        if (gameState.starmapMode === 'skychart') {
            // Handle pan drag
            const sc = gameState.skyChart;
            if (sc.isDragging) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                sc.panX = sc.lastPanX + (e.clientX - sc.dragStartX) * scaleX;
                sc.panY = sc.lastPanY + (e.clientY - sc.dragStartY) * scaleY;
                clampPan(canvas.width, canvas.height);
            } else {
                // Cursor feedback: pointer when over a star or label
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                const mx = (e.clientX - rect.left) * scaleX;
                const my = (e.clientY - rect.top) * scaleY;
                const wx = (mx - sc.panX) / sc.scale;
                const wy = (my - sc.panY) / sc.scale;
                const hitR = 15 / sc.scale;
                let hovering = false;
                // Check star dots
                for (const star of gameState.stars) {
                    if (Math.hypot(star.skyX - wx, star.skyY - wy) < hitR) { hovering = true; break; }
                }
                // Check dynamic stars
                if (!hovering && gameState.dynamicStars) {
                    for (const ds of gameState.dynamicStars) {
                        const pos = getDynamicStarSkyPos(ds, canvas.width, canvas.height);
                        if (Math.hypot(pos.x - wx, pos.y - wy) < hitR) { hovering = true; break; }
                    }
                }
                // Check labels
                if (!hovering) {
                    for (const lb of cachedSkyLabelBounds) {
                        if (wx >= lb.x1 && wx <= lb.x2 && wy >= lb.y1 && wy <= lb.y2) { hovering = true; break; }
                    }
                }
                canvas.style.cursor = hovering ? 'pointer' : 'default';
            }
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Clear any pending reset timer
        if (parallaxResetTimer) {
            clearTimeout(parallaxResetTimer);
            parallaxResetTimer = null;
        }

        // If we have a previous position, calculate delta and apply it
        if (lastMouseX !== null && lastMouseY !== null) {
            const deltaX = (x - lastMouseX) / canvas.width * 2;
            const deltaY = (y - lastMouseY) / canvas.height * 2;

            // Apply delta to target, clamped to -1 to 1 range
            gameState.targetMouseX = Math.max(-1, Math.min(1, gameState.targetMouseX + deltaX));
            gameState.targetMouseY = Math.max(-1, Math.min(1, gameState.targetMouseY + deltaY));
        }

        // Store current position for next frame
        lastMouseX = x;
        lastMouseY = y;

        // Cursor feedback: pointer when over a star or label
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mx = x * scaleX;
        const my = y * scaleY;
        const pOffX = gameState.parallaxOffsetX * 0.3;
        const pOffY = gameState.parallaxOffsetY * 0.3;
        let hovering = false;
        for (const star of gameState.stars) {
            if (Math.hypot(star.x + pOffX - mx, star.y + pOffY - my) < 10) { hovering = true; break; }
        }
        if (!hovering && gameState.dynamicStars) {
            for (const ds of gameState.dynamicStars) {
                if (Math.hypot(ds.x * canvas.width + pOffX - mx, ds.y * canvas.height + pOffY - my) < 15) { hovering = true; break; }
            }
        }
        if (!hovering) {
            for (const lb of cachedArrayLabelBounds) {
                if (mx >= lb.x1 && mx <= lb.x2 && my >= lb.y1 && my <= lb.y2) { hovering = true; break; }
            }
        }
        canvas.style.cursor = hovering ? 'pointer' : 'default';
    });

    // Start reset timer when mouse leaves (5 second delay)
    canvas.addEventListener('mouseleave', () => {
        lastMouseX = null;
        lastMouseY = null;
        parallaxResetTimer = setTimeout(() => {
            gameState.targetMouseX = 0;
            gameState.targetMouseY = 0;
            parallaxResetTimer = null;
        }, 5000);
    });

    // Cancel reset timer if mouse enters again
    canvas.addEventListener('mouseenter', () => {
        if (parallaxResetTimer) {
            clearTimeout(parallaxResetTimer);
            parallaxResetTimer = null;
        }
        // lastMouseX/Y stay null until first mousemove, so no snap
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        // Scale CSS coordinates to canvas pixel coordinates
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        if (gameState.starmapMode === 'skychart') {
            // Inverse zoom transform to get world coordinates
            const sc = gameState.skyChart;
            const wx = (x - sc.panX) / sc.scale;
            const wy = (y - sc.panY) / sc.scale;
            const hitRadius = 15 / sc.scale;

            // Check scan/decrypt box click (box is in world coords)
            if (gameState.selectedStarId !== null) {
                const star = getSelectedStar();
                if (star) {
                    let sx, sy;
                    if (star.isDynamic) {
                        const pos = getDynamicStarSkyPos(star, canvas.width, canvas.height);
                        sx = pos.x; sy = pos.y;
                    } else {
                        sx = star.skyX; sy = star.skyY;
                    }
                    const boxWidth = 120 / sc.scale;
                    const boxHeight = 60 / sc.scale;
                    let boxX = sx + 40 / sc.scale;
                    const boxY = sy - 20 / sc.scale;
                    if (boxX + boxWidth > canvas.width - 10 / sc.scale) boxX = sx - boxWidth - 10 / sc.scale;
                    if (boxX < 10 / sc.scale) boxX = 10 / sc.scale;

                    if (wx >= boxX && wx <= boxX + boxWidth && wy >= boxY && wy <= boxY + boxHeight) {
                        // Check if this is a decrypt box or scan box
                        const isDecryptBox = !star.isDynamic && star.id === 8 && !gameState.decryptionComplete && gameState.currentDay >= 2;
                        if (isDecryptBox && startDirectDecryptionFn) {
                            playClick();
                            startDirectDecryptionFn();
                            return;
                        } else if (gameState.showScanConfirm) {
                            startScanSequence();
                            return;
                        }
                    }
                }
            }

            // Check dynamic stars
            let clickedDynamic = false;
            if (gameState.dynamicStars) {
                for (const dStar of gameState.dynamicStars) {
                    const pos = getDynamicStarSkyPos(dStar, canvas.width, canvas.height);
                    const ddist = Math.sqrt((pos.x - wx) ** 2 + (pos.y - wy) ** 2);
                    if (ddist < hitRadius) {
                        selectDynamicStar(dStar);
                        clickedDynamic = true;
                        break;
                    }
                }
            }

            if (!clickedDynamic) {
                // Check catalog stars at sky positions — find closest match
                let closestDist = hitRadius;
                let closestStar = null;
                gameState.stars.forEach(star => {
                    const dx = star.skyX - wx;
                    const dy = star.skyY - wy;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < closestDist) {
                        closestDist = distance;
                        closestStar = star;
                    }
                });
                if (closestStar) {
                    gameState.selectedStarId = closestStar.id;
                    selectStar(closestStar.id);
                } else {
                    // Check if click is on a label (world coords)
                    let clickedLabel = false;
                    for (const lb of cachedSkyLabelBounds) {
                        if (wx >= lb.x1 && wx <= lb.x2 && wy >= lb.y1 && wy <= lb.y2) {
                            gameState.selectedStarId = lb.starId;
                            selectStar(lb.starId);
                            clickedLabel = true;
                            break;
                        }
                    }
                    if (!clickedLabel) deselectStar();
                }
            }
            return;
        }

        // Array view click handling
        // Current parallax offset applied to stars during rendering
        const pOffX = gameState.parallaxOffsetX * 0.3;
        const pOffY = gameState.parallaxOffsetY * 0.3;

        // Check if clicking on scan/decrypt confirmation box
        if (gameState.selectedStarId !== null) {
            const star = getSelectedStar();
            if (star) {
                const pos = getStarPixelXY(star, canvas.width, canvas.height);
                const positionedStar = star.isDynamic ? { ...star, x: pos.x, y: pos.y } : star;
                const { boxX, boxY, boxWidth, boxHeight } = calculateScanBoxPosition(positionedStar, canvas.width);

                if (x >= boxX && x <= boxX + boxWidth && y >= boxY && y <= boxY + boxHeight) {
                    const isDecryptBox = !star.isDynamic && star.id === 8 && !gameState.decryptionComplete && gameState.currentDay >= 2;
                    if (isDecryptBox && startDirectDecryptionFn) {
                        playClick();
                        startDirectDecryptionFn();
                        return;
                    } else if (gameState.showScanConfirm) {
                        startScanSequence();
                        return;
                    }
                }
            }
        }

        // Check dynamic stars first
        let clickedDynamic = false;
        if (gameState.dynamicStars) {
            for (const dStar of gameState.dynamicStars) {
                const dsx = dStar.x * canvas.width + pOffX;
                const dsy = dStar.y * canvas.height + pOffY;
                const ddist = Math.sqrt((dsx - x) ** 2 + (dsy - y) ** 2);
                if (ddist < 15) {
                    selectDynamicStar(dStar);
                    clickedDynamic = true;
                    break;
                }
            }
        }

        if (!clickedDynamic) {
            // Find clicked catalog star — closest match
            let closestDist = 10;
            let closestStar = null;
            gameState.stars.forEach(star => {
                const sx = star.x + pOffX;
                const sy = star.y + pOffY;
                const dx = sx - x;
                const dy = sy - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < closestDist) {
                    closestDist = distance;
                    closestStar = star;
                }
            });
            if (closestStar) {
                gameState.selectedStarId = closestStar.id;
                selectStar(closestStar.id);
            } else {
                // Check if click is on a label (screen coords)
                let clickedLabel = false;
                for (const lb of cachedArrayLabelBounds) {
                    if (x >= lb.x1 && x <= lb.x2 && y >= lb.y1 && y <= lb.y2) {
                        gameState.selectedStarId = lb.starId;
                        selectStar(lb.starId);
                        clickedLabel = true;
                        break;
                    }
                }
                if (!clickedLabel) deselectStar();
            }
        }
    });

    // Mouse wheel zoom for sky chart mode
    canvas.addEventListener('wheel', (e) => {
        if (gameState.starmapMode !== 'skychart') return;
        e.preventDefault();

        const sc = gameState.skyChart;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;

        const oldScale = sc.scale;
        const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
        sc.scale = Math.max(1, Math.min(4, sc.scale * zoomFactor));

        // Play zoom sound if scale actually changed
        if (sc.scale !== oldScale) {
            if (e.deltaY < 0) playZoomIn(); else playZoomOut();
        }

        // Zoom toward cursor
        sc.panX = mx - (mx - sc.panX) * (sc.scale / oldScale);
        sc.panY = my - (my - sc.panY) * (sc.scale / oldScale);
        clampPan(canvas.width, canvas.height);
    }, { passive: false });

    // Mouse down for pan dragging in sky chart mode
    canvas.addEventListener('mousedown', (e) => {
        if (gameState.starmapMode !== 'skychart') return;
        // Right-click or middle-click or shift+click to pan
        if (e.button === 1 || e.shiftKey) {
            e.preventDefault();
            const sc = gameState.skyChart;
            sc.isDragging = true;
            sc.dragStartX = e.clientX;
            sc.dragStartY = e.clientY;
            sc.lastPanX = sc.panX;
            sc.lastPanY = sc.panY;
        }
    });

    // Global mouseup to stop dragging
    window.addEventListener('mouseup', () => {
        gameState.skyChart.isDragging = false;
    });
}

// Setup starmap mode toggle button and zoom controls
export function setupStarmapToggle() {
    const toggleBtn = document.getElementById('starmap-mode-toggle');
    const zoomControls = document.getElementById('sky-chart-zoom-controls');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const zoomResetBtn = document.getElementById('zoom-reset-btn');
    const canvas = document.getElementById('starmap-canvas');

    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        playClick();
        if (gameState.starmapMode === 'array') {
            gameState.starmapMode = 'skychart';
            toggleBtn.textContent = 'ARRAY VIEW';
            if (zoomControls) zoomControls.style.display = 'flex';
        } else {
            gameState.starmapMode = 'array';
            toggleBtn.textContent = 'SKY CHART';
            if (zoomControls) zoomControls.style.display = 'none';
            // Reset zoom/pan when switching back
            gameState.skyChart.scale = 1;
            gameState.skyChart.panX = 0;
            gameState.skyChart.panY = 0;
        }
    });

    // Zoom helper: zoom toward canvas center
    function zoomCenter(factor) {
        const sc = gameState.skyChart;
        const w = canvas.width, h = canvas.height;
        const mx = w / 2, my = h / 2;
        const oldScale = sc.scale;
        sc.scale = Math.max(1, Math.min(4, sc.scale * factor));
        sc.panX = mx - (mx - sc.panX) * (sc.scale / oldScale);
        sc.panY = my - (my - sc.panY) * (sc.scale / oldScale);
        clampPan(w, h);
    }

    if (zoomInBtn) zoomInBtn.addEventListener('click', () => { playZoomIn(); zoomCenter(1.3); });
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => { playZoomOut(); zoomCenter(1 / 1.3); });
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => {
        playClick();
        gameState.skyChart.scale = 1;
        gameState.skyChart.panX = 0;
        gameState.skyChart.panY = 0;
    });
}

// Setup back/continue buttons event listeners
export function setupNavigationButtons() {
    document.getElementById('back-btn').addEventListener('click', () => {
        playClick();
        gameState.tuningActive = false;
        document.getElementById('tuning-game').style.display = 'none';
        document.getElementById('contact-protocol-box').style.display = 'none';
        if (stopSignalAnimationFn) stopSignalAnimationFn();
        gameState.currentSignal = null;
        gameState.showScanConfirm = false;
        gameState.selectedStarId = null;

        // Clear catalog selection highlight
        document.querySelectorAll('.star-item').forEach(item => item.classList.remove('selected'));

        // Reset star info panel
        document.getElementById('star-details').innerHTML = '<div class="detail-label">SELECT A TARGET</div>';
        clearStarVisualization();

        // Reset scan button for next star
        const scanBtn = document.getElementById('scan-btn');
        scanBtn.disabled = false;
        scanBtn.textContent = 'INITIATE SCAN';

        // Hide starmap analysis button
        const starmapScanBtn = document.getElementById('starmap-array-scan-btn');
        if (starmapScanBtn) starmapScanBtn.style.display = 'none';

        // Stop ambient sounds
        stopNaturalPhenomenaSound();
        stopAlienSignalSound();
        stopFragmentSignalSound();
        stopStaticHiss();
        stopTuningTone();

        // Switch back to background music when returning to map
        switchToBackgroundMusic();

        showView('starmap-view');
        log('Returned to stellar catalog');

        // Check if day is complete
        checkAndShowDayComplete();

        // Check if all stars have been analyzed
        checkForEndState();
    });

    document.getElementById('continue-btn').addEventListener('click', () => {
        playClick();
        gameState.tuningActive = false;
        document.getElementById('tuning-game').style.display = 'none';
        document.getElementById('contact-protocol-box').style.display = 'none';
        if (stopSignalAnimationFn) stopSignalAnimationFn();
        gameState.currentSignal = null;
        gameState.showScanConfirm = false;
        gameState.selectedStarId = null;

        // Clear catalog selection highlight
        document.querySelectorAll('.star-item').forEach(item => item.classList.remove('selected'));

        // Reset star info panel
        document.getElementById('star-details').innerHTML = '<div class="detail-label">SELECT A TARGET</div>';
        clearStarVisualization();

        // Reset scan button for next star
        const scanBtn = document.getElementById('scan-btn');
        scanBtn.disabled = false;
        scanBtn.textContent = 'INITIATE SCAN';

        // Hide starmap analysis button
        const starmapScanBtn = document.getElementById('starmap-array-scan-btn');
        if (starmapScanBtn) starmapScanBtn.style.display = 'none';

        // Stop ambient sounds
        stopNaturalPhenomenaSound();
        stopAlienSignalSound();
        stopFragmentSignalSound();
        stopStaticHiss();
        stopTuningTone();

        // Switch back to background music
        switchToBackgroundMusic();

        showView('starmap-view');
        log('Returned to stellar catalog');

        // Check if day is complete
        checkAndShowDayComplete();

        // Check if all stars have been analyzed
        checkForEndState();
    });
}
