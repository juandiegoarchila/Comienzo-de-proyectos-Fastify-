export const userBodySchema = {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      testUser: { type: 'boolean', default: false },
    },
  };
  
  export const updateUserSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
    },
  };
  