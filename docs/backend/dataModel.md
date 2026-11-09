> Actualización 4/11/2026: MFA obligatorio implementado. El contrato de login y los nuevos modelos/configuración se detallan en [mfa.md](mfa.md); prevalece sobre descripciones anteriores de login directo o MFA pendiente.

# Datos de administradores y autenticación

Actualizado: 30 de octubre de 2026. PostgreSQL local ipc_backend_dev; modelos Prisma en backend/prisma/schema.prisma. Las cuentas creadas por el usuario se conservan; las pruebas usan una base separada.

## Admin → admins

id UUID; name varchar(100); email varchar(254) único, recortado y en minúsculas; passwordHash Argon2id; role enum admin/admissions/events; isActive false hasta activar; createdAt y updatedAt timestamptz. PostgreSQL exige email normalizado mediante CHECK. La invitación guarda inicialmente un hash de contraseña aleatoria descartada; nunca una contraseña común.

## Tablas auxiliares

| Modelo / tabla | Responsabilidad |
| --- | --- |
| Session / sessions | Familia de autenticación: UUID usado como sid del JWT, adminId, creación, última actividad, vencimiento absoluto y revocación |
| RefreshToken / refresh_tokens | tokenHash SHA-256 único, sessionId, createdAt y usedAt. Historial de rotaciones de cada familia |
| Activation / activations | tokenHash SHA-256 único, adminId, vencimiento y fecha de uso |
| AuditLog / audit_logs | Acción, actorId/targetId opcionales, requestId y fecha; sin contraseñas ni tokens |
| AuthRateLimit / auth_rate_limits | Clave con hash, contador y vencimiento para límites globales, por IP y por cuenta |

refresh_tokens tiene FK a sessions con borrado en cascada. No se borra un refresh consumido durante la rotación: usedAt permite detectar reutilización. Sessions y activations tienen FK hacia admins y se eliminan en cascada si se borra una cuenta desde BD. No existe una ruta de borrado de cuentas. Auditoría conserva UUIDs como referencias históricas sin cascada; no garantiza inmutabilidad frente al operador de BD.

Migraciones aplicadas: create_admins, admin_authentication y jwt_refresh_rotation. La última revocó las sesiones antiguas y retiró su tokenHash; no eliminó cuentas ni cambió contraseñas. Se conserva el historial anterior. No se añadieron tablas de eventos, medios, contenido ni consultas.

Los detalles de expiración, activación, permisos y limitaciones viven en [authentication.md](authentication.md). MFA, recuperación, cambio de contraseña y gestión de bajas/roles siguen pendientes.
