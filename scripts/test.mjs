import { spawnSync } from "node:child_process";

const args = process.argv.slice(2).filter((argument) => argument !== "--runInBand");
const result = spawnSync("vitest", ["run", "--passWithNoTests", ...args], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
