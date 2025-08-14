
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth';
import patientsRoutes from './routes/patients';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/patients', patientsRoutes);

app.get('/', (_req, res) => res.json({ ok: true }));

export default app;
