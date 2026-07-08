// Central content file for "You vs. The Other You".
// The whole game is driven from this array — edit copy, outcomes, traits,
// beats, and avatar items here without touching component code.
//
// Step types:
//   "choice"   -> a 4-option founder/life fork
//   "wildcard" -> a no-choice event that hits both timelines
//   "final"    -> the age-30 reveal
//
// Hidden dollar outcomes (netWorthDelta) are NEVER shown on the cards before
// selection. They only surface through the net-worth / ticker animations.

export const SEQUENCE = [
  {
    type: "choice",
    id: "stage-1",
    age: 16,
    label: "Age 16 / The First Idea",
    prompt:
      "The night before a major exam, you make a one-page study pack that actually helps people understand the topic.\n\nBy lunch, half the year wants a copy.\n\nWhat do you do?",
    subtext:
      "No correct answer. You are not choosing the best outcome. You are choosing the first version of yourself.",
    options: [
      {
        id: "A",
        title: "Charge from Day One",
        body: "Sell the study pack for $3 and find out whether people actually value it.",
        pros: ["Proof", "First revenue", "Sales confidence"],
        costs: ["Awkward conversations", "People may judge you"],
        netWorthDelta: 1468,
        trait: "First proof",
        beat: "People still ask if you'll make another one.",
        item: "fresh-sneakers",
        itemLabel: "FIRST MONEY SHOES",
      },
      {
        id: "B",
        title: "Earn Trust First",
        body: "Drop it in the group chat for free and let people love it before you think about money.",
        pros: ["Reputation", "Users", "Word of mouth"],
        costs: ["No revenue", "Weak boundaries"],
        netWorthDelta: -200,
        trait: "Loved, unpaid",
        beat: "Everyone used it. Nobody paid for it.",
        item: "heart-sticker",
        itemLabel: "LOVED, UNPAID",
      },
      {
        id: "C",
        title: "Protect the Year",
        body: "Keep it for your mates only and avoid turning school into your first customer acquisition channel.",
        pros: ["Loyalty", "Peace", "Normal teenage life"],
        costs: ["No proof", "Smaller ambition"],
        netWorthDelta: 0,
        trait: "Protected circle",
        beat: "You kept the peace and had a better year for it.",
        item: "sunglasses",
        itemLabel: "BEST YEAR DETECTED",
      },
      {
        id: "D",
        title: "Build the Vision First",
        body: "Make the name, logo, landing page, and pitch before selling anything.",
        pros: ["Vision", "Confidence", "Founder energy"],
        costs: ["No customers yet", "Reality check delayed"],
        netWorthDelta: -80,
        trait: "Pre-revenue vision",
        beat: "The idea looked funded before it existed.",
        item: "ceo-lanyard",
        itemLabel: "PRE-REVENUE CEO",
      },
    ],
  },

  {
    type: "choice",
    id: "stage-2",
    age: 17,
    label: "Age 17 / The Build Fork",
    prompt:
      "The study pack keeps spreading.\n\nPeople now want a proper version: a website, reminders, videos, maybe even a real product.\n\nHow do you build the machine?",
    subtext:
      "The first idea gave you demand. This choice decides whether you become technical, fast, social, or strategic.",
    options: [
      {
        id: "A",
        title: "Learn the Engine",
        body: "Teach yourself to build the ugly first version.",
        pros: ["Ownership", "Skill compounds", "Technical confidence"],
        costs: ["Slow", "Ugly first version", "Lonely learning curve"],
        netWorthDelta: 13600,
        trait: "Owns the engine",
        beat: "The code is embarrassing, but it is yours.",
        item: "glowing-laptop",
        itemLabel: "UGLY CODE OWNER",
      },
      {
        id: "B",
        title: "Template Sprint",
        body: "Use no-code tools and ship before it feels impressive.",
        pros: ["Speed", "Feedback", "Lower friction"],
        costs: ["Generic feel", "Platform limits", "Harder to customise"],
        netWorthDelta: 4800,
        trait: "Fast operator",
        beat: "It looked basic, but people actually used it.",
        item: "template-blocks",
        itemLabel: "NO-CODE SPRINTER",
      },
      {
        id: "C",
        title: "Find a Builder",
        body: "Convince someone technical to build it with you.",
        pros: ["Leverage", "Better product", "Shared burden"],
        costs: ["Less control", "Equity tension", "Relationship risk"],
        netWorthDelta: 7500,
        trait: "Team-dependent",
        beat: "The product got better, but every decision needed another person.",
        item: "handshake-bracelet",
        itemLabel: "CO-FOUNDER ENERGY",
      },
      {
        id: "D",
        title: "Stay Close to Customers",
        body: "Forget the app for now. Personally make better packs for people who ask.",
        pros: ["Customer insight", "Early cash", "Real conversations"],
        costs: ["Not scalable", "Time intensive", "Feels like a job"],
        netWorthDelta: 9200,
        trait: "Customer obsessed",
        beat: "You learned more from messages than from any business podcast.",
        item: "headset-clipboard",
        itemLabel: "CUSTOMER WHISPERER",
      },
    ],
  },

  {
    type: "wildcard",
    id: "wildcard-1",
    age: 19,
    label: "Age 19 / The Highlight Reel",
    prompt:
      "A founder from your year drops a cinematic launch video.\n\nIt looks like a movie trailer crossed with an F1 team reveal: lights, speed, dramatic music, fake calm under pressure.\n\nBy the end of the week, they have a term sheet.\n\nYou are still figuring out what your thing even is.",
    button: "Absorb the Comparison",
    mood: "flash", // camera-flash / highlight-reel styling
    you: {
      netWorthDelta: 0,
      trait: "Comparison pressure",
      beat: "Someone else's highlight reel made your progress feel invisible.",
      item: "comparison-scar",
      itemLabel: "COMPARISON SCAR",
    },
    other: {
      netWorthDelta: 1200,
      trait: "Lucky timing",
      beat: "Other You got invited to a room you did not know existed.",
      item: "paddock-pass",
      itemLabel: "PADDOCK PASS",
    },
  },

  {
    type: "choice",
    id: "stage-3",
    age: 21,
    label: "Age 21 / The First Crash",
    prompt:
      "You launch the grown-up version.\n\nIt does not work.\n\nUsers are quiet, money is leaking, and the thing that looked obvious in your head feels stupid in public.\n\nHow do you respond?",
    subtext:
      "The first real failure is not the end. It just decides what kind of damage you take.",
    options: [
      {
        id: "A",
        title: "Patch in Public",
        body: "Ship ugly fixes while people are watching.",
        pros: ["Fast learning", "Real feedback", "Momentum"],
        costs: ["Public embarrassment", "Messy product", "Burnout risk"],
        netWorthDelta: -2500,
        trait: "Scar tissue",
        beat: "You got roasted, then learned exactly what was broken.",
        item: "duct-tape-patch",
        itemLabel: "PUBLIC SCARS",
      },
      {
        id: "B",
        title: "Buy Attention",
        body: "Run ads and try to force momentum.",
        pros: ["Data", "Reach", "Feels serious"],
        costs: ["Burns cash", "Easy to lie to yourself", "Weak retention still hurts"],
        netWorthDelta: -8000,
        trait: "Burn rate victim",
        beat: "The traffic came. The customers did not stay.",
        item: "burnt-wallet",
        itemLabel: "AD BURNED",
      },
      {
        id: "C",
        title: "Rebuild in Secret",
        body: "Disappear for months and make it properly good.",
        pros: ["Quality", "Focus", "Taste"],
        costs: ["No customers watching", "Slow", "Isolation"],
        netWorthDelta: -6000,
        trait: "Overbuilder",
        beat: "The product improved. The market moved on.",
        item: "tired-eyes",
        itemLabel: "EIGHT-MONTH REBUILD",
      },
      {
        id: "D",
        title: "Step Back and Diagnose",
        body: "Stop pushing and work out what was actually wrong.",
        pros: ["Clarity", "Saves energy", "Better judgment"],
        costs: ["Lost momentum", "Feels like quitting", "Hard to restart"],
        netWorthDelta: -1000,
        trait: "Paused, not dead",
        beat: "You stopped bleeding money, but the silence felt awful.",
        item: "pause-badge",
        itemLabel: "PIT STOP MODE",
      },
    ],
  },

  {
    type: "choice",
    id: "stage-4",
    age: 22,
    label: "Age 22 / The Second Lap",
    prompt:
      "You are poorer, smarter, and slightly humiliated.\n\nThe first version failed.\n\nWhat do you do with the lesson?",
    subtext:
      "This is the moment after the crash. Some people quit. Some people finally become dangerous.",
    options: [
      {
        id: "A",
        title: "Rebuild Narrower",
        body: "Take one painful lesson and build a smaller, sharper version.",
        pros: ["Focus", "Earned insight", "Founder resilience"],
        costs: ["Emotional risk", "More rejection", "No guarantee"],
        netWorthDelta: 250000,
        trait: "Backed builder",
        beat: "A smaller idea finally hit something real. The term sheet followed.",
        item: "term-sheet-folder",
        itemLabel: "TERM SHEET DETECTED",
      },
      {
        id: "B",
        title: "Join a Rocketship",
        body: "Work at someone else's fast-growing company and learn from the inside.",
        pros: ["Mentorship", "Network", "Operator skill"],
        costs: ["Not your company", "Less ownership", "Slower ego reward"],
        netWorthDelta: 95000,
        trait: "Operator arc",
        beat: "You stopped being the founder and became dangerous anyway.",
        item: "company-hoodie",
        itemLabel: "ROCKETSHIP PASSENGER",
      },
      {
        id: "C",
        title: "Go Stable, Invest Quietly",
        body: "Take the safe role and let compounding do what chaos could not.",
        pros: ["Stability", "Cash flow", "Lower stress"],
        costs: ["What-if feeling", "Less upside", "Slower story"],
        netWorthDelta: 65000,
        trait: "Quiet compounder",
        beat: "You never had a headline, but the account kept growing.",
        item: "index-fund-badge",
        itemLabel: "COMPOUNDING NPC",
      },
      {
        id: "D",
        title: "Turn Failure Into Story",
        body: "Make content, pitch decks, short films, and lessons from the wreckage.",
        pros: ["Audience", "Narrative", "Opportunities"],
        costs: ["Performative risk", "Less building", "Easy to become the brand"],
        netWorthDelta: 35000,
        trait: "Story-led",
        beat: "The startup died, but the trailer got meetings.",
        item: "film-clapper",
        itemLabel: "MAIN CHARACTER MODE",
      },
    ],
  },

  {
    type: "wildcard",
    id: "wildcard-2",
    age: 24,
    label: "Age 24 / The Safety Car",
    prompt:
      "The market changes overnight.\n\nCapital gets nervous. Customers get slower. Every confident founder suddenly starts saying “runway” more often.\n\nThe race is still going, but nobody is allowed to drive at full speed.",
    button: "Survive the Yellow Flag",
    mood: "safety-car", // slowed / yellow warning styling
    you: {
      netWorthDelta: -12000,
      trait: "Pressure tested",
      beat: "The yellow flag did not end the race. It just made every mistake louder.",
      item: "yellow-flag-patch",
      itemLabel: "YELLOW FLAG SURVIVOR",
    },
    other: {
      netWorthDelta: -7000,
      trait: "Slowed, not stopped",
      beat: "Other You lost speed too. Different lane, same weather.",
      item: "cracked-stopwatch",
      itemLabel: "TIME LOST",
    },
  },

  {
    type: "choice",
    id: "stage-5",
    age: 25,
    label: "Age 25 / The Speed Trap",
    prompt:
      "The second thing is working.\n\nUsers care. Competitors notice. Investors circle.\n\nNow speed becomes expensive.\n\nWhat do you optimise for?",
    subtext:
      "This is not about whether you can grow. It is about what growth is allowed to cost.",
    options: [
      {
        id: "A",
        title: "Raise and Race",
        body: "Take the big round and build like the lights just went green.",
        pros: ["Speed", "Talent", "Market pressure"],
        costs: ["Dilution", "Board pressure", "No quiet days"],
        netWorthDelta: 1200000,
        trait: "Venture-backed",
        beat: "The company moved faster than your nervous system.",
        item: "racing-helmet",
        itemLabel: "GREEN LIGHT RISK",
      },
      {
        id: "B",
        title: "Bootstrap Control",
        body: "Stay profitable, stay small enough to understand, and answer to customers.",
        pros: ["Control", "Profit", "Calm decisions"],
        costs: ["Slower growth", "Less hype", "Fewer shortcuts"],
        netWorthDelta: 450000,
        trait: "Profitable operator",
        beat: "Nobody wrote a profile on you. The bank account did not care.",
        item: "toolbelt-cash-register",
        itemLabel: "CONTROLLED CASHFLOW",
      },
      {
        id: "C",
        title: "Sell Early",
        body: "Take the acquisition before the story gets complicated.",
        pros: ["Real liquidity", "Relief", "Clean ending"],
        costs: ["Unfinished mission", "Possible regret", "Someone else owns it"],
        netWorthDelta: 700000,
        trait: "Early exit",
        beat: "You won, then immediately wondered if you left too soon.",
        item: "golden-ticket",
        itemLabel: "EXIT TICKET",
      },
      {
        id: "D",
        title: "Stay Niche and Weird",
        body: "Ignore the obvious growth path and build for the people who truly get it.",
        pros: ["Taste", "Community", "Independence"],
        costs: ["Smaller market", "Less capital", "Harder to explain"],
        netWorthDelta: 300000,
        trait: "Cult product",
        beat: "Fewer people used it, but the right people cared too much.",
        item: "strange-crown",
        itemLabel: "WEIRDLY LOVED",
      },
    ],
  },

  {
    type: "final",
    id: "final",
    age: 30,
    label: "Age 30 / The Meeting",
    prompt:
      "Two versions of you kept going.\n\nNeither asked permission.\n\nNow they meet.",
  },
];

export const STARTING_NET_WORTH = 0;

// ---------------------------------------------------------------------------
// Persona system (final reveal)
//
// Every CHOICE option leaves an accessory `item` on the player. We map those
// items to an archetype so the Age 30 reveal can award each side a title +
// caption based on how they actually played. Wildcard items are intentionally
// omitted here (they are forced, not chosen) so they never sway the persona.
// ---------------------------------------------------------------------------
export const ITEM_ARCHETYPE = {
  // MONEY — chased the biggest number, fastest
  "fresh-sneakers": "money",
  "burnt-wallet": "money",
  "term-sheet-folder": "money",
  "racing-helmet": "money",
  "golden-ticket": "money",
  // SOCIAL — built for people first
  "heart-sticker": "social",
  "handshake-bracelet": "social",
  "headset-clipboard": "social",
  "company-hoodie": "social",
  // BUILDER — hands on the machine
  "glowing-laptop": "builder",
  "template-blocks": "builder",
  "duct-tape-patch": "builder",
  // VISIONARY — sold the story before it existed
  "ceo-lanyard": "visionary",
  "tired-eyes": "visionary",
  "film-clapper": "visionary",
  "strange-crown": "visionary",
  // STEADY — calm, controlled, compounding
  sunglasses: "steady",
  "pause-badge": "steady",
  "index-fund-badge": "steady",
  "toolbelt-cash-register": "steady",
};

// Title + caption per archetype, plus tie-break priority (lower wins ties).
export const ARCHETYPES = {
  money: {
    title: "Money Hotshot",
    caption: "You optimised for the biggest number — and mostly got it.",
    priority: 1,
  },
  social: {
    title: "Most Loved",
    caption: "You built for people first. The money was a side effect.",
    priority: 2,
  },
  builder: {
    title: "The Machine",
    caption: "You kept your hands on everything and owned the outcome.",
    priority: 3,
  },
  visionary: {
    title: "Main Character",
    caption: "You sold the vision before it existed and made people believe.",
    priority: 4,
  },
  steady: {
    title: "Quiet Compounder",
    caption: "No headlines. Just a line that kept going up.",
    priority: 5,
  },
};

// Tally a player's accessory items into a dominant archetype. Returns the meta
// object ({ title, caption }) or a neutral fallback if nothing registered.
export function derivePersona(accessories = []) {
  const tally = {};
  for (const item of accessories) {
    const key = ITEM_ARCHETYPE[item];
    if (key) tally[key] = (tally[key] || 0) + 1;
  }
  const keys = Object.keys(tally);
  if (keys.length === 0) {
    return { title: "Undecided", caption: "The timeline never forced your hand." };
  }
  keys.sort((a, b) => {
    if (tally[b] !== tally[a]) return tally[b] - tally[a]; // most picks first
    return ARCHETYPES[a].priority - ARCHETYPES[b].priority; // then priority
  });
  const { title, caption } = ARCHETYPES[keys[0]];
  return { title, caption };
}

// Fake leaderboard rows for the final reveal — pure joke, no one asked.
export const FAKE_LEADERBOARD = [
  "Most Expensive Regret",
  "Best Accessory Stack",
  "Most Founder-coded Damage",
  "Biggest Other You Gap",
  "Least Clean Timeline",
];
