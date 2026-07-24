// ─────────────────────────────────────────────────────────────────
//  src/config/data.js
//  Single source of truth for all portfolio content.
//  To update: add/edit here. No component files need to change.
// ─────────────────────────────────────────────────────────────────

export const personal = {
  name: "Luis Renteria",
  initials: "LR",
  title: "AI/ML Engineer & Data Scientist in Training",
  location: "London, ON — Canada",
  email: "l_renterialezano@fanshaweonline.ca",
  phone: "548-391-6575",

  // typing effect lines that cycle after your name in the hero
  typingLines: [
    "/nlp",
    "/machine-learning",
    "/data-science",
    "/rag",
    "/deep-learning",
    "/mlops",
    "/llm",
    "/data-engineering",
    "/vibe-coding",
    "/ai-agents",
    "/vector-search",
  ],

  // Short punchy tagline under the typing effect
  tagline: "Building end-to-end ML systems with real industrial impact — not just academic theory.",

  // Bio paragraph for the About section
  bio: [
    "Electronics & Telecommunications Engineer transitioning to AI/ML Engineering. Currently specializing in NLP, RAG architectures, and MLOps at Fanshawe College and self-directed learning.",
    "My background in high-stakes environments — refinery control systems (PLC/SCADA) and enterprise IP security infrastructure — shapes my approach. I prioritize system reliability, signal integrity, and measurable business impact over isolated academic metrics.",
    "I focus on shipping end-to-end pipelines: transforming messy raw data into containerized, production-ready models and APIs."
  ],

  // Key metrics shown as highlights
  highlights: [
    { label: "GPA", value: "4.18 / 4.2", note: "Dean's Honour Roll" },
    { label: "Models deployed", value: "3+", note: "End-to-end, Dockerized" },
    { label: "Recall (Fraud)", value: "85%", note: "PR-AUC 0.91" },
    { label: "Kaggle rank", value: "#202", note: "House Prices comp" },
  ],

  // Photo — replace '/photo.jpg' with your actual image path in /public
  // Recommended: Professional headshot, neutral/dark background,
  // well-lit face. A shot at your desk or with a monitor works great too.
  // Square crop (1:1) looks best at the size rendered here.
  photoUrl: '/photo.jpg', // e.g. '/photo.jpg'

  // CV PDF — place your PDF inside /public and update this path
  cvUrl: "/luis_renteria_cv.pdf",

  socials: {
    github: "https://github.com/renteria-luis",
    linkedin: "https://linkedin.com/in/renteria-luis",
  },
};

// ─────────────────────────────────────────────────────────────────
//  PROJECTS
// ─────────────────────────────────────────────────────────────────
export const projects = [
  {
    id: "wisp",
    title: "Wisp",
    subtitle: "Cross-Platform Mobile App · AI-Assisted Build",
    description:
      "A fully offline, cross-platform quit-smoking companion (Expo + React Native, TypeScript). I designed the product and built it end to end by directing AI coding tools in a stack I hadn't used before. A deterministic, fully-tested rule engine — never an LLM at runtime — computes each user's adaptive plan, so it stays private, offline and explainable. Includes on-device SQLite storage, trend-based (non-punitive) progress, local notifications, English/Spanish, and CI with strict type-checking and tests.",
    status: "complete",
    statusLabel: "Shipped",
    tags: ["Expo", "React Native", "TypeScript", "AI-assisted coding", "SQLite", "Zustand", "NativeWind", "i18next", "Jest", "CI"],
    metrics: [
      { label: "Platform", value: "iOS + Android" },
      { label: "On-device", value: "100%" },
      { label: "Engine", value: "Deterministic" },
    ],
    links: {
      github: "https://github.com/renteria-luis/wisp",
      demo: null,
    },
    accent: "terminal-purple",
    featured: true,
  },
  {
    id: "cairn",
    title: "Cairn",
    subtitle: "On-Device RAG Study Assistant · Android",
    description:
      "An offline Android study assistant: upload documents to a notebook and ask questions answered from your own material — no internet, nothing leaves the device. I designed the chunking and retrieval layer: sentence-aware chunking sized to the embedding token limit, dense retrieval over an ObjectBox HNSW vector index using EmbeddingGemma, feeding a local LLM. Retrieval is scoped per notebook so answers stay grounded in the right source.",
    status: "building",
    statusLabel: "In Development",
    tags: ["Android", "Kotlin", "RAG", "EmbeddingGemma", "ObjectBox HNSW", "Vector Search", "Local LLM", "On-device"],
    metrics: [
      { label: "Embeddings", value: "EmbeddingGemma" },
      { label: "Vector store", value: "HNSW" },
      { label: "Runtime", value: "100% offline" },
    ],
    links: {
      github: null,
      demo: null,
    },
    accent: "terminal-orange",
    featured: true,
  },
  {
    id: "fraud-detection",
    title: "Fraud Detection",
    subtitle: "End-to-End ML Pipeline",
    description:
      "Engineered a fraud detection pipeline focused on resolving data-level bottlenecks and extreme class imbalance. Evaluated 3 baseline architectures (Logistic Regression, Random Forest, XGBoost) and prioritized robust feature engineering over unnecessary model complexity. Optimized the classification threshold to 0.2226 to strictly maximize Recall. Deployed the selected model via FastAPI with Pydantic validation and multi-stage Docker containerization.",
    status: "live",
    statusLabel: "Live on HF",
    tags: ["Python", "XGBoost", "Scikit-learn", "FastAPI", "Docker", "Streamlit", "EDA"],
    metrics: [
      { label: "Recall", value: "85%" },
      { label: "PR-AUC", value: "0.91" },
      { label: "Threshold", value: "0.2226" },
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
    title: "Graph AML Detector",
    subtitle: "Graph ML · GNN · Agentic AI (In Development)",
    description: "Graph neural network that detects money laundering on a real Bitcoin transaction graph, where fraud lives in network topology rather than in isolated transactions. Trains GraphSAGE with neighbor sampling on the Elliptic dataset and benchmarks it against an XGBoost baseline to prove the graph adds signal. A planned LangGraph ReAct agent layer will then investigate each flagged node and produce an explainable risk report.",
    status: "building",
    statusLabel: "In Development",
    tags: ["Python", "PyTorch Geometric", "GraphSAGE", "GNN", "LangGraph", "FastAPI", "NetworkX", "Docker"],
    metrics: [
    { label: "Dataset", value: "Elliptic 204K" },
    { label: "Model", value: "GraphSAGE" },
    { label: "Layers", value: "GNN + Agent" },
    ],
    links: {
      github: "https://github.com/renteria-luis/graph-aml-detector",
      demo: null,
    },
    accent: "terminal-blue",
    featured: true,
  },
  {
    id: "telco-churn",
    title: "Telco Churn Prediction",
    subtitle: "Classification · Threshold Optimization · Dockerization",
    description:
      "End-to-End churn prediction pipeline: Month-to-Month analysis showed referrals and price sensitivity drive retention. Soft-voting ensemble with 0.3 threshold prioritized recall over precision. Probabilities guide interventions; XGBoost flagged Senior Citizens as high-risk",
    status: "complete",
    statusLabel: "Complete",
    tags: ["Python", "Scikit-learn", "XGBoost", "Pandas", "EDA", "Ensemble"],
    metrics: [
      { label: "Threshold", value: "0.3" },
      { label: "Model", value: "Ensemble" },
      { label: "Focus", value: "Recall" },
    ],
    links: {
      github: "https://github.com/renteria-luis/telco-churn-prediction",
      demo: null,
    },
    accent: "terminal-purple",
    featured: false,
  },
  {
    id: "house-prices",
    title: "House Prices Kaggle Competition",
    subtitle: "Regression · Feature Engineering · Kaggle Competition",
    description: "Built a robust regression pipeline to predict housing prices. Engineered cross-validated features and implemented a soft-voting ensemble optimizing over Lasso, Random Forest, Gradient Boosting, and SVR via GridSearch. Ranked #202 on the Kaggle Public Leaderboard (Oct 2025) by minimizing prediction error across diverse model architectures.",
    status: "complete",
    statusLabel: "Complete",
    tags: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Regression"],
    metrics: [
      { label: "Model", value: "Voting Reg." },
      { label: "Kaggle", value: "#202" },
      { label: "Stack", value: "Scikit-learn" },
    ],
    links: {
      github: "https://github.com/renteria-luis/house-prices-prediction",
      demo: null,
    },
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
    role: "Graduate Certificate — Artificial Intelligence & Machine Learning (Co-op)",
    period: "Sep 2025 — Present",
    location: "London, ON",
    description: "Focused on deploying robust ML systems. Specializing in LLM/RAG integration, advanced NLP techniques, and building containerized MLOps pipelines.",
    tags: ["ML", "Deep Learning", "NLP", "MLOps", "Co-op"],
    highlight: "Dean's Honour Roll · GPA 4.18/4.2",
  },
  {
    id: "hikvision",
    type: "experience",
    institution: "Hikvision Peru",
    role: "Technical Support Analyst",
    period: "Aug 2023 — Feb 2024",
    location: "Peru",
    description:
      "Tested new hardware and software before market release, identifying and reporting defects to the product team. Deployed and validated IP video-security infrastructure — network architecture, servers, structured cabling — and delivered 20+ technical training sessions to installers and integration partners.",
    tags: ["QA / Testing", "IP Video", "Networking", "Technical Training"],
    highlight: "20+ technical training sessions · hardware/software QA",
  },
  {
    id: "td-synnex",
    type: "experience",
    institution: "TD Synnex",
    role: "Renewals Specialist",
    period: "Apr 2023 — Aug 2023",
    location: "Lima, Peru",
    description: "Collaborated with pre-sales teams and assisted enterprise clients with Fortinet and Cisco infrastructure. Navigated technical requirements for network security and hardware deployments.",
    tags: ["Technical Sales", "Networking", "Fortinet", "Cisco"],
    highlight: "Managed network security requirements for enterprise clients",
  },
  {
    id: "bermalar",
    type: "experience",
    institution: "Bermalar Consulting — Petroperu Refinery",
    role: "Applications Engineer",
    period: "Feb 2022 — Mar 2023",
    location: "Lima, Peru",
    description:
      "Programmed Allen-Bradley PLC control logic (Studio 5000) and designed the operator HMI (FactoryTalk View) for a condensate treatment plant on the Talara Refinery Modernization. Configured and calibrated field instruments and ran FAT/SAT validation as one of three engineers.",
    tags: ["PLC / Studio 5000", "HMI / SCADA", "Instrumentation", "FAT/SAT"],
    highlight: "Programmed PLC + HMI for a refinery modernization",
  },
  {
    id: "ucsp",
    type: "education",
    institution: "Catholic University of San Pablo (UCSP)",
    role: "Bachelor's — Electronic & Telecommunications Engineering",
    period: "Aug 2015 — Aug 2020",
    location: "Arequipa, Peru",
    description:
      "Full-scholarship Aerospace Engineering summer program at Shanghai Jiao Tong University (SJTU), China. Strong foundation in signal processing, control systems, and electronics.",
    tags: ["Electronics", "Telecommunications", "Control Systems", "Signals"],
    highlight: "Full scholarship — Aerospace program at SJTU, China",
  },
];

// ─────────────────────────────────────────────────────────────────
//  SKILLS  (grouped by category)
// ─────────────────────────────────────────────────────────────────
export const skillCategories = [
  {
    id: "ml-ai",
    label: "Machine Learning & NLP",
    icon: "brain",
    skills: [
      { name: "Python",       level: "core",     icon: "SiPython" },
      { name: "PyTorch",      level: "core",     icon: "SiPytorch" },
      { name: "Scikit-learn", level: "core",     icon: "SiScikitlearn" },
      { name: "XGBoost",      level: "core",     icon: "FaSitemap" },
      { name: "Pandas",       level: "core",     icon: "SiPandas" },
      { name: "NumPy",        level: "core",     icon: "SiNumpy" },
      { name: "spaCy",        level: "core",     icon: "SiSpacy" },
      { name: "RAG Architectures",    level: "learning", icon: "FaProjectDiagram" },
      { name: "Vector Search",        level: "learning", icon: "FaSitemap" },
      { name: "Embeddings",           level: "learning", icon: "FaProjectDiagram" },
      { name: "On-device AI",         level: "learning", icon: "FaRobot" },
      { name: "HuggingFace",          level: "learning", icon: "SiHuggingface" },
      { name: "LangChain",            level: "learning", icon: "SiLangchain" },
    ],
  },
  {
    id: "web-dev",
    label: "Web & AI-Assisted Dev",
    icon: "layers",
    skills: [
      { name: "HTML",               level: "core",     icon: "SiHtml5" },
      { name: "CSS",                level: "core",     icon: "SiCss3" },
      { name: "JavaScript",         level: "learning", icon: "SiJavascript" },
      { name: "AI Coding Tools",    level: "core",     icon: "FaRobot" },
      { name: "Prompt Engineering", level: "core",     icon: "FaTerminal" },
      { name: "Agentic Workflows",  level: "learning", icon: "FaProjectDiagram" },
    ],
  },
  {
    id: "data-eng",
    label: "Data Engineering & Analytics",
    icon: "database",
    skills: [
      { name: "SQL",          level: "core",     icon: "FaDatabase" },
      { name: "PostgreSQL",   level: "learning", icon: "SiPostgresql" },
      { name: "BeautifulSoup",level: "learning", icon: "FaSpider"},
      { name: "MongoDB",      level: "roadmap",  icon: "SiMongodb" },
      { name: "Airflow",      level: "roadmap",  icon: "SiApacheairflow" },
    ],
  },
  {
    id: "mlops",
    label: "MLOps & Infrastructure",
    icon: "box",
    skills: [
      { name: "Docker",       level: "core",     icon: "SiDocker" },
      { name: "Git",          level: "core",     icon: "SiGit" },
      { name: "GitHub",       level: "core",     icon: "SiGithub" },
      { name: "Linux CLI",    level: "core",     icon: "SiLinux" },
      { name: "Bash",         level: "core",     icon: "SiGnubash" },
      { name: "Pytest",       level: "learning", icon: "SiPytest" },
      { name: "GitHub Actions", level: "learning", icon: "SiGithubactions" },
      { name: "MLflow",       level: "roadmap",  icon: "SiMlflow" },
      { name: "Azure",        level: "roadmap",  icon: "TbBrandAzure" },
      { name: "Kubernetes",   level: "roadmap",  icon: "SiKubernetes" },
    ],
  },
  {
    id: "data-apps",
    label: "Data Apps & APIs",
    icon: "layers",
    skills: [
      { name: "FastAPI",      level: "core",     icon: "SiFastapi" },
      { name: "Streamlit",    level: "core",     icon: "SiStreamlit" },
      { name: "Matplotlib",   level: "core",     icon: "BiLineChart" },
      { name: "Seaborn",      level: "core",     icon: "BsGraphUpArrow" },
      { name: "Gradio",       level: "learning", icon: "FaPlayCircle" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
//  COMPANION  (the floating astronaut cat) — edit the short lines here
// ─────────────────────────────────────────────────────────────────
export const companion = {
  frames: {
    open: "/companion/cat-open.png",
    closed: "/companion/cat-closed.png",
  },
  // one short line per section id (hero / about / experience / projects / skills)
  dialogues: {
    hero: "Welcome aboard — scroll to explore my work",
    about: "A bit about who I am",
    experience: "My journey so far",
    projects: "Peek the code — click the links to open the repos",
    skills: "The tools I build with",
  },
};
