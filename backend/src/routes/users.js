const express = require("express")
const router = express.Router()

const { register, login, profile } = require("../controllers/users")
const requireAuth = require("../middleware/auth")

router.post("/register", register)
router.post("/login", login)
router.get("/profile", requireAuth, profile)

module.exports = router;