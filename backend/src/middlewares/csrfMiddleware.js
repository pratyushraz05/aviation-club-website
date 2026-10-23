const crypto = require("crypto");
const { CSRF_COOKIE, cookieOptions, allowedOrigins } = require("../config/authConfig");

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const ONE_DAY = 24 * 60 * 60 * 1000;

const sign = (value) =>
  crypto.createHmac("sha256", process.env.JWT_SECRET || "default_dev_secret_key_change_me_later").update(value).digest("hex");

const safeEqual = (a, b) => {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
};

const isValidToken = (token) => {
  if (typeof token !== "string") return false;
  const [raw, signature] = token.split(".");
  if (!raw || !signature) return false;
  return safeEqual(signature, sign(raw));
};

const csrfFail = (res) =>
  res.status(403).json({
    success: false,
    code: "CSRF_INVALID",
    message: "Invalid or missing CSRF token. Please refresh the page and try again.",
  });

// GET /api/auth/csrf
const getCsrfToken = (req, res) => {
  const existing = req.cookies && req.cookies[CSRF_COOKIE];
  let token = existing;
  if (!isValidToken(existing)) {
    const raw = crypto.randomBytes(32).toString("hex");
    token = `${raw}.${sign(raw)}`;
  }
  res.cookie(CSRF_COOKIE, token, { ...cookieOptions(), maxAge: ONE_DAY });
  res.status(200).json({ success: true, csrfToken: token });
};

// Mounted once in app.js on /api. Only state-changing methods are checked.
const csrfProtection = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  // Requests authenticated explicitly via Authorization header are immune to CSRF
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return next();
  }

  // Allow registration and login to proceed if CSRF cookie hasn't been negotiated yet
  if (req.path === "/auth/login" || req.path === "/auth/register") {
    const headerToken = req.get("x-csrf-token");
    const cookieToken = req.cookies && req.cookies[CSRF_COOKIE];
    if (headerToken && cookieToken) {
      if (!safeEqual(headerToken, cookieToken) || !isValidToken(cookieToken)) return csrfFail(res);
    }
    return next();
  }

  const origin = req.get("origin");
  if (origin && !allowedOrigins().includes(origin.replace(/\/+$/, ""))) {
    return res.status(403).json({ success: false, message: "Request origin not allowed" });
  }

  const headerToken = req.get("x-csrf-token");
  const cookieToken = req.cookies && req.cookies[CSRF_COOKIE];
  if (!headerToken || !cookieToken) return csrfFail(res);
  if (!safeEqual(headerToken, cookieToken) || !isValidToken(cookieToken)) return csrfFail(res);

  next();
};

module.exports = { csrfProtection, getCsrfToken };
