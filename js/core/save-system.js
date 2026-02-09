// ═══════════════════════════════════════════════════════════════════════════
// SAVE SYSTEM
// Auto-save, load, and day codes for quick access
// ═══════════════════════════════════════════════════════════════════════════

import { gameState } from './game-state.js';

const SAVE_KEY = 'seti_save';
const SAVE_VERSION = '1.0';

// ─────────────────────────────────────────────────────────────────────────────
// Auto-Save
// ─────────────────────────────────────────────────────────────────────────────

export function autoSave() {
    const saveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),

        // Player info
        playerName: gameState.playerName,

        // Day progression
        currentDay: gameState.currentDay || 1,
        daysCompleted: gameState.daysCompleted || [],

        // Star progress (convert Sets to Arrays for JSON)
        analyzedStars: Array.from(gameState.analyzedStars || []),
        contactedStars: Array.from(gameState.contactedStars || []),

        // Scan results (convert Map to Array of entries)
        scanResults: Array.from(gameState.scanResults?.entries() || []),
        // Strip ImageData (canvas pixel data) from scannedSignals — too large for localStorage
        scannedSignals: Array.from(gameState.scannedSignals?.entries() || []).map(
            ([key, val]) => [key, {
                ...val,
                waveformData: undefined,
                spectrogramData: undefined,
                star: val.star ? { id: val.star.id, name: val.star.name } : undefined
            }]
        ),

        // Messages
        discoveredMessages: gameState.discoveredMessages || [],
        journalEntries: gameState.journalEntries || [],
        mailboxMessages: gameState.mailboxMessages || [],
        unreadMailCount: gameState.unreadMailCount || 0,

        // Fragments for final puzzle
        fragments: gameState.fragments || {
            collected: [],
            sources: {}
        },

        // Investigation state
        investigationUnlocked: gameState.investigationUnlocked || false,
        dynamicStars: gameState.dynamicStars || [],

        // Progress flags
        flags: {
            tutorialCompleted: gameState.tutorialCompleted || false,
            decryptionComplete: gameState.decryptionComplete || false,
            cmbDetected: gameState.cmbDetected || false,
            finalPuzzleComplete: gameState.finalPuzzleComplete || false,
            dayReportShown: gameState.dayReportShown || 0,
            day2CliffhangerPhase: gameState.day2CliffhangerPhase ?? -1
        }
    };

    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        console.log('SIGNAL: Game saved at', new Date(saveData.timestamp).toLocaleTimeString());
        return true;
    } catch (e) {
        console.error('SIGNAL: Failed to save game:', e);
        return false;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Load Save
// ─────────────────────────────────────────────────────────────────────────────

export function loadSave() {
    try {
        const saveData = localStorage.getItem(SAVE_KEY);
        if (!saveData) return null;

        const data = JSON.parse(saveData);

        // Version check
        if (data.version !== SAVE_VERSION) {
            console.warn('SIGNAL: Save file version mismatch, may have compatibility issues');
        }

        return data;
    } catch (e) {
        console.error('SIGNAL: Failed to load save:', e);
        return null;
    }
}

export function hasSaveFile() {
    return localStorage.getItem(SAVE_KEY) !== null;
}

export function applySaveData(data) {
    if (!data) return false;

    try {
        // Player info
        gameState.playerName = data.playerName || '';

        // Day progression
        gameState.currentDay = data.currentDay || 1;
        gameState.daysCompleted = data.daysCompleted || [];

        // Star progress (convert Arrays back to Sets)
        gameState.analyzedStars = new Set(data.analyzedStars || []);
        gameState.contactedStars = new Set(data.contactedStars || []);

        // Scan results (convert Array of entries back to Maps)
        gameState.scanResults = new Map(data.scanResults || []);
        gameState.scannedSignals = new Map(data.scannedSignals || []);

        // Messages
        gameState.discoveredMessages = data.discoveredMessages || [];
        gameState.journalEntries = data.journalEntries || [];
        gameState.mailboxMessages = data.mailboxMessages || [];
        gameState.unreadMailCount = data.unreadMailCount || 0;

        // Fragments
        gameState.fragments = data.fragments || {
            collected: [],
            sources: {}
        };

        // Investigation state
        gameState.investigationUnlocked = data.investigationUnlocked || false;
        gameState.dynamicStars = data.dynamicStars || [];

        // Progress flags
        if (data.flags) {
            gameState.tutorialCompleted = data.flags.tutorialCompleted || false;
            gameState.decryptionComplete = data.flags.decryptionComplete || false;
            gameState.cmbDetected = data.flags.cmbDetected || false;
            gameState.finalPuzzleComplete = data.flags.finalPuzzleComplete || false;
            gameState.dayReportShown = data.flags.dayReportShown || 0;
            gameState.day2CliffhangerPhase = data.flags.day2CliffhangerPhase ?? -1;
        }

        console.log('SIGNAL: Save data applied successfully');
        return true;
    } catch (e) {
        console.error('SIGNAL: Failed to apply save data:', e);
        return false;
    }
}

export function deleteSave() {
    try {
        localStorage.removeItem(SAVE_KEY);
        console.log('SIGNAL: Save deleted');
        return true;
    } catch (e) {
        console.error('SIGNAL: Failed to delete save:', e);
        return false;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Day Codes
// Quick-access codes to jump to specific points in the game
// ─────────────────────────────────────────────────────────────────────────────

const DAY_CODES = {
    // Day 1 fresh start
    'ALPHA-001': {
        day: 1,
        scannedStars: [],
        fragments: { collected: [], sources: {} },
        flags: {}
    },

    // Day 2 start (Ross 128 discovered, Day 1 complete)
    'SIGMA-042': {
        day: 2,
        scannedStars: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        fragments: { collected: [], sources: {} },
        flags: {}
    },

    // Day 3 start (decryption complete, ready for breadcrumb trail)
    'OMEGA-137': {
        day: 3,
        scannedStars: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        fragments: {
            collected: [],
            sources: { src7024: null, nexusPoint: null, eridani82: null, synthesis: null }
        },
        dynamicStars: [
            {
                id: 'src7024', name: 'SRC-7024', isDynamic: true, dynamicType: 'signal',
                coordinates: '11h 47m 44s / +0° 48\' 16"', distance: '14.2',
                starType: 'SIGNAL SOURCE', starClass: 'UNKNOWN', temperature: 'N/A',
                hasIntelligence: true, isFalsePositive: false, x: 0.72, y: 0.35
            }
        ],
        flags: {
            decryptionComplete: true,
            day2CliffhangerPhase: 5
        }
    },

    // All fragments collected (ready for final decryption)
    'FINAL-999': {
        day: 3,
        scannedStars: Array.from({ length: 29 }, (_, i) => i),
        fragments: {
            collected: ['src7024', 'nexusPoint', 'eridani82', 'synthesis'],
            sources: {
                src7024: true,
                nexusPoint: true,
                eridani82: true,
                synthesis: true
            }
        },
        dynamicStars: [
            {
                id: 'src7024', name: 'SRC-7024', isDynamic: true, dynamicType: 'signal',
                coordinates: '11h 47m 44s / +0° 48\' 16"', distance: '14.2',
                starType: 'SIGNAL SOURCE', starClass: 'UNKNOWN', temperature: 'N/A',
                hasIntelligence: true, isFalsePositive: false, x: 0.72, y: 0.35
            },
            {
                id: 'nexusPoint', name: 'NEXUS POINT', isDynamic: true, dynamicType: 'nexus',
                coordinates: '?? ?? ?? / ?? ?? ??', distance: '???',
                starType: 'EXTRAGALACTIC', starClass: 'ULTRA-DENSE', temperature: 'N/A',
                hasIntelligence: true, isFalsePositive: false, x: 0.85, y: 0.55
            },
            {
                id: 'genesis', name: 'GENESIS POINT', isDynamic: true, dynamicType: 'genesis',
                coordinates: '03h 19m 28s / -16° 42\' 58"', distance: '???',
                starType: 'PRIMORDIAL SOURCE', starClass: 'PRE-COSMIC', temperature: 'N/A',
                hasIntelligence: true, isFalsePositive: false, x: 0.15, y: 0.70
            }
        ],
        flags: {
            decryptionComplete: true,
            cmbDetected: true,
            tutorialCompleted: true,
            investigationUnlocked: true,
            day2CliffhangerPhase: 5
        }
    },

    // Demo mode - all content unlocked (current game behavior)
    'DEMO-000': {
        day: 0, // Special: day 0 = demo mode, no restrictions
        scannedStars: [],
        fragments: { collected: [], sources: {} },
        flags: { demoMode: true }
    }
};

export function applyDayCode(code) {
    const normalizedCode = code.toUpperCase().trim();
    const codeData = DAY_CODES[normalizedCode];

    if (!codeData) {
        return { success: false, error: 'Invalid code' };
    }

    // Reset all progress flags for clean slate
    gameState.tutorialCompleted = false;
    gameState.decryptionComplete = false;
    gameState.cmbDetected = false;
    gameState.finalPuzzleComplete = false;
    gameState.dayReportShown = 0;
    gameState.demoMode = false;
    gameState.investigationUnlocked = false;
    gameState.dynamicStars = [];
    gameState.day2CliffhangerPhase = -1;

    // Clear runtime caches and collections
    gameState.scannedSignals = new Map();
    gameState.contactedStars = new Set();
    gameState.mailboxMessages = [];
    gameState.unreadMailCount = 0;
    gameState.discoveredMessages = [];
    gameState.journalEntries = [];

    // Apply the code state
    gameState.currentDay = codeData.day;
    gameState.daysCompleted = [];

    // Mark days as completed based on current day
    if (codeData.day >= 2) gameState.daysCompleted.push(1);
    if (codeData.day >= 3) gameState.daysCompleted.push(2);

    // Mark scanned stars
    gameState.analyzedStars = new Set(codeData.scannedStars);
    gameState.scanResults = new Map();
    codeData.scannedStars.forEach(starIndex => {
        // Ross 128 (index 8) keeps encrypted_signal type if decryption isn't done yet
        if (starIndex === 8 && !codeData.flags?.decryptionComplete) {
            gameState.scanResults.set(starIndex, { type: 'encrypted_signal', fromCode: true });
        } else {
            gameState.scanResults.set(starIndex, { type: 'completed', fromCode: true });
        }
    });

    // Apply fragments
    gameState.fragments = { ...codeData.fragments };

    // Apply dynamic stars
    if (codeData.dynamicStars) {
        gameState.dynamicStars = [...codeData.dynamicStars];
    }

    // Apply flags (overrides reset above for specified flags)
    if (codeData.flags) {
        Object.assign(gameState, codeData.flags);
    }

    // Save the new state
    autoSave();

    console.log(`SIGNAL: Day code ${normalizedCode} applied - starting Day ${codeData.day}`);
    return { success: true, day: codeData.day, code: normalizedCode };
}

export function isValidDayCode(code) {
    return DAY_CODES.hasOwnProperty(code.toUpperCase().trim());
}

export function getAvailableDayCodes() {
    return Object.keys(DAY_CODES);
}

// ─────────────────────────────────────────────────────────────────────────────
// Save Info
// Get info about current save for display
// ─────────────────────────────────────────────────────────────────────────────

export function getSaveInfo() {
    const data = loadSave();
    if (!data) return null;

    const totalStars = 29;
    const scannedCount = data.analyzedStars?.length || 0;
    const progress = Math.round((scannedCount / totalStars) * 100);

    return {
        playerName: data.playerName || 'Unknown',
        currentDay: data.currentDay || 1,
        progress: progress,
        starsScanned: scannedCount,
        totalStars: totalStars,
        fragmentsCollected: data.fragments?.collected?.length || 0,
        lastPlayed: new Date(data.timestamp).toLocaleString()
    };
}
