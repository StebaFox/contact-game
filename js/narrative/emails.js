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

// Random emails that can be received during gameplay
// Note: {PLAYER_NAME} will be replaced with the actual player name at runtime
export const RANDOM_EMAILS = [
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

- Sector 7 Food Services`
    },
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
Total size: 1.2 TB
Integrity check: PASSED

Note: Anomalous data patterns flagged in sectors 7-12. Manual review recommended.

- Backup System v3.2.1`
    },
    {
        from: 'Dr. Sarah Okonkwo - Astrobiology',
        subject: 'Habitable Zone Analysis',
        body: `{PLAYER_NAME},

I've compiled atmospheric data for several targets in your monitoring zone. Three of them show promising biosignature potential.

I know SETI focuses on technological signatures, but sometimes life announces itself in simpler ways first. Keep an eye on the oxygen-rich candidates.

Attached: Spectral analysis summary (encrypted)

- Sarah`
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
