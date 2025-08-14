import express from 'express';
import db from '../db';
import { authenticateToken } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { Patient } from '../models';

const router = express.Router();

router.use(authenticateToken);

function validatePatient(body: any): string | null {
  if (!body) return 'Missing body';
  const { firstName, lastName, email } = body;
  if (!firstName || !lastName || !email) return 'firstName, lastName and email are required';
  if (typeof firstName !== 'string' || typeof lastName !== 'string') return 'firstName/lastName must be strings';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Invalid email';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const limit = Math.min(100, Number(req.query.limit || 50));
    const offset = Number(req.query.offset || 0);
    const rows = await db.all('SELECT * FROM patients ORDER BY id DESC LIMIT ? OFFSET ?', [limit, offset]);
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const row = await db.get('SELECT * FROM patients WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'Patient not found' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal' });
  }
});

router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const err = validatePatient(req.body);
    if (err) return res.status(400).json({ error: err });
    const { firstName, lastName, email, phoneNumber, dob } = req.body as Patient;
    const info = await db.run(
      'INSERT INTO patients (firstName,lastName,email,phoneNumber,dob) VALUES (?,?,?,?,?)',
      [firstName, lastName, email, phoneNumber || null, dob || null]
    );
    const created = await db.get('SELECT * FROM patients WHERE id = ?', [info.lastID]);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal' });
  }
});

router.put('/:id', requireRole('admin'), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const err = validatePatient(req.body);
    if (err) return res.status(400).json({ error: err });
    const { firstName, lastName, email, phoneNumber, dob } = req.body as Patient;
    const info = await db.run(
      'UPDATE patients SET firstName=?, lastName=?, email=?, phoneNumber=?, dob=? WHERE id=?',
      [firstName, lastName, email, phoneNumber || null, dob || null, id]
    );
    if (!info.changes) return res.status(404).json({ error: 'Patient not found' });
    const updated = await db.get('SELECT * FROM patients WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal' });
  }
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const info = await db.run('DELETE FROM patients WHERE id = ?', [id]);
    if (!info.changes) return res.status(404).json({ error: 'Patient not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal' });
  }
});

export default router;
