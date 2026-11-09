import { useEffect, useState } from "react";
import { Button } from "../atoms/button";
import { Paragraph } from "../atoms/paragraph";

export function RecoveryCodes({ codes, onSaved }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  async function copyCodes() {
    try {
      await navigator.clipboard?.writeText(codes.join("\n"));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <Paragraph text="Guarda estos códigos en un lugar seguro antes de continuar. Solo se muestran esta vez y cada uno permite un acceso." />
      <ul className="my-4.5 grid list-none gap-1 rounded-[7px] bg-soft p-3.5">
        {codes.map((code) => (
          <li key={code}>
            <code className="wrap-anywhere">{code}</code>
          </li>
        ))}
      </ul>
      <div className="grid gap-2.5">
        <Button
          variant="secondary"
          text={copied ? "Códigos copiados" : "Copiar códigos"}
          onClick={copyCodes}
        />
        <Button
          text="Ya guardé los códigos. Abrir escritorio"
          onClick={onSaved}
        />
      </div>
    </>
  );
}
