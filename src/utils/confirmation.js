const { askQuestion } = require("./input");
const config = require("../config/database");

/**
 * Display database connection info and ask for user confirmation
 * @param {string} operation - The operation being performed (e.g., 'exporting', 'importing')
 * @returns {Promise<boolean>} - Returns true if user confirms, false otherwise
 */
async function confirmDatabaseOperation(operation) {
  // Extract host from URI (excluding credentials for cloud connections)
  let host = "Unknown";

  // Match MongoDB URI and extract host without credentials
  // Pattern: mongodb[+srv]://[username:password@]host[/database][?options]
  const uriMatch = config.uri.match(/mongodb(?:\+srv)?:\/\/(.+)/);

  if (uriMatch) {
    const afterProtocol = uriMatch[1];
    // Find the last @ symbol (separates credentials from host)
    const lastAtIndex = afterProtocol.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      // Has credentials, extract host after the last @
      const hostPart = afterProtocol.substring(lastAtIndex + 1);
      // Remove database name and query params (everything after / or ?)
      host = hostPart.split(/[/?]/)[0];
    } else {
      // No credentials, extract host directly
      host = afterProtocol.split(/[/?]/)[0];
    }
  }

  // Display connection information
  console.log("\n" + "=".repeat(50));
  console.log(`ℹ️  Database Host: ${host}`);
  console.log(`ℹ️  Database Name: ${config.dbName}`);
  console.log("=".repeat(50) + "\n");

  // Ask for user confirmation
  const answer = await askQuestion(
    `Do you want to proceed with ${operation} collections? `
  );

  if (answer.toLowerCase() !== "yes" && answer.toLowerCase() !== "y") {
    console.log(
      `${
        operation.charAt(0).toUpperCase() + operation.slice(1)
      } cancelled by user.`
    );
    return false;
  }

  return true;
}

module.exports = { confirmDatabaseOperation };
