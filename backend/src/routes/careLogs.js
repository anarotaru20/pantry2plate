const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/auth");

const {
  addCareLog,
  updateCareLog,
  deleteCareLog,
  getCareLogs,
} = require("../controllers/careLogs");

router.get("/care-logs", requireAuth, getCareLogs);
router.post("/care-logs", requireAuth, addCareLog);
router.patch("/care-logs/:id", requireAuth, updateCareLog);
router.delete("/care-logs/:id", requireAuth, deleteCareLog);

module.exports = router;
