import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const [major, minor] = process.versions.node.split(".").map(Number);
const nodeIsSupported = major === 24 && minor >= 14;

console.log(`Node.js ${process.versions.node}`);
if (!nodeIsSupported) {
  console.error("SciLoop requires Node.js 24.14 or newer within the Node 24 line. Use .nvmrc or install Node 24 LTS.");
  process.exit(1);
}

if (!existsSync("node_modules")) {
  console.log("node_modules is missing; installing locked dependencies with npm ci...");
  execFileSync(process.platform === "win32" ? "npm.cmd" : "npm", ["ci"], { stdio: "inherit" });
}

const requiredFiles = ["package-lock.json", ".env.example", "server/.env.example"];
const missingFiles = requiredFiles.filter((file) => !existsSync(file));
if (missingFiles.length > 0) {
  console.error(`Missing required setup files: ${missingFiles.join(", ")}`);
  process.exit(1);
}

console.log("SciLoop setup checks passed.");
console.log("Create .env.local and server/.env from the example files, then run:");
console.log("  npm run typecheck");
console.log("  npm run lint");
console.log("  npm run validate:physics");
console.log("  npm run build");
