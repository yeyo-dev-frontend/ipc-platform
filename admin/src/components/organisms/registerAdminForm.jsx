import { useState } from "react";
import { registerAdmin } from "../../services/registerAdmin";
import { Button } from "../atoms/button";
import { Field } from "../molecules/field";
import { SelectField } from "../molecules/selectField";

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
    <article>
      <h3>Registrar cuenta por invitación</h3>
      <p>
        Crea una cuenta pendiente y genera un código de activación de un solo
        uso válido por 24 horas.
      </p>
      <form onSubmit={submit} aria-busy={busy}>
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
          required
          disabled={busy}
        >
          <option value="admissions">Admisión</option>
          <option value="events">Eventos</option>
        </SelectField>
        {error && <p role="alert">{error}</p>}
        <Button type="submit" disabled={busy}>
          {busy ? "Generando invitación…" : "Crear invitación"}
        </Button>
      </form>
    </article>
  );
}
