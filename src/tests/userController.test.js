//src/tests/userController.test.js

import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';
import chalk from 'chalk';

// Funciones de logging reutilizables
function logTitle(title, emoji = '📌') {
  console.log(chalk.bold.blue(`\n═══════════════════════════════════════`));
  console.log(chalk.bold.cyanBright(`${emoji} ${title}`));
  console.log(chalk.bold.blue(`═══════════════════════════════════════`));
}

function logSuccess(message, time) {
  console.log(chalk.green(`✅ ${message} (${time}ms)`));
}

function logError(message, error) {
  console.log(chalk.red(`❌ ${message}`));
  console.error(chalk.redBright(`Detalles del error: ${error.message}`));
}

function logSummary(total, passed, totalTime, testTimes) {
  const failed = total - passed;
  const color = failed > 0 ? chalk.redBright : chalk.greenBright;

  console.log(chalk.bold.blue(`\n═══════════════════════════════════════`));
  console.log(color(`✅ PRUEBAS COMPLETADAS - ${passed}/${total} EXITOSAS`));
  if (failed > 0) {
    console.log(chalk.bold.redBright(`❌ ${failed} PRUEBAS FALLIDAS`));
  }
  console.log(chalk.bold.blue(`═══════════════════════════════════════`));
  console.log(chalk.bold.yellowBright(`⏳ TIEMPO TOTAL: ${totalTime}ms`));
  console.log(chalk.bold.blue(`═══════════════════════════════════════\n`));

  console.log(chalk.bold.magenta(`⏱️ Detalles de tiempo por prueba:`));
  console.table(testTimes);
}

// Configuración de pruebas
describe('User Controller', function () {
  this.timeout(5000);
  let server;
  let testUserId = null;
  let passedTests = 0;
  let startTime;
  const totalTests = 8;
  const testTimes = [];

  before(async () => {
    server = await app.listen({ port: 0 });
    startTime = Date.now();
    logTitle('🎯 INICIANDO PRUEBAS DE USER CONTROLLER');
  });

  after(async () => {
    await app.close();
    const totalTime = Date.now() - startTime;
    logSummary(totalTests, passedTests, totalTime, testTimes);
  });

  async function runTest(description, method, endpoint, testFunction) {
    logTitle(`${method} ${endpoint} - ${description}`);
    const start = Date.now();
    try {
      await testFunction();
      const time = Date.now() - start;
      passedTests++;
      logSuccess(description, time);
      testTimes.push({ Prueba: description, Tiempo: `${time}ms` });
    } catch (error) {
      logError(description, error);
      testTimes.push({ Prueba: description, Tiempo: 'FALLÓ' });
      throw error;
    }
  }

  it('[POST] /api/users - Crear usuario con datos inválidos', async function () {
    await runTest('🚨 PRUEBA: CREAR USUARIO SIN EMAIL', 'POST', '/api/users', async () => {
      const newUser = { name: 'John Doe' }; // Falta email
      const res = await request(server).post('/api/users').send(newUser);
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('body must have required property \'email\'');
    });
  });
  
  it('[POST] /api/users - Crear usuario con email inválido', async function () {
    await runTest('🚨 PRUEBA: CREAR USUARIO CON EMAIL INVÁLIDO', 'POST', '/api/users', async () => {
      const newUser = { name: 'John Doe', email: 'invalid-email' };
      const res = await request(server).post('/api/users').send(newUser);
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('body/email must match format "email"');
    });
  });
  
  it('[PUT] /api/users/:id - Actualizar usuario con datos inválidos', async function () {
    await runTest('🚨 PRUEBA: ACTUALIZAR USUARIO SIN NOMBRE', 'PUT', `/api/users/${testUserId}`, async () => {
      const updatedUser = { name: '', email: 'valid@example.com' };
      const res = await request(server).put(`/api/users/${testUserId}`).send(updatedUser);
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('body/name must NOT have fewer than 1 characters');
    });
  });

  it('🔄 PRUEBA: CONCURRENCIA - Múltiples peticiones simultáneas', async function () {
    await runTest('🚀 PRUEBA: MÚLTIPLES CREACIONES DE USUARIOS', 'POST', '/api/users', async () => {
      const users = Array(5).fill({ name: 'Test User', email: `test${Math.random()}@mail.com` });
      const responses = await Promise.all(users.map(user => request(server).post('/api/users').send(user)));
      responses.forEach(res => expect(res.status).to.equal(201));
    });
  });
});
