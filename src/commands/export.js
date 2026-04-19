const fs = require("fs-extra");
const path = require("path");
const { connectToDatabase, getAllCollections } = require("../utils/database");
const { logSuccess, logError } = require("../utils/logger");
const { confirmDatabaseOperation } = require("../utils/confirmation");
const { toExtendedJSON } = require("../utils/serialization");
const paths = require("../config/paths");
const config = require("../config/database");

async function exportCollections() {
  let client;

  try {
    // Check if --plain flag is passed
    const usePlainFormat = process.argv.includes("--plain");
    const formatType = usePlainFormat
      ? "plain JSON"
      : "Extended JSON (MongoDB format)";

    console.log(`Export format: ${formatType}`);

    // Show database info and confirm with user
    const confirmed = await confirmDatabaseOperation("exporting");
    if (!confirmed) return;

    const connection = await connectToDatabase();
    client = connection.client;

    const exportDir = paths.getExportDir(config.dbName);
    await fs.ensureDir(exportDir);

    const db = connection.db;

    // Get all collection names
    const collections = await getAllCollections(db);
    console.log(`Found ${collections.length} collections.`);

    for (const { name } of collections) {
      console.log(`Exporting collection: ${name}`);
      const data = await db.collection(name).find().toArray();
      console.log(`→ ${data.length} documents found\n`);

      // Convert to Extended JSON format unless --plain flag is used
      const exportData = usePlainFormat
        ? data
        : data.map((doc) => toExtendedJSON(doc));

      const filePath = path.join(exportDir, `${name}.json`);
      await fs.writeJson(filePath, exportData, { spaces: 2 });
    }

    logSuccess(`Export complete! Files saved in: ${exportDir}`);
  } catch (err) {
    logError("Error exporting collections:", err);
  } finally {
    if (client) await client.close();
  }
}

module.exports = exportCollections;
