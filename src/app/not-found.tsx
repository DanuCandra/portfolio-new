import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F5F4F0] px-6 text-center text-[#0D0D0D]">
      <p className="text-xs tracking-[0.2em] text-[#73726C] uppercase">404</p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
        Page not found.
      </h1>
      <Link
        href="/"
        className="mt-8 border-b border-[#0D0D0D] pb-1 text-sm text-[#0D0D0D] transition-opacity hover:opacity-60"
      >
        Return home
      </Link>
    </main>
  );
}
