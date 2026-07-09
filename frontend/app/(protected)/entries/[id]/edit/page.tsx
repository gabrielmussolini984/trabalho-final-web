'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { BestiaryEntry, CreatureSummary, Difficulty } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const DIFFICULTIES: Difficulty[] = ['trivial', 'easy', 'medium', 'hard', 'lethal'];

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  trivial: 'Muito fácil',
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
  lethal: 'Muito difícil',
};

export default function EditEntryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [creatureName, setCreatureName] = useState('');
  const [creaturesByRace, setCreaturesByRace] = useState<Record<string, CreatureSummary>>({});
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [observedLoot, setObservedLoot] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch<BestiaryEntry[]>('/bestiary')
      .then((entries) => {
        const entry = entries.find((e) => e.id === params.id);
        if (entry) {
          setCreatureName(entry.creatureName);
          setDifficulty(entry.difficulty);
          setObservedLoot(entry.observedLoot);
          setNotes(entry.notes);
        }
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro inesperado'))
      .finally(() => setLoading(false));

    apiFetch<CreatureSummary[]>('/tibia/creatures')
      .then((list) => {
        const map: Record<string, CreatureSummary> = {};
        for (const creature of list) map[creature.race] = creature;
        setCreaturesByRace(map);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro inesperado'));
  }, [params.id]);

  const selectedCreature = creaturesByRace[creatureName];
  const creatureDisplayName = selectedCreature?.name ?? creatureName;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch(`/bestiary/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ difficulty, observedLoot, notes }),
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro inesperado');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-zinc-400">Carregando...</p>;

  return (
    <Card className="mx-auto max-w-lg">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-amber-400">
        {selectedCreature?.imageUrl && (
          <img src={selectedCreature.imageUrl} alt={creatureDisplayName} className="h-8 w-8 object-contain" />
        )}
        Editar {creatureDisplayName}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          label="Dificuldade"
          name="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
        >
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {DIFFICULTY_LABELS[d]}
            </option>
          ))}
        </Select>
        <Textarea
          label="Loot observado"
          name="observedLoot"
          value={observedLoot}
          onChange={(e) => setObservedLoot(e.target.value)}
        />
        <Textarea label="Notas" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push('/dashboard')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
