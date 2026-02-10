// =============================================================================
// JOURNAL SYSTEM
// Archives alien contacts, key intel, and scan discoveries for re-reading
// =============================================================================

import { gameState } from '../core/game-state.js';
import { showView, log } from '../ui/rendering.js';
import { playClick } from './audio.js';

let journalReturnView = 'starmap-view';
let activeTab = 'contact';

// -----------------------------------------------------------------------------
// Open / Close
// -----------------------------------------------------------------------------

export function openJournal() {
    const currentView = document.querySelector('.view.active')?.id;
    if (currentView === 'journal-view') {
        closeJournal();
        return;
    }

    // Never save mailbox/journal as return target — always fall back to starmap
    const overlays = ['journal-view', 'mailbox-view'];
    journalReturnView = overlays.includes(currentView) ? 'starmap-view' : (currentView || 'starmap-view');
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
            { id: 'contact', label: 'CONTACTS', count: entries.filter(e => e.type === 'contact').length },
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
                ${activeTab === 'contact' ? 'No alien contacts recorded yet.' :
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

// -----------------------------------------------------------------------------
// Personal Log Musings — flavor entries at narrative moments
// -----------------------------------------------------------------------------

let firstScanMusingAdded = false;

export function addFirstScanMusing(star, resultType, source) {
    if (firstScanMusingAdded) return;
    if (gameState.journalEntries.some(e => e.title === 'Personal Log: First Scan')) return;
    firstScanMusingAdded = true;

    let reflection = '';
    if (resultType === 'false_positive') {
        reflection = `First signal processed. ${source || 'Terrestrial interference'}. Not what I was hoping for, but that's the job — sifting through noise to find what shouldn't be there.\n\nKeep looking.`;
    } else if (resultType === 'natural') {
        reflection = `First signal processed. Natural phenomenon — beautiful in its own way, but not what we're searching for.\n\nThe universe is noisy. Somewhere in all that noise, there might be a voice.\n\nKeep looking.`;
    } else if (resultType === 'verified_signal') {
        reflection = `First signal processed. And it's... not natural. All interference checks negative. My hands are shaking as I write this.\n\nThis could be nothing. A glitch. An artifact.\n\nBut what if it isn't?`;
    }

    addJournalEntry('intel', {
        starName: 'Personal Log',
        title: 'Personal Log: First Scan',
        content: reflection
    });
    showJournalButton();
}

export function addPersonalLog(title, content) {
    addJournalEntry('intel', {
        starName: 'Personal Log',
        title: `Personal Log: ${title}`,
        content
    });
    showJournalButton();
}

// ─────────────────────────────────────────────────────────────────────────────
// Scan Milestone Musings — Day 1 personal reflections at key moments
// ─────────────────────────────────────────────────────────────────────────────

let scanMilestoneFlags = {
    routine: false,
    ghostSignal: false,
    cosmicSymphony: false,
    quietHours: false
};

export function checkScanMilestoneMusings(resultType) {
    if (gameState.currentDay !== 1) return;

    const scanCount = gameState.analyzedStars.size;

    // After 1st false positive
    if (resultType === 'false_positive' && !scanMilestoneFlags.ghostSignal) {
        if (!gameState.journalEntries.some(e => e.title === 'Personal Log: Ghost Signal')) {
            scanMilestoneFlags.ghostSignal = true;
            addPersonalLog('Ghost Signal',
                "Another false alarm. Satellite bounce, classified transmission \u2014 doesn't matter. For a moment the waveform looked alive.\n\nThis is the hardest part. Training yourself to feel nothing when the data says \"no.\" Because someday it might say \"yes,\" and I need to be ready to believe it.");
        }
    }

    // After 1st natural phenomenon
    if (resultType === 'natural' && !scanMilestoneFlags.cosmicSymphony) {
        if (!gameState.journalEntries.some(e => e.title === 'Personal Log: Cosmic Symphony')) {
            scanMilestoneFlags.cosmicSymphony = true;
            addPersonalLog('Cosmic Symphony',
                "A pulsar. Or stellar winds. Or something equally beautiful and equally indifferent to our existence.\n\nThe universe makes its own music. I just wish it would send us a note that says \"we hear you too.\"");
        }
    }

    // After 3rd scan (any result type)
    if (scanCount >= 3 && !scanMilestoneFlags.routine) {
        if (!gameState.journalEntries.some(e => e.title === 'Personal Log: The Routine')) {
            scanMilestoneFlags.routine = true;
            addPersonalLog('The Routine',
                "Three down. Getting into the rhythm now. Tune the receiver, analyze the waveform, classify the source. Again.\n\nWhitmore says patience is the job. Most SETI researchers go their entire careers without finding anything. I knew that going in.\n\nDoesn't make the silence any easier.");
        }
    }

    // After 5th scan (any result type)
    if (scanCount >= 5 && !scanMilestoneFlags.quietHours) {
        if (!gameState.journalEntries.some(e => e.title === 'Personal Log: The Quiet Hours')) {
            scanMilestoneFlags.quietHours = true;
            addPersonalLog('The Quiet Hours',
                "Five stars cataloged. Two more to hit the minimum. My eyes are starting to blur.\n\nI keep thinking about Dr. Torres. Six years in Sector 4, and they pulled the plug. What if that's me next year? What if I spend my career listening to static?\n\nBut then I remember why I'm here. Not for the career. For the question.\n\nAre we alone?\n\nI'm not ready to accept that the answer is yes.");
        }
    }
}
