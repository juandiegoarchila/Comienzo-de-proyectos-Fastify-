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
  console.error(chalk.redBright(error));
}

function logSummary(total, passed, totalTime) {
  console.log(chalk.bold.blue(`\n═══════════════════════════════════════`));
  console.log(chalk.bold.greenBright(`✅ PRUEBAS COMPLETADAS - ${passed}/${total} EXITOSAS ✅`));
  console.log(chalk.bold.blue(`═══════════════════════════════════════\n`));
  console.log(chalk.bold.blue(`\n═══════════════════════════════════════`));
  console.log(chalk.bold.yellowBright(`⏳ TIEMPO TOTAL: ${totalTime}ms`));
  console.log(chalk.bold.blue(`═══════════════════════════════════════\n`));
}

// Configuración de pruebas
describe('User Controller', function () {
  this.timeout(5000);
  let server;
  let testUserId = null;
  let passedTests = 0;
  let startTime;
  const totalTests = 5;

  before(async () => {
    server = await app.listen({ port: 0 });
    startTime = Date.now();
    logTitle('🎯 INICIANDO PRUEBAS DE USER CONTROLLER');
  });

  after(async () => {
    await app.close();
    const totalTime = Date.now() - startTime;
    logSummary(totalTests, passedTests, totalTime);
  });

  async function runTest(description, testFunction) {
    logTitle(description);
    const start = Date.now();
    try {
      await testFunction();
      passedTests++;
      logSuccess(description, Date.now() - start);
    } catch (error) {
      logError(description, error);
      throw error;
    }
  }

  it('[GET] /api/users - Obtener todos los usuarios', async function () {
    await runTest('🔍 PRUEBA: OBTENER TODOS LOS USUARIOS', async () => {
      const res = await request(server).get('/api/users');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('[POST] /api/users - Crear un nuevo usuario', async function () {
    await runTest('📝 PRUEBA: CREAR UN NUEVO USUARIO', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com', testUser: true };
      const res = await request(server).post('/api/users').send(newUser);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      testUserId = res.body.id;
    });
  });

  it('[PUT] /api/users/:id - Actualizar un usuario', async function () {
    await runTest('🛠 PRUEBA: ACTUALIZAR UN USUARIO', async () => {
      const updatedUser = { name: 'John Updated', email: 'john_updated@example.com' };
      const res = await request(server).put(`/api/users/${testUserId}`).send(updatedUser);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Usuario actualizado con éxito');
    });
  });

  it('[DELETE] /api/users/:id - Eliminar un usuario existente', async function () {
    await runTest('🗑 PRUEBA: ELIMINAR UN USUARIO', async () => {
      const res = await request(server).delete(`/api/users/${testUserId}`);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Usuario eliminado con éxito');
    });
  });

  it('[DELETE] /api/users/:id - Intentar eliminar usuario inexistente', async function () {
    await runTest('🚫 PRUEBA: ELIMINAR UN USUARIO QUE NO EXISTE', async () => {
      const fakeId = 'nonexistentID';
      const res = await request(server).delete(`/api/users/${fakeId}`);
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Usuario no encontrado');
    });
  });
});
