import express from "express";
import db from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET } from "../middleware/auth";

const router = express.Router();

// Signup endpoint
router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const existingUser = await db.get("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await db.run(
      "INSERT INTO users (email, passwordHash, role) VALUES (?, ?, ?)",
      [email, passwordHash, role === "admin" ? "admin" : "user"]
    );
    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Signup error", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const user = await db.get<{
      id: number;
      email: string;
      passwordHash: string;
      role: string;
    }>(
      "SELECT id, email, passwordHash, role FROM users WHERE email = ?",
      [email]
    );
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token, role: user.role, email: user.email });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
