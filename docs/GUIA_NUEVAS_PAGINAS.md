# Guía para crear páginas y continuar en nuevas ramas

### Formulario de contacto compartido — 10 de octubre de 2026

Reutilizar `molecules/shared/contactForm.jsx` → ContactForm, composición única extraída del formulario original por grupos. Inicio usa layout="home" y showSteps; modal usa showSteps y onCancel; Admisión solo appearance="light". Conserva ContactSteps, Toast, FormField, catálogo, hook y Button danger («Enviar»). No crear versiones alternativas del botón o duplicar los mapas de campos en consumidores. FormField genera IDs únicos para coexistir con el modal; fieldErrors puede contener mensajes o booleanos. No declarar operativo el envío sin validar la API /contact; la conexión real permanece pendiente.

Guía actualizada el 5 de octubre de 2026. La revisión inicial del 29 de septiembre se amplía con los contratos actuales. Consultar primero [ESTADO_PROYECTO.md](ESTADO_PROYECTO.md) y [AGENTS.md](../AGENTS.md). El código del checkout tiene prioridad sobre inventarios antiguos.

## 1. Antes de implementar

1. Revisar la rama, el estado de Git y los cambios locales. No sobrescribir trabajo en curso.
2. Leer esta guía desde la rama de destino y comprobar que contiene las actualizaciones de documentación acordadas. Si aún están solo en otra rama, incorporarlas mediante el flujo Git del equipo.
3. Identificar ruta, propósito, contenido confirmado, acciones y estados de la página.
4. Buscar una página similar y los átomos, moléculas, organismos, hooks y datos disponibles.
5. Revisar props y consumidores antes de ampliar piezas compartidas. Crear una rama `codex/<descripcion>` cuando corresponda al trabajo solicitado; no cambiar de rama solo para analizar.
6. Registrar los pendientes existentes relevantes para distinguirlos de regresiones del nuevo trabajo.

No crear de golpe las páginas pendientes ni asumir que un componente parcialmente escrito es una plantilla válida.

## 2. Dónde va cada pieza

| Responsabilidad | Ubicación en frontend/src |
|---|---|
| Composición de una página | components/pages/ |
| Páginas de carreras | components/pages/careers/ |
| Secciones completas | components/organisms/<modulo>/ |
| Tarjetas y composiciones pequeñas | components/molecules/<modulo>/ |
| Bloques compartidos | components/molecules/shared/ o organisms/shared/ según responsabilidad |
| Controles básicos | components/atoms/ |
| Estructura global | components/layouts/ |
| Contenedor de página | components/templates/myTemplate.jsx |
| Catálogos estáticos | data/ y subcarpetas existentes |
| Estado e interacción reutilizable | hooks/ |
| Animaciones compartidas | components/animations/ |
| PDF global | context/pdfViewer/ |
| Llamadas HTTP y validación | helpers/ y validations/ |

Utilizar JavaScript/JSX, componentes funcionales y exportaciones nombradas según el proyecto. Mantener las excepciones existentes como App. Usar nombres lowerCamelCase para archivos nuevos y PascalCase para componentes. No replicar erratas de archivos existentes.

`@/components/atoms/image` resuelve a src/components/atoms/image; `@assets/` resuelve a src/assets. Los imports relativos existentes también son válidos.

## 3. Componer la página y conectar su ruta

MyTemplate aporta el espacio superior. MainLayout ya monta Header, Navbar, Footer y TransitionPage; no duplicarlos.

Ejemplo mínimo de composición, pendiente de añadir sus secciones y contenido real:

```jsx
import { MyTemplate } from "@/components/templates/myTemplate";
import { Title } from "@/components/atoms/titles";

function NuevaPagina({ title }) {
  return (
    <MyTemplate>
      <section className="mx-auto w-[92%] max-w-6xl py-10">
        <Title
          level="h1"
          text={title}
          variant="institutional"
          weight="bold"
          className="font-hani"
        />
      </section>
    </MyTemplate>
  );
}

export { NuevaPagina };
```

Registrar la página en App.jsx y conectar las entradas necesarias del menú en desktopMenu.jsx; MobileMenu recibe ese mismo catálogo. Mantener los slugs actuales. Para navegación interna usar NavbarLink o Link de React Router con to.

MyTemplate acepta className y conserva classmame como alias compatible. Combina las clases con twMerge y usa overflow-x-clip por defecto. Comprobar el efecto sobre sticky y desbordes al cambiarlo.

## 4. Elegir las piezas existentes

| Necesidad | Reutilización recomendada |
|---|---|
| Títulos, párrafos y acciones | Title, Paragraph y Button; nivel y type explícitos |
| Imagen informativa o fondo | Image, con dimensiones y alt apropiados |
| Carrera completa | CareerHero, CareerLearning, CareerWorkplaces, CareerBenefits y CareerDocuments |
| PDF | usePdfViewer().openPdf(pdfUrl, title) |
| Consulta de admisión/contacto | useContactForm, CONTACT_FORM_GROUPS, FormField, ContactSteps y Toast |
| Aparición al hacer scroll | ScrollReveal o useRevealMotion |
| Lista con desplazamiento continuo | ContinuousCarousel; comprobar copia decorativa y controles |
| Carrusel de varias tarjetas | useCarousel y useCardsPerView; verificar adaptación al consumidor |
| Modal de consulta | ModalMessage y useModal; atender pendientes de accesibilidad |
| Estilos de marca | Tokens de index.css |
| Resumen de precios | `PriceSummaryCard` en `molecules/shared/priceSummaryCard.jsx` |

Reutilizar responsabilidad y contrato, no solo apariencia. Si un formulario solicita otros datos, no heredar automáticamente la validación del contacto. No crear otro visor PDF ni un nuevo proveedor por página.

`PriceSummaryCard({ title, items, footer, currency = "S/", className = "" })` presenta un resumen compacto de precios. `items` recibe elementos `{ text, value }` con etiquetas únicas; `footer` es opcional. No importa catálogos ni fija márgenes de superposición. El consumidor aporta datos y controla ancho/posición mediante `className`, combinada con `twMerge`. Admisión pasa el catálogo `ServicesAcademic` compartido con Inicio y aplica sus márgenes negativos desde `AdmissionsHero`. Para listas extensas usar otro layout; esta tarjeta está pensada para pocos conceptos resumidos.

`BannerBgCurve` incorpora diseño 8 para tarjetas con fotografía: `secondaryAccentColor`, `accentColor` y `color` forman dos bandas sobre una base continua. Su viewBox incluye la totalidad de las curvas para evitar cortes horizontales. Admisión usa los tokens blue-dark, orange y neutral-white. Los diseños anteriores se conservan. Para entradas de bloques reutilizar `ScrollReveal`, que delega en `ScrollMotion` y respeta movimiento reducido; la sección de examen anima contenido y tarjeta con y=28, duración 0,6 s y retraso de 0,12 s en la tarjeta.

### Imágenes

El afiche de Admisión usa `BannerBgCurve` diseño 9, con `height="h-full"` y `className="h-full"`, para cubrir la región fotográfica conservando las tres curvas del original. Recibe blue-deep, orange y neutral-white mediante las props de color existentes. SVG sigue siendo el mecanismo de dibujo interno del componente compartido; los consumidores no duplican sus paths. El diseño 8 y los restantes conservan su geometría.

Usar siempre Image en las páginas o componentes nuevos o modificados. Preservar el espacio cuando falte src o falle la carga. Ejemplo informativo:

```jsx
import { Image } from "@/components/atoms/image";

<Image
  src={image}
  alt={imageDescription}
  className="aspect-video rounded-xl"
/>
```

Para fondos, usar alt vacío y fill dentro de un padre relative con altura o proporción. Ajustar imageClassName para object-contain cuando corresponda; usar overlayClassName para legibilidad. El fondo institucional predeterminado es bg-blue-dark.

Los recursos de public usan rutas desde la raíz, por ejemplo `/business_admin/ADMINISTRACION.webp`. Los assets de src pueden importarse con @assets. No poner rutas de public relativas a la URL actual.

### PDF

```jsx
import { Button } from "@/components/atoms/button";
import { usePdfViewer } from "@/context/pdfViewer/usePdfViewer";

function DocumentoButton({ pdfUrl, title }) {
  const { openPdf } = usePdfViewer();

  return (
    <Button
      type="button"
      text="Ver documento"
      disabled={!pdfUrl}
      onClick={() => openPdf(pdfUrl, title)}
      className="rounded-md bg-blue-dark px-4 py-2 text-white"
    />
  );
}

export { DocumentoButton };
```

Usar una URL real; "#" no representa un documento. Confirmar si es oficial o de referencia y reflejarlo en el contenido visible.

## 5. Preparar otra carrera sin copiar Administración

Preparar sus datos propios antes de componer los organismos:

| Bloque | Datos mínimos |
|---|---|
| Catálogo | title, href e img |
| Hero | description y highlights: [{ title, description }] |
| Aprendizaje | [{ title, description, image }] |
| Campo laboral | [{ title, image, layout }] con claves estables y únicas |
| Beneficios | [{ title, description }] e imagen adecuada |
| Documentos | [{ id, title, description, image, tone, pdfUrl }] |

Administración mantiene hero en el catálogo careers; Computación separa su contenido en computerScienceHero.js y computerScienceSections.js. CareerLearning ya admite label y CareerBenefits admite imageAlt: proporcionar los específicos de cada carrera. No duplicar afirmaciones de duración, titulación, empleabilidad, beneficios o requisitos sin contenido confirmado.

## 6. Conectar formularios y acciones reales

La UI compartida envía name, email, phone, address, career, shift y message a POST /contact. La URL base actual es localhost:3000 y no existe implementación del backend en este checkout.

Antes de declarar terminado un envío: identificar la API real, confirmar payload y respuesta, comprobar validación del servidor y configurar la URL según entorno. Mostrar carga, éxito y fallo; conservar datos si hay error.

Asociar cada Label con un id único; inicio y modal pueden estar montados al mismo tiempo. No copiar las limitaciones actuales de FormField. Los botones deben ejecutar una acción real; los enlaces deben llevar a un destino válido.

## 7. Verificar y actualizar la referencia

- Ejecutar `pnpm --filter frontend run lint` y `pnpm --filter frontend run build` cuando se cambie código. El punto de partida tiene dos errores de lint documentados; informar si persisten o se corrigen.
- Revisar visualmente móvil, tablet y escritorio, espacio de navegación fija y desbordes.
- Probar teclado, foco visible, cierre de menús/modales y movimiento reducido.
- Probar imágenes sin src y con URL inválida; mantener fondo, tamaño y lectura.
- Si hay PDF, comprobar apertura, carga/error, cierre, zoom, navegación y descarga.
- Si hay formulario, comprobar validación, envío y reintento contra la API real.
- Revisar recursos locales y URL directas de rutas; el build no valida todo lo anterior.
- Actualizar ESTADO_PROYECTO.md con lo incorporado, contratos nuevos, archivos de referencia, comprobaciones y pendientes. No convertir propuestas en funcionalidades implementadas.
- Revisar el diff y conservar las ediciones ajenas. Una tarea solo documental no necesita volver a compilar la aplicación.

Ficha breve para cada revisión futura:

```text
Fecha y commit base:
Página o capacidad incorporada:
Ruta y archivos principales:
Datos y componentes reutilizables:
Contratos modificados y consumidores:
Verificaciones realizadas:
Pendientes o contenido por confirmar:
Cambios locales todavía sin integrar:
```


## 8. Curvas compartidas y hero de Computación

Para separadores curvos, reutilizar BannerBgCurve de components/molecules/shared/curvePath.jsx. Conserva design (1–5), color, height, position y className. El diseño 6 añade la curva con banda del hero de Computación: pasar color="var(--color-neutral-white)", accentColor="var(--color-orange)" y height="h-16 sm:h-22". accentColor es opcional y solo tiene efecto en diseños con banda. El padre debe estar posicionado; el componente es decorativo y no captura eventos. className permite ajustar la posición (por ejemplo, -bottom-px) mediante twMerge.

ComputerScienceHero recibe title y content desde su página. Los textos, recursos y enlace están en data/computerScienceHero.js; las moléculas Heading, Visual e Intro en components/molecules/careers/ separan responsabilidades. Mantener el título en el catálogo careers y las imágenes en public/computation-informatic. Esta composición conserva el diseño específico de Computación; no sustituye CareerHero de Administración.

El hero de Computación usa exclusivamente utilidades Tailwind para sus estilos locales; computerScienceHero.css fue eliminado. La máscara y transparencia de la figura se activan con has-[img.opacity-100], conservando el respaldo de Image durante carga/error. El contenedor dentro de MyTemplate ajusta el espacio superior por breakpoint sin sobrescribir los estilos de la plantilla.

## 9. Reutilización entre carreras — actualización del 2 de octubre de 2026

CareerLearning acepta label accesible propio, description, eyebrow y digital opcional. LearningCard acepta Icon para su variante digital; se reutilizan ContinuousCarousel, su arrastre y el estado de expansión de las tarjetas. CareerWorkplaces admite digital para representar ámbitos con descripciones e iconos conservando Ver más/Ver menos. CareerBenefits permite title, description, imageAlt y eyebrow sin cambiar los defaults de Administración.

AcademicDocumentCard solo abre el visor si pdfUrl tiene un valor distinto de #; de lo contrario muestra document.status o un mensaje de publicación pendiente. Los documentos de referencia se identifican mediante isReference. No conectar PDF de otra carrera como si fueran oficiales.

MyTemplate admite className y conserva classmame por compatibilidad. Las clases se combinan con twMerge. Para composiciones sticky, Computación usa className="overflow-x-clip"; el valor predeterminado compartido es overflow-x-clip desde la integración del 5 de octubre de 2026. ComputerScienceJourney muestra una composición narrativa propia; sus datos se mantienen fuera del organismo y sus animaciones respetan movimiento reducido.

## 10. Animación vinculada al scroll

ScrollMotion acepta as, children, className, delay, x, y, scale y duration. ScrollReveal delega en este componente. Por defecto conserva la entrada mediante useRevealMotion. Para una página que deba avanzar y retroceder con el scroll, envolverla en ScrollAnimationContext.Provider value="linked": cada elemento calcula su progreso entre start end y end start. En ese modo delay escalona el punto de entrada, no un temporizador; duration solo corresponde al modo de entrada. Se normalizan amplitud y escala para mantener visible el efecto, y el foco fuerza la presentación completa. useMotionPreference desactiva el movimiento y escucha cambios del sistema.

BenefitCard, WorkplaceTile y AcademicDocumentCard reutilizan ScrollMotion conservando sus etiquetas semánticas. No activar el proveedor globalmente: cada página debe elegir el modo. ComputerScienceJourney usa su propio progreso para la escena por etapas; usePinnedScene combina tamaño mínimo y preferencia de movimiento. Conservar su alternativa en flujo para móvil y accesibilidad, el espacio de la navegación y overflow-x-clip de la plantilla para permitir sticky.
LearningCard admite imageAlt (vacío por defecto) junto a image. Para imágenes conceptuales informativas, definir ambos en el catálogo; reutilizar Image para carga y errores. En digital, las imágenes ocupan toda la tarjeta y el zoom acompaña a la expansión existente; no requiere otra librería ni cambia ContinuousCarousel. Mantener el alt descriptivo, el respaldo azul y la preferencia de movimiento reducido.
## 11. Escenas de scroll y paneles

CareerLearning ofrece cinematic opcional, separado de digital. Anima la salida de toda la sección mediante opacidad, escala y desplazamiento al dejar la pantalla. El carrusel mantiene autoplay y arrastre libre: no vincular su posición horizontal al scroll. Se retiraron scrollProgress y useCarouselScroll. No se mantiene fija la sección de aprendizaje ni se agrega espacio de scroll artificial. El foco visible de teclado y el movimiento reducido presentan el contenido completo.

ScrollPanel envuelve secciones en flujo para animar su apertura y escala. No envolver escenas sticky con este componente, pues sus transformaciones y recortes cambiarían el contexto de posicionamiento. tone solo define el fondo del marco. El foco visible de teclado presenta el panel completo; el clic de ratón no cambia el layout.

Las etapas de ComputerScienceJourney reciben image/imageAlt desde los datos y reutilizan Image. usePinnedScene exige espacio vertical suficiente y ausencia de movimiento reducido; mantener el contenido en flujo cuando no se activa. Usar svh para evitar saltos por las barras del navegador móvil y conservar los offsets de navegación de 64px/96px.
ComputingJourneyStep desplaza como una sola unidad el encabezado visible, imagen y texto de cada etapa; evita animarlos como tarjetas independientes cuando se busca una transición entre secciones. El h2 accesible de la escena se conserva y el encabezado visual repetido se excluye del árbol accesible. La entrada de ComputerScienceJourney acompaña la salida de CareerLearning.
Para documentos ficticios autorizados, conservar isReference y una identificación visible dentro del PDF. Computación usa computacion-referencia.pdf, con plan de ejemplo en la página 1 y malla en la 2; ambas tarjetas abren el documento completo en el visor global. Sustituir las rutas por los archivos oficiales y retirar isReference solo cuando el contenido esté confirmado.
## 12. Modularización de Computación — 2 de octubre de 2026

ComputerSciencePage obtiene los textos de computerScienceContent, en data/computerScienceSections.js. ComputerScienceHero delega fondo y parallax en ComputerScienceHeroBackground. ComputerScienceJourney coordina useJourneyMotion y compone ComputingJourneyBackground, Heading, Step y Card. Step usa useJourneyStepMotion para interpolar el capítulo; Card presenta la alternativa en flujo. El encabezado repetido es decorativo y el título semántico permanece accesible. Se retiraron la indicación de desplazamiento y su barra.

CareerLearning delega la salida en useSectionExit. useKeyboardFocusWithin centraliza el foco visible de teclado en este hook, ScrollMotion y ScrollPanel. useMediaQuery centraliza las suscripciones y su limpieza; useMotionPreference y usePinnedScene lo reutilizan sin cambiar los umbrales.

AcademicDocumentCard recibe document y delay; la URL procede exclusivamente de document.pdfUrl. CareerDocuments no duplica pdfUrl ni transmite un id ignorado. LearningCard ya no acepta code: las ilustraciones sustituyeron esa decoración y Image mantiene el respaldo institucional. ScrollReveal permanece como fachada con consumidores activos.


## 13. Eventos y Equipo — revisión del 5 de octubre de 2026

Consultar [REVISION_2026-10-05.md](REVISION_2026-10-05.md). Las nuevas secciones son referencias de composición, pero conservan acciones y accesibilidad pendientes; no copiar esas limitaciones como patrón.

- Eventos se divide en HeroEvents, EventsShowcase y FeatureEvents. EVENTS vive en data/events/evenst.js y FEATURED_EVENTS en data/events/featureEvents.js. El nombre evenst es una errata existente; mantener imports coherentes si se corrige.
- El contrato de EVENTS usa id, category, highlight, longDescription, highlights, date, location e image. No tiene title. Construir un nombre común con category/highlight para títulos, alt y aria-label.
- Usar fecha ISO con offset y los formateadores America/Lima. Diferenciar evento seleccionado, próximo evento y evento finalizado; atender finished del contador y la ausencia de eventos.
- useCardsPerView acepta default (1.3/2.3/3/4), compact (2.2/3/4), grid (2/3/4) o configuración propia. Un grid necesita cantidades enteras y columnas compatibles; no asumir que una variante fraccionaria resuelve ese diseño.
- En carruseles con clones, consumir withTransition y alinear la duración CSS con transitionMs. Los clones decorativos deben quedar fuera del foco y del árbol accesible.
- Separar pausa por hover/foco de la pausa temporal tras un gesto. Un temporizador no debe reactivar autoplay mientras alguien lee una tarjeta. Respetar movimiento reducido y ofrecer control de pausa.
- CardOurTeam recibe name, profession, position, description, photo, subjects y onContact. El consumidor debe proporcionar una acción real para contacto. AsignaturesModal usa portal y anclaje al botón: comprobar teclado, foco, cierre y reposicionamiento; el cierre diferido actual requiere revisión.
- Mantener Image también en fotos de equipo y eventos. Para transiciones usar Motion sobre el contenedor que contiene Image, sin volver a img directo.
- Button incorpora base y actualiza ternary; Paragraph incorpora ternary. Son estilos, no acciones: toda llamada visible necesita destino o handler.
- Los datos de equipo usan avatares y los eventos incluyen contenido institucional no confirmado en la documentación. Identificar las muestras y confirmar datos antes de publicación.

## 14. Traducción de Idiomas — 5 de octubre de 2026

LanguageTranslationPage conserva `/career/language-translation` y el orden de los bloques académicos de Administración y Computación. Sus organismos propios resuelven portada, aprendizaje, proceso narrativo y campo laboral; CareerBenefits y CareerDocuments se reutilizan sin cambiar sus contratos.

El contenido vive en `data/languageTranslation.js`. Cada tema de aprendizaje aporta label, word, title, description, image, imageAlt y example ({ source, target, note }). LanguageTranslationLearning implementa pestañas con navegación por flechas, Inicio y Fin, tabIndex itinerante y paneles etiquetados. TranslationExample es una molécula de presentación: los ejemplos son estáticos, no un servicio de traducción automática. No representan una lista de idiomas impartidos.

LanguageTranslationWorkplaces usa details/summary nativos para ámbitos orientativos. Todos los nuevos recursos visuales usan Image. Los radios pequeños están limitados al contenedor de esta página; no afectan a las otras carreras.

Assets y prompts: `public/careers-editorial/README.md`. Mantener su identificación como imágenes ilustrativas y los documentos como pendientes hasta contar con los oficiales. No inferir duración, certificación o empleabilidad de estos ejemplos.

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

## Imágenes de Traducción — 6 de octubre de 2026

Cada espacio fotográfico de Traducción usa un archivo distinto, incluidas las pestañas de aprendizaje y las dos tarjetas de documentos. Mantener las nueve asignaciones centralizadas en `data/careers/languageTranslation/images.js`. Los WebP y sus prompts están en `src/assets/images/careers/languageTranslation/README.md`. El catálogo puede usar la portada fuera de esta página; dentro de Traducción no se repiten imágenes. Conservar Image para la carga condicional y el respaldo institucional.

## Transición de aprendizaje de Traducción — 6 de octubre de 2026

TranslationLearningPanel coordina fundido, escala sutil de imagen y desplazamiento de texto mediante Motion, sin dependencias nuevas. Los cuatro paneles comparten una celda de grid para conservar la altura; los inactivos usan aria-hidden e inert y no reciben foco ni clics. useMediaQuery respeta cambios dinámicos de prefers-reduced-motion: reduce, con transición inmediata. Se conserva la navegación por flechas, Inicio y Fin. Verificados clics rápidos, teclado, alturas estables y movimiento reducido en 1440/390/320 px; build y lint del alcance pasan.


## Computación: lectura estable y simplificación — 7 de octubre de 2026

Implementado: portada en grid con descripción y acciones junto al título; fondo estático; entradas breves de portada, aprendizaje y pasos. Aprendizaje muestra seis tarjetas con descripciones visibles. El proceso usa tres tarjetas en flujo normal y un ejemplo ilustrativo de biblioteca, sin atribuirlo a un proyecto institucional real. Se mantienen Image, respaldo institucional, documentos de referencia y ruta de admisión existente.

CareerLearning incorpora layout="grid"; conserva layout="carousel" por defecto. LearningCard incorpora presentation="static"; conserva la interacción anterior por defecto. ContinuousCarousel y los componentes de carreras compartidos siguen disponibles. ScrollMotion conserva las entradas de una sola ejecución y movimiento reducido, eliminando el modo linked sin otros consumidores.

Eliminados ScrollPanel, ScrollAnimationContext, useSectionExit, useJourneyMotion, useJourneyStepMotion, usePinnedScene, useKeyboardFocusWithin, ComputingJourneyBackground, ComputingJourneyStep y ComputerScienceHeroIntro. La descripción y las acciones de este último se integran en la cabecera. Retirados el parámetro cinematic, el título decorativo duplicado y wordmark del proceso.

Verificación: build correcto (advertencia de tamaño del bundle); lint global solo reporta los dos errores previos de Toast y CareersCarousel. La inspección visual en navegador queda pendiente: el runtime de automatización falló al iniciar. No se certifican todavía responsive, teclado ni comportamiento visual. Admisión sigue pendiente de implementación y los PDF siguen siendo referencias no oficiales.

## Computación: curva y carrusel uniforme — 7 de octubre de 2026

La portada usa BannerBgCurve diseño 6, sin franja adicional, y una sola acción «Cómo postular» hacia /admissions. Se conservan los botones de las demás secciones. Las tarjetas e imágenes de Computación usan esquinas rectas mediante estilos limitados a esta página.

CareerLearning admite layout="uniform-carousel": reutiliza ContinuousCarousel con tarjetas estáticas, descripciones visibles y escala uniforme. ContinuousCarousel incorpora uniform, paused e id opcionales, manteniendo sus valores anteriores por defecto. La variante uniforme tarda 60 segundos por ciclo, permite arrastre y pausa con hover, foco o control explícito; el foco permite desplazamiento horizontal por teclado. Las copias decorativas son inert. Movimiento reducido detiene la animación y oculta la copia; el control de pausa no se muestra en ese modo. Se conserva layout="grid" como capacidad reutilizable.

Los pasos usan ScrollReveal con 28 px, 0,55 segundos y retrasos de 0,1 segundos. El carrusel anima únicamente la entrada del conjunto y el campo laboral digital conserva entradas verticales sin escala. No se incorporan nuevas dependencias.

Verificación de este ajuste: build y ESLint del alcance correctos. Inspección visual en Edge a 1440/390/320 px, sin desbordamiento horizontal ni errores JavaScript. Verificados curva, CTA único y destino /admissions, esquinas rectas, pausa/reanudación, arrastre, desplazamiento con teclado y movimiento reducido (sin animación ni control de pausa). Administración conserva su carrusel original. Persiste la advertencia conocida del tamaño del bundle.


## Ajuste posterior de Computación — 7 de octubre de 2026

La petición posterior sustituye la variante uniform-carousel por el comportamiento de Administración: ContinuousCarousel con emphasizeCenter, draggable y ciclo CSS compartido de 30 segundos. Se conserva la presentación estática de las tarjetas mediante CareerLearning presentation="static"; los demás consumidores mantienen presentation="interactive". Eliminados el estado y los controles de pausa, la indicación de arrastre y las props/estilos exclusivos de la variante uniforme. Las tarjetas estáticas admiten foco y las copias decorativas permanecen inert.

El hero elimina la descripción larga y su dato sin consumidores, mantiene la frase corta y «Cómo postular», reduce el padding superior y el tamaño de la imagen. La curva 6 usa neutral-white y mayor altura, conectando con aprendizaje sobre fondo claro. Los estilos específicos se limitan a Computación; se conservan la cuadrícula reutilizable, el carrusel compartido y las demás secciones.

Validación: build y ESLint del alcance correctos; Edge a 1440/390/320 px sin desbordamiento horizontal ni errores JavaScript. Hero de 560 px en escritorio; curva clara inspeccionada. Confirmados la eliminación del párrafo y la indicación inferior, el énfasis central y el ciclo de 30 segundos compartido con Administración. Se mantiene la advertencia conocida de tamaño del bundle.

### Restitución del estilo del carrusel — 7 de octubre de 2026

Computación vuelve a usar CareerLearning digital con tarjetas estáticas, rectas y borde neutral-white sobre fondo institucional azul. La curva 6 del hero usa orange. Se retira el espacio superior específico de la versión clara. Se conservan sin cambios la lógica compartida del carrusel, el énfasis central, el ciclo de 30 segundos y la ausencia de controles inferiores.

### Alineación de tarjetas y unión curva — 7 de octubre de 2026

CareerLearning admite emphasizeCenter (true por defecto); Computación lo desactiva para conservar una fila de tarjetas del mismo tamaño, de 18 a 24 rem según el viewport. Las tarjetas se estiran a igual altura. Se mantienen desplazamiento continuo de 30 segundos, arrastre y pausa contextual; Administración conserva el énfasis central. BannerBgCurve incorpora diseño 7 y secondaryAccentColor opcional: dos bandas curvas paralelas blanca y naranja sobre una base blue-dark que conecta con aprendizaje sin remate horizontal naranja. Los diseños anteriores no cambian.

## Contabilidad — 9 de octubre de 2026

Para ampliar Contabilidad, usar las carpetas accounting de pages/careers, organisms/careers, molecules/careers y data/careers. Mantener los datos por sección y los componentes en archivos propios. AccountingPage controla el modal de información y pasa onRequest al hero. AccountingChecklistItem recibe title opcional y description para reutilizar la presentación en beneficios y aprendizaje. AccountingCycleCard presenta un ciclo; AccountingCurriculumControls recibe cycles, current y onSelect. Mantener el hook useCarousel compartido, su withTransition y los controles derivados de la cantidad real de ciclos, sin listas fijas de índices.

### Actualización de Contabilidad: simplificación — 9 de octubre de 2026

La malla vigente sustituye el carrusel de la nota anterior: AccountingCycleCard({ cycle, number }) usa details/summary nativos en una cuadrícula, sin hooks ni controles externos. Se eliminaron AccountingCurriculumControls y AccountingChecklistItem. Para beneficios reutilizar BenefitCard; para encabezados, CareerSectionHeading; para entradas, ScrollReveal; para navegación de portada, CareerBreadcrumbs. AccountingLearningCard presenta los temas numerados. AccountingHeroVisual usa Image y el recurso local; AccountingPage mantiene únicamente useModal como hook propio de composición. No reintroducir lógica de carrusel para consultar asignaturas sin una necesidad explícita.

### Base de hero de marca — 9 de octubre de 2026

BrandedHeroFrame({ image, children }), en molecules/shared, reutiliza el fondo fotográfico mediante Image, el degradado, el patrón SVG con ID único, la banda inclinada y la esquina curva del hero de Sobre nosotros. Cada organismo aporta su contenido y los elementos superpuestos. Sobre nosotros conserva HeroPerson; Contabilidad solo aporta título y botón mediante AccountingHeroIntro. Evitar copiar la geometría en nuevos heroes que usen este diseño.

### Personas recortadas y variantes de hero

Para PNG con alfa, usar Image transparent; el fondo se vuelve transparente solo tras la carga correcta y mantiene bg-blue-dark si falta la imagen o falla. Para garantizar un encuadre completo con el átomo actual, configurar style={{ objectFit: "contain", objectPosition: "bottom" }}. BrandedHeroFrame admite variant="institutional" para azul institucional y className para dimensiones locales; su variante predeterminada conserva Sobre nosotros. La persona superpuesta se coloca fuera del marco que recorta el fondo, con espacio reservado y disposición móvil que no cubra las acciones.

### Encabezados sobre fondos oscuros

CareerSectionHeading admite inverse (false por defecto): cambia el título y la descripción a blanco y el antetítulo a blanco atenuado. Usar esta variante sobre fondos institucionales oscuros para reutilizar estructura y ScrollReveal sin duplicar encabezados. Los consumidores existentes conservan su presentación por defecto.
