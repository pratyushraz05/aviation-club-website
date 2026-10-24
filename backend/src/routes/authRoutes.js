const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const { authenticate, headOnly } = require("../middlewares/authMiddleware");
const { getCsrfToken } = require("../middlewares/csrfMiddleware");
const { loginLimiter } = require("../middlewares/rateLimiter");

router.get("/csrf", getCsrfToken);
router.post("/register", controller.register);
router.post("/login", loginLimiter, controller.login);
router.post("/logout", controller.logout);
router.get("/me", authenticate, controller.me);

// User self-service
router.post("/request-membership", authenticate, controller.requestMembership);
router.put("/profile", authenticate, controller.updateProfile);

// Head / Admin user management
router.get("/users", authenticate, headOnly, controller.getUsers);
router.patch("/users/:id/role", authenticate, headOnly, controller.updateRole);
router.put("/users/:id", authenticate, headOnly, controller.updateUserByAdmin);
router.delete("/users/:id", authenticate, headOnly, controller.deleteUserByAdmin);

module.exports = router;
