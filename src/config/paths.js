const path = require("path");

function formatExportTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`,
  ].join("_");
}

const root = path.join(__dirname, "..", "..");

const paths = {
  root,
  exportsDir: path.join(root, "exports"),
  importsDir: path.join(root, "imports"),
  getExportDir(dbName) {
    const name = dbName != null ? String(dbName) : "database";
    return path.join(paths.exportsDir, `${name}_${formatExportTimestamp()}`);
  },
};

module.exports = paths;
