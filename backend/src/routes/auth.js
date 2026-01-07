const express = require("express");
const { admin } = require("../config/db");
const { signJwt } = require("../config/jwt");

const router = express.Router();

router.post("/session", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "idToken is required" });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);

    const token = signJwt({
      uid: decoded.uid,
      email: decoded.email || null,
    });

    return res.json({ token });
  } catch (error) {
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
});

module.exports = router;
