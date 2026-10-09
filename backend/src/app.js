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

const app = express();

if (isProduction()) app.set("trust proxy", 1);

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
if (!origin || allowedOrigins().includes(origin.replace(//+$/, ""))) {
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

app.get("/", (req, res) => {
res.json({
message: "Aviation Club API is running successfully!",
});
});

app.use("/api", apiLimiter);
app.use("/api", csrfProtection);

app.use("/api/auth", authRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/gallery", galleryRoutes);

app.use("/api", notFound);
app.use(errorHandler);

module.exports = app;
