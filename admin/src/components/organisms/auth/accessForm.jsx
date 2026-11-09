import { useCallback, useEffect, useRef, useState } from "react";
import { FiKey, FiLock, FiSmartphone } from "react-icons/fi";
import {
  clearRecoveryPending,
  markRecoveryPending,
} from "../../../services/session";
import { Button } from "../../atoms/button";
import { Paragraph } from "../../atoms/paragraph";
import { Title } from "../../atoms/titles";
import { StatusBanner } from "../../molecules/statusBanner";
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
    if (result.recoveryCodes) {
      markRecoveryPending();
      setVerified(result);
    } else {
      onAuthenticated(result.session);
    }
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

  const isSuccessNotice = notice?.startsWith("Cuenta activada");

  return (
    <section className="w-[min(100%,410px)]">
      <div className="grid h-12.5 w-12.5 place-items-center rounded-xl bg-soft text-[23px] text-blue-dark">
        {icon}
      </div>
      <Title
        level="h2"
        size="page"
        tabIndex={-1}
        ref={heading}
        text={title}
        className="mt-12.5 mb-2.5"
      />
      {verified ? (
        <RecoveryCodes
          codes={verified.recoveryCodes}
          onSaved={() => {
            clearRecoveryPending();
            onAuthenticated(verified.session);
          }}
        />
      ) : challenge ? (
        <MfaForm challenge={challenge} onBack={back} onVerified={accept} />
      ) : activating ? (
        <ActivateForm onActivated={back} onBack={back} />
      ) : (
        <>
          <Paragraph text="Accede al panel con tu cuenta institucional." />
          {notice && (
            <StatusBanner
              role="status"
              variant={isSuccessNotice ? "success" : "info"}
              text={notice}
              className="mt-3"
            />
          )}
          <LoginForm
            onChallenge={(data) => {
              setNotice("");
              setChallenge({
                ...data,
                deadline: Date.now() + data.expiresIn * 1000,
              });
            }}
          />
          <div className="mt-3 flex flex-wrap justify-between gap-2.5">
            <Button
              variant="link"
              text="Activar cuenta con código"
              onClick={() => {
                setNotice("");
                setActivating(true);
              }}
            />
          </div>
        </>
      )}
    </section>
  );
}
