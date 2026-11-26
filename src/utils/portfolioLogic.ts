import {
  JournalEntry,
  ProjectCategory,
  ProjectItem,
  ProjectStatus,
  SITE_IDENTITY,
  UniverseDestination,
} from '../data/universeData';

export interface ProjectFilterOptions {
  category?: ProjectCategory | 'All';
  status?: ProjectStatus | 'All';
  query?: string;
  includeLab?: boolean;
  labOnly?: boolean;
}

export function filterProjects(
  projects: ProjectItem[],
  options: ProjectFilterOptions = {}
): ProjectItem[] {
  const {
    category = 'All',
    status = 'All',
    query = '',
    includeLab = true,
    labOnly = false,
  } = options;

  const normalizedQuery = query.trim().toLowerCase();

  return projects.filter((project) => {
    if (labOnly && !project.isLabItem) return false;
    if (!includeLab && project.isLabItem) return false;
    if (category !== 'All' && project.category !== category) return false;
    if (status !== 'All' && project.status !== status) return false;

    if (!normalizedQuery) return true;

    const searchableText = [
      project.name,
      project.shortTagline,
      project.category,
      project.status,
      project.simpleDescription.whatItIs,
      project.simpleDescription.whoItIsFor,
      project.simpleDescription.problemSolved,
      ...project.technicalLayer.technologies,
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function getRelatedProjects(
  currentSlug: string,
  projects: ProjectItem[]
): ProjectItem[] {
  const current = projects.find((item) => item.slug === currentSlug);
  if (!current) return [];

  return current.relatedSlugs
    .map((slug) => projects.find((item) => item.slug === slug))
    .filter((item): item is ProjectItem => Boolean(item));
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  kind: string;
}

export function searchUniverse(
  query: string,
  destinations: UniverseDestination[],
  projects: ProjectItem[],
  journal: JournalEntry[]
): SearchResultItem[] {
  const normalized = query.trim().toLowerCase();

  const destinationResults: SearchResultItem[] = destinations.map((dest) => ({
    id: dest.id,
    title: dest.name,
    subtitle: dest.summary,
    path: dest.path,
    kind: dest.kind,
  }));

  const projectResults: SearchResultItem[] = projects.map((proj) => ({
    id: `proj-${proj.id}`,
    title: proj.name,
    subtitle: proj.shortTagline,
    path:
      proj.slug === 'ishizaki-tech-services'
        ? '/studio'
        : `/work/${proj.slug}`,
    kind: proj.isLabItem ? 'Lab' : 'Product',
  }));

  const journalResults: SearchResultItem[] = journal.map((entry) => ({
    id: `journal-${entry.id}`,
    title: entry.title,
    subtitle: entry.excerpt,
    path: `/journal/${entry.slug}`,
    kind: 'Journal',
  }));

  const homeResult: SearchResultItem = {
    id: 'dest-home',
    title: `${SITE_IDENTITY.brand} — ${SITE_IDENTITY.owner}`,
    subtitle: `${SITE_IDENTITY.role} based in ${SITE_IDENTITY.location}.`,
    path: '/',
    kind: 'Home',
  };

  const combinedMap = new Map<string, SearchResultItem>();
  for (const item of [
    ...destinationResults,
    ...projectResults,
    ...journalResults,
    homeResult,
  ]) {
    if (!combinedMap.has(item.path)) {
      combinedMap.set(item.path, item);
    }
  }

  const allItems = Array.from(combinedMap.values());

  if (!normalized) {
    return allItems.slice(0, 8);
  }

  return allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(normalized) ||
      item.subtitle.toLowerCase().includes(normalized) ||
      item.kind.toLowerCase().includes(normalized)
  );
}

export {
  buildMailtoHref,
  validateContactForm,
  type ContactFormInput,
  type ContactValidationResult,
} from './contactSubmission';

export interface MilkyPyExecutionResult {
  ok: boolean;
  output: string[];
  error?: string;
}

const MAX_LOOP_ITERATIONS = 25;

function evaluateSimpleExpression(
  expr: string,
  env: Record<string, string | number>
): string | number {
  const trimmed = expr.trim();

  // String literal "..." or '...'
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'") && trimmed.length >= 2)
  ) {
    return trimmed.slice(1, -1);
  }

  // len(identifier_or_string)
  const lenMatch = /^len\((.+)\)$/.exec(trimmed);
  if (lenMatch) {
    const inner = evaluateSimpleExpression(lenMatch[1], env);
    if (typeof inner === 'string') return inner.length;
    throw new Error(`len() expects text in this lesson preview.`);
  }

  // Direct numeric literal
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  // Direct variable lookup
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)) {
    if (trimmed in env) {
      return env[trimmed];
    }
    throw new Error(`Name "${trimmed}" is not defined yet.`);
  }

  // Simple binary + or * or - or / (left-to-right for beginner clarity)
  const addMatch = /^(.+?)\s*\+\s*(.+)$/.exec(trimmed);
  if (addMatch) {
    const left = evaluateSimpleExpression(addMatch[1], env);
    const right = evaluateSimpleExpression(addMatch[2], env);
    if (typeof left === 'number' && typeof right === 'number') {
      return left + right;
    }
    if (typeof left === 'string' && typeof right === 'string') {
      return left + right;
    }
    throw new Error('Use matching types with + (two numbers or two strings).');
  }

  const subMatch = /^(.+?)\s*-\s*(.+)$/.exec(trimmed);
  if (subMatch) {
    const left = evaluateSimpleExpression(subMatch[1], env);
    const right = evaluateSimpleExpression(subMatch[2], env);
    if (typeof left === 'number' && typeof right === 'number') {
      return left - right;
    }
    throw new Error('Subtraction (-) works with numbers.');
  }

  const mulMatch = /^(.+?)\s*\*\s*(.+)$/.exec(trimmed);
  if (mulMatch) {
    const left = evaluateSimpleExpression(mulMatch[1], env);
    const right = evaluateSimpleExpression(mulMatch[2], env);
    if (typeof left === 'number' && typeof right === 'number') {
      return left * right;
    }
    if (typeof left === 'string' && typeof right === 'number') {
      return left.repeat(Math.max(0, Math.min(20, Math.floor(right))));
    }
    throw new Error('Multiplication (*) works with numbers or text * count.');
  }

  throw new Error(
    `This lightweight lesson preview supports strings, numbers, variables, +, -, *, len(), print(), and for-range loops.`
  );
}

function splitTopLevelArgs(argsText: string): string[] {
  const parts: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;
  let depth = 0;

  for (let i = 0; i < argsText.length; i += 1) {
    const ch = argsText[i];
    if (quote) {
      current += ch;
      if (ch === quote && argsText[i - 1] !== '\\') {
        quote = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === '(') depth += 1;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim().length > 0) {
    parts.push(current.trim());
  }
  return parts;
}

/**
 * Deterministic, safe, isolated mini Python-subset evaluator for MilkyPy's
 * beginner interactive lesson preview. Never uses eval() or Function().
 */
export function runMilkyPyLesson(code: string): MilkyPyExecutionResult {
  const lines = code.replace(/\r\n/g, '\n').split('\n');
  const env: Record<string, string | number> = {};
  const output: string[] = [];

  try {
    let i = 0;
    while (i < lines.length) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        i += 1;
        continue;
      }

      // Disallow suspicious JS-like or import attempts gracefully
      if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
        return {
          ok: false,
          output,
          error: `Line ${i + 1}: External imports are disabled in this lightweight lesson preview.`,
        };
      }

      // Handle simple `for var in range(n):`
      const forMatch = /^for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+range\(([^)]+)\)\s*:$/.exec(
        trimmed
      );
      if (forMatch) {
        const loopVar = forMatch[1];
        const countRaw = evaluateSimpleExpression(forMatch[2], env);
        if (typeof countRaw !== 'number' || !Number.isInteger(countRaw) || countRaw < 0) {
          return {
            ok: false,
            output,
            error: `Line ${i + 1}: range() expects a whole number 0 or higher.`,
          };
        }
        if (countRaw > MAX_LOOP_ITERATIONS) {
          return {
            ok: false,
            output,
            error: `Line ${i + 1}: Lesson preview limits range() to ${MAX_LOOP_ITERATIONS} steps.`,
          };
        }

        // Collect indented block lines
        const bodyLines: string[] = [];
        let j = i + 1;
        while (j < lines.length) {
          const nextRaw = lines[j];
          if (!nextRaw.trim() || nextRaw.trim().startsWith('#')) {
            j += 1;
            continue;
          }
          if (/^\s+/.test(nextRaw)) {
            bodyLines.push(nextRaw.trim());
            j += 1;
          } else {
            break;
          }
        }

        if (bodyLines.length === 0) {
          return {
            ok: false,
            output,
            error: `Line ${i + 1}: Indent at least one line inside your for loop.`,
          };
        }

        for (let iter = 0; iter < countRaw; iter += 1) {
          env[loopVar] = iter;
          for (const bodyLine of bodyLines) {
            executeSingleStatement(bodyLine, env, output);
          }
        }

        i = j;
        continue;
      }

      executeSingleStatement(trimmed, env, output);
      i += 1;
    }

    return { ok: true, output };
  } catch (err) {
    return {
      ok: false,
      output,
      error: err instanceof Error ? err.message : 'Unable to run lesson snippet.',
    };
  }
}

function executeSingleStatement(
  statement: string,
  env: Record<string, string | number>,
  output: string[]
): void {
  const printMatch = /^print\((.*)\)$/.exec(statement);
  if (printMatch) {
    const inner = printMatch[1].trim();
    if (!inner) {
      output.push('');
      return;
    }
    const args = splitTopLevelArgs(inner);
    const rendered = args.map((arg) => String(evaluateSimpleExpression(arg, env)));
    output.push(rendered.join(' '));
    return;
  }

  const assignMatch = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/.exec(statement);
  if (assignMatch) {
    const varName = assignMatch[1];
    env[varName] = evaluateSimpleExpression(assignMatch[2], env);
    return;
  }

  throw new Error(`Could not understand "${statement}". Try print(...) or variable = value.`);
}

export interface RouteMeta {
  title: string;
  description: string;
}

export function resolveRouteMeta(pathname: string): RouteMeta {
  const clean = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  const map: Record<string, RouteMeta> = {
    '/': {
      title: 'J/UNIVERSE — Johnson Bediako Ametsitsi',
      description:
        'J/UNIVERSE is the official portfolio of Johnson Bediako Ametsitsi — technology creator in Ghana, founder of Ishizaki Tech Services, and creator of ClassApp and MilkyPy.',
    },
    '/work': {
      title: 'Work & Products — J/UNIVERSE | Johnson Bediako Ametsitsi',
      description:
        'Explore ClassApp (Prototype), MilkyPy (Live), and Ishizaki Tech Services built by Johnson Bediako Ametsitsi on J/UNIVERSE.',
    },
    '/work/classapp': {
      title: 'ClassApp Pro — Student Learning Platform | J/UNIVERSE',
      description:
        'ClassApp Pro and the hosted student-learning prototype by Johnson Bediako Ametsitsi (Ishizaki Tech Services) on J/UNIVERSE.',
    },
    '/work/milkypy': {
      title: 'MilkyPy — Learn Python by doing | J/UNIVERSE',
      description:
        'MilkyPy is a live Python learning platform by Johnson Bediako Ametsitsi (Ishizaki Tech Services) on J/UNIVERSE.',
    },
    '/universe': {
      title: 'Universe Explorer — J/UNIVERSE | Johnson Bediako Ametsitsi',
      description:
        'Interactive spatial constellation of Johnson Bediako Ametsitsi’s verified work on J/UNIVERSE.',
    },
    '/about': {
      title: 'About Johnson Bediako Ametsitsi — J/UNIVERSE',
      description:
        'Johnson Bediako Ametsitsi — technology creator based in Ghana, founder of Ishizaki Tech Services, and creator of J/UNIVERSE.',
    },
    '/studio': {
      title: 'Ishizaki Tech Services — Johnson Bediako Ametsitsi | J/UNIVERSE',
      description:
        'Ishizaki Tech Services is the independent technology initiative founded by Johnson Bediako Ametsitsi in Ghana.',
    },
    '/journey': {
      title: 'My Journey — Johnson Bediako Ametsitsi | J/UNIVERSE',
      description:
        'Journey section preserved for future stories from Johnson Bediako Ametsitsi on J/UNIVERSE.',
    },
    '/lab': {
      title: 'The Lab — J/UNIVERSE | Johnson Bediako Ametsitsi',
      description:
        'Experimental workbench inside J/UNIVERSE by Johnson Bediako Ametsitsi, reserved for future published prototypes.',
    },
    '/journal': {
      title: 'The Journal — Johnson Bediako Ametsitsi | J/UNIVERSE',
      description:
        'Writing and product notes from Johnson Bediako Ametsitsi on J/UNIVERSE, reserved until published.',
    },
    '/contact': {
      title: 'Contact Johnson Bediako Ametsitsi — J/UNIVERSE',
      description:
        'Contact Johnson Bediako Ametsitsi and Ishizaki Tech Services (J/UNIVERSE) at ishizakitechservices@gmail.com or @ishizakitech.',
    },
    '/privacy': {
      title: 'Privacy & Notice — J/UNIVERSE | Johnson Bediako Ametsitsi',
      description:
        'Privacy-conscious site notice for J/UNIVERSE by Johnson Bediako Ametsitsi and Ishizaki Tech Services.',
    },
  };

  return (
    map[clean] ?? {
      title: 'J/UNIVERSE — Johnson Bediako Ametsitsi',
      description:
        'Explore J/UNIVERSE, the digital portfolio of Johnson Bediako Ametsitsi and Ishizaki Tech Services.',
    }
  );
}
