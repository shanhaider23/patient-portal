// src/models.ts
export type Role = 'admin' | 'user';

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: Role;
}

export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  dob?: string | null; // ISO date string e.g. "1990-01-01"
}
