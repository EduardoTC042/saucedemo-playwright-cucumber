import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { getUser } from '../data/users';

Given('que el usuario está en la página de inicio de sesión', async function (this: CustomWorld) {
  await this.loginPage.open();
  await this.loginPage.expectToBeOpen();
});

Given('que el usuario inició sesión como {string}', async function (this: CustomWorld, alias: string) {
  await this.loginPage.open();
  await this.loginPage.loginAs(getUser(alias));
  await this.inventoryPage.expectToBeOpen();
});

When('inicia sesión como {string}', async function (this: CustomWorld, alias: string) {
  await this.loginPage.loginAs(getUser(alias));
});

When(
  'ingresa el usuario {string} y la contraseña {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.login(username, password);
  },
);

When('intenta acceder directamente a la página de productos', async function (this: CustomWorld) {
  await this.inventoryPage.open();
});

Then('debería ver la página de productos', async function (this: CustomWorld) {
  await this.inventoryPage.expectToBeOpen();
  await expect(this.inventoryPage.inventoryItems.first()).toBeVisible();
});

Then('debería ver el mensaje de error {string}', async function (this: CustomWorld, message: string) {
  await expect(this.loginPage.errorMessage).toHaveText(message);
});

Then('debería permanecer en la página de inicio de sesión', async function (this: CustomWorld) {
  await this.loginPage.expectToBeOpen();
  await expect(this.page).not.toHaveURL(/inventory\.html/);
});
