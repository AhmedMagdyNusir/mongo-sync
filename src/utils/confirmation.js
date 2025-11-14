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
  const uriMatch = config.uri.match(/mongodb(?:\+srv)?:\/\/([^/]+)/);

  if (uriMatch) {
    const fullHost = uriMatch[1];
    // Check if credentials are present (format: username:password@host)
    const hostWithoutCredentials = fullHost.includes("@")
      ? fullHost.split("@")[1]
      : fullHost;
    host = hostWithoutCredentials;
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
