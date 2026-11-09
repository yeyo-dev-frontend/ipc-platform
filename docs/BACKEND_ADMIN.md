# Backend y administración: punto de entrada

Actualizado: 8 de noviembre de 2026, America/Lima.

## Panel visual

El panel React/Vite en `admin/` envía correo y contraseña a la API. Un 202 abre la configuración manual del autenticador o la pantalla de código según `enrollmentRequired`. La verificación acepta TOTP y, para cuentas ya configuradas, un código de recuperación. El escritorio muestra el nombre y el rol devueltos por la API después del 200. En el primer acceso, el usuario debe confirmar que guardó sus diez códigos antes de entrar.

Para probarlo localmente, usar `pnpm dev` y abrir http://localhost:5174/admin/. Vite reenvía las solicitudes de autenticación a 127.0.0.1:3000 conservando el origen. Si el archivo local `backend/.env` define el origen anterior, cambiarlo a `ADMIN_ORIGIN=http://localhost:5174` y reiniciar la API. `pnpm dev:admin` inicia solo el panel; el login necesita también la API y su PostgreSQL configurado.

Se verificó la compilación con `pnpm build:admin`. En Edge se probó la distribución compilada con Hono y PostgreSQL local en `ipc_backend_auth_test`, usando cuentas temporales. Se cubrieron el código incorrecto seguido de un reintento válido, el enrolamiento, la confirmación de los diez códigos, el escritorio con el rol de la cuenta, el acceso posterior por TOTP y la recuperación con rechazo de un código ya usado. También se comprobó el retorno al acceso ante un 429 real y al adelantar el reloj del navegador hasta el vencimiento del desafío.

## Estado real

MFA TOTP obligatorio implementado el 4 de noviembre. Login ahora devuelve 202 con desafío temporal; POST /mfa/verify entrega JWT/refresh tras segundo factor. Cifrado independiente, anti-replay y códigos de recuperación de un solo uso. Contrato vigente: [mfa.md](backend/mfa.md).

Retirada la ruta POST / de demostración el 30 de octubre; responde 404. GET / se conserva como comprobación básica del servidor.

Registro por invitación, activación, permisos y logout implementados. El usuario pidió expresamente JWT + refresh rotativo para el curso el 30 de octubre: access JWT HS256 de diez minutos, refresh opaco HttpOnly con historial de hashes en Prisma y revocación ante reutilización. Las sesiones/familias siguen venciendo tras treinta minutos inactivas u ocho horas absolutas. JWT se envía como Bearer y también se comprueba la familia en BD.

Migración jwt_refresh_rotation aplicada: añade refresh_tokens, retira tokenHash de sessions y revoca las sesiones del formato previo. Cuentas y contraseñas conservadas; se requiere nuevo login. JWT_SECRET generada privadamente en .env; comando auth:key para otros equipos. No mostrar ni versionar secretos.

POST /refresh y GET /csrf añadidos; logout funciona con cookie + CSRF incluso sin JWT vigente. Bruno actualizado con variables de ejecución para JWT/CSRF y cookie jar para refresh. Los valores personales que estaban en peticiones compartidas se trasladaron a environments/local.bru, ignorado por Git.

MFA implementado por petición del usuario; producción sigue bloqueada por revisión de despliegue y recuperación operativa. Guía vigente y contratos: [authentication.md](backend/authentication.md). Esta elección de JWT reemplaza las recomendaciones anteriores de sesiones opacas sin refresh en referencias históricas de la skill.

## Decisiones

Confirmado: IPC exclusivo; tres roles admin/admissions/events; correo/contraseña, MFA, auditoría, eventos/medios, todo contenido institucional editable con preview/historial y consultas. Sin registro público, inscripciones, asistencia ni integración Q10 en V1.

Confirmado: JS moderno con async/await, sin TS/JSDoc. Código inglés, textos/docs español, docs separados. ES6 no significa ES2015 estricto.

Base actual: Hono/Node + PostgreSQL/Prisma + Zod, monolito modular; admin/ como app en /admin y API /api/v1; JWT con refresh rotativo y familias revocables, TOTP implementado y SSE previsto. Hosting pendiente, sin obligación Cloudflare.

Objetivo: semana del 20 de diciembre de 2026 (aproximada), tres integrantes, etapas. API/Bruno antes de UI.

## Guía y referencias

- [Skill IPC backend/admin](skills/ipc-backend-admin/SKILL.md)
- [Alcance, roles y pendientes](skills/ipc-backend-admin/references/scope.md)
- [Arquitectura y contratos propuestos](skills/ipc-backend-admin/references/architecture.md)
- [Seguridad y operación](skills/ipc-backend-admin/references/security.md)
- [Etapas, equipo y continuidad](skills/ipc-backend-admin/references/workflow.md)
- [Revisión del proyecto docente correcto](skills/ipc-backend-admin/references/classroomReview.md)

Estas decisiones superan las referencias históricas Express/ES6 estricto para backend nuevo. No autorizan migraciones masivas del sitio público.

## Siguiente tarea

Conectar la restauración y renovación de la sesión con refresh rotativo y el cierre de sesión con CSRF. Por ahora, una recarga o el vencimiento del JWT en el escritorio vuelve al formulario. La API controla las operaciones autorizadas.

## Pendientes

Dominio/hosting, características/responsable del posible servidor, presupuesto, correo institucional, cuentas iniciales, retención y mantenimiento. No bloquean desarrollo local; resolver antes de producción. Login social/subida de video sujetos a viabilidad/costo, no requisitos cerrados.

Retención sugerida 12 meses desde cierre pendiente de aprobación; backups diarios propuestos implican hasta 24 h de pérdida, no pérdida cero. RPO/RTO definitivos pendientes.

## Verificación de la base implementada

Las pruebas de la implementación anterior son históricas y ya no describen el backend activo. Verificado: Prettier correcto; pnpm dev inició Nodemon/Hono y Vite, ambos respondieron HTTP 200; los procesos de comprobación quedaron detenidos. No se ejecutó Prisma ni se modificaron bases durante este reinicio.

## Registro del diseño previo

Creada skill específica/portable y referencias; original hono-cloudflare.md preservada. Proyecto docente login revisado estáticamente sin modificarlo. Sin cambios de aplicación, dependencias o servicios externos. Validación completada: quick_validate.py oficial correcto, enlaces locales y metadatos UI correctos, 7 archivos de skill idénticos entre copia repo e instalación personal, git diff --check sin errores (solo avisos de finales de línea). Copia personal instalada en C:/Users/fusta/.codex/skills/ipc-backend-admin/. AGENTS.md y ESTADO_PROYECTO.md enlazan este punto de entrada. No se hicieron commit ni push; compartir estos cambios por Git antes de trabajar desde otro equipo.

## Continuar en otro chat

> Lee AGENTS.md, docs/BACKEND_ADMIN.md y docs/skills/ipc-backend-admin/SKILL.md. Continúa con [tarea concreta], revisando código actual y conservando cambios locales. Actualiza estado y contratos al terminar.

Si la IA no tiene acceso al repo, adjuntar estos documentos y carpeta de skill. Las decisiones viven en archivos versionables, no en memoria de conversación. Tras cada tarea actualizar implementación, pruebas, pendientes y siguiente paso.


## Herramientas de edición — 29 de octubre de 2026

ESLint configurado para backend con reglas recomendadas, entorno Node y comandos lint/lint:fix. Extensión configurada localmente para revisar mientras se escribe; Prettier sigue formateando al guardar. Frontend, servidor y Prisma no se modificaron en este paso.

## Autocompletado — 29 de octubre de 2026

Añadido backend/jsconfig.json con NodeNext, ESNext y checkJs desactivado. Solo configura el editor; no se conectó PostgreSQL ni se ejecutó Prisma en este paso.


## Prisma y administradores — 29 de octubre de 2026

Configuración autorizada por el usuario: base nueva local, únicamente admins con roles admin/admissions/events y scripts de Prisma. db:reset conserva archivos de migración, limita destino local y requiere confirmación de Prisma; no se ejecutó destructivamente. Verificado: migración aplicada y estado al día, cliente generado, esquema válido, ESLint/Prettier correctos; tabla admins vacía y tres roles presentes. El wrapper rechazó production, destinos remotos, otras bases y --force sin ejecutar reset. Credenciales y respaldo excluidos de Git.

## Arquitectura de carpetas — 29 de octubre de 2026

Por petición explícita del usuario y tras contrastar `Documentación_Proyecto_web_IPC_v01.docx`, se crearon las carpetas del backend con `.gitkeep`: `bruno/`, `tests/` y, dentro de `src/`, `config/`, `middleware/`, `infrastructure/` (`database/`, `storage/`, `mail/`), `jobs/` y `modules/` (`auth/`, `admins/`, `careers/`, `documents/`, `events/`, `media/`, `content/`, `inquiries/`, `audit/`). Se incorporan `careers` y `documents` como módulos propios manteniendo Hono, JavaScript moderno y las decisiones actuales. Explicación completa en [architecture.md](backend/architecture.md). No se añadieron rutas ni lógica en este paso.

## Revisión de estructura y demostración de clase — 29 de octubre de 2026

Se verificaron las carpetas preparadas y se conservaron las rutas GET / y POST / añadidas para clase. POST / solo devuelve el JSON recibido y no persiste datos; no es todavía un contrato de negocio ni valida entradas para producción. La guía de arquitectura distingue carpetas vacías de funcionalidades implementadas y explica los límites entre carreras, documentos, medios y contenido. Siguiente paso: explicar y acordar la primera implementación pequeña con el usuario.


## Registro y autenticación inicial — 29 de octubre de 2026

Se añadió Argon2id, Zod y el adaptador PostgreSQL de Prisma. Servicios/repositorio/rutas separados, validación estricta, contraseñas nunca expuestas, invitaciones solo con hash en BD, sesión revocable y consulta de rol actual. Reemisión de invitaciones vencidas por admin o por CLI local autorizado, solo para cuentas pendientes. Auditoría mínima de operaciones exitosas; no registra secretos. La primera cuenta real queda a cargo del usuario.

Pruebas con PostgreSQL aislado: concurrencia de bootstrap/activación/registro, roles, duplicados, campos extra, origen/CSRF, expiración, logout, límites, reemisión y errores internos. Ver el resultado final de pnpm test:backend. Colección Bruno preparada para ejecución manual; no afirmar que se ejecutó en la aplicación.

Verificación final: pnpm test:backend reportó 19 pruebas aprobadas (incluido el contenedor de la suite); ESLint y Prettier correctos; dos migraciones al día. Arranque Node/PostgreSQL comprobado por HTTP en un puerto temporal: GET / 200, POST / de clase 201 y /api/v1/auth/me sin sesión 401. Proceso temporal detenido.


## Modularización de persistencia — 29 de octubre de 2026

authRepository.js pasó de 169 a 15 líneas y ahora compone repositorios por responsabilidad: registro (40), activaciones (57), sesiones (49) y límites (22). La consulta de cuentas vive en admins/adminRepository.js; auditoría en audit/auditRepository.js. sessionPolicy.js centraliza la comprobación transaccional de permisos repetida.

Se mantienen métodos del servicio, rutas, respuestas, bloqueos y límites transaccionales. No se modificó el esquema ni se crearon migraciones. Verificado: las 19 pruebas reportadas pasan en la base aislada y ESLint correcto; archivos modificados formateados con Prettier. La suite de pruebas se mantiene intacta como regresión del comportamiento.


## JWT académico y refresh rotativo — 30 de octubre de 2026

Solicitud explícita del usuario, posterior a la propuesta inicial de sesiones opacas. Implementados con jose, validación estricta de algoritmo/tipo/emisor/audiencia/claims/expiración, Bearer y consulta de rol actual. Servicios pequeños por responsabilidad; refreshRepository confirma la revocación antes de responder al replay. No se modificó el frontend.

Verificación: suite reportó 31 pruebas aprobadas (incluidos dos contenedores); ESLint correcto. Incluye registro anterior, firmas manipuladas, alg none, claims incorrectos, tokens vencidos, rotación, reutilización, concurrencia, logout y CSRF. Detalles y límites actuales en la guía de autenticación.


## Middleware por módulo y validación compartida — 30 de octubre de 2026

Implementadas únicamente las dos mejoras solicitadas: adminRequest/noStore/jsonBody de 16 KiB se aplican al router auth, no a toda la API; el POST de clase conserva su propio límite. requestId, secureHeaders y errores siguen globales. No se añadieron rutas públicas ni uploads reales.

readInput se extrajo a middleware y authSchema quedó limitado a esquemas. Errores 422 incluyen fields por campo en español, sin valores recibidos; JSON inválido sigue en 400 y credenciales incorrectas mantienen su mensaje genérico. Helper reutilizable con mensaje general personalizable.

Verificado: 40 pruebas reportadas aprobadas (incluidos contenedores), ESLint correcto. Nuevas pruebas cubren aislamiento de middleware, JSON público, multipart, límites propios, errores por campo, normalización y mensajes personalizados. No se modificaron Prisma, limpieza de registros ni escrituras de lastSeenAt.

## Retiro de demostración — 30 de octubre de 2026

Eliminado el POST / que devolvía el JSON recibido y sus imports exclusivos de app.js. Actualizada su prueba para exigir 404 sin eco de datos. Se conservan GET /, autenticación, herramientas de desarrollo, pruebas y carpetas aprobadas para los futuros módulos. Las menciones anteriores al POST de clase son históricas.


## MFA — 4 de noviembre de 2026

Implementación y límites en [mfa.md](backend/mfa.md). 48 pruebas reportadas aprobadas y ESLint correcto. Nueva clave privada creada sin exponerla; migración añade MFA y revoca sesiones previas conservando cuentas. Bruno actualizado con variables, sin credenciales literales. Sin cambios al frontend ni publicación.
