import { Difficulty } from '@/lib/types';

const DIFFICULTY_CLASSES: Record<Difficulty, string> = {
  trivial: 'bg-zinc-700 text-zinc-200',
  easy: 'bg-emerald-600 text-emerald-50',
  medium: 'bg-amber-600 text-amber-50',
  hard: 'bg-orange-600 text-orange-50',
  lethal: 'bg-red-600 text-red-50',
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  trivial: 'Trivial',
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
  lethal: 'Letal',
};

export function Badge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${DIFFICULTY_CLASSES[difficulty]}`}
    >
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}
