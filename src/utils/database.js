const { MongoClient } = require("mongodb");
const config = require("../config/database");

/**
 * Create and connect to MongoDB client
 * @returns {Promise<{client: MongoClient, db: Db}>}
 */
async function connectToDatabase() {
  const client = new MongoClient(config.uri);
  await client.connect();
  const db = client.db(config.dbName);
  return { client, db };
}

/**
 * Get all collections from the database
 * @param {Db} db - MongoDB database instance
 * @returns {Promise<Array>}
 */
async function getAllCollections(db) {
  return await db.listCollections().toArray();
}

module.exports = { connectToDatabase, getAllCollections };
