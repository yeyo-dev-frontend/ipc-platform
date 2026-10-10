export const CONTACT_FORM_GROUPS = [
  [
    { 
      name: "name", 
      label: "Nombre completo", 
      type: "text" 
    },
    { 
      name: "email", 
      label: "Email", 
      type: "email" 
    },
    { 
      name: "phone", 
      label: "Teléfono", 
      type: "tel" 
    },
  ],
  [
    { 
      name: "address",  
      label: "Dirección", 
      type: "text" 
    },
    {
      name: "career",
      label: "Carreras",
      type: "select",
      options: [
        { 
          value: "0", 
          text: "Carrera de interés" 
        },
        { 
          value: "administracion", 
          text: "Administración" 
        },
        { 
          value: "contabilidad", 
          text: "Contabilidad" 
        },
        { 
          value: "informatica", 
          text: "Informática" 
        },
        { 
          value: "idiomas", 
          text: "Idiomas" 
        },
      ],
    },
    {
      name: "shift",
      label: "Turno",
      type: "select",
      options: [
        { 
          value: "0", 
          text: "Seleccione el turno" 
        },
        { 
          value: "manana", 
          text: "Mañana" 
        },
        { 
          value: "tarde", 
          text: "Tarde" 
        },
        { 
          value: "noche", 
          text: "Noche" 
        },
      ],
    },
  ],
  [
    {
      name: "message",
      label: "Mensaje",
      type: "textarea",
      placeholder: "Mensaje...",
    },
  ],
];
