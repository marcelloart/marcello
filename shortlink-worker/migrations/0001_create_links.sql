CREATE TABLE IF NOT EXISTS links (
  slug TEXT PRIMARY KEY NOT NULL,
  target_url TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at);
