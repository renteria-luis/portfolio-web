// ─────────────────────────────────────────────────────────────────
//  src/config/data.js
//  Single source of truth for all portfolio content.
//
//  Bilingual fields are written as { en, es }. Anything left as a plain
//  string is intentionally never translated: technology names, project
//  names, terminal commands, proper nouns and jargon that reads the same
//  in both languages.
// ─────────────────────────────────────────────────────────────────

export const personal = {
  name: "Luis Renteria Lezano",
  initials: "LR",
  title: {
    en: "AI/ML Engineer & Data Scientist",
    es: "Ingeniero de AI/ML y Científico de Datos",
  },
  location: { en: "London, ON, Canada", es: "London, ON, Canadá" },
  email: "luisrenterialezano@gmail.com",
  // NOTE: no `phone` here on purpose. It was never rendered, but it was still
  // compiled into the public JS bundle, so it was scrapeable. CV only.

  // Typing effect lines in the hero. Paths, not prose: identical in both
  // languages on purpose.
  typingLines: [
    "/nlp",
    "/machine-learning",
    "/data-science",
    "/rag",
    "/deep-learning",
    "/mlops",
    "/llm",
    "/data-engineering",
    "/ai-assisted-dev",
    "/ai-agents",
    "/vector-search",
  ],

  tagline: {
    en: "Building end-to-end ML systems with real industrial impact, not just academic theory.",
    es: "Construyo sistemas de ML de punta a punta con impacto industrial real, no solo teoría académica.",
  },

  bio: {
    en: [
      "Electronics & Telecommunications Engineer transitioning to AI/ML Engineering. Currently specializing in NLP, RAG architectures, and MLOps at Fanshawe College and self-directed learning.",
      "My background in high-stakes environments (refinery control systems with PLC/SCADA, and enterprise IP security infrastructure) shapes my approach. I prioritize system reliability, signal integrity, and measurable business impact over isolated academic metrics.",
      "I focus on shipping end-to-end pipelines: transforming messy raw data into containerized, production-ready models and APIs.",
    ],
    es: [
      "Ingeniero Electrónico y de Telecomunicaciones en transición a la Ingeniería de AI/ML. Ahora me especializo en NLP, arquitecturas RAG y MLOps en Fanshawe College y por cuenta propia.",
      "Mi experiencia en entornos críticos (sistemas de control de refinería con PLC/SCADA e infraestructura de seguridad IP empresarial) define cómo trabajo. Priorizo la fiabilidad del sistema, la integridad de la señal y el impacto medible en el negocio por encima de métricas académicas aisladas.",
      "Me enfoco en entregar pipelines completos: convertir datos crudos y desordenados en modelos y APIs contenerizados y listos para producción.",
    ],
  },

  // `key` is the stable identifier the companion uses for its hover lines.
  highlights: [
    { key: "GPA", label: "GPA", value: "4.18 / 4.2",
      note: { en: "Dean's Honour Roll", es: "Cuadro de Honor" } },
    { key: "Models deployed", label: { en: "Models deployed", es: "Modelos desplegados" }, value: "3+",
      note: { en: "End-to-end, Dockerized", es: "De punta a punta, en Docker" } },
    { key: "Recall (Fraud)", label: { en: "Recall (Fraud)", es: "Recall (Fraude)" }, value: "85%",
      note: "PR-AUC 0.91" },
    { key: "Kaggle rank", label: { en: "Kaggle rank", es: "Puesto en Kaggle" }, value: "#202",
      note: { en: "House Prices comp", es: "Competencia House Prices" } },
  ],

  photoUrl: '/photo.webp',
  cvUrl: "/luis_renteria_cv.pdf",

  socials: {
    github: "https://github.com/renteria-luis",
    linkedin: "https://linkedin.com/in/renteria-luis",
    huggingface: "https://huggingface.co/renteria-luis",
    kaggle: "https://www.kaggle.com/luisrenterialezano",
    leetcode: "https://leetcode.com/u/renteria-luis/",
  },
};

// ─────────────────────────────────────────────────────────────────
//  PROJECTS
// ─────────────────────────────────────────────────────────────────
export const projects = [
  {
    id: "wisp",
    period: { en: "Jun 2026 - Jul 2026", es: "Jun 2026 - Jul 2026" },
    title: "Wisp",
    subtitle: {
      en: "Cross-Platform Mobile App · AI-Assisted Build",
      es: "App Móvil Multiplataforma · Construida con Asistencia de IA",
    },
    description: {
      en: "A fully offline, cross-platform quit-smoking companion (Expo + React Native, TypeScript). I designed the product and built it end to end by directing AI coding tools in a stack I hadn't used before. A deterministic, fully-tested rule engine (never an LLM at runtime) computes each user's adaptive plan, so it stays private, offline and explainable. Includes on-device SQLite storage, trend-based (non-punitive) progress, local notifications, English/Spanish, and CI with strict type-checking and tests.",
      es: "Un acompañante para dejar de fumar, totalmente offline y multiplataforma (Expo + React Native, TypeScript). Diseñé el producto y lo construí de punta a punta dirigiendo herramientas de IA sobre un stack que no había usado antes. Un motor de reglas determinista y con tests completos (nunca un LLM en tiempo de ejecución) calcula el plan adaptativo de cada usuario, así se mantiene privado, offline y explicable. Incluye almacenamiento SQLite en el dispositivo, progreso basado en tendencias (no punitivo), notificaciones locales, inglés/español y CI con verificación estricta de tipos y tests.",
    },
    status: "complete",
    statusLabel: { en: "Shipped", es: "Publicado" },
    tags: ["Expo", "React Native", "TypeScript", "AI-assisted coding", "SQLite", "Zustand", "NativeWind", "i18next", "Jest", "CI"],
    metrics: [
      { label: { en: "Platform", es: "Plataforma" }, value: "iOS + Android" },
      { label: { en: "On-device", es: "En dispositivo" }, value: "100%" },
      { label: { en: "Engine", es: "Motor" }, value: { en: "Deterministic", es: "Determinista" } },
    ],
    links: { github: "https://github.com/renteria-luis/wisp", demo: null },
    accent: "terminal-purple",
    featured: true,
  },
  {
    id: "cairn",
    period: { en: "May 2026 - Present", es: "May 2026 - Presente" },
    title: "Cairn",
    subtitle: {
      en: "On-Device RAG Study Assistant · Android",
      es: "Asistente de Estudio RAG en el Dispositivo · Android",
    },
    description: {
      en: "An offline Android study assistant: upload documents to a notebook and ask questions answered from your own material, with no internet and nothing leaving the device. I designed the chunking and retrieval layer: sentence-aware chunking sized to the embedding token limit, dense retrieval over an ObjectBox HNSW vector index using EmbeddingGemma, feeding a local LLM. Retrieval is scoped per notebook so answers stay grounded in the right source.",
      es: "Un asistente de estudio para Android que funciona offline: subes documentos a un cuaderno y haces preguntas que se responden desde tu propio material, sin internet y sin que nada salga del dispositivo. Diseñé la capa de fragmentación y recuperación: chunking consciente de las oraciones y ajustado al límite de tokens del modelo de embeddings, recuperación densa sobre un índice vectorial HNSW de ObjectBox con EmbeddingGemma, alimentando un LLM local. La recuperación está acotada por cuaderno, así las respuestas se mantienen ancladas a la fuente correcta.",
    },
    status: "building",
    statusLabel: { en: "In Development", es: "En desarrollo" },
    tags: ["Android", "Kotlin", "RAG", "EmbeddingGemma", "ObjectBox HNSW", "Vector Search", "Local LLM", "On-device"],
    metrics: [
      { label: "Embeddings", value: "EmbeddingGemma" },
      { label: { en: "Vector store", es: "Índice vectorial" }, value: "HNSW" },
      { label: "Runtime", value: "100% offline" },
    ],
    links: {
      // Private capstone repo owned by my teammate, so there is no public URL
      // to link. Showing a dead link is worse than saying so plainly.
      github: null,
      demo: null,
    },
    collaborators: [
      { name: "Mannyking", url: "https://github.com/Mannyking", role: "repo owner" },
    ],
    repoPrivate: true,
    accent: "terminal-orange",
    featured: true,
  },
  {
    id: "fraud-detection",
    period: { en: "Jan 2026 - Mar 2026", es: "Ene 2026 - Mar 2026" },
    title: "Fraud Detection",
    subtitle: { en: "End-to-End ML Pipeline", es: "Pipeline de ML de Punta a Punta" },
    description: {
      en: "Engineered a fraud detection pipeline focused on resolving data-level bottlenecks and extreme class imbalance. Evaluated 3 baseline architectures (Logistic Regression, Random Forest, XGBoost) and prioritized robust feature engineering over unnecessary model complexity. Optimized the classification threshold to 0.2226 to strictly maximize Recall. Deployed the selected model via FastAPI with Pydantic validation and multi-stage Docker containerization.",
      es: "Construí un pipeline de detección de fraude enfocado en resolver cuellos de botella a nivel de datos y un desbalance de clases extremo. Evalué 3 arquitecturas base (Regresión Logística, Random Forest, XGBoost) y prioricé una ingeniería de características sólida por encima de complejidad innecesaria en el modelo. Optimicé el umbral de clasificación a 0.2226 para maximizar estrictamente el Recall. Desplegué el modelo elegido con FastAPI, validación con Pydantic y contenerización Docker multi-etapa.",
    },
    status: "live",
    statusLabel: { en: "Live on HF", es: "En vivo en HF" },
    tags: ["Python", "XGBoost", "Scikit-learn", "FastAPI", "Docker", "Docker Compose", "Streamlit", "Hugging Face", "EDA"],
    metrics: [
      { label: "Recall", value: "85%" },
      { label: "PR-AUC", value: "0.91" },
      { label: { en: "Threshold", es: "Umbral" }, value: "0.2226" },
    ],
    links: {
      github: "https://github.com/renteria-luis/fraud-detection-v1",
      demo: "https://huggingface.co/spaces/renteria-luis/fraud-detection-v1",
    },
    accent: "terminal-green",
    featured: true,
  },
  {
    id: "graph-aml",
    period: { en: "May 2026 - Present", es: "May 2026 - Presente" },
    title: "Graph AML Detector",
    subtitle: {
      en: "Graph ML · GNN · Agentic AI (In Development)",
      es: "Graph ML · GNN · IA Agéntica (en desarrollo)",
    },
    description: {
      en: "Graph neural network that detects money laundering on a real Bitcoin transaction graph, where fraud lives in network topology rather than in isolated transactions. Trains GraphSAGE with neighbor sampling on the Elliptic dataset and benchmarks it against an XGBoost baseline to prove the graph adds signal. A planned LangGraph ReAct agent layer will then investigate each flagged node and produce an explainable risk report.",
      es: "Red neuronal de grafos que detecta lavado de dinero sobre un grafo real de transacciones de Bitcoin, donde el fraude vive en la topología de la red y no en transacciones aisladas. Entrena GraphSAGE con muestreo de vecinos sobre el dataset Elliptic y lo compara contra una base de XGBoost para demostrar que el grafo aporta señal. Una capa de agentes ReAct con LangGraph, ya planificada, investigará cada nodo marcado y producirá un reporte de riesgo explicable.",
    },
    status: "building",
    statusLabel: { en: "In Development", es: "En desarrollo" },
    tags: ["Python", "PyTorch Geometric", "GraphSAGE", "GNN", "LangGraph", "FastAPI", "NetworkX", "Docker", "Docker Compose"],
    metrics: [
      { label: "Dataset", value: "Elliptic 204K" },
      { label: { en: "Model", es: "Modelo" }, value: "GraphSAGE" },
      { label: { en: "Layers", es: "Capas" }, value: { en: "GNN + Agent", es: "GNN + Agente" } },
    ],
    links: { github: "https://github.com/renteria-luis/graph-aml-detector", demo: null },
    accent: "terminal-blue",
    featured: true,
  },
  {
    id: "telco-churn",
    period: { en: "Nov 2025 - Jan 2026", es: "Nov 2025 - Ene 2026" },
    title: "Telco Churn Prediction",
    subtitle: {
      en: "Classification · Threshold Optimization · Dockerization",
      es: "Clasificación · Optimización de Umbral · Dockerización",
    },
    description: {
      en: "End-to-end churn prediction pipeline. Month-to-month analysis showed referrals and price sensitivity drive retention. A soft-voting ensemble with a 0.3 threshold prioritized recall over precision. Probabilities guide interventions, and XGBoost flagged senior citizens as high-risk.",
      es: "Pipeline completo de predicción de abandono. El análisis mes a mes mostró que las referencias y la sensibilidad al precio son lo que impulsa la retención. Un ensemble de soft-voting con umbral 0.3 priorizó el recall sobre la precisión. Las probabilidades guían las intervenciones, y XGBoost identificó a los adultos mayores como grupo de alto riesgo.",
    },
    status: "complete",
    statusLabel: { en: "Complete", es: "Completo" },
    tags: ["Python", "Scikit-learn", "XGBoost", "Pandas", "EDA", "Ensemble"],
    metrics: [
      { label: { en: "Threshold", es: "Umbral" }, value: "0.3" },
      { label: { en: "Model", es: "Modelo" }, value: "Ensemble" },
      { label: { en: "Focus", es: "Enfoque" }, value: "Recall" },
    ],
    links: { github: "https://github.com/renteria-luis/telco-churn-prediction", demo: null },
    accent: "terminal-purple",
    featured: false,
  },
  {
    id: "house-prices",
    period: { en: "Oct 2025 - Nov 2025", es: "Oct 2025 - Nov 2025" },
    title: "House Prices Kaggle Competition",
    subtitle: {
      en: "Regression · Feature Engineering · Kaggle Competition",
      es: "Regresión · Ingeniería de Características · Competencia de Kaggle",
    },
    description: {
      en: "Built a robust regression pipeline to predict housing prices. Engineered cross-validated features and implemented a soft-voting ensemble optimizing over Lasso, Random Forest, Gradient Boosting, and SVR via GridSearch. Ranked #202 on the Kaggle Public Leaderboard (Oct 2025) by minimizing prediction error across diverse model architectures.",
      es: "Construí un pipeline de regresión robusto para predecir precios de vivienda. Diseñé características validadas de forma cruzada e implementé un ensemble de soft-voting optimizando sobre Lasso, Random Forest, Gradient Boosting y SVR mediante GridSearch. Alcancé el puesto #202 en la tabla pública de Kaggle (oct 2025) minimizando el error de predicción a través de arquitecturas de modelo diversas.",
    },
    status: "complete",
    statusLabel: { en: "Complete", es: "Completo" },
    tags: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Regression"],
    metrics: [
      { label: { en: "Model", es: "Modelo" }, value: "Voting Reg." },
      { label: "Kaggle", value: "#202" },
      { label: "Stack", value: "Scikit-learn" },
    ],
    links: { github: "https://github.com/renteria-luis/house-prices-prediction", demo: null },
    accent: "terminal-orange",
    featured: false,
  },
];

// ─────────────────────────────────────────────────────────────────
//  EXPERIENCE & EDUCATION  (Timeline)
// ─────────────────────────────────────────────────────────────────
export const timeline = [
  {
    id: "fanshawe",
    type: "education",
    institution: "Fanshawe College",
    role: {
      en: "Graduate Certificate, Artificial Intelligence & Machine Learning (Co-op)",
      es: "Certificado de Posgrado, Inteligencia Artificial y Machine Learning (Co-op)",
    },
    period: { en: "Sep 2025 - Present", es: "Sep 2025 - Presente" },
    location: "London, ON",
    description: {
      en: "Focused on deploying robust ML systems. Specializing in LLM/RAG integration, advanced NLP techniques, and building containerized MLOps pipelines.",
      es: "Enfocado en desplegar sistemas de ML robustos. Me especializo en integración de LLM/RAG, técnicas avanzadas de NLP y construcción de pipelines de MLOps contenerizados.",
    },
    tags: ["ML", "Deep Learning", "NLP", "MLOps", "Co-op"],
    highlight: { en: "Dean's Honour Roll · GPA 4.18/4.2", es: "Cuadro de Honor · GPA 4.18/4.2" },
  },
  {
    id: "hikvision",
    type: "experience",
    institution: "Hikvision Peru",
    role: { en: "Technical Support Analyst", es: "Analista de Soporte Técnico" },
    period: { en: "Aug 2023 - Feb 2024", es: "Ago 2023 - Feb 2024" },
    location: { en: "Peru", es: "Perú" },
    description: {
      en: "Tested new hardware and software before market release, identifying and reporting defects to the product team. Deployed and validated IP video-security infrastructure (network architecture, servers, structured cabling), and delivered 20+ technical training sessions to installers and integration partners.",
      es: "Probé hardware y software nuevos antes de su salida al mercado, identificando y reportando defectos al equipo de producto. Desplegué y validé infraestructura de videoseguridad IP (arquitectura de red, servidores, cableado estructurado) y dicté más de 20 capacitaciones técnicas a instaladores y socios integradores.",
    },
    tags: [
      { en: "QA / Testing", es: "QA / Pruebas" },
      "IP Video",
      { en: "Networking", es: "Redes" },
      { en: "Technical Training", es: "Capacitación técnica" },
    ],
    highlight: {
      en: "20+ technical training sessions · hardware/software QA",
      es: "Más de 20 capacitaciones técnicas · QA de hardware y software",
    },
  },
  {
    id: "td-synnex",
    type: "experience",
    institution: "TD Synnex",
    role: { en: "Renewals Specialist", es: "Especialista en Renovaciones" },
    period: { en: "Apr 2023 - Aug 2023", es: "Abr 2023 - Ago 2023" },
    location: { en: "Lima, Peru", es: "Lima, Perú" },
    description: {
      en: "Collaborated with pre-sales teams and assisted enterprise clients with Fortinet and Cisco infrastructure. Navigated technical requirements for network security and hardware deployments.",
      es: "Colaboré con equipos de preventa y asistí a clientes empresariales con infraestructura Fortinet y Cisco. Gestioné requerimientos técnicos de seguridad de red y despliegues de hardware.",
    },
    tags: [
      { en: "Technical Sales", es: "Venta técnica" },
      { en: "Networking", es: "Redes" },
      "Fortinet",
      "Cisco",
    ],
    highlight: {
      en: "Managed network security requirements for enterprise clients",
      es: "Gestioné requerimientos de seguridad de red para clientes empresariales",
    },
  },
  {
    id: "bermalar",
    type: "experience",
    institution: { en: "Bermalar Consulting, Petroperu Refinery", es: "Bermalar Consulting, Refinería Petroperú" },
    role: { en: "Applications Engineer", es: "Ingeniero de Aplicaciones" },
    period: { en: "Feb 2022 - Mar 2023", es: "Feb 2022 - Mar 2023" },
    location: { en: "Lima, Peru", es: "Lima, Perú" },
    description: {
      en: "Programmed Allen-Bradley PLC control logic (Studio 5000) and designed the operator HMI (FactoryTalk View) for a condensate treatment plant on the Talara Refinery Modernization. Configured and calibrated field instruments and ran FAT/SAT validation as one of three engineers.",
      es: "Programé la lógica de control de PLC Allen-Bradley (Studio 5000) y diseñé el HMI de operador (FactoryTalk View) para una planta de tratamiento de condensados en la Modernización de la Refinería de Talara. Configuré y calibré instrumentos de campo y ejecuté validaciones FAT/SAT como uno de tres ingenieros.",
    },
    tags: ["PLC / Studio 5000", "HMI / SCADA", { en: "Instrumentation", es: "Instrumentación" }, "FAT/SAT"],
    highlight: {
      en: "Programmed PLC + HMI for a refinery modernization",
      es: "Programé PLC + HMI para la modernización de una refinería",
    },
  },
  {
    id: "ucsp",
    type: "education",
    institution: { en: "Catholic University of San Pablo (UCSP)", es: "Universidad Católica San Pablo (UCSP)" },
    role: {
      en: "Bachelor's, Electronic & Telecommunications Engineering",
      es: "Licenciatura en Ingeniería Electrónica y de Telecomunicaciones",
    },
    period: { en: "Aug 2015 - Aug 2020", es: "Ago 2015 - Ago 2020" },
    location: { en: "Arequipa, Peru", es: "Arequipa, Perú" },
    description: {
      en: "Full-scholarship Aerospace Engineering summer program at Shanghai Jiao Tong University (SJTU), China. Strong foundation in signal processing, control systems, and electronics.",
      es: "Programa de verano de Ingeniería Aeroespacial con beca completa en Shanghai Jiao Tong University (SJTU), China. Base sólida en procesamiento de señales, sistemas de control y electrónica.",
    },
    tags: [
      { en: "Electronics", es: "Electrónica" },
      { en: "Telecommunications", es: "Telecomunicaciones" },
      { en: "Control Systems", es: "Sistemas de control" },
      { en: "Signals", es: "Señales" },
    ],
    highlight: {
      en: "Full scholarship, Aerospace program at SJTU, China",
      es: "Beca completa, programa Aeroespacial en SJTU, China",
    },
  },
];

// ─────────────────────────────────────────────────────────────────
//  SKILLS
//  Technology names are never translated.
// ─────────────────────────────────────────────────────────────────
export const skillCategories = [
  {
    id: "ml-ai",
    label: { en: "Machine Learning & NLP", es: "Machine Learning y NLP" },
    icon: "brain",
    skills: [
      { name: "Python",       level: "core",     icon: "SiPython" },
      { name: "PyTorch",      level: "core",     icon: "SiPytorch" },
      { name: "Scikit-learn", level: "core",     icon: "SiScikitlearn" },
      { name: "XGBoost",      level: "core",     icon: "FaSitemap" },
      { name: "Pandas",       level: "core",     icon: "SiPandas" },
      { name: "NumPy",        level: "core",     icon: "SiNumpy" },
      { name: "spaCy",        level: "core",     icon: "SiSpacy" },
      { name: { en: "RAG Architectures", es: "Arquitecturas RAG" }, level: "learning", icon: "FaProjectDiagram" },
      { name: "Vector Search", level: "learning", icon: "FaSitemap" },
      { name: "Embeddings",    level: "learning", icon: "FaProjectDiagram" },
      { name: { en: "On-device AI", es: "IA en dispositivo" }, level: "learning", icon: "FaRobot" },
      { name: "HuggingFace",   level: "learning", icon: "SiHuggingface" },
      { name: "LangChain",     level: "learning", icon: "SiLangchain" },
    ],
  },
  {
    id: "web-dev",
    label: { en: "Web & AI-Assisted Dev", es: "Web y Desarrollo Asistido por IA" },
    icon: "layers",
    skills: [
      { name: "HTML",       level: "core",     icon: "SiHtml5" },
      { name: "CSS",        level: "core",     icon: "SiCss3" },
      { name: "JavaScript", level: "learning", icon: "SiJavascript" },
      { name: { en: "AI Coding Tools", es: "Herramientas de IA para código" }, level: "core", icon: "FaRobot" },
      { name: "Prompt Engineering", level: "core",     icon: "FaTerminal" },
      { name: "Agentic Workflows",  level: "learning", icon: "FaProjectDiagram" },
    ],
  },
  {
    id: "data-eng",
    label: { en: "Data Engineering & Analytics", es: "Ingeniería de Datos y Analítica" },
    icon: "database",
    skills: [
      { name: "SQL",           level: "core",     icon: "FaDatabase" },
      { name: "PostgreSQL",    level: "learning", icon: "SiPostgresql" },
      { name: "BeautifulSoup", level: "learning", icon: "FaSpider" },
      { name: "MongoDB",       level: "roadmap",  icon: "SiMongodb" },
      { name: "Airflow",       level: "roadmap",  icon: "SiApacheairflow" },
    ],
  },
  {
    id: "mlops",
    label: { en: "MLOps & Infrastructure", es: "MLOps e Infraestructura" },
    icon: "box",
    skills: [
      { name: "Docker",         level: "core",     icon: "SiDocker" },
      { name: "Git",            level: "core",     icon: "SiGit" },
      { name: "GitHub",         level: "core",     icon: "SiGithub" },
      { name: "Linux CLI",      level: "core",     icon: "SiLinux" },
      { name: "Bash",           level: "core",     icon: "SiGnubash" },
      { name: "Pytest",         level: "learning", icon: "SiPytest" },
      { name: "GitHub Actions", level: "learning", icon: "SiGithubactions" },
      { name: "MLflow",         level: "roadmap",  icon: "SiMlflow" },
      { name: "Azure",          level: "roadmap",  icon: "TbBrandAzure" },
      { name: "Kubernetes",     level: "roadmap",  icon: "SiKubernetes" },
    ],
  },
  {
    id: "data-apps",
    label: "Data Apps & APIs",
    icon: "layers",
    skills: [
      { name: "FastAPI",    level: "core",     icon: "SiFastapi" },
      { name: "Streamlit",  level: "core",     icon: "SiStreamlit" },
      { name: "Matplotlib", level: "core",     icon: "BiLineChart" },
      { name: "Seaborn",    level: "core",     icon: "BsGraphUpArrow" },
      { name: "Gradio",     level: "learning", icon: "FaPlayCircle" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
//  COMPANION  (the floating astronaut cat)
//  The cat speaks about Luis in the third person in Spanish, which is how
//  a little mascot would naturally refer to its owner.
// ─────────────────────────────────────────────────────────────────
export const companion = {
  frames: {
    open: "/companion/cat-open.webp",
    closed: "/companion/cat-closed.webp",
  },
  dialogues: {
    hero: [
      { en: "Welcome aboard, scroll to explore my work", es: "Bienvenido a bordo, baja para ver su trabajo" },
      { en: "Hey! I'm Luis's little astronaut", es: "¡Hola! Soy el astronauta de Luis" },
      { en: "Float on down, there's good stuff below", es: "Flota hacia abajo, hay cosas buenas" },
      { en: "Scroll to see what I've built", es: "Baja para ver lo que ha construido" },
    ],
    about: [
      { en: "A bit about who I am", es: "Un poco sobre quién es" },
      { en: "The human behind the code", es: "El humano detrás del código" },
      { en: "Here's my story so far", es: "Su historia hasta ahora" },
    ],
    experience: [
      { en: "My journey: refineries to neural nets", es: "Su camino: de refinerías a redes neuronales" },
      { en: "Where I've been", es: "Por dónde ha pasado" },
      { en: "From PLCs to LLMs", es: "De PLCs a LLMs" },
    ],
    projects: [
      { en: "Six projects, all real, shipped or shipping", es: "Seis proyectos, todos reales, publicados o en camino" },
      { en: "Hover a card, then click the links to open the repos", es: "Pasa por una tarjeta y abre los repos con los enlaces" },
      { en: "These aren't demos, they run in production", es: "No son demos, corren en producción" },
      { en: "Peek the code on GitHub", es: "Échale un ojo al código en GitHub" },
      { en: "From fraud detection to a shipped mobile app", es: "De detección de fraude a una app móvil publicada" },
    ],
    skills: [
      { en: "The tools I build with", es: "Las herramientas con las que construye" },
      { en: "My daily stack", es: "Su stack del día a día" },
      { en: "What's in the toolbox", es: "Lo que hay en la caja de herramientas" },
    ],
    contact: [
      { en: "This is the part where you say hi", es: "Esta es la parte donde saludas" },
      { en: "He actually replies, usually same day", es: "De verdad responde, casi siempre el mismo día" },
      { en: "Hiring for AI/ML? Perfect timing", es: "¿Buscas a alguien de AI/ML? Momento perfecto" },
      { en: "Copy the email, I'll wait", es: "Copia el correo, yo espero" },
    ],
  },
  projectLines: {
    "wisp":            { en: "Wisp: I built this whole app with AI tooling", es: "Wisp: construyó la app entera con herramientas de IA" },
    "cairn":           { en: "Cairn runs a RAG assistant fully offline", es: "Cairn corre un asistente RAG totalmente offline" },
    "fraud-detection": { en: "This one's live on Hugging Face, try it", es: "Este está en vivo en Hugging Face, pruébalo" },
    "graph-aml":       { en: "Catching money laundering in a transaction graph", es: "Cazando lavado de dinero en un grafo de transacciones" },
    "telco-churn":     { en: "Predicting who's about to churn", es: "Prediciendo quién está por irse" },
    "house-prices":    { en: "Ranked #202 on Kaggle", es: "Puesto #202 en Kaggle" },
  },
  hoverLines: {
    "photo":           { en: "That's me", es: "Ese es él" },
    "GPA":             { en: "Top of my class, quietly proud", es: "Primero de su clase, calladamente orgulloso" },
    "Models deployed": { en: "Real models, actually deployed", es: "Modelos reales, de verdad desplegados" },
    "Recall (Fraud)":  { en: "Caught 85% of the fraud", es: "Atrapó el 85% del fraude" },
    "Kaggle rank":     { en: "Cracked the top on Kaggle", es: "Se metió arriba en Kaggle" },
    "ucsp":            { en: "Studied abroad in Shanghai, China. What an experience", es: "Estudió en Shanghái, China. Vaya experiencia" },
    "fanshawe":        { en: "Where I'm leveling up in AI/ML right now", es: "Donde está subiendo de nivel en AI/ML ahora" },
    "bermalar":        { en: "Programming PLCs in a refinery, real stakes", es: "Programando PLCs en una refinería, riesgo real" },
    "hikvision":       { en: "Testing gear before it hit the market", es: "Probando equipos antes de salir al mercado" },
    "td-synnex":       { en: "Cisco & Fortinet renewals days", es: "Días de renovaciones Cisco y Fortinet" },
  },
};
