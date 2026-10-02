// Configuración de Cucumber: rutas, transpilación TS, formatos de reporte y paralelismo.
const common = {
  paths: ['features/**/*.feature'],
  requireModule: ['ts-node/register'],
  require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
  format: [
    'progress-bar',
    'summary',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
  ],
  formatOptions: { snippetInterface: 'async-await' },
  parallel: Number(process.env.PARALLEL ?? 2),
  retry: Number(process.env.RETRY ?? 0),
};

module.exports = { default: common };
