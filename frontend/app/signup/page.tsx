"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:4000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, role }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Signup failed");
            }

            alert("Signup successful! Please login.");
            router.push("/login");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Signup failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-zinc-800 mb-6">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500">{error}</p>}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400"
                        required
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-3 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    >
                        <option value="user">User (View Only)</option>
                        <option value="admin">Admin (Full Access)</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>
                <button
                    className="w-full mt-4 bg-zinc-200 text-zinc-800 py-3 rounded-lg hover:bg-zinc-300 transition"
                    onClick={() => router.push("/login")}
                    type="button"
                >
                    Login
                </button>
            </div>
        </div>
    );
}