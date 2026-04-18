export const CAREER_BOARD_SEED_NODES = [
  { node_key: 'gov', cat: 'destination', title: 'AI Governance Lead', subtitle: 'Corporate · EU AI Act', detail: 'Lead AI governance in pharma/manufacturing. EU AI Act Aug 2026. NIST AI RMF + ISO 42001. ~4,000 AIGP holders worldwide.', status: 'planned', x: 148, y: 80, color: '#1D9E75', dark_color: '#041510', radius: 68 },
  { node_key: 'free', cat: 'destination', title: 'AI Transformation', subtitle: 'Freelancer · DACH + Global', detail: 'Premium consultant for pharma/manufacturing. First client Month 1–4 via SOLIDA-1 network. Target EUR 1,200-2,000/day.', status: 'planned', x: 450, y: 87, color: '#378ADD', dark_color: '#040D1C', radius: 78 },
  { node_key: 'coach', cat: 'destination', title: 'Neuroscience Coach', subtitle: 'Side practice · Germany', detail: 'Systemic coaching: Warwick MSc + INeKO. DBVC-accredited. Workplace mental health and AI anxiety.', status: 'planned', x: 752, y: 80, color: '#7F77DD', dark_color: '#0A0620', radius: 68 },
  { node_key: 'agen', cat: 'cert', title: 'MIT Agentic AI', subtitle: 'Certification · In progress', detail: '3-week MIT Sloan course. Agentic workflow playbook from SOLIDA-1. First-client conversation asset.', status: 'progress', x: 285, y: 218, color: null, dark_color: null, radius: null },
  { node_key: 'aigp', cat: 'cert', title: 'IAPP AIGP', subtitle: 'Certification · Phase 2', detail: 'Premier AI governance credential. ~4,000 holders. EU AI Act + NIST AI RMF. 8 weeks, EUR 800 exam.', status: 'planned', x: 148, y: 310, color: null, dark_color: null, radius: null },
  { node_key: 'c1', cat: 'work', title: 'First freelance client', subtitle: 'Work · Month 1-4', detail: 'AI Readiness Assessment for regulated manufacturing. SOLIDA-1 network. EUR 15-25k engagement.', status: 'planned', x: 450, y: 330, color: null, dark_color: null, radius: null },
  { node_key: 'li', cat: 'marketing', title: 'LinkedIn positioning', subtitle: 'Self-marketing · Now', detail: 'Expert signal anchored to SOLIDA-1. 1 post/week on AI in regulated industries.', status: 'active', x: 618, y: 220, color: null, dark_color: null, radius: null },
  { node_key: 'ine', cat: 'cert', title: 'INeKO AI Master & Coach', subtitle: 'Certification · Phase 2', detail: 'AI transformation + systemic coaching. DBVC pathway. Part-time, Cologne.', status: 'planned', x: 745, y: 312, color: null, dark_color: null, radius: null },
  { node_key: 'war', cat: 'education', title: 'Warwick MSc', subtitle: 'Education · Module 3 active', detail: 'MSc Neuroscience & Psychology of Mental Health. Module 7 = publishable AI + mental health research.', status: 'active', x: 308, y: 390, color: null, dark_color: null, radius: null },
  { node_key: 'iso', cat: 'cert', title: 'ISO 42001', subtitle: 'Certification · Phase 2', detail: 'First international AI management system standard. Natural GxP extension. Essential for governance role.', status: 'planned', x: 148, y: 388, color: null, dark_color: null, radius: null },
];

// Node layout uses 3 columns to keep edges from crossing:
// Left col (→ CTO): togaf, pdm
// Center col (→ SVP): lead, dt
// Right col (→ CON): aws, li
export const CAREER_BOARD_PUBLIC_SEED_NODES = [
  // Destinations
  { node_key: 'cto', cat: 'destination', title: 'CTO', subtitle: 'Tech Startup · Series A/B', detail: 'Lead product & engineering in a fast-moving startup. Build culture, own architecture, report to CEO. EUR 180–220k + equity.', status: 'planned', x: 140, y: 75, color: '#1D9E75', dark_color: '#041510', radius: 68 },
  { node_key: 'svp', cat: 'destination', title: 'SVP Technology', subtitle: 'Global Pharma · Enterprise', detail: 'Drive digital health strategy across global business units. GxP compliance, cloud migration, 100+ FTE. EUR 200–260k.', status: 'planned', x: 450, y: 75, color: '#378ADD', dark_color: '#040D1C', radius: 78 },
  { node_key: 'con', cat: 'destination', title: 'IT Consultant', subtitle: 'Independent · EUR 1.500–2.500/day', detail: 'Digital transformation strategy for mid-size enterprises. CIO advisory, fractional CTO, programme governance.', status: 'planned', x: 760, y: 75, color: '#E8803A', dark_color: '#1C0C02', radius: 68 },
  // Left column — feeds CTO
  { node_key: 'togaf', cat: 'cert', title: 'TOGAF 10', subtitle: 'Certification · EA Framework', detail: 'Open Group enterprise architecture certification. Strengthens architecture governance credibility for CTO and SVP roles.', status: 'planned', x: 200, y: 230, color: null, dark_color: null, radius: null, url: 'https://www.opengroup.org/certifications/togaf' },
  { node_key: 'pdm', cat: 'work', title: 'Product & Tech Director', subtitle: 'Work · Startup path', detail: 'Director-level product + engineering role at a scale-up. Proves startup operating model before CTO step.', status: 'planned', x: 200, y: 360, color: null, dark_color: null, radius: null },
  // Center column — feeds SVP
  { node_key: 'lead', cat: 'education', title: 'Executive Leadership', subtitle: 'Education · HBS Online', detail: 'Leadership Principles short programme. Builds boardroom vocabulary and senior stakeholder confidence.', status: 'planned', x: 380, y: 240, color: null, dark_color: null, radius: null, url: 'https://hbx.hbs.edu/courses/leadership-principles/' },
  { node_key: 'dt', cat: 'work', title: 'Head of Digital Transformation', subtitle: 'Work · Stepping stone', detail: 'Lead a digital transformation programme within a large corp. Builds executive exposure and P&L ownership.', status: 'planned', x: 420, y: 370, color: null, dark_color: null, radius: null },
  // Right column — feeds Consultant
  { node_key: 'aws', cat: 'cert', title: 'AWS Solutions Architect Pro', subtitle: 'Certification · Self-study', detail: 'Advanced cloud architecture on AWS. Required for credible cloud strategy and consulting engagements.', status: 'planned', x: 660, y: 230, color: null, dark_color: null, radius: null, url: 'https://aws.amazon.com/certification/certified-solutions-architect-professional/' },
  { node_key: 'li', cat: 'other', title: 'LinkedIn: Tech Leadership', subtitle: 'Self-marketing · Weekly', detail: 'Establish digital transformation authority on LinkedIn. 1 post/week on cloud strategy, leadership, IT governance.', status: 'planned', x: 680, y: 360, color: null, dark_color: null, radius: null, url: 'https://www.linkedin.com' },
  // Next 3 months zone — immediate priority near home planet
  { node_key: 'now', cat: 'job', title: 'Immediate Priority', subtitle: 'Job · Next 3 months', detail: 'Your most important next step. What can you do right now to move toward your goals?', status: 'planned', x: 450, y: 472, color: null, dark_color: null, radius: null },
];

export const CAREER_BOARD_PUBLIC_SEED_EDGES = [
  // Outgoing from home — near zone first, then fans out to intermediate nodes
  { from_node: 'cur', to_node: 'now' },
  { from_node: 'cur', to_node: 'togaf' },
  { from_node: 'cur', to_node: 'pdm' },
  { from_node: 'cur', to_node: 'lead' },
  { from_node: 'cur', to_node: 'dt' },
  { from_node: 'cur', to_node: 'aws' },
  { from_node: 'cur', to_node: 'li' },
  // Near-zone star connects upward to center destination
  { from_node: 'now', to_node: 'svp' },
  // Left column → CTO (togaf also bridges to SVP)
  { from_node: 'togaf', to_node: 'cto' },
  { from_node: 'togaf', to_node: 'svp' },
  { from_node: 'pdm', to_node: 'cto' },
  // Center column → SVP (dt also bridges to Consultant)
  { from_node: 'lead', to_node: 'svp' },
  { from_node: 'dt', to_node: 'svp' },
  { from_node: 'dt', to_node: 'con' },
  // Right column → Consultant
  { from_node: 'aws', to_node: 'con' },
  { from_node: 'li', to_node: 'con' },
];

export const CAREER_BOARD_SEED_EDGES = [
  { from_node: 'cur', to_node: 'agen' },
  { from_node: 'cur', to_node: 'war' },
  { from_node: 'cur', to_node: 'c1' },
  { from_node: 'cur', to_node: 'li' },
  { from_node: 'cur', to_node: 'aigp' },
  { from_node: 'cur', to_node: 'iso' },
  { from_node: 'agen', to_node: 'c1' },
  { from_node: 'agen', to_node: 'free' },
  { from_node: 'c1', to_node: 'free' },
  { from_node: 'li', to_node: 'free' },
  { from_node: 'c1', to_node: 'li' },
  { from_node: 'war', to_node: 'ine' },
  { from_node: 'war', to_node: 'coach' },
  { from_node: 'aigp', to_node: 'gov' },
  { from_node: 'iso', to_node: 'gov' },
  { from_node: 'ine', to_node: 'coach' },
];
