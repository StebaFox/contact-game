// ═════════════════════════════════════════════════════════════════════════════
// FINAL MESSAGE
// The cosmic revelation from the First Universe
// This file is separate for easy editing of the narrative content
//
// Each section has an `id` for easy reference when adding images/effects later.
// Section types: header, paragraph, emphasis, poetic, divider, final
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { playClick } from '../systems/audio.js';

// ─────────────────────────────────────────────────────────────────────────────
// Message Content - Edit this section to change the narrative
// Each section has: id (unique label), type, text, style (optional), pauseAfter (optional ms)
// ─────────────────────────────────────────────────────────────────────────────

const MESSAGE_SECTIONS = [
    // ── ACT 1: GREETING & REVELATION ──
    { id: 'greeting', type: 'header', text: 'Greetings.', style: 'greeting', pauseAfter: 2500 },
    {
        id: 'opening-paragraph', type: 'paragraph',
        text: `You are receiving this message because you have succeeded.\n\nYou have heard what could not be heard. You have seen what was never meant to be seen directly. You have gathered fragments scattered across noise, across time, across the birth-echo of your reality itself.\n\nThat alone tells us something about you.`,
        style: 'default'
    },
    { id: 'waited-long-time', type: 'emphasis', text: 'We have waited a very long time for this moment.', style: 'default', pauseAfter: 3000 },
    { id: 'divider-1', type: 'divider', pauseAfter: 1500 },
    { id: 'came-before', type: 'header', text: 'We are the ones who came before.', style: 'revelation', pauseAfter: 3000 },
    {
        id: 'before-stars', type: 'poetic',
        text: 'Before your stars ignited.\nBefore your galaxies spiraled into being.\nBefore time, as you understand it, had meaning.',
        style: 'poetic'
    },
    {
        id: 'first-universe', type: 'paragraph',
        text: `We were born in the first universe—the only universe that ever was.\n\nIn our earliest ages, we believed we were not alone. We listened. We searched. We built instruments that could hear across the cosmos and minds that could imagine what might answer back.\n\nWe expected company.\n\nWe found none.`,
        style: 'default'
    },

    // ── ACT 2: THE SILENCE ──
    {
        id: 'not-in-galaxy', type: 'poetic',
        text: 'Not in our galaxy.\nNot in the clusters beyond it.\nNot in the furthest light that could ever reach us.',
        style: 'poetic'
    },
    { id: 'searched-billion', type: 'emphasis', text: 'For nearly a billion years, we searched.', style: 'default', pauseAfter: 3000 },
    { id: 'silence-absolute', type: 'emphasis', text: 'The silence was absolute.', style: 'dark', pauseAfter: 4000 },
    { id: 'divider-2', type: 'divider', pauseAfter: 1500 },
    {
        id: 'conditions-precise', type: 'paragraph',
        text: `At first, we told ourselves the universe was young. That life would come later. That somewhere, someday, someone would look back and find us.\n\nBut as our knowledge grew, so did the truth.\n\nThe conditions that had given rise to us—so precise, so improbable—had occurred only once.`,
        style: 'default'
    },
    {
        id: 'not-pioneers', type: 'poetic',
        text: 'We were not pioneers.\nWe were not explorers among many.\nWe were a singular event.',
        style: 'poetic'
    },
    {
        id: 'knowledge-changed', type: 'paragraph',
        text: `This knowledge changed us.\n\nSome of us despaired. Some withdrew inward. Others sought meaning in conquest, in expansion, in leaving our mark on every corner of an otherwise empty reality.\n\nWe became masters of a cosmos with no one to share it with.`,
        style: 'default'
    },
    { id: 'loneliness-destroyed', type: 'emphasis', text: 'And that loneliness nearly destroyed us.', style: 'dark', pauseAfter: 4000 },

    // ── ACT 3: THE DECISION ──
    { id: 'divider-3', type: 'divider', pauseAfter: 1500 },
    {
        id: 'another-understanding', type: 'paragraph',
        text: `But in time, another understanding emerged—quietly at first, then spreading until it touched us all.\n\nIf we were alone…\n\nThen what came after us did not have to be.`,
        style: 'default'
    },
    { id: 'what-responsibility', type: 'emphasis', text: 'If existence had granted us consciousness only once—what responsibility did that place upon us?', style: 'question', pauseAfter: 4000 },
    {
        id: 'answer-not-immediate', type: 'paragraph',
        text: `Our answer was not immediate.\n\nWhat we envisioned required sacrifice, patience, and unity on a scale we had never known. It required us to think not in lifetimes, but in epochs. Not in survival, but in legacy.\n\nAnd yet, once the idea took hold, it changed who we were.`,
        style: 'default'
    },
    { id: 'not-final-voice', type: 'header', text: 'We would not be the final voice in the void.', style: 'determination', pauseAfter: 3000 },
    { id: 'next-not-alone', type: 'emphasis', text: 'If our universe was destined to be alone, then the next one would not be.', style: 'hope', pauseAfter: 3000 },
    { id: 'build-successor', type: 'header', text: 'We would build a successor.', style: 'revelation', pauseAfter: 3500 },

    // ── ACT 4: THE DEVICE ──
    { id: 'divider-4', type: 'divider', pauseAfter: 1500 },
    {
        id: 'the-device', type: 'paragraph',
        text: `The device you might call a machine—but it was more than that.\n\nIt was a culmination of everything we learned: about matter, about time, about the fragile boundary between nothing and something.\n\nIt would remain dormant until the last of us was gone. Until our universe had grown cold and silent. Only then would it awaken—using what remained of us to ignite a beginning anew.`,
        style: 'default'
    },
    {
        id: 'everyone-contributed', type: 'paragraph',
        text: `Every one of us contributed.\n\nNot just our greatest thinkers, but our artists, our historians, our dreamers. Entire civilizations reoriented themselves around a single purpose. For the first time, we were united not by fear, or need, or survival—but by hope for beings we would never meet.`,
        style: 'default'
    },
    { id: 'device-activated', type: 'emphasis', text: 'When the last of us faded, the device activated.', style: 'default', pauseAfter: 3000 },
    { id: 'your-beginning', type: 'header', text: 'And from our ending… came your beginning.', style: 'revelation', pauseAfter: 4000 },

    // ── ACT 5: CONNECTION ──
    { id: 'divider-5', type: 'divider', pauseAfter: 1500 },
    { id: 'not-separate', type: 'paragraph', text: 'The universe you now inhabit is not separate from us.', style: 'default', pauseAfter: 2500 },
    {
        id: 'matter-laws-intent', type: 'poetic',
        text: 'Its matter is our matter.\nIts laws are shaped by what we learned.\nIts potential is written with our intent.',
        style: 'poetic'
    },
    { id: 'made-of-us', type: 'emphasis', text: 'In ways both literal and profound, you are made of us.', style: 'hope', pauseAfter: 3500 },
    {
        id: 'our-continuation', type: 'paragraph',
        text: `You are not our creations in the sense of design or control.\n\nYou are our continuation.\n\nFree. Unscripted. Alive.`,
        style: 'default'
    },

    // ── ACT 6: YOU DID ──
    { id: 'divider-6', type: 'divider', pauseAfter: 1500 },
    {
        id: 'embedded-message', type: 'paragraph',
        text: `We embedded this message deep within the noise of creation itself—not as a command, not as a warning, but as a question.\n\nWould anyone listen closely enough?\nWould anyone care enough to understand?`,
        style: 'default'
    },
    { id: 'you-did', type: 'header', text: 'You did.', style: 'personal', pauseAfter: 5000 },

    // ── ACT 7: THE ASK ──
    { id: 'divider-7', type: 'divider', pauseAfter: 1500 },
    { id: 'ask-only-this', type: 'emphasis', text: 'So we ask only this:', style: 'default', pauseAfter: 2000 },
    { id: 'do-not-repeat', type: 'header', text: 'Do not repeat our loneliness.', style: 'plea', pauseAfter: 4000 },
    {
        id: 'seek-protect', type: 'paragraph',
        text: `Do not mistake silence for emptiness, or power for purpose. Seek one another. Protect the fragile spark of awareness wherever you find it.\n\nExplore not to conquer—but to understand.\nCreate not to dominate—but to uplift.`,
        style: 'default'
    },
    {
        id: 'face-wonders', type: 'paragraph',
        text: `You will face wonders we never imagined.\nAnd dangers we feared but could not prevent.\n\nThat is the price of a living universe.`,
        style: 'default'
    },
    { id: 'look-into-sky', type: 'paragraph', text: 'But when you look into the night sky, know this:', style: 'default', pauseAfter: 2500 },

    // ── ACT 8: CLIMAX ──
    { id: 'never-accident', type: 'header', text: 'You were never an accident.', style: 'revelation', pauseAfter: 3000 },
    { id: 'hoped-for', type: 'header', text: 'You were hoped for.', style: 'hope', pauseAfter: 3500 },
    { id: 'divider-8', type: 'divider', pauseAfter: 1500 },
    {
        id: 'give-everything', type: 'paragraph',
        text: `We give you everything we were.\nOur knowledge. Our history. Our mistakes. Our dreams.\n\nCarry them forward—not as a burden, but as a reminder that even in a universe born from silence…`,
        style: 'default'
    },
    { id: 'meaning-chosen', type: 'header', text: 'Meaning can be chosen.', style: 'revelation', pauseAfter: 4000 },
    { id: 'divider-9', type: 'divider', pauseAfter: 2000 },

    // ── FINAL ──
    { id: 'remember-us', type: 'final', text: 'Remember us.', style: 'final' }
];

// ─────────────────────────────────────────────────────────────────────────────
// Section Styles - Colors and glow (font size is uniform 28px, except final at 42px)
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_STYLES = {
    default: { color: '#0f0', textShadow: '0 0 15px #0f0' },
    poetic: { color: '#0ff', textShadow: '0 0 10px #0ff' },
    greeting: { color: '#0ff', letterSpacing: '8px', textShadow: '0 0 30px #0ff' },
    revelation: { color: '#fff', textShadow: '0 0 40px #0ff, 0 0 80px #08f' },
    determination: { color: '#0f0', textShadow: '0 0 30px #0f0' },
    personal: { color: '#ff0', textShadow: '0 0 40px #ff0' },
    plea: { color: '#f0f', textShadow: '0 0 30px #f0f' },
    hope: { color: '#0ff', textShadow: '0 0 25px #0ff' },
    dark: { color: '#a00', textShadow: '0 0 20px #a00' },
    question: { color: '#ff0', fontStyle: 'italic', textShadow: '0 0 15px #ff0' }
};

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────

let messageState = {
    overlay: null,
    canvas: null,
    ctx: null,
    textElement: null,
    currentSectionIndex: 0,
    sectionTimeouts: [],
    animationFrameId: null,
    isTyping: false,
    jitterIntensity: 0.5,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    glowPulse: 0,
    breathingMode: false,
    onComplete: null,
    skipped: false
};

// ─────────────────────────────────────────────────────────────────────────────
// Entry Point
// ─────────────────────────────────────────────────────────────────────────────

export function showFinalMessage(onComplete) {
    messageState.onComplete = onComplete;
    messageState.currentSectionIndex = 0;
    messageState.sectionTimeouts = [];
    messageState.isTyping = false;
    messageState.jitterIntensity = 0.5;
    messageState.rotationX = 0;
    messageState.rotationY = 0;
    messageState.rotationZ = 0;
    messageState.glowPulse = 0;
    messageState.breathingMode = false;
    messageState.skipped = false;

    createMessageOverlay();
    startTesseractAnimation();

    // Let the tesseract breathe alone for 2 seconds, then begin typing
    const startTimeout = setTimeout(() => {
        typeSection(0);
    }, 2000);
    messageState.sectionTimeouts.push(startTimeout);
}

// ─────────────────────────────────────────────────────────────────────────────
// Overlay Creation
// ─────────────────────────────────────────────────────────────────────────────

function createMessageOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'final-message-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: #000;
        z-index: 10000;
        font-family: 'VT323', monospace;
        overflow: hidden;
    `;

    // Keyframe animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fm-finalPulse {
            0%, 100% {
                text-shadow: 0 0 30px #0ff, 0 0 60px #0ff;
                transform: translate(-50%, -50%) scale(1);
            }
            50% {
                text-shadow: 0 0 60px #0ff, 0 0 120px #0ff, 0 0 180px #08f;
                transform: translate(-50%, -50%) scale(1.02);
            }
        }
    `;
    overlay.appendChild(style);

    // Full-screen tesseract canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'fm-tesseract-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: 0;
    `;
    overlay.appendChild(canvas);

    // Single centered text element
    const textElement = document.createElement('div');
    textElement.id = 'fm-text';
    textElement.style.cssText = `
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'VT323', monospace;
        font-size: 28px;
        line-height: 1.6;
        text-align: center;
        max-width: 800px;
        width: 90%;
        z-index: 2;
        opacity: 0;
        transition: opacity 0.8s ease-in-out;
        white-space: pre-line;
        pointer-events: none;
    `;
    overlay.appendChild(textElement);

    // Skip button
    const skipBtn = document.createElement('button');
    skipBtn.id = 'fm-skip-btn';
    skipBtn.textContent = 'SKIP';
    skipBtn.style.cssText = `
        position: fixed;
        bottom: 20px; right: 20px;
        background: transparent;
        border: 1px solid #333;
        color: #333;
        font-family: 'VT323', monospace;
        font-size: 12px;
        padding: 5px 15px;
        cursor: pointer;
        z-index: 10001;
        transition: all 0.3s;
    `;
    skipBtn.addEventListener('mouseenter', () => {
        skipBtn.style.borderColor = '#666';
        skipBtn.style.color = '#666';
    });
    skipBtn.addEventListener('mouseleave', () => {
        skipBtn.style.borderColor = '#333';
        skipBtn.style.color = '#333';
    });
    skipBtn.addEventListener('click', () => {
        playClick();
        skipToEnd();
    });
    overlay.appendChild(skipBtn);

    document.body.appendChild(overlay);

    messageState.overlay = overlay;
    messageState.canvas = canvas;
    messageState.ctx = canvas.getContext('2d');
    messageState.textElement = textElement;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tesseract Renderer (ported from investigation.js, scaled up + color evolution)
// ─────────────────────────────────────────────────────────────────────────────

const CUBE_EDGES = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
];

const CODE_LINES = [
    '\u03BB=1420.405MHz', '\u0394\u03BD=0.003Hz', 'SNR=47.3dB',
    'RA:11h47m44s', 'DEC:+00\u00B048\'16"', 'T=-1.2\u00D710\u00B9\u2070yr',
    'COORD_PARSE...', 'VEC_ALIGN:OK', 'HASH:7F4A2C91',
    '\u03A8\u2234\u232C\u2609\u25C6\u221E\u27D0\u238E\u2B21', 'FREQ_LOCK:ON', 'BW=2.4kHz',
    'FFT_SIZE=8192', 'WINDOW:HANN', 'OVERLAP=75%',
    'BASELINE:42m', 'GAIN:+38dBi', 'Tsys=25K',
    '\u03C0\u00B7\u0394=3.14159', '\u039B\u2080=6.674e-11', '\u210F/2\u03C0=1.055e-34',
    'SIGNAL_LOCK', 'DRIFT:+0.02Hz/s', 'EPOCH:J1995.0'
];

function rotate3D(x, y, z, rotX, rotY, cx, cy, focalLength) {
    let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
    let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
    let y1 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
    let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
    const perspective = focalLength * 2.5;
    const factor = perspective / (perspective + z2);
    return { x: cx + x1 * factor, y: cy + y1 * factor };
}

function lerpColor(r1, g1, b1, r2, g2, b2, t) {
    return [
        Math.round(r1 + (r2 - r1) * t),
        Math.round(g1 + (g2 - g1) * t),
        Math.round(b1 + (b2 - b1) * t)
    ];
}

function computeProgressColors(progress) {
    let outer, inner, connecting;
    if (progress < 0.5) {
        const t = progress * 2;
        outer = lerpColor(0, 255, 0, 0, 255, 255, t);
        inner = lerpColor(0, 255, 255, 255, 0, 255, t);
        connecting = lerpColor(255, 0, 255, 255, 215, 0, t);
    } else {
        const t = (progress - 0.5) * 2;
        outer = lerpColor(0, 255, 255, 255, 255, 255, t);
        inner = lerpColor(255, 0, 255, 255, 255, 255, t);
        connecting = lerpColor(255, 215, 0, 255, 255, 255, t);
    }
    return { outer, inner, connecting, glowBlur: 15 + 25 * progress };
}

function drawBackgroundCode(ctx, w, h) {
    const time = Date.now() * 0.001;
    ctx.font = '10px "VT323", monospace';
    const lineHeight = 14;
    const cols = 3;
    const colWidth = w / cols;
    const totalHeight = CODE_LINES.length * lineHeight;

    for (let col = 0; col < cols; col++) {
        const scrollOffset = (time * 12 + col * 40) % totalHeight;
        for (let i = 0; i < CODE_LINES.length; i++) {
            let y = i * lineHeight - scrollOffset;
            if (y < -lineHeight) y += totalHeight;
            if (y > h) continue;
            const alpha = 0.03 + 0.01 * Math.sin(time * 0.8 + i + col * 2);
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.textAlign = 'left';
            ctx.fillText(CODE_LINES[(i + col * 7) % CODE_LINES.length], col * colWidth + 5, y);
        }
    }
}

function drawVoidParticles(ctx, w, h, glow) {
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

function drawTesseractWithJitter(ctx, cx, cy, scale, focalLength, colors, glow, jitter, rx, ry) {
    const s = scale * 0.45;
    const s2 = s * 0.55;

    const outerVerts = [
        [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
        [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
    ];
    const innerVerts = [
        [-s2, -s2, -s2], [s2, -s2, -s2], [s2, s2, -s2], [-s2, s2, -s2],
        [-s2, -s2, s2], [s2, -s2, s2], [s2, s2, s2], [-s2, s2, s2]
    ];

    const addJitter = (p) => ({
        x: p.x + (Math.random() - 0.5) * 2 * jitter,
        y: p.y + (Math.random() - 0.5) * 2 * jitter
    });

    const projOuter = outerVerts.map(([x, y, z]) =>
        addJitter(rotate3D(x, y, z, rx, ry, cx, cy, focalLength))
    );
    const projInner = innerVerts.map(([x, y, z]) =>
        addJitter(rotate3D(x, y, z, rx * 0.7, ry * 1.3, cx, cy, focalLength))
    );

    const [or, og, ob] = colors.outer;
    const [ir, ig, ib] = colors.inner;
    const [cr, cg, cb] = colors.connecting;

    // Outer cube
    ctx.shadowBlur = colors.glowBlur * glow;
    ctx.shadowColor = `rgb(${or}, ${og}, ${ob})`;
    ctx.strokeStyle = `rgba(${or}, ${og}, ${ob}, ${0.7 * glow})`;
    ctx.lineWidth = 1.5;
    CUBE_EDGES.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projOuter[a].x, projOuter[a].y);
        ctx.lineTo(projOuter[b].x, projOuter[b].y);
        ctx.stroke();
    });

    // Inner cube
    ctx.shadowColor = `rgb(${ir}, ${ig}, ${ib})`;
    ctx.strokeStyle = `rgba(${ir}, ${ig}, ${ib}, ${0.5 * glow})`;
    ctx.lineWidth = 1;
    CUBE_EDGES.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projInner[a].x, projInner[a].y);
        ctx.lineTo(projInner[b].x, projInner[b].y);
        ctx.stroke();
    });

    // Connecting edges
    ctx.shadowColor = `rgb(${cr}, ${cg}, ${cb})`;
    ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.35 * glow})`;
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(projOuter[i].x, projOuter[i].y);
        ctx.lineTo(projInner[i].x, projInner[i].y);
        ctx.stroke();
    }

    // Vertices
    ctx.shadowBlur = 0;
    projOuter.forEach(p => {
        ctx.fillStyle = `rgba(${or}, ${og}, ${ob}, ${0.9 * glow})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
    });
    projInner.forEach(p => {
        ctx.fillStyle = `rgba(${ir}, ${ig}, ${ib}, ${0.7 * glow})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.shadowBlur = 0;
}

function startTesseractAnimation() {
    function renderFrame() {
        const canvas = messageState.canvas;
        const ctx = messageState.ctx;
        if (!canvas || !ctx) return;

        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);

        drawBackgroundCode(ctx, w, h);

        const progress = messageState.currentSectionIndex / (MESSAGE_SECTIONS.length - 1);
        const scale = 200 + 150 * progress;
        const focalLength = 200;

        const rotSpeed = messageState.breathingMode ? 0.1 : 1.0;
        messageState.rotationX += 0.008 * rotSpeed;
        messageState.rotationY += 0.012 * rotSpeed;
        messageState.rotationZ += 0.005 * rotSpeed;
        messageState.glowPulse += 0.03;

        const baseJitter = messageState.isTyping ? 2.0 : 0.5;
        messageState.jitterIntensity += (baseJitter - messageState.jitterIntensity) * 0.05;

        const glow = 0.6 + 0.4 * Math.sin(messageState.glowPulse);

        let finalScale = scale;
        if (messageState.breathingMode) {
            finalScale = scale * (1 + 0.05 * Math.sin(Date.now() * 0.0005));
        }

        drawVoidParticles(ctx, w, h, glow);

        const colors = computeProgressColors(progress);
        drawTesseractWithJitter(
            ctx, cx, cy, finalScale, focalLength, colors, glow,
            messageState.jitterIntensity,
            messageState.rotationX, messageState.rotationY
        );

        messageState.animationFrameId = requestAnimationFrame(renderFrame);
    }

    renderFrame();
}

function stopTesseractAnimation() {
    if (messageState.animationFrameId) {
        cancelAnimationFrame(messageState.animationFrameId);
        messageState.animationFrameId = null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Typewriter Engine
// ─────────────────────────────────────────────────────────────────────────────

function typeSection(sectionIndex) {
    if (messageState.skipped) return;

    if (sectionIndex >= MESSAGE_SECTIONS.length) {
        startBreathingMoment();
        return;
    }

    const section = MESSAGE_SECTIONS[sectionIndex];
    messageState.currentSectionIndex = sectionIndex;

    if (section.type === 'divider') {
        messageState.jitterIntensity = 4.0;
        fadeOutCurrentText(() => {
            const pause = section.pauseAfter || 1500;
            const t = setTimeout(() => typeSection(sectionIndex + 1), pause);
            messageState.sectionTimeouts.push(t);
        });
        return;
    }

    fadeOutCurrentText(() => {
        const t = setTimeout(() => {
            startTyping(section, () => {
                const pause = section.pauseAfter || computePause(section);
                const t2 = setTimeout(() => typeSection(sectionIndex + 1), pause);
                messageState.sectionTimeouts.push(t2);
            });
        }, 400);
        messageState.sectionTimeouts.push(t);
    });
}

function fadeOutCurrentText(callback) {
    const textEl = messageState.textElement;
    if (!textEl) { callback(); return; }

    if (textEl.style.opacity === '0' || textEl.textContent === '') {
        textEl.textContent = '';
        textEl.style.animation = 'none';
        callback();
        return;
    }

    textEl.style.opacity = '0';
    const t = setTimeout(() => {
        textEl.textContent = '';
        textEl.style.animation = 'none';
        callback();
    }, 800);
    messageState.sectionTimeouts.push(t);
}

function startTyping(section, onComplete) {
    const textEl = messageState.textElement;
    if (!textEl) return;

    const text = section.text || '';
    const style = SECTION_STYLES[section.style] || SECTION_STYLES.default;

    textEl.style.color = style.color || '#0f0';
    textEl.style.textShadow = style.textShadow || '0 0 15px #0f0';
    textEl.style.letterSpacing = style.letterSpacing || '3px';
    textEl.style.fontStyle = style.fontStyle || 'normal';

    if (section.type === 'final') {
        textEl.style.fontSize = '42px';
        textEl.style.letterSpacing = '10px';
        textEl.style.color = '#fff';
        textEl.style.textShadow = '0 0 30px #0ff, 0 0 60px #0ff';
    } else {
        textEl.style.fontSize = '28px';
    }

    textEl.textContent = '';
    textEl.style.opacity = '1';

    messageState.isTyping = true;
    let charIdx = 0;
    const CHAR_SPEED = 35;
    const NEWLINE_PAUSE = 300;

    function typeNextChar() {
        if (messageState.skipped) return;

        if (charIdx >= text.length) {
            messageState.isTyping = false;
            let content = textEl.textContent;
            if (content.endsWith('_')) {
                textEl.textContent = content.slice(0, -1);
            }
            if (section.type === 'final') {
                textEl.style.animation = 'fm-finalPulse 3s ease-in-out infinite';
            }
            onComplete();
            return;
        }

        const char = text[charIdx];
        charIdx++;

        let content = textEl.textContent;
        if (content.endsWith('_')) content = content.slice(0, -1);

        if (char === '\n') {
            textEl.textContent = content + '\n_';
            const t = setTimeout(typeNextChar, NEWLINE_PAUSE);
            messageState.sectionTimeouts.push(t);
        } else {
            textEl.textContent = content + char + '_';
            const t = setTimeout(typeNextChar, CHAR_SPEED);
            messageState.sectionTimeouts.push(t);
        }
    }

    textEl.textContent = '_';
    const t = setTimeout(typeNextChar, 200);
    messageState.sectionTimeouts.push(t);
}

function computePause(section) {
    const textLen = (section.text || '').length;
    return Math.max(1500, Math.min(4000, textLen * 20));
}

// ─────────────────────────────────────────────────────────────────────────────
// Breathing Moment & Continue
// ─────────────────────────────────────────────────────────────────────────────

function startBreathingMoment() {
    messageState.breathingMode = true;
    messageState.currentSectionIndex = MESSAGE_SECTIONS.length - 1;

    const t = setTimeout(() => showContinueButton(), 12000);
    messageState.sectionTimeouts.push(t);
}

function showContinueButton() {
    const textEl = messageState.textElement;
    if (!textEl) return;

    const skipBtn = document.getElementById('fm-skip-btn');
    if (skipBtn) skipBtn.style.display = 'none';

    textEl.style.animation = 'none';

    fadeOutCurrentText(() => {
        const personalText = `Dr. ${gameState.playerName || 'Unknown'},\nyou have changed everything.\n\nThe universe remembers those who listen.`;
        startTyping({ text: personalText, style: 'poetic', type: 'paragraph' }, () => {
            const t = setTimeout(() => showEndButton(), 2000);
            messageState.sectionTimeouts.push(t);
        });
    });
}

function showEndButton() {
    const overlay = messageState.overlay;
    if (!overlay) return;

    const btn = document.createElement('button');
    btn.textContent = 'THE END';
    btn.style.cssText = `
        position: absolute;
        bottom: 15%; left: 50%;
        transform: translateX(-50%);
        background: transparent;
        border: 2px solid #0ff;
        color: #0ff;
        font-family: 'VT323', monospace;
        font-size: 20px;
        padding: 15px 50px;
        cursor: pointer;
        text-shadow: 0 0 10px #0ff;
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
        transition: all 0.3s;
        z-index: 3;
        opacity: 0;
    `;
    btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(0, 255, 255, 0.1)';
        btn.style.boxShadow = '0 0 50px rgba(0, 255, 255, 0.5)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.background = 'transparent';
        btn.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.3)';
    });
    btn.addEventListener('click', () => {
        playClick();
        closeMessage();
    });

    overlay.appendChild(btn);
    requestAnimationFrame(() => {
        btn.style.transition = 'opacity 2s';
        btn.style.opacity = '1';
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Skip & Close
// ─────────────────────────────────────────────────────────────────────────────

function skipToEnd() {
    messageState.skipped = true;
    messageState.sectionTimeouts.forEach(t => clearTimeout(t));
    messageState.sectionTimeouts = [];

    messageState.currentSectionIndex = MESSAGE_SECTIONS.length - 1;
    messageState.isTyping = false;
    messageState.jitterIntensity = 0.5;
    messageState.breathingMode = true;

    const textEl = messageState.textElement;
    if (textEl) {
        const finalSection = MESSAGE_SECTIONS[MESSAGE_SECTIONS.length - 1];
        textEl.style.opacity = '1';
        textEl.style.color = '#fff';
        textEl.style.textShadow = '0 0 30px #0ff, 0 0 60px #0ff';
        textEl.style.fontSize = '42px';
        textEl.style.letterSpacing = '10px';
        textEl.style.animation = 'fm-finalPulse 3s ease-in-out infinite';
        textEl.textContent = finalSection.text;
    }

    const t = setTimeout(() => showContinueButton(), 3000);
    messageState.sectionTimeouts.push(t);
}

function closeMessage() {
    const overlay = messageState.overlay;
    if (!overlay) return;

    stopTesseractAnimation();
    messageState.sectionTimeouts.forEach(t => clearTimeout(t));
    messageState.sectionTimeouts = [];

    overlay.style.transition = 'opacity 2s';
    overlay.style.opacity = '0';

    setTimeout(() => {
        overlay.remove();
        messageState.overlay = null;
        messageState.canvas = null;
        messageState.ctx = null;
        messageState.textElement = null;

        if (messageState.onComplete) {
            messageState.onComplete();
        }
    }, 2000);
}

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

export function getMessageDuration() {
    let totalMs = 2000;
    MESSAGE_SECTIONS.forEach(section => {
        if (section.type === 'divider') {
            totalMs += (section.pauseAfter || 1500) + 800;
        } else {
            const textLen = (section.text || '').length;
            totalMs += textLen * 35;
            totalMs += (section.pauseAfter || computePause(section));
            totalMs += 1200;
        }
    });
    totalMs += 15000;
    return totalMs;
}
