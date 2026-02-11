// ═════════════════════════════════════════════════════════════════════════════
// STAR CATALOG DATA
// Nearby star systems known in 1995 - targets for DSRA radio telescope array
// ═════════════════════════════════════════════════════════════════════════════

export const STAR_NAMES = [
    // Primary DSRA targets - nearby sun-like and red dwarf stars
    "ALPHA CENTAURI",   // Closest star system
    "BARNARD'S STAR",   // Second closest, high proper motion
    "WOLF 359",         // Nearby red dwarf
    "LALANDE 21185",    // Nearby red dwarf
    "SIRIUS",           // Brightest star in sky
    "UV CETI",          // Luyten 726-8, flare star
    "ROSS 154",         // Nearby red dwarf
    "ROSS 248",         // Nearby red dwarf
    "ROSS 128",         // Nearby quiet red dwarf - Day 1 anomaly
    "LACAILLE 9352",    // Nearby red dwarf
    "EPSILON ERIDANI",  // Prime DSRA target, sun-like
    "61 CYGNI",         // Historic binary system
    "PROCYON",          // Nearby bright star
    "STRUVE 2398",      // Binary red dwarf system
    "GROOMBRIDGE 34",   // Nearby red dwarf binary
    "EPSILON INDI",     // Nearby orange dwarf
    "TAU CETI",         // Prime DSRA target, very sun-like
    "YZ CETI",          // Nearby red dwarf
    "LUYTEN'S STAR",    // Nearby red dwarf
    "KAPTEYN'S STAR",   // High velocity star
    "KRUGER 60",        // Nearby binary red dwarf
    // Weak signal stars (require dish array alignment)
    "VAN MAANEN'S STAR",// Nearby white dwarf
    "WOLF 424",         // Faint binary red dwarf
    "GLIESE 687",       // Distant red dwarf
    "GLIESE 674",       // Distant red dwarf
    "GLIESE 832",       // Distant red dwarf
    "82 ERIDANI",       // Sun-like, more distant
    "DELTA PAVONIS",    // Sun-like, DSRA target
    "VEGA"              // Bright A-type star, DSRA target
];

// Star type information (real astronomical data for 1995)
export const STAR_TYPES = [
    { type: "G2V", class: "Yellow Dwarf", temp: "5,800K" },     // ALPHA CENTAURI
    { type: "M4V", class: "Red Dwarf", temp: "3,150K" },        // BARNARD'S STAR
    { type: "M6.5V", class: "Red Dwarf", temp: "2,800K" },      // WOLF 359
    { type: "M2V", class: "Red Dwarf", temp: "3,400K" },        // LALANDE 21185
    { type: "A1V", class: "White Main Seq", temp: "9,940K" },   // SIRIUS
    { type: "M5.5V", class: "Flare Star", temp: "2,700K" },     // UV CETI
    { type: "M3.5V", class: "Red Dwarf", temp: "3,200K" },      // ROSS 154
    { type: "M5.5V", class: "Red Dwarf", temp: "2,800K" },      // ROSS 248
    { type: "M4V", class: "Red Dwarf", temp: "3,200K" },        // ROSS 128
    { type: "M1V", class: "Red Dwarf", temp: "3,600K" },        // LACAILLE 9352
    { type: "K2V", class: "Orange Dwarf", temp: "5,100K" },     // EPSILON ERIDANI
    { type: "K5V", class: "Orange Dwarf", temp: "4,500K" },     // 61 CYGNI
    { type: "F5IV", class: "Yellow-White", temp: "6,500K" },    // PROCYON
    { type: "M3V", class: "Red Dwarf", temp: "3,300K" },        // STRUVE 2398
    { type: "M1.5V", class: "Red Dwarf", temp: "3,600K" },      // GROOMBRIDGE 34
    { type: "K5V", class: "Orange Dwarf", temp: "4,600K" },     // EPSILON INDI
    { type: "G8V", class: "Yellow Dwarf", temp: "5,300K" },     // TAU CETI
    { type: "M4.5V", class: "Red Dwarf", temp: "3,100K" },      // YZ CETI
    { type: "M3.5V", class: "Red Dwarf", temp: "3,200K" },      // LUYTEN'S STAR
    { type: "M1V", class: "Red Subdwarf", temp: "3,550K" },     // KAPTEYN'S STAR
    { type: "M3V", class: "Red Dwarf", temp: "3,300K" },        // KRUGER 60
    // Weak signal stars
    { type: "DZ8", class: "White Dwarf", temp: "6,100K" },      // VAN MAANEN'S STAR
    { type: "M5V", class: "Red Dwarf", temp: "2,900K" },        // WOLF 424
    { type: "M3V", class: "Red Dwarf", temp: "3,350K" },        // GLIESE 687
    { type: "M3V", class: "Red Dwarf", temp: "3,400K" },        // GLIESE 674
    { type: "M1.5V", class: "Red Dwarf", temp: "3,600K" },      // GLIESE 832
    { type: "G8V", class: "Yellow Dwarf", temp: "5,400K" },     // 82 ERIDANI
    { type: "G8IV", class: "Yellow Subgiant", temp: "5,500K" }, // DELTA PAVONIS
    { type: "A0V", class: "White Main Seq", temp: "9,600K" }   // VEGA
];

// Catalog dates (when first catalogued or measured precisely)
export const DISCOVERY_DATES = [
    "1689",     // ALPHA CENTAURI (distance measured)
    "1916",     // BARNARD'S STAR
    "1918",     // WOLF 359
    "1801",     // LALANDE 21185
    "ANTIQ",    // SIRIUS (antiquity, proper motion 1718)
    "1948",     // UV CETI
    "1925",     // ROSS 154
    "1925",     // ROSS 248
    "1926",     // ROSS 128
    "1752",     // LACAILLE 9352
    "ANTIQ",    // EPSILON ERIDANI (antiquity)
    "1792",     // 61 CYGNI (parallax measured)
    "ANTIQ",    // PROCYON (antiquity)
    "1835",     // STRUVE 2398
    "1838",     // GROOMBRIDGE 34
    "1847",     // EPSILON INDI
    "ANTIQ",    // TAU CETI (antiquity)
    "1961",     // YZ CETI
    "1935",     // LUYTEN'S STAR
    "1898",     // KAPTEYN'S STAR
    "1873",     // KRUGER 60
    // Weak signal stars
    "1917",     // VAN MAANEN'S STAR
    "1938",     // WOLF 424
    "1957",     // GLIESE 687
    "1969",     // GLIESE 674
    "1978",     // GLIESE 832
    "ANTIQ",    // 82 ERIDANI (antiquity)
    "ANTIQ",    // DELTA PAVONIS (antiquity)
    "ANTIQ"     // VEGA (antiquity)
];

// Real astronomical coordinates (RA in hours/min/sec, DEC in degrees/min/sec)
export const STAR_COORDINATES = [
    { ra: { h: 14, m: 39, s: 36 }, dec: { deg: -60, m: 50, s: 2 } },   // ALPHA CENTAURI
    { ra: { h: 17, m: 57, s: 48 }, dec: { deg: 4, m: 41, s: 36 } },    // BARNARD'S STAR
    { ra: { h: 10, m: 56, s: 29 }, dec: { deg: 7, m: 0, s: 53 } },     // WOLF 359
    { ra: { h: 11, m: 3, s: 20 }, dec: { deg: 35, m: 58, s: 12 } },    // LALANDE 21185
    { ra: { h: 6, m: 45, s: 9 }, dec: { deg: -16, m: 42, s: 58 } },    // SIRIUS
    { ra: { h: 1, m: 39, s: 1 }, dec: { deg: -17, m: 57, s: 1 } },     // UV CETI
    { ra: { h: 18, m: 49, s: 49 }, dec: { deg: -23, m: 50, s: 10 } },  // ROSS 154
    { ra: { h: 23, m: 41, s: 55 }, dec: { deg: 44, m: 10, s: 40 } },   // ROSS 248
    { ra: { h: 11, m: 47, s: 44 }, dec: { deg: 0, m: 48, s: 16 } },    // ROSS 128
    { ra: { h: 23, m: 5, s: 52 }, dec: { deg: -35, m: 51, s: 11 } },   // LACAILLE 9352
    { ra: { h: 3, m: 32, s: 56 }, dec: { deg: -9, m: 27, s: 30 } },    // EPSILON ERIDANI
    { ra: { h: 21, m: 6, s: 54 }, dec: { deg: 38, m: 44, s: 58 } },    // 61 CYGNI
    { ra: { h: 7, m: 39, s: 18 }, dec: { deg: 5, m: 13, s: 30 } },     // PROCYON
    { ra: { h: 18, m: 42, s: 47 }, dec: { deg: 59, m: 37, s: 49 } },   // STRUVE 2398
    { ra: { h: 0, m: 18, s: 23 }, dec: { deg: 44, m: 1, s: 23 } },     // GROOMBRIDGE 34
    { ra: { h: 22, m: 3, s: 22 }, dec: { deg: -56, m: 47, s: 10 } },   // EPSILON INDI
    { ra: { h: 1, m: 44, s: 4 }, dec: { deg: -15, m: 56, s: 15 } },    // TAU CETI
    { ra: { h: 1, m: 12, s: 31 }, dec: { deg: -16, m: 59, s: 56 } },   // YZ CETI
    { ra: { h: 7, m: 27, s: 24 }, dec: { deg: 5, m: 13, s: 33 } },     // LUYTEN'S STAR
    { ra: { h: 5, m: 11, s: 41 }, dec: { deg: -45, m: 1, s: 6 } },     // KAPTEYN'S STAR
    { ra: { h: 22, m: 28, s: 0 }, dec: { deg: 57, m: 41, s: 49 } },    // KRUGER 60
    // Weak signal stars
    { ra: { h: 0, m: 49, s: 10 }, dec: { deg: 5, m: 23, s: 19 } },     // VAN MAANEN'S STAR
    { ra: { h: 12, m: 33, s: 17 }, dec: { deg: 9, m: 1, s: 15 } },     // WOLF 424
    { ra: { h: 17, m: 36, s: 26 }, dec: { deg: 68, m: 20, s: 21 } },   // GLIESE 687
    { ra: { h: 17, m: 28, s: 40 }, dec: { deg: -46, m: 53, s: 43 } },  // GLIESE 674
    { ra: { h: 21, m: 33, s: 34 }, dec: { deg: -49, m: 0, s: 32 } },   // GLIESE 832
    { ra: { h: 3, m: 19, s: 56 }, dec: { deg: -43, m: 4, s: 11 } },    // 82 ERIDANI
    { ra: { h: 20, m: 8, s: 44 }, dec: { deg: -66, m: 10, s: 55 } },   // DELTA PAVONIS
    { ra: { h: 18, m: 36, s: 56 }, dec: { deg: 38, m: 47, s: 1 } }    // VEGA
];

// Distances in light years (real astronomical data)
export const STAR_DISTANCES = [
    4.37,       // ALPHA CENTAURI
    5.96,       // BARNARD'S STAR
    7.86,       // WOLF 359
    8.31,       // LALANDE 21185
    8.60,       // SIRIUS
    8.73,       // UV CETI
    9.69,       // ROSS 154
    10.32,      // ROSS 248
    11.01,      // ROSS 128
    10.74,      // LACAILLE 9352
    10.50,      // EPSILON ERIDANI
    11.41,      // 61 CYGNI
    11.46,      // PROCYON
    11.52,      // STRUVE 2398
    11.62,      // GROOMBRIDGE 34
    11.87,      // EPSILON INDI
    11.91,      // TAU CETI
    12.13,      // YZ CETI
    12.36,      // LUYTEN'S STAR
    12.76,      // KAPTEYN'S STAR
    13.15,      // KRUGER 60
    // Weak signal stars (more distant, fainter)
    14.07,      // VAN MAANEN'S STAR
    14.31,      // WOLF 424
    14.77,      // GLIESE 687
    14.84,      // GLIESE 674
    16.08,      // GLIESE 832
    19.77,      // 82 ERIDANI
    19.92,      // DELTA PAVONIS
    25.04       // VEGA
];

// Index of the first weak signal star (for game logic)
export const WEAK_SIGNAL_START_INDEX = 21;

// Total number of stars
export const TOTAL_STARS = STAR_NAMES.length;
