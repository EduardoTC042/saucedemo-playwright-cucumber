import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

/**
 * World personalizado: contexto aislado por escenario.
 * Expone los Page Objects de forma perezosa (lazy) para que los steps
 * no tengan que instanciarlos manualmente.
 */
export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  /** Estado compartido entre steps del mismo escenario. */
  scenarioData: { addedProducts: string[] } = { addedProducts: [] };

  private pages = new Map<string, unknown>();

  constructor(options: IWorldOptions) {
    super(options);
  }

  private getPage<T>(key: string, factory: () => T): T {
    if (!this.pages.has(key)) this.pages.set(key, factory());
    return this.pages.get(key) as T;
  }

  get loginPage() { return this.getPage('login', () => new LoginPage(this.page)); }
  get inventoryPage() { return this.getPage('inventory', () => new InventoryPage(this.page)); }
  get cartPage() { return this.getPage('cart', () => new CartPage(this.page)); }
  get checkoutInformationPage() { return this.getPage('checkoutInfo', () => new CheckoutInformationPage(this.page)); }
  get checkoutOverviewPage() { return this.getPage('checkoutOverview', () => new CheckoutOverviewPage(this.page)); }
  get checkoutCompletePage() { return this.getPage('checkoutComplete', () => new CheckoutCompletePage(this.page)); }
}

setWorldConstructor(CustomWorld);
