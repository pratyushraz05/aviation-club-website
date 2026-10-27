const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const { isProduction, allowedOrigins } = require("./config/authConfig");
const { csrfProtection } = require("./middlewares/csrfMiddleware");
const { apiLimiter } = require("./middlewares/rateLimiter");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const resultRoutes = require("./routes/resultRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const teamRoutes = require("./routes/teamRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const projectRoutes = require("./routes/projectRoutes");
const eventRoutes = require("./routes/eventRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();

if (isProduction()) {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests that do not provide an Origin header.
      if (!origin) {
        return callback(null, true);
      }

      // Allow origins explicitly configured for the application.
      if (allowedOrigins().includes(origin)) {
        return callback(null, true);
      }

      // Allow local React/Vite development servers.
      const isLocalDevelopment =
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

      if (isLocalDevelopment) {
        return callback(null, true);
      }

      // Allow deployed Vercel frontend domains.
      try {
        const parsedOrigin = new URL(origin);

        if (
          parsedOrigin.protocol === "https:" &&
          parsedOrigin.hostname.endsWith(".vercel.app")
        ) {
          return callback(null, true);
        }
      } catch (error) {
        return callback(null, false);
      }

      return callback(null, false);
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "X-CSRF-Token",
      "Authorization",
    ],
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "Aviation Club API is running successfully!",
  });
});

app.use("/api", apiLimiter);
app.use("/api", csrfProtection);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/events", eventRoutes);

app.use("/api", notFound);
app.use(errorHandler);

module.exports = app;