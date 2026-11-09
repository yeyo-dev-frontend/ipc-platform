import { useState } from "react";
import { registerAdmin } from "../../services/registerAdmin";
import { Button } from "../atoms/button";
import { Paragraph } from "../atoms/paragraph";
import { Title } from "../atoms/titles";
import { Field } from "../molecules/field";
import { SelectField } from "../molecules/selectField";

const roleOptions = [
  { value: "admissions", text: "Admisión" },
  { value: "events", text: "Eventos" },
];

export function RegisterAdminForm({ onIssued }) {
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
      const result = await registerAdmin({
        name: fields.get("name").trim(),
        email: fields.get("email").trim(),
        role: fields.get("role"),
      });
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
      <Title
        level="h3"
        text="Registrar cuenta por invitación"
        className="mb-1"
      />
      <Paragraph text="Crea una cuenta pendiente y genera un código de activación de un solo uso válido por 24 horas." />
      <form onSubmit={submit} aria-busy={busy} className="mt-8 grid gap-4.5">
        <Field
          label="Nombre completo"
          name="name"
          type="text"
          minLength={2}
          maxLength={100}
          required
          disabled={busy}
        />
        <Field
          label="Correo institucional"
          name="email"
          type="email"
          maxLength={254}
          required
          disabled={busy}
        />
        <SelectField
          label="Rol"
          name="role"
          defaultValue="admissions"
          options={roleOptions}
          required
          disabled={busy}
        />
        {error && <Paragraph role="alert" variant="danger" text={error} />}
        <Button
          type="submit"
          disabled={busy}
          text={busy ? "Generando invitación…" : "Crear invitación"}
        />
      </form>
    </article>
  );
}
