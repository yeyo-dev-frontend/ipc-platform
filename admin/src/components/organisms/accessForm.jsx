import { useCallback, useEffect, useRef, useState } from "react";
import { FiLock, FiSmartphone } from "react-icons/fi";
import { LoginForm } from "./loginForm";
import { MfaForm } from "./mfaForm";
import { RecoveryCodes } from "./recoveryCodes";

export function AccessForm({ onAuthenticated, initialNotice }) {
  const [challenge, setChallenge] = useState(null);
  const [verified, setVerified] = useState(null);
  const [notice, setNotice] = useState(initialNotice);
  const heading = useRef(null);
  const back = useCallback((message) => {
    setChallenge(null);
    setNotice(message);
  }, []);
  function accept(result) {
    setChallenge(null);
    if (result.recoveryCodes) setVerified(result);
    else onAuthenticated(result.session);
  }

  let title = "Iniciar sesión";
  if (challenge)
    title = challenge.enrollmentRequired
      ? "Configurar el autenticador"
      : "Verificar identidad";
  if (verified) title = "Guarda tus códigos de recuperación";
  useEffect(() => {
    heading.current?.focus();
  }, [title]);

  return (
    <section className="form-card">
      <div className="step-icon">
        {challenge || verified ? <FiSmartphone /> : <FiLock />}
      </div>
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
        </>
      )}
    </section>
  );
}
