export type ProjectStatus =
  | 'Live'
  | 'Prototype'
  | 'In Development'
  | 'Concept'
  | 'Archived';

export type ProjectCategory =
  | 'Flagship Product'
  | 'Learning Tool'
  | 'Studio Initiative'
  | 'Lab Experiment';

export type AccentWorld = 'ultraviolet' | 'lavender' | 'mint' | 'sand';

export type ProvenanceLevel =
  | 'CONFIRMED BY OWNER'
  | 'DOCUMENTED BY PUBLIC PRODUCT'
  | 'UNCONFIRMED';

export interface ProjectFeature {
  title: string;
  simpleSummary: string;
  audience: string;
  provenance: ProvenanceLevel;
}

export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption: string;
  sourceLabel: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  slug: string;
  publicIdentity?: string;
  category: ProjectCategory;
  shortTagline: string;
  simpleDescription: {
    whatItIs: string;
    whoItIsFor: string;
    problemSolved: string;
    whyItMatters: string;
  };
  detailedDescription: string;
  technicalLayer: {
    howItWasBuilt: string;
    technologies: string[];
    engineeringFocus: string[];
    architecturalDecisions: string;
  };
  features: ProjectFeature[];
  screenshots: ProjectScreenshot[];
  status: ProjectStatus;
  statusNote?: string;
  primaryActionLabel: string;
  liveUrl?: string;
  repositoryUrl?: string;
  themeAccent: AccentWorld;
  relatedSlugs: string[];
  milestones: string[];
  isLabItem?: boolean;
}

export type PlanetArchetype =
  | 'learning'
  | 'discovery'
  | 'creation'
  | 'origin'
  | 'pathway'
  | 'cluster'
  | 'archive'
  | 'horizon';

export interface UniverseDestination {
  id: string;
  name: string;
  shortLabel: string;
  path: string;
  chapter: string;
  kind: 'Product' | 'Studio' | 'Identity' | 'Exploration';
  worldRole: string;
  tagline: string;
  actionLabel: string;
  archetype: PlanetArchetype;
  productSlug?: string;
  status: string;
  summary: string;
  accent: AccentWorld;
  /** Angle in degrees around the central J. monogram */
  orbitAngle: number;
  /** Ring distance tier: 1 (inner flagship), 2 (studio & story), 3 (explorations) */
  orbitRing: 1 | 2 | 3;
}

export interface JourneyMilestone {
  id: string;
  chapter: string;
  title: string;
  periodLabel: string;
  description: string;
  linkLabel?: string;
  linkPath?: string;
  accent: AccentWorld;
}

export interface JournalEntry {
  id: string;
  slug: string;
  title: string;
  category: 'Reflection' | 'Product Note' | 'Tutorial' | 'Observation';
  publishedAt: string;
  readTime: string;
  excerpt: string;
  body: string[];
  relatedSlugs: string[];
}

export interface OriginStorySection {
  id: string;
  title: string;
  body: string;
}

/**
 * Central verified source of truth for J/UNIVERSE 4.0.
 * Keeping identity, product metadata, statuses, URLs, and studio facts here ensures
 * all pages and 3D overlays stay accurate and avoids touching 3D geometry code for text updates.
 */
export const SITE_IDENTITY = {
  brand: 'J/UNIVERSE',
  owner: 'Johnson Bediako Ametsitsi',
  role: 'Technology creator and founder of Ishizaki Tech Services',
  location: 'Ghana',
  studio: 'Ishizaki Tech Services',
  studioTagline: 'Ideas into useful technology.',
  studioDescription:
    'Ishizaki Tech Services is the technology initiative founded by Johnson Bediako Ametsitsi.',
  email: 'ishizakitechservices@gmail.com',
  social: {
    xHandle: '@ishizakitech',
    xUrl: 'https://x.com/ishizakitech',
    xProfileUrlVerified: true,
  },
  primaryHeadline: 'I turn ideas into things people can use.',
  supportingIntro:
    "Hi, I'm Johnson. I'm a technology creator based in Ghana, building and exploring digital products for learning and education.",
  approvedBiography:
    "I'm Johnson Bediako Ametsitsi, a technology creator based in Ghana and founder of Ishizaki Tech Services. My work includes digital products for learning and education.",
  audiences: [
    'Students',
    'Teachers & Schools',
    'Potential Collaborators',
    'Recruiters & Employers',
    'Business Owners',
    'Developers',
    'General Visitors',
  ],
  messages: {
    universe: 'One person. Many ideas. An entire universe of possibilities.',
    human: 'Technology should feel human.',
    studio: 'Ideas into useful technology.',
  },
} as const;

/**
 * Genuine product captures verified directly from the live applications.
 * Personal photography is intentionally omitted; the J. monogram represents Johnson's identity.
 */
export const MEDIA_ASSETS = {
  classAppPrototype: '/assets/images/classapp_live_prototype.png',
  milkyPyPlayground: '/assets/images/milkypy_live_playground.png',
  milkyPyLessons: '/assets/images/milkypy_live_lessons.png',
} as const;

export const PROJECTS: ProjectItem[] = [
  {
    id: 'classapp',
    name: 'ClassApp',
    slug: 'classapp',
    publicIdentity: 'ClassApp - Student Learning',
    category: 'Flagship Product',
    shortTagline: 'Exploring better ways to support student learning.',
    simpleDescription: {
      whatItIs:
        'ClassApp is a student-learning project currently at the prototype stage.',
      whoItIsFor:
        'Students and anyone interested in seeing how early student-learning ideas are taking shape.',
      problemSolved:
        'Explores clearer ways to support student learning as an active early prototype.',
      whyItMatters:
        'Testing concepts publicly at the prototype stage helps refine what actually works before finalizing full product features.',
    },
    detailedDescription:
      'ClassApp is a student-learning project currently at the prototype stage. Visit the hosted prototype ("ClassApp - Student Learning") to see how the idea is developing. Exact working capabilities behind sign-in are unconfirmed while the prototype continues to evolve.',
    technicalLayer: {
      howItWasBuilt:
        'Published as a web prototype under the page title "ClassApp - Student Learning", featuring an entry sign-in screen for Student ID, account creation, and password reset code flow.',
      technologies: [
        'Web Prototype Deployment',
        'Student ID Sign-In Entry Interface',
      ],
      engineeringFocus: [
        'Exploring student-learning workflows at prototype stage',
        'Communicating Prototype status openly rather than implying production readiness',
      ],
      architecturalDecisions:
        'Kept explicitly framed as an early Prototype with no unconfirmed feature promises until exact functionality is verified.',
    },
    // Intentionally empty: owner has not confirmed exact working features beyond prototype entry
    features: [],
    screenshots: [
      {
        src: MEDIA_ASSETS.classAppPrototype,
        alt: 'Genuine capture of the ClassApp - Student Learning prototype sign-in screen',
        caption:
          'ClassApp - Student Learning prototype entry interface at classapp-rbci.onrender.com.',
        sourceLabel: 'Live prototype capture (classapp-rbci.onrender.com)',
      },
    ],
    status: 'Prototype',
    statusNote: 'Confirmed Prototype · Exact functionality unconfirmed',
    primaryActionLabel: 'View Prototype',
    liveUrl: 'https://classapp-rbci.onrender.com/',
    themeAccent: 'lavender',
    relatedSlugs: ['milkypy', 'ishizaki-tech-services'],
    milestones: [
      'Hosted publicly at classapp-rbci.onrender.com under the "ClassApp - Student Learning" identity.',
      'Currently presented transparently as a Prototype while capabilities continue developing.',
    ],
  },
  {
    id: 'milkypy',
    name: 'MilkyPy',
    slug: 'milkypy',
    publicIdentity: 'MilkyPy — Learn Python',
    category: 'Learning Tool',
    shortTagline: 'Learn Python by doing.',
    simpleDescription: {
      whatItIs:
        'MilkyPy is a Python learning website that brings lessons and coding practice together.',
      whoItIsFor:
        'Students, beginners, educators, and anyone wanting to explore Python step by step in a web browser.',
      problemSolved:
        'Combines reading, interactive exercises, quizzes, and simple games in one browser-based place with offline support.',
      whyItMatters:
        'Writing and running Python directly in a browser lowers setup friction when learning fundamental concepts.',
    },
    detailedDescription:
      'MilkyPy is a Python learning website that brings lessons and coding practice together. Explore Python step by step, write code directly in your browser and reinforce your learning through quizzes and simple games.',
    technicalLayer: {
      howItWasBuilt:
        'Verified on milkypy.com as a browser-based Python learning workspace combining Playground, Lessons, Quiz, and Games sections with Pyodide execution and PWA offline support.',
      technologies: [
        'In-Browser Python Code Editor',
        'Syntax Highlighting & Code Formatting',
        'Saved Files & Direct Code Execution (Pyodide)',
        'Progressive Web App (Offline Support)',
      ],
      engineeringFocus: [
        'Step-by-step Python lessons paired with a live Playground editor',
        'Interactive quizzes and simple coding games documented on milkypy.com',
        'Offline-ready browser execution via service worker caching',
      ],
      architecturalDecisions:
        'Documented on milkypy.com as uniting lessons, practice editor controls, saved files, and in-browser execution in one focused learning website.',
    },
    features: [
      {
        title: 'Step-by-step Python lessons',
        simpleSummary:
          'Structured beginner-friendly lessons covering Python basics, syntax, examples, and guided walkthroughs.',
        audience: 'Documented on milkypy.com',
        provenance: 'DOCUMENTED BY PUBLIC PRODUCT',
      },
      {
        title: 'Browser-based Python code editor',
        simpleSummary:
          'Playground editor supporting syntax highlighting, formatting, saved files, and direct Python execution.',
        audience: 'Documented on milkypy.com',
        provenance: 'DOCUMENTED BY PUBLIC PRODUCT',
      },
      {
        title: 'Quizzes, simple games & offline support',
        simpleSummary:
          'Reinforce concepts through interactive quizzes, simple games, and Progressive Web App offline caching.',
        audience: 'Documented on milkypy.com',
        provenance: 'DOCUMENTED BY PUBLIC PRODUCT',
      },
    ],
    screenshots: [
      {
        src: MEDIA_ASSETS.milkyPyPlayground,
        alt: 'Genuine screenshot of MilkyPy Playground executing print("Hello World!") in the browser',
        caption:
          'MilkyPy Playground running Python directly in the browser on milkypy.com.',
        sourceLabel: 'Genuine capture from milkypy.com Playground',
      },
      {
        src: MEDIA_ASSETS.milkyPyLessons,
        alt: 'Genuine screenshot of MilkyPy Python Introduction step-by-step lessons outline',
        caption:
          'MilkyPy Lessons interface organizing foundational Python topics step by step.',
        sourceLabel: 'Genuine capture from milkypy.com Lessons',
      },
    ],
    status: 'Live',
    statusNote: 'Owner-reported Live',
    primaryActionLabel: 'Visit MilkyPy',
    liveUrl: 'https://milkypy.com/',
    themeAccent: 'mint',
    relatedSlugs: ['classapp', 'ishizaki-tech-services'],
    milestones: [
      'Published at https://milkypy.com/ (owner-reported Live).',
      'Public homepage describes step-by-step Python lessons, browser-based editor, quizzes, simple games, and offline support.',
    ],
  },
  {
    id: 'ishizaki-tech-services',
    name: 'Ishizaki Tech Services',
    slug: 'ishizaki-tech-services',
    category: 'Studio Initiative',
    shortTagline: 'Ideas into useful technology.',
    simpleDescription: {
      whatItIs:
        'Ishizaki Tech Services is the technology initiative founded by Johnson Bediako Ametsitsi.',
      whoItIsFor:
        'Visitors, students, educators, potential collaborators, and anyone discovering projects initiated by Johnson.',
      problemSolved:
        'Brings projects like ClassApp and MilkyPy together under one named technology initiative.',
      whyItMatters:
        'Establishes an honest, transparent identity for work created and shared by Johnson Bediako Ametsitsi.',
    },
    detailedDescription:
      'Ishizaki Tech Services is the technology initiative founded by Johnson Bediako Ametsitsi in Ghana. Detailed mission statements, operational structure, and any commercial service catalogue have not been published.',
    technicalLayer: {
      howItWasBuilt:
        'Creator-founded technology initiative serving as the public umbrella for Johnson Bediako Ametsitsi’s digital projects.',
      technologies: ['Creator-led Digital Product Projects'],
      engineeringFocus: [
        'Plain-language communication across learning and educational tools',
        'Transparent distinction between confirmed facts, prototypes, and unpublished details',
      ],
      architecturalDecisions:
        'Keeps unconfirmed operational details, team claims, and service guarantees omitted until officially published.',
    },
    // Intentionally empty: founder has not provided a service catalogue
    features: [],
    screenshots: [],
    status: 'Live',
    statusNote: 'Founded by Johnson Bediako Ametsitsi',
    primaryActionLabel: 'Explore Studio Identity',
    themeAccent: 'sand',
    relatedSlugs: ['classapp', 'milkypy'],
    milestones: [
      'Technology initiative founded by Johnson Bediako Ametsitsi.',
      'Connected publicly with ClassApp (Prototype) and MilkyPy (Live).',
    ],
  },
];

export const UNIVERSE_DESTINATIONS: UniverseDestination[] = [
  {
    id: 'dest-classapp',
    name: 'ClassApp',
    shortLabel: 'ClassApp',
    path: '/work/classapp',
    chapter: 'Learning Prototype',
    kind: 'Product',
    worldRole: 'Student Learning Prototype',
    tagline: 'Exploring better ways to support student learning.',
    actionLabel: 'Explore the Project',
    archetype: 'learning',
    productSlug: 'classapp',
    status: 'Prototype',
    summary:
      'ClassApp is a student-learning project currently at the prototype stage. Explore the prototype and see how the idea is developing.',
    accent: 'lavender',
    orbitAngle: -42,
    orbitRing: 1,
  },
  {
    id: 'dest-milkypy',
    name: 'MilkyPy',
    shortLabel: 'MilkyPy',
    path: '/work/milkypy',
    chapter: 'Python Learning',
    kind: 'Product',
    worldRole: 'Python Learning Website',
    tagline: 'Learn Python by doing.',
    actionLabel: 'Explore the Project',
    archetype: 'discovery',
    productSlug: 'milkypy',
    status: 'Live',
    summary:
      'MilkyPy is a Python learning website that brings lessons and coding practice together in your browser.',
    accent: 'mint',
    orbitAngle: 52,
    orbitRing: 1,
  },
  {
    id: 'dest-studio',
    name: 'Ishizaki Tech Services',
    shortLabel: 'Ishizaki',
    path: '/studio',
    chapter: 'Initiative',
    kind: 'Studio',
    worldRole: 'Technology Initiative',
    tagline: 'Ideas into useful technology.',
    actionLabel: 'Visit Studio Page',
    archetype: 'creation',
    productSlug: 'ishizaki-tech-services',
    status: 'Active Initiative',
    summary:
      'Ishizaki Tech Services is the technology initiative founded by Johnson Bediako Ametsitsi.',
    accent: 'sand',
    orbitAngle: 132,
    orbitRing: 2,
  },
  {
    id: 'dest-about',
    name: 'About Johnson',
    shortLabel: 'About Johnson',
    path: '/about',
    chapter: 'Profile',
    kind: 'Identity',
    worldRole: 'Creator Profile · Ghana',
    tagline: 'Technology should feel human.',
    actionLabel: 'About Me',
    archetype: 'origin',
    status: 'Based in Ghana',
    summary:
      "I'm Johnson Bediako Ametsitsi, a technology creator based in Ghana and founder of Ishizaki Tech Services.",
    accent: 'ultraviolet',
    orbitAngle: -120,
    orbitRing: 2,
  },
];

/**
 * Intentionally empty until official origin story, skills, achievements,
 * lab experiments, and journal articles are confirmed by Johnson.
 */
export const ORIGIN_STORY_SECTIONS: OriginStorySection[] = [];
export const CONFIRMED_SKILLS: string[] = [];
export const CONFIRMED_ACHIEVEMENTS: string[] = [];
export const JOURNEY_MILESTONES: JourneyMilestone[] = [];
export const JOURNAL_ENTRIES: JournalEntry[] = [];
