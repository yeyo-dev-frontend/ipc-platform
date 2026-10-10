import infraestrusture from "@assets/images/studentLife/fachada.webp"
import classroom from "@assets/images/studentLife/aulas.webp"
import computerlab from "@assets/images/studentLife/laboratorio.webp"
import yard from "@assets/images/studentLife/patio.webp"
import library from "@assets/images/studentLife/biblioteca.webp"
import studyArea from "@assets/images/studentLife/area-estudio.webp"
import commonArea from "@assets/images/studentLife/area-convivencia.webp"

export const infrastructureSpaces = [
  {
    id: "facade",
    category: "Áreas institucionales",
    title: "Frente del instituto",
    description:
      "La entrada que recibe cada día a nuestra comunidad estudiantil.",
    image: infraestrusture, 
    alt: "Frente del Instituto Privado Celendín",
  },
  {
    id: "classrooms",
    category: "Aulas",
    title: "Aulas",
    description:
      "Ambientes pensados para el desarrollo de las clases y el trabajo en equipo.",
    image: classroom, 
    alt: "Aula del Instituto Privado Celendín",
  },
  {
    id: "computer-lab",
    category: "Laboratorios",
    title: "Laboratorio de cómputo",
    description:
      "Espacio para las clases prácticas y el uso de herramientas tecnológicas.",
    image: computerlab, 
    alt: "Laboratorio de cómputo del Instituto Privado Celendín",
  },
  {
    id: "courtyard",
    category: "Espacios comunes",
    title: "Patio principal",
    description:
      "Un lugar para compartir, descansar y realizar actividades de integración.",
    image: yard, 
    alt: "Patio principal del Instituto Privado Celendín",
  },
  {
    id: "library",
    category: "Biblioteca",
    title: "Biblioteca",
    description:
      "Un ambiente tranquilo para consultar material y reforzar lo aprendido.",
    image: library, 
    alt: "Biblioteca del Instituto Privado Celendín",
  },
  {
    id: "study-area",
    category: "Áreas de estudio",
    title: "Áreas de estudio",
    description:
      "Rincones para estudiar, hacer trabajos y reunirse con compañeros.",
    image: studyArea,
    alt: "Área de estudio del Instituto Privado Celendín",
  },
  {
    id: "common-area",
    category: "Espacios comunes",
    title: "Zonas de convivencia",
    description:
      "Espacios abiertos que facilitan el encuentro entre estudiantes.",
    image: commonArea, 
    alt: "Zona de convivencia del Instituto Privado Celendín",
  },
]

// Línea de categorías que va debajo del mosaico
export const infrastructureCategories = [
  "Aulas",
  "Laboratorios",
  "Biblioteca",
  "Áreas de estudio",
  "Espacios comunes",
  "Áreas institucionales",
]