import { Button } from "../atoms/button";

export function RecoveryCodes({ codes, onSaved }) {
  return (
    <>
      <p>
        Guarda estos códigos en un lugar seguro antes de continuar. Solo se
        muestran esta vez y cada uno permite un acceso.
      </p>
      <ul className="recovery-codes">
        {codes.map((code) => (
          <li key={code}>
            <code>{code}</code>
          </li>
        ))}
      </ul>
      <Button onClick={onSaved}>Ya guardé los códigos. Abrir escritorio</Button>
    </>
  );
}
