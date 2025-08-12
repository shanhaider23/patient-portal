import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth';
import patientsRoutes from './routes/patients';
import * as db from './db';  // import all exports (including init)

async function startServer() {
  try {
    await db.init();  // Initialize DB schema and seed data before starting server

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use('/auth', authRoutes);
    app.use('/patients', patientsRoutes);

    app.get('/', (req, res) => res.json({ ok: true }));

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Patients API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
