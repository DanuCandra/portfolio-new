import { TransitionLink } from "@/components/motion/PageTransitionProvider";
import { RollingText } from "@/components/motion/RollingText";

export default function NotFound() {
  return (
    <main
      data-surface="paper"
      className="flex min-h-screen flex-col items-center justify-center bg-[#F5F4F0] px-6 text-center text-[#0D0D0D]"
    >
      <p className="font-mono text-[11px] tracking-[0.22em] text-[#73726C] uppercase">
        404
      </p>
      <h1 className="mt-4 font-editorial-serif text-5xl italic tracking-tight sm:text-6xl">
        Page not found.
      </h1>
      <TransitionLink
        href="/"
        curtainLabel="Danu Candra"
        className="group mt-10 pb-1 text-sm text-[#0D0D0D]"
      >
        <RollingText text="Return home" underline />
      </TransitionLink>
    </main>
  );
}
