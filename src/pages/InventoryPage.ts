import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';

  readonly inventoryItems: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.getByTestId('inventory-item');
  }

  /** Tarjeta de producto localizada por su nombre visible (independiente del id interno). */
  private productCard(productName: string): Locator {
    return this.inventoryItems.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(productName, { exact: true }),
    });
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async expectProductMarkedAsAdded(productName: string): Promise<void> {
    await expect(this.productCard(productName).getByRole('button', { name: 'Remove' })).toBeVisible();
  }

  async expectToBeOpen(): Promise<void> {
    await super.expectToBeOpen();
    await expect(this.title).toHaveText('Products');
  }
}
