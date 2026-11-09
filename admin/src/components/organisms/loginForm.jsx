import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { login } from "../../services/login";
import { Button } from "../atoms/button";
import { Field } from "../molecules/field";

export function LoginForm({ onChallenge }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const fields = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      onChallenge(
        await login(fields.get("email").trim(), fields.get("password")),
      );
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} aria-busy={busy}>
      <Field
        label="Correo institucional"
        name="email"
        type="email"
        autoComplete="username"
        required
      />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {error && <p role="alert">{error}</p>}
      <Button type="submit" disabled={busy}>
        {busy ? "Comprobando…" : "Continuar"} <FiArrowRight />
      </Button>
    </form>
  );
}
