"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "../context/AuthContext";
import type { AxiosError } from "axios";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<{ token: string }>("/auth/login", { email, password });
      login(res.data.token);
      router.push("/patients");
    } catch (err) {

      const axiosError = err as AxiosError<{ error: string }>;
      if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
        setError(axiosError.response.data.error);
        console.error("Login error response:", axiosError.response);
      } else {
        setError("Invalid credentials");
        console.error("Login error", err);
      }

    }
  };
  ;

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-zinc-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
          <button className="w-full bg-zinc-800 text-white py-3 rounded-lg hover:bg-zinc-700 transition">
            Sign In
          </button>
        </form>
        <button
          className="w-full mt-4 bg-zinc-200 text-zinc-800 py-3 rounded-lg hover:bg-zinc-300 transition"
          onClick={() => router.push("/signup")}
          type="button"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
