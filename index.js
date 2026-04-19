const exportCollections = require("./src/commands/export");
const importCollections = require("./src/commands/import");
const deleteAllDocuments = require("./src/commands/delete");

// Get command from command line arguments
const command = process.argv[2];

// Display usage information
function showUsage() {
  console.log("Usage:");
  console.log(
    "  npm run export       - Export all collections to JSON files (Extended JSON format)"
  );
  console.log(
    "  npm run export:plain - Export all collections to JSON files (plain JSON format)"
  );
  console.log(
    "  npm run import       - Import collections from JSON files in the imports directory"
  );
  console.log(
    "  npm run delete       - Delete all documents from all collections (DANGEROUS!)"
  );
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
