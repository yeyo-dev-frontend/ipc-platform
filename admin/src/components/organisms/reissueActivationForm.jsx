import { useState } from "react";
import { reissueActivation } from "../../services/reissueActivation";
import { Button } from "../atoms/button";
import { Field } from "../molecules/field";

export function ReissueActivationForm({ onIssued }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true);
    setError("");
    try {
      const result = await reissueActivation(fields.get("email").trim());
      form.reset();
      onIssued(result);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article>
      <h3>Reemitir código de activación</h3>
      <p>
        Invalida invitaciones anteriores de una cuenta aún pendiente y emite un
        nuevo código por 24 horas.
      </p>
      <form onSubmit={submit} aria-busy={busy}>
        <Field
          label="Correo de la cuenta pendiente"
          name="email"
          type="email"
          maxLength={254}
          required
          disabled={busy}
        />
        {error && <p role="alert">{error}</p>}
        <Button type="submit" disabled={busy}>
          {busy ? "Reemitiendo…" : "Reemitir código"}
        </Button>
      </form>
    </article>
  );
}
