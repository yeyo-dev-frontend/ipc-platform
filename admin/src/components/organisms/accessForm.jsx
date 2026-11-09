import { useCallback, useEffect, useRef, useState } from "react";
import { FiKey, FiLock, FiSmartphone } from "react-icons/fi";
import { Button } from "../atoms/button";
import { ActivateForm } from "./activateForm";
import { LoginForm } from "./loginForm";
import { MfaForm } from "./mfaForm";
import { RecoveryCodes } from "./recoveryCodes";

export function AccessForm({ onAuthenticated, initialNotice }) {
  const [activating, setActivating] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [verified, setVerified] = useState(null);
  const [notice, setNotice] = useState(initialNotice);
  const heading = useRef(null);
  useEffect(() => {
    setNotice(initialNotice);
  }, [initialNotice]);
  const back = useCallback((message) => {
    setActivating(false);
    setChallenge(null);
    setNotice(message);
  }, []);
  function accept(result) {
    setChallenge(null);
    if (result.recoveryCodes) setVerified(result);
    else onAuthenticated(result.session);
  }

  let title = "Iniciar sesión";
  if (activating) title = "Activar cuenta";
  if (challenge)
    title = challenge.enrollmentRequired
      ? "Configurar el autenticador"
      : "Verificar identidad";
  if (verified) title = "Guarda tus códigos de recuperación";
  useEffect(() => {
    heading.current?.focus();
  }, [title]);

  let icon = <FiLock />;
  if (activating) icon = <FiKey />;
  if (challenge || verified) icon = <FiSmartphone />;

  return (
    <section className="form-card">
      <div className="step-icon">{icon}</div>
      <h2 tabIndex={-1} ref={heading}>
        {title}
      </h2>
      {verified ? (
        <RecoveryCodes
          codes={verified.recoveryCodes}
          onSaved={() => onAuthenticated(verified.session)}
        />
      ) : challenge ? (
        <MfaForm challenge={challenge} onBack={back} onVerified={accept} />
      ) : activating ? (
        <ActivateForm onActivated={back} onBack={back} />
      ) : (
        <>
          <p>Accede al panel con tu cuenta institucional.</p>
          {notice && <p role="status">{notice}</p>}
          <LoginForm
            onChallenge={(data) => {
              setNotice("");
              setChallenge({
                ...data,
                deadline: Date.now() + data.expiresIn * 1000,
              });
            }}
          />
          <div className="actions">
            <Button
              variant="link"
              onClick={() => {
                setNotice("");
                setActivating(true);
              }}
            >
              Activar cuenta con código
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
