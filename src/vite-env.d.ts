/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string;
  readonly VITE_CONVEX_SITE_URL: string;
  readonly VITE_SITE_URL?: string;
  readonly NEXT_PUBLIC_CONVEX_URL?: string;
  readonly NEXT_PUBLIC_CONVEX_SITE_URL?: string;
  readonly NEXT_PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
