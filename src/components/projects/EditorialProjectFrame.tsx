import type { ProjectItem } from "@/types/portfolio";
import { cn } from "@/lib/cn";

interface EditorialProjectFrameProps {
  project: ProjectItem;
  className?: string;
  compact?: boolean;
}

/**
 * 5 Bespoke Minimalist Monochrome/Editorial Studio UI Mockups (ZERO neon, ZERO cyber clutter).
 * Mendukung `project.coverImage` secara otomatis jika di Fase 2 diisi screenshot asli via Admin Panel.
 */
export function EditorialProjectFrame({
  project,
  className,
  compact = false,
}: EditorialProjectFrameProps) {
  if (project.coverImage) {
    return (
      <div
        className={cn(
          "relative h-full w-full overflow-hidden bg-[#EAE8E1]",
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.coverImage}
          alt={project.title}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: project.tone.surface }}
      className={cn(
        "relative flex h-full w-full flex-col justify-between overflow-hidden p-5 text-[#0D0D0D] select-none sm:p-7",
        compact && "p-4 sm:p-5",
        className
      )}
    >
      {/* Subtle Paper Inner Frame */}
      <div className="relative flex h-full w-full flex-col overflow-hidden border border-[#0D0D0D]/10 bg-[#FAF9F6] shadow-[0_18px_45px_-28px_rgba(13,13,13,0.32)]">
        {/* Minimalist Browser Hairline Chrome */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#0D0D0D]/8 px-3.5 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0D0D0D]/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#0D0D0D]/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#0D0D0D]/20" />
          </div>
          <span className="font-mono text-[8px] tracking-[0.14em] text-[#73726C] uppercase">
            {project.slug}.danucs.com
          </span>
          <span className="font-mono text-[8px] text-[#A6A59E]">
            0{project.order}
          </span>
        </div>

        {/* Bespoke Variant Interior */}
        <div className="relative flex-1 overflow-hidden">
          {project.mockupVariant === "aether-ai" && (
            <AetherEditorialUi compact={compact} />
          )}
          {project.mockupVariant === "veloce-commerce" && (
            <VeloceEditorialUi compact={compact} />
          )}
          {project.mockupVariant === "nusantara-cloud" && (
            <NusantaraEditorialUi compact={compact} />
          )}
          {project.mockupVariant === "kinetix-studio" && (
            <KinetixEditorialUi compact={compact} />
          )}
          {project.mockupVariant === "finpulse-treasury" && (
            <FinPulseEditorialUi compact={compact} />
          )}
        </div>
      </div>
    </div>
  );
}

function AetherEditorialUi({ compact }: { compact: boolean }) {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-[#0D0D0D] p-4 text-[#F5F4F0] sm:p-5">
      <div className="flex items-center justify-between border-b border-[#F5F4F0]/10 pb-2.5">
        <span className="font-mono text-[9px] tracking-[0.16em] text-[#A6A59E] uppercase">
          Aether Pipeline · Live
        </span>
        <span className="font-mono text-[9px] text-[#F5F4F0]">82ms</span>
      </div>

      {/* Architectural Node Pipeline */}
      <div className="my-auto flex items-center justify-between gap-2 py-3">
        {["Prompt", "Router", "Webhook"].map((node, idx) => (
          <div key={node} className="flex flex-1 items-center gap-2">
            <div className="flex-1 border border-[#F5F4F0]/18 bg-[#151515] px-2.5 py-2.5">
              <span className="block font-mono text-[7px] text-[#73726C]">
                0{idx + 1}
              </span>
              <span
                className={cn(
                  "mt-1 block font-medium text-[#F5F4F0]",
                  compact ? "text-[9px]" : "text-[11px]"
                )}
              >
                {node}
              </span>
            </div>
            {idx < 2 ? (
              <span className="h-[1px] w-3 shrink-0 bg-[#F5F4F0]/35" />
            ) : null}
          </div>
        ))}
      </div>

      {/* Quiet Waveform Bars */}
      <div className="flex h-8 items-end gap-1 border-t border-[#F5F4F0]/10 pt-2.5">
        {[28, 44, 36, 62, 54, 78, 66, 84, 72, 92, 68, 76, 88, 60].map(
          (h, idx) => (
            <span
              key={idx}
              style={{ height: `${h}%` }}
              className="flex-1 bg-[#F5F4F0]/30"
            />
          )
        )}
      </div>
    </div>
  );
}

function VeloceEditorialUi({ compact }: { compact: boolean }) {
  return (
    <div className="grid h-full w-full grid-cols-12 bg-[#FAF9F6] text-[#0D0D0D]">
      <div className="col-span-6 flex flex-col justify-between border-r border-[#0D0D0D]/8 p-4 sm:p-5">
        <span className="font-mono text-[8px] tracking-[0.18em] text-[#73726C] uppercase">
          Atelier · 02
        </span>
        <div>
          <p
            className={cn(
              "font-editorial-serif italic leading-[0.95] text-[#0D0D0D]",
              compact ? "text-xl" : "text-3xl"
            )}
          >
            Monolith
            <br />
            Series IV
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0D0D0D]" />
            <span className="h-2.5 w-2.5 rounded-full border border-[#0D0D0D]/25 bg-[#CFCBC2]" />
            <span className="h-2.5 w-2.5 rounded-full border border-[#0D0D0D]/25 bg-[#F5F4F0]" />
          </div>
        </div>
        <span className="inline-block w-fit border-b border-[#0D0D0D] pb-0.5 font-mono text-[8px] uppercase">
          Configure 3D
        </span>
      </div>

      {/* Sculptural Monochrome Object Stage */}
      <div className="col-span-6 flex items-center justify-center bg-[#ECEAE4] p-4">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#0D0D0D]/12 bg-gradient-to-br from-[#FAF9F6] via-[#D8D5CC] to-[#262624] shadow-[0_18px_28px_-14px_rgba(13,13,13,0.45)] sm:h-28 sm:w-28">
          <div className="h-10 w-10 rounded-full border border-[#FAF9F6]/50" />
        </div>
      </div>
    </div>
  );
}

function NusantaraEditorialUi({ compact }: { compact: boolean }) {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-[#FAF9F6] p-4 text-[#0D0D0D] sm:p-5">
      <div className="flex items-baseline justify-between border-b border-[#0D0D0D]/10 pb-2.5">
        <span className="font-mono text-[9px] tracking-[0.16em] uppercase">
          Cluster · Jakarta-01
        </span>
        <span className="font-mono text-[9px] text-[#73726C]">24 / 24 UP</span>
      </div>

      <div className="my-auto grid grid-cols-3 gap-2 py-2.5">
        {[
          { k: "CPU", v: "18%" },
          { k: "MEM", v: "41%" },
          { k: "LAT", v: "11ms" },
        ].map((item) => (
          <div
            key={item.k}
            className="border border-[#0D0D0D]/10 bg-[#F5F4F0] p-2.5"
          >
            <span className="block font-mono text-[7px] text-[#73726C]">
              {item.k}
            </span>
            <span
              className={cn(
                "mt-1 block font-medium tabular-nums",
                compact ? "text-xs" : "text-base"
              )}
            >
              {item.v}
            </span>
          </div>
        ))}
      </div>

      {/* Crisp Monochrome Release Strip */}
      <div className="space-y-1.5 border-t border-[#0D0D0D]/10 pt-2.5 font-mono text-[8px] text-[#73726C]">
        <div className="flex justify-between">
          <span className="text-[#0D0D0D]">release-v2.14.0</span>
          <span>DEPLOYED · 9s</span>
        </div>
        <div className="h-[2px] w-full bg-[#0D0D0D]/10">
          <div className="h-full w-4/5 bg-[#0D0D0D]" />
        </div>
      </div>
    </div>
  );
}

function KinetixEditorialUi({ compact }: { compact: boolean }) {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-[#0D0D0D] p-4 text-[#F5F4F0] sm:p-6">
      <div className="flex items-center justify-between font-mono text-[8px] tracking-[0.18em] text-[#A6A59E] uppercase">
        <span>Kinetix</span>
        <span>Issue 04</span>
      </div>

      <div className="my-auto space-y-2 py-2">
        <p
          className={cn(
            "font-medium leading-[0.9] tracking-[-0.04em] text-[#F5F4F0]",
            compact ? "text-2xl" : "text-4xl"
          )}
        >
          MOTION
        </p>
        <div className="h-[1px] w-full bg-[#F5F4F0]/20" />
        <p
          className={cn(
            "text-right font-editorial-serif italic leading-[0.95] text-[#F5F4F0]/85",
            compact ? "text-2xl" : "text-4xl"
          )}
        >
          in stillness.
        </p>
      </div>

      <div className="flex items-center justify-between font-mono text-[8px] text-[#73726C]">
        <span>60 FPS · SSR</span>
        <span>EXPLORE →</span>
      </div>
    </div>
  );
}

function FinPulseEditorialUi({ compact }: { compact: boolean }) {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-[#FAF9F6] p-4 text-[#0D0D0D] sm:p-5">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[8px] tracking-[0.16em] text-[#73726C] uppercase">
          Treasury Balance
        </span>
        <span className="font-mono text-[8px] text-[#0D0D0D]">ACID 100%</span>
      </div>

      <div className="my-auto py-2">
        <p
          className={cn(
            "font-medium tracking-[-0.04em] tabular-nums",
            compact ? "text-xl" : "text-3xl"
          )}
        >
          $482,910.00
        </p>
        <div className="mt-3 flex h-10 items-end gap-1.5">
          {[35, 48, 42, 64, 58, 82, 74, 96].map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className={cn(
                "flex-1",
                i === 7 ? "bg-[#0D0D0D]" : "bg-[#0D0D0D]/15"
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#0D0D0D]/10 pt-2 font-mono text-[8px] text-[#73726C]">
        <span>INV-2026-084 · SETTLED</span>
        <span className="text-[#0D0D0D]">+$14,200</span>
      </div>
    </div>
  );
}
