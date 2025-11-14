const fs = require("fs-extra");
const path = require("path");
const { connectToDatabase } = require("../utils/database");
const { logSuccess, logError, logWarning } = require("../utils/logger");
const paths = require("../config/paths");

async function importCollections() {
  let client;

  try {
    const connection = await connectToDatabase();
    client = connection.client;
    const db = connection.db;

    // Check if data directory exists
    if (!(await fs.pathExists(paths.dataDir))) {
      logError(`Data directory not found: ${paths.dataDir}`);
      return;
    }

    // Get all JSON files from the data directory
    const files = await fs.readdir(paths.dataDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    if (jsonFiles.length === 0) {
      logWarning("No JSON files found in the data directory.");
      return;
    }

    console.log(`Found ${jsonFiles.length} JSON files to import.\n`);

    for (const file of jsonFiles) {
      const collectionName = path.basename(file, ".json");
      const filePath = path.join(paths.dataDir, file);

      console.log(`Importing collection: ${collectionName}`);

      // Read JSON data from file
      const data = await fs.readJson(filePath);

      if (!Array.isArray(data) || data.length === 0) {
        console.log(`→ Skipping ${collectionName} (empty or invalid data)\n`);
        continue;
      }

      // Insert documents into MongoDB collection
      const collection = db.collection(collectionName);
      const result = await collection.insertMany(data, { ordered: false });
      console.log(`→ Imported ${result.insertedCount} documents\n`);
    }

    logSuccess("Import complete!");
  } catch (err) {
    if (err.code === 11000) {
      logError(
        "Duplicate key error: Some documents may already exist in the database."
      );
    } else {
      logError("Error importing collections:", err);
    }
  } finally {
    if (client) await client.close();
  }
}

module.exports = importCollections;
