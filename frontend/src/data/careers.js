import administracionImage from "@assets/images/careers/administration/ADMINISTRACION.webp"
import contabilidadImage from "@assets/images/careers/accounting/CONTABILIDAD.webp"
import computacionImage from "@assets/images/careers/computerScience/COMPUTACION.webp"

export const careers = [
  {
    title: "Administración de Empresas",
    href: "/career/administration",
    img: administracionImage,
    hero: {
      description:
        "Forma líderes capaces de planificar, organizar y mejorar procesos para impulsar organizaciones con visión estratégica y compromiso social.",
      highlights: [
        {
          title: "Gestión empresarial",
          description:
            "Diseña estrategias y toma decisiones con base en datos y objetivos claros.",
        },
        {
          title: "Innovación",
          description:
            "Identifica oportunidades para optimizar procesos y fortalecer resultados.",
        },
        {
          title: "Liderazgo",
          description:
            "Desarrolla habilidades para coordinar equipos y liderar proyectos con impacto.",
        },
      ],
    },
  },
  {
    title: "Contabilidad",
    href: "/career/accounting",
    img: contabilidadImage,
  },
  {
    title: "Computación e Informática",
    href: "/career/computer-science",
    img: computacionImage,
  },
  {
    title: "Traducción de Idiomas",
    href: "/career/language-translation",
    img: "INGLES.webp",
  },
];
