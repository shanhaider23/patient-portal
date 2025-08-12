// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes, { initializeUsers } from './routes/auth';
import patientsRoutes from './routes/patients';

const app = express();

app.use(cors());
app.use(express.json()); // must have this!

async function startServer() {
  // Initialize users with hashed passwords first
  await initializeUsers();

  // Mount routes after users are initialized
  app.use('/auth', authRoutes);
  app.use('/patients', patientsRoutes);

  app.get('/', (req, res) => res.json({ ok: true }));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Patients API running on http://localhost:${PORT}`);
  });
}

// Start the server
startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
