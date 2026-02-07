// ═════════════════════════════════════════════════════════════════════════════
// MAILBOX SYSTEM
// Email/message system for in-game communication
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { showView, log } from '../ui/rendering.js';
import { playClick, playEmailNotification } from '../systems/audio.js';
import { RANDOM_EMAILS, FIRST_CONTACT_EMAIL } from '../narrative/emails.js';

// Open the mailbox view
export function openMailbox() {
    // Check if already in mailbox view
    const currentView = document.querySelector('.view.active').id;
    if (currentView === 'mailbox-view') {
        return; // Already in mailbox, do nothing
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
    const minInterval = 120000; // 2 minutes minimum between messages

    if (timeSinceLastMail > minInterval) {
        // Random chance to receive mail
        if (Math.random() < 0.3) { // 30% chance each check
            sendRandomMail();
            gameState.lastMailTime = Date.now();
        }
    }
}

// Send a random email from the template list
export function sendRandomMail() {
    const randomEmail = RANDOM_EMAILS[Math.floor(Math.random() * RANDOM_EMAILS.length)];

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
