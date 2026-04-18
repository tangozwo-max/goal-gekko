-- goal-gekko schema setup
-- Project: stfbdglkexcsgtfphvha (career-cobra Supabase, dr.cancemi@gmail.com)
-- Schema: gekko
-- Auth: Google OAuth via career-cobra (shared auth.users)
-- Multi-user: yes — every user gets their own board

-- ─────────────────────────────────────────
-- 0. Schema
-- ─────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS gekko;

-- ─────────────────────────────────────────
-- 1. Helper: updated_at trigger
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION gekko.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────
-- 2. boards — one board per user (expandable to multiple later)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gekko.boards (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL DEFAULT 'Career Strategy Board',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER boards_touch_updated_at
  BEFORE UPDATE ON gekko.boards
  FOR EACH ROW EXECUTE FUNCTION gekko.touch_updated_at();

-- ─────────────────────────────────────────
-- 3. nodes — planets + stars
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gekko.nodes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id    uuid NOT NULL REFERENCES gekko.boards(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  node_key    text NOT NULL,
  cat         text NOT NULL DEFAULT 'cert',
  title       text NOT NULL,
  subtitle    text DEFAULT '',
  detail      text DEFAULT '',
  status      text DEFAULT 'planned',
  x           float8 NOT NULL DEFAULT 400,
  y           float8 NOT NULL DEFAULT 300,
  color       text,
  dark_color  text,
  radius      float8,
  url         text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE (board_id, node_key)
);

CREATE TRIGGER nodes_touch_updated_at
  BEFORE UPDATE ON gekko.nodes
  FOR EACH ROW EXECUTE FUNCTION gekko.touch_updated_at();

-- ─────────────────────────────────────────
-- 4. edges — connections between nodes
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gekko.edges (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id    uuid NOT NULL REFERENCES gekko.boards(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_node   text NOT NULL,
  to_node     text NOT NULL,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (board_id, from_node, to_node)
);

-- ─────────────────────────────────────────
-- 5. RLS — each user sees only their own data
-- ─────────────────────────────────────────
ALTER TABLE gekko.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE gekko.nodes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE gekko.edges  ENABLE ROW LEVEL SECURITY;

-- boards
CREATE POLICY "boards: own rows" ON gekko.boards
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- nodes
CREATE POLICY "nodes: own rows" ON gekko.nodes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- edges
CREATE POLICY "edges: own rows" ON gekko.edges
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 6. Expose schema via PostgREST
-- ─────────────────────────────────────────
GRANT USAGE ON SCHEMA gekko TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA gekko TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA gekko TO authenticated;
