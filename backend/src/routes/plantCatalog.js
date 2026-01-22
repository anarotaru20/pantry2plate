const express = require("express");
const router = express.Router();
const { listPlantCatalog } = require("../controllers/plantCatalog");

router.get("/plant-catalog", listPlantCatalog);

module.exports = router;
