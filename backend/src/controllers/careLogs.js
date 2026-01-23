const { db } = require("../config/db");

const str = (v) => (typeof v === "string" ? v.trim() : "");

const allowedActions = new Set(["water", "fertilize", "prune", "repot"]);
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

async function addCareLog(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const plantId = str(req.body?.plantId);
    const plantName = str(req.body?.plantName);
    const action = str(req.body?.action);
    const date = str(req.body?.date);
    const notes = str(req.body?.notes);

    if (!plantId) return res.status(400).json({ message: "plantId is required" });
    if (!plantName) return res.status(400).json({ message: "plantName is required" });
    if (!action) return res.status(400).json({ message: "action is required" });
    if (!date) return res.status(400).json({ message: "date is required" });

    if (plantName.length > 60)
      return res.status(400).json({ message: "plantName must be <= 60 chars" });
    if (action.length > 40)
      return res.status(400).json({ message: "action must be <= 40 chars" });
    if (notes && notes.length > 240)
      return res.status(400).json({ message: "notes must be <= 240 chars" });

    if (action && !allowedActions.has(action))
      return res.status(400).json({
        message: `action must be one of: ${Array.from(allowedActions).join(", ")}`,
      });

    if (!dateRegex.test(date))
      return res.status(400).json({ message: "date must be in YYYY-MM-DD format" });

    const plantRef = db.collection("users").doc(uid).collection("myPlants").doc(plantId);
    const plantSnap = await plantRef.get();
    if (!plantSnap.exists) return res.status(404).json({ message: "Plant not found" });

    const now = new Date().toISOString();

    const doc = {
      plantId,
      plantName,
      action,
      date,
      notes: notes || null,
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
    };

    const ref = await db.collection("users").doc(uid).collection("careLogs").add(doc);

    if (action === "water") {
      await plantRef.update({
        "timestamps.lastWateredAt": now,
        "timestamps.updatedAt": now,
      });
    }

    return res.status(201).json({ careLog: { id: ref.id, ...doc } });
  } catch {
    return res.status(500).json({ message: "Failed to add care log" });
  }
}

async function updateCareLog(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const id = str(req.params?.id);
    if (!id) return res.status(400).json({ message: "id is required" });

    const plantId = str(req.body?.plantId);
    const plantName = str(req.body?.plantName);
    const action = str(req.body?.action);
    const date = str(req.body?.date);
    const notes = str(req.body?.notes);

    if (!plantId) return res.status(400).json({ message: "plantId is required" });
    if (!plantName) return res.status(400).json({ message: "plantName is required" });
    if (!action) return res.status(400).json({ message: "action is required" });
    if (!date) return res.status(400).json({ message: "date is required" });

    if (plantName.length > 60)
      return res.status(400).json({ message: "plantName must be <= 60 chars" });
    if (action.length > 40)
      return res.status(400).json({ message: "action must be <= 40 chars" });
    if (notes && notes.length > 240)
      return res.status(400).json({ message: "notes must be <= 240 chars" });

    if (action && !allowedActions.has(action))
      return res.status(400).json({
        message: `action must be one of: ${Array.from(allowedActions).join(", ")}`,
      });

    if (!dateRegex.test(date))
      return res.status(400).json({ message: "date must be in YYYY-MM-DD format" });

    const plantRef = db.collection("users").doc(uid).collection("myPlants").doc(plantId);
    const plantSnap = await plantRef.get();
    if (!plantSnap.exists) return res.status(404).json({ message: "Plant not found" });

    const ref = db.collection("users").doc(uid).collection("careLogs").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: "Care log not found" });

    const now = new Date().toISOString();

    await ref.update({
      plantId,
      plantName,
      action,
      date,
      notes: notes || null,
      "timestamps.updatedAt": now,
    });

    if (action === "water") {
      await plantRef.update({
        "timestamps.lastWateredAt": now,
        "timestamps.updatedAt": now,
      });
    }

    const updated = await ref.get();
    return res.status(200).json({ careLog: { id: updated.id, ...updated.data() } });
  } catch {
    return res.status(500).json({ message: "Failed to update care log" });
  }
}

async function deleteCareLog(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const id = str(req.params?.id);
    if (!id) return res.status(400).json({ message: "id is required" });

    const ref = db.collection("users").doc(uid).collection("careLogs").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: "Care log not found" });

    await ref.delete();
    return res.status(204).send();
  } catch {
    return res.status(500).json({ message: "Failed to delete care log" });
  }
}

async function getCareLogs(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const snap = await db
      .collection("users")
      .doc(uid)
      .collection("careLogs")
      .orderBy("date", "desc")
      .get();

    const careLogs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ careLogs });
  } catch {
    return res.status(500).json({ message: "Failed to fetch care logs" });
  }
}

module.exports = { addCareLog, updateCareLog, deleteCareLog, getCareLogs };
