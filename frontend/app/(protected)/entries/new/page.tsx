'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { CreatureSummary, Difficulty } from '@/lib/types';
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

export default function NewEntryPage() {
  const router = useRouter();
  const [creatures, setCreatures] = useState<CreatureSummary[]>([]);
  const [creatureName, setCreatureName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [observedLoot, setObservedLoot] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch<CreatureSummary[]>('/tibia/creatures')
      .then((list) => {
        setCreatures(list);
        if (list.length > 0) setCreatureName(list[0].race);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Erro inesperado'));
  }, []);

  const selectedCreature = creatures.find((c) => c.race === creatureName);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch('/bestiary', {
        method: 'POST',
        body: JSON.stringify({ creatureName, difficulty, observedLoot, notes }),
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro inesperado');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-amber-400">Adicionar criatura ao seu bestiário</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select label="Criatura" name="creatureName" value={creatureName} onChange={(e) => setCreatureName(e.target.value)}>
          {creatures.map((creature) => (
            <option key={creature.race} value={creature.race}>
              {creature.name}
            </option>
          ))}
        </Select>
        {selectedCreature?.imageUrl && (
          <img
            src={selectedCreature.imageUrl}
            alt={selectedCreature.name}
            className="h-16 w-16 self-center object-contain"
          />
        )}
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
