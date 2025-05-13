import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Simple room management
export const createRoom = async (roomId: string) => {
  const result = await pool.query(
    'INSERT INTO rooms (id) VALUES ($1) RETURNING *',
    [roomId]
  );
  return result.rows[0];
};

export const getRoom = async (roomId: string) => {
  const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [roomId]);
  return result.rows[0];
};

// Message management
export const addMessage = async (roomId: string, content: string, sender: string) => {
  const result = await pool.query(
    'INSERT INTO messages (room_id, content, sender) VALUES ($1, $2, $3) RETURNING *',
    [roomId, content, sender]
  );
  return result.rows[0];
};

export const getMessages = async (roomId: string, limit = 50) => {
  const result = await pool.query(
    'SELECT * FROM messages WHERE room_id = $1 ORDER BY created_at DESC LIMIT $2',
    [roomId, limit]
  );
  return result.rows;
};

// Initialize database tables
export const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      room_id TEXT REFERENCES rooms(id),
      content TEXT NOT NULL,
      sender TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}; 