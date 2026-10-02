import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Paso 1 del checkout: datos del comprador. */
export class CheckoutInformationPage extends BasePage {
  protected readonly path = '/checkout-step-one.html';

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.errorMessage = page.getByTestId('error');
  }

  async fillInformation(info: Partial<CustomerInfo>): Promise<void> {
    if (info.firstName) await this.firstNameInput.fill(info.firstName);
    if (info.lastName) await this.lastNameInput.fill(info.lastName);
    if (info.postalCode) await this.postalCodeInput.fill(info.postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async expectToBeOpen(): Promise<void> {
    await super.expectToBeOpen();
    await expect(this.title).toHaveText('Checkout: Your Information');
  }
}
