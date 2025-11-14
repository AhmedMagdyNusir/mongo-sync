const fs = require("fs-extra");
const path = require("path");
const { connectToDatabase, getAllCollections } = require("../utils/database");
const { logSuccess, logError } = require("../utils/logger");
const paths = require("../config/paths");

async function exportCollections() {
  let client;

  try {
    const connection = await connectToDatabase();
    client = connection.client;

    // Ensure data directory exists
    await fs.ensureDir(paths.dataDir);

    // Clean data directory - remove old exports
    console.log("Cleaning previous export data...\n");
    await fs.emptyDir(paths.dataDir);

    const db = connection.db;

    // Get all collection names
    const collections = await getAllCollections(db);
    console.log(`Found ${collections.length} collections.`);

    for (const { name } of collections) {
      console.log(`Exporting collection: ${name}`);
      const data = await db.collection(name).find().toArray();
      console.log(`→ ${data.length} documents found\n`);
      const filePath = path.join(paths.dataDir, `${name}.json`);
      await fs.writeJson(filePath, data, { spaces: 2 });
    }

    logSuccess(`Export complete! Files saved in: ${paths.dataDir}`);
  } catch (err) {
    logError("Error exporting collections:", err);
  } finally {
    if (client) await client.close();
  }
}

module.exports = exportCollections;
