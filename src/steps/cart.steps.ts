import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/** Extrae la columna "producto" de una tabla Gherkin. */
const productsFrom = (table: DataTable): string[] => table.hashes().map((row) => row.producto);

async function addProducts(world: CustomWorld, products: string[]): Promise<void> {
  for (const product of products) {
    await world.inventoryPage.addProductToCart(product);
    world.scenarioData.addedProducts.push(product);
  }
}

Given('que agregó el producto {string} al carrito', async function (this: CustomWorld, product: string) {
  await addProducts(this, [product]);
});

Given('que agregó los siguientes productos al carrito:', async function (this: CustomWorld, table: DataTable) {
  await addProducts(this, productsFrom(table));
});

When('agrega el producto {string} al carrito', async function (this: CustomWorld, product: string) {
  await addProducts(this, [product]);
});

When('agrega los siguientes productos al carrito:', async function (this: CustomWorld, table: DataTable) {
  await addProducts(this, productsFrom(table));
});

When('abre el carrito de compras', async function (this: CustomWorld) {
  await this.inventoryPage.goToCart();
  await this.cartPage.expectToBeOpen();
});

When('elimina el producto {string} del carrito', async function (this: CustomWorld, product: string) {
  await this.cartPage.removeProduct(product);
  this.scenarioData.addedProducts = this.scenarioData.addedProducts.filter((p) => p !== product);
});

Then('el ícono del carrito debería mostrar {int} producto(s)', async function (this: CustomWorld, count: number) {
  await expect(this.inventoryPage.cartBadge).toHaveText(String(count));
});

Then('el producto {string} debería figurar como agregado', async function (this: CustomWorld, product: string) {
  await this.inventoryPage.expectProductMarkedAsAdded(product);
});

Then('el carrito debería contener exactamente los productos agregados', async function (this: CustomWorld) {
  await expect(this.cartPage.itemNames).toHaveText(this.scenarioData.addedProducts);
});

Then('el carrito debería contener solo:', async function (this: CustomWorld, table: DataTable) {
  await expect(this.cartPage.itemNames).toHaveText(productsFrom(table));
});

Then('el carrito debería quedar vacío', async function (this: CustomWorld) {
  await expect(this.cartPage.cartBadge).toBeHidden();
});
