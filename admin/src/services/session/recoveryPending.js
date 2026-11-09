const KEY = "ipc-admin-recovery-pending";

export const UNCONFIRMED_RECOVERY_NOTICE =
  "Se canceló el acceso porque recargaste la página antes de confirmar tus códigos de recuperación. Si no alcanzaste a guardarlos, solicita asistencia al administrador.";

export function markRecoveryPending() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // Entornos sin sessionStorage conservan únicamente el bloqueo en memoria.
  }
}

export function clearRecoveryPending() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Ignorar errores de almacenamiento restringido.
  }
}

export function isRecoveryPending() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
