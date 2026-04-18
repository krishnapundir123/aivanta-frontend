/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_USE_DUMMY_DATA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
