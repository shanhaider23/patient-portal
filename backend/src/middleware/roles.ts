import { Request, Response, NextFunction } from 'express';

export function requireRole(role: 'admin' | 'user') {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    if (user.role !== role) return res.status(403).json({ error: 'Forbidden: insufficient role' });
    next();
  };
}
