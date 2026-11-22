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
  | 'IMPLEMENTED IN PRO BUILD'
  | 'IN DEVELOPMENT'
  | 'UNCONFIRMED';

export type StageAvailability =
  | 'Live'
  | 'ClassApp Pro Build'
  | 'Public Prototype'
  | 'In Development';

export interface StoryChapter {
  id: string;
  stepNumber: string;
  shortLabel: string;
  title: string;
  summary: string;
  availability: StageAvailability;
  src: string;
  alt: string;
  urlHint: string;
}

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
  availability?: StageAvailability;
  urlHint?: string;
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
  storyChapters?: StoryChapter[];
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
 * Central verified source of truth for J/UNIVERSE.
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
    'Ishizaki Tech Services is the independent technology initiative founded by Johnson Bediako Ametsitsi in Ghana, building practical digital products for learning and education.',
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
 * Curated product captures from both the hosted live/prototype environments
 * and the newer ClassApp Pro / MilkyPy showcase captures.
 * Personal photography is intentionally omitted; the J. monogram represents Johnson's identity.
 */
export const MEDIA_ASSETS = {
  classAppPrototype: '/assets/images/classapp_live_prototype.png',
  classAppDashboard: '/assets/images/classapp/home-dashboard.jpg',
  classAppClasses: '/assets/images/classapp/classes.jpg',
  classAppVault: '/assets/images/classapp/vault.jpg',
  classAppAdomAi: '/assets/images/classapp/adom-ai.jpg',
  classAppSubjectMaths: '/assets/images/classapp/subject-maths.jpg',
  classAppPracticeQuiz: '/assets/images/classapp/practice-quiz.jpg',
  classAppFlashcards: '/assets/images/classapp/flashcards.jpg',
  classAppNotices: '/assets/images/classapp/notices.jpg',
  classAppAppearance: '/assets/images/classapp/appearance.jpg',
  milkyPyLessonsOutline: '/assets/images/milkypy/lesson-outline.jpg',
  milkyPyPlayground: '/assets/images/milkypy_live_playground.png',
  milkyPyLessons: '/assets/images/milkypy_live_lessons.png',
  milkyPyQuiz: '/assets/images/milkypy/quiz-question.jpg',
  milkyPyGames: '/assets/images/milkypy/games.jpg',
} as const;

export const PROJECTS: ProjectItem[] = [
  {
    id: 'classapp',
    name: 'ClassApp',
    slug: 'classapp',
    publicIdentity: 'ClassApp Pro · Student Learning Platform',
    category: 'Flagship Product',
    shortTagline: 'A student-focused learning and productivity workspace.',
    simpleDescription: {
      whatItIs:
        'ClassApp is a student-focused learning and productivity platform combining classes, a personal study vault, curriculum tutoring, quizzes, flashcards, and school notices.',
      whoItIsFor:
        'Senior high school students organizing subjects, notes, revision practice, and school announcements in one place.',
      problemSolved:
        'Replaces scattered folders, missed notices, and disconnected revision tools with a unified study workspace.',
      whyItMatters:
        'Students spend less time hunting for notes and past papers and more time learning—while a public prototype remains open for early preview.',
    },
    detailedDescription:
      'ClassApp brings a student’s daily academic life—subject workspaces, Google Classroom sync, personal Study Vault, Adom AI tutoring, quizzes, flashcards, and announcements—into one focused PWA. An early prototype is publicly hosted at classapp-rbci.onrender.com while the newer ClassApp Pro build continues development.',
    technicalLayer: {
      howItWasBuilt:
        'Designed around focused student workflows with an interactive dashboard, subject-level workspaces, file organization in the Study Vault, mathematics formula rendering, spaced-repetition flashcards, display accessibility controls, and PWA capabilities.',
      technologies: [
        'Progressive Web App (PWA) Architecture',
        'Google Classroom Integration Workflow',
        'Personal Study Vault Storage & File Filtering',
        'Adom AI Curriculum Study Tutor',
        'Formatted Mathematical Quizzes & Flashcards',
      ],
      engineeringFocus: [
        'Dashboard-to-subject flow organizing Core, Elective, and School subjects',
        'Accessible display controls including text size, reduced motion, and high contrast',
        'Transparent distinction between the newer Pro build and the public Render prototype entry',
      ],
      architecturalDecisions:
        'Keeps ClassApp’s public deployment status clear: the hosted link at classapp-rbci.onrender.com remains a Prototype entry point while the newer ClassApp Pro implementation features shown here undergo testing and rollout preparation.',
    },
    storyChapters: [
      {
        id: 'dashboard',
        stepNumber: '01',
        shortLabel: 'Dashboard',
        title: 'Student Dashboard Overview',
        summary:
          'Opens into a calm home hub showing Recent Notices alongside quick cards for Classes, Vault storage usage, Adom AI tutoring, and unread Notices.',
        availability: 'ClassApp Pro Build',
        src: MEDIA_ASSETS.classAppDashboard,
        alt: 'ClassApp Pro Student Dashboard displaying Recent Notices and navigation tiles for Classes, Vault, Adom AI, and Notices',
        urlHint: 'classapp-pro · Dashboard',
      },
      {
        id: 'classes',
        stepNumber: '02',
        shortLabel: 'Classes',
        title: 'Classes & Subject Organization',
        summary:
          'Groups subjects into Core, Electives, and School Subjects—giving English, Mathematics, Biology, Chemistry, Physics, Computing, and more their own workspaces.',
        availability: 'ClassApp Pro Build',
        src: MEDIA_ASSETS.classAppClasses,
        alt: 'ClassApp Pro Classes screen organizing 11 subjects across Core, Electives, and School Subjects',
        urlHint: 'classapp-pro · Classes',
      },
      {
        id: 'vault',
        stepNumber: '03',
        shortLabel: 'Vault',
        title: 'Personal Study Vault',
        summary:
          'Stores PDFs, slides, worksheets, past papers, and Markdown revision notes with storage tracking, search, and category filters.',
        availability: 'ClassApp Pro Build',
        src: MEDIA_ASSETS.classAppVault,
        alt: 'ClassApp Pro Study Vault showing storage meter, category filter tabs, and saved Markdown notes and PowerPoint slides',
        urlHint: 'classapp-pro · Study Vault',
      },
      {
        id: 'adom-ai',
        stepNumber: '04',
        shortLabel: 'Adom AI',
        title: 'Ask Adom AI Study Tutor',
        summary:
          'Curriculum-oriented SHS tutor aligned to subjects like ENG, MATH, SOC, ADDMATH, BIO, CHEM, COMP, and PHY for guided study help.',
        availability: 'ClassApp Pro Build',
        src: MEDIA_ASSETS.classAppAdomAi,
        alt: 'ClassApp Pro Ask Adom AI interface with subject tags for Senior High School curriculum support',
        urlHint: 'classapp-pro · Adom AI',
      },
    ],
    features: [
      {
        title: 'Student dashboard & subject workspaces',
        simpleSummary:
          'Home hub connecting Classes across Core, Elective, and School subjects with direct notice and vault counters.',
        audience: 'ClassApp Pro Build',
        provenance: 'IMPLEMENTED IN PRO BUILD',
      },
      {
        title: 'Personal Study Vault & file organization',
        simpleSummary:
          'Searchable library supporting Notes, Worksheets, Past Papers, Readings, Slides, Trash recovery, and storage tracking.',
        audience: 'ClassApp Pro Build',
        provenance: 'IMPLEMENTED IN PRO BUILD',
      },
      {
        title: 'Google Classroom subject integration',
        simpleSummary:
          'Connects Google Classroom coursework directly inside individual ClassApp subject views alongside personal revision notes.',
        audience: 'ClassApp Pro Build',
        provenance: 'IMPLEMENTED IN PRO BUILD',
      },
      {
        title: 'Adom AI study assistance',
        simpleSummary:
          'SHS curriculum-aware study tutor supporting subject context chips for Mathematics, Sciences, English, and Computing.',
        audience: 'ClassApp Pro Build',
        provenance: 'IMPLEMENTED IN PRO BUILD',
      },
      {
        title: 'Quizzes, flashcards & mathematical tools',
        simpleSummary:
          'Formatted mathematical notation in practice quizzes plus spaced-repetition flashcards with Again/Hard/Good/Easy recall grading.',
        audience: 'ClassApp Pro Build',
        provenance: 'IMPLEMENTED IN PRO BUILD',
      },
      {
        title: 'School notices, PWA & display accessibility',
        simpleSummary:
          'Pinned class and school announcements alongside theme, text-size, reduced-motion, and high-contrast display controls.',
        audience: 'ClassApp Pro Build',
        provenance: 'IMPLEMENTED IN PRO BUILD',
      },
      {
        title: 'Hosted prototype entry point',
        simpleSummary:
          'Publicly reachable prototype sign-in screen under "ClassApp - Student Learning" while Pro workflows undergo rollout readiness.',
        audience: 'Public Prototype URL',
        provenance: 'DOCUMENTED BY PUBLIC PRODUCT',
      },
    ],
    screenshots: [
      {
        src: MEDIA_ASSETS.classAppDashboard,
        alt: 'ClassApp Pro home dashboard with Classes, Vault, Adom AI, and Notices cards',
        caption: 'Home dashboard uniting Recent Notices with Classes, Study Vault, Adom AI, and Notices.',
        sourceLabel: 'Implemented in ClassApp Pro build',
        availability: 'ClassApp Pro Build',
        urlHint: 'classapp-pro · Dashboard',
      },
      {
        src: MEDIA_ASSETS.classAppClasses,
        alt: 'ClassApp Pro Classes screen listing Core, Elective, and School Subjects',
        caption: '11 subjects organized cleanly into Core, Electives, and School Subjects.',
        sourceLabel: 'Implemented in ClassApp Pro build',
        availability: 'ClassApp Pro Build',
        urlHint: 'classapp-pro · Classes',
      },
      {
        src: MEDIA_ASSETS.classAppVault,
        alt: 'ClassApp Pro Study Vault managing notes and presentation files with category filters',
        caption: 'Study Vault file library with search, category tabs, and storage quota visibility.',
        sourceLabel: 'Implemented in ClassApp Pro build',
        availability: 'ClassApp Pro Build',
        urlHint: 'classapp-pro · Study Vault',
      },
      {
        src: MEDIA_ASSETS.classAppAdomAi,
        alt: 'ClassApp Pro Ask Adom AI study tutor screen with subject tags',
        caption: 'Adom AI tutor scoped to SHS subjects including Maths, Biology, Chemistry, Physics, and Computing.',
        sourceLabel: 'Implemented in ClassApp Pro build',
        availability: 'ClassApp Pro Build',
        urlHint: 'classapp-pro · Adom AI',
      },
      {
        src: MEDIA_ASSETS.classAppSubjectMaths,
        alt: 'ClassApp Pro Mathematics subject page with Connect Google Classroom card and quick revision note composer',
        caption: 'Subject workspace pairing Google Classroom integration with direct revision notes.',
        sourceLabel: 'Implemented in ClassApp Pro build',
        availability: 'ClassApp Pro Build',
        urlHint: 'classapp-pro · Subjects / Maths',
      },
      {
        src: MEDIA_ASSETS.classAppPracticeQuiz,
        alt: 'ClassApp Pro Mathematics practice quiz rendering exponent fraction notation cleanly',
        caption: 'Practice quiz view with crisp mathematical fraction and exponent rendering.',
        sourceLabel: 'Implemented in ClassApp Pro build',
        availability: 'ClassApp Pro Build',
        urlHint: 'classapp-pro · Practice Quiz',
      },
      {
        src: MEDIA_ASSETS.classAppFlashcards,
        alt: 'ClassApp Pro spaced-repetition flashcard answer screen with recall rating buttons',
        caption: 'Flashcards module with keyboard reveal and Again, Hard, Good, and Easy recall ratings.',
        sourceLabel: 'Implemented in ClassApp Pro build',
        availability: 'ClassApp Pro Build',
        urlHint: 'classapp-pro · Flashcards',
      },
      {
        src: MEDIA_ASSETS.classAppNotices,
        alt: 'ClassApp Pro school and class announcements feed with search and pinned filter',
        caption: 'School and class Notices feed supporting search, pinned filtering, and notice creation.',
        sourceLabel: 'Implemented in ClassApp Pro build',
        availability: 'ClassApp Pro Build',
        urlHint: 'classapp-pro · Notices',
      },
      {
        src: MEDIA_ASSETS.classAppAppearance,
        alt: 'ClassApp Pro Account and Settings screen showing Light/Dark theme and Accessibility toggles',
        caption: 'Appearance & Accessibility settings supporting Text Size, Less Motion, and High Contrast.',
        sourceLabel: 'Implemented in ClassApp Pro build',
        availability: 'ClassApp Pro Build',
        urlHint: 'classapp-pro · Settings',
      },
      {
        src: MEDIA_ASSETS.classAppPrototype,
        alt: 'Publicly hosted ClassApp - Student Learning prototype entry screen on Render',
        caption: 'Public prototype entry screen live at classapp-rbci.onrender.com.',
        sourceLabel: 'Public Prototype (classapp-rbci.onrender.com)',
        availability: 'Public Prototype',
        urlHint: 'classapp-rbci.onrender.com',
      },
    ],
    status: 'Prototype',
    statusNote: 'Public Prototype live · ClassApp Pro build features shown from development archive',
    primaryActionLabel: 'View Prototype',
    liveUrl: 'https://classapp-rbci.onrender.com/',
    themeAccent: 'lavender',
    relatedSlugs: ['milkypy', 'ishizaki-tech-services'],
    milestones: [
      'Public Prototype hosted at https://classapp-rbci.onrender.com/ ("ClassApp - Student Learning" sign-in entry).',
      'Newer ClassApp Pro implementation introduces Dashboard, 11-subject Classes, Study Vault, Google Classroom link, Adom AI, Math Quizzes, Flashcards, and Notices.',
      'Public deployment of the full Pro workspace remains in development; all Pro captures above represent the internal build rather than unauthenticated public URL claims.',
    ],
  },
  {
    id: 'milkypy',
    name: 'MilkyPy',
    slug: 'milkypy',
    publicIdentity: 'MilkyPy — Python IDE & Lessons',
    category: 'Learning Tool',
    shortTagline: 'Learn Python by doing.',
    simpleDescription: {
      whatItIs:
        'MilkyPy is a live Python learning website uniting structured lessons, an in-browser coding playground, quizzes, and playable coding games.',
      whoItIsFor:
        'Beginners, students, and educators exploring Python directly in any modern browser without setup or installation.',
      problemSolved:
        'Removes environment setup barriers and turns passive reading into immediate experimentation, quiz feedback, and remixable games.',
      whyItMatters:
        'Learners move smoothly from grasping a concept in a lesson to writing real code, testing recall, and remixing classic games—even offline.',
    },
    detailedDescription:
      'MilkyPy guides learners from understanding a Python concept in 24 structured lessons, straight into writing and executing live code in its in-browser Playground, testing retention with quizzes, and remixing classic games—all available live on milkypy.com.',
    technicalLayer: {
      howItWasBuilt:
        'Built as an offline-capable Progressive Web App combining a 24-lesson curriculum outline, browser-native Python execution (Pyodide), topic quizzes with XP/streak feedback, and remixable arcade game source code.',
      technologies: [
        'In-Browser Python IDE & Playground (Pyodide)',
        '24-Lesson Interactive Curriculum Outline',
        'Topic Quizzes with Hints, Streaks & XP',
        'Playable & Remixable Python Mini-Games',
        'Progressive Web App (Offline Support)',
      ],
      engineeringFocus: [
        'Zero-setup concept-to-practice flow with "Try in Playground" jump links',
        'Readable beginner feedback, glossary, built-ins reference, and Code Help tools',
        'Offline-ready browser execution via service worker caching',
      ],
      architecturalDecisions:
        'Documented on milkypy.com as uniting structured lessons, live execution, quizzes, and remixable games in one fast browser workspace.',
    },
    storyChapters: [
      {
        id: 'learn',
        stepNumber: '01',
        shortLabel: 'Learn',
        title: '01 · Understand the Concept',
        summary:
          '24 step-by-step Python lessons cover fundamentals from print() and variables through functions and variable scope, tracking local resume progress.',
        availability: 'Live',
        src: MEDIA_ASSETS.milkyPyLessonsOutline,
        alt: 'MilkyPy 24-lesson outline sidebar and Variable Scope lesson page',
        urlHint: 'milkypy.com · Lessons',
      },
      {
        id: 'practice',
        stepNumber: '02',
        shortLabel: 'Practice',
        title: '02 · Run Code Immediately',
        summary:
          'Test ideas directly inside the browser-based Python Playground with syntax highlighting, formatting, saved files, and instant execution output.',
        availability: 'Live',
        src: MEDIA_ASSETS.milkyPyPlayground,
        alt: 'MilkyPy live Python Playground running print("Hello World!") with instant output in the browser',
        urlHint: 'milkypy.com · Playground',
      },
      {
        id: 'quiz',
        stepNumber: '03',
        shortLabel: 'Quiz',
        title: '03 · Check Understanding',
        summary:
          'Practice topic questions with Starter Mix mode, built-in hints (H), question steppers, streaks, and XP progression.',
        availability: 'Live',
        src: MEDIA_ASSETS.milkyPyQuiz,
        alt: 'MilkyPy Quiz screen showing a beginner Python comment question with streak, XP, and question stepper',
        urlHint: 'milkypy.com · Quiz',
      },
      {
        id: 'play',
        stepNumber: '04',
        shortLabel: 'Play',
        title: '04 · Play & Remix Python Games',
        summary:
          'Reinforce problem solving through playable games like Pac-Man Maze, ChompSnake, Tic-Tac-Toe AI, and Hangman—or open their Python code to remix.',
        availability: 'Live',
        src: MEDIA_ASSETS.milkyPyGames,
        alt: 'MilkyPy Python Games catalogue featuring Pac-Man Maze, ChompSnake, Tic-Tac-Toe AI, and Hangman with Remix code buttons',
        urlHint: 'milkypy.com · Games',
      },
    ],
    features: [
      {
        title: 'Step-by-step Python lessons (24 chapters)',
        simpleSummary:
          'Structured beginner-friendly lessons covering Python basics, syntax, loops, functions, and variable scope with resume tracking.',
        audience: 'Live on milkypy.com',
        provenance: 'DOCUMENTED BY PUBLIC PRODUCT',
      },
      {
        title: 'Browser-based Python code playground',
        simpleSummary:
          'Interactive IDE supporting syntax highlighting, formatting, saved files, and instant in-browser Python execution.',
        audience: 'Live on milkypy.com',
        provenance: 'DOCUMENTED BY PUBLIC PRODUCT',
      },
      {
        title: 'Interactive quizzes with hints & streaks',
        simpleSummary:
          'Beginner and topic-based quizzes with hints, immediate answer review, streaks, and XP feedback.',
        audience: 'Live on milkypy.com',
        provenance: 'DOCUMENTED BY PUBLIC PRODUCT',
      },
      {
        title: 'Playable & remixable Python coding games',
        simpleSummary:
          'Classic games tagged with computer science concepts so learners can play and inspect or remix the underlying Python code.',
        audience: 'Live on milkypy.com',
        provenance: 'DOCUMENTED BY PUBLIC PRODUCT',
      },
    ],
    screenshots: [
      {
        src: MEDIA_ASSETS.milkyPyLessonsOutline,
        alt: 'MilkyPy 24-lesson curriculum sidebar and Variable Scope lesson explanation',
        caption: '24-lesson outline tracking completion alongside readable concept walkthroughs.',
        sourceLabel: 'Capture from milkypy.com Lessons',
        availability: 'Live',
        urlHint: 'milkypy.com · Lessons',
      },
      {
        src: MEDIA_ASSETS.milkyPyPlayground,
        alt: 'Genuine screenshot of MilkyPy Playground executing print("Hello World!") in the browser',
        caption: 'MilkyPy Playground running Python directly in the browser on milkypy.com.',
        sourceLabel: 'Capture from milkypy.com Playground',
        availability: 'Live',
        urlHint: 'milkypy.com · Playground',
      },
      {
        src: MEDIA_ASSETS.milkyPyQuiz,
        alt: 'MilkyPy interactive quiz testing Python comment syntax with hints and question stepper',
        caption: 'Starter Mix quiz interface reinforcing Python syntax with hints and XP.',
        sourceLabel: 'Capture from milkypy.com Quiz',
        availability: 'Live',
        urlHint: 'milkypy.com · Quiz',
      },
      {
        src: MEDIA_ASSETS.milkyPyGames,
        alt: 'MilkyPy Python Games gallery showing Pac-Man Maze, ChompSnake, Tic-Tac-Toe AI, and Hangman',
        caption: 'Games library connecting classic arcade projects with Python concepts and remix code.',
        sourceLabel: 'Capture from milkypy.com Games',
        availability: 'Live',
        urlHint: 'milkypy.com · Games',
      },
    ],
    status: 'Live',
    statusNote: 'Live Platform at milkypy.com',
    primaryActionLabel: 'Visit MilkyPy',
    liveUrl: 'https://milkypy.com/',
    themeAccent: 'mint',
    relatedSlugs: ['classapp', 'ishizaki-tech-services'],
    milestones: [
      'Published live at https://milkypy.com/.',
      'Combines 24 structured Python lessons, in-browser Playground IDE, quizzes, and playable remixable games.',
      'Progressive Web App architecture supports offline execution and local progress saving.',
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
        'Ishizaki Tech Services is Johnson Bediako Ametsitsi’s independent technology initiative in Ghana behind learning platforms like ClassApp and MilkyPy.',
      whoItIsFor:
        'Students, educators, collaborators, and anyone exploring digital products built with practical usefulness first.',
      problemSolved:
        'Connects independent education software projects under one clear creative studio identity.',
      whyItMatters:
        'Keeps the focus on useful, approachable software rather than inflated agency claims.',
    },
    detailedDescription:
      'Ishizaki Tech Services is the independent technology initiative founded by Johnson Bediako Ametsitsi in Ghana. Rather than claiming large-team infrastructure or inventing commercial metrics, it serves as the personal umbrella uniting practical education tools like ClassApp and MilkyPy.',
    technicalLayer: {
      howItWasBuilt:
        'Independent creator-founded initiative focused on thoughtful digital products for students, beginners, and everyday learning.',
      technologies: ['Independent Educational Software & Web Platforms'],
      engineeringFocus: [
        'Plain-language communication paired with thoughtful interface craft',
        'Transparent distinction between live platforms, active prototypes, and internal builds',
      ],
      architecturalDecisions:
        'Grounded purely in verified founder identity, real projects, and honest scope.',
    },
    features: [],
    screenshots: [],
    status: 'Live',
    statusNote: 'Founded by Johnson Bediako Ametsitsi · Ghana',
    primaryActionLabel: 'Explore Studio Identity',
    themeAccent: 'sand',
    relatedSlugs: ['classapp', 'milkypy'],
    milestones: [
      'Independent technology initiative founded by Johnson Bediako Ametsitsi in Ghana.',
      'Connected publicly with ClassApp (Prototype / Pro build) and MilkyPy (Live).',
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
