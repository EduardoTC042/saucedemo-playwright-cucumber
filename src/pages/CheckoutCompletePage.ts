import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/** Confirmación final de la compra. */
export class CheckoutCompletePage extends BasePage {
  protected readonly path = '/checkout-complete.html';

  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async expectToBeOpen(): Promise<void> {
    await super.expectToBeOpen();
    await expect(this.title).toHaveText('Checkout: Complete!');
  }
}
