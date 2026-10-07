const express = require("express");
const router = express.Router();
const controller = require("../controllers/resultController");

// No auth here. Raghava will add admin middleware on POST/PUT/DELETE later.
router.get("/", controller.getResults);
router.post("/", controller.createResult);
router.put("/:id", controller.updateResult);
router.delete("/:id", controller.deleteResult);

module.exports = router;
