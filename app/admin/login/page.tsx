"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials");
      }
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base p-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-[400px] max-w-full bg-bg-surface border-2 border-border-pixel shadow-[0_0_0_1px_#2a2d4a] rounded-sm p-7"
      >
        <div className="font-mono text-[11px] text-text-muted tracking-[0.16em] uppercase mb-4 text-center">
          Portfolio Admin
        </div>

        <Lock
          className="w-14 h-14 mx-auto mb-4 text-accent-violet block"
          strokeWidth={1.8}
        />

        <h1 className="text-center font-mono text-[16px] font-bold text-text-primary mb-1">
          Sign in
        </h1>
        <p className="text-center font-mono text-[12px] text-text-muted mb-5">
          Admin access for content management.
        </p>

        {/* Email */}
        <div className="flex flex-col gap-1.5 mb-3.5">
          <label
            htmlFor="email"
            className="font-mono text-[11px] text-text-muted tracking-[0.06em] uppercase"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            disabled={loading}
            className={`w-full bg-bg-base text-text-primary border px-3 py-2.5 font-mono text-[13px] rounded-sm outline-none transition-all duration-150 placeholder:text-text-muted ${
              error
                ? "border-accent-red shadow-[0_0_0_1px_#f55c5c]"
                : "border-border-pixel shadow-[0_0_0_1px_#2a2d4a] focus:border-accent-violet focus:shadow-[0_0_0_1px_#7c6df5,0_0_8px_rgba(124,109,245,0.35)]"
            }`}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5 mb-3.5">
          <label
            htmlFor="pwd"
            className="font-mono text-[11px] text-text-muted tracking-[0.06em] uppercase"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="pwd"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className={`w-full bg-bg-base text-text-primary border px-3 py-2.5 pr-10 font-mono text-[13px] rounded-sm outline-none transition-all duration-150 placeholder:text-text-muted ${
                error
                  ? "border-accent-red shadow-[0_0_0_1px_#f55c5c]"
                  : "border-border-pixel shadow-[0_0_0_1px_#2a2d4a] focus:border-accent-violet focus:shadow-[0_0_0_1px_#7c6df5,0_0_8px_rgba(124,109,245,0.35)]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-transparent border-0 cursor-pointer text-text-muted hover:text-text-primary transition-colors flex items-center"
            >
              {show ? <EyeOff className="w-[18px] h-[18px]" strokeWidth={1.6} /> : <Eye className="w-[18px] h-[18px]" strokeWidth={1.6} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="font-mono text-[12px] text-accent-red mb-2.5 -mt-1">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 font-mono text-[13px] font-semibold bg-accent-violet text-white border border-accent-violet px-4 py-3 rounded-sm cursor-pointer transition-all duration-150 hover:brightness-110 active:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Signing in…
            </>
          ) : (
            "Log in"
          )}
        </button>
      </form>
    </div>
  );
}
