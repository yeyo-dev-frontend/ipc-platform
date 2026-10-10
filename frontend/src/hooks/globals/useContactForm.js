import { useState } from "react";
import { CONTACT_FORM_GROUPS } from "../../data/contactFormFields";
import { apiFetch } from "../../helpers/apiFetch";
import { ContactFormValidator } from "../../validations/validationCredentials";

const ALL_FIELDS = CONTACT_FORM_GROUPS.flat();

const buildInitialValues = () =>
  ALL_FIELDS.reduce((acc, field) => {
    acc[field.name] = field.type === "select" ? "0" : "";
    return acc;
  }, {});

const initialToast = { visible: false, type: "error", message: "" };

function useContactForm() {
  const [values, setValues] = useState(buildInitialValues);
  const [activeStep, setActiveStep] = useState(1);
  const [errorStep, setErrorStep] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState(initialToast);
  const [submitting, setSubmitting] = useState(false);

  const closeToast = () => setToast(initialToast);

  const setValue = (name) => (e) => {
    let val = e.target.value;

    if (name === "phone") {
      // Solo dígitos y un '+' opcional al inicio
      val = val.replace(/[^\d+]/g, "");
      // Si hay más de un '+', deja solo el primero (y solo al inicio)
      val = val.replace(/(?!^)\+/g, "");
    }
    setValues((prev) => ({ ...prev, [name]: val }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: false } : prev));
    setErrorStep((prev) => (prev ? null : prev));
    setActiveStep((prev) => (prev < 2 ? 2 : prev));
  };

  const validate = async () => {
    try {
      await ContactFormValidator.validateAsync(values, { abortEarly: false });
      return { valid: true, errors: {}, firstMessage: "" };
    } catch (err) {
      const errors = {};
      err.details.forEach((detail) => {
        const key = detail.path[0];
        if (!errors[key]) errors[key] = detail.message;
      });
      return {
        valid: false,
        errors,
        firstMessage:
          err.details[0]?.message || "Revisa los campos del formulario.",
      };
    }
  };

  const reset = () => {
    setValues(buildInitialValues());
    setActiveStep(1);
    setErrorStep(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const { valid, errors, firstMessage } = await validate();

    if (!valid) {
      const markedErrors = Object.keys(errors).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setFieldErrors(markedErrors);
      setErrorStep(activeStep);
      setToast({ visible: true, type: "error", message: firstMessage });
      return;
    }

    setFieldErrors({});
    setErrorStep(null);
    setActiveStep(3);
    setSubmitting(true);

    try {
      const response = await apiFetch("/contact", "POST", values);
      if (!response) throw new Error("Error en el envío");

      setActiveStep(4);
      setToast({
        visible: true,
        type: "success",
        message:
          "Hemos recibido tu solicitud, pronto nos pondremos en contacto contigo.",
      });
      setTimeout(reset, 3000);
    } catch (err) {
      console.error("Error al enviar el formulario de contacto:", err);
      setErrorStep(4);
      setToast({
        visible: true,
        type: "error",
        message: err.message || "Ocurrió un error al enviar. Intenta de nuevo.",
      });
      setTimeout(reset, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    values,
    activeStep,
    errorStep,
    fieldErrors,
    toast,
    closeToast,
    submitting,
    setValue,
    handleSubmit,
  };
}

export { useContactForm };
