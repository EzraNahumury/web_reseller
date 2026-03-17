"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SESSION_KEY = "reseller_admin_session";
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin";
const LOGIN_HINT = "Gunakan admin@gmail.com dan password admin.";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      router.replace("/dashboard");
      return;
    }

    const timer = window.setTimeout(() => {
      setIsCheckingSession(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const isValidEmail = email.trim().toLowerCase() === ADMIN_EMAIL;
    const isValidPassword = password === ADMIN_PASSWORD;

    if (!isValidEmail || !isValidPassword) {
      setErrorMessage(`Email atau password salah. ${LOGIN_HINT}`);
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        email: ADMIN_EMAIL,
        loginAt: new Date().toISOString(),
      }),
    );

    router.replace("/dashboard");
  };

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-2xl border border-white/70 bg-white/90 px-6 py-4 text-sm text-zinc-600 shadow-sm">
          Memeriksa sesi login...
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur sm:p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-red-700">
          Admin Panel
        </p>
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">Login Admin</h1>
        <p className="mb-8 text-sm text-zinc-600">
          Masuk untuk mengelola data reseller dari Google Form.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-zinc-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@gmail.com"
              autoComplete="email"
              autoCapitalize="off"
              autoCorrect="off"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-zinc-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="admin"
                autoComplete="current-password"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-12 text-sm text-zinc-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path d="M3 3l18 18" strokeLinecap="round" />
                    <path
                      d="M10.59 10.59A2 2 0 0013.41 13.41"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9.88 5.09A10.94 10.94 0 0112 5c5.52 0 9.27 4.39 10 7-.2.72-.64 1.68-1.3 2.71M6.61 6.61C3.95 8.24 2.36 10.76 2 12c.73 2.61 4.48 7 10 7 1.85 0 3.5-.49 4.91-1.24"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path
                      d="M2 12s3.75-7 10-7 10 7 10 7-3.75 7-10 7-10-7-10-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>

          <p className="text-center text-xs text-zinc-500">{LOGIN_HINT}</p>
        </form>
      </div>
    </main>
  );
}

