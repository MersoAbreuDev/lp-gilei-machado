export type GmRuntime = {
  VITE_API_URL?: string;
  VITE_API_BASE_URL?: string;
  VITE_SALON_SLUG?: string;
  VITE_ENROLLMENT_API_KEY?: string;
  VITE_WHATSAPP?: string;
  VITE_INSTAGRAM_URL?: string;
};

declare global {
  interface Window {
    __GM_RUNTIME__?: GmRuntime;
  }
}

export function getRuntimeEnv(): GmRuntime {
  if (typeof window === "undefined") return {};
  return window.__GM_RUNTIME__ ?? {};
}

export function getWhatsappDigits(): string {
  return (
    getRuntimeEnv().VITE_WHATSAPP?.trim() ||
    import.meta.env.VITE_WHATSAPP?.trim() ||
    ""
  ).replace(/\D/g, "");
}

export function getInstagramUrl(): string {
  return (
    getRuntimeEnv().VITE_INSTAGRAM_URL?.trim() ||
    import.meta.env.VITE_INSTAGRAM_URL?.trim() ||
    ""
  );
}
