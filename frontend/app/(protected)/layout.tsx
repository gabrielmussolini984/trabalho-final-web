import Image from 'next/image';
import Link from 'next/link';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between border-b border-amber-500/30 bg-zinc-900 px-6 py-4">
        <span className="flex items-center gap-2 text-xl font-bold tracking-wide text-amber-400">
          <Image src="/tibia-logo.png" alt="Tibia" width={28} height={28} className="h-7 w-7 object-contain" />
          HUNT DEX
        </span>
        <Link
          href="/logout"
          className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
        >
          Sair
        </Link>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
