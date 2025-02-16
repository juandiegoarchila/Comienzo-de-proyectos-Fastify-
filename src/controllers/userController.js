// src/controllers/userControllers.js

import { db } from '../config/config.js';

// Obtener usuarios
export const getUsers = async (request, reply) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    reply.send(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    reply.status(500).send({ message: 'Error al obtener usuarios' });
  }
};

// Crear usuario
export const createUser = async (request, reply) => {
  try {
    const { name, email } = request.body;
    const newUser = {
      name,
      email,
      testUser: request.body.testUser || false,
      createdAt: new Date(),
    };

    const userRef = await db.collection('users').add(newUser);

    reply.status(201).send({
      id: userRef.id,
      message: 'Usuario creado con éxito',
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    reply.status(500).send({ message: 'Error al crear usuario', error });
  }
};

// Actualizar usuario
export const updateUser = async (request, reply) => {
  const { id } = request.params;
  const { name, email } = request.body;

  if (!name && !email) {
    return reply.status(400).send({ message: 'Nada que actualizar' });
  }

  try {
    const userRef = db.collection('users').doc(id);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return reply.status(404).send({ message: 'Usuario no encontrado' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    await userRef.update(updateData);
    reply.send({ message: 'Usuario actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    reply.status(500).send({ message: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
export const deleteUser = async (request, reply) => {
  try {
    const { id } = request.params;
    const userRef = db.collection('users').doc(id);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return reply.status(404).send({ message: 'Usuario no encontrado' });
    }

    await userRef.delete();
    reply.status(200).send({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('❌ Error eliminando usuario:', error);
    reply.status(500).send({ message: 'Error eliminando usuario' });
  }
};
