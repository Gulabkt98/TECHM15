/** Thin fetch wrapper for the LexGuard backend.
 *
 * Unwraps the backend's {success, message, data} envelope and throws
 * ApiError with the HTTP status — the services layer catches 501/network
 * failures and falls back to demo data so the UI never dead-ends.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("lexguard-auth");
    const token = raw ? (JSON.parse(raw).state?.token as string | undefined) : undefined;
    return token && token !== "demo-token" ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, body?.detail ?? response.statusText);
  }
  // Unwrap the backend envelope when present.
  return (body && typeof body === "object" && "data" in body ? body.data : body) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, payload?: unknown) =>
    request<T>(path, {
      method: "POST",
      headers: payload instanceof FormData ? {} : { "Content-Type": "application/json" },
      body: payload instanceof FormData ? payload : JSON.stringify(payload ?? {}),
    }),
};

/** Try the real endpoint; fall back to demo data on 501 / network failure.
 *  Returns which source served the data so the UI can show a Demo badge. */
export async function withFallback<T>(call: () => Promise<T>, mock: T): Promise<{ data: T; demo: boolean }> {
  try {
    return { data: await call(), demo: false };
  } catch {
    return { data: mock, demo: true };
  }
}
