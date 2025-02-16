import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';
import chalk from 'chalk';
import { db } from '../config/config.js'; // Importa Firebase para limpiar datos de prueba

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
  console.error(chalk.redBright(error));
}

// Configuración de pruebas
describe('User Controller', function () {
  this.timeout(5000);
  let server;
  let testUserId = null;
  let startTime;
  const testResults = []; // Almacenar resultados de las pruebas

  before(async () => {
    server = await app.listen({ port: 0 });
    startTime = Date.now();
    logTitle('🎯 INICIANDO PRUEBAS DE USER CONTROLLER');
  });

  after(async () => {
    // Limpiar datos de prueba (usuarios con testUser: true)
    const usersSnapshot = await db.collection('users').where('testUser', '==', true).get();
    const deletePromises = usersSnapshot.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);

    await app.close();

    // Mostrar tabla descriptiva de pruebas
    console.log(chalk.bold.magenta(`\n⏱️ Detalles de tiempo por prueba:`));
    console.table(
      testResults.map((test, index) => ({
        Prueba: test.description.split(' - ')[0], // Ejemplo: '[GET] /api/users'
        Descripción: test.description.split(' - ')[1], // Ejemplo: 'Obtener todos los usuarios'
        Estado: test.status === '✅' ? '✅' : '❌',
        Tiempo: `${test.time}ms`,
      }))
    );

    // Resumen final
    const totalTime = Date.now() - startTime;
    const passedTests = testResults.filter((test) => test.status === '✅').length;
    const totalTests = testResults.length;
    console.log(chalk.bold.blue(`\n═══════════════════════════════════════`));
    console.log(chalk.bold.greenBright(`✅ PRUEBAS COMPLETADAS - ${passedTests}/${totalTests} EXITOSAS ✅`));
    console.log(chalk.bold.blue(`═══════════════════════════════════════\n`));
    console.log(chalk.bold.yellowBright(`⏳ TIEMPO TOTAL: ${totalTime}ms`));
    console.log(chalk.bold.blue(`═══════════════════════════════════════\n`));
  });

  async function runTest(description, testFunction) {
    logTitle(description);
    const start = Date.now();
    try {
      await testFunction();
      const time = Date.now() - start;
      testResults.push({ description, status: '✅', time });
      logSuccess(description, time);
    } catch (error) {
      const time = Date.now() - start;
      testResults.push({ description, status: '❌', time });
      logError(description, error);
      throw error;
    }
  }

  it('[GET] /api/users - Obtener todos los usuarios', async function () {
    await runTest('[GET] /api/users - Obtener todos los usuarios', async () => {
      const res = await request(server).get('/api/users');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('[POST] /api/users - Crear un nuevo usuario', async function () {
    await runTest('[POST] /api/users - Crear un nuevo usuario', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com', testUser: true };
      const res = await request(server).post('/api/users').send(newUser);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      testUserId = res.body.id;
    });
  });

  it('[POST] /api/users - Crear usuario con datos inválidos', async function () {
    await runTest('[POST] /api/users - Crear usuario con datos inválidos', async () => {
      const newUser = { name: 'John Doe' }; // Falta email
      const res = await request(server).post('/api/users').send(newUser);
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('body must have required property \'email\'');
    });
  });

  it('[POST] /api/users - Crear usuario con email inválido', async function () {
    await runTest('[POST] /api/users - Crear usuario con email inválido', async () => {
      const newUser = { name: 'John Doe', email: 'invalid-email' };
      const res = await request(server).post('/api/users').send(newUser);
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('body/email must match format "email"');
    });
  });

  it('[PUT] /api/users/:id - Actualizar usuario con datos inválidos', async function () {
    await runTest('[PUT] /api/users/:id - Actualizar usuario con datos inválidos', async () => {
      const updatedUser = { name: '', email: 'valid@example.com' };
      const res = await request(server).put(`/api/users/${testUserId}`).send(updatedUser);
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('body/name must NOT have fewer than 1 characters');
    });
  });

  it('[PUT] /api/users/:id - Actualizar un usuario', async function () {
    await runTest('[PUT] /api/users/:id - Actualizar un usuario', async () => {
      const updatedUser = { name: 'John Updated', email: 'john_updated@example.com' };
      const res = await request(server).put(`/api/users/${testUserId}`).send(updatedUser);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Usuario actualizado con éxito');
    });
  });

  it('[DELETE] /api/users/:id - Eliminar un usuario existente', async function () {
    await runTest('[DELETE] /api/users/:id - Eliminar un usuario existente', async () => {
      const res = await request(server).delete(`/api/users/${testUserId}`);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Usuario eliminado con éxito');
    });
  });
});