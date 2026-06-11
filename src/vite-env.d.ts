/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_SALON_SLUG?: string;
  readonly VITE_ENROLLMENT_API_KEY?: string;
  readonly VITE_WHATSAPP?: string;
  readonly VITE_INSTAGRAM_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
