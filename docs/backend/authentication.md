> Actualización 4/11/2026: MFA obligatorio implementado. El contrato de login y los nuevos modelos/configuración se detallan en [mfa.md](mfa.md); prevalece sobre descripciones anteriores de login directo o MFA pendiente.

# Registro y autenticación con JWT

Actualizado: 30 de octubre de 2026. Por petición explícita del usuario para el curso, se sustituyó la cookie de sesión opaca por **access token JWT + refresh token rotativo en Prisma**. Esta decisión reemplaza la recomendación anterior de usar solo sesiones opacas. No es una implementación de OAuth: es autenticación de primera parte con login propio.

MFA, recuperación/cambio de contraseña y gestión completa de cuentas siguen pendientes. NODE_ENV=production permanece bloqueado hasta completar esa etapa. No hay panel ni integración del frontend todavía.

## Inicio y pruebas en Bruno

1. En esta instalación la clave JWT ya quedó generada de forma privada. En otro equipo copia backend/.env.example a backend/.env, configura PostgreSQL y ejecuta `pnpm auth:key`. Nunca compartas .env.
2. Las cuentas existentes se conservaron. La migración revocó las sesiones del formato anterior: **inicia sesión nuevamente**. Si la base está vacía, `pnpm admin:bootstrap` crea la primera cuenta pendiente.
3. Ejecuta `pnpm dev:backend` o `pnpm dev`.
4. Abre backend/bruno/ y selecciona el entorno privado local. En otro equipo copia environments/local.example.bru a environments/local.bru. Los archivos locales están ignorados por Git.
5. Si la cuenta es nueva, usa **Activar cuenta** con su código de un solo uso y contraseña. Si ya está activa, pasa directamente a **Iniciar sesión JWT**.
6. Login devuelve accessToken y csrfToken. El script de Bruno los guarda como variables de ejecución, sin escribirlos en archivos. Activa el manejo de cookies: ipc_refresh llega mediante Set-Cookie.
7. **Mi sesión JWT** envía Authorization: Bearer y debe responder 200. **Registrar cuenta** y **Reemitir activación** requieren además CSRF y rol admin.
8. **Renovar JWT y rotar refresh** envía la cookie y CSRF, reemplaza ambos tokens de autenticación y conserva la misma sesión/familia.
9. **Cerrar sesión** revoca la familia y borra la cookie. Un JWT previamente emitido ya no accede a /me.

Usa siempre el mismo host (127.0.0.1 y localhost tienen cookies diferentes). Los valores personales que estaban escritos directamente en peticiones fueron trasladados a environments/local.bru. No uses cuentas ni credenciales reales en capturas de clase.

## Contratos HTTP

Prefijo /api/v1/auth. Respuestas con `{ "data": ... }`; errores con error.code, error.message y requestId.

| Método/ruta | Entrada | Acceso | Resultado |
| --- | --- | --- | --- |
| POST /register | name, email, role | Bearer + CSRF + rol admin | 201: cuenta pendiente, activationToken, expiresAt |
| POST /activate | token, password | Código único vigente | 200: cuenta activada |
| POST /login | email, password | Público con límites | 200: admin, accessToken, tokenType, expiresIn, csrfToken; refresh solo por cookie |
| GET /me | Sin cuerpo | Bearer válido | 200: cuenta y CSRF de su sesión |
| GET /accounts | Sin cuerpo | Bearer vigente y rol admin | 200: data.accounts con id, name, email, role e isActive; 401 sin sesión y 403 para admissions/events |
| GET /csrf | Sin cuerpo | Cookie refresh vigente + X-IPC-Client | 200: CSRF para recuperar el flujo tras recarga |
| POST /refresh | {} | Cookie refresh + CSRF | 200: nuevo JWT y nueva cookie refresh |
| POST /logout | {} | Cookie refresh + CSRF; no exige JWT vigente | 204: familia revocada y cookie eliminada |
| POST /activation/reissue | email | Bearer + CSRF + rol admin | 200: nueva invitación para cuenta pendiente |

Los POST del módulo de autenticación exigen Content-Type: application/json y X-IPC-Client: admin. Los endpoints protegidos por CSRF requieren X-CSRF-Token. Si hay Origin, debe coincidir con ADMIN_ORIGIN; no hay CORS abierto. /csrf también comprueba la cabecera de cliente y el origen. No hay refresh token en el cuerpo de respuesta, en URLs ni en localStorage.

Errores: 400 JSON/activación inválidos; 401 credenciales/JWT/sesión/refresh inválidos; 403 permiso/CSRF/origen; 404 cuenta ausente al reemitir; 409 duplicado/cuenta activa/bootstrap cerrado; 413 más de 16 KiB; 415 tipo de cuerpo; 422 entrada inválida; 429 límite de intentos; 500 interno sin datos privados. La reutilización devuelve REFRESH_REUSED y revoca la familia; refresh vencido/revocado devuelve INVALID_REFRESH o UNAUTHENTICATED según el punto del rechazo.

## Access token JWT

Se firma con jose y HS256. JWT_SECRET contiene 32 bytes aleatorios codificados como 64 caracteres hexadecimales y es obligatoria. No se usan claves de respaldo. El algoritmo permitido se fija en el servidor; se verifica firma, typ=at+jwt, issuer=ipc-backend, audience=ipc-admin, expiración y antigüedad máxima.

Claims: sub (UUID de cuenta), sid (UUID de sesión/familia), jti (UUID del token), iss, aud, iat, exp. No lleva contraseña, correo ni rol. El contenido de un JWT firmado es legible; la firma no lo cifra. Los permisos se consultan en BD para evitar roles desactualizados.

Duración: hasta diez minutos, sin sobrepasar la expiración absoluta de la familia. Se envía como Authorization: Bearer. En el futuro frontend se conservará en memoria. No basta con decodificarlo: el servidor verifica la firma y comprueba en PostgreSQL que sid pertenece a sub, que la sesión sigue activa y que la cuenta está habilitada. Esta consulta permite revocación inmediata; el diseño no es completamente sin estado.

## Refresh token y rotación

El refresh usa 32 bytes aleatorios en base64url, no JWT. Prisma conserva únicamente su SHA-256 en refresh_tokens. Cada fila pertenece a una Session; se retienen filas consumidas con usedAt para detectar reutilización.

La cookie ipc_refresh es HttpOnly, SameSite=Strict y Path=/api/v1/auth. Secure depende de configuración de producción, aún bloqueada; desarrollo usa HTTP local. Su Max-Age se ajusta al tiempo restante de la familia, no se reinicia por ocho horas en cada renovación.

Rotación transaccional:
1. Localizar el hash y bloquear la fila de la familia con FOR UPDATE.
2. Releer el token bajo ese bloqueo.
3. Si ya tiene usedAt, revocar la familia y registrar auth.refresh_reuse. La transacción confirma esa revocación antes de devolver el error HTTP.
4. Si es válido, marcarlo usado, insertar el hash del siguiente token, actualizar actividad y auditar auth.refresh.
5. Emitir el nuevo JWT y devolver la nueva cookie.

La familia vence a las ocho horas de login o tras treinta minutos de inactividad. Tanto peticiones Bearer autenticadas como renovaciones exitosas actualizan actividad. /csrf no prolonga la sesión. Renovar no extiende el máximo absoluto. Logout o reutilización invalida todos los JWT y refresh de esa familia; otras sesiones de la misma cuenta permanecen activas.

**Concurrencia estricta:** dos renovaciones con el mismo refresh producen una respuesta exitosa y otra de reutilización; la familia termina revocada. El panel serializa las renovaciones entre pestañas mediante Web Locks o SharedWorker. Si se pierde la respuesta después de confirmar la rotación, reintentar con el token antiguo exige nuevo login. No hay ventana de tolerancia que permita reusar tokens.

## CSRF, recarga y cierre

CSRF es un HMAC ligado al identificador de sesión, con clave derivada de JWT_SECRET y un contexto separado. No autentica por sí solo y no sustituye al JWT ni al refresh. Permanece estable durante la familia y difiere entre sesiones.

Tras recargar el panel, el access token en memoria desaparece. El flujo es GET /csrf con cookies → POST /refresh con cookies y CSRF → guardar el nuevo JWT en memoria. No hace falta enviar un JWT vencido para renovar. Logout usa refresh + CSRF, por lo que también funciona con access token vencido. Un origen externo no recibe permiso CORS para leer los secretos.

## Cuentas y controles conservados

Solo admin registra cuentas. Bootstrap interno crea la primera, sin sobrescribir existentes. Activación de 24 horas y un solo uso; contraseñas de 15–128 caracteres con Argon2id (19 MiB, dos iteraciones, paralelismo 1). Registro entrega el código al administrador para que lo comparta privadamente tras verificar identidad; no envía correo ni verifica su propiedad.

Correo recortado, en minúsculas y único, con CHECK PostgreSQL. Reemisión invalida invitaciones anteriores solo para cuentas pendientes; CLI `pnpm admin:activation` permite recuperar la primera invitación. No es recuperación de contraseñas de cuentas activas.

Ventanas persistentes de 15 minutos: login, 10 intentos por correo; operaciones de credenciales, 30 por IP y 200 globales; /refresh, /csrf y /logout comparten 120 por IP y 600 globales. También cuentan operaciones exitosas. La IP es la del socket; no se confía en X-Forwarded-For. Revisar límites/proxy antes de desplegar.

Auditoría: operaciones exitosas de cuentas, login, logout, refresh y reutilización detectada. No registra contraseñas, JWT, refresh ni CSRF. Las filas históricas y tokens usados no tienen limpieza automática todavía.

## Organización del código

| Archivo dentro de modules/auth/ | Responsabilidad |
| --- | --- |
| authService.js | Componer los servicios |
| invitationService.js | Registro, activación y reemisión |
| loginService.js | Verificar credenciales y crear la familia |
| accessTokenService.js | Emitir/verificar JWT y derivar CSRF |
| refreshService.js | Renovar, recuperar CSRF y cerrar sesión |
| authCookies.js | Leer/escribir/eliminar cookies sin exponer refresh en JSON |
| authRoutes.js / credentialRoutes.js | Contratos HTTP y middleware |
| authSettings.js / sessionPolicy.js | Duraciones y políticas de sesión |
| repositories/sessionRepository.js | Persistencia de familias y revocación |
| repositories/refreshRepository.js | Historial de refresh, bloqueo y rotación atómica |

Se conservan repositorios de registro, activación y límites; admins contiene búsqueda/selección pública de cuentas y audit la escritura transaccional. La aplicación compone Hono en app.js; index.js carga configuración, conecta Prisma y abre/cierra el puerto.

## Verificación y pendientes

`pnpm test:backend` usa únicamente ipc_backend_auth_test, con migraciones y limpieza de datos ficticios. Las suites se ejecutan en serie para no interferir entre sí. Se mantienen regresiones de registro/permisos y se añaden pruebas de firma/claims inválidos, expiración, rotación, historial de hashes, replay, concurrencia, CSRF, límites y revocación inmediata.

Bruno está preparado para ejecución manual; no se declara ejecutado en la aplicación. La ruta POST / de demostración fue retirada; responde 404. GET / se conserva como comprobación básica del servidor.

Pendientes: MFA, recuperación/cambio de contraseña, revocación de todas las sesiones por usuario, gestión de bajas/roles y protección del último admin, verificación de correo, limpieza periódica, panel y revisión de despliegue. Cambiar JWT_SECRET invalida JWT y CSRF anteriores, pero por sí solo no revoca familias: con una cookie válida y el nuevo CSRF se puede renovar. Para un incidente debe revocarse también la familia correspondiente.

Referencias: [jose](https://github.com/panva/jose), [rotación y detección de reutilización en RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html#section-4.14.2). Se aplican estos principios de protección de refresh; no se implementa un servidor OAuth.


## Alcance del middleware y validación — 30 de octubre de 2026

app.js conserva requestId, cabeceras de seguridad y manejo de errores/not-found como reglas globales. El router /api/v1/auth aplica noStore, adminRequest(config) y jsonBody() con 16 KiB. Las futuras rutas públicas no heredan cabecera admin, formato JSON ni no-store; cada módulo debe declarar su formato y límite antes de leer el cuerpo. No se crearon endpoints de consultas ni archivos en este cambio.

Helpers de middleware:
- adminRequest.js: origen/cabecera de cliente y noStore separado. No sustituye autenticación, roles ni CSRF. Puede reutilizarse en un upload administrativo sin exigir JSON.
- requestBody.js: jsonBody({ maxBytes }) combina formato JSON y límite; limitBody(maxBytes) sirve también para multipart. Los límites de uploads se definirán al implementar ese módulo.
- readInput.js: parsea JSON, valida el esquema y acepta una opción message para el mensaje general.
- validationMessages.js: traducción de errores y agrupación por campo; respeta mensajes específicos declarados en los esquemas.

authSchema.js contiene únicamente esquemas. JSON malformado responde 400; entrada inválida responde 422 con error.fields (mapa de campo a lista de mensajes). Campos anidados usan rutas como person.email; errores de raíz/campos adicionales se agrupan en _form. No se devuelven cuerpos recibidos ni el objeto de error Zod completo.

Ejemplo de error de correo:
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Revisa los campos enviados.",
    "fields": { "email": ["Introduce un correo válido."] }
  }
}
```
La respuesta real incluye también requestId. El rechazo de credenciales incorrectas conserva su mensaje genérico y no informa si la cuenta existe. Los futuros esquemas deben usar mensajes estáticos sin interpolar datos privados.

Se añadieron pruebas con rutas sintéticas para comprobar JSON público, multipart y límites independientes. No representan funcionalidad productiva de subida. Limpieza de registros y optimización de lastSeenAt siguen pendientes por alcance explícito del usuario.
