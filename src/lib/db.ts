import "dotenv/config";
import { Pool, type QueryResultRow } from "pg";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:11111@localhost:5432/kawsaytech";

export const pool = new Pool({
  connectionString,
  max: 10,
  ssl:
    process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  const client = await pool.connect();
  try {
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}

export async function initializeDatabase() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS compradores (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await query(`
      ALTER TABLE solicitudes
      ADD COLUMN IF NOT EXISTS comprador_id TEXT REFERENCES compradores(id)
    `);
    await query(`CREATE INDEX IF NOT EXISTS idx_compradores_email ON compradores(email)`);
    await query(`SELECT 1`);
    console.log("PostgreSQL connected successfully.");
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
  }
}

export async function healthCheck() {
  const result = await query<{ now: Date }>("SELECT NOW() as now");
  return result.rows[0]?.now;
}
