const fs = require("fs-extra");
const path = require("path");
const { connectToDatabase } = require("../utils/database");
const { logSuccess, logError, logWarning } = require("../utils/logger");
const { confirmDatabaseOperation } = require("../utils/confirmation");
const paths = require("../config/paths");

async function importCollections() {
  let client;

  try {
    // Show database info and confirm with user
    const confirmed = await confirmDatabaseOperation("importing");
    if (!confirmed) return;

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

      if (!Array.isArray(data)) {
        console.log(`→ Skipping ${collectionName} (invalid data format)\n`);
        continue;
      }

      // Get or create the collection
      const collection = db.collection(collectionName);

      if (data.length === 0) {
        // Create empty collection by ensuring it exists
        await db.createCollection(collectionName).catch(() => {}); // Collection might already exist, which is fine
        console.log(`→ Created empty collection\n`);
      } else {
        // Insert documents into MongoDB collection
        const result = await collection.insertMany(data, { ordered: false });
        console.log(`→ Imported ${result.insertedCount} documents\n`);
      }
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
