const { faker } = require("@faker-js/faker");
const { db } = require("../src/config/db");
const { logger } = require("../src/config/logger");

const LIGHT_LEVELS = ["low", "medium", "bright"];
const WATER_LEVELS = ["low", "medium", "high"];

const TAGS = [
  "indoor",
  "easy",
  "tropical",
  "air-purifying",
  "decorative",
  "succulent",
  "slow-growth",
  "fast-growth",
  "hanging",
  "floor-plant",
  "low-light",
  "beginner-friendly",
];

const PLANT_LIBRARY = [
  { commonName: "Monstera", species: "Monstera deliciosa" },
  { commonName: "Snake Plant", species: "Sansevieria trifasciata" },
  { commonName: "Pothos", species: "Epipremnum aureum" },
  { commonName: "Peace Lily", species: "Spathiphyllum" },
  { commonName: "Aloe Vera", species: "Aloe vera" },
  { commonName: "ZZ Plant", species: "Zamioculcas zamiifolia" },
  { commonName: "Fiddle Leaf Fig", species: "Ficus lyrata" },
  { commonName: "Rubber Plant", species: "Ficus elastica" },
  { commonName: "Spider Plant", species: "Chlorophytum comosum" },
  { commonName: "Calathea", species: "Calathea orbifolia" },
  { commonName: "Philodendron", species: "Philodendron hederaceum" },
  { commonName: "Dracaena", species: "Dracaena marginata" },
  { commonName: "Chinese Evergreen", species: "Aglaonema" },
  { commonName: "Boston Fern", species: "Nephrolepis exaltata" },
  { commonName: "Areca Palm", species: "Dypsis lutescens" },
  { commonName: "Parlor Palm", species: "Chamaedorea elegans" },
  { commonName: "Jade Plant", species: "Crassula ovata" },
  { commonName: "Yucca", species: "Yucca elephantipes" },
  { commonName: "Croton", species: "Codiaeum variegatum" },
  { commonName: "Ponytail Palm", species: "Beaucarnea recurvata" },
  { commonName: "String of Pearls", species: "Senecio rowleyanus" },
  { commonName: "Bird of Paradise", species: "Strelitzia reginae" },
  { commonName: "Money Tree", species: "Pachira aquatica" },
  { commonName: "Swiss Cheese Vine", species: "Monstera adansonii" },
  { commonName: "Prayer Plant", species: "Maranta leuconeura" },
];

function pickSomeUnique(arr, min = 1, max = 3) {
  const target = faker.number.int({ min, max });
  const out = new Set();
  let guard = 0;

  while (out.size < target && guard < 60) {
    out.add(faker.helpers.arrayElement(arr));
    guard++;
  }

  return Array.from(out);
}

function slugify(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeDescription(commonName, light, water) {
  const lightText =
    light === "low"
      ? "low light"
      : light === "medium"
        ? "medium light"
        : "bright indirect light";
  const waterText =
    water === "low"
      ? "infrequent watering"
      : water === "medium"
        ? "moderate watering"
        : "more frequent watering";

  const patterns = [
    () =>
      `${commonName} is a popular indoor plant that thrives in ${lightText} and prefers ${waterText}.`,
    () =>
      `A great choice for home interiors, ${commonName} does best in ${lightText} with ${waterText}.`,
    () =>
      `${commonName} is easy to style in any room. Keep it in ${lightText} and follow ${waterText} for best results.`,
  ];

  return faker.helpers.arrayElement(patterns)();
}

function derivePetSafe(commonName) {
  const safe = new Set([
    "Spider Plant",
    "Areca Palm",
    "Parlor Palm",
    "Boston Fern",
    "Calathea",
    "Prayer Plant",
  ]);
  const unsafe = new Set([
    "Peace Lily",
    "Pothos",
    "Monstera",
    "Snake Plant",
    "ZZ Plant",
    "Rubber Plant",
    "Croton",
    "Yucca",
    "Fiddle Leaf Fig",
  ]);
  if (safe.has(commonName)) return true;
  if (unsafe.has(commonName)) return false;
  return faker.datatype.boolean();
}

function makeTemplate(libraryItem, idx, usedSlugs) {
  const light = faker.helpers.arrayElement(LIGHT_LEVELS);
  const water = faker.helpers.arrayElement(WATER_LEVELS);

  let slug = slugify(libraryItem.commonName);
  if (usedSlugs.has(slug)) slug = `${slug}-${idx + 1}`;
  usedSlugs.add(slug);

  const tags = pickSomeUnique(TAGS, 2, 4);
  if (light === "low" && !tags.includes("low-light")) tags.push("low-light");
  if (!tags.includes("indoor")) tags.push("indoor");

  return {
    templateId: `tpl_${slug}`,
    slug,
    commonName: libraryItem.commonName,
    species: libraryItem.species,
    description: makeDescription(libraryItem.commonName, light, water),
    tags,
    light,
    water,
    petSafe: derivePetSafe(libraryItem.commonName),
    imageUrl: null,
  };
}

async function seedPlants(count = 25) {
  const usedSlugs = new Set();
  const n = Math.max(20, Number(count) || 25);

  const templates = [];
  let batch = db.batch();
  let ops = 0;

  for (let i = 0; i < n; i++) {
    const item = PLANT_LIBRARY[i % PLANT_LIBRARY.length];
    const doc = makeTemplate(item, i, usedSlugs);

    const ref = db.collection("plantCatalog").doc(doc.templateId);
    batch.set(ref, { id: doc.templateId, ...doc });

    templates.push(doc);
    ops++;

    if (ops === 450) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }

  if (ops > 0) await batch.commit();

  logger.info(`✅ Plant templates seeded (${templates.length})`);
  return templates.length;
}

module.exports = seedPlants;
