//src/tests/userController.test.js
import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import { logTitle, logSuccess, logError } from "./utils/testUtils.js";
import { validateUserInput, isValidEmail } from "./utils/validationUtils.js";
import { cleanupTestData, generateTestReport } from "./helpers/testHelpers.js";

const DEFAULT_TIMEOUT = 5000; // 5 segundos
const TEST_USER_PREFIX = "test_user_";

describe("User Controller", function() {
  this.timeout(DEFAULT_TIMEOUT);
  let server;
  let testUserId = null;
  let startTime;
  let testResults = [];

  before(async () => {
    server = await app.listen({ port: 0 });
    startTime = Date.now();
    logTitle("🎯 INICIANDO PRUEBAS DE USER CONTROLLER");
    await cleanupTestData();
  });

  after(async () => {
    await app.close();
    await generateTestReport(testResults, startTime);
  });

  async function runTest(description, testFunction) {
    logTitle(description);
    const start = Date.now();
    try {
      await testFunction();
      const time = Date.now() - start;
      testResults.push({ description, status: "✅", time });
      logSuccess(description, time);
    } catch (error) {
      const time = Date.now() - start;
      testResults.push({ description, status: "❌", time });
      logError(description, error);
      throw error;
    }
  }

  it("[GET] /api/users - Obtener todos los usuarios", async function() {
    await runTest("[GET] /api/users - Obtener todos los usuarios", async () => {
      const res = await request(server).get("/api/users");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  it("[POST] /api/users - Crear un nuevo usuario", async function() {
    await runTest("[POST] /api/users - Crear un nuevo usuario", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@example.com",
        testUser: true,
      };
      const res = await request(server).post("/api/users").send(newUser);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("id");
      testUserId = res.body.id;
    });
  });

  it("[POST] /api/users - Crear usuario con datos inválidos", async function() {
    await runTest("[POST] /api/users - Crear usuario con datos inválidos", async () => {
      const newUser = { name: "John Doe" }; // Falta email
      const res = await request(server).post("/api/users").send(newUser);
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("body must have required property 'email'");
    });
  });

  it("[POST] /api/users - Crear usuario con email inválido", async function() {
    await runTest("[POST] /api/users - Crear usuario con email inválido", async () => {
      const newUser = { name: "John Doe", email: "invalid-email" };
      const res = await request(server).post("/api/users").send(newUser);
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('body/email must match format "email"');
    });
  });

  it("[PUT] /api/users/:id - Actualizar usuario con datos inválidos", async function() {
    await runTest("[PUT] /api/users/:id - Actualizar usuario con datos inválidos", async () => {
      const updatedUser = { name: "", email: "valid@example.com" };
      const res = await request(server)
        .put(`/api/users/${testUserId}`)
        .send(updatedUser);
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("body/name must NOT have fewer than 1 characters");
    });
  });

  it("[PUT] /api/users/:id - Actualizar un usuario", async function() {
    await runTest("[PUT] /api/users/:id - Actualizar un usuario", async () => {
      const updatedUser = {
        name: "John Updated",
        email: "john_updated@example.com",
      };
      const res = await request(server)
        .put(`/api/users/${testUserId}`)
        .send(updatedUser);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Usuario actualizado con éxito");
    });
  });

  it("[DELETE] /api/users/:id - Eliminar un usuario existente", async function() {
    await runTest("[DELETE] /api/users/:id - Eliminar un usuario existente", async () => {
      const res = await request(server).delete(`/api/users/${testUserId}`);
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Usuario eliminado con éxito");
    });
  });
});
