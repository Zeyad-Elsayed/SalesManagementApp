import express from 'express';
import pool from './config/db.js';

const app = express();

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Sales API is running',
  });
});

// Database-backed endpoint to verify seeded data (Stage 2 requirement)
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT project_id, project_name FROM project ORDER BY project_id ASC;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({ error: 'Failed to fetch projects from database' });
  }
});

export default app;
