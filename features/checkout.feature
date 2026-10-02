# language: es
@checkout
Característica: Proceso de compra (checkout)
  Como cliente de Sauce Demo
  Quiero completar el proceso de compra
  Para adquirir los productos que necesito

  Antecedentes:
    Dado que el usuario inició sesión como "standard_user"

  @smoke @e2e
  Escenario: Completar la compra de un producto hasta la confirmación
    Dado que agregó el producto "Sauce Labs Backpack" al carrito
    Y abre el carrito de compras
    Cuando inicia el checkout
    Y completa sus datos con nombre "Ana", apellido "Pérez" y código postal "15001"
    Y continúa al resumen de la compra
    Entonces el resumen debería listar los productos agregados
    Cuando finaliza la compra
    Entonces debería ver la confirmación "Thank you for your order!"
    Y el carrito debería quedar vacío

  @e2e
  Escenario: Los totales del resumen se calculan correctamente con varios productos
    Dado que agregó los siguientes productos al carrito:
      | producto                 |
      | Sauce Labs Backpack      |
      | Sauce Labs Bolt T-Shirt  |
      | Sauce Labs Onesie        |
    Y abre el carrito de compras
    Cuando inicia el checkout
    Y completa sus datos con nombre "Luis", apellido "Gómez" y código postal "04001"
    Y continúa al resumen de la compra
    Entonces el resumen debería listar los productos agregados
    Y el subtotal debería ser la suma de los precios de los productos
    Y el total debería ser el subtotal más impuestos
    Cuando finaliza la compra
    Entonces debería ver la confirmación "Thank you for your order!"

  @negativo
  Esquema del escenario: No se puede continuar el checkout sin datos obligatorios (<campo faltante>)
    Dado que agregó el producto "Sauce Labs Backpack" al carrito
    Y abre el carrito de compras
    Cuando inicia el checkout
    Y completa sus datos con nombre "<nombre>", apellido "<apellido>" y código postal "<cp>"
    Y continúa al resumen de la compra
    Entonces debería ver el error de checkout "<mensaje>"

    Ejemplos:
      | campo faltante | nombre | apellido | cp    | mensaje                        |
      | nombre         |        | Pérez    | 15001 | Error: First Name is required  |
      | apellido       | Ana    |          | 15001 | Error: Last Name is required   |
      | código postal  | Ana    | Pérez    |       | Error: Postal Code is required |
