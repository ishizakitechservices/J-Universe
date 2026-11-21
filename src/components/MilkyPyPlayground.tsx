import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { MilkyPyExecutionResult, runMilkyPyLesson } from '../utils/portfolioLogic';

interface LessonPreset {
  id: string;
  title: string;
  description: string;
  code: string;
}

const LESSONS: LessonPreset[] = [
  {
    id: 'hello',
    title: '01. First Words',
    description: 'Use print() to display a friendly message.',
    code: '# Change the message and press Run Lesson\nprint("Hello from MilkyPy!")\nprint("Learning Python step by step.")',
  },
  {
    id: 'variables',
    title: '02. Variables & Math',
    description: 'Store values in named labels and combine them.',
    code: 'learner = "Curiosity"\nlessons_today = 2 + 1\nprint("Focus:", learner)\nprint("Lessons completed:", lessons_today)',
  },
  {
    id: 'loops',
    title: '03. Simple Loops',
    description: 'Repeat a clear step multiple times with range().',
    code: 'for step in range(4):\n    print("Building confidence, step", step + 1)',
  },
];

export function MilkyPyPlayground() {
  const [selectedId, setSelectedId] = useState<string>(LESSONS[0].id);
  const [code, setCode] = useState<string>(LESSONS[0].code);
  const [result, setResult] = useState<MilkyPyExecutionResult>(() =>
    runMilkyPyLesson(LESSONS[0].code)
  );

  const activeLesson = LESSONS.find((l) => l.id === selectedId) ?? LESSONS[0];

  const handleSelectLesson = (lesson: LessonPreset) => {
    setSelectedId(lesson.id);
    setCode(lesson.code);
    setResult(runMilkyPyLesson(lesson.code));
  };

  const handleRun = () => {
    setResult(runMilkyPyLesson(code));
  };

  const handleReset = () => {
    setCode(activeLesson.code);
    setResult(runMilkyPyLesson(activeLesson.code));
  };

  return (
    <div className="rounded-2xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] p-6 sm:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-[#167A5B] dark:text-[#7EC9B5]">
            Interactive Lesson Preview
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
            Try a beginner Python lesson
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#EAE6DC] dark:bg-[#080B12]">
          {LESSONS.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() => handleSelectLesson(lesson)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                lesson.id === selectedId
                  ? 'bg-[#FAF8F4] dark:bg-[#192338] text-[#080B12] dark:text-[#F3F0E9] shadow-xs'
                  : 'text-[#52555E] dark:text-[#A9B1C2] hover:text-[#080B12] dark:hover:text-[#F3F0E9]'
              }`}
            >
              {lesson.title}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-[#52555E] dark:text-[#A9B1C2]">
        {activeLesson.description}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label
            htmlFor="milkypy-editor"
            className="block text-xs font-mono text-[#52555E] dark:text-[#A9B1C2]"
          >
            Lesson Code
          </label>
          <textarea
            id="milkypy-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={6}
            spellCheck={false}
            className="w-full rounded-xl border border-black/12 dark:border-white/12 bg-[#080B12] text-[#F3F0E9] font-mono text-sm p-4 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#167A5B] dark:focus:ring-[#7EC9B5]"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRun}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#167A5B] dark:bg-[#7EC9B5] text-[#FAF8F4] dark:text-[#080B12] text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Run Lesson</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-black/12 dark:border-white/12 text-xs font-medium text-[#080B12] dark:text-[#F3F0E9] hover:bg-black/5 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <span className="block text-xs font-mono text-[#52555E] dark:text-[#A9B1C2]">
            Output Console
          </span>
          <div
            aria-live="polite"
            className="min-h-[168px] rounded-xl border border-black/12 dark:border-white/12 bg-[#F3F0E9] dark:bg-[#080B12] p-4 font-mono text-sm"
          >
            {result.output.length > 0 && (
              <ul className="space-y-1.5 text-[#080B12] dark:text-[#F3F0E9]">
                {result.output.map((line, index) => (
                  <li key={`${index}-${line}`} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="text-[#167A5B] dark:text-[#7EC9B5] select-none"
                    >
                      &gt;
                    </span>
                    <span className="break-words">{line}</span>
                  </li>
                ))}
              </ul>
            )}

            {result.ok && result.output.length === 0 && (
              <p className="text-xs text-[#52555E] dark:text-[#A9B1C2]">
                Code ran cleanly with no printed output. Add print(...) to display a result.
              </p>
            )}

            {!result.ok && result.error && (
              <p className="mt-2 text-xs sm:text-sm text-[#B42318] dark:text-[#FDA29B]">
                {result.error}
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-[#52555E] dark:text-[#A9B1C2]">
        Optional in-page quick preview supporting introductory print(), variables, arithmetic, len(), and bounded range() loops — visit{' '}
        <a
          href="https://milkypy.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[#080B12] dark:hover:text-[#F3F0E9]"
        >
          milkypy.com
        </a>{' '}
        for the full browser-based Python code editor, lessons, quizzes, and simple games.
      </p>
    </div>
  );
}
