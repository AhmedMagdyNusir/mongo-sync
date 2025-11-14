const exportCollections = require("./src/commands/export");
const importCollections = require("./src/commands/import");
const deleteAllDocuments = require("./src/commands/delete");

// Get command from command line arguments
const command = process.argv[2];

// Display usage information
function showUsage() {
  console.log("Usage:");
  console.log("  npm run export - Export all collections to JSON files");
  console.log("  npm run import - Import JSON files to MongoDB");
  console.log(
    "  npm run delete - Delete all documents from all collections (DANGEROUS!)"
  );
  console.log("\nOr use:");
  console.log("  node index.js export");
  console.log("  node index.js import");
  console.log("  node index.js delete");
}

// Main execution
(async () => {
  switch (command) {
    case "import":
      await importCollections();
      break;
    case "export":
      await exportCollections();
      break;
    case "delete":
      await deleteAllDocuments();
      break;
    default:
      showUsage();
      break;
  }
})();
