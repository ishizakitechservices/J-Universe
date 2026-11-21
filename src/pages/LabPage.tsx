import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PROJECTS, ProjectStatus } from '../data/universeData';
import { filterProjects } from '../utils/portfolioLogic';
import { Link, useRouter } from '../utils/router';
import { ChapterHeader } from '../components/JourneyLine';

const STATUS_FILTERS: Array<ProjectStatus | 'All'> = [
  'All',
  'Live',
  'Prototype',
  'In Development',
  'Concept',
  'Archived',
];

export function LabPage() {
  const { search } = useRouter();
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'All'>('All');

  useEffect(() => {
    const params = new URLSearchParams(search);
    const initialStatus = params.get('status') as ProjectStatus | null;
    if (
      initialStatus &&
      STATUS_FILTERS.includes(initialStatus)
    ) {
      setStatusFilter(initialStatus);
    }
  }, [search]);

  const allLabProjects = useMemo(
    () =>
      filterProjects(PROJECTS, {
        labOnly: true,
        status: 'All',
      }),
    []
  );

  const labProjects = useMemo(
    () =>
      filterProjects(PROJECTS, {
        labOnly: true,
        status: statusFilter,
      }),
    [statusFilter]
  );

  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-8 pt-12 space-y-12">
      <ChapterHeader
        as="h1"
        chapter="The Lab"
        title="Experiments & upcoming explorations"
        subtitle="A quiet space reserved for confirmed prototypes and experimental projects as they are published."
      />

      {allLabProjects.length === 0 ? (
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-10 sm:p-12 text-center space-y-4">
          <p className="font-display text-xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
            No separate lab experiments are published right now
          </p>
          <p className="text-sm text-[#52555E] dark:text-[#A9B1C2] max-w-xl mx-auto leading-relaxed">
            Explore current products including ClassApp (Prototype) and MilkyPy (Live) in the Work directory.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/work"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] text-xs font-semibold"
            >
              <span>Explore Work</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
            <Link
              to="/work/classapp"
              className="px-4 py-2.5 rounded-xl border border-black/12 dark:border-white/12 text-xs font-medium text-[#080B12] dark:text-[#F3F0E9]"
            >
              ClassApp Prototype
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Status Filter Tabs */}
          <div
            role="group"
            aria-label="Filter lab experiments by status"
            className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#EAE6DC] dark:bg-[#101827] border border-black/10 dark:border-white/10"
          >
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                aria-pressed={statusFilter === status}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-[#FAF8F4] dark:bg-[#192338] text-[#080B12] dark:text-[#F3F0E9] shadow-xs'
                    : 'text-[#52555E] dark:text-[#A9B1C2] hover:text-[#080B12] dark:hover:text-[#F3F0E9]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {labProjects.length === 0 ? (
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] p-12 text-center space-y-3">
              <p className="font-display text-lg font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                No experiments currently marked "{statusFilter}"
              </p>
              <p className="text-sm text-[#52555E] dark:text-[#A9B1C2]">
                Only real, verified experiment statuses are listed here. Switch back to All to inspect active lab items.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStatusFilter('All')}
                  className="px-4 py-2 rounded-lg bg-[#080B12] text-[#F3F0E9] dark:bg-[#F3F0E9] dark:text-[#080B12] text-xs font-semibold"
                >
                  Show All Experiments
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {labProjects.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827] p-6 flex flex-col justify-between gap-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#5246D8] dark:text-[#9286D8]">
                      <span>{item.status}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.category}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[#52555E] dark:text-[#A9B1C2] leading-relaxed">
                      {item.simpleDescription.whatItIs}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/10 dark:border-white/10">
                    <Link
                      to={`/work/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#080B12] dark:text-[#F3F0E9] hover:text-[#5246D8] dark:hover:text-[#9286D8]"
                    >
                      <span>Inspect Experiment</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
