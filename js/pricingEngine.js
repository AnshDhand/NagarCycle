/**
 * WASTE PRICING ENGINE v2.0 — Granular Sub-Category Pricing
 * ----------------------------------------------------------
 * Pricing Model:
 *   - "units" → per-unit price range (min/max) scaled by quality score × quantity
 *   - "kg"    → per-kg rate × quantity × multipliers
 *   - "tons"  → per-kg rate × quantity × 1000 × multipliers
 *
 * Sub-category lookup uses fuzzy keyword matching against the AI-returned
 * subCategory string so it works for any wording Gemini returns.
 */

// ─────────────────────────────────────────────────────────────────────────────
// PRICE DATABASE  (Indian Market Rates, INR, 2024)
// ─────────────────────────────────────────────────────────────────────────────
//
// perUnit  → { min, max } — resale / refurb value per item
// perKg    → rate          — scrap / recycling value per kg
// keywords → match AI subCategory fuzzy string
//
const SUBCATEGORY_PRICES = [

    // ── E-WASTE ──────────────────────────────────────────────────────────────
    {
        label: "Laptop / Notebook",
        keywords: ["laptop", "notebook", "macbook"],
        perUnit: { min: 2000,  max: 35000 },
        perKg:   { rate: 180 },
        category: "e-waste"
    },
    {
        label: "Smartphone / Mobile Phone",
        keywords: ["smartphone", "mobile", "phone", "iphone", "android"],
        perUnit: { min: 300,   max: 18000 },
        perKg:   { rate: 200 },
        category: "e-waste"
    },
    {
        label: "Tablet",
        keywords: ["tablet", "ipad"],
        perUnit: { min: 500,   max: 15000 },
        perKg:   { rate: 170 },
        category: "e-waste"
    },
    {
        label: "Desktop Computer / Tower",
        keywords: ["desktop", "tower", "computer", "cpu", "pc"],
        perUnit: { min: 1000,  max: 12000 },
        perKg:   { rate: 100 },
        category: "e-waste"
    },
    {
        label: "Monitor / Display",
        keywords: ["monitor", "display", "screen", "lcd", "led"],
        perUnit: { min: 300,   max: 5000 },
        perKg:   { rate: 60  },
        category: "e-waste"
    },
    {
        label: "Television / TV",
        keywords: ["television", "tv", "smart tv", "crt"],
        perUnit: { min: 500,   max: 12000 },
        perKg:   { rate: 40  },
        category: "e-waste"
    },
    {
        label: "Printer / Scanner",
        keywords: ["printer", "scanner", "copier"],
        perUnit: { min: 200,   max: 3000 },
        perKg:   { rate: 50  },
        category: "e-waste"
    },
    {
        label: "Keyboard",
        keywords: ["keyboard"],
        perUnit: { min: 50,    max: 800 },
        perKg:   { rate: 40  },
        category: "e-waste"
    },
    {
        label: "Mouse",
        keywords: ["mouse"],
        perUnit: { min: 30,    max: 500 },
        perKg:   { rate: 40  },
        category: "e-waste"
    },
    {
        label: "Air Conditioner / AC",
        keywords: ["air conditioner", "ac", "split ac", "window ac"],
        perUnit: { min: 2000,  max: 20000 },
        perKg:   { rate: 60  },
        category: "e-waste"
    },
    {
        label: "Refrigerator / Fridge",
        keywords: ["refrigerator", "fridge"],
        perUnit: { min: 1500,  max: 12000 },
        perKg:   { rate: 35  },
        category: "e-waste"
    },
    {
        label: "Washing Machine",
        keywords: ["washing machine", "washer"],
        perUnit: { min: 1000,  max: 8000 },
        perKg:   { rate: 30  },
        category: "e-waste"
    },
    {
        label: "Microwave Oven",
        keywords: ["microwave", "oven"],
        perUnit: { min: 300,   max: 3000 },
        perKg:   { rate: 30  },
        category: "e-waste"
    },
    {
        label: "Copper Wire / Cable",
        keywords: ["copper wire", "copper cable", "wire", "cable"],
        perUnit: { min: 50,    max: 500 },
        perKg:   { rate: 420 },
        category: "e-waste"
    },
    {
        label: "Circuit Board / PCB",
        keywords: ["circuit board", "pcb", "motherboard", "board"],
        perUnit: { min: 100,   max: 2000 },
        perKg:   { rate: 250 },
        category: "e-waste"
    },
    {
        label: "Battery / UPS",
        keywords: ["battery", "ups", "inverter battery"],
        perUnit: { min: 50,    max: 2000 },
        perKg:   { rate: 60  },
        category: "e-waste"
    },
    {
        label: "Charger / Adapter",
        keywords: ["charger", "adapter", "power brick"],
        perUnit: { min: 20,    max: 400 },
        perKg:   { rate: 80  },
        category: "e-waste"
    },
    {
        label: "Hard Disk / SSD",
        keywords: ["hard disk", "hdd", "ssd", "storage"],
        perUnit: { min: 100,   max: 2500 },
        perKg:   { rate: 150 },
        category: "e-waste"
    },

    // ── RECYCLABLE WASTE ─────────────────────────────────────────────────────
    {
        label: "PET Plastic Bottle",
        keywords: ["pet bottle", "plastic bottle", "bottle"],
        perUnit: { min: 1,     max: 5 },
        perKg:   { rate: 12  },
        category: "recyclable"
    },
    {
        label: "HDPE Plastic",
        keywords: ["hdpe", "plastic can", "plastic container"],
        perUnit: { min: 5,     max: 30 },
        perKg:   { rate: 20  },
        category: "recyclable"
    },
    {
        label: "Mixed Plastic",
        keywords: ["plastic", "polythene", "poly"],
        perUnit: { min: 1,     max: 10 },
        perKg:   { rate: 8   },
        category: "recyclable"
    },
    {
        label: "Aluminum / Aluminium Can",
        keywords: ["aluminium can", "aluminum can", "beverage can", "soft drink can", "soda can", "tin can", "energy drink", "drinks can"],
        perUnit: { min: 1,     max: 5   },
        perKg:   { rate: 100 },
        category: "recyclable"
    },
    {
        label: "Aluminum / Aluminium Sheet or Scrap",
        keywords: ["aluminum", "aluminium", "al scrap", "foil"],
        perUnit: { min: 5,     max: 50  },
        perKg:   { rate: 100 },
        category: "recyclable"
    },
    {
        label: "Iron / Steel",
        keywords: ["iron", "steel", "metal", "ferrous", "scrap metal"],
        perUnit: { min: 10,    max: 500 },
        perKg:   { rate: 28  },
        category: "recyclable"
    },
    {
        label: "Copper",
        keywords: ["copper"],
        perUnit: { min: 50,    max: 1000 },
        perKg:   { rate: 420 },
        category: "recyclable"
    },
    {
        label: "Brass",
        keywords: ["brass"],
        perUnit: { min: 50,    max: 500 },
        perKg:   { rate: 280 },
        category: "recyclable"
    },
    {
        label: "Newspaper / Magazine",
        keywords: ["newspaper", "magazine", "newsprint"],
        perUnit: { min: 1,     max: 5 },
        perKg:   { rate: 10  },
        category: "recyclable"
    },
    {
        label: "Cardboard / Box",
        keywords: ["cardboard", "box", "carton"],
        perUnit: { min: 2,     max: 15 },
        perKg:   { rate: 6   },
        category: "recyclable"
    },
    {
        label: "White Paper / Office Paper",
        keywords: ["paper", "office paper", "white paper", "a4"],
        perUnit: { min: 1,     max: 5 },
        perKg:   { rate: 12  },
        category: "recyclable"
    },
    {
        label: "Glass Bottle",
        keywords: ["glass bottle", "glass jar"],
        perUnit: { min: 2,     max: 10 },
        perKg:   { rate: 2   },
        category: "recyclable"
    },
    {
        label: "Broken Glass",
        keywords: ["glass", "broken glass", "cullet"],
        perUnit: { min: 1,     max: 5 },
        perKg:   { rate: 1   },
        category: "recyclable"
    },
    {
        label: "Clothes / Textile",
        keywords: ["cloth", "textile", "fabric", "shirt", "jeans", "garment", "apparel"],
        perUnit: { min: 10,    max: 500 },
        perKg:   { rate: 15  },
        category: "recyclable"
    },
    {
        label: "Leather",
        keywords: ["leather", "bag", "belt", "shoe"],
        perUnit: { min: 20,    max: 300 },
        perKg:   { rate: 20  },
        category: "recyclable"
    },

    // ── ORGANIC WASTE ────────────────────────────────────────────────────────
    {
        label: "Kitchen / Food Waste",
        keywords: ["food", "kitchen", "vegetable", "fruit", "organic"],
        perUnit: { min: 0,     max: 0 },
        perKg:   { rate: 0.5 },
        category: "organic"
    },

    // ── FURNITURE / WOOD ─────────────────────────────────────────────────────
    {
        label: "Wooden Furniture",
        keywords: ["furniture", "table", "chair", "sofa", "wardrobe", "cupboard", "wood"],
        perUnit: { min: 200,   max: 8000 },
        perKg:   { rate: 5   },
        category: "other"
    },
    {
        label: "Books",
        keywords: ["book", "textbook", "novel"],
        perUnit: { min: 5,    max: 100 },
        perKg:   { rate: 8  },
        category: "recyclable"
    },

    // ── CONSTRUCTION ─────────────────────────────────────────────────────────
    {
        label: "Construction Debris / Concrete",
        keywords: ["concrete", "brick", "debris", "construction", "rubble"],
        perUnit: { min: 0,     max: 0 },
        perKg:   { rate: 0.2 },
        category: "construction"
    },

    // ── FALLBACK ─────────────────────────────────────────────────────────────
    {
        label: "General Waste",
        keywords: [],
        perUnit: { min: 0,     max: 0 },
        perKg:   { rate: 5   },
        category: "other"
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// MULTIPLIERS
// ─────────────────────────────────────────────────────────────────────────────
const SEGREGATION_MULTIPLIERS = {
    "mixed":      0.85,
    "segregated": 1.1
};

function getDemandMultiplier(wasteCategory) {
    const cat = (wasteCategory || '').toLowerCase();
    if (cat.includes('e-waste') || cat.includes('ewaste') || cat.includes('copper') || cat.includes('alumin')) return 1.2;
    if (cat.includes('metal') || cat.includes('iron'))   return 1.15;
    if (cat.includes('plastic'))                          return 1.05;
    return 1.0;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBCATEGORY LOOKUP — fuzzy keyword match
// ─────────────────────────────────────────────────────────────────────────────
function findPriceEntry(subCategory, primaryCategory) {
    const sub = (subCategory || '').toLowerCase().trim();
    const pri = (primaryCategory || '').toLowerCase().trim();

    // Try keyword match on subCategory — only one direction: subCategory must CONTAIN the keyword
    // (Avoid reverse kw.includes(sub) which causes false matches e.g. "other" inside "motherboard")
    for (const entry of SUBCATEGORY_PRICES) {
        for (const kw of entry.keywords) {
            if (sub.includes(kw)) return entry;
        }
    }

    // Fallback by primary category broad match
    const catMap = {
        'e-waste':       entry => entry.category === 'e-waste',
        'ewaste':        entry => entry.category === 'e-waste',
        'recyclable':    entry => entry.category === 'recyclable',
        'organic':       entry => entry.category === 'organic',
        'construction':  entry => entry.category === 'construction',
    };

    for (const [key, filter] of Object.entries(catMap)) {
        if (pri.includes(key)) {
            const matches = SUBCATEGORY_PRICES.filter(filter);
            if (matches.length) return matches[matches.length - 1]; // last = generic fallback in that category
        }
    }

    return SUBCATEGORY_PRICES[SUBCATEGORY_PRICES.length - 1]; // General Waste fallback
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PRICING FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string}  subCategory    - AI-detected sub-category (e.g. "Laptop", "PET Bottle")
 * @param {string}  primaryCategory - AI primary category (e.g. "E-Waste", "Recyclable Waste")
 * @param {number}  quantity        - Numeric quantity entered by user
 * @param {string}  unit            - "units" | "kg" | "tons"
 * @param {string}  segregation     - "segregated" | "mixed"
 * @param {number}  qualityScore    - 1–10 from AI
 * @param {string}  location        - user location string (for future demand API)
 * @returns {Object} pricing breakdown
 */
function calculateFairPrice(subCategory, primaryCategory, quantity, unit, segregation, qualityScore, location) {
    const entry = findPriceEntry(subCategory, primaryCategory);
    const score = Math.min(10, Math.max(1, qualityScore || 5));
    const seg   = SEGREGATION_MULTIPLIERS[segregation] || 1.0;
    const demand = getDemandMultiplier(entry.label);

    let totalValue = 0;
    let displayRate = '';
    let pricingMode = '';

    if (unit === 'units') {
        // ── PER-UNIT MODE ────────────────────────────────────────────────────
        // Price = min + (score/10) × (max − min), scaled by segregation
        const { min, max } = entry.perUnit;
        if (max <= 0) {
            // item has no per-unit value (e.g. food waste)
            return buildTrashResult("This item has no individual resale value. Try listing by weight.");
        }
        const unitPrice = min + (score / 10) * (max - min);
        totalValue      = Math.round(unitPrice * quantity * seg);
        displayRate     = `₹${Math.round(min).toLocaleString()} – ₹${Math.round(max).toLocaleString()} / unit`;
        pricingMode     = 'per-unit';

    } else if (unit === 'kg') {
        // ── PER-KG MODE ──────────────────────────────────────────────────────
        const kgRate  = entry.perKg.rate;
        if (kgRate <= 0) return buildTrashResult("This material has no current scrap market value.");
        const qMult   = 0.7 + ((score - 1) * 0.8 / 9); // 1→0.7x, 10→1.5x
        const effRate = kgRate * qMult * seg * demand;
        totalValue    = Math.round(effRate * quantity);
        displayRate   = `₹${kgRate} / kg`;
        pricingMode   = 'per-kg';

    } else if (unit === 'tons') {
        // ── PER-TON MODE ─────────────────────────────────────────────────────
        const kgRate   = entry.perKg.rate;
        if (kgRate <= 0) return buildTrashResult("This material has no current scrap market value.");
        const qMult    = 0.7 + ((score - 1) * 0.8 / 9);
        const effRate  = kgRate * qMult * seg * demand;
        const totalKg  = quantity * 1000;
        totalValue     = Math.round(effRate * totalKg);
        displayRate    = `₹${kgRate} / kg (×${(quantity * 1000).toLocaleString()} kg)`;
        pricingMode    = 'per-ton';
    }

    if (totalValue <= 0) return buildTrashResult("Estimated value too low. Item may be non-recoverable.");

    return {
        label:        entry.label,
        displayRate,
        pricingMode,
        qualityScore: score,
        segregation:  seg,
        demand,
        totalValue,
        currency:     "₹",
        isTrash:      false
    };
}

function buildTrashResult(message) {
    return {
        label: "No Market Value",
        displayRate: "—",
        pricingMode: "none",
        qualityScore: 1,
        segregation: 0,
        demand: 0,
        totalValue: 0,
        currency: "₹",
        isTrash: true,
        message
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// AI IMAGE ANALYSIS (calls /api/ai/analyze on backend)
// ─────────────────────────────────────────────────────────────────────────────
async function analyzeWasteImage(imageFile) {
    console.log("Analyzing image with AI...");
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch('/api/ai/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errText = await response.json().then(j => j.error).catch(() => response.statusText);
            throw new Error(errText || `Server returned ${response.status}`);
        }

        const data   = await response.json();
        const result = data.data;

        return {
            detectedType:          result.primaryCategory,
            primaryCategory:       result.primaryCategory       || 'Other',
            subCategory:           result.subCategory           || 'Waste',
            isSellingAdvisable:    result.isSellingAdvisable    || 'No',
            recommendedAction:     result.recommendedAction     || 'Manual check',
            estimatedRecoveryValue:result.estimatedRecoveryValue|| 'low',
            environmentalImpact:   result.environmentalImpact   || 'Contact local collector.',
            confidence:            result.confidence            || 0,
            qualityScore:          result.quality_score         || 5,
            analysis:              result.analysis              || 'Analysis failed. Please try again.',
            decisionSupport:       result.decisionSupport       || ''
        };

    } catch (error) {
        console.error("AI Error:", error);
        return {
            detectedType:           'other',
            primaryCategory:        'Other',
            subCategory:            'Waste',
            isSellingAdvisable:     'No',
            recommendedAction:      'Manual check',
            estimatedRecoveryValue: 'low',
            environmentalImpact:    'AI Analysis currently unavailable.',
            confidence:             0,
            qualityScore:           5,
            analysis:               `AI Analysis Failed: ${error.message}. Please restart the server or check your API key.`,
            decisionSupport:        'Verify waste type manually before listing.'
        };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────
window.PricingEngine = {
    calculateFairPrice,
    analyzeWasteImage,
    findPriceEntry,
    prices: SUBCATEGORY_PRICES
};
