"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cloud, Star, Lock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-[#FFFBF0]  flex items-center justify-center relative z-10">
      {/* Decorative Elements */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <Cloud
        className="absolute top-40 left-10 w-32 h-32 text-white fill-white drop-shadow-[4px_4px_0_rgba(15,23,42,1)] animate-float hidden md:block"
        strokeWidth={1}
      />
      <Star
        className="absolute bottom-20 right-20 w-24 h-24 text-rose-400 fill-rose-400 drop-shadow-[4px_4px_0_rgba(15,23,42,1)] animate-wiggle hidden md:block"
        strokeWidth={2}
      />

      <div className="bg-white border-4 border-slate-900 rounded-[3rem] p-8 md:p-12 shadow-[16px_16px_0_0_rgba(15,23,42,1)] max-w-lg w-full relative z-20">
        <Star
          className="absolute -top-8 -right-8 w-20 h-20 text-yellow-400 fill-yellow-400 drop-shadow-[4px_4px_0_rgba(15,23,42,1)] animate-spin-slow"
          strokeWidth={2}
        />
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 mb-8 transition-colors group"
        >
          <ArrowLeft
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Go to Homepage
        </Link>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 uppercase drop-shadow-[2px_2px_0_rgba(56,189,248,1)]">
          Admin Portal
        </h2>
        <p className="text-slate-600 text-lg font-bold mb-10">
          Sign in to see your little star's progress! 🌟
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-600 font-bold text-sm" role="alert">
              {error}
            </p>
          )}
          <div>
            <label className="block font-black text-slate-900 uppercase text-sm mb-3">
              Email Address
            </label>
            <div className="relative">
              <User
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                size={24}
              />
              <input
                type="email"
                placeholder="parent@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-[#FFFBF0] border-4 border-slate-900 rounded-2xl py-4 pl-14 pr-4 font-bold text-slate-900 text-lg placeholder:text-slate-400 focus:outline-none focus:shadow-[6px_6px_0_0_rgba(15,23,42,1)] focus:-translate-y-1 focus:-translate-x-1 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block font-black text-slate-900 uppercase text-sm mb-3">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                size={24}
              />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-[#FFFBF0] border-4 border-slate-900 rounded-2xl py-4 pl-14 pr-4 font-bold text-slate-900 text-lg placeholder:text-slate-400 focus:outline-none focus:shadow-[6px_6px_0_0_rgba(15,23,42,1)] focus:-translate-y-1 focus:-translate-x-1 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-emerald-400 border-4 border-slate-900 rounded-full py-5 font-black text-2xl uppercase tracking-wider text-slate-900 shadow-[8px_8px_0_0_rgba(15,23,42,1)] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[4px_4px_0_0_rgba(15,23,42,1)] transition-all disabled:opacity-70 disabled:pointer-events-none"
          >
            {isLoading ? "Signing in…" : "Let's Go!"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <a
            href="#"
            className="font-bold text-slate-500 hover:text-slate-900 underline decoration-4 underline-offset-4 decoration-sky-300 transition-colors"
          >
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
