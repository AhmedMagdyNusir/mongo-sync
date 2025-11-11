require("dotenv").config();
const { MongoClient } = require("mongodb");
const fs = require("fs-extra");
const path = require("path");

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const exportDir = path.join(__dirname, "mongo_exports");

(async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    // Ensure export directory exists
    await fs.ensureDir(exportDir);

    // Get all collection names
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections.`);

    for (const { name } of collections) {
      console.log(`Exporting collection: ${name}`);
      const data = await db.collection(name).find().toArray();
      console.log(`→ ${data.length} documents found\n`);

      const filePath = path.join(exportDir, `${name}.json`);
      await fs.writeJson(filePath, data, { spaces: 2 });
    }

    console.log(`✅ Export complete! Files saved in: ${exportDir}`);
  } catch (err) {
    console.error("❌ Error exporting collections:", err);
  } finally {
    await client.close();
  }
})();
