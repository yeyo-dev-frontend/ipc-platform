# MFA: contrato vigente — 4 de noviembre de 2026

Esta guía sustituye el login directo descrito antes en authentication.md. MFA obligatorio para los tres roles. No cambia la contraseña ni elimina cuentas existentes.

## Flujo en Bruno

1. Ejecutar login con correo y contraseña. Responde **202**, sin JWT ni refresh; guarda challengeToken en memoria.
2. Si enrollmentRequired es true, agregar manualmente secret a una aplicación autenticadora TOTP (6 dígitos, SHA1, 30 segundos, emisor IPC). provisioningUri permitirá generar un QR local en el futuro panel; no usar servicios externos de QR.
3. Definir mfaCode en el entorno local privado de Bruno con el código actual. Ejecutar 09-mfa-verify antes de cinco minutos.
4. La respuesta 200 entrega accessToken, tokenType, expiresIn, csrfToken y cookie refresh HttpOnly. En el primer enrolamiento también entrega diez recoveryCodes, una sola vez. Guardarlos privadamente antes de cerrar la respuesta.
5. Continuar con me, refresh y logout existentes. En próximos logins se repiten contraseña y código, sin entregar nuevamente el secreto.
6. Si se pierde el autenticador, introducir uno de los recoveryCodes como mfaCode después del login. Se consume una vez y revoca las otras sesiones. No elimina ni reemplaza el factor configurado.

El código TOTP conserva ceros iniciales: enviarlo como string. Un código aceptado no puede reutilizarse; esperar el siguiente intervalo. Tras errores 429 esperar la ventana indicada por la política y realizar login de nuevo si expiró el desafío.

## Contrato HTTP

POST /api/v1/auth/login: entrada anterior; salida 202 con data { mfaRequired, enrollmentRequired, challengeToken, expiresIn: 300 } y, solo para enrolamiento, secret/provisioningUri. No crea sesión administrativa.

POST /api/v1/auth/mfa/verify: { challengeToken, code }. Admite seis dígitos TOTP o código de recuperación base64url de 43 caracteres. Devuelve tokens exclusivamente tras verificar ambos factores. 401 para código/desafío inválido, usado, vencido o cuenta inactiva; 422 formato incorrecto; 429 exceso de intentos. Exige JSON, X-IPC-Client: admin y las comprobaciones de origen del router. El desafío impredecible es una credencial breve y no autoriza otras rutas. No requiere CSRF de una sesión que aún no existe.

Refresh y logout conservan sus contratos y CSRF. No persistir JWT, desafío, secreto ni recuperación en archivos compartidos o localStorage.

## Persistencia y concurrencia

Admin almacena mfaSecret cifrado AES-256-GCM con IV aleatorio y AAD ligado a su UUID; mfaLastStep previene replay TOTP con ventana ±1 intervalo. La clave independiente vive exclusivamente en MFA_ENCRYPTION_KEY.

mfa_challenges guarda hash del token, huella de versión de contraseña, secreto pendiente cifrado, expiración y consumo. recovery_codes guarda solo hashes de códigos aleatorios de 256 bits. Confirmar enrolamiento, consumir OTP/código/desafío y crear sesión ocurre en una transacción con bloqueo de cuenta; todas las verificaciones pendientes de esa cuenta quedan consumidas al completar una. Un login posterior requiere nuevo desafío.

Máximo cinco verificaciones por desafío cada cinco minutos, diez por cuenta cada quince minutos, más límites globales/IP del router. MFA correcto permite el login auditado; enrolamiento y uso de recuperación generan eventos específicos sin secretos.

## Configuración y migración

pnpm mfa:key genera MFA_ENCRYPTION_KEY (32 bytes hex) en backend/.env sin mostrarla ni sobrescribir un valor existente. Es obligatoria y distinta de JWT_SECRET. Custodiar copia privada junto al procedimiento de restauración: cambiarla sin recifrar impide leer factores registrados. No versionarla.

La migración add_mfa añade campos/tablas y revoca sesiones anteriores; no borra cuentas ni contraseñas. El primer login existente exige enrolar MFA. Otros equipos: pnpm install, pnpm mfa:key, pnpm db:migrate, pnpm db:generate. No usar db:reset para actualizar.

## Alcance y pendientes

Implementado: enrolamiento obligatorio, TOTP, anti-replay, desafío temporal, recuperación de acceso por códigos y compatibilidad con JWT/refresh rotativo. Pendientes: reemplazar autenticador, regenerar códigos con reautenticación reciente, recuperación asistida con identidad verificada y procedimiento institucional por pérdida de todos los factores. No existe un bypass ni desactivación pública de MFA.

El panel visual, QR local y custodia guiada de recoveryCodes se implementarán después. Producción continúa bloqueada hasta revisar HTTPS/cookies, infraestructura y recuperación operativa; MFA implementado no implica despliegue listo. La limpieza periódica de desafíos/filas vencidas sigue pendiente.

## Verificación

48 pruebas reportadas aprobadas (incluidos contenedores): regresión JWT, enrolamiento concurrente, desafío sin permisos, cifrado ligado a cuenta, origen ajeno, replay TOTP, recuperación concurrente, expiración, cuenta inactiva y límites. Los helpers antiguos preparan el contador solo en la base aislada para probar JWT sin esperas; la suite MFA no hace ese ajuste y verifica anti-replay real.

Referencias: [OTPAuth](https://hectorm.github.io/otpauth/classes/TOTP.html), [OWASP MFA](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html).
