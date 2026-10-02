# language: es
@cart
Característica: Carrito de compras
  Como cliente de Sauce Demo
  Quiero agregar productos al carrito
  Para revisarlos antes de comprarlos

  Antecedentes:
    Dado que el usuario inició sesión como "standard_user"

  @smoke
  Escenario: Agregar un producto al carrito desde la página de productos
    Cuando agrega el producto "Sauce Labs Backpack" al carrito
    Entonces el ícono del carrito debería mostrar 1 producto
    Y el producto "Sauce Labs Backpack" debería figurar como agregado

  Escenario: Ver en el carrito los productos agregados
    Cuando agrega los siguientes productos al carrito:
      | producto                 |
      | Sauce Labs Backpack      |
      | Sauce Labs Bike Light    |
      | Sauce Labs Fleece Jacket |
    Y abre el carrito de compras
    Entonces el carrito debería contener exactamente los productos agregados
    Y el ícono del carrito debería mostrar 3 productos

  Escenario: Eliminar un producto desde el carrito
    Dado que agregó los siguientes productos al carrito:
      | producto              |
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
    Y abre el carrito de compras
    Cuando elimina el producto "Sauce Labs Backpack" del carrito
    Entonces el carrito debería contener solo:
      | producto              |
      | Sauce Labs Bike Light |
    Y el ícono del carrito debería mostrar 1 producto
