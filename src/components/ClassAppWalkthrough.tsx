import React, { useState } from 'react';
import { Bell, Calendar, CheckSquare } from 'lucide-react';

type WalkthroughTab = 'schedule' | 'tasks' | 'notices';

const SAMPLE_SCHEDULE = [
  { time: '08:30', subject: 'Mathematics', detail: 'Linear equations review' },
  { time: '10:15', subject: 'Science Lab', detail: 'Bring lab notebook' },
  { time: '13:00', subject: 'Literature', detail: 'Reading circle discussion' },
];

const SAMPLE_TASKS = [
  { id: 't1', title: 'Complete Fractions Practice Set', due: 'Today', done: true },
  { id: 't2', title: 'Read Chapter 4 Summary', due: 'Tomorrow', done: false },
  { id: 't3', title: 'Science Observation Sheet', due: 'Friday', done: false },
];

const SAMPLE_NOTICES = [
  {
    id: 'n1',
    audience: 'Parents & Students',
    title: 'Term Calendar Updated',
    body: 'Mid-term project check-in dates are now visible in the weekly rhythm view.',
  },
  {
    id: 'n2',
    audience: 'Class Group',
    title: 'Library Reading Hour',
    body: 'Quiet reading session starts 15 minutes earlier this Wednesday.',
  },
];

export function ClassAppWalkthrough() {
  const [tab, setTab] = useState<WalkthroughTab>('schedule');
  const [completedIds, setCompletedIds] = useState<string[]>(['t1']);

  const toggleTask = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="rounded-2xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <p className="text-xs font-mono text-[#6D48B8] dark:text-[#B9A2E6]">
            Interactive Concept Walkthrough
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
            How ClassApp organizes a school day
          </h3>
        </div>

        <div
          role="tablist"
          aria-label="ClassApp walkthrough views"
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#EAE6DC] dark:bg-[#080B12]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'schedule'}
            onClick={() => setTab('schedule')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              tab === 'schedule'
                ? 'bg-[#FAF8F4] dark:bg-[#192338] text-[#080B12] dark:text-[#F3F0E9] shadow-xs'
                : 'text-[#52555E] dark:text-[#A9B1C2] hover:text-[#080B12] dark:hover:text-[#F3F0E9]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Daily Rhythm</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === 'tasks'}
            onClick={() => setTab('tasks')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              tab === 'tasks'
                ? 'bg-[#FAF8F4] dark:bg-[#192338] text-[#080B12] dark:text-[#F3F0E9] shadow-xs'
                : 'text-[#52555E] dark:text-[#A9B1C2] hover:text-[#080B12] dark:hover:text-[#F3F0E9]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Tasks</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === 'notices'}
            onClick={() => setTab('notices')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              tab === 'notices'
                ? 'bg-[#FAF8F4] dark:bg-[#192338] text-[#080B12] dark:text-[#F3F0E9] shadow-xs'
                : 'text-[#52555E] dark:text-[#A9B1C2] hover:text-[#080B12] dark:hover:text-[#F3F0E9]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Notices</span>
          </button>
        </div>
      </div>

      <div className="pt-6" role="tabpanel">
        {tab === 'schedule' && (
          <div className="space-y-3">
            {SAMPLE_SCHEDULE.map((slot) => (
              <div
                key={slot.time}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-[#F3F0E9] dark:bg-[#080B12] px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-medium text-[#6D48B8] dark:text-[#B9A2E6] tabular-nums">
                    {slot.time}
                  </span>
                  <span className="font-display text-base font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                    {slot.subject}
                  </span>
                </div>
                <span className="text-sm text-[#52555E] dark:text-[#A9B1C2]">
                  {slot.detail}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'tasks' && (
          <div className="space-y-3">
            {SAMPLE_TASKS.map((task) => {
              const checked = completedIds.includes(task.id);
              return (
                <label
                  key={task.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F3F0E9] dark:bg-[#080B12] px-5 py-4 cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTask(task.id)}
                      className="h-4 w-4 rounded accent-[#6D48B8]"
                    />
                    <span
                      className={`text-sm sm:text-base font-medium ${
                        checked
                          ? 'line-through text-[#52555E] dark:text-[#A9B1C2]'
                          : 'text-[#080B12] dark:text-[#F3F0E9]'
                      }`}
                    >
                      {task.title}
                    </span>
                  </span>
                  <span className="text-xs font-mono text-[#52555E] dark:text-[#A9B1C2] whitespace-nowrap">
                    {task.due}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {tab === 'notices' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAMPLE_NOTICES.map((notice) => (
              <div
                key={notice.id}
                className="rounded-xl border border-black/10 dark:border-white/10 bg-[#F3F0E9] dark:bg-[#080B12] p-5"
              >
                <p className="text-xs font-mono text-[#6D48B8] dark:text-[#B9A2E6] mb-1.5">
                  {notice.audience}
                </p>
                <h4 className="font-display text-base font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                  {notice.title}
                </h4>
                <p className="mt-2 text-sm text-[#52555E] dark:text-[#A9B1C2] leading-relaxed">
                  {notice.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-5 text-xs text-[#52555E] dark:text-[#A9B1C2]">
        Illustrative sample preview showing the everyday workflow ClassApp is designed around—not live student records.
      </p>
    </div>
  );
}
