// ═════════════════════════════════════════════════════════════════════════════
// INVESTIGATION PAGE — "PROJECT LIGHTHOUSE"
// Fragment display, 3D wireframe shape rendering, breadcrumb trail hub
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { showView, log } from '../ui/rendering.js';
import { playClick } from './audio.js';
import { startTriangulationMinigame } from './triangulation-minigame.js';
import { startDecryptionMinigame } from './decryption-minigame.js';
import { autoSave } from '../core/save-system.js';
import { checkAndShowDayComplete } from './day-report.js';

// ─────────────────────────────────────────────────────────────────────────────
// Investigation State
// ─────────────────────────────────────────────────────────────────────────────

// Dedicated return view for investigation (not shared with mailbox)
let investigationReturnView = 'starmap-view';

let investigationState = {
    canvas: null,
    ctx: null,
    animationId: null,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    targetShape: 0,    // 0=void, 1=point, 2=line, 3=square, 4=cube/tesseract
    currentShape: 0,
    transitionProgress: 1, // 1 = fully transitioned
    glowPulse: 0
};

// Fragment content data — scientific/alien fluff for each decoded fragment
const FRAGMENT_CONTENT = {
    src7024: {
        title: 'FRAGMENT 1: SRC-7024',
        decodedContent: [
            'π·∆ = 3.14159265358979...',
            'COORD: 11h:47m:44s / +0°48\'16"',
            'FREQ: 1420.405 MHz (H-line)',
            '▓▓▓▓▓▒▒▒░░░ 47% PARSED',
            '',
            'Sequence contains positional',
            'vectors and mathematical primes.'
        ],
        parsedPercent: 47
    },
    nexusPoint: {
        title: 'FRAGMENT 2: NEXUS POINT',
        decodedContent: [
            'Λ₀ = 6.674×10⁻¹¹ N·m²/kg²',
            'T₋₁ > 13.8×10⁹ yr',
            'DIMENSIONAL CONSTANT: ℏ/2π',
            '▓▓▓▓▓▓▓▓▒░░ 72% PARSED',
            '',
            'Physical constants from an',
            'alternate initial condition set.'
        ],
        parsedPercent: 72
    },
    eridani82: {
        title: 'FRAGMENT 3: 82 ERIDANI',
        decodedContent: [
            'BIO.SIG: ████████ CONFIRMED',
            'TECH.IDX: ████████████+ (>IX)',
            'TEMPORAL: -1.2×10¹⁰ yr (PRE-BB)',
            '▓▓▓▓▓▓▓▓▓▓▒ 89% PARSED',
            '',
            'Biological and technological',
            'markers predate known cosmology.'
        ],
        parsedPercent: 89
    },
    synthesis: {
        title: 'FRAGMENT 4: GENESIS POINT',
        decodedContent: [
            'ORIGIN: PRE-COSMIC SOURCE',
            'DIMENSIONAL BRIDGE: ACTIVE',
            'TEMPORAL: T₋∞ (BEFORE TIME)',
            '▓▓▓▓▓▓▓▓▓▓▓ 100% PARSED',
            '',
            'Complete message reconstructed.',
            'FINAL DECRYPTION AVAILABLE.'
        ],
        parsedPercent: 100
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export function openInvestigation() {
    const currentView = document.querySelector('.view.active')?.id || 'starmap-view';
    // Only capture return view from "real" views — not mailbox or other overlays
    if (currentView !== 'investigation-view' && currentView !== 'mailbox-view') {
        investigationReturnView = currentView;
    }
    showView('investigation-view');
    hideInvestigationIndicator();
    updateFragmentCards();
    updateShapeDisplay();
    startShapeAnimation();
}

export function closeInvestigation() {
    stopShapeAnimation();
    showView(investigationReturnView);
}

export function unlockInvestigation() {
    if (gameState.investigationUnlocked) return;
    gameState.investigationUnlocked = true;
    const btn = document.getElementById('investigation-btn');
    if (btn) btn.style.display = '';
    log('PROJECT LIGHTHOUSE: Investigation page unlocked', 'highlight');
    pulseInvestigationIndicator();
    autoSave();
}

export function pulseInvestigationIndicator() {
    const indicator = document.getElementById('investigation-indicator');
    if (indicator) indicator.style.display = '';
}

export function hideInvestigationIndicator() {
    const indicator = document.getElementById('investigation-indicator');
    if (indicator) indicator.style.display = 'none';
}

// Called when a new fragment is collected — update the page
export function onFragmentCollected() {
    updateFragmentCards();
    updateShapeDisplay();
    pulseInvestigationIndicator();

    // Trigger shape transition animation
    const fragCount = gameState.fragments.collected.length;
    if (fragCount !== investigationState.currentShape) {
        investigationState.targetShape = fragCount;
        investigationState.transitionProgress = 0;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Fragment Card Updates
// ─────────────────────────────────────────────────────────────────────────────

function updateFragmentCards() {
    const fragments = gameState.fragments;
    const fragCount = fragments.collected.length;

    // Progressive reveal — only show cards when the previous fragment is collected
    const frag2Visible = !!fragments.sources.src7024;
    const frag3Visible = !!fragments.sources.nexusPoint;
    const frag4Visible = fragCount >= 3;

    // Fragment 1: SRC-7024 — always visible
    updateCard(1, 'src7024', fragments.sources.src7024, {
        actionLabel: 'TRIANGULATE COORDINATES',
        actionId: 'frag1-action',
        showAction: fragments.sources.src7024 && !fragments.sources.nexusPoint && !gameState.cmbDetected
    });

    // Fragment 2: NEXUS POINT — visible after fragment 1 collected
    updateCard(2, 'nexusPoint', fragments.sources.nexusPoint, {
        visible: frag2Visible
    });

    // Fragment 3: 82 ERIDANI — visible after fragment 2 collected
    updateCard(3, 'eridani82', fragments.sources.eridani82, {
        visible: frag3Visible
    });

    // Fragment 4: GENESIS POINT — visible after all 3 fragments collected
    const hasGenesis = gameState.dynamicStars.some(s => s.id === 'genesis');
    updateCard(4, 'synthesis', fragments.sources.synthesis, {
        visible: frag4Visible,
        lockedText: hasGenesis
            ? '[SCAN GENESIS POINT TO DECODE]'
            : (fragCount >= 3 ? '[TRIANGULATE TO LOCATE SOURCE]' : `[REQUIRES 3 DECODED FRAGMENTS — ${fragCount}/3]`)
    });

    // Update action buttons
    const actionBtn = document.getElementById('investigation-action-btn');
    if (actionBtn) {
        // Only allow triangulation after the guidance emails have arrived
        const hasTriangulationEmail = gameState.mailboxMessages?.some(
            msg => msg.subject && msg.subject.includes('Pattern Emerging')
        );
        const canTriangulate = fragCount >= 3 && !fragments.sources.synthesis && !hasGenesis && hasTriangulationEmail;
        const awaitingGenesisScan = hasGenesis && !fragments.sources.synthesis;

        if (canTriangulate) {
            actionBtn.style.display = '';
            actionBtn.textContent = 'TRIANGULATE SIGNAL ORIGIN';
            actionBtn.style.opacity = '';
            actionBtn.onclick = () => {
                playClick();
                startGenesisTriangulation();
            };
        } else if (awaitingGenesisScan) {
            actionBtn.style.display = '';
            actionBtn.textContent = '► SCAN GENESIS POINT ON STARMAP';
            actionBtn.style.opacity = '0.7';
            actionBtn.onclick = () => {
                playClick();
                closeInvestigation();
            };
        } else if (fragments.sources.synthesis) {
            actionBtn.style.display = '';
            actionBtn.textContent = 'INITIATE FINAL DECRYPTION';
            actionBtn.style.opacity = '';
            actionBtn.onclick = () => {
                playClick();
                startFinalDecryption();
            };
        } else {
            actionBtn.style.display = 'none';
        }
    }

    // Update progress display
    const shapeProgress = document.getElementById('shape-progress');
    if (shapeProgress) shapeProgress.textContent = `FRAGMENTS: ${fragCount}/4`;

    const shapeForm = document.getElementById('shape-form');
    if (shapeForm) shapeForm.style.display = 'none';
}

function updateCard(cardNum, sourceKey, isDecoded, options = {}) {
    const card = document.getElementById(`fragment-card-${cardNum}`);
    const status = document.getElementById(`frag${cardNum}-status`);
    const body = document.getElementById(`frag${cardNum}-body`);
    const header = card?.querySelector('.fragment-header');
    if (!card || !body) return;

    // Hide card if not yet revealed (avoids spoilers)
    if (options.visible === false) {
        card.style.display = 'none';
        return;
    }
    card.style.display = '';

    // Update header — show real title only when decoded, otherwise hide source name
    const content = FRAGMENT_CONTENT[sourceKey];
    if (header) {
        const statusSpan = `<span class="fragment-status" id="frag${cardNum}-status">${isDecoded ? '■' : '□'}</span>`;
        header.innerHTML = isDecoded
            ? `${statusSpan} ${content.title}`
            : `${statusSpan} FRAGMENT ${cardNum}: ???`;
    }

    // Remove existing classes
    card.classList.remove('decoded', 'available');

    if (isDecoded) {
        card.classList.add('decoded');

        let html = '<div class="fragment-decoded-content">';
        content.decodedContent.forEach(line => {
            html += `<div>${line}</div>`;
        });
        html += '</div>';

        // Show action button if applicable
        if (options.showAction && options.actionLabel) {
            html += `<button class="fragment-action-btn" id="${options.actionId}">${options.actionLabel}</button>`;
        }

        body.innerHTML = html;

        // Wire up action button
        if (options.showAction && options.actionId) {
            const actionBtn = document.getElementById(options.actionId);
            if (actionBtn) {
                actionBtn.addEventListener('click', () => {
                    playClick();
                    handleFragmentAction(sourceKey);
                });
            }
        }
    } else {
        const lockedText = options.lockedText || '[AWAITING DATA]';
        body.innerHTML = `<div class="fragment-locked">${lockedText}</div>`;
    }
}

function handleFragmentAction(sourceKey) {
    if (sourceKey === 'src7024') {
        // Triangulate from Fragment 1
        log('INITIATING TRIANGULATION FROM FRAGMENT 1 COORDINATES...', 'highlight');
        startTriangulationMinigame(
            () => {
                log('TRIANGULATION COMPLETE - Deep space target located!', 'highlight');
                gameState.cmbDetected = true;
                // Add NEXUS POINT to dynamic stars
                addNexusPoint();
                autoSave();
                showView('starmap-view');
            },
            () => {
                log('Triangulation aborted.', 'warning');
                showView('investigation-view');
            }
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic Stars
// ─────────────────────────────────────────────────────────────────────────────

export function addSRC7024() {
    // Check if already added
    if (gameState.dynamicStars.find(s => s.id === 'src7024')) return;

    const src7024 = {
        id: 'src7024',
        name: 'SRC-7024',
        isDynamic: true,
        dynamicType: 'signal',  // cyan diamond
        coordinates: '11h 47m 44s / +0° 48\' 16"',
        distance: '14.2',
        starType: 'SIGNAL SOURCE',
        starClass: 'UNKNOWN',
        temperature: 'N/A',
        hasIntelligence: true,
        isFalsePositive: false,
        x: 0.72,  // Starmap position (fraction of canvas)
        y: 0.35
    };
    gameState.dynamicStars.push(src7024);
    log('NEW TARGET DETECTED: SRC-7024', 'highlight');
}

export function addNexusPoint() {
    // Check if already added
    if (gameState.dynamicStars.find(s => s.id === 'nexusPoint')) return;

    const nexusPoint = {
        id: 'nexusPoint',
        name: 'NEXUS POINT',
        isDynamic: true,
        dynamicType: 'nexus',  // magenta/white
        coordinates: '?? ?? ?? / ?? ?? ??',
        distance: '???',
        starType: 'EXTRAGALACTIC',
        starClass: 'ULTRA-DENSE',
        temperature: 'N/A',
        hasIntelligence: true,
        isFalsePositive: false,
        x: 0.85,
        y: 0.55
    };
    gameState.dynamicStars.push(nexusPoint);
    log('NEW TARGET DETECTED: NEXUS POINT', 'highlight');
}

export function addGenesisPoint() {
    if (gameState.dynamicStars.find(s => s.id === 'genesis')) return;

    const genesisPoint = {
        id: 'genesis',
        name: 'GENESIS POINT',
        isDynamic: true,
        dynamicType: 'genesis',
        coordinates: '03h 19m 28s / -16° 42\' 58"',
        distance: '???',
        starType: 'PRIMORDIAL SOURCE',
        starClass: 'PRE-COSMIC',
        temperature: 'N/A',
        hasIntelligence: true,
        isFalsePositive: false,
        x: 0.15,
        y: 0.70,
        addedAt: Date.now()
    };
    gameState.dynamicStars.push(genesisPoint);
    log('NEW TARGET DETECTED: GENESIS POINT', 'highlight');
}

// ─────────────────────────────────────────────────────────────────────────────
// Final Decryption
// ─────────────────────────────────────────────────────────────────────────────

function startGenesisTriangulation() {
    log('INITIATING GENESIS TRIANGULATION...', 'highlight');
    startTriangulationMinigame(
        () => {
            log('TRIANGULATION COMPLETE - Primordial source located!', 'highlight');
            addGenesisPoint();
            autoSave();
            showView('starmap-view');
        },
        () => {
            log('Triangulation aborted.', 'warning');
            openInvestigation();
        }
    );
}

function startFinalDecryption() {
    // Import and trigger the final cosmic message
    import('../narrative/final-message.js').then(module => {
        gameState.finalPuzzleComplete = true;
        autoSave();
        module.showFinalMessage();
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D Wireframe Shape Rendering
// Point → Line → Square → Cube → Tesseract
// ─────────────────────────────────────────────────────────────────────────────

function updateShapeDisplay() {
    const fragCount = gameState.fragments.collected.length;
    investigationState.targetShape = fragCount;
    if (investigationState.currentShape !== fragCount) {
        investigationState.transitionProgress = 0;
    }
}

function startShapeAnimation() {
    if (investigationState.animationId) return;

    investigationState.canvas = document.getElementById('investigation-canvas');
    if (!investigationState.canvas) return;
    investigationState.ctx = investigationState.canvas.getContext('2d');

    function animate() {
        renderShape();
        investigationState.animationId = requestAnimationFrame(animate);
    }
    animate();
}

function stopShapeAnimation() {
    if (investigationState.animationId) {
        cancelAnimationFrame(investigationState.animationId);
        investigationState.animationId = null;
    }
}

function drawBackgroundCode(ctx, w, h) {
    const time = Date.now() * 0.001;
    const codeLines = [
        '\u03BB=1420.405MHz', '\u0394\u03BD=0.003Hz', 'SNR=47.3dB',
        'RA:11h47m44s', 'DEC:+00\u00B048\'16"', 'T=-1.2\u00D710\u00B9\u2070yr',
        'COORD_PARSE...', 'VEC_ALIGN:OK', 'HASH:7F4A2C91',
        '\u03A8\u2234\u232C\u2609\u25C6\u221E\u27D0\u238E\u2B21', 'FREQ_LOCK:ON', 'BW=2.4kHz',
        'FFT_SIZE=8192', 'WINDOW:HANN', 'OVERLAP=75%',
        'BASELINE:42m', 'GAIN:+38dBi', 'Tsys=25K',
        '\u03C0\u00B7\u0394=3.14159', '\u039B\u2080=6.674e-11', '\u210F/2\u03C0=1.055e-34',
        'SIGNAL_LOCK', 'DRIFT:+0.02Hz/s', 'EPOCH:J1995.0'
    ];

    ctx.font = '10px "VT323", monospace';
    const lineHeight = 14;
    const cols = 3;
    const colWidth = w / cols;
    const totalHeight = codeLines.length * lineHeight;

    for (let col = 0; col < cols; col++) {
        const scrollOffset = (time * 12 + col * 40) % totalHeight;
        for (let i = 0; i < codeLines.length; i++) {
            let y = i * lineHeight - scrollOffset;
            if (y < -lineHeight) y += totalHeight;
            if (y > h) continue;
            const alpha = 0.06 + 0.02 * Math.sin(time * 0.8 + i + col * 2);
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.textAlign = 'left';
            ctx.fillText(codeLines[(i + col * 7) % codeLines.length], col * colWidth + 5, y);
        }
    }
}

function renderShape() {
    const canvas = investigationState.canvas;
    const ctx = investigationState.ctx;
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // Background data code (subtle, behind the shape)
    drawBackgroundCode(ctx, w, h);

    // Update rotation
    investigationState.rotationX += 0.008;
    investigationState.rotationY += 0.012;
    investigationState.rotationZ += 0.005;
    investigationState.glowPulse += 0.03;

    // Transition between shapes
    if (investigationState.transitionProgress < 1) {
        investigationState.transitionProgress = Math.min(1, investigationState.transitionProgress + 0.01);
        if (investigationState.transitionProgress >= 1) {
            investigationState.currentShape = investigationState.targetShape;
        }
    }

    const cx = w / 2;
    const cy = h / 2;
    const scale = 80;
    const fragCount = investigationState.currentShape;
    const t = investigationState.transitionProgress;
    const glow = 0.6 + 0.4 * Math.sin(investigationState.glowPulse);

    // CRT glow effect
    ctx.shadowBlur = 15 * glow;
    ctx.shadowColor = '#0f0';
    ctx.strokeStyle = `rgba(0, 255, 0, ${0.7 + 0.3 * glow})`;
    ctx.lineWidth = 1.5;

    // Always draw floating particles as background layer
    drawVoidParticles(ctx, w, h, glow);

    // Draw evolving shape on top
    if (fragCount === 1) {
        // Pulsing point
        drawPoint(ctx, cx, cy, scale, glow);
    } else if (fragCount === 2) {
        // Rotating line segment
        drawLine(ctx, cx, cy, scale, glow);
    } else if (fragCount === 3) {
        // Rotating square
        drawSquare(ctx, cx, cy, scale, glow);
    } else if (fragCount >= 4) {
        // Rotating tesseract (hypercube)
        drawTesseract(ctx, cx, cy, scale, glow);
    }

    // Reset shadow
    ctx.shadowBlur = 0;
}

// ── Shape Primitives ──

function drawVoidParticles(ctx, w, h, glow) {
    ctx.shadowBlur = 5;
    const time = Date.now() * 0.001;
    for (let i = 0; i < 30; i++) {
        const x = (Math.sin(time * 0.5 + i * 1.3) * 0.3 + 0.5) * w;
        const y = (Math.cos(time * 0.4 + i * 1.7) * 0.3 + 0.5) * h;
        const alpha = 0.1 + 0.15 * Math.sin(time * 2 + i);
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha * glow})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawPoint(ctx, cx, cy, scale, glow) {
    const pulse = Math.max(0.5, 3 + 4 * Math.sin(investigationState.glowPulse));
    ctx.fillStyle = `rgba(0, 255, 0, ${0.8 * glow})`;
    ctx.beginPath();
    ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
    ctx.fill();

    // Glow rings
    for (let r = 1; r <= 3; r++) {
        ctx.strokeStyle = `rgba(0, 255, 0, ${0.2 / r * glow})`;
        ctx.beginPath();
        ctx.arc(cx, cy, pulse + r * 8, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function drawLine(ctx, cx, cy, scale, glow) {
    const rx = investigationState.rotationY;
    const len = scale * 0.8;

    const x1 = cx + Math.cos(rx) * len;
    const y1 = cy + Math.sin(rx) * len * 0.3; // Perspective
    const x2 = cx - Math.cos(rx) * len;
    const y2 = cy - Math.sin(rx) * len * 0.3;

    ctx.strokeStyle = `rgba(0, 255, 0, ${0.8 * glow})`;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Endpoints
    [{ x: x1, y: y1 }, { x: x2, y: y2 }].forEach(p => {
        ctx.fillStyle = `rgba(0, 255, 0, ${0.9 * glow})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawSquare(ctx, cx, cy, scale, glow) {
    const s = scale * 0.6;
    // 2D square vertices
    const verts2D = [
        [-s, -s], [s, -s], [s, s], [-s, s]
    ];

    // Apply 3D rotation (rotate around Y and X axes for 3D effect)
    const projected = verts2D.map(([x, y]) => {
        return rotate3D(x, y, 0, investigationState.rotationX, investigationState.rotationY, cx, cy, scale);
    });

    // Draw edges
    ctx.strokeStyle = `rgba(0, 255, 0, ${0.8 * glow})`;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
        const p1 = projected[i];
        const p2 = projected[(i + 1) % 4];
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
    }
    ctx.stroke();

    // Draw vertices
    projected.forEach(p => {
        ctx.fillStyle = `rgba(0, 255, 0, ${0.9 * glow})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawTesseract(ctx, cx, cy, scale, glow) {
    const s = scale * 0.45;
    const s2 = s * 0.55; // Inner cube is smaller

    // Outer cube vertices
    const outerVerts = [
        [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
        [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
    ];

    // Inner cube vertices (smaller, offset by 4th dimension projection)
    const innerVerts = [
        [-s2, -s2, -s2], [s2, -s2, -s2], [s2, s2, -s2], [-s2, s2, -s2],
        [-s2, -s2, s2], [s2, -s2, s2], [s2, s2, s2], [-s2, s2, s2]
    ];

    // Cube edges (pairs of vertex indices)
    const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // Front face
        [4, 5], [5, 6], [6, 7], [7, 4], // Back face
        [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
    ];

    // Project all vertices
    const rx = investigationState.rotationX;
    const ry = investigationState.rotationY;
    const projOuter = outerVerts.map(([x, y, z]) => rotate3D(x, y, z, rx, ry, cx, cy, scale));
    const projInner = innerVerts.map(([x, y, z]) => rotate3D(x, y, z, rx * 0.7, ry * 1.3, cx, cy, scale));

    // Draw outer cube edges
    ctx.strokeStyle = `rgba(0, 255, 0, ${0.7 * glow})`;
    ctx.lineWidth = 1.5;
    edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projOuter[a].x, projOuter[a].y);
        ctx.lineTo(projOuter[b].x, projOuter[b].y);
        ctx.stroke();
    });

    // Draw inner cube edges
    ctx.strokeStyle = `rgba(0, 255, 255, ${0.5 * glow})`;
    ctx.lineWidth = 1;
    edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projInner[a].x, projInner[a].y);
        ctx.lineTo(projInner[b].x, projInner[b].y);
        ctx.stroke();
    });

    // Draw connecting edges (inner to outer)
    ctx.strokeStyle = `rgba(255, 0, 255, ${0.35 * glow})`;
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(projOuter[i].x, projOuter[i].y);
        ctx.lineTo(projInner[i].x, projInner[i].y);
        ctx.stroke();
    }

    // Draw vertices
    projOuter.forEach(p => {
        ctx.fillStyle = `rgba(0, 255, 0, ${0.9 * glow})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    });
    projInner.forEach(p => {
        ctx.fillStyle = `rgba(0, 255, 255, ${0.7 * glow})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

// ── 3D Projection Helpers ──

function rotate3D(x, y, z, rotX, rotY, cx, cy, focalLength) {
    // Rotate around Y axis
    let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
    let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);

    // Rotate around X axis
    let y1 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
    let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

    // Perspective projection
    const perspective = focalLength * 2.5;
    const factor = perspective / (perspective + z2);

    return {
        x: cx + x1 * factor,
        y: cy + y1 * factor
    };
}
