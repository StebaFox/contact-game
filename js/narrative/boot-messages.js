// ═════════════════════════════════════════════════════════════════════════════
// BOOT SEQUENCE MESSAGES
// System startup text displayed during game initialization
// ═════════════════════════════════════════════════════════════════════════════

export const BOOT_INITIAL = [
    { text: 'SETI DEEP SPACE MONITORING SYSTEM v1.3.7', class: 'success', delay: 200, beep: 'success' },
    { text: 'Copyright © 1995 Advanced Signal Intelligence Division', class: '', delay: 100 },
    { text: '═══════════════════════════════════════════════════════', class: '', delay: 100 },
    { text: '', class: '', delay: 50 },
    { text: 'Initializing core systems...', class: '', delay: 400 },
    { text: '[OK] Memory allocation complete', class: '', delay: 300 },
    { text: '[OK] Neural network initialized', class: '', delay: 200 },
    { text: '[OK] Quantum processors online', class: '', delay: 250 },
    { text: '', class: '', delay: 100 },
    { text: 'Loading orbital receiver array...', class: '', delay: 400 },
    { text: '[OK] Satellite link established', class: '', delay: 300 },
    { text: '[OK] Deep space antenna array synchronized', class: '', delay: 250 },
    { text: '[OK] Signal processing modules loaded', class: '', delay: 300 },
    { text: '', class: '', delay: 200 },
    { text: 'Running security protocols...', class: 'warning', delay: 500, beep: 'warning' },
    { text: '[SECURITY] Biometric scan required', class: 'warning', delay: 600, beep: 'warning' },
    { text: '[SECURITY] Scanning...', class: 'warning', delay: 400 },
    { text: '[SECURITY] Clearance level: CLASSIFIED', class: 'warning', delay: 500, beep: 'warning' },
    { text: '[SECURITY] Authorization: PENDING', class: 'warning', delay: 400, beep: 'warning' },
    { text: '', class: '', delay: 300 },
    { text: 'Verifying personnel credentials...', class: '', delay: 600 }
];

export const BOOT_CONTINUATION = [
    { text: '', class: '', delay: 200 },
    { text: '[SECURITY] Identity confirmed: Dr. {NAME}', class: 'success', delay: 500, beep: 'success' },
    { text: '[SECURITY] Clearance approved: LEVEL 4', class: 'success', delay: 400, beep: 'success' },
    { text: '[SECURITY] Access granted', class: 'success', delay: 400, beep: 'success' },
    { text: '', class: '', delay: 300 },
    { text: 'Welcome, Dr. {NAME}', class: '', delay: 600 },
    { text: 'Finalizing system startup...', class: '', delay: 500 },
    { text: '', class: '', delay: 100 },
    { text: '[OK] Stellar database loaded (15,847 catalogued objects)', class: '', delay: 250 },
    { text: '[OK] Signal analysis algorithms ready', class: '', delay: 200 },
    { text: '[OK] Pattern recognition matrices initialized', class: '', delay: 200 },
    { text: '[OK] Contact protocol systems active', class: '', delay: 250 },
    { text: '', class: '', delay: 200 },
    { text: 'All systems operational', class: 'success', delay: 500, beep: 'success' },
    { text: 'Standing by for target acquisition...', class: '', delay: 400 },
    { text: '', class: '', delay: 200 },
    { text: '═══════════════════════════════════════════════════════', class: '', delay: 200 },
    { text: 'INITIALIZATION COMPLETE', class: 'success', delay: 400, beep: 'success' }
];
