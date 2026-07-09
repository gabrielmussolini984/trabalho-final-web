'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    apiFetch('/auth/logout', { method: 'POST' }).finally(() => router.push('/login'));
  }, [router]);

  return <main>Saindo...</main>;
}
