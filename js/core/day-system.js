// ═══════════════════════════════════════════════════════════════════════════
// DAY SYSTEM
// Controls 3-day narrative progression and star gating
// ═══════════════════════════════════════════════════════════════════════════

import { gameState } from './game-state.js';
import { autoSave } from './save-system.js';

// ─────────────────────────────────────────────────────────────────────────────
// Day Configuration
// ─────────────────────────────────────────────────────────────────────────────

export const DAY_CONFIG = {
    1: {
        title: 'DAY 1: FIRST SHIFT',
        subtitle: 'Prove this program deserves to exist',
        availableStars: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        starsRequired: 7,
        criticalStars: [8], // Ross 128 must be scanned
        objectives: [
            'Survey assigned star systems (7 minimum)',
            'Catalog all signals — the oversight committee needs data',
            'Flag anything unusual — your career may depend on it'
        ],
        bootMessages: [
            'CLEARANCE LEVEL: 4 (STANDARD)',
            'SURVEY MODE: ACTIVE',
            'ASSIGNED TARGETS: 10 (7 MINIMUM)'
        ]
    },
    2: {
        title: 'DAY 2: VERIFICATION PROTOCOLS',
        subtitle: 'Signal verification and deep analysis',
        availableStars: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        starsRequired: 7,
        criticalStars: [],
        prerequisites: ['day1Complete'],
        objectives: [
            'Re-analyze anomalous signal from Day 1',
            'Verify signal authenticity',
            'Continue survey with enhanced protocols'
        ],
        bootMessages: [
            'PROTOCOL SIGMA ACTIVE',
            'CLEARANCE LEVEL: 5 (ELEVATED)',
            'ADVANCED ANALYSIS SYSTEMS: ONLINE',
            'QUANTUM PROCESSOR: INITIALIZED'
        ]
    },
    3: {
        title: 'DAY 3: COSMIC TRIANGULATION',
        subtitle: 'Locate the source of the ancient signal',
        availableStars: [20, 21, 22, 23, 24, 25, 26, 27, 28],
        starsRequired: 7,
        criticalStars: [],
        prerequisites: ['day2Complete', 'decryptionComplete'],
        objectives: [
            'Survey remaining star systems',
            'Collect triangulation data from contacts',
            'Locate signal origin point'
        ],
        bootMessages: [
            'OMEGA PROTOCOL ACTIVE',
            'CLEARANCE LEVEL: 6 (MAXIMUM)',
            'TRIANGULATION ARRAY: OPERATIONAL',
            'ALL SYSTEMS: MAXIMUM PRIORITY',
            'OBJECTIVE: LOCATE CMB SIGNAL SOURCE'
        ]
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Day Access Control
// ─────────────────────────────────────────────────────────────────────────────

export function canAccessStar(starIndex) {
    // Demo mode: all stars accessible
    if (gameState.demoMode || gameState.currentDay === 0) {
        return true;
    }

    const dayConfig = DAY_CONFIG[gameState.currentDay];
    if (!dayConfig) return false;

    return dayConfig.availableStars.includes(starIndex);
}

export function getStarDayRequirement(starIndex) {
    for (const [day, config] of Object.entries(DAY_CONFIG)) {
        if (config.availableStars.includes(starIndex)) {
            return parseInt(day);
        }
    }
    return null;
}

export function isStarLocked(starIndex) {
    if (gameState.demoMode || gameState.currentDay === 0) {
        return false;
    }

    const requiredDay = getStarDayRequirement(starIndex);
    if (requiredDay === null) return false;

    return requiredDay > gameState.currentDay;
}

// ─────────────────────────────────────────────────────────────────────────────
// Day Progression
// ─────────────────────────────────────────────────────────────────────────────

export function getDayProgress() {
    if (gameState.demoMode || gameState.currentDay === 0) {
        return {
            current: 0,
            required: 0,
            complete: true,
            percentage: 100
        };
    }

    const dayConfig = DAY_CONFIG[gameState.currentDay];
    if (!dayConfig) {
        return { current: 0, required: 0, complete: true, percentage: 100 };
    }

    const scannedThisDay = dayConfig.availableStars.filter(
        starIndex => gameState.analyzedStars.has(starIndex)
    );

    return {
        current: scannedThisDay.length,
        required: dayConfig.starsRequired,
        complete: scannedThisDay.length >= dayConfig.starsRequired,
        percentage: Math.round((scannedThisDay.length / dayConfig.starsRequired) * 100)
    };
}

export function checkDayComplete() {
    const progress = getDayProgress();
    if (!progress.complete) return false;

    // Also require critical stars to be analyzed
    const dayConfig = DAY_CONFIG[gameState.currentDay];
    if (dayConfig?.criticalStars?.length > 0) {
        for (const starIndex of dayConfig.criticalStars) {
            if (!gameState.analyzedStars.has(starIndex)) {
                return false;
            }
        }
    }

    return true;
}

export function canAdvanceDay() {
    if (gameState.demoMode || gameState.currentDay === 0) {
        return false; // No day advancement in demo mode
    }

    if (gameState.currentDay >= 3) {
        return false; // Already at final day
    }

    if (!checkDayComplete()) {
        return false; // Haven't finished current day
    }

    // Check prerequisites for next day
    const nextDayConfig = DAY_CONFIG[gameState.currentDay + 1];
    if (nextDayConfig?.prerequisites) {
        for (const prereq of nextDayConfig.prerequisites) {
            if (prereq === 'day1Complete' && !gameState.daysCompleted.includes(1)) {
                return false;
            }
            if (prereq === 'day2Complete' && !gameState.daysCompleted.includes(2)) {
                return false;
            }
            if (prereq === 'decryptionComplete' && !gameState.decryptionComplete) {
                return false;
            }
        }
    }

    return true;
}

export function advanceDay() {
    if (!canAdvanceDay()) {
        console.log('SIGNAL: Cannot advance day - requirements not met');
        return false;
    }

    // Mark current day as complete
    if (!gameState.daysCompleted.includes(gameState.currentDay)) {
        gameState.daysCompleted.push(gameState.currentDay);
    }

    // Advance to next day
    gameState.currentDay++;

    // Clear any selected star from the previous day
    gameState.selectedStarId = null;
    gameState.showScanConfirm = false;

    // Save progress
    autoSave();

    console.log(`SIGNAL: Advanced to Day ${gameState.currentDay}`);
    return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Day Information
// ─────────────────────────────────────────────────────────────────────────────

export function getCurrentDayConfig() {
    if (gameState.demoMode || gameState.currentDay === 0) {
        return {
            title: 'DEMO MODE',
            subtitle: 'All content unlocked',
            availableStars: Array.from({ length: 29 }, (_, i) => i),
            starsRequired: 0,
            objectives: ['Explore freely'],
            bootMessages: ['DEMO MODE ACTIVE', 'ALL SYSTEMS UNLOCKED']
        };
    }

    return DAY_CONFIG[gameState.currentDay] || DAY_CONFIG[1];
}

export function getDayTitle() {
    const config = getCurrentDayConfig();
    return config.title;
}

export function getDayBootMessages() {
    const config = getCurrentDayConfig();
    return config.bootMessages || [];
}

export function getDayObjectives() {
    const config = getCurrentDayConfig();
    return config.objectives || [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Star Status Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function getStarStatus(starIndex) {
    const isLocked = isStarLocked(starIndex);
    const isScanned = gameState.analyzedStars.has(starIndex);
    const hasContact = gameState.contactedStars.has(starIndex);
    const requiredDay = getStarDayRequirement(starIndex);

    return {
        index: starIndex,
        locked: isLocked,
        scanned: isScanned,
        hasContact: hasContact,
        requiredDay: requiredDay,
        available: canAccessStar(starIndex)
    };
}

export function getAvailableStars() {
    if (gameState.demoMode || gameState.currentDay === 0) {
        return Array.from({ length: 29 }, (_, i) => i);
    }

    const config = getCurrentDayConfig();
    return config.availableStars || [];
}

export function getUnscannedAvailableStars() {
    const available = getAvailableStars();
    return available.filter(starIndex => !gameState.analyzedStars.has(starIndex));
}

// ─────────────────────────────────────────────────────────────────────────────
// Initialize Day System
// ─────────────────────────────────────────────────────────────────────────────

export function initDaySystem() {
    // Set demo mode if no day is set (backwards compatibility)
    if (gameState.currentDay === undefined || gameState.currentDay === null) {
        gameState.currentDay = 1;
    }

    // Initialize arrays if not present
    if (!gameState.daysCompleted) {
        gameState.daysCompleted = [];
    }

    console.log(`SIGNAL: Day system initialized - Day ${gameState.currentDay}`);
}
