//src/controllers/userController.js
import { db } from "../config/config.js";

// Obtener usuarios con paginación
export const getUsers = async (request, reply) => {
  try {
    // Se recibe el límite y el cursor (último createdAt de la página anterior)
    const { limit = 10, lastCreatedAt } = request.query;
    let query = db
      .collection("users")
      .orderBy("createdAt")
      .limit(parseInt(limit));

    // Si se envía un cursor, usamos startAfter para comenzar la consulta desde allí
    if (lastCreatedAt) {
      query = query.startAfter(new Date(lastCreatedAt));
    }

    const usersSnapshot = await query.get();
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    reply.send(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    reply.status(500).send({ message: "Error al obtener usuarios" });
  }
};

// Crear usuario con transacción para evitar duplicados
export const createUser = async (request, reply) => {
  try {
    const { name, email } = request.body;
    const newUser = {
      name,
      email,
      testUser: request.body.testUser || false,
      createdAt: new Date(),
    };
    const userId = email.toLowerCase();
    const userRef = db.collection("users").doc(userId);

    // El método create() falla si el documento ya existe
    await userRef.create(newUser);
    reply.status(201).send({ id: userId, message: "Usuario creado con éxito" });
  } catch (error) {
    // Si el error es por documento existente, devolvemos conflicto (409)
    if (error.code === 6 || error.message.includes("already exists")) {
      reply.status(409).send({ message: "El email ya está registrado" });
    } else {
      console.error("Error al crear usuario:", error);
      reply.status(500).send({ message: "Error al crear usuario" });
    }
  }
};

// Actualizar usuario con validaciones
export const updateUser = async (request, reply) => {
  const { id } = request.params;
  const { name, email } = request.body;

  if (!name && !email) {
    return reply.status(400).send({ message: "Nada que actualizar" });
  }

  try {
    const userRef = db.collection("users").doc(id);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return reply.status(404).send({ message: "Usuario no encontrado" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    await userRef.update(updateData);
    reply.send({ message: "Usuario actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    reply.status(500).send({ message: "Error al actualizar usuario" });
  }
};

// Eliminar usuario
export const deleteUser = async (request, reply) => {
  try {
    const { id } = request.params;
    const userRef = db.collection("users").doc(id);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return reply.status(404).send({ message: "Usuario no encontrado" });
    }

    await userRef.delete();
    reply.status(200).send({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    console.error("❌ Error eliminando usuario:", error);
    reply.status(500).send({ message: "Error eliminando usuario" });
  }
};
