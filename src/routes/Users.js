// src/routes/Users.js
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { userBodySchema, updateUserSchema } from "./schemas/userSchema.js";

async function userRoutes(fastify, options) {
  // Se requiere autenticación para obtener usuarios
  fastify.get("/users", { preHandler: [fastify.authenticate] }, getUsers);
  fastify.post("/users", { schema: { body: userBodySchema } }, createUser);
  fastify.put("/users/:id", { schema: { body: updateUserSchema } }, updateUser);
  fastify.delete("/users/:id", deleteUser);
}

export default userRoutes;
