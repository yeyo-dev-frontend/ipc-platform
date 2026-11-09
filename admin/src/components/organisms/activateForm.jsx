import { useState } from "react";
import { activateAccount } from "../../services/activateAccount";
import { Button } from "../atoms/button";
import { Field } from "../molecules/field";

export function ActivateForm({ onActivated, onBack }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const fields = new FormData(event.currentTarget);
    const token = fields.get("token").trim();
    const password = fields.get("password");
    const confirmPassword = fields.get("confirmPassword");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await activateAccount(token, password);
      onActivated(
        "Cuenta activada. Inicia sesión para configurar el autenticador.",
      );
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <p>
        Introduce el código de invitación de un solo uso y crea una contraseña
        de al menos 15 caracteres.
      </p>
      <form onSubmit={submit} aria-busy={busy}>
        <Field
          label="Código de activación"
          name="token"
          type="text"
          pattern="[A-Za-z0-9_\-]{43}"
          maxLength={43}
          autoComplete="off"
          spellCheck={false}
          required
          disabled={busy}
        />
        <Field
          label="Nueva contraseña"
          name="password"
          type="password"
          minLength={15}
          maxLength={128}
          autoComplete="new-password"
          required
          disabled={busy}
        />
        <Field
          label="Confirmar contraseña"
          name="confirmPassword"
          type="password"
          minLength={15}
          maxLength={128}
          autoComplete="new-password"
          required
          disabled={busy}
        />
        {error && <p role="alert">{error}</p>}
        <Button type="submit" disabled={busy}>
          {busy ? "Activando…" : "Activar cuenta"}
        </Button>
      </form>
      <div className="actions">
        <Button variant="link" disabled={busy} onClick={() => onBack("")}>
          Volver al acceso
        </Button>
      </div>
    </>
  );
}
