import { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiLock, FiSmartphone } from "react-icons/fi";
import { Button } from "../atoms/button";
import { Field } from "../molecules/field";

const screens = {
  login: [
    "Iniciar sesión",
    "Accede al panel con tu cuenta institucional.",
    "Continuar",
    "verify",
  ],
  verify: [
    "Verificar identidad",
    "Usa el código de seis dígitos de tu aplicación autenticadora.",
    "Verificar código",
    "workspace",
  ],
  recovery: [
    "Usar código de recuperación",
    "Accede con uno de tus códigos de respaldo.",
    "Verificar código",
    "workspace",
  ],
};
export function AccessForm({ step, onChange }) {
  const [title, description, action, next] = screens[step];
  const [code, setCode] = useState("");
  const heading = useRef(null);
  useEffect(() => {
    setCode("");
    heading.current?.focus();
  }, [step]);
  return (
    <section className="form-card">
      <div className="step-icon">
        {step === "login" ? <FiLock /> : <FiSmartphone />}
      </div>
      <h2 tabIndex={-1} ref={heading}>
        {title}
      </h2>
      <p>{description}</p>
      <form
        key={step}
        onSubmit={(e) => {
          e.preventDefault();
          onChange(next);
        }}
      >
        {step === "login" ? (
          <>
            <Field
              label="Correo institucional"
              type="email"
              value="admin@example.test"
              readOnly
            />
            <Field
              label="Contraseña"
              type="password"
              value="demostracion"
              readOnly
            />
          </>
        ) : (
          <Field
            label={
              step === "verify"
                ? "Código de verificación"
                : "Código de respaldo"
            }
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            autoComplete="off"
            inputMode={step === "verify" ? "numeric" : "text"}
            pattern={step === "verify" ? "123456" : "DEMO-IPC"}
            placeholder={step === "verify" ? "123456" : "DEMO-IPC"}
          />
        )}
        <Button type="submit">
          {action}
          <FiArrowRight />
        </Button>
      </form>
      {step !== "login" && (
        <div className="actions">
          <Button
            variant="link"
            onClick={() => onChange(step === "verify" ? "recovery" : "verify")}
          >
            {step === "verify"
              ? "Usar código de recuperación"
              : "Usar la aplicación autenticadora"}
          </Button>
          <Button variant="link" onClick={() => onChange("login")}>
            Volver al acceso
          </Button>
        </div>
      )}
      <small className="demo">
        {step === "login"
          ? "Vista de muestra con credenciales ficticias."
          : `Para esta muestra, escribe ${step === "verify" ? "123456" : "DEMO-IPC"}.`}
      </small>
    </section>
  );
}
