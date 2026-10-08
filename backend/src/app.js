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
const teamRoutes = require("./routes/teamRoutes"); 
const app = express();


// Behind a reverse proxy in production (Render, Railway, Vercel...) so that
// rate limiting sees the real client IP and secure cookies work.
if (isProduction()) app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header = Postman / curl / server-to-server: allow.
      if (!origin || allowedOrigins().includes(origin.replace(/\/+$/, ""))) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token"],
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.use(cors());
app.use(express.json());
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);


// Test route
app.get("/", (req, res) => {
  res.json({ message: "Aviation Club API is running successfully!" });
});

app.use("/api", apiLimiter);
app.use("/api", csrfProtection); // only checks POST/PUT/PATCH/DELETE

app.use("/api/auth", authRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/feedback", feedbackRoutes); 
app.use("/api/team", teamRoutes);

app.use("/api", notFound);
app.use(errorHandler);

module.exports = app;
