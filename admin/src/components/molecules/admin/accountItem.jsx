import { ROLE_LABELS } from "../../../data/workspaceAreas";
import { Badge } from "../../atoms/badge";
import { Button } from "../../atoms/button";
import { Paragraph } from "../../atoms/paragraph";

export function AccountItem({
  account,
  isProtectedLastAdmin,
  confirming,
  submitting,
  onStartConfirm,
  onCancelConfirm,
  onConfirmDeactivate,
}) {
  const statusLabel = account.isActive
    ? "Activa"
    : account.deactivated
      ? "Desactivada"
      : "Pendiente de activación";

  const statusVariant = account.isActive
    ? "success"
    : account.deactivated
      ? "light"
      : "warning";

  return (
    <li className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 wrap-anywhere">
          <Paragraph
            as="strong"
            size="sm"
            variant="ink"
            weight="bold"
            text={account.name}
          />
          <Paragraph size="small">
            {account.email} · {ROLE_LABELS[account.role]}
          </Paragraph>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant={statusVariant} text={statusLabel} />

          {account.isActive && isProtectedLastAdmin && (
            <Badge variant="institutional" text="Último admin activo" />
          )}

          {account.isActive && !isProtectedLastAdmin && !confirming && (
            <Button
              variant="outline"
              size="small"
              disabled={submitting}
              data-deactivate-account={account.email}
              onClick={() => onStartConfirm(account.id)}
              text="Desactivar cuenta"
            />
          )}
        </div>
      </div>

      {account.isActive && confirming && (
        <div
          role="region"
          aria-label={`Confirmar desactivación de ${account.name}`}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-orange/40 bg-soft p-3"
        >
          <Paragraph size="small" variant="ink">
            ¿Confirmas desactivar a{" "}
            <Paragraph
              as="strong"
              variant="ink"
              weight="bold"
              text={account.name}
            />
            ? Se revocarán de inmediato sus sesiones activas.
          </Paragraph>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="small"
              disabled={submitting}
              data-confirm-deactivate={account.email}
              onClick={() => onConfirmDeactivate(account)}
              text={submitting ? "Desactivando…" : "Confirmar baja"}
            />
            <Button
              variant="link"
              size="small"
              disabled={submitting}
              onClick={onCancelConfirm}
              text="Cancelar"
            />
          </div>
        </div>
      )}
    </li>
  );
}
