import { Locator, Page, expect } from '@playwright/test';

/**
 * Clase base del Page Object Model.
 * Centraliza la navegación y los elementos comunes (header, título, carrito),
 * de modo que cada página concreta solo define lo que le es propio.
 */
export abstract class BasePage {
  /** Ruta relativa a baseURL que identifica la página. */
  protected abstract readonly path: string;

  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(protected readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectToBeOpen(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${this.path.replace('.', '\\.')}$`));
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  /** Cantidad mostrada en el ícono del carrito (0 si no hay badge). */
  async getCartCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) return 0;
    return Number(await this.cartBadge.innerText());
  }
}
