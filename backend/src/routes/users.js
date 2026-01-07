const express = require("express")
const router = express.Router()

// POST /users/register - register user
router.post("/register", async (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: {
        email: req.body.email || null
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// POST /users/login - login user
router.post("/login", async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      data: {
        email: req.body.email || null
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

module.exports = router
