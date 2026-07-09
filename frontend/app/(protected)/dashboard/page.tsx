'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch, ApiError } from '@/lib/api';
import { BestiaryEntry, CreatureSummary } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const [entries, setEntries] = useState<BestiaryEntry[]>([]);
  const [creaturesByRace, setCreaturesByRace] = useState<Record<string, CreatureSummary>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<BestiaryEntry[]>('/bestiary')
      .then(setEntries)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro inesperado'))
      .finally(() => setLoading(false));

    apiFetch<CreatureSummary[]>('/tibia/creatures')
      .then((list) => {
        const map: Record<string, CreatureSummary> = {};
        for (const creature of list) map[creature.race] = creature;
        setCreaturesByRace(map);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro inesperado'));
  }, []);

  function creatureDisplayName(race: string) {
    return creaturesByRace[race]?.name ?? race;
  }

  async function handleDelete(id: string) {
    await apiFetch(`/bestiary/${id}`, { method: 'DELETE' });
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }

  if (loading) return <p className="text-zinc-400">Carregando...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-amber-400">Meu Bestiário</h1>
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-400">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => {
          const creature = creaturesByRace[entry.creatureName];
          return (
            <Card key={entry.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                {creature?.imageUrl && (
                  <img
                    src={creature.imageUrl}
                    alt={creature.name}
                    className="h-16 w-16 flex-shrink-0 rounded-md bg-zinc-800 object-contain p-1"
                  />
                )}
                <div className="flex flex-1 items-center justify-between gap-2">
                  <strong className="text-lg text-zinc-100">{creatureDisplayName(entry.creatureName)}</strong>
                  <Badge difficulty={entry.difficulty} />
                </div>
              </div>
              <p className="truncate text-sm text-zinc-400">Saque: {entry.observedLoot || '—'}</p>
              <p className="truncate text-sm text-zinc-400">Notas: {entry.notes || '—'}</p>
              <div className="mt-2 flex gap-2">
                <Link
                  href={`/entries/${entry.id}/edit`}
                  className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  Editar
                </Link>
                <Button variant="secondary" className="px-3 py-1.5 text-sm" onClick={() => handleDelete(entry.id)}>
                  Excluir
                </Button>
              </div>
            </Card>
          );
        })}
        <Link
          href="/entries/new"
          className="flex min-h-32 items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 text-zinc-400 transition-colors hover:border-amber-400 hover:text-amber-400"
        >
          + Adicionar criatura
        </Link>
      </div>
    </div>
  );
}
