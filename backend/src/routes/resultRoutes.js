const express = require("express");
const router = express.Router();
const controller = require("../controllers/resultController");
const { authenticate, headOnly } = require("../middlewares/authMiddleware");

// Public view results
router.get("/", controller.getResults);

// Head / Admin only write operations
router.post("/", authenticate, headOnly, controller.createResult);
router.put("/:id", authenticate, headOnly, controller.updateResult);
router.delete("/:id", authenticate, headOnly, controller.deleteResult);

module.exports = router;
