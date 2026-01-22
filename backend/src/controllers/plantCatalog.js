const { db } = require("../config/db");

async function listPlantCatalog(req, res) {
  try {
    const snap = await db.collection("plantCatalog").orderBy("commonName").get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.json({ items });
  } catch (e) {
    return res.status(500).json({ message: "Failed to load plant catalog" });
  }
}

module.exports = { listPlantCatalog };
