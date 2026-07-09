export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = body?.message ?? 'Unexpected error';
    throw new ApiError(response.status, Array.isArray(message) ? message.join(', ') : message);
  }

  return body as T;
}
