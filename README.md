# CONTACT - Deep Space Signal Analysis System

A browser-based SETI (Search for Extraterrestrial Intelligence) signal analysis game with a retro terminal aesthetic. Take on the role of a scientist at a classified research station, scanning distant star systems for signs of intelligent life.

![Version](https://img.shields.io/badge/version-1.3.7-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

### 🖥️ Retro Terminal Interface
- Authentic CRT monitor effect with scanlines and phosphor glow
- Green/White color scheme toggle
- Terminal-style boot sequence with typing effects
- Immersive audio design with ambient computer noise

### 🌌 Interactive Star Map
- Visual star map with 16 cataloged exoplanets
- Real astronomical data (star types, distances, temperatures, discovery dates)
- Star visualization showing accurate color representations based on stellar classification
- Dynamic target information panel

### 📡 Signal Analysis
- Scan distant stars for radio signals
- Signal tuning mini-game - adjust frequency and gain to lock onto transmissions
- Pattern recognition mini-game - identify frequency components in complex signals
- Waveform and spectrogram visualization

### 👽 Contact Protocol
- Discover intelligent signals from multiple civilizations
- Receive visual transmissions from alien species
- Decode messages and establish first contact
- Track contacted stars in your catalog

### 📬 Mailbox System
- Receive classified communications
- Random story-driven emails from mission control
- Unread message indicators
- Expandable message viewer

## Play Online

Play the game directly in your browser at: **[https://stebafox.github.io/contact-game/](https://stebafox.github.io/contact-game/)**

## Installation

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/stebafox/contact-game.git
cd contact-seti-game
```

2. Open `index.html` in a modern web browser

### Deploy to GitHub Pages

The repository includes a GitHub Actions workflow for automatic deployment:

1. Go to your repository **Settings** > **Pages**
2. Under "Build and deployment", set **Source** to "GitHub Actions"
3. Push to the `main` branch - the site will deploy automatically
4. Access your game at `https://yourusername.github.io/repository-name/`

**Note:** For audio features to work properly, you'll need to add your own audio files:
- `Deep in the Quiet Sky.mp3` - Background music
- `Blind 2.mp3` - Alien signal music
- `room-tone-with-computer-noise-33598.mp3` - Ambient room tone

## How to Play

1. **Initialize System** - Click the start button to boot up the SETI workstation
2. **Enter Your Designation** - Provide your operator name
3. **Select a Target** - Choose a star from the visual map or catalog
4. **Initiate Scan** - Begin signal analysis on your selected target
5. **Complete Mini-games** - Successfully tune and analyze signals
6. **Make Contact** - Discover which stars harbor intelligent life
7. **Check Mailbox** - Review incoming communications from mission control

### Star Catalog

The game features 16 real exoplanets and star systems:
- ALPHA-CENTAURI
- PROXIMA-B
- KEPLER-442
- TRAPPIST-1E
- GLIESE-667C
- HD-40307G
- KEPLER-62F
- ROSS-128B
- WOLF-1061C
- LHS-1140B
- KEPLER-186F
- TEEGARDEN-B
- KAPTEYN-B
- TAU-CETI-E
- KEPLER-452B
- GLIESE-832C

## Technologies Used

- **HTML5** - Structure and canvas elements
- **CSS3** - CRT effects, animations, and responsive design
- **Vanilla JavaScript** - Game logic and interactivity
- **Canvas API** - Star map, waveforms, and spectrograms
- **Web Audio API** - Sound effects and music playback
- **LocalStorage** - Game state persistence

## File Structure

```
contact-seti-game/
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Pages deployment workflow
├── index.html          # Main HTML structure
├── style.css           # Complete styling and CRT effects
├── game.js             # Game logic, mini-games, and narrative
├── README.md           # This file
└── audio/              # Audio files (not included)
    ├── Deep in the Quiet Sky.mp3
    ├── Blind 2.mp3
    └── room-tone-with-computer-noise-33598.mp3
```

## Game State Persistence

The game automatically saves your progress including:
- Scanned stars
- Analyzed signals
- Contacted civilizations
- Operator name
- Color scheme preference
- Volume settings
- Read emails

Progress is stored in your browser's localStorage and persists between sessions.

## Controls

- **Mouse** - Navigate menus and select targets
- **Click** - Interact with buttons and UI elements
- **Sliders** - Adjust volume and signal tuning parameters
- **Color Scheme Button** - Toggle between green and white display modes
- **Clear Cache Button** - Reset all game progress

## Customization

### Adding New Narrative Content

All narrative content is centralized in the `NARRATIVE` object at the top of `game.js`:

```javascript
const NARRATIVE = {
    bootSequence: { /* Boot messages */ },
    emails: { /* Email messages */ },
    alienContacts: [ /* Alien encounter data */ ]
};
```

### Modifying Star Data

Star information is stored in three arrays in `game.js`:
- `starNames` - Star/planet names
- `starTypes` - Stellar classification and temperature
- `discoveryDates` - Year of discovery/registration

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires JavaScript and HTML5 Canvas support.

## Credits

**Design & Development:** Stephen Reponen

**Inspiration:** SETI Institute, NASA Exoplanet Archive

**Font:** VT323 (Google Fonts)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Roadmap

Future features under consideration:
- Additional star systems and exoplanets
- More complex signal analysis mini-games
- Expanded narrative branches
- Achievement system
- Sound design improvements
- Mobile responsive version

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

---

**Made with ☕ and curiosity about the cosmos**

*"We are all made of star stuff."* - Carl Sagan
