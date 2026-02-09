// ═════════════════════════════════════════════════════════════════════════════
// RENDERING UTILITIES
// Core UI rendering functions and utilities
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';

// Switch between views
export function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

// Clear canvas
export function clearCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Type out analysis text line by line
export function typeAnalysisText(lines, callback) {
    const analysisText = document.getElementById('analysis-text');
    analysisText.innerHTML = '';

    let lineIndex = 0;

    function typeLine() {
        if (lineIndex < lines.length) {
            const p = document.createElement('p');

            // Handle styled lines
            if (typeof lines[lineIndex] === 'object') {
                p.innerHTML = lines[lineIndex].text;
                if (lines[lineIndex].style) {
                    p.style.cssText = lines[lineIndex].style;
                }
            } else {
                p.textContent = lines[lineIndex];
            }

            analysisText.appendChild(p);
            lineIndex++;

            setTimeout(typeLine, 150); // Delay between lines
        } else if (callback) {
            callback();
        }
    }

    typeLine();
}

// Logging with typing effect
export function log(message, className = '') {
    const logContent = document.getElementById('log-content');
    const entry = document.createElement('div');
    entry.className = 'log-entry' + (className ? ' ' + className : '');

    const timestamp = `[${new Date().toTimeString().substring(0, 8)}] `;
    const fullMessage = timestamp + message;

    // Add empty entry first
    entry.textContent = '';
    logContent.appendChild(entry);

    // Type out character by character
    let charIndex = 0;
    const typeInterval = setInterval(() => {
        if (charIndex < fullMessage.length) {
            entry.textContent += fullMessage[charIndex];
            charIndex++;

            // Auto-scroll to bottom
            logContent.scrollTop = logContent.scrollHeight;
        } else {
            clearInterval(typeInterval);
        }
    }, 20); // 20ms per character = very fast typing

    // Keep only last 20 entries
    while (logContent.children.length > 20) {
        logContent.removeChild(logContent.firstChild);
    }
}

// Calculate scan box position with edge detection
export function calculateScanBoxPosition(star, canvasWidth) {
    const parallaxX = star.x + gameState.parallaxOffsetX * 0.3;
    const parallaxY = star.y + gameState.parallaxOffsetY * 0.3;
    const boxWidth = 120;
    const boxHeight = 60;

    // Try to position to the right first
    let boxX = parallaxX + 40;
    const boxY = parallaxY - 20;

    // Check if box would go off the right edge
    if (boxX + boxWidth > canvasWidth - 10) {
        // Position to the left instead
        boxX = parallaxX - boxWidth - 10;
    }

    // Check if box would go off the left edge (very close to left edge)
    if (boxX < 10) {
        boxX = 10; // Clamp to left edge with some padding
    }

    return { boxX, boxY, boxWidth, boxHeight };
}

// Update the in-game clock
export function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// Generate random background stars for the starmap
export function generateBackgroundStars() {
    gameState.backgroundStars = [];
    for (let i = 0; i < 200; i++) {
        gameState.backgroundStars.push({
            x: Math.random() * 800,
            y: Math.random() * 600,
            size: Math.random() * 1.5 + 0.5,
            twinkleOffset: Math.random() * Math.PI * 2
        });
    }
}
