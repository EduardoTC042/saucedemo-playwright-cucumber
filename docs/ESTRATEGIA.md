# Informe: Estrategia de automatización y patrones utilizados

## 1. Alcance y enfoque

El objetivo es validar de punta a punta la historia de usuario *“iniciar sesión → agregar productos → completar la compra”* en Sauce Demo. Se eligió un enfoque **BDD (Behavior-Driven Development)**: los criterios de aceptación se expresan como escenarios Gherkin en **español**, legibles para negocio, QA y desarrollo, y cada escenario es a la vez documentación viva y prueba ejecutable.

Los escenarios se organizan por **capacidad funcional** (una feature por área) en lugar de por pantalla:

| Feature | Positivos | Negativos | Usuarios |
|---|---|---|---|
| `login.feature` | Login exitoso | Usuario bloqueado, 4 combinaciones de credenciales inválidas, acceso directo sin sesión | `standard_user`, `locked_out_user`, credenciales inválidas |
| `cart.feature` | Agregar 1 producto, agregar varios y verlos en el carrito, eliminar del carrito | — | `standard_user` |
| `checkout.feature` | Compra completa de 1 producto, compra de varios productos con validación de totales | 3 validaciones de campos obligatorios | `standard_user` |

**Técnicas de diseño de pruebas aplicadas:**

- **Camino feliz + negativos**: cada criterio de aceptación tiene al menos un escenario positivo y, donde aplica, negativos.
- **Particiones de equivalencia** en login (contraseña incorrecta, usuario inexistente, usuario vacío, contraseña vacía) y en checkout (cada campo obligatorio vacío), implementadas con `Esquema del escenario` + `Ejemplos` para evitar duplicación.
- **Validación de reglas de negocio**, no solo de navegación: el subtotal debe ser la suma de los precios y el total = subtotal + impuestos.
- **Prueba de seguridad básica**: acceso a `/inventory.html` sin sesión debe ser rechazado.

**Tags** para ejecución selectiva: `@smoke` (regresión rápida del flujo crítico), `@login`, `@cart`, `@checkout`, `@e2e`, `@negativo`, `@positivo`, `@locked_out_user`, `@seguridad`.

## 2. Arquitectura en capas

```
Feature (Gherkin)  →  Step definitions  →  Page Objects  →  Playwright
   “qué”                 “traducción”         “cómo”          “motor”
```

1. **Features**: describen comportamiento sin detalles técnicos (sin selectores, sin URLs, sin contraseñas — los usuarios se referencian por alias).
2. **Steps**: delgados; solo traducen la frase Gherkin a llamadas a Page Objects y aserciones. No contienen selectores.
3. **Page Objects**: encapsulan selectores y acciones de cada pantalla.
4. **Support**: configuración, ciclo de vida del navegador y estado por escenario.

Esta separación hace que un cambio de UI se corrija en **un solo lugar** (el Page Object) sin tocar features ni steps.

## 3. Patrones de diseño

### 3.1 Page Object Model (patrón principal)

- `BasePage` (clase **abstracta**) concentra lo común a todas las pantallas autenticadas: título, enlace y badge del carrito, `open()` y `expectToBeOpen()`. Las páginas concretas **heredan** y solo declaran su `path` y sus elementos propios (*Template Method*: `expectToBeOpen()` se especializa en cada página validando además su título).
- Un Page Object por pantalla del flujo: `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutInformationPage`, `CheckoutOverviewPage`, `CheckoutCompletePage`.
- Los métodos expresan **intención de negocio** (`addProductToCart('Sauce Labs Backpack')`, `proceedToCheckout()`, `getTotal()`), no interacciones técnicas.

### 3.2 World de Cucumber como *Context Object* + *Lazy Factory*

`CustomWorld` es el contexto de cada escenario: guarda `page`, `context` y un `scenarioData` compartido entre steps (p. ej. los productos agregados, que luego se comparan contra el carrito y el resumen). Los Page Objects se exponen como *getters* que los crean **bajo demanda** y los reutilizan dentro del escenario, de modo que los steps nunca hacen `new XxxPage(...)`.

### 3.3 Externalización de datos y configuración

- `src/data/users.ts`: catálogo de usuarios por alias; si se pide un alias inexistente el error indica cuáles hay.
- `src/support/config.ts`: URL, navegador, headless, timeouts, paralelismo y reintentos configurables por variables de entorno, sin tocar código.

## 4. Decisiones técnicas para robustez

| Decisión | Motivo |
|---|---|
| Selectores por atributo `data-test` (`selectors.setTestIdAttribute('data-test')` + `getByTestId`) | Son los atributos estables que la propia app expone para pruebas; no dependen de clases CSS ni de la estructura del DOM. |
| Productos localizados por **nombre visible** (filtro de la tarjeta por `inventory-item-name`) y botones por **rol accesible** (`getByRole('button', { name: 'Add to cart' })`) | El step usa el mismo nombre que ve el usuario, y no depende de IDs internos. |
| Aserciones *web-first* de Playwright (`toHaveText`, `toHaveURL`, `toBeVisible`) | Reintentan automáticamente hasta el timeout: **cero `sleep`/esperas fijas**, menos flakiness. |
| Un `BrowserContext` nuevo por escenario, un navegador por worker | Aislamiento total (cookies, storage, carrito) con bajo costo de arranque; permite ejecución **en paralelo**. |
| Screenshot de página completa + URL adjuntos al reporte en fallos | Diagnóstico rápido sin reejecutar. |
| TypeScript en modo `strict` | Errores detectados antes de ejecutar; autocompletado de Page Objects en los steps. |
| Reportes HTML y JSON + GitHub Actions | Evidencia de ejecución y regresión automática en cada push/PR. |

## 5. Posibles extensiones

- Cubrir el resto de usuarios de Sauce Demo (`problem_user`, `performance_glitch_user`, `error_user`, `visual_user`) reutilizando los mismos steps con un `Esquema del escenario`.
- Ordenamiento y filtrado del catálogo, logout y reseteo de estado.
- Login por `storageState` para acelerar escenarios que no prueban el login.
- Ejecución cross-browser en CI con una matriz `chromium / firefox / webkit`.
- Reporte enriquecido (Allure) y pruebas de regresión visual.
