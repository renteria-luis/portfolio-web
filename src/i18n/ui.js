// Interface strings. Content lives in src/config/data.js.
//
// Deliberately NOT translated, because they read as jargon in both languages
// or are proper nouns: "skills", "tech stack", technology names, project
// names, and the terminal commands (whoami, cat title.txt, ls /core-focus).

export const ui = {
  nav: {
    about:      { en: 'about',      es: 'sobre-mi' },
    experience: { en: 'experience', es: 'experiencia' },
    projects:   { en: 'projects',   es: 'proyectos' },
    skills:     { en: 'skills',     es: 'skills' },
    contact:    { en: 'contact',    es: 'contacto' },
    blog:       { en: 'blog',       es: 'blog' },
    themeToDark:  { en: 'Switch to dark theme',  es: 'Cambiar a tema oscuro' },
    themeToLight: { en: 'Switch to light theme', es: 'Cambiar a tema claro' },
    langSwitch: { en: 'Ver en español', es: 'View in English' },
    openMenu:   { en: 'Open menu',  es: 'Abrir menú' },
    closeMenu:  { en: 'Close menu', es: 'Cerrar menú' },
  },

  hero: {
    available:   { en: 'available for ML/data roles (Fall 2026)', es: 'disponible para roles de ML/datos (otoño 2026)' },
    viewProjects: { en: './view-projects', es: './ver-proyectos' },
    downloadCv:  { en: 'download resume', es: 'descargar CV' },
    email:       { en: 'email', es: 'correo' },
    scroll:      { en: 'scroll', es: 'baja' },
    srTitle:     { en: ', AI/ML Engineer and Data Scientist, London, Ontario',
                   es: ', Ingeniero de AI/ML y Científico de Datos, London, Ontario' },
  },

  about: {
    label:  { en: '01 / about', es: '01 / sobre mí' },
    title:  { en: 'who I am',   es: 'quién soy' },
    quote:  {
      en: '"I understand the criticality of industrial and operational systems, which shapes how I build ML models: with real business impact, not just academic theory."',
      es: '"Entiendo lo crítico que son los sistemas industriales y operativos, y eso define cómo construyo modelos de ML: con impacto real en el negocio, no solo teoría académica."',
    },
  },

  timeline: {
    label: { en: '02 / experience & education', es: '02 / experiencia y formación' },
    title: { en: 'career timeline', es: 'trayectoria' },
  },

  projects: {
    label:    { en: '03 / projects', es: '03 / proyectos' },
    title:    { en: "what I've built", es: 'lo que he construido' },
    subtitle: { en: 'End-to-end ML systems. Real data, real deployments.',
                es: 'Sistemas de ML de punta a punta. Datos reales, despliegues reales.' },
    more:     { en: 'More on', es: 'Más en' },
    privateRepo: { en: 'private repo', es: 'repo privado' },
    with:     { en: 'with', es: 'con' },
    srcOn:    { en: 'source on GitHub', es: 'código en GitHub' },
    liveDemo: { en: 'live demo', es: 'demo en vivo' },
  },

  skills: {
    label:    { en: '04 / skills', es: '04 / skills' },
    title:    'tech stack',
    subtitle: { en: "Tools I use daily, tools I'm actively learning, and what's on my roadmap.",
                es: 'Herramientas que uso a diario, las que estoy aprendiendo, y lo que viene en mi roadmap.' },
    legend:   { en: 'Legend:', es: 'Leyenda:' },
    levels: {
      core:     { en: 'core',     es: 'sólido' },
      learning: { en: 'learning', es: 'aprendiendo' },
      roadmap:  { en: 'roadmap',  es: 'roadmap' },
    },
  },

  contact: {
    label: { en: '05 / contact', es: '05 / contacto' },
    title: { en: 'hiring for AI/ML?', es: '¿buscas a alguien de AI/ML?' },
    intro: {
      en: 'I reply within 24 hours. If it is about a role, include the stack and the timeline and I can tell you straight away whether I am a fit.',
      es: 'Respondo en menos de 24 horas. Si es por un puesto, incluye el stack y las fechas y te digo enseguida si encajo.',
    },
    whatAbout: { en: 'what is this about?', es: '¿de qué se trata?' },
    intents: {
      'question': { en: 'General question', es: 'Pregunta general' },
      'co-op':    { en: 'Role / Co-op',     es: 'Puesto / Co-op' },
      'collab':   { en: 'Collaboration',    es: 'Colaboración' },
    },
    placeholders: {
      // Same prompt for every intent: an open invitation asks for less than a
      // checklist does.
      'question': { en: 'Ask me anything', es: 'Pregúntame lo que quieras' },
      'co-op':    { en: 'Ask me anything', es: 'Pregúntame lo que quieras' },
      'collab':   { en: 'Ask me anything', es: 'Pregúntame lo que quieras' },
      name:  { en: 'Your Name', es: 'Tu nombre' },
      email: { en: 'you@company.com', es: 'tu@empresa.com' },
      // Left blank on purpose: these are optional, and an example makes an
      // optional field feel required.
      company: '',
      role: '',
      timeline: '',
      link: 'https://github.com/...',
    },
    fields: {
      name:     { en: 'name', es: 'nombre' },
      email:    { en: 'email', es: 'correo' },
      company:  { en: 'company (optional)', es: 'empresa (opcional)' },
      role:     { en: 'role (optional)', es: 'puesto (opcional)' },
      timeline: { en: 'timeline (optional)', es: 'fechas (opcional)' },
      link:     { en: 'repo or project link (optional)', es: 'repo o enlace del proyecto (opcional)' },
      message:  { en: 'message', es: 'mensaje' },
      honeypot: { en: 'Leave this field empty', es: 'Deja este campo vacío' },
    },
    button: {
      idle:    { en: 'send message', es: 'enviar mensaje' },
      queued:  { en: 'queued',  es: 'en cola' },
      running: { en: 'sending', es: 'enviando' },
      error:   { en: 'retry',   es: 'reintentar' },
    },
    queuedNote: { en: 'queued...', es: 'en cola...' },
    delivered:  { en: 'delivered', es: 'entregado' },
    receipt: {
      id:     { en: 'id', es: 'id' },
      queued: { en: 'queued', es: 'en cola' },
      sla:    { en: 'sla', es: 'sla' },
      keep:   { en: 'Keep that id if you need to follow up.',
                es: 'Guarda ese id por si necesitas hacer seguimiento.' },
      again:  { en: 'Click here to send another message', es: 'Haz clic aquí para enviar otro mensaje' },
    },
    copy:     { en: 'copy', es: 'copiar' },
    copied:   { en: 'copied', es: 'copiado' },
    copyAria: { en: 'Copy to clipboard', es: 'Copiar al portapapeles' },
    availability: {
      available:  { en: 'available', es: 'disponible' },
      lookingFor: { en: 'looking for', es: 'busco' },
      lookingForValue: { en: 'AI/ML co-op, Fall 2026', es: 'Co-op de AI/ML, otoño 2026' },
      afterThat:  { en: 'after that', es: 'después' },
      afterThatValue: { en: 'Full-time, from January 2027', es: 'Tiempo completo, desde enero 2027' },
      replies:    { en: 'replies in under 24h · EN / ES', es: 'responde en menos de 24h · EN / ES' },
    },
    errors: {
      network: { en: 'NetworkError: could not reach the server',
                 es: 'NetworkError: no se pudo contactar al servidor' },
    },
  },

  blog: {
    title:  { en: 'writeups', es: 'artículos' },
    intro:  {
      en: 'Longer notes on the decisions behind the projects: why a threshold moved, why the winning model was not the one shipped, and why a rule engine beat an LLM.',
      es: 'Notas largas sobre las decisiones detrás de los proyectos: por qué se movió un umbral, por qué el modelo ganador no fue el que se desplegó, y por qué un motor de reglas le ganó a un LLM.',
    },
    metaTitle: { en: 'Writeups · Luis Renteria', es: 'Artículos · Luis Renteria' },
    metaDescription: {
      en: 'Engineering writeups on machine learning decisions: threshold selection in fraud detection, confounders in churn models, and directing AI coding tools.',
      es: 'Artículos de ingeniería sobre decisiones de machine learning: selección de umbrales en detección de fraude, confusores en modelos de churn, y cómo dirigir herramientas de IA.',
    },
    allPosts:   { en: 'all writeups', es: 'todos los artículos' },
    sourceCode: { en: 'source', es: 'código' },
    notFound:   { en: 'That writeup does not exist', es: 'Ese artículo no existe' },
    readPost:   { en: 'read the writeup', es: 'leer el artículo' },
    footerCta:  {
      en: 'Building something in this space, or hiring for it? I reply within 24 hours.',
      es: '¿Construyes algo parecido, o estás contratando? Respondo en menos de 24 horas.',
    },
    getInTouch: { en: 'get in touch', es: 'escríbeme' },
  },

  footer: {
    thanks: { en: 'echo "Thanks for visiting 👾"', es: 'echo "Gracias por la visita 👾"' },
  },

  skipLink: { en: 'skip to content', es: 'saltar al contenido' },
};
