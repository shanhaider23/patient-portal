import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcrypt';

const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'patients.sqlite3');

const sqlite = sqlite3.verbose();
const rawDb = new sqlite.Database(DB_FILE);

type RunResult = { lastID?: number; changes?: number };

function run(sql: string, params: any[] = []): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    rawDb.run(sql, params, function (this: sqlite3.RunResult, err: Error | null) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    rawDb.get(sql, params, (err, row: T | undefined) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    rawDb.all(sql, params, (err, rows: T[]) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export async function init() {
  await run(`PRAGMA foreign_keys = ON;`);
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin','user'))
    );
  `);
  await run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL,
      phoneNumber TEXT,
      dob TEXT
    );
  `);

  const row = await get<{ c: number }>('SELECT COUNT(*) as c FROM users', []);
  if (!row || row.c === 0) {
    const insert = `INSERT INTO users (email,passwordHash,role) VALUES (?,?,?)`;
    const adminHash = bcrypt.hashSync('AdminPass123', 10);
    const userHash = bcrypt.hashSync('UserPass123', 10);
    await run(insert, ['admin@example.com', adminHash, 'admin']);
    await run(insert, ['user@example.com', userHash, 'user']);

    const psql = 'INSERT INTO patients (firstName,lastName,email,phoneNumber,dob) VALUES (?,?,?,?,?)';
    await run(psql, ['Alice', 'Anderson', 'alice@example.com', '+4512345678', '1985-06-12']);
    await run(psql, ['Bob', 'Baker', 'bob@example.com', '+4511122233', '1990-01-05']);
  }
}

export default {
  raw: rawDb,
  run,
  get,
  all,
};
