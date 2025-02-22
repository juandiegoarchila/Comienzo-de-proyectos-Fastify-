// src/tests/userController.test.js
import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import { logTitle, logSuccess, logError } from "./utils/testUtils.js";
import { cleanupTestData, generateTestReport } from "./helpers/testHelpers.js";

const DEFAULT_TIMEOUT = 5000; // 5 segundos

describe("User Controller", function () {
  this.timeout(DEFAULT_TIMEOUT);
  let server;
  let agent; // Declaramos el agente global
  let testUserIds = [];
  let startTime;
  let testResults = [];
  let validToken;

  before(async () => {
    server = await app.listen({ port: 0 });
    startTime = Date.now();
    logTitle("🎯 INICIANDO PRUEBAS DE USER CONTROLLER");
    await cleanupTestData();
    validToken = app.jwt.sign({ user: "test" });
    // Creamos el agente usando la instancia del servidor
    agent = request.agent(server);
    // Warm-up global: se ejecuta una solicitud para calentar Firebase
    try {
      await agent
        .get("/api/users")
        .set("Authorization", "Bearer " + validToken);
    } catch (e) {
      console.error("Error en warm-up global:", e);
    }
  });

  after(async () => {
    await cleanupTestData(); // Limpiar datos al final de todas las pruebas
    await app.close();
    await generateTestReport(testResults, startTime);
  });

  const runTest = async (description, testFunction) => {
    logTitle(`📌 Iniciando prueba: ${description}`);
    const start = Date.now();
    try {
      await testFunction();
      const time = Date.now() - start;
      testResults.push({ description, status: "✅", time });
      logSuccess(`${description} completada en ${time}ms`);
    } catch (error) {
      const time = Date.now() - start;
      testResults.push({ description, status: "❌", time });
      logError(`${description} fallida en ${time}ms`, error);
      throw error;
    }
  };

  const testCases = [
    {
      description: "[GET] /api/users - Obtener todos los usuarios",
      testFunction: async () => {
        const res = await agent
          .get("/api/users")
          .set("Authorization", "Bearer " + validToken);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
      },
    },
    {
      description: "[POST] /api/users - Crear un nuevo usuario",
      testFunction: async () => {
        const newUser = {
          name: "John Doe",
          email: "john@example.com",
          testUser: true,
        };
        const res = await agent.post("/api/users").send(newUser);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("id");
        testUserIds.push(res.body.id);
      },
    },
    {
      description: "[POST] /api/users - Crear usuario con datos inválidos",
      testFunction: async () => {
        const newUser = { name: "John Doe" }; // Falta email
        const res = await agent.post("/api/users").send(newUser);
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal(
          "body must have required property 'email'",
        );
      },
    },
    {
      description: "[POST] /api/users - Crear usuario con email inválido",
      testFunction: async () => {
        const newUser = { name: "John Doe", email: "invalid-email" };
        const res = await agent.post("/api/users").send(newUser);
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal(
          'body/email must match format "email"',
        );
      },
    },
    {
      description:
        "[PUT] /api/users/:id - Actualizar usuario con datos inválidos",
      testFunction: async () => {
        const updatedUser = { name: "", email: "valid@example.com" };
        const res = await agent
          .put(`/api/users/${testUserIds[0]}`)
          .send(updatedUser);
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal(
          "body/name must NOT have fewer than 1 characters",
        );
      },
    },
    {
      description: "[PUT] /api/users/:id - Actualizar un usuario",
      testFunction: async () => {
        const updatedUser = {
          name: "John Updated",
          email: "john_updated@example.com",
        };
        const res = await agent
          .put(`/api/users/${testUserIds[0]}`)
          .send(updatedUser);
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal("Usuario actualizado con éxito");
      },
    },
    {
      description: "[DELETE] /api/users/:id - Eliminar un usuario existente",
      testFunction: async () => {
        const res = await agent.delete(`/api/users/${testUserIds[0]}`);
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal("Usuario eliminado con éxito");
      },
    },
    {
      description: "[PUT] /api/users/:id - Actualizar usuario con body vacío",
      testFunction: async () => {
        const res = await agent.put(`/api/users/${testUserIds[0]}`).send({});
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal("Nada que actualizar");
      },
    },
    {
      description: "[POST] /api/users - Crear usuario con email duplicado",
      testFunction: async () => {
        const duplicateUser = {
          name: "John Doe",
          email: "john_dup@example.com",
          testUser: true,
        };
        const res1 = await agent.post("/api/users").send(duplicateUser);
        expect(res1.status).to.equal(201);
        testUserIds.push(res1.body.id);
        const res2 = await agent.post("/api/users").send(duplicateUser);
        expect(res2.status).to.equal(409);
      },
    },
    {
      description:
        "[POST] /api/users - No debe permitir emails duplicados en concurrencia",
      testFunction: async () => {
        const email = `test-${Date.now()}@example.com`;
        const requests = Array(2)
          .fill()
          .map(() =>
            agent
              .post("/api/users")
              .send({ name: "Test User", email, testUser: true }),
          );
        const responses = await Promise.all(requests);
        const statusCodes = responses.map((res) => res.status);
        expect(statusCodes).to.have.members([201, 409]);
      },
    },
    {
      description: "[GET] /api/users?page=1&limit=10 - Prueba de paginación",
      testFunction: async () => {
        const res = await agent
          .get("/api/users?page=1&limit=10")
          .set("Authorization", "Bearer " + validToken);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array").that.has.lengthOf.at.most(10);
      },
    },
  ];

  testCases.forEach(({ description, testFunction }) => {
    it(description, async function () {
      await runTest(description, testFunction);
    });
  });
});
