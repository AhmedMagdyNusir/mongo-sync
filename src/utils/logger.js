function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message, error = null) {
  console.error(`❌ ${message}`);
  if (error) console.error(error);
}

function logWarning(message) {
  console.log(`⚠️ ${message}`);
}

module.exports = { logSuccess, logError, logWarning };
