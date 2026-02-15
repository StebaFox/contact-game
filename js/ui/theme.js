// ═════════════════════════════════════════════════════════════════════════════
// THEME SYSTEM
// Color scheme and layout mode management
// ═════════════════════════════════════════════════════════════════════════════

import { log } from './rendering.js';

// Layout mode state
let currentLayoutMode = 'auto'; // 'auto', 'desktop', 'mobile'

// Toggle between green and white color schemes
export function toggleColorScheme() {
    const body = document.body;
    const isWhiteMode = body.classList.toggle('white-mode');

    // Update button label
    const schemeLabel = document.getElementById('scheme-label');
    schemeLabel.textContent = isWhiteMode ? 'WHITE' : 'GREEN';

    // Save preference to localStorage
    try { localStorage.setItem('colorScheme', isWhiteMode ? 'white' : 'green'); } catch (e) {}

    log(`Color scheme changed to ${isWhiteMode ? 'WHITE' : 'GREEN'} mode`);
}

// Load saved color scheme from localStorage
export function loadColorScheme() {
    try {
        const savedScheme = localStorage.getItem('colorScheme');
        if (savedScheme === 'white') {
            document.body.classList.add('white-mode');
            document.getElementById('scheme-label').textContent = 'WHITE';
        }
    } catch (e) { /* localStorage unavailable (e.g. itch.io iframe) */ }
}

// Toggle layout mode (AUTO -> DESKTOP -> MOBILE -> AUTO)
export function toggleLayoutMode() {
    const body = document.body;
    const layoutLabel = document.getElementById('layout-label');

    // Cycle through: AUTO -> DESKTOP -> MOBILE -> AUTO
    if (currentLayoutMode === 'auto') {
        currentLayoutMode = 'desktop';
        body.classList.add('force-desktop');
        body.classList.remove('force-mobile');
        layoutLabel.textContent = 'DESKTOP';
    } else if (currentLayoutMode === 'desktop') {
        currentLayoutMode = 'mobile';
        body.classList.remove('force-desktop');
        body.classList.add('force-mobile');
        layoutLabel.textContent = 'MOBILE';
    } else {
        currentLayoutMode = 'auto';
        body.classList.remove('force-desktop');
        body.classList.remove('force-mobile');
        layoutLabel.textContent = 'AUTO';
    }

    // Save preference
    try { localStorage.setItem('layoutMode', currentLayoutMode); } catch (e) {}

    log(`Layout mode: ${currentLayoutMode.toUpperCase()}`);
}

// Load saved layout mode from localStorage
export function loadLayoutMode() {
    let savedMode = null;
    try { savedMode = localStorage.getItem('layoutMode'); } catch (e) {}

    const body = document.body;
    const layoutLabel = document.getElementById('layout-label');

    if (savedMode) {
        currentLayoutMode = savedMode;

        if (savedMode === 'desktop') {
            body.classList.add('force-desktop');
            layoutLabel.textContent = 'DESKTOP';
        } else if (savedMode === 'mobile') {
            body.classList.add('force-mobile');
            layoutLabel.textContent = 'MOBILE';
        } else {
            layoutLabel.textContent = 'AUTO';
        }
    }
}

// Get current layout mode
export function getCurrentLayoutMode() {
    return currentLayoutMode;
}
