import { getRuntimeEnv } from "./runtime-env";
import type {
  PublicSalonInfo,
  PublicSalonService,
  PublicSalonSlotsResponse,
} from "@/types/salon";

export function normalizeApiBaseUrl(raw: string): string {
  let url = raw.trim();
  if (!url) return "";

  url = url.replace(/^(https?)(\/\/)(?!\/)/i, "$1://");
  url = url.replace(/^(https?):\/{3,}/i, "$1://");

  while (/^(https?:\/\/)(https?:\/\/)/i.test(url)) {
    url = url.replace(/^(https?:\/\/)(https?:\/\/)/i, "$2");
  }

  url = url.replace(/^https:\/\/https\/\//i, "https://");
  url = url.replace(/^http:\/\/http\/\//i, "http://");

  return url.replace(/\/+$/, "");
}

function resolveApiBase(): string {
  const runtime = getRuntimeEnv();
  const raw =
    runtime.VITE_API_URL?.trim() ||
    runtime.VITE_API_BASE_URL?.trim() ||
    import.meta.env.VITE_API_URL?.trim() ||
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    "";
  return normalizeApiBaseUrl(raw);
}

function resolveSlug(): string {
  return (
    getRuntimeEnv().VITE_SALON_SLUG?.trim() ||
    import.meta.env.VITE_SALON_SLUG?.trim() ||
    "gilei"
  );
}

function resolveEnrollmentKey(): string {
  return (
    getRuntimeEnv().VITE_ENROLLMENT_API_KEY?.trim() ||
    import.meta.env.VITE_ENROLLMENT_API_KEY?.trim() ||
    ""
  );
}

function getApiBase(): string {
  return resolveApiBase();
}

function getSlug(): string {
  return resolveSlug();
}

function getEnrollmentKey(): string {
  return resolveEnrollmentKey();
}

function assertApiConfigured() {
  if (!getApiBase()) {
    throw new Error("VITE_API_URL não configurada.");
  }
}

function enrollmentHeaders(): HeadersInit {
  const headers: Record<string, string> = {};
  const key = getEnrollmentKey();
  if (key) {
    headers["X-Enrollment-Key"] = key;
  }
  return headers;
}

function assertEnrollmentKey() {
  if (!getEnrollmentKey()) {
    throw new Error("VITE_ENROLLMENT_API_KEY não configurada.");
  }
}

async function parseError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const j = JSON.parse(text) as { message?: string | string[] };
    if (Array.isArray(j.message)) return j.message.join(", ");
    if (typeof j.message === "string") return j.message;
  } catch {
    /* ignore */
  }
  return text || `Erro HTTP ${res.status}`;
}

export function getSalonSlug(): string {
  return getSlug();
}

export async function fetchSalonInfo(): Promise<PublicSalonInfo> {
  assertApiConfigured();
  const res = await fetch(`${getApiBase()}/public/salons/${getSlug()}`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchSalonServices(): Promise<{
  items: PublicSalonService[];
}> {
  assertApiConfigured();
  const res = await fetch(`${getApiBase()}/public/salons/${getSlug()}/services`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchSalonSlots(): Promise<PublicSalonSlotsResponse> {
  assertApiConfigured();
  const res = await fetch(`${getApiBase()}/public/salons/${getSlug()}/slots`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function lookupSalonClient(body: {
  phone: string;
  name: string;
}): Promise<{ found: boolean; clientId?: string; message: string }> {
  assertApiConfigured();
  assertEnrollmentKey();
  const res = await fetch(
    `${getApiBase()}/public/salons/${getSlug()}/lookup-client`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...enrollmentHeaders(),
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function bookSalonAppointment(body: {
  phone: string;
  name: string;
  startsAt: string;
  catalogServiceId: string;
  serviceProviderId?: string;
}): Promise<{
  appointment: {
    id: string;
    startsAt: string;
    endsAt: string;
    serviceName: string;
    label: string;
  };
  message: string;
}> {
  assertApiConfigured();
  assertEnrollmentKey();
  const res = await fetch(`${getApiBase()}/public/salons/${getSlug()}/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...enrollmentHeaders(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPhoneMask(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
