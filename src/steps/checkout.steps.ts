import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('inicia el checkout', async function (this: CustomWorld) {
  await this.cartPage.proceedToCheckout();
  await this.checkoutInformationPage.expectToBeOpen();
});

When(
  'completa sus datos con nombre {string}, apellido {string} y código postal {string}',
  async function (this: CustomWorld, firstName: string, lastName: string, postalCode: string) {
    await this.checkoutInformationPage.fillInformation({ firstName, lastName, postalCode });
  },
);

When('continúa al resumen de la compra', async function (this: CustomWorld) {
  await this.checkoutInformationPage.continue();
});

When('finaliza la compra', async function (this: CustomWorld) {
  await this.checkoutOverviewPage.finish();
});

Then('el resumen debería listar los productos agregados', async function (this: CustomWorld) {
  await this.checkoutOverviewPage.expectToBeOpen();
  await expect(this.checkoutOverviewPage.itemNames).toHaveText(this.scenarioData.addedProducts);
});

Then('el subtotal debería ser la suma de los precios de los productos', async function (this: CustomWorld) {
  const expected = await this.checkoutOverviewPage.getItemPricesSum();
  const subtotal = await this.checkoutOverviewPage.getSubtotal();
  expect(subtotal).toBeCloseTo(expected, 2);
});

Then('el total debería ser el subtotal más impuestos', async function (this: CustomWorld) {
  const subtotal = await this.checkoutOverviewPage.getSubtotal();
  const tax = await this.checkoutOverviewPage.getTax();
  const total = await this.checkoutOverviewPage.getTotal();
  expect(tax).toBeGreaterThan(0);
  expect(total).toBeCloseTo(subtotal + tax, 2);
});

Then('debería ver la confirmación {string}', async function (this: CustomWorld, header: string) {
  await this.checkoutCompletePage.expectToBeOpen();
  await expect(this.checkoutCompletePage.completeHeader).toHaveText(header);
});

Then('debería ver el error de checkout {string}', async function (this: CustomWorld, message: string) {
  await expect(this.checkoutInformationPage.errorMessage).toHaveText(message);
  await this.checkoutInformationPage.expectToBeOpen();
});
