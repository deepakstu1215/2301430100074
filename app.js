const Log = require("./logger");

async function main() {
  console.log("App Started");

  const result = await Log(
    "backend",
    "info",
    "service",
    "Application started"
  );

  console.log("Final Result:", result);
}

main();