import { useEffect, useState } from "react";
import { Button } from "../atoms/button";
import { Field } from "../molecules/field";
import { AuthenticatorSetup } from "../molecules/authenticatorSetup";
import { verifyMfa } from "../../services/verifyMfa";

const expired = "El desafío ha vencido. Vuelve a iniciar sesión.";

export function MfaForm({ challenge, onBack, onVerified }) {
  const [recovery, setRecovery] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (busy) return;
    const timer = setTimeout(
      () => onBack(expired),
      challenge.deadline - Date.now(),
    );
    return () => clearTimeout(timer);
  }, [busy, challenge.deadline, onBack]);

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
      if (failure.status === 429) return onBack(failure.message);
      if (Date.now() >= challenge.deadline) return onBack(expired);
      setError(failure.message);
    } finally {
      setBusy(false);
    }
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
      <form onSubmit={submit} aria-busy={busy}>
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
        {error && <p role="alert">{error}</p>}
        <Button type="submit" disabled={busy}>
          {busy ? "Verificando…" : "Verificar código"}
        </Button>
      </form>
      <div className="actions">
        {!challenge.enrollmentRequired && (
          <Button
            variant="link"
            disabled={busy}
            onClick={() => {
              setRecovery(!recovery);
              setError("");
            }}
          >
            {recovery ? "Usar el autenticador" : "Usar código de recuperación"}
          </Button>
        )}
        <Button variant="link" disabled={busy} onClick={() => onBack("")}>
          Volver al acceso
        </Button>
      </div>
    </>
  );
}
