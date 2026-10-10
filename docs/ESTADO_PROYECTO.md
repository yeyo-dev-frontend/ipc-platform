# Estado y evolución de IPC Platform

### Corrección de distribución y desplegables — 10 de octubre de 2026

Modal y Admisión comparten el mismo ContactForm compacto por filas: nombre/correo, teléfono/dirección, carrera/turno y mensaje a todo el ancho. Inicio conserva sus grupos. Se corrige la distribución vertical de carrera/turno introducida al extraer los grupos. Los select siguen siendo nativos y de peso normal, con cursor de selección, flecha azul y, en la variante clara, borde visible y respuesta al hover/foco. No se crea un menú personalizado ni otro formulario.

### Unificación del formulario original — 10 de octubre de 2026

Se elimina organisms/shared/contactForm y su variante signature. La composición original por grupos se concentra en molecules/shared/contactForm, consumida por HomeMessage, ModalMessage y AdmissionsContactForm. Se conservan el catálogo, hook, Toast, ContactSteps y botón danger. Layout home mantiene la distribución original de Inicio; compact distribuye los grupos del modal en dos columnas desde sm y una en móvil. La variante light solo adapta superficies y colores para Admisión.

AdmissionsContact solo compone AdmissionsContactIntro y AdmissionsContactForm, en molecules/admissions; se conservan la imagen y los ajustes locales del marco y textos. Select muestra opciones con Poppins regular (400), sin la negrita anterior. No cambia el contrato HTTP ni los valores de carreras/turnos. Las notas anteriores sobre el formulario alternativo quedan sustituidas por esta organización.

### Restitución del botón Enviar — 10 de octubre de 2026

Por petición del usuario, AdmissionsContact y ModalMessage vuelven al botón predeterminado de ContactForm: Button danger con el texto «Enviar», esquinas opuestas redondeadas y hover naranja. Se retira la activación de signature en ambos consumidores. Inicio y el átomo Button no se modifican; se conserva la imagen exclusiva del formulario.

### Alcance del botón de contacto — 10 de octubre de 2026

El diseño de cápsula queda dentro de ContactForm y se activa explícitamente con submitStyle="signature" solo en AdmissionsContact y ModalMessage. submitLabel conserva «Solicitar información» en Admisión y «Enviar» en los modales. El valor predeterminado standard reutiliza Button danger; se retira la variante global action. HomeMessage y los demás botones conservan su diseño.

### Contacto: botón e imagen propios — 10 de octubre de 2026

ContactForm usa la nueva variante compatible `Button action`: cápsula azul, flecha en círculo claro, acento naranja en hover/foco y estado de envío con icono de carga que respeta movimiento reducido. Admisión y modal comparten el diseño. AdmissionsContact sustituye la fotografía repetida por `admissions-advising.png`, generada con ImageGen para esta sección; prompt y condición ilustrativa en assets/images/admissions/README.md. Se conserva Image y su respaldo institucional.

## Admisión: cierre de contacto — 10 de octubre de 2026

Verificación: build, ESLint del alcance y diff --check correctos. Revisadas la sección a 1440/320 px y la apertura/cierre del modal a 390 px, sin desbordamiento horizontal; 14 controles simultáneos con 14 IDs únicos. Un envío vacío muestra siete errores y un resumen accesible sin llamar a la API. No se enviaron datos ni se certificó recepción en backend.

`AdmissionsContact` cierra la página tras la guía con fondo claro, imagen ilustrativa existente mediante Image y formulario. No incluye Yape ni pagos. `ContactForm({ appearance, showSteps, onCancel })`, en organisms/shared, reutiliza CONTACT_FORM_GROUPS, FormField y useContactForm; lo consumen Admisión (light) y ModalMessage (dark, con pasos y cancelar). Inicio conserva su composición, campos y hook compartidos.

FormField relaciona etiquetas, controles y errores mediante useId, admite errores booleanos o mensajes, y aporta autocompletado. useContactForm conserva mensajes de validación en fieldErrors y no borra datos tras fallar el envío. El contrato de campos permanece: nombre completo, correo, teléfono, dirección, carrera, turno y mensaje, todos requeridos por el validador existente. No se agrega almacenamiento ni una API nueva: el envío real sigue pendiente de la API /contact configurada en localhost:3000; la validación de correo existente sigue limitada a gmail/hotmail/yahoo. La página indica que la consulta no completa la inscripción.

### Guía de admisión: curva y acentos azules — 10 de octubre de 2026

El ajuste posterior cambia el remate a `BannerBgCurve` diseño 6, una onda asimétrica clara con banda azul institucional. Título destacado, numeración, requisitos y modalidad usan `blue-light` para mantener contraste sobre el fondo casi negro; el naranja se conserva únicamente en el antetítulo «Guía de admisión». No cambia la estructura, las imágenes ni el contenido.

### Ajuste visual de la guía de admisión — 10 de octubre de 2026

La petición posterior sustituye `blue-deep` por el token `charcoal` (#121416), casi negro, y elimina las esquinas redondeadas. El remate inferior reutiliza `BannerBgCurve` diseño 7 con bandas azul institucional/naranja y base clara; no se modifica el componente compartido. Se incorporan dos imágenes ilustrativas existentes (estudiantes de Sobre nosotros y preparación de Traducción), centralizadas en `admissionProcessImages` y renderizadas mediante `Image`, con alt descriptivo, espacio reservado y respaldo institucional. Se mantienen requisitos, pasos, modalidad, turnos y ausencia de botones. Build y ESLint del alcance correctos; persiste la advertencia conocida del bundle.

## Admisión: guía del proceso — 10 de octubre de 2026

Implementado `AdmissionsProcess` después de `AdmissionsExam`: una sección continua sobre `blue-deep`, con entrada curva sobre el azul institucional y salida curva hacia el fondo claro de futuros bloques. Composición editorial con requisitos a la izquierda, cuatro pasos numerados a la derecha y modalidad al pie; en móvil se lee en una columna. Sin botones, formulario ni nuevas dependencias.

`data/admissions/process.js` centraliza requisitos y pasos procedentes de la maqueta, y la modalidad presencial para todas las carreras con turnos mañana/tarde/noche, confirmada por el usuario en esta sesión. Los requisitos de la maqueta siguen siendo contenido de referencia; no se añaden plazos, métodos de pago, horarios por carrera ni condiciones de matrícula. `AdmissionsRequirements` y `AdmissionsProcessSteps` presentan las listas reutilizando Title y Paragraph. El formulario inferior queda pendiente para una tarea posterior.

Referencia visual consultada: [Ochi](https://ochi.design/), por su jerarquía tipográfica y composición editorial; la paleta, curvas y contenido se adaptan al IPC. ESLint del alcance y build correctos, con el aviso de tamaño del bundle ya existente. Inspección visual a 1440, 390 y 320 px, sin desbordamiento horizontal ni errores de consola; comprobada la ausencia de botones y enlaces en esta sección.

## Admisión: tarjeta de costos tipo cuaderno — 10 de octubre de 2026

`PriceSummaryCard` presenta una hoja azul institucional con perforaciones transparentes, esquina doblada azul claro y sombra suave. Conserva sus props y el catálogo de importes; muestra la moneda antes del valor, conceptos encima en escritorio y filas en móvil. `AdmissionsHero`, su único consumidor actual, utiliza «Inversión en tu formación», elimina la frase inferior y limita el ancho a `max-w-5xl`. La geometría está aislada en las clases `price-summary-note` de `index.css`; no se añaden imágenes ni dependencias.

ESLint del alcance y build correctos (persiste el aviso de tamaño del bundle). Vista revisada en escritorio y móvil, sin desbordamiento horizontal a 1440 y 320 px ni errores de consola.

## Modularización del afiche — 9 de octubre de 2026

`AdmissionsExamCard` queda como composición de 26 líneas: `AdmissionsPosterHeader` agrupa fotografía y títulos, `AdmissionsPosterRegistration` presenta fecha, contacto y botón, y `AdmissionsPosterCareers` resuelve el listado desde el catálogo compartido. `AdmissionsPosterPhoto` mantiene el encuadre y reutiliza `BannerBgCurve` diseño 9 para las tres superficies curvas; se elimina el SVG inline de la tarjeta. La geometría, los colores, `@container`, datos y callback del modal se conservan. ScrollReveal sigue en el organismo de la sección.

ESLint del alcance y build correctos; persiste la advertencia conocida del tamaño del bundle.

## Admisión: sección de examen — 8 de octubre de 2026

Versión vigente del afiche: por indicación del usuario se implementa en JSX y SVG editables, conservando fecha «05 ABRIL», teléfono, dirección, orden de carreras y composición de la referencia. `AdmissionsPosterPhoto` encuadra la región fotográfica de `exam-reference.png` mediante CSS y aplica curvas SVG con naranja institucional. No se utiliza la generación intermedia del afiche completo. `AdmissionsExamCard` presenta títulos, datos de contacto, iconos y botón reales; las carreras se derivan del catálogo compartido en el orden del afiche. Fecha, teléfono y dirección viven en `data/admissions/exam.js`. Se conservan ScrollReveal, el contenido izquierdo y el modal abierto por «Inscripciones». Esta versión sustituye las notas previas sobre fecha pendiente y curva compartida de esta tarjeta.

Corrección posterior: la curva local se sustituye por `BannerBgCurve` diseño 8, con viewBox de 190 unidades para contener toda la base blanca y evitar el recorte horizontal de las bandas. `AdmissionsExam` reutiliza `ScrollReveal` para las entradas de texto y tarjeta, sin lógica de animación nueva. Build y ESLint del alcance correctos; unión curva inspeccionada en escritorio y 390 px, animaciones completadas con opacidad 1 y transform none, apertura/cierre del modal móvil verificados. Movimiento reducido se conserva mediante el componente compartido (revisión de código).

Se añade `AdmissionsExam` debajo del hero en `/admissions`. Compone `AdmissionsExamContent` (introducción y orientación) y `AdmissionsExamCard` (afiche editable con foto, curva institucional, convocatoria y carreras). Los textos y la imagen se configuran en `data/admissions/exam.js`; las carreras proceden del catálogo compartido. Azul `blue-dark`, naranja `orange`, fuentes Poppins/Hani e imágenes con `Image` y respaldo institucional.

Ambos botones nuevos abren el `ModalMessage` ya montado en la página, mediante el mismo callback del hero. La tarjeta es una adaptación en HTML de la referencia; reutiliza una imagen ilustrativa existente de estudiantes. Se muestra «Fecha por confirmar» hasta confirmar la convocatoria vigente; no se trasladan el teléfono ni la fecha del afiche de referencia como datos oficiales. No se añade una descarga sin documento de admisión confirmado. El hero y la tarjeta de precios conservan sus ajustes locales.

Verificados ESLint del alcance y build (advertencia conocida de tamaño del bundle), anchos 320/390/768/1440 sin desbordes, presentación en escritorio/móvil y apertura/cierre del formulario desde las dos acciones. Sin errores de consola; no se enviaron datos.

## Admisión: hero — 8 de octubre de 2026

Ajuste responsive de la tarjeta: importes de 28 px por debajo de 375 px, 30 px desde 375 px, 48 px desde 640 px y 60 px desde 1024 px. Moneda e importe se mantienen en una línea; el título pasa a compartir fila con los precios desde 1024 px. Se conservan las reducciones locales del usuario en alturas del hero, padding de la tarjeta y separación del texto inferior. Comprobados anchos 320/390/768/1024/1440 sin desbordes de página ni de las columnas de precios, e inspección visual a 320 px. Build y lint del alcance correctos; persiste la advertencia conocida del bundle.

Modularización posterior: `AdmissionsHero` compone `Image`, `AdmissionsHeroContent` (textos y CTA) y `PriceSummaryCard` (tarjeta compartida por props); esta última sustituye a `AdmissionsFees`. Los precios siguen procediendo de `ServicesAcademic`, pero la tarjeta ya no depende del catálogo ni de Admisión. La superposición se configura en el organismo. Se corrige la frase promocional de `font-serif` a `font-hani` (Rajdhani local); título, descripción y botón mantienen Poppins. No cambia el flujo del modal.

Actualización posterior: se adopta la paleta de la referencia (oscurecimiento negro, título blanco y botón azul), sustituyendo sus amarillos por `orange`. `AdmissionsFees` añade la franja negra sobresaliente y reutiliza `data/ServicesAcademic.js` (100/100/200 soles), sin duplicar el catálogo de Inicio. La fotografía se sustituye por `assets/images/admissions/admissions-classroom.png`, generada con ImageGen; su README conserva el prompt y la identifica como ilustración. Conservados `Image`, su respaldo institucional y el modal compartido. Verificados build, lint del alcance, presentación a 1440/390 px sin desbordes, apertura/cierre del modal y consola sin errores. Las notas siguientes describen la primera versión y quedan sustituidas en estilo, imagen y precios por este ajuste.

Implementado únicamente el hero de `/admissions`, en `organisms/admissions/admissionsHero.jsx`. Conserva la composición centrada y el año 2027 de la referencia visual, con tokens azul institucional/naranja y una fotografía existente de estudiantes. `Image` mantiene el fondo `bg-blue-dark` cuando no hay imagen o falla la carga. El año y el texto del examen proceden de la referencia de diseño; no constituyen un cronograma confirmado.

`AdmissionPage` compone el hero y reutiliza `useModal` y `ModalMessage`, igual que Inicio. «¡Inscríbete!» abre el formulario de asesoría existente; no representa una matrícula completada. No se añadieron precios ni otras secciones. El envío sigue sujeto a la API pendiente del formulario compartido.

Verificación: ESLint de los componentes nuevos/modificados y build correctos; persiste la advertencia de tamaño del bundle. Hero inspeccionado en navegador a 1440 y 390 px, sin desbordamiento horizontal; apertura y cierre con Cancelar verificados en ambos tamaños, sin errores de consola. No se realizó envío de datos.

## Estado vigente — 5 de octubre de 2026

Revisión de main en `dbf2f02`, con el árbol limpio al iniciar. Consulta [REVISION_2026-10-05.md](REVISION_2026-10-05.md) para hallazgos, evidencias y verificaciones actuales. Las secciones fechadas del 29 de septiembre y las notas posteriores se conservan como historial; sus contratos y estados pueden haber sido sustituidos por actualizaciones más recientes.

| Área | Situación actual |
|---|---|
| Computación | Página desarrollada, animaciones reversibles, seis temas y PDF de referencia |
| Nosotros | Hero, descripción, misión/visión, valores, equipo y relato de inicio |
| Eventos | Hero, selector de tres eventos, contador y seis destacados; acciones pendientes de conexión |
| Compartidos | MyTemplate acepta className y alias classmame con overflow-x-clip; curva en curvePath.jsx; carrusel con withTransition |
| PDF | AcademicDocumentCard obtiene document.pdfUrl y muestra isReference o estado pendiente |
| Traducción de Idiomas | Página desarrollada; áreas orientativas, imágenes generadas y documentos oficiales pendientes |
| Rutas pendientes | Admisión, Contacto y Contabilidad siguen como páginas de título |
| Backend | Sigue sin implementación en este checkout |
| Validación actual | Build pasa, 692 módulos; lint conserva 2 errores; navegador no verificado en esta sesión |

Pendientes principales: conectar acciones de Eventos/Equipo; usar Image en sus nuevas fotos; corregir event.title inexistente; respetar pausa/foco y excluir clones del equipo de la navegación por teclado. JS principal: 1.416,05 kB (434,95 kB gzip), con advertencia de tamaño.

---


Fecha de revisión: 29 de septiembre de 2026.
Base: rama `main`, commit `ce116cc9d6b07fd6f2ef2f2e3c54f343d736ac11`, más los cambios locales descritos abajo.

Esta es una fotografía del checkout, no una certificación de producción. Se revisaron la estructura, las rutas, los contratos compartidos, los flujos principales, el historial reciente y el diff local; se ejecutaron lint y build. No se probó la interfaz en navegador, el envío a una API ni el contenido de los PDF. La presencia de una sección en código no demuestra que su contenido institucional esté aprobado.

## 1. Arquitectura real

El repositorio conserva la organización de un monorepo pnpm con `frontend` y `backend`. En este checkout solo el frontend tiene implementación: `backend/` contiene `node_modules/`, pero no tiene `package.json`, fuentes ni archivos registrados por Git. No se pueden dar por implementados Express, Prisma, PostgreSQL o endpoints por lo que dice el README histórico.

Flujo principal:

```text
main.jsx
  StrictMode
    PdfViewerProvider
      BrowserRouter
        App
          SocialFloatings
          Routes
            MainLayout
              Header + Navbar
              TransitionPage + Outlet (página actual)
              Footer
      PdfViewerModal (instancia global del proveedor)

Página → MyTemplate → organismos → moléculas → átomos
Datos estáticos → data/
Estado e interacción reutilizable → hooks/
Validación → validations/
Acceso HTTP → helpers/apiFetch.js
```

`MainLayout` comparte la navegación y el pie, anima el cambio de ruta e invoca `useScrollTop`. Las páginas no deben volver a montar esas piezas. `App.jsx` registra diez rutas; no hay ruta comodín de página no encontrada.

Las páginas y plantillas están en `frontend/src/components/pages/` y `frontend/src/components/templates/`, no directamente en `src/pages/` y `src/templates/`.

### Stack comprobado

Las versiones siguientes son las instaladas, consultadas con `pnpm --filter frontend list --depth 0`; algunos rangos del manifiesto empiezan en versiones anteriores.

| Tecnología | Versión instalada | Función |
|---|---|---|
| React / React DOM | 19.3.0 | Interfaz y estado |
| Vite | 8.3.0 | Desarrollo y compilación |
| Tailwind CSS / plugin Vite | 4.3.3 | Utilidades y tema CSS |
| React Router DOM | 7.14.0 | Rutas de la SPA |
| Motion | 13.3.0 | Transiciones y aparición de contenido |
| Joi | 18.1.2 | Validación del formulario de contacto |
| React Icons | 5.6.0 | Iconos |
| React PDF / pdfjs-dist | 11.0.0 / 6.3.289 | Visor de documentos y worker |
| tailwind-merge | 3.7.0 | Resolución de clases en Button |
| ESLint | 9.39.5 | Análisis estático |

Se mantiene JavaScript/JSX con módulos ESM. No hay scripts de pruebas automatizadas declarados en los manifiestos revisados.

## 2. Estado de las páginas

Rutas obtenidas de [App.jsx](../frontend/src/App.jsx); contenido comprobado en [pages](../frontend/src/components/pages).

| Ruta | Estado observado | Referencia o siguiente necesidad |
|---|---|---|
| `/` | Inicio compuesto: banner, llamada, presentación, carreras, convenios, admisión, formulario y modal | La UI de contacto existe; su API no está disponible en este checkout |
| `/career/administration` | Hero, aprendizaje, campo laboral, beneficios y documentos | Principal referencia de composición para las demás carreras |
| `/alumni` | Hero, titulación, graduados destacados y estadísticas | Verificar datos institucionales y fotografías antes de publicarlos como reales |
| `/about-us` | Hero con persona superpuesta y descripción institucional | Desarrollo parcial; el segundo contenedor de DescriptionUs está vacío |
| `/events` | Solo título | Falta contenido y funcionalidad |
| `/admissions` | Solo título | No confundir con la sección de admisión del inicio |
| `/contact` | Solo título | No confundir con el formulario ya implementado en inicio/modal |
| `/career/accounting` | Solo título | Preparar contenido propio y reutilizar secciones |
| `/career/computer-science` | Edición local con sección y Title sin texto; Image importado sin uso | Trabajo en curso, no plantilla terminada |
| `/career/language-translation` | Solo título, con errata | Preparar contenido y conservar el slug existente |

## 3. Novedades que ya podemos aprovechar

No había una revisión anterior guardada: este primer inventario usa como referencia el código actual y commits recientes. Las fechas corresponden al historial local.

| Capacidad | Evidencia del historial | Qué reutilizar |
|---|---|---|
| Secciones de Administración | 17–23 septiembre; `402b957`, `c5a5976`, `aa072c9`, `1bd2e89`, `6d9e2e2`, `476d1a2` | Cinco organismos alimentados con datos separados |
| Imágenes con respaldo institucional | 22 septiembre, `cf7e655` | Átomo Image con carga/error y fondo azul |
| Animaciones de carreras | 22 septiembre, `abca53a` | ScrollReveal, useRevealMotion y respeto de movimiento reducido |
| Formulario compartido | 25–26 septiembre; `d2f66a4`, `b1251df`, `73d08f5`, `04b5fe8` | useContactForm + FormField + configuración + Joi + Toast |
| Ampliación de Egresados | 26 septiembre; `110df03`, `b266ff1`, `27db930` | Titulación, tarjetas de graduados y estadísticas |
| Carrusel con varias tarjetas | 26 septiembre; `4f69001`, `ab6033b` | useCarousel + useCardsPerView |
| Button y tailwind-merge | 26 septiembre, `77076c2` | Variantes, clases combinadas y atributos adicionales |
| PDF global | 26–27 septiembre; `79ab45c`, `3faf2a7`, `f2b1286`, `8927b61` | Un proveedor global; abrir documentos desde cualquier sección |
| Alias de imports | 28 septiembre, `8252abb` | `@/` para src y `@assets/` para src/assets |
| Sobre nosotros | 28–29 septiembre; `99ac640`, `2b88062`, `ce116cc` | AboutHero, HeroPerson y DescriptionUs |

### Componentes y contratos actuales

Las rutas de esta tabla parten de `frontend/src/`.

| Pieza | Contrato observado | Precaución al reutilizar |
|---|---|---|
| `components/atoms/image.jsx` → Image | src, alt, fill, className, imageClassName, fallbackClassName, overlayClassName, loading, fetchPriority y callbacks | El contenedor necesita dimensiones; fill requiere un padre posicionado. El overlay opcional aparece después de cargar |
| `components/atoms/titles.jsx` → Title | level, size, variant, align, weight, text/children y props adicionales | Usa Motion; definir nivel semántico. Variante institutional disponible |
| `components/atoms/paragraph.jsx` → Paragraph | size, variant, align, weight, text/children y props adicionales | Usa Motion; elegir tamaño según contexto |
| `components/atoms/button.jsx` → Button | type, disabled, variant, onClick, text/children, className y props adicionales | Usa twMerge, pero devuelve un botón HTML normal: whileHover/whileTap no lo convierten en Motion |
| Input, Select, Textarea, Label | Controles y etiquetas compartidos; campos aceptan error y props adicionales | Verificar id/htmlFor y mensajes asociados en la composición |
| `components/atoms/navbarLink.jsx` → NavbarLink | href, text, onClick | Enlace del router para navegación |
| `components/atoms/links.jsx` → Link | href, target, rel, download, aria-label, variantes | Es un anchor; para navegación SPA usar React Router |
| `components/templates/myTemplate.jsx` → MyTemplate | children y `classmame` | La prop contiene una errata; className no se aplica. Añade espacio superior y overflow-x-hidden |
| `components/layouts/scrollReveal.jsx` → ScrollReveal | children, className, delay, x, y, scale | Delega a useRevealMotion, que contempla movimiento reducido |
| `context/pdfViewer/usePdfViewer.js` → usePdfViewer | openPdf(pdfUrl, title), closePdf() | No duplicar proveedores o modales por página |

### Carreras

[Administración](../frontend/src/components/pages/careers/businessAdministrationPage.jsx) compone:

- `CareerHero({ title, image, description, highlights })`: highlights es una lista de objetos con title y description.
- `CareerLearning({ topics })`: cada tema usa title, description e image.
- `CareerWorkplaces({ workplaces })`: cada elemento usa title, image y layout; layout se utiliza como clave. Muestra cuatro elementos y permite desplegar el resto.
- `CareerBenefits({ benefits, image })`: beneficios con title y description.
- `CareerDocuments({ documents, title })`: documentos con id, title, description, image, tone y pdfUrl.

La reutilización todavía requiere ajustes puntuales: CareerLearning tiene una etiqueta accesible fija de Administración y CareerBenefits un alt específico de gestión empresarial. Solo Administración dispone de `hero` en `data/careers.js`. No acceder a `career.hero.description` para otra carrera sin preparar sus datos.

### Formularios

[useContactForm](../frontend/src/hooks/globals/useContactForm.js) centraliza valores, errores, pasos, envío y avisos. Lo consumen HomeMessage y ModalMessage. Los campos están en `data/contactFormFields.js`; `ContactFormValidator` se exporta desde `validations/validationCredentials.js`.

Payload: `{ name, email, phone, address, career, shift, message }`.
Envío: `POST http://localhost:3000/contact`, mediante apiFetch y con credenciales.

El helper devuelve JSON, `[]` si la respuesta exitosa está vacía y `null` ante fallo. La validación actual limita correos a gmail.com, hotmail.com y yahoo.com. Es una restricción existente que debe revisarse según el requisito, no una convención universal para futuros formularios.

### PDF, carruseles y animaciones

- PdfViewerProvider se monta una vez en main.jsx. AcademicDocumentCard y FeatureCard abren el visor mediante usePdfViewer.
- PdfViewerModal incluye carga/error, todas las páginas, zoom, navegación por página y enlace de descarga. El worker se importa como asset con `?url`.
- ContinuousCarousel sirve para convenios y aprendizaje: recibe items y renderItem, y opciones emphasizeCenter y draggable. El segundo argumento de renderItem identifica la copia decorativa; evitar que sus controles dupliquen el recorrido del teclado.
- useCarousel, exportado desde `useCarrusel.js`, se usa para banner y graduados. useCardsPerView se exporta desde `useCardPowerView.js`.
- CareersCarousel del inicio conserva una implementación propia: los tres mecanismos no están unificados.
- animation.js contiene variantes compartidas; no todas las animaciones existentes contemplan movimiento reducido. ScrollReveal/useRevealMotion sí lo hacen.

### Identidad visual

[index.css](../frontend/src/index.css) sigue siendo la fuente de verdad: Tailwind 4, tokens, fuentes y estilos compartidos. Azul institucional: `blue-dark` (`#1A3983`). Poppins para lectura; Hani corresponde a Rajdhani; también existe Eurostar como `font-euro`. Reutilizar tokens en lugar de copiar colores hexadecimales.

Los alias están configurados tanto en vite.config.js como en jsconfig.json. Conviven con imports relativos válidos. Las instrucciones históricas que indicaban que no había alias o Context ya no describen el checkout actual.

## 4. Cambios locales que deben conservarse

Al comenzar esta revisión había ocho WebP eliminados de la raíz de public y los ocho presentes en `public/business_admin/`, carpeta todavía sin seguimiento. Se actualizaron referencias en careers, administrationLearning, administrationWorkplaces, administrationDocuments y homeAdmissions.

También había una edición incompleta de ComputerSciencePage. Ninguno de estos cambios se modificó durante el análisis.

Al consolidar esta reorganización, incluir los archivos nuevos junto con las eliminaciones y las referencias. De lo contrario, otro checkout no tendrá las imágenes. El catálogo de Contabilidad e Informática también apunta a business_admin: actualmente la carpeta contiene recursos usados por varias carreras.

## 5. Pendientes priorizados

Son hallazgos de análisis, no correcciones aplicadas.

| Prioridad | Hallazgo y evidencia | Acción recomendada |
|---|---|---|
| Alta | Backend ausente; apiFetch apunta a localhost:3000 | Determinar dónde vive la API e implementar/verificar POST /contact antes de declarar operativo el envío |
| Alta | Lint falla en toast.jsx:13 y careersCarousel.jsx:31 | Corregir el estado sincronizado desde efectos y volver a ejecutar lint |
| Alta | AboutHero, HeroPerson, HomeAdmissions, GraduateCard y otras piezas usan img directo; banner usa backgroundImage | Al intervenir estas piezas, aplicar Image y probar fuente vacía/fallida conforme a AGENTS.md |
| Alta | FormField crea Label htmlFor=name, pero no pasa id a los controles; tampoco lo generan los átomos | Asociar label/campo y permitir ids únicos cuando conviven el formulario de inicio y el modal |
| Alta | PDF y modal de contacto carecen de gestión de foco, Escape y semántica completa de diálogo | Completar apertura/cierre por teclado, foco inicial y restitución del foco; revisar superposición con navegación |
| Alta | Menú móvil oculto solo mediante opacidad y pointer-events; submenús por altura/opacidad | Excluir controles cerrados del foco y reflejar expansión con atributos accesibles |
| Alta | Documentos de Administración marcados isReference; la tarjeta no muestra esa distinción | Confirmar documentos oficiales o identificar visiblemente el carácter de referencia |
| Media | Graduados usan pravatar; estadísticas y afirmaciones institucionales sin fuente documentada | Confirmar nombres, fotografías, cifras, antigüedad, empleabilidad y datos de contacto antes de publicarlos |
| Media | MyTemplate usa classmame; Title h2 contiene `xs:text-[2.5]` y `md: text-4xl` | Corregir contratos y clases al abordar la base visual; comprobar consumidores |
| Media | Button es HTML, pero recibe whileHover/whileTap en organismos de carreras | Elegir una integración Motion real o conservar interacción CSS; no copiar esas props como si funcionaran |
| Media | useCardsPerView devuelve 1.3/2.3/3/4; CareersCarousel crea una cantidad entera y solo selecciona grid de 2 o 3 columnas | Revisar el contrato entre hook y carrusel antes de reutilizarlo allí |
| Media | useContactForm reinicia datos también tras fallar y programa reset sin limpiar el timeout | Conservar datos para reintentar y controlar el ciclo de vida del temporizador |
| Media | Bundle principal grande y rutas importadas estáticamente | Medir y valorar carga diferida de rutas/visor; no añadir dependencias sin necesidad |
| Media | PDF renderiza todas las páginas; el contador solo cambia con sus controles | Probar documentos largos, scroll manual, zoom y valores no enteros antes de extender el visor |
| Baja | Dos previewImage apuntan a PNG inexistentes, pero no tienen consumidores actuales | Limpiar metadatos obsoletos o aportar previews si se vuelven a utilizar |
| Baja | FeatureCard recibe variant blue-dark desde titulationSteps, pero solo define white y blue-deep | Alinear variantes; hoy cae en white |
| Baja | Sin ruta 404; tarjetas de carreras del inicio usan anchors; INGLES.webp es ruta relativa | Completar navegación y usar rutas de assets desde la raíz |
| Baja | Erratas en nombres: DescrtiptionUs, featuredGratuatesSection, LanguageTraslationPage, Dost, entre otras | Conservar imports exactos; renombrar de forma coordinada si se aborda esa limpieza |
| Baja | README describe scripts y backend que el checkout no tiene | Usar esta revisión y los manifiestos como referencia de ejecución; actualizar el onboarding histórico |

## 6. Verificaciones realizadas

Entorno disponible en WSL: Node 24.21.0 y pnpm 12.4.2. La shell interactiva carga el entorno necesario; la shell no interactiva inicial no encontraba Node. No se instalaron dependencias.

| Comprobación | Resultado |
|---|---|
| git status, log y diff | Revisados commit base y cambios locales |
| pnpm --filter frontend list --depth 0 | Versiones instaladas registradas |
| pnpm --filter frontend run lint | Falla: 2 errores de react-hooks/set-state-in-effect en Toast y CareersCarousel |
| pnpm --filter frontend run build | Pasa: 638 módulos; advertencia por chunks mayores de 500 kB |
| Tamaño de salida | JS principal 1.341,97 kB, gzip 413,36 kB; worker PDF 1.265,41 kB; imagen about_hero 1.412,21 kB |
| Referencias literales absolutas a imágenes/PDF en src | Solo faltan los dos previews obsoletos; los ocho WebP reorganizados y los PDF referenciados existen |
| UI, responsive, teclado, PDF y envío real | No verificados en navegador ni contra una API |

La búsqueda de assets cubre literales que empiezan por /, no URLs externas, valores calculados o todas las rutas relativas. Un build exitoso tampoco valida esos recursos ni la interacción.

## 7. Cómo mantener este análisis

Al revisar nuevas incorporaciones, registrar fecha y commit, comparar con esta base, identificar contratos y consumidores modificados y actualizar el estado de cada página. Separar siempre lo integrado, los cambios locales y lo propuesto.

Consultar la [guía para nuevas páginas](GUIA_NUEVAS_PAGINAS.md) antes de crear una rama de implementación. Estos documentos deben formar parte del historial compartido para aparecer en otras ramas; un archivo local sin commit no se transmite a otros checkouts. No hay seguimiento automático configurado.


## 8. Hero de Computación e Informática — 1 de octubre de 2026

- Implementado en `/career/computer-science`: la página compone `ComputerScienceHero`, con título del catálogo, escenario azul institucional, curva naranja, figura superpuesta, tarjetas decorativas y descripción. Reutiliza Title, Paragraph e Image; no cambia contratos compartidos.
- Archivos nuevos: `components/organisms/careers/computerScienceHero.jsx` y su CSS de geometría responsive. Los colores proceden de index.css.
- Reutiliza la imagen institucional existente `about-hero-person.png`; no representa una fotografía confirmada de alumnado de esta carrera. Los textos son una propuesta editorial sin cifras, duración ni promesas de empleabilidad.
- El enlace “Conoce admisión” abre la ruta existente /admissions; esa página sigue pendiente de contenido.
- Verificación: build correcto; lint mantiene únicamente los dos errores preexistentes en Toast y CareersCarousel. Inspección con Edge en 1440, 768 y 390 px, sin desbordamiento horizontal; enlace de admisión y error de imagen comprobados. El respaldo de Image conserva dimensiones, fondo blue-dark y etiqueta accesible, sin img roto.
- Pendiente: desarrollar las demás secciones de la carrera y confirmar el contenido institucional. No se añadieron dependencias.


### Actualización visual del hero — 1 de octubre de 2026

Se sustituye la imagen reutilizada de Sobre nosotros por computing-student.png, generada con image_gen y con transparencia. La imagen es ilustrativa, no alumnado real; el prompt y su procedencia están en frontend/public/computation-informatic/README.md. El hero ocupa el 100 % del ancho, sin márgenes ni esquinas superiores redondeadas, alineado bajo la navegación fija mediante la clase local computing-page. Se conserva el ajuste de la tarjeta móvil para despejar el rostro y el respaldo institucional de Image. Verificado en 320, 390, 640, 768 y 1440 px, sin desborde horizontal. Build correcto; lint conserva los dos errores preexistentes. No se modifican contratos compartidos.

### Fondo y organización de Computación — 1 de octubre de 2026

Ambas imágenes del hero se guardan en frontend/public/computation-informatic: computing-student.png y computing-lab-background.png. Se elimina el patrón SVG decorativo del fondo y se integra el laboratorio generado con image_gen mediante Image, alt vacío y overlay institucional. Solo se mantiene el SVG de la curva inferior y los iconos pequeños existentes. Prompts y procedencia en el README de esa carpeta; el laboratorio es ilustrativo, no instalaciones reales del IPC. Verificado responsive de 320 a 1440 px y fallo de carga del fondo con respaldo blue-dark; build correcto y los mismos dos errores previos de lint.

### Modularización de Computación — 1 de octubre de 2026

ComputerSciencePage obtiene el título del catálogo y pasa el contenido de data/computerScienceHero.js a ComputerScienceHero({ title, content }). El organismo compone tres moléculas de careers: ComputerScienceHeroHeading (título y lema), ComputerScienceHeroVisual (imagen y tarjetas) y ComputerScienceHeroIntro (descripción y enlace). Image sigue centralizando carga/error; los estilos responsive se conservan.

Se reutiliza BannerBgCurve de molecules/shared/curbePath.jsx. Se añade design=6 con la geometría aprobada y accentColor opcional; los diseños 1–5, color, height, position y sus valores por defecto se conservan. El diseño 6 admite una banda posterior; sin accentColor solo se dibuja la curva principal. Usa tokens CSS para sus colores, aria-hidden y pointer-events-none como decoración; className se combina con twMerge para permitir ajustar la posición sin clases contradictorias. Antes de este cambio el componente compartido no tenía consumidores activos; Egresados conserva un SVG propio y no se modifica en este alcance.

Verificado: build correcto, lint con los dos errores preexistentes, responsive en 320/390/640/768/1440 px sin desbordes y respaldo azul ante fallo del fondo. La apariencia del hero se conserva. No se añaden dependencias ni cambios de backend.

### Estilos de Computación en Tailwind — 1 de octubre de 2026

Se elimina computerScienceHero.css y su import. El organismo y sus moléculas expresan el layout, responsive y máscara de imagen con utilidades Tailwind. La transparencia y el difuminado solo se aplican cuando Image termina de cargar; los errores conservan el fondo institucional. El espacio bajo la navegación se compone con un contenedor pt-3.5 sm:pt-5.5 md:pt-0 dentro de MyTemplate, sin cambiar su contrato compartido. Se retiran las clases computing-hero y computing-page que dependían del CSS eliminado.

Verificación: geometría y estilos equivalentes a la versión previa en 320, 390, 640, 768 y 1440 px; inspección visual en móvil/escritorio, respaldo de ambas imágenes y enlace de admisión correctos. Build pasa; lint conserva los dos errores preexistentes.

## 9. Página de Computación ampliada — 2 de octubre de 2026

Implementado en /career/computer-science: entrada escalonada del hero, seis áreas de aprendizaje en el carrusel compartido, sección narrativa con panel sticky e indicador ligado al scroll, seis ámbitos laborales (cuatro iniciales y dos desplegables), habilidades y dos tarjetas de documentación pendiente. El contenido editorial está en data/computerScienceSections.js; es orientativo y requiere validación institucional. No se afirman duración, modalidad, empleabilidad ni beneficios exclusivos del IPC. Plan y malla no tienen PDF oficial y muestran su estado pendiente sin botones ficticios. Las imágenes existentes siguen siendo ilustrativas.

Contratos reutilizados y ampliados:

- CareerLearning: label, description y digital opcionales; conserva la presentación predeterminada de Administración. ContinuousCarousel y useCarouselDrag mantienen su lógica; LearningCard añade Icon, code y digital para la variante tecnológica.
- CareerWorkplaces / WorkplaceTile: digital opcional; reutiliza expansión, animaciones y estado. La variante tecnológica muestra título, descripción e icono, sin fingir fotografías.
- CareerBenefits: title, description, imageAlt y eyebrow opcionales con los valores anteriores por defecto. Reutiliza BenefitCard.
- AcademicDocumentCard: sin pdfUrl válido muestra document.status; con URL conserva el visor global. isReference se muestra de forma visible. Se eliminan props Motion que se enviaban a Button HTML.
- MyTemplate: admite className con twMerge y conserva classmame como alias compatible. Computación usa overflow-x-clip para no crear un contenedor de scroll que impida sticky. Las demás páginas conservan overflow-x-hidden.
- useCarouselDrag: pointerleave de un descendiente ya no cancela el inicio del arrastre; solo salir del viewport lo cancela.
- ComputerScienceJourney utiliza ScrollReveal, useScroll y useTransform, con indicador estático al solicitar movimiento reducido. No se añade CSS local ni dependencias.

Verificaciones: build correcto y lint con los mismos dos errores previos de Toast/CareersCarousel; sin errores de render en navegador. Revisados 320/390/768/1440 px, carrusel con teclado y duplicados fuera del tabulado, expansión 4→6→4, arrastre activo y liberación, sticky a 128 px, modo de movimiento reducido, respaldo de imágenes fallidas, estado de documentos pendientes y apertura del visor desde Administración. Sigue el aviso de tamaño del bundle existente.

Pendiente de contenido: confirmar áreas formativas, beneficios institucionales y facilitar los PDF oficiales de Computación. No se implementa backend nuevo.

### Animaciones reversibles de Computación — 2 de octubre de 2026

Esta revisión sustituye las entradas de una sola ejecución descritas anteriormente por animaciones vinculadas continuamente al desplazamiento. ComputerSciencePage activa ScrollAnimationContext con value="linked". ScrollMotion (y su fachada ScrollReveal) usa useScroll/useTransform: títulos y tarjetas entran y salen según su posición y recuperan el mismo estado al volver. Al recibir foco mantienen opacidad y escala completas para facilitar el uso con teclado. Fuera del proveedor se conserva el comportamiento de entrada de las otras páginas.

El hero tiene parallax de fondo. ComputerScienceJourney ofrece una escena de 280vh con pantalla sticky bajo la navegación (96 px), tres tarjetas superpuestas, desplazamiento/zoom de fondo y progreso reversible. usePinnedScene solo activa esta composición desde 64rem de ancho y 650px de alto, sin movimiento reducido; en pantallas pequeñas las tres etapas se muestran en flujo con entradas reversibles. ComputingJourneyStep encapsula la transformación de cada etapa. useMotionPreference escucha cambios de preferencia sin recarga y desactiva las animaciones de ScrollMotion y el parallax del hero. Se reutiliza Motion ya instalado, las imágenes y el carrusel existentes, sin nuevas dependencias ni CSS local.

Verificado en navegador: secuencia 1→2→3→2→1 y restauración exacta de estilos de los 18 elementos al recorrer toda la página y regresar; entradas reversibles por posición; anchos 390/768/1440 sin desborde; movimiento reducido dinámico desactiva los elementos vinculados y la escena fija; Administración no recibe el modo linked. Build correcto; lint conserva los dos errores previos en Toast y CareersCarousel y el build mantiene el aviso de tamaño de bundle.
### Imágenes del carrusel — 2 de octubre de 2026

Se incorporan seis ilustraciones conceptuales generadas con image_gen a public/computation-informatic/learning-*.webp: programación, bases de datos, redes, soporte, desarrollo web y seguridad. Paleta azul/naranja y prompts completos documentados en el README de la carpeta. Los recursos están optimizados a 800px, unos 539 KiB entre los seis. No representan instalaciones ni equipos reales del instituto.

LearningCard admite imageAlt opcional; la variante digital usa tarjetas más altas, overlay inferior y zoom al expandirse mediante puntero, foco o toque, desactivado con movimiento reducido. Image mantiene el respaldo institucional y el arrastre nativo de imágenes está desactivado para conservar el gesto del carrusel. Administración conserva sus dimensiones y overlays. Comprobadas la carga de los seis recursos, expansión con teclado, diseño móvil sin desborde y compilación.
### Secuencia visual de scroll — 2 de octubre de 2026

Se amplía la animación inspirada en la referencia de Pinterest: CareerLearning con cinematic mantiene la sección fija durante 260svh, vincula el recorrido horizontal del carrusel al desplazamiento vertical y anima su escala/perspectiva y luz de fondo. ContinuousCarousel admite scrollProgress opcional (MotionValue de 0 a 1); useCarouselScroll controla el tiempo de la animación CSS existente, mide anchuras sin transformar y conserva arrastre, duplicados, escala central y navegación por teclado. Al enfocar o arrastrar no sobrescribe la interacción; al volver a desplazarse recupera el recorrido por scroll. Sin scrollProgress conserva el comportamiento anterior.

ComputerScienceJourney sustituye las tarjetas numéricas por tres composiciones con imágenes del catálogo, títulos grandes, cambios de perspectiva, escala y movimiento independiente del texto. Dura 320svh y dispone de luz y tipografía de fondo móviles. ComputingJourneyStep interpola explícitamente las etapas para mantener sus límites en Motion/WAAPI. ScrollPanel añade apertura de marco, escala y desplazamiento a Campo laboral, Habilidades y Documentos; respeta el foco de teclado sin mover las acciones al hacer clic.

usePinnedScene se activa con ancho mínimo de 48rem y altura mínima de 600px, o con altura de 740px en cualquier ancho. Siempre exige ausencia de movimiento reducido. En ventanas pequeñas conserva el carrusel habitual y muestra las etapas en flujo. La preferencia de movimiento reducido desactiva las escenas y transformaciones. No se instalan dependencias en el proyecto ni se incorpora CSS local.

Validación en Edge: carrusel 0→-428→-856→-428→0 px en 1440x1000, etapas 1→2→3→2→1, apertura de panel reversible, arrastre y teclado funcionales, expansión de ámbitos 4→6→4. Inspección en 1440x1000, 390x844, 320x640, 1024x700 y 844x390; sin desborde horizontal. Administración conserva su presentación. Grabación de demostración en la carpeta local de revisión. Build correcto; lint mantiene los dos errores previos de Toast y CareersCarousel. La composición adapta movimientos de la referencia; no es una reproducción exacta ni utiliza el código del sitio original.
### Carrusel libre y transición entre secciones — 2 de octubre de 2026

Por ajuste del usuario, se retira el recorrido horizontal ligado al scroll. ContinuousCarousel recupera su contrato y autoplay anteriores; se eliminan scrollProgress, useCarouselScroll y la variante scene de LearningCard. El carrusel vuelve a sus dimensiones aprobadas y conserva arrastre, pausa por interacción y teclado.

cinematic en CareerLearning ahora controla la desaparición de toda la sección al salir de la pantalla, sin sticky ni altura artificial. La entrada de ComputerScienceJourney acompaña la transición. Sus etapas desplazan encabezado, imagen y texto como un bloque vertical completo, para simular el paso entre secciones; se conservan imágenes, contenido y composición responsive. El título semántico de la escena se mantiene, y el encabezado visual repetido no se anuncia de nuevo.

Validación: autoplay avanza sin scroll, arrastre cambia su posición y autoplay se reanuda; opacidad/escala de salida y etapas restauran exactamente su estado al subir; movimiento reducido mantiene el carrusel legible; anchos 320/390 sin desborde y navegador sin errores. Build correcto. Esta revisión sustituye el contrato de scrollProgress descrito en la actualización anterior.
### PDF de muestra de Computación — 2 de octubre de 2026

Se crea public/computation-informatic/computacion-referencia.pdf (dos páginas: plan y malla ficticios), con paleta institucional y avisos visibles de referencia no oficial en ambas páginas. No establece duración, créditos ni certificaciones reales. Las dos entradas de computerScienceDocuments apuntan a este mismo archivo y activan isReference; sus descripciones aclaran su carácter de ejemplo y la ubicación de la malla en la segunda página.

Se reutiliza sin cambios CareerDocuments → AcademicDocumentCard → usePdfViewer → PdfViewerProvider/PdfViewerModal, el mismo flujo de Administración. No se introduce un segundo visor. Verificado el render de ambas páginas, apertura desde las dos tarjetas, navegación a página 2, zoom, descarga, cierre y apertura móvil, sin errores de navegador. Los documentos oficiales siguen pendientes y deberán sustituir la muestra.
### Limpieza y revisión de Computación — 2 de octubre de 2026

Eliminados «Desplázate para recorrer el proceso» y su barra, conservando las transiciones reversibles. La escena separa composición, fondo, encabezado, etapas y alternativa en flujo; useJourneyMotion/useJourneyStepMotion contienen sus cálculos. El hero separa su fondo. CareerLearning usa useSectionExit; useKeyboardFocusWithin y useMediaQuery centralizan comportamientos repetidos.

Retiradas seis cadenas code del catálogo y su rama obsoleta en LearningCard. Textos agrupados en computerScienceContent. AcademicDocumentCard obtiene document.pdfUrl sin props redundantes. Conservados carrusel libre, átomos, curva, visor global, cambios locales y ScrollReveal. Sin dependencias ni CSS nuevos.

Verificado en Edge: carrusel, reversibilidad, etapas 1→2→3→2→1, ausencia de texto/barra, movimiento reducido dinámico, respaldo de imagen y PDF de ambas carreras. Anchos 320/390/1440 sin desborde; inspección visual móvil/escritorio. Build correcto; lint conserva los dos errores previos de Toast/CareersCarousel y persiste el aviso de bundle. Análisis en REVISION_COMPUTACION.md. Las entradas anteriores son históricas; esta revisión describe la organización vigente.


### Integración de la PR #6 — 5 de octubre de 2026

Se integra upstream/main conservando sus cambios de átomos y nuevas secciones. MyTemplate combina el overflow-x-clip de la rama base con twMerge, className y el alias classmame. La curva adopta el nombre corregido curvePath.jsx y mantiene los diseños 1–6, accentColor y accesibilidad; se actualiza el import del hero de Computación. No se selecciona una versión completa por encima de la otra ni se reescribe el historial.

## Traducción de Idiomas — implementación del 5 de octubre de 2026

- Ruta existente: `/career/language-translation`. LanguageTranslationPage sustituye el título provisional y corrige el import en App.
- Mantiene la secuencia de Administración/Computación: presentación, aprendizaje, campo laboral, beneficios y documentos.
- Diseño propio: portada fotográfica con banda diagonal inspirada en Eventos; ejemplo bilingüe superpuesto; aprendizaje mediante cuatro pestañas (traducción, interpretación, cultura y localización); recorrido narrativo con números y palabra de fondo; campo laboral con fotografía y desplegables.
- Organismos específicos: LanguageTranslationHero, LanguageTranslationLearning, LanguageTranslationJourney y LanguageTranslationWorkplaces. Molécula TranslationExample; contenido separado en `data/languageTranslation.js`.
- Reutiliza MyTemplate, Title, Paragraph, Button, Image, ScrollReveal, CareerBenefits y CareerDocuments. No cambia contratos de organismos compartidos ni el diseño de las otras carreras.
- Las pestañas permiten clic/tacto, flechas izquierda/derecha, Inicio y Fin; paneles relacionados mediante aria-controls y aria-labelledby. Campo laboral usa details/summary nativos.
- Radios pequeños limitados a esta página. Todas sus imágenes usan Image con respaldo institucional.
- Cinco recursos generados con ImageGen y optimizados a WebP en `public/careers-editorial/`; README con prompts y procedencia. Tres para Traducción; los de Administración y Computación quedan disponibles sin reemplazar los anteriores.
- Catálogo: corregida la URL relativa de la imagen de Traducción.
- Áreas y ejemplos orientativos, fotografías sintéticas identificadas. Documentos oficiales pendientes sin URL ficticia. Idiomas impartidos, duración y certificación requieren confirmación institucional.
- Build correcto (698 módulos), con advertencia de tamaño preexistente. Lint de todos los archivos modificados pasa. Lint global conserva los dos errores conocidos en toast.jsx y careersCarousel.jsx.
- Edge headless: 1440, 768, 390 y 320 px sin desborde ni imágenes rotas; sin errores JavaScript. Verificados enlace al aprendizaje, pestañas por teclado/clic, ejemplos, desplegables y respaldo con carga abortada (fondo rgb(26,57,131)).
- Conservados los cambios locales previos de ESTADO_PROYECTO.md, GUIA_NUEVAS_PAGINAS.md y REVISION_2026-10-05.md.

## Organización de carreras — 5 de octubre de 2026

La estructura vigente está en [ESTRUCTURA_CARRERAS.md](ESTRUCTURA_CARRERAS.md); sustituye las ubicaciones planas citadas en las notas anteriores.

Se separan pages, organisms, molecules y data por carrera, con shared para piezas comunes. Administración usa los organismos genéricos desde shared; no se duplican en una carpeta exclusiva. Computación conserva sus piezas específicas y Traducción separa fondo, encabezado, comparación, introducción, paneles y etapas. Pestañas, encabezado, imagen con leyenda y desplegables quedan disponibles para todas las carreras.

Se mantienen rutas, contenido, imágenes, estilos y comportamiento. Actualizados imports mediante los alias ya configurados. Los datos de Traducción están en data/careers/languageTranslation y se importan por sección. El catálogo compartido data/careers.js conserva su ubicación para evitar cambios en otras páginas.

## Ajustes de carreras, navegación y recursos — 5 de octubre de 2026

- Catálogo confirmado de cuatro carreras: Administración, Contabilidad, Computación y Traducción. Estas mejoras se aplican a las tres páginas desarrolladas.
- AdministrationHero y AdministrationHighlights se ubican en organisms/careers/administration y molecules/careers/administration: solo Administración los consume. Shared conserva CareerLearning/CareerWorkplaces (Administración y Computación), CareerBenefits/CareerDocuments (las tres) y sus moléculas.
- CareerBreadcrumbs({ title, className }) aporta Inicio / carrera en los tres héroes. Usa navegación semántica, enlace SPA y aria-current.
- Traducción: CTA principal «Ver admisión» hacia /admissions; secundario «Explorar la carrera» hacia #aprendizaje. Admisión continúa como página provisional de título; no se implementa su contenido en esta tarea.
- Paragraph admite as (p por defecto). Con as="span", size/variant/weight/align heredan por defecto y pueden definirse explícitamente. Los consumidores existentes sin as conservan sus valores anteriores. Los textos inline de carreras usan este átomo; los spans decorativos permanecen nativos. Link incorpora la variante plain para enlaces sin estilo de botón.
- Migradas 21 imágenes de carreras a src/assets/images/careers/{administration,accounting,computerScience,languageTranslation}, mediante imports @assets. Actualizados todos sus consumidores, incluida la foto de FINANZAS de HomeAdmissions; esta sección usa Image para sus fotografías. Conservados los originales y la transparencia de Computación. Los PDF permanecen en public.
- Traducción abre public/documents/languageTranslation/traduccion-referencia.pdf desde ambas tarjetas usando el visor global. Página 1: plan de referencia. Página 2: malla ficticia por etapas, sin créditos ni duración. Ambas incluyen «DOCUMENTO DE REFERENCIA - NO OFICIAL» y las tarjetas isReference=true. Sustituir por documentos oficiales cuando se disponga de ellos.
- Verificados los tres breadcrumbs, regreso a inicio, ambos CTA, teclado de pestañas, carga de imágenes y anchos 320/390/768/1440. PDF renderizado e inspeccionado visualmente; apertura desde ambas tarjetas, dos páginas, navegación, zoom y descarga HTTP 200. Sin errores JavaScript. Build y lint del alcance pasan; la advertencia previa del bundle y los dos errores globales conocidos quedan fuera del alcance.

## Imágenes exclusivas de Traducción — 6 de octubre de 2026

La página usa nueve imágenes distintas: portada, cuatro áreas de aprendizaje, campo laboral, beneficios y dos tarjetas de documentos. Se conservan tres recursos existentes y se incorporan seis imágenes generadas con ImageGen y optimizadas a WebP. Ningún archivo se repite dentro de esta página.

Los recursos están en `frontend/src/assets/images/careers/languageTranslation/`; su README documenta asignaciones, procedencia ilustrativa y prompts. `data/careers/languageTranslation/images.js` centraliza los imports. Se mantienen el átomo Image, sus fondos institucionales y los documentos de referencia. No se modifican las otras carreras.

Verificación: nueve fuentes únicas y cargadas en Edge a 1440, 390 y 320 px, incluidas las cuatro pestañas; sin desborde horizontal ni errores JavaScript. Inspección visual de escritorio y móvil. Build y lint del alcance correctos; persiste el aviso previo de tamaño del bundle.

## Transición de aprendizaje de Traducción — 6 de octubre de 2026

TranslationLearningPanel coordina fundido, escala sutil de imagen y desplazamiento de texto mediante Motion, sin dependencias nuevas. Los cuatro paneles comparten una celda de grid para conservar la altura; los inactivos usan aria-hidden e inert y no reciben foco ni clics. useMediaQuery respeta cambios dinámicos de prefers-reduced-motion: reduce, con transición inmediata. Se conserva la navegación por flechas, Inicio y Fin. Verificados clics rápidos, teclado, alturas estables y movimiento reducido en 1440/390/320 px; build y lint del alcance pasan.


## Computación: lectura estable y simplificación — 7 de octubre de 2026

Implementado: portada en grid con descripción y acciones junto al título; fondo estático; entradas breves de portada, aprendizaje y pasos. Aprendizaje muestra seis tarjetas con descripciones visibles. El proceso usa tres tarjetas en flujo normal y un ejemplo ilustrativo de biblioteca, sin atribuirlo a un proyecto institucional real. Se mantienen Image, respaldo institucional, documentos de referencia y ruta de admisión existente.

CareerLearning incorpora layout="grid"; conserva layout="carousel" por defecto. LearningCard incorpora presentation="static"; conserva la interacción anterior por defecto. ContinuousCarousel y los componentes de carreras compartidos siguen disponibles. ScrollMotion conserva las entradas de una sola ejecución y movimiento reducido, eliminando el modo linked sin otros consumidores.

Eliminados ScrollPanel, ScrollAnimationContext, useSectionExit, useJourneyMotion, useJourneyStepMotion, usePinnedScene, useKeyboardFocusWithin, ComputingJourneyBackground, ComputingJourneyStep y ComputerScienceHeroIntro. La descripción y las acciones de este último se integran en la cabecera. Retirados el parámetro cinematic, el título decorativo duplicado y wordmark del proceso.

Verificación: build correcto (advertencia de tamaño del bundle); lint global solo reporta los dos errores previos de Toast y CareersCarousel. La inspección visual en navegador queda pendiente: el runtime de automatización falló al iniciar. No se certifican todavía responsive, teclado ni comportamiento visual. Admisión sigue pendiente de implementación y los PDF siguen siendo referencias no oficiales.

## Ajuste visual de Computación — 7 de octubre de 2026

Se sustituye la cuadrícula de aprendizaje por el carrusel existente en variante uniforme: tarjetas rectas, texto visible, arrastre y control Pausar/Continuar. La portada incorpora la curva reutilizable 6 y conserva un único enlace «Cómo postular», con estilo claro y acento naranja al interactuar. Los pasos tienen entradas escalonadas inspiradas en Nuestros valores. Los cambios de esquinas se limitan a Computación, preservando botones y diseños de otras carreras. Los contratos nuevos se describen en GUIA_NUEVAS_PAGINAS.md; Admisión sigue siendo una ruta provisional.

Verificación de este ajuste: build y ESLint del alcance correctos. Inspección visual en Edge a 1440/390/320 px, sin desbordamiento horizontal ni errores JavaScript. Verificados curva, CTA único y destino /admissions, esquinas rectas, pausa/reanudación, arrastre, desplazamiento con teclado y movimiento reducido (sin animación ni control de pausa). Administración conserva su carrusel original. Persiste la advertencia conocida del tamaño del bundle.


## Ajuste posterior de Computación — 7 de octubre de 2026

La petición posterior sustituye la variante uniform-carousel por el comportamiento de Administración: ContinuousCarousel con emphasizeCenter, draggable y ciclo CSS compartido de 30 segundos. Se conserva la presentación estática de las tarjetas mediante CareerLearning presentation="static"; los demás consumidores mantienen presentation="interactive". Eliminados el estado y los controles de pausa, la indicación de arrastre y las props/estilos exclusivos de la variante uniforme. Las tarjetas estáticas admiten foco y las copias decorativas permanecen inert.

El hero elimina la descripción larga y su dato sin consumidores, mantiene la frase corta y «Cómo postular», reduce el padding superior y el tamaño de la imagen. La curva 6 usa neutral-white y mayor altura, conectando con aprendizaje sobre fondo claro. Los estilos específicos se limitan a Computación; se conservan la cuadrícula reutilizable, el carrusel compartido y las demás secciones.

Validación: build y ESLint del alcance correctos; Edge a 1440/390/320 px sin desbordamiento horizontal ni errores JavaScript. Hero de 560 px en escritorio; curva clara inspeccionada. Confirmados la eliminación del párrafo y la indicación inferior, el énfasis central y el ciclo de 30 segundos compartido con Administración. Se mantiene la advertencia conocida de tamaño del bundle.

### Restitución del estilo del carrusel — 7 de octubre de 2026

Computación vuelve a usar CareerLearning digital con tarjetas estáticas, rectas y borde neutral-white sobre fondo institucional azul. La curva 6 del hero usa orange. Se retira el espacio superior específico de la versión clara. Se conservan sin cambios la lógica compartida del carrusel, el énfasis central, el ciclo de 30 segundos y la ausencia de controles inferiores.

### Alineación de tarjetas y unión curva — 7 de octubre de 2026

CareerLearning admite emphasizeCenter (true por defecto); Computación lo desactiva para conservar una fila de tarjetas del mismo tamaño, de 18 a 24 rem según el viewport. Las tarjetas se estiran a igual altura. Se mantienen desplazamiento continuo de 30 segundos, arrastre y pausa contextual; Administración conserva el énfasis central. BannerBgCurve incorpora diseño 7 y secondaryAccentColor opcional: dos bandas curvas paralelas blanca y naranja sobre una base blue-dark que conecta con aprendizaje sin remate horizontal naranja. Los diseños anteriores no cambian.

## Contabilidad: separación por responsabilidades — 9 de octubre de 2026

Se organiza la página en carpetas accounting para página, organismos, moléculas y datos, conforme a ESTRUCTURA_CARRERAS.md. Se eliminan las definiciones de componentes auxiliares dentro de organismos y se reutilizan los átomos, el modal y los hooks existentes. Beneficios y aprendizaje comparten AccountingChecklistItem. Solicitar información abre ModalMessage; la malla permite seleccionar los seis ciclos y respeta movimiento reducido. El hero conserva Image, usa el asset local de Contabilidad y ajusta su título al ancho móvil. Se mantiene el contenido académico existente; no se confirma su carácter oficial. Se restauran los imports y la exportación del catálogo careers que bloqueaban la aplicación. El carrusel experimental sin consumidores permanece fuera del alcance.

Validación: ESLint de los componentes y datos de Contabilidad correcto; build correcto con la advertencia conocida de tamaño del bundle. Verificados 320/390/768/1440 px sin desbordamiento horizontal de página, portada móvil y de escritorio, apertura/cierre del modal y selección visible del sexto ciclo. Movimiento reducido revisado en código. App.jsx conserva el aviso previo de lint por la variable ready sin uso; el cambio de esta tarea en App se limita al import de la página.

## Contabilidad: diseño y simplificación vigentes — 9 de octubre de 2026

Esta revisión sustituye la malla en carrusel y los componentes descritos en la primera fase de modularización. La página mantiene sus seis organismos y los datos académicos existentes. Hero con introducción y fotografía independientes, breadcrumb compartido, CTA del modal y enlace a la malla. El orden de lectura es presentación, ficha y razones, beneficios, aprendizaje, malla y campo profesional. Se usan Poppins/Hani y tokens institucionales.

CareerSectionHeading unifica los encabezados; BenefitCard presenta los beneficios sin duplicar su diseño; CareerBreadcrumbs y ScrollReveal resuelven navegación y entradas. AccountingHeroVisual centraliza la fotografía local mediante Image con respaldo institucional. La malla usa seis AccountingCycleCard con details/summary nativos, abiertos inicialmente y operables con teclado, en una cuadrícula responsive. No tiene temporizadores, clones, controles de carrusel ni estado React propio. Se eliminan AccountingCarousel (experimental sin consumidores), AccountingCurriculumControls y AccountingChecklistItem; AccountingLearningCard presenta los temas numerados sin variantes innecesarias.

AccountingPage conserva useModal para la apertura/cierre del formulario. Los hooks internos de Image y de las animaciones compartidas siguen siendo necesarios; no se duplican efectos en organismos ni moléculas de Contabilidad. Se conservan las asignaturas, duración y afirmaciones académicas preexistentes sin certificarlas como información oficial.

Validación: ESLint del alcance y build correctos (persiste la advertencia conocida del bundle). Portada inspeccionada en escritorio y a 320 px, malla a 390 px; sin desborde horizontal de página a 320 px. Verificados apertura/cierre del modal, enlace a la malla, cierre con clic y apertura con Enter de un ciclo. Movimiento reducido delegado a los componentes compartidos y revisado en código.

## Hero de Contabilidad simplificado — 9 de octubre de 2026

Por indicación del usuario, el hero adopta la base de Sobre nosotros: fotografía de fondo, degradado, patrón triangular, banda inclinada y esquina inferior izquierda curva. Muestra únicamente Contabilidad y el botón Solicitar información conectado al modal existente. Se eliminan breadcrumb, párrafo, destacados, leyenda y acción secundaria del hero; se retiran AccountingHighlights, AccountingHeroVisual y sus datos sin consumidores. Las razones de estudio continúan en la sección de presentación.

BrandedHeroFrame({ image, children }) centraliza la base visual y es consumido por AboutHero y AccountingHero. Usa Image para el fondo condicional y useId para evitar colisiones del patrón SVG; incorpora una altura mínima de 18 rem. AboutHero conserva título, persona y animaciones existentes. Contabilidad conserva ScrollReveal y una molécula de título/acción. Verificados ESLint del alcance, build, escritorio, Contabilidad a 320 px, apertura/cierre del formulario y composición de Sobre nosotros. Persiste la advertencia conocida del tamaño del bundle.

## Contabilidad: estudiante y paleta propia — 9 de octubre de 2026

AccountingHeroStudent integra una estudiante ficticia generada con transparencia, guardada en assets/images/careers/accounting/accounting-student.png. Reutiliza Image y ScrollReveal; se superpone 24/32 px al borde inferior y pasa debajo del título en móvil. Reducido el espacio blanco inferior. BrandedHeroFrame admite variant="institutional" y className, manteniendo por defecto la composición de Sobre nosotros. Contabilidad usa blue-dark, blue y orange; conserva su título y único botón conectado al modal.

Image admite transparent=false por defecto: con true, retira el fondo azul únicamente después de cargar correctamente; conserva el respaldo institucional ante ausencia o error de la imagen. La fotografía generada conserva alfa, sin edición del bitmap. Verificados escritorio, móvil a 390 px y apertura del formulario. ESLint y build correctos, con advertencia conocida de tamaño del bundle.

## Conoce la carrera: ficha compacta — 9 de octubre de 2026

AccountingOverview presenta «Convierte los números en decisiones», una descripción breve y tres datos: duración, modalidad y título obtenido. Se elimina el dato redundante del nombre de carrera. AccountingCapabilities y AccountingCapabilityItem sustituyen AccountingReasonsPanel por tres capacidades con iconos discretos; textos centralizados en data/careers/accounting/overview.js. Se retira hero.js, que solo contenía las razones antiguas sin otros consumidores. El bloque usa neutros y azul, sin acentos naranjas ni acciones adicionales. Conserva CareerSectionHeading, ScrollReveal y átomos de texto. ESLint y build correctos, inspección de escritorio y móvil a 390 px completada.

## Competencias de Contabilidad: carrusel compartido — 9 de octubre de 2026

AccountingLearning reutiliza ContinuousCarousel con arrastre, desplazamiento continuo y sin énfasis central, como Computación. Conserva CareerSectionHeading, ScrollReveal y los átomos Title/Paragraph. AccountingLearningCard presenta títulos, iconos y numeración sobre tarjetas claras con azul institucional; learning.js mantiene las descripciones originales y centraliza sus datos. Los estilos de dimensiones se limitan a accounting-learning-carousel. Las tarjetas originales admiten foco; las copias heredan aria-hidden e inert del carrusel compartido. La malla curricular continúa con details/summary, sin cambios. Revisados escritorio y móvil a 390 px, navegación por teclado y animación activa.

## Malla de Contabilidad por años — 9 de octubre de 2026

AccountingCurriculum agrupa los seis ciclos existentes en tres años mediante accountingCurriculumYears, derivado del catálogo sin duplicar asignaturas. AccountingCurriculumYear compone el encabezado azul con esquina recortada y las tarjetas AccountingCycleCard. Se reutilizan Title, Paragraph, CareerSectionHeading y ScrollReveal; Hani/Rajdhani en títulos y números, Poppins en cursos. Cada ciclo muestra su cantidad real de asignaturas. El hook compartido useMediaQuery establece apertura en escritorio (desde 1024 px) y cierre en tamaños menores; details/summary conserva la interacción nativa. Verificados diseño de escritorio, móvil a 390 px, apertura de cursos y fuentes calculadas. ESLint y build correctos, con advertencia existente de tamaño del bundle.

## Proyección profesional de Contabilidad — 9 de octubre de 2026

AccountingCareerFields presenta dos bloques sobre azul institucional: sectores y funciones, con cuatro categorías cada uno. fields.js conserva los ocho destinos laborales y diez cargos originales dentro de careerSectors/careerFunctions. AccountingCareerGroup reutiliza AccountingFeatureList y ScrollReveal; AccountingInformationCta compone los átomos de texto y Button. AccountingPage pasa openModal mediante onRequest y mantiene una única instancia de ModalMessage. Tipografías Hani/Rajdhani para títulos y Poppins para lectura. CareerSectionHeading incorpora inverse=false para fondos oscuros, sin cambiar por defecto sus consumidores. Verificados escritorio, móvil a 390 px sin desbordamiento horizontal y apertura/cierre del formulario desde el botón final (sin enviar datos). ESLint del alcance y build correctos; permanece la advertencia conocida de tamaño del bundle.

### Tarjetas laborales con recortes y curvas — 9 de octubre de 2026

AccountingFeatureList reutiliza BannerBgCurve design=7 con colores de index.css y altura h-12. La prop mirrored (false por defecto) alterna la esquina superior recortada y refleja la curva; AccountingCareerGroup la deriva de la posición. Se reserva espacio inferior para separar la decoración del contenido. Sin nuevas geometrías SVG ni cambios al componente compartido. Verificados escritorio y móvil a 390 px, con 32 px mínimos entre las listas y el área de las curvas; ESLint y build correctos, con aviso conocido de tamaño del bundle.
