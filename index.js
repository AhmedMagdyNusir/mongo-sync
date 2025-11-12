require("dotenv").config();
const { MongoClient } = require("mongodb");
const fs = require("fs-extra");
const path = require("path");

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const dataDir = path.join(__dirname, "data");

// Get command from command line arguments
const command = process.argv[2];

async function exportCollections() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    // Ensure data directory exists
    await fs.ensureDir(dataDir);

    // Get all collection names
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections.`);

    for (const { name } of collections) {
      console.log(`Exporting collection: ${name}`);
      const data = await db.collection(name).find().toArray();
      console.log(`→ ${data.length} documents found\n`);

      const filePath = path.join(dataDir, `${name}.json`);
      await fs.writeJson(filePath, data, { spaces: 2 });
    }

    console.log(`✅ Export complete! Files saved in: ${dataDir}`);
  } catch (err) {
    console.error("❌ Error exporting collections:", err);
  } finally {
    await client.close();
  }
}

async function importCollections() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    // Check if data directory exists
    if (!(await fs.pathExists(dataDir))) {
      console.error(`❌ Data directory not found: ${dataDir}`);
      return;
    }

    // Get all JSON files from the data directory
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    if (jsonFiles.length === 0) {
      console.log("⚠️  No JSON files found in the data directory.");
      return;
    }

    console.log(`Found ${jsonFiles.length} JSON files to import.\n`);

    for (const file of jsonFiles) {
      const collectionName = path.basename(file, ".json");
      const filePath = path.join(dataDir, file);

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

    console.log(`✅ Import complete!`);
  } catch (err) {
    if (err.code === 11000) {
      console.error(
        "❌ Duplicate key error: Some documents may already exist in the database."
      );
    } else {
      console.error("❌ Error importing collections:", err);
    }
  } finally {
    await client.close();
  }
}

// Main execution
(async () => {
  if (command === "import") {
    await importCollections();
  } else if (command === "export") {
    await exportCollections();
  } else {
    console.log("Usage:");
    console.log("  npm run export  - Export all collections to JSON files");
    console.log("  npm run import  - Import JSON files to MongoDB");
    console.log("\nOr use:");
    console.log("  node index.js export");
    console.log("  node index.js import");
  }
})();
