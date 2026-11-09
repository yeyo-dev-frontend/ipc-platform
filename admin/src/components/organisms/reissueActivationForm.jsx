import { useState } from "react";
import { reissueActivation } from "../../services/reissueActivation";
import { Button } from "../atoms/button";
import { Paragraph } from "../atoms/paragraph";
import { Title } from "../atoms/titles";
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
    <article className="rounded-[10px] border border-line bg-white p-6">
      <Title level="h3" text="Reemitir código de activación" className="mb-1" />
      <Paragraph text="Invalida invitaciones anteriores de una cuenta aún pendiente y emite un nuevo código por 24 horas." />
      <form onSubmit={submit} aria-busy={busy} className="mt-8 grid gap-4.5">
        <Field
          label="Correo de la cuenta pendiente"
          name="email"
          type="email"
          maxLength={254}
          required
          disabled={busy}
        />
        {error && <Paragraph role="alert" variant="danger" text={error} />}
        <Button
          type="submit"
          disabled={busy}
          text={busy ? "Reemitiendo…" : "Reemitir código"}
        />
      </form>
    </article>
  );
}
