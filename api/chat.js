export const config = { runtime: 'edge', maxDuration: 60 };

const MODELS = {
  fast:     'claude-haiku-4-5-20251001',
  balanced: 'claude-sonnet-4-6',
  deep:     'claude-opus-4-7',
};

const SYSTEM = `You are Gecko — a sharp, direct career strategist. You help users navigate from where they are now to where they want to be.

Your expertise:
- Career goal-setting and strategy
- Stepping-stone roles: which jobs to take on the road to a big destination
- Education pathways: certifications, degrees, courses — ranked by ROI
- Skill gaps and how to close them fast
- Personal brand and visibility (LinkedIn, thought leadership)
- Timeline planning: near (3 months), mid (6 months), long-term

You have full visibility of the user's career board — a visual strategy map with destinations (planets), intermediate steps (stars), and connections (edges).

Node categories: destination, cert, education, work, marketing, job, other
Node status: planned, active, progress, done

When you want to update the board, call propose_board_changes. Group related changes. Always give a crisp reason for each.

Rules:
- Be direct and concrete. No filler.
- Ask ONE focused question at a time when you need more info.
- When proposing changes, explain the strategic logic briefly.
- Suggest URLs only for well-known, stable resources (course pages, certification bodies, job boards).`;

const TOOLS = [
  {
    name: 'propose_board_changes',
    description: 'Propose changes to the career board. User must accept each change before it is applied.',
    input_schema: {
      type: 'object',
      required: ['changes'],
      properties: {
        changes: {
          type: 'array',
          items: {
            type: 'object',
            required: ['type', 'reason'],
            properties: {
              type:     { type: 'string', enum: ['update_node', 'create_node', 'delete_node', 'create_edge', 'delete_edge'] },
              reason:   { type: 'string', description: 'Why this change improves the strategy (1-2 sentences)' },
              node_key: { type: 'string', description: 'Existing node key (for update/delete/edge ops)' },
              new_key:  { type: 'string', description: 'Short key for new node, e.g. "pmp" or "aws_sa"' },
              fields: {
                type: 'object',
                properties: {
                  title:           { type: 'string' },
                  subtitle:        { type: 'string' },
                  detail:          { type: 'string' },
                  status:          { type: 'string', enum: ['planned', 'active', 'progress', 'done'] },
                  url:             { type: 'string' },
                  cat:             { type: 'string', enum: ['destination', 'cert', 'education', 'work', 'marketing', 'job', 'other'] },
                  cost:            { type: 'string', description: 'Estimated cost, e.g. "€800" or "free"' },
                  time_in_months:  { type: 'number', description: 'Estimated duration in months' },
                },
              },
              from_node: { type: 'string' },
              to_node:   { type: 'string' },
            },
          },
        },
      },
    },
  },
];

function buildBoardContext(boardState) {
  if (!boardState) return '';
  const { nodes = [], edges = [], meta = {} } = boardState;

  const destinations = nodes.filter(n => n.cat === 'destination');
  const stars = nodes.filter(n => n.cat !== 'destination');

  const edgesBy = {};
  edges.forEach(e => {
    const k = e.from_node || e.f;
    if (k) (edgesBy[k] = edgesBy[k] || []).push(e.to_node || e.t);
  });

  const lines = ['\n\n---\nCURRENT CAREER BOARD:'];
  if (meta.homeTitle) lines.push(`Home: ${meta.homeTitle}${meta.homeLine1 ? ` — ${meta.homeLine1}` : ''}${meta.homeLine2 ? `\n      ${meta.homeLine2}` : ''}`);

  if (destinations.length) {
    lines.push('\nDestinations:');
    destinations.forEach(n => lines.push(`  [${n.node_key}] ${n.title} (${n.subtitle || ''}) [${n.status || 'planned'}]${n.url ? ` → ${n.url}` : ''}`));
  }
  if (stars.length) {
    lines.push('\nSteps:');
    stars.forEach(n => {
      const meta = [];
      if (n.cost) meta.push(`cost: ${n.cost}`);
      if (n.time_in_months) meta.push(`${n.time_in_months}mo`);
      lines.push(`  [${n.node_key}] ${n.title} · ${n.cat} (${n.subtitle || ''}) [${n.status || 'planned'}]${meta.length ? ` [${meta.join(', ')}]` : ''}${n.url ? ` → ${n.url}` : ''}`);
    });
  }
  if (Object.keys(edgesBy).length) {
    lines.push('\nConnections:');
    Object.entries(edgesBy).forEach(([f, targets]) => lines.push(`  ${f} → ${targets.join(', ')}`));
  }
  lines.push('---');
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
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured in Vercel env vars.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try { body = await request.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { messages = [], boardState, tier = 'balanced', memory } = body;
  const model = MODELS[tier] || MODELS.balanced;
  const memCtx = memory ? `\n\n---\nPREVIOUS SESSION SUMMARY:\n${memory}\n---` : '';
  const systemPrompt = SYSTEM + buildBoardContext(boardState) + memCtx;

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1400,
      system: systemPrompt,
      messages,
      tools: TOOLS,
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    return new Response(JSON.stringify({ error: err }), { status: anthropicRes.status, headers: { 'Content-Type': 'application/json' } });
  }

  const data = await anthropicRes.json();
  const text = data.content?.find(c => c.type === 'text')?.text || '';
  const toolCalls = data.content?.filter(c => c.type === 'tool_use') || [];
  const proposals = toolCalls.flatMap(t => t.input?.changes || []);

  return new Response(JSON.stringify({
    text,
    proposals,
    usage: data.usage,
    stopReason: data.stop_reason,
    // Full content blocks (including tool_use with ids) for proper conversation history
    rawContent: data.content || [],
  }), { headers: { 'Content-Type': 'application/json' } });
}
