import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { AtomicStore, PhoneDocument } from './lead-storage';

export function createSqliteStore(file = process.env.LEAD_SQLITE_PATH || resolve('.data/leads.sqlite')): AtomicStore & { close(): void } {
  mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS documents (key TEXT PRIMARY KEY, data TEXT NOT NULL, revision INTEGER NOT NULL)');
  return {
    async read(key) {
      const row = db.prepare('SELECT data, revision FROM documents WHERE key = ?').get(key) as { data: string; revision: number } | undefined;
      return row ? { data: JSON.parse(row.data) as PhoneDocument, etag: String(row.revision) } : null;
    },
    async write(key, data, etag) {
      const result = etag === null
        ? db.prepare('INSERT INTO documents (key, data, revision) VALUES (?, ?, 1) ON CONFLICT(key) DO NOTHING').run(key, JSON.stringify(data))
        : db.prepare('UPDATE documents SET data = ?, revision = revision + 1 WHERE key = ? AND revision = ?').run(JSON.stringify(data), key, Number(etag));
      return result.changes === 1;
    },
    close() { db.close(); },
  };
}
