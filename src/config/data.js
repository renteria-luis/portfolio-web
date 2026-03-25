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
  ],

  // Short punchy tagline under the typing effect
  tagline: "Building end-to-end ML systems with real industrial impact — not just academic theory.",

  // Bio paragraph for the About section
  bio: [
    "Electronics & Telecommunications Engineer transitioning to AI/ML Engineering. Currently specializing in NLP, RAG architectures, and MLOps at Fanshawe College and self-directed learning.",
    "My background in high-stakes environments — refinery SCADA systems and AI-driven enterprise security — shapes my approach. I prioritize system reliability, signal integrity, and measurable business impact over isolated academic metrics.",
    "I focus on shipping end-to-end pipelines: transforming messy raw data into containerized, production-ready models and APIs."
  ],

  // Key metrics shown as highlights
  highlights: [
    { label: "GPA", value: "4.16 / 4.2", note: "Dean's Honour Roll" },
    { label: "Models deployed", value: "3+", note: "End-to-end, Dockerized" },
    { label: "Recall (Fraud)", value: "85%", note: "PR-AUC 0.91" },
    { label: "Bookings automated", value: "60%", note: "Time reduction" },
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
    id: "refract",
    title: "Refract",
    subtitle: "NLP · LLM · RAG System (In Development)",
    description: "Multi-version NLP architecture scaling from classical text processing to a full RAG pipeline. Currently implementing transformer-based embeddings and vector retrieval backed by an LLM. Designed with modularity to deploy functional microservices at each phase.",
    status: "building",
    statusLabel: "In Development",
    tags: ["Python", "PyTorch", "Transformers", "LangChain", "RAG", "NLP", "spaCy", "Beautiful Soup"],
    metrics: [
      { label: "Phase", value: "1/3" },
      { label: "Focus", value: "NLP → RAG" },
      { label: "Stack", value: "HF + LLM" },
    ],
    links: {
      github: "https://github.com/renteria-luis/refract",
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
    highlight: "Dean's Honour Roll · GPA 4.16/4.2",
  },
  {
    id: "planet",
    type: "experience",
    institution: "Planet Adventure Group",
    role: "Software Developer",
    period: "Sep 2024 — Dec 2024",
    location: "Arequipa, Peru",
    description:
      "Built and maintained a Python-based reservation system handling hundreds of monthly bookings, automating previously manual workflows. Implemented SQL queries for client database management.",
    tags: ["Python", "SQL", "Automation", "Databases"],
    highlight: "60% reduction in booking processing time",
  },
  {
    id: "hikvision",
    type: "experience",
    institution: "Hikvision Peru",
    role: "Technical Support Analyst",
    period: "Aug 2023 — Feb 2024",
    location: "Peru",
    description:
      "Deployed AI-driven image recognition and access control security systems across 20+ enterprise installations in 6 cities. Led technical training for 50+ regional clients.",
    tags: ["AI Systems", "CCTV Analytics", "Image Recognition", "Client Training"],
    highlight: "40% increase in monitoring efficiency",
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
      "Architected real-time data acquisition and signal processing pipelines for refinery modernization. Transformed raw sensor telemetry into structured datasets. Conducted SAT/FAT validation focused on signal integrity and fault handling.",
    tags: ["SCADA", "Signal Processing", "Data Pipelines", "Industrial Systems"],
    highlight: "Real-time sensor telemetry → structured datasets",
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
      { name: "HuggingFace",          level: "learning", icon: "SiHuggingface" },
      { name: "LangChain",            level: "learning", icon: "SiLangchain" },
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
