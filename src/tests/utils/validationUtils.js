/// src/tests/utils/validationUtils.js

export function validateUserInput(data) {
  const errors = [];
  if (!data.name || typeof data.name !== "string" || data.name.length < 1) {
    errors.push("El nombre es requerido y debe tener al menos 1 carácter");
  }
  if (!data.email || !isValidEmail(data.email)) {
    errors.push("El email es requerido y debe ser válido");
  }
  return errors;
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
