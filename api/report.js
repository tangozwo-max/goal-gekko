export const config = { runtime: 'edge', maxDuration: 60 };

const MODEL = 'claude-sonnet-4-6';

const SYSTEM = `You are a professional career coach writing a personalized strategic career development report.

Format your response as an HTML fragment using ONLY these tags: <h2>, <h3>, <p>, <strong>, <em>, <ul>, <li>.
Do NOT include <!DOCTYPE>, <html>, <head>, <body>, or any wrapper tags.
Do NOT use markdown syntax (no **, no ##, no bullet dashes).

Detect the language from the board content and write the entire report in that language.
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
  lines.push('Write exactly four sections with <h2> headings:');
  lines.push('1. Current situation — 2-3 personal sentences about where this person stands today');
  lines.push('2. Career vision — one focused paragraph per goal, describing the destination vividly');
  lines.push('3. Development plan — flowing prose grouping milestones by category, referencing the timeline');
  lines.push('4. Next steps — 3-5 concrete, specific actions as <ul><li> list');
  lines.push('');
  lines.push('Target length: 450-600 words. Keep it personal and direct.');

  return lines.join('\n');
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { boardState } = body;
  const userPrompt = buildPrompt(boardState);

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    return new Response(JSON.stringify({ error: err }), { status: anthropicRes.status, headers: { 'Content-Type': 'application/json' } });
  }

  const data = await anthropicRes.json();
  const report = data.content?.find(c => c.type === 'text')?.text || '';

  return new Response(JSON.stringify({ report }), { headers: { 'Content-Type': 'application/json' } });
}
