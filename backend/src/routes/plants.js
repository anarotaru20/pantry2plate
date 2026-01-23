const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const { addPlant, updatePlant, deletePlant, getPlants } = require("../controllers/plants");

router.get("/plants", requireAuth, getPlants);
router.post("/plants", requireAuth, addPlant);
router.patch("/plants/:id", requireAuth, updatePlant);
router.delete("/plants/:id", requireAuth, deletePlant);

module.exports = router;
