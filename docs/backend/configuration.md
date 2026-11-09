> Actualización 4/11/2026: MFA obligatorio implementado. El contrato de login y los nuevos modelos/configuración se detallan en [mfa.md](mfa.md); prevalece sobre descripciones anteriores de login directo o MFA pendiente.

# Estado actualizado: Prisma configurado

## JWT — 30 de octubre de 2026

Clave JWT local generada en backend/.env y excluida de Git. En otro equipo, configurar .env y ejecutar pnpm auth:key; el comando no muestra el valor ni sustituye una clave existente. La API rechaza claves con formato inválido. Cambiar la clave invalida los JWT y CSRF anteriores, pero no revoca por sí solo las familias de refresh.

Duraciones centralizadas en src/modules/auth/authSettings.js: access 10 minutos, inactividad 30 minutos, máximo absoluto 8 horas. Emisor ipc-backend y audiencia ipc-admin son constantes del servidor. Algoritmo permitido HS256 y tipo at+jwt. No se toma algoritmo ni clave de una petición.


## Autenticación inicial — configuración vigente

src/config/env.js carga backend/.env con la API nativa de Node y valida mediante Zod. Hono conecta Prisma antes de abrir el puerto. Los secretos no tienen valores de respaldo.

| Variable | Tipo / obligación | Propósito |
| --- | --- | --- |
| JWT_SECRET | 64 caracteres hexadecimales, obligatoria, secreta | 32 bytes aleatorios para firma HS256 y derivación separada de CSRF; generar con pnpm auth:key |
| DATABASE_URL | URL PostgreSQL, obligatoria, secreta | Conexión del servidor y Prisma |
| SHADOW_DATABASE_URL | URL PostgreSQL, necesaria para migrate dev, secreta | Base auxiliar de migraciones; nunca la principal |
| NODE_ENV | development por defecto; test permitido | production bloqueado hasta completar MFA |
| ADMIN_ORIGIN | Origen HTTP(S), por defecto http://127.0.0.1:3000 | Validación exacta de Origin; sin ruta ni barra final |
| PORT | Entero 1–65535, por defecto 3000 | Puerto de Hono en 127.0.0.1 |
| TEST_DATABASE_URL | URL interna del ejecutor de pruebas, secreta | Exclusivamente ipc_backend_auth_test; no configurar para el servidor |

No se confía en X-Forwarded-For; debe revisarse junto con proxy, HTTPS y origen antes del despliegue. No se habilitó CORS ni se integró el frontend. Las notas siguientes corresponden a etapas anteriores.


Desde el 29 de octubre de 2026, Prisma ya está configurado con PostgreSQL/WSL y tabla admins por solicitud del usuario. Los comandos vigentes están centralizados en [../SCRIPTS.md](../SCRIPTS.md), y la tabla en [dataModel.md](dataModel.md). Las notas de inicialización siguientes son históricas cuando dicen que Prisma está pendiente. El servidor Hono sigue mínimo y sin rutas de negocio.

# Backend: inicio paso a paso

Estado del 29 de octubre de 2026: únicamente inicialización del proyecto.

## Qué hay

- Hono: aplicación y respuesta inicial.
- @hono/node-server: ejecuta Hono en Node.
- Nodemon: reinicia el backend al guardar cambios.
- Prettier: mantiene el formato del código.
- Prisma y @prisma/client: instalados para una etapa posterior, sin configuración ni ejecución en esta nueva base.

El código propio está únicamente en backend/src/index.js. Crea Hono, define una respuesta de bienvenida GET / y escucha en 127.0.0.1:3000. Todavía no se divide en app, servidor, servicios o módulos.

## Comandos desde la raíz

~~~sh
pnpm install --ignore-scripts
pnpm dev
~~~

La instalación sin scripts evita ejecutar automáticamente herramientas de dependencias; no inicializa ni genera Prisma. Cuando abordemos Prisma, habilitaremos conscientemente los pasos necesarios.

- pnpm dev: inicia frontend y backend; Ctrl+C detiene ambos.
- pnpm dev:backend: inicia solo backend con Nodemon.
- pnpm dev:frontend: inicia solo frontend.
- pnpm --filter backend start: backend sin recarga automática.
- pnpm format:backend: aplica Prettier únicamente al backend.
- pnpm format:check:backend: comprueba el formato sin modificar archivos.
- pnpm build: construye el frontend. El backend actual se ejecuta directamente como JavaScript.

En WSL usa Node/pnpm de Linux. El entorno probado tiene Node 24; no se exige aprender NVM para esta etapa.

## Archivos

- package.json: dependencias y comandos.
- src/index.js: aplicación mínima y arranque.
- .prettierrc.json: reglas de formato.
- .prettierignore: excluye dependencias y entornos privados del formateo.

Se retiró .nvmrc: era una indicación de versión para la herramienta NVM, no parte del servidor.

## Trabajo anterior conservado

Se retiraron configuración avanzada, health/readiness, módulos, migraciones, pruebas y colección Bruno del backend activo. Copia local en .local/backend-before-reset-20261029/, ignorada por Git.

Las bases PostgreSQL creadas previamente y backend/.env privado permanecen intactos, pero este servidor no los carga ni se conecta a ellos. No se ejecutó Prisma ni se modificaron bases durante esta simplificación. Un cliente generado previamente puede seguir como artefacto ignorado en node_modules; no se usa en el servidor.

Próximo paso: comprender este arranque y acordar la organización mínima antes de incorporar rutas funcionales, validación, autenticación o base de datos.


## ESLint: avisos mientras escribes

Configurado únicamente para backend en eslint.config.js, con reglas recomendadas de JavaScript y variables globales de Node/ESM. Detecta, por ejemplo, variables sin usar y nombres no definidos. Prettier sigue encargado del formato; no se añadieron reglas de estilo duplicadas ni integración eslint-plugin-prettier.

Desde la raíz:

- pnpm lint:backend: revisar el código.
- pnpm lint:fix:backend: corregir únicamente problemas que ESLint pueda arreglar automáticamente.

En el workspace local .vscode/settings.json, eslint.run = onType activa revisión mientras escribes y workingDirectories en modo auto permite localizar las configuraciones separadas de backend y frontend. La extensión ESLint debe estar habilitada en el editor/entorno donde se abre el proyecto. Si no aparecen avisos, ejecutar ESLint: Restart ESLint Server desde la paleta de comandos. No se habilitaron correcciones automáticas de ESLint al guardar; Prettier conserva ese paso.

La carpeta .vscode sigue ignorada por Git; las reglas y dependencias del backend sí quedan en archivos compartibles. Los compañeros pueden aplicar esos dos ajustes en su propio editor.

## Autocompletado JavaScript

backend/jsconfig.json delimita los archivos src/**/*.js y configura resolución NodeNext para los imports ESM. checkJs está desactivado: no se añade comprobación general de tipos, TypeScript ni JSDoc. El autocompletado depende de la información que pueda inferir el editor; los modelos de Prisma requerirán definir o introspectar el esquema y generar su cliente en la etapa correspondiente.

Siguiente paso solicitado: configurar Prisma contra el PostgreSQL y la base que indique el usuario. Confirmar destino y si contiene tablas antes de elegir introspección o migraciones; no reutilizar automáticamente las bases creadas en el intento anterior.
