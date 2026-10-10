import Joi from "joi";

const ContactFormValidator = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "El nombre debe ser una cadena de texto",
      "string.empty": "El nombre no puede estar vacío",
      "string.min": "El nombre debe tener mínimo 2 caracteres",
      "string.max": "El nombre no puede tener más de 50 caracteres",
      "string.pattern.base": "El nombre solo puede contener letras y espacios",
      "any.required": "El nombre es requerido",
    }),

  email: Joi.string()
    .min(8)
    .max(100)
    .pattern(
      /^[a-zA-Z0-9._%+-áéíóúÁÉÍÓÚñÑ]+@(gmail\.com|hotmail\.com|yahoo\.com)$/,
    )
    .required()
    .messages({
      "string.base": "El correo debe ser una cadena de caracteres",
      "string.empty": "El correo no puede estar vacío",
      "string.min": "El correo debe contener mínimo 8 caracteres",
      "string.max": "El correo solo puede contener máximo 100 caracteres",
      "string.pattern.base":
        "Ingrese un correo válido (gmail, hotmail, yahoo) (.com)",
      "any.required": "El correo es requerido",
    }),

  phone: Joi.string()
    .pattern(/^\+?[0-9]{9,15}$/)
    .required()
    .messages({
      "string.base": "El teléfono debe ser una cadena de caracteres",
      "string.empty": "El teléfono no puede estar vacío",
      "string.pattern.base":
        "El teléfono debe contener solo números y opcionalmente un '+' al inicio",
      "any.required": "El teléfono es requerido",
    }),
  address: Joi.string()
    .pattern(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s.]+$/)
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.base": "La dirección debe ser una cadena de texto",
      "string.empty": "La dirección no puede estar vacía",
      "string.min": "La dirección debe tener mínimo 3 caracteres",
      "string.max": "La dirección no puede tener más de 100 caracteres",
      "string.pattern.base":
        "La dirección solo puede contener letras, números, espacios y puntos",
      "any.required": "La dirección es requerida",
    }),

  career: Joi.string()
    .valid("administracion", "contabilidad", "informatica", "idiomas")
    .required()
    .messages({
      "any.only": "Selecciona una carrera válida",
      "string.empty": "Selecciona una carrera",
      "any.required": "La carrera es requerida",
    }),

  shift: Joi.string().valid("manana", "tarde", "noche").required().messages({
    "any.only": "Selecciona un turno válido",
    "string.empty": "Selecciona un turno",
    "any.required": "El turno es requerido",
  }),

  message: Joi.string().min(5).max(500).required().messages({
    "string.base": "El mensaje debe ser una cadena de texto",
    "string.empty": "El mensaje no puede estar vacío",
    "string.min": "El mensaje debe tener mínimo 5 caracteres",
    "string.max": "El mensaje no puede tener más de 500 caracteres",
    "any.required": "El mensaje es requerido",
  }),
});

export { ContactFormValidator };
