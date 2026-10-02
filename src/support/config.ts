/**
 * Configuración centralizada, sobreescribible con variables de entorno.
 */
export const config = {
  baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
  browser: (process.env.BROWSER ?? 'chromium') as 'chromium' | 'firefox' | 'webkit',
  headless: process.env.HEADLESS !== 'false',
  slowMo: Number(process.env.SLOW_MO ?? 0),
  defaultTimeout: Number(process.env.DEFAULT_TIMEOUT ?? 15_000),
  viewport: { width: 1366, height: 768 },
} as const;
