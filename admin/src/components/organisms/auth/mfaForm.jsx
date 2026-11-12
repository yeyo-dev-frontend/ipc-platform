import { useEffect, useState } from "react";
import { verifyMfa } from "../../../services/verifyMfa";
import {
  isRecoveryOwner,
  RECOVERY_KEY,
} from "../../../services/session/recoveryPending";
import { logoutSession } from "../../../services/session/logoutSession";
import { Button } from "../../atoms/button";
import { AuthenticatorSetup } from "../../molecules/auth/authenticatorSetup";
import { Field } from "../../molecules/field";
import { StatusBanner } from "../../molecules/statusBanner";

const expired = "El desafío ha vencido. Vuelve a iniciar sesión.";

export function MfaForm({ challenge, onBack, onVerified }) {
  const [recovery, setRecovery] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uncertain, setUncertain] = useState(false);
  useEffect(() => {
    if (!uncertain) return;
    const cancelled = (event) => {
      if (event.key === RECOVERY_KEY && !isRecoveryOwner())
        onBack("Se canceló el intento de acceso.");
    };
    window.addEventListener("storage", cancelled);
    return () => window.removeEventListener("storage", cancelled);
  }, [uncertain, onBack]);
  useEffect(() => {
    if (busy || uncertain) return;
    const timer = setTimeout(
      () => onBack(expired),
      challenge.deadline - Date.now(),
    );
    return () => clearTimeout(timer);
  }, [busy, uncertain, challenge.deadline, onBack]);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    if (Date.now() >= challenge.deadline) return onBack(expired);
    const code = new FormData(event.currentTarget).get("code");
    setError("");
    setBusy(true);
    try {
      onVerified(await verifyMfa(challenge, code));
    } catch (failure) {
      if (challenge.enrollmentRequired && isRecoveryOwner()) {
        setUncertain(true);
        return;
      }
      if (failure.status === 429) return onBack(failure.message);
      if (Date.now() >= challenge.deadline) return onBack(expired);
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  if (uncertain) {
    async function restart() {
      if (busy) return;
      setBusy(true);
      setError("");
      try {
        if (isRecoveryOwner()) await logoutSession();
        onBack(
          "Vuelve a iniciar sesión. Si tu autenticador ya quedó vinculado, introduce su código actual.",
        );
      } catch (failure) {
        setError(failure.message);
      } finally {
        setBusy(false);
      }
    }
    return (
      <div className="mt-4 grid gap-4">
        <StatusBanner
          role="alert"
          text="No pudimos confirmar si el autenticador quedó vinculado. Conserva la cuenta en tu aplicación y, cuando tengas conexión, reinicia el acceso."
        />
        {error && <StatusBanner role="alert" variant="danger" text={error} />}
        <Button
          onClick={restart}
          disabled={busy}
          text={busy ? "Cancelando intento…" : "Reiniciar acceso"}
        />
      </div>
    );
  }
  return (
    <>
      {challenge.enrollmentRequired && (
        <AuthenticatorSetup
          key={challenge.challengeToken}
          provisioningUri={challenge.provisioningUri}
          secret={challenge.secret}
        />
      )}
      <form onSubmit={submit} aria-busy={busy} className="mt-8 grid gap-4.5">
        <Field
          key={String(recovery)}
          label={recovery ? "Código de recuperación" : "Código de seis dígitos"}
          name="code"
          type="text"
          inputMode={recovery ? "text" : "numeric"}
          pattern={recovery ? "[A-Za-z0-9_\\-]{43}" : "[0-9]{6}"}
          maxLength={recovery ? 43 : 6}
          autoComplete="one-time-code"
          spellCheck={false}
          required
          disabled={busy}
        />
        {error && <StatusBanner role="alert" variant="danger" text={error} />}
        <Button
          type="submit"
          disabled={busy}
          text={busy ? "Verificando…" : "Verificar código"}
        />
      </form>
      <div className="mt-3 flex flex-wrap justify-between gap-2.5">
        {!challenge.enrollmentRequired && (
          <Button
            variant="link"
            disabled={busy}
            text={
              recovery ? "Usar el autenticador" : "Usar código de recuperación"
            }
            onClick={() => {
              setRecovery(!recovery);
              setError("");
            }}
          />
        )}
        <Button
          variant="link"
          disabled={busy}
          text="Volver al acceso"
          onClick={() => onBack("")}
        />
      </div>
    </>
  );
}
