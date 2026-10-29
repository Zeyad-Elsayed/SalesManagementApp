import express from 'express';
import projectsRoutes from './routes/projects.routes.js';
import salesRoutes from './routes/sales.routes.js';

const app = express();
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Sales API is running' });
});

// Mount modular routes
app.use('/api', projectsRoutes);
app.use('/api', salesRoutes);

export default app;
