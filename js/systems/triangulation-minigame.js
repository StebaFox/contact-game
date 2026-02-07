// ═════════════════════════════════════════════════════════════════════════════
// TRIANGULATION MINIGAME
// 3D starmap puzzle for locating CMB signal origin in Day 3
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { log } from '../ui/rendering.js';
import { playClick, getMasterVolume } from './audio.js';
import { autoSave } from '../core/save-system.js';

// ─────────────────────────────────────────────────────────────────────────────
// Triangulation State
// ─────────────────────────────────────────────────────────────────────────────

let triState = {
    active: false,
    canvas: null,
    ctx: null,
    animationId: null,
    time: 0,
    solved: false,

    // 3D View
    rotation: { x: 0.3, y: 0.5 },
    zoom: 1.0,
    width: 0,
    height: 0,

    // Stars with vectors
    stars: [],
    lockedStars: [],
    targetPoint: null,

    // Background starfield
    staticStars: [],

    // Mouse state
    rightMouseDown: false,
    lastMouse: { x: 0, y: 0 },

    // Callbacks
    onSuccess: null,
    onCancel: null
};

// ─────────────────────────────────────────────────────────────────────────────
// Star Class
// ─────────────────────────────────────────────────────────────────────────────

class TriStar {
    constructor(name, angle, distance, height, color, isAccurate, targetPoint) {
        this.name = name;
        this.angle = angle;
        this.distance = distance;
        this.height = height;
        this.color = color;
        this.isAccurate = isAccurate;
        this.signalStrength = (70 + Math.random() * 30).toFixed(1);
        this.locked = false;

        // Calculate position
        this.x = Math.cos(angle) * distance;
        this.y = height;
        this.z = Math.sin(angle) * distance;

        if (isAccurate) {
            // Vector pointing toward target (with slight noise)
            const toTarget = {
                x: targetPoint.x - this.x,
                y: targetPoint.y - this.y,
                z: targetPoint.z - this.z
            };
            const len = Math.sqrt(toTarget.x ** 2 + toTarget.y ** 2 + toTarget.z ** 2);

            const noise = 0.03;
            this.vectorDir = {
                x: toTarget.x / len + (Math.random() - 0.5) * noise,
                y: toTarget.y / len + (Math.random() - 0.5) * noise,
                z: toTarget.z / len + (Math.random() - 0.5) * noise
            };
        } else {
            // Inaccurate star - vector points somewhere else entirely
            const fakeTarget = {
                x: targetPoint.x + (Math.random() - 0.5) * 300,
                y: targetPoint.y + (Math.random() - 0.5) * 200,
                z: targetPoint.z + (Math.random() - 0.5) * 300
            };
            const toFake = {
                x: fakeTarget.x - this.x,
                y: fakeTarget.y - this.y,
                z: fakeTarget.z - this.z
            };
            const len = Math.sqrt(toFake.x ** 2 + toFake.y ** 2 + toFake.z ** 2);

            this.vectorDir = {
                x: toFake.x / len,
                y: toFake.y / len,
                z: toFake.z / len
            };
        }
    }

    getVectorEnd(length = 400) {
        return {
            x: this.x + this.vectorDir.x * length,
            y: this.y + this.vectorDir.y * length,
            z: this.z + this.vectorDir.z * length
        };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Start Triangulation Minigame
// ─────────────────────────────────────────────────────────────────────────────

export function startTriangulationMinigame(onSuccess, onCancel) {
    triState.onSuccess = onSuccess;
    triState.onCancel = onCancel;
    triState.active = true;
    triState.solved = false;

    // Reset state
    triState.rotation = { x: 0.3, y: 0.5 };
    triState.zoom = 1.0;
    triState.lockedStars = [];
    triState.time = 0;

    // Generate target point
    triState.targetPoint = {
        x: 80 + Math.random() * 100 - 50,
        y: 30 + Math.random() * 60 - 30,
        z: 80 + Math.random() * 100 - 50
    };

    // Generate stars
    generateStars();

    // Generate static starfield
    generateStaticStars();

    // Create UI
    createTriangulationUI();

    // Setup canvas
    setupCanvas();

    // Start animation
    animate();

    console.log('SIGNAL: Triangulation minigame started');
}

function generateStars() {
    triState.stars = [];

    // Shuffle which 3 stars are accurate
    const accurateIndices = [0, 1, 2, 3, 4];
    for (let i = accurateIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [accurateIndices[i], accurateIndices[j]] = [accurateIndices[j], accurateIndices[i]];
    }
    const accurateSet = new Set(accurateIndices.slice(0, 3));

    const starData = [
        { name: "TEEGARDEN'S STAR", angle: 0.5, distance: 280, height: 40, color: '#ff6b6b' },
        { name: "LUHMAN 16", angle: 1.8, distance: 320, height: -30, color: '#ffd93d' },
        { name: "WISE 0855", angle: 2.9, distance: 250, height: 60, color: '#6bcb77' },
        { name: "VAN MAANEN'S", angle: 4.2, distance: 300, height: -50, color: '#4d96ff' },
        { name: "GLIESE 832", angle: 5.5, distance: 270, height: 20, color: '#ff8e4d' },
    ];

    for (let i = 0; i < starData.length; i++) {
        const data = starData[i];
        const isAccurate = accurateSet.has(i);
        triState.stars.push(new TriStar(
            data.name, data.angle, data.distance, data.height,
            data.color, isAccurate, triState.targetPoint
        ));
    }
}

function generateStaticStars() {
    triState.staticStars = [];
    for (let i = 0; i < 400; i++) {
        triState.staticStars.push({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() < 0.9 ? 0.5 + Math.random() * 0.5 : 1 + Math.random() * 1.5,
            brightness: 0.15 + Math.random() * 0.4,
            twinkleSpeed: 0.5 + Math.random() * 2,
            twinkleOffset: Math.random() * Math.PI * 2
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Create UI
// ─────────────────────────────────────────────────────────────────────────────

function createTriangulationUI() {
    const overlay = document.createElement('div');
    overlay.id = 'triangulation-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 10000;
        display: flex;
        font-family: 'VT323', 'Courier New', monospace;
    `;

    overlay.innerHTML = `
        <!-- Main Canvas Area -->
        <div style="flex: 1; position: relative;">
            <canvas id="triangulation-canvas" style="
                width: 100%;
                height: 100%;
                display: block;
            "></canvas>

            <!-- Scanline overlay -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(transparent 50%, rgba(0, 255, 0, 0.03) 50%);
                background-size: 100% 4px;
                pointer-events: none;
            "></div>

            <!-- Header -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                background: rgba(0, 20, 0, 0.9);
                border-bottom: 2px solid #0f0;
                padding: 10px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div style="color: #0f0; font-size: 20px; text-shadow: 0 0 10px #0f0; letter-spacing: 3px;">
                    ◢ SIGNAL TRIANGULATION ◣
                </div>
                <div style="display: flex; gap: 30px; font-size: 14px;">
                    <div style="text-align: center;">
                        <div style="color: #0a0; font-size: 10px;">VECTORS LOCKED</div>
                        <div id="tri-locked" style="color: #0f0; font-size: 18px; text-shadow: 0 0 5px #0f0;">0/3</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: #0a0; font-size: 10px;">CONVERGENCE</div>
                        <div id="tri-convergence" style="color: #f00; font-size: 18px; text-shadow: 0 0 5px #f00;">0%</div>
                    </div>
                </div>
            </div>

            <!-- Instructions -->
            <div style="
                position: absolute;
                bottom: 20px;
                left: 20px;
                background: rgba(0, 20, 0, 0.9);
                border: 1px solid #0f0;
                padding: 15px;
                font-size: 11px;
                color: #0a0;
                max-width: 280px;
            ">
                <strong style="color: #0f0;">OBJECTIVE</strong><br><br>
                Locate the origin of the anomalous signal by triangulating vectors from three confirmed sources.<br><br>
                <strong style="color: #0f0;">CONTROLS</strong><br>
                Right-drag: Rotate view<br>
                Scroll: Zoom in/out<br>
                Click star: Lock/unlock vector<br>
                Find where 3 vectors converge
            </div>

            <!-- Zoom Level -->
            <div style="
                position: absolute;
                bottom: 20px;
                left: 320px;
                font-size: 12px;
                color: #0a0;
            ">
                ZOOM: <span id="tri-zoom">100%</span>
            </div>

            <!-- Accuracy Display -->
            <div style="
                position: absolute;
                bottom: 80px;
                right: 20px;
                font-size: 14px;
                text-align: right;
            ">
                <div style="color: #0a0; font-size: 10px;">INTERSECTION ACCURACY</div>
                <div id="tri-accuracy" style="color: #0ff; font-size: 24px; text-shadow: 0 0 10px #0ff;">--</div>
            </div>

            <!-- Lock Button -->
            <button id="tri-lock-btn" style="
                position: absolute;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 100, 0, 0.5);
                border: 1px solid #0f0;
                color: #0f0;
                padding: 15px 30px;
                font-family: 'VT323', 'Courier New', monospace;
                font-size: 14px;
                cursor: not-allowed;
                opacity: 0.3;
            " disabled>
                LOCK COORDINATES
            </button>
        </div>

        <!-- Sidebar -->
        <div style="
            width: 280px;
            background: rgba(0, 20, 0, 0.95);
            border-left: 2px solid #0f0;
            padding: 15px;
            overflow-y: auto;
        ">
            <h3 style="
                color: #0f0;
                text-shadow: 0 0 10px #0f0;
                border-bottom: 1px solid #0f0;
                padding-bottom: 5px;
                margin: 60px 0 10px 0;
                font-size: 14px;
            ">SIGNAL SOURCES</h3>
            <div id="tri-star-list"></div>

            <button id="tri-cancel-btn" style="
                width: 100%;
                margin-top: 20px;
                background: rgba(100, 0, 0, 0.3);
                border: 1px solid #f00;
                color: #f00;
                padding: 10px;
                font-family: 'VT323', 'Courier New', monospace;
                font-size: 12px;
                cursor: pointer;
            ">
                ABORT TRIANGULATION
            </button>
        </div>
    `;

    document.body.appendChild(overlay);

    // Populate star list
    updateStarList();

    // Add event listeners
    document.getElementById('tri-lock-btn').addEventListener('click', attemptLock);
    document.getElementById('tri-cancel-btn').addEventListener('click', cancelTriangulation);
}

function updateStarList() {
    const list = document.getElementById('tri-star-list');
    if (!list) return;

    list.innerHTML = '';

    for (const star of triState.stars) {
        const entry = document.createElement('div');
        entry.style.cssText = `
            background: ${star.locked ? 'rgba(0, 50, 80, 0.3)' : 'rgba(0, 50, 0, 0.3)'};
            border: 1px solid ${star.locked ? '#0ff' : '#0a0'};
            padding: 10px;
            margin-bottom: 8px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s;
        `;

        entry.innerHTML = `
            <div style="color: #0ff; font-weight: bold; font-size: 12px;">${star.name}</div>
            <div>Distance: ${star.distance.toFixed(0)} LY</div>
            <div style="color: #ff0;">Signal: ${star.signalStrength}%</div>
            <div style="color: ${star.locked ? '#0ff' : '#0a0'};">
                ${star.locked ? '◉ VECTOR LOCKED' : '○ Click to lock vector'}
            </div>
        `;

        entry.addEventListener('click', () => toggleStarLock(star));
        entry.addEventListener('mouseenter', () => {
            entry.style.background = star.locked ? 'rgba(0, 80, 100, 0.4)' : 'rgba(0, 80, 0, 0.4)';
        });
        entry.addEventListener('mouseleave', () => {
            entry.style.background = star.locked ? 'rgba(0, 50, 80, 0.3)' : 'rgba(0, 50, 0, 0.3)';
        });

        list.appendChild(entry);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas Setup
// ─────────────────────────────────────────────────────────────────────────────

function setupCanvas() {
    triState.canvas = document.getElementById('triangulation-canvas');
    triState.ctx = triState.canvas.getContext('2d');

    const resize = () => {
        triState.width = triState.canvas.width = triState.canvas.offsetWidth;
        triState.height = triState.canvas.height = triState.canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse events
    triState.canvas.addEventListener('wheel', handleWheel, { passive: false });
    triState.canvas.addEventListener('mousedown', handleMouseDown);
    triState.canvas.addEventListener('mousemove', handleMouseMove);
    triState.canvas.addEventListener('mouseup', handleMouseUp);
    triState.canvas.addEventListener('contextmenu', e => e.preventDefault());
    triState.canvas.addEventListener('click', handleCanvasClick);
}

function handleWheel(e) {
    e.preventDefault();
    const zoomSpeed = 0.001;
    triState.zoom -= e.deltaY * zoomSpeed;
    triState.zoom = Math.max(0.5, Math.min(2.5, triState.zoom));
    document.getElementById('tri-zoom').textContent = `${Math.round(triState.zoom * 100)}%`;
}

function handleMouseDown(e) {
    if (e.button === 2) {
        triState.rightMouseDown = true;
        triState.lastMouse = { x: e.clientX, y: e.clientY };
    }
}

function handleMouseMove(e) {
    if (triState.rightMouseDown) {
        const dx = e.clientX - triState.lastMouse.x;
        const dy = e.clientY - triState.lastMouse.y;
        triState.rotation.y += dx * 0.005;
        triState.rotation.x += dy * 0.005;
        triState.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, triState.rotation.x));
        triState.lastMouse = { x: e.clientX, y: e.clientY };
    }
}

function handleMouseUp(e) {
    if (e.button === 2) {
        triState.rightMouseDown = false;
    }
}

function handleCanvasClick(e) {
    if (triState.solved) return;

    const rect = triState.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (const star of triState.stars) {
        const pos = projectPoint(star.x, star.y, star.z);
        const dist = Math.sqrt((pos.x - mx) ** 2 + (pos.y - my) ** 2);

        if (dist < 25) {
            toggleStarLock(star);
            return;
        }
    }
}

function toggleStarLock(star) {
    if (triState.solved) return;

    playClick();

    if (star.locked) {
        star.locked = false;
        triState.lockedStars = triState.lockedStars.filter(s => s !== star);
    } else if (triState.lockedStars.length < 3) {
        star.locked = true;
        triState.lockedStars.push(star);
    }

    updateStarList();
    updateUI();
}

// ─────────────────────────────────────────────────────────────────────────────
// 3D Projection
// ─────────────────────────────────────────────────────────────────────────────

function projectPoint(x, y, z) {
    const rotation = triState.rotation;

    // Rotate around X axis
    const y1 = y * Math.cos(rotation.x) - z * Math.sin(rotation.x);
    const z1 = y * Math.sin(rotation.x) + z * Math.cos(rotation.x);

    // Rotate around Y axis
    const x2 = x * Math.cos(rotation.y) - z1 * Math.sin(rotation.y);
    const z2 = x * Math.sin(rotation.y) + z1 * Math.cos(rotation.y);

    const baseScale = 500 / (500 + z2);
    const scale = baseScale * triState.zoom;

    return {
        x: triState.width / 2 + x2 * scale,
        y: triState.height / 2 + y1 * scale,
        z: z2,
        scale: scale
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Intersection Calculation
// ─────────────────────────────────────────────────────────────────────────────

function calculateIntersection() {
    if (triState.lockedStars.length < 2) return null;

    let sumPoint = { x: 0, y: 0, z: 0 };
    let count = 0;

    for (let i = 0; i < triState.lockedStars.length; i++) {
        for (let j = i + 1; j < triState.lockedStars.length; j++) {
            const s1 = triState.lockedStars[i];
            const s2 = triState.lockedStars[j];

            const p1 = { x: s1.x, y: s1.y, z: s1.z };
            const d1 = s1.vectorDir;
            const p2 = { x: s2.x, y: s2.y, z: s2.z };
            const d2 = s2.vectorDir;

            const closest = closestPointBetweenLines(p1, d1, p2, d2);
            if (closest) {
                sumPoint.x += closest.x;
                sumPoint.y += closest.y;
                sumPoint.z += closest.z;
                count++;
            }
        }
    }

    if (count === 0) return null;

    const intersection = {
        x: sumPoint.x / count,
        y: sumPoint.y / count,
        z: sumPoint.z / count
    };

    // Calculate accuracy (distance from true target)
    const dx = intersection.x - triState.targetPoint.x;
    const dy = intersection.y - triState.targetPoint.y;
    const dz = intersection.z - triState.targetPoint.z;
    const error = Math.sqrt(dx * dx + dy * dy + dz * dz);

    let accuracy = Math.max(0, 100 - error);

    // With only 2 vectors, cap accuracy
    if (triState.lockedStars.length < 3) {
        accuracy = Math.min(accuracy, 65);
    }

    intersection.accuracy = accuracy;
    return intersection;
}

function closestPointBetweenLines(p1, d1, p2, d2) {
    const w0 = { x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z };

    const a = d1.x * d1.x + d1.y * d1.y + d1.z * d1.z;
    const b = d1.x * d2.x + d1.y * d2.y + d1.z * d2.z;
    const c = d2.x * d2.x + d2.y * d2.y + d2.z * d2.z;
    const d = d1.x * w0.x + d1.y * w0.y + d1.z * w0.z;
    const e = d2.x * w0.x + d2.y * w0.y + d2.z * w0.z;

    const denom = a * c - b * b;
    if (Math.abs(denom) < 0.0001) return null;

    const t1 = (b * e - c * d) / denom;
    const t2 = (a * e - b * d) / denom;

    if (t1 < 0 || t2 < 0) return null;

    const point1 = {
        x: p1.x + d1.x * t1,
        y: p1.y + d1.y * t1,
        z: p1.z + d1.z * t1
    };

    const point2 = {
        x: p2.x + d2.x * t2,
        y: p2.y + d2.y * t2,
        z: p2.z + d2.z * t2
    };

    return {
        x: (point1.x + point2.x) / 2,
        y: (point1.y + point2.y) / 2,
        z: (point1.z + point2.z) / 2
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation Loop
// ─────────────────────────────────────────────────────────────────────────────

function animate() {
    if (!triState.active) return;

    triState.time += 16;

    const ctx = triState.ctx;
    const width = triState.width;
    const height = triState.height;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Draw static starfield
    drawStaticStarfield(ctx, width, height);

    // Draw grid
    drawGrid(ctx);

    // Draw origin
    drawOrigin(ctx);

    // Draw vectors
    drawVectors(ctx);

    // Draw stars
    drawStars(ctx);

    // Draw convergence
    drawConvergence(ctx);

    // Update UI
    updateUI();

    triState.animationId = requestAnimationFrame(animate);
}

function drawStaticStarfield(ctx, width, height) {
    for (const star of triState.staticStars) {
        const twinkle = 0.7 + 0.3 * Math.sin(triState.time * 0.001 * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.brightness * twinkle;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawGrid(ctx) {
    ctx.strokeStyle = '#002200';
    ctx.lineWidth = 1;

    // Circular grid
    for (let r = 100; r <= 400; r += 100) {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
            const pos = projectPoint(Math.cos(a) * r, 0, Math.sin(a) * r);
            if (a === 0) ctx.moveTo(pos.x, pos.y);
            else ctx.lineTo(pos.x, pos.y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    // Radial lines
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        ctx.beginPath();
        const start = projectPoint(0, 0, 0);
        const end = projectPoint(Math.cos(a) * 400, 0, Math.sin(a) * 400);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }
}

function drawOrigin(ctx) {
    const pos = projectPoint(0, 0, 0);

    // Glow
    const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 30);
    gradient.addColorStop(0, 'rgba(0, 255, 100, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 255, 100, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Center point
    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0a0';
    ctx.font = '10px "Courier New", monospace';
    ctx.fillText('OBSERVATORY', pos.x - 35, pos.y + 20);
}

function drawStars(ctx) {
    for (const star of triState.stars) {
        const pos = projectPoint(star.x, star.y, star.z);
        const size = 8 * pos.scale;

        // Glow
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 3);
        gradient.addColorStop(0, star.color + '80');
        gradient.addColorStop(1, star.color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Selection ring
        if (star.locked) {
            ctx.strokeStyle = '#0ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size + 8, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Star body
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = star.locked ? '#0ff' : '#0a0';
        ctx.font = '10px "Courier New", monospace';
        ctx.fillText(star.name, pos.x + size + 5, pos.y - 5);
    }
}

function drawVectors(ctx) {
    const colors = ['#ff6b6b', '#6bcb77', '#4d96ff'];

    for (let i = 0; i < triState.lockedStars.length; i++) {
        const star = triState.lockedStars[i];
        const startPos = projectPoint(star.x, star.y, star.z);
        const endPoint = star.getVectorEnd(500);
        const endPos = projectPoint(endPoint.x, endPoint.y, endPoint.z);

        // Draw vector line
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated particles
        const particleCount = 5;
        for (let p = 0; p < particleCount; p++) {
            const t = ((triState.time * 0.001 + p / particleCount) % 1);
            const px = star.x + star.vectorDir.x * 500 * t;
            const py = star.y + star.vectorDir.y * 500 * t;
            const pz = star.z + star.vectorDir.z * 500 * t;
            const pPos = projectPoint(px, py, pz);

            ctx.fillStyle = colors[i % colors.length];
            ctx.globalAlpha = 1 - t;
            ctx.beginPath();
            ctx.arc(pPos.x, pPos.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
}

function drawConvergence(ctx) {
    if (triState.lockedStars.length < 2) return;

    const intersection = calculateIntersection();
    if (!intersection) return;

    const pos = projectPoint(intersection.x, intersection.y, intersection.z);
    const accuracy = intersection.accuracy;
    const zoneSize = Math.max(10, 50 - accuracy * 0.4);

    // Pulsing glow
    const pulse = 0.5 + 0.5 * Math.sin(triState.time * 0.005);
    ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + pulse * 0.4})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, zoneSize * (1 + pulse * 0.2), 0, Math.PI * 2);
    ctx.stroke();

    // Inner marker
    ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + pulse * 0.3})`;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Crosshair
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pos.x - 15, pos.y);
    ctx.lineTo(pos.x - 5, pos.y);
    ctx.moveTo(pos.x + 5, pos.y);
    ctx.lineTo(pos.x + 15, pos.y);
    ctx.moveTo(pos.x, pos.y - 15);
    ctx.lineTo(pos.x, pos.y - 5);
    ctx.moveTo(pos.x, pos.y + 5);
    ctx.lineTo(pos.x, pos.y + 15);
    ctx.stroke();

    // Distance label
    const dist = Math.sqrt(intersection.x ** 2 + intersection.y ** 2 + intersection.z ** 2);
    ctx.fillStyle = '#0ff';
    ctx.font = '10px "Courier New", monospace';
    ctx.fillText(`${dist.toFixed(0)} LY`, pos.x + 20, pos.y);
}

// ─────────────────────────────────────────────────────────────────────────────
// UI Updates
// ─────────────────────────────────────────────────────────────────────────────

function updateUI() {
    const lockedEl = document.getElementById('tri-locked');
    const convergenceEl = document.getElementById('tri-convergence');
    const accuracyEl = document.getElementById('tri-accuracy');
    const lockBtn = document.getElementById('tri-lock-btn');

    if (!lockedEl) return;

    lockedEl.textContent = `${triState.lockedStars.length}/3`;

    const intersection = calculateIntersection();

    if (intersection && triState.lockedStars.length >= 2) {
        const acc = intersection.accuracy.toFixed(1);
        convergenceEl.textContent = `${acc}%`;

        if (triState.lockedStars.length < 3) {
            accuracyEl.textContent = `${acc}% (need 3)`;
        } else {
            accuracyEl.textContent = `${acc}%`;
        }

        // Color based on accuracy
        if (intersection.accuracy > 90) {
            convergenceEl.style.color = '#0ff';
            accuracyEl.style.color = '#0ff';
        } else if (intersection.accuracy > 80) {
            convergenceEl.style.color = '#0f0';
            accuracyEl.style.color = '#0f0';
        } else if (intersection.accuracy > 50) {
            convergenceEl.style.color = '#ff0';
            accuracyEl.style.color = '#ff0';
        } else {
            convergenceEl.style.color = '#f00';
            accuracyEl.style.color = '#f00';
        }
    } else {
        convergenceEl.textContent = '0%';
        convergenceEl.style.color = '#f00';
        accuracyEl.textContent = '--';
        accuracyEl.style.color = '#0a0';
    }

    // Enable lock button when accuracy is good enough
    if (intersection && intersection.accuracy > 85 && triState.lockedStars.length === 3) {
        lockBtn.disabled = false;
        lockBtn.style.opacity = '1';
        lockBtn.style.cursor = 'pointer';
        lockBtn.style.borderColor = '#0ff';
        lockBtn.style.color = '#0ff';
        lockBtn.style.animation = 'pulse 1s infinite';
    } else {
        lockBtn.disabled = true;
        lockBtn.style.opacity = '0.3';
        lockBtn.style.cursor = 'not-allowed';
        lockBtn.style.borderColor = '#0f0';
        lockBtn.style.color = '#0f0';
        lockBtn.style.animation = 'none';
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────────────────────────

function attemptLock() {
    if (triState.solved) return;

    const intersection = calculateIntersection();
    if (!intersection || intersection.accuracy <= 85) {
        log('Insufficient accuracy - need 85%+', 'warning');
        return;
    }

    triState.solved = true;
    playClick();
    playSuccessSound();

    log(`COORDINATES LOCKED - Accuracy: ${intersection.accuracy.toFixed(1)}%`, 'highlight');

    // Show success message
    showSuccessMessage(intersection);
}

function showSuccessMessage(intersection) {
    const overlay = document.getElementById('triangulation-overlay');
    if (!overlay) return;

    // Create success overlay
    const msg = document.createElement('div');
    msg.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid #0ff;
        padding: 30px 50px;
        font-size: 18px;
        text-align: center;
        color: #0ff;
        text-shadow: 0 0 10px #0ff;
        max-width: 500px;
        z-index: 100;
    `;

    msg.innerHTML = `
        <div style="color: #0ff; font-size: 24px; margin-bottom: 15px;">
            ◆ COORDINATES LOCKED ◆
        </div>
        <div style="margin-bottom: 10px;">
            Signal origin triangulated at:<br>
            <span style="color: #ff0; font-size: 20px;">
                ${intersection.x.toFixed(1)}, ${intersection.y.toFixed(1)}, ${intersection.z.toFixed(1)}
            </span>
        </div>
        <div style="color: #0f0;">
            Accuracy: ${intersection.accuracy.toFixed(1)}%
        </div>
        <div style="margin-top: 20px; color: #0a0; font-size: 14px;">
            Source identified beyond known stellar cartography.<br>
            Signal origin predates observable universe formation.
        </div>
        <button id="tri-continue-btn" style="
            margin-top: 20px;
            background: rgba(0, 100, 0, 0.5);
            border: 1px solid #0f0;
            color: #0f0;
            padding: 10px 20px;
            font-family: 'VT323', 'Courier New', monospace;
            font-size: 14px;
            cursor: pointer;
        ">
            CONTINUE
        </button>
    `;

    overlay.appendChild(msg);

    document.getElementById('tri-continue-btn').addEventListener('click', () => {
        completeTriangulation(true);
    });
}

function cancelTriangulation() {
    playClick();
    completeTriangulation(false);
}

function completeTriangulation(success) {
    triState.active = false;

    if (triState.animationId) {
        cancelAnimationFrame(triState.animationId);
    }

    // Remove overlay
    const overlay = document.getElementById('triangulation-overlay');
    if (overlay) overlay.remove();

    if (success) {
        // Triangulation reveals the NEXUS POINT — fragment is awarded on scan/decrypt
        gameState.cmbDetected = true;
        log('TRIANGULATION COMPLETE - Deep space target coordinates locked', 'highlight');
        autoSave();

        if (triState.onSuccess) {
            triState.onSuccess();
        }
    } else {
        if (triState.onCancel) {
            triState.onCancel();
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Audio
// ─────────────────────────────────────────────────────────────────────────────

function playSuccessSound() {
    try {
        const vol = getMasterVolume();
        const ctx = new (window.AudioContext || window.webkitAudioContext)();

        [400, 600, 800, 1000, 1200].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.08 * vol, ctx.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);

            osc.start(ctx.currentTime + i * 0.1);
            osc.stop(ctx.currentTime + i * 0.1 + 0.3);
        });
    } catch (e) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

export function isTriangulationActive() {
    return triState.active;
}
