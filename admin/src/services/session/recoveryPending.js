export const RECOVERY_KEY = "ipc-admin-recovery-pending";
export const WAITING_NOTICE =
  "Confirma tus códigos de recuperación en la pestaña donde configuraste el autenticador.";
export const UNCONFIRMED_RECOVERY_NOTICE =
  "El acceso se canceló antes de confirmar los códigos de recuperación. Si no los guardaste, solicita asistencia al administrador.";

export function markRecoveryPending() {
  if (isRecoveryPending() && !isRecoveryOwner())
    throw new Error(WAITING_NOTICE);
  try {
    const id = String(Math.random()).slice(2);
    sessionStorage.setItem(RECOVERY_KEY, id);
    localStorage.setItem(RECOVERY_KEY, id);
  } catch {
    throw new Error(
      "Permite el almacenamiento del sitio para configurar el autenticador.",
    );
  }
}

export function isRecoveryPending() {
  try {
    return Boolean(localStorage.getItem(RECOVERY_KEY));
  } catch {
    return false;
  }
}
export function isRecoveryOwner() {
  return (
    isRecoveryPending() &&
    sessionStorage.getItem(RECOVERY_KEY) === localStorage.getItem(RECOVERY_KEY)
  );
}
export function clearRecoveryPending() {
  if (isRecoveryPending()) localStorage.removeItem(RECOVERY_KEY);
  try {
    sessionStorage.removeItem(RECOVERY_KEY);
  } catch {
    /* El almacenamiento puede estar deshabilitado. */
  }
}
