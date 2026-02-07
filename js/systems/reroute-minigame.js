// =============================================================================
// ELECTRICAL REROUTE MINIGAME
// Circuit repair puzzle triggered during dish alignment malfunction
// =============================================================================

import { gameState } from '../core/game-state.js';
import { log } from '../ui/rendering.js';
import { playClick, playStaticBurst, playLockAchieved, getMasterVolume } from './audio.js';

// Reroute state
let rerouteState = {
    active: false,
    canvas: null,
    ctx: null,
    animationId: null,

    // Grid of nodes
    nodes: [],
    connections: [],

    // Power flow
    sourceNode: null,
    targetNode: null,
    poweredNodes: new Set(),

    // Player interaction
    selectedNode: null,

    // Visual
    pulsePhase: 0,
    sparkParticles: [],

    // Puzzle generation data
    originalPath: [],
    blownNodeIdx: null,

    // Callbacks
    onSuccess: null,
    onCancel: null,

    // Malfunctioning dish info
    dishLabel: null
};

// Node types
const NODE_TYPES = {
    JUNCTION_L: 'junction_l',  // L-shaped pipe, rotatable
    JUNCTION_I: 'junction_i',  // I-shaped pipe (straight), rotatable
    SOURCE: 'source',          // Power input (always powered)
    TARGET: 'target',          // Must receive power to win
    BLOWN: 'blown'             // Blown circuit - blocks power flow
};

// =============================================================================
// Start Reroute Minigame
// =============================================================================

export function startRerouteMinigame(dishLabel, onSuccess, onCancel) {
    rerouteState.onSuccess = onSuccess;
    rerouteState.onCancel = onCancel;
    rerouteState.active = true;
    rerouteState.dishLabel = dishLabel;

    // Reset state
    rerouteState.nodes = [];
    rerouteState.connections = [];
    rerouteState.poweredNodes = new Set();
    rerouteState.selectedNode = null;
    rerouteState.pulsePhase = 0;
    rerouteState.sparkParticles = [];
    rerouteState.originalPath = [];
    rerouteState.blownNodeIdx = null;
    previousPoweredCount = 0;

    // Create UI
    createRerouteUI(dishLabel);

    // Setup canvas
    setupCanvas();

    // Generate puzzle
    generatePuzzle();

    // Start animation
    animate();

    // Play alarm sound
    playAlarmSound();

    log(`DISH ${dishLabel} MALFUNCTION - Electrical reroute required!`, 'warning');
}

// =============================================================================
// Create UI
// =============================================================================

function createRerouteUI(dishLabel) {
    const overlay = document.createElement('div');
    overlay.id = 'reroute-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'VT323', monospace;
    `;

    overlay.innerHTML = `
        <div style="
            border: 2px solid #f00;
            background: #000;
            padding: 0;
            width: 500px;
            max-width: 95vw;
            box-shadow: 0 0 50px rgba(255, 0, 0, 0.4);
        ">
            <!-- Header -->
            <div style="
                background: linear-gradient(180deg, #200 0%, #100 100%);
                border-bottom: 2px solid #f00;
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>
                    <div style="color: #f00; font-size: 11px; letter-spacing: 2px; animation: blink 0.5s infinite;">
                        ⚠ CRITICAL FAULT ⚠
                    </div>
                    <div style="color: #ff0; font-size: 16px; text-shadow: 0 0 10px #ff0;">
                        DISH ${dishLabel} - POWER FAILURE
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="color: #f00; font-size: 12px;">
                        CIRCUIT STATUS: <span style="color: #ff0;">OFFLINE</span>
                    </div>
                </div>
            </div>

            <!-- Instructions -->
            <div style="
                background: rgba(255, 0, 0, 0.1);
                border-bottom: 1px solid #300;
                padding: 8px 15px;
                color: #f80;
                font-size: 12px;
                text-align: center;
            ">
                Click <span style="color: #ff0;">JUNCTIONS</span> to rotate |
                Route around <span style="color: #f80;">BLOWN CIRCUIT</span> from <span style="color: #0f0;">SOURCE</span> to <span style="color: #0ff;">TARGET</span>
            </div>

            <!-- Canvas Container -->
            <div style="padding: 15px; background: #000;">
                <canvas id="reroute-canvas" style="
                    width: 100%;
                    height: 300px;
                    border: 1px solid #300;
                    background: #000;
                    cursor: pointer;
                "></canvas>
            </div>

            <!-- Status -->
            <div style="
                padding: 10px 15px;
                border-top: 1px solid #300;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div id="reroute-status" style="color: #f00; font-size: 14px;">
                    POWER DISCONNECTED
                </div>
                <button id="reroute-skip-btn" style="
                    background: transparent;
                    border: 2px solid #666;
                    color: #666;
                    font-family: 'VT323', monospace;
                    font-size: 14px;
                    padding: 6px 15px;
                    cursor: pointer;
                ">
                    ABORT REPAIR
                </button>
            </div>
        </div>

        <style>
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
        </style>
    `;

    document.body.appendChild(overlay);

    document.getElementById('reroute-skip-btn').addEventListener('click', () => {
        playClick();
        completeReroute(false);
    });
}

// =============================================================================
// Canvas Setup
// =============================================================================

function setupCanvas() {
    rerouteState.canvas = document.getElementById('reroute-canvas');
    rerouteState.ctx = rerouteState.canvas.getContext('2d');

    const rect = rerouteState.canvas.getBoundingClientRect();
    rerouteState.canvas.width = rect.width * window.devicePixelRatio;
    rerouteState.canvas.height = rect.height * window.devicePixelRatio;
    rerouteState.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Click handler
    rerouteState.canvas.addEventListener('click', handleClick);
}

// =============================================================================
// Generate Puzzle
// =============================================================================

function generatePuzzle() {
    const rect = rerouteState.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const cols = 5;
    const rows = 4;
    const spacingX = width / (cols + 1);
    const spacingY = height / (rows + 1);

    // Grid helpers
    const getPos = (idx) => ({ col: idx % cols, row: Math.floor(idx / cols) });
    const getIdx = (col, row) => row * cols + col;

    const getNeighbors = (idx) => {
        const { col, row } = getPos(idx);
        const neighbors = [];
        if (row > 0) neighbors.push(getIdx(col, row - 1));
        if (col < cols - 1) neighbors.push(getIdx(col + 1, row));
        if (row < rows - 1) neighbors.push(getIdx(col, row + 1));
        if (col > 0) neighbors.push(getIdx(col - 1, row));
        return neighbors;
    };

    const getDirection = (fromIdx, toIdx) => {
        const from = getPos(fromIdx);
        const to = getPos(toIdx);
        if (to.row < from.row) return 'N';
        if (to.col > from.col) return 'E';
        if (to.row > from.row) return 'S';
        if (to.col < from.col) return 'W';
        return null;
    };

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Find random path using randomized DFS
    function findRandomPath(from, to, blocked = new Set()) {
        const visited = new Set();
        const path = [];

        function dfs(current) {
            if (current === to) {
                path.push(current);
                return true;
            }
            visited.add(current);
            path.push(current);
            const neighbors = shuffle(
                getNeighbors(current).filter(n => !visited.has(n) && !blocked.has(n))
            );
            for (const neighbor of neighbors) {
                if (dfs(neighbor)) return true;
            }
            path.pop();
            return false;
        }

        dfs(from);
        return path;
    }

    // Determine junction type and correct rotation for a node between prev and next
    function getJunctionInfo(prevIdx, currIdx, nextIdx) {
        const dir1 = getDirection(currIdx, prevIdx);
        const dir2 = getDirection(currIdx, nextIdx);

        const isStraight =
            (dir1 === 'N' && dir2 === 'S') || (dir1 === 'S' && dir2 === 'N') ||
            (dir1 === 'E' && dir2 === 'W') || (dir1 === 'W' && dir2 === 'E');

        if (isStraight) {
            const rotation = (dir1 === 'N' || dir1 === 'S') ? 0 : 1;
            return { type: NODE_TYPES.JUNCTION_I, rotation };
        } else {
            const needed = [dir1, dir2].sort().join(',');
            const lPatterns = [
                ['E', 'N'],  // rotation 0
                ['E', 'S'],  // rotation 1
                ['S', 'W'],  // rotation 2
                ['N', 'W']   // rotation 3
            ];
            for (let r = 0; r < 4; r++) {
                if (lPatterns[r].sort().join(',') === needed) {
                    return { type: NODE_TYPES.JUNCTION_L, rotation: r };
                }
            }
            return { type: NODE_TYPES.JUNCTION_L, rotation: 0 };
        }
    }

    const sourceIdx = getIdx(0, 1);
    const targetIdx = getIdx(4, 2);

    // Generate puzzle with retry logic
    let genAttempts = 0;
    while (genAttempts < 50) {
        genAttempts++;
        rerouteState.nodes = [];
        rerouteState.connections = [];

        // Step 1: Find random "original" path (will have blown circuit on it)
        const originalPath = findRandomPath(sourceIdx, targetIdx);
        if (originalPath.length < 5) continue;

        // Step 2: Pick blown node - not too close to start or end
        let blownCandidates = originalPath.slice(2, -2);
        if (blownCandidates.length === 0) blownCandidates = originalPath.slice(1, -1);
        const blownIdx = blownCandidates[Math.floor(Math.random() * blownCandidates.length)];

        // Step 3: Find solution path that avoids blown node
        const solutionPath = findRandomPath(sourceIdx, targetIdx, new Set([blownIdx]));
        if (solutionPath.length === 0) continue;

        // Step 4: Build junction info for solution path nodes
        const solutionInfo = new Map();
        for (let i = 1; i < solutionPath.length - 1; i++) {
            const info = getJunctionInfo(solutionPath[i - 1], solutionPath[i], solutionPath[i + 1]);
            solutionInfo.set(solutionPath[i], info);
        }

        // Step 5: Create all nodes
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = spacingX * (col + 1);
                const y = spacingY * (row + 1);
                const id = row * cols + col;

                let type, rotation = 0;

                if (id === sourceIdx) {
                    type = NODE_TYPES.SOURCE;
                } else if (id === targetIdx) {
                    type = NODE_TYPES.TARGET;
                } else if (id === blownIdx) {
                    type = NODE_TYPES.BLOWN;
                } else if (solutionInfo.has(id)) {
                    type = solutionInfo.get(id).type;
                    rotation = solutionInfo.get(id).rotation;
                } else {
                    // Non-path node: random junction type
                    type = Math.random() < 0.35 ? NODE_TYPES.JUNCTION_I : NODE_TYPES.JUNCTION_L;
                    rotation = Math.floor(Math.random() * 4);
                }

                rerouteState.nodes.push({
                    id, x, y, type, rotation, radius: 20,
                    col, row,
                    solutionRotation: solutionInfo.has(id) ? solutionInfo.get(id).rotation : null
                });
            }
        }

        // Step 6: Store path info for rendering
        rerouteState.originalPath = originalPath;
        rerouteState.blownNodeIdx = blownIdx;

        // Step 7: Scramble all junction rotations
        for (const node of rerouteState.nodes) {
            if (node.type === NODE_TYPES.JUNCTION_L || node.type === NODE_TYPES.JUNCTION_I) {
                node.rotation = Math.floor(Math.random() * 4);
            }
        }

        // Step 8: Setup references and connections
        rerouteState.sourceNode = rerouteState.nodes.find(n => n.type === NODE_TYPES.SOURCE);
        rerouteState.targetNode = rerouteState.nodes.find(n => n.type === NODE_TYPES.TARGET);
        generateConnections(cols, rows);

        // Step 9: Calculate power and verify target is NOT powered
        calculatePowerFlow();
        if (!rerouteState.poweredNodes.has(rerouteState.targetNode.id)) {
            return; // Good puzzle
        }

        // Re-scramble a few times before full retry
        let rescrambles = 0;
        while (rerouteState.poweredNodes.has(rerouteState.targetNode.id) && rescrambles < 10) {
            for (const node of rerouteState.nodes) {
                if (node.type === NODE_TYPES.JUNCTION_L || node.type === NODE_TYPES.JUNCTION_I) {
                    node.rotation = Math.floor(Math.random() * 4);
                }
            }
            calculatePowerFlow();
            rescrambles++;
        }

        if (!rerouteState.poweredNodes.has(rerouteState.targetNode.id)) {
            return; // Found good scramble
        }
    }

    console.warn('Reroute puzzle: exhausted retries, using last generated layout');
}

function generateConnections(cols, rows) {
    rerouteState.connections = [];

    // Each node can connect to its neighbors (right, down)
    rerouteState.nodes.forEach((node, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);

        // Connect right
        if (col < cols - 1) {
            const neighborIdx = idx + 1;
            rerouteState.connections.push({
                from: idx,
                to: neighborIdx,
                direction: 'horizontal'
            });
        }

        // Connect down
        if (row < rows - 1) {
            const neighborIdx = idx + cols;
            rerouteState.connections.push({
                from: idx,
                to: neighborIdx,
                direction: 'vertical'
            });
        }
    });
}

// =============================================================================
// Power Flow Calculation
// =============================================================================

function calculatePowerFlow() {
    rerouteState.poweredNodes = new Set();

    if (!rerouteState.sourceNode) return;

    // BFS from source
    const queue = [rerouteState.sourceNode.id];
    rerouteState.poweredNodes.add(rerouteState.sourceNode.id);

    while (queue.length > 0) {
        const currentId = queue.shift();
        const currentNode = rerouteState.nodes[currentId];

        // Find all connections from this node
        rerouteState.connections.forEach(conn => {
            let neighborId = null;
            let direction = null;

            if (conn.from === currentId) {
                neighborId = conn.to;
                direction = conn.direction;
            } else if (conn.to === currentId) {
                neighborId = conn.from;
                direction = conn.direction === 'horizontal' ? 'horizontal' : 'vertical';
            }

            if (neighborId === null || rerouteState.poweredNodes.has(neighborId)) return;

            const neighborNode = rerouteState.nodes[neighborId];

            // Check if both nodes allow this connection based on their rotation
            if (canConnect(currentNode, neighborNode, direction, conn.from === currentId)) {
                rerouteState.poweredNodes.add(neighborId);
                queue.push(neighborId);
            }
        });
    }

    // Check for power changes and play sounds
    checkPowerChanges();

    // Check win condition
    if (rerouteState.targetNode && rerouteState.poweredNodes.has(rerouteState.targetNode.id)) {
        // Victory!
        setTimeout(() => {
            if (rerouteState.active) {
                showRerouteSuccess();
            }
        }, 300);
    }
}

function canConnect(nodeA, nodeB, direction, aIsFrom) {
    // Source and target always connect in all directions
    if (nodeA.type === NODE_TYPES.SOURCE || nodeA.type === NODE_TYPES.TARGET) {
        if (nodeB.type === NODE_TYPES.SOURCE || nodeB.type === NODE_TYPES.TARGET) {
            return true;
        }
    }

    // Check if nodeA outputs in the required direction
    const aOutputs = getNodeOutputDirections(nodeA);
    const bOutputs = getNodeOutputDirections(nodeB);

    // Determine required directions
    let requiredFromA, requiredFromB;

    if (direction === 'horizontal') {
        if (aIsFrom) {
            requiredFromA = 'E';
            requiredFromB = 'W';
        } else {
            requiredFromA = 'W';
            requiredFromB = 'E';
        }
    } else {
        if (aIsFrom) {
            requiredFromA = 'S';
            requiredFromB = 'N';
        } else {
            requiredFromA = 'N';
            requiredFromB = 'S';
        }
    }

    return aOutputs.includes(requiredFromA) && bOutputs.includes(requiredFromB);
}

function getNodeOutputDirections(node) {
    // Source and target connect all directions
    if (node.type === NODE_TYPES.SOURCE || node.type === NODE_TYPES.TARGET) {
        return ['N', 'E', 'S', 'W'];
    }

    // Blown circuit - no connections
    if (node.type === NODE_TYPES.BLOWN) {
        return [];
    }

    // I-shaped junction (straight pipe)
    if (node.type === NODE_TYPES.JUNCTION_I) {
        const patterns = [
            ['N', 'S'],  // rotation 0: vertical
            ['E', 'W'],  // rotation 1: horizontal
            ['N', 'S'],  // rotation 2: vertical
            ['E', 'W']   // rotation 3: horizontal
        ];
        return patterns[node.rotation % 4];
    }

    // L-shaped junction (default)
    const patterns = [
        ['N', 'E'],  // rotation 0
        ['E', 'S'],  // rotation 1
        ['S', 'W'],  // rotation 2
        ['W', 'N']   // rotation 3
    ];
    return patterns[node.rotation % 4];
}

// =============================================================================
// Input Handling
// =============================================================================

function handleClick(e) {
    if (!rerouteState.active) return;

    const rect = rerouteState.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked node
    for (const node of rerouteState.nodes) {
        const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);

        if (dist < node.radius + 5) {
            if (node.type === NODE_TYPES.JUNCTION_L || node.type === NODE_TYPES.JUNCTION_I) {
                node.rotation = (node.rotation + 1) % 4;
                playRotateSound();
                addSparkParticles(node.x, node.y);
                calculatePowerFlow();
            } else if (node.type === NODE_TYPES.BLOWN) {
                playErrorBlip();
                // Small sparks to show it's broken
                for (let i = 0; i < 4; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    rerouteState.sparkParticles.push({
                        x: node.x, y: node.y,
                        vx: Math.cos(angle) * (1 + Math.random()),
                        vy: Math.sin(angle) * (1 + Math.random()),
                        size: 1 + Math.random(), alpha: 0.8
                    });
                }
            } else {
                playErrorBlip();
            }
            return;
        }
    }
}

// =============================================================================
// Animation
// =============================================================================

function animate() {
    if (!rerouteState.active) return;

    const ctx = rerouteState.ctx;
    const rect = rerouteState.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Draw grid background
    drawGrid(ctx, width, height);

    // Draw connections
    drawConnections(ctx);

    // Draw nodes
    drawNodes(ctx);

    // Draw particles
    drawParticles(ctx);

    // Update
    rerouteState.pulsePhase += 0.05;
    updateParticles();

    // Update status
    updateStatus();

    rerouteState.animationId = requestAnimationFrame(animate);
}

function drawGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.1)';
    ctx.lineWidth = 1;

    const gridSize = 25;

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

function drawConnections(ctx) {
    rerouteState.connections.forEach(conn => {
        const nodeA = rerouteState.nodes[conn.from];
        const nodeB = rerouteState.nodes[conn.to];

        const aPowered = rerouteState.poweredNodes.has(nodeA.id);
        const bPowered = rerouteState.poweredNodes.has(nodeB.id);
        const bothPowered = aPowered && bPowered;

        // Check if connection involves blown node
        const hasBlown = nodeA.type === NODE_TYPES.BLOWN || nodeB.type === NODE_TYPES.BLOWN;

        // Check if this connection is active
        const isActive = !hasBlown && bothPowered && canConnect(nodeA, nodeB, conn.direction, true);

        if (hasBlown) {
            // Broken connection - red dashed line
            ctx.strokeStyle = 'rgba(255, 50, 0, 0.25)';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
        } else if (isActive) {
            ctx.strokeStyle = `rgba(0, 255, 0, ${0.6 + 0.4 * Math.sin(rerouteState.pulsePhase)})`;
            ctx.lineWidth = 4;
            ctx.setLineDash([]);
        } else {
            ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
            ctx.lineWidth = 2;
            ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw power flow particles on active connections
        if (isActive) {
            const t = (rerouteState.pulsePhase * 0.5) % 1;
            const px = nodeA.x + (nodeB.x - nodeA.x) * t;
            const py = nodeA.y + (nodeB.y - nodeA.y) * t;

            ctx.fillStyle = '#0f0';
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function drawNodes(ctx) {
    rerouteState.nodes.forEach(node => {
        const isPowered = rerouteState.poweredNodes.has(node.id);
        const pulse = 0.7 + 0.3 * Math.sin(rerouteState.pulsePhase + node.id);

        // Node background
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        if (node.type === NODE_TYPES.SOURCE) {
            ctx.fillStyle = `rgba(0, 255, 0, ${0.3 + pulse * 0.2})`;
            ctx.strokeStyle = '#0f0';
        } else if (node.type === NODE_TYPES.TARGET) {
            ctx.fillStyle = isPowered
                ? `rgba(0, 255, 255, ${0.3 + pulse * 0.3})`
                : `rgba(0, 100, 100, 0.2)`;
            ctx.strokeStyle = isPowered ? '#0ff' : '#066';
        } else if (node.type === NODE_TYPES.BLOWN) {
            // Blown circuit - red/orange flickering
            const flicker = 0.5 + 0.5 * Math.sin(rerouteState.pulsePhase * 3 + node.id);
            ctx.fillStyle = `rgba(${Math.floor(150 + 105 * flicker)}, ${Math.floor(30 * flicker)}, 0, 0.4)`;
            ctx.strokeStyle = `rgb(${Math.floor(200 + 55 * flicker)}, ${Math.floor(50 * flicker)}, 0)`;
        } else {
            // Junction (L or I)
            ctx.fillStyle = isPowered
                ? `rgba(255, 255, 0, ${0.2 + pulse * 0.2})`
                : 'rgba(100, 100, 0, 0.2)';
            ctx.strokeStyle = isPowered ? '#ff0' : '#660';
        }

        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Draw junction direction indicators (L and I shapes)
        if (node.type === NODE_TYPES.JUNCTION_L || node.type === NODE_TYPES.JUNCTION_I) {
            const dirs = getNodeOutputDirections(node);
            ctx.strokeStyle = isPowered ? '#ff0' : '#880';
            ctx.lineWidth = 3;

            dirs.forEach(dir => {
                const angle = { 'N': -Math.PI/2, 'E': 0, 'S': Math.PI/2, 'W': Math.PI }[dir];
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(
                    node.x + Math.cos(angle) * (node.radius - 5),
                    node.y + Math.sin(angle) * (node.radius - 5)
                );
                ctx.stroke();
            });
        }

        // Draw blown circuit visuals
        if (node.type === NODE_TYPES.BLOWN) {
            const flicker = Math.sin(rerouteState.pulsePhase * 3 + node.id);

            // X crack pattern
            ctx.strokeStyle = `rgba(255, ${Math.floor(100 + 50 * flicker)}, 0, 0.8)`;
            ctx.lineWidth = 2;
            const r = node.radius * 0.55;
            ctx.beginPath();
            ctx.moveTo(node.x - r, node.y - r);
            ctx.lineTo(node.x + r, node.y + r);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(node.x + r, node.y - r);
            ctx.lineTo(node.x - r, node.y + r);
            ctx.stroke();

            // Occasional sparks
            if (Math.random() < 0.02) {
                for (let i = 0; i < 3; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    rerouteState.sparkParticles.push({
                        x: node.x, y: node.y,
                        vx: Math.cos(angle) * (1 + Math.random()),
                        vy: Math.sin(angle) * (1 + Math.random()),
                        size: 1 + Math.random(), alpha: 0.7
                    });
                }
            }
        }

        // Draw symbol text
        ctx.fillStyle = isPowered ? '#fff' : '#888';
        ctx.font = 'bold 14px "VT323", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (node.type === NODE_TYPES.SOURCE) {
            ctx.fillText('PWR', node.x, node.y);
        } else if (node.type === NODE_TYPES.TARGET) {
            ctx.fillText('OUT', node.x, node.y);
        } else if (node.type === NODE_TYPES.BLOWN) {
            ctx.fillStyle = '#f44';
            ctx.font = 'bold 11px "VT323", monospace';
            ctx.fillText('BRK', node.x, node.y);
        }
    });
}

function drawParticles(ctx) {
    rerouteState.sparkParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 0, ${p.alpha})`;
        ctx.fill();
    });
}

function updateParticles() {
    rerouteState.sparkParticles = rerouteState.sparkParticles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        p.size *= 0.95;
        return p.alpha > 0;
    });
}

function addSparkParticles(x, y) {
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i + Math.random() * 0.5;
        rerouteState.sparkParticles.push({
            x,
            y,
            vx: Math.cos(angle) * (2 + Math.random() * 2),
            vy: Math.sin(angle) * (2 + Math.random() * 2),
            size: 2 + Math.random() * 2,
            alpha: 1
        });
    }
}

function updateStatus() {
    const statusEl = document.getElementById('reroute-status');
    if (!statusEl) return;

    const powered = rerouteState.poweredNodes.size;
    const total = rerouteState.nodes.length;
    const targetPowered = rerouteState.targetNode &&
        rerouteState.poweredNodes.has(rerouteState.targetNode.id);

    if (targetPowered) {
        statusEl.textContent = 'POWER RESTORED!';
        statusEl.style.color = '#0f0';
    } else {
        statusEl.textContent = `NODES POWERED: ${powered}/${total}`;
        statusEl.style.color = powered > total / 2 ? '#ff0' : '#f00';
    }
}

// =============================================================================
// Success / Completion
// =============================================================================

function showRerouteSuccess() {
    if (!rerouteState.active) return;

    cancelAnimationFrame(rerouteState.animationId);

    playLockAchieved();
    playPowerRestoreSound();

    const overlay = document.getElementById('reroute-overlay');
    if (!overlay) return;

    // Flash effect
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
        transition: opacity 0.3s ease-out;
    `;
    overlay.appendChild(flash);
    setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 300);
    }, 100);

    log(`DISH ${rerouteState.dishLabel} power restored!`, 'highlight');

    // Complete after brief delay
    setTimeout(() => {
        completeReroute(true);
    }, 1500);
}

function completeReroute(success) {
    rerouteState.active = false;

    if (rerouteState.animationId) {
        cancelAnimationFrame(rerouteState.animationId);
    }

    // Remove overlay
    const overlay = document.getElementById('reroute-overlay');
    if (overlay) overlay.remove();

    if (success) {
        if (rerouteState.onSuccess) {
            rerouteState.onSuccess();
        }
    } else {
        if (rerouteState.onCancel) {
            rerouteState.onCancel();
        }
    }
}

// =============================================================================
// Audio (shared AudioContext to prevent crackling from too many instances)
// =============================================================================

// Track previous power state to detect changes
let previousPoweredCount = 0;

// Shared audio context - reused across all reroute sounds
let rerouteAudioCtx = null;

function getRerouteAudioCtx() {
    if (!rerouteAudioCtx || rerouteAudioCtx.state === 'closed') {
        rerouteAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (rerouteAudioCtx.state === 'suspended') {
        rerouteAudioCtx.resume();
    }
    return rerouteAudioCtx;
}

function playAlarmSound() {
    try {
        const vol = getMasterVolume();
        const ctx = getRerouteAudioCtx();

        // Urgent two-tone alarm with repeat
        for (let rep = 0; rep < 3; rep++) {
            [500, 350].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.frequency.value = freq;
                osc.type = 'square';
                const startTime = ctx.currentTime + rep * 0.25 + i * 0.1;
                gain.gain.setValueAtTime(0.08 * vol, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

                osc.start(startTime);
                osc.stop(startTime + 0.08);
            });
        }
    } catch (e) {}
}

function playRotateSound() {
    try {
        const vol = getMasterVolume();
        const ctx = getRerouteAudioCtx();

        // Mechanical switch click - two-part sound
        // Part 1: Initial click
        const click = ctx.createOscillator();
        const clickGain = ctx.createGain();
        click.connect(clickGain);
        clickGain.connect(ctx.destination);
        click.frequency.value = 1200;
        click.type = 'square';
        clickGain.gain.setValueAtTime(0.12 * vol, ctx.currentTime);
        clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
        click.start(ctx.currentTime);
        click.stop(ctx.currentTime + 0.02);

        // Part 2: Mechanical whir
        const whir = ctx.createOscillator();
        const whirGain = ctx.createGain();
        whir.connect(whirGain);
        whirGain.connect(ctx.destination);
        whir.frequency.setValueAtTime(200, ctx.currentTime + 0.02);
        whir.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
        whir.type = 'sawtooth';
        whirGain.gain.setValueAtTime(0.04 * vol, ctx.currentTime + 0.02);
        whirGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        whir.start(ctx.currentTime + 0.02);
        whir.stop(ctx.currentTime + 0.1);

        // Part 3: Settle click
        const settle = ctx.createOscillator();
        const settleGain = ctx.createGain();
        settle.connect(settleGain);
        settleGain.connect(ctx.destination);
        settle.frequency.value = 800;
        settle.type = 'square';
        settleGain.gain.setValueAtTime(0.08 * vol, ctx.currentTime + 0.1);
        settleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        settle.start(ctx.currentTime + 0.1);
        settle.stop(ctx.currentTime + 0.12);
    } catch (e) {}
}

function playErrorBlip() {
    try {
        const vol = getMasterVolume();
        const ctx = getRerouteAudioCtx();

        // Denied buzzer sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = 120;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.06 * vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
}

function playPowerConnectSound() {
    try {
        const vol = getMasterVolume();
        const ctx = getRerouteAudioCtx();

        // Electrical zap/connection sound
        const zap = ctx.createOscillator();
        const zapGain = ctx.createGain();
        zap.connect(zapGain);
        zapGain.connect(ctx.destination);
        zap.frequency.setValueAtTime(100, ctx.currentTime);
        zap.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.03);
        zap.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
        zap.type = 'sawtooth';
        zapGain.gain.setValueAtTime(0.1 * vol, ctx.currentTime);
        zapGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        zap.start(ctx.currentTime);
        zap.stop(ctx.currentTime + 0.1);

        // Hum stabilization
        const hum = ctx.createOscillator();
        const humGain = ctx.createGain();
        hum.connect(humGain);
        humGain.connect(ctx.destination);
        hum.frequency.value = 60;
        hum.type = 'sine';
        humGain.gain.setValueAtTime(0.03 * vol, ctx.currentTime + 0.05);
        humGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        hum.start(ctx.currentTime + 0.05);
        hum.stop(ctx.currentTime + 0.2);
    } catch (e) {}
}

function playPowerDisconnectSound() {
    try {
        const vol = getMasterVolume();
        const ctx = getRerouteAudioCtx();

        // Power down sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.06 * vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
}

function playPowerRestoreSound() {
    try {
        const vol = getMasterVolume();
        const ctx = getRerouteAudioCtx();

        // Big power-up sequence
        // Initial surge (quieter so it doesn't mask the chime)
        const surge = ctx.createOscillator();
        const surgeGain = ctx.createGain();
        surge.connect(surgeGain);
        surgeGain.connect(ctx.destination);
        surge.frequency.setValueAtTime(60, ctx.currentTime);
        surge.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
        surge.type = 'sawtooth';
        surgeGain.gain.setValueAtTime(0.08 * vol, ctx.currentTime);
        surgeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        surge.start(ctx.currentTime);
        surge.stop(ctx.currentTime + 0.25);

        // Victory chime - C major arpeggio (louder, more distinct)
        // Using triangle wave to cut through better
        [523, 659, 784, 1047].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = freq;
            osc.type = 'triangle';
            const startTime = ctx.currentTime + 0.3 + i * 0.12;
            gain.gain.setValueAtTime(0.18 * vol, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });

        // Final confirmation beep (triumphant high note)
        setTimeout(() => {
            try {
                const ctx2 = getRerouteAudioCtx();
                const beep = ctx2.createOscillator();
                const beepGain = ctx2.createGain();
                beep.connect(beepGain);
                beepGain.connect(ctx2.destination);
                beep.frequency.value = 1320;
                beep.type = 'triangle';
                beepGain.gain.setValueAtTime(0.12 * vol, ctx2.currentTime);
                beepGain.gain.exponentialRampToValueAtTime(0.001, ctx2.currentTime + 0.3);
                beep.start(ctx2.currentTime);
                beep.stop(ctx2.currentTime + 0.3);
            } catch (e) {}
        }, 800);
    } catch (e) {}
}

// Check for power changes and play appropriate sounds
function checkPowerChanges() {
    const newPoweredCount = rerouteState.poweredNodes.size;

    if (newPoweredCount > previousPoweredCount) {
        // Gained power - play connect sound
        playPowerConnectSound();
    } else if (newPoweredCount < previousPoweredCount) {
        // Lost power - play disconnect sound
        playPowerDisconnectSound();
    }

    previousPoweredCount = newPoweredCount;
}

// =============================================================================
// Exports
// =============================================================================

export function isRerouteActive() {
    return rerouteState.active;
}
