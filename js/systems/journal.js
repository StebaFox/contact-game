// =============================================================================
// JOURNAL SYSTEM
// Archives alien contacts, key intel, and scan discoveries for re-reading
// =============================================================================

import { gameState } from '../core/game-state.js';
import { showView, log } from '../ui/rendering.js';
import { playClick } from './audio.js';

let journalReturnView = 'starmap-view';
let activeTab = 'contacts';

// -----------------------------------------------------------------------------
// Open / Close
// -----------------------------------------------------------------------------

export function openJournal() {
    const currentView = document.querySelector('.view.active')?.id;
    if (currentView === 'journal-view') {
        closeJournal();
        return;
    }

    journalReturnView = currentView || 'starmap-view';
    showView('journal-view');
    renderJournal();
    log('Accessing research journal...');
}

export function closeJournal() {
    showView(journalReturnView || 'starmap-view');
    log('Journal closed');
}

// -----------------------------------------------------------------------------
// Add Entries
// -----------------------------------------------------------------------------

export function addJournalEntry(type, data) {
    // Deduplicate by type + starName combo
    const existing = gameState.journalEntries.find(
        e => e.type === type && e.starName === data.starName && e.title === data.title
    );
    if (existing) return;

    gameState.journalEntries.push({
        type,       // 'contact', 'intel', 'discovery'
        starName:   data.starName || '',
        title:      data.title || '',
        content:    data.content || '',
        timestamp:  Date.now(),
        day:        gameState.currentDay
    });

    updateJournalIndicator();
}

// -----------------------------------------------------------------------------
// UI Rendering
// -----------------------------------------------------------------------------

export function renderJournal() {
    const content = document.getElementById('journal-content');
    if (!content) return;

    const entries = gameState.journalEntries || [];

    // Tab buttons
    const tabBar = document.getElementById('journal-tabs');
    if (tabBar) {
        tabBar.innerHTML = '';
        const tabs = [
            { id: 'contacts', label: 'CONTACTS', count: entries.filter(e => e.type === 'contact').length },
            { id: 'intel', label: 'KEY INTEL', count: entries.filter(e => e.type === 'intel').length },
            { id: 'discovery', label: 'DISCOVERIES', count: entries.filter(e => e.type === 'discovery').length }
        ];
        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = `journal-tab ${activeTab === tab.id ? 'active' : ''}`;
            btn.textContent = `${tab.label} (${tab.count})`;
            btn.addEventListener('click', () => {
                playClick();
                activeTab = tab.id;
                renderJournal();
            });
            tabBar.appendChild(btn);
        });
    }

    // Filter entries by active tab
    const filtered = entries.filter(e => e.type === activeTab);

    if (filtered.length === 0) {
        content.innerHTML = `
            <div class="journal-empty">
                ${activeTab === 'contacts' ? 'No alien contacts recorded yet.' :
                  activeTab === 'intel' ? 'No key intel archived yet.' :
                  'No scan discoveries logged yet.'}
            </div>
        `;
        return;
    }

    // Sort newest first
    const sorted = [...filtered].sort((a, b) => b.timestamp - a.timestamp);

    content.innerHTML = sorted.map(entry => {
        const dayLabel = entry.day ? `DAY ${entry.day}` : '';
        return `
            <div class="journal-entry">
                <div class="journal-entry-header">
                    <span class="journal-entry-star">${entry.starName}</span>
                    <span class="journal-entry-day">${dayLabel}</span>
                </div>
                <div class="journal-entry-title">${entry.title}</div>
                <div class="journal-entry-content">${entry.content}</div>
            </div>
        `;
    }).join('');
}

// -----------------------------------------------------------------------------
// Indicator
// -----------------------------------------------------------------------------

export function updateJournalIndicator() {
    const indicator = document.getElementById('journal-indicator');
    if (!indicator) return;
    // No unread tracking for journal — just show it's available
    indicator.style.display = 'none';
}

export function showJournalButton() {
    const btn = document.getElementById('journal-btn');
    if (btn) btn.style.display = '';
}
