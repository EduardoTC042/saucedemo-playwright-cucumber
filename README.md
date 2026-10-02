# Sauce Demo – Automatización E2E con Playwright + Cucumber

Suite de pruebas automatizadas end-to-end para [Sauce Demo](https://www.saucedemo.com/), escrita en **TypeScript** con **Playwright** como motor de navegador, **Cucumber (Gherkin en español)** para BDD y el patrón **Page Object Model**.

> Informe de estrategia y patrones: [`docs/ESTRATEGIA.md`](docs/ESTRATEGIA.md)

## Historia de usuario cubierta

> Como cliente de Sauce Demo, quiero poder iniciar sesión, agregar productos al carrito y completar una compra, para poder adquirir los productos que necesito.

| # | Criterio de aceptación | Feature / Escenario |
|---|---|---|
| 1 | Inicia sesión con credenciales válidas | `login.feature` → *Inicio de sesión exitoso con un usuario estándar* |
| 2 | No inicia sesión con credenciales inválidas | `login.feature` → *Un usuario bloqueado…*, *Esquema: credenciales inválidas* (4 casos), *acceso sin sesión* |
| 3 | Agrega un producto al carrito | `cart.feature` → *Agregar un producto al carrito desde la página de productos* |
| 4 | Ve los productos agregados en el carrito | `cart.feature` → *Ver en el carrito los productos agregados*, *Eliminar un producto* |
| 5 | Completa la compra hasta la confirmación | `checkout.feature` → *Completar la compra…*, *Totales…*, *Esquema: datos obligatorios* (3 casos) |

Tipos de usuario: `standard_user` (flujos positivos) y `locked_out_user` (acceso denegado).
**Total: 15 escenarios** (contando cada fila de los *Esquemas del escenario*).

## Requisitos

- Node.js **18+** (recomendado 20 LTS)
- npm 9+
- Git

## Instalación

```bash
git clone https://github.com/<tu-usuario>/saucedemo-playwright-cucumber.git
cd saucedemo-playwright-cucumber
npm install
npx playwright install chromium     # en Linux/CI: npx playwright install --with-deps chromium
```

## Ejecución

| Comando | Descripción |
|---|---|
| `npm test` | Ejecuta toda la suite (headless, 2 workers en paralelo) |
| `npm run test:smoke` | Solo escenarios `@smoke` |
| `npm run test:login` | Solo la feature de login |
| `npm run test:cart` | Solo la feature de carrito |
| `npm run test:checkout` | Solo la feature de checkout |
| `npm run test:headed` | Ejecuta mostrando el navegador |
| `npm run test:dry` | *Dry-run*: valida que todos los steps tengan definición sin abrir el navegador |
| `npm run typecheck` | Verificación de tipos TypeScript |

Filtrar por cualquier tag o combinación:

```bash
npx cucumber-js --tags "@checkout and not @negativo"
npx cucumber-js --tags @locked_out_user
```

### Variables de entorno (opcionales)

| Variable | Default | Uso |
|---|---|---|
| `BASE_URL` | `https://www.saucedemo.com` | URL bajo prueba |
| `BROWSER` | `chromium` | `chromium`, `firefox` o `webkit` |
| `HEADLESS` | `true` | `false` para ver el navegador |
| `SLOW_MO` | `0` | Pausa (ms) entre acciones, útil para depurar |
| `DEFAULT_TIMEOUT` | `15000` | Timeout de Playwright por acción (ms) |
| `PARALLEL` | `2` | Workers de Cucumber |
| `RETRY` | `0` | Reintentos de escenarios fallidos |

Ejemplo (macOS/Linux): `BROWSER=firefox HEADLESS=false npm test`
Ejemplo (Windows PowerShell): `$env:BROWSER="firefox"; npm test`

## Reportes

Tras cada ejecución se generan en `reports/`:

- `cucumber-report.html` – reporte HTML navegable (ábrelo en el navegador).
- `cucumber-report.json` – para integrarlo con otras herramientas.

Si un escenario falla se adjunta automáticamente una **captura de pantalla de página completa** y la URL al reporte.

## Estructura del proyecto

```
.
├── features/                    # Especificaciones en Gherkin (español)
│   ├── login.feature
│   ├── cart.feature
│   └── checkout.feature
├── src/
│   ├── pages/                   # Page Object Model
│   │   ├── BasePage.ts          # Navegación y elementos comunes (header, carrito, título)
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutInformationPage.ts
│   │   ├── CheckoutOverviewPage.ts
│   │   └── CheckoutCompletePage.ts
│   ├── steps/                   # Step definitions (delgados: delegan en los Page Objects)
│   │   ├── login.steps.ts
│   │   ├── cart.steps.ts
│   │   └── checkout.steps.ts
│   ├── support/
│   │   ├── config.ts            # Configuración vía variables de entorno
│   │   ├── world.ts             # World de Cucumber: contexto por escenario + Page Objects
│   │   └── hooks.ts             # Ciclo de vida del navegador, screenshots en fallos
│   └── data/
│       └── users.ts             # Usuarios de prueba por alias
├── docs/ESTRATEGIA.md           # Informe de estrategia y patrones
├── .github/workflows/e2e.yml    # Pipeline CI en GitHub Actions
├── cucumber.js                  # Configuración de Cucumber
├── tsconfig.json
└── package.json
```

## Integración continua

El workflow `.github/workflows/e2e.yml` ejecuta typecheck + suite completa en cada *push* a `main` y en cada *pull request*, y publica `reports/` como artefacto descargable de la ejecución.

## Subir el proyecto a GitHub

```bash
# Crear un repositorio vacío en GitHub (sin README) y luego:
git remote add origin https://github.com/<tu-usuario>/saucedemo-playwright-cucumber.git
git branch -M main
git push -u origin main
```
