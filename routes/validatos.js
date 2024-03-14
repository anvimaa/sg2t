const validator = require("validator");

// Função para validar os dados da tarefa
export function validateLoginData(user) {
  const errors = {};

  if (!validator.isLength(user.username, { min: 5 })) {
    errors.title = "O usuario deve ter pelo menos 5 caracteres.";
  }

  return errors;
}
