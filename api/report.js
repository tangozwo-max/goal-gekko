export const config = { maxDuration: 300 };

const MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM = `You are a professional career coach writing a personalized strategic career development report.

Format your response as exactly five <section> elements with these id attributes: summary, strategiefit, vision, plan, next.
Inside sections use ONLY these tags: <h3>, <p>, <strong>, <em>, <ul>, <li>.
Do NOT use <h2> tags, do NOT include <!DOCTYPE>, <html>, <head>, <body>, or any wrapper tags.
Do NOT use markdown syntax (no **, no ##, no bullet dashes).

Detect the language from the board content and write in that language (unless overridden by an explicit instruction).
Write warmly but professionally, as if coaching the person directly.
Be specific — reference the actual goals, milestones, and details from the board.
Avoid generic career advice. Make it personal and actionable.`;

function buildPrompt(boardState) {
  if (!boardState) return 'No board data provided.';
  const { nodes = [], edges = [], meta = {} } = boardState;

  const destinations = nodes.filter(n => n.cat === 'destination');
  const stars = nodes.filter(n => n.cat !== 'destination');

  const edgesBy = {};
  edges.forEach(e => {
    const k = e.from_node || e.f;
    if (k) (edgesBy[k] = edgesBy[k] || []).push(e.to_node || e.t);
  });

  const lines = ['Create a strategic career development report for this person:', ''];

  if (meta.homeTitle || meta.homeLine1) {
    lines.push('CURRENT SITUATION:');
    if (meta.homeTitle) lines.push(`Name/Title: ${meta.homeTitle}`);
    if (meta.homeLine1) lines.push(`Current Role: ${meta.homeLine1}`);
    if (meta.homeLine2) lines.push(`Context: ${meta.homeLine2}`);
    if (meta.homeDetail) lines.push(`Background: ${meta.homeDetail}`);
    lines.push('');
  }

  if (destinations.length) {
    lines.push('CAREER GOALS:');
    destinations.forEach(n => {
      lines.push(`Goal: ${n.title}`);
      if (n.subtitle) lines.push(`  Vision: ${n.subtitle}`);
      if (n.detail) lines.push(`  Details: ${n.detail}`);
    });
    lines.push('');
  }

  if (stars.length) {
    lines.push('DEVELOPMENT MILESTONES:');
    const bycat = {};
    stars.forEach(n => { const c = n.cat || 'other'; (bycat[c] = bycat[c] || []).push(n); });
    Object.entries(bycat).forEach(([cat, items]) => {
      lines.push(`${cat.toUpperCase()}:`);
      items.forEach(n => {
        let line = `  - ${n.title}`;
        if (n.subtitle) line += ` (${n.subtitle})`;
        if (n.status && n.status !== 'planned') line += ` [${n.status}]`;
        if (n.time_in_months) line += ` — ${n.time_in_months} months`;
        if (n.cost) line += ` — ${n.cost}`;
        if (n.detail) line += `\n    Detail: ${n.detail}`;
        lines.push(line);
      });
    });
    lines.push('');
  }

  if (Object.keys(edgesBy).length) {
    lines.push('CONNECTIONS:');
    Object.entries(edgesBy).forEach(([f, targets]) => lines.push(`  ${f} → ${targets.join(', ')}`));
    lines.push('');
  }

  lines.push(`Timeline: Near-term: "${meta.timelineNear || '3 months'}", Mid: "${meta.timelineMid || '6 months'}", Long: "${meta.timelineFar || 'Future'}"`);
  lines.push('');
  lines.push('Write exactly five <section> elements:');
  lines.push('');
  lines.push('<section id="summary"> — 150-200 words');
  lines.push('Brief overview: 1-2 sentences on current situation, 1-2 sentences per career goal (use <h3> per goal), 1-2 sentences on the development approach. No market analysis. No next steps.');
  lines.push('');
  lines.push('<section id="strategiefit"> — 60-90 words');
  lines.push('One focused paragraph: why is NOW the ideal moment for this career transition? Reference relevant macro trends (AI, digitization, industry shifts, post-pandemic changes) and show how this person\'s planned moves align with that tailwind. Make it feel strategic and motivating — this is the "why now" argument.');
  lines.push('');
  lines.push('<section id="vision"> — 250-350 words');
  lines.push('Rich, vivid career vision. Use <h3> for each goal. Paint the picture: what does success look like, what impact does this person create, what excites them? Write in second person ("Sie werden..." or "You will...").');
  lines.push('');
  lines.push('<section id="plan"> — 250-350 words');
  lines.push('Detailed development roadmap. Group milestones by category using <h3> headings. For each group explain the strategic logic and reference the timeline bands. Be specific about sequence and priorities.');
  lines.push('');
  lines.push('<section id="next"> — 3-5 items as <ul><li>');
  lines.push('Concrete, specific, actionable next steps. Each item: one clear action + timeframe. No vague advice.');
  lines.push('');
  lines.push('Total target: 800-1100 words across all five sections.');

  return lines.join('\n');
}

const LANGUAGE_NAMES = {
  de: 'German', en: 'English', es: 'Spanish', fr: 'French', it: 'Italian',
  pt: 'Portuguese', nl: 'Dutch', pl: 'Polish', ru: 'Russian', ja: 'Japanese',
  zh: 'Chinese', ko: 'Korean', ar: 'Arabic', tr: 'Turkish', sv: 'Swedish',
  no: 'Norwegian', da: 'Danish', fi: 'Finnish', uk: 'Ukrainian', hi: 'Hindi',
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' }); return; }

  const { boardState, language } = req.body || {};
  const langCode = language && LANGUAGE_NAMES[language] ? language : null;
  const langInstruction = langCode ? `\n\nIMPORTANT: Write the entire report in ${LANGUAGE_NAMES[langCode]} (language code: ${langCode}). Do not use any other language.` : '';
  const userPrompt = buildPrompt(boardState) + langInstruction;

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 3200,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    res.status(anthropicRes.status).json({ error: err });
    return;
  }

  const data = await anthropicRes.json();
  const report = data.content?.find(c => c.type === 'text')?.text || '';
  res.json({ report });
}
