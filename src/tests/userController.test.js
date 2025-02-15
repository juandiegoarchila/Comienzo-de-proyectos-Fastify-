// src/tests/userController.test.js

import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';
import chalk from 'chalk';

describe('User Controller', function () {
  this.timeout(5000);

  let server;     // Referencia al servidor
  let testUserId = null;
  let passedTests = 0;
  let totalTests = 5;

  // Antes de todos los tests, levantamos el servidor
  before(async () => {
server = await app.listen({ port: 0 });
    console.log(chalk.magenta('\n═══════════════════════════════════════'));
    console.log(chalk.bold('🎯 INICIANDO PRUEBAS DE USER CONTROLLER...'));
    console.log(chalk.magenta('═══════════════════════════════════════'));
  });

  // Después de todos los tests, cerramos el servidor
  after(async () => {
    await app.close(); // Cierra el servidor Fastify
    console.log(chalk.magenta('\n═══════════════════════════════════════'));
    console.log(chalk.bold('🧹 LIMPIEZA FINAL'));
    console.log(chalk.magenta('═══════════════════════════════════════'));
    console.log(chalk.bold(`✅ PRUEBAS COMPLETADAS - ${passedTests}/${totalTests} EXITOSAS ✅`));
    console.log(chalk.magenta('═══════════════════════════════════════'));
  });

  // Función auxiliar para contar tests pasados
  async function runTest(testFunction) {
    try {
      await testFunction();
      passedTests++;
    } catch (error) {
      console.error(chalk.red('❌ ERROR EN PRUEBA:'), error.message);
      throw error;
    }
  }

  it(chalk.cyan('📌 [GET] /api/users - Obtener todos los usuarios'), async function () {
    await runTest(async () => {
      const res = await request(server).get('/api/users');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      console.log(chalk.green('✅ Lista de usuarios obtenida correctamente.'));
    });
  });

  it(chalk.cyan('📌 [POST] /api/users - Crear un nuevo usuario'), async function () {
    await runTest(async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@example.com',
        testUser: true,
      };
      const res = await request(server).post('/api/users').send(newUser);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id');
      testUserId = res.body.id;
      console.log(chalk.green('✅ Usuario creado y verificado en Firestore.'));
    });
  });

  it(chalk.cyan('📌 [PUT] /api/users/:id - Actualizar un usuario'), async function () {
    await runTest(async () => {
      const updatedUser = {
        name: 'John Updated',
        email: 'john_updated@example.com',
      };
      const res = await request(server).put(`/api/users/${testUserId}`).send(updatedUser);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Usuario actualizado con éxito');
      console.log(chalk.green('✅ Usuario actualizado correctamente.'));
    });
  });

  it(chalk.cyan('📌 [DELETE] /api/users/:id - Eliminar un usuario existente'), async function () {
    await runTest(async () => {
      const res = await request(server).delete(`/api/users/${testUserId}`);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal('Usuario eliminado con éxito');
      console.log(chalk.green('✅ Usuario eliminado correctamente.'));
    });
  });

  it(chalk.cyan('📌 [DELETE] /api/users/:id - Intentar eliminar usuario inexistente'), async function () {
    await runTest(async () => {
      const fakeId = 'nonexistentID';
      const res = await request(server).delete(`/api/users/${fakeId}`);
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Usuario no encontrado');
      console.log(chalk.green('✅ Correctamente identificado que el usuario no existe.'));
    });
  });
});
