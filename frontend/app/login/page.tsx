"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", { email, password });
    login(res.data.token);
    router.push("/patients");
  } catch (err) {
    // Narrow the error type to AxiosError if possible
    if (typeof err === 'object' && err !== null && 'response' in err) {
      
      setError(err.response?.data?.error || "Invalid credentials");
      // or better with explicit cast if using axios types:
      // const axiosErr = err as AxiosError;
      // setError(axiosErr.response?.data?.error || "Invalid credentials");
      console.error("Login error response:", err.response);
    } else {
      setError("Invalid credentials");
      console.error("Login error", err);
    }
  }
};
;

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow w-80">
        <h1 className="text-xl mb-4">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-3"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full">
          Login
        </button>
      </form>
    </div>
  );
}
