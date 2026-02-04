// ═════════════════════════════════════════════════════════════════════════════
// STAR CATALOG DATA
// All star system information including names, types, coordinates, and dates
// ═════════════════════════════════════════════════════════════════════════════

export const STAR_NAMES = [
    "ALPHA-CENTAURI", "PROXIMA-B", "KEPLER-442", "TRAPPIST-1E",
    "GLIESE-667C", "HD-40307G", "KEPLER-62F", "ROSS-128B",
    "WOLF-1061C", "LHS-1140B", "KEPLER-186F", "TEEGARDEN-B",
    "KAPTEYN-B", "TAU-CETI-E", "KEPLER-452B", "GLIESE-832C",
    "TOI-700D", "K2-18B", "KEPLER-1649C", "GJ-1061D", "LP-890-9C",
    // Weak signal stars (require dish array alignment)
    "LUYTEN-B", "BARNARD-B", "LACAILLE-9352C", "61-CYGNI-C",
    "EPSILON-INDI-B", "LALANDE-21185B", "GROOMBRIDGE-34B", "UV-CETI-B"
];

// Star type information (real astronomical data)
export const STAR_TYPES = [
    { type: "G-TYPE", class: "Yellow Dwarf", temp: "5,500K" },      // ALPHA-CENTAURI
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,000K" },         // PROXIMA-B
    { type: "K-TYPE", class: "Orange Dwarf", temp: "4,400K" },      // KEPLER-442
    { type: "M-TYPE", class: "Red Dwarf", temp: "2,500K" },         // TRAPPIST-1E
    { type: "K-TYPE", class: "Orange Dwarf", temp: "4,100K" },      // GLIESE-667C
    { type: "K-TYPE", class: "Orange Dwarf", temp: "4,900K" },      // HD-40307G
    { type: "K-TYPE", class: "Orange Dwarf", temp: "4,700K" },      // KEPLER-62F
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,200K" },         // ROSS-128B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,300K" },         // WOLF-1061C
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,100K" },         // LHS-1140B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,800K" },         // KEPLER-186F
    { type: "M-TYPE", class: "Red Dwarf", temp: "2,900K" },         // TEEGARDEN-B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,600K" },         // KAPTEYN-B
    { type: "G-TYPE", class: "Yellow Dwarf", temp: "5,300K" },      // TAU-CETI-E
    { type: "G-TYPE", class: "Yellow Dwarf", temp: "5,750K" },      // KEPLER-452B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,400K" },         // GLIESE-832C
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,480K" },         // TOI-700D
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,500K" },         // K2-18B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,240K" },         // KEPLER-1649C
    { type: "M-TYPE", class: "Red Dwarf", temp: "2,950K" },         // GJ-1061D
    { type: "M-TYPE", class: "Red Dwarf", temp: "2,850K" },         // LP-890-9C
    // Weak signal stars
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,200K" },         // LUYTEN-B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,100K" },         // BARNARD-B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,400K" },         // LACAILLE-9352C
    { type: "K-TYPE", class: "Orange Dwarf", temp: "4,450K" },      // 61-CYGNI-C
    { type: "K-TYPE", class: "Orange Dwarf", temp: "4,600K" },      // EPSILON-INDI-B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,350K" },         // LALANDE-21185B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,250K" },         // GROOMBRIDGE-34B
    { type: "M-TYPE", class: "Red Dwarf", temp: "3,050K" }          // UV-CETI-B
];

// Discovery/registration dates
export const DISCOVERY_DATES = [
    "1915",     // ALPHA-CENTAURI
    "2016",     // PROXIMA-B
    "2015",     // KEPLER-442
    "2017",     // TRAPPIST-1E
    "2011",     // GLIESE-667C
    "2012",     // HD-40307G
    "2013",     // KEPLER-62F
    "2017",     // ROSS-128B
    "2015",     // WOLF-1061C
    "2017",     // LHS-1140B
    "2014",     // KEPLER-186F
    "2019",     // TEEGARDEN-B
    "2014",     // KAPTEYN-B
    "2012",     // TAU-CETI-E
    "2015",     // KEPLER-452B
    "2014",     // GLIESE-832C
    "2020",     // TOI-700D
    "2015",     // K2-18B
    "2020",     // KEPLER-1649C
    "2020",     // GJ-1061D
    "2022",     // LP-890-9C
    // Weak signal stars
    "2024",     // LUYTEN-B
    "2018",     // BARNARD-B
    "2023",     // LACAILLE-9352C
    "2022",     // 61-CYGNI-C
    "2019",     // EPSILON-INDI-B
    "2021",     // LALANDE-21185B
    "2025",     // GROOMBRIDGE-34B
    "2024"      // UV-CETI-B
];

// Real astronomical coordinates (RA in hours/min/sec, DEC in degrees/min/sec)
export const STAR_COORDINATES = [
    { ra: { h: 14, m: 39, s: 36 }, dec: { deg: -60, m: 50, s: 2 } },   // ALPHA-CENTAURI
    { ra: { h: 14, m: 29, s: 43 }, dec: { deg: -62, m: 40, s: 46 } },  // PROXIMA-B
    { ra: { h: 4, m: 52, s: 54 }, dec: { deg: 58, m: 51, s: 8 } },     // KEPLER-442
    { ra: { h: 23, m: 6, s: 30 }, dec: { deg: -5, m: 2, s: 29 } },     // TRAPPIST-1E
    { ra: { h: 17, m: 18, s: 57 }, dec: { deg: -34, m: 59, s: 23 } },  // GLIESE-667C
    { ra: { h: 5, m: 54, s: 4 }, dec: { deg: -60, m: 1, s: 24 } },     // HD-40307G
    { ra: { h: 18, m: 52, s: 51 }, dec: { deg: 45, m: 20, s: 59 } },   // KEPLER-62F
    { ra: { h: 11, m: 47, s: 44 }, dec: { deg: 0, m: 48, s: 16 } },    // ROSS-128B
    { ra: { h: 16, m: 30, s: 18 }, dec: { deg: -12, m: 39, s: 45 } },  // WOLF-1061C
    { ra: { h: 0, m: 44, s: 59 }, dec: { deg: -15, m: 16, s: 17 } },   // LHS-1140B
    { ra: { h: 19, m: 54, s: 36 }, dec: { deg: 43, m: 57, s: 18 } },   // KEPLER-186F
    { ra: { h: 2, m: 53, s: 1 }, dec: { deg: 16, m: 52, s: 53 } },     // TEEGARDEN-B
    { ra: { h: 5, m: 11, s: 41 }, dec: { deg: -45, m: 1, s: 6 } },     // KAPTEYN-B
    { ra: { h: 1, m: 44, s: 4 }, dec: { deg: -15, m: 56, s: 15 } },    // TAU-CETI-E
    { ra: { h: 19, m: 44, s: 1 }, dec: { deg: 44, m: 16, s: 39 } },    // KEPLER-452B
    { ra: { h: 21, m: 33, s: 34 }, dec: { deg: -49, m: 0, s: 32 } },   // GLIESE-832C
    { ra: { h: 6, m: 28, s: 23 }, dec: { deg: -65, m: 34, s: 46 } },   // TOI-700D
    { ra: { h: 11, m: 30, s: 14 }, dec: { deg: 7, m: 35, s: 18 } },    // K2-18B
    { ra: { h: 19, m: 30, s: 1 }, dec: { deg: 41, m: 49, s: 50 } },    // KEPLER-1649C
    { ra: { h: 3, m: 36, s: 0 }, dec: { deg: -44, m: 30, s: 45 } },    // GJ-1061D
    { ra: { h: 7, m: 35, s: 32 }, dec: { deg: -83, m: 7, s: 30 } },    // LP-890-9C
    // Weak signal stars
    { ra: { h: 7, m: 27, s: 24 }, dec: { deg: 5, m: 13, s: 33 } },     // LUYTEN-B
    { ra: { h: 17, m: 57, s: 48 }, dec: { deg: 4, m: 41, s: 36 } },    // BARNARD-B
    { ra: { h: 23, m: 5, s: 52 }, dec: { deg: -35, m: 51, s: 11 } },   // LACAILLE-9352C
    { ra: { h: 21, m: 6, s: 54 }, dec: { deg: 38, m: 44, s: 58 } },    // 61-CYGNI-C
    { ra: { h: 22, m: 3, s: 22 }, dec: { deg: -56, m: 47, s: 10 } },   // EPSILON-INDI-B
    { ra: { h: 11, m: 3, s: 20 }, dec: { deg: 35, m: 58, s: 12 } },    // LALANDE-21185B
    { ra: { h: 0, m: 18, s: 23 }, dec: { deg: 44, m: 1, s: 23 } },     // GROOMBRIDGE-34B
    { ra: { h: 1, m: 39, s: 1 }, dec: { deg: -17, m: 57, s: 1 } }      // UV-CETI-B
];

// Index of the first weak signal star (for game logic)
export const WEAK_SIGNAL_START_INDEX = 21;

// Total number of stars
export const TOTAL_STARS = STAR_NAMES.length;
