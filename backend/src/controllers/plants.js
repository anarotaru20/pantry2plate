const { db } = require("../config/db");

const str = (v) => (typeof v === "string" ? v.trim() : "");

async function addPlant(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const templateId = str(req.body?.templateId);
    const location = str(req.body?.location);
    const waterEveryDays = Number(req.body?.waterEveryDays);
    const notes = str(req.body?.notes);

    if (!templateId)
      return res.status(400).json({ message: "templateId is required" });
    if (!location)
      return res.status(400).json({ message: "location is required" });
    if (!Number.isFinite(waterEveryDays) || waterEveryDays <= 0)
      return res.status(400).json({ message: "waterEveryDays must be > 0" });

    const tplSnap = await db.collection("plantCatalog").doc(templateId).get();
    if (!tplSnap.exists)
      return res.status(400).json({ message: "Invalid templateId" });

    const tpl = tplSnap.data();
    const now = new Date().toISOString();

    const doc = {
      template: {
        id: templateId,
        slug: tpl.slug || null,
        commonName: tpl.commonName || null,
        species: tpl.species || null,
        tags: Array.isArray(tpl.tags) ? tpl.tags : [],
        care: {
          light: tpl.light || null,
          water: tpl.water || null,
          petSafe: Boolean(tpl.petSafe),
        },
        imageUrl: tpl.imageUrl || null,
        description: tpl.description || null,
      },
      settings: {
        location,
        waterEveryDays: Math.trunc(waterEveryDays),
        notes: notes || null,
      },
      timestamps: {
        lastWateredAt: now,
        createdAt: now,
        updatedAt: now,
      },
    };

    const ref = await db
      .collection("users")
      .doc(uid)
      .collection("myPlants")
      .add(doc);
    return res.status(201).json({ plant: { id: ref.id, ...doc } });
  } catch {
    return res.status(500).json({ message: "Failed to add plant" });
  }
}

async function updatePlant(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const id = str(req.params?.id);
    if (!id) return res.status(400).json({ message: "id is required" });

    const location = str(req.body?.location);
    const waterEveryDays = Number(req.body?.waterEveryDays);
    const notes = str(req.body?.notes);

    if (!location)
      return res.status(400).json({ message: "location is required" });
    if (!Number.isFinite(waterEveryDays) || waterEveryDays <= 0)
      return res.status(400).json({ message: "waterEveryDays must be > 0" });

    const ref = db.collection("users").doc(uid).collection("myPlants").doc(id);
    const snap = await ref.get();
    if (!snap.exists)
      return res.status(404).json({ message: "Plant not found" });

    const now = new Date().toISOString();

    await ref.update({
      "settings.location": location,
      "settings.waterEveryDays": Math.trunc(waterEveryDays),
      "settings.notes": notes || null,
      "timestamps.updatedAt": now,
    });

    const updated = await ref.get();
    const data = updated.data();
    return res.status(200).json({ plant: { id: updated.id, ...data } });
  } catch {
    return res.status(500).json({ message: "Failed to update plant" });
  }
}

async function deletePlant(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const id = str(req.params?.id);
    if (!id) return res.status(400).json({ message: "id is required" });

    const ref = db.collection("users").doc(uid).collection("myPlants").doc(id);
    const snap = await ref.get();
    if (!snap.exists)
      return res.status(404).json({ message: "Plant not found" });

    await ref.delete();
    return res.status(204).send();
  } catch {
    return res.status(500).json({ message: "Failed to delete plant" });
  }
}

async function getPlants(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const snap = await db
      .collection("users")
      .doc(uid)
      .collection("myPlants")
      .orderBy("timestamps.createdAt", "desc")
      .get();

    const plants = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ plants });
  } catch {
    return res.status(500).json({ message: "Failed to fetch plants" });
  }
}

module.exports = { addPlant, updatePlant, deletePlant, getPlants };
