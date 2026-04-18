-- Migration: import board data from old cancemi schema (wpfgbnwbdmmgacjllsza)
-- Run this in the Supabase SQL editor for stfbdglkexcsgtfphvha AFTER the user
-- has signed in at least once with Google so auth.users contains the account.
--
-- Replace 'dr.cancemi@gmail.com' below with the actual Google account email
-- used to sign in to goal-gekko if it differs.

DO $$
DECLARE
  _user_id  uuid;
  _board_id uuid := gen_random_uuid();
BEGIN
  SELECT id INTO _user_id FROM auth.users WHERE email = 'dr.cancemi@gmail.com' LIMIT 1;

  IF _user_id IS NULL THEN
    RAISE NOTICE 'User not found — sign in to goal-gekko first, then re-run this script.';
    RETURN;
  END IF;

  -- Skip if this user already has a board (idempotent)
  IF EXISTS (SELECT 1 FROM gekko.boards WHERE user_id = _user_id) THEN
    RAISE NOTICE 'User already has a board — skipping migration.';
    RETURN;
  END IF;

  -- Board
  INSERT INTO gekko.boards (id, user_id, title, created_at)
  VALUES (_board_id, _user_id, 'My Career Board', now());

  -- Nodes (10 nodes from old cancemi.nodes)
  INSERT INTO gekko.nodes (id, board_id, user_id, node_key, cat, title, subtitle, detail, status, x, y, color, dark_color, radius, url)
  VALUES
    (gen_random_uuid(), _board_id, _user_id, 'gov',  'destination', 'AI Governance Lead',        'Corporate · EU AI Act',         'Lead AI governance in pharma/manufacturing. EU AI Act Aug 2026. NIST AI RMF + ISO 42001. ~4,000 AIGP holders worldwide.', 'planned',  148,  80, '#1D9E75', '#041510', 68, NULL),
    (gen_random_uuid(), _board_id, _user_id, 'free', 'destination', 'AI Transformation',         'Freelancer · DACH + Global',    'Premium consultant for pharma/manufacturing. First client Month 1–4 via SOLIDA-1 network. Target EUR 1,200-2,000/day.',  'planned',  450,  87, '#378ADD', '#040D1C', 78, NULL),
    (gen_random_uuid(), _board_id, _user_id, 'coach','destination', 'Neuroscience Coach',         'Side practice · Germany',       'Systemic coaching: Warwick MSc + INeKO. DBVC-accredited. Workplace mental health and AI anxiety.',                       'planned',  752,  80, '#7F77DD', '#0A0620', 68, NULL),
    (gen_random_uuid(), _board_id, _user_id, 'agen', 'cert',        'MIT Agentic AI',             'Certification · In progress',   '3-week MIT Sloan course. Agentic workflow playbook from SOLIDA-1. First-client conversation asset.',                      'progress', 285, 218, NULL,      NULL,      NULL, NULL),
    (gen_random_uuid(), _board_id, _user_id, 'aigp', 'cert',        'IAPP AIGP',                  'Certification · Phase 2',       'Premier AI governance credential. ~4,000 holders. EU AI Act + NIST AI RMF. 8 weeks, EUR 800 exam.',                       'planned',  148, 310, NULL,      NULL,      NULL, NULL),
    (gen_random_uuid(), _board_id, _user_id, 'c1',   'work',        'First freelance client',     'Work · Month 1-4',              'AI Readiness Assessment for regulated manufacturing. SOLIDA-1 network. EUR 15-25k engagement.',                           'planned',  450, 330, NULL,      NULL,      NULL, NULL),
    (gen_random_uuid(), _board_id, _user_id, 'li',   'marketing',   'LinkedIn positioning',       'Self-marketing · Now',          'Expert signal anchored to SOLIDA-1. 1 post/week on AI in regulated industries.',                                          'active',   618, 220, NULL,      NULL,      NULL, NULL),
    (gen_random_uuid(), _board_id, _user_id, 'ine',  'cert',        'INeKO AI Master & Coach',    'Certification · Phase 2',       'AI transformation + systemic coaching. DBVC pathway. Part-time, Cologne.',                                               'planned',  745, 312, NULL,      NULL,      NULL, NULL),
    (gen_random_uuid(), _board_id, _user_id, 'war',  'education',   'Warwick MSc',                'Education · Module 3 active',   'MSc Neuroscience & Psychology of Mental Health. Module 7 = publishable AI + mental health research.',                    'active',   308, 390, NULL,      NULL,      NULL, NULL),
    (gen_random_uuid(), _board_id, _user_id, 'iso',  'cert',        'ISO 42001',                  'Certification · Phase 2',       'First international AI management system standard. Natural GxP extension. Essential for governance role.',                'planned',  148, 388, NULL,      NULL,      NULL, NULL);

  -- Edges (16 edges — cur is the home/origin node, handled by board engine)
  INSERT INTO gekko.edges (id, board_id, user_id, from_node, to_node)
  VALUES
    (gen_random_uuid(), _board_id, _user_id, 'cur',  'agen'),
    (gen_random_uuid(), _board_id, _user_id, 'cur',  'war'),
    (gen_random_uuid(), _board_id, _user_id, 'cur',  'c1'),
    (gen_random_uuid(), _board_id, _user_id, 'cur',  'li'),
    (gen_random_uuid(), _board_id, _user_id, 'cur',  'aigp'),
    (gen_random_uuid(), _board_id, _user_id, 'cur',  'iso'),
    (gen_random_uuid(), _board_id, _user_id, 'agen', 'c1'),
    (gen_random_uuid(), _board_id, _user_id, 'agen', 'free'),
    (gen_random_uuid(), _board_id, _user_id, 'c1',   'free'),
    (gen_random_uuid(), _board_id, _user_id, 'li',   'free'),
    (gen_random_uuid(), _board_id, _user_id, 'c1',   'li'),
    (gen_random_uuid(), _board_id, _user_id, 'war',  'ine'),
    (gen_random_uuid(), _board_id, _user_id, 'war',  'coach'),
    (gen_random_uuid(), _board_id, _user_id, 'aigp', 'gov'),
    (gen_random_uuid(), _board_id, _user_id, 'iso',  'gov'),
    (gen_random_uuid(), _board_id, _user_id, 'ine',  'coach');

  RAISE NOTICE 'Migration complete — board_id: %', _board_id;
END $$;
