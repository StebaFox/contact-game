// ═════════════════════════════════════════════════════════════════════════════
// MAILBOX SYSTEM
// Email/message system for in-game communication
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { showView, log } from '../ui/rendering.js';
import { playClick, playEmailNotification } from '../systems/audio.js';
import { DAY1_EMAILS, DAY2_EMAILS, DAY3_EMAILS, FIRST_CONTACT_EMAIL } from '../narrative/emails.js';

// Open the mailbox view (toggles if already open)
export function openMailbox() {
    const currentView = document.querySelector('.view.active').id;
    if (currentView === 'mailbox-view') {
        closeMailbox();
        return;
    }

    // Save current view to return to it later
    gameState.previousView = currentView;

    showView('mailbox-view');
    updateMailboxDisplay();

    log('Accessing secure mailbox...');
}

// Close the mailbox and return to previous view
export function closeMailbox() {
    // Return to previous view or default to starmap
    const returnView = gameState.previousView || 'starmap-view';
    showView(returnView);
    log('Mailbox closed');

    // Day 2 cliffhanger: check if we need to advance the state machine
    if (gameState.day2CliffhangerPhase === 0 || gameState.day2CliffhangerPhase === 4) {
        const hasReadRelevant = checkCliffhangerEmailRead();
        if (hasReadRelevant) {
            // Dynamic import to avoid circular dependency with day-report.js
            import('./day-report.js').then(module => {
                module.advanceDay2Cliffhanger(gameState.day2CliffhangerPhase);
            });
        }
    }
}

function checkCliffhangerEmailRead() {
    if (gameState.day2CliffhangerPhase === 0) {
        return gameState.mailboxMessages.some(
            msg => msg.subject.includes('Deep Space Anomaly') && msg.read
        );
    } else if (gameState.day2CliffhangerPhase === 4) {
        return gameState.mailboxMessages.some(
            msg => msg.subject.includes('System Failure') && msg.read
        );
    }
    return false;
}

// Update the mailbox display with current messages
export function updateMailboxDisplay() {
    const messageList = document.getElementById('message-list');
    const noMessages = document.getElementById('no-messages');
    const mailboxStatus = document.getElementById('mailbox-status');

    if (gameState.mailboxMessages.length === 0) {
        noMessages.style.display = 'block';
        messageList.style.display = 'none';
        mailboxStatus.textContent = 'NO NEW MESSAGES';
    } else {
        noMessages.style.display = 'none';
        messageList.style.display = 'flex';

        const unreadCount = gameState.mailboxMessages.filter(msg => !msg.read).length;
        mailboxStatus.textContent = unreadCount > 0 ?
            `${unreadCount} UNREAD MESSAGE${unreadCount > 1 ? 'S' : ''}` :
            'ALL MESSAGES READ';

        // Generate message HTML
        messageList.innerHTML = gameState.mailboxMessages
            .slice()
            .reverse() // Show newest first
            .map((msg, index) => `
                <div class="mail-item ${msg.read ? 'read' : 'unread'}" data-index="${gameState.mailboxMessages.length - 1 - index}">
                    <div class="mail-header">
                        <div class="mail-from">${msg.from}</div>
                        <div class="mail-date">${msg.date}</div>
                    </div>
                    <div class="mail-subject">${msg.subject}</div>
                    <div class="mail-preview">${msg.preview}</div>
                    <div class="mail-body">${msg.body}</div>
                </div>
            `).join('');

        // Add click handlers to expand/collapse and mark as read
        document.querySelectorAll('.mail-item').forEach(item => {
            item.addEventListener('click', function() {
                this.classList.toggle('expanded');
                playClick();

                // Mark as read on first click
                if (this.classList.contains('unread')) {
                    const msgIndex = parseInt(this.dataset.index);
                    const msg = gameState.mailboxMessages[msgIndex];
                    if (msg && !msg.read) {
                        msg.read = true;
                        gameState.unreadMailCount = Math.max(0, gameState.unreadMailCount - 1);
                        updateMailIndicator();
                    }
                    this.classList.remove('unread');
                    this.classList.add('read');
                }
            });
        });
    }
}

// Add a new message to the mailbox
export function addMailMessage(from, subject, body, preview = null) {
    const now = new Date();
    const dateStr = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-1995`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const message = {
        from: from,
        subject: subject,
        body: body,
        preview: preview || body.substring(0, 80) + '...',
        date: `${dateStr} ${timeStr}`,
        read: false,
        timestamp: now.getTime()
    };

    gameState.mailboxMessages.push(message);
    gameState.unreadMailCount++;
    updateMailIndicator();

    // If mailbox is currently open, refresh it so the new message appears
    const activeView = document.querySelector('.view.active');
    if (activeView && activeView.id === 'mailbox-view') {
        updateMailboxDisplay();
    }

    log(`New message received from ${from}`, 'highlight');
    playEmailNotification();
}

// Update the unread mail indicator
export function updateMailIndicator() {
    const indicator = document.getElementById('mail-indicator');
    if (gameState.unreadMailCount > 0) {
        indicator.style.display = 'inline';
    } else {
        indicator.style.display = 'none';
    }
}

// Check if it's time to send new mail
export function checkForNewMail() {
    // Don't send mail until initialization is complete (player has entered their name)
    if (!gameState.playerName) return;

    // Check if enough time has passed since last mail
    const timeSinceLastMail = Date.now() - gameState.lastMailTime;
    const minInterval = 300000; // 5 minutes minimum between messages

    if (timeSinceLastMail > minInterval) {
        // Random chance to receive mail
        if (Math.random() < 0.2) { // 20% chance each check
            sendRandomMail();
            gameState.lastMailTime = Date.now();
        }
    }
}

// Send a random email from the day-appropriate pool
export function sendRandomMail() {
    // Pick from the right pool based on current day
    let pool;
    switch (gameState.currentDay) {
        case 2: pool = DAY2_EMAILS; break;
        case 3: pool = DAY3_EMAILS; break;
        default: pool = DAY1_EMAILS; break;
    }

    const randomEmail = pool[Math.floor(Math.random() * pool.length)];

    // Replace {PLAYER_NAME} placeholder with actual player name
    const body = randomEmail.body.replace(/{PLAYER_NAME}/g, gameState.playerName);

    addMailMessage(randomEmail.from, randomEmail.subject, body);
}

// Special email sent when first alien signal is discovered
export function sendFirstContactEmail() {
    const body = FIRST_CONTACT_EMAIL.body.replace(/{PLAYER_NAME}/g, gameState.playerName);
    addMailMessage(
        FIRST_CONTACT_EMAIL.from,
        FIRST_CONTACT_EMAIL.subject,
        body
    );
}

// Security beep sound for notifications (imported separately to avoid circular deps)
let playSecurityBeep = () => {};

// Set the security beep function (called from main.js to avoid circular imports)
export function setSecurityBeepFunction(fn) {
    playSecurityBeep = fn;
}
