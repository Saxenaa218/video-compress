import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
const db = new Database(join(__dirname, '..', '..', 'todos.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create todos table
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  )
`;

db.exec(createTableSQL);

// Prepared statements for CRUD operations
export const statements = {
  getAll: db.prepare('SELECT * FROM todos ORDER BY createdAt DESC'),
  
  getById: db.prepare('SELECT * FROM todos WHERE id = ?'),
  
  create: db.prepare(`
    INSERT INTO todos (title, description, priority)
    VALUES (?, ?, ?)
  `),
  
  update: db.prepare(`
    UPDATE todos
    SET title = ?,
        description = ?,
        priority = ?,
        completed = ?,
        updatedAt = datetime('now')
    WHERE id = ?
  `),
  
  delete: db.prepare('DELETE FROM todos WHERE id = ?'),
  
  toggleComplete: db.prepare(`
    UPDATE todos
    SET completed = NOT completed,
        updatedAt = datetime('now')
    WHERE id = ?
  `)
};

export default db;
