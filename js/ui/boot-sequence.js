// ═════════════════════════════════════════════════════════════════════════════
// BOOT SEQUENCE
// Game startup animation and player name entry
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { showView, log } from './rendering.js';
import { playClick, playTypingBeep } from '../systems/audio.js';
import { BOOT_INITIAL, BOOT_CONTINUATION } from '../narrative/boot-messages.js';
import { WELCOME_EMAIL } from '../narrative/emails.js';
import { addMailMessage } from '../systems/mailbox.js';

// External function references (set by main.js to avoid circular deps)
let renderStarMapFn = null;
let playSecurityBeepFn = null;

export function setBootFunctions(fns) {
    renderStarMapFn = fns.renderStarMap;
    playSecurityBeepFn = fns.playSecurityBeep;
}

// Play typing sound (wrapper for consistency)
function playTypingSound() {
    playTypingBeep();
}

// Play security beep
function playSecurityBeep(type) {
    if (playSecurityBeepFn) playSecurityBeepFn(type);
}

// Type a single boot line
function typeBootLine(text, className = '', delay = 0, beepType = null) {
    return new Promise(resolve => {
        setTimeout(() => {
            const bootOutput = document.getElementById('boot-output');
            const line = document.createElement('div');
            line.className = `boot-line ${className}`;
            line.textContent = text;
            bootOutput.appendChild(line);

            // Auto-scroll the main-content container to show the new line
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollTop = mainContent.scrollHeight;
            }

            // Play typing sound
            if (text.length > 0) {
                playTypingSound();
            }

            // Play beep if specified
            if (beepType) {
                setTimeout(() => playSecurityBeep(beepType), 150);
            }

            // Add slight delay for animation
            setTimeout(resolve, 100);
        }, delay);
    });
}

// Run the initial boot sequence
async function runBootSequence() {
    const bootLines = BOOT_INITIAL;

    for (const line of bootLines) {
        await typeBootLine(line.text, line.class, line.delay, line.beep);
    }

    // Show name input with beep
    playSecurityBeep('normal');
    document.getElementById('name-input-container').style.display = 'block';
    document.getElementById('name-input').focus();
}

// Continue boot sequence after name entry
function continueBootSequence(playerName) {
    gameState.playerName = playerName;

    const nameInputContainer = document.getElementById('name-input-container');
    nameInputContainer.style.display = 'none';

    // Replace {NAME} placeholder with actual player name
    const continuationLines = BOOT_CONTINUATION.map(line => ({
        ...line,
        text: line.text.replace('{NAME}', playerName)
    }));

    (async () => {
        for (const line of continuationLines) {
            await typeBootLine(line.text, line.class, line.delay, line.beep);
        }

        // Show proceed button instead of auto-transitioning
        setTimeout(() => {
            const proceedBtn = document.getElementById('proceed-btn');
            proceedBtn.style.display = 'block';
            playSecurityBeep('success');
        }, 500);
    })();
}

// Setup boot sequence event listeners
export function setupBootSequence() {
    // Start button
    document.getElementById('start-btn').addEventListener('click', () => {
        playClick();
        showView('boot-view');
        runBootSequence();
    });

    // Name input submit
    document.getElementById('name-submit-btn').addEventListener('click', () => {
        const nameInput = document.getElementById('name-input');
        const name = nameInput.value.trim();

        if (name) {
            playClick();
            continueBootSequence(name);
        }
    });

    // Allow Enter key to submit name
    document.getElementById('name-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const name = e.target.value.trim();
            if (name) {
                playClick();
                continueBootSequence(name);
            }
        }
    });

    // Typing sounds for name input
    const nameInput = document.getElementById('name-input');
    nameInput.addEventListener('input', (e) => {
        playTypingSound();
    });

    // Proceed to array button
    document.getElementById('proceed-btn').addEventListener('click', () => {
        playClick();
        showView('starmap-view');
        // Show mailbox button now that user has entered the system
        document.getElementById('mailbox-btn').style.display = 'block';

        // Run starmap initialization sequence
        initializeStarmapSequence();

        // Send welcome message after entering the starmap
        setTimeout(() => {
            addMailMessage(WELCOME_EMAIL.from, WELCOME_EMAIL.subject, WELCOME_EMAIL.body);
        }, 3000);
    });
}

// Starmap initialization sequence
export function initializeStarmapSequence() {
    const starmapSection = document.querySelector('.starmap-section');
    const starGrid = document.getElementById('star-grid');
    const canvas = document.getElementById('starmap-canvas');
    const ctx = canvas.getContext('2d');

    // Hide elements initially
    starmapSection.style.opacity = '0';
    starGrid.style.opacity = '0';

    // Create initialization overlay
    const overlay = document.createElement('div');
    overlay.id = 'starmap-init-overlay';
    overlay.innerHTML = `
        <div class="init-text" id="init-status">INITIALIZING DEEP SPACE ARRAY...</div>
        <div class="init-progress">
            <div class="init-bar" id="init-bar"></div>
        </div>
    `;

    // Add overlay styles
    const style = document.createElement('style');
    style.id = 'starmap-init-styles';
    style.textContent = `
        #starmap-init-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .init-text {
            color: #0f0;
            font-family: 'VT323', monospace;
            font-size: 24px;
            text-shadow: 0 0 10px #0f0;
            margin-bottom: 30px;
            letter-spacing: 3px;
        }
        .init-progress {
            width: 400px;
            height: 20px;
            border: 2px solid #0f0;
            background: transparent;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
        }
        .init-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #0f0, #0ff);
            box-shadow: 0 0 20px #0f0;
            transition: width 0.1s linear;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    const initBar = document.getElementById('init-bar');
    const initStatus = document.getElementById('init-status');

    const initSteps = [
        { progress: 10, text: 'CALIBRATING SENSORS...', delay: 300 },
        { progress: 25, text: 'ESTABLISHING UPLINK...', delay: 400 },
        { progress: 40, text: 'SYNCHRONIZING ARRAY...', delay: 350 },
        { progress: 55, text: 'LOADING STELLAR CATALOG...', delay: 400 },
        { progress: 70, text: 'MAPPING COORDINATES...', delay: 300 },
        { progress: 85, text: 'SCANNING SECTOR 7...', delay: 450 },
        { progress: 100, text: 'ARRAY ONLINE', delay: 300 }
    ];

    let stepIndex = 0;

    function runInitStep() {
        if (stepIndex < initSteps.length) {
            const step = initSteps[stepIndex];
            initBar.style.width = step.progress + '%';
            initStatus.textContent = step.text;
            playTypingSound();

            stepIndex++;
            setTimeout(runInitStep, step.delay);
        } else {
            // Initialization complete
            setTimeout(() => {
                // Fade out overlay
                overlay.style.transition = 'opacity 0.5s';
                overlay.style.opacity = '0';

                // Fade in starmap
                starmapSection.style.transition = 'opacity 1s';
                starmapSection.style.opacity = '1';

                // Animate stars appearing on canvas
                animateStarsAppearing();

                // Fade in star catalog
                setTimeout(() => {
                    starGrid.style.transition = 'opacity 0.8s';
                    starGrid.style.opacity = '1';
                }, 500);

                // Clean up
                setTimeout(() => {
                    overlay.remove();
                    style.remove();
                    log(`Dr. ${gameState.playerName} logged in - System ready`, 'highlight');
                }, 1000);
            }, 500);
        }
    }

    // Start initialization
    setTimeout(runInitStep, 500);
}

// Animate stars appearing on the starmap canvas
function animateStarsAppearing() {
    const canvas = document.getElementById('starmap-canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Store original star positions
    const stars = [...gameState.stars];
    let revealedStars = 0;
    const totalStars = stars.length;

    // Scan line effect
    let scanY = 0;
    const scanSpeed = 15;

    function drawScanEffect() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        // Draw grid lines (subtle)
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, Math.min(scanY, height));
            ctx.stroke();
        }
        for (let y = 0; y < Math.min(scanY, height); y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw scan line
        ctx.strokeStyle = '#0f0';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#0f0';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Reveal stars as scan passes them
        stars.forEach((star, index) => {
            if (star.y <= scanY) {
                // Draw revealed star
                const isIntelligent = star.hasIntelligence;
                ctx.fillStyle = isIntelligent ? '#0ff' : '#0f0';
                ctx.shadowColor = isIntelligent ? '#0ff' : '#0f0';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(star.x, star.y, isIntelligent ? 6 : 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Draw star label
                ctx.fillStyle = '#0f0';
                ctx.font = '10px VT323';
                ctx.fillText(star.name, star.x + 10, star.y + 3);
            }
        });

        scanY += scanSpeed;

        if (scanY < height + 50) {
            requestAnimationFrame(drawScanEffect);
        } else {
            // Scan complete, draw final state
            if (renderStarMapFn) renderStarMapFn();
        }
    }

    drawScanEffect();
}
