"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-zinc-800 mb-4"
      >
        Welcome to PatientCare
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-zinc-600 mb-8 max-w-md text-center"
      >
        Manage patient data efficiently and securely with our modern platform.
      </motion.p>
      <div className="flex gap-4">
        <Link href="/login">
          <button className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-6 py-3 bg-zinc-200 text-zinc-800 rounded-lg hover:bg-zinc-300 transition">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
