import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code2, Sparkles } from 'lucide-react';
import { ProjectItem } from '../data/universeData';

interface TwoLayerExplainerProps {
  project: ProjectItem;
}

export function TwoLayerExplainer({ project }: TwoLayerExplainerProps) {
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <section
      aria-labelledby="explanation-layers-heading"
      className="space-y-8"
    >
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#5246D8] dark:text-[#9286D8] mb-2">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Everyday Explanation</span>
        </div>
        <h2
          id="explanation-layers-heading"
          className="font-display text-2xl sm:text-3xl font-semibold text-[#080B12] dark:text-[#F3F0E9]"
        >
          Understanding {project.name} in plain language
        </h2>
      </div>

      {/* First Layer: Simple & Non-Technical */}
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FAF8F4] dark:bg-[#101827] grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black/10 dark:divide-white/10">
        <div className="divide-y divide-black/10 dark:divide-white/10">
          <div className="p-6 sm:p-7 space-y-2">
            <h3 className="font-display text-lg font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              What is it?
            </h3>
            <p className="text-sm sm:text-base text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
              {project.simpleDescription.whatItIs}
            </p>
          </div>
          <div className="p-6 sm:p-7 space-y-2">
            <h3 className="font-display text-lg font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              What problem does it solve?
            </h3>
            <p className="text-sm sm:text-base text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
              {project.simpleDescription.problemSolved}
            </p>
          </div>
        </div>

        <div className="divide-y divide-black/10 dark:divide-white/10">
          <div className="p-6 sm:p-7 space-y-2">
            <h3 className="font-display text-lg font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              Who is it for?
            </h3>
            <p className="text-sm sm:text-base text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
              {project.simpleDescription.whoItIsFor}
            </p>
          </div>
          <div className="p-6 sm:p-7 space-y-2">
            <h3 className="font-display text-lg font-semibold text-[#080B12] dark:text-[#F3F0E9]">
              Why does it matter?
            </h3>
            <p className="text-sm sm:text-base text-[#4D5363] dark:text-[#A9B1C2] leading-relaxed">
              {project.simpleDescription.whyItMatters}
            </p>
          </div>
        </div>
      </div>

      {/* Second Layer: Optional Expandable Technical Details */}
      <div className="rounded-xl border border-black/12 dark:border-white/12 bg-[#FAF8F4] dark:bg-[#101827]">
        <button
          type="button"
          onClick={() => setShowTechnical((prev) => !prev)}
          aria-expanded={showTechnical}
          aria-controls={`tech-details-${project.slug}`}
          className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors rounded-xl"
        >
          <span className="flex items-center gap-3">
            <Code2
              className="w-5 h-5 text-[#5246D8] dark:text-[#9286D8] shrink-0"
              aria-hidden="true"
            />
            <span>
              <span className="block font-display text-base font-semibold text-[#080B12] dark:text-[#F3F0E9]">
                Technical Details (Optional)
              </span>
              <span className="block text-xs sm:text-sm text-[#52555E] dark:text-[#A9B1C2]">
                Architecture, tools, and engineering decisions behind {project.name}
              </span>
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5246D8] dark:text-[#9286D8] whitespace-nowrap shrink-0">
            {showTechnical ? 'Hide details' : 'View details'}
            {showTechnical ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </span>
        </button>

        {showTechnical && (
          <div
            id={`tech-details-${project.slug}`}
            className="px-6 pb-6 pt-2 border-t border-black/10 dark:border-white/10 space-y-6"
          >
            <div>
              <h4 className="text-sm font-semibold text-[#080B12] dark:text-[#F3F0E9] mb-1.5">
                How it was built
              </h4>
              <p className="text-sm text-[#52555E] dark:text-[#A9B1C2] leading-relaxed">
                {project.technicalLayer.howItWasBuilt}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-[#080B12] dark:text-[#F3F0E9] mb-2">
                  Core Technologies & Concepts
                </h4>
                <ul className="space-y-1.5 text-sm text-[#52555E] dark:text-[#A9B1C2]">
                  {project.technicalLayer.technologies.map((tech) => (
                    <li key={tech} className="flex items-start gap-2">
                      <span aria-hidden="true" className="text-[#5246D8] dark:text-[#9286D8]">
                        ·
                      </span>
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#080B12] dark:text-[#F3F0E9] mb-2">
                  Engineering Focus
                </h4>
                <ul className="space-y-1.5 text-sm text-[#52555E] dark:text-[#A9B1C2]">
                  {project.technicalLayer.engineeringFocus.map((focus) => (
                    <li key={focus} className="flex items-start gap-2">
                      <span aria-hidden="true" className="text-[#5246D8] dark:text-[#9286D8]">
                        ·
                      </span>
                      <span>{focus}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#080B12] dark:text-[#F3F0E9] mb-1.5">
                Key Architectural Decision
              </h4>
              <p className="text-sm text-[#52555E] dark:text-[#A9B1C2] leading-relaxed">
                {project.technicalLayer.architecturalDecisions}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
