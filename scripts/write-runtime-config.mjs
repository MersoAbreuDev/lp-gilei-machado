import { writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const outFile = join(distDir, "runtime-config.js");

if (!existsSync(distDir)) {
  console.error("dist/ não encontrado — rode npm run build antes.");
  process.exit(1);
}

const runtime = {
  VITE_API_URL: (process.env.VITE_API_URL ?? "https://hml.multsysapi.oscarpro.com.br").trim(),
  VITE_SALON_SLUG: (process.env.VITE_SALON_SLUG ?? "gilei").trim(),
  VITE_ENROLLMENT_API_KEY: (process.env.VITE_ENROLLMENT_API_KEY ?? "").trim(),
  VITE_WHATSAPP: (process.env.VITE_WHATSAPP ?? "").trim(),
  VITE_INSTAGRAM_URL: (process.env.VITE_INSTAGRAM_URL ?? "").trim(),
};

writeFileSync(
  outFile,
  `window.__GM_RUNTIME__ = ${JSON.stringify(runtime)};\n`,
  "utf8",
);

console.log(`runtime-config.js gerado em ${outFile}`);
