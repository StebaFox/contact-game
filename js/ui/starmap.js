// ═════════════════════════════════════════════════════════════════════════════
// STARMAP UI
// Star catalog, canvas rendering, and star selection
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { showView, log, clearCanvas, calculateScanBoxPosition } from './rendering.js';
import { playClick, playSelectStar, playStaticBurst, playScanAcknowledge, stopNaturalPhenomenaSound, stopAlienSignalSound, stopStaticHiss, switchToBackgroundMusic } from '../systems/audio.js';
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

export function setStarmapFunctions(fns) {
    setArrayTargetFn = fns.setArrayTarget;
    if (fns.stopSignalAnimation) stopSignalAnimationFn = fns.stopSignalAnimation;
    renderStarmapArrayFn = fns.renderStarmapArray;
    updateStarmapArrayStatsFn = fns.updateStarmapArrayStats;
    if (fns.drawStarVisualization) {
        drawStarVisualizationFn = fns.drawStarVisualization;
    }
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
    27: { requiredPower: 9 }    // DELTA PAVONIS (false positive) - medium
};

// Generate background stars for parallax effect
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
            brightness: Math.floor(Math.random() * 80 + 175), // 175-255 range
            alpha: Math.random() * 0.4 + 0.3, // 0.3-0.7 range
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            twinkleOffset: Math.random() * Math.PI * 2
        });
    }
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
            x: Math.random() * 940 + 30, // Position for visual map (30-970)
            y: Math.random() * 500 + 25  // Position for visual map (25-525)
        };

        gameState.stars.push(star);
    });

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

        if (isFutureDay) {
            // Hide future day stars completely
            item.style.display = 'none';
        } else if (isPreviousDay) {
            // Show previous day stars (dimmed, already analyzed)
            item.style.display = 'block';
            item.style.opacity = '0.5';
            item.style.pointerEvents = 'auto';

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
                statusEl.textContent = '● COMPLETE';
                statusEl.style.color = '#ff0';
            }
        } else {
            // Current day stars - show normally
            item.style.display = 'block';
            item.style.opacity = isAnalyzed ? '0.7' : '1';
            item.style.pointerEvents = 'auto';

            // Remove any old indicators
            const oldIndicator = item.querySelector('.analyzed-indicator');
            if (oldIndicator) oldIndicator.remove();

            // Update status based on analyzed state
            const statusEl = item.querySelector('.star-status');
            if (statusEl && isAnalyzed && !statusEl.dataset.status) {
                statusEl.dataset.status = 'analyzed';
                statusEl.textContent = '● COMPLETE';
                statusEl.style.color = '#ff0';
            }
        }
    });
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

    // Determine star glow color and size based on spectral type
    // Spectral types: O, B (blue), A (white), F (yellow-white), G (yellow), K (orange), M (red), D (white dwarf)
    let glowColor, glowSize;
    const spectralClass = star.starType.charAt(0).toUpperCase();

    switch(spectralClass) {
        case 'O': // Blue supergiant
            glowColor = '#9bb0ff';
            glowSize = 50;
            break;
        case 'B': // Blue-white
            glowColor = '#aabfff';
            glowSize = 45;
            break;
        case 'A': // White (like Sirius)
            glowColor = '#cad7ff';
            glowSize = 42;
            break;
        case 'F': // Yellow-white (like Procyon)
            glowColor = '#f8f7ff';
            glowSize = 40;
            break;
        case 'G': // Yellow dwarf (like our Sun)
            glowColor = '#fff4ea';
            glowSize = 38;
            break;
        case 'K': // Orange dwarf
            glowColor = '#ffd2a1';
            glowSize = 35;
            break;
        case 'M': // Red dwarf
            glowColor = '#ffcc6f';
            glowSize = 32;
            break;
        case 'D': // White dwarf
            glowColor = '#f0f0ff';
            glowSize = 28;
            break;
        default:
            glowColor = '#ffffff';
            glowSize = 36;
    }

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

    // Play selection sounds
    playSelectStar();
    playStaticBurst();

    // Check scan status
    const isScanned = gameState.scannedSignals.has(starId);
    const isAnalyzed = gameState.analyzedStars.has(starId);
    const hasContact = gameState.contactedStars.has(starId);
    const scanResult = gameState.scanResults.get(starId);

    // Determine if this star is "complete" (can't be scanned again)
    const isComplete = hasContact || (scanResult && (scanResult.type === 'false_positive' || scanResult.type === 'natural' || scanResult.type === 'verified_signal'));

    // Only show scan confirmation if not complete
    gameState.showScanConfirm = !isComplete;

    // Build status indicator with scan result details
    let statusBadge = '';
    if (hasContact) {
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
        // Clear array target when selecting non-weak signal star or complete star
        if (gameState.dishArray.currentTargetStar) {
            gameState.dishArray.currentTargetStar = null;
            gameState.dishArray.requiredPower = 0;
            if (renderStarmapArrayFn) renderStarmapArrayFn();
            if (updateStarmapArrayStatsFn) updateStarmapArrayStatsFn();
        }
    }

    log(`Target acquired: ${star.name}`);
    log(`Coordinates: ${star.coordinates}, Distance: ${star.distance} ly`);
    log(`Star Type: ${star.starType} (${star.starClass}), Temperature: ${star.temperature}`);
    if (star.signalStrength === 'weak' && !isComplete) {
        log(`WEAK SIGNAL - Array alignment required`, 'warning');
    }
}

// Initiate scan sequence (called when user confirms)
export function startScanSequence() {
    const star = gameState.currentStar;

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

    // Draw star visualization in analysis view
    drawStarVisualization(star, 'analysis-star-visual');

    showView('analysis-view');

    document.getElementById('analyze-btn').disabled = true;
    document.getElementById('analysis-text').innerHTML =
        '<p>AWAITING SCAN INITIALIZATION...</p>';

    clearCanvas('waveform-canvas');
    clearCanvas('spectrogram-canvas');

    log('Switching to analysis mode...');
}

// Render star map
export function renderStarMap() {
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

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
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

        // Star color based on status
        if (isPreviousDay) {
            // Previous day stars are dimmed
            ctx.globalAlpha = 0.4;
            if (isContacted) {
                ctx.fillStyle = '#808';
                ctx.shadowColor = '#808';
            } else {
                ctx.fillStyle = '#880';
                ctx.shadowColor = '#880';
            }
        } else if (isContacted) {
            ctx.fillStyle = '#f0f';
            ctx.shadowColor = '#f0f';
        } else if (isAnalyzed) {
            ctx.fillStyle = '#ff0';
            ctx.shadowColor = '#ff0';
        } else {
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#fff';
        }

        ctx.shadowBlur = isSelected && !isPreviousDay ? 15 : (isPreviousDay ? 5 : 10);

        // Draw star (pixel art style)
        const size = isSelected && !isPreviousDay ? 5 : 3;
        ctx.fillRect(parallaxX - size / 2, parallaxY - size / 2, size, size);

        // Draw cross pattern (smaller for previous day)
        if (!isPreviousDay) {
            ctx.fillRect(parallaxX - size - 2, parallaxY - 1, 2, 2);
            ctx.fillRect(parallaxX + size, parallaxY - 1, 2, 2);
            ctx.fillRect(parallaxX - 1, parallaxY - size - 2, 2, 2);
            ctx.fillRect(parallaxX - 1, parallaxY + size, 2, 2);
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    });

    // Draw rotating crosshair on selected star
    if (gameState.selectedStarId !== null) {
        const star = gameState.stars[gameState.selectedStarId];

        // Apply same parallax as target stars
        const parallaxX = star.x + gameState.parallaxOffsetX * 0.3;
        const parallaxY = star.y + gameState.parallaxOffsetY * 0.3;

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

    // Draw scan confirmation box
    if (gameState.showScanConfirm && gameState.selectedStarId !== null) {
        const star = gameState.stars[gameState.selectedStarId];

        // Calculate box position with edge detection
        const { boxX, boxY, boxWidth, boxHeight } = calculateScanBoxPosition(star, width);

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
    }
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
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicking on scan confirmation box
        if (gameState.showScanConfirm && gameState.selectedStarId !== null) {
            const star = gameState.stars[gameState.selectedStarId];
            const { boxX, boxY, boxWidth, boxHeight } = calculateScanBoxPosition(star, canvas.width);

            if (x >= boxX && x <= boxX + boxWidth && y >= boxY && y <= boxY + boxHeight) {
                // Clicked on scan box
                startScanSequence();
                return;
            }
        }

        // Find clicked star
        gameState.stars.forEach(star => {
            const dx = star.x - x;
            const dy = star.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 10) {
                gameState.selectedStarId = star.id;
                selectStar(star.id);
            }
        });
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

        // Reset star info panel
        document.getElementById('star-details').innerHTML = '<div class="detail-label">SELECT A TARGET</div>';
        clearStarVisualization();

        // Stop ambient sounds
        stopNaturalPhenomenaSound();
        stopAlienSignalSound();
        stopStaticHiss();

        // Switch back to background music when returning to map
        switchToBackgroundMusic();

        showView('starmap-view');
        log('Returned to stellar catalog');

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

        // Reset star info panel
        document.getElementById('star-details').innerHTML = '<div class="detail-label">SELECT A TARGET</div>';
        clearStarVisualization();

        // Stop ambient sounds
        stopNaturalPhenomenaSound();
        stopAlienSignalSound();
        stopStaticHiss();

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
