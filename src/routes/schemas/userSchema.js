// src/routes/schemas/userSchema.js
export const userBodySchema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    testUser: { type: 'boolean', default: false },
  },
  additionalProperties: false,
};

export const updateUserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
  },
  additionalProperties: false,
};