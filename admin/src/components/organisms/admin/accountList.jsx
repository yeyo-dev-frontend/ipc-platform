import { useEffect, useState } from "react";
import { ROLE_LABELS } from "../../../data/workspaceAreas";
import { listAccounts } from "../../../services/postAuthenticatedAuth";
import { Button } from "../../atoms/button";
import { Title } from "../../atoms/titles";
import { Badge } from "../../atoms/badge";
import { StatusBanner } from "../../molecules/statusBanner";

export function AccountList({ revision }) {
  const [accounts, setAccounts] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setError("");
    setAccounts(null);
    listAccounts()
      .then(({ accounts }) => {
        if (active) setAccounts(accounts);
      })
      .catch((failure) => {
        if (active) setError(failure.message);
      });
    return () => {
      active = false;
    };
  }, [revision, attempt]);
  return (
    <section aria-labelledby="accounts-heading" className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Title level="h2" id="accounts-heading" text="Cuentas del personal" />
        <Button
          variant="link"
          disabled={!accounts && !error}
          onClick={() => setAttempt((value) => value + 1)}
        >
          Actualizar listado
        </Button>
      </div>
      {error ? (
        <StatusBanner role="alert" variant="danger" text={error} />
      ) : !accounts ? (
        <p role="status">Cargando cuentas…</p>
      ) : !accounts.length ? (
        <p>Todavía no hay cuentas registradas.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-white">
          {accounts.map((account) => (
            <li
              key={account.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div className="min-w-0 wrap-anywhere">
                <strong>{account.name}</strong>
                <p>
                  {account.email} · {ROLE_LABELS[account.role]}
                </p>
              </div>
              <Badge
                variant={account.isActive ? "success" : "warning"}
                text={account.isActive ? "Activa" : "Pendiente de activación"}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
