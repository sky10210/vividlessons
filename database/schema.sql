-- PFM-only launch: run against Cloudflare D1 after creating the database.
CREATE TABLE IF NOT EXISTS purchases (
 id TEXT PRIMARY KEY,
 stripe_session_id TEXT NOT NULL UNIQUE,
 stripe_payment_intent_id TEXT,
 module_id TEXT NOT NULL,
 customer_email TEXT,
 paid_at TEXT NOT NULL DEFAULT (datetime('now')),
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS classroom_codes (
 id TEXT PRIMARY KEY,
 purchase_id TEXT NOT NULL UNIQUE REFERENCES purchases(id),
 module_id TEXT NOT NULL,
 code_hash TEXT NOT NULL UNIQUE,
 activated_at TEXT,
 expires_at TEXT,
 revoked_at TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_classroom_module ON classroom_codes(module_id);
CREATE TABLE IF NOT EXISTS webhook_events (
 stripe_event_id TEXT PRIMARY KEY,
 processed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
