const { connectToDatabase, getAllCollections } = require("../utils/database");
const { logSuccess, logError, logWarning } = require("../utils/logger");
const { askQuestion } = require("../utils/input");
const { confirmDatabaseOperation } = require("../utils/confirmation");
const config = require("../config/database");

async function deleteAllDocuments() {
  let client;

  try {
    // Show database info and confirm with user
    const confirmed = await confirmDatabaseOperation("deleting from");
    if (!confirmed) return;

    const connection = await connectToDatabase();
    client = connection.client;
    const db = connection.db;

    logWarning("WARNING: This will DELETE ALL DOCUMENTS from ALL COLLECTIONS!");
    console.log();

    // Get all collection names
    const collections = await getAllCollections(db);
    console.log(`Found ${collections.length} collections:`);
    collections.forEach(({ name }) => console.log(` - ${name}`));
    console.log();

    // First confirmation
    const confirm1 = await askQuestion(
      "Are you absolutely sure you want to DELETE ALL DOCUMENTS? Type 'YES' to continue: "
    );

    if (confirm1 !== "YES") {
      logError("Operation cancelled.");
      return;
    }

    // Second confirmation with database name
    const confirm2 = await askQuestion(
      `Type the database name '${config.dbName}' to confirm deletion: `
    );

    if (confirm2 !== config.dbName) {
      logError("Database name mismatch. Operation cancelled.");
      return;
    }

    // Third confirmation with random code
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const confirm3 = await askQuestion(
      `Final confirmation. Type '${randomCode}' to proceed with deletion: `
    );

    if (confirm3 !== randomCode) {
      logError("Confirmation code mismatch. Operation cancelled.");
      return;
    }

    console.log("\n🗑️  Starting deletion process...\n");

    let totalDeleted = 0;
    for (const { name } of collections) {
      console.log(`Deleting all documents from collection: ${name}`);
      const result = await db.collection(name).deleteMany({});
      console.log(`→ Deleted ${result.deletedCount} documents\n`);
      totalDeleted += result.deletedCount;
    }

    logSuccess(`Deletion complete! Total documents deleted: ${totalDeleted}`);
  } catch (err) {
    logError("Error deleting documents:", err);
  } finally {
    if (client) await client.close();
  }
}

module.exports = deleteAllDocuments;
