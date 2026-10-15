import dotenv from 'dotenv';
import app from './app.js';
import pool from './config/db.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await pool.query('SELECT 1;');
    console.log('PostgreSQL database connected successfully.');

    app.listen(PORT, () => {
      console.log(`Sales Backend Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed during startup:', error.message);
    process.exit(1);
  }
}

startServer();
