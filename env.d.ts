/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AMAP_KEY: string;
    readonly VITE_APP_SECRET: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module "element-plus/dist/locale/zh-cn.mjs" {
    const locale: { name: string; [key: string]: unknown };
    export default locale;
}

interface Window {
    _AMapSecurityConfig: {
        [key: string]: any;
    }
}