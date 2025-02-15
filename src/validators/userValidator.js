// src/validators/userValidator.js
import Joi from 'joi';

export const userValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  testUser: Joi.boolean().optional(),
});
