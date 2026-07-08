import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;
let schemaReady: Promise<void> | null = null;

function getConfig() {
  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const database = process.env.MYSQL_DATABASE;
  if (!host || !user || !database) return null;

  return {
    host,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user,
    password: process.env.MYSQL_PASSWORD ?? "",
    database,
    waitForConnections: true,
    connectionLimit: 10,
  };
}

export function isDbConfigured() {
  return getConfig() !== null;
}

export function getPool() {
  const config = getConfig();
  if (!config) {
    throw new Error("MySQL is not configured. Set MYSQL_HOST, MYSQL_USER, and MYSQL_DATABASE.");
  }
  if (!pool) {
    pool = mysql.createPool(config);
  }
  return pool;
}

async function initSchema() {
  const db = getPool();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS reservations (
      id VARCHAR(64) PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      nft_id INT NOT NULL,
      nft_name VARCHAR(255) NOT NULL,
      wallet VARCHAR(128) NOT NULL,
      signature VARCHAR(128) NOT NULL,
      amount DECIMAL(10, 4) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_reservations_created_at (created_at DESC)
    )
  `);
}

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = initSchema();
  }
  await schemaReady;
}
