import { After, AfterAll, Before, BeforeAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium, firefox, selectors, webkit } from '@playwright/test';
import { config } from './config';
import { CustomWorld } from './world';

const browserTypes = { chromium, firefox, webkit };
let browser: Browser;

// Timeout de cada step de Cucumber (debe ser mayor que el de Playwright).
setDefaultTimeout(config.defaultTimeout * 4);

BeforeAll(async function () {
  // Sauce Demo usa el atributo `data-test` (no `data-testid`) en sus elementos.
  selectors.setTestIdAttribute('data-test');
  browser = await browserTypes[config.browser].launch({
    headless: config.headless,
    slowMo: config.slowMo,
  });
});

Before(async function (this: CustomWorld) {
  // Un BrowserContext nuevo por escenario => cookies/localStorage aislados.
  this.browser = browser;
  this.context = await browser.newContext({
    baseURL: config.baseUrl,
    viewport: config.viewport,
  });
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(config.defaultTimeout);
});

After(async function (this: CustomWorld, { result, pickle }) {
  if (result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
    this.attach(`URL al fallar: ${this.page.url()}`, 'text/plain');
    this.log?.(`Escenario fallido: ${pickle.name}`);
  }
  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});
