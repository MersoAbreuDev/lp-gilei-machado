import { spawn } from "child_process";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const writeConfig = join(root, "scripts/write-runtime-config.mjs");

await import(pathToFileURL(writeConfig).href);

const port = process.env.PORT || "3000";
console.log(`Servindo dist/ na porta ${port}`);

const child = spawn("npx", ["serve", "dist", "-s", "-l", port], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
