import studentsImage from "@assets/images/aboutUs/aboutus-students.webp";
import preparationImage from "@assets/images/careers/languageTranslation/translation-workshop.webp";

// Requisitos y pasos de la maqueta del usuario. Modalidad y turnos confirmados
// por el usuario el 10 de octubre de 2026; no implican un cronograma de examen.
const admissionRequirements = [
  "Ficha de inscripción.",
  "Fotocopia de DNI.",
  "Constancia de pago de los derechos de admisión.",
  "Certificado de estudios de la institución de procedencia (original).",
];

const admissionSteps = [
  { title: "Completa tu inscripción", description: "Reúne tus documentos y completa la ficha de inscripción." },
  { title: "Realiza el pago", description: "Conserva la constancia de pago de los derechos de admisión." },
  { title: "Rinde el examen", description: "Prepárate y participa en el examen de admisión." },
  { title: "Obtén tu resultado", description: "Consulta el resultado de tu evaluación." },
];

const admissionStudy = {
  modality: "Presencial",
  description: "Todas nuestras carreras se desarrollan de manera presencial.",
  shifts: ["Mañana", "Tarde", "Noche"],
};

const admissionProcessImages = {
  students: { src: studentsImage, alt: "Imagen ilustrativa de estudiantes trabajando juntos con apuntes y computadoras" },
  preparation: { src: preparationImage, alt: "Imagen ilustrativa de una estudiante revisando documentos y tomando notas" },
};

export { admissionRequirements, admissionSteps, admissionStudy, admissionProcessImages };
