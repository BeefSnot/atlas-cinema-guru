"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Tab = "login" | "register";

export default function AuthForm() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email: email || undefined }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? "Registration failed");
      return;
    }

    // Auto-login after successful registration
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Registered but login failed — please sign in manually");
      setTab("login");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden border border-[#2d2d7a]">
        <button
          onClick={() => { setTab("login"); setError(""); }}
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            tab === "login"
              ? "bg-green-500 text-white"
              : "bg-[#1a1a5e] text-slate-400 hover:text-white"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => { setTab("register"); setError(""); }}
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            tab === "register"
              ? "bg-green-500 text-white"
              : "bg-[#1a1a5e] text-slate-400 hover:text-white"
          }`}
        >
          Register
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Login Form */}
      {tab === "login" && (
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Enter your username"
              className="bg-[#1a1a5e] border border-[#2d2d7a] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-green-500 placeholder-slate-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="bg-[#1a1a5e] border border-[#2d2d7a] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-green-500 placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors mt-1"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      )}

      {/* Register Form */}
      {tab === "register" && (
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Username <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              autoComplete="username"
              placeholder="Choose a username (min 3 chars)"
              className="bg-[#1a1a5e] border border-[#2d2d7a] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-green-500 placeholder-slate-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Email <span className="text-slate-500">(optional)</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className="bg-[#1a1a5e] border border-[#2d2d7a] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-green-500 placeholder-slate-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400 font-medium">Password <span className="text-red-400">*</span></label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Choose a password (min 6 chars)"
              className="bg-[#1a1a5e] border border-[#2d2d7a] text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-green-500 placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors mt-1"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>
      )}
    </div>
  );
}
