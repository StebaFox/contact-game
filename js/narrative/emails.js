// ═════════════════════════════════════════════════════════════════════════════
// EMAIL CONTENT
// All email messages used in the game's mailbox system
// ═════════════════════════════════════════════════════════════════════════════

export const WELCOME_EMAIL = {
    from: 'SETI PROGRAM DIRECTOR',
    subject: 'Welcome to Sector 7',
    body: `Welcome to the Deep Space Monitoring Array, Sector 7.

Your mission is to analyze signals from distant star systems and identify potential signs of extraterrestrial intelligence.

Remember: We are looking for patterns, anomalies, anything that suggests purposeful transmission.

The future of humanity's search for contact rests in your capable hands.

Good luck.

- SETI Program Director
Project Oversight`
};

// Day-aware random email pools
// Note: {PLAYER_NAME} will be replaced with the actual player name at runtime

// Day 1: Mundane atmosphere — routine, bureaucratic, small hints of strangeness
export const DAY1_EMAILS = [
    {
        from: 'PROJECT OVERSIGHT - CLASSIFIED',
        subject: 'RE: Budget Concerns',
        body: `Dr. {PLAYER_NAME},

We've reviewed your latest requisition requests. While we understand the need for continued deep space monitoring, budgetary constraints require justification.

Please provide evidence of signal anomalies or potential contact scenarios to support continued funding.

- Oversight Committee
Sector 7 Administration`
    },
    {
        from: 'Dr. Eleanor Chen - Radio Astronomy',
        subject: 'Interference Patterns',
        body: `{PLAYER_NAME},

I've been reviewing some of the frequency data from your array. There are some unusual interference patterns that don't match known sources.

Have you ruled out terrestrial interference? Some of these signatures are... peculiar.

Let me know if you need a second opinion.

- Eleanor`
    },
    {
        from: 'SYSTEM ADMINISTRATOR',
        subject: 'Array Maintenance Schedule',
        body: `NOTICE TO ALL PERSONNEL:

Scheduled maintenance on Deep Space Array components will occur:
DATE: Next week
DURATION: 4-6 hours
AFFECTED SYSTEMS: Receivers 3, 7, 12

Please plan signal acquisition accordingly.

- Technical Services`
    },
    {
        from: 'Dr. James Whitmore - SETI Director',
        subject: 'Keep Up The Work',
        body: `{PLAYER_NAME},

I know the isolation of deep space monitoring can be challenging. Remember, every signal analyzed, every frequency scanned, brings us closer to answering humanity's greatest question.

Your work matters. Even if we don't find anything today, your dedication is noted and appreciated.

- James`
    },
    {
        from: 'Cafeteria Services',
        subject: 'Menu Update',
        body: `WEEKLY MENU NOTICE:

Due to supply chain delays, the following items are temporarily unavailable:
- Fresh fruit
- Coffee (decaf only available)
- Anything that tastes good

We apologize for any inconvenience. Freeze-dried alternatives are available.

P.S. — Has anyone else noticed the terminal displays flickering near the coffee machine? Maintenance says it's nothing but it's been going on all week.

- Sector 7 Food Services`
    },
    {
        from: 'Tom Nguyen - Night Shift',
        subject: 'Something weird in Sector 12',
        body: `Hey {PLAYER_NAME},

Probably nothing, but I flagged a pattern during my shift last night. Sector 12 background noise has this 47-second repeating structure. Too regular for natural, too weak for any cataloged source.

I ran it through the standard filters and it passed right through — which means it's not any known interference pattern. Like I said, probably nothing. Solar wind refraction or something.

Just thought you should know in case you see it in your data too.

- Tom`
    },
    {
        from: 'Dr. Sarah Okonkwo - Astrobiology',
        subject: 'Habitable Zone Analysis',
        body: `{PLAYER_NAME},

I've compiled atmospheric data for several targets in your monitoring zone. Three of them show promising biosignature potential.

I know SETI focuses on technological signatures, but sometimes life announces itself in simpler ways first. Keep an eye on the oxygen-rich candidates.

Attached: Spectral analysis summary (encrypted)

- Sarah`
    }
];

// Day 2: Escalation — colleagues react to events, systems behaving strangely
export const DAY2_EMAILS = [
    {
        from: 'Dr. Marcus Webb - Xenolinguistics',
        subject: 'Pattern Analysis Request',
        body: `Dr. {PLAYER_NAME},

I've been developing new algorithms for detecting linguistic patterns in signal noise. Would you be willing to share some of your raw data feeds?

Even natural phenomena sometimes hide surprising structures. My team believes we may have found something in archived data from your sector.

Let me know if you're interested in collaborating.

- Marcus`
    },
    {
        from: 'AUTOMATED BACKUP SYSTEM',
        subject: 'Data Archive Complete',
        body: `[AUTOMATED MESSAGE]

Daily backup completed successfully.

Files archived: 2,847
Total size: 847 MB
Integrity check: PASSED

Note: Anomalous data patterns flagged in sectors 7-12. Manual review recommended.

- Backup System v3.2.1`
    },
    {
        from: 'Tom Nguyen - Night Shift',
        subject: 'RE: Something weird in Sector 12',
        body: `{PLAYER_NAME},

Okay, remember that 47-second pattern I mentioned? It's gone. Completely. Vanished from the background noise overnight — right around the time you found that Ross 128 signal.

Coincidence? Yeah. Probably. But the timing is weird, right?

Also — did you hear what happened? Half the building is talking about your signal. Dr. Chen was in the break room at 3 AM with printouts taped to the wall.

- Tom`
    },
    {
        from: 'SYSTEM ADMINISTRATOR',
        subject: 'Array Calibration Anomaly — Advisory',
        body: `NOTICE TO SECTOR 7 PERSONNEL:

Automated diagnostics have detected a calibration drift across dishes 4, 7, and 11. All three receivers are gradually shifting toward the same coordinates without operator input.

Engineering has been notified. Please do not attempt manual override at this time.

This is likely a firmware issue from the last update cycle.

- Technical Services`
    },
    {
        from: 'PERSONNEL DEPARTMENT',
        subject: 'Mandatory Training Reminder',
        body: `Dr. {PLAYER_NAME},

This is a reminder that your annual "First Contact Protocol" certification expires in 30 days.

Please complete the online refresher course before expiration. Failure to comply may result in restricted array access.

Note: Given recent... developments... this training is more relevant than ever.

- HR Division`
    }
];

// Day 3: Tension — lockdown, personal confessions, the weight of discovery
export const DAY3_EMAILS = [
    {
        from: 'SETI OPERATIONS - SECURITY',
        subject: 'Building Access Restriction — Effective Immediately',
        body: `[PRIORITY NOTICE]

By order of the Program Director, effective immediately:

- Building access is restricted to Level 6 clearance and above
- All non-essential personnel have been reassigned
- External communications are being routed through secure channels only
- Media inquiries are to be directed to the Public Affairs office — do NOT respond directly

This is a precautionary measure. There is no cause for alarm.

- SETI Security Operations`
    },
    {
        from: 'Dr. Marcus Webb - Xenolinguistics',
        subject: 'I can\'t sleep',
        body: `{PLAYER_NAME},

It's 4 AM and I can't sleep. I keep running the encoding analysis in my head.

This is going to sound unscientific, but the signal structure feels... personal. Like it was designed for us specifically. Not just for a civilization at our technological level — for us. For this moment.

The mathematical constants it uses as reference frames are ones we only formalized in the last century. The compression algorithm maps to information theory we published in the 1960s. It's as if someone was watching us develop the tools we'd need to read their message, and then sent it.

I know how that sounds. I know. But look at the data and tell me I'm wrong.

- Marcus`
    },
    {
        from: 'Tom Nguyen - Night Shift',
        subject: 'This is my last shift',
        body: `{PLAYER_NAME},

They're rotating out all non-Level-6 staff starting tomorrow. I'm being reassigned to the Mojave relay station.

I just want you to know — whatever you're working on in there, I believe in it. I've been doing night shifts at radio telescopes for twelve years and I've never seen the senior staff act like this. Dr. Whitmore was pacing the hall at midnight. Dr. Chen hasn't left the building in two days.

Something big is happening. I can feel it.

Good luck in there.

- Tom`
    }
];

// Legacy export for backwards compatibility
export const RANDOM_EMAILS = [...DAY1_EMAILS, ...DAY2_EMAILS, ...DAY3_EMAILS];

// Email sent after first dish power failure
export const POWER_FAILURE_EMAIL = {
    from: 'FACILITIES MANAGEMENT',
    subject: 'RE: RE: RE: Array Power Circuit Issues',
    body: `Dr. {PLAYER_NAME},

I know the circuit breakers have been tripping on the dish array. Trust me, we're aware.

Long story short: Congress cut our maintenance budget by 40% this fiscal year. The power distribution units on dishes 1-6 are original equipment from 1977. Yes, NINETEEN SEVENTY-SEVEN. They were "temporary replacements" for the temporary replacements.

Our electrician, Dave, says he's been holding Dish 4 together with zip ties and "positive thinking." His words, not mine.

We've submitted an emergency procurement request for new breaker panels. Estimated approval time: 8-14 months. In the meantime, when a circuit trips, you'll need to manually reroute power through the backup grid.

Sorry about this. If it helps, the vending machine in B-wing is also running on the same circuit. So if your dishes go down, at least you know someone's getting a free soda.

- Rick Vasquez
Facilities & Infrastructure
Sector 7`
};

// Email sent at start of Day 2 - Ross 128 decryption now available
export const ROSS128_DECRYPT_EMAIL = {
    from: 'Dr. James Whitmore - SETI Director',
    subject: '[URGENT] Quantum Processor Online - Ross 128 Signal',
    body: `Dr. {PLAYER_NAME},

Your clearance elevation has been processed. With Level 5 access, you now have authorization to activate the quantum decryption system.

That encrypted signal you found yesterday from Ross 128 - we need you to go back and decrypt it. This is TOP PRIORITY.

Whatever is in that signal, Washington wants answers. Re-scan Ross 128 and initiate the decryption sequence.

Don't keep us waiting.

- James Whitmore
  SETI Program Director`
};

// Special email sent when first alien signal is discovered
export const FIRST_CONTACT_EMAIL = {
    from: 'SECURITY CLEARANCE - LEVEL 5',
    subject: '[CLASSIFIED] Signal Confirmation Required',
    body: `[ENCRYPTED COMMUNICATION]

Dr. {PLAYER_NAME},

Your clearance has been elevated for this communication.

We've detected coordinated signal patterns across multiple listening posts. Your sector is of particular interest.

The signal you have identified matches parameters we have been monitoring for decades. This is not a drill.

Report all findings immediately. Do not discuss outside secure channels. Do not contact external agencies.

Protocol Sigma is now in effect.

Stand by for further instructions.

[END TRANSMISSION]`
};

// Day 2 cliffhanger: Dr. Chen email about deep space signal detection
export const DAY2_CHEN_SIGNAL_EMAIL = {
    from: 'Dr. Sarah Chen - Signal Intelligence',
    subject: 'URGENT: Deep Space Anomaly Detected',
    body: `Dr. {PLAYER_NAME},

The overnight co-processor flagged something extraordinary during batch analysis of today's survey data.

A coherent signal source at coordinates that do NOT match any entry in our stellar catalog. I have cross-referenced with every known database — military, civilian, deep space network — and returned zero matches.

This signal is coming from somewhere we have never looked before.

I have designated it SRC-7024 and I am pushing it to your starmap now. You need to scan it immediately.

I have been in this field for twenty-three years. I have never seen anything like this.

- Dr. Sarah Chen
  Signal Intelligence Division`
};

// Day 2 cliffhanger: Western seaboard blackout email
export const DAY2_BLACKOUT_EMAIL = {
    from: 'EMERGENCY ALERT - SETI OPERATIONS',
    subject: '[CRITICAL] System Failure — Western Grid Event',
    body: `[AUTOMATED PRIORITY ALERT]

Dr. {PLAYER_NAME},

At approximately {TIME} UTC, the deep space monitoring array experienced a catastrophic system failure coinciding with widespread power disruptions across the western seaboard.

AFFECTED SYSTEMS:
- Array dishes 1-12: OFFLINE (recovering)
- Signal processing core: REBOOTED
- Data integrity: UNDER REVIEW

CONCURRENT EVENT:
Reports are coming in from multiple observatories. The entire western seaboard power grid experienced a momentary blackout at the exact moment our array locked onto SRC-7024.

Coincidence or not, SRC-7024 is now classified MAXIMUM PRIORITY. Whatever that signal source is, it responded to our scan with enough electromagnetic energy to knock out infrastructure across three states.

Further analysis will resume tomorrow with all resources dedicated to SRC-7024.

Report your findings and stand down for the night.

- SETI Emergency Operations`
};
