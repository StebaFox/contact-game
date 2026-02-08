// ═════════════════════════════════════════════════════════════════════════════
// FINAL MESSAGE
// The cosmic revelation from the First Universe
// This file is separate for easy editing of the narrative content
// ═════════════════════════════════════════════════════════════════════════════

import { gameState } from '../core/game-state.js';
import { playClick } from '../systems/audio.js';
import { showView } from '../ui/rendering.js';

// ─────────────────────────────────────────────────────────────────────────────
// Message Content - Edit this section to change the narrative
// ─────────────────────────────────────────────────────────────────────────────

const MESSAGE_SECTIONS = [
    {
        type: 'header',
        text: 'Greetings.',
        delay: 0,
        style: 'greeting'
    },
    {
        type: 'paragraph',
        text: `You are receiving this message because you have succeeded.

You have heard what could not be heard. You have seen what was never meant to be seen directly. You have gathered fragments scattered across noise, across time, across the birth-echo of your reality itself.

That alone tells us something about you.`,
        delay: 3000
    },
    {
        type: 'emphasis',
        text: 'We have waited a very long time for this moment.',
        delay: 8000
    },
    {
        type: 'divider',
        delay: 11000
    },
    {
        type: 'header',
        text: 'We are the ones who came before.',
        delay: 12000,
        style: 'revelation'
    },
    {
        type: 'poetic',
        lines: [
            'Before your stars ignited.',
            'Before your galaxies spiraled into being.',
            'Before time, as you understand it, had meaning.'
        ],
        delay: 15000
    },
    {
        type: 'paragraph',
        text: `We were born in the first universe—the only universe that ever was.

In our earliest ages, we believed we were not alone. We listened. We searched. We built instruments that could hear across the cosmos and minds that could imagine what might answer back.

We expected company.

We found none.`,
        delay: 21000
    },
    {
        type: 'poetic',
        lines: [
            'Not in our galaxy.',
            'Not in the clusters beyond it.',
            'Not in the furthest light that could ever reach us.'
        ],
        delay: 30000
    },
    {
        type: 'emphasis',
        text: 'For nearly a billion years, we searched.',
        delay: 35000
    },
    {
        type: 'emphasis',
        text: 'The silence was absolute.',
        delay: 38000,
        style: 'dark'
    },
    {
        type: 'divider',
        delay: 42000
    },
    {
        type: 'paragraph',
        text: `At first, we told ourselves the universe was young. That life would come later. That somewhere, someday, someone would look back and find us.

But as our knowledge grew, so did the truth.

The conditions that had given rise to us—so precise, so improbable—had occurred only once.`,
        delay: 44000
    },
    {
        type: 'poetic',
        lines: [
            'We were not pioneers.',
            'We were not explorers among many.',
            'We were a singular event.'
        ],
        delay: 54000
    },
    {
        type: 'paragraph',
        text: `This knowledge changed us.

Some of us despaired. Some withdrew inward. Others sought meaning in conquest, in expansion, in leaving our mark on every corner of an otherwise empty reality.

We became masters of a cosmos with no one to share it with.`,
        delay: 60000
    },
    {
        type: 'emphasis',
        text: 'And that loneliness nearly destroyed us.',
        delay: 70000,
        style: 'dark'
    },
    {
        type: 'divider',
        delay: 74000
    },
    {
        type: 'paragraph',
        text: `But in time, another understanding emerged—quietly at first, then spreading until it touched us all.

If we were alone…

Then what came after us did not have to be.`,
        delay: 76000
    },
    {
        type: 'emphasis',
        text: 'If existence had granted us consciousness only once—what responsibility did that place upon us?',
        delay: 85000,
        style: 'question'
    },
    {
        type: 'paragraph',
        text: `Our answer was not immediate.

What we envisioned required sacrifice, patience, and unity on a scale we had never known. It required us to think not in lifetimes, but in epochs. Not in survival, but in legacy.

And yet, once the idea took hold, it changed who we were.`,
        delay: 92000
    },
    {
        type: 'header',
        text: 'We would not be the final voice in the void.',
        delay: 104000,
        style: 'determination'
    },
    {
        type: 'emphasis',
        text: 'If our universe was destined to be alone, then the next one would not be.',
        delay: 108000,
        style: 'hope'
    },
    {
        type: 'header',
        text: 'We would build a successor.',
        delay: 113000,
        style: 'revelation'
    },
    {
        type: 'divider',
        delay: 117000
    },
    {
        type: 'paragraph',
        text: `The device you might call a machine—but it was more than that.

It was a culmination of everything we learned: about matter, about time, about the fragile boundary between nothing and something.

It would remain dormant until the last of us was gone. Until our universe had grown cold and silent. Only then would it awaken—using what remained of us to ignite a beginning anew.`,
        delay: 119000
    },
    {
        type: 'paragraph',
        text: `Every one of us contributed.

Not just our greatest thinkers, but our artists, our historians, our dreamers. Entire civilizations reoriented themselves around a single purpose. For the first time, we were united not by fear, or need, or survival—but by hope for beings we would never meet.`,
        delay: 132000
    },
    {
        type: 'emphasis',
        text: 'When the last of us faded, the device activated.',
        delay: 144000
    },
    {
        type: 'header',
        text: 'And from our ending… came your beginning.',
        delay: 148000,
        style: 'revelation'
    },
    {
        type: 'divider',
        delay: 153000
    },
    {
        type: 'paragraph',
        text: 'The universe you now inhabit is not separate from us.',
        delay: 155000
    },
    {
        type: 'poetic',
        lines: [
            'Its matter is our matter.',
            'Its laws are shaped by what we learned.',
            'Its potential is written with our intent.'
        ],
        delay: 159000
    },
    {
        type: 'emphasis',
        text: 'In ways both literal and profound, you are made of us.',
        delay: 166000,
        style: 'hope'
    },
    {
        type: 'paragraph',
        text: `You are not our creations in the sense of design or control.

You are our continuation.

Free. Unscripted. Alive.`,
        delay: 171000
    },
    {
        type: 'divider',
        delay: 180000
    },
    {
        type: 'paragraph',
        text: `We embedded this message deep within the noise of creation itself—not as a command, not as a warning, but as a question.

Would anyone listen closely enough?
Would anyone care enough to understand?`,
        delay: 182000
    },
    {
        type: 'header',
        text: 'You did.',
        delay: 192000,
        style: 'personal'
    },
    {
        type: 'divider',
        delay: 196000
    },
    {
        type: 'emphasis',
        text: 'So we ask only this:',
        delay: 198000
    },
    {
        type: 'header',
        text: 'Do not repeat our loneliness.',
        delay: 201000,
        style: 'plea'
    },
    {
        type: 'paragraph',
        text: `Do not mistake silence for emptiness, or power for purpose. Seek one another. Protect the fragile spark of awareness wherever you find it.

Explore not to conquer—but to understand.
Create not to dominate—but to uplift.`,
        delay: 206000
    },
    {
        type: 'paragraph',
        text: `You will face wonders we never imagined.
And dangers we feared but could not prevent.

That is the price of a living universe.`,
        delay: 218000
    },
    {
        type: 'paragraph',
        text: 'But when you look into the night sky, know this:',
        delay: 227000
    },
    {
        type: 'header',
        text: 'You were never an accident.',
        delay: 231000,
        style: 'revelation'
    },
    {
        type: 'header',
        text: 'You were hoped for.',
        delay: 235000,
        style: 'hope'
    },
    {
        type: 'divider',
        delay: 240000
    },
    {
        type: 'paragraph',
        text: `We give you everything we were.
Our knowledge. Our history. Our mistakes. Our dreams.

Carry them forward—not as a burden, but as a reminder that even in a universe born from silence…`,
        delay: 242000
    },
    {
        type: 'header',
        text: 'Meaning can be chosen.',
        delay: 253000,
        style: 'revelation'
    },
    {
        type: 'divider',
        delay: 258000
    },
    {
        type: 'final',
        text: 'Remember us.',
        delay: 261000
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// Styles for different section types
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_STYLES = {
    // Headers
    greeting: {
        color: '#0ff',
        fontSize: '28px',
        letterSpacing: '8px',
        textShadow: '0 0 30px #0ff'
    },
    revelation: {
        color: '#fff',
        fontSize: '26px',
        textShadow: '0 0 40px #0ff, 0 0 80px #08f'
    },
    determination: {
        color: '#0f0',
        fontSize: '24px',
        textShadow: '0 0 30px #0f0'
    },
    personal: {
        color: '#ff0',
        fontSize: '32px',
        textShadow: '0 0 40px #ff0'
    },
    plea: {
        color: '#f0f',
        fontSize: '26px',
        textShadow: '0 0 30px #f0f'
    },
    hope: {
        color: '#0ff',
        fontSize: '22px',
        textShadow: '0 0 25px #0ff'
    },

    // Emphasis styles
    dark: {
        color: '#a00',
        textShadow: '0 0 20px #a00'
    },
    question: {
        color: '#ff0',
        fontStyle: 'italic',
        textShadow: '0 0 15px #ff0'
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Display Logic
// ─────────────────────────────────────────────────────────────────────────────

let messageState = {
    overlay: null,
    contentContainer: null,
    currentSection: 0,
    timeouts: [],
    startTime: 0,
    onComplete: null
};

export function showFinalMessage(onComplete) {
    messageState.onComplete = onComplete;
    messageState.currentSection = 0;
    messageState.timeouts = [];
    messageState.startTime = Date.now();

    createMessageOverlay();
    scheduleAllSections();
}

function createMessageOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'final-message-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: 'VT323', monospace;
        overflow: hidden;
    `;

    // Inject keyframe animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fm-twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
        @keyframes fm-fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fm-pulseGlow {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.3); }
        }
        @keyframes fm-dividerExpand {
            from { width: 0; opacity: 0; }
            to { width: 200px; opacity: 1; }
        }
        @keyframes fm-finalPulse {
            0%, 100% {
                text-shadow: 0 0 30px #0ff, 0 0 60px #0ff;
                transform: scale(1);
            }
            50% {
                text-shadow: 0 0 60px #0ff, 0 0 120px #0ff, 0 0 180px #08f;
                transform: scale(1.02);
            }
        }
        .fm-section {
            opacity: 0;
            animation: fm-fadeIn 2s ease-out forwards;
        }
        .fm-poetic-line {
            opacity: 0;
        }
    `;
    overlay.appendChild(style);

    // Create starfield
    const starfield = document.createElement('div');
    starfield.style.cssText = `
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
    `;

    for (let i = 0; i < 300; i++) {
        const star = document.createElement('div');
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 0.5;
        const duration = 2 + Math.random() * 4;
        const delay = Math.random() * 5;

        star.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            background: #fff;
            border-radius: 50%;
            animation: fm-twinkle ${duration}s ease-in-out ${delay}s infinite;
        `;
        starfield.appendChild(star);
    }
    overlay.appendChild(starfield);

    // Create scrollable content container
    const contentWrapper = document.createElement('div');
    contentWrapper.style.cssText = `
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 60px 20px 100px 20px;
    `;

    const contentContainer = document.createElement('div');
    contentContainer.id = 'fm-content';
    contentContainer.style.cssText = `
        max-width: 700px;
        width: 100%;
        text-align: center;
    `;

    contentWrapper.appendChild(contentContainer);
    overlay.appendChild(contentWrapper);

    // Skip button (subtle)
    const skipBtn = document.createElement('button');
    skipBtn.id = 'fm-skip-btn';
    skipBtn.textContent = 'SKIP';
    skipBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: transparent;
        border: 1px solid #333;
        color: #333;
        font-family: 'VT323', monospace;
        font-size: 12px;
        padding: 5px 15px;
        cursor: pointer;
        z-index: 10001;
        transition: all 0.3s;
    `;
    skipBtn.addEventListener('mouseenter', () => {
        skipBtn.style.borderColor = '#666';
        skipBtn.style.color = '#666';
    });
    skipBtn.addEventListener('mouseleave', () => {
        skipBtn.style.borderColor = '#333';
        skipBtn.style.color = '#333';
    });
    skipBtn.addEventListener('click', () => {
        playClick();
        skipToEnd();
    });
    overlay.appendChild(skipBtn);

    document.body.appendChild(overlay);

    messageState.overlay = overlay;
    messageState.contentContainer = contentContainer;
}

function scheduleAllSections() {
    MESSAGE_SECTIONS.forEach((section, index) => {
        const timeout = setTimeout(() => {
            renderSection(section, index);
        }, section.delay);
        messageState.timeouts.push(timeout);
    });

    // Schedule breathing moment + continue button after last section
    const lastSection = MESSAGE_SECTIONS[MESSAGE_SECTIONS.length - 1];

    // Start the breathing moment 3s after the last line appears
    const breatheTimeout = setTimeout(() => {
        startBreathingMoment();
    }, lastSection.delay + 3000);
    messageState.timeouts.push(breatheTimeout);

    // Show continue button after 15s of breathing room
    const continueTimeout = setTimeout(() => {
        showContinueButton();
    }, lastSection.delay + 15000);
    messageState.timeouts.push(continueTimeout);
}

function renderSection(section, index) {
    const container = messageState.contentContainer;
    if (!container) return;

    const element = document.createElement('div');
    element.className = 'fm-section';
    element.style.marginBottom = '30px';

    switch (section.type) {
        case 'header':
            renderHeader(element, section);
            break;
        case 'paragraph':
            renderParagraph(element, section);
            break;
        case 'emphasis':
            renderEmphasis(element, section);
            break;
        case 'poetic':
            renderPoetic(element, section);
            break;
        case 'divider':
            renderDivider(element, section);
            break;
        case 'final':
            renderFinal(element, section);
            break;
    }

    container.appendChild(element);

    // Scroll to keep new content visible
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderHeader(element, section) {
    const style = SECTION_STYLES[section.style] || {};
    element.style.cssText = `
        color: ${style.color || '#fff'};
        font-size: ${style.fontSize || '24px'};
        text-shadow: ${style.textShadow || '0 0 20px currentColor'};
        letter-spacing: ${style.letterSpacing || '3px'};
        margin: 40px 0;
        line-height: 1.4;
    `;
    element.textContent = section.text;
}

function renderParagraph(element, section) {
    element.style.cssText = `
        color: #0a0;
        font-size: 16px;
        line-height: 1.8;
        text-align: center;
        white-space: pre-line;
    `;
    element.textContent = section.text;
}

function renderEmphasis(element, section) {
    const style = SECTION_STYLES[section.style] || {};
    element.style.cssText = `
        color: ${style.color || '#0ff'};
        font-size: ${style.fontSize || '18px'};
        text-shadow: ${style.textShadow || '0 0 15px currentColor'};
        font-style: ${style.fontStyle || 'normal'};
        margin: 30px 0;
    `;
    element.textContent = section.text;
}

function renderPoetic(element, section) {
    element.style.cssText = `
        margin: 30px 0;
    `;

    section.lines.forEach((line, i) => {
        const lineEl = document.createElement('div');
        lineEl.className = 'fm-poetic-line';
        lineEl.style.cssText = `
            color: #0ff;
            font-size: 18px;
            text-shadow: 0 0 10px #0ff;
            margin: 10px 0;
            animation: fm-fadeIn 1s ease-out ${i * 0.5}s forwards;
        `;
        lineEl.textContent = line;
        element.appendChild(lineEl);
    });
}

function renderDivider(element, section) {
    element.style.cssText = `
        display: flex;
        justify-content: center;
        margin: 50px 0;
    `;

    const line = document.createElement('div');
    line.style.cssText = `
        height: 1px;
        background: linear-gradient(90deg, transparent, #0ff, transparent);
        animation: fm-dividerExpand 1s ease-out forwards;
    `;
    element.appendChild(line);
}

function renderFinal(element, section) {
    element.style.cssText = `
        color: #fff;
        font-size: 42px;
        letter-spacing: 10px;
        margin: 60px 0;
        animation: fm-finalPulse 3s ease-in-out infinite, fm-fadeIn 3s ease-out forwards;
    `;
    element.textContent = section.text;
}

function startBreathingMoment() {
    const overlay = messageState.overlay;
    if (!overlay) return;

    // Brighten the starfield — increase star opacity/size
    const stars = overlay.querySelectorAll('div[style*="border-radius: 50%"]');
    stars.forEach(star => {
        star.style.transition = 'opacity 8s ease-in, transform 8s ease-in';
        star.style.opacity = '1';
        const currentSize = parseFloat(star.style.width) || 1;
        const scale = 1 + (currentSize / 3);
        star.style.transform = `scale(${scale})`;
    });

    // Add a faint cyan glow that pulses at center of screen
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 300px; height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 255, 255, 0.08) 0%, transparent 70%);
        animation: fm-breatheGlow 4s ease-in-out infinite;
        pointer-events: none;
        z-index: 0;
    `;
    overlay.appendChild(glow);

    // Add the glow animation if not already present
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fm-breatheGlow {
            0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
        }
    `;
    overlay.appendChild(style);
}

function showContinueButton() {
    const container = messageState.contentContainer;
    if (!container) return;

    // Hide skip button
    const skipBtn = document.getElementById('fm-skip-btn');
    if (skipBtn) skipBtn.style.display = 'none';

    // Personal acknowledgment
    const personal = document.createElement('div');
    personal.className = 'fm-section';
    personal.style.cssText = `
        color: #0ff;
        font-size: 18px;
        margin: 40px 0;
        text-shadow: 0 0 15px #0ff;
    `;
    personal.innerHTML = `Dr. ${gameState.playerName || 'Unknown'},<br>you have changed everything.<br><br>The universe remembers those who listen.`;
    container.appendChild(personal);

    // Continue button
    const btnContainer = document.createElement('div');
    btnContainer.className = 'fm-section';
    btnContainer.style.cssText = `
        margin-top: 50px;
    `;

    const btn = document.createElement('button');
    btn.textContent = 'THE END';
    btn.style.cssText = `
        background: transparent;
        border: 2px solid #0ff;
        color: #0ff;
        font-family: 'VT323', monospace;
        font-size: 20px;
        padding: 15px 50px;
        cursor: pointer;
        text-shadow: 0 0 10px #0ff;
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
        transition: all 0.3s;
    `;
    btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(0, 255, 255, 0.1)';
        btn.style.boxShadow = '0 0 50px rgba(0, 255, 255, 0.5)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.background = 'transparent';
        btn.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.3)';
    });
    btn.addEventListener('click', () => {
        playClick();
        closeMessage();
    });

    btnContainer.appendChild(btn);
    container.appendChild(btnContainer);

    btnContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function skipToEnd() {
    // Clear all pending timeouts
    messageState.timeouts.forEach(t => clearTimeout(t));
    messageState.timeouts = [];

    // Render all remaining sections immediately
    const container = messageState.contentContainer;
    if (!container) return;

    // Clear and render everything
    container.innerHTML = '';

    MESSAGE_SECTIONS.forEach(section => {
        const element = document.createElement('div');
        element.style.marginBottom = '30px';
        element.style.opacity = '1';

        switch (section.type) {
            case 'header':
                renderHeader(element, section);
                break;
            case 'paragraph':
                renderParagraph(element, section);
                break;
            case 'emphasis':
                renderEmphasis(element, section);
                break;
            case 'poetic':
                renderPoetic(element, section);
                // Make poetic lines visible immediately
                element.querySelectorAll('.fm-poetic-line').forEach(line => {
                    line.style.opacity = '1';
                    line.style.animation = 'none';
                });
                break;
            case 'divider':
                renderDivider(element, section);
                break;
            case 'final':
                renderFinal(element, section);
                break;
        }

        // Remove fade-in animation for skipped content
        element.style.animation = 'none';
        element.style.opacity = '1';

        container.appendChild(element);
    });

    showContinueButton();
}

function closeMessage() {
    const overlay = messageState.overlay;
    if (!overlay) return;

    // Clear any remaining timeouts
    messageState.timeouts.forEach(t => clearTimeout(t));

    // Fade out
    overlay.style.transition = 'opacity 2s';
    overlay.style.opacity = '0';

    setTimeout(() => {
        overlay.remove();
        messageState.overlay = null;
        messageState.contentContainer = null;

        if (messageState.onComplete) {
            messageState.onComplete();
        }
    }, 2000);
}

// ─────────────────────────────────────────────────────────────────────────────
// Export for testing/dev mode
// ─────────────────────────────────────────────────────────────────────────────

export function getMessageDuration() {
    const lastSection = MESSAGE_SECTIONS[MESSAGE_SECTIONS.length - 1];
    return lastSection.delay + 10000; // Last section + buffer for continue button
}
