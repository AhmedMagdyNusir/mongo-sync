const readline = require("readline");

/**
 * Ask a question and get user input
 * @param {string} query - The question to ask
 * @returns {Promise<string>}
 */
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

module.exports = { askQuestion };
