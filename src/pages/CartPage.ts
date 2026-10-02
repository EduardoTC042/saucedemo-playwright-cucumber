import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  protected readonly path = '/cart.html';

  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async getProductNames(): Promise<string[]> {
    return this.itemNames.allInnerTexts();
  }

  async removeProduct(productName: string): Promise<void> {
    await this.cartItems
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async expectToBeOpen(): Promise<void> {
    await super.expectToBeOpen();
    await expect(this.title).toHaveText('Your Cart');
  }
}
