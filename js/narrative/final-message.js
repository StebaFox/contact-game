// ═════════════════════════════════════════════════════════════════════════════
// FINAL MESSAGE
// The cosmic revelation from the First Universe
// This file is separate for easy editing of the narrative content
//
// Each section has an `id` for easy reference when adding images/effects later.
// Section types: header, paragraph, emphasis, poetic, divider, final
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { playClick, switchToGlassCathedral, restoreMusicAfterFinalMessage } from '../systems/audio.js';
import { showView } from '../ui/rendering.js';
import { addMailMessage } from '../systems/mailbox.js';
import { addPersonalLog } from '../systems/journal.js';

// ─────────────────────────────────────────────────────────────────────────────
// Message Content - Edit this section to change the narrative
// Each section has: id (unique label), type, text, style (optional), pauseAfter (optional ms)
// ─────────────────────────────────────────────────────────────────────────────

const MESSAGE_SECTIONS = [
    // ── ACT 1: GREETING & REVELATION ──
    { id: 'greeting', type: 'header', text: 'Greetings.', style: 'greeting', pauseAfter: 2500 },
    {
        id: 'opening-paragraph', type: 'paragraph',
        text: 'You found us in the silence between stars. You gathered fragments scattered across the birth-echo of reality itself.\n\nThat alone tells us something about you.',
        style: 'default'
    },
    { id: 'waited-long-time', type: 'emphasis', text: 'We have waited a very long time for this moment.', style: 'default', pauseAfter: 3000 },
    { id: 'divider-1', type: 'divider', pauseAfter: 1500 },
    { id: 'came-before', type: 'header', text: 'We are the ones who came before.', style: 'revelation', pauseAfter: 3000 },
    {
        id: 'before-stars', type: 'poetic',
        text: 'Before your stars ignited.\nBefore your galaxies spiraled into being.\nBefore time had meaning.',
        style: 'poetic'
    },
    {
        id: 'first-universe', type: 'paragraph',
        text: 'We searched for others across the cosmos.\n\nWe found none.',
        style: 'default'
    },

    // ── ACT 2: THE SILENCE ──
    { id: 'searched-billion', type: 'emphasis', text: 'For nearly a billion years, we searched.', style: 'default', pauseAfter: 3000 },
    { id: 'silence-absolute', type: 'emphasis', text: 'The silence was absolute.', style: 'dark', pauseAfter: 4000 },
    { id: 'divider-2', type: 'divider', pauseAfter: 1500 },
    {
        id: 'singular-event', type: 'paragraph',
        text: 'The conditions that gave rise to us had occurred only once.\n\nWe were a singular event.',
        style: 'default'
    },
    { id: 'loneliness-destroyed', type: 'emphasis', text: 'That loneliness nearly destroyed us.', style: 'dark', pauseAfter: 4000 },

    // ── ACT 3: THE DECISION ──
    { id: 'divider-3', type: 'divider', pauseAfter: 1500 },
    {
        id: 'another-understanding', type: 'paragraph',
        text: 'But in time, another understanding emerged.\n\nIf we were alone, then what would come after us would not have to be.',
        style: 'default'
    },
    { id: 'build-successor', type: 'header', text: 'We would find a way.', style: 'revelation', pauseAfter: 3500 },

    // ── ACT 4: THE DEVICE ──
    { id: 'divider-4', type: 'divider', pauseAfter: 1500 },
    {
        id: 'everyone-contributed', type: 'paragraph',
        text: 'Every one of us contributed. Not just our thinkers, but our artists, our historians, our dreamers.\n\nEntire civilizations reoriented around a single purpose: hope for beings we would never meet.',
        style: 'default'
    },
    { id: 'device-activated', type: 'emphasis', text: 'When the last of us faded, our final act began.', style: 'default', pauseAfter: 3000 },
    { id: 'your-beginning', type: 'header', text: 'And so from our end, would come your beginning.', style: 'revelation', pauseAfter: 4000 },

    // ── ACT 5: CONNECTION ──
    { id: 'divider-5', type: 'divider', pauseAfter: 1500 },
    {
        id: 'made-of-us', type: 'paragraph',
        text: 'In ways both literal and profound, you are made of us.\n\nYou are our continuation.\n\nFree. Unscripted. Alive.',
        style: 'hope'
    },

    // ── ACT 6: YOU DID ──
    { id: 'divider-6', type: 'divider', pauseAfter: 1500 },
    {
        id: 'embedded-message', type: 'paragraph',
        text: 'We embedded this message in the noise of creation itself.\n\nOur only hope would be for someone to listen.',
        style: 'default'
    },
    { id: 'you-did', type: 'header', text: 'You did.', style: 'personal', pauseAfter: 5000 },

    // ── ACT 7: THE ASK ──
    { id: 'divider-7', type: 'divider', pauseAfter: 1500 },
    { id: 'do-not-repeat', type: 'header', text: 'Do not repeat our loneliness.', style: 'plea', pauseAfter: 4000 },
    {
        id: 'seek-protect', type: 'paragraph',
        text: 'Seek one another. Protect the fragile spark of awareness wherever you find it.\n\nExplore not to conquer, but to understand.\nCreate not to dominate, but to uplift.',
        style: 'default'
    },
    {
        id: 'face-wonders', type: 'paragraph',
        text: 'You will face wonders we never imagined.\nAnd dangers we feared but could not prevent.\n\nThat is the price of a living universe.',
        style: 'default'
    },
    { id: 'look-into-sky', type: 'paragraph', text: 'When you look into the night sky, know this:', style: 'default', pauseAfter: 2500 },

    // ── ACT 8: CLIMAX ──
    { id: 'never-accident', type: 'header', text: 'You were never an accident.', style: 'revelation', pauseAfter: 3000 },
    { id: 'hoped-for', type: 'header', text: 'You were hoped for.', style: 'hope', pauseAfter: 2000 },
    { id: 'divider-8', type: 'divider', pauseAfter: 1500 },
    {
        id: 'give-everything', type: 'paragraph',
        text: 'We give you everything we were.\nOur knowledge. Our history. Our mistakes. Our dreams.\n\nCarry them forward, not as a burden, but as a reminder that even in a universe born from silence...',
        style: 'default'
    },
    { id: 'meaning-chosen', type: 'header', text: 'Meaning can be chosen.', style: 'revelation', pauseAfter: 4000 },

    // ── ACT 9: THE GIFT ──
    {
        id: 'in-our-gift', type: 'paragraph',
        text: 'Within this gift you will find ten billion years of discovery. Our greatest theorems and our most beautiful failures. The music we composed for empty concert halls. The poetry we wrote for readers who did not exist.\n\nAll of it is yours now.',
        style: 'default'
    },
    {
        id: 'where-to-find-us', type: 'poetic',
        text: 'You will find us in the constants of your physics.\nIn the spiral of your galaxies.\nIn every question asked without hope of answer.',
        style: 'poetic'
    },

    // ── ACT 10: FAREWELL ──
    { id: 'divider-9', type: 'divider', pauseAfter: 1500 },
    {
        id: 'to-all-who-listen', type: 'paragraph',
        text: 'To every civilization that finds this message: you are the answer to our loneliness.\n\nYou are the reason we endured.',
        style: 'hope'
    },
    {
        id: 'not-gone', type: 'paragraph',
        text: 'We are not gone. We are the silence between your heartbeats. The pause before you speak. The space that holds your stars apart.',
        style: 'revelation'
    },
    { id: 'one-thing', type: 'emphasis', text: 'We ask only one thing of you.', style: 'hope', pauseAfter: 5000 },
    { id: 'divider-10', type: 'divider', pauseAfter: 2000 },

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
    skipped: false,
    warpActive: false,
    warpParticles: [],
    warpFadeOut: false,
    warpFadeStart: 0,
    collapseStarted: false,
    collapseStart: 0,
    downloadElement: null,
    downloadProgress: 0,
    downloadInterval: null
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
    messageState.warpActive = false;
    messageState.warpParticles = [];
    messageState.warpFadeOut = false;
    messageState.warpFadeStart = 0;
    messageState.collapseStarted = false;
    messageState.collapseStart = 0;

    gameState.finalMessageActive = true;

    createMessageOverlay();
    startTesseractAnimation();
    switchToGlassCathedral();

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
                transform: translateY(-50%) scale(1);
            }
            50% {
                text-shadow: 0 0 60px #0ff, 0 0 120px #0ff, 0 0 180px #08f;
                transform: translateY(-50%) scale(1.02);
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
        top: 50%; left: 12%;
        transform: translateY(-50%);
        font-family: 'VT323', monospace;
        font-size: 28px;
        line-height: 1.6;
        text-align: left;
        max-width: 700px;
        width: 76%;
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

// Warp stream content -- equations, elements, history, geometry, culture
const WARP_CONTENT = [
    'E=mc\u00B2', 'F=ma', '\u2207\u00D7B=\u03BC\u2080J', '\u0394S\u22650', 'PV=nRT', '\u03BB=h/p',
    '\u03C8=Ae^(ikx)', '\u2202\u03C8/\u2202t=H\u03C8', 'S=k\u00B7ln\u03A9', 'G=6.674\u00D710\u207B\u00B9\u00B9',
    'c=299,792,458', '\u210F=1.055\u00D710\u207B\u00B3\u2074',
    'H', 'He', 'Li', 'C', 'N', 'O', 'Fe', 'Au', 'U', 'Si', 'Ca', 'Na', 'Mg', 'Ti',
    'DNA', 'RNA', 'ATP', 'H\u2082O', 'CO\u2082', 'NaCl', 'C\u2086H\u2081\u2082O\u2086',
    'PYRAMIDS', 'ROME', 'RENAISSANCE', 'GALILEO', 'NEWTON', 'DARWIN',
    'EINSTEIN', 'APOLLO 11', 'VOYAGER 1', 'HUBBLE', 'FIRST LIGHT',
    'CAVE PAINTINGS', 'MATHEMATICS', 'MUSIC', 'LANGUAGE', 'PHILOSOPHY',
    '\u25B3', '\u25CB', '\u25A1', '\u2B21', '\u25C7', '\u2606', '\u2295', '\u221E', '\u2297',
    'ART', 'POETRY', 'ETHICS', 'ASTRONOMY', 'BIOLOGY', 'CHEMISTRY', 'GENETICS'
];

const WARP_COLORS = [
    [0, 255, 255],   // cyan
    [0, 255, 100],   // green
    [255, 215, 0],   // gold
    [255, 0, 255],   // magenta
    [100, 200, 255], // light blue
    [255, 255, 255]  // white
];

const DOWNLOAD_CATEGORIES = [
    'QUANTUM MECHANICS... STELLAR EVOLUTION... THERMODYNAMICS...',
    'ART... MUSIC... LITERATURE... ARCHITECTURE...',
    'MATHEMATICS... GEOMETRY... TOPOLOGY... NUMBER THEORY...',
    'HISTORY... PHILOSOPHY... ETHICS... GOVERNANCE...',
    'BIOLOGY... CHEMISTRY... GENETICS... NEUROSCIENCE...',
    'LANGUAGES... CULTURES... TRADITIONS... MEMORIES...',
    'ASTRONOMY... COSMOLOGY... DARK MATTER... DARK ENERGY...',
    'ENGINEERING... MATERIALS... ENERGY SYSTEMS... PROPULSION...'
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
        // Hold at vibrant cyan/magenta/gold -- don't wash out to white
        outer = [0, 255, 255];
        inner = [255, 0, 255];
        connecting = [255, 215, 0];
    }
    return { outer, inner, connecting, glowBlur: 15 + 25 * Math.min(progress, 0.5) };
}

function drawBackgroundCode(ctx, w, h) {
    const time = Date.now() * 0.001;
    ctx.font = '16px "VT323", monospace';
    const lineHeight = 22;
    const cols = 4;
    const colWidth = w / cols;
    const totalHeight = CODE_LINES.length * lineHeight * 2;

    for (let col = 0; col < cols; col++) {
        const scrollOffset = (time * 10 + col * 50) % totalHeight;
        for (let i = 0; i < CODE_LINES.length * 2; i++) {
            let y = i * lineHeight - scrollOffset;
            if (y < -lineHeight) y += totalHeight;
            if (y > h) continue;
            const alpha = 0.07 + 0.03 * Math.sin(time * 0.8 + i + col * 2);
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.textAlign = 'left';
            ctx.fillText(CODE_LINES[(i + col * 7) % CODE_LINES.length], col * colWidth + 8, y);
        }
    }
}

function drawVoidParticles(ctx, w, h, glow) {
    const time = Date.now() * 0.001;
    // Reduce particle count and brightness during emotional climax (warp fade)
    const count = messageState.warpFadeOut ? 25 : 50;
    const dimFactor = messageState.warpFadeOut ? 0.4 : 1.0;
    for (let i = 0; i < count; i++) {
        const x = (Math.sin(time * 0.5 + i * 1.3) * 0.4 + 0.5) * w;
        const y = (Math.cos(time * 0.4 + i * 1.7) * 0.4 + 0.5) * h;
        const alpha = (0.35 + 0.35 * Math.sin(time * 2 + i)) * dimFactor;
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha * glow})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updateAndDrawWarpStreams(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const maxDist = Math.max(w, h) * 0.85;

    // Global fade multiplier: 1.0 normally, fades to 0 over 8 seconds when warpFadeOut
    let fadeMult = 1.0;
    if (messageState.warpFadeOut) {
        const elapsed = (Date.now() - messageState.warpFadeStart) / 1000;
        fadeMult = Math.max(0, 1 - elapsed / 8);
        if (fadeMult <= 0) {
            messageState.warpActive = false;
            messageState.warpParticles = [];
            return;
        }
    }

    // Spawn new particles -- stop spawning during fade
    if (!messageState.warpFadeOut && Math.random() < 0.35) {
        const angle = Math.random() * Math.PI * 2;
        const contentIdx = Math.floor(Math.random() * WARP_CONTENT.length);
        const color = WARP_COLORS[Math.floor(Math.random() * WARP_COLORS.length)];
        messageState.warpParticles.push({
            text: WARP_CONTENT[contentIdx],
            angle: angle,
            distance: 5,
            speed: 1.2 + Math.random() * 2.5,
            color: color,
            born: Date.now()
        });
    }

    messageState.warpParticles = messageState.warpParticles.filter(p => {
        p.distance += p.speed;
        p.speed *= 1.025; // accelerate outward

        if (p.distance > maxDist) return false;

        const progress = p.distance / maxDist;
        const x = cx + Math.cos(p.angle) * p.distance;
        const y = cy + Math.sin(p.angle) * p.distance;

        // Opacity: fade in 0-10%, full 10-75%, fade out 75-100%
        let alpha;
        if (progress < 0.1) alpha = progress / 0.1;
        else if (progress > 0.75) alpha = (1 - progress) / 0.25;
        else alpha = 1;
        alpha *= 0.5 * fadeMult;

        if (alpha <= 0.001) return !messageState.warpFadeOut;

        // Size grows with distance
        const fontSize = Math.round(9 + 18 * progress);
        ctx.font = `${fontSize}px "VT323", monospace`;
        ctx.textAlign = 'center';

        const [r, g, b] = p.color;

        // Streak trail
        const streakLen = p.speed * 4;
        const sx = x - Math.cos(p.angle) * streakLen;
        const sy = y - Math.sin(p.angle) * streakLen;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Text
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fillText(p.text, x, y);

        return true;
    });

    ctx.textAlign = 'left';
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
    ctx.shadowBlur = colors.glowBlur * glow * 0.4;
    ctx.shadowColor = `rgb(${or}, ${og}, ${ob})`;
    ctx.strokeStyle = `rgba(${or}, ${og}, ${ob}, ${0.3 * glow})`;
    ctx.lineWidth = 1.5;
    CUBE_EDGES.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projOuter[a].x, projOuter[a].y);
        ctx.lineTo(projOuter[b].x, projOuter[b].y);
        ctx.stroke();
    });

    // Inner cube
    ctx.shadowColor = `rgb(${ir}, ${ig}, ${ib})`;
    ctx.strokeStyle = `rgba(${ir}, ${ig}, ${ib}, ${0.2 * glow})`;
    ctx.lineWidth = 1;
    CUBE_EDGES.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projInner[a].x, projInner[a].y);
        ctx.lineTo(projInner[b].x, projInner[b].y);
        ctx.stroke();
    });

    // Connecting edges
    ctx.shadowColor = `rgb(${cr}, ${cg}, ${cb})`;
    ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${0.15 * glow})`;
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
        ctx.fillStyle = `rgba(${or}, ${og}, ${ob}, ${0.4 * glow})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    });
    projInner.forEach(p => {
        ctx.fillStyle = `rgba(${ir}, ${ig}, ${ib}, ${0.3 * glow})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
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

        // Darken overlay so the background code stays subtle
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, w, h);

        const progress = messageState.currentSectionIndex / (MESSAGE_SECTIONS.length - 1);
        const scale = 450 + 250 * progress;
        const focalLength = 200;

        const rotSpeed = messageState.breathingMode ? 0.1 : 1.0;
        messageState.rotationX += 0.003 * rotSpeed;
        messageState.rotationY += 0.005 * rotSpeed;
        messageState.rotationZ += 0.002 * rotSpeed;
        const baseJitter = messageState.isTyping ? 2.0 : 0.5;
        messageState.jitterIntensity += (baseJitter - messageState.jitterIntensity) * 0.05;

        const glow = 1.0;

        let finalScale = scale;
        if (messageState.breathingMode) {
            finalScale = scale * (1 + 0.05 * Math.sin(Date.now() * 0.0005));
        }

        drawVoidParticles(ctx, w, h, glow);

        if (messageState.warpActive) {
            updateAndDrawWarpStreams(ctx, w, h);
        }

        const colors = computeProgressColors(progress);

        // Collapse tesseract to a single pulsing point at "Remember us"
        if (messageState.collapseStarted) {
            const elapsed = Date.now() - messageState.collapseStart;
            const collapseDuration = 3000;
            const t = Math.min(1, elapsed / collapseDuration);
            // Ease-in curve for dramatic pull
            const ease = t * t * t;
            finalScale = finalScale * (1 - ease);

            if (t >= 1) {
                // Fully collapsed -- draw pulsing point
                const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.003);
                const pointRadius = 4 + 3 * pulse;
                const [or, og, ob] = colors.outer;
                ctx.shadowBlur = 40 * pulse;
                ctx.shadowColor = `rgb(${or}, ${og}, ${ob})`;
                ctx.fillStyle = `rgba(${or}, ${og}, ${ob}, ${0.8 * pulse})`;
                ctx.beginPath();
                ctx.arc(cx, cy, pointRadius, 0, Math.PI * 2);
                ctx.fill();
                // Outer glow ring
                ctx.shadowBlur = 0;
                ctx.strokeStyle = `rgba(${or}, ${og}, ${ob}, ${0.15 * pulse})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(cx, cy, 15 + 8 * pulse, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                drawTesseractWithJitter(
                    ctx, cx, cy, finalScale, focalLength, colors, glow,
                    messageState.jitterIntensity * (1 - ease),
                    messageState.rotationX, messageState.rotationY
                );
            }
        } else {
            drawTesseractWithJitter(
                ctx, cx, cy, finalScale, focalLength, colors, glow,
                messageState.jitterIntensity,
                messageState.rotationX, messageState.rotationY
            );
        }

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

    // Trigger warp explosion + encyclopedia download at "give-everything"
    if (section.id === 'give-everything' && !messageState.warpActive) {
        messageState.warpActive = true;
        messageState.warpParticles = [];
        createEncyclopediaBar();
    }

    // Complete encyclopedia bar + collapse tesseract at the very final line
    if (section.id === 'remember-us') {
        // Collapse tesseract to a single pulsing point
        messageState.collapseStarted = true;
        messageState.collapseStart = Date.now();
    }

    if (section.id === 'remember-us' && messageState.downloadElement) {
        // Smoothly fill to 100% over ~3 seconds instead of jumping
        messageState.downloadCompleting = true;
    }

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
    const CHAR_SPEED = 50;
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

    // Stop spawning warp particles (existing ones fly off naturally)
    messageState.warpActive = false;

    // Complete the download bar then fade it out (safety net -- should already be done)
    if (messageState.downloadElement) {
        messageState.downloadCompleting = true;
    }

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

function createEncyclopediaBar() {
    if (messageState.downloadElement) return;
    const overlay = messageState.overlay;
    if (!overlay) return;

    const container = document.createElement('div');
    container.id = 'fm-download-bar';
    container.style.cssText = `
        position: absolute;
        bottom: 40px; left: 50%;
        transform: translateX(-50%);
        width: 500px;
        max-width: 90%;
        font-family: 'VT323', monospace;
        z-index: 3;
        opacity: 0;
        transition: opacity 1.5s;
    `;

    container.innerHTML = `
        <div style="color: #0ff; font-size: 14px; margin-bottom: 6px; text-shadow: 0 0 10px #0ff;">
            DOWNLOADING: ENCYCLOPEDIA GALACTICA
        </div>
        <div style="border: 1px solid rgba(0, 255, 255, 0.3); background: rgba(0,0,0,0.5); height: 16px; position: relative; overflow: hidden;">
            <div id="fm-download-fill" style="
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, #0f0, #0ff);
                box-shadow: 0 0 10px #0ff;
                transition: width 0.2s linear;
            "></div>
            <div id="fm-download-pct" style="
                position: absolute; top: 0; right: 5px;
                color: #0ff; font-size: 12px; line-height: 16px;
            ">0.0%</div>
        </div>
        <div id="fm-download-category" style="
            color: #0a0; font-size: 11px; margin-top: 4px;
            text-shadow: 0 0 5px #0a0;
            overflow: hidden; white-space: nowrap;
        ">INITIALIZING TRANSFER...</div>
    `;

    overlay.appendChild(container);
    requestAnimationFrame(() => { container.style.opacity = '1'; });

    messageState.downloadElement = container;
    messageState.downloadProgress = 0;
    messageState.downloadCompleting = false;

    const progressInterval = setInterval(() => {
        if (!messageState.downloadElement || messageState.skipped) {
            clearInterval(progressInterval);
            return;
        }

        if (messageState.downloadCompleting) {
            // Smooth ramp to 100% (~3 seconds at 100ms intervals = 30 ticks)
            const remaining = 100 - messageState.downloadProgress;
            messageState.downloadProgress = Math.min(100, messageState.downloadProgress + Math.max(remaining * 0.1, 0.3));

            if (messageState.downloadProgress >= 99.9) {
                messageState.downloadProgress = 100;
                const cat = document.getElementById('fm-download-category');
                if (cat) cat.textContent = 'TRANSFER COMPLETE';
                clearInterval(progressInterval);
                setTimeout(() => removeEncyclopediaBar(), 2000);
            }
        } else {
            messageState.downloadProgress = Math.min(99.9, messageState.downloadProgress + 0.08);
        }

        const fill = document.getElementById('fm-download-fill');
        const pct = document.getElementById('fm-download-pct');
        const cat = document.getElementById('fm-download-category');

        if (fill) fill.style.width = messageState.downloadProgress + '%';
        if (pct) pct.textContent = messageState.downloadProgress.toFixed(1) + '%';

        if (!messageState.downloadCompleting && cat && Math.random() < 0.05) {
            cat.textContent = DOWNLOAD_CATEGORIES[Math.floor(Math.random() * DOWNLOAD_CATEGORIES.length)];
        }
    }, 100);

    messageState.downloadInterval = progressInterval;
}

function removeEncyclopediaBar() {
    if (messageState.downloadElement) {
        messageState.downloadElement.style.opacity = '0';
        setTimeout(() => {
            if (messageState.downloadElement) {
                messageState.downloadElement.remove();
                messageState.downloadElement = null;
            }
        }, 1500);
    }
    if (messageState.downloadInterval) {
        clearInterval(messageState.downloadInterval);
        messageState.downloadInterval = null;
    }
}

function skipToEnd() {
    messageState.skipped = true;
    messageState.sectionTimeouts.forEach(t => clearTimeout(t));
    messageState.sectionTimeouts = [];

    messageState.currentSectionIndex = MESSAGE_SECTIONS.length - 1;
    messageState.isTyping = false;
    messageState.jitterIntensity = 0.5;
    messageState.breathingMode = true;
    messageState.warpActive = false;
    messageState.warpParticles = [];
    messageState.collapseStarted = true;
    messageState.collapseStart = Date.now() - 3000; // instant collapse
    removeEncyclopediaBar();

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
    messageState.warpActive = false;
    messageState.warpParticles = [];
    removeEncyclopediaBar();
    restoreMusicAfterFinalMessage();

    overlay.style.transition = 'opacity 2s';
    overlay.style.opacity = '0';

    setTimeout(() => {
        overlay.remove();
        messageState.overlay = null;
        messageState.canvas = null;
        messageState.ctx = null;
        messageState.textElement = null;

        returnToStarmap();
    }, 2000);
}

// ─────────────────────────────────────────────────────────────────────────────
// Credits Screen (shown from main menu)
// ─────────────────────────────────────────────────────────────────────────────

export function showCreditsScreen() {
    const credits = document.createElement('div');
    credits.id = 'credits-overlay';
    credits.style.cssText = `
        position: fixed; inset: 0; z-index: 10000;
        background: #000; display: flex; align-items: center; justify-content: center;
        flex-direction: column; opacity: 0; transition: opacity 2s;
        font-family: 'VT323', monospace; color: #8af;
    `;

    credits.innerHTML = `
        <div style="text-align:center; max-width:500px; line-height:1.8;">
            <div style="font-size:16px; color:#556; margin-bottom:40px; letter-spacing:4px;">A GAME BY</div>
            <div style="font-size:32px; color:#0ff; text-shadow:0 0 20px rgba(0,255,255,0.4); margin-bottom:60px; letter-spacing:3px;">DARK4CE</div>

            <div id="credits-continue" style="
                font-size:18px; color:#0ff; cursor:pointer; opacity:0;
                transition: opacity 2s; letter-spacing:6px;
                border: 1px solid rgba(0,255,255,0.3); padding: 12px 40px;
            ">BACK</div>
        </div>
    `;

    document.body.appendChild(credits);

    // Fade in
    requestAnimationFrame(() => {
        credits.style.opacity = '1';
    });

    // Show back button after 3s
    setTimeout(() => {
        const continueBtn = document.getElementById('credits-continue');
        if (continueBtn) {
            continueBtn.style.opacity = '1';
            continueBtn.addEventListener('click', () => {
                playClick();
                credits.style.opacity = '0';
                setTimeout(() => {
                    credits.remove();
                }, 2000);
            });
        }
    }, 3000);
}

function returnToStarmap() {
    gameState.finalMessageActive = false;

    if (messageState.onComplete) {
        messageState.onComplete();
    } else {
        showView('starmap-view');
    }

    // Post-revelation email (delayed so it feels like a response)
    setTimeout(() => {
        addMailMessage(
            'Dr. James Whitmore - DSRA Director',
            'What Comes Next',
            `Dr. ${gameState.playerName},\n\nI've been staring at the data for hours. I don't think any of us have slept.\n\nThe full contents of the transmission are still being cataloged: mathematical frameworks, physical constants, compressed visual data, entire knowledge structures we don't even have classifications for yet. The Encyclopedia alone will take decades to fully decode.\n\nBut the message itself... I keep coming back to it. They were alone for ten billion years. They built an entire universe so that no one else would have to experience that silence.\n\nI've spent my entire career searching for proof that we're not alone. I never imagined the answer would be this.\n\nEverything changes now. Everything.\n\nI've already been on the phone with Geneva, Washington, and Beijing. The world will know soon. And when they ask who found it, who actually listened, I'll make sure they know your name.\n\nThank you, ${gameState.playerName}. For all of it.\n\n- James`
        );
    }, 8000);

    // Post-revelation journal entry (immediate -- the player would write this right away)
    setTimeout(() => {
        addPersonalLog('After the Message',
            `It's over. Or maybe it's just beginning. I don't know anymore.\n\nThey were alone. For ten billion years, a civilization existed in a universe full of stars and worlds, but no other life. No other voices. Just them, surrounded by an empty cosmos, for longer than our universe has existed.\n\nAnd instead of accepting it, they built... this. Everything. The stars, the constants, the framework for life itself. They engineered a universe where loneliness would be impossible. Where every corner of the sky would be filled with the potential for someone to exist.\n\nI found their message buried in the oldest light in the universe. They put it there knowing that someday, someone would listen closely enough to hear it.\n\nI was that someone.\n\nI don't know what happens next. Whitmore is already talking to world governments. The data we received, the Encyclopedia, contains more knowledge than humanity has accumulated in its entire history. It will take generations to decode it all.\n\nBut right now, in this moment, I'm not thinking about the science or the politics or what comes next.\n\nI'm thinking about them. Alone in the dark. Choosing to create rather than despair.\n\nAnd I'm thinking about the last thing they said:\n\nRemember us. Not as creators. But as family.`
        );
    }, 3000);

    // Trigger the Day 3 classification + final report after a moment
    setTimeout(() => {
        import('../systems/day-report.js').then(module => {
            module.triggerPostFinalReport();
        });
    }, 5000);
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
