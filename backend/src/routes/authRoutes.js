const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");
const { getCsrfToken } = require("../middlewares/csrfMiddleware");
const { loginLimiter } = require("../middlewares/rateLimiter");

router.get("/csrf", getCsrfToken);
router.post("/login", loginLimiter, controller.login);
router.post("/logout", controller.logout);
router.get("/me", authenticate, controller.me);

module.exports = router;
