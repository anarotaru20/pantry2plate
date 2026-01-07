const express = require("express");
const router = express.Router();
const { admin, db } = require("../config/db");
const { signJwt } = require("../config/jwt");

// test
router.get("/", (req, res) => {
  res.json({
    message: "TEST running",
  });
});

// test firebase
router.get("/db-test", async (req, res) => {
  try {
    const ref = await db.collection("ping").add({
      ok: true,
      at: new Date().toISOString(),
    });

    res.json({ ok: true, id: ref.id });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// router.post("/auth/session", async (req, res) => {
//   try {
//     const { idToken } = req.body;

//     if (!idToken) {
//       return res.status(400).json({ message: "idToken is required" });
//     }

//     const decoded = await admin.auth().verifyIdToken(idToken);

//     const token = signJwt({
//       uid: decoded.uid,
//       email: decoded.email || null,
//     });

//     return res.json({ token });
//   } catch {
//     return res.status(401).json({ message: "Invalid Firebase token" });
//   }
// });

// router.post("/auth/session", async (req, res) => {
//   try {
//     const { idToken } = req.body;

//     if (!idToken) {
//       return res.status(400).json({ message: "idToken is required" });
//     }

//     const decoded = await admin.auth().verifyIdToken(idToken);

//     await db.collection("users").doc(decoded.uid).set(
//       {
//         uid: decoded.uid,
//         email: decoded.email || null,
//         provider: decoded.firebase?.sign_in_provider || "password",
//         lastLoginAt: new Date().toISOString(),
//       },
//       { merge: true }
//     );

//     const token = signJwt({
//       uid: decoded.uid,
//       email: decoded.email || null,
//     });

//     return res.json({ token });
//   } catch {
//     return res.status(401).json({ message: "Invalid Firebase token" });
//   }
// });

router.post("/auth/session", async (req, res) => {
  try {
    const { idToken, profile } = req.body

    if (!idToken) return res.status(400).json({ message: "idToken is required" })

    const decoded = await admin.auth().verifyIdToken(idToken)
    const uid = decoded.uid

    const userRef = db.collection("users").doc(uid)
    const snap = await userRef.get()
    const existing = snap.exists ? snap.data() : null

    const safeProfile = profile && typeof profile === "object" ? profile : {}

    await userRef.set(
      {
        uid,
        email: decoded.email || null,
        provider: decoded.firebase?.sign_in_provider || "password",
        lastLoginAt: new Date().toISOString(),
        createdAt: existing?.createdAt || new Date().toISOString(),
        firstName: safeProfile.firstName || existing?.firstName || null,
        lastName: safeProfile.lastName || existing?.lastName || null,
        birthDate: safeProfile.birthDate || existing?.birthDate || null,
        displayName:
          safeProfile.displayName ||
          existing?.displayName ||
          (safeProfile.firstName ? `${safeProfile.firstName} ${safeProfile.lastName || ""}`.trim() : null),
      },
      { merge: true }
    )

    const token = signJwt({ uid, email: decoded.email || null })
    return res.json({ token })
  } catch (e) {
    return res.status(401).json({ message: "Invalid Firebase token" })
  }
})



const requireAuth = require("../middleware/auth")

router.get("/profile", requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user })
})





module.exports = router;
