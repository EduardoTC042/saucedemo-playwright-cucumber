import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/** Paso 2 del checkout: resumen de la orden y totales. */
export class CheckoutOverviewPage extends BasePage {
  protected readonly path = '/checkout-step-two.html';

  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
  }

  private static parseAmount(text: string): number {
    const match = text.match(/\$(\d+(?:\.\d+)?)/);
    if (!match) throw new Error(`No se encontró un monto en "${text}"`);
    return Number(match[1]);
  }

  async getProductNames(): Promise<string[]> {
    return this.itemNames.allInnerTexts();
  }

  async getItemPricesSum(): Promise<number> {
    const prices = await this.itemPrices.allInnerTexts();
    return prices.reduce((acc, p) => acc + CheckoutOverviewPage.parseAmount(p), 0);
  }

  async getSubtotal(): Promise<number> {
    return CheckoutOverviewPage.parseAmount(await this.subtotalLabel.innerText());
  }

  async getTax(): Promise<number> {
    return CheckoutOverviewPage.parseAmount(await this.taxLabel.innerText());
  }

  async getTotal(): Promise<number> {
    return CheckoutOverviewPage.parseAmount(await this.totalLabel.innerText());
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async expectToBeOpen(): Promise<void> {
    await super.expectToBeOpen();
    await expect(this.title).toHaveText('Checkout: Overview');
  }
}
