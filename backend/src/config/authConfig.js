// Central place for every auth-related setting (cookie names, lifetimes, CORS origins).

const ACCESS_COOKIE = "access_token";
const CSRF_COOKIE = "csrf_token";

const TOKEN_HOURS = 2; // JWT + cookie lifetime
const MAX_FAILED_ATTEMPTS = 5; // wrong passwords before the account is locked
const LOCK_MINUTES = 15; // how long the account stays locked

const isProduction = () => process.env.NODE_ENV === "production";

// Frontend origin(s) allowed to call this API. FRONTEND_URL may hold several
// comma-separated origins (e.g. your Vercel URL and a custom domain).
const allowedOrigins = () => {
  const raw = process.env.FRONTEND_URL || "http://localhost:5173";
  return raw
    .split(",")
    .map((o) => o.trim().replace(/\/+$/, ""))
    .filter(Boolean);
};

// Options shared by the auth cookie and the CSRF cookie.
//  - Local dev (HTTP):         httpOnly, sameSite=lax, secure=false
//  - Production (HTTPS):       httpOnly, sameSite=lax, secure=true
//  - Cross-site deployment:    set COOKIE_SAMESITE=none (forces secure=true)
const cookieOptions = () => {
  let sameSite = (process.env.COOKIE_SAMESITE || "lax").toLowerCase();
  if (!["lax", "strict", "none"].includes(sameSite)) sameSite = "lax";
  return {
    httpOnly: true,
    secure: isProduction() || sameSite === "none",
    sameSite,
    path: "/",
  };
};

// Called once at startup (server.js). Fails fast on unsafe configuration.
const assertEnv = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("FATAL: JWT_SECRET is missing in backend/.env");
    process.exit(1);
  }
  if (secret.length < 32) {
    if (isProduction()) {
      console.error("FATAL: JWT_SECRET must be at least 32 characters in production");
      process.exit(1);
    }
    console.warn("WARNING: JWT_SECRET is shorter than 32 characters. Use a longer random value.");
  }
};

module.exports = {
  ACCESS_COOKIE,
  CSRF_COOKIE,
  TOKEN_HOURS,
  MAX_FAILED_ATTEMPTS,
  LOCK_MINUTES,
  isProduction,
  allowedOrigins,
  cookieOptions,
  assertEnv,
};
