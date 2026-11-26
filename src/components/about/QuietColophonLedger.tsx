"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { pickText } from "@/i18n";
import type {
  EducationEntry,
  ExperienceEntry,
  Locale,
} from "@/types/portfolio";

interface QuietColophonLedgerProps {
  locale: Locale;
  colophonEyebrow: string;
  experienceHeading: string;
  educationHeading: string;
  expandHint: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
}

/**
 * ACT III of `/about` — Quiet Swiss Colophon Ledger (20% Supporting Visual Weight).
 * - Sengaja dibuat tenang, ringkas (1 baris default per entri), bergaris hairline `1px`
 *   sehingga tetap informatif untuk klien/rekruter/SEO tanpa pernah menyaingi Profil & Foto di Act I.
 * - Klik baris mana pun membuka detail ringkas lewat akordeon elastis halus (`grid-rows-[0fr -> 1fr]`).
 */
export function QuietColophonLedger({
  locale,
  colophonEyebrow,
  experienceHeading,
  educationHeading,
  expandHint,
  experience,
  education,
}: QuietColophonLedgerProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      data-surface="paper"
      aria-label={`${experienceHeading} & ${educationHeading}`}
      className="w-full bg-[#F5F4F0] text-[#0D0D0D]"
    >
      <div className="mx-auto max-w-[1380px] px-6 py-24 md:px-14 md:py-32">
        {/* Quiet Section Top Rail */}
        <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-[#0D0D0D]/10 pb-5">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#73726C] uppercase">
            {colophonEyebrow}
          </span>
          <span className="font-mono text-[10px] tracking-[0.14em] text-[#A6A59E] uppercase">
            {expandHint}
          </span>
        </div>

        {/* Experience Ledger (Quiet 12-Col Swiss Split) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h2 className="flex items-baseline gap-2.5 text-sm font-medium tracking-[-0.01em] text-[#0D0D0D]">
              <span>{experienceHeading}</span>
              <span className="font-mono text-[10px] text-[#73726C] tabular-nums">
                (0{experience.length})
              </span>
            </h2>
          </div>

          <div className="divide-y divide-[#0D0D0D]/10 border-y border-[#0D0D0D]/10 lg:col-span-8">
            {experience.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => toggleRow(item.id)}
                    aria-expanded={isOpen}
                    data-cursor="pointer"
                    className="group flex w-full cursor-pointer flex-col gap-2 py-5 text-left transition-colors hover:bg-[#FAF9F6]/70 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-sm font-medium text-[#0D0D0D] transition-transform duration-500 ease-spring-out group-hover:translate-x-1 sm:text-[15px]">
                          {pickText(item.role, locale)}
                        </span>
                        <span className="text-xs text-[#73726C]">
                          · {item.organization}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-5 sm:justify-end">
                      <span className="font-mono text-[11px] text-[#73726C] tabular-nums">
                        {pickText(item.period, locale)}
                      </span>
                      <Plus
                        aria-hidden="true"
                        className={cn(
                          "h-3.5 w-3.5 text-[#73726C] transition-transform duration-500 ease-spring-out group-hover:text-[#0D0D0D]",
                          isOpen && "rotate-45 text-[#0D0D0D]"
                        )}
                      />
                    </div>
                  </button>

                  {/* Smooth Elastic Grid-Row Accordion */}
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-spring-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-3 pb-6 pt-1 sm:px-2">
                        <p className="font-mono text-[10px] tracking-[0.14em] text-[#A6A59E] uppercase">
                          {pickText(item.type, locale)}
                        </p>
                        <ul className="space-y-2 text-xs leading-relaxed text-[#73726C] sm:text-[13px]">
                          {item.highlights[locale].map((point, idx) => (
                            <li key={idx} className="flex items-baseline gap-3">
                              <span
                                aria-hidden="true"
                                className="font-mono text-[10px] text-[#A6A59E]"
                              >
                                -
                              </span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education Ledger (Even Quieter Single-Band Footnote Beneath) */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h2 className="flex items-baseline gap-2.5 text-sm font-medium tracking-[-0.01em] text-[#0D0D0D]">
              <span>{educationHeading}</span>
              <span className="font-mono text-[10px] text-[#73726C] tabular-nums">
                (0{education.length})
              </span>
            </h2>
          </div>

          <div className="divide-y divide-[#0D0D0D]/10 border-y border-[#0D0D0D]/10 lg:col-span-8">
            {education.map((edu) => {
              const isOpen = openId === edu.id;
              return (
                <div key={edu.id}>
                  <button
                    type="button"
                    onClick={() => toggleRow(edu.id)}
                    aria-expanded={isOpen}
                    data-cursor="pointer"
                    className="group flex w-full cursor-pointer flex-col gap-2 py-5 text-left transition-colors hover:bg-[#FAF9F6]/70 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-sm font-medium text-[#0D0D0D] transition-transform duration-500 ease-spring-out group-hover:translate-x-1 sm:text-[15px]">
                          {pickText(edu.degree, locale)}
                        </span>
                        <span className="text-xs text-[#73726C]">
                          · {edu.institution}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-5 sm:justify-end">
                      <span className="font-mono text-[11px] text-[#73726C] tabular-nums">
                        {pickText(edu.period, locale)}
                      </span>
                      <Plus
                        aria-hidden="true"
                        className={cn(
                          "h-3.5 w-3.5 text-[#73726C] transition-transform duration-500 ease-spring-out group-hover:text-[#0D0D0D]",
                          isOpen && "rotate-45 text-[#0D0D0D]"
                        )}
                      />
                    </div>
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-spring-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pt-1 text-xs leading-relaxed text-[#73726C] sm:px-2 sm:text-[13px]">
                        {pickText(edu.focus, locale)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
