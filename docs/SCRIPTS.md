# Comandos del proyecto

Actualizado: 29 de octubre de 2026. Ejecutar desde la raíz de ipc-platform, usando Node/pnpm de Ubuntu cuando trabajes en WSL.

## Instalación y servidores

| Comando | Qué hace |
| --- | --- |
| pnpm install --ignore-scripts | Instala las dependencias del lockfile sin ejecutar scripts automáticos; Prisma se genera explícitamente después |
| pnpm dev:admin (también pnpm dev: admin) | Inicia solo el panel en http://localhost:5174/admin/ |
| pnpm dev | Inicia web pública, panel y backend; Ctrl+C detiene los tres |
| pnpm dev:backend | Inicia backend con Nodemon |
| pnpm dev:frontend | Inicia frontend con Vite |
| pnpm --filter backend start | Inicia backend sin recarga automática |
| pnpm build | Construye el frontend; el backend JS no requiere compilación |
| pnpm build:frontend | Construye solo frontend |

## Prettier y ESLint

| Comando | Qué hace |
| --- | --- |
| pnpm format:backend | Aplica formato Prettier al backend |
| pnpm format:check:backend | Comprueba formato sin modificarlo |
| pnpm lint:backend | Detecta problemas de JavaScript |
| pnpm lint:fix:backend | Corrige los problemas que ESLint puede arreglar automáticamente |

Prettier acomoda el formato y ESLint revisa código. Prisma usa su propio formateador para schema.prisma. La configuración del editor mantiene Prettier al guardar y ESLint mientras escribes.

## Prisma

| Comando | Qué hace | ¿Modifica datos/esquema? |
| --- | --- | --- |
| pnpm db:validate | Valida schema.prisma | No |
| pnpm db:format | Formatea schema.prisma | Solo el archivo |
| pnpm db:migrate --name nombre_del_cambio | Genera y aplica una migración de desarrollo | Sí; revisar cambios, especialmente eliminaciones |
| pnpm db:generate | Genera Prisma Client y su autocompletado | No, escribe archivos generados en node_modules |
| pnpm db:status | Consulta el estado de las migraciones | No |
| pnpm db:studio | Abre Prisma Studio para consultar/editar datos | Puede modificar datos si los editas en Studio |
| pnpm db:reset:check | Comprueba el destino permitido del reset | No |
| pnpm db:reset | Vacía la base local y reaplica migraciones, previa confirmación | **Sí: elimina todos los datos de desarrollo** |

### Al cambiar el modelo normalmente

1. Edita backend/prisma/schema.prisma.
2. Ejecuta:

~~~sh
pnpm db:format
pnpm db:validate
pnpm db:migrate --name describe_el_cambio
pnpm db:generate
~~~

Versiona el esquema y la nueva carpeta de migración. No edites ni borres migraciones ya compartidas/aplicadas por compañeros. Prisma 7 no genera automáticamente el cliente con migrate dev: por eso el último comando es explícito.

### Si quieres vaciar los datos de desarrollo

~~~sh
pnpm db:reset:check
pnpm db:reset
pnpm db:generate
~~~

El wrapper solo admite NODE_ENV=development, PostgreSQL local, base ipc_backend_dev y esquema public. Prisma pide confirmación; no se permite pasar --force mediante el wrapper. No se ejecutó un reset real durante esta configuración.

Reset NO borra las carpetas de migración: elimina los datos y reconstruye el esquema usando esos archivos. Es lo adecuado para empezar de nuevo con datos de prueba manteniendo un historial reproducible.

Borrar archivos de migración es otra operación: rompe el historial que utilizan tus compañeros y puede causar divergencia con la base. No es una tarea rutinaria ni se automatiza aquí. Para descartar un experimento aún no compartido, revisaremos su estado concreto antes de reorganizar el historial.

Reset tampoco aplica por sí solo cambios de schema.prisma que aún no tengan migración: para eso usa db:migrate.

## Conexión local

- Base activa: ipc_backend_dev.
- Base auxiliar de migraciones: ipc_backend_shadow; Prisma puede reconstruirla. No guardar datos de aplicación allí.
- Rol PostgreSQL: ipc_backend_app, sin privilegios de superusuario ni creación de bases.
- Configuración privada: backend/.env; no versionarla ni copiar su contraseña al chat.
- Ejemplo público sin credenciales reales: backend/.env.example.
- Configuración Prisma en JavaScript: backend/prisma.config.js.
- El entorno anterior está respaldado en .local/prisma-env-before-admin-20261029.env, también privado e ignorado.
- Las bases ipc_platform_* del primer intento se conservaron y no son el destino actual.

Prisma CLI ya se conecta a PostgreSQL. El servidor Hono conserva su respuesta inicial: todavía no consulta administradores ni implementa login. Instanciaremos Prisma Client en la aplicación cuando implementemos su primer uso real.

## Para otro integrante del equipo

Instalar PostgreSQL y crear una base de desarrollo y otra auxiliar propias, con un usuario autorizado sobre ellas. Copiar backend/.env.example a backend/.env y completar sus credenciales. Nunca apuntar SHADOW_DATABASE_URL a la base principal.

Después de instalar dependencias:

~~~sh
pnpm db:migrate
pnpm db:generate
pnpm dev
~~~

Este flujo es de desarrollo. El wrapper de reset está limitado al nombre ipc_backend_dev. No usar los comandos de desarrollo sobre una base institucional de producción.


## Registro y autenticación — comandos desde la raíz

| Comando | Qué hace |
| --- | --- |
| pnpm admin:bootstrap | Crea solo la primera cuenta pendiente; solicita nombre/correo y muestra código privado de 24 h. Rechaza sobrescribir cuentas |
| pnpm admin:activation | Reemite código a una cuenta pendiente por correo. Invalida códigos anteriores; nunca recupera contraseña de una cuenta activa |
| pnpm test:backend | Aplica migraciones y limpia/reutiliza exclusivamente las tablas de ipc_backend_auth_test para probar autenticación |

En backend/ los equivalentes son pnpm admin:bootstrap, pnpm admin:activation y pnpm test. No se creó una cuenta real automáticamente.

La base de pruebas se creó en WSL con propietario ipc_backend_app. En otro equipo debe crearla el operador PostgreSQL antes de probar:
`sudo -u postgres createdb --owner=ipc_backend_app ipc_backend_auth_test`.
El ejecutor toma credenciales de DATABASE_URL, exige host local y reemplaza el nombre por esta base de pruebas. No elimina migraciones ni modifica ipc_backend_dev.

Bruno y flujo completo: [authentication.md](backend/authentication.md). Los códigos de activación y las contraseñas son privados; no incluirlos en comandos, Git ni capturas.


## JWT y refresh — 30 de octubre de 2026

- `pnpm auth:key`: genera JWT_SECRET en backend/.env sin imprimirla; conserva una clave existente. En backend/ tiene el mismo nombre. Antes, crear .env desde .env.example y configurar PostgreSQL.
- `pnpm test:backend`: ahora ejecuta las suites de autenticación y JWT en serie, solo contra ipc_backend_auth_test.
- La migración jwt_refresh_rotation conserva cuentas y revoca sesiones del formato anterior. Iniciar sesión nuevamente en Bruno.
- La colección incorpora POST /refresh y GET /csrf. Guía vigente: [authentication.md](backend/authentication.md).


## MFA — 4/11/2026

- pnpm mfa:key: genera la clave independiente de cifrado MFA en backend/.env; no muestra ni sobrescribe una existente.
- pnpm test:backend: incluye ahora la suite MFA en la base aislada.
- Tras cambios de esquema: pnpm db:migrate y pnpm db:generate; no resetear cuentas.

Flujo de Bruno y limitaciones: [MFA](backend/mfa.md).
